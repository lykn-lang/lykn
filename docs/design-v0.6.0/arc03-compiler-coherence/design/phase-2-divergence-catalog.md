# Phase 2 — Divergence Catalog: Compiler-as-Built vs Documented Intent

**Date:** 2026-05-14
**Inputs:**
- Phase 1a triage (`workbench/phase-1a-test-failure-triage-2026-05-14.md`)
- Phase 1c audit (`workbench/phase-1c-classification-audit-2026-05-14.md`)
- DD-50 → DD-50.7 series ledger (`docs/dev/0009-…`, `…-0016-…`, `…-0020-…`)
- `docs/guides/{03-error-handling,06-functions-closures,08-performance,17-template-and-i18n}.md`
- JS source `packages/lang/{surface.js,compiler.js}`
- Rust source `crates/lykn-lang/src/emitter/forms.rs`, `crates/lykn-cli/src/doctest.rs`

**Scope note:** The Lykn book lives at `~/lab/cnbb/lykn`, outside this session's connected folders. This catalog covers the in-repo doc surfaces (the `docs/guides/` doc-test sources, the DD-50 series ledger, and supporting prompts). Book-level divergence requires a separate pass in that repo.

---

## Three layers of "documented intent"

Phase 2 needs to be clear about *what kind of documentation* each divergence is against:

1. **User-facing docs** (`docs/guides/*.md`) — the prose and code examples that doctest validates. The 14 failing blocks live here. These are the primary source of "what is lykn supposed to do for users."
2. **Design ledger** (`docs/dev/*.md` — DD-50, DD-50.5, DD-50.6, DD-50.7 implementation prompts and closing reports) — the design decisions that *should* govern the compiler. These are the primary source of "what was the compiler supposed to do, per the decisions taken."
3. **Lykn skill** (`assets/ai/SKILL.md`) — the lykn-language-guidelines that AI agents (including this one) load when writing lykn code. Secondary; tracks (1) but is itself a separate surface.

A divergence can exist between any pair of these and the compiler-as-built. The catalog below groups by the failure pattern, then notes which doc layer is the source of expectation.

---

## D-1 — Factory pattern `(func … :returns :function :body (fn …))` documented as canonical, JS compiler rejects

**Doc source (layer 1):** `docs/guides/06-functions-closures.md` ID-09 "Factory Functions That Return Closures", strength **SHOULD**, marked "Good":

```lykn
(func create-logger
  :args (:string prefix)
  :returns :function
  :body (fn (:string message)
    (console:log (template "[" prefix "] " message))))
```

Plus `create-multiplier` immediately below it.

Also: `docs/guides/08-performance.md` ID-27 (`memoize`), ID-28 (`memoize-lru`); `docs/guides/06-functions-closures.md` block 34 (`create-filter`); `docs/guides/07-async-concurrency.md` block 31 (`debounce`, `throttle`); `docs/guides/11-documentation.md` block 10.

**Doc source (layer 2):** DD-50.6 Q3 was decided as **C — compile-then-check**, with explicit rationale (quoting `docs/dev/0016-dd-50.6-implementation-prompt-for-cc.md:17-20`):

