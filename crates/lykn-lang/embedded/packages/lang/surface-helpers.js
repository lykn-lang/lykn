// DD-37 M22-3b: shared helpers extracted from surface.js.
// Used by both surface.js (for forms not yet migrated) and
// classifier.js (for forms migrated to the new architecture).

import {
  array,
  compilerPrivateAtom,
  formatSExpr,
  gensym,
  isArray,
  isKeyword,
  sym,
} from "./expander-core.js";
import { toJsIdentifier } from "./compiler.js";
import { markKernel } from "./kernel-mark.js";
import { markHostReference } from "./compiler-private-atoms.js";
import { classRegionLayout, functionRegionLayout } from "./lexical-regions.js";
// Param-shape sub-parsers (still in surface.js, not in this extraction set);
// parseTypedParams delegates to them, so import them to satisfy the move.
import {
  parseDefaultParam,
  parseDestructuredParam,
  parseRestParam,
} from "./surface.js";

// Re-export expander helpers for classifier.js convenience
export { array, formatSExpr, gensym, isArray, isKeyword, sym, toJsIdentifier };

export function hostReference(reference) {
  return markHostReference(sym(""), reference);
}

const STATEMENT_ONLY_HEADS = [
  "while",
  "for",
  "for-of",
  "for-in",
  "do-while",
  "switch",
  "label",
  "debugger",
  "block",
  "try",
  "catch",
  "finally",
  "var",
  "const",
  "let",
  "func",
  "class",
  "type",
  "export",
  "import",
];

const CONTROL_TRANSFER_HEADS = ["return", "throw", "break", "continue"];

export function isStatementOnlyForm(expr) {
  if (!isArray(expr) || expr.values.length === 0) return false;
  const head = expr.values[0];
  if (!head || head.type !== "atom") return false;
  const name = head.value;
  if (name === "if") return expr.values.length < 4;
  return STATEMENT_ONLY_HEADS.includes(name);
}

export function wrapReturnLast(bodyForms) {
  if (bodyForms.length === 0) return [];
  const lastExpr = bodyForms[bodyForms.length - 1];
  if (isStatementOnlyForm(lastExpr) || isControlTransferForm(lastExpr)) {
    return [...bodyForms];
  }
  if (bodyForms.length === 1) return [array(sym("return"), bodyForms[0])];
  return [...bodyForms.slice(0, -1), array(sym("return"), lastExpr)];
}

function isControlTransferForm(expr) {
  if (!isArray(expr) || expr.values.length === 0) return false;
  const head = expr.values[0];
  return head?.type === "atom" && CONTROL_TRANSFER_HEADS.includes(head.value);
}

/**
 * Build a list node marked as sanctioned kernel output (so it is not
 * re-classified/re-expanded and is exempt from DD-58 strict). Used by
 * `compileLetPattern`. (DD-37 step 4 — was a mutated per-node kernel marker.)
 * @param {...*} items
 * @returns {object}
 */
export function kernelArray(...items) {
  return markKernel(array(...items));
}

// --- Shared Helpers ---

export function isPascalCase(name) {
  return name.length > 0 && name[0] >= "A" && name[0] <= "Z";
}

/**
 * Build an && chain from an array of check AST nodes.
 */
export function andChain(checks) {
  if (checks.length === 0) return null;
  if (checks.length === 1) return checks[0];
  let result = checks[0];
  for (let i = 1; i < checks.length; i++) {
    result = array(sym("&&"), result, checks[i]);
  }
  return result;
}

/**
 * Determine the static type of a literal AST node, or null if not a literal.
 */
