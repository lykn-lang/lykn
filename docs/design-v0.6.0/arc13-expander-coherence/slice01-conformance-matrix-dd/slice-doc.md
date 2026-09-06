# Slice 01: conformance-matrix + DD-60

> Recon-only: extend arc05/slice02's F-4 probe into the **full name-binding
> conformance matrix** (both backends, all name classes × binding positions ×
> reference positions), and draft **DD-60** — the semantics the fixes will
> implement. **No compiler changes in this slice.** The matrix is ground
> truth; the DD is the contract; slices 02/03 implement.

## Goal

Every cell of the matrix measured (not assumed) on both backends; DD-60
drafted with per-cell target behavior, so the implementation slices have a
checkable spec and the operator has a reviewable semantics decision.

## Current state (from arc05/slice02's F-4 recon — the seed)

The probe `(func probe :args (:function NAME) :body (NAME 1))` already
showed four behavior classes (calls-param / throws / macro-fires-wrong-code
/ invalid-JS) and that the backends disagree on most rows. Known bugs this
arc owns: Rust fires macros for `cell`/`express`/`get`/`not`/`lambda`/
`template`/`new` params; JS throws on ~all macro-named params; both emit
invalid JS for reserved-word names (Rust at rc=0 — the ID-44 genus).

## Scope (in)

1. **F-1 — the matrix.** Name classes: surface-macro names (the full
   `registerSurfaceMacros` + classifier-form sets), kernel form heads,
   `kernel:`-prefixed atoms, JS reserved words, ordinary names (control).
   Binding positions: `func`/`fn`/`genfunc` params, `bind`, destructuring
   patterns, loop bindings, class fields. Reference positions: call-head,
   argument position, nested-`fn` body (capture). Both backends via
   `./bin/lykn compile` and the JS API. Automate the probe (a script that
   generates and compiles cells) — the matrix must be **re-runnable** (it
   becomes slice03's conformance-corpus seed and A-4's re-probe).
2. **F-2 — DD-60 draft.** The semantics: **lexical bindings shadow
   macro/form dispatch within their scope** (standard Lisp lexical
   scoping); **JS reserved words are invalid lykn names** (compile error,
   all binding positions — no invalid output at rc=0); **kernel-only heads
   stay closed** (DD-58 untouched — you can't bind `const` anyway). Per-cell
   target behavior; edge cases named (does shadowing extend to
   `import-macros`-imported user macros? — yes, same rule; what about
   shadowing `kernel:` atoms? — unrepresentable, document); breaking-change
   analysis (what currently-compiling code changes meaning; expected: the
   Rust wrong-code rows become correct, nothing correct breaks).
3. **F-3 — implementation reconnaissance** (informs the 02/03 sizing):
   where each expander would gain binding awareness (Rust: classifier has
   param lists; JS: the macro loop in `expandExpr` lacks scope — sketch the
   mechanism, e.g. a binding-env threaded through expansion or a
   pre-classification pass); estimate per-backend LoE; recommend merge or
   keep 02/03 split.

## Scope (out)

- **Any compiler change.** Recon only.
- The arc05 lint rule question (re-answered after the arc, per A-6).

## Verification approach

The matrix script re-runs deterministically; every cell has a transcript;
DD-60's per-cell targets cover every live cell (no "TBD" cells); `make
check` untouched (no source changes — verify by empty diff on `crates/` +
`packages/`).

## Exit criteria

Matrix complete + re-runnable; DD-60 draft covering every cell + breaking
analysis + the reserved-word validator spec; 02/03 sizing recommendation
with LoE; operator has what he needs to confirm DD-60.

## Design sub-questions (surface, don't decide silently)

1. Shadowing granularity — whole-scope or position-aware? (DD-60 proposes
   whole-lexical-scope; flag if the matrix shows a case where that's
   surprising.)
2. Should the reserved-word validator also cover **exported** names
   (`export (const if …)` via kernel:)? (Probe it; propose.)
3. Matrix probe home — `test/` fixture corpus vs a `tools/` script?
   (It must live somewhere re-runnable and CI-adjacent; propose.)
