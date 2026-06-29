// Tests for move-function.js — the byte-exact function-move tool.
// Run via: deno test -A scripts/move-function.test.js
//
// TDD-first paired commits: each ledger row adds a test-only commit (red)
// before the fix-only commit (green). See arc04/slice01 ledger.

import {
  assertEquals,
  assertRejects,
  assertStringIncludes,
} from "https://deno.land/std/assert/mod.ts";
import {
  addNamedImport,
  importResolvesTo,
  insertDeclaration,
  locateDeclaration,
  moveFunction,
  removeDeclaration,
  rewriteImportSource,
  stripReExport,
} from "./move-function.js";

/**
 * Run `fn` with a temp dir holding from.js / to.js, cleaning up afterward.
 */
async function withTempFiles(fromContent, toContent, fn) {
  const dir = await Deno.makeTempDir({ prefix: "movefn-" });
  const from = `${dir}/from.js`;
  const to = `${dir}/to.js`;
  await Deno.writeTextFile(from, fromContent);
  await Deno.writeTextFile(to, toContent);
  try {
    return await fn({ dir, from, to });
  } finally {
    await Deno.remove(dir, { recursive: true });
  }
}

// ── F-1: scaffold + first failing locate test ──────────────────────────

Deno.test("locateDeclaration: finds an exported function declaration", () => {
  const src = `export function foo() {\n  return 1;\n}\n`;
  const loc = locateDeclaration(src, "foo");
  assertEquals(loc.exported, true);
  assertEquals(loc.kind, "function");
  assertEquals(src.slice(loc.start, loc.end), "function foo() {\n  return 1;\n}");
});

// ── F-2: all declaration shapes + leading-comment extension ────────────

Deno.test("locateDeclaration: non-exported function", () => {
  const src = `function bar(x) {\n  return x;\n}\n`;
  const loc = locateDeclaration(src, "bar");
  assertEquals(loc.exported, false);
  assertEquals(loc.kind, "function");
  assertEquals(src.slice(loc.start, loc.end), "function bar(x) {\n  return x;\n}");
});

Deno.test("locateDeclaration: exported generator function*", () => {
  const src = `export function* gen() {\n  yield 1;\n}\n`;
  const loc = locateDeclaration(src, "gen");
  assertEquals(loc.exported, true);
  assertEquals(loc.kind, "function*");
  assertEquals(src.slice(loc.start, loc.end), "function* gen() {\n  yield 1;\n}");
});

Deno.test("locateDeclaration: exported const arrow", () => {
  const src = `export const add = (a, b) => a + b;\n`;
  const loc = locateDeclaration(src, "add");
  assertEquals(loc.exported, true);
  assertEquals(loc.kind, "const");
  assertEquals(src.slice(loc.start, loc.end), "const add = (a, b) => a + b;");
});

Deno.test("locateDeclaration: returns null for an absent name", () => {
  const src = `export function foo() {}\n`;
  assertEquals(locateDeclaration(src, "nope"), null);
});

Deno.test("locateDeclaration: leading doc comment travels in spanWithComments", () => {
  const src =
    `const x = 1;\n\n/**\n * doc for baz\n */\nexport function baz() {\n  return 2;\n}\n`;
  const loc = locateDeclaration(src, "baz");
  // declaration span excludes the comment...
  assertEquals(src.slice(loc.start, loc.end), "function baz() {\n  return 2;\n}");
  // ...but spanWithComments includes the contiguous JSDoc block and the export.
  assertEquals(
    src.slice(loc.spanWithComments.start, loc.spanWithComments.end),
    "/**\n * doc for baz\n */\nexport function baz() {\n  return 2;\n}",
  );
});

// ── F-3: remove / insert + byte-identity invariant ─────────────────────

Deno.test("removeDeclaration: rest byte-identical, one adjoining newline gone", () => {
  const src = `const a = 1;\nfunction foo() {\n  return 2;\n}\nconst b = 3;\n`;
  const loc = locateDeclaration(src, "foo");
  assertEquals(
    removeDeclaration(src, loc.spanWithComments),
    `const a = 1;\nconst b = 3;\n`,
  );
});

Deno.test("removeDeclaration: takes the export wrapper and the doc comment", () => {
  const src = `const a = 1;\n\n/** doc */\nexport function foo() {\n  return 2;\n}\nconst b = 3;\n`;
  const loc = locateDeclaration(src, "foo");
  assertEquals(
    removeDeclaration(src, loc.spanWithComments),
    `const a = 1;\n\nconst b = 3;\n`,
  );
});

