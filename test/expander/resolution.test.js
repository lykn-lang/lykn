// arc13/slice10 F-1/F-2 — name resolution in the JS expander walk (DD-60 D1 /
// DD-61 §A1/§A3). The JS mirror of the Rust `resolver.rs` unit tests: a
// lexically bound name MEANS the binding in every binding position and every
// reference position, with the region model (a binding is not in scope over its
// own initializer / iterable / scrutinee) and the label exception (labels do not
// shadow values — DD-60 ‡).
//
// Two layers are asserted: compiled OUTPUT (the observable DD-60 behaviour) and
// the resolution TAG on the expanded tree (`binding: 'def'|'ref'`, DD-61 §A1).

import { assert, assertEquals, assertStringIncludes } from
  "https://deno.land/std/assert/mod.ts";
import { lykn } from "lang/mod.js";
import { read } from "lang/reader.js";
import { expand } from "lang/expander.js";

const js = (src) => lykn(src, { strict: false });

/** Collect [value, binding] for every tagged atom in the expanded tree. */
function tags(src) {
  const out = [];
  const walk = (n) => {
    if (!n) return;
    if (n.type === "atom") {
      if (n.binding) out.push([n.value, n.binding]);
    } else if (n.type === "list") n.values.forEach(walk);
    else if (n.type === "cons") { walk(n.car); walk(n.cdr); }
  };
  expand(read(src), { strict: false }).forEach(walk);
  return out;
}

// ── The non-negotiable region probe (F-1) ───────────────────────────────────

Deno.test("region: for-of iterable stays outside the loop-binding scope", () => {
  // `#a(1)` == `(array 1)`; its head must stay the array literal form, while the
  // body reference resolves to the binding.
  const out = js("(for-of array #a(1) (array 987))");
  assertStringIncludes(out, "of [1]"); // iterable is the array literal
  assertStringIncludes(out, "array(987)"); // body is a call to the binding
  assert(!out.includes("array(1)"), `iterable was wrongly shadowed: ${out}`);
});

Deno.test("region: bind value is not in scope over its own initializer", () => {
  const out = js("(bind array (array 1))\n(array 987)");
  assertStringIncludes(out, "const array = [1]"); // value = array literal
  assertStringIncludes(out, "array(987)"); // sibling = call to the binding
});

// ── Reference resolves to the binding in every binding position (F-1/F-2) ────

Deno.test("bound head resolves to the binding across binding positions", () => {
  assertStringIncludes(js("(func p :args (:any array) :body (array 987))"), "array(987)");
  assertStringIncludes(js("(fn (:any array) (array 987))"), "array(987)");
  assertStringIncludes(js("(bind array 0)\n(array 987)"), "array(987)");
  assertStringIncludes(js("(bind (array array) #a(1))\n(array 987)"), "array(987)");
  assertStringIncludes(js("(class P () (m (array) (array 987)))"), "array(987)");
  assertStringIncludes(js("(if-let (array 1) (array 987))"), "array(987)");
  assertStringIncludes(js("(try (h) (catch array (array 987)))"), "array(987)");
  assertStringIncludes(js('(import "m" (array))\n(array 987)'), "array(987)");
});

Deno.test("F-2: bound surface/kernel form heads skip dispatch (plain call)", () => {
  // `cell`/`obj` fired a macro / threw before; `not` a builtin; now all calls.
  assertStringIncludes(js("(fn (:any cell) (cell 987))"), "cell(987)");
  assertStringIncludes(js("(fn (:any obj) (obj 987))"), "obj(987)");
  assertStringIncludes(js("(fn (:any not) (not 987))"), "not(987)");
  assertStringIncludes(js("(fn (:any array) (array 987))"), "array(987)");
});

Deno.test("nested reference: binding in scope inside a nested function", () => {
  assertStringIncludes(
    js("(func p :args (:any array) :body (fn () (array 987)))"),
    "array(987)",
  );
});

Deno.test("scope exit: a sibling after the binding form is out of scope", () => {
  // The fn param `array` does not leak to the following top-level sibling.
  const out = js("(fn (:any array) (array 1))\n(array 987)");
  assertStringIncludes(out, "[987]"); // array literal — the form, not the binding
});

// ── The label exception — labels do NOT shadow values (DD-60 ‡) ──────────────

Deno.test("label does not shadow values (DD-60 ‡ — do not 'fix')", () => {
  assertStringIncludes(js("(label array (block (array 987)))"), "[987]"); // form fires
  assertStringIncludes(js("(label not (block (not 987)))"), "!987");
  // and no value-ref tag is produced for the labelled name
  const t = tags("(label array (block (array 987)))");
  assert(!t.some(([n, b]) => n === "array" && b === "ref"),
    `label must not create a value ref: ${JSON.stringify(t)}`);
});

// ── Resolution tags (DD-61 §A1) ─────────────────────────────────────────────

Deno.test("tags: def at the binder, ref at the reference", () => {
  assertEquals(tags("(for-of array #a(1) (array 987))"),
    [["array", "def"], ["array", "ref"]]);
  assertEquals(tags("(bind array 0)\n(array 987)"),
    [["array", "def"], ["array", "ref"]]);
});

Deno.test("tags: compiler-generated atoms stay untagged", () => {
  // `cell` lowers to `(object (value …))`; the emitted `object`/`value` atoms
  // are compiler-generated and must never carry a binding tag.
  const t = tags("(cell 5)");
  assertEquals(t, [], `no atom should be tagged for macro-generated kernel: ${JSON.stringify(t)}`);
});

Deno.test("tag survival: the ref tag rides through surface→kernel lowering", () => {
  // `(fn (:any array) (array 987))` lowers `fn`→`=>`; the body head `array` is
  // reused through the rebuild and reaches the compiler still tagged `ref`
  // (so `formHead` returns null → plain call), which the output confirms.
  const t = tags("(fn (:any array) (array 987))");
  assert(t.some(([n, b]) => n === "array" && b === "ref"),
    `body ref tag did not survive lowering: ${JSON.stringify(t)}`);
  assertStringIncludes(js("(fn (:any array) (array 987))"), "array(987)");
});

// ── Unbound form names are unaffected (no false positives) ───────────────────

Deno.test("unbound form name still dispatches (array literal, cell object)", () => {
  assertStringIncludes(js("(array 987)"), "[987]");
  assertStringIncludes(js("(cell 987)"), "value: 987");
  assertEquals(tags("(array 987)"), []); // nothing bound → nothing tagged
});
