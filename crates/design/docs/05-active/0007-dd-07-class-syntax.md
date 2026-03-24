---
number: 7
title: "DD-07: Class Syntax"
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

# DD-07: Class Syntax

**Status**: Decided
**Date**: 2026-03-24
**Session**: (this chat)

## Summary

Classes use `(class Name (SuperClass) body...)` for declarations and `(class-expr (SuperClass) body...)` for expressions. Methods are bare lists in the class body (no `method` keyword). `get`/`set` are keyword markers for accessors. `static` is a wrapper (consistent with `async` in DD-03). `constructor` is a regular method name. Private fields and methods use the `-` prefix convention, which applies both DD-01's underscore conversion AND prepends `#` for engine-enforced privacy: `-balance` → `#_balance`.

## Decisions

### Class declaration form

**Decision**: `(class Name (SuperClass) body...)` for declarations. Name is required. Superclass is a list — empty `()` for no superclass, `(SuperClass)` for extends. Body elements follow.

**Syntax**:

```lisp
;; no superclass
(class Animal ()
  (constructor (name)
    (= this:name name))
  (speak ()
    (console:log this:name)))

;; with extends
(class Dog (Animal)
  (constructor (name breed)
    (super name)
    (= this:breed breed))
  (speak ()
    (console:log (template this:name " barks"))))

;; superclass as expression
(class Admin (Base:User)
  (constructor ()
    (super)))
```

```javascript
// no superclass
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(this.name);
  }
}

// with extends
class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  speak() {
    console.log(`${this.name} barks`);
  }
}

// superclass as expression
class Admin extends Base.User {
  constructor() {
    super();
  }
}
```

**ESTree nodes**: `ClassDeclaration`, `ClassBody`, `MethodDefinition`

**Rationale**: The list wrapper for superclass is unambiguous — `()` clearly means "no superclass," `(Animal)` clearly means "extends Animal." It avoids the problem of distinguishing a superclass atom from the first method. Mirrors how function params work — a list in a structural position.

### Methods as bare lists (no marker)

**Decision**: Methods in a class body are bare lists: `(method-name (params) body...)`. No `method` keyword. The compiler knows everything inside a class body is a method definition (or field, getter/setter, static).

**Syntax**:

```lisp
(class Calculator ()
  (constructor ()
    (= this:result 0))
  (add (n)
    (+= this:result n)
    (return this))
  (reset ()
    (= this:result 0)))
```

```javascript
class Calculator {
  constructor() {
    this.result = 0;
  }
  add(n) {
    this.result += n;
    return this;
  }
  reset() {
    this.result = 0;
  }
}
```

**ESTree nodes**: `MethodDefinition` (with `kind: "method"`)

**Rationale**: JS doesn't use a `method` keyword in class bodies either — thin skin over JS. The class body is its own context; there's no ambiguity about what a list means inside it. Avoids redundant noise on every method definition.

### `constructor` as a regular method name

**Decision**: `constructor` is just a method name, not a special form. The compiler recognizes it and sets `kind: "constructor"` on the `MethodDefinition`.

**Syntax**:

```lisp
(constructor (name age)
  (super name)
  (= this:age age))
```

```javascript
constructor(name, age) {
  super(name);
  this.age = age;
}
```

**ESTree nodes**: `MethodDefinition` (with `kind: "constructor"`)

**Rationale**: JS uses `constructor` as the method name. JS-aligned naming principle.

### `super` calls via DD-01

**Decision**: `super` is already handled by DD-01 — the compiler recognizes it as a special atom emitting `Super`. No new design needed.

**Syntax**:

```lisp
;; constructor delegation
(super name)

;; parent method call via colon syntax
(super:speak)
```

```javascript
// constructor delegation
super(name);

// parent method call
super.speak();
```

**ESTree nodes**: `Super`, `CallExpression`, `MemberExpression`

**Rationale**: Falls out from DD-01's colon syntax and special atom handling.

### `get` / `set` as keyword markers

**Decision**: `get` and `set` are keyword markers at the start of a class body member, indicating a getter or setter. The method name follows.

**Syntax**:

```lisp
(class Circle ()
  (constructor (r)
    (= this:radius r))
  (get area ()
    (return (* Math:PI (** this:radius 2))))
  (set radius (r)
    (= this:radius r)))
```

```javascript
class Circle {
  constructor(r) {
    this.radius = r;
  }
  get area() {
    return Math.PI * this.radius ** 2;
  }
  set radius(r) {
    this.radius = r;
  }
}
```

**ESTree nodes**: `MethodDefinition` (with `kind: "get"` or `kind: "set"`)

