# S05 independent acceptance

Luna 6 High CC implemented the split at `1562e1d3a583818b9eae8d2320462ad3a8327f9d`. The exact successor `685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95`, tree `f53a818928d752b842f8af2c3933aad4d82f9117`, corrects one M4 test path. Sol 6.1 High CDC independently reviewed the frozen delta and reproduced the required evidence. The successor changes only the test helper suffix. All product inputs used in the earlier independent proof are byte-identical to final.

| Row | Independent disposition |
| --- | --- |
| BE-01 | Actual CLI minified output equals the entire output of the independent Lykn graph probe with native esbuild 0.27.4. The browser/kernel/shared invocation modules and browser/core expander modules appear. Private ESTree, the Deno loader and the historical shim are absent. Four real Chromium DOMs equal accepted S04 byte-for-byte. |
| BE-02 | Four existing checked ESTree request tests and the protected-host and semantic suites give 21 tests and 56 steps, all green. Every generated private proof input equals its S04 bytes. Both default and inline-module shaken bundles omit the helper and protected lookup, retaining `provider\nuse:provider\n`. Both retained bundles export `invoke` and `marker`, keep the lookup inside the lazy helper, and print `provider\n0\n1\n` under strict Deno. |
| BE-03 | Staged public browser module/compiler and export manifests match S04. The staged changed JS files match their canonical sources. Cached frozen Deno reproduces the local, scoped and warm/reset receipts. Native old, cold and warm generated JS matches, with strict runtime `42\n`. All 22 S04 cache file hashes are unchanged. The new cache equals the complete tracked embedded payload. M4 tests recovery against its current directory. |
| BE-04 | Normal Make, standalone citations and the official pinned budget gate return 0. Full Make includes 1,167 Rust library tests and all other Rust suites, 1,494 JS/Lykn tests with 67 steps, and 482 documentation tests. Standalone citations cover 64 documents and 601 historical entries. |

The host DOM includes ordinary output, complete live and fallback programs, the ordered live trace, the exact protected-write rejection and the existing eval SyntaxError for the inline ESM fallback. The rejected write was never executed. The preserved public ESM façade still resolves the actual scoped macro alias. This proof covers macOS arm64 with the stated tools.

| Actual browser artifacts | Dev bytes | Dev gzip | Minified bytes | Minified gzip |
| --- | ---: | ---: | ---: | ---: |
| Release baseline `b0c97f4e` | 340,187 | 63,706 | 163,152 | 44,844 |
| S04 `cc806c84` | 324,326 | 60,142 | 155,089 | 42,221 |
| S05 composition | 318,148 | 58,987 | 151,673 | 41,338 |

S05 saves 883 gzip bytes. Both splits save 3,506 bytes against `b0c97f4e`. The official same-pin historical comparison remains 27,906 bytes, or +13,432 at composition. The current 81,920-byte cap has 40,582 bytes of headroom. The historical baseline archive still takes the historical loader/shim fallback. The new private files remain outside public package exports. The staged distribution has its ordinary generated declarations and rewritten manifests.

The first freeze retained an obsolete M4 helper suffix. It aliased the intentionally preserved S04 cache. The exact test-only [refinement](cc-prompt-iteration01.md) corrects that path. Both CC source commit bodies contain the required author text with a blank line separating the trailers, violating the contiguous trailer rule. The first freeze and successor remain in Git. CC's initial Chromium sandbox bootstrap and two dev fixture setup attempts are retained. Normal host Chromium execution kept the browser sandbox enabled. The scoped staged setup retry supplied the original fixture content, and independent actual outputs verify the accepted conditions. Three preliminary graph driver permission failures on S04 remain separate from the successful fixed graph recipe. These attempts are evidence of setup, with no acceptance credit.

[Independent raw and product evidence](artifacts/evidence/cdc/).
[Implementation return and receipts](artifacts/evidence/cc/).

S05 and AM-07 are accepted for the task composition. AM-05 retains its independent release-checkout gate. Local `release/0.6.x` is `b0c97f4e`.

The independent post-Make release-mode CLI reproduced the exact minified
output. Its archive-based developer build had 15 extra bytes in the sole
generated astring source-path comment. A fresh Chromium run on that
actual developer file again matched S04 exactly. The table uses the
task-checkout artifact for S05 dev bytes. The official meter reports
the same raw size. The archived developer file and exact
single-comment difference remain in the browser-build receipts.

CC created its launch files after the commands, with original raw
streams opened at launch and exact tool calls preserved separately.
Those files are postflight records. The independent proof has its own
prospective command, config absence and environment records for every
run. Initial whole-directory comparison of staged lang files reported
the expected dist-only generated declarations, build stamp and rewritten
manifest. The accepted checks compare public manifests across staged
versions and the five changed JS files to canonical source.

Source and planning prose whitespace checks passed. The full staged
planning diff check returned 2 for whitespace inside preserved command
streams, raw Git output and literal diffs. Their original bytes remain
unchanged. The full checker output is retained at
`/private/tmp/lykn-split-cdc.WZ395kwC/s05-independent/staged-whitespace.stdout.raw`.

## Subsequent local release integration

The Operator-authorized fast-forward to `685bbe1d` passed the
[fresh release-checkout gates](../artifacts/release-integration-685bbe1d.md).
AM-05 is done. The source-acceptance chronology above remains the
original task result.
