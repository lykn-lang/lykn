# Independent B1 verification receipts

**ACCEPT partial B1 only; LC-02–08 and S03 remain open.** Independent source
candidate: `3f197340dd4765df7cccb3858ef97faccb5df9fc`, tree
`9ee95765b3475c84c5f537834ecceb6b476dc794`, branch
`codex/qualified-adt-core`, task home
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`.
No source/index edit, stage or commit occurred. Root owns planning Git/index.

[Raw archive](receipts-3f197340.tar.gz), SHA-256
`7dfbceef5749cd5ba2212cb78bf5d5d3821364c551b2793b72c3596d660a8e11`.
Working originals remain at `/private/tmp/lykn-s03-b1-cdc-3f197340`.
The archive includes useful raw streams/statuses, launch data, Lykn helpers and
generated output, immutable baseline public source, configs and M6 comparisons.
Owned caches, disposable tmp and the copied executable are excluded; binary
digests and extraction comparisons are retained. Prior artifacts remain intact.

## Evidence map

`receipts/<name>/` contains actual launch argv/cwd/selected environment,
raw stdout/stderr and exit status. The capture helper is `run.lykn`.

| Receipt / file | Executed result |
| --- | --- |
| `baseline-success-leak` | Expected failing test against immutable accepted A package: leaked named value differs from cold positional value |
| `baseline-late-failure-leak` | Expected failing test after type emission followed by malformed not in Pass 2 |
| `baseline-cold-prelude` | Expected old cold decoy result; demonstrates the explicitly changed cold-prelude behavior |
| `cold-prelude-alone` | Candidate fresh-process single-test named-field result passes; 5 other tests filtered |
| `canonical-focused` | 31/31: B1 6, unchanged Not pilot 1, runway 12, owned refs 7, browser ESM 1, lazy Reflect 4 |
| `independent-driver-map-get`, `independent-results.json` | Seven supplementary Lykn probe rows: baseline-equality success/failure isolation; separate successful/failed re-entry; expr-to-expr isolation; nested value/statement match and if-let/when-let runtime; helper/export/fresh-array boundaries |
| `m6-cold`, `m6/` | Actual cold copied built CLI, no canonical cwd fallback, nine equal module comparisons and 11 actual materialized tests |
| `full-make-check` | Fresh full make check: language units 1,176; product corpus 1,519/0 across 67 steps; docs 482/0, once |
| `browser-size` | 42,405 gzip bytes, +14,775 over 27,630 baseline, below 80 KiB |
| `committed-citations` | Committed HEAD: 64 documents, 601 historical citations accepted |
| `cold-cli`, `cold-cli/result.json` | Fresh release binary copied to empty standalone cwd/empty separate XDG; macro and real guard/error runtime; nine modules plus config/lock compare equal |
| `reference-probes`, `reference-results.json` | Retained all-nine driver: 27 runtime checks across three scopes, 3 unfinished fragment rejections, shared-value compilation |
| `final-pins`, `pins.json` | Exact HEAD/tree/clean status, 12-path diff, contiguous trailers, tool versions and binary hashes |

The baseline mapping is `baseline.json`, pointing to the public package extracted
read-only by `git archive 5caf3d871a80a711c08dbda0db8c5f5446dffb56 packages/lang`.
Candidate focused tests use `canonical.json`, explicitly selecting canonical
source rather than depending on possibly stale target/lykn/build output.
Both maps retain the existing astring dependency. Baseline failures are planned
negative controls, not failures of B1.

Supplementary isolation oracles compare actual independent baseline output with
post-success/post-failure output. Product tests' fixed decoy expectations remain
legacy migration fixtures, not a promise of final qualified fallback semantics.
The two supplementary re-entry probes separately observe outer marker after
success and after a caught failing inner compilation; the failed path records
that the inner error actually occurred. Nested runtime is `[42,42,42,[42]]`.
The actual public surface module lacks resetTypeRegistry. Private metadata
patterns require context, while direct Not and literal/wildcard helpers remain
context-free. Seed-array mutation does not cross factory calls.

Rust/Cargo 1.97.0, Deno 2.9.6. Both explicit existing
`DENO_DIR=/Users/oubiwann/Library/Caches/deno` and owned npm/XDG/tmp were used.
Built release, bin/lykn and copied standalone binary all SHA-256
`091c78283a3fda26ef106dda04bff109adc32a50138d11c175ff460d82f1e87c`.

## Attempts, warnings and limits

The supplementary reviewer helper needed four corrections before its final
passing run. Preserve its named source/output versions and all attempt logs:
the first compile rejected a missing else in an expression-context catch;
the attempted follow-on run had no generated module. The next run imported
the AST array factory under array and thereby shadowed the surface array
constructor. After aliasing it, the next run incorrectly wrapped expandExpr's
multi-form output once more; after normalization, the next used indexed get
on a Map instead of Map.get. These were helper mistakes, not B1 source repairs
or acceptance failures. `independent-driver-map-get` is the final passing run.
All partial generated modules/runtime streams remain preserved.

Compiler helper builds retain existing unused-binding warnings. Full required
gates passed on their first independent invocation. Browser size retains
existing astring condition warnings and esbuild registry metadata output.
M6 parent stderr contains Deno Check progress; its successful process status
and actual 11/11 summary are checked. Every emitted runtime child still asserts
empty stderr. The CC record attests an earlier empty-parent-stderr assertion
failure; this reviewer does not reconstruct an unindexed historical raw log.

The separate package-binding carryover remains at its accepted-A witness;
this review neither fixes nor expands it. No typed owner/case identity,
lexical owner/alias semantics, qualified/nominal values, precise DTS, private
purity or final migration acceptance follows. I4, version-sentinel warm-cache,
legacy fallback and eval-based browser run/load limits remain unchanged.
