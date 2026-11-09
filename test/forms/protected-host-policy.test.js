import { assertEquals, assertStringIncludes, assertThrows } from "https://deno.land/std/assert/mod.ts";
import { compile } from "../../packages/lang/compiler.js";
import { read } from "../../packages/lang/reader.js";

function expectPolicyError(source, slot) {
  const forms = read(source);
  const error = assertThrows(() => compile(forms), Error);
  assertEquals(error.message, `host-contract v1: write to protected slot ${slot}`);
}

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

  const defaultSource = "(function f ((default x (++ Reflect))) (let Reflect 0) x)";
  expectPolicyError(defaultSource, "Reflect");
  assertStringIncludes(
    compile(read("(function f (Reflect (default x (++ Reflect))) x)")),
    "++Reflect",
  );

  const methodSource = "(class C () (m ((default x (++ Reflect))) (let Reflect 0) x))";
  expectPolicyError(methodSource, "Reflect");
  assertStringIncludes(
    compile(read("(class C () (m (Reflect (default x (++ Reflect))) x))")),
    "++Reflect",
  );

  assertStringIncludes(
    compile(read("(const obj (object (delete Reflect:apply)))")),
    "delete: Reflect.apply",
  );

  const propertySource = "(const obj (object (var Reflect))) (++ Reflect)";
  expectPolicyError(propertySource, "Reflect");

  const computedSource = "(const obj (object ((computed (++ Reflect)) 0)))";
  expectPolicyError(computedSource, "Reflect");

  const calleeSource = "((=> () (++ Reflect)))";
  expectPolicyError(calleeSource, "Reflect");

  const doSource = "(do (let Reflect 0) (++ Reflect:apply)) (++ Reflect)";
  expectPolicyError(doSource, "Reflect");

  const trySource = "(try (let Reflect 0) (++ Reflect:apply) (catch err 0) (finally 0)) (++ Reflect)";
  expectPolicyError(trySource, "Reflect");

  const catchSource = "(try 0 (catch err (let Reflect 0) (++ Reflect:apply))) (++ Reflect)";
  expectPolicyError(catchSource, "Reflect");
});