**Rationale**: Mirrors JS syntax directly — `get area()` in JS, `(get area () ...)` in lykn. The `get-area` prefix convention was rejected because it conflicts with camelCase — `get-data` is ambiguous between a getter called `data` and a method called `getData`. Note: `get` as a keyword marker inside class bodies does not conflict with the `get` form for computed property access (DD-01), because `get` in a class body is always followed by a method name and params, while the `get` form takes an object and a key expression.

### `static` as a wrapper

**Decision**: `(static (...))` wraps any class body member to make it static. Consistent with `async` wrapper pattern from DD-03.

**Syntax**:

```lisp
(class Counter ()
  (static (field count 0))

  (static (increment ()
    (++ Counter:count)))

  (static (get total ()
    (return Counter:count)))

  ;; static + async composes
  (static (async (fetch-all ()
    (return (await (Promise:all requests)))))))
```

```javascript
class Counter {
  static count = 0;

  static increment() {
    Counter.count++;
  }

  static get total() {
    return Counter.count;
  }

  static async fetchAll() {
    return await Promise.all(requests);
  }
}
```

**ESTree nodes**: `MethodDefinition` (with `static: true`), `PropertyDefinition` (with `static: true`)

**Rationale**: Wrapper pattern is consistent with `async` (DD-03). Composes cleanly — `static` wraps `async` wraps the method, each adding one flag. No prefix proliferation (`static-async-get-*` would be nightmarish).

### `field` for class fields

**Decision**: `(field name value)` defines a class field (PropertyDefinition). Distinguishes fields from methods in the class body.

**Syntax**:

```lisp
(class Config ()
  (field host "localhost")
  (field port 3000)
  (static (field default-timeout 5000))

  (constructor ((object host port))
    (= this:host host)
    (= this:port port)))
```

```javascript
class Config {
  host = "localhost";
  port = 3000;
  static defaultTimeout = 5000;

  constructor({ host, port }) {
    this.host = host;
    this.port = port;
  }
}
```

**ESTree nodes**: `PropertyDefinition`

**Rationale**: Without `field`, `(x 0)` in a class body is ambiguous — could be a field with value `0` or a method call. The explicit `field` marker eliminates ambiguity.

### Private fields and methods via `-` prefix

**Decision**: Inside a class body, a leading `-` on a field or method name applies both DD-01's underscore conversion AND prepends `#` for engine-enforced JS private fields. `-balance` becomes `#_balance`. The `-` prefix in lykn source is used consistently for references (`this:-balance`), and the compiler generates `#_` in the JS output.

**Syntax**:

```lisp
(class Bank-Account ()
  (field -balance 0)

  (-validate (amount)
    (if (< amount 0) (throw (new Error "Invalid amount"))))

  (deposit (amount)
    (this:-validate amount)
    (+= this:-balance amount))

  (get -formatted-balance ()
    (return (template "$" this:-balance)))

  (get balance ()
    (return this:-balance)))
```

```javascript
class BankAccount {
  #_balance = 0;

  #_validate(amount) {
    if (amount < 0) throw new Error("Invalid amount");
  }

  deposit(amount) {
    this.#_validate(amount);
    this.#_balance += amount;
  }

  get #_formattedBalance() {
    return `$${this.#_balance}`;
  }

  get balance() {
    return this.#_balance;
  }
}
```

**ESTree nodes**: `PrivateIdentifier`, `MemberExpression` (with `PrivateIdentifier` as property)

**Rationale**: The `-` prefix is idiomatic in Lisp communities for private/internal names. DD-01 already converts leading `-` to `_`. Inside class bodies, the compiler additionally prepends `#` for engine-enforced privacy. Both transformations apply — neither overrides the other. This means: no new syntax, no reader changes, no conflict with `#` being reserved for future macro/reader system, and private members get real enforcement from the JS engine. The lykn author writes `-balance` everywhere and never sees `#_balance`.

### `class-expr` for class expressions

**Decision**: `(class-expr (SuperClass) body...)` for class expressions (no name). Follows the same pattern as `function` (declaration, name required) vs `lambda` (expression, anonymous).

**Syntax**:

```lisp
;; anonymous class expression
(const my-class (class-expr ()
  (constructor ()
    (= this:x 0))
  (get-x ()
    (return this:x))))

;; with superclass
(const special (class-expr (Base)
  (constructor ()
    (super))))
```

```javascript
// anonymous class expression
const myClass = class {
  constructor() {
    this.x = 0;
  }
  getX() {
    return this.x;
  }
};

// with superclass
const special = class extends Base {
  constructor() {
    super();
  }
};
```

