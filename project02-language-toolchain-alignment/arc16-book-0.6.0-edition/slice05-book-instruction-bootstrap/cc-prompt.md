# CC Prompt - arc16 slice05: book instruction bootstrap

You are CC in the implementation seat. CDC has opened arc16 slice05 to
reconcile the book and writers-guide instruction surfaces now that the accepted
0.6.0 implementation runway through slice04 is closed.

## Branches and Repos

Lang planning work lives in:

```text
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x
```

Branch:

```text
release/0.6.x
```

Book content/instructions live in:

```text
/Users/oubiwann/lab/cnbb/lykn
```

Writers-guide instructions live in:

```text
/Users/oubiwann/lab/cnbb/lykn-writers-guide
```

Do not create a planning tree in either sibling repo. The arc16 plan and close
artifacts remain in the lang repo. If you edit sibling repos, keep commits
scoped per repo and record exact commit SHAs in the lang close report.

## Required Reading

Read before editing:

1. `AGENTS.md` in the lang release worktree.
2. `assets/ai/SKILL.md`.
3. `docs/guides/00-lykn-surface-forms.md`.
4. `docs/guides/01-core-idioms.md`.
5. `docs/guides/02-api-design.md`.
6. `docs/guides/10-project-structure.md`.
7. `docs/guides/15-lykn-cli.md`.
8. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/arc-plan.md`.
9. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/design/book-drift-inventory-0.6.0.md`.
10. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/design/fence-wiring-spec.md`.
11. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/design/dogfooding-friction-log.md`.
12. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice01-pre-book-decision-gate/closing-report.md`.
13. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice01-pre-book-decision-gate/cdc-verification.md`.
14. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice02-dogfood-implementation-runway/cdc-verification.md`.
15. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice03-cli-scaffold-package-runway/cdc-verification.md`.
16. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice04-language-surface-runway/cdc-verification.md`.
17. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice05-book-instruction-bootstrap/slice-plan.md`.
18. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice05-book-instruction-bootstrap/ledger.md`.
19. `/Users/oubiwann/lab/cnbb/lykn/AGENTS.md`.
20. `/Users/oubiwann/lab/cnbb/lykn/book.toml`.
21. `/Users/oubiwann/lab/cnbb/lykn/src/SUMMARY.md`.
22. `/Users/oubiwann/lab/cnbb/lykn-writers-guide/AGENTS.md`.
23. `/Users/oubiwann/lab/cnbb/lykn-writers-guide/authoring-guide.md`.
24. `/Users/oubiwann/lab/cnbb/lykn-writers-guide/new-ch-prompt.md`.
25. `/Users/oubiwann/lab/cnbb/lykn-writers-guide/planned-toc.md`.

If you touch JavaScript examples or Deno commands, read the project Deno/JS
guidance first. If you touch Rust examples or Rust-facing claims, read the Rust
guidance first. Most of this slice should be documentation and instruction
work, not language implementation.

## Assignment

Update the standing book/writers-guide instruction surface so future chapter
work starts from current 0.6.0 truth.

Must cover:

- Planning split: lang arc16 owns planning, close artifacts, discoveries, and
  slice routing; book and writers-guide own content/instructions only.
- `AGENTS.md` standard: preserve `AGENTS.md` as canonical and `CLAUDE.md` as
  symlink compatibility in both sibling repos.
- Scratch rule: `workbench/` is not a durable or cited artifact home.
- Paths: replace stale `~/lab/oxur/lykn/` and stale subpaths with current
  lang repo/worktree paths or remove them if they are no longer valid.
- Testing: stop presenting raw `deno test test/book/` as the universal
  verification gate. If the real book fence gate is still pending, say so
  plainly and route to slice06 / `D-2607-R4NW`.
- Fences: preserve ` ```lisp ` as the 0.6.0 book fence tag; do not migrate the
  book to ` ```lykn ` in this slice.
- Toolchain: align normal Lykn workflows with `lykn` wrapper commands where
  Lykn owns the workflow; preserve direct Deno examples only where they teach
  Deno itself.
- Compiler architecture: describe the current Rust CLI plus JS/Deno compiler
  relationship without saying the JS compiler is browser-only.
- Source ownership: reflect slice03's 0.6.0 floor without banning user-owned
  non-Lykn files from source trees.
- Language surface: teach slice04's accepted surface: module-level
  `(exports ...)`, grouped sequential `bind`, and `cond`.
- Planned ToC: choose the smallest honest update. Prefer preserving current
  `planned-toc.md` as a historical v2 input and creating/updating a current
  0.6.0 planning artifact if needed; if you defer that, name the re-entry
  condition.
- Flexibility rule: explicitly state that book review is expected to surface
  more defects. Route new language/tooling/DevX defects to the lang Discovery
  Register and open new slices or explicit deferrals before prose normalizes
  them.

## Important Process Note

Do not treat arc16 slice04 as "the language is now perfect." It means only that
the accepted pre-book implementation findings from the first dogfood passes are
closed. As Duncan reviews the book, more unwanted behavior may surface. That is
expected and healthy. Preserve the freedom for arc16 to grow many additional
slices.

## Suggested Current-State Sweeps

Run targeted searches before and after edits, adjusting paths as needed:

```sh
rg -n 'oxur/lykn|conversation-bootstrap-v6|docs/design/06-final|docs/dev/research' \
  /Users/oubiwann/lab/cnbb/lykn-writers-guide

rg -n 'deno test test/book|All code examples must have corresponding tests|test/book' \
  /Users/oubiwann/lab/cnbb/lykn-writers-guide

rg -n 'src/index.js|browser bundle only|browser-only|packages/lang|jsr:@lykn/lang' \
  /Users/oubiwann/lab/cnbb/lykn-writers-guide

rg -n 'export \\(func|export \\(bind|\\(exports|grouped bind|\\(cond|nested \\?' \
  /Users/oubiwann/lab/cnbb/lykn-writers-guide \
  /Users/oubiwann/lab/cnbb/lykn/AGENTS.md
```

Also verify sibling instruction file state:

```sh
git status --short --branch
git ls-files -s AGENTS.md CLAUDE.md
readlink CLAUDE.md
```

Run those in both sibling repos.

## Required Checks

In the lang release worktree, after planning/close artifact edits:

```sh
git diff --check
make test-docs
make check-cited-paths
```

For sibling repos, run any configured checks that exist and are appropriate for
instruction-only edits. At minimum, record:

```sh
git status --short --branch
git diff --check
```

If a sibling repo has no configured docs/build check, say that plainly.

Because `make check-cited-paths` resolves against `HEAD`, run it again after
the lang close commit if your new lang docs cite newly created lang files.

## Required Close

When done, write the standard slice close report in this slice directory. It
must include:

1. Source material read, with one-line roles.
2. Before/after repo status for lang, book, and writers-guide.
3. Implementation summary by repo and file.
4. Current disposition of Bucket 0 rows touched by this slice.
5. Planned-ToC decision/disposition.
6. Defect-routing/flexibility rule added for future book review.
7. Verification transcript, including sibling repo sweeps and lang gates.
8. Row-by-row ledger walk for F-1 through F-15.
9. Bubble-up to arc16:
   - whether slice06 `book-fence-reachability` remains next;
   - whether any new implementation slice was discovered;
   - whether book-facing chapter work remains blocked.

Commit scoped changes with the shared trailers:

```text
Co-authored-by: Codex <noreply@openai.com>
Co-authored-by: Billo AI <ai-engineering@billo.systems>
```
