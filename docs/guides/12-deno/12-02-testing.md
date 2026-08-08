# Deno Testing

Testing lykn code with Deno's built-in test runner. The normal project
workflow is `lykn test`: write `.lykn` or `.lyk` tests, let the CLI compile
them into `target/lykn/test/`, and let it invoke Deno's test runner.

For the full treatment, see the JS guide `12-deno/12-02-testing.md`.

Target environment: **Deno**, **ESM-only**, with `lykn test` as the project
test entry point.

---

## ID-01: `Deno:test` — Built-in, No Framework Needed

**Strength**: MUST

```js
// test/auth/login_test.js — JS tests may target built package output
import { assertEquals, assertThrows } from "@std/assert";
import { login } from "../../target/lykn/build/myapp/auth/login.js";

Deno.test("login returns session for valid credentials", async () => {
  const session = await login("admin", "secret");
  assertEquals(session.role, "admin");
});

Deno.test("login throws for invalid credentials", () => {
  assertThrows(() => login("", ""), Error, "credentials required");
});
```

This example is a Deno assertion/API example for JS tests against built
output. For normal lykn project tests, prefer `.lykn` or `.lyk` test files and
run them with `lykn test`.

---

## ID-02: Test Discovery

```sh
lykn test                    # discover tests under test/
lykn test test/auth/         # specific directory or file pattern
lykn test -- --filter login  # pass Deno test-runner args after --
```

---

## ID-03: Assertions from `@std/assert`

Key assertions: `assertEquals`, `assertThrows`, `assertRejects`,
`assertStringIncludes`, `assertObjectMatch`, `assertNotEquals`.

---

## ID-04: Test Steps for Sub-Tests

```js
Deno.test("user lifecycle", async (t) => {
  await t.step("create", () => { /* ... */ });
  await t.step("update", () => { /* ... */ });
  await t.step("delete", () => { /* ... */ });
});
```

---

## ID-05: Async Tests

`Deno:test` natively supports async test functions. Just `await`.

---

## ID-06: The lykn Test Workflow

```sh
# Run the default test corpus
lykn test

# Run one test directory
lykn test test/auth/

# Compile .lykn/.lyk tests without running them
lykn test --compile-only
```

`lykn test` compiles matching `.lykn` and `.lyk` test files into
`target/lykn/test/` and then runs Deno's test runner with the generated project
configuration. Pass extra Deno test-runner flags after `--`.

---

## Related Guidelines

- **Error Handling**: See `03-error-handling.md` for `assertThrows`
  patterns
- **Documentation**: See `11-documentation.md` ID-18 for test naming
- **Project Structure**: See `10-project-structure.md` ID-07, ID-20
