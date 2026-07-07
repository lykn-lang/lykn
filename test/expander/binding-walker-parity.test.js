// DD-61 §A2 — shared fixture corpus proving the Rust and JS binding-position
// walkers agree on WHAT BINDS (slice03 F-2), AND the standing binding-position
// COVERAGE test (slice05 F-3). The walkers are observed through D2: a reserved
// word in a binding position must be rejected by BOTH backends; the same word in
// a non-binding position must be accepted by BOTH. If the two walkers disagreed
// about a position, one backend would reject and the other wouldn't — this test
// fails on exactly that.
//
// COVERAGE / authority inversion (slice05): the `BINDS_IF` list below is the
// **derived** binder-position inventory — one fixture per place the codegen
// emits an identifier into a JS binding/declaration/label slot (the F-2 sweep;
// emission-site citations in the slice05 closing report). Each entry asserts
// both backends reject a reserved name there; if the walker stops covering a
// position (or a future grammar addition binds a name the walker doesn't know),
// its fixture fails — the seeded-gap demo. Empty failures = complete coverage.
//
// Runs in `make check` (test-suite). JS via the `lykn` API; Rust via the CLI
// (the `compileBoth` shell-out pattern). Reserved word used: `if` (and `for`).

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
  // DD-60 refinement (2026-07-06, slice04): if-let/when-let/match patterns.
  ["if-let binding", "(if-let (if x) (g if))"],
  ["when-let binding", "(when-let (if x) (g if))"],
  ["match constructor pattern", "(match v ((Some if) if) (_ 0))"],
  // DD-60 refinement #2 (slice05): catch / import-local / label.
  ["catch binding", "(try (f) (catch if (g)))"],
  ["import named local", '(import "m" (if))'],
  ["import default local", '(import "m" if)'],
  ["import alias local", '(import "m" ((alias orig for)))'],
  ["label name", "(label if (block))"],
  // slice05 sweep finds — name slots the leak-discovery missed (codegen emits
  // `function if` / `class if` / `function* if` / a `function CtorName`):
  ["func name", "(func if :args () :body 1)"],
  ["genfunc name", "(genfunc if :args () :body (yield 1))"],
  ["class name", "(class if () (m () 5))"],
  ["type constructor name", "(type T (if :number x))"],
  ["type constructor field", "(type T (Ctor :number if))"],
];

// `if` NOT in a binding position (it is a real form / call) → both accept.
const IF_NOT_A_BINDING = [
  ["if form", "(if true 1 2)"],
  ["bind value uses if-form", "(bind ok (if true 1 2))"],
  // a match literal / constructor head is not a binding.
  ["match literal true clause", "(match v (true 1) (_ 0))"],
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
