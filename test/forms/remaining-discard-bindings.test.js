import {
  assertEquals,
  assertStringIncludes,
  assertThrows,
} from "jsr:@std/assert";
import { compile, compileExpr } from "lang/compiler.js";
import { expand, expandExpr, read, lykn } from "lang/mod.js";
import { classifySurfaceForm, emitSurfaceForm, buildMultiClauseFunc } from "lang/classifier.js";
import { compileLykn as browserCompileLykn } from "browser/compiler.js";
import { macroEnv, resetMacros } from "lang/expander-core.js";

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

async function executeFailure(source, expectedMessage) {
  const directory = await Deno.makeTempDir({ prefix: "lykn-s03-failure-" });
  try {
    await Deno.writeTextFile(`${directory}/out.mjs`, `${source}\n`);
    const result = await new Deno.Command(Deno.execPath(), {
      args: ["run", "--no-config", "--no-prompt", "--no-npm", "--cached-only", `${directory}/out.mjs`],
      cwd: directory,
      stdout: "piped",
      stderr: "piped",
    }).output();
    assertEquals(result.code !== 0, true);
    assertStringIncludes(new TextDecoder().decode(result.stderr), expectedMessage);
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
}

Deno.test("S03 public declarations and loop binders discard without losing effects", async () => {
  await executeModule(lykn(`
    (set-symbol! globalThis "_" 99)
    (bind _ (do (set-symbol! globalThis "calls" (+ (?? (get globalThis "calls") 0) 1)) 7))
    (bind _value 7)
    (kernel:const (array _ _) #a(3 4))
    (kernel:var _ 8)
    (console:log (get globalThis "_") _value (get globalThis "calls"))
    (kernel:for-of (array _) #a(#a(7)) (console:log 1))
    (kernel:for-in _ (obj :a 1) (console:log 2))
    (kernel:for (kernel:let (array _ i) #a(0 0)) (< i 1) (kernel:++ i) (break))
  `), "99 7 1\n1\n2\n");

  await executeModule(`
    globalThis.resultValueReads = 0;
    globalThis.outerNexts = 0;
    globalThis.outerReturns = 0;
    function innerIterable() {
      let next = 0;
      const result = { done: false };
      Object.defineProperty(result, "value", { get() { resultValueReads++; return 7; } });
      return { [Symbol.iterator]() { return { next() { return next++ === 0 ? result : { done: true }; } }; } };
    }
    globalThis.holeOuter = [[innerIterable()], [innerIterable()]];
    globalThis.namedOuter = [[innerIterable()], [innerIterable()]];
    globalThis.breakOuter = { [Symbol.iterator]() { return {
      next() { outerNexts++; return { done: false, value: 1 }; },
      return() { outerReturns++; return { done: true }; },
    }; } };
    ${lykn(`
      (kernel:for-of (array (array _)) holeOuter (void 0))
      (console:log resultValueReads)
      (kernel:for-of (array (array named)) namedOuter (void 0))
      (console:log resultValueReads)
      (kernel:for-of _ breakOuter (break))
      (console:log outerNexts outerReturns)
    `)}
  `, "0\n2\n1 1\n");

  await executeModule(`globalThis.awaitItems = [Promise.resolve(1)];\n${lykn(`
    (bind run-await (async (=> ()
      (kernel:for-await-of _ awaitItems (console:log 9))
      0)))
    (await (run-await))
  `)}`, "9\n");
});

Deno.test("S03 public callable and class parameter slots preserve arity and laziness", async () => {
  await executeModule(lykn(`
    (set-symbol! globalThis "_" 99)
    (kernel:function f (_ _value) (return _value))
    (bind arrow (kernel:=> (_ _value) _value))
    (class C () (method (_ _value) (return _value)) (constructor (_) (return)))
    (bind c (new C 1))
    (bind typed-lambda (lambda (:any _) _))
    (bind async-arrow (async (kernel:=> (_ _value) _)))
    (bind async-function (async (kernel:function async-func (_ value) (return value))) )
    (kernel:function* gen (x _) (set-symbol! globalThis "genAdvances" 1) (yield _))
    (bind iterator (gen 1 7))
    (bind anonymous-gen (kernel:function* (x _) (yield _)))
    (bind anonymous-iterator (anonymous-gen 1 7))
    (kernel:function* lazy-gen ((default _ (set-symbol! globalThis "genDefaultCalls" (+ (?? (get globalThis "genDefaultCalls") 0) 1))))
      (do
        (set-symbol! globalThis "genBodyCalls" (+ (?? (get globalThis "genBodyCalls") 0) 1))
        (yield _)))
    (bind lazy-iterator (lazy-gen))
    (class Slots ()
      (field stored 0)
      (constructor (_) (assign this:stored 5))
      (method (_ value) (return value))
      (get value () (return this:stored))
      (set value (_) (assign this:stored _))
      (static (static-value (_) (return _)))
      (async (async-value (_) (return _))))
    (bind slots (new Slots 1))
    (bind callable-object (kernel:object (run (kernel:=> (_ value) value))))
    (console:log (f 1 7) (arrow 1 7) (c:method 1 7) f:length arrow:length anonymous-gen:length
      (?? (get globalThis "genAdvances") 0))
    (console:log (typed-lambda 7) (get (iterator:next) "value") (get globalThis "genAdvances")
      (get (anonymous-iterator:next) "value"))
    (console:log (get globalThis "genDefaultCalls") (?? (get globalThis "genBodyCalls") 0))
    (console:log (get (lazy-iterator:next) "value") (get globalThis "genDefaultCalls") (get globalThis "genBodyCalls"))
    (set! slots:value 7)
    (console:log slots:stored (Slots:static-value 1) (slots:method 1 7)
      (callable-object:run 1 7))
    (console:log (await (slots:async-value 1 7)))
    (console:log (await (async-function 1 7)))
    (bind lazy-default (kernel:function with-default ((default x (set-symbol! globalThis "defaultCalls" (+ (?? (get globalThis "defaultCalls") 0) 1)))) (return x)))
    (console:log (lazy-default 5) (?? (get globalThis "defaultCalls") 0))
    (console:log (lazy-default undefined) (get globalThis "defaultCalls"))
  `), "7 7 7 2 2 2 0\n99 99 1 99\n1 0\n99 1 1\n99 99 7 7\n99\n7\n5 0\n1 1\n");
  await executeFailure(lykn(`
    (kernel:function throw-default ((default x (throw (new Error "default boom")))) (return x))
    (throw-default)
  `), "default boom");
});

Deno.test("S03 public catch keeps the writer's expression-binding grammar", async () => {
  await executeModule(`
    globalThis._ = 99;
    globalThis.reads = 0;
    const caughtArray = [];
    Object.defineProperty(caughtArray, "0", { get() { reads++; return 7; }, configurable: true });
    caughtArray.length = 1;
    const caughtObject = {};
    Object.defineProperty(caughtObject, "_", { get() { reads++; return 8; }, configurable: true });
    ${lykn(`
      (try (throw caughtArray) (catch (array _) (console:log _ reads)))
      (try (throw caughtObject) (catch (object _) (console:log _ reads)))
    `)}
  `, "99 1\n99 2\n");

  await executeModule(`
    globalThis._ = 99;
    globalThis.reads = 0;
    globalThis.computedKey = "computed";
    globalThis.catchObject = {};
    for (const key of ["entry", "computed", "default", "alias"]) {
      Object.defineProperty(catchObject, key, { enumerable: true, get() { reads++; return key; } });
    }
    globalThis.catchArray = [1, 2];
    globalThis.finalized = 0;
    globalThis.defaultReads = 0;
    globalThis.setDefaultRead = (value) => { defaultReads++; return value; };
    ${lykn(`
      (try (throw 7) (catch _ (console:log _)))
      (try (throw catchObject)
        (catch (object (entry _) ((computed computedKey) _) (default _) (alias _))
          (console:log _ reads))
        (finally (set-symbol! globalThis "finalized" 1)))
      (try (throw #a())
        (catch (array (default _ (setDefaultRead 8)))
          (console:log _ (get globalThis "defaultReads"))))
      (try (throw catchArray)
        (catch (array (spread _)) (console:log _)))
      (try (throw catchArray)
        (catch (array (rest _)) (console:log _)))
      (kernel:function return-from-catch ()
        (try (throw 3) (catch _ (return 41)))
        (return 99))
      (console:log (return-from-catch) finalized)
    `)}
  `, "99\n99 4\n99 1\n99\n99\n41 1\n");
});

Deno.test("S03 spread parameters project source names and preserve fallback lookup", async () => {
  await executeModule(lykn(`
    (set-symbol! globalThis "_" 99)
    (kernel:function spreader ((spread args)) (return args:length))
    (kernel:function form-shadow ((spread bind)) (return ((get bind 0) 1)))
    (console:log _ (spreader 1 2) (form-shadow (kernel:=> (x) (+ x 1))))
  `), "99 2 2\n");
  assertThrows(
    () => lykn(`(kernel:function reserved-spread ((spread eval)) (return eval))`),
    Error,
    "forbidden as a strict-mode binding identifier",
  );
});

Deno.test("S03 public zero-name grouped patterns keep static alias keys", async () => {
  await executeModule(`
    globalThis._ = 99;
    globalThis.aliasReads = 0;
    globalThis.defaults = 0;
    globalThis.defaultValue = (value) => { defaults++; return value; };
    globalThis.source = {};
    for (const key of ["pipe|key", "keyword|key", "string-key", "café", "-1", "0"]) {
      Object.defineProperty(source, key, { get() { aliasReads++; return key; } });
    }
    ${lykn(`
      (bind (object (alias pipe|key _) (alias :keyword|key _) (alias "string-key" _)
                    (alias café _) (alias -1 _) (alias -0 _)) source
            (array _) #a(7)
            () (obj))
      (bind (object (default _ (defaultValue 8)))
        (kernel:object ("_" undefined)))
      (console:log _ aliasReads defaults)
    `)}
  `, "99 6 1\n");
  for (const member of ["object:property", "object.property"]) {
    assertThrows(
      () => lykn(`(bind (object (alias ${member} _)) source (object) other)`),
      Error,
      "bind group name must be an atom or destructuring pattern",
    );
  }
  assertThrows(
    () => lykn(`(bind :any (object) source (object) other)`),
    Error,
    "typed grouped pair name must be an atom",
  );
  assertThrows(
    () => lykn(`(bind (object visible) source (object visible) other)`),
    Error,
    "more than once",
  );
});

Deno.test("S03 multi-clause signature guard is early and one-clause builders delegate", async () => {
  const message = "multi-clause func does not support top-level default or rest parameters";
  assertThrows(() => lykn(`(func f (:args ((default :any x 1)) :body x) (:args (:any y) :body y))`), Error, message);
  const restSource = read(`(func f (:args ((rest :any xs)) :body xs) (:args (:any x) :body x))`)[0];
  assertThrows(() => classifySurfaceForm("func", restSource.values.slice(1)), Error, message);
  const mixed = `(func mixed (:args ((array :any first)) :body first) (:args ((default :any value 1)) :body value))`;
  assertThrows(() => lykn(mixed), Error, message);
  assertThrows(() => browserCompileLykn(mixed), Error, message);
  const directName = { type: "atom", value: "direct" };
  const defaultClauses = [read(`(:args ((default :any x 1)) :body x)`)[0], read(`(:args (:any y) :body y)`)[0]];
  const directNode = { type: "Func", nameNode: directName, restArgs: defaultClauses };
  const helpers = {
    sym: (value) => ({ type: "atom", value }),
    array: (...values) => ({ type: "list", values }),
    gensym: (prefix) => ({ type: "atom", value: `${prefix}__direct` }),
    isKeyword: (value) => value?.type === "keyword",
  };
  assertThrows(() => emitSurfaceForm(directNode, helpers), Error, message);
  assertThrows(() => buildMultiClauseFunc("direct", directName, defaultClauses), Error, message);

  resetMacros();
  let rhsCalls = 0;
  macroEnv.set("signature-rhs", () => { rhsCalls++; return read("7")[0]; });
  try {
    assertThrows(
      () => lykn(`(func early (:args ((default :any x (signature-rhs))) :body x) (:args (:any y) :body y))`),
      Error,
      message,
    );
    assertEquals(rhsCalls, 0);
  } finally {
    resetMacros();
  }
  const directDefault = buildMultiClauseFunc("directDefault", { type: "atom", value: "directDefault" }, [
    read(`(:args ((default :any value 7)) :body value)`)[0],
  ]);
  const directRest = buildMultiClauseFunc("directRest", { type: "atom", value: "directRest" }, [
    read(`(:args ((rest :any values)) :body values:length)`)[0],
  ]);
  await executeModule(`${lykn(`
    (func source-default (:args ((default :any value 8)) :body value))
    (func source-rest (:args ((rest :any values)) :body values:length))
    (console:log (source-default) (source-rest 1 2))
  `)}\n${compile([directDefault, directRest])}\nconsole.log(directDefault(), directRest(1, 2));`, "8 2\n7 2\n");
  await executeModule(lykn(`
    (func by-type
      (:args (:number value) :pre (> value 0) :post (= ~ value) :body value)
      (:args (:string value) :body value))
    (console:log (by-type 3) (by-type "x"))
  `), "3 x\n");
});

Deno.test("S03 raw compiler IR stays literal while source expansion prepares discards", async () => {
  const raw = read(`(function f (x _) (return _))`)[0];
  assertEquals(compileExpr(raw, "expression").type, "FunctionDeclaration");
  assertStringIncludes(compile([raw]), "function f");
  await executeModule(`globalThis._ = 99;\n${compile([raw])}\nconsole.log(f(1, 7));`, "7\n");
  await executeModule(`globalThis._ = 99;\n${lykn(`(kernel:function f (x _) (return _)) (console:log (f 1 7))`)}`, "99\n");

  const source = `
    (type Sample (Sample :number _))
    (set-symbol! globalThis "_" 99)
    (kernel:function value (_ input) (return input))
    (bind schema (Sample 7))
    (bind literal-object (kernel:object (_ 8)))
    (kernel:= _ 10)
    (console:log (value 1 7) (get schema "_") (get literal-object "_") _)
  `;
  const expanded = expand(read(source));
  const roundTrip = JSON.parse(JSON.stringify(expanded));
  const jsonCompiled = compile(roundTrip);
  assertEquals(jsonCompiled.includes("discardValue__private"), false);
  await executeModule(jsonCompiled, "7 7 8 10\n");
  await executeModule(`
    globalThis._ = 99;
    ${lykn(`(type Sample (Sample :number _))
      (bind value (Sample 7))
      (console:log (get value "_") _)`)}
  `, "7 99\n");
  await executeFailure(
    lykn(`(type Sample (Sample :number _)) (Sample "bad")`),
    "field '_' expected number, got string",
  );

  await executeModule(`globalThis._ = 99;\n${lykn(`(const _ 7) (console:log _)`, { strict: false })}`, "99\n");
  assertThrows(() => lykn(`(const _ 7)`), Error, "kernel-only form");
  for (const prefix of ["kernel:lambda", "kernel:class", "kernel:class-expr"]) {
    assertThrows(() => lykn(`(${prefix} () 1)`), Error, "unknown kernel form");
  }
});

Deno.test("S03 browser compilation and staged source facade share public behavior", async () => {
  const source = `
    (set-symbol! globalThis "_" 99)
    (kernel:function f (x _) (return _))
    (bind (array _ kept) #a(7 8))
    (try (throw #a(1)) (catch (array _) (void 0)))
    (kernel:function spread-count ((spread args)) (return args:length))
    (console:log (f 1 7) kept (spread-count 1 2 3))
  `;
  const publicOutput = "99 8 3\n";
  await executeModule(lykn(source), publicOutput);
  await executeModule(browserCompileLykn(source), publicOutput);

  const exportSource = `(export (bind visible (kernel:=> (_ value) value)))`;
  const compiled = lykn(exportSource);
  assertStringIncludes(compiled, "export");
  assertEquals(compiled.includes("discardValue__private"), false);
  const directory = await Deno.makeTempDir({ prefix: "lykn-s03-export-" });
  try {
    await Deno.writeTextFile(`${directory}/module.mjs`, compiled);
    await Deno.writeTextFile(
      `${directory}/runner.mjs`,
      `import { visible } from "./module.mjs"; console.log(visible(1, 12));\n`,
    );
    const result = await new Deno.Command(Deno.execPath(), {
      args: ["run", "--no-config", "--no-prompt", "--no-npm", "--cached-only", `${directory}/runner.mjs`],
      cwd: directory,
      stdout: "piped",
      stderr: "piped",
    }).output();
    assertEquals(result.code, 0, new TextDecoder().decode(result.stderr));
    assertEquals(new TextDecoder().decode(result.stderr), "");
    assertEquals(new TextDecoder().decode(result.stdout), "12\n");
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
});
