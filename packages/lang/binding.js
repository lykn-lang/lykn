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
/**
 * @typedef {{ name: string, kind: BindingKind, node?: object }} BindingSite
 * `node` is the binder's atom node (present for leaf name sites) — the
 * resolution pass (slice10) tags it `def`. D2 (`validateReservedNames`) reads
 * only `name`/`kind`, so `node` is purely additive.
 */

const DECL_HEADS = new Set(["const", "let", "var", "function", "function*"]);
const ENCLOSING_KINDS = new Set(["bind", "import-local"]);
const SEQUENCE = { kind: "seq" };

/**
 * Recursively walk `forms`, collecting every binding site in source order.
 * @param {Array<object>} forms
 * @returns {BindingSite[]}
 */
export function walkBindings(forms) {
  const out = [];
  walkSequence(forms, out, false);
  return out;
}

function withMatchName(inScope, names) {
  return inScope || names.includes("match");
}

function walkSequence(forms, out, matchInScope) {
  let current = matchInScope;
  for (const form of forms) {
    walk(form, out, current);
    const hoisted = form?.type === "list" ? hoistedNames(form) : [];
    current = withMatchName(current, hoisted);
  }
}

function walk(form, out, matchInScope) {
  if (form?.type !== "list") return;

  const head = form.values[0];
  const headName = head?.type === "atom" && head.binding === undefined
    ? head.value
    : null;
  if (head?.type === "atom" && head.value === "match") {
    if (headName === null || matchInScope) {
      // A bound or tagged `match` is a call. Its arguments are ordinary
      // expressions in the incoming environment; call operands do not hoist.
      for (const argument of form.values.slice(1)) walk(argument, out, matchInScope);
      return;
    }

    // Patterns and :when markers are structure. Project every real pattern
    // site exactly once before visiting executable source regions.
    out.push(...bindingsIntroduced(form));
    const args = form.values.slice(1);
    if (args.length > 0) walk(args[0], out, matchInScope);
    for (const clause of args.slice(1)) {
      if (clause?.type !== "list" || clause.values.length === 0) continue;
      const patternSites = matchPatternNames(clause.values[0]);
      const clauseScope = withMatchName(
        matchInScope,
        patternSites.map((site) => site.name),
      );
      const guard = isMatchGuardSlot(clause) ? clause.values[2] : null;
      if (guard !== null) walk(guard, out, clauseScope);
      const bodyStart = guard === null ? 1 : 3;
      walkSequence(clause.values.slice(bodyStart), out, clauseScope);
    }
    return;
  }

  out.push(...bindingsIntroduced(form));
  if (headName === null) {
    // Preserve traversal of a computed list callee; atom heads themselves are
    // names, not nested forms.
    const children = head?.type === "atom" ? form.values.slice(1) : form.values;
    for (const child of children) walk(child, out, matchInScope);
    return;
  }

  const plan = bindingScopePlan(form, headName);
  const children = form.values;
  if (plan.kind === "conditional") {
    if (children.length > 1) walk(children[1], out, matchInScope);
    for (const branch of children.slice(2)) walk(branch, out, matchInScope);
    return;
  }
  if (plan.kind === "seq") {
    walkSequence(children, out, matchInScope);
    return;
  }

  const split = Math.min(plan.bodyStart, children.length);
  for (const child of children.slice(0, split)) walk(child, out, matchInScope);
  walkSequence(
    children.slice(split),
    out,
    withMatchName(matchInScope, plan.names),
  );
}

/** Extend an immutable source environment with a collection of names. */
export function extendBindingEnv(env, names) {
  if (names.length === 0) return env;
  const next = new Set(env);
  for (const name of names) next.add(name);
  return next;
}

/** Value-scope names introduced by a form, excluding labels. */
export function bodyScopeNames(form) {
  return bindingsIntroduced(form)
    .filter((site) => site.kind !== "label")
    .map((site) => site.name);
}

/** Names visible to following siblings (`bind` and import locals). */
export function hoistedNames(form) {
  return bindingsIntroduced(form)
    .filter((site) => site.kind !== "label" && ENCLOSING_KINDS.has(site.kind))
    .map((site) => site.name);
}

/**
 * Describe the source binding scope for a form. The caller supplies the
 * already resolution-checked head name so this module stays independent of
 * compiler dispatch and tagged/bound heads can pass null.
 */
