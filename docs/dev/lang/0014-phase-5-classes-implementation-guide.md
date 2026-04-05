# Phase 5 — Classes: Implementation Guide

**For**: Claude Code
**Scope**: Phase 5 of lykn v0.1.0 — class declarations, expressions, methods, fields, private members
**Where you're working**: `src/compiler.js` — adding macros and a class body compiler
**Prerequisites**: All previous phases. Classes depend on colon syntax (Phase 1), function forms + `async` (Phase 2), `default`/`spread` (Phase 3), destructuring in params (Phase 4).
**Design authority**:
- `crates/design/dev/lang/0007-dd-07-class-syntax.md`
- `crates/design/dev/lang/0001-dd-01-colon-syntax-and-camelcase-conversion.md` (private field naming)
- `crates/design/dev/lang/0003-dd-03-async-await.md` (async methods)

---

## Overview: What Phase 5 Is

Phase 5 adds classes to lykn. This requires a **new compilation context** — the class body — where lists are interpreted as method definitions rather than function calls. This is the first time the compiler needs context-dependent interpretation of the same syntactic structures.

| Item | Type | Notes |
|------|------|-------|
| 5.1 `class` declaration | New macro | With `compileClassBody()` |
| 5.2 `class-expr` expression | New macro | Anonymous class expression |
| 5.3 Method definitions | Inside `compileClassBody` | Bare lists become methods |
| 5.4 `constructor` | Special method name | `kind: "constructor"` |
| 5.5 `get` / `set` markers | Inside `compileClassBody` | Accessor methods |
| 5.6 `static` wrapper | Inside `compileClassBody` | Static members |
| 5.7 `field` marker | Inside `compileClassBody` | `PropertyDefinition` |
| 5.8 Private `-` prefix | Naming convention | `PrivateIdentifier` with `#` |
| 5.9 `async` methods | Inside `compileClassBody` | Composes with `static` |

---

## The Key Architecture: Class Body Is a Separate Compilation Context

In all previous phases, every list `(head args...)` is compiled the same way: check `macros[head]`, and if not found, treat it as a function call. Inside a class body, this changes completely:

```lisp
(class Dog (Animal)
  ;; These are NOT function calls. They're method definitions.
  (constructor (name) (= this:name name))
  (speak () (console:log this:name))

  ;; This is NOT calling get as a function. It's a getter accessor.
  (get name () (return this:-name))

  ;; This is NOT a field access. It's a field declaration.
  (field -count 0)

  ;; This wraps a method, not a function form.
  (static (increment () (++ Counter:count))))
```

You need a `compileClassBody(children)` function that interprets each child list according to class body rules, NOT via `compileExpr`.

---

## The ESTree Nodes

```
ClassDeclaration {
  type: "ClassDeclaration",
  id: Identifier,
  superClass: Expression | null,
  body: ClassBody
}

ClassExpression {
  type: "ClassExpression",
  id: Identifier | null,
  superClass: Expression | null,
  body: ClassBody
}

ClassBody {
  type: "ClassBody",
  body: [MethodDefinition | PropertyDefinition]
}

MethodDefinition {
  type: "MethodDefinition",
  key: Identifier | PrivateIdentifier,
  value: FunctionExpression,         // always FunctionExpression, never Declaration
  kind: "constructor" | "method" | "get" | "set",
  computed: false,
  static: false
}

PropertyDefinition {
  type: "PropertyDefinition",
  key: Identifier | PrivateIdentifier,
  value: Expression | null,
  computed: false,
  static: false
}

PrivateIdentifier {
  type: "PrivateIdentifier",
  name: string                       // WITHOUT the # prefix — ESTree stores just the name
}
```

### Critical: `MethodDefinition.value` is ALWAYS `FunctionExpression`

Even though we use `FunctionDeclaration` for standalone `(function ...)` forms and `ArrowFunctionExpression` for `(=> ...)`, method bodies inside a class are ALWAYS wrapped in `FunctionExpression`. A method definition is not a function declaration — it's a property of the class prototype whose value happens to be a function.

astring expects `FunctionExpression` here. If you emit `FunctionDeclaration` or `ArrowFunctionExpression`, the output will be malformed.

### Critical: `PrivateIdentifier.name` Does NOT Include `#`

