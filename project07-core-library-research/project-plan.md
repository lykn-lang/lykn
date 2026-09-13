---
project: project07-core-library-research
status: active
planned-release: null
depends-on: []
blocks: []
related: ["project02-language-toolchain-alignment", "project03-language-evolution", "lykn-patch", "lykn-book"]
---

# Core library research

2026-09-13 current sequencing: Slice04's resumed preparation reached four
source-authoring failures. Its explicit before-exhaustion rule now routes
bounded native supervisor verification to
[Arc03/Slice07](arc03-findings-and-integration/slice07-research-supervisor/slice-plan.md).
After that independent CDC, resume the full Slice04 research assignment.
All eight DB rows, 47 candidate IDs and expansions, 36 unsupported resource
cells, 28 gated documents and source/book/guide/ADT/human owners remain.
The launcher correction stays verified; this is a new tooling prerequisite.

## Purpose and authority

Establish an evidence-backed foundation for using Lykn in our general work,
starting with JSON and YAML libraries in the Lykn patch. Intensive library use
must also improve the language, compiler, formatter, tooling, LLM guides, and
book. The operator's judgment of the code's elegance and the language's
direction is a first-class outcome.

The operator authorized this project on 2026-09-12, after the exploratory
JSON/Deno/YAML discussion, and explicitly enabled **Expedited Mode**. This is
the shared research project; each new core library receives its own project
in this planning worktree. JSON precedes YAML in the initial library queue.
Their project numbers, package names, repository locations, and release targets
are not assigned by this opening.

Planning lives on branch `planning` at
`/Users/oubiwann/lab/lykn/lang/.worktrees/planning`, under
`project07-core-library-research/`. Use the established project/arc/slice open
sets and dedicated ledgers; durable slice artifacts live in the owning
slice's `artifacts/` directory. This applies the operator's requested location
and the existing repository convention. Never merge planning into source.

## Definition of done

1. Reproducible research distinguishes native Deno facilities, standard-library
   packages, other dependencies, and the behavior Lykn must supply for JSON
   and YAML reading, parsing, editing, and writing.
2. Decisions address numeric fidelity, duplicate keys, null versus absence,
   errors, resource bounds, file replacement, streaming, and YAML document
   preservation. Each conclusion has versioned evidence and stated limits.
3. Actual Lykn trials establish the available ADT, recursive-value,
   collection, matching, error, asynchronous I/O, and module capabilities.
   Planned features, documented promises, and compiler behavior remain distinct.
4. LLM guide usability and resulting code quality are evaluated with captured
   tasks, references actually loaded, mistakes, attribution, corrections,
   and denominators for any reported frequency.
5. Book discrepancies and operator reactions to representative Lykn code are
   recorded and investigated. Machine correctness and human acceptance have
   separate evidence; an LLM cannot supply the operator's aesthetic judgment.
6. Accepted corrections are integrated in their proper source repositories,
   with appropriate validation and independent verification. Remaining work
   has explicit ownership, destination, rationale, and re-entry conditions.
7. A coherent synthesis supports separate JSON and YAML project openings in
   the language planning worktree, carrying the research, source boundaries,
   dependencies, guide/book goals, and human acceptance criteria forward.
8. Arc and project composition are independently checked; the operator accepts
   the resulting direction and any explicit residual work.

The checkable contract is [ledger.md](ledger.md). This project plans inquiry;
no library architecture or dependency selection is accepted by this document.
The research synthesis and later library design records will establish those
decisions from evidence.

## Scope

- JSON: complete read/parse/edit/serialize/write workflows, malformed input,
  number precision and exact representation, duplicate keys, arbitrary object
  keys, missing/null distinction, unsupported values, deterministic output,
  JSONC, JSON Lines/framed streams, and document-versus-value fidelity.
- YAML: the same workflows plus schemas, scalar resolution, tags, non-string
  mapping keys, aliases/cycles/merges, multi-document streams, diagnostics,
  comments, formatting, anchors, and the cost of preserving source documents.
- Deno: runtime and package version compatibility, dependency graph and
  provenance, Node/npm exclusion, import maps, locks, permissions, cached and
  offline execution, file replacement semantics, and resource limits.
