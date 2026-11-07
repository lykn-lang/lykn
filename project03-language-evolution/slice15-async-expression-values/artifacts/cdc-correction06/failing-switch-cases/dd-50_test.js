import {assert, assertEquals, assertNotEquals, assertStrictEquals, assertExists, assertThrows, assertRejects, assertMatch, assertStringIncludes, assertArrayIncludes, assertObjectMatch} from "jsr:@std/assert";
import {compile, compileBoth} from "testing/helpers.js";
Deno.test("DD-50 V-05: if in bind → ternary", () => {
  const r = compile("(bind n 5)\n(bind size (if (> n 0) \"big\" \"small\"))");
  assertStringIncludes(r, "const size = n > 0 ? \"big\" : \"small\"");
});
Deno.test("DD-50 V-04: nested if as func body → nested ternary", () => {
  const r = compile("(func classify :args (:any x) :returns :string :body (if (= (js:typeof x) \"string\") \"string\" (if (= (js:typeof x) \"number\") \"number\" \"other\")))");
  assertStringIncludes(r, "typeof x === \"string\" ? \"string\" : typeof x === \"number\" ? \"number\" : \"other\"");
});
Deno.test("DD-50: if in statement position unchanged", () => {
  const r = compile("(if true (console:log \"x\"))");
  assertStringIncludes(r, "if (true)");
});
Deno.test("DD-50: if in bind with pure expression branches → ternary", () => {
  const r = compile("(bind x (if true 1 2))");
  assertStringIncludes(r, "const x = true ? 1 : 2");
});
Deno.test("DD-50 Rule 4: do in expression position → IIFE", () => {
  const r = compile("(bind x (do 1 2 3))");
  assertStringIncludes(r, "(() =>");
  assertStringIncludes(r, "return 3");
});
Deno.test("DD-50 Rule 4: do in statement position → block", () => {
  const r = compile("(do (console:log 1) (console:log 2))");
  assertStringIncludes(r, "console.log(1)");
});
Deno.test("DD-50 Rule 2: if with no else in expression position triggers compile error", () => assertThrows(() => compile("(bind x (if true 1))"), Error, "if in expression position requires an else branch"));
Deno.test("DD-50 Rule 1c: statement-branch in if expression-position triggers IIFE", () => {
  const r = compile("(func test :args (:any x) :body (bind y (if (= x 1) \"a\" (throw (new Error \"e\")))) y)");
  assertStringIncludes(r, "(() =>");
  assertStringIncludes(r, "throw");
});
Deno.test("DD-50: nested do-block branch in if compiles via compile-then-check", () => {
  const r = compile("(bind x (if true (do 1 2 3) 4))");
  assertStringIncludes(r, " ? ");
  assertStringIncludes(r, "(() =>");
});
Deno.test("DD-50 Iter2: if in return arg → ternary", () => {
  const r = compile("(func test :args (:any x) :returns :string :body (return (if (= x 1) \"a\" \"b\")))");
  assertStringIncludes(r, " ? ");
});
Deno.test("DD-50 Iter2: if in assignment RHS → ternary", () => {
  const r = compile("(func test :args (:any x) :body (bind y (cell 0)) (= y:value (if (= x 1) \"a\" \"b\")))");
  assertStringIncludes(r, " ? ");
});
Deno.test("DD-50 Iter2: if in object value → ternary", () => {
  const r = compile("(bind x (obj :v (if true 1 2)))");
  assertStringIncludes(r, " ? ");
});
Deno.test("DD-50 Iter2: if in ternary operand → nested ternary", () => {
  const r = compile("(bind x (? true (if false 1 2) 3))");
  assertStringIncludes(r, " ? ");
});
Deno.test("DD-50 regression: match still works", () => {
  const r = compile("(type Option (Some :any value) None)\n(bind x (match (Some 1) ((Some v) v) (None 0)))");
  assertStringIncludes(r, "const x =");
});
Deno.test("DD-50 regression: if-let still IIFE-wrapped", () => {
  const r = compile("(if-let (v 42) v 0)");
  assertStringIncludes(r, "(() =>");
});
Deno.test("DD-50 regression: when-let still IIFE-wrapped", () => {
  const r = compile("(when-let (v 42) v)");
  assertStringIncludes(r, "(() =>");
});
Deno.test("DD-50.5: no-else if in while body — both compilers", () => {
  const r = compileBoth("(while true (if false (throw (new Error \"e\"))))");
  assertStringIncludes(r, "while (true)");
  assertStringIncludes(r, "if (false)");
  assertStringIncludes(r, "throw");
});
Deno.test("DD-50.5: no-else if in for body — both compilers", () => {
  const r = compileBoth("(for (let i 0) (< i 10) (++ i) (if (= i 5) (break)))");
  assertStringIncludes(r, "for (");
  assertStringIncludes(r, "break");
});
Deno.test("DD-50.5: no-else if in block — both compilers", () => {
  const r = compileBoth("(func test :args (:any x) :body (if (= x 1) (console:log \"yes\")) (console:log \"done\"))");
  assertStringIncludes(r, "console.log(\"yes\")");
  assertStringIncludes(r, "console.log(\"done\")");
});
Deno.test("DD-50.5: no-else if in try body — statement context preserved", () => {
  const r = compile("(try (if (= x 1) (throw (new Error \"e\"))) (catch e (console:log e)))");
  assertStringIncludes(r, "try");
  assertStringIncludes(r, "throw");
});
Deno.test("DD-50.5 addendum: no-else if in switch case body — both compilers agree", () => {
  const r = compileBoth("(switch x (1 (if (= y 0) (console:log \"a\")) (break)) (default (break)))");
  assertStringIncludes(r, "switch (x)");
  assertStringIncludes(r, "console.log(\"a\")");
});
Deno.test("DD-50.5: if in while test — still intercepted in Value context", () => {
  const r = compile("(while (if cond true false) (console:log \"loop\"))");
  assertStringIncludes(r, "while (cond ? true : false)");
});
Deno.test("DD-50.5: if in return arg — still intercepted in Value context", () => {
  const r = compile("(func test :returns :any :body (return (if cond \"a\" \"b\")))");
  assertStringIncludes(r, "return cond ? \"a\" : \"b\"");
});
Deno.test("DD-50.5 iter3: surface = inside if condition", () => {
  const r = compileBoth("(if (= x 1) (console:log \"yes\"))");
  assertStringIncludes(r, "x === 1");
});
Deno.test("DD-50.5 iter3: surface != inside if condition", () => {
  const r = compileBoth("(if (!= x 1) (console:log \"no\"))");
  assertStringIncludes(r, "x !== 1");
});
Deno.test("DD-50.5 iter3: surface and inside if condition", () => {
  const r = compileBoth("(if (and x y) (console:log \"both\"))");
  assertStringIncludes(r, "x && y");
});
Deno.test("DD-50.5 iter3: surface or inside if condition", () => {
  const r = compileBoth("(if (or x y) (console:log \"either\"))");
  assertStringIncludes(r, "x || y");
});
Deno.test("DD-50.5 iter3: surface not inside if condition", () => {
  const r = compileBoth("(if (not x) (console:log \"falsy\"))");
  assertStringIncludes(r, "!x");
});
Deno.test("DD-50.5 iter3: surface = inside while test", () => {
  const r = compileBoth("(while (= state 0) (console:log \"waiting\"))");
  assertStringIncludes(r, "while (state === 0)");
});
Deno.test("DD-50.5 iter3: surface and inside while test", () => {
  const r = compileBoth("(while (and active running) (console:log \"loop\"))");
  assertStringIncludes(r, "while (active && running)");
});
Deno.test("DD-50.5 iter3: surface != inside for test", () => {
  const r = compileBoth("(for (let i 0) (!= i 10) (++ i) (console:log i))");
  assertStringIncludes(r, "i !== 10");
});
Deno.test("DD-50.5 iter3: surface and inside block body", () => {
  const r = compileBoth("(block (and x y) (console:log \"done\"))");
  assertStringIncludes(r, "x && y");
});
Deno.test("DD-50.5 iter3: surface or inside switch case body", () => {
  const r = compileBoth("(switch state (1 (if (or a b) (console:log \"x\")) (break)) (default (break)))");
  assertStringIncludes(r, "a || b");
});
Deno.test("DD-50.5 iter3: surface not inside try body", () => {
  const r = compileBoth("(try (if (not ready) (throw (new Error \"e\"))) (catch e (console:log e)))");
  assertStringIncludes(r, "!ready");
});