export function getLiteralType(node) {
  if (node.type === "number") return "number";
  if (node.type === "string") return "string";
  if (node.type === "atom") {
    if (node.value === "true" || node.value === "false") return "boolean";
    if (node.value === "null") return "null";
    if (node.value === "undefined") return "undefined";
    if (node.value === "NaN") return "NaN";
  }
  // #a(...) array literal — classified as a list with head "array"
  if (
    node.type === "list" &&
    node.values.length > 0 &&
    node.values[0].type === "atom" &&
    node.values[0].value === "array"
  ) {
    return "array";
  }
  // (obj ...) — classified as a list with head "obj"
  if (
    node.type === "list" &&
    node.values.length > 0 &&
    node.values[0].type === "atom" &&
    node.values[0].value === "obj"
  ) {
    return "object";
  }
  return null;
}

/**
 * Check if a type annotation matches a statically known literal type.
 */
export function typeMatchesLiteral(typeName, literalType) {
  if (literalType === "NaN") return false; // NaN fails :number
  if (literalType === "null") return false; // null fails :object
  if (literalType === "undefined") return false; // undefined fails everything
  return typeName === literalType;
}

/**
 * Build a type check assertion for a parameter.
 * Returns a kernel (if (check) (throw (new TypeError msg))) form, or null for :any.
 */
export function buildTypeCheck(paramNode, typeKw, funcName, label) {
  return buildTypeCheckFor(paramNode, typeKw, funcName, label, paramNode.value);
}

function buildTypeCheckFor(paramNode, typeKw, funcName, label, sourceName) {
  const typeName = typeKw.value;
  if (typeName === "any") return null;

  const paramName = sourceName;
  const hasPunct = (s) => /[^a-zA-Z0-9_-]/.test(s);
  const jsFuncName = toJsIdentifier(funcName);
  const dispFunc = jsFuncName !== funcName && hasPunct(funcName)
    ? `${jsFuncName} (${funcName})`
    : jsFuncName;
  const jsParamName = toJsIdentifier(paramName);
  const dispParam = jsParamName !== paramName && hasPunct(paramName)
    ? `${jsParamName} (${paramName})`
    : jsParamName;
  const msgText = label === "return"
    ? `${dispFunc}: return value expected ${typeName}, got `
    : label
    ? `${dispFunc}: ${label} '${dispParam}' expected ${typeName}, got `
    : `${dispFunc} '${dispParam}': expected ${typeName}, got `;
  const msg = {
    type: "string",
    value: msgText,
  };
  const typeofParam = array(sym("typeof"), paramNode);
  const errorMsg = array(sym("+"), msg, typeofParam);
  const throwStmt = array(
    sym("throw"),
    array(sym("new"), hostReference("TypeError"), errorMsg),
  );

  let check;
  switch (typeName) {
    case "number":
      check = array(
        sym("||"),
        array(sym("!=="), typeofParam, { type: "string", value: "number" }),
        array(hostReference("NumberIsNaN"), paramNode),
      );
      break;
    case "string":
      check = array(sym("!=="), typeofParam, {
        type: "string",
        value: "string",
      });
      break;
    case "boolean":
      check = array(sym("!=="), typeofParam, {
        type: "string",
        value: "boolean",
      });
      break;
    case "function":
      check = array(sym("!=="), typeofParam, {
        type: "string",
        value: "function",
      });
      break;
    case "object":
      check = array(
        sym("||"),
        array(sym("!=="), typeofParam, { type: "string", value: "object" }),
        array(sym("==="), paramNode, sym("null")),
      );
      break;
    case "array":
      check = array(sym("!"), array(hostReference("ArrayIsArray"), paramNode));
      break;
    case "symbol":
      check = array(sym("!=="), typeofParam, {
        type: "string",
        value: "symbol",
      });
      break;
    case "bigint":
      check = array(sym("!=="), typeofParam, {
        type: "string",
        value: "bigint",
      });
      break;
    default:
      // User-defined type — check for tagged object
      check = array(
        sym("||"),
        array(sym("!=="), typeofParam, { type: "string", value: "object" }),
        array(
          sym("||"),
          array(sym("==="), paramNode, sym("null")),
          array(
            sym("!"),
            array(sym("in"), { type: "string", value: "tag" }, paramNode),
          ),
        ),
      );
      break;
  }

  return array(sym("if"), check, throwStmt);
}