Deno.test("insertDeclaration: appends after last statement, one blank line, trailing newline", () => {
  const target = `const x = 0;\n`;
  const unit = `export function foo() {\n  return 2;\n}`;
  assertEquals(
    insertDeclaration(target, unit),
    `const x = 0;\n\nexport function foo() {\n  return 2;\n}\n`,
  );
});

Deno.test("byte-identity invariant (§2): moved declaration bytes === source bytes", () => {
  const from = `export function foo() {\n  return 41 + 1;\n}\n`;
  const loc = locateDeclaration(from, "foo");
  const declBytes = from.slice(loc.start, loc.end);
  const to = insertDeclaration(`const x = 0;\n`, `export ${declBytes}`);
  const locTo = locateDeclaration(to, "foo");
  assertEquals(to.slice(locTo.start, locTo.end), declBytes);
});

// ── F-4: addNamedImport + stripReExport ────────────────────────────────

Deno.test("addNamedImport: merges into an existing import from the same specifier", () => {
  const t = `import { a } from "./x.js";\nconst y = 1;\n`;
  assertEquals(
    addNamedImport(t, "b", "./x.js"),
    `import { a, b } from "./x.js";\nconst y = 1;\n`,
  );
});

Deno.test("addNamedImport: idempotent when already imported", () => {
  const t = `import { a, b } from "./x.js";\n`;
  assertEquals(addNamedImport(t, "b", "./x.js"), t);
});

Deno.test("addNamedImport: new import line after the last import", () => {
  const t = `import { a } from "./x.js";\nconst y = 1;\n`;
  assertEquals(
    addNamedImport(t, "b", "./z.js"),
    `import { a } from "./x.js";\nimport { b } from "./z.js";\nconst y = 1;\n`,
  );
});

Deno.test("addNamedImport: new import at top when no imports exist", () => {
  const t = `const y = 1;\n`;
  assertEquals(addNamedImport(t, "b", "./z.js"), `import { b } from "./z.js";\nconst y = 1;\n`);
});

Deno.test("stripReExport: removes one name, keeps the rest", () => {
  const t = `export { a, b, c } from "./x.js";\n`;
  assertEquals(stripReExport(t, "b", "./x.js"), `export { a, c } from "./x.js";\n`);
});

Deno.test("stripReExport: deletes the statement when its list empties", () => {
  const t = `export { only } from "./x.js";\nconst z = 1;\n`;
  assertEquals(stripReExport(t, "only", "./x.js"), `const z = 1;\n`);
});

Deno.test("stripReExport: leaves a re-export from a different specifier intact", () => {
  const t = `export { a } from "./x.js";\nexport { b } from "./y.js";\n`;
  assertEquals(stripReExport(t, "a", "./x.js"), `export { b } from "./y.js";\n`);
});

// ── F-5: moveFunction orchestration (Layer 2) + abort conditions ───────

Deno.test("moveFunction: e2e move, internal ref → back-import; TO byte-identical, exported once", async () => {
  const fromSrc =
    `function helper(x) {\n  return x * 2;\n}\n\nexport function useIt(n) {\n  return helper(n);\n}\n`;
  await withTempFiles(fromSrc, `export const TAG = "to";\n`, async ({ from, to }) => {
    await moveFunction({ from, to, name: "helper" });
    const newFrom = await Deno.readTextFile(from);
    const newTo = await Deno.readTextFile(to);

    assertEquals(locateDeclaration(newFrom, "helper"), null);
    assertStringIncludes(newFrom, `import { helper } from "./to.js";`);

    const locTo = locateDeclaration(newTo, "helper");
    assertEquals(locTo.exported, true);
    assertEquals(newTo.slice(locTo.start, locTo.end), "function helper(x) {\n  return x * 2;\n}");
  });
});

Deno.test("moveFunction: no internal reference → no back-import added", async () => {
  const fromSrc = `function helper(x) {\n  return x * 2;\n}\n\nexport const other = 1;\n`;
  await withTempFiles(fromSrc, `export const TAG = "to";\n`, async ({ from, to }) => {
    await moveFunction({ from, to, name: "helper" });
    const newFrom = await Deno.readTextFile(from);
    assertEquals(locateDeclaration(newFrom, "helper"), null);
    assertEquals(newFrom.includes("import"), false);
  });
});

