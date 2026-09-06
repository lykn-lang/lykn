# Slice 03: dd37-step4-kernel-removal (+ boundary closeout)

> Finish arc10's kernel/surface boundary machinery: remove the transitional
> **`_kernel` marker** (DD-37 step 4) by replacing it with a principled
> sanctioned-kernel signal; use that same signal to **enforce DD-58 at the
> macro boundary on the JS side** (A-6, operator-decided Rust semantics,
> 2026-07-05); and land the two regression guards (A-7 parity test, A-8
> `kernel:` corpus rows). This is arc10's **last slice** — its close tees up
> the arc closing-report + host composition run.

## Goal

1. **`_kernel` removed** from `packages/lang/` — zero reads or writes remain —
   with behavior identical (corpus, suites, doctests all green; no normalizer
   extension).
2. **A-6 enforced, Rust semantics**: a user macro that expands to a
   **top-level bare kernel-only decl** (`const`/`let`/`var`/`function`/
   `function*`) is a compile error on the JS side too (it already errors on
   Rust — to be empirically confirmed first). Macro authors write
   `(kernel:<form> …)` in templates — the sanctioned path, working on both
   compilers since slice02.
3. **A-7**: an automated parity guard — a test that parses both kernel-form
   sources (Rust `dispatch.rs`, JS `kernel-forms.js`) and fails on any set
   mismatch (both `KERNEL_FORMS` and the 5-head kernel-only set).
4. **A-8**: `(kernel:…)` rows in the compileBoth corpus, so escape
   convergence is regression-protected cross-compiler.

## Why these four together (operator-confirmed 2026-07-05)

A-6's JS enforcement needs to distinguish *sanctioned* kernel output
(classifier-emitted, `kernel:`-escaped, surface-macro-emitted) from
*unsanctioned* (user-macro-emitted bare kernel-only decls at top level) —
which is **exactly the distinction the `_kernel` replacement signal must
encode**. Doing them separately means slice04 rearchitecting slice03's fresh
work. A-7/A-8 are small independent drive-bys riding the same close. If the
`_kernel` rework explodes in scope, **self-stop and re-slice** — the
five-iteration cap and the sizing discipline cover mis-sizing.

## Current state — the `_kernel` map (grounded 2026-07-05)

**Setters** (all in `packages/lang/`):

| Site | What it marks | Why |
|------|---------------|-----|
| `expander.js:762,764` | classifier-emitted kernel (surface-form output) | skip re-classification + macro-expansion of emitted kernel |
| `expander.js:750` | `kernel:`-escape stripped forms (slice02) | same — don't re-expand the escape's output |
| `classifier.js:297` | `Obj` literal pairs | a pair like `(test …)` inside an object literal must not be treated as a macro call |
| `surface-helpers.js:52–56` | `kernelArray(...)` helper | **appears dead** — defined + exported, no call sites found (assess; remove if confirmed) |

**Readers** (guards in `expander.js` `expandExpr`):
`:737` (skip `kernel:` re-entry), `:757` (skip classifier), `:770/:775` (skip
macro expansion).

**The A-6 gap, mechanically:** user-macro output
(`macroEnv.get(name)(...args)`, `expander.js:~770–790`) is **unmarked** and
re-enters `expandExpr` — so a bare `(const x 1)` it emits hits the dispatch
table (`expand-binding`) and compiles. Rust classifies **post**-expansion
(`compile.rs`: read → expand → classify-strict), so the same macro errors
there. Decision (operator, 2026-07-05): **Rust semantics** — Rust unchanged;
JS enforces on macro output.

**⚠ Recon caveat (F-1 gates everything):** the A-6 Rust-side behavior is
CDC-**code-read**, not runtime-verified. Confirm it empirically before
implementing. Also verify whether any *surface* macros still registered in
`macroEnv` (via `registerSurfaceMacros`, `surface.js`) emit top-level
kernel-only decls — if they do, naive post-expansion enforcement would
false-positive on legitimate surface code, and the sanctioned-signal design
must cover their output. Surface, don't decide silently.

## Scope (in)

1. **F-1 recon**: empirically confirm the A-6 divergence on both compilers;
   map surface-macroEnv output shapes; write the trace. **Self-stop if
   disconfirmed** — the contract adapts before code does.
2. **F-2/F-3 `_kernel` removal**: design the replacement signal (wrapper
   node, WeakSet registry, split walk — CC's call, documented), covering all
   four setter roles above; behavior identical.
3. **F-4 A-6 enforcement (JS)**: unsanctioned macro-emitted top-level bare
   kernel-only decls → the same kernel-only diagnostic (Rust-verbatim);
   `(kernel:…)` in macro templates compiles; nested stays legal
   (top-level-only, matching Rust); record the decision in DD-58
   (`docs/design/05-active/0059-…` → refinement entry; Duncan reconciles odm).
4. **F-5 A-7 parity guard**; **F-6 A-8 corpus rows**.

## Scope (out)

- Rust compiler/classifier changes (Rust is the reference; unchanged under
  the decided semantics). A discovered Rust anomaly is surfaced, not fixed.
- The arc10 closing-report + composition run — CDC/host work after this
  slice closes.
- Downstream (mycelium); arc05 lint items; arc07/arc09 routed items.

## Verification approach

Rebuild-first; full green bar (`make check`, `make test-docs`, `lykn test`,
`deno test`, clippy). Behavior-identity is the headline invariant for the
`_kernel` removal: same corpus/suite/doctest numbers (or better, with F-6's
new rows), **no compileBoth normalizer extension** (the forbidden-extension
policy — a new divergence is a bug to fix, not to hide). New tests for A-6
(both directions: bare-decl macro errors; `kernel:` macro compiles) and A-7.

## Exit criteria

`grep -rn "_kernel" packages/` → 0 hits; suites/corpus/doctests green with
behavior identical; macro-emitted bare kernel-only decls error on **both**
compilers (empirically demonstrated); DD-58 carries the refinement entry;
the parity guard fails on a seeded mismatch (demonstrated) and passes on
the real sets; `kernel:` corpus rows green. Bubble-up states whether arc10
is ready for its closing-report + host composition run (A-3/A-4, A-6–A-8).

## Design sub-questions (surface, don't decide silently)

1. **Replacement-signal mechanism** — wrapper vs WeakSet vs split-walk: CC
   proposes with rationale in the closing report; constraint: it must encode
   sanctioned-kernel for classifier output, `kernel:` output, Obj pairs, and
   (per A-6) surface-macro output, while leaving user-macro output checkable.
2. **Where A-6 enforcement runs** — inside the macro-expansion loop (check
   the expanded result of a *top-level* invocation) vs a post-pass2 sweep of
   unsanctioned kernel-only heads. Constraint: top-level-only; must not
   re-reject sanctioned output.
3. **`kernelArray` disposal** — dead-code removal if reachability confirms.
4. **A-7 guard home** — deno test reading both files vs cargo test vs CI
   step; pick the one that runs in `make check` by default.
