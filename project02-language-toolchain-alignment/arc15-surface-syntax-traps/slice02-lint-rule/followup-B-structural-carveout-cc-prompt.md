# CC Prompt — arc15 · slice02 follow-up B · Structural match-clause carve-out

> **You are CC** on `~/lab/lykn/lang`, `release/0.6.x`. This completes slice02:
> replace the **global `:when` keyword carve-out** (committed in `d6c23b5`) with
> a **structural, match-clause-aware** exemption, closing the `.when()`
> silent-miscompile hole. Operator chose Option B (the #6 "cannot compile the
> wrong way" standard). Read the slice02 `cdc-verification.md` first. Surface and
> self-stop.

## Why

The current fix exempts `:when` **globally** — `method != "when"` inside the
shared detector. That fixes the match-guard false positive, but it means
`((expr):when arg)` — a method literally named `when` on a parenthesized
expression — is **no longer flagged** and silently compiles to
`expr.value("when", arg)`. That reopens the arc's own target class for one method
name. The correct fix exempts `:when` **only where it's actually a match-clause
guard** (structural), so the same shape *outside* a match still errors.

**Verified context (CDC):** `:when` is the *only* keyword the grammar puts at
arg0-after-a-list, and *only* `match` bears guard clauses (`if-let`/`when-let`
use `(pattern expr)` — no keyword arg0). So the structural exemption is
**match-clause-position only**.

## What to do (MUST)

### 1 — Remove the magic keyword; make the shape detector pure
- In `classifier` (`forms.rs`), drop the `&& method != "when"` from
  `check_method_on_expression` / `method_on_expression_diagnostic`. The shared
  per-node detector goes back to pure shape: **List/Cons head + keyword arg0**.
  This stays the single source of truth for the *shape*.

### 2 — Add a shared, structural match-clause exemption
- Add a shared helper (in `classifier`, so both surfaces call it — no fork), e.g.
  `is_match_clause(node, parent) -> bool`: true iff `parent` is a form whose head
  resolves (`as_form_head`, so a **shadowed** `match` is not special — DD-61) to
  `match` **and** `node` is a **clause** of it (i.e. `parent.values[2..]`, NOT the
  subject at index 1).
- **Exempt only clause positions.** The match **subject** (index 1) is still
  checked — `(match ((express p):join "") …)` is a real trap. Clause **bodies/
  guards** are still checked (recurse into them) — a trap inside a clause body is
  real. Only the *clause list itself* (the `((pattern) :when …)` shape) is exempt.

### 3 — Apply the exemption on BOTH surfaces (parity — the whole point)
- **Compile pass** (`walk_method_calls`): when descending into a `match` form,
  skip the shape-check on each clause node (index ≥ 2) but **still recurse into
  it**; check the subject and everything else normally.
- **Lint rule** (`NoMethodOnExpression`, `lint/rules.rs`): use `ctx.ancestors`
  (the parent is `ancestors.last()`) — if `is_match_clause(node, parent)`, do not
  emit. (The rule currently ignores `_ctx`; wire it in.)
- Both call the **same** `is_match_clause` + the same shape detector. Removing the
  global carve-out must NOT reopen the match-guard false positive on *either*
  surface.

### 4 — Update the comment
- Replace the "`:when` is the only keyword … magic carve-out" note with the
  structural rationale (exempt match-clause positions; the subject and bodies are
  still checked). Note: only `match` has guard clauses today; a future
  clause-bearing form would extend `is_match_clause`.

## Tests (MUST — on BOTH compile and lint)

| Case | Expect |
|------|--------|
| `(match x ((Some v) :when (> v 0) "pos") (_ "neg"))` | **no** finding (guard exempt) |
| `((express p):when arg)` *outside* a match (top-level + in a `bind`) | **flagged** — closes the hole |
| `(match ((express p):join "") (_ "x"))` — trap in the **subject** | **flagged** |
| `(match x ((Some v) ((express p):join "")) (_ "y"))` — trap in a clause **body** | **flagged** |
| existing trap cases (express/new/arith/`#a(…)`, nested/deep) | still **flagged** |
| existing carve-outs (atom method / threading / IIFE / curried) | still **no** finding |

`make check` green. Update the lint snapshot if the rule's output changes.

## Ledger (embedded — 5 rows)

| ID | Criterion | Verify | Status |
|----|-----------|--------|--------|
| B-1 | Global `:when` carve-out removed; detector is pure shape | read `check_method_on_expression` — no `method != "when"` | open |
| B-2 | Shared `is_match_clause(node,parent)` exemption — clause positions only (not subject/bodies); `as_form_head` (shadow-safe) | read the helper + call sites | open |
| B-3 | Applied on **both** surfaces via the shared helper — compile walker + lint rule (`ctx.ancestors`) | both call sites; parity tests pass | open |
| B-4 | `.when()` hole closed — `((expr):when x)` outside match flagged on both surfaces | the test table | open |
| B-5 | `make check` green; scoped diff (classifier + lint + tests/snapshot only) | host `make check`; `git show --stat` | open |

## MUST NOT

- **No magic-keyword carve-out** — the exemption is structural (match-clause
  position), not a keyword name (B-1/B-2).
- **Do not fork the detection** — one shape detector + one `is_match_clause`
  helper, both surfaces call them (B-3).
- **Do not exempt the match subject or clause bodies** — only the clause-list
  shape (B-2).
- Never auto-pass `--allow-dirty`/`--force`/`--no-verify`.

## Close-set

Write `closing-report.md` (in `slice02-lint-rule/`): the 5-row ledger walk; a
one-liner confirming compile + lint call the *same* helper (paste both call
sites); and a bubble-up — did B close the hole with no false positives on either
surface; anything the structural exemption revealed (e.g. shadowed-`match`
handling). Then **stop** — this **closes slice02** on CDC verify + host reconcile.

## Host note

Apple Silicon: `rm -f bin/lykn && cp …` (bare `cp` over the running binary →
`Killed: 9`).
