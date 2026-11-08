import { assertEquals, assertThrows } from "jsr:@std/assert";
import { lykn } from "../../packages/lang/mod.js";

const BAD = [
  ["w1", "(set! Reflect:apply 0)"],
  ["w2", "(set-symbol! Reflect \"apply\" 0)"],
  ["w3", "(++ Reflect)"],
  ["w4", "(set! globalThis:Reflect 0)"],
  ["w5", "(set! globalThis:Reflect:apply 0)"],
  ["w6", "(++ Reflect:apply)"],
  ["w7", "(kernel:delete Reflect:apply)"],
  ["w8", "(macro stomp () `(set! Reflect:apply 0)) (stomp)"],
  ["w9", "(func guarded :args () :returns :number :pre (do (set! Reflect:apply 0) true) :body 1)"],
];

const GOOD = [
  ["v1", "(console:log (JSON:stringify (typeof Reflect:apply)))", "\"function\"\n"],
  [
    "v2",
    "(func local :args (:any Reflect :any globalThis) :returns :array :body\n  (set! Reflect:apply 7)\n  (set! globalThis:Reflect:apply 8)\n  (array Reflect:apply globalThis:Reflect:apply))\n(console:log (JSON:stringify (local (obj :apply 0) (obj :Reflect (obj :apply 0)))))",
    "[7,8]\n",
  ],
  [
    "v3",
    "(func normalized :args (:any Reflect!) :returns :any :body\n  (set! Reflect!:apply 9)\n  Reflect!:apply)\n(console:log (JSON:stringify (normalized (obj :apply 0))))",
    "9\n",
  ],
  [
    "v4",
    "(bind action (fn (:number n) (+ n 1)))\n(set! action:call (fn (:number n) 99))\n(console:log (JSON:stringify (action:call 1)))",
    "99\n",
  ],
];

function record(name, source, generated, args, cwd, runtime, phase = "result") {
  const selectedEnv = Object.fromEntries(
    ["DENO_DIR", "LYKN_TEST_DENO", "XDG_CACHE_HOME", "TMPDIR", "LYKN_PROTECTED_HOST_EVIDENCE_DIR"]
      .map((key) => [key, Deno.env.get(key) ?? null]),
  );
  const receipt = {
    name,
    source,
    generated,
    command: { program: Deno.execPath(), args, cwd, selectedEnv },
    runtime: runtime === undefined ? null : {
      success: runtime.success,
      code: runtime.code,
      stdout: [...runtime.stdout],
      stderr: [...runtime.stderr],
    },
  };
  console.log(`PROTECTED_HOST_PUBLIC_PREASSERT ${name} ${JSON.stringify(receipt)}`);
  const root = Deno.env.get("LYKN_PROTECTED_HOST_EVIDENCE_DIR");
  if (root !== undefined) {
    if (!root.startsWith("/")) throw new Error("evidence directory must be absolute");
    Deno.writeTextFileSync(`${root}/${name}.${phase}.json`, `${JSON.stringify(receipt, null, 2)}\n`, { createNew: true });
  }
}

Deno.test("public JavaScript compiler rejects nine writes and runs four legal controls", async (t) => {
  const failures = [];
  const captureStep = async (name, action) => {
    await t.step(name, async () => {
      try {
        await action();
      } catch (error) {
        failures.push(`${name}: ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
      }
    });
  };

  for (const [name, source] of BAD) {
    await captureStep(name, async () => {
      let generated;
      try {
        assertThrows(() => {
          generated = lykn(source);
        }, Error, "host-contract v1");
      } catch (error) {
        record(name, source, generated ?? null, null, null, undefined);
        throw error;
      }
      record(name, source, null, null, null, undefined);
    });
  }

  for (const [name, source, expected] of GOOD) {
    await captureStep(name, async () => {
      const generated = lykn(source);
      const temp = await Deno.makeTempDir();
      const modulePath = `${temp}/${name}.js`;
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
        record(name, source, generated, args, temp, undefined, "before");
        const runtime = await new Deno.Command(Deno.execPath(), {
          args,
          cwd: temp,
          stdout: "piped",
          stderr: "piped",
        }).output();
        record(name, source, generated, args, temp, runtime, "after");
        assertEquals(runtime.success, true, `${name} strict runtime failed`);
        assertEquals(new TextDecoder().decode(runtime.stdout), expected, `${name} stdout differs`);
        assertEquals(runtime.stderr.length, 0, `${name} runtime stderr must be empty`);
      } finally {
        await Deno.remove(temp, { recursive: true });
      }
    });
  }

  assertEquals(failures, [], "all nine rejection and four runtime steps must pass");
});
