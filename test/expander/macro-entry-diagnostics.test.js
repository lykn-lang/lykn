// 01-macro-entry-diagnostics — JS behavioral tests for the `import-macros`
// resolution diagnostics (the Rust leaf is covered by pass0.rs unit tests;
// M-4's parity test asserts the two message bodies stay byte-identical).
//
// M-1: a MISSING package directory must not emit the `lykn.macroEntry` hint.
// M-2: a directory that exists but has no entry keeps the good hint.
// M-3: overlay provenance names the specifier + both exits.
// Anchored at Deno.cwd() per test/CONVENTIONS.md.

import { assert, assertStringIncludes } from "https://deno.land/std/assert/mod.ts";
import { findMacroEntry } from "lang/expander.js";

Deno.test("M-1: missing package directory is not the lykn.macroEntry hint", () => {
  const missing = `${Deno.makeTempDirSync()}/absent-xyz`;
  let msg = "";
  try {
    findMacroEntry(missing);
    throw new Error("expected findMacroEntry to throw");
  } catch (e) {
    msg = e.message;
  }
  assertStringIncludes(msg, "package directory not found");
  assert(
    !msg.includes("lykn.macroEntry"),
    `missing dir must NOT emit the macroEntry hint, got: ${msg}`,
  );
});

Deno.test("M-2: directory present with no entry keeps the good hint (regression guard)", () => {
  const dir = Deno.makeTempDirSync(); // exists, but has no macro entry
  let msg = "";
  try {
    findMacroEntry(dir);
    throw new Error("expected findMacroEntry to throw");
  } catch (e) {
    msg = e.message;
  }
  assertStringIncludes(msg, "no macro entry found in");
  assertStringIncludes(msg, "hint: add lykn.macroEntry to the package's deno.json");
});

Deno.test("M-3: overlay provenance names the specifier and both exits", () => {
  const missing = `${Deno.makeTempDirSync()}/absent-overlay`;
  let msg = "";
  try {
    findMacroEntry(missing, {
      specifier: "jsr:@lykn/testing@0.5.2",
      viaOverlay: true,
    });
    throw new Error("expected findMacroEntry to throw");
  } catch (e) {
    msg = e.message;
  }
  assertStringIncludes(msg, "package directory not found");
  assertStringIncludes(msg, "specifier: jsr:@lykn/testing@0.5.2");
  assertStringIncludes(msg, "via: lykn link overlay (project.local.json)");
  assertStringIncludes(msg, "lykn unlink jsr:@lykn/testing@0.5.2");
  assertStringIncludes(msg, "lykn dist");
});
