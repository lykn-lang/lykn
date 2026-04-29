# Deno Testing

Testing lykn code with Deno's built-in test runner. Tests run on
compiled JavaScript output — write `.lykn` source, compile to `.js`,
test the `.js`.

For the full treatment, see the JS guide `12-deno/12-02-testing.md`.

Target environment: **Deno**, **ESM-only**, **`deno lint` + `deno fmt`** on compiled
output.

---

## ID-01: `Deno:test` — Built-in, No Framework Needed

**Strength**: MUST

```js
// test/auth/login_test.js — tests compiled output
import { assertEquals, assertThrows } from "@std/assert";
import { login } from "../../dist/auth/login.js";

Deno.test("login returns session for valid credentials", async () => {
  const session = await login("admin", "secret");
  assertEquals(session.role, "admin");
});

Deno.test("login throws for invalid credentials", () => {
  assertThrows(() => login("", ""), Error, "credentials required");
});
```

Tests are written in JS (not lykn) because they import and test the
compiled output. The test runner discovers `*_test.js` files
automatically.

---

## ID-02: Test Discovery

```sh
deno test                    # discover all *_test.js files
deno test test/auth/         # specific directory
deno test --filter "login"   # filter by name
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
# 1. Compile lykn source
lykn compile src/auth/login.lykn -o dist/auth/login.js

# 2. Run tests against compiled output
deno test test/auth/login_test.js

# Or via Makefile
make test
```

---

## Related Guidelines

- **Error Handling**: See `03-error-handling.md` for `assertThrows`
  patterns
- **Documentation**: See `11-documentation.md` ID-18 for test naming
- **Project Structure**: See `10-project-structure.md` ID-07, ID-20
