import { assertEquals, assertStringIncludes, assertThrows } from "jsr:@std/assert";
import { lykn } from "../../packages/lang/mod.js";

Deno.test("DD-50: if in bind initializer → ternary", () => {
  const out = lykn("(bind x (if true 1 2))");
  assertStringIncludes(out, "true ? 1 : 2");
});

Deno.test("DD-50: nested if in func body → nested ternary", () => {
  const out = lykn('(func classify :args (:any x) :returns :string :body (if (= (js:typeof x) "string") "string" (if (= (js:typeof x) "number") "number" "other")))');
  assertStringIncludes(out, " ? ");
});

Deno.test("DD-50 Rule 2: no-else in expression position throws compile error", () => {
  assertThrows(
    () => lykn("(bind x (if true 1))"),
    Error,
    "if in expression position requires an else branch"
  );
});

Deno.test("DD-50: statement-branch in if expr-position → IIFE wrap", () => {
  const out = lykn('(func test :args (:any x) :body (bind y (if (= x 1) "a" (throw (new Error "e")))) y)');
  assertStringIncludes(out, "(() =>");
});

Deno.test("DD-50: do in expression position → IIFE", () => {
  const out = lykn("(bind x (do 1 2 3))");
  assertStringIncludes(out, "(() =>");
  assertStringIncludes(out, "return 3");
});

Deno.test("DD-50: do in statement position → block", () => {
  const out = lykn("(do (console:log 1) (console:log 2))");
  assertStringIncludes(out, "console.log(1)");
});

Deno.test("DD-50: if in statement position unchanged", () => {
  const out = lykn('(if true (console:log "x"))');
  assertStringIncludes(out, "if (true)");
});

Deno.test("DD-50 cross-compiler: statement-form branch classification", () => {
  const out = lykn('(bind x (if true (throw (new Error "e")) 1))');
  assertStringIncludes(out, "(() =>");
});

// DD-50.5: kernel-form context refinement

Deno.test("DD-50.5: no-else if in while body preserved as statement", () => {
  const out = lykn('(while true (if false (throw (new Error "e"))))');
  assertStringIncludes(out, "while (true)");
  assertStringIncludes(out, "if (false)");
  assertStringIncludes(out, "throw");
});

Deno.test("DD-50.5: no-else if in for body preserved as statement", () => {
  const out = lykn('(for (let i 0) (< i 10) (++ i) (if (= i 5) (break)))');
  assertStringIncludes(out, "for (");
  assertStringIncludes(out, "break");
});

Deno.test("DD-50.5: no-else if in block preserved as statement", () => {
  const out = lykn('(func test :args (:any x) :body (if (= x 1) (console:log "yes")) (console:log "done"))');
  assertStringIncludes(out, "if (x === 1)");
});

Deno.test("DD-50.5: no-else if in try body preserved as statement", () => {
  const out = lykn('(try (if (= x 1) (throw (new Error "e"))) (catch e (console:log e)))');
  assertStringIncludes(out, "try");
  assertStringIncludes(out, "if (x === 1)");
});

Deno.test("DD-50.5: positive — if in return arg still intercepted", () => {
  const out = lykn('(func test :returns :any :body (return (if cond "a" "b")))');
  assertStringIncludes(out, 'return cond ? "a" : "b"');
});
