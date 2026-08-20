// DD-37 JS-side classifier (Phase 0 pilot).
// Pass-through wrapper around existing surface dispatch.
// Currently only handles `not`; other forms pass through to the
// existing surface macro path in expander.js/surface.js.

import {
  And,
  Assoc,
  Bind,
  BindGroup,
  Cell,
  Cond,
  Conj,
  Dissoc,
  Eq,
  Exports,
  Express,
  Fn,
  Func,
  GenFn,
  GenFunc,
  IfLet,
  Match,
  Neq,
  Not,
  Obj,
  Or,
  Reset,
  SetProp,
  SetSymbol,
  SomeThread,
  Swap,
  Thread,
  TypeDef,
  WhenLet,
} from "./surface-ast.js";
import {
  andChain,
  array,
  buildTypeCheck,
  compileLetPattern,
  compilePattern,
  formatSExpr,
  gensym,
  getLiteralType,
  isArray,
  isKeyword,
  isPascalCase,
  isStatementOnlyForm,
  paramNameNodes,
  paramTypeChecks,
  parseTypedParams,
  sym,
  typeMatchesLiteral,
  typeRegistry,
  wrapReturnLast,
} from "./surface-helpers.js";
import { markKernel } from "./kernel-mark.js";

/**
 * Classify a surface form head atom. Returns a typed AST node if the
 * form is handled by the new architecture, or null to fall through to
 * the existing surface macro path.
 *
 * @param {string} head - the head atom of the form
 * @param {Array} args - the argument S-expressions
 * @returns {object|null} typed AST node, or null for fallthrough
 */
export function classifySurfaceForm(head, args) {
  switch (head) {
    case "not":
      if (args.length !== 1) {
        throw new Error("not requires exactly 1 argument: (not x)");
      }
      return Not(args[0]);
    case "swap!":
      if (args.length < 2) {
        throw new Error("swap! requires at least 2 arguments: (swap! cell fn)");
      }
      if (args[0].type !== "atom") {
        throw new Error("swap!: first argument must be a symbol");
      }
      return Swap(args[0], args[1], args.slice(2));
    case "reset!":
      if (args.length !== 2) {
        throw new Error(
          "reset! requires exactly 2 arguments: (reset! cell value)",
        );
      }
      if (args[0].type !== "atom") {
        throw new Error("reset!: first argument must be a symbol");
      }
      return Reset(args[0], args[1]);
    case "set!":
      if (args.length !== 2) {
        throw new Error(
          "set! requires exactly 2 arguments: (set! target:prop value)",
        );
      }
      if (args[0].type !== "atom" || !args[0].value.includes(":")) {
        throw new Error(
          "set! requires a property path (e.g., obj:prop), not a bare binding. Use (bind x val) for new bindings, (reset! cell val) for cells.",
        );
      }
      return SetProp(args[0], args[1]);
    case "set-symbol!":
      if (args.length !== 3) {
        throw new Error(
          "set-symbol! requires exactly 3 arguments: (set-symbol! obj key value)",
        );
      }
      return SetSymbol(args[0], args[1], args[2]);
    case "conj":
      if (args.length !== 2) {
        throw new Error(
          "conj requires exactly 2 arguments: (conj array value)",
        );
      }
      return Conj(args[0], args[1]);
    case "assoc": {
      if (args.length < 3) {
        throw new Error(
          "assoc requires at least 3 arguments: (assoc obj :key value)",
        );
      }
      const pairs = [];
      for (let i = 1; i < args.length; i += 2) {
        if (args[i].type !== "keyword") {
          throw new Error(
            `assoc: expected keyword at position ${i}, got ${
              args[i]?.type ?? "nothing"
            }`,
          );
        }
        if (i + 1 >= args.length) {
          throw new Error(`assoc: keyword :${args[i].value} has no value`);
        }
        pairs.push({ key: args[i].value, value: args[i + 1] });
      }
      return Assoc(args[0], pairs);
    }
    case "dissoc": {
      if (args.length < 2) {
        throw new Error(
          "dissoc requires at least 2 arguments: (dissoc obj :key)",
        );
      }
      const keys = [];
      for (let i = 1; i < args.length; i++) {
        if (args[i].type !== "keyword") {
          throw new Error(
            `dissoc: expected keyword at position ${i}, got ${
              args[i]?.type ?? "nothing"
            }`,
          );
        }
        keys.push(args[i].value);
      }
      return Dissoc(args[0], keys);
    }
    case "->":
      if (args.length < 2) {
        throw new Error("-> requires at least 2 arguments: (-> value step...)");
      }
      return Thread("first", args[0], args.slice(1));
    case "->>":
      if (args.length < 2) {
        throw new Error(
          "->> requires at least 2 arguments: (->> value step...)",
        );
      }
      return Thread("last", args[0], args.slice(1));
    case "some->":
      if (args.length < 2) {
        throw new Error("some-> requires at least 2 arguments");
      }
      return SomeThread("first", args[0], args.slice(1));
    case "some->>":
      if (args.length < 2) {
        throw new Error("some->> requires at least 2 arguments");
      }
      return SomeThread("last", args[0], args.slice(1));
    case "if-let": {
      if (args.length < 2 || args.length > 3) {
        throw new Error(
          "if-let requires 2-3 arguments: (if-let (binding expr) then else?)",
        );
      }
      const bp = args[0];
      if (!bp || bp.type !== "list" || bp.values.length !== 2) {
        throw new Error("if-let: first argument must be (pattern expr)");
      }
      return IfLet(bp, args[1], args.length === 3 ? args[2] : null);
    }
    case "when-let": {
      if (args.length < 2) {
        throw new Error(
          "when-let requires at least 2 arguments: (when-let (binding expr) body...)",
        );
      }
      const bp = args[0];
      if (!bp || bp.type !== "list" || bp.values.length !== 2) {
        throw new Error("when-let: first argument must be (pattern expr)");
      }
      return WhenLet(bp, args.slice(1));
    }
    case "fn":
    case "lambda": {
      if (args.length < 2) {
        throw new Error(
          "fn requires at least 2 arguments: (fn (params) body...)",
        );
      }
      if (!args[0] || args[0].type !== "list") {
        throw new Error("fn: first argument must be a parameter list");
      }
      return Fn(args[0], args.slice(1));
    }
    case "and":
      if (args.length < 2) {
        throw new Error("and requires at least 2 arguments: (and a b)");
      }
      return And(args);
    case "or":
      if (args.length < 2) {
        throw new Error("or requires at least 2 arguments: (or a b)");
      }
      return Or(args);
    case "express":
      if (args.length !== 1) {
        throw new Error("express requires exactly 1 argument: (express cell)");
      }
      if (args[0].type !== "atom") {
        throw new Error("express: argument must be a symbol");
      }
      return Express(args[0]);
    case "obj": {
      const pairs = [];
      for (let i = 0; i < args.length; i += 2) {
        if (args[i].type !== "keyword") {
          throw new Error(
            `obj: expected keyword at position ${i}, got ${
              args[i]?.type ?? "nothing"
            }`,
          );
        }
        if (i + 1 >= args.length) {
          throw new Error(`obj: keyword :${args[i].value} has no value`);
        }
        pairs.push({ key: args[i].value, value: args[i + 1] });
      }
      return Obj(pairs);
    }
    case "cell":
      if (args.length !== 1) {
        throw new Error("cell requires exactly 1 argument: (cell value)");
      }
      return Cell(args[0]);
    case "bind":
      if (args.length < 2) {
        throw new Error(
          "bind requires at least 2 arguments: (bind name value)",
        );
      }
      if (args.length === 2) return Bind(args);
      if (args.length === 3) {
        if (args[0].type !== "keyword") {
          throw new Error(
            "bind requires 2 arguments, 3 typed arguments, or grouped name/value pairs",
          );
        }
        return Bind(args);
      }
      return BindGroup(parseBindGroup(args));
    case "exports":
      return Exports(parseExports(args));
    case "cond":
      return Cond(parseCond(args));
    case "=":
      if (args.length < 2) {
        throw new Error("= requires at least 2 arguments: (= a b)");
      }
      return Eq(args);
    case "!=":
      if (args.length !== 2) {
        throw new Error("!= requires exactly 2 arguments: (!= a b)");
      }
      return Neq(args[0], args[1]);
    case "func":
      if (args.length < 2) {
        throw new Error("func requires at least a name and body");
      }
      if (args[0].type !== "atom") {
        throw new Error("func: first argument must be a function name");
      }
      return Func(args[0], args.slice(1));
    case "genfunc":
      if (args.length < 2) {
        throw new Error("genfunc requires at least a name and :yields/:body");
      }
      if (args[0].type !== "atom") {
        throw new Error("genfunc: first argument must be a function name");
      }
      return GenFunc(args[0], args.slice(1));
    case "genfn":
      if (args.length < 2) {
        throw new Error("genfn requires at least a parameter list and body");
      }
      if (!args[0] || args[0].type !== "list") {
        throw new Error("genfn: first argument must be a parameter list");
      }
      return GenFn(args[0], args);
    case "match":
      if (args.length < 2) {
        throw new Error("match requires at least an expression and one clause");
      }
      return Match(args[0], args.slice(1));
    case "type":
      if (args.length < 2) {
        throw new Error("type requires a name and at least one constructor");
      }
      if (args[0].type !== "atom") {
        throw new Error("type: first argument must be a type name");
      }
      return TypeDef(args[0], args.slice(1));
    default:
      return null;
  }
}

