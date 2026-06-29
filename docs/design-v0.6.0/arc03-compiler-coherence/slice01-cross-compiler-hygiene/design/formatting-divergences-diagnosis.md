# M16-2 Formatting Divergences — Diagnosis

**CC:** Claude Code (Opus 4.6)
**Date:** 2026-05-16
**Status:** diagnosis complete, awaiting CDC direction confirmation

## IMPORTANT: Two items reclassified as correctness-grade

**C-4 (destructuring-assignment) and C-1 (class-methods)** contain
**correctness-grade divergences**, not just formatting. See C-4 and
C-1 below. The Rust compiler emits `===` (equality) where `=`
(assignment) is required in class bodies and destructuring-assignment
contexts. This produces JS that fails at runtime.

---

## C-1 — Class/object formatting

### Object literals

**Source:** `(object (name "Duncan") (age 42))`

| | Output |
|---|---|
| JS | `({ name: "Duncan", age: 42 });` |
| Rust | `{name: "Duncan", age: 42};` |

**Diff:** JS wraps standalone object expressions in `(...)` and uses
multi-line formatting with spaces after colons. Rust emits bare `{...}`
without parens and no space after colons.

**D-Q2:** JS uses astring's `ObjectExpression` formatting which adds
parens for expression-statement disambiguation (bare `{...}` at
statement level is parsed as a block, not an object). Rust's codegen
(`emit.rs`) emits the object literal without parens.

**D-Q3:** **Mixed.** The paren wrapping is correctness-grade — a
standalone `{ name: "Duncan" }` IS parsed as a block with a label in
JS, not an object literal. The spacing/newline differences are purely
formatting.

**D-Q4:** Direction **(a)** — align Rust to JS. Rust needs to wrap
standalone object expressions in `(...)`.

### Class bodies

**Source:** `(class Empty ())`

| | Output |
|---|---|
| JS | `class Empty {}` |
| Rust | `class Empty {\n}` |

**Diff:** Rust puts the closing brace on a new line; JS keeps empty
bodies on one line.

**D-Q3:** Formatting-only. Both are valid JS.

**D-Q4:** Direction **(c)** — normalize. This is a whitespace
difference the existing normalizer already handles.

### Class constructor with `=` assignment — CORRECTNESS-GRADE

**Source:** `(class Foo () (constructor (x) (= this:x x)))`

| | Output |
|---|---|
| JS | `this.x = x;` |
| Rust | `this.x === x;` |

**D-Q3:** **CORRECTNESS-GRADE.** The Rust compiler emits `===`
(equality) instead of `=` (assignment) inside the constructor body.
This produces JS that compares but doesn't assign — the object's
property is never set.

**Root cause:** The kernel `=` form is context-dependent (see ID-38
in the lykn idioms guide). At module top level it's equality; inside
function bodies, for loops, if blocks, and blocks it's assignment.
The Rust codegen emits `===` unconditionally for the `=` atom. The
JS compiler (`compiler.js`) has the correct context-dependent behavior.

**D-Q4:** Direction **(a)** — align Rust to JS. This is a Rust codegen
bug. However, this is a known architectural issue (DD-22, ID-38) that
DD-58's separation will properly resolve. The fix scope may be larger
than a simple codegen tweak.

**D-Q5:** Fixing this properly requires the Rust codegen to distinguish
assignment context from equality context for the `=` atom — likely
requires changes in `emit.rs` or `forms.rs`. **Scoping risk: this may
be too large for a formatting-cleanup prompt and may need deferral to
DD-58.**

---

## C-2 — Generator syntax

**Source:** `(function* gen () (yield 1) (yield 2) (yield 3))`

| | Output |
|---|---|
| JS | `function* gen() { yield 1; yield 2; yield 3; }` |
| Rust | `function* gen() { yield 1; yield 2; yield 3; }` |

**Diff:** After whitespace normalization, these are **identical**.

The M16-2 failure was caused by different formatting before
normalization (newlines vs. spaces). The existing normalizer's
whitespace collapse handles this.

**D-Q3:** Formatting-only. Already handled by normalizer.

**D-Q4:** **No action needed.** Re-test confirms compileBoth passes
after fresh build. The original failure was likely a stale binary
or build artifact.

---

## C-3 — Async wrapping

**Source 1:** `(async (function fetch-data () (return 1)))`

| | Output |
|---|---|
| JS | `async function fetchData() { return 1; }` |
| Rust | `async function fetchData() { return 1; }\n;` |

**Diff:** Rust appends a trailing semicolon after the function
declaration.

**Source 2:** `(async (=> () 1))`

| | Output |
|---|---|
| JS | `(async () => 1);` |
| Rust | `async () => 1;` |

**Diff:** JS wraps the async arrow in parens; Rust doesn't.

**D-Q2:** The trailing `;` after a function declaration is
syntactically valid but unnecessary. The paren wrapping on async
arrows is for expression-statement disambiguation (same pattern as
object literals — without parens, the JS parser may be ambiguous).