- Lykn: executable evidence for ADTs and type boundaries, recursive data,
  collections, result handling, domain decoding, imports, async code, compiler
  parity where relevant, formatter behavior, diagnostics, and idioms.
- Authoring ecosystem: LLM guides, book consistency, operator readability and
  aesthetic review, and corrections to language/compiler/formatter/tooling.
  These concerns apply throughout every arc, not only during a final review.

Production JSON/YAML libraries and publication belong to their ensuing
projects. Research fixtures and narrow prototypes are in scope here and must
be labeled as such. Whole-language redesign, unrelated refactors, a release
commitment, or migrating historical projects are not implied. Necessary
corrections to the authoring ecosystem remain in scope and are delivered
through explicit slices; a research-only slice is not authority for arbitrary
source edits.

## Arc roadmap

| Arc | Capability | Dependencies | Status |
| --- | --- | --- | --- |
| [arc01-format-runtime-evidence](arc01-format-runtime-evidence/arc-plan.md) | Versioned JSON/YAML/Deno capability and dependency evidence, with reproducible probes and unresolved policy questions | None; existing planning substrate is usable | Active; Slices01–03/05–06 CDC closed; Slice04 awaits bounded supervisor CDC |
| arc02-lykn-authoring-evidence | Representative Lykn trials connect ADT behavior, guide usability, book consistency, and operator code review | Arc01 baseline and format tasks; carry later Arc01 changes forward | Roadmap only |
| [arc03-findings-and-integration](arc03-findings-and-integration/arc-plan.md) | Correct, validate, and independently verify accepted guide/book/language/tooling findings, with regression comparisons | Arc02 findings and any earlier urgent findings | Active early; Slices01/06 CDC closed; Slice07 supervisor prerequisite open; Slice02 queued |
| arc04-library-handoff | Recompose research into explicit library contracts and individual JSON/YAML project openings | Arcs01–03 and operator disposition of open design choices | Roadmap only |

Plan later arcs and slices in depth when their evidence is available. The
Arc02 decomposition must include bounded trials for ADTs/interop, guide use,
and book/operator review. Arc03 must pair corrections with reproduction of
the original failure and relevant regressions. Arc04 must compare alternatives,
record accepted decisions separately from recommendations, identify the actual
patch repository, and carry every unresolved dependency into the handoff.

## Research and evaluation contract

Use Lykn for research programs by default. Record an actual toolchain gap
before proposing a fallback; do not quietly substitute Python, Ruby, Fennel,
Node, or an npm package. Exact public API/source inspection is not a claim
that a Lykn program has exercised that API.

Each trial records its question, decision use, inputs, pinned toolchain and
source commits, allowed references, commands, permissions, outputs, and
limitations. Separate exploration from predeclared confirmation. Preserve
failed attempts and contrary findings. Each source claim has a locator,
retrieval date, and evidence strength. Package source, API documentation,
runtime observations, and operator reports are distinct evidence types.

Guide evaluations retain the original task and generated code, the guide
paths actually consulted, model/settings when available, interventions, and
outcomes. Attribute failures as incorrect documentation, ambiguity, missing
guidance, agent noncompliance, implementation defect, or unresolved. Counts
need a stated denominator and severity; do not infer population error rates
from a few trials. A before/after claim holds task/toolchain/model constant
where possible and discloses contamination, order effects, and other changes.

Human review records the exact source sample, operator comments, liked and
disliked forms, requested revisions, and the resulting disposition. It is
qualitative acceptance, not a synthetic score that an LLM assigns for the
operator. No response is not acceptance.

## Findings and source integration

Use the existing [Discovery Register protocol](../backlog/README.md).
Confirmed cross-cutting findings receive permanent IDs in
`../backlog/discoveries.md`; consult existing IDs before adding another.
Slice artifacts retain the detailed observations. A finding is not routed
until its destination exists in Git and actually contains it. Hypotheses
remain hypotheses; a proposed fix does not close a discovery.

