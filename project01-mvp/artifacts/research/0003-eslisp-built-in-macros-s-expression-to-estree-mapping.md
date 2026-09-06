# eslisp Built-in Macros: S-expression to ESTree Mapping

This document catalogs every built-in macro defined in eslisp's
`src/built-in-macros.ls`, plus the implicit compilation rules in
`src/compile.ls` (the `atom-to-estree`, `string-to-estree`, and
`list-to-estree` functions). Together these define the complete mapping from
eslisp S-expressions to ESTree AST nodes.

Source files examined:
- `workbench/eslisp/src/built-in-macros.ls` -- all named macros
- `workbench/eslisp/src/compile.ls` -- atom/string/list base compilation rules
- `workbench/eslisp/src/translate.ls` -- top-level Program wrapper
- `workbench/eslisp/src/es-statementify.ls` -- expression-to-statement coercion

---

## Implicit Compilation Rules (compile.ls)

These are not macros but the base-case compilation rules that apply when no
macro matches.

| S-expr type | Input | ESTree node | Notes |
|---|---|---|---|
| atom | `this` | `ThisExpression` | Special keyword |
| atom | `null` | `Literal` (value: null) | Special keyword |
| atom | `true` | `Literal` (value: true) | Special keyword |
| atom | `false` | `Literal` (value: false) | Special keyword |
| atom | positive number (e.g. `42`, `3.14`) | `Literal` (numeric) | Matched by regex `/^\d+(\.\d+)?$/` |
| atom | negative number (e.g. `-5`) | `UnaryExpression` (op: `-`, prefix, arg: Literal) | Matched by regex `/^-\d+(\.\d+)?$/` |
| atom | anything else | `Identifier` | Variable/name reference |
| string | `"hello"` | `Literal` (string) | |
| list | `()` (empty list) | `Literal` (value: null) | Empty list compiles to null |
| list | `(f a b)` (no macro match) | `CallExpression` | Head becomes callee, rest become arguments |

---

## Built-in Macros (built-in-macros.ls)

### Arithmetic Operators

| Macro | ESTree node | Args | Behavior |
|---|---|---|---|
| `+` | `BinaryExpression` (op: `+`) or `UnaryExpression` (op: `+`) | 1+ args | n-ary: 1 arg = unary `+x`, 2+ args = left-associative chained binary |
| `-` | `BinaryExpression` (op: `-`) or `UnaryExpression` (op: `-`) | 1+ args | n-ary: 1 arg = unary `-x`, 2+ args = left-associative chained binary |
| `*` | `BinaryExpression` (op: `*`) | 2+ args | Left-associative chained binary |
| `/` | `BinaryExpression` (op: `/`) | 2+ args | Left-associative chained binary |
| `%` | `BinaryExpression` (op: `%`) | 2+ args | Left-associative chained binary |

### Update Operators

| Macro | ESTree node | Args | Behavior |
|---|---|---|---|
| `++` | `UpdateExpression` (op: `++`, prefix: true) | exactly 1 | Synonym for `++_` |
| `++_` | `UpdateExpression` (op: `++`, prefix: true) | exactly 1 | Prefix increment |
| `_++` | `UpdateExpression` (op: `++`, prefix: false) | exactly 1 | Postfix increment |
| `--` | `UpdateExpression` (op: `--`, prefix: true) | exactly 1 | Synonym for `--_` |
| `--_` | `UpdateExpression` (op: `--`, prefix: true) | exactly 1 | Prefix decrement |
| `_--` | `UpdateExpression` (op: `--`, prefix: false) | exactly 1 | Postfix decrement |

### Logical Operators

| Macro | ESTree node | Args | Behavior |
|---|---|---|---|
| `&&` | `LogicalExpression` (op: `&&`) | 2+ args | Left-associative chained |
| `\|\|` | `LogicalExpression` (op: `\|\|`) | 2+ args | Left-associative chained |
| `!` | `UnaryExpression` (op: `!`, prefix: true) | exactly 1 | Logical NOT |

### Comparison Operators

