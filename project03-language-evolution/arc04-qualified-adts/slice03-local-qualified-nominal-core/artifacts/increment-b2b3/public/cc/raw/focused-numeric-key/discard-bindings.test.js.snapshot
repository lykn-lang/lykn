import {
  assertEquals,
  assertNotEquals,
  assertStringIncludes,
  assertThrows,
} from "jsr:@std/assert";
import { compileExpr, expand, expandExpr, lykn, read } from "lang/mod.js";
import { resetMacros } from "lang/expander.js";
import { compile } from "lang/compiler.js";
import { compileLykn as browserCompileLykn } from "browser/compiler.js";

async function executeModule(source, expected) {
  const directory = await Deno.makeTempDir({ prefix: "lykn-discard-public-" });
  const path = `${directory}/output.mjs`;
  try {
    await Deno.writeTextFile(path, `${source}\nexport {};\n`);
    const result = await new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "--no-config",
        "--no-prompt",
        "--no-npm",
        "--cached-only",
        path,
      ],
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

async function executeNamespace(source, consumer) {
  const directory = await Deno.makeTempDir({ prefix: "lykn-discard-export-" });
  try {
    await Deno.writeTextFile(`${directory}/module.mjs`, `${source}\n`);
    await Deno.writeTextFile(`${directory}/consumer.mjs`, `${consumer}\n`);
    const result = await new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "--no-config",
        "--no-prompt",
        "--no-npm",
        "--cached-only",
        `${directory}/consumer.mjs`,
      ],
      cwd: directory,
      stdout: "piped",
      stderr: "piped",
    }).output();
    return {
      code: result.code,
      stdout: new TextDecoder().decode(result.stdout),
      stderr: new TextDecoder().decode(result.stderr),
    };
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
}

async function executeFailure(source, expectedMessage) {
  const directory = await Deno.makeTempDir({ prefix: "lykn-discard-failure-" });
  const path = `${directory}/output.mjs`;
  try {
    await Deno.writeTextFile(path, `${source}\n`);
    const result = await new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "--no-config",
        "--no-prompt",
        "--no-npm",
        "--cached-only",
        path,
      ],
      cwd: directory,
      stdout: "piped",
      stderr: "piped",
    }).output();
    const stderr = new TextDecoder().decode(result.stderr);
    assertNotEquals(
      result.code,
      0,
      "invalid typed input unexpectedly succeeded",
    );
    assertStringIncludes(stderr, expectedMessage);
    return stderr;
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
}

Deno.test("public callable and Bind discards keep private identity", async () => {
  await executeModule(
    lykn(`
    (set-symbol! globalThis "_" 99)
    (func normal-value :args (:number _value) :body _value)
    (func named-discard :args (:any _) :body _)
    (func pair-discard :args (:any _ :any _) :body _)
    (bind lambda-discard (lambda (:any _) _))
    (bind fn-discard (fn ((array :number _)) _))
    (genfunc gen-discard :args (:any _) :yields :any :body (yield _))
    (bind genfn-discard (genfn (:any _) :yields :any (yield _)))
    (bind gen-iterator (gen-discard))
    (bind genfn-iterator (genfn-discard))
    (bind _ 7)
    (console:log (named-discard 1) (pair-discard 1 2) (lambda-discard 2) (fn-discard #a(3))
      (normal-value 7)
      (get (gen-iterator:next) "value") (get (genfn-iterator:next) "value"))
    (macro discardValue__private (value) \`(+ ,value 1))
    (bind generated-name (fn (:any _) (discardValue__private 7)))
    (bind generated-array-name (fn ((array :number _)) (discardValue__private 7)))
    (bind discardValue__gensym0 17)
    (console:log (generated-name 8) (+ discardValue__gensym0 _) (generated-array-name #a(8)))
  `),
    "99 99 99 99 7 99 99\n8 116 8\n",
  );
  resetMacros();
  await executeModule(
    lykn(`
    (macro discardValue__private (value) \`(+ ,value 1))
    (bind discardValue__private (fn (:number value) 27))
    (console:log (discardValue__private 1))
  `),
    "27\n",
  );
});

