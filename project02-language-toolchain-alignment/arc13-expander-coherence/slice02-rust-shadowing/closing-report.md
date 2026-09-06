# Slice 02: rust-shadowing — Closing Report (SELF-STOP)

**By:** CC (Claude Code) · **Date:** 2026-07-06 · **Branch:** `release/0.6.x`
**Verdict: self-stopped on scope explosion, per the ledger's discipline clause —
with data.** DD-60 D1 on Rust requires consistent lexical scope threaded through
**four** independent name-dispatch subsystems, not the single "classify path"
the slice01 F-3 recon sketched. This is an architecture-scale change beyond the
recon; I stopped before touching it and reverted the one exploratory edit. No
compiler changes remain (`crates/`+`packages/` diff empty); `make check`
unchanged.

## What the recon (slice01 F-3) got wrong

The F-3 mechanism sketch said: *"thread a scope parameter through the classify
path… short-circuit to a plain-call classification when `scope.contains(name)`…
LoE medium."* That was wrong about **where** name→form dispatch lives. The matrix
(F-1) was correct ground truth; the mechanism recon was not. Mapping the actual
Rust pipeline (`compile_source_inner`):

| # | Subsystem | Dispatches on names for… | Evidence |
|---|---|---|---|
| 1 | **expander** (`expander::expand`, step 2) | user macros (`import-macros`), quasiquote, `kernel:` escape | expander.js analog; DD-60 D1 requires user-macro shadowing |
| 2 | **classifier top-level** (`classify_with_options`→`classify_form`, step 3) | built-in **surface** forms for *top-level* forms; each classified independently, no cross-form scope | `classifier/forms.rs:73` `is_surface_form`→`classify_surface_form` |
| 3 | **emitter** (`emit_expr`, step 5) | built-in **surface** forms *nested* in bodies — the classifier stores func/fn/loop/class bodies **raw** and the emitter re-dispatches | `emitter/forms.rs:348` `is_surface_form`→`classify_expr` |
| 4 | **codegen** (`codegen/emit.rs`, step 6) | **kernel** forms (`array`,`new`,`await`,`yield`,`get`,…) — these are NOT surface forms; `(array 987)`→`[987]` happens here | `emit.rs:224/248/270` `emit_await`/`emit_new`/`emit_array`; `is_surface_form("array")`=false |

**Why all four are load-bearing for DD-60 D1** (which shadows *macros, surface
forms, and kernel forms* alike — the matrix targets `array`/`await` → `calls-binding`):
- func-param / loop / class-param cells for **surface** names (`cell`,`fn`) → site 3 (emitter).
- top-level `bind` / destructuring cells for surface names → site 2 (classifier).
- **any** binding position for **kernel-head** names (`array`,`new`,`await`,`yield`) → site 4 (codegen).
- user-macro shadowing (D1 hard constraint) → site 1 (expander).

## Why this is a scope explosion, not "more sites than sketched"

It is not just four edit locations — it is **four subsystems that must agree on
one lexical scope**, seeded consistently (nested code under a top-level `bind`
must see that bind in all of classifier, emitter, and codegen). A shared,
consistently-threaded scope across expander + classifier + emitter + codegen is
an architecture change — and, pointedly, *building four independent copies of
scope tracking is the exact class of divergence this arc exists to eliminate.*
Doing it ad hoc, per-site, would risk re-creating a coherence bug inside the fix.

Regression surface: 1368 lykn tests + 673 deno tests run through all four
subsystems; a scope false-positive in any one silently changes working code.

## Exploratory work done, then reverted

Added a `scope: Vec<HashSet<String>>` stack to `EmitterContext` (it threads
`ctx` everywhere and already carries `in_class_body`, so it *is* the right home
for site 3) with `push_scope`/`pop_scope`/`is_bound`/`seed_module_scope`. This
confirmed site 3 is clean to extend — but it only covers the emitter; sites 1,
2, 4 remain, and site 4 (codegen) is where I confirmed the fourth-subsystem
finding. Reverted to keep the tree green (an unused scope stack trips clippy
`-D warnings`, and a half-threaded scope is worse than none).

## Recommendation (operator/CDC re-decides the arc shape)

**Re-slice arc13's implementation.** The single-slice "Rust shadowing" scope was
predicated on the medium-LoE recon. Two viable shapes:

- **(A) Per-subsystem sub-slices, probe-gated** — 02a emitter+classifier (surface
  forms; flips func-param/loop/class-param/top-level-bind cells), 02b codegen
  (kernel-form names; flips array/new/await/yield cells), 02c expander
  (user-macro shadowing). Each re-runs `tools/conformance-matrix.js` as its
  acceptance gate. Lowest risk; each sub-slice is a reviewable diff with an
  intermediate green bar. **Recommended.**
- **(B) One shared scope pass + a unified dispatch gate** — a single lexical-scope
  representation computed once and consulted by a shared
  `is_lexically_bound(name)` at all four dispatch points (and a shared
  reserved-word check for D2). More upfront design; eliminates the four-copy
  hazard by construction, but a larger single change. Better long-term coherence,
  higher one-shot risk.

Either way, **the reserved-word validator (D2)** is the smaller, more separable
half — it is a name-legality guard at binding sites (the `check_loop_binding`
pattern), independent of the scope-threading, and could ship first as its own
sub-slice to kill the ID-44 genus (invalid JS at rc=0) while the D1 scope design
is settled.

## What is ready to hand the next slice(s)

- **The matrix probe is the acceptance oracle** — `tools/conformance-matrix.js`
  re-runs deterministically; each sub-slice's target columns are checkable.
- **Site 3 (emitter) mechanism is validated** — `EmitterContext` + a `scope`
  frame stack, `is_bound` gating `emit_expr:348` before `is_surface_form`,
  push/pop at the binding-form emitters (`emit_bind`, `emit_func_single/multi`,
  `emit_fn_expr`, `emit_genfn`, `emit_class_member`, the loop emitters). Diff was
  clean; reverted only to keep the bar green while the full shape is decided.
- **Sites 2 (classifier) and 4 (codegen)** each have a single `match head` /
  `is_surface_form` dispatch point to gate + the same binding-form set to seed.
- **Site 1 (expander)** needs scope in the user-macro loop (the
  `macroEnv`-equivalent) — verified by a targeted test, not the matrix (the
  matrix uses built-in forms only).

## Discipline notes

- **Self-stopped with data, did not grind** — per the ledger's
  self-stop-on-scope-explosion clause and "ambiguous cells surfaced, not
  reinterpreted." The DD-60 semantics are not in question; *where and how* to
  thread scope is a plan-shape decision that the recon under-scoped.
- No DD-60 reinterpretation, no partial/broken compiler state, no
  `docs/design-v0.6.0/**` beyond this report (untracked, staging convention).

Handed back for CDC / operator: re-slice decision (A vs B; and whether D2 ships
first). arc13's A-2 remains open until the re-sliced implementation lands.
