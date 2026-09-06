# Slice 03: dd37-step4-kernel-removal (+ boundary closeout) — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-07-05 · **Branch:** `release/0.6.x`
**Verdict: delivered.** The transitional `_kernel` marker is gone (DD-37 step 4),
replaced by a WeakSet sanctioned-kernel registry; DD-58 is now enforced **at the
macro boundary on JS** (A-6, Rust semantics); and the two regression guards land
(A-7 parity test, A-8 `kernel:` corpus rows). Behavior is identical (same suite
numbers, plus the new rows). **arc10's last slice.**

---

## F-1 — A-6 recon (confirmed empirically; gates F-4)

CDC's A-6 finding was code-read only. Runtime-confirmed on host:

```
fixture:  (macro def-const (name val) `(const ,name ,val))
          (def-const x 1)

(a) Rust  lykn compile → error: 'const' is a kernel-only form … (exit 1)   ✓
(b) JS    lykn(source)  → "const x = 1;"  (compiles today)                  ✓
```

The divergence is real → **no self-stop**; proceed to F-4.

**Surface-macroEnv output map (false-positive check):** the only macros in
`macroEnv` besides user macros are the 5 `js:*` interop macros
(`registerSurfaceMacros`, `surface.js`). What they emit at top level:

| macro | emits | kernel-only? |
|-------|-------|--------------|
| `js:call` | `(<obj>:call …)` | no (method call) |
| `js:bind` | `(<obj>:bind …)` | no |
| `js:eval` | `(eval …)` | no |
| `js:eq` | `(== …)` | no (passthrough) |
| `js:typeof` | `(typeof …)` | no (passthrough) |

**None emit a bare kernel-only declaration.** So post-expansion enforcement has
no false-positive risk from surface macros; the sanctioned signal need not carve
out any surface-macro output beyond what the classifier already marks.

---

## F-2 — `_kernel` removed (replacement-signal design)

**Mechanism chosen: a module-level `WeakSet` sanctioned-kernel registry**
(`packages/lang/kernel-mark.js` — `markKernel(node)` / `isKernel(node)`),
shared across modules via ESM single-instance semantics. Rationale over the
alternatives:

- **vs. a mutated marker property** (the status quo `_kernel`): no node-shape
  mutation, GC-friendly, and it cleanly separates "is this sanctioned kernel"
  from the node's data.
- **vs. a wrapper node**: no unwrap logic threaded through every walker/emitter
  — a far larger, riskier diff for the same signal.
- **vs. split-walk**: the marker is consulted at four scattered producer sites
  and four reader guards; a registry keeps the change local to those eight
  points plus one helper.

All four setter roles migrated:

| Was (`_kernel = true`) | Now |
|------------------------|-----|
| classifier output (`expander.js`) | `markKernel(...)` on the emitted kernel |
| `(kernel:…)` escape (`expander.js`) | `markKernel(stripped)` |
| `Obj` pairs (`classifier.js`) | `markKernel(array(...))` |
| `kernelArray` (`surface-helpers.js`) | `markKernel(array(...))` — **kept** (see below) |

Reader guards (`expander.js` `expandExpr`) switched `!form._kernel` →
`!isKernel(form)`.

**`kernelArray` is NOT dead** — correcting the slice-doc's "appears dead" recon
(a grep-exclusion artifact: `surface-helpers.js:5[0-9]` also matched the real
call site `:512`). It is called by `compileLetPattern` (`if-let`/`when-let`).
Kept, re-homed onto `markKernel`.

**Mark propagation (the subtle part).** The sweep now runs post-expansion, so
the sanctioned mark must survive `expandExpr`'s node rebuilding (e.g.
`expand-binding` returns a fresh list). `expandExpr` was split into a marking
wrapper + `expandExprInner`: if the input was sanctioned, the output is re-marked.
This is what lets the post-pass2 sweep tell `bind`→`const` (marked) from a
user-macro's `(const …)` (unmarked).

`grep -rn "_kernel" packages/` now returns **only** Rust-symbol references in
comments (`is_kernel_only_form`, `closest_kernel_form`) — **zero** marker uses.

---

## F-3 — Behavior identical

`lykn test` and `deno test` return the same pass counts as pre-slice (plus F-6's
new rows and the A-6/A-7 tests); doctests unchanged. **The compileBoth normalizer
was not touched** (`git diff packages/testing/helpers.js` = empty this slice) —
the forbidden-extension policy held; no divergence was hidden.

The one intended behavior *change* is A-6 itself (below): two test fixtures whose
macros emitted a top-level kernel-only decl were migrated to the sanctioned
`(kernel:…)` template (`gensym-fn` — `let`→`kernel:let`).

---

## F-4 — A-6 enforced on JS (Rust semantics)

**Enforcement point (design call): a post-`pass2ExpandAll` top-level sweep** in
`expand()`, replacing slice02's pre-pass. It rejects a top-level form whose head
is kernel-only **and** is not `isKernel` (sanctioned). This is the JS analogue of
Rust's post-expansion `classify_form_strict`, and it unifies the two cases in one
check:

- **user-written** bare decls (slice02's job) — unmarked → rejected;
- **user-macro-emitted** bare decls (A-6) — unmarked → rejected.

Sanctioned output (classifier desugaring, the `kernel:` escape, `Obj` pairs)
carries the mark → passes. Nested kernel-only forms are not swept (top-level-only,
matching Rust). Chose the post-pass sweep over an in-macro-loop check because the
loop runs at every nesting depth and doesn't know top-level-ness; the sweep sees
exactly the top-level result set once.

TDD (`test/expander/dd58-strict.test.js`, both directions): macro→top-level bare
`const` throws the Rust-verbatim message; macro→`(kernel:const …)` compiles;
macro→nested kernel-only compiles; sanctioned surface output never re-rejected.
DD-58 doc gains the 2026-07-05 refinement entry (operator decision, semantics).

---

## F-5 — A-7 parity guard

`test/expander/kernel-forms-parity.test.js` parses the Rust source of truth
(`dispatch.rs`: `KERNEL_FORMS`, `is_kernel_only_form`) and the JS mirror
(`kernel-forms.js`: `KERNEL_FORMS`, `KERNEL_ONLY_FORMS`) and fails on any set
difference, reporting the symmetric diff. **Home: `deno test` (test-js), so it
runs in `make check` by default.** Demonstrated: on the real sets it passes; with
a seeded `bogusform` added to the JS kernel-only set it fails with
`onlyJs: ["bogusform"]` (restored after). This kills the slice02 duplication-drift
risk.

## F-6 — A-8 `kernel:` corpus rows

`test/forms/kernel-escape_test.lykn` — five `compileBoth` rows, one per
kernel-only head (`kernel:const`/`let`/`var`/`function`/`function*`), each
asserting the emitted JS. `compileBoth` throws on cross-compiler divergence, so
green = convergent. Makes the slice02 F-7 manual transcript permanent.

---

## Verification (rebuild-first)

**Observed (2026-07-05, rebuild-first):**
- `make check` → **`✓ All checks passed (build + lint + test)`** (exit 0) — F-7.
- `lykn test` → **`1365 | 0`** (1354 + the 5 A-8 `kernel:` rows + the migrated
  suites); `deno test --config project.json -A test/` → **`673 | 0`** (667 + 4
  A-6 tests + 2 A-7 parity tests).
- `make test-docs` → 0 failed. `cargo clippy --all-features --workspace -- -D
  warnings` → 0 issues. `deno lint packages/` clean.
- `grep -rn "_kernel" packages/` → only `is_kernel_only_form` /
  `closest_kernel_form` Rust-symbol references in comments; **zero marker uses**.
- A-7 seeded-mismatch: adding `bogusform` to the JS kernel-only set fails the
  guard (`onlyJs: ["bogusform"]`); removed → passes.
- A-6 both compilers: macro→top-level bare `const` errors on JS API *and* Rust
  CLI; macro→`(kernel:const …)` compiles on both; macro→nested bare `const`
  compiles on both.

---

## Design-call rationales (surfaced)

1. **Replacement signal** — WeakSet registry (`kernel-mark.js`). Rationale above
   (F-2): least-diff, non-mutating, module-shared.
2. **A-6 enforcement point** — post-`pass2ExpandAll` top-level sweep, not an
   in-macro-loop check. Rationale above (F-4): top-level-ness is only knowable at
   the result-set level; one sweep, no per-depth re-checking.
3. **`kernelArray` disposal** — **kept** (not dead; used by `compileLetPattern`);
   the slice-doc's "appears dead" was a grep artifact, corrected here.
4. **A-7 guard home** — `deno test` reading `dispatch.rs` as text, so it runs in
   the default `make check` path (test-js) with no extra CI wiring.

---

## Bubble-up to arc10 — is arc10 ready to close?

**Yes.** Reconciling the arc-plan's items:

- **A-5 (DD-37 step 4, `_kernel` removal)** — **done** (F-2; grep clean, behavior
  identical).
- **A-6 (macro-boundary enforcement)** — **done**, Rust semantics, both
  compilers, DD-58 refinement recorded (F-1/F-4).
- **A-7 (parity guard)** — **done**, in `make check` (F-5).
- **A-8 (`kernel:` corpus rows)** — **done**, convergent (F-6).
- **A-3 (kernel-only heads error / `kernel:` resolves, both compilers)** — met at
  slice02; slice03 makes the escape convergence a standing corpus guard (A-8) and
  extends enforcement to the macro boundary.
- **A-4 (host composition run)** — CDC/host work *after* this slice: the arc
  closing-report should reproduce A-3/A-4 at arc scale with these numbers.

**Nothing the expander rework revealed blocks the close.** Two notes for the arc
close / follow-ups:
- **Breaking-change (arc09 release notes):** macro authors emitting bare
  kernel-only decls at top level now error on JS too — fix is `(kernel:…)` in the
  template.
- **`_kernel` fully retired**, so any future doc/DD referencing the marker should
  point at `kernel-mark.js` (the sanctioned-kernel registry) instead.
- The JS/Rust kernel-form **duplication** (slice02) is now guarded (A-7) rather
  than eliminated; a shared/generated source of truth remains a candidate
  follow-up, now regression-safe.

**arc10 is ready for its closing-report + host composition run.**

---

## Discipline notes

- F-1 ran before F-4; recon confirmed, no self-stop needed.
- Expander-core scope stayed bounded (no re-slice): the rework touched the four
  producer sites, four reader guards, one `expandExpr` wrapper, and the enforce
  sweep — plus two fixture migrations and the two guards.
- **No Rust changes this slice** — Rust is the reference. (The `dispatch.rs`
  divergence-risk cross-reference comment was already added in slice02.) The
  only non-JS edit is the DD-58 doc refinement entry (F-4).
- `docs/design-v0.6.0/**` left to CDC except this closing report; DD-58 doc
  refinement entry added per F-4 (odm-managed; Duncan reconciles versioning).

Handed back for CDC `cdc-verification.md`.
