# CDC independent verification

## Phase A accepted — 2026-11-06

Reviewer `/root/cdc`, Sol6.1 High; executing contributor `/root/cdc/repair_cc`,
Luna6 High. Reviewed clean planning4700e286dd462412c6f3a7302be174c8b6d403c1
and unchanged source b841f71b30eb2c3e340a651ae1d57de04fec3d79. Read the full
source-grounded return, six frozen source files, generated P5 and the actual
reader/template functions, normative ID-33, tag/dispatch and legacy tests.
The initial prediction/case freeze41fba58 precedes all case compiles/runs;
intake/freeze raw commit bodies have proper contiguous trailers.

CC's empty cwd is under the task repo. Source config.rs200–230 walks ancestors,
so it can inherit project imports; no program imports/defines macros. This is
a context qualification, not a claim its configuration was isolated. I exported
the same immutable41fba58 six sources and independently replayed with an explicit
nearest empty project.json in owned task `target/slice08/cdc-diagnosis/`.
Actual compiler hash e69f67f4cbc8cda4b9a3a82436bd3375f277d68c45387dae7ac7fc2a9ba32ae8
and Deno hash2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74
were checked before execution. Exact shell trace/config/stdout/stderr/emitted JS
are copied to `artifacts/diagnosis/cdc-baseline/`; no new source/backend variant.

All six strict compiles exited0; P1/P2/P3/P4/P6 runtime0, P5 runtime1. Parsed
actual JSON strings to Unicode scalar arrays in tool orchestration:

| Case | plain/interpolated | concat/ICU |
| --- | --- | --- |
| P1 | 92,110 | 10 |
| P2 | 92,34 | 34 |
| P3 | 10 | 10 |
| P4 | 13 | 10 |
| P5 | all four unestablished: generated-JS delimiter SyntaxError | unestablished |
| P6 tag raw | not applicable | 92,110 on both paths |

Thus18/22 values established, four unestablished; six value losses among the
16 established ordinary/cooked fields. I also ran the focused native
codegen::emit::tests::test_template prefix offline/locked: exactly the three
assigned unit tests pass. Other test binaries report zero selected tests;
their suites are not claimed covered. This reproduces the contrast between
green printed-source tests and broken source/runtime preservation.

Disposition TE-01 done. ID-33's decoded-value MUST, actual reader behavior and
literal/interpolation contrast support a narrow JS-source encoding correction.
There is no remaining Operator language choice in this evidence: the old C6b/D2
assertions must be reconciled with actual runtime values, not preserved as policy.
This does change the old manually constructed template-AST emitted text and
post-expansion tag raw representation; that compatibility consequence must be
explicit in tests/comments. Cooked strings preserve their input values; raw
remains the actual normalized generated-JS spelling, not original Lykn lexemes.
No all-escape or JS-runtime claim is established by the native-only diagnosis.

Before implementation I additionally inspected public packages/lang/mod.js::lykn
(strict default-on), the actual testing helper's lax/text-only limits, canonical
JS template helper/concat/ICU callers, native shared ICU printer and the
compile-time embedded mirror/cache path. Root's bounded mirror/cache lookup was
rechecked against source: include_dir! embeds the mirrored package; cache hits
are version-only. Sync/verify the mirror and use fresh owned XDG_CACHE_HOME for
existing focused macro validation. Global-cache migration is a separate NE-C04
candidate, not an implied fix. `deno info --json` identifies accepted existing
DENO_DIR=/Users/oubiwann/Library/Caches/deno. Pinned local `deno types` verified
execPath/makeTempDir/writeTextFile/remove/Command.output/clearEnv APIs for the
new product regression; no new eval helper or dependency is needed.

`cc-prompt-iteration01.md` supplies the concrete repair and native/public-JS
runtime proof. Frozen pilot remains held until its independent acceptance.
No source implementation was authored or accepted during this diagnosis.

The full staged whitespace check flags only the verbatim kernel-test log's
terminal blank line; retain raw bytes. Changed planning prose passes its
explicit-path check. This is not a skipped source validation gate.

## Repair accepted — 2026-11-06

Reviewed CC return a87b3286d9375d5c2c1cfdd0090e902483ea68e8 and clean source
a061c2149792178ba037d17a31220545e34b4ac1. Complete source/test review found
exactly13 authorized paths. Native encoding uses borrowed input and per-scalar
backslash/CR/delimiter/$ handling; JS raw encoding orders backslash before CR
and delimiters while cooked remains original. Canonical/embedded JS are byte
identical. Both shared modes use these helpers; no reader/AST/cache-policy change.
Legacy assertions are explicitly reconciled, with the first native test now
actually forcing concat. All six product fixture bodies remain the frozen inputs.
The native and public strict-JS harnesses execute real modules, validate shapes/
all scalar fields and fail on missing tools, syntax/setup errors or mismatches.
No eval helper, lax normalization substitute, case skip or test deletion.

Inspected actual native/public-JS expected-red observations from the test-only
commits:10 matching targets, eight mismatched fields (six cooked plus two new
raw representation targets), four P5 values unestablished. This is distinct
from Phase A's observational raw values. Naming correction retained the exact
JS body and red history; repository source-test suffix now matches .gitignore.

I independently ran the native regression offline/locked with nocapture and
the focused public-JS test:22/22 each, six compile/run successes and empty child
stderr. Read every native record and projected all six JS observation records
to exact Unicode scalar arrays: plain/interpolation/concat/ICU agree for P1–P5,
including CR13 and delimiter values; P6 raw is92,92,110 on both paths. Own fresh
XDG D2 route passed and actually materialized compiler.js byte-identical to
canonical. Full unfiltered own `make check` then exited0:1467 JS+Lykn tests
(six new steps),482 docs, all native gates including accepted predicate17 and
new template regression. Standalone cited-path gate also0. Own actual raw logs
are in `artifacts/repair/cdc-review/`; source whitespace diff is clean.

The full gate used only explicit owned XDG_CACHE_HOME/npm_config_cache and
the accepted existing DENO_DIR=/Users/oubiwann/Library/Caches/deno. Legacy npm
compatibility tests remain included; no global-cache migration or dependency
update is claimed. Unchanged lock672c8bf…813ce, task release/bin compiler both
544041ecf2ff61a9b1b3338ed08728a12db549a69dbcadfa644a30d39bfb908a;
canonical/mirror/materialized compiler text50db21ce3d1f30325e9541c284cb37ffdc3f6e93bad55521a26cd6b4734ac1f4.
No remaining repair finding. TE-02/03 done; TE-04/05 remain held until the
preserved iteration03 executes the original frozen pilot. NE-C04 cache identity
and NE-D01 dispatch prose have real separate backlog owners. No release merge
or broader source/Unicode/audit correctness claim follows this acceptance.

Acceptance staging preserves terminal blank lines in the four actual native,
JS, D2 and make-check logs flagged by the full whitespace check. Prose and the
actual source diff pass their checks; raw output is not normalized to hide it.
