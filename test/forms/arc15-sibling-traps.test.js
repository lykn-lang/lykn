import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std/assert/mod.ts";
import { lykn } from "../../packages/lang/mod.js";

Deno.test("arc15 slice04: JS fn multi-form bodies return the last expression", () => {
  assertStringIncludes(
    lykn("(bind f (fn (:any x) (bind y (+ x 1)) y))"),
    "return y",
  );
});

Deno.test("arc15 slice04: JS fn control-transfer forms are not double-wrapped", () => {
  const cases = [
    ["return", "return x", "return return"],
    ["throw", "throw x", "return throw"],
    ["break", "break", "return break"],
    ["continue", "continue", "return continue"],
  ];

  for (const [head, expected, forbidden] of cases) {
    const result = lykn(`(fn (:any x) (${head} x))`);
    assertStringIncludes(result, expected);
    assertEquals(result.includes(forbidden), false);
  }
});
