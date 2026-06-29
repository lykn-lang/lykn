# Phase 1c — Compiler-as-Built Behavior Audit: Form Classification

**Date:** 2026-05-14
**Scope:** Every "form classification" mechanism in the lykn emitter pipelines (Rust and JS), what it is asked, what answer it gives, where it's wired in.
**Frame:** Duncan's standing direction — *"we're probably going to want to maintain separate lists of forms for different semantic uses … different semantics with different structure keeps code that should be tightly coupled together and prevents weird, unexpected bugs."*

This audit covers what is **shipped**, not what should be. The "what should be" analysis (Phase 2) compares this state against `docs/guides/` and the Lykn book.

---

## Correction to Phase 1a

Phase 1a's classification of Class A1 named the wrong file. The triage said:

> Root cause: `fn` is in `STATEMENT_FORM_HEADS` (`forms.rs:2567`)

That is **not** correct. `fn` is **not** in the Rust list at `crates/lykn-lang/src/emitter/forms.rs:2567` — see verification below. `fn` **is** in the JS list at `packages/lang/surface.js:902-908`. The doc-tests run via `lykn(source)` (JS path), so A1's failure is JS-side.

Net effect: the conceptual analysis in Phase 1a stands (same conflation, same shape of fix) — but the *file* changes for A1 are JS, not Rust. A2 (`try`) is in *both* lists.

---

## Inventory: Rust emitter classification mechanisms

### 1. `STATEMENT_FORM_HEADS` — single list, two semantic uses

`crates/lykn-lang/src/emitter/forms.rs:2567-2571`:

```rust
const STATEMENT_FORM_HEADS: &[&str] = &[
    "if", "while", "for", "for-of", "for-in", "do-while", "switch",
    "throw", "return", "break", "continue",
    "label", "debugger",
    "block", "try", "catch", "finally",
    "var", "const", "let",
    "func", "class", "type", "export", "import",
];
```

25 entries. Two consumers:

#### Consumer A — `is_statement_form` (forms.rs:2573)

**Question asked:** "Does this form, *as emitted JS*, become a statement (vs an expression)?"

**Used by:**
- `emit_if_expression` (forms.rs:2614) — IIFE-vs-ternary decision: if either branch is a statement form, must IIFE-wrap.
- `emit_if_iife` (forms.rs:2626, 2631) — per-branch return-wrap decision: don't wrap statement branches in `(return ...)`.

#### Consumer B — `is_valueless_last_expr` (forms.rs:431)

**Question asked:** "Does this last-expression-of-a-func-body fail to produce a value?"

```rust
fn is_valueless_last_expr(expr: &SExpr) -> bool {
    if let SExpr::List { values, .. } = expr
        && let Some(head) = values.first().and_then(|e| e.as_atom())
    {
        if head == "if" { return values.len() < 4; }            // override A
        if matches!(head, "return"|"throw"|"break"|"continue") { return false; }  // override B
        return STATEMENT_FORM_HEADS.contains(&head);
    }
    false
}
```

