# Browser bundle size check

Run the CI measurement with **Deno 2.7.7** and the committed dependency lockfile:

```sh
BASELINE_GZIPPED=27630 make bundle-size
```

The command bundles `packages/browser/mod.js` with esbuild, minifies it, and
compresses it with Deno's `CompressionStream("gzip")`. Growth above 2,048 bytes
warns; growth above 5,120 bytes fails. The baseline remains the DD-37 pre-pilot
measurement from commit `4b9546cdba6bdcd4e5dd82d7cdf6cf58da9edde0`.

The bundle CI job pins Deno because compression output is part of the measuring
tool. Other CI jobs continue to test current Deno. The Make target uses a frozen
lockfile so dependency resolution cannot silently change the measurement.

## Calibration and runtime upgrades

A controlled comparison on macOS arm64 on 2026-09-06 used the same source,
esbuild 0.27.4, and astring 1.9.0 with two Deno versions:

| Source | Minified bytes (both runtimes) | Gzip, Deno 2.7.7 | Gzip, Deno 2.9.6 |
| --- | ---: | ---: | ---: |
| DD-37 baseline, `4b9546c` | 105,439 | 27,630 | 27,906 |
| Before Arc16 implementation, `c58c82c` | 119,918 | 31,422 | 31,766 |
| Before planning reorganization, `ba48a24` | 123,436 | 32,438 | 32,808 |

The unchanged baseline itself grows by 276 compressed bytes on Deno 2.9.6.
Comparing both source revisions on Deno 2.7.7 gives 4,808 bytes of growth; on
Deno 2.9.6 it gives 4,902. Both remain below the unchanged 5,120-byte limit.
Comparing the new runtime's output against the old runtime's stored number
instead produces a false failure. Linux CI on Deno 2.9.6 reported 32,807 bytes
for the current source, showing an additional one-byte platform difference.

Before upgrading the measurement runtime or bundler, reproduce both the
historical baseline and current source with the proposed tools. Record the
versions, platform, and raw/minified/gzipped sizes. Any baseline recalibration
must use the original baseline source, with the warning and failure allowances
reviewed separately; do not reset the baseline to the latest bundle merely to
make CI pass.