**ESTree nodes**: `ClassExpression`

**Rationale**: Class expressions are rare in modern JS. A separate form (`class-expr`) keeps `class` unambiguous (always a declaration, always requires a name). Named class expressions (where the name is only visible inside the body) are deferred — same rationale as named function expressions in DD-02.

### Computed method names deferred

**Decision**: Computed method names (`[Symbol.iterator]()`) are deferred to post-v0.1.0.

**Rationale**: Rare in practice. Interacts with iterator/generator protocol, which is also deferred. Can be designed when generators are added.

### Static blocks deferred

**Decision**: `static { ... }` blocks (ES2022) are deferred to post-v0.1.0.

**Rationale**: Rarely needed. Class-level initialization can be done with static fields and static methods for v0.1.0.

## Rejected Alternatives

### Superclass as bare atom

**What**: `(class Dog Animal ...)` with the superclass as an atom directly after the name.

**Why rejected**: Ambiguous — the compiler can't always distinguish a superclass atom from the start of the class body. The list wrapper `(Animal)` is unambiguous and handles expression superclasses like `(Some:Base:Class)`.

### `method` keyword marker

**What**: `(method speak () ...)` inside class bodies.

**Why rejected**: Redundant noise. JS doesn't use a `method` keyword. The class body context is sufficient — everything inside is a method, field, or accessor. Adding `method` to every definition is verbose for no disambiguation benefit.

### `get-*` / `set-*` prefix convention for accessors

**What**: `(get-area () ...)` where the prefix indicates a getter.

**Why rejected**: Conflicts with camelCase conversion. `get-data` is ambiguous: getter called `data`? Or method called `getData`? Separate `get`/`set` keyword markers avoid this entirely.

### `static-*` prefix convention

**What**: `(static-increment () ...)` with static as a name prefix.

**Why rejected**: Same camelCase ambiguity as getters. And `static-async-get-*` compound prefixes are unreadable. Wrapper pattern is compositional and consistent with `async`.

### `init` for constructor

**What**: `(init (name) ...)` instead of `(constructor (name) ...)`.

**Why rejected**: JS uses `constructor`. JS-aligned naming principle.

### `#` prefix for private fields

**What**: `#balance` atoms in lykn source, matching JS syntax directly.

**Why rejected**: `#` is reserved for the future macro/reader system. The `-` prefix convention achieves the same result without consuming reader syntax space, and is idiomatic in Lisp communities.

### `-` prefix generating `#` without `_`

**What**: `-balance` compiling to `#balance` (stripping the hyphen, not converting to underscore).

**Why rejected**: Inconsistent with DD-01's general rule that leading `-` becomes `_`. Inside class bodies, the compiler adds `#` as an additional transformation, but doesn't suppress the underscore. Both transformations apply: `-balance` → `_balance` (DD-01) → `#_balance` (class body private). This preserves consistency and makes the mapping predictable.

## Edge Cases

| Case | Behavior | Example |
|------|----------|---------|
| `class` without name | Compile-time error | `(class () ...)` → error, use `class-expr` |
| `class-expr` with name | Compile-time error in v0.1.0 | Named class expressions deferred |
| Empty class body | Valid | `(class Empty () )` → `class Empty {}` |
| `static` wrapping `static` | Compile-time error | `(static (static ...))` → error |
| `--` prefix in class body | Compile-time error | `--foo` → double hyphen not valid for private names |
| `-` method outside class | Normal DD-01 rule (underscore) | `(-helper ...)` outside class → `_helper(...)` |
| `super` outside class | Compiler emits node, JS engine errors | Same policy as DD-01 |
| `field` without value | Valid (undefined) | `(field x)` → `x;` |
| `get`/`set` outside class body | Not keyword markers, normal atoms | Only special inside class body context |
| `this:-name` outside class | DD-01 underscore rule | `this._name` (no `#`, not in class context) |

## Dependencies

- **Depends on**: DD-01 (colon syntax for `this:prop` and `super:method`, camelCase, leading `-` → `_`), DD-02 (method bodies follow function conventions), DD-03 (`async` wrapper composes with methods and `static`)
- **Affects**: DD-09 (classes are in the "maybe" tier for v0.1.0 scope)

## Open Questions

- [ ] Named class expressions — deferred, same as DD-02's named function expressions
- [ ] Computed method names (`[Symbol.iterator]()`) — deferred to post-v0.1.0 with generators
- [ ] Static blocks (`static { ... }`) — deferred to post-v0.1.0
- [ ] Whether `this:-name` should produce `this.#_name` outside of class bodies or only inside — needs clarification during implementation
