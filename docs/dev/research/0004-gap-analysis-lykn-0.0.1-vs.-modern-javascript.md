# Gap Analysis: lykn 0.0.1 vs. Modern JavaScript

Cross-references:
- [01-estree-inventory.md](01-estree-inventory.md) -- full ESTree node catalog
- [02-astring-coverage.md](02-astring-coverage.md) -- astring's ESTree coverage
- [03-eslisp-macros.md](03-eslisp-macros.md) -- eslisp's macro table
- `src/compiler.js` -- lykn's current compiler
- `src/reader.js` -- lykn's current reader

---

## 4a. What lykn 0.0.1 Handles Today

### Compiler Macros (src/compiler.js)

| lykn Form | ESTree Node(s) Produced | Notes |
|-----------|------------------------|-------|
| `(var x 1)` | `VariableDeclaration` (kind: `var`) + `VariableDeclarator` | Single declarator only |
| `(const x 1)` | `VariableDeclaration` (kind: `const`) + `VariableDeclarator` | Single declarator only |
| `(let x 1)` | `VariableDeclaration` (kind: `let`) + `VariableDeclarator` | Single declarator only |
| `(. obj prop1 prop2)` | `MemberExpression` (chained) | Computed for numbers/strings, non-computed for atoms |
| `(=> (a b) body)` | `ArrowFunctionExpression` | Single body expr: `expression: true`; multi-body: `BlockStatement` wrapper |
| `(lambda (a b) body)` | `FunctionExpression` (id: null) | Always wraps body in `BlockStatement` |
| `(return expr)` | `ReturnStatement` | Optional argument |
| `(if test then else)` | `IfStatement` | 2 or 3 args; alternate is optional |
| `(block s1 s2 ...)` | `BlockStatement` | |
| `(= x 5)` | `AssignmentExpression` (op: `=`) | 2 args only (not chained) |
| `(new Ctor a b)` | `NewExpression` | |
| `(array 1 2 3)` | `ArrayExpression` | |
| `(object k1 v1 k2 v2)` | `ObjectExpression` with `Property` nodes | Keys: atoms become Identifiers; others compiled. Always `computed: false` |

#### Binary / Logical Operators (loop-registered)

All produce n-ary left-associative chains.

| Operators | ESTree Node |
|-----------|-------------|
| `+`, `-`, `*`, `/`, `%` | `BinaryExpression` |
| `===`, `!==`, `==`, `!=`, `<`, `>`, `<=`, `>=` | `BinaryExpression` |
| `&`, `\|`, `^`, `<<`, `>>`, `>>>` | `BinaryExpression` |
| `&&`, `\|\|` | `LogicalExpression` |
| `??` | `LogicalExpression` |

#### Unary Prefix Operators (loop-registered)

| Operators | ESTree Node |
|-----------|-------------|
| `!`, `~`, `typeof`, `void`, `delete` | `UnaryExpression` (prefix: true) |

#### Implicit Compilation Rules (compileExpr)

| Input | ESTree Node |
|-------|-------------|
| number literal | `Literal` (numeric) |
| string literal | `Literal` (string) |
| `true` / `false` | `Literal` (boolean) |
| `null` | `Literal` (null) |
| `undefined` | `Identifier` (name: `"undefined"`) |
| any other atom | `Identifier` |
| empty list `()` | `ArrayExpression` (empty) |
| list with no macro match | `CallExpression` |

#### Top-Level

- `compile()` wraps everything in `Program` (sourceType: `"module"`) and uses `toStatement()` to wrap expressions in `ExpressionStatement`.
- `toStatement()` also produces `EmptyStatement` for null nodes.

### Reader (src/reader.js)

The reader produces four node types: `list`, `atom`, `string`, `number`. It handles:
- Parenthesized lists
- Double-quoted strings with `\n`, `\t`, `\\`, `\"` escapes
- Numeric literals (integers and decimals, with optional leading `-`)
- Atoms (everything else until whitespace or parens)
- Line comments starting with `;`

