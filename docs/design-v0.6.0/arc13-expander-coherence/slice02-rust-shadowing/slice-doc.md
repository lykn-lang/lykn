# Slice 02: rust-shadowing

> Implement **DD-60 on the Rust backend** (operator-confirmed in full,
> 2026-07-06): lexical bindings shadow macro/form dispatch (D1); JS
> reserved words are invalid lykn names at every binding position,
> including `export` and the `kernel:` name slot (D2); DD-58 untouched
> (D3). The matrix's Rust columns flip to their DD-60 targets; JS columns
> are slice03's.

## Goal

On Rust: a lexically bound legal-identifier name means the binding —
dispatch consults scope before firing any macro/form (killing the
`cell`/`express`/`get`/`not`/`lambda`/`template`/`new` wrong-code rows and
making the `fn`/`func`/`obj` rows *deliberately* correct instead of
shape-coincidentally); reserved-word names are compile errors with proper
diagnostics everywhere a name binds (killing the `const if = 0` /
`function probe(if)` invalid-output rows). Verified cell-by-cell by
re-running the matrix probe.

## Grounding (from slice01's F-3 recon + the matrix)

- Dispatch today is **purely head-name-based** (`classify_surface_form`);
  no scope exists at classification time. The recon sketch: thread a
  lexical binding environment through classification — binding
  introducers are `func`/`fn`/`genfunc`/`genfn` params, `bind`,
  destructuring patterns, loop bindings, class-method params (DD-60's
  binding-position list = the matrix's).
- The reserved-word validator follows arc05's `check_loop_binding`
  pattern (a targeted guard, not an emitter rewrite).
- **The reserved-word set is DD-60-empirical**: the compiler embeds a
  static list, but the list's authority is the probe's legality test —
  so the list ships with a **parity check** against
  `tools/conformance-matrix.js`'s legality function (the A-7
  kernel-forms-parity precedent, applied to names).
- Matrix cells are the acceptance spec: every Rust cell's DD-60 target
  column is checkable by re-running the probe.

## Scope (in)

1. **F-1** — scope-threaded dispatch (D1): bindings shadow macros/forms
   whole-scope; user macros (`import-macros`) shadowed identically.
2. **F-2** — reserved-word name validation (D2): every binding position +
   `export`ed names + the `kernel:` escape's name slot; diagnostics name
   the word and the fix.
3. **F-3** — the embedded reserved-word list parity-checked against the
   probe's empirical test (a test, in `make check`).
4. **F-4** — matrix re-probe: all Rust columns at DD-60 target; **JS
   columns byte-identical to slice01's baseline** (no JS drift from this
   slice).

## Scope (out)

- The JS backend (slice03) and the conformance corpus (slice03).
- Any DD-58 change (D3 — the closed kernel namespace stands).
- arc05 concerns (resume post-arc).

## Verification approach

Rebuild-first; `make check` ✓; suites at baseline (1368/0 · 673/0 — the
breaking analysis says nothing in-tree changes meaning; the suites are the
proof); per-cell tests for each flipped row class; the matrix re-probe
transcript (Rust at target, JS unchanged); diagnostics snapshot-reviewed.

## Exit criteria

Rust matrix columns = DD-60 targets, cell-complete; reserved-word rejection
everywhere incl. export/`kernel:`; parity test in `make check`; suites at
baseline; JS baseline undisturbed. Bubble-up: anything the scope-threading
revealed that slice03's JS work should know (mechanism notes, shared test
shapes), and any DD-60 cell the implementation found ambiguous
(surface, don't reinterpret).

## Design sub-questions (surface, don't decide silently)

1. **Where scope threads** — classifier-level environment vs a pre-pass
   annotation; CC picks with rationale (constraint: expansion of user
   macros must see the same environment).
2. **Diagnostic wording** for reserved-word rejection — proposal:
   `'if' is a JavaScript reserved word and cannot be used as a lykn name`
   + position; align with DD-58's diagnostic voice.
3. **`kernel:` name-slot validation placement** — at escape resolution or
   at emission; whichever yields the better span. Surface the choice.
