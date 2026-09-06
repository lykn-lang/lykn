# Browser bundle size check

Run the CI comparison with **Deno 2.7.7** and the committed dependency lockfile:

```sh
make bundle-size-check
```

The command exports the original DD-37 pre-pilot source from fixed commit
`4b9546cdba6bdcd4e5dd82d7cdf6cf58da9edde0` into a temporary directory, then
measures it and the current source using the same script, configuration,
dependency lockfile, and runtime. It bundles `packages/browser/mod.js` with
esbuild, minifies it, and compresses it with Deno's `CompressionStream("gzip")`.
Growth above 2,048 bytes warns; growth above 5,120 bytes fails.

The historical commit must be available locally; CI fetches full history. A
missing baseline or failed measurement fails the check. The temporary source
export is removed on exit. `make bundle-size` remains available to measure only
the current working tree; `BASELINE_GZIPPED` optionally supplies a manually
calibrated comparison value for that command.

The bundle CI job pins Deno and rebuilds both revisions because compression
output depends on the runtime and platform. Other CI jobs test current Deno. The Make target uses a frozen
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
for the current source on both Deno 2.7.7 and 2.9.6. Pinning the runtime alone
therefore did not repair the comparison: the baseline must also be measured
on the same platform. The historical 27,630-byte observation remains evidence;
it is not a portable compression constant.

Before upgrading the measurement runtime or bundler, reproduce both the
historical baseline and current source with the proposed tools. Record the
versions, platform, and raw/minified/gzipped sizes. Any baseline recalibration
must use the original baseline source, with the warning and failure allowances
reviewed separately; do not reset the baseline to the latest bundle merely to
make CI pass.
