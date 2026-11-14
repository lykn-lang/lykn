import {
  assertEquals,
  assertStringIncludes,
  assertThrows,
} from "jsr:@std/assert";
import { compile, compileExpr } from "lang/compiler.js";
import { expand, expandExpr, read, lykn } from "lang/mod.js";
import { classifySurfaceForm, emitSurfaceForm, buildMultiClauseFunc } from "lang/classifier.js";
import { compileLykn as browserCompileLykn } from "browser/compiler.js";

async function executeModule(source, expected) {
  const directory = await Deno.makeTempDir({ prefix: "lykn-s03-discard-" });
  const path = `${directory}/out.mjs`;
  try {
    await Deno.writeTextFile(path, `${source}\nexport {};\n`);
    const result = await new Deno.Command(Deno.execPath(), {
      args: ["run", "--no-config", "--no-prompt", "--no-npm", "--cached-only", path],
      cwd: directory,
      stdout: "piped",
      stderr: "piped",
    }).output();
    assertEquals(result.code, 0, new TextDecoder().decode(result.stderr));
    assertEquals(new TextDecoder().decode(result.stderr), "");
    assertEquals(new TextDecoder().decode(result.stdout), expected);
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
}

Deno.test("S03 public declarations and loop binders discard without losing effects", async () => {
  await executeModule(lykn(`
    (set-symbol! globalThis "_" 99)
    (bind _ (do (set-symbol! globalThis "calls" (+ (?? (get globalThis "calls") 0) 1)) 7))
    (bind _value 7)
    (console:log (get globalThis "_") _value (get globalThis "calls"))
    (kernel:for-of (array _) #a(7) (console:log 1))
    (kernel:for-in _ (obj :a 1) (console:log 2))
    (kernel:for (kernel:let (array _ i) #a(0 0)) (< i 1) (kernel:++ i) (break))
  `), "99 7 1\n1\n2\n");
});

Deno.test("S03 public callable and class parameter slots preserve arity and laziness", async () => {
  await executeModule(lykn(`
    (set-symbol! globalThis "_" 99)
    (kernel:function f (_ _value) (return _value))
    (bind arrow (kernel:=> (_ _value) _value))
    (class C () (method (_ _value) (return _value)) (constructor (_) (return)))
    (bind c (new C 1))
    (console:log (f 1 7) (arrow 1 7) (c:method 1 7))
  `), "7 7 7\n");
});

Deno.test("S03 public catch keeps the writer's expression-binding grammar", async () => {
  await executeModule(`const outer = 99;\n${lykn(`
    (try (throw (array 7)) (catch (array _) (console:log outer _)))
    (try (throw (obj :_ 8)) (catch (object _) (console:log _)))
  `)}`, "99 7\n8\n");
});

Deno.test("S03 spread parameters project source names and preserve fallback lookup", async () => {
  await executeModule(lykn(`
    (set-symbol! globalThis "_" 99)
    (kernel:function spreader ((spread args)) (return _))
    (console:log (spreader 1 2))
  `), "99\n");
});

Deno.test("S03 public zero-name grouped patterns keep static alias keys", async () => {
  await executeModule(lykn(`
    (bind (object (alias :pipe|key _)) (obj :pipe|key 7)
          (object) (obj))
    (console:log _)
  `), "99\n");
});

Deno.test("S03 multi-clause signature guard is early and one-clause builders delegate", () => {
  const message = "multi-clause func does not support top-level default or rest parameters";
  assertThrows(() => lykn(`(func f (:args ((default :any x 1)) :body x) (:args (:any y) :body y))`), Error, message);
  assertThrows(() => classifySurfaceForm("func", read(`(f (:args ((rest :any xs)) :body xs) (:args (:any x) :body x))`).slice(1)), Error, message);
  assertEquals(typeof buildMultiClauseFunc, "function");
  assertEquals(typeof emitSurfaceForm, "function");
});

Deno.test("S03 raw compiler IR stays literal while source expansion prepares discards", async () => {
  const raw = read(`(function f (x _) (return _))`)[0];
  assertEquals(compileExpr(raw, "expression").type, "FunctionDeclaration");
  assertStringIncludes(compile([raw]), "function f");
  await executeModule(`globalThis._ = 99;\n${compile([raw])}\nconsole.log(f(1, 7));`, "7\n");
  await executeModule(`globalThis._ = 99;\n${lykn(`(kernel:function f (x _) (return _)) (console:log (f 1 7))`)}`, "99\n");
});

Deno.test("S03 browser compilation and staged source facade share public behavior", async () => {
  const source = `(set-symbol! globalThis "_" 99) (kernel:function f (x _) (return _)) (console:log (f 1 7))`;
  await executeModule(lykn(source), "99\n");
  await executeModule(browserCompileLykn(source), "99\n");
});
