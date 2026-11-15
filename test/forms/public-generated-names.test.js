import {
  assertEquals,
  assertNotEquals,
  assertRejects,
  assertStringIncludes,
  assertThrows,
} from "jsr:@std/assert";
import { compile, compileExpr } from "lang/compiler.js";
import {
  compileWithHostInvocations,
  hostInvocationRequest,
  newHostInvocationId,
} from "lang/host-invocation.js";
import { compileLykn as browserCompileLykn } from "browser/compiler.js";
import {
  buildMultiClauseFunc,
  buildSingleClauseFunc,
  classifySurfaceForm,
  emitGenfuncMacro,
  emitMatchMacro,
  emitMatchStatementMacro,
  emitSurfaceForm,
  instrumentYields,
} from "lang/classifier.js";
import {
  createGeneratedNameAllocator,
  decodeIdentifierEscapes,
  emittedIdentifierKeys,
  physicalIdentifierKeys,
  toJsIdentifier,
  toJsIdentifierParts,
} from "lang/identifier.js";
import { lykn, read } from "lang/mod.js";
import {
  expandExpr,
  gensym,
  macroEnv,
  resetGensym,
  resetMacros,
} from "lang/expander-core.js";

function compileFresh(source) {
  resetGensym();
  return lykn(source);
}

async function executeModule(source, expected) {
  const directory = await Deno.makeTempDir({
    prefix: "lykn-public-generated-names-",
  });
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
    const stderr = new TextDecoder().decode(result.stderr);
    assertEquals(result.code, 0, stderr);
    assertEquals(stderr, "");
    assertEquals(new TextDecoder().decode(result.stdout), expected);
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
}

async function executeFailure(source, expectedClass, expectedMessage) {
  const directory = await Deno.makeTempDir({
    prefix: "lykn-public-generated-failure-",
  });
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
    assertNotEquals(result.code, 0, stderr);
    const actualClass = stderr.match(
      /Uncaught (?:\(in promise\) )?([A-Za-z_$][\w$]*):/,
    )?.[1];
    assertEquals(actualClass, expectedClass, stderr);
    assertStringIncludes(stderr, expectedMessage);
    assertEquals(stderr.includes("SyntaxError"), false, stderr);
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
}

