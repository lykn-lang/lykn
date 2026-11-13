import {
  assertEquals,
  assertNotEquals,
  assertStringIncludes,
  assertThrows,
} from "jsr:@std/assert";
import { compileExpr, expandExpr, lykn, read } from "lang/mod.js";
import { compile } from "lang/compiler.js";
import {
  compileWithHostInvocations,
  hostInvocationRequest,
  newHostInvocationId,
} from "lang/host-invocation.js";
import { compileLykn as browserCompileLykn } from "browser/compiler.js";

async function executeModule(source, expected) {
  const directory = await Deno.makeTempDir({ prefix: "lykn-icu-generated-" });
  const path = `${directory}/output.mjs`;
  try {
    await Deno.writeTextFile(path, `${source}\nexport {};\n`);
    const result = await new Deno.Command(Deno.execPath(), {
      args: ["run", "--no-config", "--no-prompt", "--no-npm", "--cached-only", path],
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
      values.length === 3 && values[0].type === "atom" && values[0].value === "saved" &&
      values[1].type === "atom" && values[1].value === "receiver" &&
      values[2].type === "atom" && values[2].value === "_n"
    ) return node;
    const found = findSavedCall(values);
    if (found) return found;
  }
  return null;
}

function collectIdentifiers(node, names = new Set(), seen = new WeakSet()) {
  if (!node || typeof node !== "object" || seen.has(node)) return names;
  seen.add(node);
  if (node.type === "Identifier") {
    names.add(node.name);
    return names;
  }
  if (node.type === "Literal") return names;
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      for (const child of value) collectIdentifiers(child, names, seen);
    } else if (value && typeof value === "object") {
      collectIdentifiers(value, names, seen);
    }
  }
  return names;
}

Deno.test("public ICU hoists reserve compiled source identifiers", async () => {
  await executeModule(lykn(`
    (bind _n 2)
    (console:log (template "{n} {n}" :n (+ _n 1)))
  `), "3 3\n");

  await executeModule(lykn(`
    (bind _n 8)
    (console:log (template "{n} {n}" :n (+ _n! 1)))
  `), "9 9\n");

  await executeModule(lykn(`
    (bind _n (object (value 4)))
    (console:log (template "{n} {n}" :n (+ _n:value 1)))
  `), "5 5\n");

  await executeModule(lykn(`
    (bind _n 1)
    (bind _n__lyknGenerated0 6)
    (console:log (template "{n} {n}" :n (+ _n _n__lyknGenerated0)))
  `), "7 7\n");

  await executeModule(lykn(`
    (bind left 10)
    (bind right 30)
    (console:log (template "{a-b}|{a-b}|{aB}|{aB}" :a-b (+ left 1) :aB (+ right 10)))
  `), "11|11|40|40\n");
});

Deno.test("public ICU selectors and hoists share one generated-name set", async () => {
  await executeModule(lykn(`
    (bind _v0 2)
    (console:log (template "{n, plural, one {one} other {#}}" :n _v0))
    (console:log (template "{n, plural, one {{v0} {v0}} other {{v0} {v0}}}" :n 2 :v0 (+ 3 4)))
    (console:log (template "{x}-{x}" :x (template "{n, plural, one {one} other {#}}" :n _v0)))
  `), "2\n7 7\n2-2\n");

  await executeModule(lykn(`
    (bind _v0 1)
    (console:log (template "{n, plural, one {{n, plural, one {deep-one} other {deep-other}}} other {outer-other}}" :n _v0))
  `), "deep-one\n");

  await executeModule(lykn(`
    (bind owner "owner")
    (console:log (template "{role, select, owner {Owner} other {Guest}}" :role owner))
    (console:log (template "{role, select, owner {{n, plural, one {one} other {#}}} other {N/A}}" :role owner :n 3))
  `), "Owner\n3\n");

  const preferred = lykn('(template "{x}-{x}" :x (next-id))');
  assertStringIncludes(preferred, "const _x = nextId()");
});

