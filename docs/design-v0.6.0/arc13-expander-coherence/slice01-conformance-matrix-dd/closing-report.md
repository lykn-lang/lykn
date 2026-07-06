# Slice 01: conformance-matrix + DD-60 — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-07-06 · **Branch:** `release/0.6.x`
**Verdict: delivered — recon only, no compiler changes.** The full name-binding
conformance matrix is automated (`tools/conformance-matrix.js`, 885 cells,
deterministic), DD-60 is drafted covering every live cell with a
matrix-verified breaking analysis, and the 02/03 sizing recommendation is in.
`make check` untouched; `crates/`+`packages/` diff empty.

---

## Per-row ledger walk (5 rows)

**F-1 — matrix complete + re-runnable — MET.** `tools/conformance-matrix.js`:
name classes (surface forms + kernel heads enumerated from the JS
`classifySurfaceForm` switch and the Rust `classifier/forms.rs` match;
`kernel:`-prefixed; JS reserved words; ordinary controls) × 5 binding positions
(func-param, `bind`, destructuring, loop, class-param) × 3 reference positions
(call-head, argument, nested-fn) × both backends = **885 cells**. Deterministic
(fixed order, no time/random; identifier-legality decided per name via a
memoized `deno check`) — **re-run matches byte-for-byte**. Classifier validated
against manual compiles (Rust and JS) and `deno check` (invalid-output prior).
Summary below; full table regenerates from the script.

**F-2 — DD-60 draft covers every live cell — MET.**
`design/dd-60-name-binding-semantics.md`: D1 lexical bindings shadow
macro/form dispatch (whole-scope); D2 reserved words are invalid names (compile
error, all positions, both backends — the ID-44 genus killed at root); D3 DD-58
untouched. Per-cell target table (zero TBD), edge cases named (user macros,
export, kernel: escape, kernel: atoms), and a breaking analysis **verified
against the matrix** (not asserted).

**F-3 — implementation recon + sizing — MET.** Mechanism sketch + LoE +
merge/split recommendation below.

