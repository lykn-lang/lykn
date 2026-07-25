# The Discovery Register — protocol

The register (`discoveries.md`) is the project's **append-only record of things
we found out**: defects, traps, gaps, and systemic findings, each with a
permanent ID. It is the cross-cutting counterpart to the planning tree — a
discovery is recorded here *first*, then routed to wherever the fix belongs.

**Why it lives here and not under `docs/design-vX.Y.Z/`:** rows outlive any one
release. A finding raised during 0.6.0 may route to arc07, to arc16, and to the
0.7.0 backlog simultaneously, and its ID must stay valid after 0.6.0 ships.
Filing it under a versioned design tree would orphan the IDs at the next bump.

**Why it is tracked and not in `workbench/`:** `workbench/` is gitignored
scratch, by design. Anything another document cites by path must be in git.
The register spent its first day untracked while a *committed* spec cited two
of its IDs — see `D-2607-8HTN` and the entry that finding earned in
`status.html`.

---

## The row format

IDs are `D-YYMM-XXXX` — the year and month of first entry, then four characters.
**IDs are permanent.** Never renumber, never delete a row. Dispositioned and
rejected rows stay: *"we looked at this and decided no"* is information the next
person needs.

A row carries, at minimum:

- **What** — the finding, stated so someone who wasn't there can act on it.
- **Where** — `file:line` when it has a location. A finding without a location
  is fine; a finding with a *wrong* location costs more than none.
- **How found** — `dogfooding` · `cdc-review` · `audit` · `probe` · `operator`.
  This field is what makes trending possible: when one activity keeps finding
  the same class, that is a signal about the activity, not just the bug.
- **Guess** — honest severity estimate, in words. Say *guess*, because it is one.
- **Kind** — `systemic` · `trap` · `gap` · `bug` · `polish`.
- **Status** — `open` · `routed` · `held-for-design` · `CLOSED`.

Optional, when they apply: **Parent** / **Symptoms** / **Caused by** (the
finding graph), **Owner**, **Source material**, **Note**.

## Sections

`★ The systemic finding` · `Systemic` · `Held for design` · then per-destination
groupings (`Language & docs`, `Guides (arc07)`, `Book (arc16)`, …) · `Closed` ·
`Trending`. Rows move between sections as their status changes; they never
leave the file.

---

## The routing rule (load-bearing — this is what the register is *for*)

> **A row is not `routed` until the destination file exists in git and
> contains it.**

Not "routed to arc07." Not "owned by the Book project." A path, a file, a line
you can open. Naming an owner that might someday exist is how `D-2607-8HTN`
happened: the Lykn Book was routed to a "Book project" that was never
instantiated, the row read as handled, and the work went cold for three months.

Concretely, to route a row:

1. Open the destination and add the item there (an arc-plan slice row, a
   `BACKLOG.md` entry, a ledger row, a slice-doc scope line).
2. Cite the destination path *in the register row*.
3. Only then set **Status: `routed`**.

If the destination does not exist yet, the row stays `open` (or
`held-for-design`) and says so. **`open` is an honest status; a premature
`routed` is a silent drop wearing a disposition.**

## Closing a row

There are **two** legitimate closures, and conflating them is how a register
starts lying:

- **Repaired** — the thing is fixed and the fix is verifiable.
- **Accepted, not repaired** — the finding stands, and we have decided, with a
  written rationale, to live with it. This is a real CAP closure (*"we looked at
  this and decided no"*), **not** a soft version of open. Mark it in the row
  title so nobody reads it as fixed, state what the acceptance costs, and route
  any residual work to a home that exists. `D-2607-D3NL` is the worked example.

For a repair: a row closes when the thing it describes is actually fixed *and*
the fix is verifiable — commit SHA, ledger row, or reproduced demonstration. Move it to
`Closed` with that evidence attached. State the evidence strength honestly
(`asserted` < `attested` < `reproduced` < `reconciled`, per
`LEDGER-DISCIPLINE.md`); "we'll get to it" is not a closure.

## Triage

At each triage pass, recompute the **Trending** section. Recurring findings are
systemic by definition — that is the CAP-audit property this register exists to
make visible. When three rows share a shape, the fix is usually structural, not
three careful fixes.

---

## Where else things live

| Artifact | Home |
|---|---|
| Planning (project / arc / slice) | `docs/design-vX.Y.Z/` — see `collaboration-framework/docs/PROJECT-MANAGEMENT.md` |
| Design decisions (DDs) | `docs/design/` (odm-managed) |
| This register + owed-row queues | `docs/backlog/` |
| Scratch, transcripts, dead ends | `workbench/` (**gitignored — nothing durable, nothing cited**) |
