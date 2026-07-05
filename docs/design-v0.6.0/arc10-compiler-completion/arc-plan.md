# arc10 — Compiler Completion (DD-58 strict-default + DD-37 `_kernel` removal)

> **Status: Open — next up (gates arc05).** Created 2026-06-30. Appended as
> arc10 by **creation order** (project convention as of 2026-06-30: NN =
> creation order; *dependency* order is carried by the Dependencies field and the
> project roadmap, not by NN). Despite the high number, this arc **sequences
> before arc05** — see Dependencies.

## 1. Capability

Make surface lykn *actually* the closed, clean namespace DD-58 and DD-37 designed
— so the language becomes what `philosophy.md` and the guides already claim it is.
Two pieces:

1. **DD-58 strict-default** — strict enforcement is default-on for ordinary
   `.lykn` compilation (not just the test runner). Bare kernel-only forms in
   surface become compile errors, resolvable via the `(kernel:<form> …)` escape.
2. **DD-37 step 4** — remove the transitional `_kernel` marker (the last piece of
   DD-37's migration, surfaced at arc04's close).

Together: surface prevents bare **kernel-only declaration forms** —
`const`/`let`/`var`/`function`/`function*` (currently they leak through and emit
directly, e.g. `(var x 1)`→`var x = 1`), and the `_kernel` scaffolding is gone.
(Scope note per CC's 2026-06-30 finding: DD-58 closes *exactly* these 5 heads;
the operator/expression anti-patterns `==`/`this`/`arguments`/`require`/IIFE are
legal surface and belong to arc05's linter, not this arc.)

**Scope note (operator, 2026-06-30):** the strict-default migration is
**repo-only** for now — downstream projects (e.g. mycelium) that use bare kernel
forms will break under strict and are handled as a **separate follow-up**, not in
arc10 slice01.

## 2. Slice breakdown

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · dd58-strict-default** | Wire `classify_form_strict` into normal `.lykn` compilation (today it's `lykn test`-only). Bare kernel-only forms (`var`/`const`/`let`/`function`/`function*` — the 5 heads, per CC's finding) in surface → compile error; `kernel:` escape resolves; `.lyk` exempt. **Repo-only migration** of those 5 forms in guides/tests/examples (or `compile-fail`/`kernel:`-mark doc examples). Downstream (mycelium) + the operator/expression anti-patterns (→ arc05 lint) = filed follow-ups. | **Open — scoped** (slice-doc + ledger + cc-prompt ready for CC) |
| **slice02 · dd37-step4-kernel-removal** | Remove the `_kernel` marker: `expander.js` dispatch (~733–751), `classifier.js:297`, `surface-helpers.js` `kernelArray`. An expander-core change — assess reachability, keep behaviour identical. | **Open** (capability-depth; plan when slice01 lands) |

## 3. Dependencies

Consumes: arc03 (DD-58 strict-mode machinery + DD-37 classifier) and arc04 (the
surface extraction — `classifier.js` is self-contained). **Gates arc05** — the
`lykn lint` corpus depends on what the *compiler* enforces: once strict-default
lands, the kernel-form anti-patterns (10 of the guide's 12 "eliminated" leaks)
become compile errors, not lint rules, so the linter focuses on genuine
idiom/style. **Should land before arc09 (release)** — it's a language-integrity
change (and a breaking one) that 0.6.0 should ship.

**Sequence:** arc10 → arc05 → (arc06/arc07) → arc09. (NN is creation order;
this is the dependency order.)

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence |
|----|-----------|--------|--------------|--------|--------|----------|
| A-1 | slice01 (strict-default) closed | ptr: slice01 closing-report | serious | arc-plan | open | |
| A-2 | slice02 (`_kernel` removal) closed | ptr: slice02 closing-report | correctness | arc-plan | open | |
| A-3 | **surface prevents bare kernel-only *declaration* forms** — `const`/`let`/`var`/`function`/`function*` in a `.lykn` file are compile errors | compile each of the 5 → errors; `kernel:` escape resolves | serious | anti-patterns finding | open | reproduce at arc scale. (The operator/expression anti-patterns `==`/`this`/`arguments`/`require`/IIFE are legal under DD-58 → arc05 lint, not here) |
| A-4 | whole tree still compiles + green after migration | `make check` green; doctests green; downstream (mycelium) builds | serious | arc-plan | open | reproduce at arc scale |

## 5. Version History

### v1.0 — 2026-06-30 (created)
Created from the DD-58 strict-mode finding (anti-patterns verification, CC report
2026-06-30) + the operator decision to complete DD-58 (strict default-on). Pairs
that with the DD-37 step-4 `_kernel` removal surfaced at arc04's close. Appended
as arc10 (creation-order convention); sequences before arc05. DD-58 doc updated
to v1.1 with the decision.