Source changes use the applicable registered release worktree, not `main`.
Book work uses its separate repository and coordinates with
`project02-language-toolchain-alignment/arc16-book-0.6.0-edition` without
overwriting its existing ownership or status. Confirm the patch repository's
actual identity and branch before naming any library source destination.
At each correction opening, enumerate exact source paths/branches and gates.
This is routine scope concretization under the operator's authorization;
ask only where an unresolved design choice or external action requires it.

## Expedited Mode and evidence boundaries

- CC commits scoped changes before CDC review. Every CC prompt enumerates
  exact commit paths; inspect staged content and preserve other contributors'
  work. Never use a blanket add or a commit that sweeps unrelated staged files.
- CC reports proposed-done with attested evidence. CDC independently reproduces
  the evidence and commits its review/changes. The same author cannot claim
  independent verification of their own work.
- Close a slice as soon as complete evidence supports closure, then immediately
  open the next slice and report its full arc/slice `cc-prompt.md` path as
  plain copy/paste text relative to this project.
- At the end of an arc, perform formal composition/arc close and open the next
  roadmap arc and its first slice when its dependencies are satisfied.
- No shortcuts, no skipped validation, no weaker evidence or review, no
  inferred source scope and no reduction or other change in scope, no timeline
  interpretation; operator approval gates are not overridden.
- Unresolved human judgments remain open. Explicitly deferred rows require a
  rationale, real destination where applicable, re-entry condition, and honest
  effect on the containing unit's definition of done.

Assistant-authored commits include the repository's contiguous trailers:

```text
Co-authored-by: Codex <noreply@openai.com>
Co-authored-by: Billo AI <ai-engineering@billo.systems>
```

## Current status

At opening, Arc01/Slice01 had its full open set and no execution or close set.
Slice01 is now CDC closed with seven independently verified criteria; see its
[CDC verification](arc01-format-runtime-evidence/slice01-baseline-and-protocol/cdc-verification.md).
Arc03/Slice01 is now [CDC closed](arc03-findings-and-integration/slice01-run-permissions/cdc-verification.md)
(was CC proposed-done), with its corrected-build receipt independently verified.
Arc01/Slice02 is now [CDC closed](arc01-format-runtime-evidence/slice02-json-behavior/cdc-verification.md)
(was CC proposed-done): all 161 frozen variants/354 attempts independently
replayed. Slice03 YAML preflight is now
[CDC closed](arc01-format-runtime-evidence/slice03-yaml-preflight/cdc-verification.md),
with all six criteria reproduced and all 349 YAML variants retained. Slice05
is [CDC closed](arc01-format-runtime-evidence/slice05-yaml-value-behavior/cdc-verification.md)
for 259 value variants after full independent replay. Slice06 is now
[CDC closed](arc01-format-runtime-evidence/slice06-yaml-resource-and-files/cdc-verification.md):
108 resource attempts, 16 file attempts and 36 explicit unsupported cells retain
all 62 assigned IDs. Slice04 is [open for execution](arc01-format-runtime-evidence/slice04-dependency-and-runtime-boundary/slice-plan.md)
for all R-01–09 runtime/dependency families before the 28 gated document variants.
Its preparation was blocked by D-2609-DARG after the operator upgraded Deno
from 2.7.7 to 2.9.6. The old pinned CLI failed to select even a minimal no-import
script, with or without explicitly requested all-permissions. The concrete
[Arc03/Slice06 correction is now CDC closed](arc03-findings-and-integration/slice06-deno-launch-compatibility/cdc-verification.md).
Resume Slice04 using source 4dded88 and the independently verified selected
release binary on Deno 2.9.6, with complete operational freeze and preflight owed.
Its eight criteria, draft variants, 36 unsupported resource cells and 28 gated
document cases remain owed. Existing PERM closure retains its original provenance.
CDC has [reproduced that blocker and partial evidence](arc01-format-runtime-evidence/slice04-dependency-and-runtime-boundary/cdc-verification.md)
and then reproduced the corrected pair, 16 regressions, full gates and eight
fresh runtime captures. Normal run, argument/path and explicit-permission
contracts are retained. The complete compiler interval since d0bb981 includes
earlier embedded/toolchain changes, which Slice04 R-01/R-02 must inventory.
Three failed authoring conditions remain charged; old-runtime comparison is
unavailable and the candidate matrix/supervisor still require validation.
All project ledger rows remain open; no operator
acceptance or library adoption is claimed.