Note the two overrides patched onto the shared list:
- **Override A**: `if` is valueless only if it has no else-branch (it IS in the list, but answers differently).
- **Override B**: `return`/`throw`/`break`/`continue` are "in the list" but never count as valueless (they produce no value either, but the func emitter handles them differently — they don't need the Q2=A diagnostic because control transfers away).

**Used by:**
- `emit_fn_expr` (forms.rs:1261) — last-body of `fn`: skip `(return ...)` wrap.
- `emit_func_single` (forms.rs:1342, 1384, 1428) — last-body of `func` with three branches (post/typed-returns/implicit).
- `emit_func_multi` (forms.rs:1554, 1589) — same two checks for multi-clause `func`.

#### Conflation observed

Same list answers two different questions. The patches (Override A for `if`, Override B for control-flow) are evidence that the list-as-data is wrong for one of the consumers. Override B in particular is a smell — it's saying "for this set of heads, the list lies about them, so special-case."

### 2. `kernel_child_profile` — third use of "what kind of form is this"

`crates/lykn-lang/src/emitter/forms.rs:2723`:

A `match head` over form names, returning a `KernelChildProfile` (`AllValue`, `AllParent`, `Positional(...)`, `PositionalThenStatement(...)`). Different vocabulary from `STATEMENT_FORM_HEADS`; controls how children inherit `ExprContext`. Overlap with `STATEMENT_FORM_HEADS`:

| Form | In `STATEMENT_FORM_HEADS`? | `kernel_child_profile` answer |
|---|---|---|
| `block` | yes | `AllParent` |
| `label` | yes | `AllParent` |
| `while` | yes | `Positional([V, S])` |
| `do-while` | yes | `Positional([S, V])` |
| `for` | yes | `Positional([V, V, V, S])` |
| `for-of/in/await-of` | yes | `PositionalThenStatement([S, V])` |
| `try` | yes | `AllParent` |
| `switch` | yes | `PositionalThenStatement([V])` |
| `if` | yes | `Positional([V, S, S])` |
| `const/let/var` | yes | `Positional([S, V])` |
| `function/function*/=>` | not in list | `AllParent` |
| `throw/return` | yes | `AllValue` |
| `break/continue/debugger` | yes | `AllParent` |
| `import/export` | yes | `AllParent` |
| `func/class/type/catch/finally` | yes | (falls through to `AllValue`) |
| `fn` | **not in list** | (falls through to `AllValue`) |

**Smell**: `kernel_child_profile` defaults to `AllValue` for anything unrecognized — but this is at the kernel level (after surface→kernel expansion). Surface forms like `func`/`class`/`type`/`fn` shouldn't reach this function with those names in the first place. If they do, the fallthrough is wrong. Worth verifying separately whether they ever do.

### 3. `ExprContext` — the actual context enum

`crates/lykn-lang/src/emitter/context.rs:5`:

```rust
pub enum ExprContext {
    Statement,  // Value unused
    Value,      // Value used
    Tail,       // Last expression in func body with :returns
}
```

This is the per-expression context flag, not a form classification. It is what `kernel_child_profile` decides for each child.

### 4. `is_kernel_form` / `is_surface_form` — disjoint sets

`crates/lykn-lang/src/classifier/dispatch.rs:1-37` and `:39-130`:

`is_surface_form` (~30 heads): `func`, `genfunc`, `bind`, `match`, `type`, `obj`, `cell`, `fn`, `lambda`, threading macros, `if-let`, `when-let`, etc.

`is_kernel_form` (~80+ heads): `const`, `let`, `var`, `function`, `function*`, `=>`, `if`, `block`, `return`, `throw`, `try`, `while`, etc. plus all arithmetic/comparison operators, JS keywords (`new`, `delete`, `typeof`), and `seq`.

These two answer "which pipeline owns this form's expansion?" — a different question from value-producing-ness. Note that `fn` is a surface form whose kernel expansion is `=>`. `try` is a kernel form, not surface-expanded further.

---

## Inventory: JS expander classification mechanisms

### 5. `STATEMENT_ONLY_HEADS` — JS counterpart to Rust's list

`packages/lang/surface.js:902-908`:

```javascript
const STATEMENT_ONLY_HEADS = [
    "while", "for", "for-of", "for-in", "do-while", "switch",
    "label", "debugger",
    "block", "try", "catch", "finally",
    "var", "const", "let",
    "func", "fn", "class", "type", "export", "import",
];
```

24 entries — **differs from Rust list by 5 entries**:

| Form | Rust `STATEMENT_FORM_HEADS` | JS `STATEMENT_ONLY_HEADS` |
|---|---|---|
| `if` | yes (with override) | special-case in `isStatementOnlyForm` |
| `throw` | yes | **no** |
| `return` | yes (with override) | **no** |
| `break` | yes (with override) | **no** |
| `continue` | yes (with override) | **no** |
| `fn` | **no** | **yes** ← the A1 bug source |

The pattern: JS list has tighter scope (excludes control-flow heads, which Rust handles via Override B); but JS list includes `fn` (which Rust excludes entirely).

### 6. `isStatementOnlyForm` — JS counterpart to Rust's `is_valueless_last_expr` and `is_statement_form` (merged)

`packages/lang/surface.js:910`:

```javascript
function isStatementOnlyForm(expr) {
    if (!isArray(expr) || expr.values.length === 0) return false;
    const head = expr.values[0];
    if (!head || head.type !== "atom") return false;
    const name = head.value;
    if (name === "if") return expr.values.length < 4;
    return STATEMENT_ONLY_HEADS.includes(name);
}
```

Used by:
- `wrapReturnLast` (line 924) — skip `(return ...)` wrap for statement-only last expressions.
- `func` macro `:returns` check, hasPost branch (line 1775) — emit Q2=A error.
- `func` macro `:returns` check, no-post branch (line 1831) — emit Q2=A error.

Note: JS *merges* the two semantic uses Rust splits. The Rust split (`is_statement_form` vs `is_valueless_last_expr`) was introduced in DD-50.6/.7; the JS side never grew the split.

### 7. JS-side ExprContext analog?

I did not find a JS equivalent of Rust's `ExprContext` enum. The JS path appears to do less context-aware expansion — `wrapReturnLast` is a one-shot "wrap the last body expression" pattern, not a per-position propagating context. This is itself a divergence between the two implementations worth flagging.

---

## The actual `fn` and `try` shipped behaviors

### `fn` — surface form

**JS path** (`packages/lang/surface.js:1407-1437`):
- Macro expands `(fn (params) body...)` → `(=> (params) <type-checks> body...)`
- Resulting kernel form is `=>` which the JS compiler emits as `ArrowFunctionExpression`
- Conclusion: `fn`-as-last-body always produces a value when compiled. **JS's inclusion of `fn` in `STATEMENT_ONLY_HEADS` is wrong as data.**

**Rust path** (`crates/lykn-lang/src/emitter/forms.rs:1228` — `emit_fn_expr`):
- Surface `fn` is emitted via `emit_fn_expr` which always produces an arrow function expression form
- The output is `(=> ...)`
- Conclusion: `fn`-as-last-body always produces a value. **Rust's exclusion of `fn` from `STATEMENT_FORM_HEADS` is correct.**

### `try` — kernel form

**JS path** (`packages/lang/compiler.js:1029-1081`):
- `try` compiles to `TryStatement` — a JS statement node, not an expression.
- No IIFE-wrap path. `try` is **genuinely statement-only** in shipped JS.

**Rust path** (`crates/lykn-lang/src/codegen/emit.rs:828-893`):
- `emit_try` writes raw `try { ... } catch { ... }` JS — a statement.
- No IIFE-wrap path. `try` is **genuinely statement-only** in shipped Rust.

Conclusion: A2's open question from Phase 1a is answered. Both implementations treat `try` as statement-only at the JS layer. The docs (`03-error-handling.md`) that end function bodies in `(try ...)` assume a feature **that the compiler does not implement**. The test-side restructure `(bind result (try ...))` will fail equivalently — `bind`'s initializer position requires a value.

So for A2:
- Doc-side fix alone is not viable (no idiomatic restructure exists without changing the compiler).
- Compiler-side fix is: add IIFE-wrap for `try` in expression/Tail position. Then remove `try` from `STATEMENT_ONLY_HEADS`/`STATEMENT_FORM_HEADS`.
- Both sides need the change.

---

## The conflation, named

The shipped Rust code uses **one list** for **two distinct semantic questions**:

1. **"Is this form a JS statement after emission?"** — used by `is_statement_form` for `if`-expression's IIFE-vs-ternary and per-branch return-wrap.
2. **"Can this form, as the last body expression of a function with `:returns :T`, produce a value?"** — used by `is_valueless_last_expr` for the DD-50.6 Q2=A diagnostic.

These overlap heavily but are **not the same set**:

| Form | Q1: emitted as JS statement? | Q2: can produce a value as last-body? |
|---|---|---|
| `if` (no-else) | yes | **no** (no else → undefined) |
| `if` (with else) | depends on branches | **yes** (ternary or IIFE) |
| `return`/`throw` | yes | (n/a — control transfers) |
| `break`/`continue` | yes | (n/a — control transfers) |
| `try` | yes | **no** (statement only) |
| `block` | yes (kernel) | **no** (no value channel) |
| `while`/`for`/`switch` | yes | **no** |
| `var`/`const`/`let` | yes | **no** (binding declaration) |
| `func`/`class`/`type` | yes (declaration) | **no** |
| `fn` | **no** (arrow expression) | **yes** (factory pattern) |
| `=>` (post-expand) | **no** | **yes** |

The Override B patch (`return/throw/break/continue` → "in the list but answer no for Q2") is the in-band evidence the conflation has cost. Override A (`if` length check) is another. Both are symptoms of a single-data-source serving two questions.

**JS side has the same conflation, with a different list and different patches.** JS handles `if` via the special-case in `isStatementOnlyForm`. JS doesn't patch out control-flow heads — they're just not in the list.

---

## Cross-implementation divergence

The Rust and JS implementations have **independent classification lists** with **divergent contents**. Specifically:

- Rust `STATEMENT_FORM_HEADS` includes `if`/`throw`/`return`/`break`/`continue`; JS `STATEMENT_ONLY_HEADS` does not.
- JS `STATEMENT_ONLY_HEADS` includes `fn`; Rust `STATEMENT_FORM_HEADS` does not.
- Rust splits the question into `is_statement_form` (for `if`-expression) and `is_valueless_last_expr` (for `func` Q2=A); JS merges them into `isStatementOnlyForm`.

Net visible behavior:
- A `(func ... :returns :T :body (fn ...))` compiles cleanly under Rust but fails under JS Q2=A. This is **why the doc-tests (JS path) fail while `cargo test` (Rust path) passes**.
- A `(func ... :returns :T :body (try ...))` fails under both — consistent.

This is a divergence-of-truth. Same surface code; different compilers; different answers; different errors. Per CLAUDE.md the JS reader and Rust reader are "parallel implementations of the same S-expression grammar" — but the expanders have grown apart at the *surface macro* layer.

---

## Recommendation surface (input to Phase 3)

Duncan's standing direction is to split classifications by semantic use. Applied here, the shape is:

### Split 1 — One question per list

Replace each side's single list with **at least three** explicit lists:

| Proposed list | Semantic question | Membership criterion |
|---|---|---|
| `EMITS_AS_JS_STATEMENT` | After full expansion, does this form's JS output sit at statement granularity (vs being an expression)? | Look at the codegen: `TryStatement`/`IfStatement`/`WhileStatement`/`BlockStatement`/declaration-nodes/etc. → yes. `ArrowFunctionExpression`/`CallExpression`/`?:`/operators → no. |
| `CONTROL_TRANSFER_FORMS` | Does this form transfer control away (so neighbors below are unreachable; "value-producing-ness" is moot)? | `return`, `throw`, `break`, `continue`. |
| `PRODUCES_VALUE_AS_LAST_BODY_EXPR` | When this form appears as the last expression of a function body, does it have a value channel the caller can use? | `if`-with-else (yes), `if`-no-else (no), `fn` (yes), `try` (no — today; could change), `block` (no — today; could change), atoms (yes), expression calls (yes), control-transfer (n/a), declarations (no). |

The Q2=A diagnostic key on `not (PRODUCES_VALUE_AS_LAST_BODY_EXPR ∪ CONTROL_TRANSFER_FORMS)`. The IIFE-vs-ternary decision keys on `EMITS_AS_JS_STATEMENT`. These are different sets; encoding them as different lists makes the difference auditable.

### Split 2 — One source of truth across implementations

The two parallel impls should not maintain divergent answers to the same question. Options:

- **A.** Generate both sides' lists from a single source (e.g., a `forms.toml` declaring each form's semantic flags, with codegen for both).
- **B.** Have one side be canonical and write a conformance test that diffs the lists at build time.
- **C.** Promote the classifications to test fixtures: a single ledger of (form, question, answer) tuples that both sides' unit tests assert against.

