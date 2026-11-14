import {
  assertEquals,
  assertNotEquals,
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
  emitMatchMacro,
  emitSurfaceForm,
  instrumentYields,
} from "lang/classifier.js";
import {
  createGeneratedNameAllocator,
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
  for (
    const spelling of ["\\u005fv0", "\\u{5f}v0", "\\uD83D\\uDE00", "a\\uFEFFb"]
  ) {
    assertEquals(physicalIdentifierKeys(spelling).size > 0, true, spelling);
  }
  for (const malformed of ["\\u", "\\u12xz", "\\u{110000}", "\\u{1f600"]) {
    assertEquals(physicalIdentifierKeys(malformed).size > 0, true, malformed);
  }
  assertEquals(emittedIdentifierKeys("alreadyName").has("alreadyName"), true);
  assertEquals(emittedIdentifierKeys("_v0.child").has("_v0"), true);
  assertEquals(physicalIdentifierKeys("t__gensym0").has("t__gensym0"), true);
  assertEquals(physicalIdentifierKeys("foo?bar").has("fooQMARKBar"), true);

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
  assertThrows(
    () => createGeneratedNameAllocator(() => null).next("x"),
    TypeError,
  );
  assertEquals(compileExpr(read("a-b:foo?bar")[0]).object.name, "aB");
});

Deno.test("whole-source typed and recursive result storage preserves actual values", async () => {
  await executeModule(
    lykn(
      `(func collide :args (:number result__gensym0!) :returns :number :body 7)
    (console:log (collide 99))`,
    ),
    "7\n",
  );
  await executeModule(
    lykn(`(func identity :args (:number result__gensym0!) :returns :number
      :body result__gensym0!)
    (console:log (identity 99))`),
    "99\n",
  );
  await executeModule(
    lykn(`(bind result0 99)
    (func checked :args (:number value) :returns :number :body (+ value result0))
    (console:log (checked 1))`),
    "100\n",
  );
  await executeModule(
    lykn(`(func recursive :args (:number result0) :returns :number
      :body (if (= result0 0) 1 (+ 1 (recursive (- result0 1)))))
    (console:log (recursive 3))`),
    "4\n",
  );
  await executeModule(
    lykn(`(func sibling :args () :returns :number :body result__gensym0)
    (bind result__gensym0 99)
    (console:log (sibling))`),
    "99\n",
  );
  await executeModule(
    lykn(
      `(func defaults :args ((object (default :number nested 7)))
      :returns :number :body nested)
    (console:log (defaults (obj)))`,
    ),
    "7\n",
  );
});

Deno.test("threading, discard, conditional and both Match producers avoid capture", async () => {
  resetGensym();
  await executeModule(
    lykn(`(bind t__gensym0 99)
    (console:log (some-> 7 (+ t__gensym0)))`),
    "106\n",
  );
  await executeModule(
    lykn(`(bind t__gensym0 99)
    (console:log (if-let (value t__gensym0) value 0))
    (console:log (when-let (other t__gensym0) other))`),
    "99\n99\n",
  );
  await executeModule(
    lykn(`(bind target__gensym0 99)
    (console:log (match target__gensym0 (value value)))`),
    "99\n",
  );
  await executeModule(
    lykn(`(bind calls (array))
    (bind t__gensym0 99)
    (console:log (some->> 7 (+ t__gensym0)))
    (console:log (JSON:stringify calls))`),
    "106\n[]\n",
  );
  await executeModule(
    lykn(`(bind record (obj :keep 7 :drop 99))
    (bind dropped (dissoc record :drop))
    (console:log dropped:keep dropped:drop)`),
    "7 undefined\n",
  );
});