// --- Param shape helpers ---

function preparedValue(name) {
  return name.value === "_"
    ? compilerPrivateAtom({}, "discardValue")
    : name;
}

function prepareLeaf(name, typeKw, funcName, label = "arg") {
  const actual = preparedValue(name);
  const check = buildTypeCheckFor(actual, typeKw, funcName, label, name.value);
  return { actual, pattern: actual, checks: check ? [check] : [] };
}

function prepareRestChecks(collection, typeKw, funcName, sourceName) {
  if (typeKw.value === "any") return [];
  const element = compilerPrivateAtom({}, "discardElement");
  const check = buildTypeCheckFor(element, typeKw, funcName, "rest arg", sourceName);
  return check ? [array(sym("for-of"), element, collection, check)] : [];
}

/** Prepare one parsed parameter once for its emitted pattern and guards. */
export function prepareTypedParam(p, funcName) {
  if (!p.destructured) {
    const leaf = prepareLeaf(p.name, p.typeKw, funcName, p.isRest ? "rest arg" : "arg");
    if (p.defaultValue) {
      return { ...leaf, pattern: array(sym("default"), leaf.actual, p.defaultValue) };
    }
    if (p.isRest) {
      return {
        ...leaf,
        pattern: array(sym("rest"), leaf.actual),
        checks: prepareRestChecks(leaf.actual, p.typeKw, funcName, p.name.value),
      };
    }
    return leaf;
  }

  const checks = [];
  if (p.kind === "object") {
    const fields = p.fields.map((field) => {
      if (field.nested) {
        const nested = prepareTypedParam(field.pattern, funcName);
        checks.push(...nested.checks);
        if (field.typeKw && field.typeKw.value !== "any") {
          const check = buildTypeCheckFor(
            field.alias,
            field.typeKw,
            funcName,
            "arg",
            field.alias.value,
          );
          if (check) checks.push(check);
        }
        return field.alias
          ? array(sym("alias"), field.alias, nested.pattern)
          : nested.pattern;
      }
      if (field.skip) return field.name;
      const leaf = prepareLeaf(field.name, field.typeKw, funcName);
      checks.push(...leaf.checks);
      if (field.defaultValue) {
        return field.name.value === "_"
          ? array(sym("alias"), field.name, array(sym("default"), leaf.actual, field.defaultValue))
          : array(sym("default"), field.name, field.defaultValue);
      }
      return field.name.value === "_"
        ? array(sym("alias"), field.name, leaf.actual)
        : field.name;
    });
    return { actual: null, pattern: array(sym("object"), ...fields), checks };
  }

  const fields = p.fields.map((field) => {
    if (field.skip) return field.name;
    if (field.nested) {
      const nested = prepareTypedParam(field.pattern, funcName);
      checks.push(...nested.checks);
      if (field.typeKw && field.typeKw.value !== "any") {
        const check = buildTypeCheckFor(
          field.alias,
          field.typeKw,
          funcName,
          "arg",
          field.alias.value,
        );
        if (check) checks.push(check);
      }
      return field.alias
        ? array(sym("alias"), field.alias, nested.pattern)
        : nested.pattern;
    }
    const leaf = prepareLeaf(field.name, field.typeKw, funcName);
    checks.push(...leaf.checks);
    return field.defaultValue
      ? array(sym("default"), leaf.actual, field.defaultValue)
      : leaf.actual;
  });
  if (p.rest) {
    const rest = prepareLeaf(p.rest.name, p.rest.typeKw, funcName, "rest arg");
    fields.push(array(sym("rest"), rest.actual));
    checks.push(...prepareRestChecks(rest.actual, p.rest.typeKw, funcName, p.rest.name.value));
  }
  return { actual: null, pattern: array(sym("array"), ...fields), checks };
}