/**
 * Emit a typed AST node to kernel form.
 * @param {object} node - the typed AST node from classifySurfaceForm
 * @param {Function} sym - symbol constructor
 * @param {Function} array - array constructor
 * @returns {*} kernel S-expression
 */
function isKw(x) {
  return x && x.type === "keyword";
}
function isArr(x) {
  return x && x.type === "list" && Array.isArray(x.values);
}

function namesInPattern(pat) {
  if (pat?.type === "atom") return pat.value === "_" ? [] : [pat.value];
  if (!isArr(pat)) return [];
  const h = pat.values[0]?.type === "atom" ? pat.values[0].value : "";
  if (h !== "array" && h !== "object") return [];
  const out = [];
  for (const el of pat.values.slice(1)) {
    if (el.type === "keyword") continue;
    if (el.type === "atom") {
      if (el.value !== "_") out.push(el.value);
    } else if (isArr(el)) {
      const ih = el.values[0]?.type === "atom" ? el.values[0].value : "";
      if (ih === "rest" && el.values[1]) out.push(...namesInPattern(el.values[1]));
      else if (ih === "default" && el.values[2]) out.push(...namesInPattern(el.values[2]));
      else if (ih === "array" || ih === "object") out.push(...namesInPattern(el));
    }
  }
  return out;
}

function parseBindGroup(args) {
  const bindings = [];
  const seen = new Set();
  let i = 0;
  while (i < args.length) {
    let typeKw = null;
    let nameNode;
    let valueNode;
    if (args[i]?.type === "keyword") {
      if (i + 2 >= args.length) {
        throw new Error(
          "bind grouped typed pair requires (:type name value)",
        );
      }
      typeKw = args[i];
      nameNode = args[i + 1];
      valueNode = args[i + 2];
      if (nameNode.type !== "atom") {
        throw new Error("bind typed grouped pair name must be an atom");
      }
      i += 3;
    } else {
      if (i + 1 >= args.length) {
        throw new Error("bind grouped form has an incomplete name/value pair");
      }
      nameNode = args[i];
      valueNode = args[i + 1];
      i += 2;
    }
    for (const name of namesInPattern(nameNode)) {
      if (seen.has(name)) {
        throw new Error(`bind group declares '${name}' more than once`);
      }
      seen.add(name);
    }
    bindings.push({ typeKw, nameNode, valueNode });
  }
  return bindings;
}

