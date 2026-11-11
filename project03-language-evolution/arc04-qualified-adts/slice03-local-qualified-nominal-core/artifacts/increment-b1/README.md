# S03 B1 implementation receipts

## Source pin and disposition

CC's B1 candidate is committed on `codex/qualified-adt-core` in
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering` at
`3f197340dd4765df7cccb3858ef97faccb5df9fc`, tree
`9ee95765b3475c84c5f537834ecceb6b476dc794`. Baseline was accepted A at
`5caf3d871a80a711c08dbda0db8c5f5446dffb56`, tree
`115ce5ecc254ea9ed15263612bed67b6cec80ab2`. The source worktree was clean
at handoff. Both Codex and Billo AI trailers are contiguous in commit `%B`.

This is CC proposed-done pending separate Sol review. It removes shared public
`typeRegistry` state, adds a private fresh `createSurfaceTypeContext()` for
complete expansion and `expandExpr`, and carries `{ bindings, typeContext }`
through lexical copies and all surface metadata paths. Fresh contexts seed
Some/None/Ok/Err field metadata as the old explicit-reset baseline; this is
intentional cold normalization and introduces no runtime constructor bindings.
Legacy syntax and positional fallback remain pending the later qualified
migration. The actual `surface.js` export `resetTypeRegistry` is removed and
must be handled in S06. No typed owner/case identity, nominal activation,
purity, public context injection, or release integration is claimed.

## Executed checks

- Deno 2.9.6, V8 15.0.245.2-rusty, TypeScript 6.0.3; Cargo 1.97.0 and
  rustc 1.97.0. Focused and full compiler commands used the existing
  `DENO_DIR=/Users/oubiwann/Library/Caches/deno` and task-owned
  `npm_config_cache=/private/tmp/lykn-s03-b1/npm-cache`, with task-owned XDG
  and TMP directories under `/private/tmp/lykn-s03-b1/`.
- Fresh-process cold prelude control: one test passed alone. It uses an ordered
  Some-shaped object with a decoy before `value`, confirms named extraction,
  and checks that no runtime Some/None/Ok/Err binding is emitted.
- `test/forms/surface-type-context.test.js`: final file has six passing cases
  for successful and late-failing public calls, caught successful and failed
  re-entrant inner compiles, public `expandExpr` isolation and input Set
  preservation/macro gating, and browser compile-to-ESM state isolation.
  Generated ESM was executed with exact exit, stdout and stderr assertions.
- Final M6 targeted Rust case passed. Its cold standalone copied CLI and
  materialized `lang/` route compare all nine files byte-for-byte (A's seven
  plus changed `surface.js` and new `surface-type-context.js`); the strict
  materialized Deno process ran 11 cases: five existing embedded runtime
  tests plus all six new context tests.
- Final `make check` passed: build, Clippy, formatting, Lykn syntax/lint,
  Rust tests, product corpus `1519 passed (67 steps)`, documentation `482
  passed`, then `All checks passed`. Documentation ran once through `make check`.
- Final `make bundle-size-check` passed the 80 KiB gzip budget: 42,405 bytes,
  +14,775 bytes from the measured 27,630-byte baseline. The receipt preserves
  the existing astring package-condition warnings.
- Post-commit `make check-cited-paths` passed at this source HEAD: 64 current
  documents checked, 601 accepted historical citations.

## Discriminating failures and receipt map

`pre-fix-leak.log` runs the successful-declaration regression against the
accepted baseline package and captures the old global leak (`value` selected,
while the isolated cold fallback is `decoy`). `pre-fix-late-failure.log`
separately captures the old leak after the type emitted and a later malformed
`not` failed during Pass 2. These are baseline failures expected to turn green
under B1.

`make-check.log` and `browser-size.log` preserve the first complete gate run;
`make-check-final.log` and `browser-size-final.log` are the final runs after the
last test change. `check-cited-paths.log` is the committed-HEAD result.
`m6-embedded-public-strict.stdout.bin`, `m6-embedded-public-strict.stderr.bin`,
`m6-embedded-delivery-*.comparison.txt`, and the associated M6 receipts retain
the last successful cold materialized run. The first M6 attempt exposed that
Deno reports check/progress output on stderr even when the strict tests pass;
the old Rust empty-stderr assertion was replaced by a combined-output assertion
for the actual 11/11 summary. This is a harness-output correction, not a
compiler failure.

No remote CI, push, release, publication, or source integration was run.
LC-02 and S03 remain open; typed owners/cases, aliases, nominal semantics,
precise DTS, purity, full migration and independent acceptance are still due.
