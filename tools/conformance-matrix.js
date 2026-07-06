// Name-binding conformance matrix (arc13/slice01, DD-60 seed).
//
// Probes how a NAME that collides with a macro/form/keyword behaves when it is
// *lexically bound* and then *referenced*, on BOTH compilers. This is the
// ground-truth matrix DD-60's semantics are written against, and the seed for
// slice03's cross-compiler conformance corpus + the arc's A-4 re-probe.
//
// Deterministic: fixed name/position order, no time/random. Re-run must match.
//
//   deno run --config project.json -A tools/conformance-matrix.js
//
// Rust backend: shells out to ./bin/lykn compile (rebuild bin/lykn first).
// JS backend:   the in-process compiler API (lang/mod.js via the import map).

import { lykn } from "lang/mod.js";

const LYKN_BIN = "./bin/lykn";

// ── Name classes (enumerated from source, not sampled) ──────────────────────
//
// Surface forms: the union of the JS `classifySurfaceForm` switch and the Rust
// classifier `forms.rs` match — restricted to members that are valid lykn
// *identifiers* (operator-spelled forms `->`,`=`,`!=`,`set!`,… can't be bound
// as a bare name; noted separately in the report, not probed as names here).
const SURFACE_FORMS = [
  "fn",
  "func",
  "genfn",
  "genfunc",
  "lambda",
  "and",
  "or",
  "not",
  "bind",
  "cell",
  "express",
  "obj",
  "assoc",
  "dissoc",
  "conj",
  "match",
  "type",
  "macro",
];
// Kernel form heads (compiler.js `const macros`) that are identifier-shaped and
// not already covered above.
const KERNEL_HEADS = [
  "array",
  "assign",
  "async",
  "await",
  "block",
  "const",
  "let",
  "var",
  "function",
  "get",
  "if",
  "import",
  "new",
  "return",
  "yield",
  "do",
];
// JS reserved words (the ID-44 genus — binding any of these emits invalid JS).
const RESERVED_WORDS = [
  "if",
  "while",
  "for",
  "return",
  "class",
  "switch",
  "try",
  "catch",
  "delete",
  "typeof",
  "in",
  "void",
  "this",
  "super",
  "export",
  "default",
  "instanceof",
  "case",
  "finally",
  "debugger",
];
// kernel:-prefixed atoms (the DD-58 escape hatch — unbindable; documented).
const KERNEL_PREFIXED = ["kernel:const", "kernel:if"];
// Ordinary names — the control: these must always shadow cleanly.
const CONTROLS = ["x", "widget", "result"];

const NAME_CLASSES = [
  ["surface-form", SURFACE_FORMS],
  ["kernel-head", KERNEL_HEADS],
  ["reserved-word", RESERVED_WORDS],
  ["kernel-prefixed", KERNEL_PREFIXED],
  ["control", CONTROLS],
];

// Whether a name is a legal JS *binding identifier* is decided empirically, not
// by a hand-maintained list — contextual keywords (`await`, `yield`, `async`,
// `let`) don't follow a simple rule. We deno-check `const NAME = 0;` once per
// name and memoize. A name that fails is a reserved word: binding it anywhere
// emits invalid JS (the ID-44 genus). Deterministic (deno check is pure).
const _identCache = new Map();
function isLegalIdent(name) {
  if (_identCache.has(name)) return _identCache.get(name);
  // `kernel:`-prefixed atoms aren't identifiers at all — never legal as names.
  if (name.includes(":")) {
    _identCache.set(name, false);
    return false;
  }
  const tmp = Deno.makeTempFileSync({ suffix: ".js" });
  try {
    Deno.writeTextFileSync(tmp, `const ${name} = 0;\n`);
    const p = new Deno.Command("deno", {
      args: ["check", tmp],
      stdout: "null",
      stderr: "null",
    })
      .outputSync();
    const legal = p.success;
    _identCache.set(name, legal);
    return legal;
  } finally {
    Deno.removeSync(tmp);
  }
}

