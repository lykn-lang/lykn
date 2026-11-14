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

## CC release readback — before execution — 2026-11-14

Read the complete release-worktree `AGENTS.md` (all 171 lines). It identifies
`.worktrees/0.6.x` on `release/0.6.x` as the source home; commands `make check`
as the combined build/lint/test bar with docs included once; reserves planning
for branch `planning`; and requires preserving actual exits, warnings, failures,
profiles and denominators. Repository helper/orchestration/evidence logic stays
Lykn-only; native shell is limited to direct invocation and simple filesystem
lifecycle. The Testing discipline and Validation Gates guides were read in full
from the installed local skill root. Their applied points are real consumer
boundaries, repository-native gates, actual selected populations, serial owned
outputs, and separate observed success/rejection/unrun/skips.

S04's complete final implementation/delivery acceptance and closing-metadata
PASS sections in `slice04-discard-aware-declarations/cdc-verification.md`
accept DT-01–08 at c0ed, while its initial HOLD and histories remain retained.
S05's complete final implementation/delivery acceptance and NH-08 metadata
acceptance sections in `slice05-native-generated-name-hygiene/cdc-verification.md`
accept NH-01–08 at 82f1b65b; no later slice or unrelated boundary is implied.
These are accepted source dispositions, not evidence that this release worktree
has already run fresh checks.

Read `Makefile` check graph/recipes (`fresh-artifacts` 214–220,
`test-rust` 230–237, `test-suite` 240–246, `test-docs` 257–261,
`check-cited-paths` 354–357, `common-checks`/`check` 364–370,
`bundle-size-check` 581–583). `make check` includes documentation exactly once.
`fresh-artifacts` rebuilds optimized `target/release/lykn`, copies `bin/lykn`,
and invokes `lykn build`; focused CLI integration tests use Cargo's
`CARGO_BIN_EXE_lykn`, so the assigned `--release` focused command exercises the
optimized CLI separately from the default-profile Cargo/M6 route.

Read complete `crates/lykn-cli/tests/generated_name_hygiene.rs` (197 lines)
and `discard_declarations.rs` (861 lines). The former has two integration
functions: real `.lykn`/`.lyk` checked compile/runtime, strip mode and actual
`--kernel-json`→existing compiler consumer, plus actual built-package module
namespace/overload declaration and runtime consumer. The latter has four
integration functions proving strict generated declarations and rejected
TypeScript inputs with runtime in both modes; grouped/inline/named exports,
empty/raw/reused modules; actual `lykn build` package equality and consumer;
and typed ADT discard data. Both obtain the CLI through
`env!("CARGO_BIN_EXE_lykn")`; the focused command selects these 2+4 functions.

Read `macro_dependencies.rs` evidence helpers and complete M6 consumer
(1001–1167). The precreated absolute `LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR`
receives command, status, stdout/stderr, source/generated bytes, config, and
14 named comparison receipts. M6 copies the test-profile CLI into an isolated
standalone directory with cold owned XDG cache, compiles the real embedded
payload, checks each canonical/embedded/materialized file triple, then runs
seven explicit product test paths with the checked-in materialized compiler and
fresh browser path. The source assertion requires actual status 0 and `70 passed
| 0 failed`; each of 14 comparisons records both equality booleans. Macro child
argv is explicitly not separately traced by the product receipt helper, so I
will retain that limit.

Read-only identity checks before execution: release checkout is clean on
`release/0.6.x` at `82f1b65b92529979afd6c624183912ca31453927`, tree
`4bb6bfc9e171bc6424548b0f740dd32f0cf98c75`; the task branch is also clean at
the identical commit/tree and `git rev-list --left-right --count` reports `0 0`.
`git merge-base --is-ancestor c60dea62d126bb07557a7f4f7183662dec3f6a58 HEAD`
returned 0 and the release reflog contains the authorized fast-forward. The
tracked c60→82 range is 13 paths, spanning five accepted S04/S05 commits.
No build/test was started before this readback. Owned output homes are now
precreated at `/private/tmp/lykn-release-82f1b65b-cc/{xdg,tmp,npm}` and the
assignment sibling `artifacts/release-integration-82f1b65b/cc/m6-final`.

## CC release execution and proposed disposition — 2026-11-14

All owned invocations were serialized and drained. The complete raw command
streams, numeric exits, focused nested receipts, M6 receipts, and the binary
hash record are under
[`release-integration-82f1b65b/cc/`](release-integration-82f1b65b/cc/).
[`commands.md`](release-integration-82f1b65b/cc/commands.md) records exact
commands, profiles, environment and session. No product, source, branch, index
or dependency file was changed; release HEAD remains clean at
`82f1b65b92529979afd6c624183912ca31453927`, tree
`4bb6bfc9e171bc6424548b0f740dd32f0cf98c75`, with task/release divergence 0/0.

