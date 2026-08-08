import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/assert/mod.ts";
import { lykn } from "../../packages/lang/mod.js";

Deno.test("arc15 slice05: JS rejects bare-parameter fn", () => {
  const err = assertThrows(
    () => lykn("(bind f (fn (x) x))"),
    Error,
    "expected type keyword",
  );
  assertEquals(err.message.includes("fn(x(), x)"), false);
});
