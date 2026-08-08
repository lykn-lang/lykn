# CDC verification - `02-artifact-homes`

**Verified:** 2026-08-08. **Branch:** `release/0.6.x`. **Verdict:** returned
for remediation; not closed.

## Verdict

`02-artifact-homes` delivered the cited-path gate, and that mechanism now
reproduces cleanly after `03-citation-repoint`: `make check` is green, the
gate is wired into `common-checks`, and the frozen census has shrunk from 631
to 601 accepted historical pairs.

The slice still cannot close, because two durable-home rows fail current CDC
verification:

- L-5: the sibling-repo guidance files are not tracked as the ledger states.
- L-6: the book audit tool exists on disk, but is not tracked in the book repo.

Those are not cosmetic failures. They are the same structural class this slice
exists to prevent: useful artifacts present locally but not protected by git.

## Row walk

| Row | CDC verdict | Evidence |
|---|---|---|
| L-1 | reproduced | `git ls-files docs/backlog/discoveries.md`; register has the relocation note naming the five prior citations. |
| L-2 | reproduced | `docs/backlog/README.md` exists and carries the routing rule: a row is not routed until the destination file exists in git and contains it. |
| L-3 | reproduced | `git ls-files docs/backlog/owed-0.7.x-rows.md`. |
| L-4 | reproduced | `git ls-files` shows the arc16 design materials tracked under `docs/design-v0.6.0/arc16-book-0.6.0-edition/design/`. |
| L-5 | failed | The lang repo has tracked `AGENTS.md`, but the book and writers-guide repos have untracked `CLAUDE.md` files and no tracked `AGENTS.md` files. This does not satisfy "AGENTS.md in all three repos". |
| L-6 | failed | The book repo contains the fence-audit tool on disk, but `git status --short` reports it under untracked `tools/`, and `git ls-files` returns no tracked entry for it. |
| L-7 | reproduced | `make check-cited-paths` passes at HEAD; `deno test --config project.json -A test/integration/cited-paths.test.js` reports 22 passed / 0 failed; full `make check` passed with escalation for normal home-directory access. |
| L-8a | reproduced | The census file is present with the `D-2607-D3NL` header and exact-pair format. Current accepted-pair count is 601 after `03-citation-repoint`. |
| L-8b | reconciled | Operator disposition is recorded in `D-2607-D3NL`; `03-citation-repoint` applied the later split by repointing migrated paths and leaving only historical accepted pairs. |
| L-9 | reproduced with update | Project/docs bubble-up exists; this verification adds the missing current result: P-21 remains open on L-5/L-6 remediation, not on the cited-path gate. |

## Commands

```text
make check-cited-paths
=> passed (567 documents on release/0.6.x; 601 historical citations accepted)

deno test --config project.json -A test/integration/cited-paths.test.js
=> 22 passed / 0 failed

make check
=> passed after rerun with normal filesystem access

git status --short
=> clean in the lang 0.6.x worktree
```

The first in-sandbox `make check` run failed at npm dry-run because npm could
not write logs under the user home directory. The escalated rerun passed.

Sibling-repo checks:

```text
# book repo
git status --short
?? CLAUDE.md
?? _to_delete/
?? tools/

git ls-files CLAUDE.md tools/book-audit/fences.lykn
# no output

# writers-guide repo
git status --short
?? CLAUDE.md

git ls-files CLAUDE.md AGENTS.md
# no output
```

## Required remediation

Before `02-artifact-homes` can close:

1. Track the book and writers-guide guidance files under the intended convention
   (`AGENTS.md` as the ledger states, or an explicit ledger amendment to
   `CLAUDE.md` with rationale).
2. Track the book fence-audit tool in the book repo, or move it to a tracked
   home and update the references accordingly.
3. Re-run this CDC verification, including `make check-cited-paths`,
   `deno test --config project.json -A test/integration/cited-paths.test.js`,
   and `make check`.

## Bubble-up Check

`03-citation-repoint` did its job: the cited-path gate is green and the census
is smaller. The remaining P-21 blocker is narrower and sharper than before:
durable artifact homes are not yet structurally protected in the sibling book
repositories. Project status should remain open until L-5 and L-6 reproduce.