| Macro | ESTree node | Args | Behavior |
|---|---|---|---|
| `<` | `BinaryExpression` (op: `<`) | 2+ args | Left-associative chained |
| `>` | `BinaryExpression` (op: `>`) | 2+ args | Left-associative chained |
| `<=` | `BinaryExpression` (op: `<=`) | 2+ args | Left-associative chained |
| `>=` | `BinaryExpression` (op: `>=`) | 2+ args | Left-associative chained |
| `==` | `BinaryExpression` (op: `==`) | 2+ args | Left-associative chained |
| `!=` | `BinaryExpression` (op: `!=`) | 2+ args | Left-associative chained |
| `===` | `BinaryExpression` (op: `===`) | 2+ args | Left-associative chained |
| `!==` | `BinaryExpression` (op: `!==`) | 2+ args | Left-associative chained |

### Bitwise Operators

| Macro | ESTree node | Args | Behavior |
|---|---|---|---|
| `&` | `BinaryExpression` (op: `&`) | 2+ args | Left-associative chained |
| `\|` | `BinaryExpression` (op: `\|`) | 2+ args | Left-associative chained |
| `^` | `BinaryExpression` (op: `^`) | 2+ args | Left-associative chained |
| `>>` | `BinaryExpression` (op: `>>`) | 2+ args | Left-associative chained |
| `<<` | `BinaryExpression` (op: `<<`) | 2+ args | Left-associative chained |
| `>>>` | `BinaryExpression` (op: `>>>`) | 2+ args | Left-associative chained |
| `~` | `UnaryExpression` (op: `~`, prefix: true) | exactly 1 | Bitwise NOT |

### Unary Keyword Operators

| Macro | ESTree node | Args | Behavior |
|---|---|---|---|
| `delete` | `UnaryExpression` (op: `delete`, prefix: true) | exactly 1 | |
| `typeof` | `UnaryExpression` (op: `typeof`, prefix: true) | exactly 1 | |
| `void` | `UnaryExpression` (op: `void`, prefix: true) | exactly 1 | |

### Binary Keyword Operators

| Macro | ESTree node | Args | Behavior |
|---|---|---|---|
| `instanceof` | `BinaryExpression` (op: `instanceof`) | 2+ args | Left-associative chained |
| `in` | `BinaryExpression` (op: `in`) | 2+ args | Left-associative chained |

### Assignment Operators

All assignment operators produce `AssignmentExpression` nodes and are
right-associative (the default for `chained-binary-expr`). With 2+ args they
chain; e.g. `(= a b c)` becomes `a = (b = c)`.

| Macro | ESTree node | Op | Args |
|---|---|---|---|
| `=` | `AssignmentExpression` | `=` | 2+ args |
| `+=` | `AssignmentExpression` | `+=` | 2+ args |
| `-=` | `AssignmentExpression` | `-=` | 2+ args |
| `*=` | `AssignmentExpression` | `*=` | 2+ args |
| `/=` | `AssignmentExpression` | `/=` | 2+ args |
| `%=` | `AssignmentExpression` | `%=` | 2+ args |
| `>>=` | `AssignmentExpression` | `>>=` | 2+ args |
| `<<=` | `AssignmentExpression` | `<<=` | 2+ args |
| `>>>=` | `AssignmentExpression` | `>>>=` | 2+ args |
| `&=` | `AssignmentExpression` | `&=` | 2+ args |
| `\|=` | `AssignmentExpression` | `\|=` | 2+ args |
| `^=` | `AssignmentExpression` | `^=` | 2+ args |

### Data Constructors

| Macro | ESTree node | Args | Behavior |
|---|---|---|---|
| `array` | `ArrayExpression` | 0+ args (variadic) | Each arg compiled as an element |
| `object` | `ObjectExpression` | even number of args | Alternating key-value pairs; each pair becomes a `Property` (kind: `init`) |
| `regex` | `Literal` (RegExp) | 1-2 args | `(regex pattern)` or `(regex pattern flags)`. Args are atoms whose `.value` is used raw |

### Variable Declaration

| Macro | ESTree node | Args | Behavior |
|---|---|---|---|
| `var` | `VariableDeclaration` (kind: `var`) | 1-2 args | `(var name)` or `(var name value)`. Produces a single `VariableDeclarator` |

### Control Flow