Notable limitations:
- No special handling of colons in atoms (no member-access sugar)
- No quote/unquote syntax (`'`, `` ` ``, `,`, `,@`)
- No character literals, regex literals, or template literal syntax
- No reader macros

### Summary: Distinct ESTree Node Types Currently Produced

1. `ArrayExpression`
2. `ArrowFunctionExpression`
3. `AssignmentExpression`
4. `BinaryExpression`
5. `BlockStatement`
6. `CallExpression`
7. `EmptyStatement`
8. `ExpressionStatement`
9. `FunctionExpression`
10. `Identifier`
11. `IfStatement`
12. `Literal`
13. `LogicalExpression`
14. `MemberExpression`
15. `NewExpression`
16. `ObjectExpression`
17. `Program`
18. `Property`
19. `ReturnStatement`
20. `UnaryExpression`
21. `VariableDeclaration`
22. `VariableDeclarator`

**22 ESTree node types** out of the ~53 that astring supports.

### Comparison with eslisp

Forms lykn has that eslisp lacks: `const`, `let`, `=>` (arrow), `??` (nullish coalescing).

Forms eslisp has that lykn lacks: `while`, `dowhile`, `for`, `forin`, `switch`, `?:` (ternary), `try`/`catch`/`finally`, `throw`, `break`, `continue`, `label`, `debugger`, `++`/`--` (update), `seq` (sequence), `regex`, `function` (declaration), compound assignment (`+=`, `-=`, etc.), `quote`/`quasiquote`/`macro`.

---

## 4b. What's Missing for Modern JS

The following lists compare lykn's current coverage against all concrete ESTree node types that astring supports. Nodes lykn already emits are excluded.

### Essential (Blocking Real Usage)

These are needed to write any non-trivial JS program.

| Missing Capability | ESTree Node(s) | Why Essential |
|-------------------|----------------|---------------|
| `import` declarations | `ImportDeclaration`, `ImportSpecifier`, `ImportDefaultSpecifier`, `ImportNamespaceSpecifier` | Cannot use modules without this; lykn already sets `sourceType: "module"` |
| `export` declarations | `ExportNamedDeclaration`, `ExportDefaultDeclaration`, `ExportAllDeclaration`, `ExportSpecifier` | Cannot expose module API |
| `for...of` loop | `ForOfStatement` | Primary iteration pattern for arrays, iterables |
| Template literals | `TemplateLiteral`, `TemplateElement` | String interpolation is fundamental to modern JS |
| Spread/rest | `SpreadElement`, `RestElement` | Used everywhere: function args, array/object construction, destructuring |
| Destructuring patterns | `ObjectPattern`, `ArrayPattern`, `AssignmentPattern` | Needed for `const {a, b} = obj`, `const [x, y] = arr`, default values |
| `async`/`await` | `AwaitExpression` + `async` flag on functions | Async code is the norm in JS |
| Arrow functions with destructured params | `ArrowFunctionExpression` params as patterns | Already have arrows, but params can only be simple identifiers |
| `throw` | `ThrowStatement` | Cannot signal errors |
| `try`/`catch`/`finally` | `TryStatement`, `CatchClause` | Cannot handle errors |
| Function declarations | `FunctionDeclaration` | Hoisted functions; essential for many patterns |
| `while` loop | `WhileStatement` | Basic looping |
| `for` loop | `ForStatement` | Classic C-style loop |
| Compound assignment | `AssignmentExpression` with `+=`, `-=`, etc. | Very common; lykn only has `=` |
| `break` / `continue` | `BreakStatement`, `ContinueStatement` | Cannot control loop flow |

### Important (Needed Soon)

| Missing Capability | ESTree Node(s) | Why Important |
|-------------------|----------------|---------------|
| Classes | `ClassDeclaration`, `ClassExpression`, `ClassBody`, `MethodDefinition` | Standard OOP pattern in JS |
| Computed property names | `Property` with `computed: true` | `{[expr]: val}` is common |
| Default parameters | `AssignmentPattern` in function params | Very common pattern |
| `for...in` loop | `ForInStatement` | Object key iteration |
| `switch`/`case` | `SwitchStatement`, `SwitchCase` | Multi-branch dispatch |
| Ternary `?:` | `ConditionalExpression` | Inline conditionals |
| Update operators `++`/`--` | `UpdateExpression` | Increment/decrement |
| Sequence expression | `SequenceExpression` | Comma operator |
| `do...while` loop | `DoWhileStatement` | Less common but needed |
| Tagged templates | `TaggedTemplateExpression` | Used by libraries (e.g., `html\`...\``) |
| Dynamic `import()` | `ImportExpression` | Code splitting |
| `super` | `Super` | Required with classes |
| `this` | `ThisExpression` | Already handled implicitly (compiles to `Identifier` `this`), but should produce proper `ThisExpression` |
| `debugger` | `DebuggerStatement` | Debugging |
| Labeled statements | `LabeledStatement` | Needed for breaking out of nested loops |
| Regex literals | `RegExpLiteral` | Pattern matching |