> Q3: C — **compile-then-check.** Don't classify by surface-form head (curated-list approach). Instead, compile the last body expression first, then check the result's head against the kernel statement-form list. This is more future-proof (catches surface forms whose head isn't a statement form but whose compiled kernel form is).

**Compiler-as-built (Rust):** Implements Q3=C. `is_valueless_last_expr` runs on `last` which is taken from `emit_body(...)` output — i.e., the kernel form after surface-to-kernel expansion. `(fn ...)` is expanded by `emit_fn_expr` to `(=> ...)`, and `=>` is not in `STATEMENT_FORM_HEADS`. Check correctly returns false; `func ... :returns :function :body (fn ...)` compiles cleanly. **Cargo test confirms: 1071/1071 pass.**

**Compiler-as-built (JS):** Does NOT implement Q3=C. `packages/lang/surface.js:1775, 1831` apply `isStatementOnlyForm(lastBodyExpr)` to the **surface** form (still showing `fn`, not yet expanded to `=>`). `STATEMENT_ONLY_HEADS` includes `"fn"` (line 907). Check returns true; the func macro throws the Q2=A diagnostic.

**Divergence type:** **Compiler bug** — JS implementation violates the DD-50.6 Q3=C design decision. The docs are correct per DD-50.6's intent; the JS-compiler is what's broken.

**Why the Rust/JS divergence wasn't caught:** DD-50.6 Q4 specified "Statement-form list maintained as constants in two locations, with `compile-both` cross-compiler tests gating list drift." The cross-compiler tests in `test/forms/dd-50.6_test.lykn` exercise patterns like `(while …)`, `(for …)`, `(if … no-else)`, `(block …)` — i.e., genuinely statement-only forms — but no test exercises `(fn …)` or any other surface form that expands to a value-producing kernel form. The drift between the two implementations' lists (Phase 1c Table) was undetectable by the chosen tests.

**Resolution direction (Phase 3 territory):**
- (D-1.α) Make JS implement Q3=C correctly — apply the statement-only check to the *emitted* form, not the surface form. Remove `"fn"` from `STATEMENT_ONLY_HEADS` (it's a surface form; its emit is `=>`).
- (D-1.β) Add `compile-both` tests that exercise the surface-vs-kernel boundary specifically (e.g., `(fn …)` as last body; threading macros as last body) to prevent re-drift.
- The Rust side needs no change for this divergence.

---

## D-2 — `try`-as-expression documented in 03-error-handling, both compilers reject

**Doc source (layer 1):** `docs/guides/03-error-handling.md` ID-12, strength **CONSIDER**, marked "Good":

```lykn
(func try-parse-json :args (:string s) :returns :any :body
  (try (JSON:parse s) (catch undefined)))

(func valid-json? :args (:string s) :returns :boolean :body
  (try (block (JSON:parse s) true) (catch false)))
```

Plus `docs/guides/03-error-handling.md` block 4 (`load-config`, async).

**Doc source (layer 2):** DD-50.6 did not address `try`-as-expression specifically. The Q3=C design intent (compile-then-check) implicitly classifies forms by their *kernel* emit, and `try` emits as a JS `TryStatement` (verified in Phase 1c) — which IS a statement, so the compiler's classification is correct *under DD-50.6's design*.

**Compiler-as-built (Rust):** `crates/lykn-lang/src/codegen/emit.rs:828-893` `emit_try` emits raw `try { ... } catch { ... }` — a JS statement. No IIFE-wrap path. `(func ... :returns :T :body (try ...))` triggers the Q2=A diagnostic correctly per Q3=C.

**Compiler-as-built (JS):** `packages/lang/compiler.js:1029-1081` emits an ESTree `TryStatement` node. Same shape. Same Q2=A trigger.

**Divergence type:** **Doc vs compiler design intent disagreement.** Unlike D-1, this is not a compiler bug — both compilers agree, and they agree with DD-50.6's design intent that statement-typed last-body-of-`:returns` is an error. The disagreement is between the docs (which say `(try ...)` as `:returns :T` body is good) and the design intent (which says it should error).

The docs in `03-error-handling.md` predate DD-50.6 (Duncan wrote ID-11 and ID-12 in April 2026; DD-50.6 landed 2026-05-10). The docs were written under an implicit prior assumption that the patterns work — either because (a) the compiler did accept them under whatever rule predated DD-50.6, or (b) the patterns were never actually tested before doctest expanded to cover them.

**Resolution direction (Phase 3 territory):**

This is the structurally bigger of the two language-design questions surfaced by the audit. Possible directions:

- (D-2.α) **`try` becomes value-producing.** Implement IIFE-wrap for `try` in expression/Tail context, both Rust (`emit_try` in codegen) and JS (`compiler.js`). Then `try` is removed from both statement-only lists. The docs become correct as-shipped. **Largest change.** Affects how the surface-vs-kernel boundary works for `try`. Affects existing JS output for any code that already uses `try` (none, because none compiled successfully — but it widens the language).
- (D-2.β) **Docs change to match compiler.** Rewrite `try-parse-json` and `valid-json?` to use a `:returns :any` discipline plus explicit assignment to a `bind`. **But:** `(bind result (try ...))` would also fail under both compilers today, because bind's initializer expects a value-producing expression. So a true rewrite needs a different shape, e.g.:
  ```lykn
  (func try-parse-json :args (:string s) :returns :any :body
    (bind result (cell undefined))
    (try (swap! result (fn (_) (JSON:parse s)))
         (catch (swap! result (fn (_) undefined))))
    (express result))
  ```
  Ugly. Not a real ergonomic substitute for the original.
- (D-2.γ) **Implement value-producing `try` only in expression position**, leaving statement-position behavior unchanged. Smallest change that closes the doc divergence. The Rust side gains an `emit_try_expression` that IIFE-wraps in Value/Tail context, falling through to current `emit_try` for Statement context. JS the same. This is the most architecturally consistent option — it mirrors how `if` already works (DD-50 + DD-50.7).

D-2.γ is the natural extension of the existing position-aware compilation work. The exact same IIFE-wrap pattern that DD-50.7 added for `if` would apply to `try`.

---

## D-3 — Class B's intentional-error doc blocks: framework supports the fix

**Doc source (layer 1):** `docs/guides/17-template-and-i18n.md` blocks 8-13 — these are explicit "what does the error look like" examples with `;; ERROR:` comments:

```lykn
(template "Hello, {name}!")
;; ERROR: template: no binding for slot {name}
;;   hint: add :name <value> to the template call
```

Six such blocks (the Class B entries from Phase 1a).

**Doc source (layer 2):** No DD-level guidance.

**Compiler-as-built:** Compiles each block as a real lykn program; the templates throw compile-time errors as designed. Compiler behavior is correct.

**Doctest framework as built:** `crates/lykn-cli/src/doctest.rs:18-31` defines an `Annotation` enum that **already includes `CompileFail`**:

```rust
pub enum Annotation {
    Compile,         // default for bare ```lykn
    Run,
    CompileFail,     // <-- exactly what we need
    Skip,
    Fragment,
    Continue,
}
```

Parsed at line 47-56. Activated by the fence syntax `​```lykn,compile-fail`.

The Class B blocks today use bare `​```lykn` fences. They're being run under the `Compile` annotation (the default) and failing because the compiler — correctly — refuses to compile invalid ICU templates.

**Divergence type:** **Doc annotation gap.** The framework already does the right thing; the docs just haven't used the annotation.

**Resolution direction:** Doc-side fix only. Change each Class B fence from `​```lykn` to `​```lykn,compile-fail`. Zero compiler change; zero framework change; six single-line edits across 17-template-and-i18n.md. Phase 1a's options α/β/γ/δ collapse to just option α — but easier than α was framed there, because the annotation isn't a new fence type; it's an existing annotation.

This is the cleanest divergence in the set. **Recommend including as part of Phase 1b's minimal fix.**

---

## D-4 — DD-50.6 Q4 cross-compiler invariant is broken at the data level

**Doc source (layer 2):** `docs/dev/0016-dd-50.6-implementation-prompt-for-cc.md:21-24`:

> Q4: A — Statement-form list maintained as constants in two locations (`STATEMENT_FORM_HEADS` in `forms.rs`, JS-side equivalent in `surface.js`), with `compile-both` cross-compiler tests gating list drift.

The DD-50.6 prompt's *pseudocode example* for the JS-side list (line 271-277) **explicitly lists `"fn"` and `"func"`**. So Q4's intent was: both lists should be identical; both should contain `fn` (the prompt's example shows this). The intent was then that compile-then-check would mean `fn` in the list is *defensive* — it wouldn't matter, because by the time the check runs the form has been expanded to `=>`.

**Compiler-as-built:** Lists are not identical.

| Form | Rust `STATEMENT_FORM_HEADS` | JS `STATEMENT_ONLY_HEADS` |
|---|---|---|
| `if`/`throw`/`return`/`break`/`continue` | yes | no |
| `fn` | **no** | yes |
| (other 19 entries) | yes | yes |

**Divergence type:** **Implementation drift against design.** Both compilers drifted from the DD-50.6 prompt's literal pseudocode example, in opposite directions:
- Rust *removed* `fn` from its list (or never added it, because DD-50.6 said "reuse the existing DD-50.5 list" — and the DD-50.5 list never had `fn`). Because Rust correctly implements Q3=C, removing `fn` is harmless.
- JS *kept* `fn` in its list. Because JS does NOT implement Q3=C correctly (D-1), keeping `fn` matters and is the actual source of A1's failures.

**Why DD-50.6 Q4's compile-both tests didn't catch this:** The cross-compiler test suite at `test/forms/dd-50.6_test.lykn` tests patterns where the SURFACE head matches the KERNEL head (`while → while`, `for → for`, `block → block`). The drift between the lists is only visible on patterns where surface differs from kernel — and the test corpus has no such case.

**Resolution direction:** Phase 3.
- The Q4=A invariant ("two lists kept in sync") is a load-bearing design promise. Either (a) make it actually hold (Duncan's standing direction about separate lists per semantic question maps cleanly here: one canonical source of truth, both impls derive from it), or (b) acknowledge that the invariant is unmaintainable across parallel implementations and pick a different invariant.
- Either way, the test corpus needs at least one cross-impl test that exercises the surface-vs-kernel boundary (e.g., assert `(func f :returns :function :body (fn (:any x) x))` compiles cleanly under both compilers).

---

## D-5 — Q3=C "compile-then-check" not implemented in JS

This is the underlying root cause of D-1 and would have prevented D-4's drift from biting.

**Doc source (layer 2):** DD-50.6 prompt, Deliverable 2 (JS-side fix), explicitly specifies the compile-then-check pattern in pseudocode (line 285-313). The pseudocode names `compileInExpressionCtx(lastExpr, ctx)` as a function the implementation needs to add, and operates the statement check on the **result** of that call.

**Compiler-as-built:** JS-side check operates on the **surface form** (`bodyClause[bodyClause.length - 1]`), not the compiled output. The `compileInExpressionCtx` helper was apparently not added or not threaded through. Whether by oversight or by misinterpretation of "the func macro expansion runs before compile, so checking surface form == checking what gets compiled," the end result is: the JS check is at the wrong layer.

**Divergence type:** **Implementation incomplete against design.** The DD-50.6 prompt's Deliverable 2 was specified clearly; the JS implementation took a shortcut.

**Resolution direction:** Implement compile-then-check on the JS side properly. This is the load-bearing fix for D-1 (factory pattern A1 failures).

But this is **non-trivial.** The JS surface macros run during the macro-expansion phase, before the compiler-proper sees the form. Calling `compileExpr` from inside a macro implies a more layered architecture than `surface.js` currently has — macros call back into the compiler with a partial form. The Rust side has this layering naturally (surface expander → kernel emit → codegen), but the JS side merges surface expansion with macro evaluation.

So implementing Q3=C properly in JS requires either:
- (D-5.α) Restructure JS macro expansion to be a two-phase pipeline (surface → kernel → ESTree), so the func macro can inspect the kernel result.
- (D-5.β) Take a heuristic shortcut: the surface forms that produce value-typed kernel forms are a small known set (`fn`, `lambda`, threading macros that expand to calls, `if-let`/`when-let` which expand to value-bearing `if`, `match` which expands to a value-bearing chain, `obj` which expands to an object literal, `cell` which expands to an object expression, `express` which expands to a method call, etc.). Hard-code the surface-form check: if the head is one of these, skip the statement-only check entirely. This is closer to a curated allowlist than to true compile-then-check.
- (D-5.γ) Move the func/fn macros from JS-side surface expansion into the JS-side compile phase (where compileExpr has been invoked), so the value/statement check naturally lands on the compiled form. Bigger refactor; clean architectural payoff.

D-5.β is the minimal-friction fix; D-5.γ is the most architecturally correct; D-5.α is intermediate. Phase 3 chooses.

---

## D-6 — `ExprContext`-style position awareness present in Rust, absent in JS

Surfaced incidentally in Phase 1c, but it bears on the bigger Phase 3 question.

**Doc source (layer 2):** DD-50 series, especially DD-50.5 and DD-50.7, designed around position-aware compilation. The `ExprContext` enum (`crates/lykn-lang/src/emitter/context.rs:5`) makes position explicit: `Statement` / `Value` / `Tail`. The `KernelChildProfile` mechanism (`forms.rs:2685`) makes "what context does each child get" explicit per form.

**Compiler-as-built (Rust):** Has `ExprContext`, has `KernelChildProfile`, propagates context through the emit pipeline.

**Compiler-as-built (JS):** No `ExprContext` analog. Position-awareness is handled ad-hoc per form (`if` has its own IIFE-vs-ternary path in `compiler.js`; other forms don't propagate context the same way). `wrapReturnLast` is a one-shot "make the last form return" operation; not a propagating context.

**Divergence type:** **Architectural drift.** The two implementations have grown apart at the architecture level. Same source code; same surface; different machinery. The Rust side gained the DD-50 position-awareness machinery; the JS side received the surface-level patches needed to behave similarly *for some patterns* but the underlying machinery is different.

This is the deeper version of D-5. D-5 is about one specific check landing at the wrong layer; D-6 is about the JS implementation lacking the layering that would let it land such a check anywhere.

**Resolution direction (Phase 3 — likely 0.7+ territory):**
- (D-6.α) Port `ExprContext` and `KernelChildProfile` to the JS side. Substantial work; brings parity.
- (D-6.β) Accept JS as the "fast lane" (no position awareness; smaller surface), Rust as the "correct lane." Then JS doctest fails for patterns that *only* work in the position-aware world become "use the Rust binary to test these blocks." But that destroys the parallel-implementation guarantee that AGENTS.md asserts.
- (D-6.γ) **Deprecate the JS compiler entirely.** The Rust binary is the production compiler; JS exists for bootstrapping. Once we're cross-compiling lykn with itself (DD-54 + downstream), the JS implementation can be retired. Position-awareness drift becomes a non-issue.

D-6.γ is the long-term direction but unrealistic for 0.6.x.

---

## D-7 — `assets/ai/SKILL.md` divergence (not yet audited)

The lykn-language-guidelines skill teaches AI agents how to write idiomatic lykn. It is a third doc surface that might or might not align with both the docs/guides and the compiler.

**Not yet audited in this pass.** Worth a separate read if any of these divergences move toward Phase 3 resolution.

Quick check needed: does the skill teach the factory pattern from D-1? Does it teach `try`-as-expression from D-2? If the skill says one thing and the docs/guides say another, that's another fix surface.

---

## D-8 — The Lykn book is not in this repo

`workbench/book-drift-inventory-0.6.0.md` documents a separate inventory of book drift, owned in the `~/lab/cnbb/lykn` repo. This Phase 2 catalog cannot audit the book directly because the book repo isn't in the connected folders.

If Phase 3 decisions affect documented patterns (especially D-1 factory pattern and D-2 try-as-expression), the book repo needs a follow-up audit. The book-drift-inventory thread has its own iteration cadence; coordinating with that thread is a Phase 3+ concern.

---

## Summary matrix

| Divergence | Doc layer | Compiler-as-built | Type | Fix scope |
|---|---|---|---|---|
| **D-1** Factory `(fn …)` body in `:returns :function` | guides + DD-50.6 Q3 | Rust ✓ / JS ✗ | JS compiler bug | JS only |
| **D-2** `try`-as-expression in `:returns :T` body | guides | Both reject | Doc-vs-design disagreement | Both compilers OR docs |
| **D-3** Intentional-error ICU template blocks | guides | Framework rejects (correctly) | Doc annotation gap | Docs only |
| **D-4** Two lists not in sync (DD-50.6 Q4 broken) | DD-50.6 prompt | Drift | Implementation drift | Both compilers + tests |
| **D-5** Q3=C compile-then-check not in JS | DD-50.6 Deliverable 2 | JS ✗ | Implementation incomplete | JS architecture |
| **D-6** Position-aware compilation only in Rust | DD-50 series | Architectural drift | Implementations diverged | Long-term (0.7+) |
| **D-7** `assets/ai/SKILL.md` alignment | skill | not audited | unknown | follow-up needed |
| **D-8** Book repo divergence | external | not audited | unknown | external repo |

D-1, D-3, D-4 (and D-5 as the underlying cause of D-1) are in scope for the current Phase 1b minimal fix. D-2 requires a Phase 3 design call. D-6 is architectural territory for 0.7+. D-7 is a quick follow-up audit. D-8 is owned by the book thread.

---

## What Phase 1b looks like, given this catalog

If the goal is "make tests pass with minimal changes to non-test code", Phase 1b's clean shape is:

1. **D-3 (Class B): doc-only fix.** Add `,compile-fail` to the 6 intentional-error fences in `17-template-and-i18n.md`. Zero compiler/framework change.
2. **D-1 (Class A1) under Phase 3 = "preserve docs as canonical":** D-5.β JS-side fix — heuristic shortcut. Remove `"fn"` from `STATEMENT_ONLY_HEADS` (since `fn` always expands to `=>`, a value-producing kernel form, it's wrong as data — and Rust already excludes it). This single-line change closes A1. Then also implement D-5's broader fix in a follow-up.
3. **D-2 (Class A2):** Holds for Phase 3 design call. The docs cannot be made minimally-correct without a compiler change; the simplest test-side change does not exist for this pattern.

Outcome: ~12 of 14 failing tests resolved with minimal change; 2 (the `try-parse-json` / `valid-json?` pair) held pending Phase 3.

---

## What Phase 3 needs to decide

Two language-design calls, in priority order:

1. **D-2: Should `try` be value-producing in expression position?** This is a real language-design question. Today's compiler says no (both impls); today's docs say yes. Decision determines whether 03-error-handling ID-12 patterns work or need to be removed/rewritten. Recommend D-2.γ (position-aware IIFE-wrap, mirror DD-50.7's `if` treatment) if "yes."

2. **D-5 + D-4 + (eventually) D-6: how does the JS compiler maintain parity with Rust?** Three sub-decisions:
   - For 0.6.x: D-5.β minimal fix to JS (heuristic surface-form allowlist) plus a cross-compiler test that exercises the surface-vs-kernel boundary.
   - For 0.7+: D-6 — port position-awareness machinery to JS, or commit to phasing out the JS compiler.
   - For both: D-4 — make Q4=A actually-maintained (single source of truth for the lists, or eliminate the lists in favor of structural checks on emitted forms).

Plus Duncan's standing direction (the Phase 1c framing): split classifications by semantic use. That direction maps cleanly onto D-4's resolution.

---

## What this Phase doesn't cover

- D-7: `assets/ai/SKILL.md` audit. Quick read should follow.
- D-8: Lykn book audit. Owned by the book-drift-inventory thread.
- The compiler-as-built's correctness *outside* the form-classification machinery — Phase 1c sampled, didn't exhaustively cover. Anything that *isn't* exercising these specific failing patterns might still be wrong elsewhere.
- 0.5.x → 0.6.x changelog: changes that would explain why patterns documented in April 2026 (Duncan's docs) work differently in May 2026 (post-DD-50.6 compiler). This is the temporal "what changed and why" — useful context if Phase 3 wants to understand intent at write-time, but not strictly needed for the divergence catalog.