function parseExports(args) {
  if (args.length === 0) {
    throw new Error("exports requires at least one name");
  }
  const seen = new Set();
  for (const arg of args) {
    if (arg.type !== "atom") {
      throw new Error("exports expects atom names: (exports name ...)");
    }
    if (arg.value === "_") {
      throw new Error("exports cannot export the wildcard name '_'");
    }
    if (seen.has(arg.value)) {
      throw new Error(`exports lists '${arg.value}' more than once`);
    }
    seen.add(arg.value);
  }
  return args;
}

function parseCond(args) {
  if (args.length === 0) {
    throw new Error("cond requires at least one clause");
  }
  const clauses = [];
  let sawElse = false;
  for (let i = 0; i < args.length; i++) {
    const clause = args[i];
    if (!isArr(clause) || clause.values.length !== 2) {
      throw new Error("cond clauses must be two-item lists: (test result)");
    }
    const [test, result] = clause.values;
    if (test.type === "keyword") {
      if (test.value !== "else") {
        throw new Error(`cond: unknown keyword clause :${test.value}`);
      }
      if (sawElse) throw new Error("cond may only have one :else clause");
      if (i !== args.length - 1) {
        throw new Error("cond :else clause must be last");
      }
      sawElse = true;
      clauses.push({ test: null, result });
    } else {
      clauses.push({ test, result });
    }
  }
  return clauses;
}

function emitBindKernelArgs(a, h) {
  const { sym, array } = h;
  if (a[0].type === "keyword") {
    if (a.length !== 3) {
      throw new Error("bind with type annotation requires 3 arguments");
    }
    const typeKw = a[0], nameNode = a[1], valueNode = a[2];
    const constDecl = array(sym("const"), nameNode, valueNode);
    if (typeKw.value === "any") return constDecl;
    const literalType = getLiteralType(valueNode);
    if (literalType !== null) {
      if (!typeMatchesLiteral(typeKw.value, literalType)) {
        throw new Error(
          `bind '${nameNode.value}': type annotation is :${typeKw.value} but initializer is a ${literalType} literal.`,
        );
      }
      return constDecl;
    }
    const check = buildTypeCheck(nameNode, typeKw, "bind", "");
    return check === null ? constDecl : array(sym("block"), constDecl, check);
  }
  if (a.length !== 2) {
    throw new Error("bind requires exactly name/value or :type name/value arguments");
  }
  return array(sym("const"), a[0], a[1]);
}

function emitCondChain(clauses, h) {
  const { sym, array } = h;
  let i = clauses.length - 1;
  let chain = null;
  if (clauses[i]?.test === null) {
    chain = clauses[i].result;
    i--;
  }
  for (; i >= 0; i--) {
    const clause = clauses[i];
    chain = chain === null
      ? array(sym("if"), clause.test, clause.result)
      : array(sym("if"), clause.test, clause.result, chain);
  }
  return chain ?? sym("undefined");
}

