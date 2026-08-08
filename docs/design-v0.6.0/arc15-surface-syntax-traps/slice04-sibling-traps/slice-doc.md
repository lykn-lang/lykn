# arc15 · slice04 — Sibling traps

> **Open set** (2026-08-08, CDC). Close the two silent sibling traps found by
> the liveness re-check, and take the cheap same-path guard for loud
> `return <control-transfer>` invalid output. The slice starts with an execution
> probe because the liveness note explicitly marked runtime severity as
> inference.

## 1. Goal

Turn the remaining arc15 sibling traps from inferred source findings into
executed, protected behaviour:

- `fn` keeps its implicit return for multi-form bodies even when
  `--strip-assertions` removes runtime checks.
- string literals cook ordinary escape sequences instead of silently deleting
  the backslash.
- final-body control-transfer forms are not wrapped as `return return`,
  `return throw`, `return break`, or `return continue`.

## 2. Scope

### In

- Rust `emit_fn_expr`: return-wrap the last expression whenever an arrow body is
  emitted as a multi-form block, not only when runtime type checks are present.
- JS `Fn` emission: mirror the same multi-form return preservation.
- Rust/JS statement-only predicates: treat `return`, `throw`, `break`, and
  `continue` as statement-only final forms so they are emitted directly.
- Rust/JS readers: support the standard escape set
  (`\n`, `\t`, `\r`, `\b`, `\f`, `\v`, `\0`, `\\`, `\"`, `\'`, `\/`, `\xNN`,
  `\uNNNN`, `\u{...}`) and reject malformed/unknown escapes.
- Guide ID-32/ID-33 and discovery rows re-scoped to match the fixed surface.

### Out

- Rust's nested bare-parameter `fn` fallback (`(fn (x) ...)` → `fn(...)`) is
  recorded as `D-2608-H7FN`. It is loud and a broader recursive-classification
  parity issue, not the silent stripped-return trap this slice closes.
- A full classifier rewrite remains the slice03/0.7.x deferral.
- `break`/`continue` outside a loop may still be invalid JavaScript; this slice
  removes the extra invalid wrapper, not JavaScript's own control-flow rules.

## 3. Verification Approach

- Run the execution probe over JS API and Rust CLI before and after the fix.
- Add targeted JS tests for reader escapes and `fn` body/control-transfer
  emission.
- Add Rust reader/emitter unit tests and a CLI regression for
  `--strip-assertions`.
- Run the full local gate before close.

## 4. Exit Criteria

1. Stripped Rust `fn` multi-form body emits `return <last>` and runs with the
   same result as the normal build.
2. JS and Rust both emit explicit `return`/`throw` directly as final `fn` body
   forms, not as `return <form>`.
3. JS and Rust both cook `\u2026` and `\r` correctly; malformed/unknown escapes
   fail instead of silently collapsing.
4. Guide ID-32/ID-33 and discovery dispositions reflect actual current
   behaviour.
5. `make check` green; scoped diff limited to the sibling-trap implementation,
   tests, and close artifacts.
