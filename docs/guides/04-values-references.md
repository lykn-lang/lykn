# Values & References

Discipline around lykn's value model: primitives vs objects, immutable
bindings, controlled mutation via cells, non-destructive updates, copying,
and equality. lykn's surface language enforces immutability by default —
`bind` is always `const`, mutation requires `cell`, and `assoc`/`dissoc`/
`conj` produce new values instead of modifying existing ones.

Target environment: **Deno**, **ESM-only**, **Biome** on compiled
output, lykn/surface syntax throughout.

---

## ID-01: Primitives Are Immutable Values; Objects Are Mutable References

**Strength**: MUST

**Summary**: The seven primitive types are immutable and compared by
value. Everything else is a mutable object compared by identity. This
is a JS fact that lykn inherits — lykn compiles to JS.

```lykn
;; Primitives — immutable, compared by value
(bind a "hello")
(bind b "hello")
(= a b)  ;; true — same value

;; Objects — mutable, compared by identity
(bind x (obj :name "Alice"))
(bind y (obj :name "Alice"))
(= x y)  ;; false — different objects, same content
```

**The seven primitive types**: `undefined`, `null`, `boolean`, `number`,
`bigint`, `string`, `symbol`. Everything else is an object.

**Rationale**: This is the foundational split in JavaScript's value
model. lykn compiles to JS, so this split applies to all lykn code.
Understanding it is prerequisite to every other idiom in this guide.

---

## ID-02: Objects Are Passed by Identity, Not by Reference

**Strength**: SHOULD

**Summary**: JavaScript passes object identities by value. Mutation is
visible to the caller; reassignment is not. In lykn, surface code
cannot reassign — but the JS objects underneath can still be mutated.

```lykn
;; Mutation through identity sharing
(bind data (obj :x 0))
;; If data is passed to a JS function that mutates it,
;; the mutation is visible here. This is why lykn encourages
;; assoc/dissoc/conj instead of mutation.
```

**Rationale**: This is why lykn's surface language steers you toward
immutable updates (`assoc`, `dissoc`, `conj`) and `cell` for controlled
mutation. Even though `bind` prevents reassignment, the underlying JS
objects can still be mutated by code that receives a reference.

---

## ID-03: `typeof` and Its Quirks

**Strength**: MUST

**Summary**: Know the two `typeof` gotchas: `null` returns `"object"`,
and functions return `"function"`. In lykn, use `js:typeof` or the
kernel `typeof` form.

```lykn
;; typeof quirks (these are JS facts)
(= (js:typeof null) "object")       ;; true — historical bug
(= (js:typeof #a()) "object")       ;; true — arrays are objects
(= (js:typeof (fn (:any x) x)) "function")  ;; true

;; Correct null check
(= value null)

;; Correct array check
(Array:isArray value)
```

**Rationale**: `typeof null === "object"` is a well-known historical
bug. `typeof` returns `"function"` for functions even though functions
are objects. Use explicit checks with `=` and `Array:isArray`.

---

## ID-04: `bind` IS Immutable — No Binding-vs-Value Confusion

**Status**: ELIMINATED BY LANGUAGE DESIGN

**Summary**: In JavaScript, `const` freezes the binding but not the
value — one of the most common JS misconceptions.

lykn eliminates this confusion: `bind` produces `const`, and the
surface language provides no way to mutate the underlying value. For
objects, use `assoc`/`dissoc` to create new copies. For values that
genuinely need to change, use `cell`. There is no silent mutation path
in surface lykn — every mutation site is marked with `!`.

**See also**: `01-core-idioms.md` ID-14

---

## ID-05: No Reassignment in Surface lykn — Only Immutable Updates

**Status**: ELIMINATED BY LANGUAGE DESIGN

**Summary**: In JavaScript, confusing reassignment (`= to a variable`)
with mutation (`.prop =`, `.push()`) is a common source of bugs.

lykn eliminates reassignment entirely in surface code: `bind` is
immutable, and there is no assignment operator. Mutation is only
available through `cell` + `swap!`/`reset!`. Object updates go through
`assoc`/`dissoc`/`conj`, which create new values.

---

## ID-06: Use `assoc` for Immutable Object Updates

**Strength**: SHOULD

**Summary**: Use `assoc` to create a modified copy of an object. The
original is unchanged.

