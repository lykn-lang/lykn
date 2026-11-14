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

async function executeFailure(source, expectedMessage, expectedClass = "Error") {
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
    const stderr = new TextDecoder().decode(result.stderr);
    assertStringIncludes(stderr, `${expectedClass}:`);
    assertStringIncludes(stderr, expectedMessage);
    assertEquals(stderr.includes("SyntaxError"), false, stderr);
    assertEquals(stderr.includes("arg 'discardValue__"), false, stderr);
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
    (kernel:for
      (kernel:let (array _ i)
        (do (set-symbol! globalThis "numericInitCalls" (+ (?? (get globalThis "numericInitCalls") 0) 1)) #a(7 0)))
      (< i 1) (kernel:++ i) (break))
    (console:log (get globalThis "numericInitCalls"))
  `), "99 7 1\n1\n2\n1\n");

  await executeFailure(lykn(`
    (set-symbol! globalThis "_" 99)
    (bind async (fn (:any callback) (callback "bad")))
    (for (async (lambda (:number _) _)) false () (break))
  `), "arg '_' expected number, got string", "TypeError");

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
    (bind ExpressionClass (class-expr ()
      (constructor (_) (assign this:value _))
      (method (_) (return _))))
    (bind expression-instance (new ExpressionClass 7))
    (bind typed-lambda (lambda (:any _) _))
    (bind async-arrow (async (kernel:=> (_ _value) _)))
    (bind async-function (async (kernel:function async-func (_ value) (return value))) )
    (kernel:function* gen (x _) (set-symbol! globalThis "genAdvances" 1) (yield _))
    (bind iterator (gen 1 7))
    (bind anonymous-gen (kernel:function* (x _) (yield _)))
    (bind anonymous-iterator (anonymous-gen 1 7))
    (bind sentinel-gen (kernel:function* "" (_) (yield _)))
    (bind sentinel-iterator (sentinel-gen 7))
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
    (console:log (get (sentinel-iterator:next) "value") sentinel-gen:length)
    (set! slots:value 7)
    (console:log slots:stored (Slots:static-value 1) (slots:method 1 7)
      (callable-object:run 1 7))
    (console:log (await (slots:async-value 1 7)))
    (console:log (await (async-function 1 7)) (await (async-arrow 1 7)))
    (console:log (expression-instance:method 1) expression-instance:value)
    (bind lazy-default (kernel:function with-default ((default x (set-symbol! globalThis "defaultCalls" (+ (?? (get globalThis "defaultCalls") 0) 1)))) (return x)))
    (console:log (lazy-default 5) (?? (get globalThis "defaultCalls") 0))
    (console:log (lazy-default undefined) (get globalThis "defaultCalls"))
  `), "7 7 7 2 2 2 0\n99 99 1 99\n1 0\n99 1 1\n99 1\n99 99 7 7\n99\n7 99\n99 99\n5 0\n1 1\n");
  await executeFailure(lykn(`
    (kernel:function throw-default-error () (throw (new Error "default boom")))
    (kernel:function throw-default ((default x (throw-default-error))) (return x))
    (throw-default)
  `), "default boom", "Error");

  const asyncTyped = `
    (set-symbol! globalThis "_" 99)
    (bind callback (async (lambda ((object :number _)) _)))
    (console:log (await (callback (kernel:object ("_" 7)))))
  `;
  await executeModule(lykn(asyncTyped), "99\n");
  await executeModule(browserCompileLykn(asyncTyped), "99\n");
  for (const compileSource of [lykn, browserCompileLykn]) {
    await executeFailure(compileSource(`
      (bind callback (async (lambda ((object :number _)) _)))
      (await (callback (kernel:object ("_" "bad"))))
    `), "arg '_' expected number, got string", "TypeError");
    await executeFailure(compileSource(`
      (bind callback (async (lambda (:number _) _)))
      (await (callback "bad"))
    `), "arg '_' expected number, got string", "TypeError");
  }

  resetMacros();
  let defaultExpansions = 0;
  macroEnv.set("generator-fallback", () => {
    defaultExpansions++;
    return read("(generatorFallback)")[0];
  });
  try {
    const sentinelHead = lykn(`
      (set-symbol! globalThis "generatorFallbackCalls" 0)
      (set-symbol! globalThis "generatorFallback"
        (kernel:=> ()
          (do (set-symbol! globalThis "generatorFallbackCalls"
                (+ (get globalThis "generatorFallbackCalls") 1))
              (kernel:=> (x) (+ x 2)))))
      (bind sentinel-head
        (kernel:function* "" ((default array (generator-fallback)))
          (yield (array 7))))
      (bind supplied (sentinel-head (kernel:=> (x) (+ x 1))))
      (bind fallback (sentinel-head))
      (console:log (get (supplied:next) "value") (get (fallback:next) "value")
        (get globalThis "generatorFallbackCalls"))
    `);
    assertEquals(defaultExpansions, 1);
    await executeModule(sentinelHead, "8 9 1\n");
  } finally {
    resetMacros();
  }
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
    (kernel:function spread-callable ((spread (object (alias "0" array)))) (return (array 7)))
    (console:log _ (spreader 1 2) (form-shadow (kernel:=> (x) (+ x 1)))
      (spread-callable (kernel:=> (x) (+ x 1))))
  `), "99 2 2 8\n");
  assertThrows(
    () => lykn(`(kernel:function reserved-spread ((spread eval)) (return eval))`),
    Error,
    "forbidden as a strict-mode binding identifier",
  );

  resetMacros();
  let fallbackExpansions = 0;
  macroEnv.set("fallback-macro", () => {
    fallbackExpansions++;
    return read("(spreadFallback)")[0];
  });
  try {
    const source = lykn(`
      (set-symbol! globalThis "spreadFallbackCalls" 0)
      (set-symbol! globalThis "spreadFallback"
        (kernel:=> ()
          (do (set-symbol! globalThis "spreadFallbackCalls"
                (+ (get globalThis "spreadFallbackCalls") 1))
              (kernel:=> (x) (+ x 2)))))
      (kernel:function nested-spread ((spread (array (default array (fallback-macro)))))
        (return (array 7)))
      (console:log (nested-spread (kernel:=> (x) (+ x 1)))
        (nested-spread) (get globalThis "spreadFallbackCalls"))
    `);
    assertEquals(fallbackExpansions, 1);
    await executeModule(source, "8 9 1\n");
  } finally {
    resetMacros();
  }
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

  await executeModule(`
    globalThis._ = 99;
    globalThis.groupReads = 0;
    globalThis.groupFallbacks = 0;
    globalThis.groupInitializers = 0;
    globalThis.groupSource = {};
    Object.defineProperty(groupSource, "entry", {
      get() { groupReads++; return [undefined, 2, 3]; },
    });
    globalThis.groupFallback = () => { groupFallbacks++; return 7; };
    ${lykn(`
      (bind (object (alias "entry" (array (default _ (groupFallback)) (rest _)))) groupSource
            (array _) (do (set-symbol! globalThis "groupInitializers"
              (+ groupInitializers 1)) #a(4)))
      (console:log _ groupReads groupFallbacks groupInitializers)
    `)}
  `, "99 1 1 1\n");

  const grouped = read(`(bind
    (object (alias pipe|key _) (alias :keyword|key _) (alias "string-key" _)
            (alias -1 _) (alias default-key (default _ (rhs)))) source
    (array _) #a(7))`)[0];
  const atomKey = grouped.values[1].values[1].values[1];
  const metadata = { origin: "classification witness" };
  atomKey.span = { start: 4, end: 12 };
  atomKey.metadata = metadata;
  const classified = classifySurfaceForm("bind", grouped.values.slice(1));
  assertEquals(classified.type, "BindGroup");
  const classifiedPattern = classified.bindings[0].nameNode;
  const normalizedAtom = classifiedPattern.values[1].values[1];
  const normalizedKeyword = classifiedPattern.values[2].values[1];
  assertEquals(normalizedAtom.type, "string");
  assertEquals(normalizedAtom.value, "pipe|key");
  assertEquals(normalizedAtom.span, { start: 4, end: 12 });
  assertEquals(normalizedAtom.metadata, metadata);
  assertEquals(normalizedKeyword.type, "string");
  assertEquals(normalizedKeyword.value, "keyword|key");
  assertEquals(classifiedPattern.values[3].values[1].type, "string");
  assertEquals(classifiedPattern.values[3].values[1].value, "string-key");
  assertEquals(classifiedPattern.values[4].values[1].type, "number");
  const rhs = grouped.values[1].values[5].values[2].values[2];
  assertEquals(classifiedPattern.values[5].values[2].values[2], rhs);
  const namedGroup = classifySurfaceForm("bind", read("(bind visible 1 other 2)")[0].values.slice(1));
  assertEquals(namedGroup.bindings[0].nameNode.value, "visible");
  assertEquals(classifySurfaceForm("bind", read("(bind (object (alias café _)) source)")[0].values.slice(1)).type, "Bind");
  assertEquals(compile([read("(function raw (x _) (return _))")[0]]).includes("function raw"), true);
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
    "TypeError",
  );

  const rawFragment = read(`(kernel:function fragment-value (x _) (return _))`)[0];
  const preparedFragment = expandExpr(rawFragment);
  const compiledFragment = compile([preparedFragment]);
  assertEquals(compiledFragment.includes("discardValue__private"), false);
  await executeModule(`globalThis._ = 99;\n${compiledFragment}\nconsole.log(fragmentValue(1, 7));`, "99\n");
  assertThrows(
    () => expandExpr(read(`(kernel:=> (x _) (kernel:unsupported 1))`)[0]),
    Error,
    "unknown kernel form",
  );
  const recoveredWhole = lykn(`(kernel:function recovered-whole (x _) (return _))`);
  assertEquals(recoveredWhole.includes("discardValue__private"), false);
  await executeModule(`globalThis._ = 99;\n${recoveredWhole}\nconsole.log(recoveredWhole(1, 7));`, "99\n");
  const recoveredFragment = expandExpr(read(`(kernel:function recovered-fragment (x _) (return _))`)[0]);
  const recoveredCode = compile([recoveredFragment]);
  assertEquals(recoveredCode.includes("discardValue__private"), false);
  await executeModule(`globalThis._ = 99;\n${recoveredCode}\nconsole.log(recoveredFragment(1, 7));`, "99\n");

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

  const exportSource = `
    (set-symbol! globalThis "_" 99)
    (export (bind _ 7 visible (kernel:=> (_value _) (array _value _))))
  `;
  for (const compileSource of [lykn, browserCompileLykn]) {
    const compiled = compileSource(exportSource);
    assertStringIncludes(compiled, "export");
    assertEquals(compiled.includes("discardValue__private"), false);
    const directory = await Deno.makeTempDir({ prefix: "lykn-s03-export-" });
    try {
      await Deno.writeTextFile(`${directory}/module.mjs`, compiled);
      await Deno.writeTextFile(
        `${directory}/runner.mjs`,
        `import * as values from "./module.mjs"; console.log(JSON.stringify(Object.keys(values))); console.log(JSON.stringify(values.visible(12, 7)));\n`,
      );
      const result = await new Deno.Command(Deno.execPath(), {
        args: ["run", "--no-config", "--no-prompt", "--no-npm", "--cached-only", `${directory}/runner.mjs`],
        cwd: directory,
        stdout: "piped",
        stderr: "piped",
      }).output();
      assertEquals(result.code, 0, new TextDecoder().decode(result.stderr));
      assertEquals(new TextDecoder().decode(result.stderr), "");
      assertEquals(new TextDecoder().decode(result.stdout), '["visible"]\n[12,99]\n');
    } finally {
      await Deno.remove(directory, { recursive: true });
    }
  }
});