ESTree stores the name WITHOUT the `#` prefix. astring adds `#` when generating output. So `#_count` is stored as `{ type: "PrivateIdentifier", name: "_count" }`. If you include `#` in the name, you'll get `##_count` in the output.

---

## Private Field Naming Convention: The `-` Prefix

This is a lykn design convergence from DD-01 and DD-07.

DD-01 established that a leading `-` on an identifier is converted to `_` by `toCamelCase`:
- `-foo` → `_foo`
- `--foo` → `__foo`

DD-07 decided that inside a class body, a leading `-` also means "private." The compiler:
1. Applies `toCamelCase` to the name: `-balance` → `_balance`
2. Wraps the result in `PrivateIdentifier`: `{ type: "PrivateIdentifier", name: "_balance" }`

The generated JS has `#_balance`.

For references via `this:-balance`:
1. Colon splitting: segments are `["this", "-balance"]`
2. First segment → `ThisExpression`
3. Second segment: `-balance` → `toCamelCase` → `_balance`
4. BUT: in the current Phase 1 implementation, this produces a regular `Identifier("_balance")`, not a `PrivateIdentifier`

**This is the Phase 5 change to colon syntax**: when a colon-split segment starts with `-`, AND it's a property (not the first/object segment), the compiler must produce `PrivateIdentifier` instead of `Identifier` for that property.

### Helper Function: `toClassKey`

Add a helper that converts a name to the appropriate key node, handling the private prefix:

```js
function toClassKey(name) {
  if (name.startsWith('-')) {
    // Private: apply toCamelCase (which converts leading - to _), wrap in PrivateIdentifier
    return { type: 'PrivateIdentifier', name: toCamelCase(name) };
  }
  return { type: 'Identifier', name: toCamelCase(name) };
}
```

Wait — there's a subtlety. `toCamelCase('-balance')` returns `_balance`. That's the name we want in the `PrivateIdentifier` (astring adds `#`, producing `#_balance`). So the helper is:

```js
function toClassKey(name) {
  const converted = toCamelCase(name);
  if (name.startsWith('-')) {
    return { type: 'PrivateIdentifier', name: converted };
  }
  return { type: 'Identifier', name: converted };
}
```

### Update to Colon Syntax: Private Property Access

The Phase 1 colon splitting code needs a small update for `this:-balance` to produce `PrivateIdentifier`. In the atom branch's colon handling, when building property nodes for non-first segments:

**Current** (from Phase 1):
```js
for (let i = 1; i < segments.length; i++) {
  result = {
    type: 'MemberExpression',
    object: result,
    property: { type: 'Identifier', name: toCamelCase(segments[i]) },
    computed: false,
  };
}
```

**Updated**:
```js
for (let i = 1; i < segments.length; i++) {
  const seg = segments[i];
  const isPrivate = seg.startsWith('-');
  const propName = toCamelCase(seg);
  result = {
    type: 'MemberExpression',
    object: result,
    property: isPrivate
      ? { type: 'PrivateIdentifier', name: propName }
      : { type: 'Identifier', name: propName },
    computed: false,
  };
}
```

This makes `this:-balance` produce `MemberExpression(ThisExpression, PrivateIdentifier("_balance"))` → `this.#_balance`.

**Compiler pitfall — only PROPERTY segments get PrivateIdentifier**:

The FIRST segment of a colon expression is the object, never private. `-foo:bar` means the object is `_foo` (Identifier), not `#_foo` (PrivateIdentifier). Private identifiers only make sense as property accesses on an object (typically `this`). The code above handles this correctly: the `isPrivate` check is inside the property loop (starting at `i = 1`), not applied to the first segment.

---

## 5.1 `class` Declaration

**Syntax**: `(class Name (SuperClass) body...)`

- Name is REQUIRED (atom)
- Superclass list: `()` = no extends, `(Animal)` = extends Animal
- Body is zero or more class body elements

### Implementation

```js
'class'(args) {
  if (args.length < 2) {
    throw new Error('class requires a name and superclass list: (class Name (Super) body...)');
  }
  if (args[0].type !== 'atom') {
    throw new Error('class name must be an identifier');
  }
  if (args[1].type !== 'list') {
    throw new Error('class superclass must be a list: () for no extends, (Super) for extends');
  }

  const name = { type: 'Identifier', name: toCamelCase(args[0].value) };
  const superClass = args[1].values.length > 0
    ? compileExpr(args[1].values[0])
    : null;

  const bodyElements = args.slice(2);
  const body = {
    type: 'ClassBody',
    body: compileClassBody(bodyElements),
  };

  return {
    type: 'ClassDeclaration',
    id: name,
    superClass,
    body,
  };
},
```

