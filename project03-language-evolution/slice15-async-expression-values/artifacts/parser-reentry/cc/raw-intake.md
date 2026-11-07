# Parser continuation CC intake and immutable input freeze

## Current prerequisites and ownership

- Planning starts at accepted CDC commit `b206fa524a789ce539836de8cb46736b948540f3`; the acceptance record explicitly accepts source `5408abd432b8789ae474a3895436f68818c4e482` TASK-ONLY and orders parser work after that review.
- Source worktree `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering` is clean on `codex/async-expression-values`, HEAD `5408abd432b8789ae474a3895436f68818c4e482`.
- Accepted CLI is `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn`, current SHA256 `b0a5649791ec6dfdd774619cc7c01c4c6c4f1138a5db7e368916416a9600b873`. Deno is `/opt/homebrew/bin/deno` 2.9.6, SHA256 `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.
- Only mutable evidence home is `artifacts/parser-reentry/cc/**`, with unique owned `/private/tmp` scratch. All source/helper/control/prediction/test/oracle/plan/ledger files remain read-only.

## Read extent and behavioral readback

Read the full iteration07 prompt, slice plan and ledger, current CDC source-acceptance section, all three Slice14 helper bodies, entire controls JSON, and full frozen predictions. Verified the five required input hashes against the preserved copies below. `controls.observations` is exactly four active rows in order K11, K01, K08, K09; `fullAuditControls` is inactive and no walker is in scope.

The unchanged core checks the selected parser's bytes before dynamic import and again after use. Probe's no-args path must report `probe_usage_error`, expectedArgs 3 / actualArgs 0, exit 2. Observer's no-args guard must fail with its exact usage Error before reading controls, creating roots or starting a child. These three source/generated gates are prerequisites, not observations. Only after they all match should the existing observer run the unchanged four rows in order against the pinned local Acorn file: K11 pre-import hash rejection/no AST; K01 deferred function/arrow parser structure; K08 module imports/exports/TLA parser structure; K09 actual SyntaxError position and no AST. JavaScript inputs are parser data only. A first mismatch stops the sequence with remaining denominator unrun.

## Frozen copies

`inputs/` contains byte-for-byte copies committed before any checker, compiler or Deno invocation. Hashes:

- `parser-core.lykn`: `6ca1afe83d6d9a47f7eb1fea7f0aa3872ae626cc4f39d5b3ed017aab38308bf7`
- `parser-probe.lykn`: `7d2dc80a7366556b9e753c8af75b0d0b8d66d8154ee4e343ef56b43cf090b7b9`
- `offline-observer.lykn`: `f109f7b47d7086648596e6ca829c4e2746ce7d80605f0145e391c2f5d13c23b2`
- `controls.json`: `0f20dba4713b93671b337fa1ba0a5cde00fdbe29bed195a00e3ae1c689473a5d`
- `predictions.md`: `311a1b6629fe5ace6bf2f9c13da4ca681b0229f773915399aebb34f470664e48`

## Intake command limitation

An initial read-only `wc` invocation used the source worktree cwd for planning-relative paths and returned three “No such file” diagnostics. It did not run a check or alter anything. The files were then read completely from the planning worktree and copied/hash-verified from their canonical planning paths above. This failed read command is not represented as evidence of file contents or validation.