Deno.test("public discard guards, defaults, rests, and schema fields", async () => {
  await executeModule(
    lykn(`
    (set-symbol! globalThis "_" 99)
    (func accept-number :args (:number _) :body 1)
    (func accept-object :args ((object :number _)) :body 2)
    (func accept-array :args ((array :number _)) :body 3)
    (func nested-rest :args ((array :number first (rest :number _))) :body first)
    (func simple-rest :args ((rest :number _)) :body 4)
    (func multi-discard
      (:args (:number _) :body 6)
      (:args (:string _) :body 7))
    (bind default-count (cell 0))
    (func next-default :args () :body (reset! default-count (+ default-count:value 1)) 7)
    (func defaulted :args ((array (default :number _ (next-default)))) :body 5)
    (func default-global :args ((array (default :number _ _))) :body _)
    (func contract-global :args (:number _) :returns :number
      :pre (= _ 99) :post (= ~ 99) :body _)
    (type Sample (Sample :number _))
    (console:log (accept-number 8) (accept-object (obj :_ 8))
      (accept-array #a(8)) (nested-rest #a(1 2)) (simple-rest 1 2)
      (multi-discard 8) (multi-discard "text"))
    (console:log (defaulted #a(6)) default-count:value (defaulted #a()) default-count:value
      (default-global #a()) (contract-global 1))
    (console:log (get (Sample 7) "_") _)
  `),
    "1 2 3 1 4 6 7\n5 0 5 1 99 99\n7 99\n",
  );
  const badScalar = lykn(
    `(func accept-number :args (:number _) :body 1) (console:log (accept-number "bad"))`,
  );
  await executeFailure(badScalar, "arg '_' expected number, got string");
  const badObject = lykn(
    `(func accept-object :args ((object :number _)) :body 2) (console:log (accept-object (obj :_ "bad")))`,
  );
  await executeFailure(badObject, "arg '_' expected number, got string");
  const badRest = lykn(
    `(func nested-rest :args ((array :number first (rest :number _))) :body first) (console:log (nested-rest #a(1 "bad")))`,
  );
  await executeFailure(badRest, "rest arg '_' expected number, got string");
  const badSimpleRest = lykn(
    `(func simple-rest :args ((rest :number _)) :body 4) (console:log (simple-rest 1 "bad"))`,
  );
  await executeFailure(
    badSimpleRest,
    "rest arg '_' expected number, got string",
  );
  const badMulti = lykn(
    `(func choose (:args (:number _) :body 6) (:args (:string _) :body 7)) (console:log (choose NaN))`,
  );
  await executeFailure(badMulti, "expected number, got number");
  const throwingDefault = lykn(`
    (func explode-default :args () :body (throw (new Error "default boom")))
    (func defaulted :args ((array (default :number _ (explode-default)))) :body 5)
    (console:log (defaulted #a()))
  `);
  await executeFailure(throwingDefault, "default boom");
  await executeModule(
    lykn(`(bind :array (array first) #a(7)) (console:log first)`),
    "7\n",
  );
  assertThrows(
    () => lykn(`(bind :number (array first) input)`),
    Error,
  );
});