```lykn
;; Good — immutable update via assoc
(bind original (obj :name "Alice" :scores #a(90 85)))
(bind updated (assoc original :name "Bob"))
;; original is unchanged
;; updated has :name "Bob", shares :scores reference
```

**What `assoc` copies**: All own enumerable properties via spread. It
is a shallow copy — nested objects are shared with the original.

**Rationale**: `assoc` is lykn's idiomatic replacement for JS spread
updates (`{ ...obj, key: value }`). It is concise, clearly expresses
intent, and produces clean JS output.

**See also**: ID-08

---

## ID-07: `Object:assign` vs `assoc` — Know the Difference

**Strength**: CONSIDER

**Summary**: `assoc` uses spread (property definition semantics).
`Object:assign` uses assignment semantics — it invokes inherited
setters.

```lykn
;; assoc — definition semantics (ignores inherited setters)
(bind copy (assoc source :key value))

;; Object:assign — assignment semantics (triggers setters)
(Object:assign target source)
```

**Practical rule**: Prefer `assoc` in lykn code. Use `Object:assign`
only when you need to trigger setters or mutate an existing target.

---

## ID-08: Shallow Copies Share Nested References

**Strength**: MUST

**Summary**: `assoc` produces a shallow copy. Nested objects are shared
with the original.

```lykn
(bind original (obj :user (obj :name "Alice") :tags #a("admin")))
(bind copy (object (spread original)))

;; Top-level: independent
;; But nested :user object is shared — same reference
```

**Rule of thumb**: Shallow copies are safe for flat data. If any
property holds an object that might be mutated, you need
`structuredClone` or must update at each nested level:

```lykn
;; Manual deep update via nested assoc
(bind updated (assoc original
  :user (assoc original:user :name "Bob")))
```

---

## ID-09: `structuredClone` for Deep Copies

**Strength**: SHOULD

**Summary**: Use `structuredClone` when you need a fully independent
copy of nested data.

```lykn
;; Good — deep copy, all nesting independent
(bind original (obj :user (obj :name "Alice") :tags #a("admin")))
(bind deep (structuredClone original))
```

**Limitations**: Cannot clone functions, Symbol-keyed properties, or
class instances (lose prototype).

---

## ID-10: JSON Round-Trip Is NOT a Reliable Deep Copy

**Strength**: MUST

**Summary**: `JSON:parse(JSON:stringify(x))` silently drops or corrupts
non-JSON-safe values. Use `structuredClone` instead.

```lykn
;; Bad — loses Date, undefined, functions, symbols
(bind bad (JSON:parse (JSON:stringify original)))

;; Good
(bind good (structuredClone original))
```

---

## ID-11: Prefer `assoc`/`dissoc`/`conj` over Deep Copying

**Strength**: SHOULD

**Summary**: When you need to change one field in a nested structure,
use `assoc` at each modified level instead of deep-copying the entire
object.

```lykn
;; Good — non-destructive update, structural sharing
(bind original (obj
  :user (obj :name "Alice" :prefs (obj :theme "dark"))
  :tags #a("admin")))

(bind updated (assoc original
  :user (assoc original:user
    :prefs (assoc original:user:prefs :theme "light"))))
;; original is completely unchanged
;; updated:tags is the same reference (shared, unmodified)
;; updated:user is a new object (modified branch)
```

**Rationale**: Deep copying clones everything. Non-destructive updates
via `assoc` only create new objects along the modified path, sharing
unmodified branches. This is more efficient and is the foundation of
state management patterns.

---

## ID-12: Don't Mutate Function Arguments

**Strength**: MUST

**Summary**: Never mutate objects or arrays received as parameters. In
lykn, the surface language makes this natural — use `assoc`/`conj`
instead of mutation.

```lykn
;; Good — non-destructive, original untouched
(func get-sorted :args (:array arr) :returns :array :body
  (arr:toSorted))

;; Good — iterate without mutation
(func log-all :args (:array arr) :returns :void :body
  (for-of item arr
    (console:log item)))
```

**Rationale**: The caller does not expect passing an argument to
destroy it. lykn's immutable-by-default design makes this natural —
`assoc`, `conj`, and non-destructive array methods are the default.

---

## ID-13: Defensive Copying at Module Boundaries

**Strength**: SHOULD

**Summary**: When exchanging data between modules, use immutable updates
or copy at the boundary.

