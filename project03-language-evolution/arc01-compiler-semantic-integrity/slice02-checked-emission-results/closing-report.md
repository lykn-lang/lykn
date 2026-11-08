# S02 bounded stop report

## Correction03 CC execution — 2026-11-07

The operator-approved RD01 behavior/test/guide correction is source-frozen at
`codex/checked-emission-results-v2@c9e0d7e5a6faa437e1dece7d0adf9ce06a67b5a1`.
Only the existing form-named label corpus case/current coverage comments and
the narrow compiler-failure guide passage changed. The exact 27-byte case source,
both compiler calls, and test ordering remain intact; D1 controls, class9,
compiler, fixtures and public API are unchanged. CDC independently released the
static construction before validation.

The updated existing corpus runner passed 9/9. Normal unfiltered `make check`
passed (exit0), including the full JS/Lykn suite 1470/1470 in 11 steps and
documentation tests 482/482. Standalone committed cited-paths passed: 63
documents, 601 historical citations. The unchanged Rust suites were re-executed
by full Make; prior focused source/API receipts remain scoped to their original
source commits. The existing `emission_failures` executable was rerun without a
Cargo rebuild: 4/4 passed and wrote current raw CLI/package failure, unchanged
JS/DTS sentinel, valid runtime and generated-module evidence under
`artifacts/evidence/cc/correction03/`. Post-Make release `./bin/lykn` and
`target/release/lykn` both hash to
`746f206298f1a32f3da6210022a2f3e706436d25dd36efb513feffc52893024f`; focused
debug CLI/test executable hashes and the Deno 2.9.6 pin are in adjacent evidence.

These are CC execution receipts, not independent acceptance. Full streams,
commands, exits, generated outputs, diagnostics, file-preservation evidence and
tool pins are retained under `artifacts/evidence/cc/correction03/`. No matrix
recount, all-38-cell claim, CE acceptance, S03, integration or release follows.

## Current correction02 full-gate stop — 2026-11-07

Candidate483ff507 remains **unaccepted**, all six CE deferred/CI-02 open. Corrected
typed6/lang1133/CLI99+main180/emission4/contract17/parity3/e2e18/cross22 passed
in CC's actual focused run. Original four invalid/four runtime oracles match there.
Full normal Make exited2 at one documented residual:1469passed/11steps/1failed.
Embedded citations63/601 and Rust/other prerequisite stages passed; documentation
tests not reached, standalone cites and independent full gates held.

CDC independently reproduced ONLY the exact27-byte original failing Rust arm:
actual post-Make compiler746f2062, compile --no-strict, exit1/empty stdout/
`1:18: error: fn requires params and body`. [Review](cdc-verification.md) names
S02-RD01: current corpus explicitly expects historical Rust fallthrough while JS
rejects shape, and canonical DD-60 requires conscious re-disposition. Not an
automatic compiler bug, invalid-source claim or permission to soften the oracle.

Recommendation is explicit unresolved-form rejection policy plus exact corpus/
dated canonical-DD/current error-guide disposition, with genuine bound calls and
old residual counts preserved. It is a PROPOSAL only, no new prompt/source edit/
probe/retry. Correction02 spent/three remain; release8f/old refs clean unchanged.
[Retrospective](cdc-retrospective.md) and current review preserve all limits.
S02 stays paused for Operator decision; earlier stopped reports below are history.

## Correction02 source freeze and first full-gate stop — 2026-11-07

The authorized test-only correction is frozen at
`codex/checked-emission-results-v2@483ff5074001d7a039270f4639e8ef61d70e4b4e`
(tree `e653fa678a153b08c4fc3caad49f1d846bdf4b84`). CDC independently cleared
the exact two test locations for validation only. Focused gates passed: typed
emission tests6/6, lang unit1133/1133, CLI library99/99, CLI binary180/180,
emission route/runtime4/4, contract1/1, validation parity3/3, e2e18/18 and
cross-compiler22/22. Strict CLI/package Deno receipts, invalid routes, sentinels,
mtime, complete generated JS and explicit DTS absence are retained under
`artifacts/evidence/cc/correction02/attempt01/`.