export function bindingScopePlan(form, headName) {
  if (form?.type !== "list" || form.values.length === 0) return SEQUENCE;
  switch (headName) {
    case "if":
      return { kind: "conditional" };
    case "for-of":
    case "for-in":
    case "for-await-of":
      return { kind: "body", names: bodyScopeNames(form), bodyStart: 3 };
    case "if-let":
    case "when-let":
    case "match":
      return { kind: "body", names: bodyScopeNames(form), bodyStart: 2 };
    default: {
      const kernel = headName?.startsWith("kernel:")
        ? headName.slice("kernel:".length)
        : headName;
      if (headName === "bind" || DECL_HEADS.has(kernel)) return SEQUENCE;
      const names = bodyScopeNames(form);
      return names.length === 0
        ? SEQUENCE
        : { kind: "body", names, bodyStart: 0 };
    }
  }
}

/** Whether a match clause has the classifier-owned optional guard slot. */
export function isMatchGuardSlot(clause) {
  return clause?.type === "list" && clause.values.length >= 3 &&
    clause.values[1]?.type === "keyword" && clause.values[1].value === "when";
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
      return classNames(args);
    case "type":
      return typeConstructorNames(args);
    // DD-60 refinement (2026-07-06): if-let/when-let binding patterns and match
    // clause patterns bind names too.
    case "if-let":
    case "when-let":
      return ifLetPatternNames(args);
    case "match":
      return matchClauseNames(args);
    // DD-60 refinement #2 (2026-07-06): catch bindings, import locals, labels.
    case "catch":
      return args.length > 0 ? patternNames(args[0], "catch-binding") : [];
    case "import":
      return importLocalNames(args);
    case "label":
      return args[0]?.type === "atom" && args[0].value !== "_"
        ? [{ name: args[0].value, kind: "label", node: args[0] }]
        : [];
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

/** (bind name value) / (bind :type name value) / grouped bind pairs. */
function bindNames(args) {
  const out = [];
  if (args.length === 2) return patternNames(args[0], "bind");
  if (args.length === 3) return patternNames(args[1], "bind");
  if (args.length < 4) return [];

  let i = 0;
  while (i < args.length) {
    let slot;
    if (args[i]?.type === "keyword") {
      if (i + 2 >= args.length) return out;
      slot = args[i + 1];
      i += 3;
    } else {
      if (i + 1 >= args.length) return out;
      slot = args[i];
      i += 2;
    }
    out.push(...patternNames(slot, "bind"));
  }
  return out;
}

const FUNC_CLAUSE_KEYS = new Set([
  "args",
  "yields",
  "returns",
  "pre",
  "post",
  "body",
]);

/** func/genfunc: the function NAME (a binder — sweep finding) + every param. */
function funcClauseParamNames(args) {
  const out = [];
  // `(func NAME …)` / `(genfunc NAME …)` — NAME lowers to `function NAME`.
  if (args[0]?.type === "atom" && args[0].value !== "_") {
    out.push({ name: args[0].value, kind: "bind", node: args[0] });
  }
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
      if (el.value !== "_") out.push({ name: el.value, kind: "param", node: el });
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

/**
 * Class binders: the class NAME (`class NAME` — a binder, sweep finding) + every
 * method/constructor param. Field/method names are property names (reserved
 * words legal), so not binders.
 */
function classNames(args) {
  const out = [];
  // (class NAME (bases) member…) — NAME is args[0].
  if (args[0]?.type === "atom" && args[0].value !== "_") {
    out.push({ name: args[0].value, kind: "bind", node: args[0] });
  }
  for (const member of args.slice(1)) {
    if (member?.type !== "list") continue;
    const params = member.values[1];
    if (params?.type === "list") {
      for (const p of params.values) {
        if (p.type === "atom" && p.value !== "_") {
          out.push({ name: p.value, kind: "class-method-param", node: p });
        }
      }
    }
  }
  return out;
}

/**
 * import local names — the default-import name and every named-specifier local.
 * Mirrors the Rust `import_local_names` and codegen `emit_import`: `(import "m")`
 * none, `(import "m" name)` default, `(import "m" (spec…))` named,
 * `(import "m" name (spec…))` default+named. A spec is an atom (local = name)
 * or `(alias original local)` (local = 3rd element).
 */
function importLocalNames(args) {
  const out = [];
  const second = args[1];
  if (!second) return out; // side-effect import
  if (second.type === "list") {
    importSpecs(second.values, out);
  } else if (second.type === "atom" && second.value !== "_") {
    out.push({ name: second.value, kind: "import-local", node: second }); // default import
    if (args[2]?.type === "list") importSpecs(args[2].values, out);
  }
  return out;
}

function importSpecs(specs, out) {
  for (const spec of specs) {
    if (spec.type === "atom") {
      if (spec.value !== "_") {
        out.push({ name: spec.value, kind: "import-local", node: spec });
      }
    } else if (
      spec.type === "list" && spec.values[0]?.type === "atom" &&
      spec.values[0].value === "alias" && spec.values[2]?.type === "atom"
    ) {
      out.push({ name: spec.values[2].value, kind: "import-local", node: spec.values[2] });
    }
  }
}

/**
 * type: `(type NAME (CtorName :type field…) …)` lowers to `function CtorName(
 * field…)` per constructor — the constructor name and every field are binders
 * (sweep finding). The type name itself is erased (not a runtime binder).
 */
function typeConstructorNames(args) {
  const out = [];
  for (const ctor of args.slice(1)) {
    if (ctor?.type !== "list" || ctor.values.length === 0) continue;
    const head = ctor.values[0];
    if (head.type === "atom" && head.value !== "_") {
      out.push({ name: head.value, kind: "bind", node: head }); // constructor name
    }
    for (const field of ctor.values.slice(1)) {
      if (field.type === "atom" && field.value !== "_") {
        out.push({ name: field.value, kind: "param", node: field }); // field param
      }
    }
  }
  return out;
}

/** if-let/when-let: `(if-let (BINDING expr) …)` — BINDING is a match-pattern. */
function ifLetPatternNames(args) {
  const pair = args[0];
  if (pair?.type !== "list" || pair.values.length === 0) return [];
  return matchPatternNames(pair.values[0]);
}

/** match: `(match target (PAT body…) …)` — each clause's pattern binds. */
function matchClauseNames(args) {
  const out = [];
  for (const clause of args.slice(1)) {
    if (clause?.type === "list" && clause.values.length > 0) {
      out.push(...matchPatternNames(clause.values[0]));
    }
  }
  return out;
}

/**
 * Names bound by a match/if-let/when-let pattern — mirrors the Rust
 * `classify_pattern`: `_`, `true`/`false`/`null`/`undefined`, PascalCase heads,
 * and literals bind nothing; lowercase atoms bind; constructor and `obj`
 * sub-patterns recurse.
 */
function matchPatternNames(pat) {
  if (pat?.type === "atom") {
    const v = pat.value;
    if (
      v === "_" || v === "true" || v === "false" || v === "null" ||
      v === "undefined"
    ) {
      return [];
    }
    if (/^[A-Z]/.test(v)) return []; // PascalCase — nullary constructor
    return [{ name: v, kind: "pattern", node: pat }];
  }
  if (pat?.type !== "list" || pat.values.length === 0) return [];
  const head = pat.values[0];
  if (head.type !== "atom") return [];
  if (head.value === "obj") {
    const out = [];
    for (let i = 1; i + 1 < pat.values.length; i += 2) {
      out.push(...matchPatternNames(pat.values[i + 1]));
    }
    return out;
  }
  if (/^[A-Z]/.test(head.value)) {
    const out = [];
    for (const sub of pat.values.slice(1)) out.push(...matchPatternNames(sub));
    return out;
  }
  return [];
}

/** Leaf names bound by a pattern: an atom or an (array …)/(object …) form. */
export function bindingNamesInPattern(pat, kind = "bind") {
  return patternNames(pat, kind);
}

function patternNames(pat, kind) {
  if (pat?.type === "atom") {
    return pat.value === "_" ? [] : [{ name: pat.value, kind, node: pat }];
  }
  if (pat?.type !== "list") return [];
  const h = pat.values[0]?.type === "atom" ? pat.values[0].value : "";
  if (h !== "array" && h !== "object") return [];
  const out = [];
  for (const el of pat.values.slice(1)) {
    if (el.type === "keyword") continue;
    if (el.type === "atom") {
      if (el.value !== "_") out.push({ name: el.value, kind, node: el });
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
  "pattern": "pattern binding",
  "catch-binding": "catch binding",
  "import-local": "imported name",
  "label": "label",
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
