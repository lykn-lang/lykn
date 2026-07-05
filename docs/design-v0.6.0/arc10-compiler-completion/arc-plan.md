# arc10 — Compiler Completion (DD-58 strict-default + DD-37 `_kernel` removal)

> **Status: Open — in flight (gates arc05).** Created 2026-06-30. **slice01
> (Rust-CLI strict-default) closed** (`faee8a1`); slice01's bubble-up surfaced
> that the **JS compiler has no strict / `kernel:` parity** → **slice02 ·
> js-dd58-parity** is next (arc10's A-3 composition is met on the Rust path only
> until it lands). Then slice03 (`_kernel` removal). Appended as arc10 by
> **creation order** (NN = creation order; dependency order via Dependencies).
> Despite the high number, this arc **sequences before arc05**.

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
| **slice01 · dd58-strict-default** | Wire `classify_form_strict` into normal `.lykn` compilation on the **Rust CLI** (`compile`/`build`/`check`). The 5 kernel-only heads (`const`/`let`/`var`/`function`/`function*`) → compile error; `kernel:` resolves; `.lyk` exempt; `--no-strict` harness-only. Guides migrated (15 `lykn,skip` fences; ID-38 operators reframed as legal passthrough). | **Closed** (`faee8a1`; Rust CLI strict; `make check` ✓, corpus 1345/0, guide docs 468/0) |
| **slice02 · js-dd58-parity** (NEW — from slice01 bubble-up) | The JS compiler (`packages/lang/`) implements **neither** strict **nor** the `kernel:` escape — so doctests/`deno test` stay lax and `(kernel:const x 42)` mis-compiles (`kernel.const(x,42)`). Add strict + `kernel:` handling to the JS compiler so DD-58 holds at the *language* level, not just the Rust CLI. Then guide kernel demos can go `skip`→`compile-fail`. | **Scoped — open set written 2026-07-05** (`slice02-js-dd58-parity/{slice-doc,ledger,cc-prompt}.md`); gates arc10 A-3 |
| **slice03 · dd37-step4-kernel-removal** | Remove the `_kernel` marker: `expander.js` dispatch (~733–751), `classifier.js:297`, `surface-helpers.js` `kernelArray`. An expander-core change — assess reachability, keep behaviour identical. | **Open** (capability-depth) |

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
| A-1 | slice01 (strict-default) closed | ptr: slice01 closing-report | serious | arc-plan | **done** | slice01 `cdc-verification.md` (accepted 2026-06-30; commit `faee8a1`) — attested (pointer to closed child ledger) |
| A-2 | slice02 (js-dd58-parity) closed | ptr: slice02 closing-report | serious | arc-plan (re-pointed v1.2; was: "slice02 (`_kernel` removal)" — the v1.1 re-slicing moved `_kernel` removal to slice03, now row A-5) | open | |
| A-5 | slice03 (dd37-step4-kernel-removal) closed | ptr: slice03 closing-report | correctness | arc-plan (v1.2; carries the criterion A-2 held before the v1.1 re-slicing) | open | |
| A-3 | **surface prevents bare kernel-only *declaration* forms** — `const`/`let`/`var`/`function`/`function*` in a `.lykn` file are compile errors, on **both** compilers | compile each of the 5 → errors on Rust CLI **and** JS path; `kernel:` escape resolves on both | serious | anti-patterns finding | **partial** | **met on Rust CLI (slice01); JS-compiler parity pending slice02** — until then doctests/`deno test` stay lax. (Operator/expression anti-patterns → arc05 lint.) |
| A-4 | whole tree still compiles + green after migration | `make check` green; doctests green; downstream (mycelium) builds | serious | arc-plan | open | reproduce at arc scale |

## 5. Version History

### v1.2 — 2026-07-05 (slice02 scoped; arc-ledger reconciled)
Wrote the slice02 (`js-dd58-parity`) open set (`slice-doc.md` / `ledger.md` /
`cc-prompt.md`), grounded in `packages/lang/` + the Rust strict reference
(`classify_form_strict`): strict default-on for the JS surface pipeline +
`kernel:` escape (both modes), migration of ~38–59 JS-path call sites,
parity-gap `lykn,skip` fence flips (15 fences grounded: 14 guides + 1 README).
**Arc-ledger reconciliation** (drift found while scoping; surfaced by CDC, not
a slice): A-1 → done (slice01 closed 2026-06-30, evidence pointer added — the
v1.1 entry recorded the close but never updated the row); A-2 re-pointed to
slice02 · js-dd58-parity (was: "slice02 (`_kernel` removal)" — stale after the
v1.1 re-slicing); added A-5 for slice03 (carries A-2's former criterion), so
each slice in the breakdown has its class-(a) row.

### v1.1 — 2026-06-30 (slice01 closed; JS-parity finding → slice02)
slice01 (`dd58-strict-default`) closed (`faee8a1`): DD-58 strict default-on for
`.lykn` on the **Rust CLI** (`compile`/`build`/`check`); the 5 kernel-only heads
error, `kernel:` resolves, `.lyk` exempt, `--no-strict` harness-only; guides
migrated (15 `lykn,skip` fences; ID-38 operators reframed as legal passthrough);
`make check` ✓, corpus 1345/0, guide docs 468/0. **Bubble-up:** the JS compiler
(`packages/lang/`) has **no strict + no `kernel:` escape** → **added slice02 ·
js-dd58-parity** (next; gates A-3), pushed `_kernel` removal to slice03. A-3 →
*partial* (Rust-only) until slice02.

### v1.0 — 2026-06-30 (created)
Created from the DD-58 strict-mode finding (anti-patterns verification, CC report
2026-06-30) + the operator decision to complete DD-58 (strict default-on). Pairs
that with the DD-37 step-4 `_kernel` removal surfaced at arc04's close. Appended
as arc10 (creation-order convention); sequences before arc05. DD-58 doc updated
to v1.1 with the decision.
