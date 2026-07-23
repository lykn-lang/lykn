# arc15 · slice02 — CDC Verification (Lint rule + check parity + slice01 :when regression fix)

**By:** CDC · **Date:** 2026-07-22 · **Verifies:** CC's slice02 @ `d6c23b5`
(committed). **Verifier ≠ closer.** Code review + grep against `lang`; runtime
rows CC-attested → host reconcile.

## Verdict — VERIFIED, with one operator decision on the carve-out

slice02 delivers the lint rule + `check_strict` parity **and** fixes a real
slice01 regression CC found by dogfooding. All verified. One residual —
the global `:when` carve-out leaves a narrow `.when()`-method hole — is an
operator call (§Decision), not a defect that blocks the slice.

## What CC found (a real slice01 regression — and my verification missed it)

A guarded match clause `((Some v) :when (> v 0) body)` has the **exact** trap
shape: List head `(Some v)` + keyword arg0 `:when`. slice01's
`validate_method_calls` (which runs pre-classification) therefore **rejected
valid guarded-match code** — a correctness regression in the slice01 I
CDC-verified and we closed. It escaped slice01's `make check` because the `:when`
sites weren't compiled in the corpus; **slice02's dogfood (`make lint` over
`examples/`) caught it.** That is the belt-and-suspenders arc design proving its
own thesis: the "friendlier" lint layer cross-checked the hard compiler rule and
found the *compiler's* bug.

**I own the miss.** My slice01 `cdc-verification` asserted "no over-rejection,"
but I only re-checked the carve-outs CC *enumerated* (atom / threading / IIFE /
curried) — I did not independently enumerate every grammar production matching
`(List-head :keyword-arg0)`. Match-with-guard is one I should have brainstormed.
**Lesson (logged):** for a shape-based rejection rule, the verifier enumerates
*all* grammar productions of the shape, not just the author's listed exceptions.

## Independent CDC checks (against `lang` @ d6c23b5)

| Claim | CDC check | Result |
|-------|-----------|--------|
| Regression is real | `classify_match` (`forms.rs:1062`) reads `((pattern) :when guard …)`; `test_classify_match_with_guard` | **reproduced** |
| **`:when` is the only collision** | grep: the classifier reads a keyword at arg0-after-list in **one** place (match guard); `if-let`/`when-let` use `(pattern expr)` (no keyword arg0) | **reproduced** — carve-out complete for the grammar |
| Trap still fires | validate tests: express / new / arith / `#a(…)` + **nested** + **deep** → 1 error each, threading fix-it | **reproduced** |
| `:when` exempt | tests: `(match … ((Some v) :when … ) …)` and bare clause → **no** finding | **reproduced** |
| Lint rule (Error) reuses the shared detector | `lint/rules.rs` rule calls the classifier predicate; registered; snapshot present | **reproduced** |
| `check_strict` parity | `compile.rs` `check_strict` now calls `validate_method_calls` | **reproduced** |
| Scoped diff | `git show --stat d6c23b5`: compile/lint/classifier + snapshot + guide-09 only | **reproduced** |
| `make check` green | host-only | **attested (CC)** → reconcile |

Ledger S-1…S-7 met.

## The operator decision — the `:when` carve-out's residual hole

CC's fix is `method != "when"` in the **shared** `check_method_on_expression`
(one edit → all four surfaces stay in parity — exactly the cc-prompt's
guidance). It is **minimal and complete for today's grammar.** But the carve-out
is **global**: `((expr):when arg)` — a method literally named `when` on a
parenthesized expression — is now **not flagged**, so it silently compiles to
`expr.value("when", arg)`. That reintroduces the arc's own target class (a silent
miscompile the compiler won't catch) for one method name.

**Two options:**

- **A — keep the carve-out (committed), document the `.when()` limitation, file a
  structural follow-up.** Practically the hole is negligible (parenthesized
  receiver + a method named exactly `when` + written un-threaded ≈ never), and it
  avoids coupling the pre-classification validator to `match`'s grammar. **CDC
  lean for 0.6.0.**
- **B — structural fix now (match-clause-aware walker).** Exempt `:when` only
  when it is an actual match-clause guard, so `((expr):when x)` *outside* a match
  still errors. Closes the hole, no magic keyword, scales as the grammar grows —
  at the cost of the walker knowing `match`'s clause structure (~15 lines +
  match-coupling; more special-casing if future clause forms add guard keywords).

**Why it's yours:** this is the exact purity-vs-pragmatism line you drew on #6
("a user cannot compile the wrong way"). By that standard B is the consistent
choice; by release-pragmatism A is defensible given how narrow the hole is. A
deeper third path (run the trap check on the *classified* tree, where match
guards are `Match{guard}` nodes and can't be confused with calls) would remove
the pre-classification shape-guessing entirely — a larger change, worth noting as
the eventual "right" architecture but not a 0.6.0 scramble.

## Close status

slice02 **CDC-verified**; the regression fix is **correct and complete for the
grammar**. **Not closed pending** your A-vs-B call on the `.when()` hole (and,
either way, documenting the limitation or landing B). arc15 arc-plan: A-2 →
met-pending-that-decision. `make check` reconciles on host. The slice01
`cdc-verification` should get a correction note (the over-rejection check was
incomplete; fixed-forward in `d6c23b5`).
