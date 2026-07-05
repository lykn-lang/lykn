// DD-58 strict mode + kernel: escape — JS-compiler parity with the Rust CLI
// (arc10/slice02). See crates/lykn-lang/src/classifier/forms.rs for the
// reference behaviour and diagnostic text.

import { assertEquals, assertThrows } from "https://deno.land/std/assert/mod.ts";
import { lykn } from "lang/mod.js";

const KERNEL_ONLY = ["const", "let", "var", "function", "function*"];

// --- F-3: strict default-on rejects the 5 bare kernel-only heads ---

Deno.test("dd58 strict: bare const/let/var throw with the Rust message", () => {
  for (const head of ["const", "let", "var"]) {
    assertThrows(
      () => lykn(`(${head} x 1)`),
      Error,
      `'${head}' is a kernel-only form; use 'bind' for surface binding, ` +
        `or '(kernel:${head} ...)' to access the kernel form explicitly`,
    );
  }
});

Deno.test("dd58 strict: bare function/function* throw with the Rust message", () => {
  for (const head of ["function", "function*"]) {
    assertThrows(
      () => lykn(`(${head} f () 1)`),
      Error,
      `'${head}' is a kernel-only form; use 'func', 'fn', or 'lambda' ` +
        `for surface functions, or '(kernel:${head} ...)' to access the ` +
        `kernel form explicitly`,
    );
  }
});

Deno.test("dd58 strict: is top-level-only — nested kernel forms compile", () => {
  // A bare kernel form inside a surface body is fine (Rust parity).
  const js = lykn("(func f :args () :returns :number :body (const x 1) x)");
  assertEquals(js.includes("const x = 1"), true);
});

Deno.test("dd58 strict: surface + operators are not rejected", () => {
  for (const src of ["(bind x 1)", "(= 1 1)", "(=== 1 1)", "(&& 1 1)"]) {
    lykn(src); // must not throw
  }
});

Deno.test("dd58 strict: explicit lax opt-out compiles bare kernel forms", () => {
  assertEquals(lykn("(var x 1)", { strict: false }).trim(), "var x = 1;");
});

// --- F-2: the kernel: escape (works under strict) ---

Deno.test("dd58 kernel: escape compiles each kernel-only head", () => {
  assertEquals(lykn("(kernel:const x 42)").trim(), "const x = 42;");
  assertEquals(lykn("(kernel:let x 1)").trim(), "let x = 1;");
  assertEquals(lykn("(kernel:var x 1)").trim(), "var x = 1;");
  assertEquals(lykn("(kernel:function f () 1)").includes("function f()"), true);
});

Deno.test("dd58 kernel: escape works in lax mode too", () => {
  assertEquals(lykn("(kernel:const x 1)", { strict: false }).trim(), "const x = 1;");
});

Deno.test("dd58 kernel: unknown form errors with did-you-mean", () => {
  assertThrows(
    () => lykn("(kernel:functoin f () 1)"),
    Error,
    "unknown kernel form 'functoin' in (kernel:functoin ...); did you mean 'function'?",
  );
});

Deno.test("dd58 kernel: escape is available for every kernel-only head", () => {
  // sanity: none of the 5 heads throws when kernel:-escaped
  for (const head of KERNEL_ONLY) {
    const src = head.startsWith("function")
      ? `(kernel:${head} f () 1)`
      : `(kernel:${head} x 1)`;
    lykn(src); // must not throw
  }
});

// --- A-6: macro-boundary enforcement (Rust semantics, DD-37 step 4) ---
// A user macro that expands to a top-level bare kernel-only decl is rejected
// (Rust already rejects it via post-expansion classification); the sanctioned
// authoring path is (kernel:<form> …) in the template.

// Distinct macro names per test — `lykn()` (the public API) does not reset the
// module-global macroEnv between calls, so reusing a name collides.

Deno.test("dd58 A-6: macro emitting top-level bare const throws", () => {
  assertThrows(
    () => lykn("(macro dcBad (n v) `(const ,n ,v))\n(dcBad x 1)"),
    Error,
    "'const' is a kernel-only form",
  );
});

Deno.test("dd58 A-6: macro emitting top-level (kernel:const …) compiles", () => {
  assertEquals(
    lykn("(macro dcEsc (n v) `(kernel:const ,n ,v))\n(dcEsc x 1)").trim(),
    "const x = 1;",
  );
});

Deno.test("dd58 A-6: macro emitting a NESTED bare kernel-only decl is legal", () => {
  // Top-level-only (Rust parity): the emitted `const` is nested inside `block`,
  // so it compiles even though it is bare (unsanctioned) — only top-level
  // kernel-only heads are swept.
  const js = lykn("(macro dcNest (n v) `(bind r (block (const ,n ,v) ,n)))\n(dcNest x 1)");
  assertEquals(js.includes("const x = 1"), true);
});

Deno.test("dd58 A-6: sanctioned surface output is never re-rejected", () => {
  // bind→const, func→function, obj pairs, genfunc→function* all compile
  for (const src of [
    "(bind x 1)",
    "(func f :args () :body 1)",
    "(genfunc g :body (yield 1))",
    "(bind o (obj :a 1 :b 2))",
  ]) {
    lykn(src); // must not throw
  }
});
