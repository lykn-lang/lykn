---
number: 33
title: "DD-24: `bind` Type Enforcement"
author: "the surface"
component: All
tags: [change-me]
created: 2026-04-14
updated: 2026-04-14
state: Final
supersedes: null
superseded-by: null
version: 1.0
---

# DD-24: `bind` Type Enforcement

**Status**: Decided
**Date**: 2026-04-13
**Amends**: DD-15 (Language Architecture)
**Release**: v0.4.0

## Summary

`bind` type annotations generate runtime type checks, matching the
behavior of `func` and `fn`. `(bind :number x (compute))` emits a
`typeof` check on the value. Type-compatible literals skip the runtime
check (compile-time verified). Type-incompatible literals are compile
errors. Checks are stripped by `--strip-assertions`. The linter warns
on non-literal `bind` without a type annotation.

This closes the asymmetry where `func` enforces types at runtime but
`bind` silently discards them.

## Problem

In v0.3.0, `bind` type annotations are documentation-only:

```lykn
(bind :number x (compute))
```

```js
// v0.3.0 — annotation silently discarded
const x = compute();
```

Meanwhile, `func` generates full runtime checks:

```lykn
(func f :args (:number x) :body x)
```

```js
function f(x) {
  if (typeof x !== "number" || Number.isNaN(x))
    throw new TypeError("f: arg 'x' expected number, got " + typeof x);
  return x;
}
```

