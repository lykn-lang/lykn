// DD-61 §A2 — the binding-position walker (JS).
//
// The single per-backend component that knows what binds: every DD-60 binding
// position — params of func/fn/genfunc/genfn/lambda, bind, destructuring
// patterns, loop bindings (for-of/for-in/for-await-of), class-method params,
// and the kernel: declaration name slots. Both D2 (the reserved-word validator,
// this slice) and D1 (the resolver env, slice05) are clients, so binding
// knowledge lives in exactly one place per backend.
//
// Mirrors `crates/lykn-lang/src/binding.rs`; shape-parity is pinned by the
// shared fixtures in `test/expander/binding-walker-parity.test.js`. It only
// *identifies* positions — it changes no expansion behavior (that is slice05).

import { RESERVED_WORDS } from "./reserved-words.js";

/** @typedef {'param'|'bind'|'loop-binding'|'class-method-param'} BindingKind */
/** @typedef {{ name: string, kind: BindingKind }} BindingSite */

const DECL_HEADS = new Set(["const", "let", "var", "function", "function*"]);

/**
 * Recursively walk `forms`, collecting every binding site in source order.
 * @param {Array<object>} forms
 * @returns {BindingSite[]}
 */
export function walkBindings(forms) {
  const out = [];
  for (const form of forms) walk(form, out);
  return out;
}

function walk(form, out) {
  if (form?.type !== "list") return;
  out.push(...bindingsIntroduced(form));
  for (const child of form.values) walk(child, out);
}

/**
 * Names a single form introduces (non-recursive); [] if not a binding form.
 * The D1 env-extension hook (slice05): "entering this form, these names bind".
 * @param {object} form
 * @returns {BindingSite[]}
 */
export function bindingsIntroduced(form) {
  if (form?.type !== "list" || form.values.length === 0) return [];
  const head = form.values[0];
  if (head.type !== "atom") return [];
  const name = head.value;
  const args = form.values.slice(1);
  switch (name) {
    case "bind":
      return bindNames(args);
    case "func":
    case "genfunc":
      return funcClauseParamNames(args);
    case "fn":
    case "lambda":
    case "genfn":
      return args.length > 0 ? paramListNames(args[0]) : [];
    case "for-of":
    case "for-in":
    case "for-await-of":
      return args.length > 0 ? patternNames(args[0], "loop-binding") : [];
    case "class":
      return classMethodParamNames(args);
    default: {
      const kernel = name.startsWith("kernel:")
        ? name.slice("kernel:".length)
        : name;
      if (DECL_HEADS.has(kernel) && args.length > 0) {
        return patternNames(args[0], "bind");
      }
      return [];
    }
  }
}

/** (bind name value) / (bind :type name value). */
function bindNames(args) {
  let slot;
  if (args.length === 2) slot = args[0];
  else if (args.length === 3) slot = args[1];
  else return [];
  return patternNames(slot, "bind");
}

const FUNC_CLAUSE_KEYS = new Set([
  "args",
  "yields",
  "returns",
  "pre",
  "post",
  "body",
]);

/** func/genfunc: locate every `:args (…)` clause (single- or multi-clause). */
function funcClauseParamNames(args) {
  const out = [];
  // Multi-clause: each clause is a list whose head is a func-clause *key*
  // keyword (`:args`/`:body`/…) — not a mere keyword (a type like `:any` in a
  // single-clause param list must not be mistaken for a clause).
  const clauses = args.filter(
    (a) =>
      a?.type === "list" && a.values[0]?.type === "keyword" &&
      FUNC_CLAUSE_KEYS.has(a.values[0].value),
  );
  const scan = clauses.length > 0 ? clauses.map((c) => c.values) : [args];
  for (const seq of scan) {
    for (let i = 0; i < seq.length; i++) {
      if (
        seq[i]?.type === "keyword" && seq[i].value === "args" &&
        seq[i + 1]?.type === "list"
      ) {
        out.push(...paramListNames(seq[i + 1]));
      }
    }
  }
  return out;
}

/** A `(:type name …)` param list → its bound names. */
function paramListNames(list) {
  if (list?.type !== "list") return [];
  const out = [];
  for (const el of list.values) {
    if (el.type === "keyword") continue; // type annotation
    if (el.type === "atom") {
      if (el.value !== "_") out.push({ name: el.value, kind: "param" });
    } else if (el.type === "list") {
      const h = el.values[0]?.type === "atom" ? el.values[0].value : "";
      if (h === "rest" && el.values[1]) {
        out.push(...patternNames(el.values[1], "param"));
      } else if (h === "default" && el.values[2]) {
        out.push(...patternNames(el.values[2], "param"));
      } else if (h === "array" || h === "object") {
        out.push(...patternNames(el, "param"));
      }
    }
  }
  return out;
}

/** Class methods: (mname (param…) body…) — param list is the 2nd element. */
function classMethodParamNames(args) {
  const out = [];
  for (const member of args) {
    if (member?.type !== "list") continue;
    const params = member.values[1];
    if (params?.type === "list") {
      for (const p of params.values) {
        if (p.type === "atom" && p.value !== "_") {
          out.push({ name: p.value, kind: "class-method-param" });
        }
      }
    }
  }
  return out;
}

/** Leaf names bound by a pattern: an atom or an (array …)/(object …) form. */
function patternNames(pat, kind) {
  if (pat?.type === "atom") {
    return pat.value === "_" ? [] : [{ name: pat.value, kind }];
  }
  if (pat?.type !== "list") return [];
  const h = pat.values[0]?.type === "atom" ? pat.values[0].value : "";
  if (h !== "array" && h !== "object") return [];
  const out = [];
  for (const el of pat.values.slice(1)) {
    if (el.type === "keyword") continue;
    if (el.type === "atom") {
      if (el.value !== "_") out.push({ name: el.value, kind });
    } else if (el.type === "list") {
      const ih = el.values[0]?.type === "atom" ? el.values[0].value : "";
      if (ih === "rest" && el.values[1]) {
        out.push(...patternNames(el.values[1], kind));
      } else if (ih === "default" && el.values[2]) {
        out.push(...patternNames(el.values[2], kind));
      } else if (ih === "array" || ih === "object") {
        out.push(...patternNames(el, kind));
      }
    }
  }
  return out;
}

const RESERVED_SET = new Set(RESERVED_WORDS);
const KIND_PHRASE = {
  "param": "function parameter",
  "bind": "binding name",
  "loop-binding": "loop binding",
  "class-method-param": "class method parameter",
};

/**
 * DD-60 D2: throw on the first binding position whose name is a JS reserved
 * word — before codegen can emit invalid JS at rc=0 (the ID-44 genus). Covers
 * `export`ed names and `kernel:` declaration name slots (walkBindings sees all).
 * @param {Array<object>} forms
 */
export function validateReservedNames(forms) {
  for (const site of walkBindings(forms)) {
    if (RESERVED_SET.has(site.name)) {
      throw new Error(
        `'${site.name}' is a JavaScript reserved word and cannot be used as a ` +
          `lykn ${KIND_PHRASE[site.kind]}; rename it (e.g. \`${site.name}_\`)`,
      );
    }
  }
}
