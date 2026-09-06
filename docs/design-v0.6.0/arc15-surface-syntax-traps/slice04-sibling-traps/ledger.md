# arc15 · slice04 — Ledger (Sibling traps)

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md` §A. CDC is landing
this slice directly after the operator requested CDC implementation; verification
evidence is recorded per row and should still receive independent close review
if a later CDC pass audits the commit.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| S4-1 | **Probe before scope.** Execute the liveness shapes on JS API and Rust CLI so severity is observed, not inferred. | probe transcript | serious | liveness-recheck | **done** | temporary Deno probe; pre-fix showed Rust `--strip-assertions` → `undefined`, `return/throw/break/continue` wrappers, and escape collapse | also corrected untyped `fn` premise |
| S4-2 | **Stripped `fn` preserves return.** Multi-form `fn` returns its final value even with assertions stripped. | Rust emitter + CLI tests; post-fix probe | correctness | `D-2607-3XKP` | **done** | `emit_fn_expr` wraps multi-form final expression independent of `has_type_checks`; CLI test `compile_source_strip_assertions_preserves_fn_implicit_return`; probe output `return y` and runtime `2` | JS mirrors multi-form `:any` body |
| S4-3 | **Control-transfer forms are not double-wrapped.** Final `return`, `throw`, `break`, `continue` emit directly on both backends. | Rust emitter test; JS form test; post-fix probe | correctness | `D-2607-K4WT` | **done** | Rust/JS return wrappers now skip explicit control-transfer forms without classifying them as valueless for typed-return checks; tests pass | `break`/`continue` legality still belongs to JS control-flow context |
| S4-4 | **String escapes cook or fail.** Standard escapes decode on both readers; malformed/unknown escapes are errors. | Rust reader tests; JS reader tests; post-fix probe | correctness | `D-2607-N6HS` | **done** | Rust `read_fixed_hex_escape`/`read_braced_unicode_escape`; JS `readStringEscape`; tests cover success + malformed cases; probe `\u2026` → `…`, `\r` preserved | no silent backslash drop |
| S4-5 | **Guide/register truth.** ID-32/ID-33 and discovery rows no longer teach the fixed bug; residual untyped Rust mismatch has a durable home. | read docs | serious | arc15 close discipline | **done** | guide ID-32/ID-33 re-scoped; `D-2607-3XKP`, `D-2607-N6HS`, `D-2607-K4WT` closed; `D-2608-H7FN` opened | avoids pretending the probe correction vanished |
| S4-6 | **Full gate green and scoped diff.** Build, lint, tests, doctests, cited-path gate, and diff hygiene pass. | `make check`; `git diff --check`; status review | serious | close discipline | **done** | `make lint` ✓; `make test` ✓; `git diff --check` ✓; `make check` ✓ post-commit so new cited paths resolve at `HEAD` | `make test` needed escalation only because npm attempted to write logs outside the sandbox |

## Closure

Closed. Rows: 6. Done: 6. Pending: 0.
