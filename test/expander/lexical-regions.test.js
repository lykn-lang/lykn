import { assertEquals, assertStrictEquals, assertStringIncludes, assertThrows } from "jsr:@std/assert";
import { expandExpr, lykn, read } from "lang/mod.js";
import { expandWithMacroImports, macroEnv, resetMacros } from "lang/expander-core.js";
import { compileLykn as browserCompileLykn } from "browser/compiler.js";
import { enclosingDeclarationSites, validateReservedNames } from "lang/binding.js";
import { formHead as compilerFormHead } from "lang/compiler.js";
import { formHead, markHostReference } from "lang/compiler-private-atoms.js";

async function executeModule(source, expected, files = {}) {
  const directory = await Deno.makeTempDir({ prefix: "lykn-b2a-lexical-" });
  const path = `${directory}/output.mjs`;
  try {
    for (const [name, contents] of Object.entries(files)) {
      await Deno.writeTextFile(`${directory}/${name}`, contents);
    }
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

Deno.test("B2a source clauses isolate parameter names and retain own body sequence", async () => {
  const source = `
    (func total
      (:args (:any bind) :body (bind 11))
      (:args (:number a :number b) :body (bind result (+ a b)) result))
    (console:log (total (fn (:any value) value)))
    (console:log (total 20 22))
  `;
  await executeModule(lykn(source), "11\n42\n");
});

Deno.test("B2a class methods isolate their parameter lists", async () => {
  const source = `
    (class Box ()
      (call (bind) (return (bind 7)))
      (sum (left right) (bind total (+ left right)) (return total)))
    (bind box (new Box))
    (console:log (box:call (fn (:any value) value)))
    (console:log (box:sum 20 22))
  `;
  await executeModule(lykn(source), "7\n42\n");
});

Deno.test("B2a class method defaults expand once and execute", async () => {
  resetMacros();
  let calls = 0;
  macroEnv.set("count-default", () => {
    calls++;
    return read("41")[0];
  });
  try {
    const forms = read(`
      (class Defaults ()
        (constructor ((default initial 40)) (assign this:initial initial))
        (value ((default amount (count-default))) (return amount))
        (static (static-value ((default amount 43)) (return amount))))
      (bind omitted (new Defaults))
      (bind supplied (new Defaults 42))
      (console:log omitted:initial)
      (console:log supplied:initial)
      (console:log (omitted:value))
      (console:log (supplied:value 42))
      (console:log (Defaults:static-value))
    `);
    const expanded = expandWithMacroImports(forms, {}, (result) => result);
    const { compile } = await import("lang/compiler.js");
    await executeModule(compile(expanded), "40\n42\n41\n42\n43\n");
    assertEquals(calls, 1);
  } finally {
    resetMacros();
  }
});

Deno.test("B2a class field initializer stays outside method parameters", () => {
  const generated = lykn(`
    (class Scoped ()
      (shadow (array) (return (array 1)))
      (field values (array 1 2)))
  `);
  assertStringIncludes(generated, "return array(1);");
  assertStringIncludes(generated, "values = [1, 2];");
});

Deno.test("B2a source Func post sees body declaration independent of keyword order", async () => {
  const source = `(func sample :args () :post (bind eval 1) :body (bind bind (fn (:any a :any b) (= a eval))) true) (console:log (sample))`;
  await executeModule(lykn(source), "true\n");
});

Deno.test("B2a rejects multi-clause generators before body macro expansion", () => {
  resetMacros();
  let calls = 0;
  macroEnv.set("count-body", () => {
    calls++;
    return read("0")[0];
  });
  try {
    assertThrows(() => expandWithMacroImports(read(`
      (genfunc invalid
        (:args () :body (count-body))
        (:args (:any value) :body (yield value)))
    `), { strict: false }, (forms) => forms), Error, "genfunc: multiple clauses are not supported");
    assertEquals(calls, 0);
  } finally {
    resetMacros();
  }
});

Deno.test("B2a enclosing declaration sites follow dispatch and consumed export slots", () => {
  const normal = read("(export (func local :args () :body 1) (func ignored :args () :body 2))")[0];
  assertEquals(enclosingDeclarationSites(normal, new Set()).map((site) => site.name), ["local"]);

  const directDefault = read("(export default (func direct :args () :body 1))")[0];
  assertEquals(enclosingDeclarationSites(directDefault, new Set()).map((site) => site.name), ["direct"]);
  const expressionDefault = read("(export default (? true (kernel:function local () (return 1)) undefined))")[0];
  assertEquals(enclosingDeclarationSites(expressionDefault, new Set()), []);

  assertEquals(enclosingDeclarationSites(normal, new Set(["export"])), []);
  assertStrictEquals(compilerFormHead, formHead);
  assertEquals(formHead({ type: "atom", value: "export", binding: "ref" }), null);
  const privateHead = markHostReference({ type: "atom", value: "Error" }, "Error");
  assertEquals(formHead(privateHead), null);

  validateReservedNames(read("(export (bind bind (fn (:any a :any b) (= a eval)))) (bind eval 1)"));
  assertThrows(
    () => validateReservedNames(read("(export (bind unrelated 1)) (bind eval 1)")),
    Error,
    "forbidden as a strict-mode binding identifier",
  );
});

Deno.test("B2a public export wrappers expose only their emitted declaration", async () => {
  await executeModule(lykn(`
    (export (func array :args (:number value) :body (+ value 40)))
    (console:log (array 1))
  `), "41\n");
  await executeModule(lykn(`
    (export (async (func array :args (:number value) :body (+ value 40))))
    (console:log (await (array 1)))
  `), "41\n");
  await executeModule(lykn(`
    (kernel:export (kernel:function array (value) (return (+ value 40))))
    (console:log (array 1))
  `), "41\n");
  await executeModule(browserCompileLykn(`
    (kernel:export (kernel:function array (value) (return (+ value 40))))
    (console:log (array 1))
  `), "41\n");
  await executeModule(lykn(`
    (export default (func array :args (:number value) :body (+ value 40)))
    (console:log (array 1))
  `), "41\n");
  await executeModule(lykn(`
    (export default (class array () (static (value () (return 41)))))
    (console:log (array:value))
  `), "41\n");
  await executeModule(lykn(`
    (export default (async (func array :args (:number value) :body (+ value 40))))
    (console:log (await (array 1)))
  `), "41\n");
  await executeModule(lykn(`
    (export default (? true (kernel:function array (value) (return (+ value 40))) undefined))
    (console:log (array 1))
  `), "[ 1 ]\n");
});

Deno.test("B2a kernel import locals participate in enclosing dispatch", async () => {
  const form = read('(kernel:import "./dep.mjs" array)')[0];
  assertEquals(enclosingDeclarationSites(form, new Set()).map((site) => [site.name, site.kind]), [["array", "import-local"]]);
  await executeModule(
    lykn('(kernel:import "./dep.mjs" array) (console:log (array 1))'),
    "42\n",
    { "dep.mjs": "export default function importedArray(value) { return 42; }" },
  );
});

Deno.test("B2a public pass1 preserves a macro after a bound bind-shaped call", async () => {
  resetMacros();
  try {
    await executeModule(lykn(`
      (set-symbol! globalThis :macro 100)
      (bind bind (fn (:any left :any right) left))
      (bind macro 1)
      (macro answer () \`41)
      (console:log (answer))
    `), "41\n");
  } finally {
    resetMacros();
  }
});

Deno.test("B2a public pass1 retains real unbound macro registration", async () => {
  resetMacros();
  try {
    await executeModule(lykn(`
      (macro answer () \`41)
      (console:log (answer))
    `), "41\n");
  } finally {
    resetMacros();
  }
});

Deno.test("B2a public pass1 honors a genuinely bound macro call", async () => {
  resetMacros();
  try {
    await executeModule(lykn(`
      (set-symbol! globalThis :answer 1)
      (bind macro (fn (:any name :any params :any body) 42))
      (macro answer 1 41)
      (console:log (macro answer 1 41))
    `), "42\n");
  } finally {
    resetMacros();
  }
});

Deno.test("B2a macro result declaration controls following macro dispatch", async () => {
  resetMacros();
  let calls = 0;
  macroEnv.set("make-local", () => {
    calls++;
    return read("(export (async (func local-value :args () :body 41)))")[0];
  });
  macroEnv.set("local-value", () => {
    calls++;
    return read("99")[0];
  });
  try {
    const output = expandWithMacroImports(read("(make-local) (console:log (await (local-value)))"), {}, (forms) => forms);
    const js = (await import("lang/compiler.js")).compile(output);
    await executeModule(js, "41\n");
    assertEquals(calls, 1);
  } finally {
    resetMacros();
  }
});

Deno.test("B2a shared macro AST object keeps binder and head occurrences distinct", () => {
  resetMacros();
  const shared = { type: "atom", value: "bind" };
  macroEnv.set("shared-shape", () => [
    { type: "list", values: [{ type: "atom", value: "fn" }, { type: "list", values: [
      { type: "keyword", value: "any" }, shared,
    ] }, { type: "number", value: 0 }] },
    { type: "list", values: [shared, { type: "atom", value: "value" }, { type: "number", value: 1 }] },
  ]);
  try {
    const output = expandWithMacroImports(read("(shared-shape)"), { strict: false }, (forms) => forms);
    assertEquals(output[1].values[0].value, "const");
  } finally {
    resetMacros();
  }
});

Deno.test("B2a ordinary call operands do not share declarations", () => {
  resetMacros();
  let calls = 0;
  macroEnv.set("local", () => {
    calls++;
    return read("99")[0];
  });
  try {
    const output = expandWithMacroImports(read("(consume (bind local 1) (local))"), { strict: false }, (forms) => forms);
    assertEquals(calls, 1);
    assertEquals(output[0].values[1].values[0].value, "const");
    assertEquals(output[0].values[2].value, 99);
  } finally {
    resetMacros();
  }
});

Deno.test("B2a Single result slots do not inherit sibling visibility", () => {
  resetMacros();
  let calls = 0;
  macroEnv.set("single-result", () => [
    read("(bind local 1)")[0],
    read("(local)")[0],
  ]);
  macroEnv.set("local", () => {
    calls++;
    return read("99")[0];
  });
  try {
    const output = expandExpr(read("(single-result)")[0]);
    assertEquals(calls, 1);
    assertEquals(output[1].value, 99);
  } finally {
    resetMacros();
  }
});

Deno.test("B2a macro head chains recheck surface and lexical priority", () => {
  resetMacros();
  let surfaceCalls = 0;
  let boundCalls = 0;
  macroEnv.set("chain-surface", () => read("(bind from-surface 41)")[0]);
  macroEnv.set("bind", () => {
    surfaceCalls++;
    return read("99")[0];
  });
  macroEnv.set("chain-bound", () => read("(already-bound 1)")[0]);
  macroEnv.set("already-bound", () => {
    boundCalls++;
    return read("99")[0];
  });
  try {
    const output = expandWithMacroImports(
      read("(bind already-bound 0) (chain-surface) (chain-bound)"),
      { strict: false },
      (forms) => forms,
    );
    assertEquals(surfaceCalls, 0);
    assertEquals(boundCalls, 0);
    assertEquals(output[1].values[0].value, "const");
    assertEquals(output[2].values[0].value, "already-bound");
  } finally {
    resetMacros();
  }
});
