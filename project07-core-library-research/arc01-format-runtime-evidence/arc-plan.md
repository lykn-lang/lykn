# Arc01 — Format and runtime evidence

## Capability and status

2026-09-13 CDC: [Slice09 independently closed](slice09-dependency-decision-and-reconciliation/cdc-verification.md)
after full packet/artifact replay and source/decision review. All six DD rows
are done. [Slice10](slice10-runtime-resource-and-composition/slice-plan.md) is now
open for the full runtime/resource/historical crosswalk and DB composition
proposal; all eight DB rows stay open. Arc03/Slice08 is a concrete design-only
prerequisite. The operator explicitly leaves the library source home unassigned
pending design, with DR-04 open. This supersedes earlier next-step statements.

2026-09-13 CC: [Slice09](slice09-dependency-decision-and-reconciliation/closing-report.md)
is proposed-done for dependency/decision evidence. All six DD rows await CDC;
all eight DB rows remain unchanged/open. Published bytes, complete captured
graphs and explicit unresolved build/test boundaries support concrete policy
choices. No compatible document route was verified; the actual
[Arc03/Slice08 design open set](../arc03-findings-and-integration/slice08-document-route-design/slice-plan.md)
now owns that prerequisite. It has not been executed. After independent Slice09
closure, CDC opens planned Slice10; document and policy gates remain separate.
Earlier immediate-next-step statements below are historical.

2026-09-13 CDC: [Slice08 independently closed](slice08-file-fault-completion/cdc-verification.md).
All six FF criteria reproduce: both retained conditions and two complete new
37-attempt conditions, five negative controls and 146-fixture/four-source-copy
crosswalks each. Actual OS faults remain distinct from permission denials.
Slice09 is now open for dependency/decision evidence; planned Slice10 owns full
runtime/resource reconciliation and DB composition. All eight DB rows and
A-03–06 stay open. Earlier pending-review and full-resume instructions are historical.

2026-09-13 CC: [Slice08 file-fault handoff](slice08-file-fault-completion/closing-report.md)
is proposed-done, pending independent CDC. Primary/fresh each pass 37 process
audits, five negative families and a 146-fixture physical crosswalk; captured
replay reproduces both. Actual OS cross-device/directory faults and source-read
denials are distinct. Three pre-runtime failed drafts are retained. All FF,
DB and A-03–06 rows remain open. Earlier execution-readiness text is historical.

2026-09-13 CDC: [partial packet and preparation review passed](slice04-dependency-and-runtime-boundary/cdc-partial-verification.md).
All 163 retained audit dispositions and 3,997 packet files reproduce. Slice08
is ready for its reviewed 37-attempt file/control condition and independent
fresh/captured replay. Slice04 remains stopped with nine failures and eight
open DB rows; A-03–06 stay open. This supersedes the pending review and full
resume directions below. No remaining research is discharged by preparation.

2026-09-13 current: [Slice04 partial evidence](slice04-dependency-and-runtime-boundary/closing-report.md)
is stopped after nine retained failures exceeded the operator-amended ceiling
of eight. The latest condition has 91 passing records, one failed record and
11 unrun attempts; earlier evidence remains separate. All eight DB rows and
A-03–06 remain open. Independent partial-packet and Slice08 preparation review
is next. Earlier instructions to resume the full matrix are historical.

2026-09-13 current CDC: [supervisor closed](../arc03-findings-and-integration/slice07-research-supervisor/cdc-verification.md).
All 33 attempts and five negatives reproduce. Resume Slice04 using the pinned
native baseline and full research contract; all eight DB rows remain open.
Earlier supervisor-pending statements below are historical.

2026-09-13 CC: [Arc03/Slice07 supervisor handoff](../arc03-findings-and-integration/slice07-research-supervisor/closing-report.md)
is proposed-done, with all six statuses open for CDC. After independent
closure, resume the entire Slice04 assignment. All eight DB rows, 47 candidates
and expansions, 36 unsupported resources and 28 gated documents remain here;
native prerequisite runs do not replace research attempts or adoption decisions.

