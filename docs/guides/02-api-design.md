# API Design

Essential patterns for designing clean, consistent, and composable lykn
APIs. These idioms cover function signatures, module interfaces,
contracts, type constructors, iteration, return conventions, and naming —
leveraging lykn's surface language for safer, more expressive APIs than
raw JavaScript allows.

Target environment: **Deno**, **ESM-only**, **Biome** on compiled
output, lykn/surface syntax throughout.

---

## ID-01: Keyword Arguments via `obj` for 3+ Parameters

**Strength**: SHOULD

**Summary**: Use an `obj` with keyword-value pairs for functions with
multiple optional or configuration-style parameters. Use `func` with
typed positional args for required parameters.

```lykn
;; Good — keyword-style options via obj destructuring
(func create-server
  :args (:object opts)
  :returns :object
  :body
  (bind port (?? opts:port 8080))
  (bind host (?? opts:host "localhost"))
  (bind tls (?? opts:tls false))
  (obj :port port :host host :tls tls))

(create-server (obj :port 3000 :tls true))
(create-server (obj))
```

Compiles to:

```js
function createServer(opts) {
  /* type check ... */
  const port = opts.port ?? 8080;
  const host = opts.host ?? "localhost";
  const tls = opts.tls ?? false;
  return {port, host, tls};
}
createServer({port: 3000, tls: true});
createServer({});
```

```lykn
;; Bad — positional args are unreadable at the call site
(func create-server
  :args (:number port :string host :boolean tls)
  :returns :object
  :body (obj :port port :host host :tls tls))

(create-server 3000 "localhost" true)  ;; what is true?
```

**Rationale**: Call sites become self-documenting with keyword syntax,
argument order is irrelevant, and new parameters can be added without
breaking callers. lykn's `obj` with `:keyword value` pairs makes this
natural.

**See also**: ID-02, `01-core-idioms.md` ID-06

---

## ID-02: Use `??` for Per-Property Defaults

**Strength**: SHOULD

**Summary**: When using an options object, extract properties with `??`
to provide defaults per-property.

```lykn
;; Good — per-property defaults via ??
(func move
  :args (:object opts)
  :returns :array
  :body (array (?? opts:x 0) (?? opts:y 0)))

(move (obj :x 3))   ;; [3, 0]
(move (obj))         ;; [0, 0]
```

Compiles to:

```js
function move(opts) {
  /* type check ... */
  return [opts.x ?? 0, opts.y ?? 0];
}
```

**Rationale**: `??` only triggers on `null`/`undefined`, preserving
`0`, `""`, and `false` as valid values. This matches the per-property
default pattern from JS but without the two-layer `= {}` complexity —
lykn's `obj` always produces an object, so the no-argument case is
handled by passing `(obj)`.

---

## ID-03: Positional Args for Required, Options for Optional

**Strength**: SHOULD

**Summary**: Place required parameters as typed positional arguments in
`:args`. Put optional/configuration parameters in an options object.

```lykn
;; Good — required positional + optional options
(func fetch-resource
  :args (:string url :object opts)
  :returns :any
  :body
  (bind method (?? opts:method "GET"))
  (bind timeout (?? opts:timeout 5000))
  (fetch url (obj :method method :signal (AbortSignal:timeout timeout))))

(fetch-resource "/api/users" (obj))
(fetch-resource "/api/users" (obj :method "POST" :timeout 10000))
```

**Rationale**: Required positional args are unambiguous at the call
site. Optional parameters in an options object can be omitted,
reordered, or extended without affecting existing callers.

---

## ID-04: Return Consistent Types — Use `type` for Variants

**Strength**: MUST

**Summary**: Every code path in a function must return the same type.
Use `type` (algebraic data types) to model functions that can return
different kinds of results.

```lykn
;; Good — always returns the same type
(func find-user
  :args (:string id)
  :returns :any
  :body (?? (users:get id) undefined))

;; Good — always returns an array (possibly empty)
(func search
  :args (:string query)
  :returns :array
  :body (if (not query) #a() (db:query query)))

;; Better — use type for explicit variants
(type SearchResult
  (Found :array items)
  (Empty))

(func search
  :args (:string query)
  :returns :any
  :body (if (not query)
    (Empty)
    (Found (db:query query))))
```

Compiles to:

