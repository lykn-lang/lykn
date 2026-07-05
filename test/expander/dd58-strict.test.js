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
