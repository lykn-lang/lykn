// Name-binding conformance corpus (arc13/slice11 F-1/F-2) — the permanent,
// cross-backend gate that DD-60 D1/D2 hold on BOTH compilers. It is the
// standing distillation of `tools/conformance-matrix.js` (the 1947-cell audit
// tool): at least one cross-backend assertion per name-class × binding-position
// × reference-position *equivalence class*, so a future regression in
// name-binding semantics — on either backend, in any position — fails `make
// check` before it ships.
//
// Vehicle (chosen on timing evidence, arc13/slice11): the matrix's own
// classification method — does the compiled output call the binding
// (`name(987)`)? — applied to BOTH backends per cell. This is robust to the
// benign desugaring-shape divergences (if-let/when-let/match emit a bare block
// on Rust, an IIFE on JS) that make byte-identical `compileBoth` too strict a
// gate for the region-bearing forms, while still catching any *resolution*
// divergence. Rust is shelled via `./bin/lykn` (rebuild + `./bin/lykn build`
// before running — the `lang/` import map resolves to `target/lykn/build/lang/`,
// staleness trap #4). Full-matrix runtime ≈ 14 s; this corpus ≈ 1 s.
//
// ── Coverage map (equivalence class → the Deno.test that pins it) ────────────
//   1. control legal ident, every value-shadowing binding × ref position
//      → calls-binding on both ......... "D1: control name shadows in every position"
//   2. surface-form legal ident (fn/cell/obj/match/and/…) → calls-binding both
//      ................................. "D1: surface-form names shadow (skip dispatch)"
//   3. kernel-head legal ident (array/await/get/async/assign) → calls-binding both
//      ................................. "D1: kernel-head names shadow (skip dispatch)"
//   4. `macro` (the DD-60-D1 form-name; slice11 F-3 Rust convergence) → both
//      ................................. "D1/F-3: bound `macro` calls the binding on both backends"
//   5. region model: initializer / iterable / scrutinee is OUTSIDE the scope
//      ................................. "D1 region: a binding is not in scope over its own initializer"
//   6. reserved word × binding position → rejects cleanly on both (D2)
//      ................................. "D2: reserved words are rejected at every binding position"
//   7. label position, non-form name → calls-binding both (labels don't shadow, DD-60 ‡)
//      ................................. "DD-60 ‡: a label does not shadow a value (control name)"
//   8. label position, form name → the DOCUMENTED shape-mismatch asymmetry
//      ................................. "residual (documented): form-named label — shape-mismatch asymmetry"
//   9. kernel:-prefixed name in a binding position → DOCUMENTED edge-4 residual
//      ................................. "residual (documented): kernel:-prefixed name is unbindable (edge 4)"
//
// Residual dispositions (classes 8, 9) are pinned as *expected divergence* so a
// change to them trips this corpus and forces a conscious re-disposition. The
// end-state count is 53 documented-as-intended divergent matrix cells (38 form-
// named-label + 15 kernel:if); see the slice11 closing report (the A-4 input).

import { assert, assertEquals } from "https://deno.land/std/assert/mod.ts";
import { lykn } from "lang/mod.js";

const LYKN_BIN = "./bin/lykn";
const CALL_ARG = "987";

// ── Backends ────────────────────────────────────────────────────────────────
function compileRust(src) {
  const tmp = Deno.makeTempFileSync({ suffix: ".lykn" });
  try {
    Deno.writeTextFileSync(tmp, src);
    const p = new Deno.Command(LYKN_BIN, {
      args: ["compile", "--no-strict", tmp],
      stdout: "piped",
      stderr: "piped",
    }).outputSync();
    const out = new TextDecoder().decode(p.stdout);
    const err = new TextDecoder().decode(p.stderr);
    return p.success ? { ok: true, out } : { ok: false, err: (err || out).trim() };
  } finally {
    Deno.removeSync(tmp);
  }
}

function compileJs(src) {
  try {
    return { ok: true, out: lykn(src, { strict: false }) };
  } catch (e) {
    return { ok: false, err: String(e?.message ?? e) };
  }
}

// ── Classification (the matrix's collapse rule) ─────────────────────────────
// A binding "shadows" iff the reference is emitted as a call to it (`name(987)`)
// — a fired macro rewrites the name away (`{value: 987}`, `!987`, …); a param
// declaration `probe(name)` never contains `name(987)`. Argument position
// cannot trigger macro dispatch, so a clean compile there is calls-binding.
function callsBinding(name, res, refPos) {
  if (!res.ok) return false;
  if (refPos === "argument") return true;
  return res.out.includes(`${name}(${CALL_ARG})`);
}

