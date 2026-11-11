import { assertEquals, assertThrows, assertStringIncludes } from "jsr:@std/assert";
import { expandExpr, lykn, read } from "lang/mod.js";
import { compileLykn } from "../../packages/browser/compiler.js";
import { bindingNamesInPattern, validateReservedNames, walkBindings } from "lang/binding.js";
import { markKernel } from "lang/kernel-mark.js";

async function executeModule(source, expected = "") {
  const directory = await Deno.makeTempDir({ prefix: "lykn-ic01-output-" });
  const path = `${directory}/output.mjs`;
  try {
    await Deno.writeTextFile(path, `${source}\nexport {};\n`);
    const result = await new Deno.Command(Deno.execPath(), {
      args: ["run", "--no-config", "--no-prompt", "--no-npm", "--cached-only", path],
      cwd: directory,
      stdout: "piped",
      stderr: "piped",
    }).output();
    const stdout = new TextDecoder().decode(result.stdout);
    const stderr = new TextDecoder().decode(result.stderr);
    assertEquals(result.code, 0, stderr);
    assertEquals(stderr, "");
    assertEquals(stdout, expected);
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
}

Deno.test("emitted reserved bindings reject in public compile and expandExpr", () => {
  const sites = walkBindings(read("(fn (:any package) package)"));
  assertEquals(sites.map((site) => [site.name, site.kind]), [["package", "param"]]);
  assertThrows(() => validateReservedNames(read("(fn (:any package) package)")), Error, "package");
  for (const name of ["package", "if!"]) {
    const error = assertThrows(() => lykn(`(fn (:any ${name}) ${name})`), Error);
    assertStringIncludes(error.message, name === "package" ? "reserved word" : "emits the JavaScript reserved word 'if'");
    assertThrows(() => expandExpr(read(`(fn (:any ${name}) ${name})`)[0]), Error);
  }
  assertThrows(() => lykn("(fn (:any eval) eval)"), Error, "strict-mode binding identifier");
  assertThrows(() => lykn("(fn (:any arguments) arguments)"), Error, "strict-mode binding identifier");
});

Deno.test("normalized DD-49 output is checked as the emitted binding", () => {
  assertThrows(() => lykn("(fn (:any if!) 0)"), Error, "emits the JavaScript reserved word 'if'");
});

Deno.test("macro output is checked as a real binding and legal structural slots stay legal", async () => {
  assertThrows(
    () => lykn("(macro restricted-bad (params) `(fn ,params 0)) (bind example (restricted-bad (:any package)))"),
    Error,
    "package",
  );
  const renamedMacro = lykn("(macro restricted-safe (params) `(fn ,params 0)) (bind example (restricted-safe (:any safe))) (console:log (example 7))");
  await executeModule(renamedMacro, "0\n");
  assertThrows(
    () => expandExpr(read("`(array ,(function (package) package))")[0]),
    Error,
    "package",
  );
  assertEquals(typeof lykn("(quote (bind if! 0))"), "string");
  assertEquals(typeof lykn("`(array `(unquote (kernel:const package 0)))"), "string");
  assertEquals(typeof lykn('(import "module" ((alias package local)))'), "string");
  assertThrows(() => lykn('(import "module" ((alias original package)))'), Error, "package");
  const generated = lykn(`
    (console:log (typeof (obj :const eval)))
    (console:log (obj :const "property" :if "reserved-key"))
    (bind bind (fn (:any value) (typeof value)))
    (console:log (bind eval))
  `);
  await executeModule(generated, "object\n{ const: \"property\", if: \"reserved-key\" }\nfunction\n");
});

Deno.test("source function groups visit selected tails and preserve last-group semantics", () => {
  for (const source of [
    "(func tail :args () :body 1 (bind package 2) 3)",
    "(func tail 1 (bind package 2) 3)",
    "(genfunc tail :args () :body (yield 1) (bind package 2))",
    "(bind result ((do (bind package 1) (fn () 2))))",
  ]) {
    assertThrows(() => validateReservedNames(read(source)), Error, "package");
    assertThrows(() => lykn(source), Error, "package");
    assertThrows(() => expandExpr(read(source)[0]), Error, "package");
  }
  validateReservedNames(read("(func last :args () :body (bind package 1) :body 1)"));
});

Deno.test("public postconditions see body declarations in either textual order", async () => {
  for (const source of [
    `(func sample :args () :post (bind eval 1) :body (bind bind (fn (:any a :any b) (= a eval))) true) (console:log (sample))`,
    `(func sample :args () :body (bind bind (fn (:any a :any b) (= a eval))) true :post (bind eval 1)) (console:log (sample))`,
  ]) await executeModule(lykn(source), "true\n");
});

Deno.test("public expandExpr respects supplied binding names", () => {
  const form = read("(bind eval 1)")[0];
  const expanded = expandExpr(form, new Set(["bind"]));
  assertEquals(expanded.type, "list");
  assertEquals(expanded.values[0].value, "bind");
});

Deno.test("trusted forms retain dispatch authority and calls do not hoist binders", () => {
  const trusted = read("(object (const eval))")[0];
  markKernel(trusted);
  validateReservedNames([trusted], { bindings: new Set(["object"]) });
  assertThrows(
    () => validateReservedNames(read("(object (const eval))"), { bindings: new Set(["object"]) }),
    Error,
    "strict-mode binding identifier",
  );
  const calls = read("(bind object 1) (object (const eval))");
  validateReservedNames(calls, { bindings: new Set(["bind"]) });
  const taggedCall = read("(bind eval 1)")[0];
  taggedCall.values[0].binding = "ref";
  validateReservedNames([taggedCall]);
});

Deno.test("grouped bind initializers use sequential binding visibility", () => {
  validateReservedNames(read("(bind bind (fn (:any value) value) result (bind eval))"));
  assertThrows(
    () => validateReservedNames(read("(bind first 0 second (bind eval 1))")),
    Error,
    "strict-mode binding identifier",
  );
});

Deno.test("kernel parameters have inner scope and class methods stay separate", () => {
  assertEquals(
    typeof lykn("(bind f (function local (bind) (bind eval 1))) (bind safe 0)"),
    "string",
  );
  assertThrows(
    () => lykn("(bind f (function local (bind) 0)) (bind eval 1)"),
    Error,
    "strict-mode binding identifier",
  );
  assertThrows(
    () => lykn("(class C () (first (bind) 0) (second () (bind eval 1)))"),
    Error,
    "strict-mode binding identifier",
  );
});

Deno.test("typed and kernel parameter slots project their actual local names", () => {
  for (const source of [
    "(fn ((rest :any package)) package)",
    "(fn ((default :any package 0)) package)",
    "(function local ((rest package)) package)",
    "(function local ((default package 0)) package)",
  ]) {
    assertThrows(() => validateReservedNames(read(source)), Error, "package");
  }
  assertEquals(
    walkBindings(read("(function local ((object (alias package field))) field)")).map((site) => site.name),
    ["local", "field"],
  );
  validateReservedNames(read("(func f (:args (:any bind) :body (bind eval 1)) (:args (:any x) :body x))"));
  assertThrows(
    () => validateReservedNames(read("(func f (:args (:any bind) :body 0) (:args (:any x) :body (bind eval 1)))")),
    Error,
    "strict-mode binding identifier",
  );
  assertThrows(
    () => validateReservedNames(read("(class C ((fn (:any package) package)) (m () 0))")),
    Error,
    "package",
  );
  assertThrows(
    () => validateReservedNames(read("(bind (object (alias data local (bind eval 1))) source)")),
    Error,
    "strict-mode binding identifier",
  );
  for (const source of [
    "(kernel:function example ((default value (do (bind package 1) 2))) (return value))",
    "(kernel:const (object (default value (do (bind package 1) 2))) (object))",
    "(class Example () (method ((default value (do (bind package 1) 2))) (return value)))",
    "(bind (object (alias data (object (default value (do (bind package 1) 2))))) (object (data (object))))",
  ]) assertThrows(() => validateReservedNames(read(source)), Error, "package");
  assertThrows(
    () => validateReservedNames(read("(kernel:const (object (alias :package eval)) (object))")),
    Error,
    "eval",
  );
  assertEquals(
    walkBindings(read("(kernel:const (object (default value (bind local (fn (:any inner) inner)))) source)"))
      .map((site) => site.name),
    ["value", "local", "inner"],
  );
  assertThrows(
    () => validateReservedNames(read("(kernel:lambda (package) package)")),
    Error,
    "package",
  );
});

Deno.test("typed nested alias keys stay data and locals execute", async () => {
  const source = `(func read-local :args ((object (alias :any package (object :any local)))) :body local)
(console:log (read-local (object (package (object (local "local-value"))))))`;
  await executeModule(lykn(source), "local-value\n");
  assertEquals(
    walkBindings(read("(func read-local :args ((object (alias :any package (object :any local)))) :body local)"))
      .map((site) => site.name),
    ["read-local", "local"],
  );
});

Deno.test("nullary constructor binders differ from erased type names", () => {
  assertThrows(() => lykn("(type Metadata package)"), Error, "package");
  assertEquals(typeof lykn("(type package Safe)"), "string");
});

Deno.test("labels and contextual syntax stay distinct from strict bindings", async () => {
  const generated = lykn(`
    (kernel:label eval (kernel:block))
    (kernel:const object (kernel:object (const eval)))
    (async (fn (:any value) value))
    (kernel:function* gen (value) (yield value))
  `);
  await executeModule(generated);
});

Deno.test("browser compile rejects binders and emits legal module output", async () => {
  assertThrows(() => compileLykn("(fn (:any package) package)"), Error, "package");
  const generated = compileLykn(`(console:log (obj :const "browser-ok"))`);
  await executeModule(generated, "{ const: \"browser-ok\" }\n");
});

Deno.test("binding-pattern aliases validate local loop and bind names", async () => {
  const loopBad = `(for-of (object (alias :value package)) (array (obj :value 1)) (console:log 1))`;
  const bindBad = `(bind (object (alias :value package)) (obj :value 1)) (console:log 1)`;
  for (const source of [loopBad, bindBad]) {
    assertThrows(() => validateReservedNames(read(source)), Error, "package");
    assertThrows(() => lykn(source), Error, "package");
    assertThrows(() => expandExpr(read(source)[0]), Error, "package");
  }

  const loopSafe = `(for-of (object (alias :value local)) (array (obj :value 1)) (console:log 1))`;
  const bindSafe = `(bind (object (alias :value local)) (obj :value 1)) (console:log 1)`;
  await executeModule(lykn(loopSafe), "1\n");
  await executeModule(lykn(bindSafe), "1\n");

  const kernelAlias = read("(kernel:const (object (alias :package local)) (object))");
  assertEquals(walkBindings(kernelAlias).map((site) => site.name), ["local"]);
  assertEquals(
    walkBindings(read("(const (object (alias :value package)) source)"))
      .map((site) => site.name),
    ["package"],
  );
  assertEquals(bindingNamesInPattern(read("(object (alias :value local))")[0]).map((site) => site.name), ["local"]);

  for (const source of [
    `(for-of (object (alias :value local (bind package 1))) (array (obj :value 1)) 1)`,
    `(catch (object (alias :value local (bind package 1))) 1)`,
  ]) assertThrows(() => validateReservedNames(read(source)), Error, "package");

  assertEquals(
    walkBindings(read("(catch (object (alias :value local)) (return local))"))
      .map((site) => site.name),
    ["local"],
  );
});

Deno.test("function defaults are traversed once with producer-specific lambda grammar", async () => {
  const defaultBody = `(do (bind local (fn (:any inner) inner)) local)`;
  const cases = [
    [`(function example ((default value ${defaultBody})) (return value))`, ["example", "value", "local", "inner"]],
    [`(func example :args ((default :any value ${defaultBody})) :body value)`, ["example", "value", "local", "inner"]],
    [`(genfunc example :args ((default :any value ${defaultBody})) :body (yield value))`, ["example", "value", "local", "inner"]],
    [`(function* ((default value ${defaultBody})) (yield value))`, ["value", "local", "inner"]],
    [`(fn ((default :any value ${defaultBody})) value)`, ["value", "local", "inner"]],
    [`(lambda ((default :any value ${defaultBody})) value)`, ["value", "local", "inner"]],
    [`(genfn ((default :any value ${defaultBody})) (yield value))`, ["value", "local", "inner"]],
    [`(=> ((default value ${defaultBody})) value)`, ["value", "local", "inner"]],
    [`(kernel:lambda ((default value ${defaultBody})) value)`, ["value", "local", "inner"]],
  ];
  for (const [source, expected] of cases) {
    assertEquals(walkBindings(read(source)).map((site) => site.name), expected, source);
  }
  assertEquals(
    walkBindings(read("(function example (same same) (return same))"))
      .map((site) => site.name),
    ["example", "same", "same"],
  );
  const typedLambda = read("(lambda (:any local) local)");
  assertEquals(walkBindings(typedLambda).map((site) => site.name), ["local"]);
  const escapedKernelLambda = read("(lambda ((object (alias :package package))) package)");
  markKernel(escapedKernelLambda[0]);
  assertEquals(walkBindings(escapedKernelLambda).map((site) => site.name), ["package"]);
  assertThrows(() => validateReservedNames(escapedKernelLambda), Error, "package");
  assertThrows(() => validateReservedNames(read("(fn ((default :any package 0)) package)")), Error, "package");
  const executable = `(func defaulted :args ((default :any value (do (bind local (fn (:any inner) inner)) 1))) :body value) (console:log (defaulted))`;
  await executeModule(lykn(executable), "1\n");
});

Deno.test("empty public source function headers retain ordinary diagnostics", () => {
  for (const [source, expected] of [
    ["(func)", "func requires at least a name and body"],
    ["(genfunc)", "genfunc requires at least a name and :yields/:body"],
  ]) {
    assertThrows(() => lykn(source), Error, expected);
    assertThrows(() => expandExpr(read(source)[0]), Error, expected);
  }
  assertEquals(walkBindings(read("(func)")).length, 0);
  assertEquals(walkBindings(read("(genfunc)")).length, 0);
});