/** Lower a normal-source Bind pattern without changing value expressions. */
export function lowerDiscardBindingPattern(pattern) {
  if (pattern?.type === "atom") return preparedValue(pattern);
  if (pattern?.type !== "list" || pattern.values.length === 0) return pattern;
  const [head, ...parts] = pattern.values;
  if (head?.type !== "atom") return pattern;
  if (head.value === "array") {
    return { ...pattern, values: [head, ...parts.map((part) =>
      part?.type === "atom" && part.value === "_"
        ? part
        : lowerBindingPatternChild(part))] };
  }
  if (head.value === "object") {
    return { ...pattern, values: [head, ...parts.map((part) => {
      if (part?.type === "atom") {
        return part.value === "_" ? array(sym("alias"), part, preparedValue(part)) : part;
      }
      if (part?.type !== "list" || part.values[0]?.type !== "atom") return part;
      const memberHead = part.values[0].value;
      if (memberHead === "default" && part.values.length === 3 && part.values[1]?.type === "atom" && part.values[1].value === "_") {
        return array(sym("alias"), part.values[1], array(sym("default"), preparedValue(part.values[1]), part.values[2]), ...part.values.slice(3));
      }
      if (memberHead === "alias" && part.values.length >= 3) {
        return { ...part, values: [part.values[0], part.values[1], lowerBindingPatternChild(part.values[2]), ...part.values.slice(3)] };
      }
      if (memberHead === "rest" || memberHead === "spread") {
        if (part.values.length < 2) return part;
        return { ...part, values: [part.values[0], lowerBindingPatternChild(part.values[1]), ...part.values.slice(2)] };
      }
      return part;
    })] };
  }
  if ((head.value === "rest" || head.value === "spread") && parts.length > 0) {
    return { ...pattern, values: [head, lowerBindingPatternChild(parts[0]), ...parts.slice(1)] };
  }
  if (head.value === "default" && parts.length >= 2) {
    return { ...pattern, values: [head, lowerBindingPatternChild(parts[0]), ...parts.slice(1)] };
  }
  return pattern;
}

/** Prepare discard slots in an unmarked public kernel source form only. */
export function prepareSourceDiscardBindings(form) {
  if (form?.type !== "list" || form.values.length === 0) return form;
  const head = form.values[0]?.type === "atom" ? form.values[0].value : "";
  const values = form.values.slice();
  const prepareParams = (list) => list?.type === "list"
    ? { ...list, values: list.values.map(lowerDiscardBindingPattern) }
    : list;
  const prepareFunction = (node) => {
    const layout = functionRegionLayout(node);
    const paramsPath = layout?.clauses?.[0]?.paramsPath;
    if (!paramsPath || paramsPath.length !== 1) return node;
    const paramsIndex = paramsPath[0];
    if (node.values[paramsIndex]?.type !== "list") return node;
    const next = node.values.slice();
    next[paramsIndex] = prepareParams(next[paramsIndex]);
    return { ...node, values: next };
  };

  if (["const", "let", "var"].includes(head) && values[1]) {
    values[1] = lowerDiscardBindingPattern(values[1]);
  } else if (["for-of", "for-in", "for-await-of"].includes(head) && values[1]) {
    values[1] = lowerDiscardBindingPattern(values[1]);
  } else if (["function", "function*", "=>"].includes(head)) {
    return prepareFunction(form);
  } else if (head === "class" || head === "class-expr") {
    const layout = classRegionLayout(form);
    if (!layout) return form;
    const prepareMember = (member) => {
      if (member?.type !== "list" || member.values.length === 0) return member;
      const memberHead = member.values[0]?.type === "atom" ? member.values[0].value : "";
      if (memberHead === "static" || memberHead === "async") {
        if (!member.values[1]) return member;
        return { ...member, values: [member.values[0], prepareMember(member.values[1]), ...member.values.slice(2)] };
      }
      if (memberHead === "field") return member;
      const paramsIndex = memberHead === "get" || memberHead === "set" ? 2 : 1;
      if (member.values[paramsIndex]?.type !== "list") return member;
      const next = member.values.slice();
      next[paramsIndex] = prepareParams(next[paramsIndex]);
      return { ...member, values: next };
    };
    const baseIndex = head === "class" ? 2 : 1;
    for (let i = baseIndex + 1; i < values.length; i++) values[i] = prepareMember(values[i]);
  } else if (head === "try") {
    let bodyEnd = values.length;
    if (values[bodyEnd - 1]?.values?.[0]?.value === "finally") bodyEnd--;
    const catcher = values[bodyEnd - 1];
    if (catcher?.type === "list" && catcher.values[0]?.value === "catch" && catcher.values[1]) {
      const next = catcher.values.slice();
      next[1] = lowerLegacyCatchBinding(next[1]);
      values[bodyEnd - 1] = { ...catcher, values: next };
    }
  }
  return { ...form, values };
}

