# Authorized release integration — 2026-11-06

Operator: “Agreed, let's merge the repair into release/0.6.x and then move on
to NE-C03”. This separately authorizes the local release merge after Slice07
closed; it does not rewrite the earlier no-integration record or pilot counts.
CDC performed the mechanical merge of already independently accepted source.

Both homes were clean. Release pre-tip was
`cb3ee61cd686eac9fe551fb9c826b9aad532b008`; accepted source task remained
`86d116db5c096d0fff7ec555d388343946114e4d`. No configured hooks path or active
non-sample hooks were present. No push or remote pipeline was triggered.
Recomputed `git merge-tree --write-tree --name-only` predicted clean tree
`8fb5e6285f56f7a5b03185fad5dd6a79dc34921e`. Its release delta was exactly the
four reviewed emitter/test paths; those file bytes equal the accepted task.

`git merge --no-ff -F /private/tmp/lykn-contract-release-merge-message.txt codex/contract-predicate-lowering`
created local release merge `b841f71b30eb2c3e340a651ae1d57de04fec3d79` with
the two parents above and that exact tree. The actual multiline message has
both contiguous co-author trailers, verified using raw `%B`. A merge command
has no path-list option; clean index and the pre/post four-path tree comparison
provide its scope check. No partial-commit bypass, rebase or history rewrite.

From `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`, CDC ran unfiltered
`make check` with only `npm_config_cache` set to that source home's ignored
`target/slice07-release-integration-20261106/npm-cache`. Exit0: dependency,
citations, build, lint/format, Rust tests, JS+Lykn1466/1466 and docs482/482.
Actual raw output is [retained verbatim](evidence/release-integration-20261106/make-check.log),
including its terminal blank line. Legacy npm compatibility validation remains
included; no new Node/npm dependency or installation was introduced.

The release baseline differs from the former0.7-based task outside these four
files. Its Cargo.lock SHA256 `672c8bf62e441cfaa6ec22bd511d55e002812d8f18814faea0e99d4c5e2813ce`
equals its own pre-merge lock (checked with `git show cb3ee61:Cargo.lock`), not
the historical task's different lock hash. New release `target/release/lykn`
and `bin/lykn` both hash
`e4b04426af15ba65840b0bcf25127aa7b460264708b85070e21c1776de67cf8c`.

This accepts the carried-forward repair at its explicitly authorized local
release destination. No other release/main propagation, push, publication or
library implementation occurred. The old pilot's counts and CP-04/05 deferral
remain unchanged; NE-C03 source-contract diagnosis is the next authorized work.
