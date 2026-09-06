---
project: project06-planning-reorg
status: implemented-awaiting-operator-review
planned-release: null
release-note: Repository maintenance; no product release assigned.
depends-on: []
blocks: []
related: [project01-mvp, project02-language-toolchain-alignment, project03-language-evolution, project04-c-lang, project05-hardware]
---

# Planning reorganization

Move planning out of implementation documentation, retain original Git history,
and separate project identity from intended release. The operator authorized
the canonical planning worktree and the project01 through project06 identities
on 2026-09-06. Project slugs and historical groupings are reconstructed from
the documents. No historical implementation or verification status is upgraded.

## Definition of done

- Every in-scope tracked planning file has a recorded destination and original
  blob/commit provenance. Pure moves precede content edits.
- The source branch removal chain is 0.6.x → 0.7.x → 0.8.x; source changes
  and local edits survive. The original tips remain reachable.
- Guides and ECMAScript reference material remain in implementation docs.
- Planning has project/arc plans, release metadata, ledgers, and usable links.
- Cross-project discoveries live in root `backlog/`; project candidates stay
  with their project. Hardware planning lives in project05-hardware, as corrected by the operator.

## Roadmap

| Arc | Capability | Depends on | Status |
| --- | --- | --- | --- |
| arc01-history-and-import | Auditable inventory, ancestry imports, and classification | — | delivered; classification review pending |
| arc02-release-propagation | Planning removal propagated through release branches | arc01 | delivered; independently reproduced |
| arc03-navigation-and-verification | Metadata, governance, links, and reproducible checks | arc02 | delivered; independently reproduced |

## Scope and evidence boundaries

The tracked trees in scope are design, dev, versioned design, backlog, and
the separately identified hardware planning tree (project05-hardware). Source guides and ECMAScript
reference documents retain their homes. The ignored workbench archive is
inventoried, remains intact, and has no existing Git history to migrate.
Its mixed release provenance is not silently treated as pre-0.5 material.

The planning worktree began as an empty orphan branch. To satisfy preservation
of original commit identities and path history, selective ancestry merges
connect original source tips while importing only planning paths. This is an
explicit history-preservation exception to disconnected orphan ancestry; the
checked-out planning tree contains no inherited implementation tree. Never
merge this branch into a release branch.

## Verification

Check the migration manifest against original Git blobs, verify rename-only
commits, sample and exhaustively check file history, verify source ancestry and
retained paths, run citation gates, and compare pre/post local hardware hashes.
Doer evidence is attested; independent framework closure remains a separate gate.

## Version history

- 2026-09-06 v1.0: Opened from the operator's eight-point migration request;
  backlog placement confirmed; operator corrected hardware to project05-hardware and this effort to project06-planning-reorg.

- 2026-09-06 v1.1: Arc01 preserved 631 tracked files and original ancestry;
  recorded 18 approximate MVP arcs, six arc-plan promotions, three decimal
  wrappers, and six inherited divergent blobs. Corrected hardware/project
  numbering followed the operator's explicit instruction.
- 2026-09-06 v1.2: Arc02 propagated removals by rebase through all releases;
  original source tips remain under backup refs and planning ancestry. Nine
  modified hardware records and eleven untracked artifacts were relocated
  without committing the user's work.
- 2026-09-06 v1.3: Arc03 updated governance, READMEs, BOOTSTRAP, metadata,
  links, ledger homes and research helper paths. Independent mechanical
  verification passed; 482 documentation tests passed. Retained source guides
  and ECMAScript data are byte-identical to original 0.6.

## Delivery and remaining acceptance boundary

Implementation is delivered locally. See closing-report.md and the arc03
verification summary. Operator review of the approximate historical groupings
is the remaining project acceptance decision; it does not block use of the
new planning tree. No historical software project was newly declared closed.
No pushes, force pushes, or main implementation merges were performed. Main
received only the synchronized governance file, per its existing exception.
