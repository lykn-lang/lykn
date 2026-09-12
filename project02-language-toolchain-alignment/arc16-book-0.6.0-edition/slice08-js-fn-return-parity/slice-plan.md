# arc16 slice08 - JS `fn` Return Parity

> **Status:** Opened 2026-09-12 from slice07.

## Goal

Fix or explicitly dispose the live JS compiler / Rust CLI mismatch exposed by
the book gate: a `func` with `:returns :function` whose final body expression is
`fn` succeeds on the Rust CLI but fails on the JS compiler path used by doctests.

## Scope

In scope:

- Reproduce the mismatch with focused Rust CLI and JS compiler tests.
- Identify whether the intended 0.6.x semantics are Rust's current behavior,
  JS's current behavior, or an explicit design correction.
- If Rust is the intended truth, update the JS compiler so `fn`/`lambda` in
  value position can satisfy return-typed function bodies, with tests.
- If JS is the intended truth, update guides and book routing evidence instead
  of silently changing examples.
- Re-run the affected book fence subset and the standard lang gates required by
  `AGENTS.md`.

Out of scope:

- Normal book chapter rewrites beyond targeted verification notes.
- Broader compiler architecture refactors not needed for this mismatch.
- Changing book fence tags.

## Verification

Minimum gates:

```sh
cargo fmt --check
cargo test -p lykn-cli
deno test --config project.json -A test/
make test-docs
make check-cited-paths
```

Also run from `/Users/oubiwann/lab/cnbb/lykn` after rebuilding `bin/lykn` if the
implementation changes:

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src/part2/chapter4/3-scope.md src/part2/chapter7/4-closures.md --fence lisp
```

## Exit Criteria

- `D-2609-FNRT` is fixed or explicitly deferred with rationale.
- Rust and JS compiler behavior for this form is covered by tests or documented
  as intentionally divergent.
- The affected book fence failures are reduced or reclassified without normal
  chapter rewriting.
- Arc16/project/status surfaces are updated with the outcome and next slice.