Option C has lowest cost and is in-line with the LEDGER_DISCIPLINE methodology. A would be cleanest but adds tooling weight.

### Split 3 — `fn` and `try` calls

- `fn` → remove from JS `STATEMENT_ONLY_HEADS`. JS's `wrapReturnLast` and Q2=A check would then pass `(func ... :returns :T :body (fn ...))`. **This is the minimal A1 fix on the JS side and brings JS in line with Rust.**
- `try` → genuinely statement-only in both impls *today*. Either:
  - **(γ)** Restructure the docs to not end function bodies in `(try ...)`. Idiomatic doc rewrites exist; e.g., `(bind result (try ...))` *won't work*, but moving the try result through an intermediate variable assigned via an IIFE or restructuring the function so try wraps the whole body (statement-level) does.
  - **(δ)** Implement value-producing `try` (IIFE-wrap at expression/Tail position, in both Rust and JS), then remove `try` from both lists. **Bigger change but answers Phase 2's "is `try`-as-expression supposed to exist?" question.**

A2's Phase 3 decision rides on whether lykn's design intent treats `try` as value-producing. The docs say yes (Duncan wrote them); the compiler says no (both impls). Something has to give.

---

## What this audit DOESN'T cover (yet)

- **Phase 2 (next):** compare these classifications to what `docs/guides/*` and the Lykn book say should be true. The "compiler-as-built" picture above is one side of the divergence catalog; the docs are the other side.
- The kernel-vs-surface boundary is touched on (Sections 4 and 5) but a full audit of which kernel forms can appear in expression position vs which must be statements is not done. Could be a Phase 1d if needed.
- The `kernel_child_profile` fallthrough-to-`AllValue` smell (Section 2): not verified whether surface forms ever reach this function with their surface names; worth a separate check.
- ESTree-level emit (Rust `codegen/emit.rs`) was sampled (`emit_try`) but not exhaustively walked.
- The JS compiler's compilation phase (`packages/lang/compiler.js`) was sampled (`'try'`) but not exhaustively walked. JS-side `if`-as-expression handling, in particular, has not been audited.

