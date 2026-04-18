# Documentation

The writing discipline of documentation in lykn: when and what to
comment, type annotations as documentation, module-level documentation,
self-documenting code, tests as documentation, and what NOT to document.
lykn's built-in type annotations (`:number`, `:string`, `:pre`/`:post`)
serve as machine-readable documentation that the compiler enforces —
reducing the need for separate annotation layers like JSDoc.

Target environment: **Deno**, **ESM-only**, **Biome** on compiled
output, lykn/surface syntax throughout.

---

## ID-01: Comments Explain *Why*, Not *What*

**Strength**: MUST

**Summary**: If the code needs a comment to explain what it does,
refactor the code. Comments exist for intent, context, and non-obvious
decisions.

```lykn
;; Bad — restates the code
(bind arr #a())           ; Create a new array
(++ count)                ; Increment count

;; Good — explains WHY
;; Retry with exponential backoff because the upstream API rate-limits
;; at 100 req/min and returns 429 without a Retry-After header.
(await (retry fetch-data (obj :max-attempts 5 :backoff "exponential")))

;; Good — explains a non-obvious decision
;; Using Set here instead of :includes because the banned list
;; is checked once per request and has ~10,000 entries.
(bind banned-set (new Set banned-list))
```

**Comment style convention**: Use `;;` for top-level comments and `;`
for inline end-of-line comments. Comments in lykn are `;` (semicolon)
to end of line.

---

## ID-02: Don't Comment Obvious Code — The AI Anti-Pattern

**Strength**: MUST

**Summary**: Line-by-line comments that restate visible code add noise.
This is the most common documentation anti-pattern in AI-generated code.

```lykn
;; Bad — AI-generated comment pattern
;; Import the path module
(import "@std/path" (join))

;; Define the maximum number of retries
(bind MAX-RETRIES 3)

;; Create an async function to fetch user data
(async (func fetch-user :args (:string id) :returns :any :body
  ;; Make a fetch request to the API
  (bind response (await (fetch (template "/api/users/" id))))
  ;; Return the JSON
  (await (response:json))))

;; Good — same code, no comments needed
(import "@std/path" (join))

(bind MAX-RETRIES 3)

(async (func fetch-user :args (:string id) :returns :any :body
  (bind response (await (fetch (template "/api/users/" id))))
  (await (response:json))))
```

**The test**: For each comment, ask "does this tell me something the
code doesn't?" If no, delete it.

---

## ID-03: Comment Non-Obvious Intent

**Strength**: SHOULD

**Summary**: Comment when the code does something surprising, works
around a bug, or implements a business rule that isn't self-evident.

```lykn
;; Good — workaround with context
;; AbortController:abort doesn't accept a reason in Safari < 16.4.
;; Pass the reason via a custom property until we drop Safari 16.3.
(= controller:signal:reason (new Error "User cancelled"))
(controller:abort)

;; Good — business rule
;; Users created before 2020-01-01 are on the legacy pricing tier
;; regardless of their current plan. Legal requirement per §4.2.
(bind legacy? (< user:created-at LEGACY-CUTOFF))

;; Good — "why not the obvious approach"
;; Using for-of instead of :map here because we need to break
;; on the first validation failure and report which field failed.
(for-of field fields
  (bind error (validate field))
  (if error (return (obj :field field:name :error error))))
```

---

## ID-04: TODO/FIXME/HACK Comments — Include Context

**Strength**: SHOULD

**Summary**: Use standardized markers for incomplete work. Include who,
why, and a ticket reference.

```lykn
;; Good — actionable, traceable
;; TODO(alice, #347): Replace with AbortSignal:any when Deno 2.1 ships
(bind signal (manual-combine-signals controller:signal timeout-signal))

;; FIXME(bob, #512): This breaks for BigInt IDs > 2^53.
(bind user-id (Number raw-id))

;; Bad — no context
;; TODO: fix this later
```

---

## ID-05: Type Annotations Are Self-Documenting — Leverage Them

**Strength**: SHOULD

