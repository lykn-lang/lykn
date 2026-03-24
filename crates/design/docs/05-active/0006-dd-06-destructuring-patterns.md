---
number: 6
title: "DD-06: Destructuring Patterns"
author: "whether the"
component: All
tags: [change-me]
created: 2026-03-24
updated: 2026-03-24
state: Active
supersedes: null
superseded-by: null
version: 1.0
---

# DD-06: Destructuring Patterns

**Status**: Decided
**Date**: 2026-03-24
**Session**: (this chat)

## Summary

Destructuring uses the same forms as construction — `object` and `array` — with context (pattern position) determining whether they construct or destructure. This follows the Erlang/ML principle: the constructor is the destructor. `alias` (from DD-04) handles renaming, `default` handles default values, `rest` collects remaining elements, `_` skips array positions, and `spread` is the expression-position counterpart to `rest`. Reader-level quasiquote/struct literal destructuring is deferred to the future macro system.

## Decisions

### Constructor-as-destructor pattern

**Decision**: `object` and `array` serve as both construction forms (expression position) and destructuring patterns (pattern position). The compiler determines which based on context: left side of `const`/`let`/`var`/`=`, or inside a function parameter list → pattern; otherwise → construction.

**Syntax**:

```lisp
;; construction (expression position)
(const person (object (name "Duncan") (age 42)))
(const items (array 1 2 3))

;; destructuring (pattern position)
(const (object name age) person)
(const (array first second) items)
```

```javascript
// construction
const person = { name: "Duncan", age: 42 };
const items = [1, 2, 3];

// destructuring
const { name, age } = person;
const [first, second] = items;
```

**ESTree nodes**: `ObjectPattern`, `ArrayPattern` (in pattern position); `ObjectExpression`, `ArrayExpression` (in expression position)

**Rationale**: Follows the Erlang/ML principle that the same syntax means "build" on the right and "match" on the left. No new vocabulary needed — `object` and `array` already exist in lykn. The compiler already knows whether it's processing a binding target or an expression, so the context dispatch is natural.

### Object construction syntax

**Decision**: The `object` form in expression (construction) position uses grouped key-value pairs: `(object (key value) ...)`. Each property is a two-element sub-list. Bare atoms produce shorthand properties. This provides visual distinction from destruction, where sub-lists start with `alias`, `default`, or `rest`.

**Syntax**:

```lisp
;; basic construction
(object (name "Duncan") (age 42))

;; shorthand (bare atoms)
(object name age)

;; mixed shorthand and explicit
(object name (age 42))

;; spread
(object (name "Duncan") (spread defaults))

;; computed key
(object ((computed key-expr) value))
```

```javascript
// basic construction
{ name: "Duncan", age: 42 }

// shorthand
{ name, age }

// mixed
{ name, age: 42 }

// spread
{ name: "Duncan", ...defaults }

// computed key
{ [keyExpr]: value }
```

**Rules**:

1. **Explicit key-value pair**: `(key value)` — a two-element sub-list produces a `Property` node with the key as `Identifier` and value as the compiled expression.
2. **Shorthand**: A bare atom `name` (not in a sub-list) produces a shorthand `Property` where key and value are the same `Identifier`. Maps to JS `{ name }`.
3. **Spread**: `(spread expr)` inside `object` produces a `SpreadElement`, unchanged.
4. **Single-element sub-lists are errors**: `(object (name))` is a compile-time error. Use bare `name` for shorthand.
5. **Computed keys**: `((computed key-expr) value)` — a sub-list whose first element is a `computed` form.

**ESTree nodes**: `ObjectExpression`, `Property`, `SpreadElement`

**Rationale**: Construction and destruction are visually distinguishable. In construction, sub-lists are `(key value)` pairs. In destruction, sub-lists start with `alias`, `default`, or `rest`. Bare atoms mean shorthand in both (consistent). Each property pair is self-contained — no dependency on strict positional ordering across a flat arg list. Inspired by LFE's record construction syntax (`(make-person name "Robert" age 54)` uses explicit field-name/value grouping).

### `alias` for rename in destructuring

**Decision**: `(alias key local)` renames a destructured binding, reusing the same form from DD-04 (imports). `(alias key local default-value)` with three arguments handles rename-with-default.

**Syntax**:

```lisp
;; rename
(const (object (alias name n) (alias age a)) person)

;; rename with default
(const (object (alias name n "anonymous")) person)

;; mixed plain and renamed
(const (object name (alias age a)) person)
```

```javascript
// rename
const { name: n, age: a } = person;

// rename with default
const { name: n = "anonymous" } = person;

// mixed plain and renamed
const { name, age: a } = person;
```

**ESTree nodes**: `AssignmentProperty` (with differing `key` and `value`), `AssignmentPattern` (for default)

