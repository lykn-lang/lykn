// 01-macro-entry-diagnostics M-4 — cross-compiler parity for the `import-macros`
// resolution diagnostics.
//
// The macro-entry error messages exist TWICE — Rust `find_macro_entry` /
// `macro_dir_not_found_message` / `no_macro_entry_message`
// (crates/lykn-lang/src/expander/pass0.rs) and JS `findMacroEntry` /
// `macroDirNotFoundMessage` / `noMacroEntryMessage` (packages/lang/expander.js).
// They had ALREADY drifted (Rust listed the checked candidates on two lines with
// a parenthetical; JS on one line without it) because nothing compared them.
//
// This test is the drift detector (the structural point of the slice, not a
// nicety): every canonical phrase of both diagnostics must appear VERBATIM in
// BOTH source files. Seeded-drift demo: change any phrase in one file only and
// this test fails until the other file matches.
//
// Source-based (the DD-60/reserved-words-parity precedent) — the two message
// bodies are format strings with interpolated paths/specifiers, so we compare
// the static phrase content, not a live invocation. Anchored at Deno.cwd()
// (repo root) per test/CONVENTIONS.md.

import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import { resolve } from "https://deno.land/std/path/mod.ts";

const root = Deno.cwd();
const RUST = Deno.readTextFileSync(
  resolve(root, "crates/lykn-lang/src/expander/pass0.rs"),
);
const JS = Deno.readTextFileSync(
  resolve(root, "packages/lang/expander.js"),
);

// The canonical phrases. Each must appear verbatim in BOTH implementations.
// Leading indentation is omitted (Rust's line-continuation adds source-file
// whitespace that isn't in the emitted string) — the phrase content is what
// must not drift.
const CANONICAL = [
  // package-directory-not-found (M-1) + overlay provenance (M-3)
  "import-macros: package directory not found: ",
  "specifier: ",
  "via: lykn link overlay (project.local.json)",
  "hint: run 'lykn dist' in the linked project, or 'lykn unlink ",
  // directory-present-no-entry (M-2)
  "import-macros: no macro entry found in ",
  "checked: lykn.macroEntry, mod.lykn, mod.lyk, macros.lykn, macros.lyk, index.lykn, index.lyk",
  "hint: add lykn.macroEntry to the package's deno.json",
];

Deno.test("macro-entry diagnostics parity: every canonical phrase is in both compilers", () => {
  const missingFromRust = CANONICAL.filter((p) => !RUST.includes(p));
  const missingFromJs = CANONICAL.filter((p) => !JS.includes(p));
  assertEquals(
    { missingFromRust, missingFromJs },
    { missingFromRust: [], missingFromJs: [] },
    "macro-entry diagnostic drifted between Rust (pass0.rs) and JS (expander.js)",
  );
});
