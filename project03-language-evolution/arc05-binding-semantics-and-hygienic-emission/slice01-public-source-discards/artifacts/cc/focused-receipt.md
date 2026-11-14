# Focused source and facade proof

## Source-causal baseline and stale pre-rebuild run

Before rebuilding, `target/lykn/build/lang/binding.js` SHA-256 was `43027e4f19089ccd2e524d15d95747989933c7272846fc1f4a97f5e841542ea0`, exactly matching `git show HEAD:packages/lang/binding.js` at the pre-fix dba24d40 pin. The edited canonical and embedded source files both hash `cad3be2ebe003fd315c0b577d34a2dfdbb8491d57cb2e3ae82587e992a5d6d2e`. Thus the regression-first red receipt is applicable to the old pin. The first post-edit raw `deno test` reused that same old built package and repeated the red; it is retained as a stale-artifact attempt, not evidence against the fix. Its exact output and status are in `focused.stdout`, `focused.stderr`, `focused.exit`.

## Native refresh and corrected focused run

- CWD: `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`.
- Refresh: `make fresh-artifacts` (release CLI rebuilt from the edited checkout, then `bin/lykn build` refreshed canonical lang/browser/testing packages). Status 0. Captured in `fresh-artifacts.stdout`, `.stderr`, `.exit`.
- Test command: `./bin/lykn test test/forms/discard-bindings.test.js`.
- Environment: `DENO_DIR=/Users/oubiwann/Library/Caches/deno`; `TMPDIR=/private/tmp/lykn-arc05-s01-cc/tmp`; `XDG_CONFIG_HOME=/private/tmp/lykn-arc05-s01-cc/xdg`; `NPM_CONFIG_CACHE=/private/tmp/lykn-arc05-s01-cc/npm`.
- Numeric status: 0. Raw stdout, stderr and status retained in `focused-fresh.stdout`, `.stderr`, `.exit`.
- Population: the same seven existing top-level groups; all 7 passed (0 failed). This run uses the checkout's repository-native build and test route. The existing group executes both public `lykn` and mapped `browserCompileLykn` positive ESM output (`1\n`, code 0, empty stderr), and compile-time `eval`/`arguments` rejection assertions on both facades.

The guard change in canonical `binding.js` changes only the default-left walk from `grammar === BINDING_PATTERN` to `!typed`. This preserves CATCH_BINDING callers and typed-parameter slot behavior; canonical and embedded `binding.js` compare byte-identically after the edit.
