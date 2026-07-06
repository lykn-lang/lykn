// DD-60 D2 / DD-61 — three-way parity for the reserved-word list (slice03 F-4;
// the A-7 kernel-forms precedent, now three-way):
//
//   Rust list  (crates/lykn-lang/src/binding.rs RESERVED_WORDS)
//   ≡ JS list  (packages/lang/reserved-words.js RESERVED_WORDS)
//   ≡ probe    (empirical `const <name> = 0;` legality — the DD-60 D2 authority)
//
// Rust≡JS is checked exactly (every word). The empirical leg pins both lists to
// the probe's *method*: every listed word must actually fail to parse as a
// binding identifier, and a set of look-alikes that ARE legal must pass. List
// *completeness* (did we miss a reserved word?) is covered by the matrix
// re-probe (slice03 F-5): a missing word leaves its D2 cell at invalid-output.
//
// Runs in `make check` (test-suite). Seeded-drift demo: add a bogus word to
// either list → Rust≡JS fails; add a non-reserved word → the empirical leg
// fails (documented in the closing report).

import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import {
  dirname,
  fromFileUrl,
  resolve,
} from "https://deno.land/std/path/mod.ts";
import { RESERVED_WORDS as JS_LIST } from "lang/reserved-words.js";

const repoRoot = resolve(dirname(fromFileUrl(import.meta.url)), "../..");

/** Parse the Rust RESERVED_WORDS array's string literals. */
function parseRustList() {
  const src = Deno.readTextFileSync(
    resolve(repoRoot, "crates/lykn-lang/src/binding.rs"),
  );
  const block = src.match(/pub const RESERVED_WORDS[^=]*=\s*&\[([\s\S]*?)\];/);
  if (!block) throw new Error("could not locate Rust RESERVED_WORDS");
  return [...block[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]);
}

/** The probe's legality test: does `const <name> = 0;` parse as a module? */
function isLegalIdent(name) {
  const tmp = Deno.makeTempFileSync({ suffix: ".js" });
  try {
    Deno.writeTextFileSync(tmp, `const ${name} = 0;\n`);
    return new Deno.Command("deno", {
      args: ["check", tmp],
      stdout: "null",
      stderr: "null",
    }).outputSync().success;
  } finally {
    Deno.removeSync(tmp);
  }
}

Deno.test("reserved-words parity: Rust list ≡ JS list (exact)", () => {
  const rust = new Set(parseRustList());
  const js = new Set(JS_LIST);
  const onlyRust = [...rust].filter((x) => !js.has(x)).sort();
  const onlyJs = [...js].filter((x) => !rust.has(x)).sort();
  assertEquals(
    { onlyRust, onlyJs },
    { onlyRust: [], onlyJs: [] },
    "RESERVED_WORDS diverged between Rust (binding.rs) and JS (reserved-words.js)",
  );
});

Deno.test("reserved-words parity: every listed word IS reserved (probe)", () => {
  // The critical direction: no false entries — every word we reject really is
  // an illegal binding identifier per the empirical authority.
  const notActuallyReserved = JS_LIST.filter((w) => isLegalIdent(w));
  assertEquals(
    notActuallyReserved,
    [],
    "these words are in RESERVED_WORDS but `const <name> = 0` parses fine — " +
      "they are legal identifiers and must be removed",
  );
});

Deno.test("reserved-words parity: legal look-alikes are NOT reserved (probe)", () => {
  // Contextual keywords that ARE valid as `const` names — must never creep in.
  const legalSentinels = [
    "async",
    "await",
    "yield",
    "get",
    "set",
    "of",
    "as",
    "from",
    "widget",
  ];
  const wronglyListed = legalSentinels.filter((w) => JS_LIST.includes(w));
  assertEquals(
    wronglyListed,
    [],
    "legal identifiers must not be in RESERVED_WORDS",
  );
  // And confirm the probe agrees they are legal (pins the method).
  const probeDisagrees = legalSentinels.filter((w) => !isLegalIdent(w));
  assertEquals(
    probeDisagrees,
    [],
    "probe legality drifted for known-legal names",
  );
});
