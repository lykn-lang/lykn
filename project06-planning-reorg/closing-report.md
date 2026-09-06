# Planning reorganization — delivery report

The migration is implemented and committed locally. Project acceptance awaits
operator review of the approximate historical grouping (P-2); mechanical
preservation, propagation, metadata, and navigation checks are independently
reproduced. This report is a proposed project close, not a false assertion of
operator acceptance or historical software completion.

## What changed

- 631 tracked planning files now live in six named projects and the root backlog.
- Original commits remain reachable; imports and pure moves are separate commits.
- Project01 has 18 approximate arcs, including the DD-50.5 family in arc14.
  Six original phased implementation plans are now arc-plan.md.
- Project02 retains its existing arcs plus arc15.1, arc16.1 and arc16.2 wrappers
  around three historically standalone slices. Creation-date evidence and ties
  are recorded in their plans.
- Every project plan carries YAML release intent and relationship metadata.
- Planning removals propagated through 0.6.x, 0.7.x and 0.8.x; the final source
  trees are identical. Guides and ECMAScript reference material remain intact.
- AGENTS.md is identical across main, all three release branches and planning;
  CLAUDE.md remains its compatibility symlink. Release READMEs, planning/project
  READMEs, BOOTSTRAP and the status entrypoint identify the new homes.
- Old ODM configuration is archived, with original DD metadata retained.
- Nine modified and eleven untracked hardware files remain uncommitted in
  project05-hardware, with raw-state recovery via the saved stash.

## Project row walk

| Row | Disposition | Evidence |
| --- | --- | --- |
| P-1 | done, reproduced | 631 original/move blobs, all destinations, ancestry, manifests and history probes |
| P-2 | open for operator acceptance; implementation delivered | classification-notes.md, 18 MVP arcs, project mappings and six arc-plan promotions |
| P-3 | done, reproduced | Ancestry checks, identical release trees, removal-path checks |
| P-4 | done, reproduced | Retained guide and ECMAScript path sets and bytes unchanged |
| P-5 | done, reproduced | All 48 permanent discovery IDs retained; local hardware hashes match |
| P-6 | done, reproduced | Six metadata blocks, synchronized governance and no newly broken planning links |

## Composition and validation

Arc01 supplies the inventory and preserved planning tree; arc02 removes the
source copies only after preservation and establishes the ancestry chain;
arc03 makes the new tree navigable and checks the combined result. Every arc's
single planned slice delivered its assigned work. The independent verifier
reported zero errors. Documentation tests: 482 passed, zero failed. Adjusted
research helpers also pass syntax/import and functional smoke checks.

See [verification-summary.md](arc03-navigation-and-verification/slice01-migration/artifacts/verification-summary.md)
and [migration-manifest.json](arc01-history-and-import/slice01-migration/artifacts/migration-manifest.json).

## Explicit boundaries and follow-up

- The 60 pre-existing unresolved/future link references remain recorded, not
  hidden by new exceptions or represented as migration-introduced failures.
- The ignored mixed-era workbench/old archive remains intact and inventoried;
  its 242 files were not silently imported or represented as tracked history.
- Hardware ledger entrypoints retain authority in the existing embedded rows,
  avoiding a structural rewrite of live uncommitted planning edits.
- Main's implementation/docs tree awaits normal release integration; only its
  governance file changed directly. No remote branches were pushed.
- Original source tips are retained under backup/planning-reorg-20260906 refs
  and in planning ancestry. The hardware safety stash was not dropped.

## What worked

Importing original paths with original source ancestry before pure moves made
history followable. Blob manifests exposed differences without trusting branch
names. Treating local hardware work separately preserved its uncommitted state.
Comparing against pre-existing citation failures kept the migration boundary
honest while still requiring zero introduced navigation breaks.
