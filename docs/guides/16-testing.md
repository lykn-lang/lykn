# Testing in lykn

Writing tests in lykn using the native testing DSL. The testing module
is a macro package (`packages/testing/`) that provides test definition
and assertion forms. Tests compile to `Deno.test()` + `@std/assert`
calls — no custom test runner, no runtime dependency. Deno handles
discovery, execution, parallelism, coverage, and reporting. lykn adds
the authoring surface.

For testing compiled JS output directly (without the lykn DSL), see
`12-deno/12-02-testing.md`.

Target environment: **Deno**, **ESM-only**, lykn/surface syntax.

---

## ID-01: Import the Testing Module

**Strength**: MUST

**Summary**: Import test macros via `import-macros` and helper
functions via `import`. Use the standard two-line header.

### Standard test file header

```lykn
;; ✅ GOOD — Surface tests (testing compiled output of surface syntax):
(import-macros "testing"
  (test test-compiles is-equal is-thrown includes))
(import "testing/helpers.js" (compile))

;; ✅ GOOD — Kernel form tests (testing kernel syntax without surface expansion):
(import-macros "testing"
  (test test-compiles is-equal is-thrown includes))
(import "testing/helpers.js" ((alias compile-kernel compile)))

;; ✅ GOOD — Integration tests (with macro state reset between tests):
(import-macros "testing"
  (test test-compiles is-equal is-thrown includes))
(import "testing/helpers.js" (compile-all))
```

```lykn
;; ❌ BAD — Do not define compile helpers inline in test files:
(import "../../packages/lang/compiler.js" ((alias compile raw-compile)))
(import "../../packages/lang/reader.js" (read))
(func compile :args (:string source) :body ...)

;; ❌ BAD — Do not use relative paths to lang packages:
(import "../../packages/lang/mod.js" ((alias lykn compile)))

;; ❌ BAD — Do not define compile-all inline:
(func compile-all :args (:string source) :body
  (reset-macros) (reset-gensym) (reset-module-cache) ...)
```

Use `"testing/helpers.js"` — it provides `compile`, `compile-kernel`,
and `compile-all` so test files stay short and consistent.

### Available macros

```lykn
;; Full macro import — everything available
(import-macros "testing"
  (test test-async suite step
   is is-equal is-not-equal is-strict-equal
   ok is-thrown is-thrown-async
   matches includes has obj-matches
   test-compiles))

;; Typical import — most tests need just these
(import-macros "testing" (test is-equal ok))
```

### Available helper functions

Import from `"testing/helpers.js"`:

| Function | What it does |
|----------|-------------|
| `compile` | Full surface pipeline: `lykn(source).trim()` |
| `compile-kernel` | Kernel-only: `rawCompile(read(source)).trim()` |
| `compile-all` | Surface + state reset: resets macros/gensym/cache first |
| `read` | Re-export of `lang/reader.js` `read` |
| `expand` | Re-export of `lang/expander.js` `expand` |
| `reset-gensym` | Re-export of `lang/expander.js` `resetGensym` |
| `reset-macros` | Re-export of `lang/expander.js` `resetMacros` |
| `reset-module-cache` | Re-export of `lang/expander.js` `resetModuleCache` |

The macros expand at compile time and emit standard `@std/assert`
imports in the compiled output. No runtime dependency ships.

---

## ID-02: `test` — Basic Test Form

**Strength**: MUST

**Summary**: `test` takes a string name and body expressions. This
is the primary test definition form.

```lykn
(import-macros "testing" (test is-equal))

(test "addition works"
  (is-equal (+ 1 2) 3)
  (is-equal (* 3 4) 12))
```

Compiles to:

```js
import { assertEquals } from "jsr:@std/assert";

Deno.test("addition works", () => {
  assertEquals(1 + 2, 3);
  assertEquals(3 * 4, 12);
});
```

Multiple assertions per test are fine. The test passes when all pass.

**Rationale**: `test` is named to match lykn's convention of short
English words (`bind`, `func`, `type`). Not `deftest` — lykn doesn't
use `def*` anywhere.

---

## ID-03: `test` with `:setup` / `:teardown`

**Strength**: SHOULD

**Summary**: Use keyword clauses for tests that need initialisation
or cleanup. Same pattern as `func`'s `:pre`/`:post`/`:body` (DD-16).

```lykn
(test "database query"
  :setup    (bind db (create-temp-db))
  :teardown (close db)
  :body
    (bind result (query db "SELECT 1"))
    (is-equal result 1))
```

