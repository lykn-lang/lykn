# Slice 04: no-else-if-expression-error

> **Status: Closed, 2026-08-08.** The full open set exists in
> [`ledger.md`](./ledger.md) and [`cc-prompt.md`](./cc-prompt.md); close evidence
> is in [`closing-report.md`](./closing-report.md) and
> [`cdc-verification.md`](./cdc-verification.md).

## 1. Goal

Make a no-else `if` in expression position fail during `lykn check` and
`lykn compile`, before any invalid JavaScript is emitted.

arc07 slice02 reproduced the current defect:

```lykn
(bind label (if (> 1 0) "items"))
```

At slice open this passed `lykn check`, `lykn compile` exited successfully, and
the compiled output contained invalid JavaScript:

```js
const label = throw new TypeError(...);
```

`lykn run` then fails only when Deno parses the generated JavaScript. That is a
compiler-completion issue, not a docs issue: the guide's desired semantics are
right, but the compiler/check path does not enforce them early enough.

## 2. Scope

### In

- Reproduce the defect on the current `release/0.6.x` branch.
- Find the Rust and JS compiler paths that handle `if` in expression position.
- Change both relevant check/compile paths so no-else `if` in expression
  position is a diagnostic error, not an emitted `throw` expression.
- Add regression coverage for:
  - `lykn check` fails;
  - `lykn compile` fails;
  - no invalid `const x = throw ...` output is emitted;
  - statement-position no-else `if` remains valid;
  - expression-position `if` with both branches remains valid.
- Preserve current docs wording unless the implementation reveals a narrower
  semantic truth.

### Out

- Do not edit arc07 guide/SKILL drift except for any minimal test fixture
  references needed by this compiler slice.
- Do not redesign DD-50 position-aware `if` semantics.
- Do not fold in the optional `.d.ts` documentation pass.

## 3. Verification Approach

The slice required both compiler-path and user-command evidence:

- `./bin/lykn check <fixture>` fails on no-else expression-position `if`.
- `./bin/lykn compile <fixture>` fails and does not print invalid JavaScript.
- Positive fixtures still compile:
  - statement-position no-else `if`;
  - expression-position `if` with both branches;
  - explicit `?` ternary.
- Rust and JS compiler tests cover the same semantic boundary.
- `make test-docs` and `make check-cited-paths` pass after implementation.

## 4. Exit Criteria

The slice closes when:

1. The defect is fixed on every compile/check path that can currently emit or
   accept the invalid JavaScript.
2. Regression tests fail before the fix and pass after it.
3. Existing DD-50 positive semantics still pass.
4. arc10 is re-closed with a new composition addendum or updated closing
   report.

All four exit criteria are met by the close evidence.