```js
function findUser(id) {
  /* type check ... */
  return users.get(id) ?? undefined;
}
function search(query) {
  /* type check ... */
  if (!query) return Empty;
  return Found(db.query(query));
}
```

**Rationale**: Mixed return types force callers to check the type
before using the value. `type` makes the variants explicit and
`match` makes consuming them exhaustive.

**See also**: `01-core-idioms.md` ID-30

---

## ID-05: Accept Iterables, Return Arrays

**Strength**: CONSIDER

**Summary**: When a function accepts a collection, accept any iterable
via `for-of`. When it returns a collection, return a concrete array.

```lykn
;; Good — accepts any iterable via for-of
(func sum :args (:any items) :returns :number :body
  (bind total (cell 0))
  (for-of n items
    (swap! total (fn (:number t) (+ t n))))
  (express total))

;; Good — returns a concrete array
(func filter-items :args (:any items :function pred) :returns :array :body
  (bind result (cell #a()))
  (for-of item items
    (if (pred item)
      (swap! result (fn (:array r) (conj r item)))))
  (express result))
```

**Rationale**: Accepting iterables makes APIs composable with arrays,
Sets, Maps, generators, and custom iterables. Returning arrays gives
callers a concrete, indexable, multi-pass collection.

---

## ID-06: One Module, One Responsibility

**Strength**: SHOULD

**Summary**: Each `.lykn` module should do one thing well. Prefer
focused modules over kitchen-sink collections.

```lykn
;; Good — focused module: date-format.lykn
(export (func format-date
  :args (:any d) :returns :string
  :body (d:toISOString)))

(export (func parse-date
  :args (:string s) :returns :any
  :body (new Date s)))

;; Bad — one module doing everything (utils.lykn)
;; format-date, slugify, debounce, deep-clone all in one file
```

**Rationale**: Focused modules compose cleanly, are independently
testable, and enable fine-grained tree-shaking.

---

## ID-07: Export Functions, Not Objects with Methods

**Strength**: SHOULD

**Summary**: Prefer named function exports over a single default-exported
object bundling methods.

```lykn
;; Good — named exports, individually tree-shakeable
(export (func mean :args (:array data) :returns :number :body
  (/ (data:reduce (fn (:number a :number b) (+ a b)) 0) data:length)))

(export (func median :args (:array data) :returns :number :body
  (bind sorted (data:toSorted (fn (:number a :number b) (- a b))))
  (get sorted (Math:floor (/ sorted:length 2)))))
```

**Rationale**: Named function exports are individually removable by
tree-shaking. A default-exported object is a single export unit — the
bundler must include the entire object even if only one function is
used.

**See also**: `01-core-idioms.md` ID-07

---

## ID-08: Re-Export for Public API Surfaces

**Strength**: CONSIDER

**Summary**: Use selective re-exports to define a module's public API.

```lykn
;; Good — selective re-exports (mod.lykn)
(export "./stats/mean.js" (names mean))
(export "./stats/stddev.js" (names stddev))
(export "./stats/median.js" (names median))
```

Compiles to:

```js
export {mean} from "./stats/mean.js";
export {stddev} from "./stats/stddev.js";
export {median} from "./stats/median.js";
```

**Rules**:
- Prefer selective re-exports over wildcards for tree-shaking precision
- Re-exported names are not available in the re-exporting module's own
  scope

**Rationale**: Barrel files provide a stable public API while allowing
internal reorganization.

---

## ID-09: No Module-Level Side Effects

**Strength**: MUST

**Summary**: Module top-level code must not produce side effects. Keep
all side effects inside exported functions.

```lykn
;; Good — no side effects at module level
(bind DEFAULT-TIMEOUT 5000)

(export (func create-client
  :args (:object options)
  :returns :any
  :body (new Client (assoc options :timeout
    (?? options:timeout DEFAULT-TIMEOUT)))))

;; Bad — side effect at import time
(console:log "stats module loaded")
(bind db (await (connect "localhost:5432")))
```

**Rationale**: Module code runs once, on first import. Top-level side
effects make modules unpredictable, defeat tree-shaking, and make
testing difficult.

---

## ID-10: Export at Declaration

**Strength**: SHOULD

**Summary**: Use `export` wrapping the declaration site rather than a
separate export statement.