2026-09-13 CDC: [resumed preparation verified](slice04-dependency-and-runtime-boundary/cdc-resume-verification.md).
The packet, source correction and frozen-lock failure reproduce. The bounded
Arc03/Slice07 prompt is reviewed and ready; all eight DB rows stay open.

Current sequencing, 2026-09-13: Slice04 resumed preparation retained a fourth
source-authoring failure and unverified supervisor paths. Its explicit
before-exhaustion rule now opens bounded
[Arc03/Slice07](../arc03-findings-and-integration/slice07-research-supervisor/slice-plan.md)
before full Slice04 execution. This supersedes the earlier immediate-resume
instructions below, preserving the closed launcher fix and all research owners.

Deliver a reproducible account of what native Deno and candidate packages
provide for JSON and YAML, what they lose, and what Lykn libraries must add.
Evidence includes package provenance and the actual runtime/toolchain
baseline, so a dependency recommendation is not inferred from a registry name.

Active arc. Slices01–03 are CDC closed. All 17 JSON families independently
replayed; YAML preflight reproduced 38 sentinel/harness attempts and three
supervisor controls. Slice05 is now CDC closed for all 259 value variants, replayed
twice. Slice06 resource/file work is now CDC closed, seven of seven criteria
reproduced. Slice04 runtime/dependency work is open; full YAML closure remains owed.
See the [project plan](../project-plan.md) and [arc ledger](ledger.md).

## Slice breakdown

| Slice | Scope and output | Dependency | Status |
| --- | --- | --- | --- |
| [slice01-baseline-and-protocol](slice01-baseline-and-protocol/slice-plan.md) | Pin toolchain/source/package identities, reconcile the exploratory claims, and specify a reproducible research protocol and fixture matrix | None | CDC closed; seven criteria reproduced |
| [slice02-json-behavior](slice02-json-behavior/slice-plan.md) | Exercise JSON read/parse/edit/write through Lykn; document precision, duplicates, absent/null, errors, ordering, escaping, unsupported values, JSONC, framed streams, and file-failure behavior | Slice01; verified Arc03/Slice01 launcher correction | CDC closed; 161 variants/354 attempts replayed |
| [slice03-yaml-preflight](slice03-yaml-preflight/slice-plan.md) | Freeze all Y-01–16 variants/owners; pin runtime/graph; verify Lykn inspector, supervisor and small sentinel set | Slices01–02 evidence | CDC closed; six criteria reproduced, 349 YAML variants frozen |
| [slice04-dependency-and-runtime-boundary](slice04-dependency-and-runtime-boundary/slice-plan.md) | Reconcile all R-01–09: runtime/package graphs and provenance, Node/npm exclusion, exact versions and lock integrity, permissions, offline replay, replacement/fault/resource constraints and adoption alternatives; resolve or explicitly route the document prerequisite | Slices01–03 plus Slices05–06; verified launcher/supervisor; completion evidence from Slices08/09/10 | Partial/stopped; retained evidence reviewed; eight unchanged DB rows open |
| [slice05-yaml-value-behavior](slice05-yaml-value-behavior/slice-plan.md) | Execute all Y-01–12/Y-15 value/schema/tag/graph/error/presentation/unsupported-value combinations with byte evidence | Verified Slice03 harness and matrix | CDC closed; all 259 variants/518 attempts reproduced |
| [slice06-yaml-resource-and-files](slice06-yaml-resource-and-files/slice-plan.md) | Execute all Y-13/Y-16 bounded alias/depth/size and file-failure cases; carry wider policy into Slice04 | Slices03/05 | CDC closed; 108 resource attempts, 16 file attempts, 36 unsupported cells; seven criteria reproduced |
| slice07-yaml-document-fidelity | Execute Y-14 through an explicitly compatible route; compare semantic edits and source trivia/bytes | Slice04 compatible-route disposition and relevant value fixtures | Planned; Node candidate remains gated |
| [slice08-file-fault-completion](slice08-file-fault-completion/slice-plan.md) | Complete retained cross-filesystem, injected and directory faults; rerun affected controls and verify actual files | Accepted independent partial/preparation review | CDC closed; all six FF criteria reproduced |
| [slice09-dependency-decision-and-reconciliation](slice09-dependency-decision-and-reconciliation/slice-plan.md) | Complete R-02 graph/lineage/toolchain evidence and DB-07 decisions, with actual document-route proof or concrete prerequisite | Verified Slice08 and retained Slice04 evidence | CDC closed; six DD criteria; source home deferred by operator to design |
| [slice10-runtime-resource-and-composition](slice10-runtime-resource-and-composition/slice-plan.md) | Complete R-01/03–09 argv/runtime/resource/compatibility reconciliation, all historical physical crosswalks and fresh/captured DB composition | Verified Slices08/09 and original R/J/Y evidence | Open; eight RC rows; full execution and independent review owed |

