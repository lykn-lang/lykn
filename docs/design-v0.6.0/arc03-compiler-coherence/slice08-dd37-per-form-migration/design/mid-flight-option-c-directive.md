# M22 Mid-Flight Directive: Option C (Helper Extraction)

**From:** CDC (Cowork Claude, cdc/compiler-coherence thread)
**To:** CC (Claude Code, mid-M22)
**Date:** 2026-05-17
**Re:** Architectural surface raised mid-M22 about complex-form
extraction dependencies on `surface.js` internal helpers

---

Your surface was exactly the right move — the methodology pattern
working as designed. The architectural question is substantive and
your analysis is correct.

## Decision: Option C — extract the helpers to `surface-helpers.js`. Then proceed.

**Reasoning (short version):**

Option A (emit delegates back to macros) compromises DD-37's
central architectural claim — "Built-in surface forms become
static transforms, not macros." If emit calls back to the macro
path, the static-transform claim is just a typed wrapper over the
same old machinery, and `_kernel` retirement (DD-37 step 4) stays
blocked.

Option B (full inline; ~800-line classifier.js) is messy.

Option C is what DD-37's six-module decomposition actually
envisions — the helpers are a de facto module already; just give
them a real one.

---

## Order of operations

### 1. First: commit batches 1-3 cleanly to current state.

Get the simple-form work to a clean commit boundary before pausing
for the architectural step. Don't bundle pending work-in-progress
into the same commit.

### 2. Then: helper extraction (new ledger row M22-3b).

TDD-first paired commits.

**Test commit:**

- Assert helpers' behavior unchanged via in-place tests of the 9
  helpers:
  - `compileLetPattern`
  - `wrapReturnLast`
  - `buildTypeCheck`
  - `formatSExpr`
  - `toJsIdentifier`
  - `gensym`
  - `isKeyword`
  - `isArray`
  - `isSymbol`
- PLUS at least one integration test through a still-macro-
  registered form to prove behavior preservation end-to-end.

**Fix commit:**

- Create `packages/lang/surface-helpers.js` exporting all 9
  helpers.
- Update `packages/lang/surface.js` to import them from
  `surface-helpers.js` rather than defining them inside
  `registerSurfaceMacros`.

**Verification:**

- Run `make bundle-size` — delta should be minimal (pure refactor;
  possibly small NEGATIVE delta from deduplication, or small
  positive from a tiny export overhead).
- Run the full test suite — all tests pass.

### 3. Then: resume complex batches (ledger row M22-3c).

`classifier.js`'s emit transforms import helpers from
`surface-helpers.js`. Each batch is TDD-first paired commits as
before.

Batches 4-9 per the ledger ordering:

- Batch 4: binding macros (if-let, when-let)
- Batch 5: anonymous functions (fn, lambda)
- Batch 6: logical n-ary (and, or)
- Batch 7: small surface forms (do, express, obj, cell, type,
  genfn)
- Batch 8: large forms (func, genfunc, match, bind)
- Batch 9 / M22-4: special-case (macro, import-macros, =, !=)

---

## Iteration budget

This pushes M22 past the nominal 5-iteration cap. Duncan's
standing iteration-budget override applies — the cap is a guard
against compliance-theatre, not against good-faith engineering
iteration. You're at the latter. Proceed.

---

## Ledger update

The M22 ledger has been amended:

- M22-3 split into M22-3a / M22-3b / M22-3c
- M22-3a: simple routine batches 1-3 (done at the point you commit
  current work)
- M22-3b: helper extraction (new)
- M22-3c: complex routine batches 4-8 (depends on M22-3b)

The implementation prompt has been amended with a "2026-05-17
Option C amendment" section explaining the call.

**Re-read both before resuming:**

- `workbench/milestones/M22-dd37-step3-per-form-migration-and-ci-integration-ledger.md`
- `workbench/M22-implementation-prompt-2026-05-17.md`

---

## Flag if you encounter this

If any of the 9 helpers turns out to have a closure dependency on
something else inside `registerSurfaceMacros` (e.g., it references
a variable from the enclosing scope that ISN'T one of the 9
helpers), surface that — it's a finding that affects the
extraction scope. You may need to either:

- Make the dependency a parameter to the extracted helper, OR
- Extract the dependency too, OR
- Surface to CDC if the dependency is more entangled than this
  list anticipates.

Don't work around quietly.

---

Go.
