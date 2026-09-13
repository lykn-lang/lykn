# Arc01 — Format and runtime evidence

## Capability and status

Deliver a reproducible account of what native Deno and candidate packages
provide for JSON and YAML, what they lose, and what Lykn libraries must add.
Evidence includes package provenance and the actual runtime/toolchain
baseline, so a dependency recommendation is not inferred from a registry name.

Active arc. Slices01–03 are CDC closed. All 17 JSON families independently
replayed; YAML preflight reproduced 38 sentinel/harness attempts and three
supervisor controls. Slice05 is open for all 259 value variants. Full YAML
families remain owed.
See the [project plan](../project-plan.md) and [arc ledger](ledger.md).

## Slice breakdown

| Slice | Scope and output | Dependency | Status |
| --- | --- | --- | --- |
| [slice01-baseline-and-protocol](slice01-baseline-and-protocol/slice-plan.md) | Pin toolchain/source/package identities, reconcile the exploratory claims, and specify a reproducible research protocol and fixture matrix | None | CDC closed; seven criteria reproduced |
| [slice02-json-behavior](slice02-json-behavior/slice-plan.md) | Exercise JSON read/parse/edit/write through Lykn; document precision, duplicates, absent/null, errors, ordering, escaping, unsupported values, JSONC, framed streams, and file-failure behavior | Slice01; verified Arc03/Slice01 launcher correction | CDC closed; 161 variants/354 attempts replayed |
| [slice03-yaml-preflight](slice03-yaml-preflight/slice-plan.md) | Freeze all Y-01–16 variants/owners; pin runtime/graph; verify Lykn inspector, supervisor and small sentinel set | Slices01–02 evidence | CDC closed; six criteria reproduced, 349 YAML variants frozen |
| slice04-dependency-and-runtime-boundary | Reconcile runtime/package graphs and provenance, Node/npm exclusion, exact versions and lock integrity, permissions, offline replay, resource constraints, and adoption alternatives; resolve the document-route prerequisite | Slices01–03 plus Slices05–06; Y-14 static evidence | Planned; identity retained; precedes Slice07 |
| [slice05-yaml-value-behavior](slice05-yaml-value-behavior/slice-plan.md) | Execute all Y-01–12/Y-15 value/schema/tag/graph/error/presentation/unsupported-value combinations with byte evidence | Verified Slice03 harness and matrix | Open; 259 variants, two attempts each; no full-value execution claimed |
| slice06-yaml-resource-and-files | Execute all Y-13/Y-16 bounded alias/depth/size and file-failure cases; carry wider policy into Slice04 | Slices03/05 | Planned |
| slice07-yaml-document-fidelity | Execute Y-14 through an explicitly compatible route; compare semantic edits and source trivia/bytes | Slice04 compatible-route disposition and relevant value fixtures | Planned; Node candidate remains gated |

The former `slice03-yaml-fidelity` roadmap had no open set or authored work.
It is superseded by Slices03/05/06/07; no Y family is removed. Execution order
is **03 → 05 → 06 → 04 → 07**. This retains the established Slice04 identity
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

## Decisions this arc informs

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
The actionable next handoff is
`arc01-format-runtime-evidence/slice05-yaml-value-behavior/cc-prompt.md`.
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
and D-2609-YNOD. Slice05 is now the next opened work, not Slice04.

CDC preparation review requires Y-01 to read/parse its actual file first and
Y-09 to exercise the real replacement path against an existing destination.
Freeze runtime-value construction and additional operation details before full
execution, keeping YP-M01 IDs/bytes/options and all questions in the crosswalk.
Inspector enumeration and encoding allocate before their output guards; Slice06
and Slice04 must distinguish those costs from package behavior and hard limits.
The 259/62/28 value/resource-and-file/document ownership counts sum to 349.
No source correction or family reduction accompanies this clarification.

## Version History

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