The former `slice03-yaml-fidelity` roadmap had no open set or authored work.
It is superseded by Slices03/05/06/07; no Y family is removed. Execution order
was **03 → 05 → 06 → 04 → 07**. Current completion order is **04 partial review
→ 08 → 09 → 10 → 04 composition → compatible document route → 07**. This retains the established Slice04 identity
while resolving document dependency policy before the gated trial. If Slice04
cannot establish a compatible route, open the required correction/design work;
do not claim Slice07 or YAML closed through silence or static inspection alone.
Final arc composition checks the selected route against actual document
evidence and refreshes any Slice04 decision affected by it. This is a tracked
decomposition change from JSON's observed authoring pressure, not less scope.

Each execution slice must remain small enough for one context plus correction
headroom. If the JSON or YAML matrix proves too large, explicitly split that
slice before execution and preserve every case in the arc plan and ledger.
Source/native-format fidelity and application validation are separate axes.

2026-09-13 interruption: the operator upgraded Deno from 2.7.7 to 2.9.6 while
Slice04 was preparing. Its immutable Lykn build matches, but actual no-import
launches fail before execution; explicit `--allow-all` does not change the
failure. [The blocked handoff](slice04-dependency-and-runtime-boundary/closing-report.md)
retains source/argv/raw evidence and incomplete drafts. The resulting
[Arc03/Slice06](../arc03-findings-and-integration/slice06-deno-launch-compatibility/slice-plan.md)
is now independently verified; resume all of Slice04 using its active traceable
4dded88/Deno 2.9.6 condition. No R family, original Y owner, document-route decision,
resource API gap or Arc02/03 human/guide/book/ADT outcome is removed.

## Decisions this arc informs

2026-09-13 correction update: Arc03/Slice06 is now
[CDC closed](../arc03-findings-and-integration/slice06-deno-launch-compatibility/cdc-verification.md).
The selected corrected binary reproduced all six criteria. Slice04 resumes with
eight DB rows still open and full operational freeze/supervisor preflight owed. The full
R-01–09 workload, 36 unsupported resource cells, 28 gated document variants and
all authoring/source/human outcomes retain their original owners and budgets.

- Is native JSON adequate for the required numeric and duplicate-key policy?
- Which JSON extensions are useful without implying preservation guarantees?
- Does the first YAML use case need value rewriting, document preservation,
  or both, and what evidence supports the fidelity promised by each candidate?
- Which YAML schemas and value kinds can a library accept without silent loss?
- Which implementation, package source, dependency graph, and permission model
  satisfy the operator's no-Node/no-npm-ecosystem direction?
- What must the later Lykn ADT and authoring trials exercise?

