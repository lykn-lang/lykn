---
number: 2
title: "DD-02: Function Forms (Declaration vs Expression)"
author: "the export"
component: All
tags: [change-me]
created: 2026-03-24
updated: 2026-03-26
state: Final
supersedes: null
superseded-by: null
version: 1.0
---

# DD-02: Function Forms (Declaration vs Expression)

**Status**: Decided
**Date**: 2026-03-24
**Session**: (this chat)

## Summary

Lykn has three function forms, each mapping to a distinct JS concept: `function` for named declarations (hoisted, own `this`), `lambda` for anonymous function expressions (the irreducible Lisp primitive, own `this`), and `=>` for arrow functions (lexical `this`, the everyday workhorse). This follows the Scheme tradition of separating binding (`define`/`function`) from abstraction (`lambda`), while keeping JS-aligned naming.

## Decisions

### `function` for named declarations

**Decision**: `(function name (params) body...)` always emits a `FunctionDeclaration`. The name is required. This is the binding form — it fuses naming and abstraction, like Scheme's shorthand `(define (f x) ...)`.

**Syntax**:

```lisp
;; basic function declaration
(function add (a b)
  (return (+ a b)))

;; no-arg function
(function greet ()
  (console:log "hello"))

;; multi-statement body
(function process (data)
  (const result (data:trim))
  (return result))
```

```javascript
// basic function declaration
function add(a, b) {
  return a + b;
}

// no-arg function
function greet() {
  console.log("hello");
}

// multi-statement body
function process(data) {
  const result = data.trim();
  return result;
}
```

**ESTree nodes**: `FunctionDeclaration`

**Rationale**: JS-aligned naming — JS uses `function` for declarations. The name is required because a `FunctionDeclaration` without a name is only valid as `export default function() {}`, which is handled by the export form (DD-04). Having the name required makes the form unambiguous: atom after `function` is always the name, list after the name is always params.

### `lambda` for anonymous function expressions

**Decision**: `(lambda (params) body...)` always emits an anonymous `FunctionExpression`. This is the pure abstraction form — it creates a function value without binding it to a name. Retained as the irreducible Lisp primitive.

**Syntax**:

```lisp
;; assigned to a variable
(const add (lambda (a b) (return (+ a b))))

;; passed as a callback
(set-timeout (lambda () (console:log "done")) 1000)

;; object method (when you need dynamic this)
(const obj (object
  (name "foo")
  (greet (lambda ()
    (return this:name)))))
```

```javascript
// assigned to a variable
const add = function(a, b) {
  return a + b;
};

// passed as a callback
setTimeout(function() {
  console.log("done");
}, 1000);

// object method (when you need dynamic this)
const obj = {
  name: "foo",
  greet: function() {
    return this.name;
  }
};
```

**ESTree nodes**: `FunctionExpression` (with `id: null`)

**Rationale**: Scheme's R3RS through R5RS all identify `lambda` as a primitive expression type — the foundation from which all other binding forms derive. Keeping `lambda` preserves this lineage and provides a clean separation: `function` binds, `lambda` abstracts. In practice `lambda` is the niche form — used when you specifically need a `function` expression with dynamic `this` (object methods, or when arrow functions won't work). For most anonymous function needs, `=>` is preferred.

### `=>` for arrow functions

**Decision**: `(=> (params) body)` emits an `ArrowFunctionExpression`. Single body expression gives concise form (implicit return). Multi-statement bodies use explicit `block`.

**Syntax**:

```lisp
;; concise body (expression, implicit return)
(const double (=> (x) (* x 2)))

;; callback (the dominant use case)
(arr:map (=> (x) (* x 2)))
(arr:filter (=> (x) (> x 0)))
(fetch:then (=> (res) (res:json)))

;; multi-statement body (explicit block, explicit return)
(const process (=> (data)
  (block
    (const trimmed (data:trim))
    (return trimmed))))

;; no-arg arrow
(set-timeout (=> () (console:log "done")) 1000)
```

