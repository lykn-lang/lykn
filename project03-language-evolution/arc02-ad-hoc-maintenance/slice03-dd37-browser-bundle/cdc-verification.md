# Independent DD-37 regression disposition

Luna 6 High CC performed the bounded measurement assignment.
Sol 6.1 High CDC inspected source and independently reproduced the
decisive measurements. The root coordinator supplied an independently
recorded release gate, version-pinned checkpoint timeline, and
diagnostic attribution. The exact source is `487ebdbb` throughout
this investigation. The [local integration](../../arc01-compiler-semantic-integrity/slice22-ordered-argument-spread/artifacts/release-integration-487ebdbb.md)
already passed normal Make and citations in the release checkout.

## Fixed gate and chronology

The current CI job invokes the real `make bundle-size-check` with
Deno 2.7.7. Local runs use the official macOS arm64 executable,
locked esbuild 0.27.4 and astring 1.9.0, the same current meter and
config, and the fixed baseline source `4b9546c`. The release and
task comparison has an allowed ceiling of 33,026 gzip bytes on
this measurement platform. Raw and minified sizes remain separate
from the gzip acceptance predicate. The old calibration document
is historical evidence. Its two Deno gzip observations do not
replace the measured baselines used by the actual commands here.

| Selected source | Gzip bytes on Deno 2.7.7 | Against 33,026 |
| --- | ---: | ---: |
| Fixed original `4b9546c` | 27,906 | −5,120 |
| `4dded883` | 32,979 | −47 |
| Template encoding `a061c214` and merge `f7056556` | 32,991 each | −35 |
| Preserved unaccepted draft `45fc835c` | 33,211 | +185 |
| Reviewed async correction `0fe6663c` and later `8f5d1990`/`62e9531e` | 33,473 each | +447 |
| Host protection `e7b44c1c` | 36,348 | +3,322 |
| Host support `d73601a5` | 37,546 | +4,520 |
| Clause and kernel fixes `31893710` | 39,836 | +6,810 |
| Direct I2 `6c9dbd5c` | 41,830 | +8,804 |
| Release and task `487ebdbb` | 44,844 | +11,818 |

The first measured crossing on this package-changing range is
the preserved draft. The accepted async correction was already
447 bytes over. This chronology localizes crossing before I3
without blaming a single latest commit or treating intervening
subsystems as independent compressed contributions.
[Version-pinned timeline](artifacts/evidence/root/timeline-2.7.7)
and [actual release gate](artifacts/evidence/root/release-gate).

## Module contribution and code shape

The diagnostic native esbuild run externalizes `node:path`
instead of using the production shim. It identifies included
minified bytes by module. These bytes do not measure independent
gzip savings. The expander grew from 20,015 to 41,269 bytes.
The compiler grew from 31,076 to 33,498. The surface family
rose from 28,741 to 37,908 across classifier, helpers, surface and
surface AST. New protected-host, binding and host-invocation
contributions are 9,216, 6,800 and 5,819. Astring remains 15,809.
No duplicate third-party contributor appeared in this diagnostic
graph. [Actual metafiles and command](artifacts/evidence/root/attribution).

The browser entry uses the same public reader, expander and
compiler as the language package. The real CLI browser build
uses the throwing node:path shim. The README documents inline
macros and unavailable imported macros in browser. The underlying
ESM expander still supplies working Deno macro file/registry routes.
The compiler's private ESTree bridge has test callers. Normal
browser expansion instead materializes checked ordinary kernel
calls before compile. That suggests a possible specialization,
with the private bridge and accepted public routes retained.

## Controlled size cuts

| Condition | Minified bytes | Gzip bytes | Gzip saved | Above cap |
| --- | ---: | ---: | ---: | ---: |
| Unmodified `487ebdbb` | 163,152 | 44,844 | — | 11,818 |
| Browser macro filesystem call severed | 153,885 | 41,809 | 3,035 | 8,783 |
| Private ESTree hooks bypassed | 159,651 | 43,926 | 918 | 10,900 |
| Both cuts together | 150,385 | 40,901 | 3,943 | 7,875 |

CC ran the unchanged Make gate and same-source archive meter.
The first command stopped before Make because `env -u` followed
assignments. The raw exit 127 and error are retained. The corrected
actual gate returned Make status 2 from the real budget failure.
The retry shares the original owned roots. CC records the exact
meter argv and archive identities for the four controlled
observations. Its variant receipts do not establish the full
prospective config and environment readback requested for each
launch. [CC control and cut receipts](artifacts/evidence/cc/).

The independent task gate and combined archive use actual
`make bundle-size-check` and separate configuration-free owned roots.
They each returned 2 at the original threshold. Their 56 named
configuration checks per launch, exact prospective command, pins
and raw outputs are preserved. The independent combined source
files match both CC scratch files byte for byte. Task and archive
measurement input hash manifests match exactly. Some raw build
lengths differ across runs. Minified and gzip values agree for
both decisive conditions. [Independent task gate](artifacts/evidence/cdc/task)
and [combined replay](artifacts/evidence/cdc/combined).

The macro cut removes real Deno ESM behavior and changes browser
diagnostic paths. The bridge cut removes an accepted private AST
request route that its own tests exercise. It retains the separate
ordinary kernel direct, clone and JSON routes. Neither cut is a
production candidate. Even their optimistic combination is still
7,875 bytes over. The measurements do not provide a small
behavior-preserving route to the current budget.

## Ledger and remaining decision

DB-01, DB-02 and DB-04 are independently done. DB-03 stays open and
has parent AM-05 ownership. The source branch remains exact clean
`487ebdbb`. This preserves existing browser behavior and the
historical meter, lock and allowance as actual source identities.
There is no modified product to accept or integrate. The current
gate is genuinely red.

The Operator owns the choice between keeping the cumulative
historical allowance and commissioning a larger compatibility-
preserving compiler design, or authorizing a different release
budget while retaining the same historical source and continuing
to report its growth. An incremental budget would be a separate
policy choice with an explicit comparison basis. The original
DD-37 design discussed per-PR sign-off, while the live check
enforces a cumulative fixed-source threshold. The original design
does not grant a new waiver. [Original DD-37 design](../../../project02-language-toolchain-alignment/arc03-compiler-coherence/artifacts/design/05-active/0047-dd-37-js-surface-compiler-architecture.md).

A larger same-contract effort would need a concrete design and
actual proof for the shipped synchronous browser compiler, its
macro diagnostics, accepted host and completion behavior, and
real CLI artifact. Both proposed cut seams are candidates to
investigate, not an estimate of the whole recoverable budget.

Scoped planning prose passes the whitespace check. The aggregate
staged check returns 2 on preserved raw streams and patch context.