Deno.test("overloads contracts and typed yields retain arguments values and timing", async () => {
  await executeModule(
    lykn(`(bind args__gensym0 99)
    (func choose (:args (:number value) :body (+ value args__gensym0))
               (:args (:string value) :body value))
    (console:log (choose 1) (choose "ok"))`),
    "100 ok\n",
  );
  await executeModule(
    lykn(`(func post-result :args (:number result0) :returns :number
      :post (= ~ result0) :body result0)
    (console:log (post-result 7))`),
    "7\n",
  );
  await executeModule(
    lykn(`(bind yv__gensym0 99)
    (genfunc values :args () :yields :number :body (yield yv__gensym0) (yield 7))
    (bind iterator (values))
    (console:log (get (iterator:next) "value") (get (iterator:next) "value"))`),
    "99 7\n",
  );
  await executeModule(
    lykn(`(bind yv__gensym0 99)
    (bind values (genfn () :yields :number (yield yv__gensym0)))
    (bind iterator (values))
    (console:log (get (iterator:next) "value"))`),
    "99\n",
  );
});

Deno.test("fragment and standalone ordinary-name builders own their inputs", async () => {
  resetGensym();
  const fragment = expandExpr(read("(some-> 7 (+ result__gensym0))")[0]);
  assertStringIncludes(compile([fragment]), "result__gensym0");
  const helpers = {
    sym: (value) => ({ type: "atom", value }),
    array: (...values) => ({ type: "list", values }),
  };
  assertEquals(
    emitSurfaceForm({ type: "Not", operand: read("ready")[0] }, helpers)
      .values[0].value,
    "!",
  );
  const single = buildSingleClauseFunc(
    "direct",
    read("direct")[0],
    read(":args () :returns :number :body 7"),
  );
  const multi = buildMultiClauseFunc("one", read("one")[0], [
    read("(:args () :body 8)")[0],
  ]);
  const match = emitMatchMacro(read("7 (name name)"));
  const matchCall = {
    type: "list",
    values: [read("console:log")[0], match],
  };
  const yielded = instrumentYields(read("(yield 7)")[0], {
    type: "keyword",
    value: "number",
  }, "direct");
  assertEquals(yielded.values[0].value, "yield");
  await executeModule(
    `${compile([single, multi])}\nconsole.log(direct(), one());\n${
      compile([matchCall])
    }`,
    "7 8\n7\n",
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
  resetGensym();
  assertEquals(gensym("probe").value, "probe__gensym0");
  assertEquals(gensym("probe").value, "probe__gensym1");
  resetGensym();
  assertEquals(gensym("probe").value, "probe__gensym0");
});

Deno.test("macro results reserve at barriers and nested public entries recover", async () => {
  resetGensym();
  resetMacros();
  let calls = 0;
  macroEnv.set("nested-generated", () => {
    calls++;
    const inner = expandExpr(read("(some-> 7 (+ t__gensym0))")[0]);
    assertEquals(inner.type, "list");
    return read("(some-> 7 (+ t__gensym0))")[0];
  });
  try {
    await executeModule(
      lykn(`(bind t__gensym0 99)
      (console:log (some-> 7 (+ t__gensym0)))
      (console:log (nested-generated))`),
      "106\n106\n",
    );
    assertEquals(calls, 1);
    assertEquals(lykn("(console:log 1)"), lykn("(console:log 1)"));
  } finally {
    resetMacros();
  }
});

Deno.test("late completion ICU and lazy invocation preserve private identities", async () => {
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
  const source = `(bind _v0 (obj :child 5))
    (console:log (template "{n, plural, one {one} other {# items}}" :n _v0.child))`;
  await executeModule(browserCompileLykn(source), "5 items\n");
  const expanded = expandExpr(read("(bind data (obj :_ 7))")[0]);
  const roundTrip = JSON.parse(JSON.stringify(expanded));
  assertEquals(compile([roundTrip]).includes("data"), true);
  assertStringIncludes(lykn("(console:log (obj :_ 7))"), "_: 7");
  assertNotEquals(physicalIdentifierKeys("_v0.child").size, 0);
});