The operator's direction excludes Node/npm ecosystem dependence for the new
libraries. Research must expose existing exceptions and candidate provenance,
not silently allow npm because older guides permit it. Code ancestry, registry,
transitive dependencies, and required runtime are separate facts. Whether an
independently maintained port's ancestry is acceptable remains a decision to
document, not an automatic rejection or acceptance.

## Verification and artifacts

Each slice owns its `artifacts/` directory, reproducible instructions, raw
observations, and evidence-strength statements. Successful ordinary cases
must be accompanied by malformed, boundary, and unsupported cases. Keep
input bytes and output bytes when assessing fidelity; data equality alone
cannot demonstrate document preservation. Test file failure behavior only in
isolated fixtures; never edit real configuration or user documents as probes.

Slice01 defines execution locations and allowed source scope for later
prompts. This arc does not make blanket source changes or adopt packages into
the language repository. It does authorize narrow, inspectable research
fixtures through the slice plans. Corrections discovered here feed Arc03;
blocking corrections may require opening that work earlier.

At arc close, independently replay a JSON and YAML workflow from the recorded
baseline and reconcile the result with the overall capability/dependency
matrix. Check that every policy question has evidence or a specific unresolved
decision, and that all authoring findings have survived into the next arc.

## Expedited Mode

Slice01 [closing report](slice01-baseline-and-protocol/closing-report.md) and
[findings](slice01-baseline-and-protocol/artifacts/findings.md) establish new
prerequisites for the next opening: D-2609-PERM required correction before
runtime launches; historical source inserted `-A`. That correction is now
CDC closed. Keep JSON first and retain every FM01 case.
D-2609-YNOD gates execution/adoption of @eemeli/yaml 2.9.1 because published
source imports Node APIs; Y-14's document workflow remains required in Slice07.
[Arc03/Slice01](../arc03-findings-and-integration/slice01-run-permissions/slice-plan.md)
is now CDC closed; [verification](../arc03-findings-and-integration/slice01-run-permissions/cdc-verification.md)
reproduces the correction and build receipt. Slice02's own preflights now
reproduce too. Live release binary drift requires isolated pinned-source builds
for research instead of silently substituting current bytes.
Guide/book findings D-2609-LINT/NPMB/JSER and the source/binary provenance gap
must survive the later authoring/integration openings. This records a dependency,
not a source-scope expansion or acceptance decision.

Apply the project's exact-path commits, proposed-done/CDC separation, immediate
evidence-based close and next-slice opening, and arc composition rules.
Slice02 now has [independent CDC closure](slice02-json-behavior/cdc-verification.md).
The Slice06 execution prompt is now independently verified. Slice04 is open
for runtime/dependency execution before Slice07; its complete R-01–09 inventory
preserves the broader replacement, compatibility and policy questions.
Original JSON CC artifacts remain historical; CDC records replay adaptations.
Do not generate a close set or mark research complete merely because the
planning documents exist.

## Slice02 evidence carried forward

[Results](slice02-json-behavior/artifacts/results.md) distinguish native precision,
duplicate, unsupported-value and lexical losses; JSONC comments; framed streams;
canonical ordering; and file/resource boundaries. All 17 families remain covered,
with no requested deferral. Source-aware reviver/rawJSON availability is pinned
runtime evidence, not a dependency or architecture decision.

D-2609-NZRO/JSCF/UNUS add sign-sensitive code generation, invalid emitted control
forms and misleading unused-binding diagnostics to Arc02 observation and proposed
Arc03 correction work. Their detailed source is retained in the
[authoring record](slice02-json-behavior/artifacts/authoring-observations.md).
Future YAML authoring must verify generated output before interpreting format
results and preserve correction headroom; do not assume that check/compile exit0
means runnable code. Existing D-2609-JSER receives BigInt runtime evidence.

