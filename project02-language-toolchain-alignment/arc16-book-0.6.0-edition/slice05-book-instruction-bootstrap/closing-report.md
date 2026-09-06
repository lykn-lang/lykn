# arc16 slice05 - Book Instruction Bootstrap Closing Report

Closed by CC on 2026-08-20. CDC verification recorded in
[`cdc-verification.md`](cdc-verification.md).

## 1. Source Material Read

- `AGENTS.md` - lang release-worktree workflow, commit trailers, and gate
  expectations.
- `assets/ai/SKILL.md` - current agent-facing Lykn authoring guidance,
  including wrapper commands, exports, grouped `bind`, and package layout.
- `docs/guides/00-lykn-surface-forms.md` - current surface syntax reference,
  including `(exports ...)`, grouped `bind`, and `cond`.
- `docs/guides/01-core-idioms.md` - idiomatic 0.6.0 examples and teaching
  surface.
- `docs/guides/02-api-design.md` - public API guidance for examples that teach
  module/export style.
- `docs/guides/10-project-structure.md` - package layout and source ownership
  baseline.
- `docs/guides/15-lykn-cli.md` - wrapper-command guidance for Lykn-owned
  workflows.
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/arc-plan.md` - arc16
  plan-of-record and slice sequence.
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/design/book-drift-inventory-0.6.0.md`
  - historical Bucket 0 drift inventory.
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/design/fence-wiring-spec.md` -
  source for the pending lisp-fence gate.
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/design/dogfooding-friction-log.md`
  - dogfood findings behind the implementation-first runway.
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice01-pre-book-decision-gate/closing-report.md`
  - D-1 through D-5 and pre-book routing decisions.
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice01-pre-book-decision-gate/cdc-verification.md`
  - independent confirmation of slice01 disposition.
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice02-dogfood-implementation-runway/cdc-verification.md`
  - dogfood verification and implementation-routing context.
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice03-cli-scaffold-package-runway/cdc-verification.md`
  - closed CLI/scaffold/package runway and source-ownership floor.
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice04-language-surface-runway/cdc-verification.md`
  - closed `(exports ...)`, grouped `bind`, and `cond` implementation surface.
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice05-book-instruction-bootstrap/slice-plan.md`
  - scope and exit criteria for this slice.
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice05-book-instruction-bootstrap/ledger.md`
  - F-1 through F-15 acceptance rows.
- `/Users/oubiwann/lab/cnbb/lykn/AGENTS.md` - book repo standing instructions.
- `/Users/oubiwann/lab/cnbb/lykn/book.toml` - book repo mdBook configuration
  and configured output context.
- `/Users/oubiwann/lab/cnbb/lykn/src/SUMMARY.md` - live book table of contents.
- `/Users/oubiwann/lab/cnbb/lykn-writers-guide/AGENTS.md` - writers-guide repo
  standing instructions.
- `/Users/oubiwann/lab/cnbb/lykn-writers-guide/authoring-guide.md` - standing
  chapter-authoring and code-verification rules.
- `/Users/oubiwann/lab/cnbb/lykn-writers-guide/new-ch-prompt.md` -
  chapter-bootstrap prompt.
- `/Users/oubiwann/lab/cnbb/lykn-writers-guide/planned-toc.md` - historical v2
  planned ToC input.
- `/Users/oubiwann/.agents/skills/collaboration-framework/SKILL.md` and
  its project-management and ledger-discipline references - slice closure and
  ledger discipline.
- `/Users/oubiwann/.agents/skills/javascript-deno-guidelines/SKILL.md` -
  Deno/JS guidance because this slice updated Deno command guidance.
- `/Users/oubiwann/.agents/skills/rust-guidelines/SKILL.md` - Rust guidance
  because this slice updated Rust CLI/compiler wording.

## 2. Repo Status

Before edits:

| Repo | Command | Result |
|------|---------|--------|
| lang | `git status --short --branch` | `## release/0.6.x` |
| book | `git status --short --branch` | `## main`; `?? _to_delete/` |
| writers-guide | `git status --short --branch` | `## main` |

After sibling commits:

| Repo | Command | Result |
|------|---------|--------|
| book | `git status --short --branch` | `## main`; `?? _to_delete/` remains unrelated and untouched |
| writers-guide | `git status --short --branch` | `## main` |

Lang after this report is a scoped planning/docs diff in the arc16 slice05
close artifacts and project/status surfaces.

## 3. Implementation Summary

Lang repo:

- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/arc-plan.md` - marks slice05
  closed/CDC-verified, records sibling commits, keeps slice06 next, and updates
  arc ledger A-3/A-9.
- `project02-language-toolchain-alignment/README.md` - updates the arc16 row.
- `project02-language-toolchain-alignment/project-plan.md` - updates the arc16 roadmap row, current
  status, P-20 evidence, and version history.
- `project02-language-toolchain-alignment/status.html` - updates the dashboard DATA object for
  slice05 closure and slice06 next.
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice05-book-instruction-bootstrap/ledger.md`
  - closes F-1 through F-15 with evidence.
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice05-book-instruction-bootstrap/closing-report.md`
  - this report.

Book repo, commit `4a82c62d97c15f3201e66d642c7270545bb1f45f`:

- `AGENTS.md` - points planning/discoveries at the active 0.6.x lang worktree,
  preserves `AGENTS.md` canonical / `CLAUDE.md` symlink compatibility, names
  the pending lisp-fence gate, removes the raw Deno book-test gate as current
  guidance, teaches current 0.6.0 surface forms, and adds defect routing.

Writers-guide repo, commit `491df62edb763a29981092be082ff7a6fcaace09`:

- `AGENTS.md` - mirrors the current planning split, symlink convention, current
  0.6.0 surface guidance, pending fence gate, and defect routing.
- `authoring-guide.md` - replaces stale old-lang source paths, removes the
  absent book-test tree recipe as current truth, teaches wrapper-command example
  verification, reflects Rust CLI plus JS/Deno compiler paths, and adds current
  surface/source-ownership guidance.
- `new-ch-prompt.md` - points chapter sessions at the current lang worktree,
  live book ToC, current compiler relationship, and pending fence gate.
- `planned-toc.md` - preserves the file as historical v2 planning input and
  names the re-entry condition for a current 0.6.0 ToC artifact.

## 4. Bucket 0 Disposition

This slice touched the Bucket 0 rows represented by stale instruction surfaces,
not a full chapter drift refresh.

| Bucket 0 area | Disposition |
|---------------|-------------|
| Stale old lang path rows (`~/lab/oxur/lykn/` and old subpaths) | Closed in active writers-guide instructions; current paths point to `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/`. |
| Durable planning/close artifact home | Closed for instruction surfaces; lang arc16 remains the planning/close/discovery/routing home, sibling repos remain content/instruction homes. |
| `workbench/` as durable source | Closed for active instructions; `workbench/` is scratch, not cited/durable. |
| Raw `deno test test/book/` universal gate | Removed as current guidance and replaced with explicit pending slice06 / `D-2607-R4NW` routing. |
| Book fence tag | Preserved as `lisp` through 0.6.0; no migration to `lykn`. |
| Compiler architecture wording | Closed for active instructions; Rust CLI is primary authoring/check path and JS/Deno compiler is maintained, not limited to browser use. |
| Source ownership | Closed for active instructions; slice03's 0.6.0 floor is stated without banning user-owned non-Lykn source files. |
| Language surface | Closed for active instructions; `(exports ...)`, grouped sequential `bind`, and `cond` are taught as current 0.6.0 surface. |
| Planned ToC | Preserved as historical v2 input; current ToC reconciliation deferred with named re-entry. |

## 5. Planned-ToC Decision

Smallest honest update selected: preserve
`/Users/oubiwann/lab/cnbb/lykn-writers-guide/planned-toc.md` as historical v2
planning input. The live ToC is
`/Users/oubiwann/lab/cnbb/lykn/src/SUMMARY.md`.

No current 0.6.0 ToC artifact was created in this slice. Re-entry condition:
open the current ToC reconciliation from arc16 slice07
`current-book-drift-refresh`, or a dedicated ToC/drift slice, after slice06
`book-fence-reachability` establishes the code-fence gate.

## 6. Defect Routing Rule

Both sibling instruction surfaces now state that book review is expected to
surface more language, tooling, documentation, and DevX defects. Those defects
must be routed to the lang Discovery Register and a new implementation slice or
explicit deferral before book prose normalizes around the defect.

## 7. Verification Transcript

Initial command issue:

- `rg` sweep with a double-quoted pattern containing backticks failed because
  the shell treated backticks as command substitution. Re-run used single
  quotes.

Sibling before-state:

- lang `git status --short --branch` -> `## release/0.6.x`.
- book `git status --short --branch` -> `## main`; `?? _to_delete/`.
- writers-guide `git status --short --branch` -> `## main`.
- book `git ls-files -s AGENTS.md CLAUDE.md && readlink CLAUDE.md` -> tracked
  `AGENTS.md` mode `100644`, tracked `CLAUDE.md` mode `120000`, readlink
  `AGENTS.md`.