```javascript
// concise body (expression, implicit return)
const double = x => x * 2;

// callback
arr.map(x => x * 2);
arr.filter(x => x > 0);
fetch.then(res => res.json());

// multi-statement body
const process = data => {
  const trimmed = data.trim();
  return trimmed;
};

// no-arg arrow
setTimeout(() => console.log("done"), 1000);
```

**ESTree nodes**: `ArrowFunctionExpression`

**Rationale**: `=>` is universally understood by JS developers. Arrow functions have largely replaced anonymous `function` expressions in modern JS due to lexical `this`, concise syntax, and ubiquity in callbacks. Renaming or aliasing would fight established mindshare for no benefit. The `block` requirement for multi-statement bodies mirrors how JS uses braces — single expression means concise form, braces mean block body.

### Named function expressions deferred

**Decision**: Named function expressions (`const f = function myFunc(a) { ... }` where the name is only visible inside the body) are not supported in v0.1.0.

**Rationale**: Rare in modern JS. The primary use case is self-recursion inside an anonymous function, which can be achieved by binding with `const` and referencing the outer name. Not worth complicating `lambda` with an optional name argument. Can be added later if needed.

## Rejected Alternatives

### `defn` for declarations

**What**: Use Clojure-style `(defn add (a b) ...)` for function declarations.

**Why rejected**: Violates lykn design principle #6 (JS-aligned naming). `function` is the JS keyword. Duncan explicitly chose `function` over Lisp-style names.

### `function` for both declarations and expressions

**What**: Single `function` form that emits `FunctionDeclaration` or `FunctionExpression` based on context — name present at statement level means declaration, no name or used as value means expression.

**Why rejected**: Context-dependent behavior is magical. The Scheme tradition (and the irreducible-core research) shows that binding and abstraction are genuinely different operations. Keeping them separate (`function` vs `lambda`) is cleaner, unambiguous, and truer to the Lisp heritage. Also makes named function expressions ambiguous — `(function add (a b) ...)` inside a `const` initializer would need special-case context analysis.

### Dropping `lambda` entirely

**What**: Replace `lambda` with anonymous `(function (a b) ...)`.

**Why rejected**: `lambda` is one of the five irreducible Lisp primitives (quote, lambda, if, set!, define). Dropping it would sever lykn's connection to the Lisp tradition for no practical benefit. It also serves a distinct JS purpose — `function` expressions with dynamic `this` — that `=>` doesn't cover.

### Renaming `=>` to `arrow`, `fn`, or `->` 

**What**: Use a word or different symbol instead of `=>` for arrow functions.

**Why rejected**: `=>` is universal JS mindshare. Every JS developer reads it instantly. Fighting this buys nothing.

### Implicit multi-statement arrow bodies

**What**: Allow `(=> (a b) stmt1 stmt2)` without explicit `block`, inferring a block body when multiple expressions follow the params.

**Why rejected**: Ambiguity about whether the last expression is an implicit return or not. Explicit `block` mirrors JS's braces and makes the distinction between concise (expression, implicit return) and block (statements, explicit return) clear. Consistent with how lykn handles other multi-statement contexts.

## Edge Cases

| Case | Behavior | Example |
|------|----------|---------|
| `function` without name | Compile-time error | `(function (a) ...)` → error, use `lambda` |
| `lambda` with name | Compile-time error in v0.1.0 | `(lambda add (a) ...)` → error (named expressions deferred) |
| Empty param list | Valid for all forms | `(function init () ...)`, `(lambda () ...)`, `(=> () ...)` |
| Single param arrow | Params still a list | `(=> (x) (* x 2))` — no bare `(=> x ...)` shorthand |
| Nested functions | Each form nests naturally | `(function outer () (const f (=> (x) x)) (return (f 1)))` |

## Dependencies

- **Depends on**: DD-01 (camelCase applies to function names and param names)
- **Affects**: DD-03 (async must compose with all three forms), DD-06 (destructuring in function params), DD-07 (class methods use function-body conventions)

## Open Questions

- [ ] Named function expressions (`lambda` with optional name) — deferred to post-v0.1.0
- [ ] Whether `lambda` should be aliased to `fn` or another short form for ergonomics — deferred, revisit based on usage patterns
- [ ] Default parameter values in param lists — deferred to DD-06 (destructuring)
