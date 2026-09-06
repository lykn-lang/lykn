# Phase 1a — Test-Failure Triage (Post-Rebase)

**Date:** 2026-05-14
**Inputs:** `workbench/cargo-failures.txt`, `workbench/lykn-failures.txt`, `workbench/make-check-failures.txt`
**Methodology context:** Per Duncan's audit framing — gather full failure inventory, classify each as test/doc-side vs compiler-side fix, before committing to a direction.

---

## Top-level summary

| Test suite | Result |
|---|---|
| `cargo test -p lykn-lang` (Rust unit + integration) | **1071 passed, 0 failed** ✓ |
| `lykn build && lykn test` (JS-side regression) | **1286 passed, 0 failed** ✓ |
| `make check` → `test-docs-guides` (doc-tests) | **458 passed, 14 failed** ← all failures here |

**All failures are doc-test failures from `make check`'s `test-docs-guides` target.** No Rust unit tests fail. No JS regression tests fail. The compiler core works; what's failing is the auto-test of code examples embedded in `docs/guides/*.md`.

---

## The 14 failures, classified

### Class A1 — `:returns :function :body (fn ...)` (6 failures)

Function declared with `:returns :function`; body ends with `(fn ...)` form; DD-50.6's Q2=A check rejects.

| # | Test | Source block | Function |
|---|---|---|---|
| 1 | `06-functions-closures.md block 22` | line ~537 | `create-logger` |
| 2 | `06-functions-closures.md block 34` | line ~? | `create-filter` |
| 3 | `07-async-concurrency.md block 31` | line ~580 | `debounce`, `throttle` |
| 4 | `08-performance.md block 23` | line ~444 | `memoize` |
| 5 | `08-performance.md block 24` | line ~469 | `memoize-lru` |
| 6 | `11-documentation.md block 10` | line ~? | `debounce` (alt example) |

**Error shape (representative):**
```
error expanding macro 'func': function `memoize` declared `:returns :function`
but body ends with `fn` (a statement-only form which cannot produce a value).
```

**Pattern:**
```lykn
(func memoize :args (:function f) :returns :function :body
  (bind cache (new Map))
  (fn (:any arg) ...))   ;; body-last
```

**Root cause:** `fn` is in `STATEMENT_FORM_HEADS` (`forms.rs:2567`), so DD-50.6's `is_valueless_last_expr` rejects it. But `fn` is verified at `forms.rs::emit_fn_expr:1228` to ALWAYS emit as an arrow function expression — it's an expression form, never a statement.

**Test-side minimal fix:** restructure to `(bind f (fn ...)) f`:
```lykn
(func memoize :args (:function f) :returns :function :body
  (bind cache (new Map))
  (bind result (fn (:any arg) ...))
  result)
```

**Compiler-side minimal fix:** remove `fn` from `STATEMENT_FORM_HEADS` (both Rust and JS sides).

**Git-blame evidence:** all 6 docs were written by Duncan 2026-04-12 through 2026-04-18, **3–4 weeks before DD-50.6 landed (2026-05-10)**. The patterns are deliberately marked "Good" in the documentation.

**Categorical question:** Is the lykn design intent that returning a `fn` directly from a typed `func` is canonical (compiler fix needed) or that users should always `bind`-first (docs fix needed)?

---

### Class A2 — `:returns :T :body (try ...)` (2 failures)

Function declared with `:returns :T`; body ends with `(try ...)` form; same Q2=A check rejects.

| # | Test | Source block | Function |
|---|---|---|---|
| 7 | `03-error-handling.md block 4` | line ~? | `load-config` (async) |
| 8 | `03-error-handling.md block 13` | line ~339 | `try-parse-json`, `valid-json?` |

**Error shape:**
```
function `valid-json?` declared `:returns :boolean` but body ends with `try`
(a statement-only form which cannot produce a value).
```

**Pattern:**
```lykn
(func try-parse-json :args (:string s) :returns :any :body
  (try (JSON:parse s) (catch undefined)))

(func valid-json? :args (:string s) :returns :boolean :body
  (try (block (JSON:parse s) true) (catch false)))
```

**Root cause:** `try` is in `STATEMENT_FORM_HEADS`. Unlike `fn`, **I have not verified whether the compiler IIFE-wraps `try` in expression position**. Need to check `emit_try` behavior. If `try` doesn't IIFE-wrap, then it really IS statement-only at the JS level, and the docs assume a feature that may not exist.

**Test-side minimal fix:** restructure to assign the try result first:
```lykn
(func try-parse-json :args (:string s) :returns :any :body
  (bind result (try (JSON:parse s) (catch undefined)))
  result)
```

But this only works if `(bind x (try ...))` itself compiles cleanly — which depends on whether `try` produces a value in bind initializer position.

**Compiler-side minimal fix:** depends on whether `emit_try` already wraps. If yes → safe to remove from `STATEMENT_FORM_HEADS`. If no → bigger change (add IIFE-wrap to `emit_try` first).

**Open question for Phase 1c**: does `(bind x (try ...))` compile to valid JS today? Need to check.

**Categorical question:** Is `try-as-expression` part of lykn's design, or are users expected to bind first?

---

### Class B — ICU template "expected error" examples (6 failures)

