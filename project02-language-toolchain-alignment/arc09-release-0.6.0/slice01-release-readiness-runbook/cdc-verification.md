# arc09 slice01 - CDC Verification

Verified by CDC on 2026-09-12.

## Verdict

slice01 is **CDC-verified closed**.

CDC treated CC's close packet as proposed-done and reproduced the runbook's
factual claims against the live release, planning, book, and writers-guide
worktrees. The runbook is fit to drive slice02 and later release work: it
correctly inventories the remaining `0.6.0-dev` version surfaces, preserves
operator ownership of publication/tags/pushes, rejects the current
`make publish-dry-run` target as release evidence while it passes
`--allow-dirty`, and routes the current `make push` mismatch to explicit
release-branch/tag push commands.

## Reproduced Evidence

| Check | CDC result |
|-------|------------|
| Planning commit scope | `e2d11e1` is present in current planning history and changes only arc09/project02/status release-planning files. Current planning HEAD before this CDC pass was `181b32f`, an unrelated Project07 follow-up on top of the slice01 packet. |
| Required guidance | CDC read the planning, release, book, and writers-guide `AGENTS.md` files plus the project-management and work-verification close guides. The planning/source/book split is preserved. |
| Source release state | `release/0.6.x` is clean at `d0bb981dae2a4abf6c984406c4b2081a45cc92f8`. |
| Version surfaces | `Cargo.toml`, local `Cargo.lock` Lykn package entries, and the three package `deno.json` files still contain `0.6.0-dev`; `./bin/lykn --version` reports `lykn 0.6.0-dev`. slice02 correctly owns the `0.6.0` bump. |
| Branch/tag/remotes | `git branch -vv` shows no upstream for `release/0.6.x`; configured remotes are `codeberg`, `github`, and `macpro`; local language tags stop at `0.5.2`. |
| Book tag boundary | The book repo has no local tags, and `src/book-versions.md` names `book-v0.6.0` as the future release tag when the 0.6.0 release is cut. |
| Publish dry-run boundary | The release Makefile's `publish-dry-run` target still invokes `cargo package ... --allow-dirty --list`, so the runbook is correct to repair or avoid it as release evidence. |
| Push boundary | The release Makefile's `push` target pushes `main` and tags to each remote, so the runbook is correct to use explicit `release/0.6.x` branch and `0.6.0` tag pushes instead. |
| Release-note inputs | The source checkout has no existing release-note/changelog file found by the release/changelog filename sweep; slice02 correctly owns creating or updating the 0.6.0 release-note artifact. The listed inputs match visible `0.5.2..HEAD` themes and routed discovery rows. |
| Next slice packet | `slice02-version-bump-release-notes-ci-chore/` contains a slice plan, ledger, and CC prompt that preserve no-publication/no-tag boundaries and carry the runbook findings forward. |
| Status JSON | The touched project/arc status JSON files parse. |
| Hygiene | Source remains clean; book remains clean except for pre-existing `_to_delete/`; writers-guide remains clean. |

## Ledger Disposition

| Row | CDC disposition |
|-----|-----------------|
| R-1 | Accepted. The close report lists the required guidance and CDC re-read the governing instruction files. |
| R-2 | Accepted. CDC reproduced the live version inventory across Rust, JS package, CLI, branch/tag, remotes, CI, and publish command surfaces. |
| R-3 | Accepted. The release-note input inventory separates user-visible changes, compatibility notes, routed discoveries, and deferred Project07 work; no existing release-note home was silently assumed. |
| R-4 | Accepted. The runbook specifies no-bypass dry-run evidence and correctly refuses the current `make publish-dry-run` target as release evidence while it passes `--allow-dirty`. |
| R-5 | Accepted. Publication, tags, pushes, and book release tags are explicitly operator-owned. |
| R-6 | Accepted. Post-publish verification names registry checks, explicit temporary install roots, consumer smokes, remote tag/branch visibility, and book tag evidence. |
| R-7 | Accepted. No current Project02 release blocker is supported by slice01 evidence; CI checkout, dry-run, and push-surface chores are routed to later arc09 slices. |
| R-8 | Accepted after CDC bookkeeping. arc09's detailed sequence, ledger, status surfaces, and slice02 prompt are present and updated to reflect slice01 as CDC-verified. |

## Bubble-Up Check

slice01 delivered the arc09 capability assigned to it: the release arc now has
an executable runbook and a refined five-slice release sequence. CDC found no
new blocker and no need to insert a slice before slice02. The two command
surface hazards are already routed:

- `make publish-dry-run` must be repaired or avoided before dry-run evidence is
  accepted.
- `make push` must not be treated as the release-branch push recipe unless it is
  intentionally changed.

Durable slice artifacts are correctly under
`slice01-release-readiness-runbook/artifacts/`.

## Final State

- slice01 is closed/CDC-verified.
- arc09 remains open with `slice02-version-bump-release-notes-ci-chore` active.
- Real publication, release tags, branch pushes, and the book tag remain
  operator-owned future gates.
