import { assertEquals } from "jsr:@std/assert";
import { lykn } from "../../packages/lang/mod.js";

const FIXTURES = [
  {
    name: "E1-sync-values.lykn",
    expected: {
      value: 41,
      falseValue: 42,
      typeof: "number",
      noElsePrefix: 41,
      nestedEquality: true,
    },
  },
  {
    name: "E2-async-branches.lykn",
    expected: {
      sync: { trace: ["sync", "after-call", "after-await"], value: 42 },
      await: { trace: ["await", "after-call", "after-await"], value: 7 },
    },
  },
  {
    name: "E3-promise-value.lykn",
    expected: { same: true, thenType: "function", resolved: 9 },
  },
  {
    name: "E4-deferred-function.lykn",
    expected: {
      constructionCalls: 0,
      immediateType: "function",
      invocationCalls: 1,
      result: 9,
    },
  },
  {
    name: "E5-effects-errors.lykn",
    expected: {
      trace: ["selected"],
      selectedMessage: "selected boom",
      rejectionMessage: "await rejected",
      outer: "outer",
      scoped: "inner",
    },
  },
];

Deno.test("public JS compiler preserves async expression values", async (t) => {
  assertEquals(FIXTURES.length, 5, "frozen fixture denominator");
  const failures = [];
  for (const fixture of FIXTURES) {
    await t.step(fixture.name, async () => {
      let source;
      let generated;
      let tempDir;
      try {
        source = await Deno.readTextFile(
          `${Deno.cwd()}/test/fixtures/async-expression-values/${fixture.name}`,
        );
        generated = lykn(source);
        tempDir = await Deno.makeTempDir({ prefix: "lykn-async-expr-" });
        const modulePath = `${tempDir}/fixture.js`;
        await Deno.writeTextFile(modulePath, generated);
        console.log(
          "ASYNC_EXPR_JS_PREASSERT",
          JSON.stringify({ name: fixture.name, expected: fixture.expected, source, generated }),
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
          "ASYNC_EXPR_JS_RUNTIME",
          JSON.stringify({ name: fixture.name, code: result.code, stdout, stderr, source, generated }),
        );
        if (result.code !== 0) {
          failures.push(
            `${fixture.name}: runtime exit ${result.code}; values unestablished\nsource:\n${source}\ngenerated:\n${generated}\nstdout:\n${stdout}\nstderr:\n${stderr}`,
          );
          return;
        }
        if (stderr !== "") failures.push(`${fixture.name}: unexpected stderr ${JSON.stringify(stderr)}`);
        let actual;
        try {
          actual = JSON.parse(stdout.trim());
        } catch (error) {
          failures.push(`${fixture.name}: invalid JSON ${error}; stdout=${JSON.stringify(stdout)}`);
          return;
        }
        if (JSON.stringify(actual) !== JSON.stringify(fixture.expected)) {
          failures.push(
            `${fixture.name}: expected ${JSON.stringify(fixture.expected)}, got ${JSON.stringify(actual)}; source:\n${source}\ngenerated:\n${generated}\nstdout:\n${stdout}`,
          );
        }
      } catch (error) {
        failures.push(
          `${fixture.name}: setup/compile/runtime error ${error}\nsource:\n${source ?? "<not read>"}\ngenerated:\n${generated ?? "<not generated>"}`,
        );
      } finally {
        if (tempDir !== undefined) await Deno.remove(tempDir, { recursive: true });
      }
    });
  }
  assertEquals(failures, [], failures.join("\n\n"));
});