The first required full gate, normal unfiltered `make check`, exited2. Its
embedded cited-path prerequisite passed (63 documents/601 historical citations),
as did the visible release build, Clippy, format, Lykn syntax/lint, artifact
refresh and Rust test stage. The Deno test suite reported1469 passed and one
failed in11 steps: pre-existing documented `form-named label — shape-mismatch
asymmetry` at `test/expander/conformance-corpus.test.js:221:6`; actual Rust result
was `1:18: error: fn requires params and body` for source
`(label fn (block (fn 987)))`. `test-docs` was not reached; the standalone
`make check-cited-paths` command was not run. Exact source text, argv, producer
route and full make streams are in the correction02 failure record and raw
attempt receipts.

The first-further-substantive-failure stop is in force. No retry, filter,
suppression, source edit, or further dependent check followed. S02 remains
unaccepted and CE rows remain deferred pending CDC disposition/replay. Source,
planning and index/build ownership are returned to CDC; no S03/integration is
authorized. See [correction02 failure record](artifacts/evidence/cc/correction02/attempt01/failure-record.md).

## Current resumed implementation stop — independent disposition

2026-11-07: candidate d352e6b is **unaccepted**, not delivered. Workspace no-run0
with full raw streams/pins is the only build; focused tests0, new typed functions
0/6, invalid routes0/4, runtime controls0/4, contract observations0/17, full Make/
citations unrun. No generated runtime result is claimed at this candidate.

[Independent resumed review](cdc-verification.md) confirms final typed tests
select the enclosing Obj instead of the invalid nested child (CE-R05); constructor
origin/nested-assign coverage and validation-order suffix counters are incomplete
(CE-R06/07). These are source-confirmed test defects/acceptance gaps, not a new
compiler/parser evidence gap or an empirically observed test panic. The first
substantive-failure stop was obeyed, no correction/rerun followed.

All six CE rows remain deferred/CI-02 open. One consolidated test-only follow-up
is proposed but NOT issued/authorized. Shared correction01 spent/four remain,
next refinement02 only if approved. Maintenancec129 remains accepted and unchanged;
release8f/prior refs untouched. Source/planning/index/build ownership returned to
CDC. [Retrospective](cdc-retrospective.md) preserves process/capture limits. No
S03/integration/other unit follows. Earlier reports below are retained history.

2026-11-07: implementation is **not delivered**. Test-only2321943 on dedicated `codex/checked-emission-results` is clean; release and prior accepted source8f unchanged. No checked API or production code was authored.

Independent static review found wrong package output paths, an unsupported DTS-existence oracle, missing package runtime execution and nondiscriminating stderr/status predicates. These are test-authoring defects, not a compiler/parser evidence gap. The first unexpected substantive-failure stop was honored. One test-only correction is proposed in [CDC review](cdc-verification.md), pending Operator approval; zero source refinements executed, no new prompt issued.

One no-run build0 is attested through CC transcript readback, with an unused-import warning, missing original durable separate streams and no post-build pin. Actual test functions0/2; invalid compile conditions0/4; valid route/runtime conditions0/4. Full source gates, generated module review and all Result/route/context acceptance remain unrun. All six ledger rows deferred; CI-02 remains open.

The Result-family/0.6 breaking-development design decision remains approved. This stop changes neither source acceptance nor the old eight-spent tooling/K0/13 history. S03/integration/push/publication/tooling/walker/corpus/F6/library work was not started. S07 retains eventual actual public-surface/doc impacts; Project07, adjacent findings and book/human obligations remain with their existing owners.

## Resumed S02 implementation stop — 2026-11-07

The resumed source candidate is preserved at `codex/checked-emission-results-v2@d352e6bafed80048bfe59a3a723b60025e753973`, descended from the accepted maintenance baseline `c129e94cc3c2d27a07c3bf26e4476bf740c04461`. Its complete workspace no-run command exited 0; exact argv/environment and separate raw stdout/stderr are retained under `artifacts/evidence/cc/resumption01/attempt01/`, with producer pins. The focused test binaries were pinned but none was launched.

After freeze, CDC independently confirmed a substantive defect in both new diagnostic-oracle tests: they inspect the outer bind's value (an object) as if it were the nested invalid expression. The stop rule was followed. No source correction, focused/runtime test, full `make check`, or citation gate followed. This candidate remains unaccepted and no source correctness or route behavior is claimed. Source/index/build ownership has returned to CDC; the earlier bounded stop report above remains intact.