**Rationale**: `alias` already means "this name maps to that name" from DD-04. Reusing it in destructuring is consistent — same concept, same form. Two-arg `alias` is a rename. Three-arg `alias` is rename + default. No ambiguity between rename and default because they use different forms (`alias` vs `default`).

### `default` for default values

**Decision**: `(default name value)` provides a default value for a destructured binding. Works in both `object` patterns and function parameter lists.

**Syntax**:

```lisp
;; in object destructuring
(const (object (default x 0) (default y 0)) point)

;; in array destructuring
(const (array (default a 1) (default b 2)) arr)

;; in function params
(function greet ((default name "world"))
  (console:log (template "Hello, " name "!")))

;; in arrow params
(=> ((default x 0)) (* x 2))
```

```javascript
// in object destructuring
const { x = 0, y = 0 } = point;

// in array destructuring
const [a = 1, b = 2] = arr;

// in function params
function greet(name = "world") {
  console.log(`Hello, ${name}!`);
}

// in arrow params
((x = 0) => x * 2)
```

**ESTree nodes**: `AssignmentPattern`

**Rationale**: Explicit `default` form is unambiguous — no confusion between `(name value)` meaning rename vs default. The same `AssignmentPattern` ESTree node is used for both destructuring defaults and function parameter defaults, so using the same `default` form for both is consistent.

### `_` for skipping array elements

**Decision**: The atom `_` in an `array` pattern emits `null` in the `ArrayPattern` elements array, skipping that position.

**Syntax**:

```lisp
;; skip first element
(const (array _ second) arr)

;; skip multiple
(const (array _ _ third) arr)

;; skip middle
(const (array first _ third) arr)
```

```javascript
// skip first element
const [, second] = arr;

// skip multiple
const [, , third] = arr;

// skip middle
const [first, , third] = arr;
```

**ESTree nodes**: `ArrayPattern` (with `null` elements)

**Rationale**: `_` as a wildcard/skip marker is universal across Erlang, Rust, Haskell, ML, and Python. Immediately recognizable.

### `rest` for collecting remaining elements

**Decision**: `(rest name)` in a pattern collects remaining elements. Works in both `object` and `array` patterns. Must be the last element.

**Syntax**:

```lisp
;; array rest
(const (array head (rest tail)) items)

;; object rest
(const (object name (rest others)) person)

;; in function params
(function process ((array first (rest remaining)))
  (console:log first remaining))
```

```javascript
// array rest
const [head, ...tail] = items;

// object rest
const { name, ...others } = person;

// in function params
function process([first, ...remaining]) {
  console.log(first, remaining);
}
```

**ESTree nodes**: `RestElement`

**Rationale**: `rest` clearly communicates "collect the rest." It's the pattern-position counterpart to `spread` (expression position). Using different names for different directions makes intent clear.

### `spread` for spreading in expressions

**Decision**: `(spread expr)` in expression position spreads values. Works in `array` literals, `object` literals, and function call arguments.

**Syntax**:

```lisp
;; array spread
(const combined (array 1 2 (spread other)))

;; object spread
(const merged (object (name "Duncan") (spread defaults)))

;; function call spread
(my-func a b (spread args))
```

```javascript
// array spread
const combined = [1, 2, ...other];

// object spread
const merged = { name: "Duncan", ...defaults };

// function call spread
myFunc(a, b, ...args);
```

**ESTree nodes**: `SpreadElement`

**Rationale**: `spread` in expressions, `rest` in patterns. Same underlying JS syntax (`...`) but different semantics — spread pushes values out, rest collects values in. Distinct names make the direction explicit.

### Nested destructuring

**Decision**: The rename target in `alias` can itself be a pattern (`object` or `array`). This enables nested destructuring to arbitrary depth.

**Syntax**:

```lisp
;; object containing array
(const (object (alias data (array first second))) response)

;; object containing object
(const (object (alias user (object name email))) response)

;; deep nesting
(const (object (alias data (object (alias items (array first))))) response)
```

```javascript
// object containing array
const { data: [first, second] } = response;

// object containing object
const { user: { name, email } } = response;

// deep nesting
const { data: { items: [first] } } = response;
```

**ESTree nodes**: Nested `ObjectPattern` / `ArrayPattern` inside `AssignmentProperty`

**Rationale**: Falls out naturally from `alias` — the local binding is just a pattern instead of an atom. No special syntax needed. Deep nesting gets verbose, but that's inherent to the structure being destructured, not a lykn problem.

### Destructuring in assignment

**Decision**: When the left side of `=` is an `object` or `array` form, the compiler emits an `AssignmentExpression` with a pattern.

**Syntax**:

```lisp
(= (object a b) obj)
(= (array x y) (array 1 2))
```

```javascript
({ a, b } = obj);
[x, y] = [1, 2];
```

**ESTree nodes**: `AssignmentExpression` with `ObjectPattern` or `ArrayPattern` as `left`

