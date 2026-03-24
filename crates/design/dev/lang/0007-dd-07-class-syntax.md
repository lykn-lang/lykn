# DD-07: Class Syntax

## Your role

You are helping design lykn, an s-expression syntax for JavaScript.
Read the session bootstrap doc in this project for full context. This
conversation focuses on one topic: how classes should be expressed in
lykn.

**Important**: Read these first if available:
- DD-01 (colon syntax) — `this:name` and `super:method` depend on it
- DD-02 (function forms) — method bodies use the same conventions
- DD-03 (async/await) — async methods need to compose

## What ECMAScript defines

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(this.name + " makes a sound");
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  speak() {
    console.log(this.name + " barks");
  }
}

// Getters and setters
class Circle {
  #radius;
  constructor(r) { this.#radius = r; }
  get area() { return Math.PI * this.#radius ** 2; }
  set radius(r) { this.#radius = r; }
}

// Static methods and fields
class Counter {
  static count = 0;
  static increment() { Counter.count++; }
}

// Computed method names
class Foo {
  [Symbol.iterator]() { ... }
}

// Class expressions
const MyClass = class { ... };
const MyClass = class MyNamedClass { ... };
```

ESTree representation:
- `ClassDeclaration` — `{ id, superClass, body: ClassBody }`
- `ClassExpression` — same shape, id optional
- `ClassBody` — `{ body: [MethodDefinition | PropertyDefinition | StaticBlock] }`
- `MethodDefinition` — `{ key, value: FunctionExpression, kind, computed, static }`
  - `kind`: `"constructor"`, `"method"`, `"get"`, `"set"`
- `PropertyDefinition` — `{ key, value, computed, static }` (class fields)
- `StaticBlock` — `{ body: [Statement] }` (ES2022)
- `Super` — no properties (used as callee or member object)

## The gap analysis proposal

```lisp
;; Basic class
(class Animal ()
  (constructor (name)
    (= this:name name))
  (speak ()
    (console:log this:name)))

;; With extends
(class Dog (Animal)
  (constructor (name breed)
    (super name)
    (= this:breed breed)))

;; Class expression
(const my-class (class-expr () ...))
```

Design notes from the proposal:
- Second arg is the superclass list — empty `()` means no extends,
  `(Animal)` means `extends Animal`
- Methods are lists: `(method-name (params) body...)`
- Special method name prefixes: `get-*`, `set-*`, `static-*`

## Questions to discuss

1. **Superclass syntax**: `(class Dog (Animal) ...)` — the `(Animal)`
   is a list containing the superclass. Why a list and not just an
   atom? Is it for potential future multiple inheritance (JS doesn't
   have that)? Or mixin patterns? If single inheritance is all we
   need, `(class Dog Animal ...)` is simpler. But then how do you
   distinguish "no superclass" from "superclass named as first method"?

   Options:
   - `(class Dog (Animal) ...)` — list means extends (proposal)
   - `(class Dog Animal ...)` — atom after name means extends, but
     need a way to say "no extends" — maybe `(class Dog () ...)`
     where `()` means no parent?
   - `(class Dog (extends Animal) ...)` — explicit keyword
   - `(class Dog < Animal ...)` — operator-style

2. **Method syntax**: `(speak () (console:log this:name))` — this
   looks like a function call `(speak ...)`. There's no keyword
   marking it as a method. The compiler would need to know it's
   inside a `class` body to interpret it correctly. Is this okay,
   or should methods have an explicit marker?

   ```lisp
   ;; With marker:
   (method speak () (console:log this:name))
   ```

3. **Getters and setters**: The proposal suggests `get-*` / `set-*`
   prefixes but doesn't specify exactly. Options:

   ```lisp
   ;; Option A: prefix convention
   (get-area () (return (* Math:PI (** this:radius 2))))

   ;; Option B: explicit kind marker
   (get area () (return (* Math:PI (** this:radius 2))))

   ;; Option C: keyword in method definition
   (method area () :get (return ...))
   ```

   Option A is ambiguous — is `get-data` a getter called `data` or
   a method called `getData` (after camelCase)?
   Option B uses `get`/`set` as keywords inside class bodies.

4. **Static methods and fields**: Similar ambiguity with `static-*`
   prefix. Options:

   ```lisp
   ;; Option A: prefix
   (static-increment () (++ Counter:count))

   ;; Option B: explicit marker
   (static increment () (++ Counter:count))
   (static (field count 0))

   ;; Option C: static as wrapper
   (static (increment () (++ Counter:count)))
   ```

5. **Constructor**: Should `constructor` be a regular method name,
   or a special form?

   ```lisp
   ;; As method name (proposal)
   (constructor (name) (= this:name name))

   ;; As special form
   (init (name) (= this:name name))
   ```

   JS uses `constructor`, so `constructor` aligns with JS-naming.

6. **`super` calls**: `(super name)` in constructor — this is a
   `CallExpression` with `Super` as callee. `(super:method arg)` is
   a method call on super via colon syntax. Does this just work
   with the colon syntax decisions from DD-01?

7. **Class expressions**: `(class-expr () ...)` — separate form from
   `class`? Or same form, context-determined (like `function`)?

8. **Class fields (PropertyDefinition)**: These are values, not
   methods:
   ```javascript
   class Foo {
     x = 0;
     static y = 1;
   }
   ```
   How to distinguish a field from a method in lykn's class body?
   The proposal suggests `(field x 0)` and `(static-field y 1)`.

9. **Private fields**: `#name` in JS. The proposal suggests `#count`
   atoms produce `PrivateIdentifier`. `this:#count` would be member
   access on a private field. Worth designing now or defer?

10. **Computed method names**: `[Symbol.iterator]()` — how does this
    work? Maybe `(computed (. Symbol iterator))` as the method name?

## ESTree nodes involved

- `ClassDeclaration` — `{ id: Identifier, superClass: Expression|null, body: ClassBody }`
- `ClassExpression` — same but id is optional
- `ClassBody` — `{ body: [MethodDefinition | PropertyDefinition | StaticBlock] }`
- `MethodDefinition` — `{ key, value: FunctionExpression, kind, computed, static }`
- `PropertyDefinition` — `{ key, value, computed, static }`
- `StaticBlock` — `{ body: [Statement] }`
- `Super` — `{}` (no properties)
- `PrivateIdentifier` — `{ name: string }`

## Goal

By the end of this discussion, decide:
- Superclass/extends syntax
- Method definition syntax (implicit vs explicit markers)
- Getter/setter syntax
- Static method/field syntax
- Constructor handling
- Class expression syntax
- Field definitions
- Whether to handle private fields and computed names now or defer

When we're done, I'll ask you to write a decision doc using the
template in this project.