// ── Position templates (mirror tools/conformance-matrix.js) ─────────────────
const REF_POS = {
  "call-head": (n) => `(${n} ${CALL_ARG})`,
  "argument": (n) => `(console:log ${n})`,
  "nested-fn": (n) => `(fn () (${n} ${CALL_ARG}))`,
};
const BIND_POS = {
  "func-param": (n, ref) => `(func probe :args (:any ${n}) :body ${ref})`,
  "bind": (n, ref) => `(bind ${n} 0)\n${ref}`,
  "destructuring": (n, ref) => `(bind (array ${n}) #a(1))\n${ref}`,
  "loop": (n, ref) => `(for-of ${n} #a(1) ${ref})`,
  "class-param": (n, ref) => `(class Probe () (m (${n}) ${ref}))`,
  "if-let": (n, ref) => `(if-let (${n} 1) ${ref})`,
  "when-let": (n, ref) => `(when-let (${n} 1) ${ref})`,
  "match": (n, ref) => `(match v ((Some ${n}) ${ref}) (_ 0))`,
  "catch": (n, ref) => `(try (h) (catch ${n} ${ref}))`,
  "import": (n, ref) => `(import "m" (${n}))\n${ref}`,
};
const VALUE_BIND_POS = Object.keys(BIND_POS);
const REF_ORDER = Object.keys(REF_POS);

/** Assert a legal-ident name resolves to its binding on BOTH backends. */
function assertShadowsBoth(name, bpos, rpos) {
  const src = BIND_POS[bpos](name, REF_POS[rpos](name));
  const rust = compileRust(src);
  const js = compileJs(src);
  assert(
    callsBinding(name, rust, rpos),
    `Rust: '${name}' did not resolve to the binding in ${bpos}/${rpos}\n${src}\n${rust.out ?? rust.err}`,
  );
  assert(
    callsBinding(name, js, rpos),
    `JS: '${name}' did not resolve to the binding in ${bpos}/${rpos}\n${src}\n${js.out ?? js.err}`,
  );
}

// ── 1. Control name — every value-shadowing binding × reference position ─────

Deno.test("D1: control name shadows in every position", () => {
  for (const bpos of VALUE_BIND_POS) {
    for (const rpos of REF_ORDER) {
      assertShadowsBoth("widget", bpos, rpos);
    }
  }
});

// ── 2/3. Form-named legal idents skip dispatch (the arc's whole point) ───────

Deno.test("D1: surface-form names shadow (skip dispatch)", () => {
  // These fired a macro / threw at the binding site before arc13.
  for (const name of ["fn", "cell", "obj", "match", "and", "not", "type"]) {
    for (const rpos of REF_ORDER) {
      assertShadowsBoth(name, "func-param", rpos);
    }
    // and through a representative declaration binding, not just a param
    assertShadowsBoth(name, "bind", "call-head");
  }
});

Deno.test("D1: kernel-head names shadow (skip dispatch)", () => {
  for (const name of ["array", "await", "get", "async", "assign"]) {
    for (const rpos of REF_ORDER) {
      assertShadowsBoth(name, "func-param", rpos);
    }
    assertShadowsBoth(name, "bind", "call-head");
  }
});

// ── 4. `macro` — the slice11 F-3 Rust convergence (JS was already there) ─────

Deno.test("D1/F-3: bound `macro` calls the binding on both backends", () => {
  // Rust threw here before slice11 (pass 1 treated `(macro 987)` as a leaked
  // definition; the import cell also mis-walked the binder list). Now both
  // backends emit a plain call. These are the 3 matrix cells 56→53.
  for (const bpos of ["bind", "destructuring", "import"]) {
    assertShadowsBoth("macro", bpos, "call-head");
  }
  // And a real macro definition is unaffected by the binding-aware guard.
  assertEquals(
    compileRust("(macro dbl (x) `(+ ,x ,x))\n(dbl 5)").out.replace(/\s+/g, " ").trim(),
    "5 + 5;",
  );
});

// ── 5. The region model — a binding is not in scope over its own initializer ─

