// Tests for move-function.js — the byte-exact function-move tool.
// Run via: deno test -A scripts/move-function.test.js
//
// TDD-first paired commits: each ledger row adds a test-only commit (red)
// before the fix-only commit (green). See arc04/slice01 ledger.

import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import { locateDeclaration } from "./move-function.js";

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
