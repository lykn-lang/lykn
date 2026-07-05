// A-7 parity guard (arc10/slice03): the JS kernel-form sets
// (`packages/lang/kernel-forms.js`) MUST stay identical to the Rust source of
// truth (`crates/lykn-lang/src/classifier/dispatch.rs`). DD-58 correctness
// depends on both compilers agreeing on which forms are kernel and which are
// kernel-only. This test parses both and fails on any set difference — killing
// the duplication-drift risk filed in slice02.
//
// Runs in `make check` via `deno test` (test-js). Demonstrated to fail on a
// seeded mismatch (closing report); passes on the real sets.

import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import { dirname, fromFileUrl, resolve } from "https://deno.land/std/path/mod.ts";
import { KERNEL_FORMS, KERNEL_ONLY_FORMS } from "lang/kernel-forms.js";

const repoRoot = resolve(dirname(fromFileUrl(import.meta.url)), "../..");
const dispatchPath = resolve(
  repoRoot,
  "crates/lykn-lang/src/classifier/dispatch.rs",
);
const rust = Deno.readTextFileSync(dispatchPath);

/** Extract the string literals from a slice of Rust source. */
function stringLiterals(src) {
  return [...src.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]);
}

function parseRustKernelForms() {
  const block = rust.match(/pub const KERNEL_FORMS[^=]*=\s*&\[([\s\S]*?)\];/);
  if (!block) throw new Error("could not locate Rust KERNEL_FORMS");
  return new Set(stringLiterals(block[1]));
}

function parseRustKernelOnly() {
  const block = rust.match(
    /pub fn is_kernel_only_form[\s\S]*?matches!\(\s*name\s*,([\s\S]*?)\)\s*\}/,
  );
  if (!block) throw new Error("could not locate Rust is_kernel_only_form");
  return new Set(stringLiterals(block[1]));
}

/** Assert two sets are equal, reporting the symmetric difference. */
function assertSetEqual(rustSet, jsSet, label) {
  const onlyRust = [...rustSet].filter((x) => !jsSet.has(x)).sort();
  const onlyJs = [...jsSet].filter((x) => !rustSet.has(x)).sort();
  assertEquals(
    { onlyRust, onlyJs },
    { onlyRust: [], onlyJs: [] },
    `${label} diverged between Rust (dispatch.rs) and JS (kernel-forms.js) — ` +
      `keep them in sync (arc10/slice02 divergence-risk).`,
  );
}

Deno.test("A-7 parity: KERNEL_FORMS identical (Rust vs JS)", () => {
  assertSetEqual(parseRustKernelForms(), KERNEL_FORMS, "KERNEL_FORMS");
});

Deno.test("A-7 parity: kernel-only set identical (Rust vs JS)", () => {
  assertSetEqual(parseRustKernelOnly(), KERNEL_ONLY_FORMS, "KERNEL_ONLY_FORMS");
});
