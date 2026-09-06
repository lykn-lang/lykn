# Slice 10: js-resolution — Ledger

DD-60 D1 on JS per DD-61 §A3: env + tags inside the `expandExpr` walk;
`compiler.js` → consumer via `formHead()`; the §A6 JS static check.
Mirror of slice06 — its closing-report hook notes are spec-companion.
Per LEDGER-DISCIPLINE. Rebuild-first. 6 rows.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **Env + tags in the walk** — one env threaded through `expandExprInner`, extended **only** via `bindingsIntroduced` (skip `kind === "label"` for the value env); **region-model scoping mirrors Rust's `scope_plan`** (body-after-iterable/scrutinee; decls scope over following siblings only, not their own value; `func`/`class` names own-body + siblings; approximations aligned with Rust's); atoms tagged `def`/`ref` as own property; compiler-generated atoms never tagged | unit/integration tests incl. the region probes (`(for-of array #a(1) …)` must emit `[1]`, not `array(1)`); tag-survival test (tension #2) | serious | DD-61 §A1/§A3; slice06 hook notes | **done** | `test/expander/resolution.test.js` (11 tests, **reproduced** in `make check`): region probe → `for (const array of [1]) array(987)`; def/ref tags; tag survival; compiler-generated untagged. Immutable-`Set` env threaded through all 16 `expandExpr` sites; `bindingsIntroduced` sites carry the binder `node` for def-tagging. | Function-family **simple** params tag `ref` not `def` (lowered `=>` param list re-walked as expr) — disclosed, inert. |
| F-2 | **Dispatch gating** — a lexically bound head skips `classifySurfaceForm` AND `macroEnv` dispatch (plain call, tagged `ref`); **binding-position atoms are never dispatched** (fixes JS's throws-from-the-binding-site rows) | tests: bound `fn`/`cell`/`obj` param → plain call; bound user macro → plain call; out-of-scope use still fires | serious | DD-60 D1 (incl. `import-macros`); slice03 D2-timing note | **done** | resolution.test.js "F-2" (**reproduced**): `(fn (:any obj) (obj 987))` → `obj(987)` (was throw); `(fn (:any cell) (cell 987))` → `cell(987)` (was macro); `(fn (:any not) …)` → `not(987)`; scope-exit test. Ref gate placed before classifier/macro/dispatchTable. | `kernel:` escape unaffected; sanctioned kernel never re-read as a bound ref. |
| F-3 | **`formHead(node)` + the compiler consumer** — returns the name only for untagged atoms, `null` for `def` AND `ref` (the `as_form_head` mirror); `compiler.js` kernel-head dispatch converted; `ref` heads emit a plain readable call (`array(987)`) | diff review; the matrix cells; F-4's check | serious | DD-61 §A6 | **done** | `compiler.js` `formHead`; single dispatch door `macros[head.value]` → `macros[formHead(head)]`. **reproduced** by F-4 + the matrix. | 18 structural `.value ===` head reads marked `A6-exempt` (import/export alias, decl kind, destructure target, names, try/switch clauses, object spread/computed, pattern rest/default/alias, accessor get/set). |
| F-4 | **JS static conformance check standing in `make check`** — head-dispatch `.value ===`-style reads in `packages/lang` outside sanctioned sites fail; seeded-violation demo | the test + demo transcript | serious | DD-61 §A6 (the JS twin, specified there verbatim) | **done** | `test/expander/a6-dispatch-conformance.test.js` (**reproduced** in `make check`). Seeded demo: reinstating `macros[head.value]` at the door fails at `compiler.js:1783`; removed → green. | JS dispatch idiom is the `macros[…]` door (indexing), not `===`; the `.value ===` reads are all structural. |
| F-5 | **Matrix: JS columns → DD-60 targets; no leaks** — every legal-ident binding×reference cell on JS = `calls-binding`; reserved rows stay `rejects-cleanly`; **label column stays `macro-fires` on BOTH backends** (DD-60 ‡ — do not "fix" it); **Rust columns byte-identical** to the slice06 re-probe; corpus outputs unchanged | re-probe diff; `lykn test` corpus run | serious | arc A-4 footing; DD-60 refinement #4 | **done** | `tools/conformance-matrix.js` (**reproduced**): JS `calls-binding` 323→874, `throws` 1453→1010, `macro` 120→12; every legal-ident × non-label cell `✓bind/✓bind`; Rust `macro-fires` = 22 (slice06 label residual), Rust untouched (`git status crates/` empty); corpus green (`make check`). Divergence 601→56. | 56 residual = label accidental-shadow asymmetry (pre-existing) + `macro` row (JS-ahead of a Rust gap) + `kernel:if` (strict). None a leak; bubbled up. |
| F-6 | **Green bar** — `make check` ✓; suites green (JS test migrations listed, not silent — each is a behavior change for arc09's notes); three-way parity + walker coverage + both A6 checks green; `./bin/lykn` rebuilt for any probe | suite runs | serious | standing bar | **done** | `make check` ✓ (build + lint + fmt + Rust tests + JS suite 707 + `.lykn` corpus + docs 475). **Migration list: EMPTY** (recon-confirmed; no old throws-behavior assertions existed). `./bin/lykn build` refreshed before every probe. | Browser bundle: `packages/browser/*` imports `lang/` live (not a copy); no committed 73KB bundle to regen. |

## What Worked / Closure

**What Worked.**
- **Grounding the region model on the two critical probes before writing code.**
  `(for-of array #a(1) (array 987))` and `(fn (:any array) (array 987))` were
  traced by hand through the monolithic-lowering seam first; the implementation
  then matched the trace on the first run.
- **The single-dispatch-door finding** (`compiler.js:1751`) collapsed F-3 to one
  conversion + `formHead`, and made the JS `.value ===` reads cleanly separable
  into "the door" (converted) vs "structural" (A6-exempt).
- **`emitSurfaceForm` reuses body sub-forms** — so in-place `ref` tagging on the
  head atom rides through surface→kernel lowering, no re-tagging pass needed.
- **The artifact-refresh trap** (`lang/` → `target/lykn/build/lang/`) was caught
  by a matrix run that showed the pre-slice tally; `./bin/lykn build` before
  probes became the fix.

**Closure.** Closed at commit `c19a1fb` on 2026-07-07. Verified by: CDC
(cdc-verification.md — structure reproduced by code review; runtime
attested; ancestry reconcile at the arc-close gate). Rows: 6. Done: 6.
Deferred: 0. No-op: 0.