Slice04 still owns full graph/provenance policy, cold offline conditions,
concurrent replacement/durability, and resource contract limits. Arc02 still
owns ADT/Result/Option/module/formatter and actual operator code-shape review.
J-15's known-frame decoder is not a complete text-sequence validator. No source
correction is authorized by this research handoff.

## Slice03 preparation handoff

[CC report](slice03-yaml-preflight/closing-report.md) retains a fresh immutable
compiler build, actual YAML graph/lock, bounded inspector/supervisor and a Lykn
audit. The 349 YAML variants preserve all 16 families; only 16 YAML sentinels
and three harness controls ran twice. [CDC](slice03-yaml-preflight/cdc-verification.md)
reproduced that condition, all attempts and 1991 retained plus 907 additional
audit checks. No full family inherits completion.

Slice05 must complete alias/cycle serialization and original/no-op/edit bytes,
existing-destination failure checks and the full value matrix. Slice06 retains
resource recipes and exact file-fault modes. Stable std/yaml has no separate
toJS method; report unavailable stages/options honestly rather than emulate an
API and call it passing. Slice07's 28 document variants remain behind Slice04
and D-2609-YNOD. Slice05 has since closed; Slice06 is now the next opened work.

CDC preparation review requires Y-01 to read/parse its actual file first and
Y-09 to exercise the real replacement path against an existing destination.
Freeze runtime-value construction and additional operation details before full
execution, keeping YP-M01 IDs/bytes/options and all questions in the crosswalk.
Inspector enumeration and encoding allocate before their output guards; Slice06
and Slice04 must distinguish those costs from package behavior and hard limits.
The 259/62/28 value/resource-and-file/document ownership counts sum to 349.
No source correction or family reduction accompanies this clarification.

## Slice05 verified handoff

[CDC](slice05-yaml-value-behavior/cdc-verification.md) reproduced all 518 final
attempts, 13 controls, 35,098 audit checks, 2,592 correction comparisons and
7,833 additional checks. Accepted parse and serializable value domains differ;
Map/Set and unsupported-value loss, permissive parse shapes, numeric and source
trivia losses must inform Arc02/Arc04 validation policy without prematurely
choosing it. Warnings need explicit name/message capture beside positions.

Slice06 preserves all 62 assigned variants, treats absent toJS/package-bound
APIs as explicit capability dispositions, and materializes large recipe inputs
outside argv. Measure parser/serializer stages separately from bounded inspection
and transport; a supervisor threshold is not a hard allocation guarantee. Slice04
retains policy/offline/concurrency/durability and precedes all 28 Slice07 document
variants. JSCF/UNUS and guide/book/human obligations remain open. This refines
execution mechanics from verified findings without changing family ownership.

## Remaining research ownership after Slice04 partial execution

Slice08 is independently closed for actual file-fault evidence. The former
combined Slice09 roadmap is now split before execution to leave correction
headroom: static graph/lineage/decision research in Slice09, and runtime/resource
reconciliation and full composition in Slice10. This changes ownership, not scope.
Slice09 completes runtime/type/development/test/example/build and toolchain
classification, resolves or explicitly qualifies missing published test edges,
and supplies source-to-upstream/license and decision crosswalks.

Slice10 must retain all 47 candidates, 48 executable expansions/103 original
intended attempts, 11 static rows and nine verbatim FM01 R rows. Freeze a new
composed manifest with explicit old/new crosswalks, incorporating the verified
FF corrections and distinct denial controls without deleting original attempts.
It owns R-01 effective help/argv/build/runtime identity, R-03 alias/missing/corrupt
lock, R-04 online prefetch/warm cached-only/cold-cache evidence, R-05 allowed and
denied parser/file/env/net/run permissions, R-06/07 full file/concurrency/cancel
composition, R-08 exact J-16/Y-13 attempts/recipes and CPU/time/RSS attribution,
and R-09 another already available supported pair or explicit unavailability.
No historical runtime reinstall or compiler-only substitution supplies R-09.
Use bounded representative resource replay and original warm-up/measurement
rules, not an unmotivated rerun of every large series. Preserve all 36 unsupported
cells, their overlapping reasons and API/bounds-dependent re-entry.

