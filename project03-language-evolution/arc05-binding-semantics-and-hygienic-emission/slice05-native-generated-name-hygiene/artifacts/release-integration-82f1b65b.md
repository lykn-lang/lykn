# S04/S05 local release integration — 2026-11-14

Current status: authorized FF complete, validation pending, RI-01–03 open. Operator explicitly requests local
release/0.6.x fast-forward to82f1b65b, fresh validation and independent review,
then S06 if green. Same OpenAI gpt-6-luna/high CC and separate
gpt-6.1-sol/high CDC, Autonomous Mode. Reuse arc05_s05_cc/cdc for this bounded
integration; root owns planning/index/rows and the FF. Coordinator backend is
not independently reported. No push, hosted CI, tagging/publication or0.7/0.8
propagation. S06 implementation remains conditional on independent RI green.

## Preflight and three release gates

Release: /Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x, release/0.6.x,
clean c60dea62d126bb07557a7f4f7183662dec3f6a58/tree9c247edc.
Task: existing contract-predicate-lowering, codex/qualified-adt-core,
clean82f1b65b92529979afd6c624183912ca31453927/tree
4bb6bfc9e171bc6424548b0f740dd32f0cf98c75. Planning separate orphan, starting
dc33f490. Source S04/S05 and their independent closing metadata are accepted.
Root verified old release is an ancestor,0/5 left/right divergence, exactly
five S04/S05 commits. core.hooksPath is unset; default hooks contain only sample
files, with no active post-merge hook. Local FF has no hosted-CI effect.
Root will execute ONLY `git merge --ff-only 82f1b65b92529979afd6c624183912ca31453927`
in the existing clean release worktree and record its actual outcome below.

Actual root FF: the exact command above returned0, `Updating c60dea62..82f1b65b`
and `Fast-forward`. Release HEAD/tree now equal82f1b65b/4bb6bfc9 and task,
both clean, with0/0 divergence. Release reflog records that exact FF. The
c60→82 range comprises13 paths across the five already accepted S04/S05
commits (not just S05's ten-path c0ed range). No new commit/product edit or
remote/hosted-CI action occurred. Root retains release ownership until dispatch.

| Gate | Status | Required evidence |
| --- | --- | --- |
| RI-01 | open | Exact authorized c60→82 FF/reflog/ancestry, clean equal task/release HEAD/tree and0/0 divergence |
| RI-02 | open | Fresh release-worktree CC validation, full/default profile and explicit optimized CLI consumers, actual M6 seven paths/70/all14, source limits preserved |
| RI-03 | open | Separate Sol release-worktree independent reproduction and exact clean green S06 baseline, final citations/fresh size |

Source acceptance stays at its original scope: S04 discard declarations and
S05 native generated-name hygiene, not public parity/exact source names,
qualified ADTs or completed libraries. Prior task receipts are applicable
source context, not substitute release execution. AWEX remains separately
preserved Arc02 maintenance; MPVR/NUMI, Arc06 LI-04 and all Project07 reader/
research/guide/book/human/licence/bootstrap/home gates retain their owners.

## CC execution assignment

Exclusive release build/output ownership transfers to Luna on committed
dispatch after the root FF. Root may read immutable task source to prepare S06
while these release checks run; no concurrent builds or product mutations.
No release source/test/dependency edit or new source commit is authorized.
Read this full record/release AGENTS.md, S04 and S05 final independent verdicts
and metadata, actual Makefile fresh-artifacts/check/doc/size targets, existing
CLI generated_name_hygiene and discard_declarations tests and actual M6
materialization/receipt/selector/comparison implementation. Apply testing
Proportionate Proof/intake/independent-evidence guidance. Append source-cited
intake/readback here BEFORE dependent work; recover clipping/missing paths.

Use fresh owned /private/tmp/lykn-release-82f1b65b-cc/{xdg,tmp,npm}; explicitly
shared warm DENO_DIR=/Users/oubiwann/Library/Caches/deno. Preserve user caches
and unknown-owner outputs. Raw gate evidence goes under this record's sibling
release-integration-82f1b65b/cc/. Precreate its absolute m6-final directory and
set LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR BEFORE the full make invocation.

Run make fresh-artifacts, then the bounded existing optimized CLI command:
`cargo test --release -p lykn-cli --test generated_name_hygiene --test discard_declarations -- --nocapture`.
Actual selected population is two hygiene/four declaration tests; both helpers
use CARGO_BIN_EXE_lykn, so this exercises the optimized release CLI for BOTH
increments. Preserve actual file/JSON/package/strict TypeScript/value outputs.
Then ONE `make check`, docs included ONCE (no extra docs target). Inspect actual
M6 standalone compile and public command/config/status, seven selected files,
70 tests and every one of14 canonical/embedded/materialized comparisons. The
full Rust/M6 default test-profile route and optimized CLI route stay distinct.
Record bin/lykn and target/release/lykn SHA256 identities. Finish final-release-
HEAD make check-cited-paths and fresh make bundle-size-check (81920 hard cap).
Expected prior source summaries1798 Rust/1578 Lykn+67steps/docs482/M670/all14/
64docs+601historical/gzip48689 are context, never manufactured denominators.
Docs Skip/Fragment exclusions and no-block inputs are separate from executed
tests; preserve actual warnings/self-skips/downloads/cache/untraced-child limits.

Existing pinned dependency fetches may use normal network escalation. Preserve
failed/blocked conditions and full tool result/session IDs; never overlap jobs
or lose a long-command handle. No optional counting/archive/validator machinery.
Append proposed RI results/inventory here, return exact clean pin/no owned jobs
and source/build ownership to root. Root alone commits planning and closes rows.
Product failures return for task-branch repair, never a release-checkout patch.

## Independent verification and permitted continuation

After clean handoff, same Sol independently checks all three RI gates and
retained source applicability, then runs the same fresh release commands in
serial ownership using sibling cdc/ evidence and fresh private cdc roots/M6.
Read-only Git is permitted; no product/index/branch/commit/row mutation.
Append independent verdict here. Green RI permits authorized S06 planning,
implementation and independent close on the existing dedicated task branch;
root prepares a source-grounded open set first. No S07/other slice or project-
wide execution, release publication, book/library trial or external action.

All helper/script/orchestration/validator/evidence-processing/JSON/command logic
MUST be Lykn, never Python/Ruby/Fennel/handwritten JS/Node/awk/other scripting.
No Python execution or parity exception. Existing named product tests/static
runtime clients and native direct shell/Git/simple filesystem lifecycle allowed.