```lykn
;; Good — input defense: use non-destructive sort
(export (func process-items :args (:array items) :returns :array :body
  (bind local (items:toSorted (fn (:any a :any b) (- a:priority b:priority))))
  (local:map transform)))

;; Good — output defense via assoc (new object each time)
;; Or use Object:freeze for constant data
```

**Rationale**: lykn's surface language reduces the need for defensive
copying — `assoc`/`conj` always create new values. But when interacting
with JS APIs that may mutate, defensive copies at boundaries are still
important.

---

## ID-14: `assoc`/`dissoc`/`conj` — The Immutable Update Trio

**Strength**: SHOULD

**Summary**: These three surface forms are lykn's primary tools for
non-destructive data updates.

```lykn
;; assoc — add or update fields (returns new object)
(bind config (assoc defaults :timeout 5000))

;; dissoc — remove fields (returns new object)
(bind public-user (dissoc user :password :ssn))

;; conj — append to array (returns new array)
(bind with-new (conj items new-item))
```

```lykn
(bind defaults (obj :timeout 3000 :retries 1))
(bind config (assoc defaults :timeout 5000))
(console:log config:timeout)
(console:log defaults:timeout)

(bind user (obj :name "Alice" :password "secret" :ssn "123"))
(bind public-user (dissoc user :password :ssn))
(console:log public-user)

(bind items #a(1 2 3))
(bind with-new (conj items 4))
(console:log with-new)
(console:log items)
```

```
5000
3000
{ name: "Alice" }
[ 1, 2, 3, 4 ]
[ 1, 2, 3 ]
```

**Override order**: `assoc` places new values after the spread, so
overrides always win. This matches `{ ...obj, key: value }` semantics.

**See also**: `01-core-idioms.md` ID-18, ID-24

---

## ID-15: Prefer Non-Destructive Array Methods

**Strength**: SHOULD

**Summary**: Use ES2023 non-destructive array methods instead of their
mutating counterparts.

```lykn
;; Non-destructive (returns new array)
(bind sorted (arr:toSorted))
(bind reversed (arr:toReversed))
(bind replaced (arr:with 2 "new"))

;; Pre-ES2023 workaround: conj, or spread + kernel
(bind appended (conj arr new-item))
```

**Common trap**: `:reverse` and `:sort` return the **same array
reference** they mutated, not a new array.

**Rationale**: The destructive methods are legacy designs. The
non-destructive alternatives (ES2023) eliminate accidental mutation
and work naturally with lykn's immutable-by-default philosophy.

---

## ID-16: `Object:freeze` for Shallow Protection

**Strength**: SHOULD

**Summary**: `Object:freeze` makes all own properties non-writable and
the object non-extensible. It is shallow.

```lykn
;; Good — frozen configuration
(bind CONFIG (Object:freeze (obj
  :max-retries 3
  :timeout 5000)))
```

**See also**: `01-core-idioms.md` ID-15

---

## ID-17: `seal` vs `freeze` vs `preventExtensions`

**Strength**: CONSIDER

**Summary**: Three progressive protection levels.

| | `preventExtensions` | `seal` | `freeze` |
|-|:---:|:---:|:---:|
| Add new properties | No | No | No |
| Delete properties | Yes | No | No |
| Modify values | Yes | Yes | No |

All three are shallow and irreversible.

---

## ID-18: Deep Freeze for Full Immutability

**Strength**: CONSIDER

**Summary**: Recursively apply `Object:freeze` for deep immutability.

```lykn
(func deep-freeze :args (:any value) :returns :any :body
  (if (and (= (js:typeof value) "object")
           (!= value null)
           (not (Object:isFrozen value)))
    (block
      (Object:freeze value)
      (for-of v (Object:values value)
        (deep-freeze v))))
  value)
```

**Rationale**: For configuration objects with known shapes, manual
freezing at each level is simpler. For arbitrary data, recursive
freeze provides the strongest guarantee.

---

## ID-19: Frozen Objects as Lookup Tables

**Strength**: SHOULD

**Summary**: Use `Object:freeze` for constant lookup tables that must
never change at runtime.

```lykn
;; Good — frozen enum-like lookup
(bind HttpStatus (Object:freeze (obj
  :OK 200
  :NOT-FOUND 404
  :INTERNAL-ERROR 500)))

;; Good — frozen defaults with assoc override
(bind DEFAULTS (Object:freeze (obj
  :timeout 5000
  :retries 3)))
(bind config (assoc DEFAULTS :timeout 10000))
```

