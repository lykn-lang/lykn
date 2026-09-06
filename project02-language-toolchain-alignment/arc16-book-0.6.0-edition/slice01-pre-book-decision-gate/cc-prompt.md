# CC Prompt — arc16 slice01: pre-book decision gate

You are CC, working in the Lykn language repo:

`/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`

Branch: `release/0.6.x`.

CDC has opened arc16 for the Lykn Book 0.6.0 edition. This first slice is a
recon/decision-gate slice, not an implementation slice. Your job is to produce
the evidence packet Duncan and CDC need before book prose or language-surface
changes begin.

## Required Reading

Read these first, in this order:

1. `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/AGENTS.md`
2. `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/docs/design-v0.6.0/arc16-book-0.6.0-edition/arc-plan.md`
3. `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/docs/design-v0.6.0/arc16-book-0.6.0-edition/slice01-pre-book-decision-gate/slice-doc.md`
4. `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/docs/design-v0.6.0/arc16-book-0.6.0-edition/slice01-pre-book-decision-gate/ledger.md`
5. `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/docs/design-v0.6.0/arc16-book-0.6.0-edition/design/kickoff-thread-book-0.6.0-update.md`
6. `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/docs/design-v0.6.0/arc16-book-0.6.0-edition/design/book-drift-inventory-0.6.0.md`
7. `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/docs/design-v0.6.0/arc16-book-0.6.0-edition/design/fence-wiring-spec.md`
8. `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/docs/design-v0.6.0/arc16-book-0.6.0-edition/design/dogfooding-friction-log.md`
9. `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/docs/backlog/discoveries.md`

Then inspect, read-only unless explicitly told otherwise:

10. `/Users/oubiwann/lab/cnbb/lykn/AGENTS.md`
11. `/Users/oubiwann/lab/cnbb/lykn/book.toml`
12. `/Users/oubiwann/lab/cnbb/lykn/src/SUMMARY.md`
13. `/Users/oubiwann/lab/cnbb/lykn-writers-guide/AGENTS.md`
14. `/Users/oubiwann/lab/cnbb/lykn-writers-guide/authoring-guide.md`
15. `/Users/oubiwann/lab/cnbb/lykn-writers-guide/new-ch-prompt.md`
16. `/Users/oubiwann/lab/cnbb/lykn-writers-guide/planned-toc.md`

## Scope

In:

- Verify current lang/book/writers-guide facts from the filesystem and git.
- Reconcile the May inventory's D-1...D-5 decisions against current state.
- Reconcile `D-2607-R4NW` and B0-G into a current book-example verification
  strategy.
- Produce options packets for:
  - `D-2608-XPRT` export ownership;
  - `D-2608-LBND` grouped local bindings;
  - `D-2608-COND` flatter validation branching;
  - `D-2608-SOWN` source ownership / generated manifest placement.
- Update `ledger.md` with evidence for every row.
- Write `closing-report.md` with a row-by-row ledger walk and a "Bubble-up to
  the arc" section.

Out:

- No compiler, CLI, scaffold, book prose, writer-guide, or book repo edits.
- No syntax decision by CC fiat. Make recommendations; Duncan decides.
- No `cdc-verification.md`; CDC writes that after independent review.

## Required Closing Report Shape

Create:

the canonical `closing-report.md` close-set file in this slice directory

It MUST contain:

1. Source material read, with the role of each source.
2. Current-state evidence:
   - lang branch/status;
   - book repo `AGENTS.md`/`CLAUDE.md`;
   - writers-guide `AGENTS.md`/`CLAUDE.md`;
   - whether `/Users/oubiwann/lab/cnbb/lykn/test/book/` exists;
   - book `book.toml` and `src/SUMMARY.md` presence;
   - any relevant current git status caveats.
3. Decision packet table:
   - one row for D-1, D-2, D-3, D-4, D-5;
   - one row for `D-2607-R4NW`;
   - one row each for `D-2608-XPRT`, `D-2608-LBND`, `D-2608-COND`,
     `D-2608-SOWN`.
4. For each decision row:
   - current evidence;
   - options;
   - CDC/CC recommendation;
   - whether Duncan input is required;
   - implementation/book impact;
   - proposed routing home.
5. Row-by-row ledger walk for F-1...F-10.
6. Bubble-up to the arc:
   - whether slice01 delivered its assigned piece;
   - what arc-plan changes are required before slice02 opens;
   - next recommended slice and any blocking implementation work.

## Verification

Run from `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`:

```sh
git diff --check
make check-cited-paths
make test-docs
```

Also record the read-only sibling repo probes you used, but do not edit those
repos in this slice.

## Commit

Commit the lang-repo docs changes only. Use both trailers:

```text
Co-authored-by: Codex <noreply@openai.com>
Co-authored-by: Billo AI <ai-engineering@billo.systems>
```
