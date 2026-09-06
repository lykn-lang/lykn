# arc15 · slice04 — Closing Report (Sibling traps)

> This slice closes the silent sibling traps from the liveness re-check and
> records one corrected premise as a new follow-up.

## Verdict

Delivered. The implementation fixes:

- `D-2607-3XKP`: stripped Rust `fn` bodies now preserve the final return value.
- `D-2607-N6HS`: standard string escapes cook consistently on both readers, and
  bad escapes error instead of silently collapsing.
- `D-2607-K4WT`: final `return`/`throw`/`break`/`continue` forms are emitted
  directly, not as invalid `return <control-transfer>`.

## Execution Probe

The slice began with a temporary Deno execution probe, run against both the JS
API and Rust CLI. Pre-fix, Rust `--strip-assertions` emitted:

```js
const f = x => {
  const y = x + 1;
  y;
};
console.log(f(1));
```

and the runtime result was `undefined`. Post-fix, the same case emits
`return y;` and prints `2`.

The same probe corrected the liveness note's broad untyped-`fn` claim: JS
rejects `(fn (x) ...)` with a typed-param diagnostic, while Rust currently
mis-lowers it as `fn(...)` and fails at runtime. That is `D-2608-H7FN`, not part
of the silent stripped-return fix.

## Per-row Ledger Walk

| Row | Status | Evidence |
|-----|--------|----------|
| **S4-1** — execution probe before scope | **done** | Probe run pre/post. It reproduced stripped `undefined`, invalid wrapper forms, and escape collapse; post-fix run showed stripped return = `2`, direct control-transfer emission, and cooked escapes. |
| **S4-2** — stripped `fn` preserves return | **done** | `emit_fn_expr` wraps last expression when `has_type_checks || emitted_body.len() > 1`; JS `Fn` emission mirrors `typeChecks.length > 0 || node.bodyForms.length > 1`. Tests: Rust emitter + CLI, JS form test. |
| **S4-3** — control-transfer forms not double-wrapped | **done** | Rust/JS return wrappers now skip explicit `return`/`throw`/`break`/`continue` forms without treating them as valueless for typed-return checks. Tests cover both and DD-50 remains green. |
| **S4-4** — string escapes cook or fail | **done** | Rust lexer and JS reader support the standard escape set and reject malformed/unknown escapes. Tests cover standard escapes, unknown `\q`, malformed `\x`, malformed `\u`, empty `\u{}`, and octal-like `\01`. |
| **S4-5** — guide/register truth | **done** | `docs/guides/01-core-idioms.md` ID-32/ID-33 re-scoped; discovery rows closed; `D-2608-H7FN` opened for the Rust nested bare-parameter `fn` mismatch. |
| **S4-6** — full gate green and scoped diff | **done** | `make lint` ✓; `make test` ✓; `git diff --check` ✓; `make check` ✓ after commit so new cited paths resolve at `HEAD`. |

## Bubble-up

- The fixed arc15 class is now covered by execution tests, not just output-shape
  tests.
- The source-level liveness note was directionally right but stale in one
  subclaim: untyped `fn` is not a cross-backend silent return trap today.
- Arc07 can now describe `fn` returns and string escapes as actual 0.6.0
  behaviour instead of documenting around broken compiler output.
