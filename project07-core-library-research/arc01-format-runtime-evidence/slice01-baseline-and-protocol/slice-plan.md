# Slice01 — Baseline and research protocol

## Goal and status

Make subsequent JSON, YAML, Deno, and Lykn research reproducible by pinning the
actual environment and converting the exploratory discussion into a sourced
claim inventory and bounded trial protocol. Status: **CDC closed** (was CC
proposed-done). All seven rows are reproduced; see [CDC verification](cdc-verification.md).
The [closing report](closing-report.md) retains CC's original attestation.

Read the [project plan](../../project-plan.md), [arc plan](../arc-plan.md),
[ledger](ledger.md), and [CC prompt](cc-prompt.md). The supplied
[starting evidence](artifacts/starting-evidence.md) is an input to verify,
not acceptance evidence for completed research.

## In scope

1. Inventory actual executable paths/versions, registered source worktrees,
   commit IDs, dirty state, guide entrypoints and symlink targets, and the
   separate book repository. Identify the patch repository if present; if
   absent or ambiguous, report that fact and retain it as a handoff question.
2. Distinguish the installed CLI from source/release builds. Select a concrete
   available research baseline and explain why; record missing executable or
   compatibility evidence without installing/upgrading or rebuilding source.
3. Recheck the prior JSON/YAML/Deno claims against primary API docs and pinned
   published source. Identify exact package versions and stable versus unstable
   APIs. Record runtime dependencies separately from dev/example dependencies.
4. Specify the format fixture matrix and replay protocol for Slices02–04,
   including expected invariants, unknown outcomes, failure cases, byte
   fidelity, permissions, isolated fixture locations, and evidence capture.
5. Specify the later Lykn/guide/book/operator evaluation protocol, including
   original task/source retention, reference-use logs, attribution, counters
   with denominators, qualitative review, and comparison controls.
6. Identify contradictions, stale guides, or missing prerequisites from the
   baseline work. Record confirmed findings via the existing Discovery
   Register after checking for duplicates; keep untested hypotheses distinct.

## Out of scope for this slice

No production libraries, compiler/formatter changes, guide/book edits,
dependency adoption, repository creation, toolchain upgrades, publication,
or full format test execution. Those have explicit later homes in the
project. This slice prepares research; it must not present API inspection as
runtime validation or operator acceptance.

## Required artifacts

All durable artifacts live in this slice's `artifacts/` directory:

- `baseline.md`: source/toolchain/package identity table, commands and dates,
  source ownership, dirty-state caveats, selected baseline, missing capabilities.
- `source-register.md`: claim IDs, primary locators, version/commit, access
  date, documentation/source/runtime evidence kind, support or contradiction,
  and unresolved details. Reconcile every starting-evidence row.
- `research-protocol.md`: repeatable setup, fixture scope, tools, permissions,
  recording format, stop conditions, controls and replay instructions.
- `fixture-matrix.md`: stable case IDs grouped by JSON, YAML, Deno/runtime,
  and Lykn/authoring; question, inputs, expected invariant or explicitly
  unknown outcome, evidence required, and owning later slice/arc.
- `authoring-evaluation.md`: guide, book, and human review protocol, error
  attribution taxonomy, measurable observations, and limitations.
- `findings.md`: confirmed findings and hypothesis register, discovery IDs
  where required, implications and specific follow-up destinations or open
  status. A substantiated "no additional confirmed findings" is valid.

Keep the original `starting-evidence.md` provenance visible if it is corrected;
do not rewrite an earlier claim as if it was always known to be false.
Raw command outputs may be recorded in fenced blocks in these artifacts.
If extra artifact files become necessary, enumerate their exact paths in the
prompt/commit scope before creating them.

## Verification and exit criteria

The [slice ledger](ledger.md) defines the full contract. A reviewer must be
able to reproduce local identities and inspect pinned primary sources, trace
every initial claim to a disposition, and select each later research case
without guessing its owner, success criterion, or evidence format. Links and
source locators must resolve in the stated source context. Review the fixture
matrix against the project scope for missing requirements.

All ledger rows remain open until their criteria have evidence. CC records
attested/proposed-done dispositions; CDC independently reproduces before
formal closure. A lack of a patch checkout need not block this baseline slice
if accurately recorded; it remains unresolved for source integration/handoff.
Five correction iterations are the upper bound before reassessing slice size.

## Source and commit scope

Work in the planning worktree. Read source/release/book repositories only.
Writes are restricted to the exact paths enumerated by `cc-prompt.md`.
Use Lykn for any required research program; this baseline slice should mostly
need read-only Git/file/tool inspection and primary-source browsing. Do not
use a fallback language to mask a Lykn toolchain gap.

## Version History

- 2026-09-12 v1.2: CDC reproduced all seven criteria, reconciled source/binary/
  book drift, and closed preparation. Arc03 run correction precedes JSON
  execution; no source repair or format trial is claimed by this close.
- 2026-09-12 v1.1: Recorded CC proposed-done after baseline/source inspection,
  fixture/protocol design and findings capture. Runtime launch and candidate
  Node-API gaps are explicit later prerequisites, not executed trials or
  waived requirements. Scope unchanged.
- 2026-09-12 v1.0: Opened the baseline/claim-reconciliation/protocol slice;
  authoring-ecosystem evaluation is part of the research contract from the
  start. No trial results or source fixes are claimed.
