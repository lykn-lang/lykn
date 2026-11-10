# Independent verification of selected completion headers and lazy operands

Accepted 2026-11-10 by Sol 6.1 High CDC after Luna 6 High CC
explicitly returned clean source, index, build, runtime and
raw ownership. CC proposed HL-01 through HL-03 done, and
reported its HL-04 gates passed with the separate review
pending. The independent results below close all four rows.

Exact task `6c9dbd5c38f16674c7b95315bd32bfee9fd131e5`, tree
`d9ce3a36e164252740d9ac29f712c85add99a0de`, on
`codex/completion-value-flow`. The exact delta from accepted
S15 `0526910d` is six implementation/docs and six test/fixture
paths. The final correction changes one pure-control fixture
line and leaves production unchanged.

| Row | Disposition | Independent evidence |
| --- | --- | --- |
| HL-01 | Done | H1 returns 80 from a discarded if test and 81 from a consumed test. Both normal paths select one arm and preserve the actual effect order and original bind. |
| HL-02 | Done | H2 proves subject once before candidates, its early exit skipping the guard, guard-local pattern visibility and early exit, false advancement and final normal fallback. |
| HL-03 | Done | L1 preserves actual 0/string results, skips both untaken abrupt operands, keeps the ordinary bound call and pure direct expression. L2 keeps 0/false and uses strict null or `void 0` before the reached early return. |
| HL-04 | Done | Separate exact scope, focused CLI/native/public, whole modules, normal Make/cites, producer identities and real fresh embedded-package equality pass. |

[Fixture comparisons](artifacts/evidence/cdc/final-6c9dbd5c/fixture-comparisons.txt),
[native modules and phase receipts](artifacts/evidence/cdc/final-6c9dbd5c/native-fixtures/) and
[public modules and child receipts](artifacts/evidence/cdc/final-6c9dbd5c/public-fixtures/)
retain all eight current children. Each exits 0 with exact
JSON plus LF and empty runtime stderr. The complete module
matches the corresponding final CC module byte-for-byte.
All native checks and strict compiles exit 0, produce JS and
leave DTS absent for these unexported fixtures. Aggregate
runner streams retain the actual tool and evidence logging.

[Independent full Make](artifacts/evidence/cdc/final-6c9dbd5c/make/) exits 0 with Clippy,
format, Lykn lint, all Rust including 1,166 library tests,
1,487 JS/Lykn tests with 56 steps, and 482 docs cases.
[Standalone cited paths](artifacts/evidence/cdc/final-6c9dbd5c/cites/) exits 0 for 64
documents and 601 historical citations. Independent grouped
no-run and explicit CLI build exit 0, native 35/35 passes,
and public reports 32 shared steps and seven standalone
controls. Normal Make uses ordinary pinned Deno 2.9.6 PATH
with both test-only vars unset. Separate per-gate TMPDIR,
XDG_CACHE_HOME and npm cache roots were precreated, and
144 exact named config files were observed absent before
launches. The fixed DENO_DIR and Rust/Cargo 1.97.0 are recorded.

[Focused CLI/runner/Deno pins](artifacts/evidence/cdc/final-6c9dbd5c/focused-pins-before.txt)
remain verified after direct use. [Post-Make identity](artifacts/evidence/cdc/final-6c9dbd5c/post-make-pins.txt)
separately records the changed debug hash and byte-equal task
release and installed binaries at SHA-256
`e9d4c9a12d9653f85f5a3673e5895eb02b972b94bc6be781d712bb449be7da44`.
[Fresh package comparison](artifacts/evidence/cdc/final-6c9dbd5c/materialized-byte-check.txt)
matches the full embedded package and both canonical/embedded/
build/fresh-XDG JS copies.

[Final CC receipts](artifacts/evidence/cc/final-6c9dbd5c/)
retain the separate owned commands and full successful gates,
including the file lint. Its environment file lists owned
directories and fixed-cache ancestry. The separate CDC
receipt retains the complete exact named-file absence result.

## Baseline and corrections

The first six-path test-only freeze `964af49a` added fixture
entries without calling them in the native runner. CDC missed
the missing registered tests during the initial static read.
CC caught it before launch and committed the exact four runner
calls at `e054a0cf` at 03:53:53 CST, six seconds before the
[formal correction prompt](cc-prompt-iteration01.md) was
committed. The actual commit used its own preserved `-F`
body with both trailers. Function names differ from the
concurrent prompt sketch. Both immutable source states remain.

[Old evidence](artifacts/evidence/cc/old-e054a0cf/) retains a
wrong initial Cargo test-wrapper invocation with the serial
runner flag and a missing evidence directory. It exits 101
with 35 receipt setup failures and zero behavior. A serial
retry reaches the four expected reds. It is separate from the
original required direct native run. The direct old runner
later records 31/35, exit 101. Public has 28/32 shared steps
and all seven standalone controls, exit 1 overall. Each new
native check, strict compile and runtime exits 0 with JS
present and DTS absent. Each new public runtime exits 0.
Both backends yield the same wrong trace per case. Complete
modules show the local synthetic returns.

First production freeze `71f52728` was statically held
without execution. Its public consumed-if path still used
the old condition route. [Correction 02](cc-prompt-iteration02.md)
supplies the prefix there and keeps the first native logical
statement operand lexical. Its clean `009894b6` focused gates
pass on all native/public cases. The first full Make exits 2
at source lint for L1's literal default-like pure `or`.
The exact [earlier focused and failed Make evidence](artifacts/evidence/cc/first-current-009894b6/)
remains at its own source. Earlier standalone citations pass.

CC used scratch initially reserved for CDC for those current
focused and Make runs. The manifest and raw product results
there are CC's, and CDC had launched no product command there.
CC's initial pins file contains actual missing-path hash
errors, retained byte-for-byte. CDC's later check of that
scratch does not retrofit prospective CC proof. Corrected CC
and separate CDC launches use new owned scopes and exact paths.

[Correction 03](cc-prompt-iteration03.md) at `6c9dbd5c`
changes one pure control operand from a literal to a pure
logical expression. It preserves the exact expected value,
bound and lazy traces, and operator/control roles. The first
input remains in Git and earlier raw. The four old transfer
failures were observed on the original frozen sources. This
test-only update does not rewrite the old run.

## Completion boundary

This accepts the remaining selected direct I2 tranche with
S09, S12 and S14–S16. It covers selected ordinary named-function
statement match progression, direct return/bind destinations
and the eligible if/match tests and lazy operands here. The
source leaves that require ordered calls, member/assignment
references or spread remain explicitly held for I3. This is a
source/acceptance boundary. This slice did not execute an
ordered-leaf case or establish an emitted diagnostic.
Checked outgoing results, finally/deferred/async composition
and wider acceptance remain I4/S04 obligations. CV-04 and
CI-04 remain open. The [independently verified local release](../slice13-structural-match-and-kernel-escape/artifacts/release-integration-31893710.md)
is clean at `31893710`.

The scoped source, product-test and planning prose whitespace
checks pass. The full staged archive whitespace check exits
2 on retained raw-stream whitespace and blank EOF lines.
Archived raw bytes retain original formatting.