---

## ID-20: The `cell` Mutation Model

**Strength**: MUST

**Summary**: When you genuinely need mutable state, use `cell` to make
mutation explicit, auditable, and contained.

```lykn
;; Create a cell — wraps value in { value: ... }
(bind counter (cell 0))

;; Read the current value
(console:log (express counter))   ;; 0

;; Update via function (swap!)
(swap! counter (fn (:number n) (+ n 1)))
(console:log (express counter))   ;; 1

;; Set directly (reset!)
(reset! counter 0)
(console:log (express counter))   ;; 0
```

```lykn
(bind counter (cell 0))
(console:log (express counter))
(swap! counter (fn (:number n) (+ n 1)))
(console:log (express counter))
(reset! counter 0)
(console:log (express counter))
```

```
0
1
0
```

**When to use `cell`**: Counters, accumulators, caches, and state that
genuinely changes over time. Prefer `assoc`/`conj` for data
transformations.

**Mutation visibility**: Every mutation site is marked with `!`
(`swap!`, `reset!`), and reading requires `express`. This makes
mutation auditable — you can grep for `!` to find all mutation points.

**See also**: `01-core-idioms.md` ID-01, ID-14

---

## ID-21: Property Descriptor Mechanics

**Strength**: CONSIDER

**Summary**: Properties created by literals/assignment default to
all-true attributes. Properties created by `Object:defineProperty`
default to all-false.

These are JS internals — they apply to lykn's compiled output. In
surface lykn, you rarely need to work with property descriptors
directly. When you do, use the kernel forms.

---

## ID-22: Getters and Setters in Classes

**Strength**: SHOULD

**Summary**: Use getters for derived/computed values and setters for
validated assignment in `class` forms.

```lykn
(class Circle ()
  (field -radius 0)
  (constructor ((radius)) (= this:-radius radius))
  (get area () (return (* Math:PI (** this:-radius 2))))
  (get radius () (return this:-radius))
  (set radius ((value))
    (if (or (!= (js:typeof value) "number") (< value 0))
      (throw (new RangeError "radius must be a non-negative number")))
    (= this:-radius value)))
```

---

## ID-23: Enumerability Controls Visibility

**Strength**: SHOULD

**Summary**: Enumerability determines which properties appear in
`Object:keys`, `for-of` on `Object:entries`, spread, and
`JSON:stringify`. This is a JS runtime detail — it applies to lykn's
compiled output.

---

## ID-24: `=` Compares Identity for Objects, Value for Primitives

**Strength**: MUST

**Summary**: `(= a b)` compiles to `a === b`, which compares object
identity (same reference) and primitive value (same content).

```lykn
;; Primitives — value comparison
(= 1 1)             ;; true
(= "abc" "abc")     ;; true

;; Objects — identity comparison
(= (obj) (obj))     ;; false — different objects
(bind a (obj))
(= a a)             ;; true — same reference
```

```lykn
(console:log (= 1 1))
(console:log (= "abc" "abc"))
(console:log (= (obj) (obj)))
(bind a (obj))
(console:log (= a a))
```

```
true
true
false
true
```

**Rationale**: `=` answers "are these the same object?" not "do these
objects contain the same data?" For deep structural comparison, use
testing libraries or implement manually.

---

## ID-25: `Object:is` for `NaN` and `-0` Edge Cases

**Strength**: CONSIDER

**Summary**: `Object:is` fixes two `=` quirks: `(= NaN NaN)` is
`false`, and `(= 0 (- 0))` is `true`.

```lykn
;; = gets these wrong (JS === behavior):
(= NaN NaN)               ;; false
;; Object:is fixes it:
(Object:is NaN NaN)        ;; true

;; For NaN detection, prefer:
(Number:isNaN value)
```

---

## ID-26: Deep Equality Requires Manual Implementation

**Strength**: SHOULD

**Summary**: lykn (like JS) has no built-in deep structural equality.
Use testing libraries for tests; implement manually for production.

