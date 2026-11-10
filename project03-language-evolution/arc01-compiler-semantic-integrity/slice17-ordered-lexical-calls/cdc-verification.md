# Independent verification of S17

Accepted exact `b6df89685b2c9cdddd665da20895f17a560624b6`,
tree `a83600b8fd5d12c236b8673ec73eaf00ae4a8d58`, on
`codex/completion-value-flow` in the existing task checkout.
Luna 6 High CC proposed OC-01 through OC-04 as passing after
separate focused and full gates. Sol 6.1 High CDC independently
reviewed exact source and reproduced the final gates after
exclusive clean return. Release `6c9dbd5c` remains clean.

| Row | Independent disposition and retained proof |
| --- | --- |
| OC-01 | Done. F1 native and public strict runtime both emit the exact expected trace. The generated call saves the original callable and earlier argument before the lifted reassignment. The early branch exits without later effects. |
| OC-02 | Done. F2 both backends emit the exact expected trace. The lexical `and` remains a call, return skips it, and a noncallable value produces TypeError only after both argument effects. |
| OC-03 | Done. Both actual native kernel JSON artifacts parse and match the CC artifacts byte-for-byte. Public original, clone and JSON round trips give the same module. F3 native exits 1 at 2:3 with the exact checked diagnostic, no JS or DTS. The public exact throw passes. |
| OC-04 | Done. Independent native 38/38, public 9 tests with 34 passing fixture steps, normal Make 0 and standalone citations 0. The native and public modules match their respective CC artifacts. Source is exact eight paths versus release, with no public AST/API changes. |

Full Make reports 1,166 Rust library tests, 1,488 JS/Lykn tests
with 58 steps and 482 documentation tests. Clippy and formatting
pass. Standalone cites checks 64 documents and accepts 601
historical citations. Every independent launch has its exact
prospective argv, cwd, scoped env and 64 named absence checks.
The direct native runner, compiler and pinned Deno remain
byte-identical before and after focus. Final task `bin/lykn`
and `target/release/lykn` are both
`d65b3e8f747d59f8e9a10320ef0c568ce45a47b8efa8c1f61c3d4b1be4a19301`
and agree with CC. Canonical, embedded and independently freshly
materialized expander bytes agree. The full materialized package
tree matches the repository embedded package tree.

[Independent complete gate streams and selected module
receipts](artifacts/evidence/cdc/final-b6df8968) include exact
F1/F2 stdout, empty strict runtime stderr, full JS and kernel
artifacts. Native compile and kernel JSON can report unused
parameter warnings. They are separate from runtime stderr.
Actual CC focused proofs remain attributed to [41e2969a public
and native](artifacts/evidence/cc/focused-41e2969a) and [f60b33dc
native](artifacts/evidence/cc/before-format-f60b33dc). The final
CC [normal Make and cites](artifacts/evidence/cc/final-b6df8968)
ran on b6df, after the token-equivalent formatter correction.

The [old 3572cf05 baseline](artifacts/evidence/cc/old-3572cf05)
retains native 35 passes/3 red and public 32 passing shared
steps/2 red, with 7/8 standalone controls passing. Both old
backends consumed the source return as an argument value.
The old mixed spread compiled successfully and was never executed.
These are expected old observations, not candidate failures.

Corrections preserve the first static test freeze, original
product freeze, corrected candidate and actual normal Make
formatter failure. Format-only b6df removes no oracle. The
source-aware emitted name exclusion keeps direct eval on its
existing route. The native spread marker check follows the actual
writer's tolerated raw arity only on the mixed lifted route.
No extra fixture was executed for either source-review edge.

This accepts genuine bare lexical calls in the bounded direct
function region. Member/receiver, computed references, assignment,
iterator transport and opaque eval remain separate I3 work.
Checked and deferred exits remain I4. Parent CV-04/CI-04 stay open.

Planning prose and product source pass their scoped diff whitespace
checks. The aggregate staged archive check exits 2 on trailing
whitespace and blank EOF lines in verbatim raw streams, including
the formatter output and test summaries. Those bytes are preserved.