export function emitSurfaceForm(node, h) {
  const { sym, array, gensym } = h;
  switch (node.type) {
    case "Not":
      return array(sym("!"), node.operand);
    case "Swap": {
      const cellValue = sym(`${node.cell.value}:value`);
      return array(
        sym("="),
        cellValue,
        array(node.fn, cellValue, ...node.extraArgs),
      );
    }
    case "Reset":
      return array(sym("="), sym(`${node.cell.value}:value`), node.value);
    case "SetProp":
      return array(sym("="), node.target, node.value);
    case "SetSymbol":
      return array(sym("="), array(sym("get"), node.obj, node.key), node.value);
    case "Conj":
      return array(sym("array"), array(sym("spread"), node.arr), node.item);
    case "Assoc": {
      const pairs = node.pairs.map((p) => array(sym(p.key), p.value));
      return array(sym("object"), array(sym("spread"), node.obj), ...pairs);
    }
    case "Dissoc": {
      const aliasPatterns = node.keys.map((k) =>
        array(sym("alias"), sym(k), gensym("_"))
      );
      const restVar = gensym("rest");
      const pattern = array(
        sym("object"),
        ...aliasPatterns,
        array(sym("rest"), restVar),
      );
      const binding = array(sym("const"), pattern, node.obj);
      const arrowBody = array(
        sym("=>"),
        array(),
        binding,
        array(sym("return"), restVar),
      );
      return array(arrowBody);
    }
    case "Thread": {
      let threaded = node.initial;
      for (const step of node.steps) {
        if (isKw(step)) {
          threaded = array(sym("."), threaded, sym(step.value));
        } else if (
          isArr(step) && step.values.length > 0 && isKw(step.values[0])
        ) {
          const [kw, ...rest] = step.values;
          threaded = array(sym("."), threaded, sym(kw.value), ...rest);
        } else if (isArr(step)) {
          if (node.position === "first") {
            const [fn, ...rest] = step.values;
            threaded = array(fn, threaded, ...rest);
          } else {
            threaded = array(...step.values, threaded);
          }
        } else {
          threaded = array(step, threaded);
        }
      }
      return threaded;
    }
    case "SomeThread": {
      const stmts = [];
      let prevVar = gensym("t");
      stmts.push(array(sym("const"), prevVar, node.initial));
      stmts.push(
        array(
          sym("if"),
          array(sym("=="), prevVar, sym("null")),
          array(sym("return"), prevVar),
        ),
      );
      for (let i = 0; i < node.steps.length; i++) {
        const step = node.steps[i];
        let callExpr;
        if (isKw(step)) {
          callExpr = array(sym("."), prevVar, sym(step.value));
        } else if (
          isArr(step) && step.values.length > 0 && isKw(step.values[0])
        ) {
          const [kw, ...rest] = step.values;
          callExpr = array(sym("."), prevVar, sym(kw.value), ...rest);
        } else if (isArr(step)) {
          if (node.position === "first") {
            const [fn, ...rest] = step.values;
            callExpr = array(fn, prevVar, ...rest);
          } else {
            callExpr = array(...step.values, prevVar);
          }
        } else {
          callExpr = array(step, prevVar);
        }
        if (i === node.steps.length - 1) {
          stmts.push(array(sym("return"), callExpr));
        } else {
          const nextVar = gensym("t");
          stmts.push(array(sym("const"), nextVar, callExpr));
          stmts.push(
            array(
              sym("if"),
              array(sym("=="), nextVar, sym("null")),
              array(sym("return"), nextVar),
            ),
          );
          prevVar = nextVar;
        }
      }
      const arrowFn = array(sym("=>"), array(), ...stmts);
      return array(arrowFn);
    }
    case "IfLet": {
      const pattern = node.bindingPair.values[0];
      const expr = node.bindingPair.values[1];
      const tempVar = gensym("t");
      const stmts = [array(sym("const"), tempVar, expr)];
      const result = compileLetPattern(pattern, tempVar);
      if (!result) {
        throw new Error(
          `if-let: unrecognized pattern: ${formatSExpr(pattern)}`,
        );
      }
      const { condition, bindings } = result;
      const thenBlock = [...bindings, array(sym("return"), node.thenBody)];
      if (node.elseBody) {
        stmts.push(
          array(
            sym("if"),
            condition,
            array(sym("block"), ...thenBlock),
            array(sym("block"), array(sym("return"), node.elseBody)),
          ),
        );
      } else {
        stmts.push(
          array(sym("if"), condition, array(sym("block"), ...thenBlock)),
        );
      }
      return array(array(sym("=>"), array(), ...stmts));
    }
    case "WhenLet": {
      const pattern = node.bindingPair.values[0];
      const expr = node.bindingPair.values[1];
      const tempVar = gensym("t");
      const stmts = [array(sym("const"), tempVar, expr)];
      const result = compileLetPattern(pattern, tempVar);
      if (!result) {
        throw new Error(
          `when-let: unrecognized pattern: ${formatSExpr(pattern)}`,
        );
      }
      const { condition, bindings } = result;
      const wrapped = wrapReturnLast(node.bodyForms);
      const returnBody = wrapped.length === 1
        ? wrapped[0]
        : array(sym("block"), ...wrapped);
      stmts.push(
        array(
          sym("if"),
          condition,
          array(sym("block"), ...bindings, returnBody),
        ),
      );
      return array(array(sym("=>"), array(), ...stmts));
    }
    case "Fn": {
      const params = parseTypedParams(node.paramList);
      const pNames = params.flatMap((p) => paramNameNodes(p));
      const typeChecks = [];
      for (const p of params) {
        typeChecks.push(...paramTypeChecks(p, "anonymous"));
      }
      if (typeChecks.length > 0 || node.bodyForms.length > 1) {
        return array(
          sym("=>"),
          array(...pNames),
          ...typeChecks,
          ...wrapReturnLast(node.bodyForms),
        );
      }
      return array(
        sym("=>"),
        array(...pNames),
        ...typeChecks,
        ...node.bodyForms,
      );
    }
    case "And": {
      let result = node.args[0];
      for (let i = 1; i < node.args.length; i++) {
        result = array(sym("&&"), result, node.args[i]);
      }
      return result;
    }
    case "Or": {
      let result = node.args[0];
      for (let i = 1; i < node.args.length; i++) {
        result = array(sym("||"), result, node.args[i]);
      }
      return result;
    }
    case "Express":
      return sym(`${node.cell.value}:value`);
    case "Obj": {
      const objPairs = node.pairs.map((p) => {
        // Sanctioned kernel: an object key/value pair must not be re-read as a
        // macro call. (DD-37 step 4 — was a mutated kernel marker on the pair.)
        return markKernel(array(sym(p.key), p.value));
      });
      return array(sym("object"), ...objPairs);
    }
    case "Cell":
      return array(sym("object"), array(sym("value"), node.value));
    case "Bind": {
      return emitBindKernelArgs(node.args, h);
    }
    case "BindGroup":
      return node.bindings.map((binding) => {
        const args = binding.typeKw
          ? [binding.typeKw, binding.nameNode, binding.valueNode]
          : [binding.nameNode, binding.valueNode];
        return emitBindKernelArgs(args, h);
      });
    case "Exports":
      return array(sym("export"), array(sym("names"), ...node.names));
    case "Cond":
      return emitCondChain(node.clauses, h);
    case "Eq": {
      if (node.args.length === 2) {
        return array(sym("==="), node.args[0], node.args[1]);
      }
      const checks = [];
      for (let i = 0; i < node.args.length - 1; i++) {
        checks.push(array(sym("==="), node.args[i], node.args[i + 1]));
      }
      let result = checks[0];
      for (let i = 1; i < checks.length; i++) {
        result = array(sym("&&"), result, checks[i]);
      }
      return result;
    }
    case "Neq":
      return array(sym("!=="), node.a, node.b);
    case "Func": {
      const { nameNode, restArgs } = node;
      const funcName = nameNode.value;
      const firstAfterName = restArgs[0];
      if (
        firstAfterName && firstAfterName.type === "list" &&
        firstAfterName.values.length > 0 &&
        firstAfterName.values[0].type === "keyword"
      ) {
        return buildMultiClauseFunc(funcName, nameNode, restArgs);
      }
      if (firstAfterName && firstAfterName.type === "keyword") {
        return buildSingleClauseFunc(funcName, nameNode, restArgs);
      }
      return array(
        sym("function"),
        nameNode,
        array(),
        ...wrapReturnLast(restArgs),
      );
    }
    case "GenFunc":
      return emitGenfuncMacro([node.nameNode, ...node.restArgs]);
    case "GenFn": {
      const a = node.args;
      let yieldsType = null, bodyStart = 1;
      if (a.length >= 3 && a[1].type === "keyword" && a[1].value === "yields") {
        if (a.length < 4) {
          throw new Error("genfn: :yields requires a type keyword and body");
        }
        yieldsType = a[2];
        bodyStart = 3;
      }
      const bodyForms = a.slice(bodyStart);
      const params = parseTypedParams(node.paramList);
      const pNames = params.flatMap((p) => paramNameNodes(p));
      const typeChecks = [];
      for (const p of params) {
        typeChecks.push(...paramTypeChecks(p, "anonymous"));
      }
      let instrumentedBody = bodyForms;
      if (
        yieldsType && yieldsType.type === "keyword" &&
        yieldsType.value !== "any"
      ) {
        instrumentedBody = bodyForms.map((e) =>
          instrumentYields(e, yieldsType, "anonymous")
        );
      }
      return array(
        sym("function*"),
        array(...pNames),
        ...typeChecks,
        ...instrumentedBody,
      );
    }
    case "Match":
      return emitMatchMacro([node.expr, ...node.clauses]);
    case "TypeDef":
      return emitTypeMacro([node.typeName, ...node.constructors]);
    default:
      throw new Error(`Unknown surface AST node type: ${node.type}`);
  }
}

