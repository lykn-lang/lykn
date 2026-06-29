// Tests for move-function.js — the byte-exact function-move tool.
// Run via: deno test -A scripts/move-function.test.js
//
// TDD-first paired commits: each ledger row adds a test-only commit (red)
// before the fix-only commit (green). See arc04/slice01 ledger.

import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import {
  addNamedImport,
  insertDeclaration,
  locateDeclaration,
  removeDeclaration,
  stripReExport,
} from "./move-function.js";

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
  const t = `export { a } from "./x.js";\nexport { a } from "./y.js";\n`;
  assertEquals(stripReExport(t, "a", "./x.js"), `export { a } from "./y.js";\n`);
});