function lowerLegacyCatchBinding(node) {
  if (node?.type === "atom") return preparedValue(node);
  if (node?.type !== "list" || node.values.length === 0) return node;
  const [head, ...parts] = node.values;
  const name = head?.type === "atom" ? head.value : "";
  if (name === "array") {
    return { ...node, values: [head, ...parts.map(lowerLegacyCatchBinding)] };
  }
  if (name === "object") {
    return {
      ...node,
      values: [head, ...parts.map((part) => {
        if (part?.type === "atom" && part.value === "_") {
          return array({ type: "string", value: "_" }, preparedValue(part));
        }
        if (part?.type !== "list" || part.values.length < 2) return part;
        const next = part.values.slice();
        if (next[0]?.type === "atom" && ["rest", "spread", "default"].includes(next[0].value)) {
          next[1] = lowerLegacyCatchBinding(next[1]);
          return { ...part, values: next };
        }
        if (next[0]?.type === "list") {
          next[1] = lowerLegacyCatchBinding(next[1]);
          return { ...part, values: next };
        }
        next[1] = lowerLegacyCatchBinding(next[1]);
        return { ...part, values: next };
      })],
    };
  }
  if (name === "default" && parts.length >= 2) {
    return { ...node, values: [head, lowerLegacyCatchBinding(parts[0]), ...parts.slice(1)] };
  }
  if ((name === "rest" || name === "spread") && parts.length > 0) {
    return { ...node, values: [head, lowerLegacyCatchBinding(parts[0]), ...parts.slice(1)] };
  }
  return node;
}

/** Prepare a normal-source Bind binder and its optional scalar annotation. */
export function prepareTypedBind(pattern, typeKw, funcName = "bind") {
  if (pattern?.type === "atom") {
    const actual = preparedValue(pattern);
    const check = typeKw
      ? buildTypeCheckFor(actual, typeKw, funcName, "", pattern.value)
      : null;
    return { pattern: actual, actual, checks: check ? [check] : [] };
  }
  const check = buildTypeCheck(pattern, typeKw, funcName, "");
  return {
    pattern: lowerDiscardBindingPattern(pattern),
    actual: pattern,
    checks: check ? [check] : [],
  };
}

function lowerBindingPatternChild(child) {
  if (child?.type === "atom") return preparedValue(child);
  if (child?.type !== "list" || child.values.length === 0) return child;
  const head = child.values[0];
  if ((head?.type === "atom" && (head.value === "rest" || head.value === "spread")) && child.values.length < 2) {
    return child;
  }
  if (head?.type === "atom" && (head.value === "array" || head.value === "object")) {
    return lowerDiscardBindingPattern(child);
  }
  if (head?.type === "atom" && (head.value === "rest" || head.value === "spread" || head.value === "default")) {
    return lowerDiscardBindingPattern(child);
  }
  if (head?.type === "atom" && head.value === "alias" && child.values.length >= 3) {
    return { ...child, values: [head, child.values[1], lowerBindingPatternChild(child.values[2]), ...child.values.slice(3)] };
  }
  return child;
}

