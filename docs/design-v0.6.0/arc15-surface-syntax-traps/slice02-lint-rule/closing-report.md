# arc15 · slice02 — Closing Report (Lint rule + check parity)

> **Follow-up B (2026-07-23) — structural carve-out lands; supersedes the global
> `:when` fix below.** The operator chose Option B: replace the global
> `method != "when"` carve-out (committed `d6c23b5`) with a **structural,
> match-clause-position** exemption, closing the `.when()` silent-miscompile hole
> the global carve-out reopened. See "Follow-up B" immediately below; the
> original slice02 walk (the lint rule / `check_strict` parity / the regression
> discovery) is unchanged and recorded further down.

## Follow-up B — structural match-clause carve-out (B-1…B-5)

**Verdict: delivered.** The shared detector is now **pure shape** (List/Cons head
+ keyword arg0) — no keyword is special-cased. A guarded `match` clause is
exempted **by position** via a single shared `is_match_clause(node, parent)`,
consulted by *both* surfaces. `((expr):when arg)` **outside** a match clause is
flagged again (hole closed); the match **subject** and clause **bodies** are
still checked.

| Row | Status | Evidence |
|-----|--------|----------|
| **B-1** — global `:when` carve-out removed; detector is pure shape | **done** | `check_method_on_expression` no longer has `&& method != "when"` — just `List/Cons head + Keyword arg0`. |
| **B-2** — shared `is_match_clause(node, parent)`, clause positions only, `as_form_head` (shadow-safe) | **done** | `classifier::forms::is_match_clause`: `parent` head `as_form_head() == "match"` **and** `node` ∈ `parent.values[2..]` by `std::ptr::eq` (subject at index 1 excluded). A shadowed `match` (bound name) → `as_form_head` `None` → not special. |
| **B-3** — applied on **both** surfaces via the shared helper | **done** | compile walk `walk_method_calls(expr, parent, out)` skips the shape-check on a clause node but still recurses; lint `NoMethodOnExpression::enter` uses `ctx.ancestors.last()` + `is_match_clause`. Both call the *same* helper. |
| **B-4** — `.when()` hole closed on both surfaces | **done** | `((express p):when arg)` (top-level + in a `bind`) → flagged on compile **and** lint; test `dd64_when_method_outside_match_is_still_a_trap` + the lint structural test. |
| **B-5** — `make check` green; scoped diff | **done** (CC-attested) | `make check` ✓; diff = `classifier/{forms,mod}.rs` + `lint/{mod,rules}.rs` only. |

**The full B test table (both compile *and* lint, verified at parity):**

| Case | compile | lint |
|------|---------|------|
| `(match x ((Some v) :when (> v 0) "pos") (_ "neg"))` — guard | ok | ok |
| `((express p):when arg)` outside match (top + `bind`) | **error** | **error** |
| `(match ((express p):join "") …)` — trap in subject | **error** | **error** |
| `(match x ((Some v) ((express p):join "")) …)` — trap in clause body | **error** | **error** |
| express / new / arith / `#a(…)`, nested/deep | **error** | **error** |
| atom method / threading / IIFE / curried | ok | ok |

**One source of truth (paste of both call sites):**
- **compile** (`compile.rs:84` `check_strict`, `:189` compile) →
  `lykn_lang::classifier::validate_method_calls(&forms)` →
  `walk_method_calls` → `is_match_clause(expr, parent)` (`forms.rs:141`).
- **lint** (`lint/rules.rs:486/490`) →
  `is_match_clause(node, parent)` then `method_on_expression_diagnostic(node)`.
- Both bottom out in the *same* `is_match_clause` + `check_method_on_expression`
  — no fork; removing the global carve-out cannot reopen the false positive on
  one surface but not the other.

**Bubble-up (Follow-up B):**
- **Did B close the hole with no false positives on either surface?** Yes —
  the table above is verified at parity; a method literally named `when`
  (`((expr):when …)`) is a trap again, while guarded match clauses are exempt.