- writers-guide `git ls-files -s AGENTS.md CLAUDE.md && readlink CLAUDE.md` ->
  tracked `AGENTS.md` mode `100644`, tracked `CLAUDE.md` mode `120000`,
  readlink `AGENTS.md`.

Sibling sweeps and checks:

- Targeted stale-path/compiler/test sweep after edits returned only explicit
  negative guardrails for `deno test test/book/`; no `oxur/lykn`,
  `conversation-bootstrap-v6`, `src/index.js`, or browser-limited compiler claim
  remains in active instruction use.
- book `git diff --check` -> pass.
- writers-guide `git diff --check` -> pass.
- book symlink check after edits -> tracked `AGENTS.md` mode `100644`, tracked
  `CLAUDE.md` mode `120000`, `readlink CLAUDE.md` -> `AGENTS.md`.
- writers-guide symlink check after edits -> tracked `AGENTS.md` mode `100644`,
  tracked `CLAUDE.md` mode `120000`, `readlink CLAUDE.md` -> `AGENTS.md`.
- book repo commit -> `4a82c62d97c15f3201e66d642c7270545bb1f45f`.
- writers-guide repo commit -> `491df62edb763a29981092be082ff7a6fcaace09`.
- book after commit status -> `## main`; `?? _to_delete/` remains unrelated.
- writers-guide after commit status -> `## main`.

Configured sibling checks:

- book has mdBook configuration, but no chapter/source files changed in the
  book repo; `git diff --check` plus symlink/status checks were the appropriate
  instruction-only checks for the `AGENTS.md` change.
- writers-guide has no configured build/test command discovered for these
  markdown instruction files; `git diff --check` plus stale-guidance sweeps and
  symlink/status checks were the applicable checks.

Lang gates:

- `git diff --check` -> pass.
- `make test-docs` -> pass.
- Pre-commit `make check-cited-paths` -> expected failure: 16 citations to the
  new `slice05-book-instruction-bootstrap/closing-report.md` could not resolve
  because the cited-path gate checks `HEAD` and the file was not committed yet.
- First post-commit `make check-cited-paths` -> failed on two prose tokens that
  looked like repo paths inside this report: one collaboration-framework
  reference and one absent book-test-tree reference. Both were rewritten as
  non-path prose and the lang commit was amended.
- `make check-cited-paths` -> pass after the lang close commit, because that
  gate resolves cited files at `HEAD`.

## 8. Ledger Walk

| Row | Status | Evidence |
|-----|--------|----------|
| F-1 | done | Source list above covers all 25 required prompt files plus applicable JS/Deno, Rust, and collaboration guidance. |
| F-2 | done | Before statuses recorded above; book `_to_delete/` caveat preserved. |
| F-3 | done | Both sibling repos still track `CLAUDE.md` as mode `120000` symlink to `AGENTS.md`. |
| F-4 | done | Book and writers-guide instructions point planning/discoveries to lang arc16 and keep `workbench/` scratch-only. |
| F-5 | done | Stale old path sweep has no active-use hits after edits. |
| F-6 | done | Raw `deno test test/book/` appears only as an explicit "do not use as current universal gate" warning routed to slice06 / `D-2607-R4NW`. |
| F-7 | done | Instructions preserve `lisp` fences and name the pending `lykn test --docs --fence lisp` route without claiming it has landed. |
| F-8 | done | Active instructions distinguish Rust CLI and maintained JS/Deno compiler path; obsolete `src/index.js` imports are removed. |
| F-9 | done | Source ownership text reflects slice03's floor and explicitly permits user-owned non-Lykn files. |
| F-10 | done | Book/writers-guide instructions teach `(exports ...)`, grouped sequential `bind`, and `cond`. |
| F-11 | done | `planned-toc.md` is preserved as historical v2 input; current ToC artifact deferred to slice07/dedicated ToC slice after slice06. |
| F-12 | done | Defect-routing/flexibility rule added in both sibling repos and bubbled up in arc16. |
| F-13 | done | Sibling statuses, sweeps, `git diff --check`, symlink checks, and commits recorded above. |
| F-14 | done | Arc plan, project README, project plan, status dashboard, ledger, and this close report updated; slice06 remains next. |
| F-15 | done | Lang `git diff --check`, `make test-docs`, and post-commit `make check-cited-paths` pass. |

## 9. Bubble-Up To arc16

- slice06 `book-fence-reachability` remains next.
- No new implementation slice was discovered by this instruction-only
  reconciliation.
- Book-facing chapter work remains blocked until slice06 establishes the
  lisp-fence reachability gate. The current ToC/drift refresh remains later
  work, currently named as slice07 or a dedicated ToC/drift slice if the
  operator chooses to split it.