```lykn
;; Good — inline export, intent is visible at definition
(export (func format-date
  :args (:any d) :returns :string
  :body (d:toISOString)))

(export (bind DATE-FORMAT "YYYY-MM-DD"))
```

**Rationale**: Inline exports make the file self-documenting — the
public API is visible at each declaration.

---

## ID-11: Use `type` Constructors for Structured Data

**Strength**: SHOULD

**Summary**: For data with known shapes, use `type` constructors
instead of plain `obj` or classes. Type constructors provide tagged
values, field validation, and work with `match`.

```lykn
;; Good — type constructor for structured data
(type Point (Pt :number x :number y))

(bind origin (Pt 0 0))
(bind p (Pt 3 4))

;; Good — type with variants (replaces factory + class hierarchy)
(type Shape
  (Circle :number radius)
  (Rect :number width :number height))

(func area :args (:any shape) :returns :number :body
  (match shape
    ((Circle r) (* Math:PI (* r r)))
    ((Rect w h) (* w h))))
```

Compiles to:

```js
function Pt(x, y) {
  if (typeof x !== "number" || Number.isNaN(x))
    throw new TypeError("Pt: field 'x' expected number, got " + typeof x);
  if (typeof y !== "number" || Number.isNaN(y))
    throw new TypeError("Pt: field 'y' expected number, got " + typeof y);
  return {tag: "Pt", x, y};
}
const origin = Pt(0, 0);
const p = Pt(3, 4);
```

**When to use `class` instead**: When you need `instanceof` checks,
shared prototype methods across many instances, `Symbol.iterator`,
or JS interop with APIs that expect class instances.

**Rationale**: `type` constructors validate fields at construction
time (ID-15 for free), produce plain objects that are easy to
serialize and spread, and enable exhaustive `match`. Classes add
prototype machinery that is unnecessary for data shapes.

---

## ID-12: Use `-` Prefix for Private Fields in Classes

**Strength**: MUST

**Summary**: In lykn class forms, use the `-` prefix for private
fields. This compiles to JS `#_` private fields.

```lykn
;; Good — language-enforced privacy via - prefix
(class Buffer ()
  (field -data #a())
  (field -size 0)

  (push ((item))
    (this:-data:push item)
    (++ this:-size))

  (get size () (return this:-size)))
```

Compiles to:

```js
class Buffer {
  #_data = [];
  #_size = 0;
  push(item) {
    this.#_data.push(item);
    ++this.#_size;
  }
  get size() {
    return this.#_size;
  }
}
```

**Rationale**: The `-` prefix compiles to true `#_` private fields —
invisible to `Reflect.ownKeys()`, inaccessible outside the class.
This is real encapsulation, not a naming convention.

**See also**: `00-lykn-surface-forms.md` Classes

---

## ID-13: Static Factory Methods for Alternative Construction

**Strength**: SHOULD

**Summary**: Use static methods for construction paths beyond the
primary constructor.

```lykn
;; Good — named factory methods
(class Point ()
  (constructor ((x) (y))
    (= this:x (?? x 0))
    (= this:y (?? y 0)))

  (static (from-polar ((radius) (angle))
    (return (new Point
      (* radius (Math:cos angle))
      (* radius (Math:sin angle)))))))

(bind p1 (new Point 3 4))
(bind p2 (Point:from-polar 5 (/ Math:PI 4)))
```

**Naming conventions**:
- `:create` — from scratch
- `:from` — copy/convert from another object
- `:of` — assemble from values

**Rationale**: Static factory methods have descriptive names, can
return cached instances, and avoid overloaded constructors with
runtime type checking.

---

## ID-14: Async Initialization — Factory Function, Not Async Constructor

**Strength**: MUST

**Summary**: Constructors cannot be `async`. Use a static async factory
method for objects that require asynchronous setup.

```lykn
;; Good — static async factory
(class DataStore ()
  (field -connection null)

  (static (async (create ((url))
    (bind conn (await (connect url)))
    (return (new DataStore conn)))))

  (constructor ((connection))
    (= this:-connection connection))

  (async (query ((sql))
    (return (this:-connection:execute sql)))))

(bind store (await (DataStore:create "postgres://localhost/mydb")))
```

**Rationale**: The factory keeps the constructor synchronous and
guarantees callers always receive a fully initialized instance.

---

## ID-15: `type` Fields Validate Automatically — No Manual Checks Needed