Slice10 also owns complete fresh and captured replay of the composed condition,
all five negative audit families, exact original-versus-new record sets and
physical source/fixture/config/lock/emitted crosswalks. Reconcile both historical
Slice04 conditions (including their three failed audits and nine authoring
failures), all original J/Y evidence and verified FF evidence without counting
retained runs as fresh trials. Validate each of the eight unchanged DB criteria
against the resulting evidence at parent composition; closure is not automatic.
Its detailed open set must precede execution, with existing budgets and no new
source implementation scope. These obligations are not fulfilled by this roadmap.

Slice09's decision deliverable must either establish an actually compatible
document route or open a concrete bounded Arc03 design/correction prerequisite
with source home, owner, acceptance criteria and re-entry before Slice07. Its
current task is to compare an independently maintained Lykn/Deno document port
with other evidenced routes under the unchanged no-Node/npm direction; this
does not authorize writing a port. Static browser-build claims do not unblock
the 28 Y-14 cases. D-2609-YNOD remains open. Arc02 retains ADT/authoring trials;
Arc03 retains accepted source/guide/book corrections; P-04/P-08 retain operator
code-shape and direction acceptance. Neither new slice resets Slice04's history
or closes a parent DB row automatically.

## Version History

- 2026-09-13 v1.25: Slice09 CDC reproduced 5,257 packet files and both JSON
  artifacts and closed six DD rows. Accepted the operator's source-home deferral
  to design. Opened Slice10 deeply with full original scope, FF additions,
  historical/physical crosswalks and independent parent composition still owed.

- 2026-09-13 v1.24: Slice09 supplied static source/graph/lineage and decision
  evidence with five charged conditions (four drafts plus packet layout).
  Registered the actual Arc03
  document-design prerequisite; preserved every DB row and Slice10's complete
  runtime/resource/physical-crosswalk obligations. Independent CDC is next.

- 2026-09-13 v1.23: CDC closed all six Slice08 criteria after complete retained
  and fresh replay. Before deeper planning, divided the combined Slice09 roadmap
  into dependency/decision research (opened) and Slice10 runtime/resource/DB
  composition (roadmap). Preserved every R/J/Y, failure and source/human owner.

- 2026-09-13 v1.22: Slice08 submitted complete primary/fresh file-fault evidence,
  negative controls and physical/captured replay. Actual OS errors and permission
  denials remain separate; three authoring failures retained. Independent CDC
  precedes Slice09 preparation; all parent/document/source/human scope remains.

- 2026-09-13 v1.21: CDC reproduced Slice04's partial packet and all audit
  dispositions, then accepted Slice08 preparation with concrete grants, both
  cross-device outcomes, directory-error discrimination and complete affected
  controls. All parent rows, nine failures and remaining Slice09 owners survive.

- 2026-09-13 v1.20: Preserved Slice04's two partial conditions, nine retained
  failures and exceeded eight-failure ceiling. Opened the actual remaining
  file-fault subset as Slice08 for preparation review; assigned full residual
  dependency/decision/reconciliation to roadmap Slice09. All DB/A-03–06 rows,
  unsupported resources, gated documents and source/human obligations remain.

- 2026-09-13 v1.19: CDC closed the Arc03/Slice07 supervisor prerequisite after
  complete runtime/packet replay. Resumed full Slice04 with exact native source
  pins, affected-control preflight and every research/source/human owner retained.

- 2026-09-13 v1.18: Arc03/Slice07 submitted complete native supervisor
  evidence; independent CDC remains the full Slice04 re-entry gate. Preserved
  all R/Y owners, four Slice04 source failures and source/human obligations.

