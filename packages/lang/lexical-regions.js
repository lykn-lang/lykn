/**
 * Private occurrence-indexed lexical layouts for source functions and kernel
 * class members. Paths refer to positions in the original tree, never object
 * identity, spans or owner identity.
 */
import { FUNC_CLAUSE_KEYS, genfnBodyLayout, keywordGroupRanges } from "./function-clauses.js";
import { isKernel } from "./kernel-mark.js";

/** @typedef {"TypedParameter"|"BindingPattern"} ParameterGrammar */

/** @param {object} form @returns {object|null} */
export function functionRegionLayout(form) {
  if (form?.type !== "list" || form.values[0]?.type !== "atom") return null;
  const head = form.values[0].value;
  if (!["func", "genfunc", "fn", "genfn", "lambda", "function", "function*", "=>", "kernel:function", "kernel:function*", "kernel:=>", "kernel:lambda"].includes(head)) return null;
  if (head === "func" || head === "genfunc") {
    const args = form.values.slice(2);
    const first = args[0];
    const multi = first?.type === "list" && first.values[0]?.type === "keyword" &&
      FUNC_CLAUSE_KEYS.has(first.values[0].value);
    const keyword = !multi && first?.type === "keyword" && FUNC_CLAUSE_KEYS.has(first.value);
    const clauses = [];
    if (multi) {
      for (let offset = 0; offset < args.length; offset++) {
        const clause = args[offset];
        if (clause?.type !== "list" || clause.values[0]?.type !== "keyword" || !FUNC_CLAUSE_KEYS.has(clause.values[0].value)) return null;
        clauses.push(sourceClauseLayout(clause.values, [offset + 2], 0));
      }
    } else if (keyword) {
      clauses.push(sourceClauseLayout(args, [], 2));
    } else {
      clauses.push({ grammar: "SourceFuncShorthand", clausePath: [], paramsPath: null, defaultPaths: [], prePaths: [], bodyPaths: form.values.slice(2).map((_, i) => [i + 2]), postPaths: [] });
    }
    return clauses.every(Boolean) ? { grammar: head === "func" ? "SourceFunc" : "SourceGenfunc", namePath: [1], clauses } : null;
  }
  const args = form.values.slice(1);
  const kernelHead = head.startsWith("kernel:") ? head.slice("kernel:".length) : head;
  const namedFunction = ["function", "function*"].includes(kernelHead);
  const paramsIndex = namedFunction && args[0]?.type === "atom" ? 1 : 0;
  const kernel = isKernel(form) || head.startsWith("kernel:") || ["function", "function*", "=>"].includes(head);
  const paramsPath = args[paramsIndex]?.type === "list" ? [1 + paramsIndex] : null;
  const defaultPaths = paramsPath ? parameterDefaultPaths(atOccurrencePath(form, paramsPath), paramsPath, kernel ? "BindingPattern" : "TypedParameter") : [];
  const namePath = namedFunction && args[0]?.type === "atom" ? [1] : null;
  const bodyArgs = head === "genfn" ? genfnBodyLayout(args) : null;
  if (head === "genfn" && !bodyArgs) return null;
  const bodyStart = head === "genfn" ? bodyArgs.bodyStart : paramsIndex + 1;
  return { grammar: kernel ? "Kernel" : "TypedSource", namePath, clauses: [{ grammar: head, clausePath: [], paramsPath, defaultPaths, prePaths: [], bodyPaths: args.slice(bodyStart).map((_, i) => [1 + bodyStart + i]), postPaths: [] }] };
}

/** @param {object[]} items @param {number[]} clausePath @param {number} rootOffset */
function sourceClauseLayout(items, clausePath, rootOffset) {
  const groups = keywordGroupRanges(items);
  const paths = (key) => {
    const group = groups.get(key);
    return group ? Array.from({ length: group.valueEnd - group.valueStart }, (_, i) => [...clausePath, group.valueStart + i + rootOffset]) : [];
  };
  const args = groups.get("args");
  const paramsPath = args && args.valueStart < args.valueEnd ? [...clausePath, args.valueStart + rootOffset] : null;
  const bodyPaths = paths("body");
  if (!bodyPaths.length) return null;
  const defaultPaths = paramsPath
    ? parameterDefaultPaths(items[args.valueStart], [ ...clausePath, args.valueStart + rootOffset ], "TypedParameter")
    : [];
  return { grammar: "TypedParameter", clausePath, paramsPath, defaultPaths, prePaths: paths("pre"), bodyPaths, postPaths: paths("post") };
}