export function buildSingleClauseFunc(funcName, funcNameNode, clauseArgs) {
  const clauses = parseKeywordClauses(clauseArgs);
  const argsClause = clauses.get("args");
  const returnsClause = clauses.get("returns");
  const preClause = clauses.get("pre");
  const postClause = clauses.get("post");
  const bodyClause = clauses.get("body");

  if (!bodyClause || bodyClause.length === 0) {
    throw new Error(`func ${funcName}: :body is required`);
  }

  // Parse params
  let params = [];
  if (argsClause && argsClause.length === 1 && isArray(argsClause[0])) {
    params = parseTypedParams(argsClause[0]);
  }
  const pNames = params.flatMap((p) => paramNameNodes(p));

  // Build function body statements
  const bodyStmts = [];

  // Type checks for params
  for (const p of params) {
    bodyStmts.push(...paramTypeChecks(p, funcName));
  }

  // Pre-condition
  if (preClause && preClause.length > 0) {
    const preExpr = preClause[0];
    const preMsg = `${funcName}: pre-condition failed: ${
      formatSExpr(preExpr)
    } — caller blame`;
    bodyStmts.push(
      array(
        sym("if"),
        array(sym("!"), preExpr),
        array(
          sym("throw"),
          array(sym("new"), sym("Error"), { type: "string", value: preMsg }),
        ),
      ),
    );
  }

  // Determine return behavior
  const hasReturns = returnsClause && returnsClause.length > 0;
  const returnsType = hasReturns ? returnsClause[0] : null;
  const isVoid = returnsType && isKeyword(returnsType) &&
    returnsType.value === "void";
  const hasPost = postClause && postClause.length > 0;

  if (hasPost) {
    const lastBodyExpr = bodyClause[bodyClause.length - 1];
    if (lastBodyExpr && isStatementOnlyForm(lastBodyExpr)) {
      const headName = isArray(lastBodyExpr) && lastBodyExpr.values.length > 0
        ? lastBodyExpr.values[0].value || "<unknown>"
        : "<unknown>";
      const retType = returnsType ? returnsType.value : "<unknown>";
      throw new Error(
        `function \`${funcName}\` declared \`:returns :${retType}\` but body ends with \`${headName}\` ` +
          `(a statement-only form which cannot produce a value). ` +
          `Either: (a) add a return-typed expression after the form, ` +
          `or (b) remove \`:returns :${retType}\` from the function declaration.`,
      );
    }
    const resultVar = gensym("result");
    // Body: capture result
    if (bodyClause.length === 1) {
      bodyStmts.push(array(sym("const"), resultVar, bodyClause[0]));
    } else {
      // Multiple body exprs — last one is the value
      const initBody = bodyClause.slice(0, -1);
      bodyStmts.push(...initBody);
      bodyStmts.push(
        array(sym("const"), resultVar, bodyClause[bodyClause.length - 1]),
      );
    }

    // Returns type check on result
    if (hasReturns && !isVoid && returnsType.value !== "any") {
      const retCheck = buildTypeCheck(
        resultVar,
        returnsType,
        funcName,
        "return",
      );
      if (retCheck) bodyStmts.push(retCheck);
    }

    // Post-condition
    const postExpr = postClause[0];
    const postMsg = `${funcName}: post-condition failed: ${
      formatSExpr(postExpr)
    } — callee blame`;
    const postWithResult = replaceTilde(postExpr, resultVar);
    bodyStmts.push(
      array(
        sym("if"),
        array(sym("!"), postWithResult),
        array(
          sym("throw"),
          array(sym("new"), sym("Error"), { type: "string", value: postMsg }),
        ),
      ),
    );

    bodyStmts.push(array(sym("return"), resultVar));
  } else if (hasReturns && !isVoid) {
    // Returns type check
    if (returnsType.value !== "any") {
      const lastBodyExpr = bodyClause[bodyClause.length - 1];
      if (lastBodyExpr && isStatementOnlyForm(lastBodyExpr)) {
        const headName = isArray(lastBodyExpr) && lastBodyExpr.values.length > 0
          ? lastBodyExpr.values[0].value || "<unknown>"
          : "<unknown>";
        throw new Error(
          `function \`${funcName}\` declared \`:returns :${returnsType.value}\` but body ends with \`${headName}\` ` +
            `(a statement-only form which cannot produce a value). ` +
            `Either: (a) add a return-typed expression after the form, ` +
            `or (b) remove \`:returns :${returnsType.value}\` from the function declaration.`,
        );
      }
      const resultVar = gensym("result");
      if (bodyClause.length === 1) {
        bodyStmts.push(array(sym("const"), resultVar, bodyClause[0]));
      } else {
        const initBody = bodyClause.slice(0, -1);
        bodyStmts.push(...initBody);
        bodyStmts.push(
          array(sym("const"), resultVar, bodyClause[bodyClause.length - 1]),
        );
      }
      const retCheck = buildTypeCheck(
        resultVar,
        returnsType,
        funcName,
        "return",
      );
      if (retCheck) bodyStmts.push(retCheck);
      bodyStmts.push(array(sym("return"), resultVar));
    } else {
      // :any return — no check
      bodyStmts.push(...wrapReturnLast(bodyClause));
    }
  } else if (isVoid) {
    bodyStmts.push(...bodyClause);
  } else {
    // No :returns — treat body forms as statements, implicit return of last
    bodyStmts.push(...wrapReturnLast(bodyClause));
  }

  return array(
    sym("function"),
    funcNameNode,
    array(...pNames),
    ...bodyStmts,
  );
}

