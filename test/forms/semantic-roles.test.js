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
  { name: "statement-match-protected-preservation", expected: "[7,[\"fallback\",7]]\n" },
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
  { name: "computed-member-ordered-throws", expected: '[["receiver",8],[true,false,false],[false,true,false],93,["base","key","string","getter","first","arg","last","call","after","base","key","string","getter","base","key","string","getter","first","arg","base","key"]]\n' },
  { name: "computed-member-no-prefix", expected: "[[1,2,3],4]\n" },
  { name: "ordered-member-pure-colon-call", expected: "4\n" },
  { name: "anonymous-completion-names", expected: '["","","","namedCallback","","","","","bound "]\n' },
  { name: "ordered-simple-assignment", expected: '[95,[10,40],5,5,40,96,50,8,8,["key","rhs","key","rhs","string","after","statement-rhs","statement-rhs","statement-after"]]\n' },
  { name: "ordered-literal-compound-assignment", expected: '[91,[10,40],14,14,40,["get","rhs","get","rhs",["convert","default"],["set",14],"after"]]\n' },
  { name: "ordinary-assignment-preservation", expected: '[[2,5,6,5,6],[7,7]]\n' },
  {
    name: "ordered-argument-spread",
    expected: '[[0,1,2,3],7,[true],[0,1,2,3],[0,1,2,3],7,["before","iterator","next0","next1","done","late","lexical","before","iterator","next0","next1","done","late","before","iterator","next0","next1","getter","before","iterator","next0","next1","done","late",["method","receiver"],"key","getter","before","operand","iterator","next0","next1","done","late",["method","receiver"]]]\n',
  },
  { name: "pure-argument-spread", expected: "[1,2,3]\n" },
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
      const sourcePath = fixture.name === "ordered-member-pure-colon-call"
        ? `${Deno.cwd()}/test/fixtures/ordered-member-calls/pure-colon-call.lykn`
        : `${Deno.cwd()}/test/fixtures/semantic-roles/${fixture.name}.lykn`;
      const source = await Deno.readTextFile(sourcePath);
      if (fixture.name === "statement-match-preservation") resetGensym();
      if (fixture.name === "original-match-kernel-object") resetMacros();
      const generated = lykn(source);
      if (
        fixture.name === "ordered-lexical-bind-call" ||
        fixture.name === "ordered-lexical-statement-call" ||
        fixture.name === "computed-member-ordered-throws" ||
        fixture.name === "computed-member-no-prefix" ||
        fixture.name === "ordered-member-pure-colon-call" ||
        fixture.name === "anonymous-completion-names" ||
        fixture.name === "ordered-simple-assignment" ||
        fixture.name === "ordered-literal-compound-assignment" ||
        fixture.name === "ordinary-assignment-preservation" ||
        fixture.name === "ordered-argument-spread" ||
        fixture.name === "pure-argument-spread"
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
        if (fixture.name === "ordered-member-pure-colon-call") {
          assertEquals(generated.includes("receiver.readEntry(3)"), true);
          assertEquals(generated.includes("lyknHostReflectApply"), false);
          assertEquals(generated.includes("Reflect.apply"), false);
        }
        if (fixture.name === "computed-member-no-prefix") {
          assertEquals(generated.includes("lyknHostReflectApply"), false);
          assertEquals(generated.includes("import "), false);
        }
        if (fixture.name === "pure-argument-spread") {
          assertEquals(generated.includes("lyknHostReflectApply"), false);
          assertEquals(generated.includes("Reflect.apply"), false);
        }
      } finally {
        await Deno.remove(temp, { recursive: true });
      }
    });
  }
});

