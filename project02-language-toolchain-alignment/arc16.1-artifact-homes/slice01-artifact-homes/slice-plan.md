# Slice `02-artifact-homes` — plan of record

**Scale:** standalone slice (no arc wrapper — `PROJECT-MANAGEMENT.md` Part II
collapse rule). **Opened:** 2026-07-25. **Seat:** CDC plans + does the docs
half; CC lands the `make check` gate. **Gate:** operator.

## Goal

Give every durable artifact a tracked home, and make *"a path cited in a tracked
document resolves in git"* a **checkable claim** enforced by `make check` —
rather than a convention that has already failed silently five times.

## Origin

During arc16 pre-planning, a memory-vs-git reconcile found the **Discovery
Register** (`discoveries.md`, 381 lines, permanent `D-YYMM-XXXX` IDs) sitting in
`workbench/`, which `.gitignore:10` ignores wholesale. It was not misfiled:
**five committed documents already cited `backlog/discoveries.md`** —
`project-plan.md` §7 and §8, and the `01-macro-entry-diagnostics` slice-doc,
closing-report and cdc-verification — and a committed spec cited two of its IDs.
The agreed home was never created, so every reference dangled from birth.

Same shape, other artifacts: arc16's entire 6–8 iteration program and its 40 KB
drift inventory; the dogfooding friction log in the book repo's ignored
`workbench/`; the owed-0.7.x-rows queue.

**Scope correction, disclosed (2026-07-25, from this slice's own verification
pass).** The five-document framing above is *the origin*, not the size. A sweep
of all 507 tracked documents found **106 of them citing 143 distinct
`workbench/…` paths across 353 sites, 57 of which no longer exist on disk**.
Registered as `D-2607-D3NL`; ledger row L-8 was split into a census row (done)
and a disposition row (open, operator decision). This slice still closes on the
*gate*; the historical corpus is dispositioned separately rather than absorbed
here — absorbing it would be the scope creep that turns a closeable slice into
an open-ended cleanup.

**Root cause, named:** `PROJECT-MANAGEMENT.md` Part VIII settles audit reports
at `workbench/<date>-…`, assuming `workbench/` is durable. This repo ignores
`/workbench` entirely. Each half is defensible alone; together they route
durable artifacts into an invisible tree, and the mismatch is invisible
*because each half looks correct on its own*.

## Scope — in

1. Relocate the register + owed-0.7.x rows to `backlog/`; author
   `backlog/README.md` (row format, sections, closing, triage, and the
   **routing rule**).
2. Create arc16's planning home and relocate its material into
   `arc16-book-0.6.0-edition/design/`.
3. `AGENTS.md` in all three repos records the layout and the two rules
   (`workbench/` is scratch; a cited path must resolve in git). The book and
   writers-guide repos had none at all.
4. **The gate:** `make check` fails when a tracked document cites a repo-relative
   path that does not resolve in git.
5. Sweep the existing corpus; fix or disclose every dangling citation found.
6. Record the learnings in `status.html`; bubble up to `project-plan.md`.

## Scope — out (disclosed, not dropped)

- **Writing arc16's `arc-plan.md`.** This slice gives the arc a home; planning
  it is arc16's own act, and *plan late, plan deep* says do it when arc16 is the
  active work. Tracked at P-20.
- **The `->>` / collection-prelude language question** (`D-2607-K9RT`,
  `D-2607-W7KD`). Register rows, `held-for-design`, awaiting the operator's
  language-design conversation. **Not** this slice's business.
- **`workbench/lykn-session-bootstrap.md`** (competes with the tracked
  `BOOTSTRAP.md`) and **`workbench/old/dd-6{2,3}-…DRAFT.md`** (odm's business).
  Flagged for the operator; deliberately untouched.

## Verification approach

Every row is grep- or git-verifiable from a clean checkout. The one row CDC
cannot reproduce is the `make check` gate itself (no cargo/deno in the sandbox)
— that row is **CC-attested** and reconciles on the operator's host, per the
standing evidence-strength discipline.

## Exit criteria

`ledger.md` rows L-1…L-9 all reach a final status; the gate is green on the
operator's host; `project-plan.md` carries the bubble-up (done: v1.42, P-21
closed).
