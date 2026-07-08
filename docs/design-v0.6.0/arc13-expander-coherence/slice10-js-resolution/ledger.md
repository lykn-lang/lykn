# Slice 10: js-resolution — Ledger

DD-60 D1 on JS per DD-61 §A3: env + tags inside the `expandExpr` walk;
`compiler.js` → consumer via `formHead()`; the §A6 JS static check.
Mirror of slice06 — its closing-report hook notes are spec-companion.
Per LEDGER-DISCIPLINE. Rebuild-first. 6 rows.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **Env + tags in the walk** — one env threaded through `expandExprInner`, extended **only** via `bindingsIntroduced` (skip `kind === "label"` for the value env); **region-model scoping mirrors Rust's `scope_plan`** (body-after-iterable/scrutinee; decls scope over following siblings only, not their own value; `func`/`class` names own-body + siblings; approximations aligned with Rust's); atoms tagged `def`/`ref` as own property; compiler-generated atoms never tagged | unit/integration tests incl. the region probes (`(for-of array #a(1) …)` must emit `[1]`, not `array(1)`); tag-survival test (tension #2) | serious | DD-61 §A1/§A3; slice06 hook notes | open | | tags never change emitted JS for untouched code |
| F-2 | **Dispatch gating** — a lexically bound head skips `classifySurfaceForm` AND `macroEnv` dispatch (plain call, tagged `ref`); **binding-position atoms are never dispatched** (fixes JS's throws-from-the-binding-site rows) | tests: bound `fn`/`cell`/`obj` param → plain call; bound user macro → plain call; out-of-scope use still fires | serious | DD-60 D1 (incl. `import-macros`); slice03 D2-timing note | open | | `kernel:` escape unaffected (`kernel:x` is not a bindable name) |
| F-3 | **`formHead(node)` + the compiler consumer** — returns the name only for untagged atoms, `null` for `def` AND `ref` (the `as_form_head` mirror); `compiler.js` kernel-head dispatch converted; `ref` heads emit a plain readable call (`array(987)`) | diff review; the matrix cells; F-4's check | serious | DD-61 §A6 | open | | structural/non-dispatch `.value ===` reads stay raw with an exemption marker (the Rust A6-exempt lesson) |
| F-4 | **JS static conformance check standing in `make check`** — head-dispatch `.value ===`-style reads in `packages/lang` outside sanctioned sites fail; seeded-violation demo | the test + demo transcript | serious | DD-61 §A6 (the JS twin, specified there verbatim) | open | | the A-7 / slice06-F-4 pattern, third instantiation |
| F-5 | **Matrix: JS columns → DD-60 targets; no leaks** — every legal-ident binding×reference cell on JS = `calls-binding`; reserved rows stay `rejects-cleanly`; **label column stays `macro-fires` on BOTH backends** (DD-60 ‡ — do not "fix" it); **Rust columns byte-identical** to the slice06 re-probe; corpus outputs unchanged | re-probe diff; `lykn test` corpus run | serious | arc A-4 footing; DD-60 refinement #4 | open | | any Rust-column or corpus movement = leak = stop |
| F-6 | **Green bar** — `make check` ✓; suites green (JS test migrations listed, not silent — each is a behavior change for arc09's notes); three-way parity + walker coverage + both A6 checks green; `./bin/lykn` rebuilt for any probe | suite runs | serious | standing bar | open | | browser bundle regen: note if needed — surface, don't fold |

## What Worked / Closure

_(At slice close.)_
