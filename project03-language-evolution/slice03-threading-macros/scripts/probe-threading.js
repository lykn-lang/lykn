/**
 * probe-threading.js — what the threading macros ACTUALLY compile to.
 *
 * Written for `03-threading-macros/inventory.md` §6. Deliberately executes the
 * compiler rather than asserting on source shape: `D-2607-3VXM` records that
 * lykn's threading tests assert compiled *shape* and pass green while the code
 * they describe cannot run. A survey that repeated that mistake would be
 * evidence of nothing.
 *
 * SCOPE — read this: it exercises the **JS** compiler only (`packages/lang`).
 * lykn has TWO compilers. For the language-level claim you want
 * `scripts/probe-threading-rust.sh` as well, and the machine-diffed result of
 * running both is committed at `data/parity-transcript.txt`. The first pass of
 * this unit ran only this file and reported implementation status as settled;
 * that was not enough. See inventory.md section 6.6.
 *
 * Run from the repo root:
 *     deno run -A ../planning/project03-language-evolution/slice03-threading-macros/scripts/probe-threading.js
 */

import { lykn } from "../../../../0.7.x/packages/lang/mod.js";

const compile = (src) => {
  try {
    return lykn(src).trim();
  } catch (e) {
    return `ERROR: ${e.message}`;
  }
};

const section = (title) => console.log(`\n${"=".repeat(72)}\n${title}\n${"=".repeat(72)}`);
const show = (src) => console.log(`  ${src}\n      => ${compile(src)}`);

section("6.1  DD-18's worked ->> example (DD claims thread-FIRST nesting)");
console.log("  DD-18 documents:  take(map(filter(items, even?), double), 5)");
console.log("  Actual:");
show("(->> items (filter even?) (map double) (take 5))");
console.log("  For contrast, the same steps under ->:");
show("(-> items (filter even?) (map double) (take 5))");

section("6.2  -> and ->> are byte-identical for keyword (method) steps");
show("(-> s (:to-upper-case) (:slice 0 10))");
show("(->> s (:to-upper-case) (:slice 0 10))");
console.log("  DD-18.1's keyword-step rule fires before the position check,");
console.log("  so the receiver threads regardless of macro.");

section("6.3  as-> does not exist and fails SILENTLY");
show("(as-> x $ (f $ 1) (g 2 $))");
console.log("  Clean compile, no diagnostic, ReferenceError at runtime.");
console.log("  `asTo` comes from the '->' -> 'To' rule in compiler.js:405.");

section("The real ->> domain: configured operators and keyed sinks");
show('(->> rendered (Deno:write-text-file "out.html"))');
show('(->> bytes (crypto:subtle:digest "SHA-256"))');
show("(->> n (BigInt:as-int-n 64))");
show('(->> v (headers:set "content-type"))');

section("...and where -> is right instead (the 37 datum-first built-ins)");
show("(-> xs (Object:group-by f))");
show("(-> target (Reflect:get :key))");
show('(-> "42" (parse-int 10))');

section("Unary: undecidable — both macros agree, as they must");
show("(->> 5 inc double)");
show("(-> 5 inc double)");