```lykn
;; In tests
(import "https://deno.land/std/assert/mod.ts" (assert-equals))
(assert-equals (obj :a 1 :b #a(2 3)) (obj :a 1 :b #a(2 3)))

;; In production — match on type constructors for domain-specific equality
(type Point (Pt :number x :number y))

(func point-equal? :args (:any a :any b) :returns :boolean :body
  (and (= a:x b:x) (= a:y b:y)))
```

---

## ID-27: Own vs Inherited Properties — Use `Object:hasOwn`

**Strength**: SHOULD

**Summary**: Use `Object:hasOwn` (ES2022) to check if a property is
directly on the object.

```lykn
(bind config (Object:create null))
(Object:hasOwn config "timeout")    ;; safe on null-prototype objects
```

---

## ID-28: Prototype Chain Affects Lookup but NOT Assignment

**Strength**: MUST

**Summary**: Reading traverses the prototype chain. Writing creates an
own property that shadows the inherited one. In surface lykn, you
rarely interact with prototypes directly — this matters when using
`class` forms or interacting with JS APIs.

---

---

## Best Practices Summary

### Quick Reference Table

| ID | Pattern | Strength | Key Insight |
|----|---------|----------|-------------|
| 01 | Primitives immutable, objects mutable | MUST | Foundational split in JS value model |
| 02 | Pass by identity, not reference | SHOULD | Mutation shared; use `assoc` to avoid |
| 03 | `typeof` quirks | MUST | `null` → `"object"`, use `Array:isArray` |
| 04 | `bind` IS immutable | ELIMINATED | No binding-vs-value confusion |
| 05 | No reassignment in surface lykn | ELIMINATED | Only immutable updates or `cell` |
| 06 | `assoc` for object updates | SHOULD | Shallow copy with overrides |
| 07 | `Object:assign` vs `assoc` | CONSIDER | Assignment vs definition semantics |
| 08 | Shallow copies share nested refs | MUST | `assoc` is shallow — nested shared |
| 09 | `structuredClone` for deep copies | SHOULD | Handles circular refs, Date, Map |
| 10 | JSON round-trip not reliable | MUST | Drops undefined, functions, symbols |
| 11 | `assoc` over deep copying | SHOULD | Update at modified levels only |
| 12 | Don't mutate function arguments | MUST | Use `assoc`/`conj` instead |
| 13 | Defensive copying at boundaries | SHOULD | Less needed with immutable defaults |
| 14 | `assoc`/`dissoc`/`conj` trio | SHOULD | The primary update pattern |
| 15 | Non-destructive array methods | SHOULD | `toSorted`, `toReversed`, `with` |
| 16 | `Object:freeze` — shallow | SHOULD | Non-writable + non-extensible |
| 17 | seal vs freeze vs preventExtensions | CONSIDER | Progressive protection levels |
| 18 | Deep freeze | CONSIDER | Recursive `Object:freeze` |
| 19 | Frozen lookup tables | SHOULD | Combine with `assoc` for overrides |
| 20 | `cell` mutation model | MUST | `swap!`/`reset!` for controlled mutation |
| 21 | Property descriptor mechanics | CONSIDER | JS internals, kernel-level concern |
| 22 | Getters/setters in classes | SHOULD | Computed values, validated assignment |
| 23 | Enumerability | SHOULD | Controls listing visibility |
| 24 | `=` is identity for objects | MUST | Same content ≠ same object |
| 25 | `Object:is` for NaN/-0 | CONSIDER | Fixes two `=` edge cases |
| 26 | Deep equality needs manual impl | SHOULD | Use test libs or `type`+`match` |
| 27 | `Object:hasOwn` | SHOULD | Safe on null-prototype objects |
| 28 | Prototype affects lookup only | MUST | Write creates own property |

---

## Related Guidelines

- **Core Idioms**: See `01-core-idioms.md` for `bind`/`cell` (ID-01,
  ID-14), `assoc`/`conj` (ID-18, ID-24), `Object:freeze` (ID-15)
- **API Design**: See `02-api-design.md` for return conventions, `type`
  constructors, factory patterns
- **Error Handling**: See `03-error-handling.md` for validation at
  boundaries (ID-23, ID-24)
- **Type Discipline**: See `05-type-discipline.md` for type annotations
  and constructor validation
- **Anti-Patterns**: See `09-anti-patterns.md` for mutation and copying
  anti-patterns
- **Surface Forms Reference**: See `00-lykn-surface-forms.md` for
  `bind`, `cell`, `assoc`, `dissoc`, `conj`
