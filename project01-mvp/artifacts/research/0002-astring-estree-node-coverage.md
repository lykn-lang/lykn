# Astring ESTree Node Coverage

Source analyzed: `workbench/astring/src/astring.js`
ESTree spec reference: `workbench/estree/` (es5.md through es2022.md)

## Supported Node Types

These are properties on the `GENERATOR` object in astring, each a function that emits JavaScript for that node type.

### Programs and Blocks

| Node Type | JS Construct |
|-----------|-------------|
| `Program` | Top-level program; iterates over `body` statements |
| `BlockStatement` | `{ ... }` block |
| `StaticBlock` | `static { ... }` class static initializer (ES2022) |
| `EmptyStatement` | `;` |

### Statements

| Node Type | JS Construct |
|-----------|-------------|
| `ExpressionStatement` | Expression followed by `;` |
| `IfStatement` | `if (...) ... else ...` |
| `LabeledStatement` | `label: statement` |
| `BreakStatement` | `break;` / `break label;` |
| `ContinueStatement` | `continue;` / `continue label;` |
| `WithStatement` | `with (obj) { ... }` |
| `SwitchStatement` | `switch (...) { case: ... }` (handles `SwitchCase` inline) |
| `ReturnStatement` | `return expr;` |
| `ThrowStatement` | `throw expr;` |
| `TryStatement` | `try/catch/finally` (handles `CatchClause` inline) |
| `WhileStatement` | `while (...) { ... }` |
| `DoWhileStatement` | `do { ... } while (...);` |
| `ForStatement` | `for (init; test; update) { ... }` |
| `ForInStatement` | `for (x in obj) { ... }` |
| `ForOfStatement` | `for (x of iter) { ... }` (reuses ForInStatement; supports `for await`) |
| `DebuggerStatement` | `debugger;` |

### Declarations

| Node Type | JS Construct |
|-----------|-------------|
| `FunctionDeclaration` | `function name(...) { ... }` (async/generator) |
| `VariableDeclaration` | `var`/`let`/`const` declaration |
| `VariableDeclarator` | `name = init` |
| `ClassDeclaration` | `class Name extends Super { ... }` |

### Expressions

| Node Type | JS Construct |
|-----------|-------------|
| `FunctionExpression` | `function(...) { ... }` (reuses FunctionDeclaration) |
| `ArrowFunctionExpression` | `(...) => ...` |
| `ClassExpression` | `class { ... }` (reuses ClassDeclaration) |
| `ThisExpression` | `this` |
| `Super` | `super` |
| `YieldExpression` | `yield expr` / `yield* expr` |
| `AwaitExpression` | `await expr` |
| `ArrayExpression` | `[a, b, c]` |
| `ObjectExpression` | `{ key: value }` |
| `SequenceExpression` | `(a, b, c)` |
| `UnaryExpression` | `!x`, `typeof x`, `-x` |
| `UpdateExpression` | `++x`, `x--` |
| `AssignmentExpression` | `x = y`, `x += y` |
| `BinaryExpression` | `a + b`, `a instanceof b` |
| `LogicalExpression` | `a \|\| b`, `a && b`, `a ?? b` (reuses BinaryExpression) |
| `ConditionalExpression` | `test ? a : b` |
| `NewExpression` | `new Foo(...)` |
| `CallExpression` | `foo(...)` (supports `?.()`) |
| `MemberExpression` | `obj.prop` / `obj[expr]` (supports `?.`) |
| `ChainExpression` | Optional chaining wrapper (ES2020) |
| `MetaProperty` | `new.target`, `import.meta` |
| `ImportExpression` | `import(source)` (dynamic import) |
| `TaggedTemplateExpression` | `` tag`...` `` |
| `TemplateLiteral` | `` `hello ${name}` `` |
| `TemplateElement` | Raw text segment in template literal |

### Patterns

| Node Type | JS Construct |
|-----------|-------------|
| `Identifier` | Variable/function name |
| `PrivateIdentifier` | `#name` (ES2022) |
| `Literal` | String, number, boolean, null, RegExp, BigInt |
| `RegExpLiteral` | `/pattern/flags` |
| `ObjectPattern` | `{ a, b: c, ...rest }` |
| `ArrayPattern` | `[a, b, ...rest]` (reuses ArrayExpression) |
| `RestElement` | `...rest` |
| `SpreadElement` | `...iter` (reuses RestElement) |
| `AssignmentPattern` | `param = defaultValue` |
| `Property` | `key: value` (method, getter/setter, shorthand, computed) |

### Class Members

| Node Type | JS Construct |
|-----------|-------------|
| `ClassBody` | Class body (reuses BlockStatement) |
| `MethodDefinition` | Class method/getter/setter/constructor |
| `PropertyDefinition` | Class field `name = value;` (ES2022) |

### Modules

| Node Type | JS Construct |
|-----------|-------------|
| `ImportDeclaration` | `import ... from "mod";` (handles all specifier types inline; supports `with` attributes) |
| `ImportAttribute` | `type: "json"` in import attributes (ES2025) |
| `ExportDefaultDeclaration` | `export default ...;` |
| `ExportNamedDeclaration` | `export { a, b };` / `export const x = 1;` (supports `with` attributes) |
| `ExportAllDeclaration` | `export * from "mod";` / `export * as name from "mod";` |

### Handled Inline (no dedicated GENERATOR property)

- `SwitchCase` — inline in `SwitchStatement`
- `CatchClause` — inline in `TryStatement`
- `ImportSpecifier`, `ImportDefaultSpecifier`, `ImportNamespaceSpecifier` — inline in `ImportDeclaration`
- `ExportSpecifier` — inline in `ExportNamedDeclaration`

**Total: ~53 distinct ESTree node types handled** (47 explicit GENERATOR properties + 6 inline).

---

## Unsupported ESTree Node Types

### Abstract/Enum Types (no handler needed)

`Node`, `Statement`, `Declaration`, `Expression`, `Pattern`, `Function`, `Class`, `ImportOrExportDeclaration`, `ModuleSpecifier`, `ChainElement`, `UnaryOperator`, `UpdateOperator`, `BinaryOperator`, `AssignmentOperator`, `LogicalOperator` — these are abstract interfaces or enums that never appear as a `node.type` value.

### Truly Unsupported from the Standard Spec

**None.** Astring covers all concrete node types from ES5 through ES2022 that a compliant parser would produce.

### Deprecated/Defunct (not supported, not needed)

From `deprecated.md` (SpiderMonkey/E4X): `LetStatement`, `LetExpression`, `ComprehensionExpression`, `GeneratorExpression`, `GraphExpression`, `GraphIndexExpression`, `ComprehensionBlock`, and all XML* types (15 types total).

### Stage 3 Proposals (not yet standardized, not supported)

- **Decorators** — `Decorator` node type
- **Deferred import evaluation** — extends `ImportDeclaration`
- **Source phase imports** — extends `ImportDeclaration`, adds `ImportExpression.phase`

---

## Summary

Astring provides **complete coverage** of all concrete ESTree node types from ES5 through ES2022. For lykn's compiler, any standard ESTree AST node the compiler produces will be correctly serialized to JavaScript by astring.