Compiles to:

```js
Deno.test("database query", () => {
  const db = createTempDb();
  try {
    const result = query(db, "SELECT 1");
    assertEquals(result, 1);
  } finally {
    close(db);
  }
});
```

When `:teardown` is present, the body is wrapped in
`try { ... } finally { teardown }` — cleanup runs even when the
test fails. When only `:setup` is present, setup expressions are
prepended to the body with no wrapping.

---

## ID-04: Async Tests

**Strength**: SHOULD

**Summary**: Use `test-async` for explicit async, or just use `test`
— it auto-detects `await` in the body.

```lykn
;; Explicit async
(test-async "fetches data"
  (bind result (await (fetch-data)))
  (is-equal result:status :ok))

;; Auto-detected — same output
(test "also fetches data"
  (bind result (await (fetch-data)))
  (is-equal result:status :ok))
```

Compiles to:

```js
Deno.test("fetches data", async () => {
  const result = await fetchData();
  assertEquals(result.status, "ok");
});
```

`test-async` exists for cases where the body delegates to an async
helper without a lexically visible `await`. For most tests, `test`
with `await` in the body is sufficient.

---

## ID-05: Assertions — `is-equal`, `ok`, `is`

**Strength**: MUST

**Summary**: Named assertion forms. Each maps to a specific
`@std/assert` function.

```lykn
(test "value checks"
  ;; Deep structural equality
  (is-equal #a(1 2 3) #a(1 2 3))
  (is-equal (obj :a 1) (obj :a 1))

  ;; Deep inequality
  (is-not-equal result1 result2)

  ;; Reference equality (===)
  (is-strict-equal ptr1 ptr2)

  ;; Not null/undefined
  (ok config)

  ;; Truthiness
  (is (> count 0)))
```

**Full assertion table**:

| Form | Purpose | Compiles to |
|------|---------|-------------|
| `(is expr)` | Truthiness | `assert(expr)` |
| `(is-equal actual expected)` | Deep equality | `assertEquals` |
| `(is-not-equal actual expected)` | Deep inequality | `assertNotEquals` |
| `(is-strict-equal actual expected)` | Reference equality | `assertStrictEquals` |
| `(ok expr)` | Not null/undefined | `assertExists` |

**Rationale**: Explicit form names over smart dispatch. `is-equal`,
not `eq`. `is-strict-equal`, not `===`. The form name tells you
exactly which assertion fires — no dispatch rules to memorise.

---

## ID-06: `is-thrown` / `is-thrown-async`

**Strength**: SHOULD

**Summary**: Assert that an expression throws (or rejects). The body
is wrapped in a closure automatically.

```lykn
(test "error handling"
  ;; Throws any error
  (is-thrown (parse-json "not json"))

  ;; Throws specific type
  (is-thrown (parse-json "not json") SyntaxError)

  ;; Throws with message
  (is-thrown (validate nil) TypeError "expected non-null"))
```

Compiles to:

```js
Deno.test("error handling", () => {
  assertThrows(() => parseJson("not json"));
  assertThrows(() => parseJson("not json"), SyntaxError);
  assertThrows(() => validate(null), TypeError, "expected non-null");
});
```

For async rejections:

```lykn
(test-async "rejects on bad URL"
  (is-thrown-async (await (fetch-data "bad-url")) NetworkError))
```

Compiles to:

```js
Deno.test("rejects on bad URL", async () => {
  await assertRejects(async () => await fetchData("bad-url"), NetworkError);
});
```

---

## ID-07: `matches`, `includes`, `has`, `obj-matches`

**Strength**: SHOULD

**Summary**: Specialised assertions for pattern matching, containment,
and partial object comparison.

```lykn
(test "pattern assertions"
  ;; Regex match
  (matches version (regex "^\\d+\\.\\d+"))

  ;; String contains
  (includes error-message "not found")

  ;; Array contains elements
  (has result-codes #a(200 201))

  ;; Partial object match — extra fields are ignored
  (obj-matches response
    (obj :status 200 :ok true)))
```

| Form | Compiles to |
|------|-------------|
| `(matches str pattern)` | `assertMatch(str, pattern)` |
| `(includes str substr)` | `assertStringIncludes(str, substr)` |
| `(has arr items)` | `assertArrayIncludes(arr, items)` |
| `(obj-matches actual subset)` | `assertObjectMatch(actual, subset)` |

`obj-matches` is the right default for API response testing — verify
the fields you care about, ignore the rest.