- 2026-09-13 v1.17: CDC verified Slice04 preparation and accepted the bounded
  supervisor split. Clarified failure/cleanup controls in its owning open set;
  preserved all research rows, candidate identities, budgets and original evidence.

- 2026-09-13 v1.16: Slice04's fourth source failure triggered explicit
  before-exhaustion re-slicing of supervisor verification to Arc03/Slice07.
  Retained both packets, full R-01–09, 47 candidates and expansions, 36
  unsupported Y-13 and 28 gated Y-14, with no criterion closure or budget reset.

- 2026-09-13 v1.15: Launcher CDC closed all six correction criteria and lifted
  Slice04's gate. Updated its active source/runtime pin, full re-entry and
  compiler/toolchain drift inventory; retained all eight DB rows, three failed
  authoring conditions, unavailable comparisons and existing Y/source/human owners.

- 2026-09-13 v1.14: Arc03/Slice06 supplied the DARG correction and full source
  gates. Recorded CDC as the remaining launcher prerequisite; no research row,
  scope, authoring budget or document-route obligation is removed.

- 2026-09-13 v1.13: CDC reproduced the Slice04 launch blocker, eval tooling,
  460-file packet, 188 published-file checks and six regenerated outputs.
  Accepted the prerequisite handoff without closing any DB criterion; Arc03/
  Slice06 is ready for implementation. Metadata is not a resolved graph and
  eval success is not restricted wrapper evidence. All original work remains.

- 2026-09-13 v1.12: Slice04 exposed D-2609-DARG after the operator's runtime
  upgrade. Added the concrete Arc03/Slice06 correction before resuming Slice04;
  all eight DB rows and R-01–09 remain open. Unexecuted drafts and static
  retrieval are not format/runtime evidence or an accepted document route.

- 2026-09-13 v1.11: CDC independently closed Slice06 after 108 resource and 16
  file attempts, 13 controls, 26674 retained-audit and 4036 extra checks. Runtime
  semantics and file states agree with CC; timings/RSS remain host observations.
  A replay-shell correction and a vacuous first CDC live-file selector are
  retained with corrected evidence. Opened Slice04 with every R-01–09 family,
  explicit static/runtime/provenance distinctions and document-route re-entry.
  A-03–06 remain open; closure supplies neither hard resource guarantees nor
  dependency adoption, document fidelity, source repairs or human acceptance.

- 2026-09-12 v1.10: Slice06 submitted all resource/file obligations with exact
  recipe transport, separate package/setup timers, real OS failures and verified
  partial-write checkpoints. No resource cap occurred; absence of a bound remains
  unsupported, and sampled RSS is not a hard package limit. Updated the body for
  the Slice04 handoff without changing owners or claiming independent closure.

- 2026-09-12 v1.9: Slice05 CDC closed all seven value criteria after full replay
  and correction reconciliation. Opened Slice06 using actual APIs and harness
  limits: explicit unsupported stages, file-based resource transport and separated
  stage/inspection costs. All 349 variants and remaining policy/document/authoring
  owners survive; arc composition stays open.

- 2026-09-12 v1.8: Slice05 submitted full value execution with complete warning
  capture, 35,098 audit checks and retained superseded evidence. Value-domain
  losses and permissive parsing strengthen the explicit validation-policy
  handoff. No adoption or closure is inferred; all 349 owners remain unchanged.

- 2026-09-12 v1.7: Slice03 CDC closed six preparation criteria after fresh build,
  exact freeze and full sentinel replay. Opened Slice05 for 259 value variants
  using the actual harness. Carried literal-before-file and destination-failure
  gaps, serialization obligations and inspector allocation caveats into the
  relevant owners before planning full execution. Sequence and all 349 cases
  remain unchanged; A-03–06 remain open.

- 2026-09-12 v1.6: Slice03 submitted bounded preparation as CC proposed-done,
  with all YAML owners/variants retained and Lykn evidence tooling. Explicitly
  carried API absence and remaining full serialization/failure work forward;
  no sequencing change, family closure, dependency adoption or source repair.

