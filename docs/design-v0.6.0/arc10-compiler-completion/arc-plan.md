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

Together: surface prevents `var`/`==`/`this`-functions/`arguments`/`require`/IIFE
(currently they leak through and emit directly), and the `_kernel` scaffolding is
gone.

## 2. Slice breakdown

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · dd58-strict-default** | Enable DD-58 strict mode for `.lykn` `compile`/`build` (today it's wired to `lykn test` only — `main.rs` `strict: !is_lyk`). Bare kernel-only forms (`var`/`const`/`let`/`function`/`function*`) in surface → compile error with the `kernel:` escape as the resolution. **Migration audit**: find + convert bare kernel/JS forms across the tree (guides, examples, scaffolds, downstream e.g. mycelium) to surface forms or `kernel:` escapes so everything still compiles. Verify the guide's "ELIMINATED" claims now hold + all doctests/`make check` green. Subsumes the `(require …)`→invalid-ESM issue. | **Open — priority** (near-specified; scope a CC prompt next) |
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
| A-3 | **surface prevents the kernel-form leaks** — bare `var`/`==`/`function`-`this`/`require`/IIFE in a `.lykn` file are compile errors | compile the 10 leak snippets from the anti-patterns report → each errors (kernel: escape resolves) | serious | anti-patterns finding | open | reproduce at arc scale |
| A-4 | whole tree still compiles + green after migration | `make check` green; doctests green; downstream (mycelium) builds | serious | arc-plan | open | reproduce at arc scale |

## 5. Version History

### v1.0 — 2026-06-30 (created)
Created from the DD-58 strict-mode finding (anti-patterns verification, CC report
2026-06-30) + the operator decision to complete DD-58 (strict default-on). Pairs
that with the DD-37 step-4 `_kernel` removal surfaced at arc04's close. Appended
as arc10 (creation-order convention); sequences before arc05. DD-58 doc updated
to v1.1 with the decision.
