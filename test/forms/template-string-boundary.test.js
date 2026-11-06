import { assertEquals } from "jsr:@std/assert";
import { lykn } from "../../packages/lang/mod.js";

const BACKSLASH_N = [92, 110];
const BACKSLASH_QUOTE = [92, 34];
const LINE_FEED = [10];
const CARRIAGE_RETURN = [13];
const BACKSLASH_BACKTICK_DOLLAR = [92, 96, 36];
const TAGGED_RAW_BACKSLASH_N = [92, 92, 110];

const FIXTURES = [
  {
    name: "P1-backslash-n.lykn",
    expected: {
      plain: BACKSLASH_N,
      interpolated: BACKSLASH_N,
      concat: BACKSLASH_N,
      icu: BACKSLASH_N,
    },
  },
  {
    name: "P2-backslash-quote.lykn",
    expected: {
      plain: BACKSLASH_QUOTE,
      interpolated: BACKSLASH_QUOTE,
      concat: BACKSLASH_QUOTE,
      icu: BACKSLASH_QUOTE,
    },
  },
  {
    name: "P3-line-feed.lykn",
    expected: {
      plain: LINE_FEED,
      interpolated: LINE_FEED,
      concat: LINE_FEED,
      icu: LINE_FEED,
    },
  },
  {
    name: "P4-carriage-return.lykn",
    expected: {
      plain: CARRIAGE_RETURN,
      interpolated: CARRIAGE_RETURN,
      concat: CARRIAGE_RETURN,
      icu: CARRIAGE_RETURN,
    },
  },
  {
    name: "P5-backslash-backtick-dollar.lykn",
    expected: {
      plain: BACKSLASH_BACKTICK_DOLLAR,
      interpolated: BACKSLASH_BACKTICK_DOLLAR,
      concat: BACKSLASH_BACKTICK_DOLLAR,
      icu: BACKSLASH_BACKTICK_DOLLAR,
    },
  },
  {
    name: "P6-tag-raw.lykn",
    expected: {
      concat: TAGGED_RAW_BACKSLASH_N,
      icu: TAGGED_RAW_BACKSLASH_N,
    },
  },
];

function scalarValues(value) {
  return Array.from(value, (character) => character.codePointAt(0));
}

Deno.test("public JS compiler preserves decoded template string values", async (t) => {
  assertEquals(FIXTURES.length, 6, "fixed fixture denominator");
  assertEquals(
    FIXTURES.reduce(
      (sum, fixture) => sum + Object.keys(fixture.expected).length,
      0,
    ),
    22,
    "fixed scalar observation denominator",
  );

  const failures = [];
  for (const fixture of FIXTURES) {
    await t.step(fixture.name, async () => {
      let source;
      let generated;
      let tempDir;
      try {
        const fixturePath =
          `${Deno.cwd()}/test/fixtures/template-string-boundary/${fixture.name}`;
        source = await Deno.readTextFile(fixturePath);
        generated = lykn(source);
        tempDir = await Deno.makeTempDir({ prefix: "lykn-template-boundary-" });
        const modulePath = `${tempDir}/fixture.js`;
        const cachePath = `${tempDir}/deno-cache`;
        await Deno.mkdir(cachePath);
        await Deno.writeTextFile(modulePath, generated);

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
          clearEnv: true,
          env: {
            DENO_DIR: cachePath,
            NO_COLOR: "1",
            DENO_NO_UPDATE_CHECK: "1",
          },
        }).output();
        const stdout = new TextDecoder().decode(result.stdout);
        const stderr = new TextDecoder().decode(result.stderr);
        console.log(
          "TEMPLATE_BOUNDARY_OBSERVED",
          JSON.stringify({
            name: fixture.name,
            code: result.code,
            source,
            generated,
            stdout,
            stderr,
          }),
        );

        if (result.code !== 0) {
          failures.push(
            `${fixture.name}: child exit ${result.code}; values unestablished\nsource:\n${source}\ngenerated JavaScript:\n${generated}\nstdout:\n${stdout}\nstderr:\n${stderr}`,
          );
          return;
        }
        if (stderr !== "") {
          failures.push(
            `${fixture.name}: expected empty child stderr, got ${
              JSON.stringify(stderr)
            }\nsource:\n${source}\ngenerated JavaScript:\n${generated}\nstdout:\n${stdout}`,
          );
        }

        let actual;
        try {
          actual = JSON.parse(stdout.trim());
        } catch (error) {
          failures.push(
            `${fixture.name}: invalid JSON stdout: ${error}\nsource:\n${source}\ngenerated JavaScript:\n${generated}\nstdout:\n${stdout}\nstderr:\n${stderr}`,
          );
          return;
        }
        if (
          actual === null || Array.isArray(actual) || typeof actual !== "object"
        ) {
          failures.push(
            `${fixture.name}: expected JSON object, got ${
              JSON.stringify(actual)
            }\nsource:\n${source}\ngenerated JavaScript:\n${generated}\nstdout:\n${stdout}\nstderr:\n${stderr}`,
          );
          return;
        }

        const actualFields = Object.keys(actual);
        const expectedFields = Object.keys(fixture.expected);
        if (actualFields.length !== expectedFields.length) {
          failures.push(
            `${fixture.name}: expected ${expectedFields.length} fields, got ${actualFields.length}: ${
              JSON.stringify(actual)
            }\nsource:\n${source}\ngenerated JavaScript:\n${generated}\nstdout:\n${stdout}\nstderr:\n${stderr}`,
          );
        }
        for (const field of expectedFields) {
          if (typeof actual[field] !== "string") {
            failures.push(
              `${fixture.name}/${field}: expected string, got ${
                JSON.stringify(actual[field])
              }\nsource:\n${source}\ngenerated JavaScript:\n${generated}\nstdout:\n${stdout}\nstderr:\n${stderr}`,
            );
            continue;
          }
          const actualScalars = scalarValues(actual[field]);
          if (
            JSON.stringify(actualScalars) !==
              JSON.stringify(fixture.expected[field])
          ) {
            failures.push(
              `${fixture.name}/${field}: expected scalars ${
                JSON.stringify(fixture.expected[field])
              }, got ${
                JSON.stringify(actualScalars)
              }\nsource:\n${source}\ngenerated JavaScript:\n${generated}\nstdout:\n${stdout}\nstderr:\n${stderr}`,
            );
          }
        }
      } catch (error) {
        failures.push(
          `${fixture.name}: test setup/compile/runtime error: ${error}\nsource:\n${
            source ?? "<not read>"
          }\ngenerated JavaScript:\n${generated ?? "<not generated>"}`,
        );
      } finally {
        if (tempDir !== undefined) {
          await Deno.remove(tempDir, { recursive: true });
        }
      }
    });
  }
  assertEquals(failures, [], failures.join("\n\n"));
});