export function buildMultiClauseFunc(funcName, funcNameNode, clauseLists) {
  const argsVar = gensym("args");
  const stmts = [];

  // Sort clauses: longer arity first, then more typed before less typed
  const parsed = clauseLists.map((cl) => {
    const clauses = parseKeywordClauses(cl.values);
    const argsClause = clauses.get("args");
    let params = [];
    if (argsClause && argsClause.length === 1 && isArray(argsClause[0])) {
      params = parseTypedParams(argsClause[0]);
    }
    const typedCount = params.filter((p) =>
      paramDispatchType(p) !== "any"
    ).length;
    return { clauses, params, typedCount, arity: params.length };
  });

  parsed.sort((a, b) => {
    if (a.arity !== b.arity) return b.arity - a.arity;
    return b.typedCount - a.typedCount;
  });

  for (const clause of parsed) {
    const { clauses, params } = clause;
    const returnsClause = clauses.get("returns");
    const preClause = clauses.get("pre");
    const postClause = clauses.get("post");
    const bodyClause = clauses.get("body");

    if (!bodyClause || bodyClause.length === 0) {
      throw new Error(`func ${funcName}: :body is required in each clause`);
    }

    // Build dispatch condition: args.length === N && type checks
    const conditions = [
      array(sym("==="), sym(`${argsVar.value}:length`), {
        type: "number",
        value: params.length,
      }),
    ];

    for (let i = 0; i < params.length; i++) {
      const p = params[i];
      const dtype = paramDispatchType(p);
      if (dtype === "any") continue;
      const argAccess = array(sym("get"), argsVar, {
        type: "number",
        value: i,
      });
      // Inline type check for dispatch
      switch (dtype) {
        case "number":
          conditions.push(
            array(sym("==="), array(sym("typeof"), argAccess), {
              type: "string",
              value: "number",
            }),
          );
          break;
        case "string":
          conditions.push(
            array(sym("==="), array(sym("typeof"), argAccess), {
              type: "string",
              value: "string",
            }),
          );
          break;
        case "boolean":
          conditions.push(
            array(sym("==="), array(sym("typeof"), argAccess), {
              type: "string",
              value: "boolean",
            }),
          );
          break;
        case "function":
          conditions.push(
            array(sym("==="), array(sym("typeof"), argAccess), {
              type: "string",
              value: "function",
            }),
          );
          break;
        case "object":
          conditions.push(
            array(
              sym("&&"),
              array(sym("==="), array(sym("typeof"), argAccess), {
                type: "string",
                value: "object",
              }),
              array(sym("!=="), argAccess, sym("null")),
            ),
          );
          break;
        case "array":
          conditions.push(array(sym("Array:isArray"), argAccess));
          break;
        default:
          break;
      }
    }

    const condition = andChain(conditions);

    // Build clause body
    const clauseBody = [];

    // Bind params from args
    for (let i = 0; i < params.length; i++) {
      const p = params[i];
      const argAccess = array(sym("get"), argsVar, {
        type: "number",
        value: i,
      });
      if (p.destructured) {
        // const (object name1 name2) = get(args, i)
        clauseBody.push(
          array(sym("const"), paramNameNodes(p)[0], argAccess),
        );
      } else {
        clauseBody.push(
          array(sym("const"), p.name, argAccess),
        );
      }
    }

    // Full type checks (with NaN exclusion etc.)
    for (const p of params) {
      clauseBody.push(...paramTypeChecks(p, funcName));
    }

    // Pre-condition
    if (preClause && preClause.length > 0) {
      const preExpr = preClause[0];
      const preMsg = `${funcName}: pre-condition failed: ${
        formatSExpr(preExpr)
      } — caller blame`;
      clauseBody.push(
        array(
          sym("if"),
          array(sym("!"), preExpr),
          array(
            sym("throw"),
            array(sym("new"), sym("Error"), {
              type: "string",
              value: preMsg,
            }),
          ),
        ),
      );
    }

    // Body + return
    const hasReturns = returnsClause && returnsClause.length > 0;
    const hasPost = postClause && postClause.length > 0;

    if (hasPost) {
      const resultVar = gensym("result");
      if (bodyClause.length === 1) {
        clauseBody.push(array(sym("const"), resultVar, bodyClause[0]));
      } else {
        clauseBody.push(...bodyClause.slice(0, -1));
        clauseBody.push(
          array(sym("const"), resultVar, bodyClause[bodyClause.length - 1]),
        );
      }
      const postExpr = postClause[0];
      const postMsg = `${funcName}: post-condition failed: ${
        formatSExpr(postExpr)
      } — callee blame`;
      const postWithResult = replaceTilde(postExpr, resultVar);
      clauseBody.push(
        array(
          sym("if"),
          array(sym("!"), postWithResult),
          array(
            sym("throw"),
            array(sym("new"), sym("Error"), {
              type: "string",
              value: postMsg,
            }),
          ),
        ),
      );
      clauseBody.push(array(sym("return"), resultVar));
    } else if (hasReturns) {
      clauseBody.push(...wrapReturnLast(bodyClause));
    } else {
      clauseBody.push(...bodyClause);
    }

    stmts.push(
      array(sym("if"), condition, array(sym("block"), ...clauseBody)),
    );
  }

  // Final throw for no matching clause
  stmts.push(
    array(
      sym("throw"),
      array(sym("new"), sym("TypeError"), {
        type: "string",
        value: `${funcName}: no matching clause for arguments`,
      }),
    ),
  );

  return array(
    sym("function"),
    funcNameNode,
    array(array(sym("rest"), argsVar)),
    ...stmts,
  );
}