**Strength**: MUST (compiler-enforced)

**Summary**: `type` constructors with typed fields validate arguments
at construction time automatically. For classes, use `func` contracts
or manual checks in the constructor.

```lykn
;; Good — type constructor validates automatically
(type Range (Rng :number start :number end))

(Rng 0 10)        ;; ok
(Rng "a" 10)      ;; TypeError: Rng: field 'start' expected number
```

Compiles to:

```js
function Rng(start, end) {
  if (typeof start !== "number" || Number.isNaN(start))
    throw new TypeError("Rng: field 'start' expected number, got " + typeof start);
  if (typeof end !== "number" || Number.isNaN(end))
    throw new TypeError("Rng: field 'end' expected number, got " + typeof end);
  return {tag: "Rng", start, end};
}
```

For additional constraints beyond type checking, use `func` with
`:pre` contracts:

```lykn
;; Good — func with pre-condition for domain constraints
(func make-range
  :args (:number start :number end)
  :returns :any
  :pre (<= start end)
  :body (Rng start end))
```

**Rationale**: `type` constructors give you ID-15 from the JS guide
for free — every typed field is validated, and invalid construction
throws immediately. No half-initialized objects can exist. For domain
constraints (start <= end), wrap the constructor in a `func` with
`:pre`.

**See also**: `05-type-discipline.md`

---

## ID-16: Method Names Are Verbs, Property Names Are Nouns

**Strength**: SHOULD

**Summary**: Methods do things (verbs). Properties describe state
(nouns/adjectives). In lykn, use lisp-case for both.

```lykn
;; Good — verbs for actions, nouns for state
(class Collection ()
  (field -items #a())

  (get size () (return this:-items:length))
  (get empty? () (return (= this:-items:length 0)))

  (add ((item)) (this:-items:push item))
  (remove ((item)) (this:-items:splice
    (this:-items:indexOf item) 1))
  (contains? ((item)) (return (this:-items:includes item)))
  (serialize () (return (JSON:stringify this:-items))))
```

**Rationale**: The verb/noun distinction signals to callers whether
something is computed on access (property) or triggers work (method).
This matches standard library patterns: `array:length` (noun),
`array:push` (verb).

---

## ID-17: Predicates Use `?` Suffix

**Strength**: SHOULD

**Summary**: Boolean-returning functions and methods use the `?` suffix.
This is the lykn convention replacing JS's `is`/`has`/`can`/`should`
prefixes.

```lykn
;; Good — ? suffix reads naturally in conditionals
(if (active? user) (show-dashboard user))
(if (empty? collection) (show-placeholder))
(if (can-undo? editor) (enable-undo-button))

;; Function definitions
(func active? :args (:any user) :returns :boolean
  :body user:active)

(func valid-email? :args (:string input) :returns :boolean
  :body (and (input:includes "@") (input:includes ".")))
```

Compiles to:

```js
if (active?(user)) showDashboard(user);
if (empty?(collection)) showPlaceholder();
if (canUndo?(editor)) enableUndoButton();
```

**Convention**:
- `active?` — state predicate (replaces JS `isActive`)
- `has-items?` — possession predicate (replaces JS `hasItems`)
- `can-edit?` — capability predicate (replaces JS `canEdit`)
- `valid?` — validity predicate (replaces JS `isValid`)

**Rationale**: The `?` suffix is the universal Lisp convention for
predicates. It is more concise than the `is`/`has` prefix convention
and reads naturally: `(if (valid? x) ...)` reads as "if valid? x".

---

## ID-18: Conversion Methods — `to-x` Creates New, `from-x` Constructs

**Strength**: SHOULD

**Summary**: Use `to-x` for methods that convert to another type. Use
`ClassName:from-x` for static construction from another type.

```lykn
;; Good — to-x for conversion, from-x for construction
(class Color ()
  (constructor ((r) (g) (b))
    (= this:r r)
    (= this:g g)
    (= this:b b))

  (to-string () (return (template "rgb(" this:r ", " this:g ", " this:b ")")))
  (to-json () (return (obj :r this:r :g this:g :b this:b)))

  (static (from-hex ((hex))
    (bind m (hex:match (regex "^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$" "i")))
    (if (not m) (throw (new Error (template "Invalid hex color: " hex))))
    (return (new Color
      (parseInt (get m 1) 16)
      (parseInt (get m 2) 16)
      (parseInt (get m 3) 16))))))
```

