# Slice07 CC closing report — Phase A handoff

CC completed the authorized NE-C01 predicate-lowering repair on source branch
`codex/contract-predicate-lowering`. Repair commit:
`4f5ac27fad9363896de4e55559663f07d5a2fc91`; final source HEAD:
`86d116db5c096d0fff7ec555d388343946114e4d` (clean). The two allowed Rust
emitter files changed; public helper signatures and original diagnostics remain
unchanged. Native CLI regressions cover seven families and all 17 inputs.

The corrected unfixed baseline fails through generated-JS parse errors and two
`cond is not defined` outcomes; the committed candidate passes all 17 native
observations, including caller/callee error identity and a following statement
if witness. The focused compileBoth parity test passes 1/1. The locked/offline
release build and standalone cited-path gate pass. Canonical `make check` first
failed on clippy, then on the machine's default npm cache EPERM. After the test
lint fix, the same unfiltered gate passed with only `npm_config_cache` redirected
to ignored `target/slice07/npm-cache`: full JS+Lykn 1461/1461, docs 482/482, and
the existing npm dry-run test 5/5. All prior failed/intermediate attempts are
retained in `artifacts/results.md` and the named task-target logs.

CC proposes CP-01 through CP-03 done for independent reproduction. CP-04 and
CP-05 remain unrun and held; the Slice06 1/5 bundle and 1/11 runtime attempt
remain historical. CP-06 remains open pending CDC review/retrospective. No pilot
bundle or runtime call, push, merge, publish or remote CI action occurred.

CDC now owns independent review and Phase B gate disposition. CC relinquishes
source and planning mutation/index ownership at this handoff.

## Phase B CC return — stopped at the frozen C5 oracle

Following CDC's independent Phase A acceptance and resume, CC recorded the
frozen compiler/source/tool condition and unchanged predictions before running
the exact archived five-control population. Attempt01 records a compile setup
failure caused by a missing output directory. Fresh attempt02 passed all16
strict compiles, `dist`, `fmt --check`, lint/check, corrected byte-identical
staging for all15 JS files, and exact reconciliation of all nine export keys.
The first staging comparison's incorrect path is preserved as an invocation
error.

The sole C4 gate passed at the expected bundle hash and was independently
confirmed by CDC before controls. The authorized fixed controls command then
stopped on its first C5-source-before outer assertion. The child Deno process
exited0 with empty stderr and returned valid JSON containing all expected
fields/values. The frozen Lykn driver expected string crosses a `template` to
JavaScript template-literal boundary that consumes quote escapes, causing the
outer stdout comparison to diverge. Complete source, generated JS and receipt
are retained; CDC routes the distinct issue as NE-C03. CC made no source or
specimen correction and ran no retry or additional control. A read-only hash
comparison found all13 public package files unchanged.

Current denominators for the accepted compiler attempt: 1/5 bundles complete,
4 unrun; 1/11 child runtime calls attempted (child exit0, outer oracle mismatch),
10 unrun. CP-04 and CP-05 remain open/incomplete; CP-06 awaits CDC review and
retrospective. Historical Slice06 failure/unrun counts remain untouched. CC
returns planning ownership at the evidence commit and does not self-accept or
close this slice.