// ── Positions ───────────────────────────────────────────────────────────────
// Reference position: how NAME is used once bound.
// The distinctive call argument `987` lets classification tell a genuine call
// to the binding (`NAME(987)`) apart from a param declaration (`probe(NAME)`)
// or a fired macro (`{value: 987}`, `!987`, …) without false positives.
const CALL_ARG = "987";
const REF_POS = {
  "call-head": (n) => `(${n} ${CALL_ARG})`,
  "argument": (n) => `(console:log ${n})`,
  "nested-fn": (n) => `(fn () (${n} ${CALL_ARG}))`,
};
// Binding position: how NAME is introduced. `REF` is spliced in.
const BIND_POS = {
  "func-param": (n, ref) => `(func probe :args (:any ${n}) :body ${ref})`,
  "bind": (n, ref) => `(bind ${n} 0)\n${ref}`,
  "destructuring": (n, ref) => `(bind (array ${n}) #a(1))\n${ref}`,
  "loop": (n, ref) => `(for-of ${n} #a(1) ${ref})`,
  "class-param": (n, ref) => `(class Probe () (m (${n}) ${ref}))`,
  // DD-60 refinement (2026-07-06, slice04): if-let/when-let binding patterns and
  // match clause patterns.
  "if-let": (n, ref) => `(if-let (${n} 1) ${ref})`,
  "when-let": (n, ref) => `(when-let (${n} 1) ${ref})`,
  "match": (n, ref) => `(match v ((Some ${n}) ${ref}) (_ 0))`,
};

const REF_ORDER = ["call-head", "argument", "nested-fn"];
const BIND_ORDER = [
  "func-param",
  "bind",
  "destructuring",
  "loop",
  "class-param",
  "if-let",
  "when-let",
  "match",
];

// ── Compile shims ───────────────────────────────────────────────────────────
function compileJs(src) {
  try {
    return { ok: true, out: lykn(src) };
  } catch (e) {
    return { ok: false, err: String(e.message ?? e) };
  }
}

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
    // lykn compile prints warnings to stdout and errors to stderr; rc drives it.
    if (!p.success) return { ok: false, err: (err || out).trim() };
    return { ok: true, out };
  } finally {
    Deno.removeSync(tmp);
  }
}

// ── Classification ──────────────────────────────────────────────────────────
// calls-binding : NAME survives as an identifier use (the binding shadowed).
// macro-fires   : NAME vanished — the macro/form expanded instead.
// throws        : the compile errored.
// invalid-output: compiled at rc=0 but the JS is unparseable (reserved word).
function stripNoise(out, name) {
  return out
    .split("\n")
    .filter((l) => {
      const t = l.trim();
      if (!t) return false;
      if (
        t.includes(": warning:") || t.startsWith("suggestion:") ||
        t.startsWith("• ") || t.includes("warning:")
      ) return false;
      // per-arg runtime type guard mentions the name; not a "use".
      if (t.includes(`typeof ${name} !==`) || t.includes(`arg '${name}'`)) {
        return false;
      }
      return true;
    })
    .join("\n");
}