### Nice to Have (Can Wait)

| Missing Capability | ESTree Node(s) | Why It Can Wait |
|-------------------|----------------|-----------------|
| Generators / `yield` | `YieldExpression` + `generator` flag | Rarely used directly |
| `for await...of` | `ForOfStatement` with `await: true` | Async iteration is niche |
| Optional chaining `?.` | `ChainExpression`, `MemberExpression` (optional), `CallExpression` (optional) | Sugar; can use explicit checks |
| Private fields `#name` | `PrivateIdentifier`, `PropertyDefinition` | Newer feature, limited adoption |
| Static blocks | `StaticBlock` | ES2022, very niche |
| Class fields | `PropertyDefinition` | Can use constructor assignment |
| `MetaProperty` | `MetaProperty` | `new.target`, `import.meta` are specialized |
| `BigInt` literals | `BigIntLiteral` | Specialized numeric work |
| `with` statement | `WithStatement` | Deprecated, should not support |
| Logical assignment `||=`, `&&=`, `??=` | `AssignmentExpression` with logical ops | Sugar over existing patterns |
| Exponentiation `**` | `BinaryExpression` (op: `**`) | Minor; `Math.pow` works |

### Coverage Gap Summary

| Category | lykn 0.0.1 | astring supports | Gap |
|----------|-----------|-----------------|-----|
| Distinct ESTree node types | 22 | ~53 | ~31 missing |
| Essential gaps | -- | -- | 15 capabilities |
| Important gaps | -- | -- | 16 capabilities |
| Nice-to-have gaps | -- | -- | 11 capabilities |

---

## 4c. Proposed lykn Syntax for Missing Forms

### Design Principles Recap

1. **Colon syntax for member access**: `(obj:method args)` compiles to `obj.method(args)`
2. **Lisp-case to camelCase**: `my-function` becomes `myFunction`
3. **No user-defined macros**: all forms are built-in
4. **No runtime**: compiled output is plain JS
5. **Thin skin over JS**: forms map directly to JS constructs

### Reader Changes for Colon Syntax

The reader currently treats colons as ordinary atom characters. To support `console:log`, the reader (or compiler) needs to split colon-containing atoms into member expressions.

**Recommended approach: handle at compile time (not in the reader).**

Rationale: Keeping the reader simple (four node types: atom, number, string, list) is valuable. The compiler already dispatches on atom values, so it can split atoms containing `:` into `MemberExpression` chains.

Implementation:
- In `compileExpr`, when processing an `atom` node, check if `node.value` contains `:`
- If so, split on `:` to get segments: `"console:log"` becomes `["console", "log"]`
- Build a chained `MemberExpression` from left to right
- When such an atom appears in the head of a list, the call becomes a method call automatically (the `CallExpression` wraps the `MemberExpression` callee)
- Edge case: atoms starting with `:` (like `:keyword`) should NOT be split -- treat as a regular identifier (or reserve for future keyword syntax)
- Edge case: atoms with multiple colons (`a:b:c`) produce chained access: `a.b.c`