**Standard library precedents**: `to-string`, `to-json`, `Array:from`,
`Object:from-entries`.

**Rationale**: `to-x` on the source signals "convert this instance."
`ClassName:from-x` on the target signals "construct from external data."

---

## ID-19: Use `-` Prefix for All Private Members

**Strength**: MUST

**Summary**: Use `-` prefix for all internal methods and fields in
classes. Do not expose implementation details.

```lykn
;; Good — - prefix for private methods and fields
(class Parser ()
  (field -input "")
  (field -pos 0)

  (constructor ((input))
    (= this:-input input))

  (parse ()
    (bind tokens (this:-tokenize))
    (return (this:-build-ast tokens)))

  (-tokenize () (return #a()))
  (-build-ast ((tokens)) (return tokens)))
```

**Rationale**: `-` prefix methods compile to `#_` private methods —
they cannot be called from outside the class. This makes refactoring
safe: internal methods can be renamed or removed without breaking
external code.

**See also**: ID-12

---

## ID-20: Implement `Symbol:iterator` for Custom Collections

**Strength**: SHOULD

**Summary**: Any object that represents a sequence should implement
`Symbol:iterator` to work with `for-of`, spread, and destructuring.

```lykn
;; Good — class with Symbol.iterator via generator
(class NumberRange ()
  (constructor ((from) (to))
    (= this:from from)
    (= this:to to))

  ;; Generator method for iteration
  (* (Symbol:iterator) ()
    (for (let i (Math:ceil this:from)) (<= i this:to) (++ i)
      (yield i))))

;; Works with all iteration consumers
(for-of n (new NumberRange 1 5) (console:log n))
(bind arr (array (spread (new NumberRange 1 5))))
```

**Rationale**: `Symbol:iterator` is the bridge between data sources
and all language constructs that consume iteration. Implementing it
makes your collection a first-class citizen.

---

## ID-21: Use Generators to Simplify Iterator Implementation

**Strength**: SHOULD

**Summary**: Use generator functions to implement iterators. Generators
eliminate manual state management.

```lykn
;; Good — standalone generator for lazy transformation
(function* lazy-map (iterable fn)
  (for-of x iterable (yield (fn x))))

;; Good — compose generators
(function* lazy-filter (iterable pred)
  (for-of x iterable
    (if (pred x) (yield x))))
```

**Rationale**: Generator functions pause at each `yield` and resume on
`.next()`, eliminating the need for explicit `{ value, done }` objects
and state tracking. `yield*` enables recursive traversal with zero
boilerplate.

---

## ID-22: Prefer Many-Times Iterables over One-Time

**Strength**: SHOULD

**Summary**: Design iterable classes so that each call to
`Symbol:iterator` returns a fresh, independent iterator.

```lykn
;; Good — many-times iterable (generator method on class)
(class Evens ()
  (constructor ((limit))
    (= this:limit limit))
  (* (Symbol:iterator) ()
    (for (let i 0) (< i this:limit) (+= i 2)
      (yield i))))

(bind evens (new Evens 10))
(console:log (array (spread evens)))  ;; [0, 2, 4, 6, 8]
(console:log (array (spread evens)))  ;; [0, 2, 4, 6, 8] — still works
```

**Rationale**: One-time iterables silently produce incomplete results
when iterated twice. Many-times iterables (like Array, Set, Map) are
safe to pass to multiple consumers.

---

## ID-23: Return `undefined` for "No Meaningful Value"

**Strength**: SHOULD

**Summary**: Use `undefined` when a function has no meaningful return
value or when a lookup finds nothing.

```lykn
;; Good — void functions return nothing (implicit undefined)
(func log-message
  :args (:string msg)
  :returns :void
  :body (console:log msg))

;; Good — undefined for "not found" (matches Map:get)
(func find-user :args (:string id) :returns :any
  :body (users:get id))
```

**Rationale**: `undefined` is JavaScript's own default non-value.
Using it for "no result" is consistent with language semantics and
built-in methods like `Array:find` and `Map:get`.

**See also**: ID-24

---

## ID-24: Return `null` Only When the API Explicitly Models Absence

**Strength**: CONSIDER