/**
 * Register all surface form macros into the macro environment.
 * @param {Map<string, Function>} macroEnv
 */

export function emitGenfuncMacro(args) {
  if (args.length < 2) {
    throw new Error("genfunc requires at least a name and :yields/:body");
  }
  const funcNameNode = args[0];
  if (funcNameNode.type !== "atom") {
    throw new Error("genfunc: first argument must be a function name");
  }
  const funcName = funcNameNode.value;
  const clauseArgs = args.slice(1);
  const clauses = parseKeywordClauses(clauseArgs);
  const argsClause = clauses.get("args");
  const yieldsClause = clauses.get("yields");
  const _returnsClause = clauses.get("returns");
  const preClause = clauses.get("pre");
  const _postClause = clauses.get("post");
  const bodyClause = clauses.get("body");

  if (!bodyClause || bodyClause.length === 0) {
    throw new Error(`genfunc ${funcName}: :body is required`);
  }

  // Parse params
  let params = [];
  if (argsClause && argsClause.length === 1 && isArray(argsClause[0])) {
    params = parseTypedParams(argsClause[0]);
  }
  const pNames = params.flatMap((p) => paramNameNodes(p));

  // Build generator body
  const bodyStmts = [];

  // Type checks for params
  for (const p of params) {
    bodyStmts.push(...paramTypeChecks(p, funcName));
  }

  // Pre-condition
  if (preClause && preClause.length > 0) {
    const preExpr = preClause[0];
    const preMsg = `${funcName}: pre-condition failed: ${
      formatSExpr(preExpr)
    } — caller blame`;
    bodyStmts.push(
      array(
        sym("if"),
        array(sym("!"), preExpr),
        array(
          sym("throw"),
          array(sym("new"), sym("Error"), { type: "string", value: preMsg }),
        ),
      ),
    );
  }

  // Instrument yields if :yields type is specified and not :any
  let instrumentedBody = bodyClause;
  if (yieldsClause && yieldsClause.length > 0) {
    const yieldsType = yieldsClause[0];
    if (isKeyword(yieldsType) && yieldsType.value !== "any") {
      instrumentedBody = bodyClause.map((expr) =>
        instrumentYields(expr, yieldsType, funcName)
      );
    }
  }

  bodyStmts.push(...instrumentedBody);

  return array(
    sym("function*"),
    funcNameNode,
    array(...pNames),
    ...bodyStmts,
  );
}

// DD-37 M22: match and type macros extracted as top-level exports.
// Exact copies of the original macro bodies, de-indented.
export function emitMatchMacro(args) {
  if (args.length < 2) {
    throw new Error("match requires an expression and at least one clause");
  }
  const expr = args[0];
  const clauses = args.slice(1);
  const targetVar = gensym("target");
  const stmts = [array(sym("const"), targetVar, expr)];

  for (let i = 0; i < clauses.length; i++) {
    const clause = clauses[i];
    if (!isArray(clause) || clause.values.length < 2) {
      throw new Error(
        `match: clause ${i} must be (pattern body...) or (pattern :when guard body...)`,
      );
    }

    const pattern = clause.values[0];
    let guard = null;
    let bodyStart = 1;

    // Check for :when guard
    if (
      clause.values.length >= 3 &&
      isKeyword(clause.values[1]) &&
      clause.values[1].value === "when"
    ) {
      guard = clause.values[2];
      bodyStart = 3;
    }

    const bodyForms = clause.values.slice(bodyStart);
    if (bodyForms.length === 0) {
      throw new Error(`match: clause ${i} has no body`);
    }

    const { checks, bindings } = compilePattern(pattern, targetVar);

    // Add guard to checks
    if (guard) {
      // Guard may reference bound variables — we need bindings before guard eval
      // So for guarded patterns, put check in if, bindings inside, then guard check
      const condition = checks.length > 0 ? andChain(checks) : null;
      const innerBlock = [...bindings];

      // Guard check with nested if
      const wrapped = wrapReturnLast(bodyForms);
      const guardedBody = wrapped.length === 1
        ? wrapped[0]
        : array(sym("block"), ...wrapped);

      innerBlock.push(array(sym("if"), guard, guardedBody));

      if (condition) {
        stmts.push(
          array(sym("if"), condition, array(sym("block"), ...innerBlock)),
        );
      } else {
        stmts.push(array(sym("block"), ...innerBlock));
      }
    } else {
      // No guard — simple case
      const isWildcard = pattern.type === "atom" && pattern.value === "_";
      const isSimpleBinding = pattern.type === "atom" &&
        !isPascalCase(pattern.value) &&
        pattern.value !== "_" &&
        pattern.value !== "true" &&
        pattern.value !== "false" &&
        pattern.value !== "null" &&
        pattern.value !== "undefined";

      if (isWildcard || isSimpleBinding) {
        // Default / catch-all — no condition check
        const block = [...bindings, ...wrapReturnLast(bodyForms)];
        stmts.push(array(sym("block"), ...block));
      } else {
        const condition = andChain(checks);
        const block = [...bindings, ...wrapReturnLast(bodyForms)];
        stmts.push(
          array(sym("if"), condition, array(sym("block"), ...block)),
        );
      }
    }
  }

  // If last clause is not a wildcard/binding, add throw
  const lastClause = clauses[clauses.length - 1];
  const lastPattern = lastClause.values[0];
  const isLastWildcard = lastPattern.type === "atom" &&
    lastPattern.value === "_";
  const isLastBinding = lastPattern.type === "atom" &&
    !isPascalCase(lastPattern.value) &&
    lastPattern.value !== "true" &&
    lastPattern.value !== "false" &&
    lastPattern.value !== "null" &&
    lastPattern.value !== "undefined";

  if (!isLastWildcard && !isLastBinding) {
    stmts.push(
      array(
        sym("throw"),
        array(sym("new"), sym("Error"), {
          type: "string",
          value: "match: no matching pattern",
        }),
      ),
    );
  }

  // Wrap in IIFE
  const arrowFn = array(sym("=>"), array(), ...stmts);
  return array(arrowFn);
}