Slice01 bubble-ups: D-2609-PERM recorded implicit run grants; the release/0.6.x
correction is now independently verified and the discovery closed as repaired.
D-2609-YNOD records Node API imports in the JSR YAML
document candidate; preserve the document-fidelity requirement while resolving
candidate policy. D-2609-LINT/NPMB/JSER retain guide and book corrections for
Arc03. See the slice's [findings](arc01-format-runtime-evidence/slice01-baseline-and-protocol/artifacts/findings.md).
Arc03 opened early for the launcher prerequisite; Arc01/Slice02 is now verified.
Its [findings](arc01-format-runtime-evidence/slice02-json-behavior/artifacts/findings.md)
add D-2609-NZRO/JSCF/UNUS for compiler output/diagnostics and runtime support for
JSER. Proposed Arc03 correction owners remain open until exact slices exist.
Arc02 must retain original/revised source and pending operator code-shape review.
Test-runner permissions remain a
separate Arc03 follow-up, not part of this bounded correction.
Patch identity remains unresolved. Corrected binary provenance has a locally
reproduced build receipt; historical B01 provenance is not rewritten. Concurrent
release work changed the live compiler bytes; research now exports the pinned
source into an isolated build and records its fresh identity.

JSON's authoring/context pressure split the unstarted YAML roadmap into
Slice03 preparation, Slice05 values, Slice06 resources/files and Slice07
document fidelity. Existing Slice04 runtime/policy runs before Slice07 to
resolve its compatible route. All Y-01–16 requirements remain; preparation is
closed, value and resource/file execution are verified, and runtime/dependency
work is open. The 36 unavailable conversion/bound capabilities require an actual
compatible API before re-entry; external thresholds are not package limits.
Evidence aggregation/audit follows the same Lykn-first rule as runtime probes. The JSON
CDC records CC's Python aggregation deviation and supplies an independent Lykn audit; full
authoring evaluation remains Arc02.

## Version History

- 2026-09-13 v1.17: Arc01/Slice04 retained a fourth source-authoring failure
  and unexecuted supervisor review gaps; opened bounded Arc03/Slice07 before
  budget exhaustion. Preserved all research/document/source/human obligations
  and the verified launcher correction. No project criterion closes.

- 2026-09-13 v1.16: CDC independently closed all six launcher criteria and
  DARG as repaired. Resumed full Slice04 on the verified 4dded88/Deno 2.9.6 pair,
  with baseline drift, operational freeze, authoring budget and all outstanding
  research/guide/book/ADT/human obligations preserved. No project row closes.

- 2026-09-13 v1.15: Arc03/Slice06 submitted source correction 4dded88 with full
  source gates and an isolated binary tested at its recorded hash. Its six rows
  await CDC; Slice04 remains gated. The correction preserves stdin, specifiers,
  permissions and import bases without selecting any library/document route.

- 2026-09-13 v1.14: CDC verified the Slice04 blocked handoff and confirmed the
  Arc03/Slice06 correction prompt. Four fresh minimal failures, eval success,
  460 packet files, 376 published-file checks and six byte-identical outputs
  reproduce. No research or correction row closes; stdin/specifier/path
  preservation is explicit and all downstream human/source/library work remains.

- 2026-09-13 v1.13: Arc01/Slice04 preparation reproduced a Deno 2.9.6 launcher
  incompatibility after the operator upgrade; preserved the original 2.7.7
  condition and failed drafts. Opened Arc03/Slice06 as a narrow compatibility
  prerequisite, with source scope and actual permission/path regressions.
  Slice04 remains open/blocked with all eight criteria and full runtime,
  document, API-bound, authoring and human obligations intact.

