# arc15 — Surface-Syntax Traps

> **Status: ACTIVE — seeded + slice-planned 2026-07-22** (operator-initiated
> after the arc06/slice02 #6 finding + pushback). **Release: 0.6.0.** The home
> for surface-syntax shapes that **compile clean but mean something the author
> didn't write** — starting with method-call-on-an-expression (DD-64). Design:
> [`design/dd-64-method-on-expression-DRAFT.md`](./design/dd-64-method-on-expression-DRAFT.md)
> (odm promotion = Duncan).

## 1. Capability

A class of lykn surface forms currently **compile to confidently-wrong output
without an error** — the author writes something that looks right, the compiler
faithfully compiles a *different* valid construct, and the mistake surfaces (if
at all) as an opaque runtime crash. This is the exact "papered-over / silently
wrong" class 0.6.0 exists to close, applied to *surface syntax*. arc15 makes
each such trap a **compile error with a fix-it**, teaches the Lykn-correct
pattern in the guides, and adds a **lint rule** for the friendly earlier catch —
so a user *cannot* build a codebase on the trap and have it break later.

The flagship (and slice01) is **method-call on a parenthesized expression**
(`((express parts):join "")` → `parts.value("join","")`), whose correct form is
threading (`(-> (express parts) (:join ""))`). DD-64 is its design.

## 2. Slice breakdown

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · reject-method-on-expr + guide migration** | Classifier **error** on `(<non-atom-head> :kw …)` with a threading fix-it + tests; **migrate the ~10 guide sites** that teach the trap to threading + repoint ID-31 / 09-anti-patterns; `make check` + `make test-docs` green together. Coupled: the error breaks the guides, so they land as one capability. (CDC sweep done: 0 source/test hits, 0 mycelium, ~13 guide sites enumerated.) | **Open — scoped** (open set 2026-07-22) |
| **slice02 · lint rule** | arc05 `lykn lint` rule flagging `(<non-atom-head> :kw …)` with the threading fix-it — friendly, earlier catch (DX layer atop the hard error). Resolution-aware machinery exists. | Planned (post-slice01) |
| **slice03 · sibling traps** | Assess whether still-live compiler traps and fold in: **ID-32** `return return` (typed `fn` + explicit `return` → double return), **ID-33** `\uNNNN` not processed (reader — literal Unicode only). Each: is it still a *silent* miscompile on current lykn? → error/warn + guide. **Shaped, not detailed** (plan-late). | Planned (shaped) |

_Plan late, plan deep: slice01 is detailed against the CDC sweep; slice02 is
shaped; slice03 is a holding pen for siblings the arc06 audit surfaced, each of
which needs its own re-check against current lykn before scoping._

## 3. Dependencies

Consumes the **threading** machinery (`apply_threading_step`, emitter/forms.rs —
already shipping; the correct pattern compiles today) and the **classifier**
dispatch (where the error lands). slice02 consumes **arc05**'s lint framework.
**Feeds arc07** (the guide/SKILL alignment — arc15 migrates the specific trap
sites; arc07 owns the broader guide pass). Independent of arc06. Must land in
0.6.0 (pre-adoption, per DD-64's forward-compat rationale). No `crates` API
change beyond the new classifier error.

## 4. Arc ledger

Composition criteria that verify the capability. Class-(b) rows reproduced at
arc scale. Opens here; per-row walk closes in `closing-report.md`.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | slice01 (reject + guide migration) closed | ptr: slice01 cdc-verification | serious | arc-plan | open | | the guarantee + docs correctness |
| A-2 | slice02 (lint rule) closed | ptr: slice02 cdc-verification | serious | arc-plan | open | | the DX layer |
| A-3 | **`((express x):m …)` and every non-atom-head + keyword-first shape is a compile ERROR** with the threading fix-it (not silent, not a warning) | host: `lykn compile` the trap → non-zero exit + fix-it message; the 3 canonical shapes (express / new / arithmetic) all rejected | serious | DD-64 | open | | reproduce at arc scale on host |
| A-4 | **the Lykn-correct form compiles** — `(-> (express x) (:m …))` and atom `(x:m …)` still emit correctly (no over-rejection) | host: threading + atom-method forms compile green; positive tests | correctness | DD-64 | open | | anti-over-rejection |
| A-5 | **no guide teaches the trap** — the sweep for `):kw` glued fingerprint returns only *documented-as-wrong* sites; `make test-docs` green | re-run the CDC sweep; every remaining hit is an ID-31/anti-pattern "don't" example | correctness | CDC sweep | open | | anti-silent-drop for docs |
| A-6 | **no existing source/test regressed** — corpus was 0-hits pre-change; `make check` green | host: `make check` green post-error | correctness | CDC sweep | open | | sweep said 0 source hits |

## 5. Version History

### v1.0 — 2026-07-22 (arc SEEDED + slice-planned; recon done)
Operator-initiated from arc06/slice02 #6 (method-on-`express` silent miscompile)
after pushback on the initial CDC "small deal" read. Decisions: general boundary,
new arc15, both compiler-error + lint + guides (DD-64). CDC ran the ground-truth
sweep before scoping (recon-first): **0 source/test hits, 0 mycelium, ~13 guide
sites** (~10 teach the trap, ~3 document it). slice01 detailed against the sweep;
slices 02/03 shaped. arc ledger opened (A-1…A-6). DD-64 seeded for odm promotion.