Deno.test("moveFunction: strips a pre-existing alias re-export in TO", async () => {
  const fromSrc = `export function widget() {\n  return 1;\n}\n`;
  const toSrc = `export { widget } from "./from.js";\nexport const TAG = 1;\n`;
  await withTempFiles(fromSrc, toSrc, async ({ from, to }) => {
    await moveFunction({ from, to, name: "widget" });
    const newTo = await Deno.readTextFile(to);
    const locTo = locateDeclaration(newTo, "widget");
    assertEquals(newTo.slice(locTo.start, locTo.end), "function widget() {\n  return 1;\n}");
    assertEquals(newTo.includes(`from "./from.js"`), false); // alias re-export gone
  });
});

Deno.test("moveFunction: aborts when name not found, writes nothing", async () => {
  const fromSrc = `export function foo() {}\n`;
  await withTempFiles(fromSrc, `export const TAG = 1;\n`, async ({ from, to }) => {
    await assertRejects(() => moveFunction({ from, to, name: "nope" }), Error, "not found");
    assertEquals(await Deno.readTextFile(from), fromSrc);
  });
});

Deno.test("moveFunction: aborts on collision (name already in TO), writes nothing", async () => {
  const fromSrc = `export function helper() {}\n`;
  const toSrc = `export function helper() {}\n`;
  await withTempFiles(fromSrc, toSrc, async ({ from, to }) => {
    await assertRejects(() => moveFunction({ from, to, name: "helper" }), Error, "collision");
    assertEquals(await Deno.readTextFile(from), fromSrc);
    assertEquals(await Deno.readTextFile(to), toSrc);
  });
});

Deno.test("moveFunction: aborts on ambiguous (two top-level declarations)", async () => {
  const fromSrc = `var thing = 1;\nvar thing = 2;\n`;
  await withTempFiles(fromSrc, `export const TAG = 1;\n`, async ({ from, to }) => {
    await assertRejects(() => moveFunction({ from, to, name: "thing" }), Error, "ambiguous");
    assertEquals(await Deno.readTextFile(from), fromSrc);
  });
});

// ── F-6: verify gate + auto-revert + dry-run ───────────────────────────

const MOVE_FROM = `function helper(x) {\n  return x * 2;\n}\n\nexport function useIt(n) {\n  return helper(n);\n}\n`;
const MOVE_TO = `export const TAG = "to";\n`;

Deno.test("dry-run: writes nothing, returns the computed plan", async () => {
  await withTempFiles(MOVE_FROM, MOVE_TO, async ({ from, to }) => {
    const result = await moveFunction({ from, to, name: "helper", dryRun: true });
    assertEquals(result.written, false);
    assertStringIncludes(result.newTo, "function helper(x)");
    // disk unchanged
    assertEquals(await Deno.readTextFile(from), MOVE_FROM);
    assertEquals(await Deno.readTextFile(to), MOVE_TO);
  });
});

Deno.test("verify gate: failing verify reverts both files byte-exactly and throws", async () => {
  await withTempFiles(MOVE_FROM, MOVE_TO, async ({ from, to }) => {
    await assertRejects(
      () =>
        moveFunction({
          from,
          to,
          name: "helper",
          verify: () => Promise.resolve({ success: false, output: "boom" }),
        }),
      Error,
      "verify failed",
    );
    assertEquals(await Deno.readTextFile(from), MOVE_FROM);
    assertEquals(await Deno.readTextFile(to), MOVE_TO);
  });
});

Deno.test("verify gate: passing verify keeps the move", async () => {
  await withTempFiles(MOVE_FROM, MOVE_TO, async ({ from, to }) => {
    const result = await moveFunction({
      from,
      to,
      name: "helper",
      verify: () => Promise.resolve({ success: true, output: "" }),
    });
    assertEquals(result.written, true);
    assertEquals(locateDeclaration(await Deno.readTextFile(from), "helper"), null);
    assertStringIncludes(await Deno.readTextFile(to), "function helper(x)");
  });
});

// ── slice02 F-1: rewriteImportSource + path resolution ─────────────────

Deno.test("rewriteImportSource: moves a name from one import source to another", () => {
  const t = `import { a } from "./old.js";\nimport { z } from "./other.js";\n`;
  assertEquals(
    rewriteImportSource(t, "a", "./old.js", "./new.js"),
    `import { z } from "./other.js";\nimport { a } from "./new.js";\n`,
  );
});

Deno.test("rewriteImportSource: merges into a pre-existing destination import", () => {
  const t = `import { a } from "./old.js";\nimport { z } from "./new.js";\n`;
  assertEquals(
    rewriteImportSource(t, "a", "./old.js", "./new.js"),
    `import { z, a } from "./new.js";\n`,
  );
});

