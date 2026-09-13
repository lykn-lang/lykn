# CC Prompt — arc09 slice05 Release-candidate UAT Feedback

You are working in the Lykn language repository. Follow `AGENTS.md`, the
project-management guidance, and work-verification guidance.

Important homes:

- Source release worktree: `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`
- Planning worktree: `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`
- Current release-candidate commit: `50608c443c452107b138cc30deda4a09ab5c7642`

## Objective

Run or record UAT in the projects that need to ship with the Lykn 0.6.0 release
candidate. Do not publish Lykn, create release tags, or push release tags in
this slice.

## Required reading

1. This slice's `slice-plan.md` and `ledger.md`.
2. slice04's deferral close:
   - `../slice04-operator-publication-and-tags/closing-report.md`
3. slice03's CDC-verified dry-run evidence:
   - `../slice03-publish-dry-runs-and-package-audit/closing-report.md`
   - `../slice03-publish-dry-runs-and-package-audit/cdc-verification.md`
   - `../slice03-publish-dry-runs-and-package-audit/artifacts/dry-run-and-package-audit-receipt.md`

## Work

1. Confirm source and planning status before touching anything.
2. Build a UAT matrix under this slice's `artifacts/` directory. Include:
   - project name and path/repo;
   - project commit/status before testing;
   - how it consumes the 0.6.0 release candidate;
   - commands run;
   - pass/fail result;
   - feedback and disposition.
3. For each UAT project, run the project-specific gates the operator names or
   that the project plan requires.
4. If feedback is release-blocking, either implement a new source iteration in
   the correct source worktree or open a clearly scoped remediation slice before
   publication resumes.
5. If all projects can ship with the release candidate, open the next
   operator-publication/tag prompt with the exact release-candidate commit and
   the UAT matrix.

## Boundaries

- Do not publish Lykn 0.6.0 in this slice.
- Do not create or push `0.6.0` or `book-v0.6.0` tags in this slice.
- Preserve unrelated planning work and use explicit pathspecs if committing.
- Keep CC proposed-done, CDC verification, and operator acceptance distinct.

## Completion

Close this slice when UAT feedback is fully recorded and publication either
resumes through a new approval boundary or is explicitly held for a named
release-candidate iteration.