**Summary**: Use `null` as a deliberate signal meaning "intentionally
empty," distinct from `undefined`'s "nothing here." Or better yet, use
`type` to model presence/absence explicitly.

```lykn
;; Good — type models presence explicitly
(type Option (Some :any value) None)

(func find-override :args (:string key) :returns :any :body
  (if (not (in key overrides))
    (None)
    (Some (get overrides key))))

;; Caller uses match — can't forget to handle None
(match (find-override "theme")
  ((Some v) (apply-theme v))
  (None (apply-default-theme)))
```

**Rationale**: `type` with `Some`/`None` makes absence explicit and
forces callers to handle both cases via `match`. This is safer than
returning `null`/`undefined` where callers might forget to check.
For JSON-serializable data where `null` is required, use it directly.

---

## ID-25: Async Functions Always Return Promises

**Strength**: MUST

**Summary**: If a function is async, it returns a Promise. Never
provide a callback-based alternative.

```lykn
;; Good — async function, callers use await
(export (async (func fetch-user
  :args (:string id)
  :returns :any
  :body
  (bind res (await (fetch (template "/api/users/" id))))
  (if (not res:ok)
    (throw (new Error (template "User " id " not found"))))
  (await (res:json)))))
```

**Rationale**: Every `async` function wraps its return value in a
Promise automatically. Let callers choose their consumption style
(`await`, `:then`, `Promise:all`) without the API dictating it.

---

## ID-26: Use Symbols for Non-Enumerable Metadata Properties

**Strength**: CONSIDER

**Summary**: Use Symbol-keyed properties for internal metadata that
should not appear in `Object:keys`, `for-in`, or `JSON:stringify`.

```lykn
;; Good — Symbol key for internal metadata
(bind META (Symbol "meta"))

(class Collection ()
  (constructor ((items))
    (= this:items items)
    (= (get this META) (obj :version 1 :created (Date:now)))))
```

**Rationale**: Symbol-keyed properties are non-enumerable by default,
cannot collide with string keys, and operate at a separate meta level.

---

## ID-27: Use `func` Contracts for API Boundary Validation

**Strength**: SHOULD

**Summary**: Use `:pre` and `:post` contracts on `func` to validate
inputs and outputs at API boundaries. This replaces manual validation
code.

```lykn
;; Good — contracts replace manual validation
(func create-user
  :args (:string name :string email)
  :returns :object
  :pre (and (> name:length 0) (email:includes "@"))
  :post (not (= ~ null))
  :body (obj :name name :email email :id (crypto:randomUUID)))
```

Compiles to:

```js
function createUser(name, email) {
  if (typeof name !== "string") throw new TypeError(/* ... */);
  if (typeof email !== "string") throw new TypeError(/* ... */);
  if (!(name.length > 0 && email.includes("@")))
    throw new Error("create-user: pre-condition failed: (and (> name:length 0) (email:includes \"@\")) — caller blame");
  const result__gensym0 = {name, email, id: crypto.randomUUID()};
  if (!(result__gensym0 !== null))
    throw new Error("create-user: post-condition failed: (not (= ~ null)) — callee blame");
  return result__gensym0;
}
```

**Contract types**:
- `:pre` — **caller blame**: validates inputs. The caller passed
  invalid data.
- `:post` — **callee blame**: validates output. The function itself
  has a bug. Use `~` to reference the return value.

**Rationale**: Contracts are self-documenting validation that lives in
the function signature, not buried in the body. They throw with blame
attribution (caller vs callee), making debugging faster. Use
`--strip-assertions` in production to remove all checks.

**See also**: `05-type-discipline.md`, `00-lykn-surface-forms.md`

---

## ID-28: Prefer `type` + `func` over Class Hierarchies

**Strength**: SHOULD

**Summary**: Use `type` for data variants and `func` for operations on
them, instead of class inheritance hierarchies.

```lykn
;; Good — type + func: data and operations are separate
(type Shape
  (Circle :number radius)
  (Rect :number width :number height))

(func area :args (:any shape) :returns :number :body
  (match shape
    ((Circle r) (* Math:PI (* r r)))
    ((Rect w h) (* w h))))

(func perimeter :args (:any shape) :returns :number :body
  (match shape
    ((Circle r) (* 2 Math:PI r))
    ((Rect w h) (* 2 (+ w h)))))

;; Adding a new operation doesn't touch the type definition
;; Adding a new variant forces updating all match expressions (exhaustiveness)
```

