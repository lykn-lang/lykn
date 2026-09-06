# DD-08: Special Atoms, Update Operators, and Miscellaneous Forms

## Your role

You are helping design lykn, an s-expression syntax for JavaScript.
Read the session bootstrap doc in this project for full context. This
conversation covers several smaller design decisions that don't warrant
their own full topic: special atoms (`this`, `super`), update operators
(`++`/`--`), and other forms that need quick decisions.

**Important**: Read DD-01 (colon syntax) and DD-07 (classes) first if
available — `this` and `super` interact with both.

## Topic A: `this` as a proper ESTree node

### Current state

`this` compiles to `Identifier("this")` which happens to produce
correct JS output (astring emits `this` for an identifier named
"this"). But ESTree defines `ThisExpression` as the correct node.

### The fix

The atom `this` should compile to `{ type: "ThisExpression" }` instead
of an `Identifier`. This also means `this:name` (via colon syntax)
produces `MemberExpression(ThisExpression, "name")`.

### Question

Is this purely an implementation fix, or are there design implications?
For example:
- Should `this` be excluded from camelCase conversion? (Yes — it has
  no hyphens, so `toCamelCase` is a no-op anyway.)
- Any interaction with arrow functions? (Arrow functions lexically
  bind `this` — but that's a JS runtime behavior, not a compiler
  concern.)

## Topic B: `super` as a proper ESTree node

### Current state

`super` is not handled specially — it would compile to
`Identifier("super")`.

### The fix

The atom `super` should compile to `{ type: "Super" }`. This means:
- `(super arg1 arg2)` → `CallExpression(Super, [arg1, arg2])`
  (constructor delegation)
- `(super:method arg)` → `CallExpression(MemberExpression(Super,
  "method"), [arg])` (via colon syntax)

### Question

`Super` is only valid in specific contexts (class constructors, class
methods). Should the compiler validate this, or just emit the node
and let the JS engine report errors?

## Topic C: Update operators `++` / `--`

### What ECMAScript defines

```javascript
++x   // prefix increment (returns new value)
x++   // postfix increment (returns old value)
--x   // prefix decrement
x--   // postfix decrement
```

ESTree: `UpdateExpression` — `{ operator, argument, prefix: boolean }`

### The gap analysis proposal

```lisp
(++ x)      ;; prefix ++x
(-- x)      ;; prefix --x
(post++ x)  ;; postfix x++
(post-- x)  ;; postfix x--
```

### Eslisp's approach

```lisp
(++ x)    ;; or (++_ x) — prefix
(_++ x)   ;; postfix
(-- x)    ;; or (--_ x) — prefix
(_-- x)   ;; postfix
```

The underscore shows where the operand goes visually.

### Questions

1. `(++ x)` / `(-- x)` for prefix is natural. The question is postfix.
   Options:
   - `(post++ x)` / `(post-- x)` — explicit word (proposal)
   - `(_++ x)` / `(_-- x)` — underscore convention (eslisp)
   - `(x++) / (x--)` — doesn't work, these would parse as atoms
   - Just don't support postfix? It's rarely needed as an expression.

2. Do we need these at all for v0.1.0? `(+= x 1)` covers the common
   case. Prefix/postfix distinction only matters when the return value
   is used (e.g., `arr[i++]`). Could defer to a later version.

## Topic D: Ternary conditional `?:`

### ECMAScript

```javascript
x > 0 ? "positive" : "non-positive"
```

### Proposed syntax

```lisp
(?: (> x 0) "positive" "non-positive")
```

ESTree: `ConditionalExpression` — test, consequent, alternate.

### Question

Is `?:` the right form name? It's terse and mirrors JS. Alternatives:
- `(if-expr test then else)` — verbose but clear about being an
  expression (vs `if` which is a statement)
- `(cond test then else)` — Lisp-ish
- `(?: test then else)` — mirrors JS (proposal)

Note: lykn's `if` is already `IfStatement`. Having `?:` for
`ConditionalExpression` is clean separation of statement vs expression.

## Topic E: `debugger`

```lisp
(debugger)
```

ESTree: `DebuggerStatement`. No arguments. Straightforward.

## Topic F: Labeled statements

```lisp
(label outer
  (for-of item items
    (if (done? item) (break outer))))
```

ESTree: `LabeledStatement` — `{ label: Identifier, body: Statement }`

### Question

Should the label name go through camelCase conversion?
`(label my-loop ...)` → `myLoop: ...`? Or should labels be raw?
Labels are identifiers in JS, so camelCase conversion should apply
for consistency.

## Topic G: `do...while`

```lisp
(do-while (> x 0) (-= x 1))
```

ESTree: `DoWhileStatement` — `{ test, body }`

### Question

The proposal puts the test first (like `while`), but JS puts the
test last (`do { ... } while (test)`). The proposal argues
test-first is consistent with lykn's convention. But it differs
from JS order. Which is more important — internal consistency or
JS alignment?

## Topic H: Sequence expression

```lisp
(seq a b c)    ;; -> a, b, c
```

ESTree: `SequenceExpression` — `{ expressions: [Expression] }`

Straightforward. `seq` is the same as eslisp. Rarely used but
needed for completeness.

## Topic I: Regex literals

```lisp
(regex "^hello" "gi")    ;; -> /^hello/gi
```

ESTree: `Literal` with `regex: { pattern, flags }` property.

### Question

Two-arg form: pattern, flags. One-arg form: pattern only (no flags).
Should flags be a string or individual atoms? String is simpler:
`(regex "pattern" "gi")`. Done.

## Topic J: Compound assignment operators

```lisp
(+= x 1)   (-= x 1)   (*= x 2)   (/= x 2)   (%= x 3)
(<<= x 1)  (>>= x 1)  (>>>= x 1)
(&= x 1)   (|= x 1)   (^= x 1)
(&&= x y)  (||= x y)  (??= x y)  (**= x 2)
```

ESTree: `AssignmentExpression` with the corresponding operator.
All take exactly 2 arguments.

### Question

This is mostly mechanical — register each operator. But should
logical assignment (`&&=`, `||=`, `??=`) and exponentiation (`**=`)
be in v0.1.0 or deferred? They're ES2021.

## Topic K: Exponentiation operator

`**` should be added to the binary operator list:

```lisp
(** 2 10)    ;; -> 2 ** 10
```

ESTree: `BinaryExpression` with operator `**`.

Currently not in lykn's operator table. Easy add.

## Goal

By the end of this discussion, decide on each topic A through K.
Most are quick confirmations. The meaty ones are update operator
syntax (C), ternary form name (D), and do-while ordering (G).

When we're done, I'll ask you to write a decision doc using the
template in this project.
