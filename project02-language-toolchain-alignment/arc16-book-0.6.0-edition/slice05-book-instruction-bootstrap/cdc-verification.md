# arc16 slice05 - CDC Verification

Verified by CDC on 2026-08-20.

## Verdict

slice05 is **CDC-verified closed**.

CC's close report matches the committed lang, book, and writers-guide state.
All 15 ledger rows have reproducible evidence. No remediation slice is required
from this verification pass.

## Commits Verified

| Repo | Commit | Subject |
|------|--------|---------|
| lang | `371a7d646ba1761f7026e676a74918f149234025` | `docs: close arc16 book instruction bootstrap` |
| book | `4a82c62d97c15f3201e66d642c7270545bb1f45f` | `docs: update book agent guidance for 0.6.0` |
| writers-guide | `491df62edb763a29981092be082ff7a6fcaace09` | `docs: refresh 0.6.0 writer bootstrap` |

## Checks Reproduced

Lang repo:

- `git status --short --branch` -> `## release/0.6.x`
- `git diff --check` -> pass
- `make check-cited-paths` -> pass, 623 documents on `release/0.6.x`, 601
  historical citations accepted
- `make test-docs` -> pass, 482 passed, 0 failed

Book repo:

- `git status --short --branch` -> `## main`; `?? _to_delete/`
- `git log -1 --format='%H%n%s%n%b'` -> commit
  `4a82c62d97c15f3201e66d642c7270545bb1f45f` with required co-author trailers
- `git show --stat --oneline --decorate --no-renames HEAD` -> only `AGENTS.md`
  changed
- `git ls-files -s AGENTS.md CLAUDE.md` -> `AGENTS.md` mode `100644`,
  `CLAUDE.md` mode `120000`
- `readlink CLAUDE.md` -> `AGENTS.md`
- `git diff --check` -> pass

Writers-guide repo:

- `git status --short --branch` -> `## main`
- `git log -1 --format='%H%n%s%n%b'` -> commit
  `491df62edb763a29981092be082ff7a6fcaace09` with required co-author trailers
- `git show --stat --oneline --decorate --no-renames HEAD` -> `AGENTS.md`,
  `authoring-guide.md`, `new-ch-prompt.md`, and `planned-toc.md` changed
- `git ls-files -s AGENTS.md CLAUDE.md` -> `AGENTS.md` mode `100644`,
  `CLAUDE.md` mode `120000`
- `readlink CLAUDE.md` -> `AGENTS.md`
- `git diff --check` -> pass

Targeted content sweeps:

- book `rg 'oxur/lykn|conversation-bootstrap-v6|docs/design/06-final|docs/dev/research|src/index\.js|deno test test/book' AGENTS.md`
  returned only the negative guardrail that `deno test test/book/` is not a
  current universal book gate.
- writers-guide sweep over `AGENTS.md`, `authoring-guide.md`,
  `new-ch-prompt.md`, and `planned-toc.md` returned only negative guardrails
  for `deno test test/book/`; no active stale old-lang path, obsolete
  `src/index.js` import, or old research path remained.
- positive sweeps confirmed current instruction text for the lang arc16 planning
  home, `workbench/` as scratch, `lisp` fences, `D-2607-R4NW`, Discovery
  Register routing, top-level `(exports ...)`, grouped sequential `bind`,
  `cond`, source ownership, and user-owned non-Lykn files.

## Ledger Verification

| Row | CDC disposition |
|-----|-----------------|
| F-1 | Reproduced. The close report lists the required source set and additional applicable guidance. |
| F-2 | Reproduced. Before/after repo statuses are recorded; book `_to_delete/` remains explicitly unrelated. |
| F-3 | Reproduced. Both sibling repos track `CLAUDE.md` as a symlink to `AGENTS.md`. |
| F-4 | Reproduced. Sibling instructions point planning/discovery work to the lang arc16 home and keep durable artifacts out of `workbench/`. |
| F-5 | Reproduced. Stale old-lang path sweep has no active-use hits. |
| F-6 | Reproduced. `deno test test/book/` appears only as a negative current-gate warning. |
| F-7 | Reproduced. `lisp` fence guidance is preserved and the automated gate is named as pending slice06 / `D-2607-R4NW` work. |
| F-8 | Reproduced. Instructions distinguish the Rust CLI path from the maintained JS/Deno compiler path without obsolete `src/index.js` guidance. |
| F-9 | Reproduced. Source ownership guidance states the Lykn toolchain floor without banning user-owned non-Lykn files. |
| F-10 | Reproduced. Instructions teach top-level `(exports ...)`, grouped sequential `bind`, and `cond` as the preferred 0.6.0 surface. |
| F-11 | Reproduced. `planned-toc.md` is preserved as historical v2 input with current ToC reconciliation routed later. |
| F-12 | Reproduced. Sibling instructions and arc16 plan record that book-discovered defects become Discovery Register rows plus new slices or explicit deferrals. |
| F-13 | Reproduced. Sibling statuses, symlink checks, stale-guidance sweeps, and `git diff --check` were rerun by CDC. |
| F-14 | Reproduced. Arc/project/status surfaces bubble slice05 up and keep slice06 next. |
| F-15 | Reproduced. Lang `git diff --check`, `make check-cited-paths`, and `make test-docs` pass. |

## Bubble-Up Check

slice06 `book-fence-reachability` remains the next arc16 gate. The instruction
layer is now ready for that work: later book/chapter slices have current
standing guidance, an explicit route for newly discovered defects, and no
current instruction surface that normalizes around stale test or path claims.

The only sibling repo dirt observed by CDC is the pre-existing untracked
`_to_delete/` directory in the book repo.