Deno.test("public ICU keeps once-only effects and original exceptions", async () => {
  await executeModule(lykn(`
    (bind calls (array))
    (bind _x 10)
    (func next-id :args (:number value) :returns :number :body (calls:push value) (+ value calls:length))
    (console:log (template "{x}-{x}" :x (next-id _x)))
    (console:log (JSON:stringify calls))
  `), "11-11\n[10]\n");

  const throwing = lykn(`
    (bind _n 5)
    (func explode :args (:any value) :body (throw (new Error "expected boom")))
    (console:log (template "{x}-{x}" :x (explode _n)))
  `);
  const directory = await Deno.makeTempDir({ prefix: "lykn-icu-throw-" });
  const path = `${directory}/output.mjs`;
  try {
    await Deno.writeTextFile(path, `${throwing}\nexport {};\n`);
    const result = await new Deno.Command(Deno.execPath(), {
      args: ["run", "--no-config", "--no-prompt", "--no-npm", "--cached-only", path],
      cwd: directory,
      stdout: "piped",
      stderr: "piped",
    }).output();
    assertNotEquals(result.code, 0);
    assertStringIncludes(new TextDecoder().decode(result.stderr), "expected boom");
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
});

Deno.test("public ICU preserves lazy and eager branch evaluation", async () => {
  const source = lykn(`
    (bind calls (array))
    (func branch-effect :args () :body (calls:push 99) calls:length)
    (console:log (template "{role, select, owner {Owner} other {{unused}}}" :role "owner" :unused (branch-effect)))
    (console:log (JSON:stringify calls))
    (console:log (template "{role, select, owner {Owner} other {{unused} {unused}}}" :role "owner" :unused (branch-effect)))
    (console:log (JSON:stringify calls))
  `);
  await executeModule(source, "Owner\n[]\nOwner\n[99]\n");
});

Deno.test("public ICU fragments and repeated calls keep independent state", async () => {
  const source = '(template "{n} {n}" :n (+ _n 1))';
  const form = read(source)[0];
  const expanded = expandExpr(form);
  const fragment = compileExpr(expanded);
  const identifiers = collectIdentifiers(fragment);
  assertEquals(fragment.type, "CallExpression");
  assertEquals(identifiers.has("_n"), true);
  assertEquals(identifiers.has("_n__lyknGenerated0"), true);
  await executeModule(lykn(`(bind _n 2) (console:log ${source})`), "3 3\n");

  const first = lykn(source);
  assertThrows(() => lykn('(template "{n, plural, one {missing other}}" :n _v0)'), Error);
  const recovered = lykn(source);
  assertEquals(recovered, first);
  await executeModule(`const _n = 2;\nconsole.log(${recovered.trim().replace(/;$/, "")});`, "3 3\n");
  await executeModule(`const _n = 2;\nconsole.log(${lykn(source).trim().replace(/;$/, "")});`, "3 3\n");
});

Deno.test("browser ICU ESM and private Reflect calls preserve capture anchors", async () => {
  await executeModule(browserCompileLykn(`
    (bind _n 2)
    (console:log (template "{n} {n}" :n (+ _n 1)))
    (console:log (template "{n, plural, one {{v0} {v0}} other {{v0} {v0}}}" :n 2 :v0 (+ 3 4)))
  `), "3 3\n7 7\n");

  const source = `
    (const receiver (object (base 10)))
    (const _n (array 4))
    (const calls (array))
    (function saved (value)
      (calls:push this:base)
      (return (+ this:base value)))
    (console:log (template "{n} {n}" :n (saved receiver _n)))
    (console:log (JSON:stringify calls))
  `;
  for (const reflectBinding of [false, true]) {
    const forms = read(`${reflectBinding ? "(const Reflect 0)" : ""}${source}`);
    const anchor = findSavedCall(forms);
    if (!anchor) throw new Error("raw private fixture lost its original saved-call node");
    const request = hostInvocationRequest(newHostInvocationId(), anchor);
    const output = compileWithHostInvocations(forms, compile, [request]);
    assertEquals(output.includes("__lyknHostInvocationPending__"), false);
    await executeModule(output, "14 14\n[10]\n");
  }
});