**Summary**: lykn's `func` type annotations and contracts serve as
machine-readable documentation. They replace JSDoc `@param`/`@returns`.

```lykn
;; Good — types + contracts document the function's contract
(func fetch-user
  :args (:string id)
  :returns :any
  :pre (> id:length 0)
  :body
  (bind response (await (fetch (template "/api/users/" id))))
  (if (not response:ok)
    (throw (new HttpError response:status response:status-text response:url)))
  (await (response:json)))

;; The type annotations tell us:
;; - id must be a string (compiler-enforced)
;; - id must be non-empty (pre-condition, compiler-enforced)
;; - return type is :any (flexible)
;; No JSDoc needed for these facts.
```

**What still needs prose comments**:
- What `null`/`undefined` means as a return value
- Side effects (network calls, file writes)
- Error conditions and which errors are thrown
- Business rules encoded in `:pre`/`:post`

**Rationale**: In JS, JSDoc `@param {string} id` is a documentation
annotation. In lykn, `:args (:string id)` is both documentation AND
runtime enforcement. The compiler verifies it — it cannot become stale.

---

## ID-06: First Comment Is the Summary — Keep It Short

**Strength**: SHOULD

**Summary**: The first comment above a function or module should be a
concise summary.

```lykn
;; Hash a password using bcrypt with a random salt.
(func hash-password
  :args (:string password)
  :returns :string
  :body (bcrypt:hash password))
```

---

## ID-07: Document Parameters When Types Aren't Enough

**Strength**: SHOULD

**Summary**: Type annotations say *what type*. Comments explain valid
values, constraints, and edge cases that types cannot express.

```lykn
;; Create a paginated query.
;; query: SQL string, must not contain LIMIT/OFFSET (added automatically)
;; page-size: items per page, clamped to [1, 100]
;; page: 1-indexed, values < 1 treated as 1
(func paginate
  :args (:string query :number page-size :number page)
  :returns :any
  :pre (and (> page-size 0) (<= page-size 100))
  :body (execute-query query page-size (Math:max 1 page)))
```

**Note**: The `:pre` contract enforces page-size bounds at runtime.
The comment explains why and what the valid range is.

---

## ID-08: Document Thrown Errors

**Strength**: SHOULD

**Summary**: If a function throws, document which error types and under
what conditions with comments.

```lykn
;; Parse a configuration file.
;; Throws TypeError if path is not a string.
;; Throws Deno.errors.NotFound if file does not exist.
;; Throws SyntaxError if file contains invalid JSON.
(func parse-config
  :args (:string path)
  :returns :object
  :body
  (bind raw (Deno:readTextFileSync path))
  (JSON:parse raw))
```

---

## ID-09: Document Return Value Semantics

**Strength**: SHOULD

**Summary**: Document what the return value *means*, especially when
`null`/`undefined` or `None` have specific semantics.

```lykn
;; Look up a user by email.
;; Returns Some(user) if found, None if no user has this email.
(type Option (Some :any value) None)

(func find-user-by-email
  :args (:string email)
  :returns :any
  :body
  (bind user (db:find-by-email email))
  (if (js:eq user null) (None) (Some user)))
```

---

## ID-10: Include Examples for Non-Obvious APIs

**Strength**: CONSIDER

**Summary**: A code example is worth a paragraph. Include examples in
comments for complex APIs.

```lykn
;; Create a debounced version of a function.
;; Example:
;;   (bind search (debounce handle-search 300))
;;   (search "hello")  ;; fires 300ms after last call
(func debounce
  :args (:function f :number wait)
  :returns :function
  :body
  (bind timer (cell null))
  (fn (:any args)
    (clearTimeout (express timer))
    (reset! timer (setTimeout (fn () (f args)) wait))))
```

---

## ID-11: Every Module Gets a Top Comment

**Strength**: SHOULD

**Summary**: One or two lines at the top of each `.lykn` file
explaining what the module does.

