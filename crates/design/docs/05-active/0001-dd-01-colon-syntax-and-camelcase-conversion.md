---
number: 1
title: "DD-01: Colon Syntax and camelCase Conversion"
author: "Duncan McGreggor"
component: All
tags: [change-me]
created: 2026-03-24
updated: 2026-03-24
state: Active
supersedes: null
superseded-by: null
version: 1.0
---

# DD-01: Colon Syntax and camelCase Conversion

**Status**: Decided
**Date**: 2026-03-24
**Session**: (this chat)

## Summary

Colon syntax (`obj:method`) is the single syntax for static member access, handled at compile time. The `.` form is removed, replaced by a `get` built-in form for computed/dynamic bracket access. Lisp-case identifiers auto-convert to camelCase with well-defined rules for edge cases including leading/trailing hyphens (→ underscores) and consecutive mid-word hyphens (→ single camelCase boundary).

## Decisions

### Colon splitting at compile time

**Decision**: The reader treats colons as ordinary atom characters. The compiler splits atoms containing `:` (not leading) on `:` and builds a chained `MemberExpression`.

**Syntax**:

```lisp
;; simple method call
(console:log "hi")

;; property access (no call)
(obj:name)

;; chained access
(a:b:c)

;; chained method call
(document:body:style:set-property "color" "red")
```

```javascript
// simple method call
console.log("hi");

// property access
obj.name;

// chained access
a.b.c;

// chained method call
document.body.style.setProperty("color", "red");
```

**ESTree nodes**: `MemberExpression` (with `computed: false`), `Identifier`

**Rationale**: The reader's job is s-expression structure, not JS semantics. Colons carry semantic meaning (member access), which belongs in the compiler. Keeps both the JS reader and the Rust reader/formatter simple. Splitting a string on `:` is trivial — not worth adding reader complexity for a dedicated node type.

### Colon is the single syntax for static member access

**Decision**: Colon syntax is the one and only way to express static member access. The `.` form from v0.0.1 is removed.

**Syntax**:

```lisp
;; receiver:method is the idiomatic form (CL/ZetaLisp style)
(console:log "hi")
(Math:floor 3.7)
(JSON:parse str)
(my-obj:do-thing arg)
```

```javascript
console.log("hi");
Math.floor(3.7);
JSON.parse(str);
myObj.doThing(arg);
```

**ESTree nodes**: `MemberExpression` (with `computed: false`), `CallExpression`

**Rationale**: The primary semantic load of `:` is the CL-style receiver:method pattern — the closest JS analogue to `(class:method ...)` in Common Lisp. One syntax for one concept. No syntactic proliferation.

### `get` form for computed access

**Decision**: A new built-in form `get` handles computed/dynamic property access (JS bracket notation). Takes exactly two arguments: object and key expression.

**Syntax**:

```lisp
;; variable as key
(get obj key)

;; numeric index
(get arr 0)

;; expression as key
(get obj (+ "prop" suffix))

;; string key
(get obj "weird-key")

;; chained computed access (nest, don't chain)
(get (get obj 0) 1)
```

```javascript
// variable as key
obj[key];

// numeric index
arr[0];

// expression as key
obj["prop" + suffix];

// string key
obj["weird-key"];

// chained computed access
obj[0][1];
```

**ESTree nodes**: `MemberExpression` (with `computed: true`)

**Rationale**: Computed access requires an expression as key, which colon syntax can't express (`obj:foo` always means the literal property `foo`). A named form is cleaner than a second punctuation syntax. Exactly two arguments keeps it dead predictable. Eslisp had `get` for the same purpose — prior art. Chained computed access is rare enough that nesting is fine; a variadic `get` can be added later if needed.

### camelCase conversion rules

**Decision**: Atoms containing hyphens are auto-converted to camelCase. Each segment of a colon-split atom is converted independently. The conversion is a character-walk, not a regex.

**Syntax**:

```lisp
;; standard conversion
(const my-function (=> (x) x))

;; no hyphens, no conversion
(JSON:parse str)

;; both sides of colon converted independently
(my-app:get-data)

;; leading hyphen → underscore (private convention)
(const -private-thing 42)

;; trailing hyphen → underscore
(const thing- 42)
```

```javascript
// standard conversion
const myFunction = x => x;

// no hyphens, no conversion
JSON.parse(str);

// both sides converted
myApp.getData();

// leading hyphen → underscore
const _privateThing = 42;

// trailing hyphen → underscore
const thing_ = 42;
```

**ESTree nodes**: `Identifier` (the conversion affects the `name` field)

**Rationale**: Lisp-case is more readable in s-expressions; camelCase is JS convention. Auto-conversion lets lykn code feel like Lisp while producing idiomatic JS. The rules are designed to handle all edge cases deterministically with no ambiguity.

**Full conversion table**:

| Input | Output | Rule |
|-------|--------|------|
| `my-function` | `myFunction` | Standard: hyphen + letter → uppercase letter |
| `get-x` | `getX` | Single-letter segment |
| `get-HTTP-response` | `getHTTPResponse` | Uppercase preserved, hyphen marks boundary |
| `-foo` | `_foo` | Leading hyphen → underscore |
| `--foo` | `__foo` | Multiple leading hyphens → same count of underscores |
| `foo-` | `foo_` | Trailing hyphen → underscore |
| `foo--` | `foo__` | Multiple trailing hyphens → same count of underscores |
| `foo--bar` | `fooBar` | Consecutive mid-word hyphens → single camelCase boundary |
| `foo---bar` | `fooBar` | Same: any number of mid-word hyphens → one boundary |
| `JSON` | `JSON` | No hyphens → no conversion |
| `-foo-bar` | `_fooBar` | Leading underscore + standard conversion |
| `foo-bar-` | `fooBar_` | Standard conversion + trailing underscore |
| `_private` | `_private` | Existing underscores pass through unchanged |

### `this` and `super` in colon syntax

**Decision**: When the compiler splits on `:`, if the first segment is `this` or `super`, it emits `ThisExpression` or `Super` instead of `Identifier`.

**Syntax**:

```lisp
(this:name)
(super:method arg)
```

```javascript
this.name;
super.method(arg);
```

**ESTree nodes**: `ThisExpression`, `Super`, `MemberExpression`

**Rationale**: `this` and `super` are already special in JS. The compiler already dispatches on atom values for keywords. Two more entries in the dispatch table.

### Leading colon reserved

**Decision**: Atoms starting with `:` (e.g., `:foo`) are reserved for future use. The compiler emits an error: "leading colon syntax is reserved for future use."

**Rationale**: No JS concept maps to CL-style keywords currently. Reserving the syntax keeps the door open (e.g., for keyword arguments, symbols) without committing now. Lykn is a thin skin over JS — don't invent semantics JS doesn't have.

## Rejected Alternatives

### Reader-time colon splitting

**What**: The reader would understand colons and produce a dedicated `member-access` node type with a `parts` array, instead of emitting a plain atom.

**Why rejected**: Colons carry semantic meaning (member access), which belongs in the compiler. The reader's job is structure, not semantics. The claimed benefits (cleaner atom invariants, earlier error detection) are real but small — the compiler already dispatches on atom values, and compile-time errors are just as good as read-time errors for non-structural issues.

### `.` form for static member access

**What**: Keep the eslisp-style `(. obj prop)` form alongside or instead of colon syntax.

**Why rejected**: Two syntaxes for the same thing (static member access) is unnecessary proliferation. Colon syntax is more ergonomic and directly borrows the CL/ZetaLisp receiver:method pattern. One syntax for one concept.

### `.` form for computed access

**What**: Repurpose the existing `.` form to mean always-computed access (`computed: true`).

**Why rejected**: A functional approach (`get`) is preferred over a second punctuation-based syntax. `get` is a word in the vocabulary, like `if` or `const` — no new syntactic rules to learn.

### Regex-based camelCase conversion

**What**: Use a regex like `/-([a-zA-Z])/g` to handle the conversion.

**Why rejected**: The edge cases (leading hyphens → underscores, trailing hyphens → underscores, consecutive mid-word hyphens → single boundary) accumulate beyond what a single regex expresses cleanly. A character-walk is clearer and more maintainable.

### Numeric segments in colon syntax (`obj:0`)

**What**: Allow `obj:0` to produce computed access `obj[0]`.

**Why rejected**: Colon syntax is static member access, and `obj.0` is not valid JS. Numeric indexing is computed access — use `(get obj 0)`.

## Edge Cases

| Case | Behavior | Example |
|------|----------|---------|
| Trailing colon | Compile-time error | `foo:` → error |
| Bare colon | Compile-time error | `:` → error |
| Leading colon | Compile-time error (reserved) | `:foo` → error |
| Numeric colon segment | Compile-time error | `obj:0` → error, use `(get obj 0)` |
| URL-like atom | Normal member access, no ambiguity | `(http:get url)` → `http.get(url)` |
| `this` as first segment | Emits `ThisExpression` | `(this:x)` → `this.x` |
| `super` as first segment | Emits `Super` | `(super:method)` → `super.method()` |
| No hyphens in atom | No conversion | `JSON` → `JSON` |
| Existing underscores | Pass through unchanged | `_private` → `_private` |

## Dependencies

- **Depends on**: none (this is the foundation)
- **Affects**: DD-02 (function forms — method definitions use colon syntax), DD-03 (async/await — `(await (obj:method))` interaction), DD-04 (modules — import bindings go through camelCase), DD-06 (destructuring — nested member access in patterns), DD-07 (class syntax — `this:prop` in class bodies)

## Open Questions

- [ ] Exact semantics of `:foo` if/when leading colon is given meaning (keyword arguments? symbols? deferred to post-v0.1.0)
- [ ] Whether `get` should support variadic chaining `(get obj 0 1)` → `obj[0][1]` in a future version (current answer: no, nest instead)