```lykn
;; Avoid — class hierarchy couples data and behavior
(class Shape () (area () (throw (new Error "abstract"))))
(class Circle (Shape)
  (constructor ((radius)) (= this:radius radius))
  (area () (return (* Math:PI (* this:radius this:radius)))))
```

**Rationale**: `type` + `func` separates data from operations. Adding
a new operation (like `perimeter`) requires no changes to existing
code. Adding a new variant forces all `match` expressions to be
updated — the compiler flags missing cases. Class hierarchies couple
data and behavior, making extension in either direction harder.

**See also**: `01-core-idioms.md` ID-30

---

---

## Best Practices Summary

### Quick Reference Table

| ID | Pattern | Strength | Key Insight |
|----|---------|----------|-------------|
| 01 | Keyword args via `obj` for 3+ params | SHOULD | Named params, order-independent |
| 02 | `??` for per-property defaults | SHOULD | Preserves `0`, `""`, `false` |
| 03 | Positional required, options optional | SHOULD | Never place optional before required |
| 04 | Consistent return types — use `type` | MUST | `type` + `match` for explicit variants |
| 05 | Accept iterables, return arrays | CONSIDER | Composable input, concrete output |
| 06 | One module, one responsibility | SHOULD | Focused modules compose and tree-shake |
| 07 | Export functions, not method objects | SHOULD | Named exports are tree-shakeable |
| 08 | Re-export for public API surfaces | CONSIDER | Selective re-exports preserve tree-shaking |
| 09 | No module-level side effects | MUST | Side effects defeat tree-shaking and testing |
| 10 | Export at declaration | SHOULD | Inline export makes API visible at definition |
| 11 | `type` constructors for structured data | SHOULD | Tagged values, field validation, `match`-able |
| 12 | `-` prefix for private fields | MUST | Compiles to `#_` — true encapsulation |
| 13 | Static factory methods | SHOULD | Named construction, no overloading |
| 14 | Async factory, not async constructor | MUST | Constructors are synchronous |
| 15 | `type` validates fields automatically | MUST | Construction-time type checks for free |
| 16 | Methods = verbs, properties = nouns | SHOULD | Signals action vs state |
| 17 | `?` suffix for predicates | SHOULD | `active?`, `valid?`, `has-items?` |
| 18 | `to-x` converts, `from-x` constructs | SHOULD | Matches built-in conventions |
| 19 | `-` prefix for all private members | MUST | Methods and fields both private |
| 20 | `Symbol:iterator` for collections | SHOULD | Integrates with `for-of`, spread |
| 21 | Generators simplify iterators | SHOULD | Eliminates manual state tracking |
| 22 | Many-times iterables over one-time | SHOULD | Fresh iterator per call |
| 23 | `undefined` for "no meaningful value" | SHOULD | Matches language default |
| 24 | `type` for modeled absence | CONSIDER | `Some`/`None` safer than null |
| 25 | Async = Promise, no callbacks | MUST | Single interface |
| 26 | Symbols for metadata properties | CONSIDER | Non-enumerable, clash-free |
| 27 | `func` contracts for API validation | SHOULD | `:pre`/`:post` replace manual checks |
| 28 | `type` + `func` over class hierarchies | SHOULD | Separate data from operations |

---

## Related Guidelines

- **Core Idioms**: See `01-core-idioms.md` for `bind`/`cell` (ID-01),
  equality (ID-02), destructuring (ID-06), exports (ID-07), `type`+`match`
  (ID-30)
- **Error Handling**: See `03-error-handling.md` for throwing in
  constructors, async error patterns
- **Values & References**: See `04-values-references.md` for mutation
  discipline, `assoc`/`dissoc`/`conj`, immutability
- **Type Discipline**: See `05-type-discipline.md` for type annotations,
  contracts, and constructor validation
- **Functions & Closures**: See `06-functions-closures.md` for `func`
  contracts, `fn`/`lambda`, and multi-clause dispatch
- **Async & Concurrency**: See `07-async-concurrency.md` for async
  return conventions
- **Anti-Patterns**: See `09-anti-patterns.md` for API design
  anti-patterns
- **Surface Forms Reference**: See `00-lykn-surface-forms.md` for the
  complete surface form catalog
