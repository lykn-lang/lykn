# DD-03: Async / Await

## Your role

You are helping design lykn, an s-expression syntax for JavaScript.
Read the session bootstrap doc in this project for full context. This
conversation focuses on one topic: how `async` functions and `await`
expressions should work in lykn.

**Important**: Read DD-02 (function forms) first if available — this
topic depends on those decisions.

## What ECMAScript defines

In JS, `async` is a modifier on function declarations, function
expressions, and arrow functions. It is not a standalone keyword that
wraps things — it's part of the function syntax:

```javascript
// Async function declaration
async function fetchData() { ... }

// Async function expression
const handler = async function() { ... }

// Async arrow
const handler = async (req) => { ... }

// Async method in class
class Foo {
  async getData() { ... }
}
```

`await` is a unary operator valid only inside async functions:

```javascript
const data = await fetch(url);
const json = await data.json();
```

ESTree representation:
- `async` is a boolean flag on `FunctionDeclaration`,
  `FunctionExpression`, and `ArrowFunctionExpression`
- `AwaitExpression` has a single `argument` property

## The gap analysis proposal

The research proposed `async` as a **wrapper form**:

```lisp
;; Wraps a function declaration
(async (defn fetch-data ()
  (const data (await (fetch url)))
  (return (await (data:json)))))

;; Wraps an arrow
(const handler (async (=> (req) ...)))
```

And `await` as a unary form:

```lisp
(const result (await (fetch url)))
```

## Questions to discuss

1. **Wrapper vs modifier**: The proposal has `(async (function ...))`.
   Alternatives:
   - **Prefix modifier**: `(async-function fetch-data () ...)` or
     `(async function fetch-data () ...)`
   - **Flag in the form**: `(function fetch-data () :async ...)`
   - **Wrapper**: `(async (function fetch-data () ...))`

   The wrapper approach is compositional (works with any function form)
   but adds nesting. The prefix approach is flatter but requires
   separate forms or special parsing for `async function` as a
   two-atom head.

2. **How does JS actually parse `async`?** In ECMAScript grammar,
   `async` is a contextual keyword — it's part of the production rule
   for async functions, not a separate expression that wraps things.
   `async function foo()` is a single syntactic unit. Does lykn's
   syntax need to reflect this, or is the wrapper approach fine since
   we're compiling to ESTree (where it's just a boolean flag)?

3. **`await` is straightforward**: `(await expr)` → `AwaitExpression`.
   Any concerns here?

4. **Async arrows**: `(const f (async (=> (x) ...)))` vs
   `(const f (async=> (x) ...))` — separate form or wrapper?

5. **Async methods in classes**: Depends on DD-07 (class syntax), but
   worth noting: however we handle async, it needs to work for class
   methods too.

6. **Top-level await**: ES2022 supports `await` at module top level.
   Lykn already sets `sourceType: "module"`. Should we support this?
   (Probably yes, for free — just allow `await` outside functions.)

## ESTree nodes involved

- `AwaitExpression` — `{ type: "AwaitExpression", argument: Expression }`
- `FunctionDeclaration` — has `async: boolean` flag
- `FunctionExpression` — has `async: boolean` flag
- `ArrowFunctionExpression` — has `async: boolean` flag

## Goal

By the end of this discussion, decide:
- How `async` is expressed syntactically (wrapper, prefix, flag, etc.)
- How `await` works (likely straightforward)
- How async composes with each function form (declaration, expression,
  arrow)
- Whether top-level await needs any special handling

When we're done, I'll ask you to write a decision doc using the
template in this project.