- **What the structural exemption revealed:** the `parent` context differs by
  surface — the lint walk *already* threads `ctx.ancestors` (parent =
  `ancestors.last()`), while the compile walk had to be made parent-aware
  (`walk_method_calls` now carries `Option<&SExpr>`). Identity is by
  `std::ptr::eq` on the exact child node being visited, which both walkers
  provide (the lint child and `parent.values[i]` are the same object; the
  compile walk passes `Some(expr)` as it descends). **Shadowed `match`:**
  handled for free by keying the parent's head on `as_form_head` — a bound
  `match` isn't a form, so its "clauses" are *not* exempt (they'd be a real
  call), which is correct.
- **Silent-drop check:** the exemption is one helper, called by both surfaces;
  the four surfaces (compile / check / lint / guides) still agree, now on the
  *structural* rule.

---

**By:** CC (Claude Code) · **Date:** 2026-07-23 · **Branch:** `release/0.6.x`
**Verdict: delivered — with a slice01 regression caught and fixed in the shared
detector.** `no-method-on-expression` (Error) now flags the DD-64 trap in
`lykn lint`, `lykn check` rejects it at any depth (parity with `compile`), and
all four surfaces — compile / check / lint / guides — call the **one** detector.
The dogfood surfaced a **false positive slice01 shipped**: `match` clauses with
`:when` guards were being rejected as traps; fixed in one place (the shared
`check_method_on_expression`), so the fix reaches every surface at once.

## ⚠ Headline finding — slice01 over-rejected `match` `:when` guards

`make check`'s lint dogfood (`lykn lint` over `examples/`) fired the new Error
rule on `examples/surface/data-types.lykn:58–59`:

```lykn
(match opt
  ((Some v) :when (> v 0) "positive")   ;; ← flagged as a method-on-expr trap
  ((Some v) :when (= v 0) "zero")
  ...)
```

A guarded match clause `((Some v) :when (> v 0) body)` has the **same shape** as
the trap — a `List` head (`(Some v)`, the pattern) + a `Keyword` arg0 (`:when`).
slice01's detector (List head + keyword arg0) flagged it, so **`lykn compile`
rejected valid, documented `match`-with-guard code** (repro:
`(match x ((Some v) :when (> v 0) "pos") (_ "neg"))` → error). This is a **real
slice01 regression** — it escaped slice01's `make check` because the `:when`
sites live in strings / uncompiled examples (`match_test.lykn:68` is inside a
test string; guides 00/01 use it in a table / non-executed context), so nothing
compiled them. **slice02's dogfood — the "friendlier earlier catch" — caught the
compiler bug**, exactly the arc's point.