```lykn
;; Password hashing and verification using bcrypt.
;; All functions are async because bcrypt is CPU-intensive.

(export (async (func hash-password
  :args (:string password)
  :returns :string
  :body (bcrypt:hash password))))
```

---

## ID-12: Type Annotations Replace JSDoc for Tooling

**Strength**: SHOULD

**Summary**: lykn's type annotations are compiled into the JS output
as runtime checks. For published libraries, the compiled JS carries
the type enforcement. JSDoc on the compiled output can provide
additional IDE support for JS consumers.

---

## ID-13: Document Re-Export Modules (Barrels)

**Strength**: CONSIDER

**Summary**: A barrel file should document the public surface it
exposes.

```lykn
;; Authentication module — login, session management, password hashing.
(export "./login.js" (names login logout))
(export "./session.js" (names create-session destroy-session))
(export "./password.js" (names hash-password verify-password))
```

---

## ID-14: Self-Documenting Code — Descriptive Names First

**Strength**: MUST

**Summary**: The most effective documentation is code that doesn't need
documentation. lykn's lisp-case naming naturally produces descriptive
names.

```lykn
;; Bad — names are vague, comment needed
;; Check if the user can access the resource
(func check :args (:any u :any r) :returns :boolean :body
  (or (= u:role "admin") (= r:owner-id u:id)))

;; Good — names ARE the documentation
(func can-user-access-resource?
  :args (:any user :any resource)
  :returns :boolean
  :body (or (= user:role "admin") (= resource:owner-id user:id)))
```

---

## ID-15: Named Constants over Magic Values

**Strength**: SHOULD

**Summary**: A named `bind` documents its purpose. A magic number
documents nothing.

```lykn
;; Bad — what is 5? what is 1000?
(if (< attempt 5) (await (delay 1000)))

;; Good — names explain everything
(bind MAX-RETRY-ATTEMPTS 5)
(bind RETRY-DELAY-MS 1000)
(if (< attempt MAX-RETRY-ATTEMPTS)
  (await (delay RETRY-DELAY-MS)))
```

**See also**: `01-core-idioms.md` ID-11

---

## ID-16: Extract Complex Conditions into Named Predicates

**Strength**: SHOULD

**Summary**: A complex boolean expression should be extracted into a
named `func` with a `?` suffix.

```lykn
;; Bad — what does this condition mean?
(if (or (= user:role "admin")
        (and (= user:role "editor") (= resource:status "draft")))
  (allow-edit resource))

;; Good — predicate IS the documentation
(func can-edit-resource?
  :args (:any user :any resource)
  :returns :boolean
  :body (or (= user:role "admin")
            (and (= user:role "editor") (= resource:status "draft"))))

(if (can-edit-resource? user resource)
  (allow-edit resource))
```

---

## ID-17: Function Names Describe the Transformation

**Strength**: SHOULD

**Summary**: A function's name should communicate what goes in and what
comes out.

```lykn
;; Good — names describe the transformation
(func parse-config :args (:string raw) :returns :object :body ...)
(func validate-input :args (:object form-data) :returns :boolean :body ...)
(func format-currency :args (:number cents) :returns :string :body ...)

;; Bad — vague names
(func process :args (:any data) :returns :any :body ...)
(func handle :args (:any input) :returns :any :body ...)
```

**See also**: `01-core-idioms.md` ID-13, `02-api-design.md` ID-17

---

## ID-18: Tests as Documentation — Well-Named Tests Describe Behavior

**Strength**: SHOULD

**Summary**: Test names are executable specifications.

```lykn
;; Tests run on compiled JS output
;; Good — names read as a specification
;; Deno.test("parse-config returns default values for missing fields", ...)
;; Deno.test("parse-config throws SyntaxError for invalid JSON", ...)
;; Deno.test("parse-config preserves explicit zero values", ...)
```

**Rationale**: Tests are the only documentation that fails when it
becomes wrong. A failing test cannot be ignored.

---

## ID-19: Don't Document Internal Implementation in Comments

**Strength**: SHOULD