```javascript
// In compileExpr, atom case:
case 'atom': {
  if (node.value === 'true') return { type: 'Literal', value: true };
  // ... other special atoms ...

  if (node.value.includes(':') && !node.value.startsWith(':')) {
    const parts = node.value.split(':');
    let result = { type: 'Identifier', name: toCamelCase(parts[0]) };
    for (let i = 1; i < parts.length; i++) {
      result = {
        type: 'MemberExpression',
        object: result,
        property: { type: 'Identifier', name: toCamelCase(parts[i]) },
        computed: false,
      };
    }
    return result;
  }

  return { type: 'Identifier', name: toCamelCase(node.value) };
}
```

The `toCamelCase` function converts `my-var-name` to `myVarName`. It should NOT convert atoms that are already camelCase or contain only uppercase (e.g., `JSON`, `URL`).

```javascript
function toCamelCase(name) {
  // Don't convert operators, keywords, or names without hyphens
  if (!name.includes('-')) return name;
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
```

---

### Essential Forms

#### Module System: `import` / `export`

```lisp
;; Named import
;; import { readFile, writeFile } from "node:fs";
(import (read-file write-file) "node:fs")

;; Default import
;; import express from "express";
(import-default express "express")

;; Namespace import
;; import * as path from "node:path";
(import-all path "node:path")

;; Renamed import
;; import { readFile as read } from "node:fs";
(import ((read-file read)) "node:fs")
;; The inner list (read-file read) means "import read-file as read"

;; Named export
;; export const x = 42;
(export (const x 42))

;; Export default
;; export default function handler() { ... }
(export-default (lambda () ...))

;; Re-export all
;; export * from "./utils.js";
(export-all "./utils.js")

;; Re-export named
;; export { foo, bar } from "./utils.js";
(export-from (foo bar) "./utils.js")
```

**ESTree nodes**: `ImportDeclaration`, `ImportSpecifier`, `ImportDefaultSpecifier`, `ImportNamespaceSpecifier`, `ExportNamedDeclaration`, `ExportDefaultDeclaration`, `ExportAllDeclaration`, `ExportSpecifier`.

**eslisp comparison**: eslisp has no module support at all. lykn is ahead here.

#### `for...of` Loop

```lisp
;; for (const item of items) { console:log(item); }
(for-of item items
  (console:log item))

;; With destructuring:
;; for (const [key, value] of entries) { ... }
(for-of (array-pat key value) entries
  (console:log key value))
```

**ESTree**: `ForOfStatement` with `VariableDeclaration` (kind: `const`) as `left`.

**eslisp comparison**: eslisp has `forin` but no `forof`. lykn's `for-of` maps directly to JS.

#### Template Literals

```lisp
;; `Hello, ${name}!`
(template "Hello, " name "!")

;; Tagged: html`<div>${content}</div>`
(tag html (template "<div>" content "</div>"))
```

String segments and expressions alternate: string segments become `TemplateElement` nodes, expressions become the `expressions` array of `TemplateLiteral`.

**ESTree**: `TemplateLiteral`, `TemplateElement`, `TaggedTemplateExpression`.

#### Spread and Rest

```lisp
;; Spread in function call: fn(...args)
(fn (spread args))

;; Spread in array: [...a, ...b]
(array (spread a) (spread b))

;; Rest in function params: function f(a, ...rest) {}
(lambda (a (rest args)) ...)

;; Spread in object: { ...defaults, ...overrides }
(object (spread defaults) (spread overrides))
```

**ESTree**: `SpreadElement`, `RestElement`.

**Note**: `(spread x)` compiles to `SpreadElement`; `(rest x)` in parameter position compiles to `RestElement`.

#### Destructuring Patterns

```lisp
;; Object destructuring: const { a, b } = obj;
(const (obj-pat a b) obj)

;; With rename: const { name: n, age: a } = person;
(const (obj-pat (name n) (age a)) person)

;; With default: const { x = 0, y = 0 } = point;
(const (obj-pat (x 0) (y 0)) point)

;; Array destructuring: const [first, second] = arr;
(const (array-pat first second) arr)

;; With rest: const [head, ...tail] = arr;
(const (array-pat head (rest tail)) arr)

;; Nested: const { data: [first] } = response;
(const (obj-pat (data (array-pat first))) response)
```