export function emitTypeMacro(args) {
  if (args.length < 2) {
    throw new Error("type requires a name and at least one constructor");
  }
  const typeName = args[0];
  if (typeName.type !== "atom") {
    throw new Error("type: first argument must be a type name");
  }

  const constructors = args.slice(1);
  const forms = [];

  for (const ctor of constructors) {
    if (ctor.type === "atom") {
      // Zero-field constructor: (const None (object (tag "None")))
      const ctorName = ctor.value;
      typeRegistry.set(ctorName, []);
      forms.push(
        array(
          sym("const"),
          ctor,
          array(
            sym("object"),
            array(sym("tag"), { type: "string", value: ctorName }),
          ),
        ),
      );
    } else if (isArray(ctor) && ctor.values.length >= 1) {
      // Constructor with fields: (function Some (value) <checks> (return (object ...)))
      const ctorName = ctor.values[0].value;
      const fields = parseTypedParams({
        type: "list",
        values: ctor.values.slice(1),
      });
      const fieldNames = fields.map((f) => f.name.value);
      typeRegistry.set(ctorName, fieldNames);

      const paramNames = fields.map((f) => f.name);
      const typeChecks = [];
      for (const f of fields) {
        const check = buildTypeCheck(f.name, f.typeKw, ctorName, "field");
        if (check) typeChecks.push(check);
      }

      const objPairs = [
        array(sym("tag"), { type: "string", value: ctorName }),
      ];
      for (const f of fields) {
        objPairs.push(array(sym(f.name.value), f.name));
      }

      forms.push(
        array(
          sym("function"),
          sym(ctorName),
          array(...paramNames),
          ...typeChecks,
          array(sym("return"), array(sym("object"), ...objPairs)),
        ),
      );
    }
  }

  if (forms.length === 1) return forms[0];
  return forms;
}

/**
 * Parse keyword-value pairs from an args list.
 * Only keywords in FUNC_CLAUSE_KEYS are treated as clause delimiters.
 * Other keywords (like :string, :number) are treated as values.
 * Returns Map<string, any[]>.
 */
export function parseKeywordClauses(args) {
  const clauses = new Map();
  let currentKey = null;
  let currentValues = [];

  for (const arg of args) {
    if (isKeyword(arg) && FUNC_CLAUSE_KEYS.has(arg.value)) {
      if (currentKey !== null) {
        clauses.set(currentKey, currentValues);
      }
      currentKey = arg.value;
      currentValues = [];
    } else {
      currentValues.push(arg);
    }
  }
  if (currentKey !== null) {
    clauses.set(currentKey, currentValues);
  }
  return clauses;
}

// DD-37 M22: extracted from registerSurfaceMacros inner scope.
export function instrumentYields(node, yieldsType, funcName) {
  if (!node || node.type !== "list") return node;
  const vals = node.values;
  if (vals.length === 0) return node;
  if (
    vals[0].type === "atom" && vals[0].value === "yield" && vals.length >= 2
  ) {
    const yieldedExpr = instrumentYields(vals[1], yieldsType, funcName);
    const vVar = gensym("yv");
    const check = buildTypeCheck(vVar, yieldsType, funcName, "yield");
    if (check) {
      const iife = array(
        array(
          sym("=>"),
          array(),
          array(sym("const"), vVar, yieldedExpr),
          check,
          array(sym("return"), vVar),
        ),
      );
      return array(sym("yield"), iife);
    }
    return array(sym("yield"), yieldedExpr);
  }
  if (vals[0].type === "atom" && vals[0].value === "yield*") {
    return node;
  }
  return {
    ...node,
    values: vals.map((v) => instrumentYields(v, yieldsType, funcName)),
  };
}

/**
 * Replace all occurrences of ~ (tilde atom) in an AST with a replacement node.
 */
export function replaceTilde(node, replacement) {
  if (!node) return node;
  if (node.type === "atom" && node.value === "~") return replacement;
  if (node.type === "list") {
    return {
      type: "list",
      values: node.values.map((v) => replaceTilde(v, replacement)),
    };
  }
  return node;
}

/** Get the dispatch type string for multi-clause dispatch. */
export function paramDispatchType(p) {
  if (p.destructured) return p.kind;
  return p.typeKw.value;
}

/** Valid clause keys for func/fn keyword parsing. */
export const FUNC_CLAUSE_KEYS = new Set([
  "args",
  "returns",
  "yields",
  "pre",
  "post",
  "body",
]);
