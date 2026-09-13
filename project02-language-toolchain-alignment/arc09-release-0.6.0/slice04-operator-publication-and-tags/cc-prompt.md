# CC Prompt — arc09 slice04 Operator Publication and Tags

You are working in the Lykn language repository. Follow the repository
instructions in `AGENTS.md` and the collaboration-framework project-management
and work-verification guidance before changing planning status.

Important homes:

- Source release worktree: `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`
- Planning worktree: `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`
- Book repo: `/Users/oubiwann/lab/cnbb/lykn`
- Writers-guide repo: `/Users/oubiwann/lab/cnbb/lykn-writers-guide`

## Objective

Prepare the final operator approval packet for 0.6.0 publication and tags. Do
not publish, tag, or push until the operator explicitly authorizes the concrete
commands and scope.

## Required starting evidence

1. Read this slice's `slice-plan.md` and `ledger.md`.
2. Read slice03's close packet and receipt:
   - `../slice03-publish-dry-runs-and-package-audit/closing-report.md`
   - `../slice03-publish-dry-runs-and-package-audit/artifacts/dry-run-and-package-audit-receipt.md`
3. Confirm source status and exact HEAD. The expected release evidence commit is
   `50608c443c452107b138cc30deda4a09ab5c7642` on `release/0.6.x`.
4. Confirm planning status and preserve unrelated planning work.
5. Inspect book and writers-guide status before any book-related tag/publication
   decision. Preserve the book repo's pre-existing untracked `_to_delete/` unless
   the operator explicitly says otherwise.

## Operator approval boundary

Before real publication, present a concise packet containing:

- source branch and exact commit;
- package versions to publish;
- slice03 dry-run results and the crates sequencing qualification;
- the exact commands you propose to run;
- the exact tag and remote-push commands you propose to run;
- any book tag/publication command, if proposed.

Ask for explicit approval at that point. The user should be approving concrete,
reviewable commands, not a vague intent.

## Publication sequence after approval

Run only the approved commands. Expected source publication order:

1. `./bin/lykn publish --jsr`
2. `./bin/lykn publish --npm`
3. Crates in dependency order:
   - `cargo publish -p lykn-lang`
   - after registry availability, `cargo publish -p lykn-cli`
   - after registry availability, `cargo publish -p lykn`
4. Create source tag `0.6.0` only after successful source artifact publication.
5. Push `release/0.6.x` and tag `0.6.0` explicitly to intended remotes.
6. If explicitly approved, handle book `book-v0.6.0` tag/publication with the
   book repository's current instructions and status.

Do not pass `--allow-dirty`, `--force`, `--no-verify`, or equivalent bypass
flags unless the operator explicitly approves a safety-gate exception and the
planning report records why the exception was necessary.

## Evidence to capture

Save publication/tag/push transcripts under this slice's `artifacts/` directory.
Record exact commit hashes, tag names, registry package names/versions, and
remote names.

## Completion

Update this slice ledger and closing report, arc09 ledger/status, and open
slice05 `postpublish-verification-and-project-close` with the exact published
artifacts and temporary-install checks expected next.