/**
 * Compile a match pattern against a target symbol.
 * Returns { checks: AST[], bindings: AST[] }.
 * checks are conditions (to be &&'d together).
 * bindings are (const ...) forms.
 */
export function compilePattern(pattern, targetSym, { typeContext } = {}) {
  const declarations = [];
  const checks = [];
  const bindings = [];
  const member = (target, key) => kernelArray(sym("get"), target,
    { type: "string", value: toJsIdentifier(key) });
  const capture = (target, key) => {
    const identity = {};
    const temp = compilerPrivateAtom(identity, "patternField");
    declarations.push(kernelArray(sym("let"), compilerPrivateAtom(identity, "patternField")));
    checks.push(kernelArray(sym("seq"), kernelArray(sym("="), temp,
      member(target, key)), sym("true")));
    return temp;
  };
  const literal = (node) => node.type === "number" || node.type === "string" || node.type === "null" ||
    node.type === "keyword" || (node.type === "atom" &&
      ["true", "false", "null", "undefined"].includes(node.value));
  const visit = (node, target) => {
    if (node.type === "atom" && node.value === "_") return;
    if (literal(node)) {
      const value = node.type === "keyword" ? { type: "string", value: node.value } : node;
      checks.push(array(sym("==="), target, value));
      return;
    }
    if (node.type === "atom" && isPascalCase(node.value)) {
      checks.push(array(sym("!="), target, sym("null")));
      checks.push(array(sym("==="), member(target, "tag"), { type: "string", value: node.value }));
      return;
    }
    if (node.type === "atom") {
      bindings.push(array(sym("const"), node, target));
      return;
    }
    if (node.type !== "list" || !node.values.length) throw new Error(`match: unrecognized pattern: ${formatSExpr(node)}`);
    const head = node.values[0];
    if (head.type === "atom" && head.value === "obj") {
      checks.push(array(sym("==="), array(sym("typeof"), target), { type: "string", value: "object" }));
      checks.push(array(sym("!=="), target, sym("null")));
      for (let i = 1; i < node.values.length; i += 2) {
        const key = node.values[i], child = node.values[i + 1];
        if (!isKeyword(key) || !child) throw new Error(`match obj pattern: expected keyword/value pair`);
        checks.push(array(sym("in"), { type: "string", value: key.value }, target));
        if (child.type === "atom" && child.value === "_") continue;
        const cached = capture(target, key.value);
        visit(child, cached);
      }
      return;
    }
    if (head.type === "atom" && isPascalCase(head.value)) {
      const ctorName = head.value;
      if (!typeContext?.constructors) {
        throw new TypeError("compilePattern: typeContext is required for constructor patterns");
      }
      const fields = typeContext.constructors.get(ctorName);
      const children = node.values.slice(1);
      if (!fields) {
        // Compatibility: unregistered constructors retain positional Object.values mapping.
        checks.push(array(sym("!="), target, sym("null")));
        checks.push(array(sym("==="), member(target, "tag"), { type: "string", value: ctorName }));
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (child.type === "atom" && child.value === "_") continue;
          const identity = {};
          const temp = compilerPrivateAtom(identity, "patternField");
          declarations.push(kernelArray(sym("let"), compilerPrivateAtom(identity, "patternField")));
          checks.push(kernelArray(sym("seq"), kernelArray(sym("="), temp,
            array(sym("get"), array(sym("Object:values"), target), { type: "number", value: i + 1 })), sym("true")));
          if (child.type === "atom" && !literal(child)) bindings.push(array(sym("const"), child, temp));
          else if (child.type === "list") visit(child, temp);
          else if (literal(child)) visit(child, temp);
        }
        return;
      }
      checks.push(array(sym("!="), target, sym("null")));
      checks.push(array(sym("==="), member(target, "tag"), { type: "string", value: ctorName }));
      for (let i = 0; i < children.length && i < fields.length; i++) {
        const child = children[i];
        if (child.type === "atom" && child.value === "_") continue;
        const cached = capture(target, fields[i]);
        visit(child, cached);
      }
      return;
    }
    throw new Error(`match: unrecognized pattern: ${formatSExpr(node)}`);
  };
  visit(pattern, targetSym);
  return { checks, bindings, declarations };
}

