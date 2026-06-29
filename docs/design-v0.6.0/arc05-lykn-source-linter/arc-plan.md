# arc05 — Lykn-Source Linter (`lykn lint`)

> **Status: Open — not started.** Planned at capability depth only, per *plan
> late, plan deep*: no slice breakdown until the arc becomes active. The
> originating thread is preserved at `design/kickoff-thread.md` (was tracked as
> M12, "the most substantive Phase 2 open milestone").

## 1. Capability

`lykn lint` lints **Lykn source** (`.lykn` files) for stylistic and semantic
patterns — anti-patterns, idiom, style — **not** compiled JS (that was Deno's
`deno lint`, now removed from the user surface per philosophy commitment #2,
Option A) and **not** mere syntax errors (`lykn check` already covers those).
The rule-set seed is `docs/guides/09-anti-patterns.md` plus the surface-forms
reference.

**Explicitly out of scope** (from the thread): `deno lint` integration;
`lykn fmt` (separate command); typechecking/inference (Rust analysis layer
already handles it); LSP server work (Phase 3+).

## 2. Slice breakdown

_Not yet planned._ The thread estimates 3–5 iterations of substantial new work.
When this arc becomes active, break it into slices (e.g.: lint-pass
infrastructure over the reader AST → an initial rule corpus from
`09-anti-patterns.md` → `lykn lint` CLI wiring + "not implemented yet" surface
removal → rule expansion) and write each slice's open set then. Apply the
sizing judgment (PROJECT-MANAGEMENT.md Part I) per slice.

## 3. Dependencies

Consumes: arc03's coherent surface + canonical-form discipline (lint rules
reason about surface forms). Independent of arc04. Feeds project-ledger row
P-11.

## 4. Arc ledger

_Opens when the arc-plan is detailed._ The class-(b) composition row will be
"`lykn lint` flags seeded anti-patterns in a fixture and stays silent on clean
idiomatic source," reproduced at arc scale.

## 5. Version History

### v1.0 — 2026-06-28 (reconstructed)
Capability statement recovered from the linter kickoff thread; arc seeded, not
slice-planned.
