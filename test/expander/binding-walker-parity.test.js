// DD-61 §A2 — shared fixture corpus proving the Rust and JS binding-position
// walkers agree on WHAT BINDS (slice03 F-2). The walkers are observed through
// D2: a reserved word in a binding position must be rejected by BOTH backends;
// the same word in a non-binding position must be accepted by BOTH. If the two
// walkers disagreed about a position, one backend would reject and the other
// wouldn't — this test fails on exactly that.
//
// Runs in `make check` (test-suite). JS via the `lykn` API; Rust via the CLI
// (the `compileBoth` shell-out pattern). Reserved word used: `if`.

import { assert, assertEquals } from "https://deno.land/std/assert/mod.ts";
import { lykn } from "lang/mod.js";

const LYKN_BIN = Deno.env.get("LYKN_BIN") || "./bin/lykn";

/** Compile on the JS backend; return true if it threw (rejected). */
function jsRejects(src) {
  try {
    lykn(src, { strict: false });
    return false;
  } catch {
    return true;
  }
}

/** Compile on the Rust backend via the CLI; return true if it errored. */
function rustRejects(src) {
  const tmp = Deno.makeTempFileSync({ suffix: ".lykn" });
  try {
    Deno.writeTextFileSync(tmp, src);
    const p = new Deno.Command(LYKN_BIN, {
      args: ["compile", "--no-strict", tmp],
      stdout: "null",
      stderr: "null",
    }).outputSync();
    return !p.success;
  } finally {
    Deno.removeSync(tmp);
  }
}

// Every DD-60 binding position, with a reserved word (`if`) in it → both reject.
const BINDS_IF = [
  ["func param", "(func f :args (:any if) :body 5)"],
  ["func param (multi-clause)", "(func f (:args (:any if) :body 5))"],
  ["fn param", "(fn (:any if) 5)"],
  ["lambda param", "(lambda (:any if) 5)"],
  ["genfunc param", "(genfunc g :args (:any if) :body (yield 1))"],
  ["genfn param", "(genfn (:any if) (yield 1))"],
  ["bind", "(bind if 0)"],
  ["bind typed", "(bind :number if 0)"],
  ["destructuring (array)", "(bind (array if) xs)"],
  ["loop for-of", "(for-of if #a(1) (g 1))"],
  ["loop for-in", "(for-in if obj (g 1))"],
  ["class method param", "(class C () (m (if) 5))"],
  ["export bind", "(export (bind if 0))"],
  ["kernel:const name slot", "(kernel:const if 0)"],
];

// `if` NOT in a binding position (it is a real form / call) → both accept.
const IF_NOT_A_BINDING = [
  ["if form", "(if true 1 2)"],
  ["bind value uses if-form", "(bind ok (if true 1 2))"],
];

for (const [label, src] of BINDS_IF) {
  Deno.test(`walker parity: reserved word in ${label} → both reject`, () => {
    const js = jsRejects(src);
    const rust = rustRejects(src);
    assertEquals(
      { js, rust },
      { js: true, rust: true },
      `backends disagree on whether ${label} binds — walker shape drift`,
    );
  });
}

for (const [label, src] of IF_NOT_A_BINDING) {
  Deno.test(`walker parity: ${label} → both accept`, () => {
    assert(!jsRejects(src), `JS wrongly rejected non-binding: ${src}`);
    assert(!rustRejects(src), `Rust wrongly rejected non-binding: ${src}`);
  });
}
