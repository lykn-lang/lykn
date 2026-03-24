# DD-06: Destructuring Patterns

## Your role

You are helping design lykn, an s-expression syntax for JavaScript.
Read the session bootstrap doc in this project for full context. This
conversation focuses on one topic: how destructuring patterns should
work in lykn.

**Important**: Read DD-02 (function forms) first if available —
destructuring interacts heavily with function parameters.

## What ECMAScript defines

Destructuring is used in variable declarations, function parameters,
assignment, and for-of loops:

```javascript
// Object destructuring
const { a, b } = obj;
const { name: n, age: a } = person;       // rename
const { x = 0, y = 0 } = point;           // defaults
const { data: { nested } } = response;    // nested

// Array destructuring
const [first, second] = arr;
const [head, ...tail] = arr;               // rest
const [, second] = arr;                    // skip elements
const [a = 1, b = 2] = arr;               // defaults

// In function params
function f({ name, age }) { ... }
function g([first, ...rest]) { ... }
const h = ({ x = 0 }) => x;

// In for-of
for (const [key, value] of map.entries()) { ... }

// In assignment (no const/let)
({ a, b } = obj);
[x, y] = arr;
```

ESTree representation:
- `ObjectPattern` — `{ properties: [AssignmentProperty | RestElement] }`
- `ArrayPattern` — `{ elements: [Pattern | null] }` (null = skipped)
- `AssignmentPattern` — `{ left: Pattern, right: Expression }` (defaults)
- `RestElement` — `{ argument: Pattern }` (rest/spread in pattern)
- `AssignmentProperty` — like `Property` but value is a `Pattern`

## The gap analysis proposal

```lisp
;; Object destructuring
(const (obj-pat a b) obj)
(const (obj-pat (name n) (age a)) person)    ;; rename
(const (obj-pat (x 0) (y 0)) point)          ;; defaults

;; Array destructuring
(const (array-pat first second) arr)
(const (array-pat head (rest tail)) arr)

;; Nested
(const (obj-pat (data (array-pat first))) response)

;; In function params
(=> ((obj-pat name age)) (console:log name age))

;; In for-of
(for-of (array-pat key value) entries
  (console:log key value))
```

## Questions to discuss

1. **`obj-pat` / `array-pat` verbosity**: These explicit markers are
   unambiguous but heavy. Consider:

   ```lisp
   ;; Current proposal
   (const (obj-pat a b) obj)

   ;; Alternatives:
   (const {a b} obj)         ;; reader-level syntax for patterns
   (const (: a b) obj)       ;; shorter marker
   (const (destructure a b) obj)  ;; too long
   ```

   Using `{a b}` would require reader changes (recognizing `{}`).
   Is that worth it for ergonomics? Or is `obj-pat`/`array-pat`
   fine because destructuring is a pattern position and readers
   will get used to it?

2. **Rename vs default ambiguity**: In the proposal, a pair inside
   `obj-pat` means rename: `(name n)` = `name: n`. But a pair
   also means default: `(x 0)` = `x = 0`. How does the compiler
   tell these apart? The second element being a literal vs identifier?
   That's fragile — what about `(x default-value)` where the default
   is a variable reference?

   Possible solutions:
   - **Explicit markers**: `(rename name n)` vs `(default x 0)`
   - **Different syntax**: `(name -> n)` for rename, `(x = 0)` for
     default
   - **Three-element for rename**: `(name as n)` like imports
   - **Context-based**: pairs where second is a literal → default;
     second is identifier → rename. FRAGILE, don't recommend.

3. **Rename with default**: JS allows both:
   `const { name: n = "anon" } = obj` — rename AND default. The
   proposal doesn't cover this. How would you express it?

   ```lisp
   ;; Possible: three elements = rename + default
   (const (obj-pat (name n "anon")) obj)
   ```

4. **Skipping elements in array destructuring**: `const [, second] = arr`
   skips the first element. The ESTree `ArrayPattern` uses `null` in
   the elements array. How to express this in lykn?

   ```lisp
   ;; Possible: explicit skip marker
   (const (array-pat _ second) arr)  ;; _ means skip
   ```

5. **Rest in object destructuring**: JS allows `const { a, ...rest } = obj`.
   Does `(const (obj-pat a (rest others)) obj)` work here too?

6. **Nested destructuring**: `(const (obj-pat (data (array-pat first))) response)`
   — this works syntactically but is getting deep. Is the nesting
   acceptable, or should there be some shorthand?

7. **Destructuring in assignment** (without const/let):
   ```javascript
   ({ a, b } = obj);  // note the parens in JS — needed for parsing
   [x, y] = [1, 2];
   ```
   How does this work in lykn? `(= (obj-pat a b) obj)`?

8. **Interaction with function params**: In parameter lists, a
   destructured param is `((obj-pat name age))`. The extra parens
   come from the param list being a list, and the pattern being a
   list. `(=> ((obj-pat name age)) body)` — that's three levels of
   nesting. Livable?

9. **Default parameters vs destructuring defaults**: `(x 0)` inside
   `obj-pat` means destructuring default. But in function params,
   `(x 0)` means default parameter value (DD-02 territory). These
   use the same ESTree node (`AssignmentPattern`) but appear in
   different contexts. Is the syntax consistent?

## ESTree nodes involved

- `ObjectPattern` — `{ type: "ObjectPattern", properties: [AssignmentProperty | RestElement] }`
- `ArrayPattern` — `{ type: "ArrayPattern", elements: [Pattern | null] }`
- `AssignmentPattern` — `{ type: "AssignmentPattern", left: Pattern, right: Expression }`
- `RestElement` — `{ type: "RestElement", argument: Pattern }`
- `Property` / `AssignmentProperty` — key/value pair in object pattern

## Goal

By the end of this discussion, decide:
- The pattern marker forms (keep `obj-pat`/`array-pat` or change)
- How to distinguish rename from default
- How to handle rename-with-default
- How to skip elements in array patterns
- How nested destructuring works
- How destructuring assignment (without declaration) works
- How patterns interact with function parameters

When we're done, I'll ask you to write a decision doc using the
template in this project.
