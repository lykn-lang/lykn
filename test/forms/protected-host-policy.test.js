import { assertEquals, assertThrows } from "https://deno.land/std/assert/mod.ts";
import { compile } from "../../packages/lang/compiler.js";
import { read } from "../../packages/lang/reader.js";

function expectPolicyError(source, slot, target) {
  const forms = read(source);
  const error = assertThrows(() => compile(forms), Error);
  assertEquals(error.message, `host-contract v1: write to protected slot ${slot}`);
  assertEquals(error.span, target.span);
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
  const defaultForms = read(defaultSource);
  const defaultPattern = defaultForms[0].values[2].values[0];
  expectPolicyError(
    defaultSource,
    "Reflect",
    defaultPattern.values[2].values[1],
  );
  assertEquals(
    typeof compile(read("(function f (Reflect (default x (++ Reflect))) (let Reflect 0) x)")),
    "string",
  );

  const methodSource = "(class C () (m ((default x (++ Reflect))) (let Reflect 0) x))";
  const methodForms = read(methodSource);
  const methodDefault = methodForms[0].values[3].values[1].values[0];
  expectPolicyError(
    methodSource,
    "Reflect",
    methodDefault.values[2].values[1],
  );
  assertEquals(
    typeof compile(read("(class C () (m (Reflect (default x (++ Reflect))) (let Reflect 0) x))")),
    "string",
  );

  assertEquals(
    typeof compile(read("(const obj (object (delete Reflect:apply)))")),
    "string",
  );

  const propertySource = "(const obj (object (var Reflect))) (++ Reflect)";
  const propertyForms = read(propertySource);
  expectPolicyError(propertySource, "Reflect", propertyForms[1].values[1]);

  const computedSource = "(const obj (object ((computed (++ Reflect)) 0)))";
  const computedForms = read(computedSource);
  const computedKey = computedForms[0].values[2].values[1].values[0];
  expectPolicyError(computedSource, "Reflect", computedKey.values[1].values[1]);

  const calleeSource = "((=> () (++ Reflect)))";
  const calleeForms = read(calleeSource);
  expectPolicyError(calleeSource, "Reflect", calleeForms[0].values[0].values[2].values[1]);

  const doSource = "(do (let Reflect 0) (++ Reflect)) (++ Reflect)";
  const doForms = read(doSource);
  expectPolicyError(doSource, "Reflect", doForms[1].values[1]);

  const trySource = "(try (let Reflect 0) (++ Reflect) (catch err 0) (finally 0)) (++ Reflect)";
  const tryForms = read(trySource);
  expectPolicyError(trySource, "Reflect", tryForms[1].values[1]);

  const catchSource = "(try 0 (catch err (let Reflect 0) (++ Reflect))) (++ Reflect)";
  const catchForms = read(catchSource);
  expectPolicyError(catchSource, "Reflect", catchForms[1].values[1]);
});
