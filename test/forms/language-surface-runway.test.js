import {
  assertEquals,
  assertStringIncludes,
  assertThrows,
} from "jsr:@std/assert";
import {
  compile as compileExpanded,
  expandExpr,
  lykn,
  read,
} from "../../packages/lang/mod.js";

Deno.test("language surface runway: grouped bind emits sequential constants", () => {
  const result = lykn(`
    (func normalize :args (:any record) :body
      (bind
        email record
        role email)
      role)
  `);
  assertStringIncludes(result, "const email = record;");
  assertStringIncludes(result, "const role = email;");
  assertStringIncludes(result, "return role;");
});

Deno.test("language surface runway: cond expression emits valid value JS", () => {
  const result = lykn(`
    (func role-label :args (:string role) :body
      (cond
        ((= role "admin") "Admin")
        (:else "User")))
  `);
  assertStringIncludes(result, 'role === "admin" ? "Admin" : "User"');
});

Deno.test("language surface runway: cond expression without else rejects", () => {
  assertThrows(
    () => lykn('(bind label (cond ((= role "admin") "Admin")))'),
    Error,
    "if in expression position requires an else branch",
  );
});

Deno.test("language surface runway: exports emits named export list", () => {
  const result = lykn(`
    (exports normalize-role)
    (func normalize-role :args (:string role) :body role)
  `);
  assertStringIncludes(result, "export {normalizeRole};");
});

Deno.test("language surface runway: multi-clause func rejects same typed overlap", () => {
  assertThrows(
    () =>
      lykn(`
        (func bad
          (:args (:number x)
           :body (* x 2))
          (:args (:number x)
           :body (+ x 1)))
      `),
    Error,
    "bad: clauses 0 and 1 overlap (same arity 1, compatible types)",
  );
});

Deno.test("language surface runway: multi-clause func rejects :any overlap", () => {
  assertThrows(
    () =>
      lykn(`
        (func also-bad
          (:args (:number x)
           :body (* x 2))
          (:args (:any x)
           :body (console:log x)))
      `),
    Error,
    "also-bad: clauses 0 and 1 overlap (same arity 1, compatible types)",
  );
});

Deno.test("language surface runway: multi-clause func rejects destructured overlap", () => {
  assertThrows(
    () =>
      lykn(`
        (func bad
          (:args ((object :string name))
           :body name)
          (:args ((object :number id))
           :body id))
      `),
    Error,
    "bad: clauses 0 and 1 overlap (same arity 1, compatible types)",
  );
});

Deno.test("language surface runway: strict public compiler runs recursive ADT patterns", async () => {
  const source = await Deno.readTextFile(
    "test/fixtures/semantic-roles/adt-pattern-correctness.lykn",
  );
  const generated = lykn(source);
  const directory = await Deno.makeTempDir({ prefix: "lykn-public-adt-pattern-" });
  const outputPath = `${directory}/probe.js`;
  try {
    await Deno.writeTextFile(outputPath, generated);
    const result = await new Deno.Command(Deno.execPath(), {
      args: ["run", "--no-config", "--cached-only", "--no-prompt", outputPath],
      cwd: directory,
      stdout: "piped",
      stderr: "piped",
    }).output();
    assertEquals(result.code, 0, new TextDecoder().decode(result.stderr));
    assertEquals(
      new TextDecoder().decode(result.stdout),
      "[7,\"outer\",\"inner\",\"null\",\"missing\",\"literal\",\"safe\",\"false\",\"null\",\"undefined\",9,false,0,\"\",4,6,\"selected\",[\"match: no matching pattern\"],true,true,\"list\",\"safe\",\"bare\",null,false,false,null,\"number\",\"safe\",\"string\",7,\"wildcard\",\"safe\",\"safe\",[\"outer.value\",\"inner.value\",\"wrong.inner.value\"],8,\"wildcard\",[\"object.child\"],[5]]\n",
    );
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
});

Deno.test("language surface runway: private fields preserve same-named user macros", async () => {
  const source = await Deno.readTextFile(
    "test/fixtures/semantic-roles/adt-pattern-macro-hygiene.lykn",
  );
  const generated = lykn(source);
  const directory = await Deno.makeTempDir({ prefix: "lykn-public-adt-hygiene-" });
  const outputPath = `${directory}/probe.js`;
  try {
    await Deno.writeTextFile(outputPath, generated);
    const result = await new Deno.Command(Deno.execPath(), {
      args: ["run", "--no-config", "--cached-only", "--no-prompt", outputPath],
      cwd: directory,
      stdout: "piped",
      stderr: "piped",
    }).output();
    assertEquals(result.code, 0, new TextDecoder().decode(result.stderr));
    assertEquals(
      new TextDecoder().decode(result.stdout),
      "[[[[90,91],5,42]],[[90,91],6,42],[[90,91],7,42],[[90,91],8,42],[[90,91],9,42]]\n",
    );
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
});

Deno.test("language surface runway: public expandExpr finalizes private pattern fields", async () => {
  const forms = read(`
    (type PublicOption (PublicSome :any value) PublicNone)
    (console:log (match (PublicSome 7)
      ((PublicSome value) value)
      (_ -1)))
  `);
  const expanded = forms.flatMap((form) => {
    const result = expandExpr(form);
    return Array.isArray(result) ? result : [result];
  });
  const generated = compileExpanded(expanded);
  assertStringIncludes(generated, "patternField__gensym");
  assertEquals(generated.includes("__private"), false);
  const directory = await Deno.makeTempDir({ prefix: "lykn-expand-expr-adt-" });
  const outputPath = `${directory}/probe.js`;
  try {
    await Deno.writeTextFile(outputPath, generated);
    const result = await new Deno.Command(Deno.execPath(), {
      args: ["run", "--no-config", "--cached-only", "--no-prompt", outputPath],
      cwd: directory,
      stdout: "piped",
      stderr: "piped",
    }).output();
    assertEquals(result.code, 0, new TextDecoder().decode(result.stderr));
    assertEquals(new TextDecoder().decode(result.stdout), "7\n");
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
});

Deno.test("language surface runway: unregistered ADTs retain positional fallback", async () => {
  const generated = lykn(`
    (console:log (match (obj :tag "Legacy" :payload 13)
      ((Legacy value) value)
      (_ -1)))
  `);
  const directory = await Deno.makeTempDir({ prefix: "lykn-legacy-adt-" });
  const outputPath = `${directory}/probe.js`;
  try {
    await Deno.writeTextFile(outputPath, generated);
    const result = await new Deno.Command(Deno.execPath(), {
      args: ["run", "--no-config", "--cached-only", "--no-prompt", outputPath],
      cwd: directory,
      stdout: "piped",
      stderr: "piped",
    }).output();
    assertEquals(result.code, 0, new TextDecoder().decode(result.stderr));
    assertEquals(new TextDecoder().decode(result.stdout), "13\n");
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
});