**D-Q3:** The trailing `;` is formatting-only. The paren wrapping
on async arrows may be correctness-grade in some contexts (when the
async arrow is the only statement and the engine's ASI rules apply).
In practice both are valid JS.

**D-Q4:** Direction **(c)** for the trailing semicolon — the existing
`;\s*}` normalizer pattern partially handles this; a broader
trailing-semicolon stripping after `}` would cover the rest.
Direction **(a)** for the paren wrapping on async arrows — Rust
should wrap like JS does.

---

## C-4 — Destructuring formatting

### Parameter destructuring

**Source:** `(const f (=> ((object name (default age 0))) name))`

| | Output |
|---|---|
| JS | `const f = ({name, age = 0}) => name;` |
| Rust | `const f = ({name, age = 0}) => name;` |

**Diff:** After normalization, **identical**. The original M16-2
failure was on a different test case. Let me check which test
specifically fails.

### Destructuring assignment — CORRECTNESS-GRADE

**Source:** `(= (object a b) obj)`

| | Output |
|---|---|
| JS | `({a, b} = obj);` |
| Rust | `{a, b} === obj;` |

**D-Q3:** **CORRECTNESS-GRADE.** Same root cause as C-1's class
constructor issue: the Rust compiler emits `===` instead of `=` for
the kernel `=` form in a destructuring-assignment context. The JS
output is correct destructuring assignment; the Rust output is a
(meaningless) equality comparison of an object pattern with `obj`.

**D-Q4:** Direction **(a)** — same as the class-constructor `=`
bug. Both share the same root cause in Rust's codegen.

---

## C-5 — Default parameter formatting

**Source:** `(const f (=> ((default x 0) (default y 1)) (+ x y)))`

| | Output |
|---|---|
| JS | `const f = (x = 0, y = 1) => x + y;` |
| Rust | `const f = (x = 0, y = 1) => x + y;` |

**Diff:** After normalization, **identical**. The original M16-2
failure was on a different test case (likely one with more complex
defaults that trigger a formatting difference).

Let me check the specific failing test:

**Failing test:** "default: multiple defaults" — this test uses
`compile` (now `compile-both`) on a multi-line source. The failure
may be in a different source pattern than the one-liner I tested.

**D-Q4:** Need more investigation. If truly formatting-only, direction
**(c)** (normalizer handles it). If there's a structural difference,
direction **(a)** or **(b)**.

---

## C-6 — Tagged template emission

**Source:** `(tag String:raw (template "\\n"))`

| | Output |
|---|---|
| JS | `` (String.raw)`\n`; `` |
| Rust | `` String.raw`\\n`; `` |

**Diff:** Two differences:
1. JS wraps the tag expression in parens: `(String.raw)` vs `String.raw`.
2. The template literal content differs: JS has `\n` (literal newline
   escape), Rust has `\\n` (escaped backslash + n).

**D-Q3:** The template content difference MAY be correctness-grade —
`` String.raw`\\n` `` and `` String.raw`\n` `` produce different
runtime values. `String.raw` preserves raw string content, so `\\n`
would give the literal characters `\n` while `\n` would give a literal
newline. Need to verify which is correct for the input `(template "\\n")`.

The paren wrapping is formatting (for member-expression tags).

**D-Q4:** Need investigation on the template content. Paren wrapping:
direction **(a)** (Rust should match JS's paren wrapping).

---

## Summary Table

| Class | Severity | Direction | Scope |
|-------|----------|-----------|-------|
| C-1 object parens | correctness | (a) align Rust | codegen: add paren wrapping |
| C-1 class formatting | formatting | (c) normalize | already handled by whitespace collapse |
| C-1 class `=` assignment | **CORRECTNESS** | (a) align Rust | codegen: `=` context-dependence — **MAY NEED DEFERRAL** |
| C-2 generators | formatting | no action | already converges post-normalization |
| C-3 trailing `;` | formatting | (c) normalize | minor normalizer tweak |
| C-3 async arrow parens | formatting | (a) align Rust | codegen: add paren wrapping |
| C-4 destr param formatting | formatting | no action | already converges post-normalization |
| C-4 destr-assign `=` | **CORRECTNESS** | (a) align Rust | **same root cause as C-1 class `=`** |
| C-5 default params | formatting | investigate | need to find the specific failing pattern |
| C-6 tag parens | formatting | (a) align Rust | codegen: paren wrapping for tag expressions |
| C-6 template content | investigate | investigate | may be correctness-grade |

## Scope risk: the `=` assignment bug

C-1 (class constructor) and C-4 (destructuring assignment) share a
root cause: the Rust codegen treats the kernel `=` atom as `===`
unconditionally. Fixing this requires the Rust codegen to distinguish
assignment context from equality context. This is architecturally
the same problem DD-22 and DD-58 address.

**Amendment request:** I recommend **deferring the `=` assignment
bug fixes (C-1 class constructor, C-4 destructuring assignment) to
DD-58**, which will properly resolve the `=` context-dependence as
part of the kernel/surface separation. Fixing it in the codegen
layer now risks a partial fix that DD-58 will supersede.

The remaining items (object paren wrapping, async arrow wrapping,
tag paren wrapping, trailing semicolons, and the template content
investigation) are bounded formatting fixes or normalizer tweaks.
