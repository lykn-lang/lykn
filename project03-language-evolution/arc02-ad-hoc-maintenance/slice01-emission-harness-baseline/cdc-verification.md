# Independent maintenance harness/baseline acceptance

2026-11-07. CDC `/root/cdc`, OpenAI gpt-6.1-sol High; implementer fresh `/root/cdc/emission_baseline_luna_cc`, OpenAI gpt-6-luna High. CDC authored the assignment and independently reviewed/replayed CC's actual test implementation; root was read-only. **Accept this bounded harness and faithful old-compiler baseline, not product correctness or all-green tests.** All five MH rows done. S02/CI-02 remain open and held for explicit continuation.

## Exact candidate and checks

Source `codex/emission-harness-baseline@c129e94cc3c2d27a07c3bf26e4476bf740c04461`, clean. Only `crates/lykn-cli/tests/emission_failures.rs` changed relative to232; production remains accepted8f. First corrected body5480 and final pre-baseline receipt/short-name additionsc129 remain separate actual commits with proper trailers. The actual CC and CDC baseline producer is c129, not5480. Three source constants are unchanged; source review covered full corrected body plus exact final delta and actual production contracts.

CC evidence/report commit `7b1169545c3ddc8249fc438a0c4e798cc258e034`; its first no-run/run receipts are under `artifacts/evidence/cc/attempt01/`. Fresh CDC outputs are under `artifacts/evidence/cdc/` with prospective `commands.txt`; fresh caches/output root `/private/tmp/lykn-emission-cdc.ShU5Pc`. No intervening source edit, new fixture, exploratory variant or compiler repair. CDC owned all indices/builds after explicit CC return.

CDC owned-file rustfmt check0; focused `cargo test --offline --locked -p lykn-cli --test emission_failures --no-run`0. Actual task Rust1.97, fixed accepted DENO_DIR and fresh owned XDG/npm caches. Final actual executable pins before/after direct unfiltered test match CC and remain unchanged:

- Debug CLI SHA256 `9fc676a2c1a11355966680808dd0a3c8afb2c74881b2b7a78ad35e12588e48de`.
- Actual `target/debug/deps/emission_failures-ee1302ddd95a417d` SHA256 `39e857d95b1ff55d5d8a4c823af5b02a947561e87abedaba490a652b5624fe73`.
- `/opt/homebrew/bin/deno`2.9.6 SHA256 `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.

The direct absolute test executable used `--nocapture --test-threads=1`, no filter. **Both independent runs: exit101; 3 selected, 1 passed, 2 failed, 0 ignored/filtered.** Ten predicate checks all match (two positive/eight independent negative). All four invalid compile conditions and all four valid-source runtime conditions were actually observed. No full Make/citation gate was run or claimed green; full normal green remains S02 after product repair, with no ignored/filtered regression.

## Actual baseline, not revised oracles

| Condition | Independently observed | Disposition |
| --- | --- | --- |
| Invalid CLI stdout | exit0/nonempty JS | Expected old-product false success; future rejection oracle fails |
| Invalid CLI existing files | exit0/JS overwritten/DTS sentinel retained | Expected old-product no-write violation |
| Invalid CLI fresh files | exit0/JS created/DTS absent | Expected old-product no-new-file violation; existence receipt only for generated file |
| Invalid package existing files | Ok/emission/JS overwritten/DTS sentinel retained | Expected old-product no-write violation; real watched paths and mtime proof |
| User throw, CLI | exit1/exact literal stdout/TypeError plus user message | Required intentional runtime exception matches |
| User throw, package | same required outcome | Matches |
| Bound dissoc, CLI | exit0/exact `"kept"\n`/empty stderr | Matches |
| Bound dissoc, package | exit1/empty stdout/ReferenceError obj at2:28 | Unexpected old-product failure, correctly rejected; unchanged oracle remains required |

Valid-runtime matches **3/4**, not4/4. The last outcome contradicted the pretrial package-preservation prediction and triggered the required stop. CC did not retry or change source/oracle. CDC repeated only the exact authorized baseline, confirmed the same failure and stopped. The test now detects this failure rather than silently omitting package execution or vacuously accepting stderr.

Source review confirms private predicates are used by both real routes and all ten data checks. Optional receipt env only controls receipt writes, never skips assertions; unset behavior was source-reviewed, not separately runtime-tested. Actual package paths derive from independent literal `emission` expectation, not folder name. Real pre-build metadata shows source newer than both UNIX_EPOCH sentinels; snapshots precede build, the predicate is included in the final aggregate. Post-build JS mtime changes, DTS remains at epoch and before/after DTS bytes compare equal. All four valid modules were read completely, and DTS absence observations retained; this is not a general declaration-availability claim.

## Named product obligation MH-P01 → S02 CE-03

Same unchanged valid source, complete generated witnesses in both runs:

```text
CLI:     dissoc({ secret: 1 }, "kept")
package: dissoc(obj("secret", 1), "kept")
```

At production8f/c129, CLI with-DTS route `crates/lykn-cli/src/compile.rs:335` resolves before classification; package `src/dist.rs:203–218` expands then classifies without resolution. `crates/lykn-lang/src/ast/sexpr.rs:242` makes a resolved bound head an ordinary call. Without that resolution, emitter/forms.rs463–525 treats `dissoc` as a recognized special form; classifier/forms.rs2294–2312 rejects its string key, and Err→expr.clone preserves the ENTIRE call including unlowered nested `obj`. The actual modules/runtime witness supports this source trace; no new variant was executed to prove a universal cause.

This is valid bound-call behavior, not a demand to change its argument to a keyword or replace its source. Existing S02 design already owns package resolver adoption plus checked fatal fallback. S02 must retain this exact control and make package output/runtime match without losing invalid-source rejection. No new compiler fix, API implementation or new global finding ID is authorized here. Its repair/full normal green source gate/independent validation remain S02's obligation after explicit continuation.

## Limits, row walk and return

Invalid fresh-file condition retains existence booleans and process streams, not its generated module bytes; it was never executed. Other required valid modules/child raw bytes and existing-file sentinels are preserved. Original232 no-run stream/post-build pin deficiency remains history, not repaired retrospectively. Cross-run paths and stack locations differ legitimately; compare fixed oracles, not fictitious raw byte identity. No runtime validity claim comes from a syntax check alone.

Raw-preservation whitespace exception: staged full `git diff --check` exits2 for original final blank lines in nine child `*.command.txt` receipts and `run.stdout`. These bytes are intentionally retained, not normalized. The planning prose check is separately scoped and passes; this is not a full whitespace-clean claim. Source rustfmt and behavioral results are unchanged. An earlier combined check/stat shell call ended with stat0; the separate check's actual2 governs this record.

MH-01 actual path/DTS/mtime tests accepted; MH-02 exact predicates/ten falsifiers/both runtime routes accepted; MH-03 complete honest old baseline accepted including unexpected product failure; MH-04 separate fresh source/generated/runtime replay accepted; MH-05 history/shared allowance/explicit return ownership reconciled. Shared correction01 is spent (1/5), initial232 remains, tooling8/K0/13 unchanged. Release and preserved accepted task8f, old checked-emission ref232 unchanged/clean.

This closes the finite maintenance slice. Arc02 stays available for individually authorized intake; its indefinite closure is not a return prerequisite. S02 CE rows remain deferred/CI-02 open, with MH-P01 concretely owned and the accepted baseline available. Explicit Operator continuation is still required; no automatic S02/maintenance next unit, integration, publication or source repair.
