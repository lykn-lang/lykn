# Canonical handoff placement and durable links

Reconcile candidate 5be740daf857ec6a3529a6196caf4e8b70a7d432 with the
existing close contract. Its closing report is committed under
artifacts/at02/closing-report.md. Preserve that original receipt, and
place the current report at slice-root closing-report.md, as required
by project-management. Correct relative links for that canonical home.
The coordinator initially reported the report absent from the commit,
then found the misplaced report with git ls-tree and corrected that
statement. There is no need to redo an adequate existing row walk.

JV ledger links currently name untracked scratch/final/iter11 files.
Point current evidence links to the committed counterparts under
artifacts/at02/evidence/final/native/, retaining raw scratch paths as
execution provenance in their existing receipts. Check the local links
you change against committed or explicitly pending parent-owned artifacts.
Keep all five JV rows open for the independent reviewer.

The artifact report also coupled every JV status to operator readability
approval. Use the actual ledger contract in the canonical report. JV-05
requires preserved authoring, format and reference evidence, while Arc02
AE-05 owns the separate actual human judgment. The operator has been sent
both original and corrected source and a concrete review question. Its
response remains pending. Do not add a human-rating prerequisite to machine
evidence preservation or erase the real Arc02 human-review gate.

Commit the report and affected evidence-link documentation only, with
explicit named paths and the two contiguous trailers. The frozen source,
outputs, matrix population and pending human feedback stay as recorded.
No decoder re-execution is required for documentation placement.

All research logic must be Lykn. Shell is limited to native invocation,
Git and simple file lifecycle. No Python execution or parity exception
is authorized, and no substitute handwritten JS, Ruby or Fennel tooling
is authorized. This is a routine correction under standing Autonomous
Mode, with the independent review gate preserved.