---

## ID-08: `suite` — Grouped Tests

**Strength**: SHOULD

**Summary**: Group related tests with shared `:setup`/`:teardown`.
Child `test` forms compile to `t.step()` calls.

```lykn
(suite "math operations"
  :setup    (bind fixtures (load-fixtures))
  :teardown (cleanup fixtures)

  (test "addition"
    (is-equal (+ 1 2) 3))

  (test "multiplication"
    (is-equal (* 3 4) 12)))
```

Compiles to:

```js
Deno.test("math operations", async (t) => {
  const fixtures = loadFixtures();
  try {
    await t.step("addition", () => {
      assertEquals(1 + 2, 3);
    });
    await t.step("multiplication", () => {
      assertEquals(3 * 4, 12);
    });
  } finally {
    cleanup(fixtures);
  }
});
```

The suite function is always async because `t.step()` returns a
promise. Setup/teardown context is shared across all child tests.

---

## ID-09: `step` — Sub-Steps

**Strength**: CONSIDER

**Summary**: Define sub-steps within a `test` for sequential,
dependent operations. Each step is reported individually.

```lykn
(test "user workflow"
  (step "create user"
    (bind user (await (create-user :name "Alice")))
    (is-equal user:name "Alice"))
  (step "delete user"
    (await (delete-user 1))
    (is-equal (await (get-user 1)) null)))
```

When `step` appears inside a `test`, the enclosing test automatically
receives the `t` parameter and becomes async. Each step independently
detects `await` for its own async status.

---

## ID-10: `test-compiles` — Compiler Output Testing

**Strength**: SHOULD (for testing lykn compilation)

**Summary**: A convenience macro for the most common lykn test
pattern: compile a string, check the output.

```lykn
(import "../../packages/lykn/mod.js" (compile))
(import-macros "testing" (test-compiles))

(test-compiles "bind simple"
  "(bind x 1)" "const x = 1;")

(test-compiles "func basic"
  "(func add :args (a b) :body (+ a b))"
  "function add(a, b) {\n  return a + b;\n}")
```

Compiles to:

```js
import { compile } from "../../packages/lykn/mod.js";

Deno.test("bind simple", () => {
  const r_1 = compile("(bind x 1)");
  assertEquals(r_1.trim(), "const x = 1;");
});
```

One line replaces a five-line `Deno.test` + `compile` + `assertEquals`
pattern. The `compile` import is explicit — the testing module is
decoupled from the compiler.

**Rationale**: lykn's own test suite has 1,300+ tests, most following
this exact pattern. `test-compiles` makes test files read as
specifications.

---

## ID-11: `lykn test` — The CLI Command

**Strength**: MUST

**Summary**: `lykn test` compiles `.lykn` test files and invokes
Deno's test runner. Two phases: compile, then delegate.

```sh
# Run all tests
lykn test

# Run tests in a directory
lykn test test/surface/

# Run a specific file
lykn test test/surface/bind_test.lykn

# Filter by name
lykn test --filter "addition"

# Fail on first failure
lykn test --fail-fast

# With coverage
lykn test --coverage

# Test documentation (see ID-12)
lykn test --docs docs/guides/

# Both code and documentation
lykn test test/ --docs docs/
```

**lykn-specific flags**:

| Flag | Purpose |
|------|---------|
| `--docs <glob>` | Test Markdown code blocks |
| `--out-dir <dir>` | Write compiled JS to a separate directory |
| `--compile-only` | Compile but don't run |

All other flags pass through to `deno test`: `--filter`, `--fail-fast`,
`--parallel`, `--coverage`, `--reporter`, `--watch`, permissions.

---

## ID-12: `lykn test --docs` — Markdown Testing

**Strength**: SHOULD

**Summary**: Extract and test lykn code blocks from Markdown files.
The primary mechanism for keeping book and documentation examples
correct.

```sh
# Test all guides
lykn test --docs docs/guides/

# Test a specific file
lykn test --docs docs/guides/01-core-idioms.md

# Combined with code tests
lykn test test/ --docs docs/
```

Each testable code block becomes a `Deno.test()` case. When a
`` ```lykn `` block is followed by a `` ```js `` block, the tester
compiles the lykn and asserts the output matches the JavaScript.

---

## ID-13: Code Block Annotations

**Strength**: SHOULD

**Summary**: Control how the Markdown tester handles each code block
via fence annotations.