function parameterDefaultPaths(params, basePath, grammar) {
  if (params?.type !== "list") return [];
  const typed = grammar === "TypedParameter";
  const out = [];
  const visit = (node, path) => {
    if (node?.type !== "list" || !node.values.length) return;
    const head = node.values[0]?.type === "atom" ? node.values[0].value : "";
    if (head === "default") {
      const index = typed ? 3 : 2;
      if (node.values[index]) out.push([...path, index]);
      if (!typed && node.values[1]) visit(node.values[1], [...path, 1]);
    } else if (head === "rest") {
      const index = typed ? 2 : 1;
      if (node.values[index]) visit(node.values[index], [...path, index]);
    } else if (head === "array" || head === "object") {
      for (let i = 1; i < node.values.length; i++) {
        const child = node.values[i];
        if (child?.type !== "list") continue;
        const childHead = child.values[0]?.type === "atom" ? child.values[0].value : "";
        if (["default", "rest", "array", "object"].includes(childHead)) visit(child, [...path, i]);
        else if (childHead === "alias") {
          const nested = typed ? 3 : 2;
          if (child.values[nested]) visit(child.values[nested], [...path, i, nested]);
          if (!typed && child.values[3]) out.push([...path, i, 3]);
        }
      }
    }
  };
  for (let i = 0; i < params.values.length; i++) visit(params.values[i], [...basePath, i]);
  return out;
}

/** Describe class bases and each independent member's executable region. */
export function classRegionLayout(form) {
  if (form?.type !== "list" || !["class", "class-expr"].includes(form.values[0]?.value)) return null;
  const named = form.values[0].value === "class";
  const baseIndex = named ? 2 : 1;
  const memberStart = baseIndex + 1;
  return {
    grammar: named ? "Class" : "ClassExpr",
    namePath: named && form.values[1] ? [1] : null,
    basePaths: form.values[baseIndex]?.type === "list" ? form.values[baseIndex].values.map((_, i) => [baseIndex, i]) : [],
    members: form.values.slice(memberStart).map((member, i) => classMemberLayout(member, [memberStart + i])),
  };
}

function classMemberLayout(member, path) {
  if (member?.type !== "list" || !member.values.length) return { grammar: "Opaque", path, paramsPath: null, defaultPaths: [], bodyPaths: [], initPaths: [] };
  const head = member.values[0]?.type === "atom" ? member.values[0].value : "";
  if (head === "static" || head === "async") {
    const inner = member.values[1] ? classMemberLayout(member.values[1], [...path, 1]) : null;
    return { grammar: "Wrapper", path, wrapper: head, inner, paramsPath: null, defaultPaths: [], bodyPaths: [], initPaths: [] };
  }
  if (head === "field") return { grammar: "Field", path, propertyPath: [...path, 1], paramsPath: null, defaultPaths: [], bodyPaths: [], initPaths: member.values[2] ? [[...path, 2]] : [] };
  const paramsIndex = head === "get" || head === "set" ? 2 : 1;
  const bodyStart = paramsIndex + 1;
  const paramsPath = member.values[paramsIndex]?.type === "list" ? [...path, paramsIndex] : null;
  return {
    grammar: head === "constructor" ? "Constructor" : head === "get" ? "Getter" : head === "set" ? "Setter" : "Method",
    path,
    propertyPath: ["get", "set"].includes(head) ? [...path, 1] : head === "constructor" ? null : [...path, 0],
    paramsPath,
    defaultPaths: paramsPath ? parameterDefaultPaths(member.values[paramsIndex], paramsPath, "BindingPattern") : [],
    bodyPaths: member.values.slice(bodyStart).map((_, i) => [...path, bodyStart + i]),
    initPaths: [],
  };
}

/** Resolve a child-index path against its original tree. */
export function atOccurrencePath(root, path) {
  return path.reduce((node, index) => node?.type === "list" ? node.values[index] : undefined, root);
}
