# DD-27: Surface Form Expansion Inside `class` Bodies

**Status**: Decided
**Date**: 2026-04-15
**Depends on**: DD-22 (surface `=` is equality)
**Blocks**: Book Ch 20 (Classes)

## Summary

`class` bodies are currently kernel passthrough — surface forms
inside them are not expanded. This means `=` inside a class body
is kernel assignment (`this.x = x`), not surface equality
(`x === y`). This creates a confusing context switch where `=`
means two different things depending on whether you're inside or
outside a class body.

The fix: expand surface forms inside class bodies before passing
to codegen. After this change, `set!`, `bind`, `func`, `fn`,
`cell`, `swap!`, `reset!`, `express`, `=` (equality), `and`,
`or`, `not`, and all other surface forms work uniformly inside
class bodies. Kernel `=` (assignment) is accessed via a new
explicit `:=` form.

## The problem

```lisp
;; SURFACE CONTEXT — = is equality (DD-22)
(= a b)        ;; → a === b

;; CLASS BODY (kernel passthrough) — = is assignment
(class Dog ()
  (constructor (name)
    (= this:name name)))    ;; → this.name = name  (ASSIGNMENT!)
```

The reader sees `=` meaning two different things. This violates
the surface language's principle that surface forms behave
consistently everywhere.

Additional problems:
- `set!` doesn't work inside class bodies (it's a surface form)
- `bind` doesn't work (would need to become `const`)
- `func` doesn't work (would need to become `function`)
- Threading macros, `obj`, `match`, etc. — none work

## The solution

### Part A: Expand surface forms inside class bodies

When the classifier encounters `(class ...)`, instead of creating
a `KernelPassthrough` for the entire form, it should:

1. Keep the class head, name, and superclass as-is (kernel)
2. For each method body and constructor body: recursively classify
   and emit the body expressions through the surface pipeline
3. Wrap the results back into the kernel `class` structure

This is the same pattern used for `export` and `async` — the
wrapper is kernel, but the contents are expanded.

### Part B: Explicit assignment form `assign` (class body only)

Since surface `=` becomes equality inside class bodies (after
Part A), class bodies need an explicit assignment form. `assign`
is restricted to class body context — it produces a compile error
outside class bodies (use `set!` for mutation elsewhere):

```lisp
(class Dog ()
  (constructor (name)
    (assign this:name name)))    ;; → this.name = name

;; Outside class body:
(assign x 42)  ;; COMPILE ERROR: assign can only be used inside class bodies
```

`assign` compiles to the JS assignment operator `=` and is only
valid for `this`-property assignment in constructors and methods.

**Why `:=` and not `set!`**: `set!` is a surface form for
external property mutation with specific semantics (DD-23). `:=`
is a general-purpose kernel assignment that covers `this.prop`,
local variables, and any other assignment target. Inside class
bodies, you need `this.prop = value` which is a direct assignment,
not the `set!` pattern.

### Part C: What works after this change

```lisp
(class Dog (Animal)
  ;; Constructor uses := for this-assignment
  (constructor (name breed)
    (super name)
    (:= this:breed breed))

  ;; Methods can use surface forms!
  (speak ()
    ;; bind works
    (bind greeting (template this:name " says woof"))
    ;; = is equality
    (if (= this:breed "poodle")
      (return (template greeting " (fancy)"))
      (return greeting)))

  ;; Surface func patterns in methods
  (fetch-toy (toy-name)
    ;; threading macros work
    (-> toy-name
      (string:to-upper-case)
      (template this:name " fetches " _))))
```

```javascript
class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  speak() {
    const greeting = `${this.name} says woof`;
    if (this.breed === "poodle") {
      return `${greeting} (fancy)`;
    }
    return greeting;
  }
  fetchToy(toyName) {
    return `${this.name} fetches ${toyName.toUpperCase()}`;
  }
}
```

## Implementation

### Phase 1: Add `:=` kernel assignment form

**Both compilers.** Minimal change:

**JS compiler** (`src/compiler.js`): Add handler for `:=`:
```javascript
':='(args) {
    return {
        type: 'AssignmentExpression',
        operator: '=',
        left: compileExpr(args[0]),
        right: compileExpr(args[1]),
    };
}
```

**Rust codegen** (`crates/lykn-lang/src/codegen/emit.rs`):
Add `:=` dispatch that emits `left = right`.

**Rust classifier** (`dispatch.rs`): Add `:=` to kernel forms.

This is safe to ship independently — `:=` works everywhere,
including inside current kernel passthrough class bodies.

### Phase 2: Expand surface forms inside class bodies

This is the structural change. The classifier needs to:

1. Parse the `class` form structure (name, superclass, members)
2. For each member (constructor, method, getter, setter, field):
   - Keep the member declaration syntax as kernel
   - Classify each body expression through `classify_form`
3. Create a new `SurfaceForm::Class` variant that holds the
   classified member bodies

The emitter then:
1. Emits each classified body expression through `emit_form`
2. Wraps the results in the kernel class structure

**Key insight**: Method/constructor parameter lists stay kernel
(no type annotations on class method params — that's a separate
feature). Only the body expressions are expanded.

### Phase 3: Tests

- `:=` assignment in all contexts (kernel, class body, top-level)
- `bind` inside class method body → `const`
- `=` inside class method body → `===` (equality)
- `set!` inside class method body → property assignment
- `func` inside class method body → function declaration
- Threading macros inside class method body
- `obj` inside class method body
- `class` with `super` calls (unchanged)
- `class` with getters/setters (unchanged)
- `--strip-assertions` with class body surface forms
- Existing class tests still pass

### Phase 4: Book + docs update

- Update Ch 20 examples to use `:=` for this-assignment
- Update surface forms guide with `:=` and class body expansion
- Update SKILL.md

## Interaction with existing class syntax

The `class` form's structure is:

```lisp
(class Name (Super)
  (field prop value)
  (constructor (params) body...)
  (method-name (params) body...)
  (get prop () body...)
  (set prop (val) body...))
```

Member declarations (`field`, `constructor`, method names, `get`,
`set`) are structural — they define the class shape. These stay
kernel. Only the `body...` portions of constructors, methods,
getters, and setters get surface expansion.

## Edge cases

| Case | Behavior |
|------|----------|
| `:=` at top level | Works — kernel assignment |
| `:=` inside surface func | Works — kernel form passes through |
| `=` inside class body (after fix) | Equality (`===`), not assignment |
| `set!` inside class body (after fix) | Property mutation (surface form, now expanded) |
| `bind` inside class body (after fix) | `const` binding (surface form, now expanded) |
| Nested class inside class | Inner class also gets expansion |
| `this:prop` access | Unchanged — kernel colon-access still works |
| `super` calls | Unchanged — kernel form, passes through |

## Rejected alternatives

### A: Document the context switch

"Inside class bodies, `=` is assignment." This is confusing and
violates the surface language's consistency principle. Rejected
because it forces every reader to learn a context-dependent rule.

### B: Make `set!` work in kernel passthrough

Adding `set!` to the codegen would solve the assignment case but
wouldn't fix `bind`, `func`, threading macros, or any other
surface form inside class bodies. Partial solution. Rejected.

### C: Use kernel `=` for assignment everywhere

Reverting DD-22's surface `=` as equality. Rejected — DD-22 is
correct and matches every Lisp dialect.
