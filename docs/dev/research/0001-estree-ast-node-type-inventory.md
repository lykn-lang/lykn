# ESTree AST Node Type Inventory

A comprehensive catalog of every AST node type defined in the ESTree specification, from ES5 through ES2022.

---

## ES5 (es5.md)

### Base Interfaces

| Node Type | Category | Properties |
|-----------|----------|------------|
| Node | Other | type, loc |
| SourceLocation | Other | source, start, end |
| Position | Other | line, column |
| Function (base) | Other | id, params, body |
| Statement (base) | Other | _(empty interface)_ |
| Expression (base) | Other | _(empty interface)_ |
| Pattern (base) | Other | _(empty interface)_ |
| Declaration (base) | Other | _(empty interface, extends Statement)_ |

### Concrete Node Types

| Node Type | ES Version | Properties | Category |
|-----------|-----------|------------|----------|
| Identifier | ES5 | name | Expression / Pattern |
| Literal | ES5 | value | Literal |
| RegExpLiteral | ES5 | value, regex (regex.pattern, regex.flags) | Literal |
| Program | ES5 | body | Other |
| ExpressionStatement | ES5 | expression | Statement |
| Directive | ES5 | expression, directive | Statement |
| BlockStatement | ES5 | body | Statement |
| FunctionBody | ES5 | body | Statement |
| EmptyStatement | ES5 | _(none)_ | Statement |
| DebuggerStatement | ES5 | _(none)_ | Statement |
| WithStatement | ES5 | object, body | Statement |
| ReturnStatement | ES5 | argument | Statement |
| LabeledStatement | ES5 | label, body | Statement |
| BreakStatement | ES5 | label | Statement |
| ContinueStatement | ES5 | label | Statement |
| IfStatement | ES5 | test, consequent, alternate | Statement |
| SwitchStatement | ES5 | discriminant, cases | Statement |
| SwitchCase | ES5 | test, consequent | Clause |
| ThrowStatement | ES5 | argument | Statement |
| TryStatement | ES5 | block, handler, finalizer | Statement |
| CatchClause | ES5 | param, body | Clause |
| WhileStatement | ES5 | test, body | Statement |
| DoWhileStatement | ES5 | body, test | Statement |
| ForStatement | ES5 | init, test, update, body | Statement |
| ForInStatement | ES5 | left, right, body | Statement |
| FunctionDeclaration | ES5 | id, params, body | Declaration |
| VariableDeclaration | ES5 | declarations, kind | Declaration |
| VariableDeclarator | ES5 | id, init | Other |
| ThisExpression | ES5 | _(none)_ | Expression |
| ArrayExpression | ES5 | elements | Expression |
| ObjectExpression | ES5 | properties | Expression |
| Property | ES5 | key, value, kind | Other |
| FunctionExpression | ES5 | id, params, body | Expression |
| UnaryExpression | ES5 | operator, prefix, argument | Expression |
| UpdateExpression | ES5 | operator, argument, prefix | Expression |
| BinaryExpression | ES5 | operator, left, right | Expression |
| AssignmentExpression | ES5 | operator, left, right | Expression |
| LogicalExpression | ES5 | operator, left, right | Expression |
| MemberExpression | ES5 | object, property, computed | Expression |
| ConditionalExpression | ES5 | test, alternate, consequent | Expression |
| CallExpression | ES5 | callee, arguments | Expression |
| NewExpression | ES5 | callee, arguments | Expression |
| SequenceExpression | ES5 | expressions | Expression |

### ES5 Enum Types