| Macro | ESTree node | Args | Behavior |
|---|---|---|---|
| `if` | `IfStatement` | 2-3 args | `(if test consequent)` or `(if test consequent alternate)`. Consequent and alternate are statementified |
| `?:` | `ConditionalExpression` | 3 args | `(?: test consequent alternate)` -- ternary expression form |
| `switch` | `SwitchStatement` | 2+ args | `(switch discriminant ...cases)`. Each case is a list `(test ...consequent)`. If test compiles to Identifier `default`, emits the default case (test: null) |
| `while` | `WhileStatement` | 2+ args | `(while test ...body)`. Body uses implicit block |
| `dowhile` | `DoWhileStatement` | 2+ args | `(dowhile test ...body)`. Body uses implicit block |
| `for` | `ForStatement` | 4+ args | `(for init test update ...body)`. init/test/update can be empty lists `()` for null. Body uses implicit block |
| `forin` | `ForInStatement` | 3+ args | `(forin left right ...body)`. Body uses implicit block |
| `break` | `BreakStatement` | 0-1 args | Optional label argument |
| `continue` | `ContinueStatement` | 0-1 args | Optional label argument |
| `label` | `LabeledStatement` | 1-2 args | `(label name)` or `(label name body)`. If no body, uses `EmptyStatement` |
| `return` | `ReturnStatement` | 0-1 args | Optional return value |
| `throw` | `ThrowStatement` | exactly 1 | |
| `debugger` | `DebuggerStatement` | 0 args | |

### Block

| Macro | ESTree node | Args | Behavior |
|---|---|---|---|
| `block` | `BlockStatement` | 0+ args (variadic) | Each arg compiled and statementified into the block body |

### Sequence

| Macro | ESTree node | Args | Behavior |
|---|---|---|---|
| `seq` | `SequenceExpression` | 0+ args (variadic) | Comma operator: `(seq a b c)` becomes `a, b, c` |

### Property Access

| Macro | ESTree node | Args | Behavior |
|---|---|---|---|
| `.` | `MemberExpression` | 1+ args | `(. obj prop)` -- dot access. Computed is true unless property is an `Identifier`. With 3+ args, chains left-associatively: `(. a b c)` becomes `a.b.c`. With 1 arg, just compiles that arg |
| `get` | `MemberExpression` (computed: always true) | 1+ args | Like `.` but always uses computed access (bracket notation). `(get obj key)` becomes `obj[key]`. Chains like `.` |

### Functions

| Macro | ESTree node | Args | Behavior |
|---|---|---|---|
| `lambda` | `FunctionExpression` | 1+ args | `(lambda (args) ...body)` or `(lambda name (args) ...body)`. First arg can optionally be an atom (function name/id), followed by a list of params, then body statements. Body uses implicit block |
| `function` | `FunctionDeclaration` | 1+ args | Same argument structure as `lambda` but produces a declaration. `(function name (args) ...body)` |
| `new` | `NewExpression` | 1+ args | `(new Constructor arg1 arg2 ...)`. First arg is the callee, rest are constructor arguments |

### Exception Handling

| Macro | ESTree node | Args | Behavior |
|---|---|---|---|
| `try` | `TryStatement` | 1+ args | Body statements plus optional `(catch param ...body)` and `(finally ...body)` clauses. Catch compiles to `CatchClause`. Finally compiles to a `BlockStatement` (the finalizer). Duplicate catch/finally clauses are errors |

### Quoting / Metaprogramming

| Macro | ESTree node | Args | Behavior |
|---|---|---|---|
| `quote` | (varies -- produces AST self-representation) | exactly 1 | Compiles the argument into an ESTree object that, when evaluated at runtime, produces the original S-expression AST node. Uses `compile-to-quote` (the `ast-to-self-producer` path in compile.ls) |
| `quasiquote` | (varies -- produces AST self-representation with splicing) | exactly 1 | Like `quote` but supports `unquote` and `unquote-splicing` inside. Unquoted parts are compiled normally; the rest is quoted. Generates `Array.prototype.concat` calls to merge quoted and unquoted segments at runtime |

### Macro Definition

| Macro | ESTree node | Args | Behavior |
|---|---|---|---|
| `macro` | null (compile-time side effect) | 1-2 args | Defines a user macro. `(macro name body)` defines a named macro from a function expression. `(macro name existing-name)` aliases one macro to another. `(macro object-expr)` defines multiple macros from an object's keys. `(macro name)` with just an atom masks/undefines that macro in the current scope. Returns null (no JS output) |
| `macroRequire` | null (compile-time side effect) | 1-2 args | Loads macros from an external file. `(macroRequire "file.js")` loads and imports all exported macros. `(macroRequire name "file.js")` loads and imports a single macro with the given name. Supports `.esl` files (compiled with eslisp first). Returns null |