Deno.test("public typed Bind checks stay visible and preserve effects", async () => {
  await executeModule(
    lykn(`
    (bind calls (cell 0))
    (func next-seven :args () :body (reset! calls (+ calls:value 1)) 7)
    (func run :args () :body
      (bind :number answer (next-seven))
      (console:log answer calls:value)
      answer)
    (console:log (run))
    (func pair-check :args () :body
      (bind :number first (next-seven) :number second (next-seven))
      (console:log first second calls:value))
    (pair-check)
    (bind later-effects (cell 0))
    (func bad-value :args () :body (reset! calls (+ calls:value 1)) "bad")
    (func check-before-next :args () :body
      (bind :number first (bad-value) :number second (reset! later-effects 1))
      (console:log first second))
    (try (check-before-next) (catch problem (console:log calls:value later-effects:value)))
    (func guarded :args (:number input) :returns :number
      :pre (> input 0) :post (= ~ 7) :body 7)
    (console:log (guarded 2))
    (func early-transfer :args () :body
      (bind :number answer (do (return 41) 9))
      answer)
    (console:log (early-transfer))
    (bind getter-reads (cell 0))
    (bind getter-source (new Object))
    (Object:defineProperty getter-source "_"
      (obj :get (fn () (reset! getter-reads (+ getter-reads:value 1)) 7) :enumerable true))
    (func read-discard :args ((object :number _)) :body 1)
    (console:log (read-discard getter-source) getter-reads:value)
    (bind iterator-steps (cell 0))
    (bind iterator-value-reads (cell 0))
    (bind iterator-closes (cell 0))
    (bind iterator (obj))
    (bind iterator-result (obj :done false))
    (Object:defineProperty iterator-result "value"
      (obj :get (fn () (reset! iterator-value-reads (+ iterator-value-reads:value 1)) 7) :enumerable true))
    (Object:defineProperty iterator "next"
      (obj :value (fn ()
        (reset! iterator-steps (+ iterator-steps:value 1))
        (if (< iterator-steps:value 3) iterator-result (obj :done true)))))
    (Object:defineProperty iterator "return"
      (obj :value (fn () (reset! iterator-closes (+ iterator-closes:value 1)) (obj :done true))))
    (bind iterable (obj))
    (Object:defineProperty iterable Symbol:iterator (obj :value (fn () iterator)))
    (func bare-skip :args ((array _)) :body 2)
    (func typed-skip :args ((array :number _)) :body 3)
    (console:log (bare-skip iterable) iterator-value-reads:value iterator-closes:value)
    (reset! iterator-steps 0)
    (console:log (typed-skip iterable) iterator-value-reads:value iterator-closes:value)
    (reset! iterator-steps 0)
    (reset! iterator-value-reads 0)
    (reset! iterator-closes 0)
    (func bare-multiple-skip :args ((array _ _)) :body 4)
    (func typed-multiple-skip :args ((array :number _ :number _)) :body 5)
    (func bare-trailing-skip :args ((array _ _ _)) :body 6)
    (console:log (bare-multiple-skip iterable) iterator-steps:value iterator-value-reads:value iterator-closes:value)
    (reset! iterator-steps 0)
    (reset! iterator-value-reads 0)
    (reset! iterator-closes 0)
    (console:log (typed-multiple-skip iterable) iterator-steps:value iterator-value-reads:value iterator-closes:value)
    (reset! iterator-steps 0)
    (reset! iterator-value-reads 0)
    (reset! iterator-closes 0)
    (console:log (bare-trailing-skip iterable) iterator-steps:value iterator-value-reads:value iterator-closes:value)
    (bind target (obj :value 0))
    (kernel:= target:value 9)
    (kernel:= (array (get target "value")) #a(11))
    (console:log target:value)
  `),
    "7 1\n7\n7 7 3\n4 0\n7\n41\n1 1\n2 0 1\n3 1 2\n4 2 0 1\n5 2 2 1\n6 3 0 0\n11\n",
  );
  await executeModule(
    lykn(`
    (bind order (array))
    (func method-target :args (:any first :any second) :body
      (order:push (array "method" this:offset first second))
      0)
    (bind receiver (obj :offset 30))
    (Object:defineProperty receiver "run"
      (obj :get (fn () (order:push "get") method-target)))
    (func ordered-discard :args () :body
      (bind _ (receiver:run
        (do (order:push "arg1") 1)
        (do (order:push "arg2") 2)))
      (JSON:stringify order))
    (func ordered-stop :args () :body
      (bind _ (receiver:run
        (do (order:push "arg1") 1)
        (do (order:push "arg2") (return 41) 2)))
      99)
    (console:log (ordered-discard))
    (order:splice 0)
    (console:log (ordered-stop) (JSON:stringify order))
  `),
    '["get","arg1","arg2",["method",30,1,2]]\n41 ["get","arg1","arg2"]\n',
  );
  await executeModule(
    lykn(`(func discard-transfer :args () :body (bind _ (do (return 41) 9)) 99)
      (console:log (discard-transfer))`),
    "41\n",
  );
  const expanded = expandExpr(read("(bind :number answer input)")[0]);
  assertEquals(
    Array.isArray(expanded),
    true,
    "typed nonliteral Bind must expand as sibling declaration and check",
  );
  assertEquals(
    expanded.some((form) =>
      form?.values?.[0]?.value === "const" &&
      form.values[1]?.value === "answer"
    ),
    true,
    "typed nonliteral Bind must leave its named declaration in the outer scope",
  );
  assertEquals(
    expanded.some((form) => form?.values?.[0]?.value === "if"),
    true,
    "typed nonliteral Bind must retain an emitted runtime guard",
  );
});

Deno.test("public source inline exports expose only source bindings", async () => {
  const empty = lykn("(export (bind _ 7))");
  assertStringIncludes(empty, "export {");
  const emptyRun = await executeNamespace(
    empty,
    `import * as values from "./module.mjs"; console.log(JSON.stringify(Object.keys(values)));`,
  );
  assertEquals(emptyRun.code, 0, emptyRun.stderr);
  assertEquals(emptyRun.stdout, "[]\n");

  const mixed = lykn(`
    (bind calls (cell 0))
    (export (bind _ (reset! calls (+ calls:value 1)) :number visible 7))
    (console:log calls:value)
  `);
  const mixedRun = await executeNamespace(
    mixed,
    `import * as values from "./module.mjs"; console.log(JSON.stringify(Object.keys(values))); console.log(values.visible);`,
  );
  assertEquals(mixedRun.code, 0, mixedRun.stderr);
  assertEquals(mixedRun.stdout, '1\n["visible"]\n7\n');

  const spreadExport = lykn(
    `(export (bind (array first (spread tail)) #a(5 6 7)))`,
  );
  const spreadExportRun = await executeNamespace(
    spreadExport,
    `import * as values from "./module.mjs"; console.log(JSON.stringify(Object.keys(values))); console.log(values.first, JSON.stringify(values.tail));`,
  );
  assertEquals(spreadExportRun.code, 0, spreadExportRun.stderr);
  assertEquals(spreadExportRun.stdout, '["first","tail"]\n5 [6,7]\n');

  const bad = lykn(`(bind input "bad") (export (bind :number visible input))`);
  const badRun = await executeNamespace(
    bad,
    `import * as values from "./module.mjs"; console.log(values.visible);`,
  );
  assertNotEquals(badRun.code, 0);
  assertStringIncludes(badRun.stderr, "TypeError");
  assertEquals(badRun.stderr.includes("SyntaxError"), false);
  assertThrows(
    () => lykn(`(export (bind visible 1) extra)`),
    Error,
    "export: unrecognized form",
  );

  await executeModule(
    lykn(`
    (macro export (value) \`(console:log ,value))
    (export 41)
  `),
    "41\n",
  );
});