**ESTree**: `ObjectPattern`, `ArrayPattern`, `AssignmentPattern`, `RestElement`.

**Design note**: `obj-pat` and `array-pat` are the destructuring forms. Plain `(a b)` in parameter lists remains a params list. The explicit `obj-pat`/`array-pat` markers avoid ambiguity.

#### Async / Await

```lisp
;; async arrow: const handler = async (req) => { ... }
(const handler (async (=> (req) ...)))

;; async function declaration: async function fetchData() { ... }
(async (defn fetch-data ()
  (const data (await (fetch url)))
  (return (await (data:json)))))

;; await expression
(const result (await (fetch url)))
```

**ESTree**: `AwaitExpression`, plus `async: true` flag on `ArrowFunctionExpression` / `FunctionDeclaration` / `FunctionExpression`.

**Design note**: `async` wraps a function form and sets the `async` flag. `await` is a unary form.

#### Error Handling: `throw`, `try`/`catch`/`finally`

```lisp
;; throw new Error("oops")
(throw (new Error "oops"))

;; try/catch
(try
  (do-something)
  (catch e
    (console:log e)))

;; try/catch/finally
(try
  (do-something)
  (catch e
    (console:log e))
  (finally
    (cleanup)))

;; try/finally (no catch)
(try
  (do-something)
  (finally
    (cleanup)))
```

**ESTree**: `ThrowStatement`, `TryStatement`, `CatchClause`.

**eslisp comparison**: Very similar to eslisp's `try` macro. The catch/finally clauses are recognized by their head atom within the try body.

#### Function Declarations

```lisp
;; function add(a, b) { return a + b; }
(defn add (a b)
  (return (+ a b)))
```

**ESTree**: `FunctionDeclaration`.

**Design note**: Use `defn` rather than `function` (too long) or `fn` (ambiguous with expression form). `defn` is familiar from Clojure. `lambda` remains the anonymous `FunctionExpression` form.

#### `while` Loop

```lisp
;; while (x > 0) { x--; }
(while (> x 0)
  (-- x))
```

**ESTree**: `WhileStatement`.

#### `for` Loop (C-style)

```lisp
;; for (let i = 0; i < 10; i++) { ... }
(for (let i 0) (< i 10) (++ i)
  (console:log i))
```

**ESTree**: `ForStatement`.

#### Compound Assignment Operators

```lisp
(+= x 1)
(-= x 1)
(*= x 2)
(/= x 2)
(%%= x 3)    ;; Note: %% because % is already modulo
(&&= x y)
(||= x y)
(??= x y)
(**= x 2)
```

Wait -- `%=` does not conflict with `%` (different arity/form), so:

```lisp
(+= x 1)   (-= x 1)   (*= x 2)   (/= x 2)   (%= x 3)
(<<= x 1)  (>>= x 1)  (>>>= x 1)
(&= x 1)   (|= x 1)   (^= x 1)
(&&= x y)  (||= x y)  (??= x y)
(**= x 2)
```

**ESTree**: `AssignmentExpression` with corresponding operators. All take exactly 2 args.

#### `break` / `continue`

```lisp
(break)
(break my-label)
(continue)
(continue my-label)
```

**ESTree**: `BreakStatement`, `ContinueStatement`.

#### Destructured Arrow Parameters

Already supported by combining arrow syntax with destructuring patterns:

```lisp
;; ({ name, age }) => { ... }
(=> ((obj-pat name age))
  (console:log name age))
```

---

### Important Forms

#### Classes

```lisp
;; class Animal { constructor(name) { this.name = name; } speak() { ... } }
(class Animal ()
  (constructor (name)
    (= this:name name))
  (speak ()
    (console:log this:name)))

;; class Dog extends Animal { ... }
(class Dog (Animal)
  (constructor (name breed)
    (super name)
    (= this:breed breed)))

;; Class expression
(const my-class (class-expr () ...))
```

**ESTree**: `ClassDeclaration`, `ClassExpression`, `ClassBody`, `MethodDefinition`, `Super`.