| Enum Type | Values |
|-----------|--------|
| UnaryOperator | `-`, `+`, `!`, `~`, `typeof`, `void`, `delete` |
| UpdateOperator | `++`, `--` |
| BinaryOperator | `==`, `!=`, `===`, `!==`, `<`, `<=`, `>`, `>=`, `<<`, `>>`, `>>>`, `+`, `-`, `*`, `/`, `%`, `\|`, `^`, `&`, `in`, `instanceof` |
| AssignmentOperator | `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `<<=`, `>>=`, `>>>=`, `\|=`, `^=`, `&=` |
| LogicalOperator | `\|\|`, `&&` |

---

## ES2015 / ES6 (es2015.md)

### Extensions to Existing Nodes

| Node Type | Extension |
|-----------|-----------|
| Program | Added: sourceType ("script" \| "module"), body updated to include ImportOrExportDeclaration |
| Function (base) | Added: generator |
| VariableDeclaration | kind extended to: "var" \| "let" \| "const" |
| CallExpression | callee extended to: Expression \| Super; arguments extended to: Expression \| SpreadElement |
| MemberExpression | object extended to: Expression \| Super |
| ArrayExpression | elements extended to: Expression \| SpreadElement \| null |
| NewExpression | arguments extended to: Expression \| SpreadElement |
| AssignmentExpression | left narrowed to: Pattern |
| Property | key extended to: Expression; added: method, shorthand, computed |

### New Node Types

| Node Type | ES Version | Properties | Category |
|-----------|-----------|------------|----------|
| ForOfStatement | ES2015 | left, right, body _(extends ForInStatement)_ | Statement |
| Super | ES2015 | _(none)_ | Expression |
| SpreadElement | ES2015 | argument | Other |
| ArrowFunctionExpression | ES2015 | id, params, body, expression, generator | Expression |
| YieldExpression | ES2015 | argument, delegate | Expression |
| TemplateLiteral | ES2015 | quasis, expressions | Expression |
| TaggedTemplateExpression | ES2015 | tag, quasi | Expression |
| TemplateElement | ES2015 | tail, value (value.cooked, value.raw) | Other |
| ObjectPattern | ES2015 | properties | Pattern |
| ArrayPattern | ES2015 | elements | Pattern |
| RestElement | ES2015 | argument | Pattern |
| AssignmentPattern | ES2015 | left, right | Pattern |
| AssignmentProperty | ES2015 | type ("Property"), value, kind ("init"), method, shorthand, computed | Other |
| ClassBody | ES2015 | body | Other |
| MethodDefinition | ES2015 | key, value, kind, computed, static | Other |
| ClassDeclaration | ES2015 | id, superClass, body | Declaration |
| ClassExpression | ES2015 | id, superClass, body | Expression |
| MetaProperty | ES2015 | meta, property | Expression |
| ImportDeclaration | ES2015 | specifiers, source | Declaration |
| ImportSpecifier | ES2015 | imported, local | Other |
| ImportDefaultSpecifier | ES2015 | local | Other |
| ImportNamespaceSpecifier | ES2015 | local | Other |
| ExportNamedDeclaration | ES2015 | declaration, specifiers, source | Declaration |
| ExportSpecifier | ES2015 | exported, local | Other |
| ExportDefaultDeclaration | ES2015 | declaration | Declaration |
| ExportAllDeclaration | ES2015 | source | Declaration |

### ES2015 Base Interfaces (not concrete node types)

| Interface | Properties |
|-----------|------------|
| Class (base) | id, superClass, body |
| ImportOrExportDeclaration (base) | _(empty interface)_ |
| ModuleSpecifier (base) | local |

---

## ES2016 (es2016.md)

No new node types. Only enum extensions.

### Enum Extensions

| Enum Type | New Values |
|-----------|-----------|
| BinaryOperator | `**` (exponentiation) |
| AssignmentOperator | `**=` |

---

## ES2017 (es2017.md)

### Extensions to Existing Nodes

| Node Type | Extension |
|-----------|-----------|
| Function (base) | Added: async |

### New Node Types

| Node Type | ES Version | Properties | Category |
|-----------|-----------|------------|----------|
| AwaitExpression | ES2017 | argument | Expression |

---

## ES2018 (es2018.md)

No new node types. Only extensions to existing nodes.

### Extensions to Existing Nodes

| Node Type | Extension |
|-----------|-----------|
| ForOfStatement | Added: await |
| ObjectExpression | properties extended to: Property \| SpreadElement |
| TemplateElement | value.cooked can now be null (tagged templates with invalid escapes) |
| ObjectPattern | properties extended to: AssignmentProperty \| RestElement |

---

## ES2019 (es2019.md)

No new node types. Only extensions to existing nodes.

### Extensions to Existing Nodes

| Node Type | Extension |
|-----------|-----------|
| CatchClause | param changed to: Pattern \| null (optional catch binding) |

---

## ES2020 (es2020.md)

### Extensions to Existing Nodes

| Node Type | Extension |
|-----------|-----------|
| Literal | value extended to include bigint type |
| CallExpression | Now also extends ChainElement (added: optional) |
| MemberExpression | Now also extends ChainElement (added: optional) |
| ExportAllDeclaration | Added: exported (Identifier \| null) |
| LogicalOperator (enum) | Added: `??` (nullish coalescing) |

### New Node Types

| Node Type | ES Version | Properties | Category |
|-----------|-----------|------------|----------|
| BigIntLiteral | ES2020 | value, bigint | Literal |
| ChainExpression | ES2020 | expression | Expression |
| ChainElement (base) | ES2020 | optional | Other |
| ImportExpression | ES2020 | source | Expression |

---

## ES2021 (es2021.md)

No new node types. Only enum extensions.

### Enum Extensions

| Enum Type | New Values |
|-----------|-----------|
| AssignmentOperator | `\|\|=`, `&&=`, `??=` (logical assignment) |

---

## ES2022 (es2022.md)

### Extensions to Existing Nodes

| Node Type | Extension |
|-----------|-----------|
| ClassBody | body extended to: MethodDefinition \| PropertyDefinition \| StaticBlock |
| MethodDefinition | key extended to: Expression \| PrivateIdentifier |
| MemberExpression | property extended to: Expression \| PrivateIdentifier |
| BinaryExpression | left extended to: Expression \| PrivateIdentifier (for `#foo in obj`) |
| ImportSpecifier | imported extended to: Identifier \| Literal |
| ExportSpecifier | local extended to: Identifier \| Literal; exported extended to: Identifier \| Literal |
| ExportAllDeclaration | exported extended to: Identifier \| Literal \| null |