Doc-test framework runs code blocks that are **intentionally erroneous** — they're teaching examples showing what error messages look like. The framework treats them as "should compile" tests; they throw; tests fail.

| # | Test | Pattern shown | Expected error |
|---|---|---|---|
| 9 | `17-template-and-i18n.md block 8` | `(template "Hello, {name}!")` | missing binding for slot `{name}` |
| 10 | `17-template-and-i18n.md block 9` | `(template "..." :name n :extra v)` | unused keyword argument `:extra` |
| 11 | `17-template-and-i18n.md block 10` | `(template "{a}" :a x :a y)` | duplicate keyword `:a` |
| 12 | `17-template-and-i18n.md block 11` | `(template "{n, plural, one {x}}")` | plural missing `other` branch |
| 13 | `17-template-and-i18n.md block 12` | `(template "{n, plural, =1 {a} one {b} other {c}}")` | overlapping `=1` and `one` |
| 14 | `17-template-and-i18n.md block 13` | `(template "{n, plural, zero {none} other {many}}")` | `zero` not valid under English CLDR |

**Generated-test pattern (broken by framework design):**
```javascript
Deno.test("docs/guides/17-template-and-i18n.md block 13", () => {
  assertEquals(typeof lykn(`(template "{n, plural, zero {none} other {many}}" :n count)
;; ERROR: template: plural category 'zero' is not valid under English plural rules.
;;   hint: use '=0 {none}' for the n=0 case`), "string");
});
```

The block contains a `;; ERROR: ...` comment showing what the failure looks like, but the auto-generated test treats the WHOLE block as code-to-compile.

**Root cause:** doc-test generation framework doesn't recognize "expected to error" code blocks. The error pattern is documented in prose comments but not flagged in any machine-readable way.

**Test-side minimal fix:** depends on what marker the doc-test framework supports. Options:
- **(α)** Change the code fence: `​```lykn-error` or `​```lykn-fails` instead of `​```lykn`, with the framework skipping non-`lykn` fences.
- **(β)** Add a leading directive comment in the block, e.g., `;; @expect-error` at the top, with framework parsing this.
- **(γ)** Restructure: move the error example into prose (backticks rather than a code fence), so it's not auto-tested.
- **(δ)** Wrap the test framework to recognize `;; ERROR:` comments and assert-throws instead of assert-success.

**Compiler-side minimal fix:** none — these are intentional behaviors of the compiler. The compiler is correct; the doc-test framework is missing a feature.

**This class is structurally different from A1/A2 and should be handled separately.**

---

## Summary by class

| Class | Failures | Root cause | Test-side fix shape | Compiler-side fix shape |
|---|---|---|---|---|
| **A1** | 6 | `fn` in `STATEMENT_FORM_HEADS` blocks `:returns :function :body (fn ...)` | `bind`-first then return atom | Remove `fn` from list (1 line each, Rust + JS) |
| **A2** | 2 | `try` in `STATEMENT_FORM_HEADS` blocks `:returns :T :body (try ...)` | `bind`-first IF that works | Depends on `emit_try` IIFE-wrap status |
| **B**  | 6 | Doc-test framework doesn't support "expected-error" blocks | Add marker/restructure docs OR enhance framework | None (compiler is correct) |

---

## Open questions before Phase 1b

These need answers before committing to fixes:

1. **A1 categorical**: Is `(func :returns :function :body (fn ...))` part of the canonical lykn factory pattern (Duncan's April docs say yes; DD-50.6 says no)? Resolution determines test-side vs compiler-side fix.

2. **A2 categorical**: Same question for `(func :returns :T :body (try ...))`. Resolution depends on (a) whether `emit_try` IIFE-wraps, (b) whether the design intent is that `try` produces values.

3. **B framework**: Does the doc-test framework support an "expected to throw" marker? If yes, what is it? If no, is adding one in scope for Phase 1b?

4. **Cross-impact**: If we apply test-side fixes (restructure to `bind`-first) to fix A1/A2, does the result remain idiomatic lykn? Or does it introduce a pattern that looks awkward and gets reverted later?

---

## Recommended Phase 1b sequencing

If the goal is "minimal changes to non-test code":

1. **Verify the doc-test framework's expected-error support** (one quick read of the test-generation logic). If supported → fix all 6 Class B failures with markers. If not → restructure those examples to be non-code-fence (option γ) or extend the framework.

2. **For A1**: Get an explicit Duncan call on the categorical question. If `bind`-first is acceptable as canonical → apply doc-side restructure to all 6. If the factory-with-`fn`-body pattern is load-bearing → 1-line compiler change.

3. **For A2**: Verify `emit_try` IIFE-wrap status. Then categorical call. Same shape as A1.

The good news: **the failures are clean and small**. 14 total failures in 3 clean classes; each class has a uniform root cause. This is much smaller than I'd feared — no long tail, no surprises, no truly mysterious failures.

---

## What this triage DOESN'T do

- Doesn't decide which way to resolve A1/A2 — that's Phase 3 design discussion territory.
- Doesn't audit the broader compiler-as-built behavior (Phase 1c).
- Doesn't compare against the Lykn book (Phase 2).
- Doesn't touch any code yet.

These come next once the categorical questions above have answers.