Deno.test("D1 region: a binding is not in scope over its own initializer", () => {
  // `#a(1)` == `(array 1)`. The iterable / initializer must stay the array
  // literal form; only the body reference resolves to the binding. A naive
  // whole-subtree shadow would miscompile the iterable to `array(1)`.
  for (
    const [src, mustHave, mustNotHave] of [
      ["(for-of array #a(1) (array 987))", "array(987)", "array(1)"],
      ["(bind array (array 1))\n(array 987)", "array(987)", "array(1)"],
    ]
  ) {
    for (const [backend, res] of [["Rust", compileRust(src)], ["JS", compileJs(src)]]) {
      assert(res.ok, `${backend} failed to compile region probe: ${src}`);
      assert(
        res.out.includes(mustHave) && !res.out.includes(mustNotHave),
        `${backend} region model wrong for ${src}:\n${res.out}`,
      );
    }
  }
});

// ── 6. D2 — reserved words rejected at every binding position, both backends ─

Deno.test("D2: reserved words are rejected at every binding position", () => {
  for (const name of ["if", "const", "return", "class", "new"]) {
    for (const bpos of VALUE_BIND_POS) {
      const src = BIND_POS[bpos](name, REF_POS["call-head"](name));
      const rust = compileRust(src);
      const js = compileJs(src);
      // "rejects cleanly" = a compile error (never invalid JS at rc=0). Rust
      // and JS both fail; neither emits output for a reserved-word binder.
      assert(!rust.ok, `Rust did NOT reject reserved '${name}' in ${bpos}:\n${src}\n${rust.out}`);
      assert(!js.ok, `JS did NOT reject reserved '${name}' in ${bpos}:\n${src}\n${js.out}`);
    }
  }
});

// ── 7/8. The label exception (DD-60 ‡) and its documented residual ──────────

Deno.test("DD-60 ‡: a label does not shadow a value (control name)", () => {
  // A non-form name as a label: both backends agree it is a plain call in the
  // body (labels are their own namespace; they never enter the value env).
  const src = "(label widget (block (widget 987)))";
  const rust = compileRust(src);
  const js = compileJs(src);
  assert(callsBinding("widget", rust, "call-head"), `Rust: ${rust.out ?? rust.err}`);
  assert(callsBinding("widget", js, "call-head"), `JS: ${js.out ?? js.err}`);
});

Deno.test("residual (documented): form-named label — shape-mismatch asymmetry", () => {
  // A *form*-named label leaves references meaning the FORM (labels don't
  // shadow values — DD-60 ‡ — so D1 does not apply). The backends then differ
  // only in how they treat a form invoked with the wrong shape (`(fn 987)`):
  // Rust falls through to a plain call (or fires the macro); JS raises a form
  // arity error. This is the PRE-EXISTING accidental-shadowing asymmetry
  // (DD-60 §Context), orthogonal to name-binding semantics — 38 matrix cells,
  // documented-as-intended. Pinned here so a change forces re-disposition.
  const src = "(label fn (block (fn 987)))";
  const rust = compileRust(src);
  const js = compileJs(src);
  assert(rust.ok, `Rust should still emit (fall-through call): ${rust.err}`);
  assert(rust.out.includes("fn(987)"), `Rust should fall through to a call:\n${rust.out}`);
  assert(!js.ok, `JS should raise a form-shape error (documented residual): ${js.out}`);
});

// ── 9. kernel:-prefixed names are unbindable (DD-60 edge case 4) ────────────

Deno.test("residual (documented): kernel:-prefixed name is unbindable (edge 4)", () => {
  // `kernel:if` is not a legal identifier (the `:` is the kernel-escape
  // syntax), so splicing it into a binding position is unrepresentable in
  // real code (DD-60 edge 4). Both backends produce non-identical garbage
  // (Rust: `kernel.if`, invalid JS at rc=0; JS: throws) — neither is correct;
  // the divergence is two flavours of garbage-in/garbage-out, not a D1/D2
  // violation (`kernel:if` is not a *name*). 15 matrix cells, documented.
  const src = "(bind kernel:if 0)\n(kernel:if 987)";
  const rust = compileRust(src);
  const js = compileJs(src);
  // Rust: emits at rc=0 (the invalid-output residual); JS: rejects. Either
  // way the name never round-trips as a usable binding.
  assert(
    rust.out?.includes("kernel.if") ?? false,
    `Rust kernel:if residual changed — re-disposition:\n${rust.out ?? rust.err}`,
  );
  assert(!callsBinding("kernel:if", js, "call-head"), `JS kernel:if residual changed: ${js.out ?? js.err}`);
});
