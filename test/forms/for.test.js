import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/assert/mod.ts";
import { read } from "lang/reader.js";
import { compile } from "lang/compiler.js";
import { lykn as compileSurfaceLykn } from "../../packages/lang/mod.js";

function lykn(source) {
  return compile(read(source)).trim();
}

Deno.test("for: basic c-style", () => {
  const result = lykn("(for (let i 0) (< i 10) (++ i) (console:log i))");
  assertEquals(result.includes("for"), true);
  assertEquals(result.includes("i < 10"), true);
});

Deno.test("for: infinite loop with empty slots", () => {
  const result = lykn("(for () () () (break))");
  assertEquals(result.includes("for (; ; )"), true);
});

Deno.test("for: missing body throws", () => {
  assertThrows(() => lykn("(for (let i 0) (< i 10))"));
});

Deno.test("for: all body forms compile and run as ordered statements", async () => {
  let source;
  let generated;
  let tempDir;
  try {
    source = await Deno.readTextFile(
      `${Deno.cwd()}/test/fixtures/variadic-for-bodies.lykn`,
    );
    generated = compileSurfaceLykn(source);
    tempDir = await Deno.makeTempDir({ prefix: "lykn-variadic-for-" });
    const modulePath = `${tempDir}/fixture.js`;
    await Deno.writeTextFile(modulePath, generated);
    console.log(
      "VARIADIC_FOR_JS_PREASSERT",
      JSON.stringify({
        source,
        generated,
        executable: Deno.execPath(),
        modulePath,
      }),
    );
    const result = await new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "--no-config",
        "--cached-only",
        "--no-npm",
        "--no-remote",
        "--deny-net",
        "--no-prompt",
        modulePath,
      ],
      cwd: tempDir,
      stdin: "null",
      stdout: "piped",
      stderr: "piped",
    }).output();
    const stdout = new TextDecoder().decode(result.stdout);
    const stderr = new TextDecoder().decode(result.stderr);
    console.log(
      "VARIADIC_FOR_JS_RUNTIME",
      JSON.stringify({
        code: result.code,
        stdoutBytes: Array.from(result.stdout),
        stderrBytes: Array.from(result.stderr),
        stdout,
        stderr,
        source,
        generated,
      }),
    );
    assertEquals(generated.includes("const value"), true);
    assertEquals(generated.includes("const nextValue"), true);
    assertEquals(
      generated.indexOf("const value") < generated.lastIndexOf("if (true"),
      true,
    );
    assertEquals(
      generated.indexOf("const nextValue") < generated.lastIndexOf("if (true"),
      true,
    );
    assertEquals(generated.includes("999"), true);
    assertEquals(result.code, 0, `runtime failed: ${stderr}`);
    assertEquals(Array.from(result.stderr), []);
    assertEquals(JSON.parse(stdout.trim()), { trace: [0, 10, 11, 1, 11, 12] });
  } finally {
    if (tempDir !== undefined) {
      await Deno.remove(tempDir, { recursive: true });
    }
  }
});

Deno.test("for: each consumed header rejects no-else if", () => {
  for (
    const invalid of [
      "(for (if true 0) (< i 1) (++ i) (console:log i))",
      "(for (let i 0) (if true true) (++ i) (console:log i))",
      "(for (let i 0) (< i 1) (if true 1) (console:log i))",
    ]
  ) {
    assertThrows(
      () => compileSurfaceLykn(invalid),
      Error,
      "if in expression position requires an else branch",
    );
  }
});
