# DD-02: Function Forms (Declaration vs Expression)

## Your role

You are helping design lykn, an s-expression syntax for JavaScript.
Read the session bootstrap doc in this project for full context. This
conversation focuses on one topic: how function declarations and
function expressions should be expressed in lykn.

## Design constraint

Lykn uses **JS-aligned naming**. Built-in forms should use JS keywords
where possible. Duncan explicitly chose `function` over Lisp-style
names like `defn`, `fn`, or `define`.

## Current state in v0.0.1

- `(lambda (a b) body)` → `FunctionExpression` (anonymous)
- `(=> (a b) body)` → `ArrowFunctionExpression`
- No function declarations exist yet

## The problem

JavaScript has three function forms:

```javascript
// 1. Function declaration (hoisted, named)
function add(a, b) { return a + b; }

// 2. Function expression (not hoisted, optionally named)
const add = function(a, b) { return a + b; };
const add = function add(a, b) { return a + b; };  // named expr

// 3. Arrow function (lexical this, concise)
const add = (a, b) => a + b;
```

In ECMAScript, there is no separate keyword for anonymous functions —
`function` is used for both declarations and expressions. The
distinction is purely positional: `function` at statement level with a
name is a declaration; `function` used as an expression (assigned,
passed as arg, etc.) is an expression.

Lykn needs to support all three. The question is: can we use `function`
for both declarations and expressions (like JS does), or do we need
separate forms?

## The gap analysis proposal

The research proposed:
- `(defn add (a b) (return (+ a b)))` → `FunctionDeclaration`
- `(lambda (a b) (return (+ a b)))` → `FunctionExpression`
- `(=> (a b) (+ a b))` → `ArrowFunctionExpression`

But Duncan rejected `defn` in favor of `function`.

## Questions to discuss

1. **Can `function` do double duty?** In JS, the difference between
   declaration and expression is context. In an s-expression syntax,
   there's no positional ambiguity — every form is a list. Options:

   a. **Single form, compiler decides**: `(function add (a b) ...)` is
      a declaration (has a name at statement level); `(const f (function
      (a b) ...))` is an expression (anonymous, used as initializer).
      But what about `(const f (function add (a b) ...))` — named
      expression?

   b. **Two forms**: `(function add (a b) ...)` for declarations,
      something else for expressions. If not `lambda`, what?

   c. **Single form, always**: `(function ...)` is always an expression.
      At top level, it gets wrapped in `ExpressionStatement`. To get a
      declaration, use it with `const`/`let`. This loses hoisting
      behavior.

2. **What happens to `lambda`?** Options:
   - Keep `lambda` as the expression form, `function` as declaration
   - Replace `lambda` with `function` for both
   - Keep `lambda` as an alias (backwards compat with v0.0.1)

3. **Named function expressions**: `const f = function myFunc(a) { ... }`
   — the name `myFunc` is only visible inside the function body (useful
   for recursion). How should lykn express this? Is this common enough
   to care about?

4. **Arrow functions**: `=>` is already implemented and clear. Any
   changes needed? Should it support multi-expression bodies without
   explicit `block`?

5. **Interaction with `async`**: This depends on DD-03, but worth
   noting the constraint: whatever form we choose for `function` needs
   to compose with `async` somehow.

## Reference: what eslisp does

```lisp
;; Function declaration
(function add (a b) (return (+ a b)))

;; Function expression (anonymous)
(lambda (a b) (return (+ a b)))

;; Function expression (named)
(lambda add (a b) (return (+ a b)))
```

Eslisp uses `function` for declarations and `lambda` for expressions.

## Reference: what LFE does

```lisp
;; Named function
(defun add (a b) (+ a b))

;; Lambda
(lambda (a b) (+ a b))

;; Or the shorter form
(fun (a b) (+ a b))
```

## Goal

By the end of this discussion, decide:
- The form(s) for function declarations
- The form(s) for function expressions
- Whether `lambda` stays, goes, or becomes an alias
- How named function expressions work (if supported)
- Whether `=>` needs any changes

When we're done, I'll ask you to write a decision doc using the
template in this project.