| Fence | Behaviour |
|-------|-----------|
| `` ```lykn `` | Compile check — assert no errors |
| `` ```lykn,run `` | Compile and execute |
| `` ```lykn,compile-fail `` | Assert compilation fails |
| `` ```lykn,skip `` | Don't test this block |
| `` ```lykn,fragment `` | Partial expression — skip |
| `` ```lykn,continue `` | Concatenate with preceding blocks |

The default (bare `` ```lykn ``) is a compile check. Use `skip` or
`fragment` for code blocks that are intentionally incomplete.
Use `compile-fail` for anti-pattern examples that should not compile.

---

## ID-14: Block Accumulation with `continue`

**Strength**: CONSIDER

**Summary**: When a section builds up a program incrementally, use
`continue` to concatenate blocks for compilation.

Each block compiles independently by default. The `continue`
annotation concatenates blocks within a Markdown section (`##`
headings reset the accumulator).

Use `continue` when a later block depends on definitions from an
earlier block in the same section (e.g., a `type` defined in one
block is used in a subsequent `match`).

---

## ID-15: Test File Conventions

**Strength**: SHOULD

**Summary**: Test files use `_test.lykn` suffix and are co-located
with source.

```text
my-project/
  src/
    math.lykn
    math_test.lykn         ← co-located test
  test/
    integration_test.lykn  ← separate test directory
  project.json
```

`_test.lykn` compiles to `_test.js`, which Deno discovers with its
standard glob. The `*.test.lykn` suffix is also accepted.

---

## ID-16: Async Setup in Tests

**Strength**: CONSIDER

**Summary**: Async `:setup` expressions are auto-detected. The
enclosing test becomes async.

```lykn
(test "async resource"
  :setup    (bind conn (await (connect-db)))
  :teardown (await (disconnect conn))
  :body
    (bind rows (await (query conn "SELECT 1")))
    (is-equal rows:length 1))
```

---

---

## Quick Reference

| Form | Purpose | Example |
|------|---------|---------|
| `(test name body...)` | Define a test | `(test "works" (is-equal 1 1))` |
| `(test-async name body...)` | Explicit async test | `(test-async "fetches" ...)` |
| `(suite name tests...)` | Group tests | `(suite "math" (test "add" ...))` |
| `(step name body...)` | Sub-step | `(step "create" ...)` |
| `(is-equal a b)` | Deep equality | `(is-equal result 42)` |
| `(is-not-equal a b)` | Deep inequality | `(is-not-equal a b)` |
| `(is-strict-equal a b)` | Reference equality | `(is-strict-equal ptr1 ptr2)` |
| `(ok expr)` | Not null/undefined | `(ok config)` |
| `(is expr)` | Truthiness | `(is (> n 0))` |
| `(is-thrown body)` | Expects throw | `(is-thrown (bad-call))` |
| `(is-thrown-async body)` | Expects rejection | `(is-thrown-async (bad-fetch))` |
| `(matches str pat)` | Regex match | `(matches s (regex "^v\\d"))` |
| `(includes str sub)` | String contains | `(includes msg "error")` |
| `(has arr items)` | Array contains | `(has codes #a(200))` |
| `(obj-matches a b)` | Partial object match | `(obj-matches resp (obj :ok true))` |
| `(test-compiles name in out)` | Compiler output test | `(test-compiles "x" "(bind x 1)" "const x = 1;")` |

---

## CLI Quick Reference

| Command | Description |
|---------|-------------|
| `lykn test` | Run all tests |
| `lykn test DIR` | Run tests in directory |
| `lykn test FILE` | Run specific test file |
| `lykn test --filter PAT` | Filter by name |
| `lykn test --fail-fast` | Stop on first failure |
| `lykn test --coverage` | Collect coverage |
| `lykn test --docs GLOB` | Test Markdown code blocks |
| `lykn test --out-dir DIR` | Separate output directory |
| `lykn test --compile-only` | Compile without running |

---

## Related Guidelines

- **Deno Testing (JS)**: See `12-deno/12-02-testing.md` for testing
  compiled JS output directly (without the lykn DSL)
- **Error Handling**: See `03-error-handling.md` for error patterns
  tested with `is-thrown`
- **Type Discipline**: See `05-type-discipline.md` for type annotations
  that contracts and tests verify
- **lykn CLI**: See `15-lykn-cli.md` ID-04b for `lykn test` basics
- **Project Structure**: See `10-project-structure.md` for test file
  placement conventions
- **Anti-Patterns**: See `09-anti-patterns.md` — load before writing
  any lykn code, including tests
