# CDC verification - `02-artifact-homes`

**Verified:** 2026-08-08. **Branch:** `release/0.6.x`. **Verdict:** closed.

## Verdict

`02-artifact-homes` is now structurally closed. The cited-path gate reproduces
cleanly after `03-citation-repoint`: `make check` is green, the gate is wired
into `common-checks`, and the frozen census has shrunk from 631 to 601 accepted
historical pairs.

The two rows returned by the first CDC pass are also remediated:

- L-5: all three repos have tracked `AGENTS.md`; the book and writers-guide
  repos keep `CLAUDE.md` as a symlink to `AGENTS.md`.
- L-6: the book audit tool is tracked in the book repo.

The sibling guidance files also carry the new assistant-authored commit trailer
convention.

## Row walk

| Row | CDC verdict | Evidence |
|---|---|---|
| L-1 | reproduced | `git ls-files docs/backlog/discoveries.md`; register has the relocation note naming the five prior citations. |
| L-2 | reproduced | `docs/backlog/README.md` exists and carries the routing rule: a row is not routed until the destination file exists in git and contains it. |
| L-3 | reproduced | `git ls-files docs/backlog/owed-0.7.x-rows.md`. |
| L-4 | reproduced | `git ls-files` shows the arc16 design materials tracked under `docs/design-v0.6.0/arc16-book-0.6.0-edition/design/`. |
| L-5 | reproduced | Lang `AGENTS.md` is tracked; book commit `91fee17` and writers-guide commit `a042e18` add tracked `AGENTS.md`, make `CLAUDE.md` symlink to it, point back to the lang planning home, state the `workbench/` scratch and cited-path rules, and include the required commit trailers. |
| L-6 | reproduced | Book commit `91fee17` tracks the fence-audit tool; the sibling-repo `git ls-files -s ...` check below reports `AGENTS.md`, symlink-mode `CLAUDE.md`, and the fence tool. |
| L-7 | reproduced | `make check-cited-paths` passes at HEAD; `deno test --config project.json -A test/integration/cited-paths.test.js` reports 22 passed / 0 failed; full `make check` passed with escalation for normal home-directory access. |
| L-8a | reproduced | The census file is present with the `D-2607-D3NL` header and exact-pair format. Current accepted-pair count is 601 after `03-citation-repoint`. |
| L-8b | reconciled | Operator disposition is recorded in `D-2607-D3NL`; `03-citation-repoint` applied the later split by repointing migrated paths and leaving only historical accepted pairs. |
| L-9 | reproduced with update | Project/docs bubble-up exists; this verification adds the final result: P-21 is done, and the next release sequence starts at arc15 slice04. |

## Commands

```text
make check-cited-paths
=> passed (568 documents on release/0.6.x; 601 historical citations accepted)

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
?? _to_delete/

git ls-files -s AGENTS.md CLAUDE.md tools/book-audit/fences.lykn
100644 6a2599665c9a5bbf8be3c1f3e325f58e429a0fe8 0 AGENTS.md
120000 47dc3e3d863cfb5727b87d785d09abf9743c0a72 0 CLAUDE.md
100644 879d961d8c1bf9cbacf58a3dad3874a4844e2670 0 tools/book-audit/fences.lykn

git log -1 --format=full
commit 91fee170bfc4050526f7a40753c1aa742e5f1df9
Co-authored-by: Codex <noreply@openai.com>
Co-authored-by: Billo AI <ai-engineering@billo.systems>

# writers-guide repo
git status --short
# no output

git ls-files -s AGENTS.md CLAUDE.md
100644 e68ad15fedb7afb03f23eaa28cc7330b2013773b 0 AGENTS.md
120000 47dc3e3d863cfb5727b87d785d09abf9743c0a72 0 CLAUDE.md

git log -1 --format=full
commit a042e18695d84655b0ca6f683c7e43a23447b87a
Co-authored-by: Codex <noreply@openai.com>
Co-authored-by: Billo AI <ai-engineering@billo.systems>
```

`_to_delete/` remains untracked in the book repo and was deliberately left out
of scope.

## Remediation Applied

1. Standardized on `AGENTS.md` in the book and writers-guide repos.
2. Kept `CLAUDE.md` as a compatibility symlink to `AGENTS.md`.
3. Added the new assistant-authored commit trailers to both sibling guidance
   files and used them in both remediation commits.
4. Tracked the book audit tool at its existing book-repo home.

## Bubble-up Check

`03-citation-repoint` made the gate useful-green and shrank the census. This
remediation then closed the remaining durable-home gap in the sibling book
repositories. P-21 is done; the next release work is arc15 slice04 + arc15
close, then arc07 + arc16, then arc09.
