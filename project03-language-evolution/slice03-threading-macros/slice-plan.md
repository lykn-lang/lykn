# Unit 03: threading-macros — plan-of-record

**Status:** research complete (2026-07-25); disposition owed to the
language-design conversation
**Kind:** research (SDLC step 1) — no production code changes; all artifacts
land under this unit's own directory
**Feeds:** disposition of `D-2607-K9RT` (held-for-design); input to the pending
language-design conversation tracked as `D-2607-XXXX`

Layout: single slice, arc wrapper collapsed, per `PROJECT-MANAGEMENT.md` Part II
naming rules — same shape as `01-treeshake-audit` and `02-packaging-strategy`.
Home confirmed with the operator 2026-07-25.

## Goal

Establish, from the actual ECMAScript 2025 specification and the actual host
surface rather than from folklore, whether a Clojure-style `->>` (thread-last)
macro has a coherent domain in a JavaScript-targeting Lisp — and if so, what
that domain is and how it should be taught.

The research question, precisely: **Clojure's `->>` works because
`clojure.core` places the collection last, consistently. Does ECMAScript have
any comparably coherent argument-position convention, and does that convention
give `->>` anything to point at?**

## Scope

**In:**

- Complete census of the observable ECMAScript 2025 built-in library
  (clauses 19–28), classified by where the primary datum sits.
- Second-tier census of the host surface lykn actually runs against
  (Web APIs + Deno namespace), same classification.
- Empirical verification of what lykn's threading macros currently compile to
  — by execution, not by shape assertion (`D-2607-3VXM`).
- A recommendation, with confidence marked per item, for the language-design
  conversation.

**Out:**

- The decision itself. This unit produces evidence; the design conversation
  owns the call.
- Any production code change. No compiler, guide, or DD edit is made by this
  unit; DD-18's erratum (§6.1) is *reported*, not applied.
- npm ecosystem conventions (Ramda, lodash/fp). Named as the main limitation
  in `inventory.md` §8 rather than surveyed — settling it needs a corpus of
  real lykn imports, which does not exist yet.
- The collection-prelude *implementation*. R3 recommends against; if the
  design conversation overrules, that is a separate unit and it is coupled to
  `01-treeshake-audit`'s result.

## Deliverables

| Artifact | Role |
|---|---|
| `inventory.md` | The report. Findings, generalisation, recommendations, limitations. |
| `data/catalog-es2025.{tsv,json}` | 489 ES2025 built-ins, classified. |
| `data/catalog-host.{tsv,json}` | 214 host callables, classified. |
| `scripts/build-catalog.py` | Regenerates both catalogs; fails loudly on any unclassified row. |
| `scripts/probe-threading.js` | Executes the compiler to produce the §6 findings. |
| `discovery-rows.md` | Draft rows for `backlog/discoveries.md`. |

## Verification approach

Three independent checks, because the failure mode this unit is most exposed to
is *a confident classification nobody audited*:

1. **No heuristic residue.** Every callable with required arity ≥ 2 is
   hand-assigned in a reviewed table. `build-catalog.py` exits non-zero if any
   such callable is missing from those tables, so the catalog cannot silently
   fall back to guessing. Green means every discriminating row was looked at.
2. **Claims about compiler behaviour are executed, not read — through *both*
   compilers.** `D-2607-3VXM` records that shape-assertions have already
   produced green-and-wrong results in exactly this area. Every §6 finding is
   produced by running the compilers, and the JS/Rust results are diffed
   programmatically into `data/parity-transcript.txt`.
   **Amended 2026-07-25:** the first pass ran the JS compiler only and reported
   implementation status as settled — insufficient for a language-level claim,
   caught when the operator surfaced conflicting accounts of `->>`. Corrected
   within the session (ledger R-11); the original scope is disclosed in
   `inventory.md` §6.6 rather than quietly widened.
3. **Counts in the report are re-derivable from the committed data.** Every
   figure in `inventory.md` comes from `build-catalog.py`'s printed summary.

## Exit criteria

- [x] Both catalogs generated with `self-check: OK`, committed as data.
- [x] Report states the discriminating-set counts separately from the pooled
      counts (the methodological crux — pooling is how this question gets
      answered wrongly).
- [x] Compiler-behaviour claims backed by executed output from **both** compilers (14/14 agree).
- [x] Recommendations carry per-item confidence and name the argument *against*
      where one exists.
- [x] Limitations section names what would falsify the conclusion.
- [ ] **Disposition by the language-design conversation** — not this unit's to
      close. `D-2607-K9RT` stays `held-for-design` until that happens.

## Deviation from the canonical open set — disclosed

`PROJECT-MANAGEMENT.md` Part II specifies `slice-doc.md` + `ledger.md` +
`cc-prompt.md` as the open set. **`cc-prompt.md` is deliberately absent.** There
is no CC assignment pending: this unit's output is an input to a design
decision, not to an implementation. Following `01-treeshake-audit`'s precedent,
the domain artifact (`inventory.md`, cf. its `inventory.md`) stands in the
deliverable slot. If the design conversation produces implementation work,
that work is a *new* unit with its own `cc-prompt.md`.

This is disclosed rather than silently omitted, per the anti-silent-drop
discipline.

## Provenance note

This unit was written by a session that did the research in-context; the ledger
below is therefore **closed by the same party that did the work**. Per
`LEDGER-DISCIPLINE.md` (closer ≠ verifier), no row claims better than
`attested`, and the rows that matter most carry their reproduction command so an
independent party can raise them to `reproduced` cheaply.