async function runPublicOrderedMemberProvider(providerName, expectedProviderKind) {
  resetGensym();
  resetMacros();
  const fixtureRoot = `${Deno.cwd()}/test/fixtures/ordered-member-calls`;
  const providerPath = `${fixtureRoot}/${providerName}.lykn`;
  const livePath = `${fixtureRoot}/entry-live.lykn`;
  const shakenPath = `${fixtureRoot}/entry-shaken.lykn`;
  const providerSource = await Deno.readTextFile(providerPath);
  const liveSource = await Deno.readTextFile(livePath);
  const shakenSource = await Deno.readTextFile(shakenPath);
  const temp = await Deno.makeTempDir();
  const evidenceRoot = Deno.env.get("LYKN_SEMANTIC_ROLE_EVIDENCE_DIR");
  const save = async (suffix, bytes) => {
    if (evidenceRoot !== undefined) {
      await Deno.writeFile(`${evidenceRoot}/public-${providerName}-${suffix}`, bytes, {
        createNew: true,
      });
    }
  };
  const saveText = async (suffix, value) =>
    save(suffix, new TextEncoder().encode(value));

  try {
    await saveText("provider.source.lykn", providerSource);
    await saveText("entry-live.source.lykn", liveSource);
    await saveText("entry-shaken.source.lykn", shakenSource);
    const provider = lykn(providerSource);
    const live = lykn(liveSource);
    const shaken = lykn(shakenSource);
    await saveText("provider.generated.js", provider);
    await saveText("entry-live.generated.js", live);
    await saveText("entry-shaken.generated.js", shaken);

    const expanded = expand(read(providerSource));
    const direct = compile(expanded);
    const cloned = compile(structuredClone(expanded));
    const roundTripped = compile(JSON.parse(JSON.stringify(expanded)));
    await saveText("provider.expanded.json", `${JSON.stringify(expanded)}\n`);
    await saveText("provider.direct.js", direct);
    await saveText("provider.clone.js", cloned);
    await saveText("provider.json-roundtrip.js", roundTripped);

    await Deno.writeTextFile(`${temp}/provider.js`, provider);
    await Deno.writeTextFile(`${temp}/live.js`, live);
    await Deno.writeTextFile(`${temp}/shaken.js`, shaken);
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
    const run = async (name, outputPath, sourcePath, source) => {
      const args = [
        "run",
        "--no-config",
        "--cached-only",
        "--no-npm",
        "--no-remote",
        "--deny-net",
        "--no-prompt",
        `${temp}/${outputPath}`,
      ];
      const commandDescription = {
        program: Deno.execPath(),
        args,
        cwd: temp,
        sourcePath,
        source,
        selectedEnv,
      };
      await saveText(
        `${name}.command.json`,
        `${JSON.stringify(commandDescription, null, 2)}\n`,
      );
      const output = await new Deno.Command(Deno.execPath(), {
        args,
        cwd: temp,
        stdout: "piped",
        stderr: "piped",
      }).output();
      const observation = {
        status: output.code,
        success: output.success,
        stdout: Array.from(output.stdout),
        stderr: Array.from(output.stderr),
      };
      await save(`${name}.stdout.bin`, output.stdout);
      await save(`${name}.stderr.bin`, output.stderr);
      await saveText(`${name}.status.txt`, `success=${output.success} code=${output.code}\n`);
      console.log(
        `ORDERED_MEMBER_PUBLIC_PREASSERT ${providerName} ${name} ${JSON.stringify(observation)}`,
      );
      return observation;
    };

    const providerRun = await run("provider", "provider.js", providerPath, providerSource);
    const liveRun = await run("live", "live.js", livePath, liveSource);
    console.log(
      `ORDERED_MEMBER_PUBLIC_MODULE_EQUALITY ${providerName} ${
        JSON.stringify({
          direct: direct === provider,
          clone: cloned === provider,
          json: roundTripped === provider,
        })
      }`,
    );

    assertEquals(direct, provider);
    assertEquals(cloned, provider);
    assertEquals(roundTripped, provider);
    assertEquals(
      providerRun.success,
      true,
      "provider strict runtime failed",
    );
    assertEquals(
      providerRun.stderr,
      [],
      "provider strict runtime wrote stderr",
    );
    assertEquals(
      new TextDecoder().decode(new Uint8Array(providerRun.stdout)),
      "provider\n",
    );
    assertEquals(liveRun.success, true, "live entry strict runtime failed");
    assertEquals(
      liveRun.stderr,
      [],
      "live entry strict runtime wrote stderr",
    );
    const expected =
      `provider\n["${expectedProviderKind}",92,["receiver",8],["get","earlier","middle","get","earlier","middle","later","call","after"]]\n`;
    assertEquals(
      new TextDecoder().decode(new Uint8Array(liveRun.stdout)),
      expected,
    );
  } finally {
    await Deno.remove(temp, { recursive: true });
  }
}

async function runPublicSpreadHold(name, source, noHelper = false) {
  const evidenceRoot = Deno.env.get("LYKN_SEMANTIC_ROLE_EVIDENCE_DIR");
  const save = async (suffix, bytes) => {
    if (evidenceRoot !== undefined) {
      await Deno.writeFile(`${evidenceRoot}/public-${name}-${suffix}`, bytes, {
        createNew: true,
      });
    }
  };
  const saveText = async (suffix, value) =>
    save(suffix, new TextEncoder().encode(value));
  let generated = null;
  let caughtError = null;
  try {
    generated = lykn(source);
  } catch (error) {
    caughtError = error;
  }
  const observation = {
    source,
    errorName: caughtError?.name ?? null,
    errorMessage: caughtError?.message ?? null,
    generated,
  };
  await saveText("source.lykn", source);
  await saveText("preassert.json", `${JSON.stringify(observation)}\n`);
  if (generated !== null) await saveText("generated.js", generated);
  console.log(`PUBLIC_SPREAD_HOLD_PREASSERT ${name} ${JSON.stringify(observation)}`);
  assertEquals(caughtError, null, `${name} compilation threw`);
  assertEquals(typeof generated, "string", `${name} compilation omitted JavaScript`);
  if (noHelper) {
    assertEquals(generated.includes("lyknHostReflectApply"), false);
    assertEquals(generated.includes("Reflect.apply"), false);
    assertEquals(generated.includes("import "), false);
    const sourceReturn = generated.indexOf("return 7");
    const ordinaryCall = generated.indexOf("](...items)");
    assertEquals(sourceReturn >= 0 && sourceReturn < ordinaryCall, true);
  } else {
    const iteration = generated.indexOf("for (");
    const sourceReturn = generated.indexOf("return 7");
    assertEquals(iteration >= 0 && iteration < sourceReturn, true);
  }
}