### New Node Types

| Node Type | ES Version | Properties | Category |
|-----------|-----------|------------|----------|
| PropertyDefinition | ES2022 | key, value, computed, static | Other |
| PrivateIdentifier | ES2022 | name | Other |
| StaticBlock | ES2022 | body _(extends BlockStatement)_ | Statement |

---

## Consolidated Summary

### All Concrete Node Types (Alphabetical)

| Node Type | Introduced | Category |
|-----------|-----------|----------|
| ArrowFunctionExpression | ES2015 | Expression |
| ArrayExpression | ES5 | Expression |
| ArrayPattern | ES2015 | Pattern |
| AssignmentExpression | ES5 | Expression |
| AssignmentPattern | ES2015 | Pattern |
| AssignmentProperty | ES2015 | Other |
| AwaitExpression | ES2017 | Expression |
| BigIntLiteral | ES2020 | Literal |
| BinaryExpression | ES5 | Expression |
| BlockStatement | ES5 | Statement |
| BreakStatement | ES5 | Statement |
| CallExpression | ES5 | Expression |
| CatchClause | ES5 | Clause |
| ChainExpression | ES2020 | Expression |
| ClassBody | ES2015 | Other |
| ClassDeclaration | ES2015 | Declaration |
| ClassExpression | ES2015 | Expression |
| ConditionalExpression | ES5 | Expression |
| ContinueStatement | ES5 | Statement |
| DebuggerStatement | ES5 | Statement |
| Directive | ES5 | Statement |
| DoWhileStatement | ES5 | Statement |
| EmptyStatement | ES5 | Statement |
| ExportAllDeclaration | ES2015 | Declaration |
| ExportDefaultDeclaration | ES2015 | Declaration |
| ExportNamedDeclaration | ES2015 | Declaration |
| ExportSpecifier | ES2015 | Other |
| ExpressionStatement | ES5 | Statement |
| ForInStatement | ES5 | Statement |
| ForOfStatement | ES2015 | Statement |
| ForStatement | ES5 | Statement |
| FunctionBody | ES5 | Statement |
| FunctionDeclaration | ES5 | Declaration |
| FunctionExpression | ES5 | Expression |
| Identifier | ES5 | Expression / Pattern |
| IfStatement | ES5 | Statement |
| ImportDeclaration | ES2015 | Declaration |
| ImportDefaultSpecifier | ES2015 | Other |
| ImportExpression | ES2020 | Expression |
| ImportNamespaceSpecifier | ES2015 | Other |
| ImportSpecifier | ES2015 | Other |
| LabeledStatement | ES5 | Statement |
| Literal | ES5 | Literal |
| LogicalExpression | ES5 | Expression |
| MemberExpression | ES5 | Expression |
| MetaProperty | ES2015 | Expression |
| MethodDefinition | ES2015 | Other |
| NewExpression | ES5 | Expression |
| ObjectExpression | ES5 | Expression |
| ObjectPattern | ES2015 | Pattern |
| PrivateIdentifier | ES2022 | Other |
| Program | ES5 | Other |
| Property | ES5 | Other |
| PropertyDefinition | ES2022 | Other |
| RegExpLiteral | ES5 | Literal |
| RestElement | ES2015 | Pattern |
| ReturnStatement | ES5 | Statement |
| SequenceExpression | ES5 | Expression |
| SpreadElement | ES2015 | Other |
| StaticBlock | ES2022 | Statement |
| Super | ES2015 | Expression |
| SwitchCase | ES5 | Clause |
| SwitchStatement | ES5 | Statement |
| TaggedTemplateExpression | ES2015 | Expression |
| TemplateLiteral | ES2015 | Expression |
| TemplateElement | ES2015 | Other |
| ThisExpression | ES5 | Expression |
| ThrowStatement | ES5 | Statement |
| TryStatement | ES5 | Statement |
| UnaryExpression | ES5 | Expression |
| UpdateExpression | ES5 | Expression |
| VariableDeclaration | ES5 | Declaration |
| VariableDeclarator | ES5 | Other |
| WhileStatement | ES5 | Statement |
| WithStatement | ES5 | Statement |
| YieldExpression | ES2015 | Expression |

