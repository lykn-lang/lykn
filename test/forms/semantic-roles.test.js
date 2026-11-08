import { assertEquals } from "jsr:@std/assert";
import { lykn } from "../../packages/lang/mod.js";

const CASES = [
  { name: "while", expected: "[1,11,2,12]\n" },
  { name: "do-while", expected: "[100,21,101,22]\n" },
  { name: "match", expected: "[[7,10],[\"guard\",\"fallback\"]]\n" },
  { name: "boundaries", expected: "[4,6,[2]]\n" },
];

Deno.test("public JavaScript compiler preserves shared semantic-role fixtures", async (t) => {
  for (const fixture of CASES) {
    await t.step(fixture.name, async () => {
      const sourcePath = `${Deno.cwd()}/test/fixtures/semantic-roles/${fixture.name}.lykn`;
      const source = await Deno.readTextFile(sourcePath);
      const generated = lykn(source);
      const temp = await Deno.makeTempDir();
      const modulePath = `${temp}/${fixture.name}.js`;
      try {
        await Deno.writeTextFile(modulePath, generated);
        const args = [
          "run",
          "--no-config",
          "--cached-only",
          "--no-npm",
          "--no-remote",
          "--deny-net",
          "--no-prompt",
          modulePath,
        ];
        const envNames = [
          "DENO_DIR",
          "LYKN_TEST_DENO",
          "XDG_CACHE_HOME",
          "TMPDIR",
          "LYKN_SEMANTIC_ROLE_EVIDENCE_DIR",
        ];
        const selectedEnv = Object.fromEntries(
          envNames.map((name) => [name, Deno.env.get(name) ?? null]),
        );
        const evidenceRoot = Deno.env.get("LYKN_SEMANTIC_ROLE_EVIDENCE_DIR");
        if (evidenceRoot !== undefined) {
          assertEquals(evidenceRoot.startsWith("/"), true, "evidence directory must be absolute");
          await Deno.writeFile(`${evidenceRoot}/public-${fixture.name}-source.lykn`, new TextEncoder().encode(source), { createNew: true });
          await Deno.writeTextFile(`${evidenceRoot}/public-${fixture.name}-generated.js`, generated, { createNew: true });
        }
        console.log(`SEMANTIC_ROLE_PUBLIC_SOURCE_PRESPAWN ${fixture.name} ${JSON.stringify({ source, generated })}`);
        const commandDescription = {
          program: Deno.execPath(),
          args,
          cwd: temp,
          sourcePath,
          modulePath,
          selectedEnv,
        };
        const command = new Deno.Command(Deno.execPath(), {
          args,
          cwd: temp,
          stdout: "piped",
          stderr: "piped",
        });
        const commandText = `${JSON.stringify(commandDescription, null, 2)}\n`;
        console.log(`SEMANTIC_ROLE_PUBLIC_COMMAND ${fixture.name} ${commandText}`);
        if (evidenceRoot !== undefined) {
          await Deno.writeTextFile(`${evidenceRoot}/public-${fixture.name}-command.txt`, commandText, { createNew: true });
        }
        const runtime = await command.output();
        const observation = {
          status: runtime.code,
          success: runtime.success,
          stdout: runtime.stdout,
          stderr: runtime.stderr,
        };
        const statusText = `success=${runtime.success} code=${runtime.code}\n`;
        console.log(`SEMANTIC_ROLE_PUBLIC_PREASSERT ${fixture.name} ${JSON.stringify(observation)}`);
        if (evidenceRoot !== undefined) {
          await Deno.writeFile(`${evidenceRoot}/public-${fixture.name}-stdout.bin`, runtime.stdout, { createNew: true });
          await Deno.writeFile(`${evidenceRoot}/public-${fixture.name}-stderr.bin`, runtime.stderr, { createNew: true });
          await Deno.writeTextFile(`${evidenceRoot}/public-${fixture.name}-status.txt`, statusText, { createNew: true });
        }
        assertEquals(runtime.success, true, `${fixture.name} strict runtime failed`);
        assertEquals(runtime.stderr.length, 0, `${fixture.name} wrote stderr`);
        assertEquals(new TextDecoder().decode(runtime.stdout), fixture.expected);
      } finally {
        await Deno.remove(temp, { recursive: true });
      }
    });
  }
});
