import { assertEquals, assertStringIncludes, assertThrows } from "https://deno.land/std/assert/mod.ts";
import { compile } from "../../packages/lang/compiler.js";
import { read } from "../../packages/lang/reader.js";

function expectPolicyError(source, slot) {
  const forms = read(source);
  const error = assertThrows(() => compile(forms), Error);
  assertEquals(error.message, `host-contract v2: write to protected slot ${slot}`);
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
  assertEquals(error.message, "host-contract v2: write to protected slot Reflect.apply");

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

Deno.test("protected host v2 rejects exact roots and slots while allowing deeper members", () => {
  for (const [source, slot] of [
    ['(set! Symbol 0)', 'Symbol'],
    ['(set! Symbol:for 0)', 'Symbol.for'],
    ['(set! Object 0)', 'Object'],
    ['(set! Object:freeze 0)', 'Object.freeze'],
    ['(set! Object:defineProperties 0)', 'Object.defineProperties'],
    ['(set! Number:isNaN 0)', 'Number.isNaN'],
    ['(set! Array:isArray 0)', 'Array.isArray'],
    ['(set! Promise 0)', 'Promise'],
    ['(set! TypeError 0)', 'TypeError'],
    ['(set! Error 0)', 'Error'],
  ]) expectPolicyError(source, slot);

  assertStringIncludes(compile(read('(set! Object:freeze:prototype 0)')), 'set(Object.freeze.prototype, 0);');
  assertStringIncludes(compile(read('(function f (Number) (set! Number:isNaN 0))')), 'set(Number.isNaN, 0);');
  expectPolicyError('(set! globalThis:Number:isNaN 0)', 'Number.isNaN');
  assertStringIncludes(
    compile(read('(set! globalThis:globalThis 0) (set! globalThis:Number:isNaN 1)')),
    'set(globalThis.Number.isNaN, 1);',
  );
});
