import { assertEquals, assertThrows } from "https://deno.land/std/assert/mod.ts";
import { read } from "lang/reader.js";
import { compile } from "lang/compiler.js";
import { lykn as compileSurfaceLykn } from "../../packages/lang/mod.js";

function lykn(source) {
  return compile(read(source)).trim();
}

Deno.test("for: basic c-style", () => {
  const result = lykn("(for (let i 0) (< i 10) (++ i) (console:log i))");
  assertEquals(result.includes("for"), true);
  assertEquals(result.includes("i < 10"), true);
});

Deno.test("for: infinite loop with empty slots", () => {
  const result = lykn("(for () () () (break))");
  assertEquals(result.includes("for (; ; )"), true);
});

Deno.test("for: missing body throws", () => {
  assertThrows(() => lykn("(for (let i 0) (< i 10))"));
});

Deno.test("for: all body forms compile as ordered statements", () => {
  const source = Deno.readTextFileSync(new URL("../fixtures/variadic-for-bodies.lykn", import.meta.url));
  const result = compileSurfaceLykn(source);
  assertEquals(result.includes("const value"), true);
  assertEquals(result.includes("const nextValue"), true);
  assertEquals(result.indexOf("const value") < result.lastIndexOf("if (true"), true);
  assertEquals(result.indexOf("const nextValue") < result.lastIndexOf("if (true"), true);
  assertEquals(result.includes("999"), true);
});

Deno.test("for: each consumed header rejects no-else if", () => {
  for (const invalid of [
    "(for (if true 0) (< i 1) (++ i) (console:log i))",
    "(for (let i 0) (if true true) (++ i) (console:log i))",
    "(for (let i 0) (< i 1) (if true 1) (console:log i))",
  ]) {
    assertThrows(
      () => compileSurfaceLykn(invalid),
      Error,
      "if in expression position requires an else branch",
    );
  }
});