- 2026-09-13 v1.12: CDC closed Arc01/Slice06 after full runtime, file and packet
  replay, with 4036 independent comparison/live-file checks. Corrected the
  documented argv recorder and retained both failed CDC authoring conditions.
  Opened Slice04 for all R-01–09, including provenance versus runtime edges,
  cold/warm offline distinction, permissions, concurrent replacement and
  attributable faults. Document execution still requires a compatible route;
  unsupported APIs, source/book/ADT work and operator judgment retain owners.

- 2026-09-12 v1.11: Arc01/Slice06 submitted bounded resource and actual file-fault
  evidence with 26674 audit checks. Unsupported conversion/bounds remain explicit;
  observed partial writes and sampled memory limits refine the Slice04 policy
  handoff. All 349 YAML owners, document/source/authoring and human obligations
  remain; no project outcome inherits CC closure.

- 2026-09-12 v1.10: Arc01/Slice05 CDC independently reproduced all 259 value
  variants twice, their controls and correction comparison. Slice06 now opens
  all 62 resource/file variants with explicit API absence and transport limits;
  28 documents remain behind Slice04. No package policy, source repair, human
  acceptance or project composition criterion inherits closure.

- 2026-09-12 v1.9: Arc01/Slice05 submitted all 259 value variants twice with
  real file/graph/diagnostic evidence and 35,098 audit checks. Its full warning-
  capture confirmation preserves prior observations. Value-domain loss and
  permissive parsing must inform later library validation policy; remaining
  resource/document/runtime, source/book and human owners are unchanged.

- 2026-09-12 v1.8: Arc01/Slice03 CDC reproduced the pinned build, freeze and all
  38 sentinel/harness attempts plus three supervisor controls. Opened Slice05
  with 259 value variants and explicit full file/serialization obligations;
  retained 62 resource/file and 28 gated document variants. Inspector bounds
  remain observation guards, not hard allocation guarantees. No project row,
  source finding, package policy or operator judgment inherits closure.

- 2026-09-12 v1.7: Slice03 submitted YAML harness preparation with 349 YAML
  variants frozen and 38 sentinel/control attempts audited through Lykn.
  CDC, full Slices05/06/07 execution, Slice04 policy and operator review remain
  separate obligations; no project-scale criterion inherits completion.

- 2026-09-12 v1.6: Arc01/Slice02 CDC replayed all JSON attempts and compiler
  findings. Opened bounded YAML preparation with complete future ownership;
  retained Slice04 before gated documents. Added isolated-source build and
  Lykn evidence-tooling discipline based on concrete review observations.
- 2026-09-12 v1.5: Arc01/Slice02 submitted all JSON families as CC proposed-done,
  including native/package/file/resource evidence and three compiler findings.
  Preserved CDC, YAML/runtime, full authoring and human-acceptance boundaries;
  no correction, dependency adoption or project criterion inherited as closed.

- 2026-09-12 v1.4: Arc03/Slice01 CDC verified six criteria and the corrected
  binary, closed the launcher finding and resumed Arc01/Slice02. Package,
  resource, test-runner and operator obligations retain their original owners.
- 2026-09-12 v1.3: Arc03/Slice01 CC delivered the run correction, passing gates
  and a reconciled source/binary receipt. Kept CDC and JSON execution gated; no
  project criterion or other finding is inherited as closed.

- 2026-09-12 v1.2: Closed Arc01/Slice01 after independent CDC reproduction;
  opened Arc03 and its bounded run-permission correction as the next executable
  work, and opened Arc01/Slice02 with its prerequisite explicit. All research
  families, authoring goals, and project-scale acceptance requirements remain.
- 2026-09-12 v1.1: Arc01/Slice01 proposed-done baseline revealed permission
  launcher and candidate Node-API prerequisites; retained guide/book findings
  and updated status/evidence pointers. Original scope and all future owners
  preserved; CDC and operator acceptance remain pending.
- 2026-09-12 v1.0: Opened from the operator's core-library research request;
  includes the explicit guide, book, language/tooling, and human-elegance
  goals. Adopted the existing planning layout and operator-requested
  Expedited Mode. Detailed Arc01 and opened Slice01; no dependency or language
  design decision was promoted from the exploratory discussion.