**F-4 — no compiler changes — MET.** `git diff crates/ packages/` empty; the
only new files are `tools/` (the probe, F-1's home) and DD-60 in
`arc13/design/` (prompt-authorized).

**F-5 — green bar untouched — MET.** `make check` ✓ (~1m01s), unchanged.

---

## The matrix (current state, collapsed over reference position)

**885 cells · 312 (35%) where the backends disagree.** Legend: `✓bind`=calls
the binding (correct shadowing) · `✗macro`=macro fires instead · `✗throw`=
compile error · `✗inval`=invalid JS at rc=0. Each cell = rust/js.

| outcome | rust | js |
|---|---|---|
| calls-binding | 282 | 136 |
| macro-fires | 108 | 52 |
| throws | 32 | 344 |
| invalid-output | 463 | 353 |

**Reading of the data (the three findings):**

1. **Neither backend has real binding awareness.** Rust's `classify_surface_form`
   and JS's `expandExpr` both dispatch purely on the head *name*. Rust's
   apparent shadowing of `fn`/`func`/`obj` is **accidental** — the reference
   `(fn 987)` fails the `fn` form's shape check (it wants a param list) and falls
   through to a call, whereas `(cell 987)` matches `cell`'s shape so the macro
   fires (`{value: 987}`). Change the reference arity and the "shadowing"
   evaporates. Controls (`x`, `widget`, `result`) are the only `✓bind/✓bind`
   everywhere — the target.
2. **JS has essentially no shadowing.** A macro-named parameter throws from the
   *binding site itself* (JS fires the macro on the param name even when the body
   never references it), so JS is `✗throw` almost everywhere a macro name is
   bound — except argument position (name-as-value) and a few valid-arity forms
   in `bind` position.
3. **Reserved words are the ID-44 genus at scale.** `const`/`let`/`var`/
   `function`/`new`/`do`/`import`/`return`/`if`/… emit invalid JS at rc=0 on Rust
   (`✗inval`) — silent unparseable output — and a mix of invalid/throws on JS.
   Verified with `deno check` ("Expected ident"). `kernel:` escape and `export`
   don't save them.

Representative rows (full table via the script):

| name (class) | func-param | bind | destructuring | loop | class-param |
|---|---|---|---|---|---|
| `x` (control) | ✓bind/✓bind | ✓bind/✓bind | ✓bind/✓bind | ✓bind/✓bind | ✓bind/✓bind |
| `fn` (surface) | ✓bind/✗throw | ✗throw/✗throw | ✗throw/✗throw | ✓bind/✗throw | ✓bind/✗throw |
| `cell` (surface) | ✗macro/✗throw | ✗macro/✗macro | ✗macro/✗macro | ✗macro/✗macro | ✗macro/✗throw |
| `array` (kernel) | ✗macro/✗macro | ✗macro/✗macro | ✗macro/✗macro | ✗macro/✗macro | ✗macro/✗macro |
| `const` (reserved) | ✗inval/✗inval | ✗inval/✗throw | ✗inval/✗throw | ✗inval/✗inval | ✗inval/✗inval |
| `if` (reserved) | ✗inval/✗inval | ✗inval/✗inval | ✗inval/✗inval | ✗inval/✗inval | ✗inval/✗inval |

DD-60's target collapses every legal-ident row to `✓bind/✓bind` (like `x`) and
every reserved-word row to a clean compile error on both backends.

---

## F-3 — implementation recon + sizing

**Where binding awareness attaches:**

- **JS (`packages/lang/expander.js`).** `expandExpr(form)` has **no scope**.
  `expandExprInner` dispatches `classifySurfaceForm(head.value, …)` (line 776)
  and the `macroEnv` loop (line 787) purely on the head name. Fix: thread a
  lexical `scope` (a Set/stack of bound names) through `expandExpr` → before the
  classifier/macroEnv dispatch, `if (scope.has(head.value)) → treat as an
  ordinary call, skip macro dispatch`; each binding form (func/fn/genfunc/genfn
  params, `bind`, destructuring, loop, class method params) extends `scope` for
  the extent of its body before recursing. This is a threading change through
  the whole recursive expander. **LoE: medium** (mechanical threading + a
  per-binding-form scope-extension point; the binding forms are already
  identifiable).
- **Rust (`crates/lykn-lang/src/classifier/forms.rs`).** `classify_surface_form`
  dispatches on `name` with no scope either. It already **parses** every param
  list (`parse_typed_params`), so the bound names are in hand — they just aren't
  threaded into body classification. Fix: add a `scope` parameter to the classify
  path → short-circuit to a plain-call classification when `scope.contains(name)`
  → extend `scope` at each binding form before classifying its body. **LoE:
  medium** (a scope type + threading through ~10 `classify_*` functions).
- **Reserved-word validator (both):** a name-legality check at each binding
  position — the generalization of arc05/slice02's `check_loop_binding`. **LoE:
  small** on each backend; reuse the pattern.

**Merge-or-split recommendation: KEEP THE 02/03 SPLIT.** Both backends need
symmetric, non-trivial scope-threading (neither is the "smaller than feared"
case the arc-plan hedged for — Rust's shadowing is coincidental, not partial-
real). Keeping slice02 (Rust) and slice03 (JS + conformance corpus) separate
keeps each a reviewable, backend-scoped diff, and lets the corpus in slice03
verify cross-compiler convergence *after* both land. Merging would produce one
large two-backend change with no intermediate green. The reserved-word validator
rides along in each backend's slice.

---

## Design sub-questions (surfaced)

1. **Shadowing granularity** — DD-60 D1 proposes whole-lexical-scope (standard
   Lisp). The matrix shows **no** cell where position-aware shadowing would be
   preferable. Proposal: whole-scope.
2. **Exported-name + kernel:-escape coverage** — `(export (bind if 0))` and
   `(kernel:const if 0)` both emit invalid `const if` today. Proposal: the
   reserved-word validator (D2) covers both — name-validity is not a macro
   concern, and rc=0 invalid output violates Principle 3. Operator confirms.
3. **Probe home** — `tools/conformance-matrix.js` (new `tools/` dir). Re-runnable,
   CI-adjacent, outside `crates/`+`packages/` (so F-4's empty-diff holds). It is
   the seed for slice03's conformance corpus and the arc's A-4 re-probe.

---

## Bubble-up to arc13

- **The matrix is the arc's ground truth + A-4 gate.** `tools/conformance-matrix.js`
  re-runs deterministically; after slices 02/03 land, re-running it should show
  every legal-ident cell `✓bind/✓bind` and every reserved-word cell rejecting
  cleanly, with **0 backend disagreements** (down from 312). That's the A-4
  convergence check, mechanized.
- **slice03's conformance corpus derives from the script** — the live cells
  become `compileBoth` rows (or a generated fixture), so this divergence class
  can never again be silent (A-4/A-5).
- **DD-60 needs operator confirmation** before slice02 is scoped against it —
  especially the two sub-questions (export/kernel: coverage). The breaking
  analysis is verified (blast radius 0), so the semantics are safe to adopt.
- **One thing the matrix shows DD-60's clean semantics can't fully hide:** the
  `macro-fires` cells for valid-ident kernel/surface names (`array`→`[987]`,
  `await`→`await 987`) are the only cells whose *meaning changes* under DD-60
  (macro output → binding reference). DD-60 covers them (they become
  `calls-binding`), and blast radius is 0, but they are the class a release note
  should call out for arc09 — "a lexically bound name now always wins, even over
  a kernel form."
- **arc05 A-6 preview:** once bindings shadow correctly, arc05/slice02's
  deferred `reserved-param-name` lint question shrinks to (at most) a warn for
  *reserved words* used as names before the compiler-error path is hit — likely
  redundant with DD-60's D2 compile error, i.e. **droppable**. Confirm at arc05
  slice03.

## Discipline notes

- **Recon only.** No compiler cell was "fixed"; the temptation to patch the
  obvious `if`/`const` rows is exactly what DD-60-first exists to resist.
- **Classifier rigor:** the first matrix draft mis-scored func-param cells
  (`calls-binding` inflated) because the param declaration `probe(cell)`
  contains the name; corrected to a reference-position-aware check
  (`NAME(987)` callee detection) and an empirical `deno check` identifier-legality
  test. Both fixes validated before trusting the 885-cell output.
- Left `docs/design-v0.6.0/**` to CDC except this report and DD-60 (both
  prompt-authorized). This report is **untracked** for the staging pass.

Handed back for CDC `cdc-verification.md`. → **operator confirms DD-60** →
slice02 (Rust shadowing + name validation) is scoped against it.