**Rationale**: The `=` form already exists. The compiler just needs to detect when the left side is a pattern (starts with `object` or `array`) and emit the appropriate pattern node instead of an identifier.

### Destructuring in function parameters

**Decision**: Patterns can appear anywhere in a function's parameter list. A destructured param is an `object` or `array` form inside the param list.

**Syntax**:

```lisp
;; arrow with object destructuring
(=> ((object name age)) (console:log name age))

;; function with mixed params
(function process (req (object data (default status 200)))
  (console:log req data status))

;; array destructuring in params
(function head ((array first (rest _)))
  (return first))
```

```javascript
// arrow with object destructuring
(({ name, age }) => console.log(name, age))

// function with mixed params
function process(req, { data, status = 200 }) {
  console.log(req, data, status);
}

// array destructuring in params
function head([first, ..._]) {
  return first;
}
```

**ESTree nodes**: `ObjectPattern` / `ArrayPattern` in the `params` array of function nodes

**Rationale**: Three levels of nesting (param list → pattern → bindings) is structural honesty. Erlang and Clojure work the same way. The compiler already processes param lists element-by-element, so detecting a pattern (list starting with `object` or `array`) vs a plain param (atom) is straightforward.

## Rejected Alternatives

### `obj-pat` / `array-pat` marker forms

**What**: Dedicated pattern forms distinct from the constructor forms.

**Why rejected**: Introduces unnecessary vocabulary. The constructor-as-destructor pattern (Erlang/ML tradition) is cleaner — same form, context determines meaning. No new names to learn.

### Reader-level `{...}` / `[...]` syntax

**What**: Curly braces and square brackets in the reader for patterns.

**Why rejected**: Requires reader changes. S-expressions use parentheses. Keeping the reader minimal is a consistent principle (DD-01).

### Positional pairs for rename/default

**What**: `(name n)` for rename, `(x 0)` for default, distinguished by whether the second element is an identifier or literal.

**Why rejected**: Fragile. `(x default-value)` where the default is a variable reference is ambiguous — is it a rename or a default? Explicit `alias` and `default` forms eliminate all ambiguity.

### Flat alternating key-value pairs for object construction

**What**: `(object k1 v1 k2 v2)` with keys and values alternating in a flat list.

**Why rejected**: Different argument structure between construction (alternating pairs) and destruction (bare atoms + modifiers) is confusing. Grouped pairs `(k1 v1)` are self-contained and visually distinct from pattern modifiers. Inspired by LFE's record construction syntax, which uses explicit field-name/value grouping.

### Quasiquote-based pattern syntax

**What**: `` (const `#S(,name ,age) person) `` using CL-style struct literals with quasiquote for pattern holes.

**Why rejected for v0.1.0**: Requires reader machinery (quasiquote, unquote, `#S` dispatch) that doesn't exist yet. Deferred to the future macro system, at which point quasiquote-based destructuring will fall out naturally as a consequence of having the reader machinery.

## Edge Cases

| Case | Behavior | Example |
|------|----------|---------|
| `_` in object pattern | Not a skip — it's a binding named `_` | `(const (object _) obj)` → `const { _ } = obj` |
| `rest` not last | Compile-time error | `(const (array (rest a) b) x)` → error |
| Multiple `rest` | Compile-time error | `(const (array (rest a) (rest b)) x)` → error |
| Empty pattern | Valid | `(const (object) obj)` → `const {} = obj` |
| `default` in `alias` target | Nest `default` inside `alias` | `(alias name (default n "anon"))` — no, use three-arg `alias` |
| Nested pattern in `alias` | Valid | `(alias data (array first))` → `data: [first]` |
| `spread` in pattern position | Compile-time error, use `rest` | `(const (array (spread x)) arr)` → error |
| `rest` in expression position | Compile-time error, use `spread` | `(array 1 (rest x))` → error |
| `_` as regular variable name | Valid outside array patterns | `(const _ 42)` → `const _ = 42` |
| `(object (name))` single-element sub-list | Compile-time error | Use bare `name` for shorthand |

## Dependencies

- **Depends on**: DD-01 (camelCase conversion applies to all binding names), DD-02 (function forms — destructuring in params), DD-04 (`alias` form introduced there)
- **Affects**: DD-07 (class constructor params may use destructuring), DD-09 (destructuring is essential for v0.1.0)

## Open Questions

- [ ] When lykn adds macro support, the reader machinery (quasiquote, unquote, `#S` dispatch) will enable CL-style literal destructuring as a natural consequence — document this as a planned evolution path
- [ ] Reserved reader characters (`` ` ``, `,`, `#`) should be formally reserved in the reader for the future macro system
- [ ] Whether `_` should be special in object patterns (currently treated as a normal binding name, only special in array patterns as a skip marker)
