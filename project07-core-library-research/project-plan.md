---
project: project07-core-library-research
status: active
planned-release: null
depends-on: []
blocks: []
related: ["project02-language-toolchain-alignment", "project03-language-evolution", "lykn-patch", "lykn-book"]
---

# Core library research

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
| [arc01-format-runtime-evidence](arc01-format-runtime-evidence/arc-plan.md) | Versioned JSON/YAML/Deno capability and dependency evidence, with reproducible probes and unresolved policy questions | None; existing planning substrate is usable | Active; Slice01 CC proposed-done, CDC pending |
| arc02-lykn-authoring-evidence | Representative Lykn trials connect ADT behavior, guide usability, book consistency, and operator code review | Arc01 baseline and format tasks; carry later Arc01 changes forward | Roadmap only |
| arc03-findings-and-integration | Correct, validate, and independently verify accepted guide/book/language/tooling findings, with regression comparisons | Arc02 findings and any earlier urgent findings | Roadmap only; may be opened earlier for a blocking correction |
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
Slice01 now has CC-attested baseline/source reconciliation and trial protocols;
see its [closing report](arc01-format-runtime-evidence/slice01-baseline-and-protocol/closing-report.md).
All ledger rows remain open pending CDC reproduction. Later arcs still have
roadmap scope only; no format trial or operator acceptance is claimed.

Slice01 bubble-ups: D-2609-PERM records a source launcher that injects all Deno
permissions, requiring a correction or explicitly authorized research route
before runtime trials. D-2609-YNOD records Node API imports in the JSR YAML
document candidate; preserve the document-fidelity requirement while resolving
candidate policy. D-2609-LINT/NPMB/JSER retain guide and book corrections for
Arc03. See the slice's [findings](arc01-format-runtime-evidence/slice01-baseline-and-protocol/artifacts/findings.md).
Arc03 may need its already-authorized early opening for the launcher prerequisite.
Patch identity and binary build provenance remain unresolved handoff questions.

## Version History

- 2026-09-12 v1.1: Arc01/Slice01 proposed-done baseline revealed permission
  launcher and candidate Node-API prerequisites; retained guide/book findings
  and updated status/evidence pointers. Original scope and all future owners
  preserved; CDC and operator acceptance remain pending.
- 2026-09-12 v1.0: Opened from the operator's core-library research request;
  includes the explicit guide, book, language/tooling, and human-elegance
  goals. Adopted the existing planning layout and operator-requested
  Expedited Mode. Detailed Arc01 and opened Slice01; no dependency or language
  design decision was promoted from the exploratory discussion.
