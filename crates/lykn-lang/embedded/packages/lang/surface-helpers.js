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
  const typeName = typeKw.value;
  if (typeName === "any") return null;

  const paramName = paramNode.value;
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

/** Get kernel param name nodes for a function signature. */
export function paramNameNodes(p) {
  if (p.destructured) {
    if (p.kind === "object") {
      const elems = p.fields.map((f) => {
        if (f.nested) {
          const innerKernel = paramNameNodes(f.pattern)[0];
          if (f.alias) {
            return array(sym("alias"), f.alias, innerKernel);
          }
          return innerKernel;
        }
        if (f.defaultValue) {
          return array(sym("default"), f.name, f.defaultValue);
        }
        return f.name;
      });
      return [array(sym("object"), ...elems)];
    }
    if (p.kind === "array") {
      const elems = p.fields.map((f) => {
        if (f.skip) return sym("_");
        if (f.nested) {
          const innerKernel = paramNameNodes(f.pattern)[0];
          if (f.alias) {
            return array(sym("alias"), f.alias, innerKernel);
          }
          return innerKernel;
        }
        if (f.defaultValue) {
          return array(sym("default"), f.name, f.defaultValue);
        }
        return f.name;
      });
      if (p.rest) {
        elems.push(array(sym("rest"), p.rest.name));
      }
      return [array(sym("array"), ...elems)];
    }
  }
  // Simple param — handle default and rest
  if (p.defaultValue) {
    return [array(sym("default"), p.name, p.defaultValue)];
  }
  if (p.isRest) {
    return [array(sym("rest"), p.name)];
  }
  return [p.name];
}

/** Get type check assertions for a param. */
export function paramTypeChecks(p, funcName) {
  if (p.destructured) {
    const checks = [];
    const allFields = [
      ...p.fields.filter((f) => !f.skip),
      ...(p.rest ? [p.rest] : []),
    ];
    for (const f of allFields) {
      if (f.nested) {
        // Recurse into nested pattern for leaf-level checks
        checks.push(...paramTypeChecks(f.pattern, funcName));
        // Type-check the alias binding itself if not :any
        if (f.typeKw && f.typeKw.value !== "any") {
          const check = buildTypeCheck(f.alias, f.typeKw, funcName, "arg");
          if (check) checks.push(check);
        }
        continue;
      }
      const check = buildTypeCheck(f.name, f.typeKw, funcName, "arg");
      if (check) checks.push(check);
    }
    return checks;
  }
  // Rest param: per-element type check via for-of loop
  if (p.isRest) {
    if (p.typeKw.value === "any") return [];
    const elVar = gensym("el");
    const innerCheck = buildTypeCheck(elVar, p.typeKw, funcName, "rest arg");
    if (!innerCheck) return [];
    return [array(sym("for-of"), elVar, p.name, innerCheck)];
  }
  const check = buildTypeCheck(p.name, p.typeKw, funcName, "arg");
  return check ? [check] : [];
}

/**
 * Compile a match pattern against a target symbol.
 * Returns { checks: AST[], bindings: AST[] }.
 * checks are conditions (to be &&'d together).
 * bindings are (const ...) forms.
 */
export function compilePattern(pattern, targetSym) {
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
      const fields = typeRegistry.get(ctorName);
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

export function compileLetPattern(pattern, tempVar) {
  const isLiteral = ["number", "string", "keyword", "null"].includes(pattern.type) ||
    (pattern.type === "atom" && ["true", "false", "null", "undefined"].includes(pattern.value));
  const isObject = isArray(pattern) && pattern.values[0]?.type === "atom" && pattern.values[0].value === "obj";
  const isConstructor = isArray(pattern) && pattern.values[0]?.type === "atom" && isPascalCase(pattern.values[0].value);
  if (pattern.type === "atom" && !isPascalCase(pattern.value) && !isObject && !isConstructor) {
    if (pattern.value === "_") return { condition: sym("true"), bindings: [], declarations: [] };
    if (["true", "false", "null", "undefined"].includes(pattern.value)) {
      const plan = compilePattern(pattern, tempVar);
      return { condition: andChain(plan.checks) ?? sym("true"), ...plan };
    }
    const condition = kernelArray(sym("!="), tempVar, sym("null"));
    return { condition, bindings: [array(sym("const"), pattern, tempVar)], declarations: [] };
  }
  if (isLiteral || (pattern.type === "atom" && isPascalCase(pattern.value)) || isObject || isConstructor) {
    const plan = compilePattern(pattern, tempVar);
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

// --- Type Registry ---
// Maps constructor names to their field names, populated by `type` macro.
// Used by `match` and `if-let`/`when-let` to resolve ADT pattern field bindings.
export const typeRegistry = new Map();