**Compiler pitfall — the class name is NOT camelCased in practice**:

Class names in JS are PascalCase by convention (e.g., `Handler`, `Dog`). lykn programmers will write them without hyphens: `(class Handler ...)`. `toCamelCase("Handler")` returns `"Handler"` unchanged (no hyphens). So `toCamelCase` is harmless here. But if someone wrote `(class my-handler ...)`, it would become `myHandler` — unconventional but technically correct.

**Compiler pitfall — superclass is an EXPRESSION**:

The superclass `(Animal)` is a one-element list. We compile `args[1].values[0]` (the atom `Animal`) via `compileExpr`, producing `Identifier("Animal")`. But superclasses can be expressions: `(class Foo ((get-base-class)) ...)` where the superclass is a function call. `compileExpr` handles this.

---

## 5.2 `class-expr` — Class Expression

**Syntax**: `(class-expr (SuperClass) body...)`

Anonymous class expression. No name.

```js
'class-expr'(args) {
  if (args.length < 1) {
    throw new Error('class-expr requires a superclass list: (class-expr (Super) body...)');
  }
  if (args[0].type !== 'list') {
    throw new Error('class-expr superclass must be a list');
  }

  const superClass = args[0].values.length > 0
    ? compileExpr(args[0].values[0])
    : null;

  const bodyElements = args.slice(1);
  const body = {
    type: 'ClassBody',
    body: compileClassBody(bodyElements),
  };

  return {
    type: 'ClassExpression',
    id: null,
    superClass,
    body,
  };
},
```

---

## 5.3–5.9 The `compileClassBody()` Function

This is the heart of Phase 5. It takes the raw reader nodes from the class body and produces an array of `MethodDefinition` and `PropertyDefinition` ESTree nodes.

### The Dispatch Logic

Each child in the class body is a list. The compiler checks the head atom to determine what kind of member it is:

```
Head atom        → What it produces
─────────────────────────────────────────
"field"          → PropertyDefinition
"static"         → unwrap, recurse with static: true
"async"          → unwrap, compile inner as async method
"get"            → MethodDefinition with kind: "get"
"set"            → MethodDefinition with kind: "set"
anything else    → MethodDefinition with kind: "method" (or "constructor")
```

### Implementation

```js
function compileClassBody(elements) {
  return elements.map(el => compileClassMember(el, false));
}

function compileClassMember(node, isStatic) {
  if (node.type !== 'list' || node.values.length === 0) {
    throw new Error('Class body element must be a non-empty list');
  }

  const head = node.values[0];

  if (head.type !== 'atom') {
    throw new Error('Class body element must start with an atom');
  }

  const headVal = head.value;

  // --- static wrapper ---
  // (static (...)) → recurse with isStatic = true
  if (headVal === 'static') {
    if (node.values.length !== 2) {
      throw new Error('static wraps exactly one class member: (static (member ...))');
    }
    return compileClassMember(node.values[1], true);
  }

  // --- async wrapper ---
  // (async (method-name (params) body...))
  if (headVal === 'async') {
    if (node.values.length !== 2) {
      throw new Error('async in class body wraps exactly one method');
    }
    const inner = node.values[1];
    if (inner.type !== 'list' || inner.values.length === 0) {
      throw new Error('async must wrap a method definition');
    }

    // The inner could be (get/set name ...) or (method-name ...)
    // Check for get/set first
    const innerHead = inner.values[0];
    if (innerHead.type === 'atom' && (innerHead.value === 'get' || innerHead.value === 'set')) {
      // async getter/setter — unusual but syntactically valid
      const member = compileAccessorMethod(inner, innerHead.value, isStatic);
      member.value.async = true;
      return member;
    }

    // Regular async method
    const member = compileMethod(inner, isStatic);
    member.value.async = true;
    return member;
  }

  // --- field ---
  // (field name value) or (field name)
  if (headVal === 'field') {
    if (node.values.length < 2 || node.values.length > 3) {
      throw new Error('field: (field name) or (field name value)');
    }
    const fieldName = node.values[1].value;
    const key = toClassKey(fieldName);
    const value = node.values.length === 3 ? compileExpr(node.values[2]) : null;

    return {
      type: 'PropertyDefinition',
      key,
      value,
      computed: false,
      static: isStatic,
    };
  }

  // --- get / set accessor ---
  // (get name (params) body...)
  // (set name (params) body...)
  if (headVal === 'get' || headVal === 'set') {
    return compileAccessorMethod(node, headVal, isStatic);
  }

  // --- regular method (or constructor) ---
  // (method-name (params) body...)
  return compileMethod(node, isStatic);
}
```