**Summary**: Comments on exported functions describe the *contract*.
Implementation details belong in inline comments inside the body.

```lykn
;; Good — contract only
;; Hash a password using bcrypt with a random salt.
(export (func hash-password
  :args (:string password)
  :returns :string
  :body
  ;; Using 12 rounds as recommended by OWASP.
  (bcrypt:hash password (obj :rounds 12))))
```

---

## ID-20: Don't Write Essay-Length Comments

**Strength**: SHOULD

**Summary**: A sentence or two is sufficient. If a function needs a
paragraph, it needs refactoring.

---

## ID-21: Skip Comments for Obvious Internal Functions

**Strength**: CONSIDER

**Summary**: Private helpers with descriptive names often need no
documentation.

```lykn
;; Internal — name is sufficient
(func clamp-to-range
  :args (:number value :number min :number max)
  :returns :number
  :body (Math:max min (Math:min max value)))
```

---

## ID-22: Update Comments When Code Changes

**Strength**: MUST

**Summary**: A stale comment that describes old behavior is worse than
no comment. Every comment is a maintenance obligation.

---

## ID-23: Delete Commented-Out Code

**Strength**: MUST

**Summary**: Commented-out code is dead weight. Version control
preserves everything.

```lykn
;; Bad — dead code
;; (bind old-config (load-legacy-config path))
;; (if (< old-config:version 2)
;;   (migrate-config old-config))

;; Good — clean
(bind config (load-config path))
```

---

---

## Best Practices Summary

### Quick Reference Table

| ID | Pattern | Strength | Key Insight |
|----|---------|----------|-------------|
| 01 | Comments explain *why* | MUST | Foundation of documentation discipline |
| 02 | Don't comment obvious code | MUST | AI anti-pattern: line-by-line narration |
| 03 | Comment non-obvious intent | SHOULD | Workarounds, edge cases, business rules |
| 04 | TODO/FIXME with context | SHOULD | Owner, ticket, reason |
| 05 | Type annotations are self-documenting | SHOULD | `:args`/`:returns`/`:pre`/`:post` |
| 06 | First comment = summary | SHOULD | Keep it short |
| 07 | Document params beyond types | SHOULD | Valid values, constraints |
| 08 | Document thrown errors | SHOULD | Which errors, what conditions |
| 09 | Document return value semantics | SHOULD | null vs None vs empty |
| 10 | Examples for complex APIs | CONSIDER | Show usage in context |
| 11 | Module-level comment | SHOULD | What the module does |
| 12 | Type annotations replace JSDoc | SHOULD | Compiler-enforced documentation |
| 13 | Document barrel files | CONSIDER | Public surface docs |
| 14 | Self-documenting code | MUST | Descriptive names first |
| 15 | Named constants | SHOULD | Searchable, self-documenting |
| 16 | Named predicates | SHOULD | `can-edit-resource?` reads as intent |
| 17 | Verb-noun function names | SHOULD | `parse-config`, `format-currency` |
| 18 | Tests as documentation | SHOULD | Only docs that fail when wrong |
| 19 | Contract, not implementation | SHOULD | Save internals for inline comments |
| 20 | Don't write essays | SHOULD | Refactor if more is needed |
| 21 | Skip obvious internals | CONSIDER | Save effort for public API |
| 22 | Update comments with code | MUST | Stale comments mislead |
| 23 | Delete commented-out code | MUST | Git preserves everything |

---

## Related Guidelines

- **Core Idioms**: See `01-core-idioms.md` for naming (ID-12, ID-13),
  magic values (ID-11)
- **API Design**: See `02-api-design.md` for method naming (ID-16-18),
  predicates (ID-17)
- **Error Handling**: See `03-error-handling.md` for error messages
  (ID-03), custom errors (ID-05)
- **Type Discipline**: See `05-type-discipline.md` for type annotations
  (ID-01-05)
- **Anti-Patterns**: See `09-anti-patterns.md` for verbose comment
  patterns
- **Surface Forms Reference**: See `00-lykn-surface-forms.md` for
  comment syntax
