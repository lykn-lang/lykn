import { lykn } from "lang/mod.js";

const expectedPatternOutput =
  '[7,"outer","inner","null","missing","literal","safe","false","null","undefined",9,false,0,"",4,6,"selected",["match: no matching pattern"],true,true,"list","safe","bare",null,false,false,null,"number","safe","string",7,"wildcard","safe","safe",["outer.value","inner.value","wrong.inner.value"],8,"wildcard",["object.child"],[5]]\n';

async function assertRuntimeFixture(fixture, expected) {
  const source = await Deno.readTextFile(
    `test/fixtures/semantic-roles/${fixture}.lykn`,
  );
  const directory = await Deno.makeTempDir({ prefix: "lykn-embedded-adt-" });
  const outputPath = `${directory}/probe.js`;
  try {
    await Deno.writeTextFile(outputPath, lykn(source));
    const result = await new Deno.Command(Deno.execPath(), {
      args: ["run", "--no-config", "--cached-only", "--no-prompt", outputPath],
      cwd: directory,
      stdout: "piped",
      stderr: "piped",
    }).output();
    const stderr = new TextDecoder().decode(result.stderr);
    if (result.code !== 0) throw new Error(stderr);
    const stdout = new TextDecoder().decode(result.stdout);
    if (stdout !== expected) {
      throw new Error(`unexpected ${fixture} output: ${stdout}`);
    }
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
}

Deno.test("embedded public compiler handles recursive patterns and zero variants", async () => {
  await assertRuntimeFixture("adt-pattern-correctness", expectedPatternOutput);
});

Deno.test("embedded public compiler preserves private-name macro hygiene", async () => {
  await assertRuntimeFixture(
    "adt-pattern-macro-hygiene",
    "[[[[90,91],5,42]],[[90,91],6,42],[[90,91],7,42],[[90,91],8,42],[[90,91],9,42]]\n",
  );
});