### `compileMethod()` — Regular Methods and Constructor

```js
function compileMethod(node, isStatic) {
  // node.values = [method-name, (params), body...]
  if (node.values.length < 3) {
    throw new Error('Method requires name, params, and body: (name (params) body...)');
  }

  const nameAtom = node.values[0];
  if (nameAtom.type !== 'atom') {
    throw new Error('Method name must be an atom');
  }

  const methodName = nameAtom.value;
  const key = toClassKey(methodName);
  const isConstructor = methodName === 'constructor';

  // Params
  const paramsList = node.values[1];
  if (paramsList.type !== 'list') {
    throw new Error('Method params must be a list');
  }
  const params = paramsList.values.map(compilePattern);

  // Body
  const bodyExprs = node.values.slice(2);

  return {
    type: 'MethodDefinition',
    key,
    value: {
      type: 'FunctionExpression',
      id: null,
      params,
      body: {
        type: 'BlockStatement',
        body: bodyExprs.map(e => toStatement(compileExpr(e))),
      },
      async: false,
      generator: false,
    },
    kind: isConstructor ? 'constructor' : 'method',
    computed: false,
    static: isStatic,
  };
}
```

### `compileAccessorMethod()` — Getters and Setters

```js
function compileAccessorMethod(node, accessorKind, isStatic) {
  // node.values = [get/set, name, (params), body...]
  if (node.values.length < 4) {
    throw new Error(accessorKind + ' accessor: (' + accessorKind + ' name (params) body...)');
  }

  const nameAtom = node.values[1];
  if (nameAtom.type !== 'atom') {
    throw new Error('Accessor name must be an atom');
  }

  const key = toClassKey(nameAtom.value);

  const paramsList = node.values[2];
  if (paramsList.type !== 'list') {
    throw new Error('Accessor params must be a list');
  }
  const params = paramsList.values.map(compilePattern);

  const bodyExprs = node.values.slice(3);

  return {
    type: 'MethodDefinition',
    key,
    value: {
      type: 'FunctionExpression',
      id: null,
      params,
      body: {
        type: 'BlockStatement',
        body: bodyExprs.map(e => toStatement(compileExpr(e))),
      },
      async: false,
      generator: false,
    },
    kind: accessorKind,   // "get" or "set"
    computed: false,
    static: isStatic,
  };
}
```

---

## The Dispatch Details: Understanding Each Member Type

### 5.3 Method Definitions — Bare Lists

```lisp
(speak () (console:log this:name))
```
→
```js
speak() { console.log(this.name); }
```

A list in the class body whose head atom is NOT `field`, `static`, `async`, `get`, or `set` is a regular method. The head atom is the method name.

### 5.4 `constructor` — Regular Method Name

`constructor` is not a special form — it's just a method whose name is the string `"constructor"`. The compiler detects this name and sets `kind: "constructor"` instead of `kind: "method"`.

```lisp
(constructor (name breed)
  (super name)
  (= this:breed breed))
```
→
```js
constructor(name, breed) {
  super(name);
  this.breed = breed;
}
```

**Compiler pitfall — `constructor` as the key node**:

The key is `Identifier("constructor")`, not a special node. `toCamelCase("constructor")` returns `"constructor"` unchanged. `toClassKey("constructor")` returns `Identifier("constructor")` since it doesn't start with `-`.

**Compiler pitfall — `super()` calls inside constructor**:

`(super name)` in the constructor body is compiled by `compileExpr`. It's a list with head atom `super`. Since `super` is NOT in the `macros` table, it falls through to the CallExpression path. `compileExpr` compiles the head `super` → `{ type: "Super" }` (from the Phase 1 atom handling). The result is `CallExpression(Super, [Identifier("name")])`. astring generates `super(name)`. This works automatically — no special handling needed.

### 5.5 `get` / `set` — Accessor Markers

