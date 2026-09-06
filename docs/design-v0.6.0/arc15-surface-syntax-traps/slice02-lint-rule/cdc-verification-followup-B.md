# arc15 · slice02 follow-up B — CDC Verification (structural match-clause carve-out)

**By:** CDC · **Date:** 2026-07-22 · **Verifies:** CC's B @ `90cf211`.
Code review + grep against `lang`; runtime rows CC-attested. **This closes
slice02** (pending host reconcile).

## Verdict — VERIFIED

The magic `:when` carve-out is gone, the exemption is structural and shared, both
surfaces are **pointer-identity sound** (the one real risk — verified absent),
and the `.when()` hole is closed and tested at parity. slice02 closes.

## Independent CDC checks (against `lang` @ 90cf211)

| Claim | CDC check | Result |
|-------|-----------|--------|
| Magic keyword gone | `check_method_on_expression` = pure shape (List/Cons head + keyword arg0); no `method != "when"` | **reproduced** |
| `is_match_clause` correct | parent head `as_form_head`→`"match"` (shadow-safe, DD-61), `values[2..]` (clauses only, **not** the subject), `std::ptr::eq(clause, node)` | **reproduced** |
| **Compile walker ptr-sound** | `walk_method_calls(v, Some(expr))` for `v in values` — `v` is a borrow into `expr.values`, so `ptr::eq(&values[j], v)` holds exactly for the clause | **reproduced** |
| **Lint walker ptr-sound** | `walk` calls `enter(node)` with `ancestors.last()` = true parent (pushed before recursing); children recursed as `for child in values` (borrows) → `ptr::eq` holds; rule uses `ctx.ancestors.last()` | **reproduced** |
| Hole closed, at parity | classifier: `((express p):when arg)` and nested → `len()==1`; lint: `no_method_on_expression_match_clause_structural_exemption` asserts the same | **reproduced** |
| Subject + bodies still checked | both suites assert `(match ((express p):join "") …)` (subject) and `(match x ((Some v) ((express p):join "")) …)` (body) → flagged | **reproduced** |
| Guard exempt, at parity | both suites assert `((Some v) :when …)` → no finding | **reproduced** |
| Scoped diff | `git show --stat 90cf211`: classifier + lint only (4 files) | **reproduced** |
| `make check` green; 7 classifier + 4 lint tests | host-only | **attested (CC)** → reconcile |

Ledger B-1…B-5 met. slice02 S-1…S-7 met.

## The one residual — and the operator's "explicit type" instinct is the right one

`is_match_clause` correctness rests on an **implicit invariant**: the `node`
handed to it is a *borrow into* `parent.values` (so `ptr::eq` works). I verified
both walkers honor it today, but it's convention, not type-enforced — a future
refactor that clones a node would make `ptr::eq` silently return `false` and
quietly reopen the match-guard false positive. Not a bug now; a maintainability
sharp edge.

**The real type-level protection (the operator's question):** run the
method-on-expression check on the **classified tree**, where a guard is a
`SurfaceForm::Match { guard }` node and a method-call-on-expression is its own
form — the collision becomes a **type distinction, impossible by construction**,
and the entire `is_match_clause`/`ptr::eq` carve-out **disappears**. That is the
principled answer.

**Contingency (verify when scoping):** slice01 put the check *pre*-classification
precisely because the emitter lowers nested exprs lazily — so a post-classify
check is only safe if classification **fully types every nested expression** (no
raw exprs escape the typed check). Confirming that coverage is the first task of
the hardening slice.

**Recommendation:** ship B as-is for 0.6.0 (verified-correct + tested at parity);
**scope the classified-tree check as an arc15 hardening slice** (slice03
territory, alongside the sibling traps ID-32/ID-33) — it removes the carve-out
*and* the ptr-identity fragility in one structural move. A cheap 0.6.0 belt, if
wanted before then: have the compile walker compute clause-ness **by index during
iteration** (dropping `ptr::eq` on that side entirely), leaving only the lint rule
reconstructing from `ancestors`.

## Close status

slice02 (rule + parity + regression fix + B) **CDC-verified → closes** on host
reconcile of `make check`. arc15 arc-plan: A-2 met (pending reconcile); A-3…A-6
met. slice01 `cdc-verification` still owes a correction note (its over-rejection
check missed the `:when` production; fixed-forward in `d6c23b5`+`90cf211`).
The classified-tree hardening is a new arc15 backlog item.