**Design note**: Second arg is the superclass list -- empty `()` means no extends, `(Animal)` means `extends Animal`. Methods are lists starting with the method name, then params, then body. Special method names: `constructor`, `get-*`, `set-*`, `static-*`.

#### Computed Property Names

```lisp
;; { [Symbol.iterator]: function() { ... } }
(object (computed (. Symbol iterator)) (lambda () ...))
```

When a key in `(object ...)` is wrapped in `(computed ...)`, the `Property` node sets `computed: true`.

**ESTree**: `Property` with `computed: true`.

#### Default Parameters

```lisp
;; function greet(name = "world") { ... }
(defn greet ((name "world"))
  (console:log (template "Hello, " name "!")))
```

A parameter that is itself a list `(name default-value)` compiles to `AssignmentPattern`.

**ESTree**: `AssignmentPattern`.

#### `for...in` Loop

```lisp
;; for (const key in obj) { ... }
(for-in key obj
  (console:log key))
```

**ESTree**: `ForInStatement`.

#### `switch` / `case`

```lisp
;; switch (action) { case "run": ...; break; default: ... }
(switch action
  ("run" (do-run) (break))
  ("walk" (do-walk) (break))
  (default (do-nothing)))
```

**ESTree**: `SwitchStatement`, `SwitchCase`.

**eslisp comparison**: Similar to eslisp. Each case is a list whose first element is the test value (or `default`), rest are body statements.

#### Ternary `?:`

```lisp
;; x > 0 ? "positive" : "non-positive"
(?: (> x 0) "positive" "non-positive")
```

**ESTree**: `ConditionalExpression`.

#### Update Operators

```lisp
(++ x)    ;; prefix ++x
(-- x)    ;; prefix --x
(post++ x) ;; postfix x++
(post-- x) ;; postfix x--
```

**ESTree**: `UpdateExpression`.

#### Sequence Expression

```lisp
;; (a, b, c)
(seq a b c)
```

**ESTree**: `SequenceExpression`.

#### `do...while` Loop

```lisp
(do-while (> x 0)
  (-= x 1))
```

**ESTree**: `DoWhileStatement`.

**Note**: Test comes first (like `while`), body follows. This differs from JS syntax order but is consistent with lykn's convention of test-then-body.

#### Tagged Templates

```lisp
;; html`<div>${content}</div>`
(tag html (template "<div>" content "</div>"))
```

**ESTree**: `TaggedTemplateExpression`.

#### Dynamic Import

```lisp
;; const mod = await import("./module.js");
(const mod (await (dynamic-import "./module.js")))
```

**ESTree**: `ImportExpression`.

#### `super`

Available automatically within class methods via the colon syntax:

```lisp
;; super.method(arg)  ->  (super:method arg)
;; super(arg)         ->  (super arg)
```

The atom `super` compiles to a `Super` node (similar to how `this` should compile to `ThisExpression`).

#### `this`

Currently compiles to `Identifier` `"this"` which works in practice (astring emits `this` for an Identifier named `this`), but should produce `ThisExpression` for correctness:

```lisp
this        ;; -> ThisExpression
this:name   ;; -> MemberExpression(ThisExpression, "name")
```

#### `debugger`

```lisp
(debugger)
```

**ESTree**: `DebuggerStatement`.

#### Labeled Statements

```lisp
;; outer: for (...) { ... break outer; }
(label outer
  (for-of item items
    (if (done? item) (break outer))))
```

**ESTree**: `LabeledStatement`.

#### Regex Literals

```lisp
;; /pattern/flags
(regex "^hello" "gi")
```

**ESTree**: `Literal` with `regex` property.

---

### Nice-to-Have Forms

#### Generators

```lisp
;; function* gen() { yield 1; yield 2; }
(defn* my-gen ()
  (yield 1)
  (yield 2))

;; yield*
(yield* other-gen)
```

**ESTree**: `YieldExpression`, plus `generator: true` flag on function.

#### `for await...of`

```lisp
(for-await-of item stream
  (console:log item))
```

**ESTree**: `ForOfStatement` with `await: true`.

#### Optional Chaining

