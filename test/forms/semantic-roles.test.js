import { assertEquals, assertThrows } from "jsr:@std/assert";
import { compile, expand, lykn, read } from "../../packages/lang/mod.js";
import { resetGensym, resetMacros } from "../../packages/lang/expander.js";

const CASES = [
  { name: "while", expected: "[1,11,2,12]\n" },
  { name: "do-while", expected: "[100,21,101,22]\n" },
  { name: "match", expected: "[[7,10],[\"guard\",\"fallback\"]]\n" },
  { name: "boundaries", expected: "[4,6,[2]]\n" },
  { name: "if-arm-scope", expected: "[101,14,15]\n" },
  { name: "if-declaration", expected: "" },
  { name: "if-direct-transfers-literal", expected: "[7,9,[0,2],4]\n" },
  { name: "if-direct-transfers", expected: "[7,9,[0,2],4]\n" },
  { name: "statement-match-guards", expected: '["subject","literal-false",2,"chosen","body"]\n' },
  { name: "statement-match-return", expected: "inside\n" },
  { name: "statement-match-loop", expected: "[0,10,2,12]\n" },
  { name: "statement-match-exhaustion", expected: '["guard","match: no matching pattern"]\n' },
  { name: "statement-match-preservation", expected: "[[101,201,202,203,7,8],41,42]\n" },
  { name: "statement-match-protected-preservation", expected: "[7,[7]]\n" },
  { name: "match-clause-scope", expected: "[11,22,14]\n" },
  { name: "match-structural-pattern-macros", expected: "[7]\n" },
  { name: "original-match-reserved-role", expected: "[11,22,14]\n" },
  { name: "original-match-kernel-object", expected: "[7]\n" },
  { name: "bound-match-conditional-operand", expected: "[7,8]\n" },
  { name: "nested-kernel-object-roles", expected: "[11,11,7,9,6]\n" },
  { name: "return-consumed-match", expected: '["inside","normal",["subject","guard","subject","guard"]]\n' },
  { name: "return-consumed-loop", expected: '["done",[1,"skip"]]\n' },
  { name: "return-consumed-guard-exhaustion", expected: '["guard","match: no matching pattern"]\n' },
  { name: "return-consumed-macro-boundaries", expected: '["inside",["nested"]]\n' },
  { name: "bind-consumed-early-return", expected: '["early",7,["body","after"]]\n' },
  { name: "bind-consumed-group-match", expected: '[81,8,["match",8]]\n' },
  { name: "bind-consumed-loop-transfer", expected: "[0,2]\n" },
  { name: "bind-consumed-name-hygiene", expected: '[[7,99,41],["result"]]\n' },
  { name: "completion-if-headers", expected: '[80,81,7,8,["statement","statement","value","statement","value","then","after","statement","value","else","after"]]\n' },
  { name: "completion-match-headers", expected: '[80,81,82,83,84,["discarded","discarded",3,"discarded",3,"discarded-fallback","consumed","discarded",3,"discarded-fallback","consumed",4,"discarded",3,"discarded-fallback","consumed",4,"consumed-fallback"]]\n' },
  { name: "completion-logical-operands", expected: '[7,[0,"kept"],[10,11],"pure",["first","second",0,"kept","first","second",0,"kept","last","arg1","arg2"]]\n' },
  { name: "completion-nullish-operands", expected: '[0,false,"early","early",["left","after","left","after","left","right","left","right"]]\n' },
  { name: "ordered-lexical-bind-call", expected: '[91,["old",8],["earlier","middle","earlier","middle","later","old","after"]]\n' },
  { name: "ordered-lexical-statement-call", expected: '[90,91,["first","middle","first","middle",4,"after","first","middle",true]]\n' },
];

const RESERVED_MATCH_CASES = [
  {
    name: "pattern binder",
    source: "(match 0 (if 1) (_ 0))",
    kind: "pattern binding",
  },
  {
    name: "guard declaration",
    source: "(match 0 (_ :when (do (bind if 0) true) 1))",
    kind: "binding name",
  },
  {
    name: "body declaration",
    source: "(match 0 (_ (bind if 0) 1))",
    kind: "binding name",
  },
  {
    name: "subject order",
    source: "(match (do (bind for 0) 0) (if 1) (_ 0))",
    kind: "pattern binding",
  },
];

Deno.test("public JavaScript compiler preserves shared semantic-role fixtures", async (t) => {
  for (const fixture of CASES) {
    await t.step(fixture.name, async () => {
      const sourcePath = `${Deno.cwd()}/test/fixtures/semantic-roles/${fixture.name}.lykn`;
      const source = await Deno.readTextFile(sourcePath);
      if (fixture.name === "statement-match-preservation") resetGensym();
      if (fixture.name === "original-match-kernel-object") resetMacros();
      const generated = lykn(source);
      if (
        fixture.name === "ordered-lexical-bind-call" ||
        fixture.name === "ordered-lexical-statement-call"
      ) {
        const expanded = expand(read(source));
        assertEquals(compile(expanded), generated, `${fixture.name} expanded compile differs`);
        assertEquals(
          compile(structuredClone(expanded)),
          generated,
          `${fixture.name} structured clone compile differs`,
        );
        assertEquals(
          compile(JSON.parse(JSON.stringify(expanded))),
          generated,
          `${fixture.name} JSON round-trip compile differs`,
        );
      }
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

for (const testCase of RESERVED_MATCH_CASES) {
  Deno.test(`public D2 rejects reserved match ${testCase.name}`, () => {
    const error = assertThrows(() => lykn(testCase.source));
    assertEquals(
      error.message,
      `'if' is a JavaScript reserved word and cannot be used as a lykn ${testCase.kind}; rename it (e.g. \`if_\`)`,
    );
  });
}

Deno.test("public compiler rejects unknown nested kernel escape", () => {
  const error = assertThrows(() => lykn("(bind result (kernel:objec (key 7)))\n"));
  assertEquals(
    error.message,
    "unknown kernel form 'objec' in (kernel:objec ...); did you mean 'object'?",
  );
});

Deno.test("public direct return preserves nested no-else diagnostic", () => {
  const error = assertThrows(() =>
    lykn("(func bad :returns :any :body (return (do (if true 1))))")
  );
  assertEquals(
    error.message,
    "if in expression position requires an else branch — add an else branch, or restructure as a statement",
  );
});

Deno.test("public lexical calls reject lifted mixed spread with the exact diagnostic", () => {
  const source =
    "(func mixed-spread :args (:any callable :any items) :returns :any :body\n" +
    "  (callable (spread items) (do (return 7) 8)))\n";
  const error = assertThrows(() => lykn(source));
  assertEquals(
    error.message,
    "ordered lexical call with spread and lifted arguments is not supported",
  );
});

Deno.test("public grouped statements materialize before a bare direct return", () => {
  const generated = lykn(
    "(func grouped :returns :any :body (return (do (bind x 1 y 2))))",
  );
  const functionStart = generated.indexOf("function grouped()");
  const xDeclaration = generated.indexOf("const x = 1;", functionStart);
  const yDeclaration = generated.indexOf("const y = 2;", functionStart);
  const bareReturn = generated.indexOf("return;", yDeclaration);
  assertEquals(functionStart >= 0, true);
  assertEquals(xDeclaration > functionStart, true);
  assertEquals(yDeclaration > xDeclaration, true);
  assertEquals(bareReturn > yDeclaration, true);
});