Deno.test("rewriteImportSource: keeps other names in the origin import", () => {
  const t = `import { a, b } from "./old.js";\n`;
  assertEquals(
    rewriteImportSource(t, "a", "./old.js", "./new.js"),
    `import { b } from "./old.js";\nimport { a } from "./new.js";\n`,
  );
});

Deno.test("rewriteImportSource: no-op when name is not imported from oldSpecifier", () => {
  const t = `import { a } from "./elsewhere.js";\n`;
  assertEquals(rewriteImportSource(t, "a", "./old.js", "./new.js"), t);
});

Deno.test("importResolvesTo: ./surface.js and ../lang/surface.js resolve to the same module", () => {
  // consumer in packages/lang importing "./surface.js"
  assertEquals(
    importResolvesTo("packages/lang/classifier.js", "./surface.js", "packages/lang/surface.js"),
    true,
  );
  // consumer in packages/other importing "../lang/surface.js" — same target
  assertEquals(
    importResolvesTo("packages/other/x.js", "../lang/surface.js", "packages/lang/surface.js"),
    true,
  );
  // a different module does not match
  assertEquals(
    importResolvesTo("packages/lang/classifier.js", "./helpers.js", "packages/lang/surface.js"),
    false,
  );
});

// ── slice02 F-2: consumer discovery + rewire + atomic multi-file revert ─

/** Run `fn` with a temp dir populated from a {filename: content} map. */
async function withTempProject(files, fn) {
  const dir = await Deno.makeTempDir({ prefix: "movefn-proj-" });
  for (const [fileName, content] of Object.entries(files)) {
    await Deno.writeTextFile(`${dir}/${fileName}`, content);
  }
  try {
    return await fn(dir);
  } finally {
    await Deno.remove(dir, { recursive: true });
  }
}

Deno.test("moveFunction: rewires a consumer importing the moved name from FROM", async () => {
  await withTempProject({
    "from.js": `export function widget() {\n  return 1;\n}\n`,
    "to.js": `export const TAG = 1;\n`,
    "consumer.js": `import { widget, other } from "./from.js";\nexport const w = widget() + other;\n`,
    "reexporter-consumer.js": `import { widget } from "./helpers.js";\nexport const r = widget;\n`,
  }, async (dir) => {
    await moveFunction({ from: `${dir}/from.js`, to: `${dir}/to.js`, name: "widget", consumerDir: dir });

    // byte-identity preserved in TO
    const newTo = await Deno.readTextFile(`${dir}/to.js`);
    const locTo = locateDeclaration(newTo, "widget");
    assertEquals(newTo.slice(locTo.start, locTo.end), "function widget() {\n  return 1;\n}");

    // consumer rewired FROM→TO; its other import untouched
    const consumer = await Deno.readTextFile(`${dir}/consumer.js`);
    assertStringIncludes(consumer, `from "./to.js"`);
    assertStringIncludes(consumer, `other`);
    assertEquals(consumer.includes(`widget } from "./from.js"`), false);

    // a consumer importing from a re-exporter (not FROM) is left alone
    assertStringIncludes(
      await Deno.readTextFile(`${dir}/reexporter-consumer.js`),
      `import { widget } from "./helpers.js";`,
    );
  });
});

Deno.test("moveFunction: failing verify reverts FROM, TO, and all rewired consumers", async () => {
  const fromSrc = `export function widget() {\n  return 1;\n}\n`;
  const toSrc = `export const TAG = 1;\n`;
  const c1 = `import { widget } from "./from.js";\nexport const a = widget;\n`;
  const c2 = `import { widget } from "./from.js";\nexport const b = widget;\n`;
  await withTempProject({ "from.js": fromSrc, "to.js": toSrc, "c1.js": c1, "c2.js": c2 }, async (dir) => {
    await assertRejects(
      () =>
        moveFunction({
          from: `${dir}/from.js`,
          to: `${dir}/to.js`,
          name: "widget",
          consumerDir: dir,
          verify: () => Promise.resolve({ success: false, output: "boom" }),
        }),
      Error,
      "verify failed",
    );
    assertEquals(await Deno.readTextFile(`${dir}/from.js`), fromSrc);
    assertEquals(await Deno.readTextFile(`${dir}/to.js`), toSrc);
    assertEquals(await Deno.readTextFile(`${dir}/c1.js`), c1);
    assertEquals(await Deno.readTextFile(`${dir}/c2.js`), c2);
  });
});