async function executeNamespace(source) {
  const directory = await Deno.makeTempDir({
    prefix: "lykn-public-generated-namespace-",
  });
  const path = `${directory}/module.mjs`;
  try {
    await Deno.writeTextFile(path, `${source}\n`);
    return await import(`file://${path}`);
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
}

function findSavedCall(nodes) {
  for (const node of nodes) {
    if (node.type !== "list") continue;
    const values = node.values;
    if (
      values.length === 3 && values[0]?.value === "saved" &&
      values[1]?.value === "receiver" && values[2]?.value === "argv"
    ) return node;
    const found = findSavedCall(values);
    if (found) return found;
  }
  return null;
}

Deno.test("physical identifier keys and allocator handle normalization and Unicode boundaries", () => {
  assertEquals(toJsIdentifier("a-b"), "aB");
  assertEquals(toJsIdentifier("foo?bar"), "fooQMARKBar");
  assertEquals(toJsIdentifier("x!"), "x");
  assertEquals(toJsIdentifierParts("root:-member")[1], {
    name: "_member",
    private: true,
  });
  assertEquals(physicalIdentifierKeys("_v0.child").has("_v0"), true);
  assertEquals(physicalIdentifierKeys("_v0[_v1]").has("_v1"), true);
  assertEquals(physicalIdentifierKeys("_v0:\\u0063hild").has("child"), true);
  assertEquals(physicalIdentifierKeys("\\u005fv0").has("_v0"), true);
  assertEquals(physicalIdentifierKeys("\\u{5f}v0").has("_v0"), true);
  assertEquals(decodeIdentifierEscapes("\\uD835\\uDC9C"), "𝒜");
  assertEquals(physicalIdentifierKeys("\\uD835\\uDC9C").has("𝒜"), true);
  assertEquals([...physicalIdentifierKeys("a\\uFEFFb")].includes("ab"), false);
  assertEquals(physicalIdentifierKeys("a\\uFEFFb").has("a"), true);
  assertEquals(physicalIdentifierKeys("a\\uFEFFb").has("b"), true);
  for (
    const malformed of [
      "\\u",
      "\\u12xz",
      "\\u{110000}",
      "\\u{1f600",
      "\\u{1234567}",
      "\\u{x}",
    ]
  ) {
    assertEquals(decodeIdentifierEscapes(malformed), malformed, malformed);
  }
  const malformedRun = "\\u{".repeat(4096);
  assertEquals(decodeIdentifierEscapes(malformedRun), malformedRun);
  assertEquals(emittedIdentifierKeys("alreadyName").has("alreadyName"), true);
  assertEquals(emittedIdentifierKeys("a-b").has("a-b"), true);
  assertEquals(emittedIdentifierKeys("a-b").has("aB"), false);
  assertEquals(emittedIdentifierKeys("_v0.child").has("_v0"), true);
  assertEquals(physicalIdentifierKeys("t__gensym0").has("t__gensym0"), true);
  assertEquals(physicalIdentifierKeys("foo?bar").has("fooQMARKBar"), true);
  assertEquals(physicalIdentifierKeys("a-\\u0062").has("ab"), true);
  assertEquals(physicalIdentifierKeys("a-\\u0062").has("aB"), false);

  const leadingText = compile(read("(console:log ---gensym0.child)"));
  assertStringIncludes(leadingText, "___gensym0.child");
  const privateMember = compileExpr(read("root:-member")[0]);
  assertEquals(privateMember.property, {
    type: "PrivateIdentifier",
    name: "_member",
  });
  const computed = compileExpr(read("(get ---gensym0.child :free)")[0]);
  assertEquals(computed.type, "MemberExpression");
  assertEquals(computed.computed, true);
  assertEquals(computed.object.name, "___gensym0.child");
  assertEquals(compileExpr(read("a-\\u0062")[0]).name, "a\\u0062");

  const normalizedCollisionAtom = { type: "atom", value: "aB" };
  const nextAtom = { type: "atom", value: "fresh" };
  const candidates = [normalizedCollisionAtom, nextAtom];
  const normalizedCollision = createGeneratedNameAllocator(() =>
    candidates.shift()
  );
  normalizedCollision.reserveSyntax(read("a-b"));
  assertEquals(normalizedCollision.next("ignored"), nextAtom);
  const escapedEquivalent = { type: "atom", value: "\\u0061b" };
  const afterEscaped = { type: "atom", value: "elsewhere" };
  const escapedCandidates = [escapedEquivalent, afterEscaped];
  const escapedCollision = createGeneratedNameAllocator(() =>
    escapedCandidates.shift()
  );
  escapedCollision.reserveSyntax(read("ab"));
  assertEquals(escapedCollision.next("ignored"), afterEscaped);
  for (
    const [reservedSource, rejected] of [
      ["a-\\u0062", "ab"],
      ["ab", "a-\\u0062"],
    ]
  ) {
    const accepted = { type: "atom", value: "accepted" };
    const pair = [rejected, accepted];
    const pairAllocator = createGeneratedNameAllocator(() => pair.shift());
    pairAllocator.reserveSyntax(read(reservedSource));
    assertEquals(pairAllocator.next("ignored"), accepted, reservedSource);
  }

  const values = ["A", "\\u0041", "B"];
  const allocator = createGeneratedNameAllocator(() => values.shift());
  assertEquals(allocator.next("ignored"), "A");
  assertEquals(allocator.next("ignored"), "B");
  const occupied = createGeneratedNameAllocator(() => "\\u005fv0");
  occupied.reserveSyntax(read("_v0"));
  assertThrows(
    () => occupied.next("x"),
    Error,
    "repeated a rejected candidate",
  );
  const cycle = ["A", "B", "A"];
  let cycleCalls = 0;
  const cycling = createGeneratedNameAllocator(() => {
    cycleCalls++;
    return cycle.shift() ?? "tripwire";
  });
  cycling.reserveSyntax(read("A B"));
  assertThrows(() => cycling.next("x"), Error, "repeated a rejected candidate");
  assertEquals(cycleCalls, 3);
  assertThrows(
    () => createGeneratedNameAllocator(() => null).next("x"),
    TypeError,
  );
  assertEquals(compileExpr(read("a-b:foo?bar")[0]).object.name, "aB");

  const astFor = (head, source) => {
    const form = read(source)[0];
    return classifySurfaceForm(head, form.values.slice(1));
  };
  const surfaceCases = [
    astFor("reset!", "(reset! cell t__gensym0)"),
    astFor("set!", "(set! target:field t__gensym0)"),
    astFor("set-symbol!", "(set-symbol! target key t__gensym0)"),
    astFor("cell", "(cell t__gensym0)"),
    astFor("assoc", "(assoc source :field t__gensym0)"),
    astFor("obj", "(obj :field t__gensym0)"),
    astFor("exports", "(exports t__gensym0)"),
    astFor("->", "(-> source :t__gensym0)"),
    astFor("->>", "(->> source (:t__gensym0 1))"),
    astFor("some->", "(some-> source :t__gensym0)"),
    astFor("some->>", "(some->> source (:t__gensym0 1))"),
  ];
  for (const node of surfaceCases) {
    const candidateNames = ["t__gensym0", "t__gensym1"];
    const surfaceAllocator = createGeneratedNameAllocator((prefix) =>
      candidateNames.shift().replace("t__", `${prefix}__`)
    );
    surfaceAllocator.reserveSyntax(node);
    assertEquals(surfaceAllocator.next("t"), "t__gensym1", node.type);
  }
  const dataKeyword = createGeneratedNameAllocator(() => "t__gensym0");
  dataKeyword.reserveSyntax(read(':t__gensym0 "t__gensym0"'));
  assertEquals(dataKeyword.next("t"), "t__gensym0");
  const mutable = { child: { type: "atom", value: "first" } };
  const mutableNames = ["first", "second", "third"];
  const mutableAllocator = createGeneratedNameAllocator(() =>
    mutableNames.shift()
  );
  mutableAllocator.reserveSyntax(mutable);
  mutable.child = { type: "atom", value: "second" };
  mutableAllocator.reserveSyntax(mutable);
  assertEquals(mutableAllocator.next("x"), "third");
});

Deno.test("whole-source typed and recursive result storage preserves actual values", async () => {
  await executeModule(
    compileFresh(
      `(func collide :args (:number result__gensym0!) :returns :number :body 7)
    (console:log (collide 99))`,
    ),
    "7\n",
  );
  await executeModule(
    compileFresh(
      `(func identity :args (:number result__gensym0!) :returns :number
      :body result__gensym0!)
    (console:log (identity 99))`,
    ),
    "99\n",
  );
  await executeModule(
    compileFresh(`(func leaf :args ((array :number result__gensym0)) :returns :number
      :body (+ result__gensym0 1))
    (console:log (leaf (array 99)))`),
    "100\n",
  );
  await executeModule(
    compileFresh(`(bind result__gensym0 99)
    (func checked :args (:number value) :returns :number :body (+ value result__gensym0))
    (console:log (checked 1))`),
    "100\n",
  );
  await executeModule(
    compileFresh(`(func result__gensym0 :args (:number depth) :returns :number
      :body (if (= depth 0) 1 (+ 1 (result__gensym0 (- depth 1)))))
    (console:log (result__gensym0 3))`),
    "4\n",
  );
  await executeModule(
    compileFresh(`(func sibling :args () :returns :number :body result__gensym0)
    (bind result__gensym0 99)
    (console:log (sibling))`),
    "99\n",
  );
  await executeModule(
    compileFresh(
      `(func defaults :args ((object (default :number nested 7)))
      :returns :number :body nested)
    (console:log (defaults (obj)))`,
    ),
    "7\n",
  );
  await executeModule(
    compileFresh(`
    (set-symbol! globalThis "defaultCalls" 0)
    (func next-default :args () :body
      (set-symbol! globalThis "defaultCalls" (+ (get globalThis "defaultCalls") 1))
      5)
    (func defaults :args ((object (default :number result__gensym0 (next-default))))
      :returns :number :body result__gensym0)
    (console:log (defaults (obj)) (defaults (obj :result__gensym0 8)) (get globalThis "defaultCalls"))
  `),
    "5 8 1\n",
  );
  await executeModule(
    compileFresh(`
    (func outer :args () :returns :number :body
      (bind result__gensym0 99)
      (func inner :args () :returns :number :body (+ result__gensym0 1))
      (inner))
    (console:log (outer))
  `),
    "100\n",
  );
});

Deno.test("threading, discard, conditional and both Match producers avoid capture", async () => {
  await executeModule(
    compileFresh(`(set-symbol! globalThis "___gensym0" (obj :child (obj :drop 99 :keep 7)))
    (console:log (JSON:stringify (dissoc ---gensym0.child :drop)))`),
    '{"keep":7}\n',
  );
  await executeModule(
    compileFresh(`(set-symbol! globalThis "t__gensym0" 0)
    (console:log (some-> (obj :child (array (fn () 7))) :child[t__gensym0]))`),
    "7\n",
  );
  await executeModule(
    compileFresh(`(set-symbol! globalThis "t__gensym0" 0)
    (bind observed-index t__gensym0)
    (console:log (some-> (obj :child (array (fn () 7))) :child[t__gensym0]))`),
    "7\n",
  );
  await executeModule(
    compileFresh(`(set-symbol! globalThis "result__gensym0" 0)
    (func pick :args () :returns :number :body
      (some-> (obj :child (array (fn () 7))) :child[result__gensym0]))
    (console:log (pick))`),
    "7\n",
  );
  await executeModule(
    compileFresh(`(set-symbol! globalThis "t__gensym0" 0)
    (console:log (some-> (obj :child (array (fn () 7))) (:child[t__gensym0])))`),
    "7\n",
  );
  await executeModule(
    compileFresh(`(set-symbol! globalThis "rest__gensym1" (obj :child (obj :keep 7 :drop 99)))
    (console:log (JSON:stringify (dissoc rest__gensym1.child :drop)))`),
    '{"keep":7}\n',
  );
  for (const head of ["->", "->>"]) {
    await executeModule(
      compileFresh(`(set-symbol! globalThis "result__gensym0" 0)
      (func pick :args () :returns :number :body
        (${head} (obj :child (array (fn () 7))) :child[result__gensym0]))
      (console:log (pick))`),
      "7\n",
    );
  }
  await executeModule(
    compileFresh(`(bind t__gensym0 99)
    (console:log (some-> 7 (+ t__gensym0)))`),
    "106\n",
  );
  await executeModule(
    compileFresh(`(bind t__gensym0 99)
    (console:log (if-let (value t__gensym0) value 0))`),
    "99\n",
  );
  await executeModule(
    compileFresh(`(bind t__gensym0 99)
    (console:log (when-let (other t__gensym0) other))`),
    "99\n",
  );
  await executeModule(
    compileFresh(`(bind target__gensym0 99)
    (console:log (match target__gensym0 (value value)))`),
    "99\n",
  );
  await executeModule(
    compileFresh(`(bind calls (array))
    (bind t__gensym0 99)
    (console:log (some->> 7 (+ t__gensym0)))
    (console:log (JSON:stringify calls))`),
    "106\n[]\n",
  );
  await executeModule(
    compileFresh(`
    (set-symbol! globalThis "shortCircuits" 0)
    (func observe :args (:any value) :body
      (set-symbol! globalThis "shortCircuits" 1)
      value)
    (console:log (some-> null (observe)) (get globalThis "shortCircuits"))
  `),
    "null 0\n",
  );
  await executeModule(
    compileFresh(`
    (set-symbol! globalThis "statementResult" 0)
    (bind target__gensym0 99)
    (bind matched__gensym2 88)
    (func run :args () :body
      (match 1 (1 (set-symbol! globalThis "statementResult" (+ target__gensym0 matched__gensym2))))
      7)
    (run)
    (console:log (get globalThis "statementResult"))
  `),
    "187\n",
  );
  await executeModule(
    compileFresh(`(bind matched__gensym1 88)
    (bind trace (array))
    (match 1
      (value :when (do (trace:push "guard") true)
        (trace:push matched__gensym1)))
    (console:log (JSON:stringify trace))`),
    '["guard",88]\n',
  );
  await executeModule(
    compileFresh(`(bind record (obj :keep 7 :drop 99))
    (bind dropped (dissoc record :drop))
    (console:log dropped:keep dropped:drop)`),
    "7 undefined\n",
  );
});

Deno.test("overloads contracts and typed yields retain arguments values and timing", async () => {
  await executeModule(
    compileFresh(`(bind args__gensym0 99)
    (func choose (:args (:number value) :body (+ value args__gensym0))
               (:args (:string value) :body value))
    (console:log (choose 1) (choose "ok"))`),
    "100 ok\n",
  );
  await executeModule(
    compileFresh(
      `(func post-result :args (:number result__gensym0) :returns :number
      :post (= ~ result__gensym0) :body result__gensym0)
    (console:log (post-result 7))`,
    ),
    "7\n",
  );
  await executeModule(
    compileFresh(`(bind yv__gensym0 99)
    (genfunc values :args () :yields :number :body (yield yv__gensym0) (yield 7))
    (bind iterator (values))
    (console:log (get (iterator:next) "value") (get (iterator:next) "value"))`),
    "99 7\n",
  );
  await executeModule(
    compileFresh(`(bind yv__gensym0 99)
    (bind values (genfn () :yields :number (yield yv__gensym0)))
    (bind iterator (values))
    (console:log (get (iterator:next) "value"))`),
    "99\n",
  );
  await executeModule(
    compileFresh(`
    (bind args__gensym0 99)
    (func choose (:args (:number value) :post (= value 1) :body (+ value args__gensym0))
               (:args (:string value) :body value))
    (console:log (choose 1) (choose "ok"))
  `),
    "100 ok\n",
  );
  await executeFailure(
    compileFresh(`
    (func post-result :args (:number result__gensym0) :returns :number
      :post (= ~ result__gensym0) :body 7)
    (post-result 8)
  `),
    "Error",
    "post-condition failed",
  );
  await executeModule(
    compileFresh(`
    (set-symbol! globalThis "yieldCalls" 0)
    (bind yv__gensym0 99)
    (genfunc values :args () :yields :number :body
      (set-symbol! globalThis "yieldCalls" (+ (get globalThis "yieldCalls") 1))
      (yield yv__gensym0))
    (bind iterator (values))
    (console:log (get globalThis "yieldCalls"))
    (console:log (get (iterator:next) "value") (get globalThis "yieldCalls"))
  `),
    "0\n99 1\n",
  );
  await executeFailure(
    compileFresh(`
    (bind yv__gensym0 "wrong")
    (genfunc values :args () :yields :number :body (yield yv__gensym0))
    (bind iterator (values))
    (iterator:next)
  `),
    "TypeError",
    "expected number, got string",
  );
  const typeFailure = compileFresh('(throw (new TypeError "expected type"))');
  await executeFailure(typeFailure, "TypeError", "expected type");
  await assertRejects(
    () => executeFailure(typeFailure, "Error", "expected type"),
    Error,
  );
  const asyncFixture = await Deno.readTextFile(
    `${Deno.cwd()}/test/fixtures/async-expression-values/E3-promise-value.lykn`,
  );
  const asyncGenerated = compileFresh(`
    (bind order (array))
    (bind __lykn_value_box (obj :marker (do (order:push "outer") 42)))
    ${asyncFixture}
    (console:log __lykn_value_box:marker (JSON:stringify order))
  `);
  await executeModule(
    asyncGenerated,
    '{"same":true,"thenType":"function","resolved":9}\n42 ["outer"]\n',
  );
  const carrierGenerated = compile(read(`
    (const order (array))
    (const __lykn_value_box (object (marker (do (order:push "outer") 42))))
    (const original (Promise:resolve 9))
    (const result (do (await (Promise:resolve 0)) original))
    (console:log (=== result original) (typeof result:then) (await result)
      __lykn_value_box:marker (JSON:stringify order))
  `));
  assertStringIncludes(carrierGenerated, "__lykn_value_box[0]");
  await executeModule(carrierGenerated, 'true function 9 42 ["outer"]\n');
});

Deno.test("fragment and standalone ordinary-name builders own their inputs", async () => {
  resetGensym();
  const fragment = expandExpr(
    read(`(do
    (bind t__gensym0 99)
    (console:log (some-> 7 (+ t__gensym0))))`)[0],
  );
  await executeModule(compile([fragment]), "106\n");
  const helpers = {
    sym: (value) => ({ type: "atom", value }),
    array: (...values) => ({ type: "list", values }),
  };
  let injectedCalls = 0;
  const injectedNode = classifySurfaceForm(
    "some->",
    read("(some-> 7 (+ t__custom0))")[0].values.slice(1),
  );
  const injectedExpression = emitSurfaceForm(injectedNode, {
    ...helpers,
    gensym: (prefix) => {
      const name = `${prefix}__custom${injectedCalls}`;
      injectedCalls++;
      return helpers.sym(name);
    },
  });
  const injectedCall = read("(console:log nil)")[0];
  injectedCall.values[1] = injectedExpression;
  await executeModule(
    `const t__custom0 = 99;\n${compile([injectedCall])}`,
    "106\n",
  );
  assertEquals(injectedCalls, 2);

  assertEquals(
    emitSurfaceForm({ type: "Not", operand: read("ready")[0] }, helpers)
      .values[0].value,
    "!",
  );
  resetGensym();
  const single = buildSingleClauseFunc(
    "directSingle",
    read("directSingle")[0],
    read(
      ":args (:number result__gensym0) :returns :number :body (+ result__gensym0 1)",
    ),
  );
  resetGensym();
  const multi = buildMultiClauseFunc("one", read("one")[0], [
    read(
      "(:args (:number result__gensym0) :returns :number :body (+ result__gensym0 1))",
    )[0],
  ]);
  resetGensym();
  const match = emitMatchMacro(read("7 (name (+ name target__gensym0))"));
  const matchCall = {
    type: "list",
    values: [read("console:log")[0], match],
  };
  resetGensym();
  const yielded = instrumentYields(read("(yield 7)")[0], {
    type: "keyword",
    value: "number",
  }, "direct");
  assertEquals(yielded.values[0].value, "yield");
  resetGensym();
  const directGenfunc = emitGenfuncMacro(
    read("directGen :args () :yields :number :body (yield yv__gensym0)"),
  );
  resetGensym();
  const directInstrumented = instrumentYields(read("(yield yv__gensym0)")[0], {
    type: "keyword",
    value: "number",
  }, "directYield");
  const directGen = {
    type: "list",
    values: [
      { type: "atom", value: "function*" },
      { type: "atom", value: "directYield" },
      { type: "list", values: [] },
      directInstrumented,
    ],
  };
  const statementArgs = read(
    "1 (1 (console:log target__gensym0 matched__gensym2))",
  );
  resetGensym();
  const statementMatch = emitMatchStatementMacro(statementArgs, {
    expandValue: (form) => form,
    expandBody: (forms) => forms,
    env: {},
    extendEnv: () => ({}),
    typeContext: {},
  });
  await executeModule(
    `const yv__gensym0 = 99; const target__gensym0 = 99; const matched__gensym2 = 88;\n${
      compile([single, multi, directGenfunc, directGen, statementMatch])
    }\nconsole.log(directSingle(99), one(99));\n${
      compile([matchCall])
    }\nconst a = directGen(); console.log(a.next().value); const b = directYield(); console.log(b.next().value);`,
    "99 88\n100 100\n106\n99\n99\n",
  );

  let callbacks = 0;
  const malformed = {
    type: "Func",
    nameNode: read("f")[0],
    restArgs: [
      read("(:args ((default :any x 1)) :body x)")[0],
      read("(:args (:any y) :body y)")[0],
    ],
  };
  assertThrows(
    () =>
      emitSurfaceForm(malformed, {
        ...helpers,
        gensym: (prefix) => {
          callbacks++;
          return { type: "atom", value: `${prefix}__direct` };
        },
      }),
    Error,
    "top-level default or rest",
  );
  assertEquals(callbacks, 0);

  const earlySource = "(console:log (some-> 7 (+ 1)))";
  resetGensym();
  const earlyFirst = lykn(earlySource);
  resetGensym();
  const earlySecond = lykn(earlySource);
  assertEquals(earlySecond, earlyFirst);
  await executeModule(earlySecond, "8\n");

  resetGensym();
  assertEquals(gensym("probe").value, "probe__gensym0");
  assertEquals(gensym("probe").value, "probe__gensym1");
  resetGensym();
  assertEquals(gensym("probe").value, "probe__gensym0");

  resetGensym();
  macroEnv.set("s06-throws-after-allocation", () => {
    throw new Error("expected macro failure");
  });
  try {
    assertThrows(
      () => lykn("(some-> 7 (+ 1)) (s06-throws-after-allocation)"),
      Error,
      "expected macro failure",
    );
    assertEquals(gensym("probe").value, "probe__gensym1");
  } finally {
    macroEnv.delete("s06-throws-after-allocation");
  }

  resetGensym();
  const whole1 = lykn(`(bind t__gensym1 99) (console:log (some-> 7 (+ 1)))`);
  const isolatedFragment = expandExpr(
    read(`(console:log (some-> 7 (+ 1)))`)[0],
  );
  const fragmentCode = compile([isolatedFragment]);
  const whole2 = lykn(`(console:log (some-> 9 (+ 1)))`);
  assertStringIncludes(whole1, "t__gensym0");
  assertStringIncludes(fragmentCode, "t__gensym1");
  assertStringIncludes(whole2, "t__gensym2");
  assertEquals(gensym("probe").value, "probe__gensym3");
  await executeModule(whole1, "8\n");
  await executeModule(fragmentCode, "8\n");
  await executeModule(whole2, "10\n");
});

Deno.test("macro results reserve at barriers and nested public entries recover", async () => {
  resetGensym();
  resetMacros();
  let calls = 0;
  let innerModule;
  macroEnv.set("nested-generated", () => {
    calls++;
    innerModule = lykn("(console:log (some-> 7 (+ 1)))");
    return read(`(do (bind t__gensym1 99) (some-> 7 (+ t__gensym1)))`)[0];
  });
  try {
    const outerModule = lykn("(console:log (nested-generated))");
    assertStringIncludes(outerModule, "t__gensym2");
    assertEquals(calls, 1);
    await executeModule(innerModule, "8\n");
    await executeModule(outerModule, "106\n");
    const recovery = lykn("(console:log (some-> 9 (+ 1)))");
    assertStringIncludes(recovery, "t__gensym3");
    await executeModule(recovery, "10\n");
    assertEquals(gensym("probe").value, "probe__gensym4");
  } finally {
    resetMacros();
  }
});

Deno.test("late completion ICU and lazy invocation preserve private identities", async () => {
  await executeModule(
    compileFresh(`
    (set-symbol! globalThis "completionValue__gensym0" (obj :child 99))
    (func observe :args () :body
      (bind result (do (console:log "effect") completion-value__gensym0.child))
      result)
    (console:log (observe))
  `),
    "effect\n99\n",
  );
  await executeModule(
    compileFresh(`
    (set-symbol! globalThis "discardValue__gensym0" (obj :child 99))
    (func observe :args (:number _) :body discard-value__gensym0.child)
    (console:log (observe 7))
  `),
    "99\n",
  );
  await executeModule(
    compileFresh(`
    (set-symbol! globalThis "lyknIntrinsicNumberIsNaN0" (obj :child 99))
    (func observe :args (:number value) :returns :number
      :body (+ value lykn-intrinsic-number-is-na-n0.child))
    (console:log (observe 7))
  `),
    "106\n",
  );
  await executeModule(
    lykn(`(bind _v0 (obj :child 5))
    (console:log (template "{n, plural, one {one} other {# items}}" :n _v0.child))`),
    "5 items\n",
  );
  await executeModule(
    lykn(`(type Sample (Sample :number _))
    (bind result (Sample 7))
    (console:log (get result "_") (get (obj :_ 1) "_"))`),
    "7 1\n",
  );
  const forms = read(`(const receiver (object (base 10)))
    (const argv (array 4))
    (const calls (array))
    (function saved (value) (calls:push this:base) (return (+ this:base value)))
    (console:log (saved receiver argv))`);
  const anchor = findSavedCall(forms);
  if (!anchor) throw new Error("lazy fixture lost its exact saved-call anchor");
  const request = hostInvocationRequest(newHostInvocationId(), anchor);
  const output = compileWithHostInvocations(forms, compile, [request]);
  assertStringIncludes(output, "lyknHostReflectApply");
  await executeModule(output, "14\n");

  const rawLazy = read(`
    (= (get globalThis "lyknHostReflectApply0") (object (child 99)))
    (const receiver (object (base 10)))
    (const argv (array 4))
    (function saved (value) (return (+ this:base value lykn-host-reflect-apply0.child)))
    (console:log (saved receiver argv))
  `);
  const rawAnchor = findSavedCall(rawLazy);
  if (!rawAnchor) {
    throw new Error("raw lazy fixture lost its exact saved-call anchor");
  }
  const rawRequest = hostInvocationRequest(newHostInvocationId(), rawAnchor);
  const rawOutput = compileWithHostInvocations(rawLazy, compile, [rawRequest]);
  assertStringIncludes(rawOutput, "lyknHostReflectApply1");
  await executeModule(rawOutput, "113\n");

  const rawIcu = compile(read(`
    (const _v0 (object (child 5)))
    (console:log (template "{n, plural, one {one} other {# items}}" :n _v0.child))
  `));
  await executeModule(rawIcu, "5 items\n");

  const escapedRoot = "\\u005fv0.child";
  const escapedRawSource = `(const _v0 (object (child 5)))
    (console:log (template "{n, plural, one {one} other {# items}}" :n ${escapedRoot}))`;
  assertEquals(escapedRawSource.includes("\\u005f"), true);
  await executeModule(compile(read(escapedRawSource)), "5 items\n");

  const computedRaw = compile(read(`
    (const _v0 (array 5))
    (const _v1 0)
    (console:log (template "{n, plural, one {one} other {# items}}" :n _v0[_v1]))
  `));
  await executeModule(computedRaw, "5 items\n");

  const expanded = lykn(`
    (bind lyknHostReflectApply0 88)
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
    (console:log (ordered-discard))
  `);
  assertStringIncludes(expanded, "function lyknHostReflectApply1");
  await executeModule(
    expanded,
    '["get","arg1","arg2",["method",30,1,2]]\n',
  );
});

Deno.test("public browser and post-expansion transport keep output and namespace boundaries", async () => {
  const typedSource =
    `(func collide :args (:number result__gensym0!) :returns :number :body 7)
    (console:log (collide 99))`;
  const threadSource = `(bind t__gensym0 99)
    (console:log (some-> 7 (+ t__gensym0)))`;
  const icuSource = `(bind _v0 (obj :child 5))
    (console:log (template "{n, plural, one {one} other {# items}}" :n _v0.child))`;
  const rawIcuSource = `(const _v0 (object (child 5)))
    (console:log (template "{n, plural, one {one} other {# items}}" :n _v0.child))`;
  await executeModule(compileFresh(typedSource), "7\n");
  await executeModule(compileFresh(threadSource), "106\n");
  await executeModule(compile(read(rawIcuSource)), "5 items\n");
  resetGensym();
  await executeModule(browserCompileLykn(typedSource), "7\n");
  resetGensym();
  await executeModule(browserCompileLykn(threadSource), "106\n");
  resetGensym();
  await executeModule(browserCompileLykn(icuSource), "5 items\n");

  const forms = read(`(export (bind visible (obj :_ 7 :_value 8)))`);
  const expanded = forms.flatMap((form) => {
    const result = expandExpr(form);
    return Array.isArray(result) ? result : [result];
  });
  const roundTrip = JSON.parse(JSON.stringify(expanded));
  const transported = compile(roundTrip);
  const namespace = await executeNamespace(transported);
  assertEquals(namespace.visible._, 7);
  assertEquals(namespace.visible._value, 8);
  assertEquals(Object.keys(namespace), ["visible"]);
  assertStringIncludes(lykn("(console:log (obj :_ 7))"), "_: 7");
  assertEquals(physicalIdentifierKeys("_v0.child").has("_v0"), true);
});