**Fix (per the cc-prompt: "a boundary tweak is a slice01-pass change, one
place"):** the shared `check_method_on_expression` now carves out `:when` — the
*only* keyword the surface grammar places in arg0 of a list-headed non-call form
(a real `.when()` on an expression would thread: `(-> e (:when …))`). One edit,
all surfaces in parity; regression test `dd64_match_guard_is_not_a_trap`.
**Verified:** `data-types.lykn` compiles (rc=0); the trap still rejected (rc=1);
dogfood clean (117 files). **This is a detection-semantics change — CDC should
confirm the carve-out, and note slice01's cdc-verification "no over-rejection"
check missed it (the corpus sweep didn't compile the `:when` example sites).**

## Per-row ledger walk (7 in, 7 out)

| Row | Status | Evidence |
|-----|--------|----------|
| **S-1** — shared detector, one source of truth | **done** | `classifier::method_on_expression_diagnostic(node)` (per-node) and `validate_method_calls` (recursive) both call `forms::check_method_on_expression`. Lint rule `enter` calls `lykn_lang::classifier::method_on_expression_diagnostic`; `compile.rs`/`check_strict` call `validate_method_calls`. No duplicated logic. |
| **S-2** — lint rule fires `Error` at top-level + nested | **done** | `rules::NoMethodOnExpression` (id `no-method-on-expression`), registered. Severity Error (from the shared diagnostic). Tests `no_method_on_expression_flags_receiver_shapes` (express/new/arith/`#a`) + `_flags_nested_and_deep`. Host: `lykn lint` on `(bind r ((express p):join ""))` → 1 error. |
| **S-3** — no over-rejection | **done** | `no_method_on_expression_silent_on_positives` (atom method, threading, bare-kw prop, curried, plain) + the `:when` match-guard carve-out. |
| **S-4** — `lykn check` ≡ compile | **done** | `check_strict` (compile.rs) calls `validate_method_calls` after `resolve`; host: `lykn check` on the nested trap → rc=1. |
| **S-5** — snapshot + registry | **done** | `NoMethodOnExpression` in `registry()`; snapshot `lint_text_no_method_on_expression.snap` (reviewed, accepted). |
| **S-6** — guide-09 ID-47 reclassified | **done** | ID-47 Status → **Compiler-enforced · Linted (`no-method-on-expression`)**; summary-table row + enforcement tally updated (ID-47 now a split, like ID-38). |
| **S-7** — `make check` green; scoped diff | **done** (CC-attested) | `make check` ✓. Diff: `classifier/{forms,mod}.rs`, `compile.rs`, `lint/{mod,rules}.rs` + snapshot, `guides/09-anti-patterns.md`. No sibling-trap (ID-32/33) work. |

## One-liner: the shared predicate (paste of the call sites)

- **compile pass:** `compile.rs:177` and `check_strict` (compile.rs:~84):
  `let method_errs = lykn_lang::classifier::validate_method_calls(&forms);`
- **lint rule:** `lint/rules.rs` `NoMethodOnExpression::enter`:
  `if let Some(diag) = lykn_lang::classifier::method_on_expression_diagnostic(node) { out.push(diag); }`
- Both bottom out in `classifier::forms::check_method_on_expression` — **one
  detector**, so compile / check / lint can't disagree.

## Bubble-up to the arc (three questions)

**1. Did slice02 give lint + check parity with compile?** Yes. `lykn check` now
rejects nested traps (`check_strict` wired), `lykn lint` flags them as Errors
(shared detector), guide-09 marks ID-47 compiler-enforced + linted. All four
surfaces agree.

**2. What the framework revealed:** the dogfood is the star — a lint rule that
*shares the compiler's detector* turned `lykn lint` into a **cross-check on the
compiler**, and it immediately found a slice01 false positive (`match` `:when`)
that the compiler's own test corpus missed. Carry to the arc close: **the
"friendlier earlier catch" layer also functions as a coverage backstop for the
hard rule** — running the shared detector over the *whole* `.lykn` corpus (which
lint does, but compile only does for files in the test suite) is where the
over-rejection surfaced. Recommend the arc close note that boundary carve-outs
(here `:when`) belong in the shared detector with a corpus-wide dogfood as the
check. No snapshot churn or resolution-aware `walk` surprises otherwise — the
detection is resolution-invariant (List head, keyword arg0 — neither is a
resolvable atom).

**3. Silent-drop check — all four surfaces agree.** compile: `validate_method_calls`
in `compile_source_inner`. check: same call in `check_strict`. lint:
`no-method-on-expression` via the shared predicate, recursive walk. guides: ID-47
compiler-enforced + linted, and the teaching sites already thread (slice01). The
`:when` carve-out is applied once and thus consistent across all four. No
divergence, no fork.

## Discipline notes

- **Source:** `classifier/forms.rs` (shared per-node predicate + `:when`
  carve-out + 2 tests), `classifier/mod.rs` (re-export), `compile.rs`
  (`check_strict` parity), `lint/{mod,rules}.rs` + snapshot (the rule + tests).
  **Docs:** `guides/09-anti-patterns.md` (ID-47 reclassify). No detection *fork*
  — the one boundary change is in the shared detector. Sibling traps left for
  slice03.
- **Host note:** re-copy `bin/lykn` with `rm -f bin/lykn && cp …` — a bare `cp`
  over the running binary → `Killed: 9` on Apple Silicon (cost one debug loop).
- Runtime rows (`make check`) CC-attested; reconcile on host. Closing report +
  ledger untracked at hand-off; source + guide land as a green increment.
