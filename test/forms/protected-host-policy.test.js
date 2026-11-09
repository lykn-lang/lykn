import { assertEquals, assertThrows } from "https://deno.land/std/assert/mod.ts";
import { compile } from "../../packages/lang/compiler.js";
import { read } from "../../packages/lang/reader.js";

Deno.test("protected host policy compares computed path segments exactly", () => {
  assertEquals(
    compile(read('(= (get globalThis "Reflect.apply") 0)')).trim(),
    'globalThis["Reflect.apply"] = 0;',
  );

  const error = assertThrows(
    () => compile(read('(= (get (get globalThis "Reflect") "apply") 0)')),
    Error,
  );
  assertEquals(error.message, "host-contract v1: write to protected slot Reflect.apply");
});