There is no principled reason for this asymmetry. If a developer
writes `:number`, the compiler should enforce it. The current behavior
silently discards type information, giving a false sense of safety.
Guide 00 documented this as a caveat ("bind annotations are
documentation-only"); this DD eliminates the caveat.

## Decisions

### 1. Annotated `bind` with non-literal initializer generates a runtime check

**Decision**: When `bind` has a type annotation and the initializer is
a non-literal expression, the compiler emits a runtime type check
after the `const` declaration.

**Syntax**:

```lisp
(bind :number x (compute))
```

```javascript
const x = compute();
if (typeof x !== "number" || Number.isNaN(x))
  throw new TypeError("bind 'x': expected number, got " + typeof x);
```

```lisp
(bind :array items (get-items))
```

```javascript
const items = getItems();
if (!Array.isArray(items))
  throw new TypeError("bind 'items': expected array, got " + typeof items);
```

```lisp
(bind :string name (user:get-name))
```

```javascript
const name = user.getName();
if (typeof name !== "string")
  throw new TypeError("bind 'name': expected string, got " + typeof name);
```

**ESTree nodes**: `VariableDeclaration` (`const`) followed by
`IfStatement` with `ThrowStatement`.

**Rationale**: This matches the check pattern that `func` already
generates for parameter types. The same type keywords produce the
same runtime checks. Developers who annotate `bind` expect
enforcement — silent discard is a bug, not a feature.

### 2. Type-compatible literals skip the runtime check

**Decision**: When the initializer is a literal whose type the
compiler can statically verify, no runtime check is emitted.

**Syntax**:

```lisp
(bind :number MAX-RETRIES 3)
```

```javascript
// No check needed — 3 is statically a number
const MAX_RETRIES = 3;
```

```lisp
(bind :string GREETING "hello")
```

```javascript
// No check needed — "hello" is statically a string
const GREETING = "hello";
```

```lisp
(bind :boolean VERBOSE true)
```

```javascript
// No check needed — true is statically a boolean
const VERBOSE = true;
```

```lisp
(bind :array EMPTY #a())
```

```javascript
// No check needed — #a() is statically an array
const EMPTY = [];
```

**Statically verifiable types**:

| Literal form | Type |
|---|---|
| Number literal (`42`, `3.14`) | `:number` |
| String literal (`"hello"`) | `:string` |
| `true` / `false` | `:boolean` |
| `#a(...)` | `:array` |
| `(obj ...)` / `#o(...)` | `:object` |
| `null` | No type matches (always needs check or is an error) |

**Rationale**: Emitting `if (typeof 3 !== "number")` is wasteful and
clutters the compiled output. The compiler can see the type at compile
time. `--strip-assertions` would remove it anyway, but skipping it
entirely keeps development builds clean for the common case of named
constants.

### 3. Type-incompatible literals are compile errors

**Decision**: When the initializer is a literal whose type the
compiler can statically determine does NOT match the annotation,
the compiler emits a compile error (not a runtime error).

**Syntax**:

```lisp
(bind :number name "hello")
```

```
Error: bind 'name': type annotation is :number but initializer is a
string literal. Remove the annotation or fix the type.
```

```lisp
(bind :string count 42)
```

```
Error: bind 'count': type annotation is :string but initializer is a
number literal. Remove the annotation or fix the type.
```

**Rationale**: There is no reason to emit code that will immediately
throw. The compiler has enough information to catch the mismatch
statically. This is a strictly better error — compile-time vs runtime,
with a clear message pointing at the source.

### 4. Unannotated `bind` is unchanged — no check

**Decision**: `bind` without a type annotation produces `const x = expr;`
with no type check, as before.

```lisp
(bind x (compute))
```

```javascript
const x = compute();
```

**Rationale**: Type annotations on `bind` are encouraged but not
required. DD-15 established that annotations are required at function
boundaries (`:args`) but optional on `bind`. The linter (Decision 5)
warns about missing annotations; the compiler does not reject them.

### 5. Linter warns on non-literal `bind` without type annotation

**Decision**: The linter emits a warning when `bind` has a non-literal
initializer and no type annotation.

```lisp
;; Linter warning: bind 'result' has a non-literal initializer
;; without a type annotation. Add a type keyword (e.g., :number,
;; :string, :any) for runtime type safety.
(bind result (compute))

;; No warning — literal initializer, type is obvious
(bind MAX-RETRIES 3)

;; No warning — explicitly annotated
(bind :number result (compute))

;; No warning — :any is the explicit opt-out
(bind :any result (compute))
```

**Rationale**: This was already deferred to v0.3.1 in the DD-15
design ("bind type annotation enforcement on non-literal initializers
→ v0.3.1 lint error"). This DD activates it. The warning nudges
toward full type coverage without making it a hard requirement.

### 6. `--strip-assertions` removes `bind` type checks

**Decision**: `bind` type checks are in the same category as `func`
type checks and contract assertions. `--strip-assertions` removes
them all.

```lisp
(bind :number x (compute))
```

**Development** (`lykn compile`):

```javascript
const x = compute();
if (typeof x !== "number" || Number.isNaN(x))
  throw new TypeError("bind 'x': expected number, got " + typeof x);
```

**Production** (`lykn compile --strip-assertions`):

```javascript
const x = compute();
```

**Rationale**: Consistency with `func`/`fn` type checks and
`:pre`/`:post` contracts. Development builds catch type errors;
production builds run at full speed.

### 7. Type check table (same as `func`)

`bind` uses the identical check expressions as `func` parameter
checks:

| Annotation | Runtime check |
|---|---|
| `:number` | `typeof x !== "number" \|\| Number.isNaN(x)` |
| `:string` | `typeof x !== "string"` |
| `:boolean` | `typeof x !== "boolean"` |
| `:function` | `typeof x !== "function"` |
| `:object` | `typeof x !== "object" \|\| x === null` |
| `:array` | `!Array.isArray(x)` |
| `:symbol` | `typeof x !== "symbol"` |
| `:bigint` | `typeof x !== "bigint"` |
| `:any` | No check |
| `:<UserType>` | `typeof x !== "object" \|\| x === null \|\| !("tag" in x)` |

**Error message format**: `"bind 'name': expected type, got " + typeof x`

This matches the `func` format (`"funcName: arg 'name' expected type"`)
with `bind` as the source context.

## Rejected Alternatives

### Keep `bind` annotations as documentation-only

**What**: The v0.3.0 status quo. Annotations exist but generate no
checks.

**Why rejected**: Creates a false sense of safety. A developer who
writes `(bind :number x (compute))` believes the type is enforced.
When `compute()` returns a string, no error occurs — the bug
propagates silently. This contradicts lykn's design philosophy of
"if you declare a type, the compiler enforces it."

### Always generate checks, even on literals

**What**: `(bind :number x 42)` emits `const x = 42; if (typeof x !== "number") ...`.

**Why rejected**: Wasteful. The compiler can see that `42` is a
number. Emitting a check on a known-good literal clutters the output
and adds a (negligible) runtime cost for zero benefit. The
`--strip-assertions` flag would remove it, but development builds
should be clean too.

### Make type annotations required on all `bind`

**What**: `(bind x 42)` without a type annotation is a compile error.

**Why rejected**: Too noisy for the common case. `(bind MAX-RETRIES 3)`
doesn't need `:number` — the type is obvious from the literal. DD-15
already settled this: annotations are required at function boundaries,
optional on `bind`. The linter warns for non-literal initializers
without annotations, which covers the risky cases.

### Compile error on all type mismatches (no runtime checks)

**What**: Only emit compile errors, never runtime checks. If the
compiler can't prove the type, require `:any`.

**Why rejected**: Would require a full static type system to determine
types of arbitrary expressions. lykn's type system is runtime-checked,
not statically inferred. The compiler checks what it can statically
(literals) and generates runtime checks for everything else.

## Edge Cases

| Case | Behavior | Example |
|------|----------|---------|
| Literal matches annotation | No check emitted | `(bind :number x 3)` → `const x = 3;` |
| Literal mismatches annotation | Compile error | `(bind :number x "hi")` → error |
| Non-literal with annotation | Runtime check emitted | `(bind :number x (f))` → check |
| No annotation, literal | No check, no warning | `(bind x 42)` → `const x = 42;` |
| No annotation, non-literal | No check, linter warning | `(bind x (f))` → warning |
| `:any` annotation | No check, no warning | `(bind :any x (f))` → `const x = f();` |
| `NaN` literal with `:number` | Compile error (NaN fails `:number`) | `(bind :number x NaN)` → error |
| `null` literal with `:object` | Compile error (null fails `:object`) | `(bind :object x null)` → error |
| `(cell ...)` initializer | No type check on outer bind (cell is `:object`) | `(bind counter (cell 0))` — cell contents checked by `reset!`/`swap!` |
| `--strip-assertions` | Removes all `bind` type checks | Same as `func` stripping |
| User type annotation | Tag-based check | `(bind :Shape s (compute))` → tag check |

## Implementation

### Compiler changes

In the JS surface compiler (`src/surface.js`), modify the `bind`
handler:

1. If annotation present AND initializer is a literal:
   - Check type compatibility at compile time
   - If compatible: emit `const` only (no runtime check)
   - If incompatible: emit compile error
2. If annotation present AND initializer is not a literal:
   - Emit `const` declaration
   - Emit runtime type check (same check expressions as `func`)
3. If no annotation: emit `const` only (unchanged behavior)

In the Rust surface compiler (`crates/lykn-lang`):

1. Classifier: detect `bind` annotation + initializer form
2. Analyzer: for literal initializers, check type compatibility
   statically (new analysis pass or extension of existing collection
   phase)
3. Emitter: emit type check after `const` for non-literal annotated
   `bind`; emit diagnostic for literal mismatches

### Linter changes

Add a lint rule: `missing-bind-type`. Fires when `bind` has a
non-literal initializer and no type annotation. Severity: warning.
Suppressed by `:any` annotation.

### Kernel unchanged

No kernel changes. The `const` declaration is unchanged. Type checks
are additional statements emitted by the surface compiler, same as
`func` type checks.

## Testing

### New test fixtures

Add to `test/fixtures/surface/bind.json` (or create
`test/fixtures/surface/bind-types.json`):

```json
[
  {
    "note": "Annotated non-literal — runtime check",
    "input": "(bind :number x (compute))",
    "output": "const x = compute();\nif (typeof x !== \"number\" || Number.isNaN(x))\n  throw new TypeError(\"bind 'x': expected number, got \" + typeof x);\n"
  },
  {
    "note": "Annotated literal — no check (statically verified)",
    "input": "(bind :number x 42)",
    "output": "const x = 42;\n"
  },
  {
    "note": "String annotation + literal",
    "input": "(bind :string name \"hello\")",
    "output": "const name = \"hello\";\n"
  },
  {
    "note": ":any — no check",
    "input": "(bind :any x (compute))",
    "output": "const x = compute();\n"
  },
  {
    "note": "Array annotation + #a() literal",
    "input": "(bind :array items #a(1 2 3))",
    "output": "const items = [1, 2, 3];\n"
  },
  {
    "note": "Unannotated — no check (unchanged)",
    "input": "(bind x (compute))",
    "output": "const x = compute();\n"
  },
  {
    "note": "Array annotation + non-literal",
    "input": "(bind :array items (get-items))",
    "output": "const items = getItems();\nif (!Array.isArray(items))\n  throw new TypeError(\"bind 'items': expected array, got \" + typeof items);\n"
  }
]
```

### Error tests

- `(bind :number x "hello")` → compile error: literal type mismatch
- `(bind :string x 42)` → compile error: literal type mismatch
- `(bind :number x NaN)` → compile error: NaN fails `:number`
- `(bind :boolean x 0)` → compile error: number literal is not boolean

### Regression tests

- `(bind x 42)` — unannotated bind unchanged
- `(bind counter (cell 0))` — cell bind unchanged
- `func` type checks unchanged
- `--strip-assertions` removes `bind` type checks
- `--strip-assertions` removes `func` type checks (regression)

### Linter tests

- `(bind x (compute))` — warning: missing type annotation
- `(bind :number x (compute))` — no warning
- `(bind :any x (compute))` — no warning
- `(bind x 42)` — no warning (literal)

## Dependencies

- **Depends on**: DD-15 (language architecture — type annotation
  design, deferred linter rule), DD-22 (surface equality — `bind`
  annotation semantics referenced in guide updates)
- **Affects**: All guides and SKILL.md that mention `bind` type
  annotations as "documentation-only" (see update list below)

## Guide and Documentation Updates

The following documents must be updated after DD-24 is implemented.
The key change: every reference to "bind annotations are
documentation-only" must be replaced with "bind annotations are
enforced at runtime."

### Guide 00: `00-lykn-surface-forms.md`

**bind section**: Remove the sentence "Optional type annotation
(documentation only, not checked at runtime)". Replace with:

```markdown
Type annotation with runtime check:

‎```lykn
(bind :number age (compute-age user))
‎```
‎```js
const age = computeAge(user);
if (typeof age !== "number" || Number.isNaN(age))
  throw new TypeError("bind 'age': expected number, got " + typeof age);
‎```

For literals, the compiler verifies the type statically — no runtime
check is emitted:

‎```lykn
(bind :number MAX-RETRIES 3)
‎```
‎```js
const MAX_RETRIES = 3;
‎```

Type-incompatible literals are compile errors:

‎```lykn
(bind :number name "hello")  ;; compile error
‎```
```

### Guide 01: `01-core-idioms.md`

**ID-01** (bind by default): Update any mention of "documentation-only"
annotations. The bind example should show a typed non-literal with its
compiled check output.

### Guide 04: `04-values-references.md`

No specific "documentation-only" references to remove, but any
mentions of `bind` type annotations should reflect enforcement.

### Guide 05: `05-type-discipline.md`

**ID-01** (every param must have a type): Extend to note that `bind`
annotations are now also enforced, not just `func`/`fn`:

```markdown
lykn enforces type annotations at runtime on:
- `func` and `fn` parameters (`:args`)
- `func` return values (`:returns`)
- `bind` initializers (DD-24)

All use the same type keywords and the same runtime checks. All are
stripped by `--strip-assertions`.
```

### Guide 09: `09-anti-patterns.md`

**Remove or update ID-39** (missing type annotations): The current
text says `:any` everywhere defeats the purpose. This is still true,
but the entry should also note that unannotated non-literal `bind`
now triggers a linter warning.

**Remove any reference** to "bind annotations are documentation-only"
from the anti-patterns table or lykn-specific section.

### SKILL.md

**Bindings & Mutation section**: Replace the note block that says:

```
> **Note:** `bind` type annotations do NOT generate runtime checks.
```

With:

```
> `bind` type annotations are enforced at runtime (DD-24). Literal
> initializers are verified at compile time. Non-literal initializers
> get runtime checks, stripped by `--strip-assertions`.
```

**Anti-patterns table**: Remove the row "Assuming `bind` type
annotations are enforced" — they ARE enforced now.

### CC Prompt Template

Remove any notes about `bind` annotations being documentation-only.
The syntax translation table entry for `bind` should show the type
check in the compiled output.

### README.md

The README's `bind` entry in the surface forms table is already
correct (`(bind x 1)` → `const x = 1;`). No change needed unless
a typed `bind` example is added to the quick-taste section.

## Open Questions

None.