function reEsc(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function classify(name, res, refPos) {
  if (!res.ok) return { cls: "throws", note: firstLine(res.err) };
  const body = stripNoise(res.out, name);
  // A name that isn't a legal JS binding identifier (reserved word) always
  // emits invalid JS once the compiler writes it out as a declared name.
  if (!isLegalIdent(name)) {
    return { cls: "invalid-output", note: firstLine(body) };
  }
  // Argument position can't trigger macro dispatch (macros fire only at a
  // call head), so a clean compile there means the name resolved to the value.
  if (refPos === "argument") return { cls: "calls-binding", note: "" };
  // Call-head / nested-fn: the binding shadowed iff the name is emitted as the
  // callee of the distinctive call `NAME(987)`. A fired macro rewrites it away
  // (`{value: 987}`, `!987`, `987["value"]`, …); the param declaration
  // `probe(NAME)` never contains `NAME(987)`.
  const called = body.includes(`${name}(${CALL_ARG})`);
  if (called) return { cls: "calls-binding", note: "" };
  return { cls: "macro-fires", note: firstLine(body) };
}

function firstLine(s) {
  return (s || "").split("\n").map((l) => l.trim()).find((l) => l) ?? "";
}

// ── Run ─────────────────────────────────────────────────────────────────────
const SYM = {
  "calls-binding": "✓bind",
  "macro-fires": "✗macro",
  "throws": "✗throw",
  "invalid-output": "✗inval",
};

const rows = [];
const tally = {};
function bump(backend, cls) {
  tally[backend] ??= {};
  tally[backend][cls] = (tally[backend][cls] ?? 0) + 1;
}

for (const [cls, names] of NAME_CLASSES) {
  for (const name of names) {
    for (const bpos of BIND_ORDER) {
      for (const rpos of REF_ORDER) {
        const ref = REF_POS[rpos](name);
        const src = BIND_POS[bpos](name, ref);
        const rust = classify(name, compileRust(src), rpos);
        const js = classify(name, compileJs(src), rpos);
        bump("rust", rust.cls);
        bump("js", js.cls);
        const agree = rust.cls === js.cls;
        rows.push({ cls, name, bpos, rpos, rust, js, agree });
      }
    }
  }
}

// ── Emit markdown ───────────────────────────────────────────────────────────
const L = [];
L.push("# Name-binding conformance matrix (current state)");
L.push("");
L.push(
  "Generated by `tools/conformance-matrix.js` — deterministic, re-runnable.",
);
L.push(
  "Legend: `✓bind`=calls the binding (correct shadowing) · `✗macro`=macro",
);
L.push("fires instead · `✗throw`=compile error · `✗inval`=invalid JS at rc=0.");
L.push("");
const total = rows.length;
const divergent = rows.filter((r) => !r.agree).length;
L.push(
  `**${total} cells** · **${divergent} where the backends disagree** ` +
    `(${(100 * divergent / total).toFixed(0)}%).`,
);
L.push("");
L.push("## Tally by backend");
L.push("");
L.push("| outcome | rust | js |");
L.push("|---|---|---|");
for (const c of ["calls-binding", "macro-fires", "throws", "invalid-output"]) {
  L.push(`| ${c} | ${tally.rust?.[c] ?? 0} | ${tally.js?.[c] ?? 0} |`);
}
L.push("");

// Collapse ref-pos where the (rust,js) verdict is identical across all three,
// to keep the table readable; expand only names whose ref-pos differ.
L.push("## Per name × binding-position (collapsed over reference position)");
L.push("");
L.push("Each cell = rust / js verdict. A `∗` marks a name whose reference-");
L.push("position outcomes are NOT uniform (see the expanded section).");
L.push("");
const byClass = {};
for (const r of rows) {
  (byClass[r.cls] ??= []).push(r);
}
for (const [cls, names] of NAME_CLASSES) {
  L.push(`### ${cls}`);
  L.push("");
  L.push("| name | " + BIND_ORDER.join(" | ") + " |");
  L.push("|---|" + BIND_ORDER.map(() => "---").join("|") + "|");
  for (const name of names) {
    const cells = [name];
    let nonUniform = false;
    for (const bpos of BIND_ORDER) {
      const rs = REF_ORDER.map((rpos) =>
        rows.find((r) => r.name === name && r.bpos === bpos && r.rpos === rpos)
      );
      const verdicts = new Set(rs.map((r) => `${r.rust.cls}|${r.js.cls}`));
      if (verdicts.size > 1) nonUniform = true;
      const first = rs[0];
      cells.push(
        `${SYM[first.rust.cls]}/${SYM[first.js.cls]}` +
          (verdicts.size > 1 ? "∗" : ""),
      );
    }
    if (nonUniform) cells[0] = `${name} ∗`;
    L.push("| " + cells.join(" | ") + " |");
  }
  L.push("");
}

// Expanded rows for non-uniform names.
const nonUniformNames = [
  ...new Set(
    rows
      .filter((r) => {
        const same = rows.filter((x) => x.name === r.name && x.bpos === r.bpos);
        return new Set(same.map((x) => `${x.rust.cls}|${x.js.cls}`)).size > 1;
      })
      .map((r) => r.name),
  ),
];
if (nonUniformNames.length) {
  L.push("## Reference-position detail (non-uniform names only)");
  L.push("");
  L.push("| name | binding | ref | rust | js |");
  L.push("|---|---|---|---|---|");
  for (const r of rows) {
    if (!nonUniformNames.includes(r.name)) continue;
    L.push(
      `| ${r.name} | ${r.bpos} | ${r.rpos} | ${r.rust.cls} | ${r.js.cls} |`,
    );
  }
  L.push("");
}

console.log(L.join("\n"));