- 2026-09-12 v1.5: Slice02 CDC replayed all 354 attempts, closed A-02 and
  reproduced compiler findings. Split the unstarted YAML roadmap into bounded
  preparation/value/resource/document work with all Y-01–16 retained. Kept
  Slice04 identity and moved its policy prerequisite before document execution.
  Opened Slice03 preparation; evidence tooling explicitly remains Lykn-first.
- 2026-09-12 v1.4: Slice02 delivered CC-attested JSON evidence for every family;
  retained three compiler findings and explicit resource/framing boundaries.
  Added generated-output verification to later authoring preparation because
  successful compilation alone did not establish valid JavaScript. CDC and
  later slice openings remain separate; no YAML/runtime obligations dropped.

- 2026-09-12 v1.3: Arc03/Slice01 CDC reproduced the launcher correction;
  resumed JSON Slice02 with verified build/runtime pins. All JSON families
  and package/resource controls remain in scope; no format result is claimed.
- 2026-09-12 v1.2: Independently verified and closed Slice01; opened Slice02
  with all JSON families retained and execution blocked on the newly opened
  Arc03/Slice01 launcher correction. Historical baseline drift remains explicit.
- 2026-09-12 v1.1: Slice01 supplied attested baseline/protocol and exposed
  launcher/candidate prerequisites; updated status and explicit bubble-ups
  without removing, closing, or opening later work.
- 2026-09-12 v1.0: Opened the format/runtime evidence arc with four bounded
  research slices; detailed the baseline-and-protocol slice first. Preserved
  YAML and dependency-provenance research alongside the JSON starting point.

## Slice05 value handoff

[CC evidence](slice05-yaml-value-behavior/closing-report.md) covers all 259
assigned variants twice, with 13 separate supervised controls and 35,098 audit
checks. A full warning-capture confirmation retains the earlier condition and
checks 518 old/new pairs. CDC has now reproduced this evidence and closed
Slice05; Slice06 has since submitted the CC handoff below.

[Findings](slice05-yaml-value-behavior/artifacts/findings.md) require an explicit
admissible-value and validation policy in later authoring/library work: Map/Set
members can disappear, top-level/property undefined differ, numeric lexemes lose
precision/sign, and accepted tab input can yield a surprising mapping shape.
Original bytes, key domains and warning messages must survive that decision.
Successful represented round trips do not prove document fidelity. The sequence
03 → 05 → 06 → 04 → 07 and all 349 original case owners are unchanged.

## Slice06 resource/file handoff

[CC report](slice06-yaml-resource-and-files/closing-report.md) covers all 54
resource cells and eight file variants: 18 default cells each ran a warm-up plus
five measurements, 36 conversion/bound cells have source-backed unsupported
dispositions, and all file faults ran twice. Thirteen supervised controls and
26674 audit checks support this attestation. [CDC verification](slice06-yaml-resource-and-files/cdc-verification.md)
now reproduces the complete matrix/controls and both archived reports, with
4036 additional comparison checks and 138 live files. All seven slice rows close.

[Findings](slice06-yaml-resource-and-files/artifacts/findings.md) distinguish
package timings from setup/inspection, sampled process-tree RSS from true peaks,
and actual OS faults from Deno denials and deliberate injection. Raw interruption
left a 26-byte partial destination; safe interruption preserved the old destination
and left a separately recorded orphan. Both checkpoints were externally observed
before termination. These refine Slice04's cancellation/replacement/resource
policy questions; they do not establish durability or select a library.

No family, document requirement or source/guide/book/human obligation was removed.
Five failed authoring conditions are retained; optional report compaction was
reverted to the passing renderer. CDC also retained and corrected a shell recorder
quoting defect and an initially vacuous live-file selector. Slice04 is now open
before the 28 Slice07 document variants. Arc composition remains open.
