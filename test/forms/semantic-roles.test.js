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
      await Deno.writeTextFile(modulePath, generated);
      const runtime = await new Deno.Command(Deno.execPath(), {
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
        cwd: temp,
        stdout: "piped",
        stderr: "piped",
      }).output();
      const observation = {
        source,
        generated,
        status: runtime.code,
        stdout: runtime.stdout,
        stderr: runtime.stderr,
      };
      console.log(`SEMANTIC_ROLE_PUBLIC_PREASSERT ${fixture.name} ${JSON.stringify(observation)}`);
      assertEquals(runtime.success, true, `${fixture.name} strict runtime failed`);
      assertEquals(runtime.stderr.length, 0, `${fixture.name} wrote stderr`);
      assertEquals(new TextDecoder().decode(runtime.stdout), fixture.expected);
    });
  }
});