```lisp
(get area () (return (* Math:PI (** this:radius 2))))
(set radius (r) (= this:-radius r))
```
→
```js
get area() { return Math.PI * this.#_radius ** 2; }
set radius(r) { this.#_radius = r; }
```

**Compiler pitfall — `get` inside class body vs `get` macro**:

This is the context-dependent dispatch that DD-07 explicitly designed for. The `macros['get']` handler (from Phase 1) handles `(get obj key)` in EXPRESSION context — computed member access. Inside a class body, `(get area () ...)` is detected by `compileClassMember` which checks if the head is `"get"` or `"set"` BEFORE falling through to general method handling.

These do NOT conflict because class body elements go through `compileClassBody` → `compileClassMember`, never through `compileExpr`. The `macros` table is never consulted for class body element dispatch.

**Compiler pitfall — a method literally named `get` or `set`**:

If someone writes a class method called `get` or `set` (without accessor intent), the head atom `get` or `set` will be caught by the accessor branch. This is a documented restriction from DD-07: a method literally named `get` or `set` is shadowed by the accessor keyword. To work around it, you'd need to use a different name. This is an acceptable tradeoff.

### 5.6 `static` Wrapper

```lisp
(static (field count 0))
(static (increment () (++ Counter:count)))
(static (async (fetch-all () (return (await (get-all))))))
```
→
```js
static count = 0;
static increment() { ++Counter.count; }
static async fetchAll() { return await getAll(); }
```

`static` peels off the wrapper, recurses into `compileClassMember` with `isStatic = true`, and the inner element is compiled normally with the static flag set.

**Composition**: `(static (async (method-name ...)))` works by:
1. `static` detects head = `"static"`, recurses with `isStatic = true` on the inner `(async (method-name ...))`
2. `async` detects head = `"async"`, compiles the inner method, sets `async: true`
3. The method gets both `static: true` and `value.async = true`

### 5.7 `field` — Class Fields

```lisp
(field name "default-value")
(field -count 0)
(field items)
```
→
```js
name = "default-value";
#_count = 0;
items;
```

`field` produces `PropertyDefinition`, not `MethodDefinition`. It has a key and an optional value. No params, no function body.

**Why `field` is needed**: Without it, `(count 0)` in a class body would be ambiguous — is it a method named `count` with `0` as... what? A list `(count 0)` in class body doesn't fit the method pattern `(name (params) body...)` because `0` is a number, not a params list. The explicit `field` marker eliminates ambiguity.

### 5.8 Private Fields/Methods via `-` Prefix

The `-` prefix convention works uniformly for both fields and methods:

```lisp
(field -count 0)               ;; → #_count = 0
(-fetch-data (url) ...)        ;; → #_fetchData(url) { ... }
(get -radius () ...)           ;; → get #_radius() { ... }
(static (field -instances 0))  ;; → static #_instances = 0
```

The `toClassKey()` helper handles this: any name starting with `-` gets `toCamelCase` applied (converting `-count` → `_count`) and wrapped in `PrivateIdentifier`.

### 5.9 `async` Methods

```lisp
(async (handle (req res)
  (const data (await (fetch url)))
  (return data)))
```
→
```js
async handle(req, res) {
  const data = await fetch(url);
  return data;
}
```

The `async` check in `compileClassMember` compiles the inner list as a method, then sets `async: true` on the `FunctionExpression` value.

**Important**: `async` in class body does NOT go through `macros['async']`. It's handled by `compileClassMember` directly. The `macros['async']` handler (Phase 2) wraps standalone function forms; the class body `async` wraps class methods. Same concept, different dispatch paths.

---

## Worked Example: The Integration Test Handler Class

```lisp
(class Handler ()
  (field -count 0)

  (async (-fetch-data (url)
    (const response (await (fetch url)))
    (return (await (response:json)))))

  (async (handle (req res)
    (++ this:-count)
    (const data (await (this:-fetch-data "https://api.example.com/data")))
    (const (object name (default age 0)) data)
    (const body (template "Hello, " name "! Age: " age))
    (res:write-head 200 (object (content-type "text/plain")))
    (res:end body))))
```

Produces:

```js
class Handler {
  #_count = 0;
  async #_fetchData(url) {
    const response = await fetch(url);
    return await response.json();
  }
  async handle(req, res) {
    ++this.#_count;
    const data = await this.#_fetchData("https://api.example.com/data");
    const {name, age = 0} = data;
    const body = `Hello, ${name}! Age: ${age}`;
    res.writeHead(200, {"content-type": "text/plain"});
    res.end(body);
  }
}
```