---

## Helper Patterns Used by Macros

### chained-binary-expr(type, operator, associativity)

Factory function used by most binary operator macros. Behavior:
- 1 arg: compiles and returns the single argument (identity)
- 2 args: produces a node of the given `type` with `left`/`right`
- 3+ args: chains recursively according to `associativity` (`left` or `right`, default `right`)

Used for: all `BinaryExpression`, `LogicalExpression`, and `AssignmentExpression` macros.

### n-ary-expr(operator, associativity)

Extends `chained-binary-expr` to also handle the unary case:
- 1 arg: produces `UnaryExpression` (prefix: true)
- 2+ args: delegates to `chained-binary-expr` for `BinaryExpression`

Used for: `+` and `-` (which can be either unary or binary).

### optionally-implicit-block-statement(env, body)

If `body` has a single element that compiles to a `BlockStatement`, returns it
directly. Otherwise wraps all body statements in a new `BlockStatement`.

Used by: `lambda`, `function`, `while`, `dowhile`, `for`, `forin`, `try` (catch body).

### statementify(node)

Wraps expression nodes in `ExpressionStatement`; passes statement nodes through
unchanged. Applied to block bodies, switch case consequents, etc.

---

## Top-Level Compilation (translate.ls)

The top-level compiler wraps all compiled statements in a `Program` node:
- Each top-level S-expression is compiled via the macro system
- Results are flattened (macros can return arrays of nodes)
- Null returns (from `macro`/`macroRequire`) are filtered out
- Each remaining node is statementified
- The result is validated with esvalid

---

## Summary Statistics

- **Total named macros**: 54
  - Arithmetic: 5 (`+`, `-`, `*`, `/`, `%`)
  - Update: 6 (`++`, `++_`, `_++`, `--`, `--_`, `_--`)
  - Logical: 3 (`&&`, `||`, `!`)
  - Comparison: 8 (`<`, `>`, `<=`, `>=`, `==`, `!=`, `===`, `!==`)
  - Bitwise: 7 (`&`, `|`, `^`, `>>`, `<<`, `>>>`, `~`)
  - Keyword unary: 3 (`delete`, `typeof`, `void`)
  - Keyword binary: 2 (`instanceof`, `in`)
  - Assignment: 12 (`=`, `+=`, `-=`, `*=`, `/=`, `%=`, `>>=`, `<<=`, `>>>=`, `&=`, `|=`, `^=`)
  - Data constructors: 3 (`array`, `object`, `regex`)
  - Variable decl: 1 (`var`)
  - Control flow: 11 (`if`, `?:`, `switch`, `while`, `dowhile`, `for`, `forin`, `break`, `continue`, `label`, `return`, `throw`, `debugger`)
  - Block/sequence: 2 (`block`, `seq`)
  - Property access: 2 (`.`, `get`)
  - Functions: 3 (`lambda`, `function`, `new`)
  - Exception: 1 (`try`)
  - Quoting: 2 (`quote`, `quasiquote`)
  - Meta: 2 (`macro`, `macroRequire`)

- **ESTree node types produced**: 27+ distinct types
  (`ArrayExpression`, `AssignmentExpression`, `BinaryExpression`,
  `BlockStatement`, `BreakStatement`, `CallExpression`, `CatchClause`,
  `ConditionalExpression`, `ContinueStatement`, `DebuggerStatement`,
  `DoWhileStatement`, `ExpressionStatement`, `ForInStatement`, `ForStatement`,
  `FunctionDeclaration`, `FunctionExpression`, `Identifier`, `IfStatement`,
  `LabeledStatement`, `Literal`, `LogicalExpression`, `MemberExpression`,
  `NewExpression`, `ObjectExpression`, `ReturnStatement`, `SequenceExpression`,
  `SwitchCase`, `SwitchStatement`, `ThisExpression`, `ThrowStatement`,
  `TryStatement`, `UnaryExpression`, `UpdateExpression`, `VariableDeclaration`,
  `VariableDeclarator`, `WhileStatement`, `Program`)

Note: `unquote` and `unquote-splicing` are not standalone macros. They are
recognized only inside `quasiquote` bodies and handled inline by the
quasiquote implementation.
