---
number: 3
title: "DD-03: Async / Await"
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

# DD-03: Async / Await

**Status**: Decided
**Date**: 2026-03-24
**Session**: (this chat)

## Summary

`async` is a wrapper form that sets the `async: true` flag on any enclosed function form (`function`, `lambda`, `=>`). `await` is a straightforward unary form producing `AwaitExpression`. Top-level `await` is supported for free since lykn emits `sourceType: "module"`.

## Decisions

### `async` as a wrapper form

**Decision**: `(async (function-form ...))` wraps any of the three function forms from DD-02 and sets `async: true` on the resulting ESTree node. The compiler sees `async` as head, confirms the single child is a function form (`function`, `lambda`, or `=>`), and sets the flag.

**Syntax**:

```lisp
;; async function declaration
(async (function fetch-data ()
  (const data (await (fetch url)))
  (return (await (data:json)))))

;; async lambda
(const handler (async (lambda ()
  (const data (await (fetch url)))
  (return data))))

;; async arrow
(const handler (async (=> (req)
  (const body (await (req:json)))
  (return body))))
```

```javascript
// async function declaration
async function fetchData() {
  const data = await fetch(url);
  return await data.json();
}

// async lambda
const handler = async function() {
  const data = await fetch(url);
  return data;
};

// async arrow
const handler = async (req) => {
  const body = await req.json();
  return body;
};
```

**ESTree nodes**: `FunctionDeclaration` (with `async: true`), `FunctionExpression` (with `async: true`), `ArrowFunctionExpression` (with `async: true`)

**Rationale**: The wrapper pattern is the most Lisp-native approach — one form, compositional with any function form. It adds one paren pair at the top, which in practice is barely noticeable since the body indentation stays the same. It also mirrors how `async` actually works in ESTree: a boolean flag on the function node, not a separate wrapping node. The compiler just peeks inside, confirms it's a function, and sets the flag.

### `await` as a unary form

**Decision**: `(await expr)` emits `AwaitExpression` with the expression as its `argument`. No validation of whether we're inside an async function — that's the JS engine's concern.

**Syntax**:

```lisp
(const data (await (fetch url)))
(const json (await (data:json)))
(const results (await (Promise:all promises)))
```

```javascript
const data = await fetch(url);
const json = await data.json();
const results = await Promise.all(promises);
```

**ESTree nodes**: `AwaitExpression`

**Rationale**: Direct mapping. `await` is a unary operator in JS, `(await expr)` is a unary form in lykn. Nothing to complicate.

### Top-level await supported

**Decision**: `(await ...)` is valid at module top level. No special handling needed — the compiler emits `AwaitExpression` wherever it encounters `await`, and lykn already sets `sourceType: "module"` on the `Program` node, which makes top-level await valid ES2022.

**Syntax**:

```lisp
;; top-level module code
(const config (await (fetch "https://api.example.com/config")))
(const data (await (config:json)))
(console:log data)
```

```javascript
const config = await fetch("https://api.example.com/config");
const data = await config.json();
console.log(data);
```

**ESTree nodes**: `AwaitExpression` (at `Program` body level)

**Rationale**: ES2022 supports this in modules. Lykn is already module-mode. Restricting `await` to async function bodies would require extra validation for no benefit — let the JS engine enforce scoping rules.

### Async composes with class methods

**Decision**: The wrapper pattern will compose with class method syntax (DD-07). The `async` form doesn't care what's inside it — it finds the function node and sets `async: true`. Exact class method syntax is deferred to DD-07, but the mechanism is settled.

**Rationale**: Compositionality is the whole point of the wrapper approach. No special async-method form needed.

## Rejected Alternatives

### Prefix compound forms

**What**: Fused form names — `(async-function fetch-data () ...)`, `(async-lambda () ...)`, `(async=> () ...)`.

**Why rejected**: Doubles the function form count from 3 to 6. `async=>` is visually noisy. Form proliferation for no compositional benefit — wrapper handles all three with one mechanism.

### Two-atom head

**What**: `(async function fetch-data () ...)` with `async` and `function` as two atoms at the head of the list.

**Why rejected**: Breaks Lisp convention of single-atom heads. Would require the compiler to handle multi-atom dispatch, which is an unusual parsing pattern for s-expressions. Reads like JS, but lykn is s-expression syntax — Lisp conventions should hold for structural patterns.

### Flag inside the form

**What**: `(function fetch-data () :async ...)` with `:async` as a keyword flag inside the function form.

**Why rejected**: Leading-colon atoms are reserved (DD-01). Even if they weren't, this puts the async marker in a non-obvious position — easy to miss when scanning code. The wrapper makes async status visually prominent at the outermost level.

## Edge Cases

| Case | Behavior | Example |
|------|----------|---------|
| `async` wrapping non-function | Compile-time error | `(async (const x 1))` → error |
| `async` with no child | Compile-time error | `(async)` → error |
| Nested `async` | Compile-time error | `(async (async (function f () ...)))` → error |
| `await` with no argument | Compile-time error | `(await)` → error |
| `await` with multiple arguments | Compile-time error | `(await a b)` → error |
| `await` outside async function | Valid (top-level await in modules) | `(const x (await (fetch url)))` → `const x = await fetch(url)` |

## Dependencies

- **Depends on**: DD-02 (the three function forms that `async` wraps)
- **Affects**: DD-07 (async class methods will use the wrapper pattern)

## Open Questions

None.