Trace through the class body:

1. `(field -count 0)` → head is `"field"` → `PropertyDefinition(PrivateIdentifier("_count"), Literal(0), static: false)`
2. `(async (-fetch-data (url) ...))` → head is `"async"` → unwrap inner `(-fetch-data (url) ...)` → head is `-fetch-data` (not field/static/get/set) → regular method with name `-fetch-data` → `toClassKey("-fetch-data")` → `PrivateIdentifier("_fetchData")` → `MethodDefinition` with `async: true`
3. `(async (handle (req res) ...))` → head is `"async"` → unwrap inner `(handle ...)` → regular method → `MethodDefinition` with `async: true`, key `Identifier("handle")`

And the reference `this:-count` in the method body goes through colon splitting → `MemberExpression(ThisExpression, PrivateIdentifier("_count"))` → `this.#_count`.

---

## Tests (5.10)

### File Organization

```
test/
  forms/
    class.test.js
    class-methods.test.js
    class-fields.test.js
    class-async.test.js
    class-expr.test.js
```

### `test/forms/class.test.js`

```js
Deno.test("class: basic no extends", () => {
  const result = lykn('(class Foo () (constructor () (return)))');
  assertEquals(result.includes('class Foo'), true);
  assertEquals(result.includes('constructor'), true);
});

Deno.test("class: with extends", () => {
  const result = lykn('(class Dog (Animal) (constructor (name) (super name)))');
  assertEquals(result.includes('extends Animal'), true);
  assertEquals(result.includes('super(name)'), true);
});

Deno.test("class: empty body", () => {
  const result = lykn('(class Empty ())');
  assertEquals(result.includes('class Empty'), true);
});

Deno.test("class: method with this", () => {
  const result = lykn('(class Greeter () (greet () (return this:name)))');
  assertEquals(result.includes('this.name'), true);
});
```

### `test/forms/class-methods.test.js`

```js
Deno.test("class method: constructor", () => {
  const result = lykn('(class Foo () (constructor (x) (= this:x x)))');
  assertEquals(result.includes('constructor(x)'), true);
  assertEquals(result.includes('this.x = x'), true);
});

Deno.test("class method: getter", () => {
  const result = lykn('(class C () (get area () (return 42)))');
  assertEquals(result.includes('get area'), true);
});

Deno.test("class method: setter", () => {
  const result = lykn('(class C () (set radius (r) (= this:r r)))');
  assertEquals(result.includes('set radius'), true);
});

Deno.test("class method: static method", () => {
  const result = lykn('(class C () (static (create () (return (new C)))))');
  assertEquals(result.includes('static'), true);
  assertEquals(result.includes('create'), true);
});

Deno.test("class method: static field", () => {
  const result = lykn('(class C () (static (field count 0)))');
  assertEquals(result.includes('static'), true);
  assertEquals(result.includes('count'), true);
});

Deno.test("class method: camelCase method name", () => {
  const result = lykn('(class C () (get-data () (return 1)))');
  assertEquals(result.includes('getData'), true);
});
```

### `test/forms/class-fields.test.js`

```js
Deno.test("class field: with value", () => {
  const result = lykn('(class C () (field name "default"))');
  assertEquals(result.includes('name = "default"'), true);
});

Deno.test("class field: without value", () => {
  const result = lykn('(class C () (field items))');
  assertEquals(result.includes('items'), true);
});

Deno.test("class field: private", () => {
  const result = lykn('(class C () (field -count 0))');
  assertEquals(result.includes('#_count'), true);
});

Deno.test("class field: private access via this", () => {
  const result = lykn('(class C () (constructor () (= this:-count 0)))');
  assertEquals(result.includes('this.#_count'), true);
});

Deno.test("class method: private method", () => {
  const result = lykn('(class C () (-helper () (return 42)))');
  assertEquals(result.includes('#_helper'), true);
});

Deno.test("class field: private method reference via this", () => {
  const result = lykn('(class C () (run () (this:-helper)))');
  assertEquals(result.includes('this.#_helper'), true);
});
```

### `test/forms/class-async.test.js`

