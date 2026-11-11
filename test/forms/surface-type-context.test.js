import { assertEquals, assertThrows } from "jsr:@std/assert";
import { compile, expandExpr, read } from "lang/mod.js";
import { macroEnv } from "lang/expander-core.js";
import { lykn } from "lang/mod.js";
import { compileLykn } from "../../packages/browser/compiler.js";

const identitySource = `
  (console:log
    (match (obj :tag "B1State" :decoy "decoy" :value "value")
      ((B1State picked) picked)))
`;

async function runGenerated(generated, prefix) {
  const directory = await Deno.makeTempDir({ prefix });
  const outputPath = `${directory}/probe.mjs`;
  try {
    await Deno.writeTextFile(outputPath, generated);
    const result = await new Deno.Command(Deno.execPath(), {
      args: ["run", "--no-config", "--cached-only", "--no-prompt", outputPath],
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

async function assertOutput(generated, expected, prefix) {
  const result = await runGenerated(generated, prefix);
  assertEquals(result.code, 0, result.stderr);
  assertEquals(result.stderr, "");
  assertEquals(result.stdout, expected);
}

Deno.test("cold prelude metadata selects named fields without runtime bindings", async () => {
  const generated = lykn(`
    (console:log
      (match (obj :tag "Some" :decoy "decoy" :value "value")
        ((Some picked) picked)))
  `);
  await assertOutput(generated, "value\n", "lykn-b1-cold-prelude-");
  assertEquals(generated.includes("const Some ="), false);
  assertEquals(generated.includes("const None ="), false);
  assertEquals(generated.includes("const Ok ="), false);
  assertEquals(generated.includes("const Err ="), false);
});

Deno.test("successful and late-failing declarations cannot leak pattern metadata", async () => {
  const coldBaseline = lykn(identitySource);
  const successful = lykn(`(type B1Envelope (B1State :string value))`);
  assertEquals(successful.includes("function B1State"), true);
  const afterSuccess = lykn(identitySource);
  await assertOutput(coldBaseline, "decoy\n", "lykn-b1-cold-baseline-");
  await assertOutput(afterSuccess, "decoy\n", "lykn-b1-after-success-");

  assertThrows(
    () => lykn(`(type B1Envelope (B1State :string value)) (not 1 2)`),
    Error,
    "not requires exactly 1 argument",
  );
  const afterFailure = lykn(identitySource);
  await assertOutput(afterFailure, "decoy\n", "lykn-b1-after-failure-");
});

Deno.test("a late Pass-2 failure cannot leak the type it already emitted", async () => {
  const source = `
    (console:log
      (match (obj :tag "B1LateFailure" :decoy "decoy" :value "value")
        ((B1LateFailure picked) picked)))
  `;
  const coldBaseline = lykn(source);
  assertThrows(
    () => lykn(`(type B1Failure (B1LateFailure :string value)) (not 1 2)`),
    Error,
    "not requires exactly 1 argument",
  );
  const afterFailure = lykn(source);
  await assertOutput(coldBaseline, "decoy\n", "lykn-b1-failure-baseline-");
  await assertOutput(afterFailure, "decoy\n", "lykn-b1-after-late-failure-");
});

Deno.test("successful and failed nested compiles preserve the outer metadata", async () => {
  const macroName = "b1-reenter-type-context";
  const hadPrevious = macroEnv.has(macroName);
  const previous = macroEnv.get(macroName);
  const callback = () => {
    lykn(`(type B1Inner (B1State :string inner))`);
    try {
      lykn(`(type B1Inner (B1State :string inner)) (not 1 2)`);
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes("not requires")) {
        throw error;
      }
    }
    return { type: "number", value: "0" };
  };
  macroEnv.set(macroName, callback);
  try {
    const generated = lykn(`
      (type B1Outer (B1State :string outer))
      (${macroName})
      (console:log
        (match (obj :tag "B1State" :outer "outer marker" :inner "inner marker")
          ((B1State picked) picked)))
    `);
    await assertOutput(generated, "outer marker\n", "lykn-b1-reentrant-");
  } finally {
    if (hadPrevious) macroEnv.set(macroName, previous);
    else macroEnv.delete(macroName);
  }
});

Deno.test("public expandExpr isolates metadata and preserves binding Sets", async () => {
  lykn(`(type B1Envelope (B1State :string value))`);
  const matchForm = read(identitySource)[0];
  const expanded = expandExpr(matchForm);
  await assertOutput(compile(expanded), "decoy\n", "lykn-b1-expand-expr-");

  const macroName = "b1_bound_macro_gate";
  const hadPrevious = macroEnv.has(macroName);
  const previous = macroEnv.get(macroName);
  let invoked = 0;
  const callback = () => {
    invoked += 1;
    return { type: "number", value: "99" };
  };
  macroEnv.set(macroName, callback);
  const bindings = new Set([macroName]);
  try {
    const expanded = expandExpr(read(`(${macroName})`)[0], bindings);
    const output = compile(Array.isArray(expanded) ? expanded : [expanded]);
    assertEquals(bindings, new Set([macroName]));
    assertEquals(invoked, 0);
    assertEquals(output.includes(`${macroName}()`), true);
  } finally {
    if (hadPrevious) macroEnv.set(macroName, previous);
    else macroEnv.delete(macroName);
  }
});

Deno.test("browser compile-to-ESM keeps each compilation type context private", async () => {
  const before = compileLykn(identitySource);
  compileLykn(`(type B1Envelope (B1State :string value))`);
  const after = compileLykn(identitySource);
  await assertOutput(before, "decoy\n", "lykn-b1-browser-before-");
  await assertOutput(after, "decoy\n", "lykn-b1-browser-after-");
});
