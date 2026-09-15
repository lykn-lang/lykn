# Slice08 design review handoff — qualified approvals recorded

2026-09-14, CC/Sofie. **Design artifacts are prepared; this slice is not
proposed-done or closed.** All five original DR criteria remain open. The
operator accepted CDC's qualified recommendations: bounded idiomatic Lykn/ADT
evaluation, initial behavioral proof and future YAML home/ownership. The
new-code licence remains deliberately pending; independent design CDC and
separate bootstrap/source verification remain owed. The source-home deferral
is superseded by selection of future lykn-patch/yaml, not repository creation.

Prepared from planning `6518d57`, after independently closed RC and separate
DB research composition. Source release/0.6.x remains clean at `4dded88`.
No source edit, installation, candidate evaluation, port, repository creation,
project-number reservation, release assignment or publication occurred.

## Recommendation and actual decision provenance

The [design](artifacts/design-brief.md) compares all five inherited alternatives
and recommends a bounded, attributed Eemeli 2.9.1 port evaluation with a Lykn
public API and separate byte-preserving edit layer. It specifies document/value/
ADT/Result, trivia/alias/schema/error, resource and file contracts and their
deliberately unsupported boundaries. It proposes a future focused lykn-patch/yaml
home, with oubiwann maintenance/build/release ownership, without assigning them.

Initially, three grouped questions were presented only after the four required artifacts
existed: D1–D3 boundary/route/reuse/notices; D4–D5 behavioral/resource/file
contracts; D6–D8 home/ownership and separately scoped later creation. The operator
subsequently quoted CDC's recommendations and said, “I actually like these
recommendations and will go with these :-D”. [decision-record.md](artifacts/decision-record.md)
records the exact qualified scope, splitting approved reuse/notices (D3a) from
pending new-code licence (D3b). Translation inventory and feasibility review
precede commitment to a port; internal idiomatic Lykn/ADTs are mandatory.
The 1MiB/2MiB limits are provisional, edits remain no-op/n=2 only, and production
JSON stays ahead of YAML. This response is operator evidence, not independent CDC.

## Five-row walk

| Row | Attested work | Still required | Status |
| --- | --- | --- | --- |
| DR-01 | Five-way comparison; D1/D2/D3a/D7 accepted with internal Lykn/ADT and feasibility qualifications | Separate D3b new-code licence deliberately pending; independent review | open |
| DR-02 | D4 initial fidelity contract accepted; all 28 original IDs/hashes/splices unchanged; internal ADTs now explicit | CDC contract/oracle review; Arc02 executable ADT/source-shape work remains separate | open |
| DR-03 | D5 accepted as provisional research/file proof; all 36 unsupported cells and overlap preserved | Independent design review; proposed APIs/counters/file mechanisms still unimplemented | open |
| DR-04 | Future lykn-patch/yaml selected; oubiwann accepts accountable maintenance/build/release ownership | Separate bootstrap review/creation scope and actual repository verification; no repository created | open |
| DR-05 | D8 qualified staged proposal accepted; translation inventory/feasibility precede port commitment | Independent design CDC and separate future source/evaluation authority | open |

No criterion is weakened or removed. Pending design acceptance blocks this
slice; it does not reopen the already independently closed parent DB research.

## Inventory and verification

Four required artifacts:

- [design-brief.md](artifacts/design-brief.md): alternatives, recommendation,
  observable contracts and actual source-home evidence/options.
- [decision-record.md](artifacts/decision-record.md): D1–D8, recommendations,
  accountable decision owner and exact prior response/pending provenance.
- [y14-crosswalk.json](artifacts/y14-crosswalk.json): all 28 full original rows,
  input/case hashes, explicit proposed output hex/digests/byte splices, two
  repeats each, all 54 resource cells and the exact 36 unsupported subset.
- [proof-contract.md](artifacts/proof-contract.md): bounded subsequent task
  proposal and gates; no new source open set is created by this file.

Optional evidence artifacts: [audit.lykn](artifacts/audit.lykn), native empty
[project.json](artifacts/project.json)/version-5 [deno.lock](artifacts/deno.lock),
and [raw-transcript.txt](artifacts/raw-transcript.txt). All artifacts live under
the assigned slice. Plans/ledgers/dashboard carry only the current handoff state.

The new native audit passed check/lint/compile and emitted-code inspection.
Generation passed **413 checks**; verification passed **414**. Checks include
all 28 unique IDs, both inherited Y-14 copies, seven independently enumerated
exact strings, BOM/CRLF/no-final-LF bytes, source/case hashes, original options/
repeats and exact proposed splices. These are proposed acceptance bytes, not
candidate output. All 54 original resource cells remain; the 36 unsupported
cells retain 18 conversion/27 bound reasons, overlap nine and zero attempts.
The future original document workload remains **56 attempts per condition**;
this slice ran **zero document/package trials**.

The unchanged reviewed Slice04 packet tool also passed check/lint/compile and
capture-path emitted inspection. Packet: **49 files / 1,362,220 decoded bytes**;
packing and fresh extraction each passed **147 checks**. SHA-256:

```text
2585bc4315fd1d40fc50d26fb5bdb8aefc5a4645779e71de40b023c77eb4f745
```

Fresh extraction regenerated the complete crosswalk byte-identically and
passed the same 413/414 checks. Native tools import no candidate packages.
The packet contains both exact inherited input manifests, source/gates/emitted
code, design/decision/proof drafts as presented for review, official API headers/
metadata, local identities/status, selected immutable upstream source/notices
and provenance. It does not claim to duplicate or re-audit Slice09's full graph
packet. Original upstream archive and independent graph/license evidence remain
there. Post-seal replay receipts are attested here; a packet cannot contain its
own final seal receipt.

The sealed packet and crosswalk remain byte-identical to `56155d8`; their
pending-decision text is the historical review snapshot. Current operator
dispositions and internal-design requirements are the subsequent Markdown
amendment, not a rewritten past experiment. No code or golden byte changed;
the prior 413/414 checks and packet replay remain the applicable data evidence.

Zero charged source/tooling failures. Read-only discovery encountered absent
paths and browser fetch failures; sandbox curl DNS failed, then the authorized
host metadata request returned HTTP 200. Those are retained infrastructure
limitations, not document trials or policy exceptions. Existing compile warnings
remain visible. No generated-JS repair or non-Lykn research fallback occurred.
Guide exposure is recorded in packet `meta/provenance.md`; some combined guide
reads truncated, so no full guide-corpus or blinded authoring evaluation is claimed.

## Tested portable replay

Use the accepted isolated CLI from RC/DB, source
`4dded883bbd321d19635e6fce233343f33803f9e`, binary SHA-256
`d4a7028ebba234ffcd6fdb544c256489d22b840da2e94e0aa833b0520c834326`,
Deno 2.9.6 SHA-256
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.
Rehash before replay; a missing accepted binary requires its existing reviewed
build contract, not an unapproved version substitution.

In a fresh scratch directory copy this slice's native config/lock and packet,
and copy the unchanged [Slice04 capture tool](../../arc01-format-runtime-evidence/slice04-dependency-and-runtime-boundary/artifacts/audit.lykn)
as `packet.lykn`. Gate and inspect the tool before use. Set `DR_CLI` to the
accepted absolute binary path, create empty home/tmp/cache, then:

```sh
env -i PATH=/opt/homebrew/bin:/usr/bin:/bin HOME="$PWD/home" TMPDIR="$PWD/tmp" \
 DENO_DIR="$PWD/cache" DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 \
 "$DR_CLI" run --no-prompt --cached-only --frozen=true \
 --allow-read=./raw-transcript.txt --allow-write=./extracted \
 packet.lykn extract raw-transcript.txt extracted </dev/null
cd extracted/payload
mkdir -p home tmp cache
cp y14-crosswalk.json retained-crosswalk.json
env -i PATH=/opt/homebrew/bin:/usr/bin:/bin HOME="$PWD/home" TMPDIR="$PWD/tmp" \
 DENO_DIR="$PWD/cache" DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 \
 "$DR_CLI" run --no-prompt --cached-only --frozen=true \
 --allow-read=./inputs --allow-write=./y14-crosswalk.json audit.lykn generate </dev/null
cmp retained-crosswalk.json y14-crosswalk.json
env -i PATH=/opt/homebrew/bin:/usr/bin:/bin HOME="$PWD/home" TMPDIR="$PWD/tmp" \
 DENO_DIR="$PWD/cache" DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 \
 "$DR_CLI" run --no-prompt --cached-only --frozen=true \
 --allow-read=./inputs,./y14-crosswalk.json audit.lykn verify </dev/null
```

This sequence passed at `/private/tmp/lykn-p07-dr.Sc8VBe`, with the accepted
CLI at `/private/tmp/lykn-p07-db-final.LuQhzp/source/target/release/lykn`.
Fresh replay reads only relative captured input paths; no old scratch/cache
path is a data dependency. Compiler warnings are retained in separate stderr.

## Bubble-up to the arc

All four requested design artifacts and optional reproducible tooling are
delivered for review. The remaining design choice is the new-code licence, plus
independent CDC, not an omitted implementation. Arc03 A3-08 stays open. The
future home and accountable owner are selected; creation/verification remain
behind separate bootstrap review. Implementation is sequenced into home/static inventory/build-API
proof before original document behavior. No source open set, project number or
release is created. The exact translation path list must be reviewed before a
port starts; no unbounded wildcard authoring is permitted.

All 28 Y-14 cases remain gated, all 36 unsupported Y-13 cells retain API-dependent
re-entry, and Arc02/other Arc03/P-04/P-08 obligations remain explicit. The design
highlights that hash checks alone do not prevent noncooperating file races and
that graph-to-tree conversion loses alias identity; its proposed API treats
these as visible boundaries. Operator answers may change the recommendation or
contract and must be applied before any proposed-done handoff or later planning.