```js
Deno.test("class async: async method", () => {
  const result = lykn('(class C () (async (fetch-data () (return (await (get-it))))))');
  assertEquals(result.includes('async'), true);
  assertEquals(result.includes('fetchData'), true);
});

Deno.test("class async: static async", () => {
  const result = lykn('(class C () (static (async (load () (return 1)))))');
  assertEquals(result.includes('static'), true);
  assertEquals(result.includes('async'), true);
});

Deno.test("class async: async private method", () => {
  const result = lykn('(class C () (async (-do-work () (return 1))))');
  assertEquals(result.includes('async'), true);
  assertEquals(result.includes('#_doWork') || result.includes('#_dowork'), true);
});
```

### `test/forms/class-expr.test.js`

```js
Deno.test("class-expr: basic", () => {
  const result = lykn('(const MyClass (class-expr () (constructor () (return))))');
  assertEquals(result.includes('class'), true);
  assertEquals(result.includes('constructor'), true);
});

Deno.test("class-expr: with extends", () => {
  const result = lykn('(const Sub (class-expr (Base) (constructor () (super))))');
  assertEquals(result.includes('extends Base'), true);
});
```

---

## Summary of All Changes to `compiler.js`

| What | Where | Notes |
|------|-------|-------|
| `toClassKey()` function | Module level, near `toCamelCase` | Converts name to Identifier or PrivateIdentifier |
| `compileClassBody()` function | Module level | Orchestrator for class body |
| `compileClassMember()` function | Module level | Dispatches static/async/field/get/set/method |
| `compileMethod()` function | Module level | Builds MethodDefinition for regular methods |
| `compileAccessorMethod()` function | Module level | Builds MethodDefinition for get/set |
| `macros['class']` | In `macros` object | New |
| `macros['class-expr']` | In `macros` object | New |
| Colon syntax property loop | In `compileExpr` atom branch | Add PrivateIdentifier for `-` prefix segments |

### Files Changed

| File | Action |
|------|--------|
| `src/compiler.js` | Add 2 macros, 5 functions, modify colon syntax loop |
| `test/forms/class.test.js` | New |
| `test/forms/class-methods.test.js` | New |
| `test/forms/class-fields.test.js` | New |
| `test/forms/class-async.test.js` | New |
| `test/forms/class-expr.test.js` | New |

### What NOT to Do

- **Do not use the `macros` table for class body dispatch.** Class body elements go through `compileClassBody`/`compileClassMember`, not through `compileExpr`. The `macros` table is for expression-level forms.
- **Do not add `method` to macros.** Methods are implicit — any list in a class body that isn't `field`/`static`/`async`/`get`/`set` is a method.
- **Do not implement computed method names.** `[Symbol.iterator]()` is deferred to v0.2.0.
- **Do not implement static blocks.** Deferred to v0.2.0.
- **Do not implement named class expressions.** Deferred to v0.2.0. `class-expr` is always anonymous (`id: null`).
- **Do not modify the reader.** `#` is already accepted as an atom character by the reader (it doesn't stop on `#`), but we never need the reader to produce `#` — the compiler generates `PrivateIdentifier` nodes, and astring adds `#` in the output.

---

## Verification Checklist

- [ ] `(class Foo () (constructor () (return)))` compiles to `class Foo { constructor() { return; } }`
- [ ] `(class Dog (Animal) (constructor (name) (super name)))` has `extends Animal` and `super(name)`
- [ ] `(class C () (get area () (return 42)))` has `get area()`
- [ ] `(class C () (set radius (r) (= this:r r)))` has `set radius(r)`
- [ ] `(class C () (static (create () (return 1))))` has `static create()`
- [ ] `(class C () (field name "x"))` has `name = "x"` (PropertyDefinition)
- [ ] `(class C () (field -count 0))` has `#_count = 0` (PrivateIdentifier)
- [ ] `(class C () (-helper () (return 1)))` has `#_helper()` (private method)
- [ ] `this:-count` in a method body produces `this.#_count`
- [ ] `(async (method () ...))` inside class body produces `async method()`
- [ ] `(static (async (method () ...)))` produces `static async method()`
- [ ] `(class-expr () (constructor () (return)))` produces anonymous `ClassExpression`
- [ ] `(get arr 0)` STILL works as computed access outside class bodies (no regression)
- [ ] ALL Phase 1–4 tests still pass
- [ ] `deno test test/` passes all tests
- [ ] `deno lint src/` passes