| Gate/check | CC observed result | Proposed RI disposition |
| --- | --- | --- |
| RI-01 release integration identity | Authorized exact FF is on reflog; c60 is ancestor; release/task refs and trees match; both clean; 13 paths over five accepted commits | PASS |
| `make fresh-artifacts` | Exit 0; optimized release binary staged and packages rebuilt | PASS |
| Optimized CLI focused tests | Exit 0; generated-name hygiene 2/2 and discard declarations 4/4; both use `CARGO_BIN_EXE_lykn` from `--release` | PASS |
| One `make check` | Exit 0; full Rust, corpus, docs, lint and format phases complete; documentation ran once | PASS |
| Actual M6 inner consumer | Standalone copied CLI compile 0; strict public command 0; 70 passed/0 failed/no public skips; all seven selected files and all14 canonical/embedded/materialized byte comparisons inspected | PASS |
| Final-HEAD `make check-cited-paths` | Exit 0; 64 documents and 601 accepted historical citations | PASS |
| Fresh `make bundle-size-check` | Exit 0; gzip 48,689 bytes against 81,920-byte cap | PASS |
| RI-03 separate Sol reproduction | Not run by CC; independent reviewer owns it | PENDING |

The full workspace Rust output has42 harness-result rows, totaling1,798 passed
with0 failed, ignored or filtered; zero-test umbrella/doc harnesses are retained
in the count. The CLI library harness reports1,217 tests. The standalone Lykn
suite reports1,578 passed across67 steps with0 failures. The compiler emitted
99 `.lykn` test inputs. Documentation generated22 test files and482 blocks;
482 passed and0 failed, with15 explicitly skipped blocks and nine HTML/source
inputs logged as having no Lykn blocks. `make check`'s captured stderr includes
the five M6 source warnings (four unused bindings and one unreachable match).
The full suite source has conditional JSR network and external mycelium-path
skip branches; the captured log does not contain their explicit skip messages
and prints both test cases as `ok`, which does not establish registry
publication. Focused integration output retains the expected unused-binding
warnings and expected negative TS2345/invalid-export statuses. No failing gate,
retry, extra docs run, or overlapping owned job occurred.

M6's actual receipt command resolves its child Deno to2.9.6 and copies the
default Cargo test-profile CLI into a fresh standalone home. Its per-test XDG
cache starts cold and is isolated under the private temp root; shared warm
`DENO_DIR` is `/Users/oubiwann/Library/Caches/deno`. The observed M6 public
selection is `embedded-adt-pattern.test.js`, `surface-type-context.test.js`,
`reserved-binding-output.test.js`, `icu-generated-names.test.js`,
`lexical-regions.test.js`, `discard-bindings.test.js`, and
`remaining-discard-bindings.test.js`. Each of the14 comparison receipts says
`canonical_equals_embedded=true` and `canonical_equals_materialized=true`.
Public M6 stderr is empty. Its inner compile retains the four unused-binding
and one unreachable-match warnings. The product receipt explicitly leaves the
nested macro-child argv untraced; this evidence does not claim otherwise.

The focused real CLI consumers preserve both `.lykn` and `.lyk`, checked and
stripped outputs, plus actual `--kernel-json` through the existing compiler
consumer. File and JSON runtime results are `7 7 ok`, `8`, `12`, `8` in all
four source/strip combinations. Package module keys are exactly `pick`, both
source-labeled overloads remain in declarations, and calls print `7 ok`.
S04's strict declaration, expected-error, grouped/inline/named namespace,
schema and package clients also pass in the full run. These observations
support the accepted S04/S05 scope only; they do not settle AWEX, S06, S07,
Arc06 LI-04, broader API/library/research or external release requirements.

The fresh bundle output is raw379,173, minified181,014 and gzip48,689 bytes;
the command prints baseline27,630 and delta+21,059. Its stderr records two
esbuild registry downloads and four occurrences of the existing `astring`
package-condition-order warning. Installed `bin/lykn` and
`target/release/lykn` have identical SHA256
`feef6ddc0ed56a804a17b2a38a01a77a42016f72d85b4e78ecfd1f3464a63025`, retained
in `cc/binary-sha256.txt`. Deno reports2.9.6 and TypeScript6.0.3. No claim of
blanket offline behavior, browser runtime loading, or external publication is
made.

CC proposes RI-01 and RI-02 PASS, with RI-03 held for the separate Sol run. No
planning row was changed and no S06 work was started. Source/build ownership is
returned to root for independent RI-03; all CC command sessions are finished.

Root terminology reconciliation: the1,217-case library harness above is
lykn-lang (native language library), not the CLI library. Actual full stdout
and stderr identify that harness; the total and pass/fail claims are unchanged.
An initially inferred root log filename was absent; commands.md supplied the
actual full.stdout.log/full.stderr.log paths, which were then inspected.