---

## Summary

| Mechanism | File:line | Question it answers | Conflation? |
|---|---|---|---|
| Rust `STATEMENT_FORM_HEADS` | forms.rs:2567 | (used for two questions) | **yes** |
| Rust `is_statement_form` | forms.rs:2573 | Q1: emits-as-statement? | (uses shared list) |
| Rust `is_valueless_last_expr` | forms.rs:431 | Q2: valueless-as-last-body? | (uses shared list + 2 overrides) |
| Rust `kernel_child_profile` | forms.rs:2723 | Q3: child-context inheritance? | separate vocabulary |
| Rust `ExprContext` | context.rs:5 | per-position context flag | not a form list |
| Rust `is_kernel_form`/`is_surface_form` | classifier/dispatch.rs:1,39 | Q4: pipeline ownership | separate vocabulary |
| JS `STATEMENT_ONLY_HEADS` | surface.js:902 | (used for two questions, no override) | **yes** |
| JS `isStatementOnlyForm` | surface.js:910 | Q1+Q2 merged | (uses shared list) |

The shipped state is: **two implementations, each conflating two questions onto a single list, with divergent list contents that produce divergent answers for the same source code.** The doc-test failures are the JS path of this divergence surfacing.

Phase 2 next: divergence catalog against docs/guides + Lykn book.