### Counts by ES Version

| ES Version | New Node Types | Enum-only Changes | Extensions to Existing |
|------------|---------------|-------------------|----------------------|
| ES5 | 37 | 5 enums defined | -- |
| ES2015 | 24 | -- | 9 nodes extended |
| ES2016 | 0 | 2 enums extended | -- |
| ES2017 | 1 | -- | 1 node extended |
| ES2018 | 0 | -- | 4 nodes extended |
| ES2019 | 0 | -- | 1 node extended |
| ES2020 | 3 (+1 base) | 1 enum extended | 3 nodes extended |
| ES2021 | 0 | 1 enum extended | -- |
| ES2022 | 3 | -- | 7 nodes extended |

### Counts by Category

| Category | Count |
|----------|-------|
| Expression | 26 |
| Statement | 19 |
| Declaration | 7 |
| Pattern | 4 |
| Literal | 2 |
| Clause | 2 |
| Other | 12 |
| **Total** | **68** |

> Note: Identifier is counted once (Expression/Pattern dual). BigIntLiteral extends Literal
> so is a sub-type. Base interfaces (Node, Function, Class, Statement, Expression, Pattern,
> Declaration, ImportOrExportDeclaration, ModuleSpecifier, ChainElement) are abstract and
> not counted as concrete node types in the consolidated total. The total of 68 includes
> all distinct concrete `type` values that appear in ESTree ASTs.