Deno.test("public binding patterns preserve spread, keys, assignment, and legacy catch", async () => {
  await executeModule(
    lykn(`
    (bind source (object ("first-name" 17) ("0" 23) (:normalized-key 31)))
    (bind (object (alias "first-name" hyphen) (alias "0" zero) (alias normalized-key normalized)) source)
    (bind (array first (spread tail)) #a(5 6 7))
    (bind target (obj :value 0))
    (kernel:= (array (get target "value")) #a(8))
    (kernel:= target:value 9)
    (bind value-copy (object (spread (obj :source 23))))
    (bind values #a((fn (:number input) (+ input 1))))
    (bind (array (spread (object (alias "0" array)))) values)
    (console:log hyphen zero normalized first (get tail "0") target:value value-copy:source (array 7))
  `),
    "17 23 31 5 6 9 23 8\n",
  );
  await executeModule(
    lykn(`
      (bind source (object ("-1" 31)))
      (bind (object (alias -1 negative)) source)
      (console:log negative)
    `),
    "31\n",
  );

  await executeModule(
    `const errorValue = { default: value => value + 1 };\n${
      lykn(
        `(try (throw errorValue) (catch (object (default array)) (console:log (array 7))))`,
      )
    }`,
    "8\n",
  );
  await executeModule(
    `const errorValue = { entry: value => value + 1 };\n${
      lykn(
        `(try (throw errorValue) (catch (object (entry caught)) (console:log (caught 7))))`,
      )
    }`,
    "8\n",
  );
  assertThrows(
    () =>
      lykn(
        `(bind (object (alias "value" repeated)) source (object (default repeated 2)) source2)`,
      ),
    Error,
    "more than once",
  );
  assertThrows(
    () =>
      lykn(
        `(bind (array (spread (object (alias "0" repeated)))) values (array repeated) other)`,
      ),
    Error,
    "more than once",
  );
  assertThrows(
    () => lykn(`(bind (array (spread (object (alias "0" class)))) values)`),
    Error,
    "reserved",
  );
  assertThrows(
    () => lykn(`(bind (object (default _ 7 8)) input)`),
    Error,
  );
  assertThrows(
    () =>
      lykn(
        `(bind (array (spread (object (default value (fn (:any if) 1))))) input)`,
      ),
    Error,
    "reserved word",
  );
});

Deno.test("public finalized JSON and fragments retain independent private state", async () => {
  const source = `(func calculate :args (:number _) :body 7)
     (func pick :args ((array :number first :number _)) :body first)
     (console:log (calculate 4) (pick #a(8 9)))`;
  const expanded = expand(read(source));
  const roundTrip = JSON.parse(JSON.stringify(expanded));
  await executeModule(compile(roundTrip), "7 8\n");
  assertThrows(() => lykn(`(func malformed :args (:number) :body 1)`), Error);
  const recovered = lykn(
    `(func good :args (:number _) :body 7) (console:log (good 4))`,
  );
  await executeModule(recovered, "7\n");
  const fragment = expandExpr(read("(fn (:any value) 7)")[0]);
  const compiledFragment = compileExpr(fragment);
  assertEquals(compiledFragment.type, "ArrowFunctionExpression");
});

Deno.test("public browser delivery executes discard and nested rest behavior", async () => {
  await executeModule(
    browserCompileLykn(`
    (set-symbol! globalThis "_" 99)
    (func return-global :args (:number _) :body _)
    (func nested :args ((array :number first (rest :number _))) :body first)
    (func bind-value :args () :body (bind :number answer (+ 3 4)) answer)
    (console:log (return-global 7) (nested #a(1 2)) (bind-value))
  `),
    "99 1 7\n",
  );
  const bad = browserCompileLykn(
    `(func nested :args ((array :number first (rest :number _))) :body first) (console:log (nested #a(1 "bad")))`,
  );
  await executeFailure(bad, "rest arg '_' expected number, got string");
});