```lisp
;; obj?.prop?.method()
(obj?.prop?.method)

;; Or more explicit:
(?. obj prop method)
```

**Recommended**: The `?.` form mirrors `.` but wraps in `ChainExpression` and sets `optional: true` on inner nodes.

```lisp
(?. obj prop)          ;; obj?.prop
(?.call obj method a)  ;; obj?.method(a)
(?. obj (get idx))     ;; obj?.[idx]
```

**ESTree**: `ChainExpression`, `MemberExpression` (optional), `CallExpression` (optional).

#### Nullish Coalescing

Already supported: `(?? a b)` works today via the binary operator loop.

#### Logical Assignment

Listed above under compound assignment: `(&&= x y)`, `(||= x y)`, `(??= x y)`.

#### Exponentiation

Already supported: `(**` is not in the current operator list but `**` should be added to `binaryOps`.

```lisp
(** 2 10)   ;; 2 ** 10
(**= x 2)   ;; x **= 2
```

#### Private Fields

```lisp
(class Counter ()
  (field #count 0)          ;; #count = 0
  (increment ()
    (+= this:#count 1))
  (get-count ()
    (return this:#count)))
```

**Design note**: `#` prefix on atoms produces `PrivateIdentifier`. The reader would need to allow `#` in atom characters (it already does, since `#` is not a delimiter). In the compiler, atoms starting with `#` in the right context produce `PrivateIdentifier` nodes.

**ESTree**: `PrivateIdentifier`, `PropertyDefinition`.

#### Static Blocks

```lisp
(class Foo ()
  (static-block
    (= Foo:instance (new Foo))))
```

**ESTree**: `StaticBlock`.

#### Class Fields

```lisp
(class Point ()
  (field x 0)
  (field y 0)
  (static-field origin (new Point 0 0)))
```

**ESTree**: `PropertyDefinition` (with `static` flag).

#### `MetaProperty`

```lisp
(new:target)     ;; new.target (via colon syntax, naturally)
(import:meta)    ;; import.meta
```

These fall out of the colon syntax if `new` and `import` are recognized as special atoms that compile to `MetaProperty` when accessed with `:`.

**ESTree**: `MetaProperty`.

#### BigInt Literals

```lisp
42n   ;; reader recognizes trailing 'n' on integers
```

The reader would need to detect the `n` suffix and produce a `bigint` node type.

**ESTree**: `Literal` with `bigint` property.

---

## Implementation Priority Roadmap

### Phase 1: Core Language (make lykn usable)

1. **Colon syntax** for member access (compiler change)
2. **Lisp-case to camelCase** conversion
3. **`this`** / **`super`** as proper ESTree nodes
4. **`defn`** (function declarations)
5. **`throw`**, **`try`/`catch`/`finally`**
6. **`while`**, **`for`**, **`break`**, **`continue`**
7. **`import`** / **`export`** (all forms)
8. **Compound assignment** operators (`+=`, `-=`, etc.)
9. **`async`** / **`await`**

### Phase 2: Modern JS Patterns

10. **Template literals**
11. **Destructuring** (`obj-pat`, `array-pat`)
12. **Spread** / **rest**
13. **`for-of`**, **`for-in`**
14. **Default parameters**
15. **Ternary `?:`**, **`switch`**
16. **Update operators** `++`/`--`
17. **Classes**

### Phase 3: Completeness

18. Dynamic `import()`
19. Generators / `yield`
20. Tagged templates
21. Optional chaining `?.`
22. Regex literals
23. Labeled statements, `debugger`, `do-while`, `seq`
24. Private fields, static blocks, class fields
25. `MetaProperty`, BigInt

### Estimated Scope

- **Phase 1**: ~15 new forms, ~12 new ESTree node types. This is the minimum to write real programs.
- **Phase 2**: ~12 new forms, ~10 new ESTree node types. Covers modern idiomatic JS.
- **Phase 3**: ~10 new forms, ~8 new ESTree node types. Full coverage of astring-supported nodes.

After all three phases, lykn would produce all ~53 ESTree node types that astring supports, enabling compilation of essentially any JavaScript program expressible as S-expressions.