export function compileLetPattern(pattern, tempVar, { typeContext } = {}) {
  const isLiteral = ["number", "string", "keyword", "null"].includes(pattern.type) ||
    (pattern.type === "atom" && ["true", "false", "null", "undefined"].includes(pattern.value));
  const isObject = isArray(pattern) && pattern.values[0]?.type === "atom" && pattern.values[0].value === "obj";
  const isConstructor = isArray(pattern) && pattern.values[0]?.type === "atom" && isPascalCase(pattern.values[0].value);
  if (pattern.type === "atom" && !isPascalCase(pattern.value) && !isObject && !isConstructor) {
    if (pattern.value === "_") return { condition: sym("true"), bindings: [], declarations: [] };
    if (["true", "false", "null", "undefined"].includes(pattern.value)) {
      const plan = compilePattern(pattern, tempVar, { typeContext });
      return { condition: andChain(plan.checks) ?? sym("true"), ...plan };
    }
    const condition = kernelArray(sym("!="), tempVar, sym("null"));
    return { condition, bindings: [array(sym("const"), pattern, tempVar)], declarations: [] };
  }
  if (isLiteral || (pattern.type === "atom" && isPascalCase(pattern.value)) || isObject || isConstructor) {
    const plan = compilePattern(pattern, tempVar, { typeContext });
    return { condition: andChain(plan.checks) ?? sym("true"), ...plan };
  }
  return null;
}

/**
 * Parse typed parameter list: (:type name :type name ...) → [{typeKw, name}, ...]
 * Also accepts destructuring patterns, (default ...), and (rest ...).
 */
export function parseTypedParams(paramList) {
  const params = [];
  const values = paramList.values;
  let i = 0;
  while (i < values.length) {
    if (isArray(values[i])) {
      const headVal = values[i].values[0];
      const headName = headVal?.type === "atom" ? headVal.value : "";
      if (headName === "object" || headName === "array") {
        params.push(parseDestructuredParam(values[i]));
      } else if (headName === "default") {
        params.push(parseDefaultParam(values[i]));
      } else if (headName === "rest") {
        params.push(parseRestParam(values[i]));
      } else {
        throw new Error(
          `expected 'object', 'array', 'default', or 'rest' at head of sub-form in :args, got '${
            headName || values[i].type
          }'`,
        );
      }
      i += 1;
    } else if (isKeyword(values[i])) {
      // Simple param — :type name pair
      if (i + 1 >= values.length) {
        throw new Error(
          `type keyword :${values[i].value} has no parameter name`,
        );
      }
      if (values[i + 1]?.type !== "atom") {
        throw new Error("parameter name must be an atom");
      }
      params.push({ typeKw: values[i], name: values[i + 1] });
      i += 2;
    } else {
      throw new Error(
        `expected type keyword or sub-form at position ${i}, got ${
          values[i]?.type ?? "nothing"
        }`,
      );
    }
  }
  // Validate rest constraints
  const restParams = params.filter((p) => p.isRest);
  if (restParams.length > 1) {
    throw new Error("only one rest parameter allowed");
  }
  if (restParams.length === 1) {
    const lastParam = params[params.length - 1];
    if (!lastParam.isRest) {
      throw new Error("rest parameter must be the last parameter");
    }
  }
  return params;
}
