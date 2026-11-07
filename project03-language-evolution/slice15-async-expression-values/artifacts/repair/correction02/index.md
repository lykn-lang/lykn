# Correction02 freeze and corrected baseline

Correction02 is preserved across source commits `e9dd7b1` (the four corrected
fixture bodies and exact expected JSON) and `babe580` (formatting of the
corrected fixtures and both test harnesses). Planning commit `19afaa6` records
the corrected prediction table. E3 remains the original body from `5b11f49`;
its SHA-256 is `bc7a7b23007b80f10b298145e36a859d0a108a70537139e85628c3986a1d21fb`.
The first freeze/oracle and all initial baseline records remain untouched.

Correction count: this is correction `2/5`, leaving three for the unit. The
first native expectation-storage fix remains correction `1/5`. No product source
or embedded mirror has been changed. All five fixture slots executed on both
backends after correction; the full raw transcripts contain each source,
expected JSON, generated JavaScript, runtime stdout/stderr and exit before
assertion or temporary-directory cleanup.

## Source checks and formatter history

`pins.md` records task branch, executable identities, toolchain, exact runtime
commands, and the successful no-run build. `source-check.log` checked all five
corrected drafts (five source files parsed successfully). The first
`source-format-check.log` correctly reported five unformatted drafts. The
formatter was then mistakenly run on all five paths, including read-only E3;
the accidental E3-only diff is retained in `e3-format-scope-incident.patch`.
E3 was immediately restored from immutable `5b11f49` and its exact hash
reverified. The format write was then committed only for E1/E2/E4/E5. Final
`source-check-final.log` confirms all five parse, and
`source-format-check-final.log` confirms the four permitted corrected fixtures
are formatted. E3 was excluded from the final format check. Initial Rust and
JS formatter-check failures and subsequent successful checks/writes are retained
in `rustfmt-check-before.log`, `rustfmt-write.log`, `rustfmt-check-after.log`,
`jsfmt-check.log`, `jsfmt-write.log`, and `jsfmt-check-after.log`.

## Corrected baseline outcomes

| Raw file | Command/result | Observation |
| --- | --- | --- |
| `native-build.log` | `cargo test --offline --locked -p lykn-cli --test async_expression_values --no-run`, exit 0 | Corrected Rust harness and current-source CLI were built before execution. |
| `js-runtime.log` | Pinned command in `pins.md`, exit 1 | All five JS fixture steps ran. E1 matched exact JSON; E4 matched exact JSON. E2 generated `return await` inside a synchronous IIFE and failed module load. E3 retained the expected await-in-sync-IIFE syntax failure. E5 generated invalid `return throw` in the selected awaited value branch. No other fixture values were inferred. |
| `native-runtime.log` | Pinned command in `pins.md`, exit 101 | All five Rust fixture loop positions ran. E1 exposed lost branch values and no-else expression handling. E2 generated sync-IIFE await syntax failure and its both-awaited do value was lost. E3 retained the expected await-in-sync-IIFE syntax failure. E4's sync builder returned no callback. E5 generated invalid `return throw`. Full fixture outputs and individual exits are present in the transcript. |

The two public-JS positive controls and the native failures distinguish actual
compiler behavior from source-read/setup failures. E2/E5 defects are inside the
approved NE-C09 scope, not additional unrelated gaps. The only scope incident
was the transient formatter write to E3; its before/after bodies are verified
identical and the diff witness remains preserved. No parser or product compiler
repair began before this corrected red was established.
