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
