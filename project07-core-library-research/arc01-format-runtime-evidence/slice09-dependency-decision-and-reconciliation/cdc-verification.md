# Slice09 independent CDC verification

2026-09-13. Reviewed CC commits **f8a3ff9** and **c90141f** from clean planning
HEAD c90141f. **All six DD criteria are independently verified and closed.**
No parent DB criterion, document implementation or operator policy acceptance
is inferred. CC's [closing report](closing-report.md) and sealed evidence remain
unchanged. Source home is **unassigned pending design**, as the operator directed;
that instruction supersedes the opening contract's immediate home-selection
requirement. Arc03/Slice08 DR-04 remains open.

## Independent reproduction

Fresh scratch: `/private/tmp/lykn-p07-dd-cdc.fUC1Vq`. Rehashed the already accepted
isolated CLI at `/private/tmp/lykn-p07-lc-cdc.0IMone/source/target/release/lykn`:
`d4a7028ebba234ffcd6fdb544c256489d22b840da2e94e0aa833b0520c834326`.
This was reuse, not a new build. Deno 2.9.6 hash:
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.
Live source HEAD/tree match 4dded883bbd321d19635e6fce233343f33803f9e /
218b085176053f1273642496cf75d7691c399f6e; source worktree is clean and unchanged.

| Verification | Independent result |
| --- | --- |
| Sealed CC packet | SHA-256 `3f650e03e49dde79af0781310b1a90a7d25385c519bb89fe658d52f5abb5ccde` |
| Lossless extraction | 5,257 files; 15,771 path/encoding/length/hash checks passed |
| Native preparation replay | 1,063 checks; five packages; 98 std upstream roots |
| Native graph/source replay | 4,886 checks; 4,587 regular source files; 15,618 lexical reference lines; 30 interval paths |
| Generated artifacts | Both inputs.json and dependency-graphs.json byte-identical to canonical files and separately preserved extracted originals: four cmp checks passed |
| Direct source crosswalk | Actual Git interval matches; all 15 embedded/source pairs and four relocated root licenses byte-identical |
| Original input crosswalk | DB, JSON, YAML-preflight, FF manifests and original FM01/RP01 match their canonical files byte-for-byte |

The unchanged reviewed Slice04 packet tool was checked, linted, compiled and its
emitted capture/extraction code inspected. Native DD audit received the same
gates and emitted review before `prepare`/`graphs`. Existing unused-binding
compiler warnings remain in receipts; lint reported no findings. No generated
source was patched, no candidate module evaluated, no package installed and no
source/build/test suite altered. No new CDC authoring failure occurred. Two
initial file lookups used the wrong suffix/name and were corrected as read-only
navigation; one Markdown line-joining typo was corrected before validation.

Literal [CC replay protocol](artifacts/baseline-and-protocol.md) works. First
inspect `transport/archive-symlinks.txt` and the four mode-160000 entries in
`transport/eemeli-tree.json`, then restore its five named empty directories.
Those are archive layout, not invented source files or fetched submodules.
Use a new empty destination, empty native config/version-5 lock, clear environment,
null stdin, cached-only/frozen mode and the protocol's exact read/write grants.
Graph absolute URLs remain historical locators and are not dereferenced by replay.

Separate [CDC receipt packet](artifacts/cdc-raw-transcript.txt) retains audit and
packet source/emitted bytes, native config/lock, raw independent gate/replay
receipts, hashes, source checks, before-ledgers and planning verification inputs.
Extract it with the same reviewed packet tool into another new destination.
Its `payload/replay.md` explains the two-packet replay; the 83MB CC packet remains
the authoritative source corpus and is referenced by hash, not duplicated here.

## Source and decision review

Read the full DD audit, inventory, decision record, authoring record, closing
report and Arc03/Slice08 plan/ledger/prompt. Reconciled all five graph summaries:
runtime 67 modules/144 dependency records; published development 168/453 with
three missing URLs; selected upstream development 257/705; Eemeli 124/654 with
five missing files and 53 edge errors; compiler 15/23 with unresolved npm/astring
and node:path. Full captured graph objects survive the replay. Path categories
and lexical matching are search aids, not semantic parsing or proof of dynamic
closure; the inventory explicitly states that limitation.

Inspected every retained publication diff: 147 identical files, 37 changed
files (35 std import rewrites and two Eemeli type-import path rewrites), four
relocated licenses, 188 total. License relocation was independently compared.
The JSONC excluded test harnesses and repository-relative streams test import
explain the three original published development failures. The separate upstream
graph does not repair or erase those original failed URLs.

Critical source locators, relative to extracted CC `payload/`:

- `upstream/std/yaml/mod.ts:1–10`, `upstream/js-yaml/LICENSE:3` and its
  package.json establish retained js-yaml ancestry and historical dependency
  declarations. `upstream/std/deno.json:13–14,43` retains npm development entries
  and the JSONC publication exclusion.
- `prior/published/eemeli/yaml/2.9.1/src/{log.ts,compose/composer.ts,parse/parser.ts}:1`
  and `src/schema/yaml-1.1/binary.ts:1` import node:process/node:buffer.
  `prior/upstream/eemeli/config/rollup.browser-config.mjs:1–35` imports npm build
  tools and substitutes Buffer/emitWarning with null plus an env object.
- `transport/eemeli-tree.json:224,389,1324,1394` identifies all four unexpanded
  gitlinks and exact commits; `.gitmodules` identifies their repositories.
  Empty directories do not establish their contents, licenses or dependencies.
- `upstream/std-jsonc/jsonc/testdata/{JSONTestSuite,test262}/README.md` preserves
  copied-corpus commits and notices; `transport/test262-LICENSE` retains the
  latter notice. The actual release receipts are `transport/std-release.json` and
  `transport/eemeli-release.json`, each inspected for its immutable commit.
- `source/export/packages/lang/expander.js:16–31`, compiler config/lock and
  `source/full-interval.diff` distinguish existing compiler npm/Node dependencies,
  packaging copies, workflow/build changes and launcher changes from candidate
  runtime behavior. None supplies a new-library exception.

The dated official receipts support observations at retrieval only. No fresh
internet refresh, npm executable transitive closure, generated browser build,
signed registry provenance or reconstruction of upstream publication was performed
by CDC. These are explicitly unavailable/unverified boundaries, not clean graphs.
The inventory's qualified claims survive those limitations.

The five alternatives connect existing behavior evidence to source fidelity,
value domains, ADT/Result validation, resource/file policy and maintenance work.
They are reviewable proposals. In particular, actual OS failures remain distinct
from read-denial controls, and file replacement does not prove crash durability
or conflict policy. Arc03/Slice08 is a concrete committed design prerequisite
with decision owner, five criteria, original 28 Y-14 coverage and later API/graph/
source/build acceptance gates. It has not been executed. The operator's c90141f
deferral selects no repository or maintainer and authorizes no repository creation.

## Six-row closure and bubble-up

| Row | CDC disposition and evidence |
| --- | --- |
| DD-01 | Done: independent identities, packet/manifest replay, actual Git interval and canonical original-input comparisons |
| DD-02 | Done: full captured graphs/source census reproduced; missing development/build/generated/submodule boundaries explicitly qualified |
| DD-03 | Done: all publication diffs and license/ancestry locators reconciled, including four direct license comparisons; no stronger attestation claimed |
| DD-04 | Done: five evidence-linked alternatives and actual unresolved operator decisions; no adoption |
| DD-05 | Done: committed design-only prerequisite reviewed, with explicit operator source-home deferral and DR-04 still open; no Y-14 execution proof |
| DD-06 | Done: literal native replay and identical outputs; all five charged CC conditions preserved; ancestor bodies/history updated and full Slice10 open set supplied |

The assigned static dependency/decision capability is delivered. There is no
new scope reduction: all 47 candidates/48 expansions/103 original attempts,
11 static rows, nine FM01 R rows, 36 unavailable resource cells and 28 gated
document variants remain owned. The five CC failures remain charged and sealed.
The eight original DB criterion rows remain textually identical and open.

Arc01 v1.25 and project v1.26 now record this closure and the actual
[Slice10 open set](../slice10-runtime-resource-and-composition/slice-plan.md).
It owns effective argv, runtime/offline/permissions, full FF integration,
resource/supported-pair evidence, original physical crosswalks, fresh/captured
conditions and the DB composition proposal. No additional runtime work was
performed during this static CDC review. A-03–06 and project rows stay open.
Arc02 ADT/authoring, Arc03 guides/book/compiler/tooling and P-04/P-08 actual
human code-shape/direction acceptance remain separate obligations.

Durable CDC additions are this report and its receipt packet; new Slice10 has
only its three-file open set. Exact path/row/link verification
receipts are retained in the packet. No sealed CC artifact or source file changed.

Final CDC packet: **34 files / 110,380 decoded bytes**, independently extracted
with **102 checks**. SHA-256:
`8c3a336f515ab133f6a3fdd8bccf93eec534c59e48e1fe20be9327cab313d707`.
Native planning verification passed **32 checks / 16 changed paths / 220 local
file links**. The same checker and before-ledgers are retained for replay.
Whitespace and exact staged scope passed; no parent criterion was rewritten.