Deno.test("public static member calls use the default lazy helper", async () => {
  await runPublicOrderedMemberProvider("provider-default", "local");
});

Deno.test("public static member calls use the Reflect fallback", async () => {
  await runPublicOrderedMemberProvider("provider-fallback", "inline");
});

Deno.test("public static member spread completes before a later return", async () => {
  const source =
    "(func mixed-spread :args (:any receiver :any items) :returns :any :body\n" +
    "  (receiver:read-entry (spread items) (do (return 7) 8)))\n";
  await runPublicSpreadHold("ordered-static-call-spread-hold", source);
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

Deno.test("public lexical spread completes before a later return", async () => {
  const source =
    "(func mixed-spread :args (:any callable :any items) :returns :any :body\n" +
    "  (callable (spread items) (do (return 7) 8)))\n";
  await runPublicSpreadHold("ordered-lexical-call-spread-hold", source);
});

Deno.test("public computed header return keeps the ordinary no-helper route", async () => {
  const source =
    "(func mixed-computed-spread :args (:any receiver :any items) :returns :any :body\n" +
    "  ((get receiver (do (return 7) \"method\")) (spread items)))\n";
  await runPublicSpreadHold(
    "ordered-computed-call-spread-hold",
    source,
    true,
  );
});

Deno.test("public malformed actual spread reports the checked argument-root error", () => {
  const source = "(func malformed-spread :args (:any target) :returns :any :body\n  (target (spread)))\n";
  let output = null;
  let caughtError = null;
  try {
    output = lykn(source);
  } catch (error) {
    caughtError = error;
  }
  const observation = {
    source,
    errorName: caughtError?.name ?? null,
    errorMessage: caughtError?.message ?? null,
    output,
  };
  const evidenceRoot = Deno.env.get("LYKN_SEMANTIC_ROLE_EVIDENCE_DIR");
  console.log(`MALFORMED_SPREAD_PREASSERT ${JSON.stringify(observation)}`);
  if (evidenceRoot !== undefined) {
    Deno.writeTextFileSync(
      `${evidenceRoot}/public-malformed-argument-spread.preassert.json`,
      `${JSON.stringify(observation)}\n`,
      { createNew: true },
    );
  }
  assertEquals(caughtError instanceof Error, true);
  assertEquals(caughtError.message, "spread takes exactly one argument");
  assertEquals(output, null, "malformed spread returned compiled output");
});

Deno.test("public direct lifted protected writes retain the v1 rejection", () => {
  const source = [
    "(func blocked :args () :returns :any :body",
    "  (kernel:= (get Reflect \"apply\") (do 0 0)))",
    "",
  ].join("\n");
  let output = null;
  let caughtError = null;
  try {
    output = lykn(source);
  } catch (error) {
    caughtError = error;
  }
  const observation = {
    source,
    errorName: caughtError?.name ?? null,
    errorMessage: caughtError?.message ?? null,
    output,
    outputReturned: caughtError === null,
  };
  const evidenceRoot = Deno.env.get("LYKN_SEMANTIC_ROLE_EVIDENCE_DIR");
  if (evidenceRoot !== undefined) {
    Deno.writeTextFileSync(
      `${evidenceRoot}/public-protected-write.source.lykn`,
      source,
      { createNew: true },
    );
    Deno.writeTextFileSync(
      `${evidenceRoot}/public-protected-write.preassert.json`,
      `${JSON.stringify(observation)}\n`,
      { createNew: true },
    );
  }
  assertEquals(caughtError instanceof Error, true, "protected write did not throw Error");
  assertEquals(observation.errorName, "Error");
  assertEquals(
    observation.errorMessage,
    "host-contract v1: write to protected slot Reflect.apply",
  );
  assertEquals(observation.output, null, "protected write returned output");
  assertEquals(observation.outputReturned, false, "protected write returned output");
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
