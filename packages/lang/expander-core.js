/**
 * @module
 * lykn expansion pass.
 * Transforms reader AST into compiler-ready AST by resolving quasiquote,
 * quote, sugar forms (cons/list/car/cdr), macros, and as patterns.
 */

import { compileExpr, formHead, lowerHostReferences, toJsIdentifier } from './compiler.js';
import { generate } from 'astring';
import { registerSurfaceMacros } from './surface.js';
import { createSurfaceTypeContext } from './surface-type-context.js';
import { classifySurfaceForm, emitSurfaceForm, emitMatchStatementMacro, funcBodyProtectsStatementExit, parseKeywordClauses } from './classifier.js';
import { KERNEL_FORMS, KERNEL_ONLY_FORMS, closestKernelForm, kernelOnlyMessage } from './kernel-forms.js';
import { markKernel, isKernel } from './kernel-mark.js';
import { markExpandedHostCall, materializeExpandedHostCalls } from './host-invocation-kernel.js';
import { moduleBindsReflect, validateProtectedHost } from './protected-host.js';
import { isStatementOnlyForm } from './surface-helpers.js';
import {
  clearCompilerPrivateAtom,
  compilerPrivateAtomInfo,
  markCompilerPrivateAtom,
} from './compiler-private-atoms.js';
import {
  bindingScopePlan,
  bodyScopeNames,
  extendBindingEnv,
  hoistedNames,
  validateReservedNames,
  bindingsIntroduced,
  bindingNamesInPattern,
} from './binding.js';

// --- AST Node API ---

/** @type {number} */
let gensymCounter = 0;

/** @type {Map<string, Function>} */
export const macroEnv = new Map();

const MAX_EXPAND_ITERATIONS = 1000;

/**
 * Create a symbol (atom) AST node.
 * @param {string} name
 * @returns {{ type: 'atom', value: string }}
 */
export function sym(name) {
  return { type: 'atom', value: name };
}

/**
 * Create a unique symbol for hygienic macro expansion.
 * @param {string} [prefix='g']
 * @returns {{ type: 'atom', value: string }}
 */
export function gensym(prefix = 'g') {
  return { type: 'atom', value: `${prefix}__gensym${gensymCounter++}` };
}

/**
 * Reset gensym counter (for testing determinism).
 */
export function resetGensym() {
  gensymCounter = 0;
}

/**
 * Create a list AST node from items.
 * @param {...*} items - AST nodes
 * @returns {{ type: 'list', values: *[] }}
 */
export function array(...items) {
  return { type: 'list', values: items };
}

/**
 * Concatenate list node values into a single list node.
 * @param {...*} arrays - List nodes
 * @returns {{ type: 'list', values: *[] }}
 * @throws {Error} If any argument is not a list node
 */
export function append(...arrays) {
  const values = [];
  for (const arr of arrays) {
    if (Array.isArray(arr)) {
      // Raw JS array (e.g., from rest params in macro body)
      values.push(...arr);
    } else if (arr && arr.type === 'list') {
      values.push(...arr.values);
    } else {
      throw new Error(`append: expected list node or array, got ${arr?.type ?? 'null'}`);
    }
  }
  return { type: 'list', values };
}

/** @param {*} x @returns {boolean} */
export function isArray(x) {
  return x !== null && x !== undefined && x.type === 'list';
}

/** @param {*} x @returns {boolean} */
export function isSymbol(x) {
  return x !== null && x !== undefined && x.type === 'atom';
}

/** @param {*} x @returns {boolean} */
export function isNumber(x) {
  return x !== null && x !== undefined && x.type === 'number';
}

/** @param {*} x @returns {boolean} */
export function isString(x) {
  return x !== null && x !== undefined && x.type === 'string';
}

/** @param {*} x @returns {boolean} */
export function isKeyword(x) {
  return x !== null && x !== undefined && x.type === 'keyword';
}

/**
 * Get first element of a list node.
 * @param {{ type: 'list', values: *[] }} arr
 * @returns {* | undefined}
 */
export function first(arr) {
  return arr.values[0];
}

/**
 * Get all but first element as a new list node.
 * @param {{ type: 'list', values: *[] }} arr
 * @returns {{ type: 'list', values: *[] }}
 */
export function rest(arr) {
  return { type: 'list', values: arr.values.slice(1) };
}

/** Alias for append. */
export const concat = append;

/** @param {{ type: 'list', values: *[] }} arr @returns {number} */
export function length(arr) {
  return arr.values.length;
}

/** @param {{ type: 'list', values: *[] }} arr @param {number} n @returns {* | undefined} */
export function nth(arr, n) {
  return arr.values[n];
}

/**
 * Format an AST node as an s-expression string (for debug output).
 * @param {*} node
 * @returns {string}
 */
function formatSExpr(node) {
  if (node === null || node === undefined) return 'null';
  if (node.type === 'atom') return node.value;
  if (node.type === 'keyword') return `:${node.value}`;
  if (node.type === 'string') return `"${node.value}"`;
  if (node.type === 'number') return String(node.value);
  if (node.type === 'cons') return `(${formatSExpr(node.car)} . ${formatSExpr(node.cdr)})`;
  if (node.type === 'list') {
    return `(${node.values.map(formatSExpr).join(' ')})`;
  }
  return String(node);
}

// --- Sugar Transforms ---

function desugarCons(args) {
  if (args.length !== 2) {
    throw new Error('cons requires exactly 2 arguments');
  }
  return array(sym('array'), args[0], args[1]);
}

function desugarList(args) {
  if (args.length === 0) {
    return sym('null');
  }
  let result = sym('null');
  for (let i = args.length - 1; i >= 0; i--) {
    result = array(sym('array'), args[i], result);
  }
  return result;
}

function desugarCar(args) {
  if (args.length !== 1) throw new Error('car requires exactly 1 argument');
  return array(sym('get'), args[0], { type: 'number', value: 0 });
}

function desugarCdr(args) {
  if (args.length !== 1) throw new Error('cdr requires exactly 1 argument');
  return array(sym('get'), args[0], { type: 'number', value: 1 });
}

function desugarCadr(args) {
  if (args.length !== 1) throw new Error('cadr requires exactly 1 argument');
  return array(sym('get'),
    array(sym('get'), args[0], { type: 'number', value: 1 }),
    { type: 'number', value: 0 });
}

function desugarCddr(args) {
  if (args.length !== 1) throw new Error('cddr requires exactly 1 argument');
  return array(sym('get'),
    array(sym('get'), args[0], { type: 'number', value: 1 }),
    { type: 'number', value: 1 });
}

function desugarAs(args) {
  if (args.length !== 2) throw new Error('as requires exactly 2 arguments');
  if (args[0].type === 'atom') {
    return array(sym('alias'), args[0], args[1]);
  }
  throw new Error('as with pattern first argument must appear in binding position (const/let/var)');
}

// --- Macro Compilation ---

/** Macro environment API parameter names for new Function(). */
const MACRO_API_PARAMS = [
  '$array', '$sym', '$gensym',
  '$isArray', '$isSymbol', '$isNumber', '$isString', '$isKeyword',
  '$first', '$rest', '$concat', '$nth', '$length',
  '$append',
];

/** Macro environment API values, matching MACRO_API_PARAMS order. */
const MACRO_API_VALUES = [
  array, sym, gensym,
  isArray, isSymbol, isNumber, isString, isKeyword,
  first, rest, concat, nth, length,
  append,
];

// --- Quasiquote Strategies ---
//
// compileQuasiquote (Pass 1, macro body compilation) and expandQuasiquote
// (Pass 2, macro expansion) share the same recursive structure but differ in
// how they construct nodes.  The two strategy objects capture those differences
// so a single walker can serve both passes.

/**
 * Strategy for compileQuasiquote (Pass 1): emits $-prefixed API calls that,
 * when compiled to JS and executed, build AST nodes at macro-expand time.
 */
const compileStrategy = {
  /** Wrap an atom as an API call that creates a symbol node at runtime. */
  quoteAtom(form) {
    return array(sym('$sym'), { type: 'string', value: form.value });
  },
  /** Build a list/cons node via the $array API. */
  makeArray(...items) {
    return array(sym('$array'), ...items);
  },
  /** Quote a symbol name for embedding in a nested quasiquote/unquote form. */
  quoteSymbol(name) {
    return array(sym('$sym'), { type: 'string', value: name });
  },
  /** Build a typed number node in the compiled macro result. */
  numberLiteral(form) {
    return array(
      sym('object'),
      array(sym('type'), { type: 'string', value: 'number' }),
      array(sym('value'), form),
    );
  },
  /** Concatenate spliced and non-spliced parts via $concat. */
  makeConcat(...args) {
    return array(sym('$concat'), ...args);
  },
  /** Empty list representation. */
  emptyList() {
    return array(sym('$array'));
  },
  /** Whether this strategy tracks literal elements (for quoteLiteral opt). */
  tracksLiterals: false,
  /** Wrap an atom element in the element walker. */
  wrapAtomElement(element) {
    return array(sym('$sym'), { type: 'string', value: element.value });
  },
};

/**
 * Strategy for expandQuasiquote (Pass 2): emits resolved AST nodes using
 * array/quote/append — the forms are directly usable without further compilation.
 */
const expandStrategy = {
  quoteAtom(form) {
    return array(sym('quote'), form);
  },
  makeArray(...items) {
    return array(sym('array'), ...items);
  },
  quoteSymbol(name) {
    return array(sym('quote'), sym(name));
  },
  /** Number nodes remain unchanged during ordinary quasiquote expansion. */
  numberLiteral(form) {
    return form;
  },
  makeConcat(...args) {
    return array(sym('append'), ...args);
  },
  emptyList(form) {
    return form;
  },
  tracksLiterals: true,
  wrapAtomElement(element) {
    return array(sym('quote'), element);
  },
};

/**
 * Unified quasiquote walker: recursively processes a quasiquote template,
 * using the provided strategy to construct the output nodes.
 * @param {*} form - The quasiquote body
 * @param {number} depth - Nesting depth (0 = outermost quasiquote)
 * @param {object} strategy - compileStrategy or expandStrategy
 * @returns {*} Transformed AST
 */
function walkQuasiquote(form, depth, strategy) {
  // Compiled macro templates must preserve numbers as typed AST nodes.
  if (form.type === 'number') {
    return strategy.numberLiteral(form);
  }

  // Other self-evaluating types pass through unchanged
  if (form.type === 'string' || form.type === 'keyword') {
    return form;
  }

  // Atoms: wrap via strategy
  if (form.type === 'atom') {
    return strategy.quoteAtom(form);
  }

  // Cons node: recurse on car and cdr, wrap as array
  if (form.type === 'cons') {
    const car = walkQuasiquote(form.car, depth, strategy);
    const cdr = walkQuasiquote(form.cdr, depth, strategy);
    return strategy.makeArray(car, cdr);
  }

  if (form.type !== 'list') {
    throw new Error(`walkQuasiquote: unexpected node type '${form.type}'`);
  }

  const values = form.values;

  // Empty list
  if (values.length === 0) {
    return strategy.emptyList(form);
  }

  const head = values[0];

  // Nested quasiquote: increment depth
  if (head.type === 'atom' && head.value === 'quasiquote') {
    if (values.length !== 2) throw new Error('quasiquote requires exactly one argument');
    const inner = walkQuasiquote(values[1], depth + 1, strategy);
    return strategy.makeArray(strategy.quoteSymbol('quasiquote'), inner);
  }

  // Unquote
  if (head.type === 'atom' && head.value === 'unquote') {
    if (values.length !== 2) throw new Error('unquote requires exactly one argument');
    if (depth === 0) {
      return values[1];
    }
    const inner = walkQuasiquote(values[1], depth - 1, strategy);
    return strategy.makeArray(strategy.quoteSymbol('unquote'), inner);
  }

  // Unquote-splicing as direct child of quasiquote (not in list)
  if (head.type === 'atom' && head.value === 'unquote-splicing') {
    if (depth === 0) {
      throw new Error('unquote-splicing not inside a list');
    }
    if (values.length !== 2) throw new Error('unquote-splicing requires exactly one argument');
    const inner = walkQuasiquote(values[1], depth - 1, strategy);
    return strategy.makeArray(strategy.quoteSymbol('unquote-splicing'), inner);
  }

  // General list: walk each element
  const parts = values.map((el) => walkQQElement(el, depth, strategy));

  // All-literal optimization (expand strategy only)
  if (strategy.tracksLiterals && parts.every((p) => p.isLiteral)) {
    return quoteLiteral(form);
  }

  // No splices → wrap all elements directly
  if (!parts.some((p) => p.isSplice)) {
    return strategy.makeArray(...parts.map((p) => p.node));
  }

  // General case with splices: use concat/append
  const concatArgs = parts.map((p) => {
    if (p.isSplice) return p.node;
    return strategy.makeArray(p.node);
  });
  return strategy.makeConcat(...concatArgs);
}

/**
 * Unified element walker for quasiquote list elements.
 * @param {*} element - A single element within a quasiquoted list
 * @param {number} depth - Current nesting depth
 * @param {object} strategy - compileStrategy or expandStrategy
 * @returns {{ node: *, isSplice: boolean, isLiteral?: boolean }}
 */
function walkQQElement(element, depth, strategy) {
  // Unquote
  if (element.type === 'list' && element.values.length === 2 &&
      element.values[0].type === 'atom' && element.values[0].value === 'unquote') {
    if (depth === 0) {
      return { node: element.values[1], isSplice: false, isLiteral: false };
    }
    return { node: walkQuasiquote(element, depth, strategy), isSplice: false, isLiteral: false };
  }

  // Unquote-splicing
  if (element.type === 'list' && element.values.length === 2 &&
      element.values[0].type === 'atom' && element.values[0].value === 'unquote-splicing') {
    if (depth === 0) {
      return { node: element.values[1], isSplice: true, isLiteral: false };
    }
    return { node: walkQuasiquote(element, depth, strategy), isSplice: false, isLiteral: false };
  }

  // Nested list: recurse
  if (element.type === 'list') {
    return { node: walkQuasiquote(element, depth, strategy), isSplice: false, isLiteral: false };
  }

  // Self-evaluating literals
  if (element.type === 'number') {
    return { node: strategy.numberLiteral(element), isSplice: false, isLiteral: true };
  }

  if (element.type === 'string') {
    return { node: element, isSplice: false, isLiteral: true };
  }

  // Atom: wrap via strategy
  if (element.type === 'atom') {
    return { node: strategy.wrapAtomElement(element), isSplice: false, isLiteral: true };
  }

  // Cons node
  if (element.type === 'cons') {
    return { node: walkQuasiquote(element, depth, strategy), isSplice: false, isLiteral: false };
  }

  return { node: element, isSplice: false, isLiteral: true };
}

/**
 * Compile a quasiquote template into s-expression AST that, when compiled
 * to JS and executed, constructs the template with unquoted values filled in.
 * This is different from expandQuasiquote which RESOLVES templates.
 * @param {*} form - The quasiquote body
 * @param {number} depth - Nesting depth
 * @returns {*} S-expression AST representing API calls
 */
function compileQuasiquote(form, depth) {
  return walkQuasiquote(form, depth, compileStrategy);
}

function _compileQQElementForMacro(element, depth) {
  return walkQQElement(element, depth, compileStrategy);
}

/**
 * Resolve #gen auto-gensym suffixes in a quasiquote template.
 * All occurrences of the same prefix#gen within one template → same gensym.
 * @param {*} form - AST form (quasiquote body)
 * @returns {*} Form with #gen atoms replaced by gensym atoms
 */
function resolveAutoGensym(form) {
  const genMap = new Map();

  function resolve(node) {
    if (node === null || node === undefined) return node;

    if (node.type === 'atom' && node.value.endsWith('#gen')) {
      const prefix = node.value.slice(0, -4);
      if (!genMap.has(prefix)) {
        genMap.set(prefix, gensym(prefix));
      }
      return genMap.get(prefix);
    }

    if (node.type === 'list') {
      return { type: 'list', values: node.values.map(resolve) };
    }

    if (node.type === 'cons') {
      return { type: 'cons', car: resolve(node.car), cdr: resolve(node.cdr) };
    }

    return node;
  }

  return resolve(form);
}

/**
 * Compile a macro body into a JS function string.
 * The body may contain quasiquote templates which are compiled to API calls.
 * @param {*[]} paramNames - Extracted parameter name atoms
 * @param {*} paramPattern - The raw parameter pattern for destructuring
 * @param {*[]} bodyForms - The macro body forms
 * @returns {string} JS code string for new Function()
 */
function compileMacroBody(_paramNames, paramPattern, bodyForms) {
  // Process the body: compile quasiquote templates to API calls
  const processedBody = bodyForms.map((form) => processBodyForm(form));

  // Build a function that takes the call-site args and returns an s-expression
  // For simple (test (rest body)): function(test, ...body) { return <compiled-body>; }
  const jsParams = compileParamList(paramPattern);

  // The last expression is the return value
  const bodyStatements = processedBody.map((form, i) => {
    if (i === processedBody.length - 1) {
      return array(sym('return'), form);
    }
    return form;
  });

  // Use lambda (FunctionExpression) for proper block body with return
  const fnForm = array(sym('lambda'), array(...jsParams), ...bodyStatements);

  // Compile to JS using the compiler
  const jsCode = generate({
    type: 'Program',
    body: [{ type: 'ExpressionStatement', expression: compileExpr(fnForm) }],
    sourceType: 'module',
  }, { indent: '  ' });
  return `return ${jsCode.trim()};`;
}

/**
 * Process a macro body form, converting quasiquote templates to API calls.
 */
function processBodyForm(form) {
  if (form === null || form === undefined) return form;

  if (form.type !== 'list' || form.values.length === 0) return form;

  const head = form.values[0];

  // Quasiquote in macro body → compile to API calls (not resolve)
  if (head.type === 'atom' && head.value === 'quasiquote') {
    if (form.values.length !== 2) throw new Error('quasiquote requires exactly one argument');
    const body = resolveAutoGensym(form.values[1]);
    return compileQuasiquote(body, 0);
  }

  // Recursively process sub-forms
  return { type: 'list', values: form.values.map(processBodyForm) };
}

/**
 * Convert a macro param pattern to JS parameter atoms.
 * (test (rest body)) → [sym('test'), sym('...body')] for arrow fn compilation
 */
function compileParamList(pattern) {
  if (pattern.type !== 'list') return [];

  const params = [];
  for (const p of pattern.values) {
    if (p.type === 'atom') {
      if (p.value === '_') {
        params.push(sym('_'));
      } else {
        params.push(p);
      }
    } else if (p.type === 'list' && p.values.length >= 1) {
      const head = p.values[0];
      if (head.type === 'atom' && head.value === 'rest') {
        // (rest body) → ...body in JS (rest parameter)
        params.push(p); // pass through — compilePattern handles (rest x)
      } else if (head.type === 'atom' && head.value === 'default') {
        params.push(p); // pass through — compilePattern handles (default x val)
      } else {
        params.push(p); // nested pattern — compilePattern handles it
      }
    }
  }
  return params;
}

/**
 * Register a macro from a (macro name params body...) form.
 * @param {*} nameNode - The macro name atom
 * @param {*} paramsNode - The parameter pattern list
 * @param {*[]} bodyForms - The body forms
 * @throws {Error} If macro compilation fails
 */
export function registerMacroForm(nameNode, paramsNode, bodyForms) {
  const name = nameNode.value;

  if (macroEnv.has(name)) {
    throw new Error(`duplicate macro definition: '${name}'`);
  }

  const paramNames = extractParamNames(paramsNode);
  const jsBody = compileMacroBody(paramNames, paramsNode, bodyForms);

  try {
    const factory = new Function(...MACRO_API_PARAMS, jsBody);
    const macroFn = factory(...MACRO_API_VALUES);
    macroEnv.set(name, macroFn);
  } catch (err) {
    throw new Error(`failed to compile macro '${name}': ${err.message}`, { cause: err });
  }
}

/**
 * Extract parameter names from a macro param pattern (for gensym checking).
 */
function extractParamNames(pattern) {
  const names = new Set();

  function walk(node) {
    if (node === null || node === undefined) return;
    if (node.type === 'atom' && node.value !== '_') {
      names.add(node.value);
    } else if (node.type === 'list') {
      const head = node.values[0];
      if (head?.type === 'atom' && head.value === 'rest' && node.values[1]) {
        walk(node.values[1]);
      } else if (head?.type === 'atom' && head.value === 'default' && node.values[1]) {
        walk(node.values[1]);
      } else {
        for (const child of node.values) walk(child);
      }
    }
  }

  if (pattern.type === 'list') {
    for (const p of pattern.values) walk(p);
  }
  return names;
}

/**
 * Reset macro environment (for testing).
 */
export function resetMacros() {
  macroEnv.clear();
  registerSurfaceMacros(macroEnv);
}


export { formatSExpr, extractParamNames, compileMacroBody };

// --- Quasiquote Expansion (Bawden's Algorithm) ---
// Now implemented via walkQuasiquote/walkQQElement + expandStrategy (above).

function expandQuasiquote(form, depth) {
  return walkQuasiquote(form, depth, expandStrategy);
}

function _expandQQElement(element, depth) {
  return walkQQElement(element, depth, expandStrategy);
}

function quoteLiteral(form) {
  if (form.type === 'number' || form.type === 'string') return form;
  if (form.type === 'atom') return array(sym('quote'), form);
  if (form.type === 'list') {
    if (form.values.length === 0) return form;
    return array(...form.values.map(quoteLiteral));
  }
  if (form.type === 'cons') {
    return array(quoteLiteral(form.car), quoteLiteral(form.cdr));
  }
  return form;
}

// --- Dispatch Table ---

const dispatchTable = Object.assign(Object.create(null), {
  "quote":       { walk: "none" },
  "macro":       { walk: "register-macro" },
  "cons":        { walk: "desugar", transform: desugarCons },
  "list":        { walk: "desugar", transform: desugarList },
  "car":         { walk: "desugar", transform: desugarCar },
  "cdr":         { walk: "desugar", transform: desugarCdr },
  "cadr":        { walk: "desugar", transform: desugarCadr },
  "cddr":        { walk: "desugar", transform: desugarCddr },
  "as":          { walk: "desugar", transform: desugarAs },
  "const":       { walk: "expand-binding", keyword: "const" },
  "let":         { walk: "expand-binding", keyword: "let" },
  "var":         { walk: "expand-binding", keyword: "var" },
  "import-macros": { walk: "import-macros" },
  "macroexpand":   { walk: "debug-expand", mode: "full" },
  "macroexpand-1": { walk: "debug-expand", mode: "once" },
});

// --- Name resolution (DD-60 D1 / DD-61 §A1/§A3) ---
//
// On JS the scan and the tagger are the SAME walk: the expander lowers
// surface→kernel during expansion, so resolution lives inside `expandExpr`.
// A value environment (`env`, an immutable Set of in-scope names) is threaded
// through the walk; a head atom that is lexically bound is tagged `ref` and
// emitted as a plain call (the ref gate below), and `compiler.js` reads the tag
// through `formHead`. The env is consulted only at head position — arguments
// and values always compile to identifiers/literals regardless of tag.
//
// Where the env is extended is asymmetric, forced by monolithic lowering (a
// binding form is lowered as a whole, then its kernel result is re-walked):
//   • Function-family heads (`func`/`genfunc`/`fn`/`lambda`/`genfn`) lower to
//     `function`/`=>`/`function*`, whose param lists are NOT re-exposed by
//     `bindingsIntroduced`. Their bindings are added to the env at the SURFACE
//     level (the classifier branch), before lowering. bodyStart is 0 (whole
//     body in scope) so there is no out-of-scope region to protect.
//   • Every other binding form re-exposes its binders at the kernel level
//     (`for-of` stays `for-of`; `bind`→`const`; `if-let`/`match`→inner `const`
//     decls), where the uniform `scopePlan` walk (the default branch) extends
//     the env region-correctly — keeping a loop iterable / scrutinee OUTSIDE
//     the binding's scope. The two mechanisms are mutually exclusive per form
//     (double-extension would wrongly shadow a `for-of` iterable).

/** Shared empty environment (never mutated — `extendEnv` copies). */
const EMPTY_ENV = new Set();

function createExpansionEnvironment(bindings, typeContext) {
  return { bindings: new Set(bindings), typeContext };
}

function extendEnv(env, names) {
  return {
    bindings: extendBindingEnv(env.bindings, names),
    typeContext: env.typeContext,
  };
}
const directResultBlocks = new WeakSet();
const returnOperandValues = new WeakSet();
let compilerPrivateAtomCount = 0;

function completionValueAtom(identity) {
  return compilerPrivateAtom(identity, 'completionValue');
}

/** Create a compiler-only identity atom finalized after macro expansion. */
export function compilerPrivateAtom(identity, prefix = 'compilerPrivate') {
  const atom = sym(`${prefix}__private`);
  markCompilerPrivateAtom(atom, identity, prefix);
  compilerPrivateAtomCount++;
  return atom;
}

function preserveAnonymousName(value) {
  const isAnonymousDefinition = (node) => {
    if (node?.type !== 'list' || node.values.length === 0) return false;
    const head = formHead(node.values[0]);
    switch (head) {
      case '=>':
      case 'lambda':
      case 'class-expr':
        return node.values[1]?.type === 'list';
      case 'function*':
        return (node.values.length >= 3 && node.values[1]?.type === 'list') ||
          (node.values.length >= 4 && node.values[1]?.type === 'atom' &&
            node.values[1].value === '' && node.values[2]?.type === 'list');
      case 'async': {
        if (node.values.length !== 2) return false;
        const child = node.values[1];
        const childHead = child?.type === 'list' && child.values.length > 0
          ? formHead(child.values[0])
          : null;
        return ['=>', 'lambda', 'function*'].includes(childHead) &&
          isAnonymousDefinition(child);
      }
      default:
        return false;
    }
  };

  if (!isAnonymousDefinition(value)) return value;
  return markKernel(array(
    sym('?'),
    sym('true'),
    value,
    array(sym('void'), { type: 'number', value: 0 }),
  ));
}

function isAssignResultUse(use) {
  return use !== null && typeof use === 'object' && use.kind === 'Assign';
}

function isResultOperandUse(use) {
  return use === 'ReturnOperand' || isAssignResultUse(use);
}

function resultValueStatement(use, value) {
  if (use === 'ReturnOperand') return array(sym('return'), value);
  return array(sym('='), completionValueAtom(use.identity), preserveAnonymousName(value));
}

function resultNoValueStatement(use) {
  if (use === 'ReturnOperand') return array(sym('return'));
  return array(sym('='), completionValueAtom(use.identity), array(sym('void'), { type: 'number', value: 0 }));
}

function isDirectReturnFunc(node) {
  if (!node || node.type !== "Func") return false;
  const restArgs = node.restArgs ?? [];
  const first = restArgs[0];
  if (first?.type === "list" && first.values.length > 0 && first.values[0]?.type === "keyword") {
    return false;
  }
  const clauses = parseKeywordClauses(restArgs);
  if ((clauses.get("post")?.length ?? 0) > 0) return false;
  const returns = clauses.get("returns");
  if (!returns || returns.length === 0) return true;
  return returns[0]?.type === "keyword" && returns[0].value === "any";
}

/** Surface heads whose lowering hides their params — env-extended at surface. */
const FUNCTION_FAMILY = new Set(["func", "genfunc", "fn", "lambda", "genfn"]);

/**
 * Tag every binder atom this form introduces with `binding: 'def'` (mirror of
 * Rust's `NameRes::BindingDef`). Consumes `bindingsIntroduced` only. Def sites
 * sit in declaration/pattern positions the compiler reads structurally, never at
 * the dispatch door, so the tag is inert for output — it exists so `formHead`
 * returns null for a binder atom, matching Rust `as_form_head`.
 */
function tagDefSites(form) {
  for (const site of bindingsIntroduced(form)) {
    if (site.node && site.node.type === "atom") site.node.binding = "def";
  }
}


/** Push an expandExpr result (single, array, or null) preserving old semantics. */
function pushExpanded(out, result) {
  if (Array.isArray(result)) out.push(...result);
  else out.push(result);
}

function useAtFunctionBoundary(child, use) {
  if (use !== "DirectStatement" || child?.type !== "list" || child.values.length === 0) return use;
  return ["function", "function*", "=>", "lambda", "async"].includes(formHead(child.values[0]))
    ? "Statement"
    : use;
}

function expandSingle(form, env, use, context) {
  const result = expandAt(form, env, use);
  if (Array.isArray(result)) {
    if (result.length !== 1) throw new Error(`${context} must expand to a single form`);
    return result[0];
  }
  return result;
}

/**
 * Resolve+expand `children` as a sibling SEQUENCE: each child's enclosing-scope
 * declarations (`bind`/import locals) become visible to the FOLLOWING siblings.
 * Mirror of Rust `resolver::resolve_seq`.
 */
function expandChildrenSeq(children, env, use = "Legacy") {
  const out = [];
  let cur = env;
  for (const child of children) {
    const childUse = useAtFunctionBoundary(child, use);
    pushExpanded(out, expandAt(child, cur, childUse));
    const hoist = child?.type === "list" ? hoistedNames(child) : [];
    if (hoist.length) cur = extendEnv(cur, hoist);
  }
  return out;
}

function expandChildrenTail(children, env, prefixUse, tailUse) {
  if (children.length === 0) return { prefix: [], tail: null };
  const prefix = [];
  let cur = env;
  for (const child of children.slice(0, -1)) {
    pushExpanded(prefix, expandAt(child, cur, useAtFunctionBoundary(child, prefixUse)));
    const hoist = child?.type === "list" ? hoistedNames(child) : [];
    if (hoist.length) cur = extendEnv(cur, hoist);
  }
  const tail = expandAt(children[children.length - 1], cur, tailUse);
  return { prefix, tail };
}

/**
 * Resolve+expand a form's children under its `scopePlan`: pre-body children with
 * the outer env, then body children (from `bodyStart`) under the extended env as
 * a sequence. Mirror of Rust `resolver::resolve_split_at` + `resolve_seq`.
 */
function expandChildrenPlan(form, env, use = "Legacy") {
  const plan = bindingScopePlan(form, formHead(form.values[0]));
  const children = form.values;
  if ((use === "Statement" || use === "DirectStatement") && formHead(children[0]) === "try") {
    return expandTryStatement(form, env, use);
  }
  if ((use === "Statement" || use === "DirectStatement") && formHead(children[0]) === "switch") {
    const out = [children[0]];
    let cur = plan.kind === "body" ? extendEnv(env, plan.names) : env;
    if (children.length > 1) out.push(expandSingle(children[1], cur, "Value", "switch discriminant"));
    for (const clause of children.slice(2)) {
      if (clause?.type !== "list" || clause.values.length === 0) {
        pushExpanded(out, expandAt(clause, cur, "Legacy"));
        continue;
      }
      const isDefault = clause.values[0]?.type === "atom" && clause.values[0].value === "default";
      const prefix = isDefault ? [clause.values[0]] : [expandSingle(clause.values[0], cur, "Value", "switch test")];
      out.push({ type: "list", values: [...prefix, ...expandChildrenSeq(clause.values.slice(1), cur, use)] });
      const hoist = hoistedNames(clause);
      if (hoist.length) cur = extendEnv(cur, hoist);
    }
    return out;
  }
  if (plan.kind === "conditional") {
    const out = [children[0]];
    if (children.length > 1) {
      const conditionUse = use === "Statement" || use === "DirectStatement" || isResultOperandUse(use)
        ? "Value"
        : use;
      out.push(expandConditionalChild(children[1], env, true, conditionUse));
    }
    for (let i = 2; i < children.length; i++) {
      out.push(expandConditionalChild(children[i], env, false,
        use === "Statement" ? "Statement" : use === "DirectEntry" ? "DirectStatement" : use));
    }
    return out;
  }
  if (plan.kind === "seq") {
    const roles = childRoles(form, use);
    const out = [];
    let cur = env;
    for (let i = 0; i < children.length; i++) {
      const requestedRole = roles[i] ?? "Legacy";
      const role = useAtFunctionBoundary(children[i], requestedRole);
      pushExpanded(out, role === "Value"
        ? expandSingle(children[i], cur, role, "expression slot")
        : expandAt(children[i], cur, role));
      const hoist = children[i]?.type === "list" ? hoistedNames(children[i]) : [];
      if (hoist.length) cur = extendEnv(cur, hoist);
    }
    return out;
  }
  const split = Math.min(plan.bodyStart, children.length);
  const out = [];
  const roles = childRoles(form, use);
  for (let i = 0; i < split; i++) {
    const role = roles[i] ?? (use === "Protected" ? "Protected" : "Legacy");
    pushExpanded(out, role === "Value"
      ? expandSingle(children[i], env, role, "expression slot")
      : expandAt(children[i], env, role));
  }
  if (split < children.length) {
    const bodyEnv = extendEnv(env, plan.names);
    const bodyUse = use === "Statement" || use === "Protected" || use === "DirectStatement" ? use : "Legacy";
    let cur = bodyEnv;
    for (let i = split; i < children.length; i++) {
      const child = children[i];
      const requestedRole = roles[i] ?? bodyUse;
      const role = useAtFunctionBoundary(child, requestedRole);
      pushExpanded(out, role === "Value"
        ? expandSingle(child, cur, role, "expression slot")
        : expandAt(child, cur, role));
      const hoist = child?.type === "list" ? hoistedNames(child) : [];
      if (hoist.length) cur = extendEnv(cur, hoist);
    }
  }
  return out;
}

function expandConditionalChild(child, env, isCondition, use = "Legacy") {
  const expanded = expandAt(child, env, useAtFunctionBoundary(child, use));
  if (!Array.isArray(expanded)) return expanded;
  if (isCondition && expanded.length > 1) {
    throw new Error('if condition must expand to a single form');
  }
  if (expanded.length > 1) return markKernel(array(sym("block"), ...expanded));
  return expanded[0] ?? null;
}

function expandTryStatement(form, env, use = "Statement") {
  const values = form.values;
  let bodyEnd = values.length;
  const finalizer = values[bodyEnd - 1];
  const hasFinally = finalizer?.type === "list" && finalizer.values[0]?.type === "atom" &&
    finalizer.values[0].value === "finally";
  if (hasFinally) bodyEnd--;
  const catcher = values[bodyEnd - 1];
  const hasCatch = catcher?.type === "list" && catcher.values[0]?.type === "atom" &&
    catcher.values[0].value === "catch";
  if (hasCatch) bodyEnd--;

  const out = [values[0]];
  let cur = env;
  for (let i = 1; i < bodyEnd; i++) {
    const child = values[i];
    const head = child?.type === "list" ? child.values[0] : null;
    const structuralElsewhere = head?.type === "atom" &&
      (head.value === "catch" || head.value === "finally");
    const childUse = structuralElsewhere ? "Legacy" : useAtFunctionBoundary(child, use);
    pushExpanded(out, expandAt(child, cur, childUse));
    const hoist = child?.type === "list" ? hoistedNames(child) : [];
    if (hoist.length) cur = extendEnv(cur, hoist);
  }
  if (hasCatch) {
    const catchEnv = extendEnv(env, bodyScopeNames(catcher));
    out.push({ type: "list", values: [catcher.values[0], catcher.values[1], ...expandChildrenSeq(catcher.values.slice(2), catchEnv, use)] });
  }
  if (hasFinally) {
    out.push({ type: "list", values: [finalizer.values[0], ...expandChildrenSeq(finalizer.values.slice(1), env, use)] });
  }
  return out;
}

function childRoles(form, use) {
  const roles = Array(form.values.length).fill("Legacy");
  if (form.values.length === 0) return roles;
  const h = formHead(form.values[0]);
  if ((use === "DirectStatement" || isResultOperandUse(use)) && h === "return" && form.values.length === 2) {
    roles[1] = "ReturnOperand";
    return roles;
  }
  if (use === "DirectStatement" || isResultOperandUse(use)) {
    if (h === "block" || h === "do") {
      for (let i = 1; i < roles.length; i++) {
        roles[i] = use === "DirectStatement"
          ? "DirectStatement"
          : i === roles.length - 1 ? use : "Statement";
      }
      return roles;
    }
    if (h === "while" || h === "do-while") {
      roles[1] = "Value";
      for (let i = 2; i < roles.length; i++) roles[i] = "DirectStatement";
      return roles;
    }
    if (h === "for") {
      for (let i = 1; i <= 3 && i < roles.length; i++) roles[i] = "Value";
      for (let i = 4; i < roles.length; i++) roles[i] = "DirectStatement";
      return roles;
    }
    if (["for-of", "for-in", "for-await-of"].includes(h)) {
      roles[2] = "Value";
      for (let i = 3; i < roles.length; i++) roles[i] = "DirectStatement";
      return roles;
    }
    if (h === "label") {
      for (let i = 2; i < roles.length; i++) roles[i] = "DirectStatement";
      return roles;
    }
  }
  if (use === "Protected") return roles.fill("Protected");
  if (use === "Legacy") return roles;
  if (h === "function" || h === "function*") {
    const start = form.values[1]?.type === "atom" ? 3 : 2;
    for (let i = start; i < roles.length; i++) roles[i] = use === "DirectEntry" ? "DirectStatement" : "Statement";
    return roles;
  }
  if (h === "lambda") { for (let i = 2; i < roles.length; i++) roles[i] = use === "DirectEntry" ? "DirectStatement" : "Statement"; return roles; }
  if (h === "=>") {
    for (let i = 2; i < roles.length; i++) roles[i] = use === "DirectEntry" ? "DirectStatement" : roles.length === 3 ? "Value" : "Statement";
    return roles;
  }
  if (h === "async") { if (roles.length > 1) roles[1] = "Value"; return roles; }
  if (use !== "Statement" && use !== "Value") return roles;
  if (use === "Value" && h !== "function" && h !== "function*" && h !== "lambda" && h !== "=>" && h !== "async") return roles;
  if (h === "block" || h === "do") return roles.fill("Statement");
  if (h === "while" || h === "do-while") { roles[1] = "Value"; for (let i = 2; i < roles.length; i++) roles[i] = "Statement"; }
  else if (h === "for") { for (let i = 1; i <= 3 && i < roles.length; i++) roles[i] = "Value"; for (let i = 4; i < roles.length; i++) roles[i] = "Statement"; }
  else if (["for-of", "for-in", "for-await-of"].includes(h)) { roles[2] = "Value"; for (let i = 3; i < roles.length; i++) roles[i] = "Statement"; }
  else if (h === "label") { for (let i = 2; i < roles.length; i++) roles[i] = "Statement"; }
  else if (h === "export" && use === "Statement") {
    const args = form.values.slice(1);
    if (args[0]?.type === "atom" && args[0].value === "default") {
      if (roles.length > 2) roles[2] = "Value";
    } else if (args.length === 1 && args[0]?.type === "list" &&
      !(args[0].values[0]?.type === "atom" && args[0].values[0].value === "names")) {
      roles[1] = "Value";
    }
  }
  return roles;
}

function emittedNames(nodes, reserved = new Set()) {
  const walk = (node) => {
    if (!node || typeof node !== "object") return;
    if (node.type === "atom") {
      if (compilerPrivateAtomInfo(node) !== undefined) {
        return;
      }
      reserved.add(toJsIdentifier(node.value));
      for (const part of node.value.split(":").filter(Boolean)) reserved.add(toJsIdentifier(part));
    } else if (node.type === "list") node.values.forEach(walk);
    else if (node.type === "cons") { walk(node.car); walk(node.cdr); }
  };
  for (const node of nodes) walk(node);
  return reserved;
}

function finalizeCompilerPrivateAtoms(forms) {
  const reserved = emittedNames(forms);
  const names = new Map();
  let next = 0;
  const rename = (node) => {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'atom') {
      const marker = compilerPrivateAtomInfo(node);
      if (marker === undefined) return;
      let groups = names.get(marker.identity);
      if (groups === undefined) { groups = new Map(); names.set(marker.identity, groups); }
      let name = groups.get(marker.prefix);
      if (name === undefined) {
        do { name = `${marker.prefix}__gensym${next++}`; }
        while (reserved.has(toJsIdentifier(name)));
        reserved.add(toJsIdentifier(name));
        groups.set(marker.prefix, name);
      }
      node.value = name;
      clearCompilerPrivateAtom(node);
      return;
    }
    if (node.type === 'list') node.values.forEach(rename);
    else if (node.type === 'cons') { rename(node.car); rename(node.cdr); }
  };
  forms.forEach(rename);
}

function emitSurfaceMatchStatement(args, env) {
  return emitMatchStatementMacro(args, {
    env,
    extendEnv,
    typeContext: env.typeContext,
    expandValue: (form, scope) => expandSingle(form, scope, "Value", "match expression"),
    expandBody: (forms, scope) => expandChildrenSeq(forms, scope, "Statement"),
    reserveNames: emittedNames,
  });
}

function emitSurfaceMatchDirect(args, env) {
  return emitMatchStatementMacro(args, {
    env,
    extendEnv,
    typeContext: env.typeContext,
    expandValue: (form, scope) => expandSingle(form, scope, "Value", "match expression"),
    expandHeader: (form, scope) => expandDirectValuePlan(form, scope),
    expandBody: (forms, scope) => expandChildrenSeq(forms, scope, "DirectStatement"),
    reserveNames: emittedNames,
  });
}

function directBlock(statements) {
  const block = markKernel(array(sym("block"), ...statements));
  directResultBlocks.add(block);
  return block;
}

function isDirectTransfer(node) {
  const h = node?.type === "list" && node.values.length ? formHead(node.values[0]) : null;
  return ["return", "throw", "break", "continue"].includes(h);
}

function isExpandedStatement(node) {
  if (node && typeof node === "object" && returnOperandValues.has(node)) return false;
  const h = node?.type === "list" && node.values.length ? formHead(node.values[0]) : null;
  if (h === null) return false;
  if (h === "for-await-of") return true;
  return isStatementOnlyForm(node);
}

function directResultStatements(result, use = 'ReturnOperand') {
  if (Array.isArray(result)) {
    const statements = [...result];
    if (statements.length === 0 || !isDirectTransfer(statements[statements.length - 1])) {
      statements.push(resultNoValueStatement(use));
    }
    return statements;
  }
  if (result && typeof result === "object" && directResultBlocks.has(result)) {
    return [result];
  }
  if (result && typeof result === "object" && returnOperandValues.has(result)) {
    return [resultValueStatement(use, result)];
  }
  if (isDirectTransfer(result)) return [result];
  if (isExpandedStatement(result)) return [result, resultNoValueStatement(use)];
  return [resultValueStatement(use, result)];
}

function expandResultClause(forms, env, use) {
  if (forms.length === 0) return [resultNoValueStatement(use)];
  const { prefix, tail } = expandChildrenTail(forms, env, "DirectStatement", use);
  return [...prefix, ...directResultStatements(tail, use)];
}

function emitSurfaceMatchResult(args, env, use) {
  const result = emitMatchStatementMacro(args, {
    env,
    extendEnv,
    typeContext: env.typeContext,
    expandValue: (form, scope) => expandSingle(form, scope, "Value", "match expression"),
    expandHeader: (form, scope) => expandDirectValuePlan(form, scope),
    expandBody: (forms, scope) => expandResultClause(forms, scope, use),
    reserveNames: emittedNames,
  });
  directResultBlocks.add(result);
  return result;
}

function isDirectResultRegion(result) {
  return Array.isArray(result) || directResultBlocks.has(result) ||
    isDirectTransfer(result) || isExpandedStatement(result);
}

function directValuePlanFromResult(result, identity, use) {
  if (!isDirectResultRegion(result)) return { prefix: [], value: result };
  const destination = completionValueAtom(identity);
  const statements = directResultStatements(result, use);
  const body = statements.length === 1 && directResultBlocks.has(statements[0])
    ? statements[0]
    : directBlock(statements);
  return {
    prefix: [array(sym("let"), destination), body],
    value: destination,
  };
}

function expandDirectValuePlan(form, env) {
  const identity = {};
  const use = { kind: "Assign", identity };
  return directValuePlanFromResult(expandAt(form, env, use), identity, use);
}

function expandDirectSpreadArgument(form, env, directCallArgumentRequest) {
  if (form.values.length !== 2) {
    throw new Error("spread takes exactly one argument");
  }
  const operand = expandDirectValuePlan(form.values[1], env);
  const ordinaryValue = markKernel({ ...form, values: [form.values[0], operand.value] });
  directCallArgumentRequest.result = {
    kind: "spread",
    prefix: operand.prefix,
    value: operand.value,
    ordinaryValue,
  };
  directCallArgumentRequest.handled = true;
  return ordinaryValue;
}

function expandDirectCallArgument(form, env) {
  const identity = {};
  const use = { kind: "Assign", identity };
  const request = { handled: false, result: null };
  const result = expandAt(form, env, use, null, request);
  if (request.handled) return request.result;
  const plan = directValuePlanFromResult(result, identity, use);
  return { kind: "value", ...plan };
}

function directWriteNameIsAdmitted(name) {
  if (name.includes(":")) return false;
  return ![
    "Reflect",
    "globalThis",
    "eval",
    "super",
    "new",
    "this",
    "arguments",
  ].includes(toJsIdentifier(name));
}

function directWriteTargetParts(target, env, internalComputedTarget = false) {
  if (target?.type === "atom" && directWriteNameIsAdmitted(target.value) &&
    (target.binding === "ref" || env.bindings.has(target.value))) {
    return { kind: "lexical", target };
  }
  if (internalComputedTarget) {
    const { receiver, key } = internalComputedTarget;
    if (receiver?.type !== "atom" || !directWriteNameIsAdmitted(receiver.value) ||
      !(receiver.binding === "ref" || env.bindings.has(receiver.value))) return null;
    return { kind: "computed", receiver, key, memberHead: sym("get") };
  }
  if (target?.type !== "list" || target.values.length !== 3) return null;
  const [getHead, receiver, key] = target.values;
  if (receiver?.type !== "atom" || !directWriteNameIsAdmitted(receiver.value) ||
    !(receiver.binding === "ref" || env.bindings.has(receiver.value))) return null;
  if (getHead?.type !== "atom") return null;
  if (getHead.value === "kernel:get" && getHead.binding === undefined &&
    !isKernel(target) && KERNEL_FORMS.has("get")) {
    return { kind: "computed", receiver, key, memberHead: markKernel(sym("get")) };
  }
  if (formHead(getHead) !== "get" || isKernel(target) ||
    env.bindings.has("get") || macroEnv.has("get")) return null;
  return { kind: "computed", receiver, key, memberHead: getHead };
}

function expandDirectAssignment(target, value, operator, env, use, internalComputedTarget = false) {
  const targetPlan = directWriteTargetParts(target, env, internalComputedTarget);
  if (!targetPlan) return null;
  if (operator === "+=" &&
    (targetPlan.kind !== "computed" || targetPlan.key?.type !== "string")) return null;

  const statements = [];
  if (targetPlan.kind === "lexical") {
    const valuePlan = expandDirectValuePlan(value, env);
    const assignment = markKernel(array(sym(operator), targetPlan.target, valuePlan.value));
    if (valuePlan.prefix.length === 0) return assignment;
    statements.push(...valuePlan.prefix);
    statements.push(use === "DirectStatement" ? assignment : resultValueStatement(use, assignment));
    return directBlock(statements);
  }

  const receiverPlan = expandDirectValuePlan(targetPlan.receiver, env);
  const keyPlan = expandDirectValuePlan(targetPlan.key, env);
  const valuePlan = expandDirectValuePlan(value, env);
  const lifted = receiverPlan.prefix.length > 0 || keyPlan.prefix.length > 0 ||
    valuePlan.prefix.length > 0;
  const ordinaryTarget = markKernel(array(
    targetPlan.memberHead,
    receiverPlan.value,
    keyPlan.value,
  ));
  if (!lifted) {
    return markKernel(array(sym(operator), ordinaryTarget, valuePlan.value));
  }

  statements.push(...receiverPlan.prefix);
  const receiver = completionValueAtom({});
  statements.push(array(sym("const"), receiver, preserveAnonymousName(receiverPlan.value)));
  statements.push(...keyPlan.prefix);

  let key;
  let oldValue = null;
  if (operator === "+=") {
    key = keyPlan.value;
    oldValue = completionValueAtom({});
    const oldGet = markKernel(array(sym("get"), receiver, key));
    statements.push(array(sym("const"), oldValue, preserveAnonymousName(oldGet)));
  } else {
    key = completionValueAtom({});
    statements.push(array(sym("const"), key, preserveAnonymousName(keyPlan.value)));
  }
  statements.push(...valuePlan.prefix);

  const writeTarget = markKernel(array(sym("get"), receiver, key));
  const rightHandSide = oldValue === null
    ? valuePlan.value
    : array(sym("+"), oldValue, valuePlan.value);
  const assignment = markKernel(array(sym("="), writeTarget, rightHandSide));
  statements.push(use === "DirectStatement" ? assignment : resultValueStatement(use, assignment));
  return directBlock(statements);
}

function isDirectLexicalCallHead(head) {
  if (head?.type !== "atom" || head.binding !== "ref" || head.value.includes(":")) {
    return false;
  }
  return !["eval", "super", "new"].includes(toJsIdentifier(head.value));
}

function callArgumentValue(plan) {
  return plan.kind === "spread" ? plan.ordinaryValue : plan.value;
}

function appendMaterializedArgument(statements, argv, cursor, value) {
  statements.push(markKernel(array(
    sym("="),
    markKernel(array(sym("get"), argv, cursor)),
    value,
  )));
  statements.push(markKernel(array(
    sym("="),
    cursor,
    markKernel(array(sym("+"), cursor, { type: "number", value: 1 })),
  )));
  statements.push(markKernel(array(
    sym("="),
    markKernel(array(sym("get"), argv, { type: "string", value: "length" })),
    cursor,
  )));
}

function materializeSpreadArguments(argumentsPlan) {
  const argv = completionValueAtom({});
  const cursor = completionValueAtom({});
  const object = markKernel(array(
    sym("object"),
    array({ type: "string", value: "__proto__" }, sym("null")),
    array(sym("length"), { type: "number", value: 0 }),
  ));
  const statements = [
    array(sym("const"), argv, object),
    array(sym("let"), cursor, { type: "number", value: 0 }),
  ];
  for (const argument of argumentsPlan) {
    statements.push(...argument.prefix);
    if (argument.kind === "spread") {
      const item = completionValueAtom({});
      const body = [];
      appendMaterializedArgument(body, argv, cursor, item);
      statements.push(markKernel(array(sym("for-of"), item, argument.value, ...body)));
    } else {
      appendMaterializedArgument(statements, argv, cursor, argument.value);
    }
  }
  return { statements, argv };
}

function planDirectCallArguments(plans, forceLift = false) {
  let lastPrefix = -1;
  for (let index = 0; index < plans.length; index++) {
    if (plans[index].prefix.length > 0) lastPrefix = index;
  }
  const hasSpread = plans.some(plan => plan.kind === "spread");
  if (lastPrefix < 0) {
    const values = plans.map(callArgumentValue);
    if (hasSpread && forceLift) return { kind: "reference-only", values };
    return forceLift
      ? { kind: "lifted", prefix: [], values }
      : { kind: "unlifted", values };
  }
  if (hasSpread) return { kind: "lifted-spread", arguments: plans };
  const prefix = [];
  const values = [];
  for (let index = 0; index < plans.length; index++) {
    const { prefix: argumentPrefix, value } = plans[index];
    if (index > lastPrefix) {
      values.push(value);
    } else if (argumentPrefix.length === 0) {
      const saved = completionValueAtom({});
      prefix.push(array(sym("const"), saved, preserveAnonymousName(value)));
      values.push(saved);
    } else {
      prefix.push(...argumentPrefix);
      values.push(value);
    }
  }
  return { kind: "lifted", prefix, values };
}

function directMemberCallParts(head) {
  if (head?.type !== "atom" || head.value.startsWith("js:") || head.value.startsWith("kernel:")) {
    return null;
  }
  const separator = head.value.indexOf(":");
  if (separator <= 0 || separator !== head.value.lastIndexOf(":")) return null;
  const base = head.value.slice(0, separator);
  const property = head.value.slice(separator + 1);
  const normalizedBase = toJsIdentifier(base);
  const isOrdinaryIdentifier = value => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(value);
  if (!property || ["js", "kernel"].includes(base) || normalizedBase === "this" ||
      normalizedBase === "super" || property.startsWith("-") || /^\d/.test(property) ||
      !isOrdinaryIdentifier(normalizedBase) || !isOrdinaryIdentifier(toJsIdentifier(property))) {
    return null;
  }
  return { base, property };
}

function expandDirectMemberCall(form, env, use, memberParts) {
  const { base, property } = memberParts;
  const plans = form.values.slice(1).map(argument => expandDirectCallArgument(argument, env));
  const argumentPlan = planDirectCallArguments(plans);
  if (argumentPlan.kind === "unlifted") {
    return { type: "list", values: [form.values[0], ...argumentPlan.values] };
  }

  return expandSavedMemberInvocation(
    [], sym(base), [], { type: "string", value: toJsIdentifier(property) },
    argumentPlan, use,
  );
}

function expandSavedMemberInvocation(receiverPrefix, receiverValue, keyPrefix, keyValue,
  argumentPlan, use, sanctionedGet = false) {
  const receiver = completionValueAtom({});
  const callee = completionValueAtom({});
  const getCall = array(sym("get"), receiver, keyValue);
  if (sanctionedGet) markKernel(getCall);
  const statements = [
    ...receiverPrefix,
    array(sym("const"), receiver, preserveAnonymousName(receiverValue)),
    ...keyPrefix,
    array(sym("const"), callee, getCall),
  ];
  let actualArgv;
  if (argumentPlan.kind === "lifted-spread") {
    const materialized = materializeSpreadArguments(argumentPlan.arguments);
    statements.push(...materialized.statements);
    actualArgv = materialized.argv;
  } else {
    actualArgv = completionValueAtom({});
    statements.push(...argumentPlan.prefix);
    statements.push(array(sym("const"), actualArgv, array(sym("array"), ...argumentPlan.values)));
  }
  const invocation = markExpandedHostCall(array(callee, receiver, actualArgv));
  statements.push(use === "DirectStatement" ? invocation : resultValueStatement(use, invocation));
  return directBlock(statements);
}

function directComputedMemberCallParts(head, env) {
  if (head?.type !== "list" || head.values.length !== 3) return null;
  if (head.values[1]?.type === "atom" && toJsIdentifier(head.values[1].value) === "super") return null;
  const getHead = head.values[0];
  if (getHead?.type !== "atom") return null;
  if (getHead.value === "kernel:get" && getHead.binding === undefined && !isKernel(head)) {
    return { explicitEscape: true };
  }
  if (getHead.value !== "get" || getHead.binding !== undefined ||
      env.bindings.has("get") || macroEnv.has("get") || isKernel(head)) return null;
  return { explicitEscape: false };
}

function expandDirectComputedMemberCall(form, request, env) {
  const getForm = form;
  const receiver = expandDirectValuePlan(getForm.values[1], env);
  const key = expandDirectValuePlan(getForm.values[2], env);
  const argumentPlans = request.args.map(argument => expandDirectCallArgument(argument, env));
  const referenceLifted = receiver.prefix.length > 0 || key.prefix.length > 0;
  const argumentPlan = planDirectCallArguments(argumentPlans, referenceLifted);

  if (!referenceLifted && argumentPlan.kind === "unlifted") {
    const member = { ...getForm, values: [getForm.values[0], receiver.value, key.value] };
    if (isKernel(getForm)) markKernel(member);
    request.result = { ...request.outerForm, values: [member, ...argumentPlan.values] };
    request.handled = true;
    return request.result;
  }

  if (argumentPlan.kind === "reference-only") {
    const savedReceiver = completionValueAtom({});
    const statements = [
      ...receiver.prefix,
      array(sym("const"), savedReceiver, preserveAnonymousName(receiver.value)),
      ...key.prefix,
    ];
    const member = array(sym("get"), savedReceiver, key.value);
    if (isKernel(getForm)) markKernel(member);
    const call = array(member, ...argumentPlan.values);
    statements.push(request.use === "DirectStatement" ? call : resultValueStatement(request.use, call));
    request.result = directBlock(statements);
    request.handled = true;
    return request.result;
  }

  request.result = expandSavedMemberInvocation(
    receiver.prefix, receiver.value, key.prefix, key.value, argumentPlan, request.use,
    isKernel(getForm),
  );
  request.handled = true;
  return request.result;
}

function expandDirectLexicalCall(form, env, use) {
  const [head, ...args] = form.values;
  const plans = args.map((argument) => expandDirectCallArgument(argument, env));
  const argumentPlan = planDirectCallArguments(plans);
  if (argumentPlan.kind === "unlifted") {
    return { type: "list", values: [head, ...argumentPlan.values] };
  }

  if (argumentPlan.kind === "lifted-spread") {
    const callee = completionValueAtom({});
    const receiver = completionValueAtom({});
    const statements = [
      array(sym("const"), callee, head),
      array(sym("const"), receiver, array(sym("void"), { type: "number", value: 0 })),
    ];
    const materialized = materializeSpreadArguments(argumentPlan.arguments);
    statements.push(...materialized.statements);
    const invocation = markExpandedHostCall(array(callee, receiver, materialized.argv));
    statements.push(use === "DirectStatement" ? invocation : resultValueStatement(use, invocation));
    return directBlock(statements);
  }

  const callee = completionValueAtom({});
  const statements = [array(sym("const"), callee, head), ...argumentPlan.prefix];

  const call = array(callee, ...argumentPlan.values);
  statements.push(use === "DirectStatement" ? call : resultValueStatement(use, call));
  return directBlock(statements);
}

function logicalBranchCondition(operator, value) {
  if (operator === "&&") return value;
  if (operator === "||") return array(sym("!"), value);
  return array(sym("||"),
    array(sym("==="), value, sym("null")),
    array(sym("==="), value, array(sym("void"), { type: "number", value: 0 })));
}

function expandLogicalResultOperand(operands, operator, env, use, preserveVariadic = false) {
  const identity = {};
  const logicalUse = { kind: "Assign", identity };
  const plans = operands.map((operand) => expandAt(operand, env, logicalUse));
  const isValue = (plan) => !isDirectResultRegion(plan);
  if (plans.every(isValue)) {
    if (preserveVariadic) return markKernel(array(sym(operator), ...plans));
    let result = plans[0];
    for (const plan of plans.slice(1)) result = array(sym(operator), result, plan);
    return markKernel(result);
  }

  const destination = completionValueAtom(identity);
  const statements = [array(sym("let"), destination)];
  for (let index = 0; index < plans.length; index++) {
    const plan = plans[index];
    const branch = directResultStatements(plan, logicalUse);
    if (index === 0) {
      statements.push(branch.length === 1 && directResultBlocks.has(branch[0])
        ? branch[0]
        : directBlock(branch));
      continue;
    }
    statements.push(array(sym("if"), logicalBranchCondition(operator, destination),
      array(sym("block"), ...branch)));
  }
  statements.push(resultValueStatement(use, destination));
  return directBlock(statements);
}

function expandResultOperand(form, env, use) {
  const h = formHead(form.values[0]);
  if (h === "if") {
    if (form.values.length < 4) {
      const value = expandAt(form, env, "Value");
      if (value && typeof value === "object" && !Array.isArray(value)) returnOperandValues.add(value);
      return value;
    }
    const { prefix: conditionPrefix, value: condition } = expandDirectValuePlan(form.values[1], env);
    const consequent = expandAt(form.values[2], env, use);
    const alternate = expandAt(form.values[3], env, use);
    const isValue = (result) => !Array.isArray(result) &&
      !directResultBlocks.has(result) && !isDirectTransfer(result) &&
      !isExpandedStatement(result);
    if (isValue(consequent) && isValue(alternate) && conditionPrefix.length === 0) {
      const value = { ...form, values: [form.values[0], condition, consequent, alternate] };
      returnOperandValues.add(value);
      return value;
    }
    const branch = (result) => array(sym("block"), ...directResultStatements(result, use));
    const conditional = array(sym("if"), condition, branch(consequent), branch(alternate));
    return directBlock([...conditionPrefix, conditional]);
  }
  if (h === "do") {
    const { prefix, tail } = expandChildrenTail(form.values.slice(1), env, "DirectStatement", use);
    if (tail === null) prefix.push(resultNoValueStatement(use));
    else prefix.push(...directResultStatements(tail, use));
    return directBlock(prefix);
  }
  const value = expandAt(form, env, "Value");
  if (isExpandedStatement(value)) return directBlock(directResultStatements(value, use));
  return value;
}

function simpleDirectBind(args) {
  let nameNode;
  let valueNode;
  if (args.length === 2) [nameNode, valueNode] = args;
  else if (args.length === 3 && args[0]?.type === 'keyword' && args[0].value === 'any') {
    [, nameNode, valueNode] = args;
  } else return null;
  if (nameNode?.type !== 'atom' || nameNode.value === '_' || nameNode.value.includes(':')) return null;
  return { nameNode, valueNode };
}

function expandDirectBind(args, env) {
  const { nameNode, valueNode } = simpleDirectBind(args);
  const kernel = emitSurfaceForm({ type: 'Bind', args }, { sym, array, gensym, isKeyword, typeContext: env.typeContext });
  const identity = {};
  const use = { kind: 'Assign', identity };
  const value = expandAt(valueNode, env, use);
  const isRegion = Array.isArray(value) || directResultBlocks.has(value) ||
    isDirectTransfer(value) || isExpandedStatement(value);
  if (!isRegion) {
    kernel.values[2] = value;
    return markKernel(kernel);
  }
  return [
    markKernel(array(sym('let'), completionValueAtom(identity))),
    directBlock(directResultStatements(value, use)),
    markKernel(array(sym('const'), nameNode, completionValueAtom(identity))),
  ];
}

// --- Expansion Walk ---

/**
 * Expand a single AST form, resolving sugar, quasiquote, and quote.
 * @param {*} form - A reader AST node
 * @param {Set<string>} [env] - in-scope value names (DD-60 D1); defaults empty
 * @returns {* | *[]} Expanded form(s)
 */
export function expandExpr(form, env = EMPTY_ENV) {
  const privateCountAtStart = compilerPrivateAtomCount;
  const expansionEnv = createExpansionEnvironment(env, createSurfaceTypeContext());
  const result = expandAt(form, expansionEnv, "Legacy");
  if (compilerPrivateAtomCount !== privateCountAtStart) {
    finalizeCompilerPrivateAtoms(Array.isArray(result) ? result : [result]);
  }
  if (result === null || result === undefined) return result;
  const forms = Array.isArray(result) ? result : [result];
  lowerHostReferences(forms);
  return Array.isArray(result) || forms.length > 1 ? forms : forms[0];
}

function expandAt(form, env, use, computedMemberCallRequest = null,
  directCallArgumentRequest = null) {
  // Propagate the sanctioned-kernel mark across expansion: if the input was
  // sanctioned (compiler-produced kernel), so is the output — even though the
  // inner walk rebuilds nodes (e.g. `expand-binding` returns a fresh list).
  // This is what lets the post-pass2 DD-58 sweep tell compiler-emitted kernel
  // (`bind`→`const`, the `kernel:` escape) from user-macro-emitted kernel.
  const sanctioned = isKernel(form);
  const result = expandExprInner(
    form,
    env,
    use,
    computedMemberCallRequest,
    directCallArgumentRequest,
  );
  if (computedMemberCallRequest?.handled) return computedMemberCallRequest.result;
  if (directCallArgumentRequest?.handled) return directCallArgumentRequest.result;
  if (sanctioned) {
    if (Array.isArray(result)) {
      for (const r of result) markKernel(r);
    } else {
      markKernel(result);
    }
  }
  return result;
}

function expandExprInner(form, env, use = "Legacy", computedMemberCallRequest = null,
  directCallArgumentRequest = null) {
  if (form === null || form === undefined) return form;
  if (form.type === 'atom' || form.type === 'number' || form.type === 'string' || form.type === 'keyword') {
    return form;
  }

  if (form.type === 'cons') {
    return { type: 'cons', car: expandAt(form.car, env, "Legacy"), cdr: expandAt(form.cdr, env, "Legacy") };
  }

  if (form.type !== 'list') {
    throw new Error(`expandExpr: unexpected node type '${form.type}'`);
  }

  if (form.values.length === 0) return form;

  const head = form.values[0];

  const boundOrTaggedMatch = head.type === 'atom' && head.value === 'match' &&
    (head.binding !== undefined || env.bindings.has('match'));

  // Tag this form's binder atoms `def` (no-op for non-binding forms). Inert for
  // output — def sites are read structurally, never at the dispatch door.
  if (!boundOrTaggedMatch) tagDefSites(form);

  // Quasiquote
  if (head.type === 'atom' && head.value === 'quasiquote') {
    if (form.values.length !== 2) throw new Error('quasiquote requires exactly one argument');
    const expanded = expandQuasiquote(form.values[1], 0);
    return expandAt(expanded, env, "Legacy");
  }

  // Unquote/splice outside quasiquote
  if (head.type === 'atom' && head.value === 'unquote') {
    throw new Error('unquote outside of quasiquote');
  }
  if (head.type === 'atom' && head.value === 'unquote-splicing') {
    throw new Error('unquote-splicing outside of quasiquote');
  }

  // DD-58: (kernel:<form> …) escape — strip the prefix, validate the form
  // against the kernel whitelist, and pass the raw kernel form through as
  // sanctioned kernel (so it is neither re-classified nor macro-expanded nor
  // strict-rejected). Mirrors the Rust classifier's kernel: handling
  // (forms.rs); works in both lax and strict modes and at any nesting depth.
  // Takes precedence over all other dispatch.
  if (head.type === 'atom' && head.value.startsWith('kernel:') && !isKernel(form)) {
    const kernelForm = head.value.slice('kernel:'.length);
    if (!KERNEL_FORMS.has(kernelForm)) {
      const hint = closestKernelForm(kernelForm);
      throw new Error(
        `unknown kernel form '${kernelForm}' in (kernel:${kernelForm} ...)` +
        (hint ? `; did you mean '${hint}'?` : ''),
      );
    }
    const stripped = markKernel({
      type: 'list',
      values: [{ type: 'atom', value: kernelForm }, ...form.values.slice(1)],
    });
    if (kernelForm === "spread" && directCallArgumentRequest) {
      return expandDirectSpreadArgument(stripped, env, directCallArgumentRequest);
    }
    if ((kernelForm === "=" || kernelForm === "+=") &&
      (use === "DirectStatement" || isResultOperandUse(use)) &&
      stripped.values.length === 3) {
      const assignment = expandDirectAssignment(
        stripped.values[1],
        stripped.values[2],
        kernelForm,
        env,
        use,
      );
      if (assignment !== null) return assignment;
    }
    if (computedMemberCallRequest) {
      computedMemberCallRequest.explicitEscape = true;
    }
    return expandAt(stripped, env, use, computedMemberCallRequest, directCallArgumentRequest);
  }

  // Resolution gate (DD-60 D1 / DD-61 §A3). A head atom that is lexically bound
  // in `env` (or already tagged `ref`) is a reference to the binding, not a
  // macro/form/kernel head: tag it `ref`, emit a plain call, and skip classifier
  // + user-macro + kernel dispatch entirely (F-2). Binding-position atoms thus
  // never reach a dispatch site — the throws-from-the-binding-site rows resolve
  // to ordinary calls. Sanctioned kernel (`isKernel`) is the compiler's own
  // output and is never re-read as a bound reference (e.g. a `conj`-emitted
  // `(array …)` stays an array literal even when `array` is bound).
  if (head.type === 'atom' && !isKernel(form) &&
      (head.binding === 'ref' || env.bindings.has(head.value))) {
    head.binding = 'ref';
    if (isDirectLexicalCallHead(head) &&
        (use === "DirectStatement" || isResultOperandUse(use))) {
      return expandDirectLexicalCall(form, env, use);
    }
    const values = [head];
    for (const sub of form.values.slice(1)) {
      pushExpanded(values, expandAt(sub, env, use === "Legacy" || use === "Protected" ? use : "Value"));
    }
    return { type: 'list', values };
  }

  // Fixed-point macro expansion
  // DD-37: try the new classifier first. If it handles the form, emit
  // the kernel form directly and skip macro expansion.
  const surfaceHead = formHead(head);
  if (surfaceHead !== null && !isKernel(form)) {
    const astNode = classifySurfaceForm(surfaceHead, form.values.slice(1));
    if (astNode) {
      // Function-family bindings vanish into `=>`/`function` param lists at the
      // kernel level, so extend the value env at the surface level, before
      // lowering. All other binding forms re-expose their binders at the kernel
      // level (handled by the default branch's `scopePlan`).
      const childEnv = FUNCTION_FAMILY.has(surfaceHead)
        ? extendEnv(env, bodyScopeNames(form))
        : env;
      if (isResultOperandUse(use) && (astNode.type === "And" || astNode.type === "Or")) {
        return expandLogicalResultOperand(
          astNode.args,
          astNode.type === "And" ? "&&" : "||",
          env,
          use,
        );
      }
      if (astNode.type === "Match" && use === "Statement") {
        return emitSurfaceMatchStatement([astNode.expr, ...astNode.clauses], env);
      }
      if (astNode.type === "Match" && use === "DirectStatement") {
        return emitSurfaceMatchDirect([astNode.expr, ...astNode.clauses], env);
      }
      if (astNode.type === "Match" && use === "ReturnOperand") {
        return emitSurfaceMatchResult([astNode.expr, ...astNode.clauses], env, use);
      }
      if (astNode.type === "Match" && isAssignResultUse(use)) {
        return emitSurfaceMatchResult([astNode.expr, ...astNode.clauses], env, use);
      }
      if (astNode.type === "Bind" && use === "DirectStatement" && simpleDirectBind(astNode.args)) {
        return expandDirectBind(astNode.args, env);
      }
      if (astNode.type === "BindGroup") {
        const out = [];
        let cur = env;
        for (const binding of astNode.bindings) {
          const args = binding.typeKw
            ? [binding.typeKw, binding.nameNode, binding.valueNode]
            : [binding.nameNode, binding.valueNode];
          if (use === "DirectStatement" && simpleDirectBind(args)) {
            pushExpanded(out, expandDirectBind(args, cur));
            const names = bindingNamesInPattern(binding.nameNode).map((site) => site.name);
            if (names.length) cur = extendEnv(cur, names);
            continue;
          }
          const kernel = emitSurfaceForm(
            { type: "Bind", args },
            { sym, array, gensym, isKeyword, typeContext: cur.typeContext },
          );
          pushExpanded(out, expandAt(markKernel(kernel), cur, "Legacy"));
          const names = bindingNamesInPattern(binding.nameNode).map((site) => site.name);
          if (names.length) cur = extendEnv(cur, names);
        }
        return out;
      }

      if (astNode.type === "SetSymbol" &&
        (use === "DirectStatement" || isResultOperandUse(use))) {
        const assignment = expandDirectAssignment(
          null,
          astNode.value,
          "=",
          childEnv,
          use,
          { receiver: astNode.obj, key: astNode.key },
        );
        if (assignment !== null) return assignment;
      }

      const kernel = emitSurfaceForm(astNode, { sym, array, gensym, isKeyword, typeContext: env.typeContext });
      const kernelUse = use === "Protected"
        ? "Protected"
        : use === "Legacy"
        ? "Legacy"
        : FUNCTION_FAMILY.has(surfaceHead)
        ? (astNode.type === "Func"
          ? isDirectReturnFunc(astNode)
            ? "DirectEntry"
            : funcBodyProtectsStatementExit(astNode) ? "Protected" : "Statement"
          : "Statement")
        : "Legacy";
      if (Array.isArray(kernel)) {
        return kernel.map(k => expandAt(markKernel(k), childEnv, kernelUse));
      }
      return expandAt(markKernel(kernel), childEnv, kernelUse);
    }
  }

  // Skip re-expansion of forms marked as kernel output by surface macros
  if (head.type === 'atom' && macroEnv.has(head.value) && !isKernel(form)) {
    let current = form;
    let count = 0;
    while (current.type === 'list' && current.values.length > 0 &&
           current.values[0].type === 'atom' && macroEnv.has(current.values[0].value) &&
           !isKernel(current)) {
      const macroName = current.values[0].value;
      const macroArgs = current.values.slice(1);
      try {
        current = macroEnv.get(macroName)(...macroArgs);
      } catch (err) {
        throw new Error(`error expanding macro '${macroName}': ${err.message}`, { cause: err });
      }
      if (++count > MAX_EXPAND_ITERATIONS) {
        throw new Error(`expansion limit (${MAX_EXPAND_ITERATIONS}) exceeded expanding '${form.values[0].value}'`);
      }
    }
    if (Array.isArray(current)) {
      return current.map((r) => expandAt(r, env, use));
    }
    return expandAt(current, env, use, null, directCallArgumentRequest);
  }

  if (directCallArgumentRequest && formHead(head) === "spread") {
    return expandDirectSpreadArgument(form, env, directCallArgumentRequest);
  }

  if (computedMemberCallRequest && formHead(head) === "get" &&
      form.values.length === 3 && head?.type === "atom" && head.binding !== "ref" &&
      (!isKernel(form) || computedMemberCallRequest.explicitEscape)) {
    return expandDirectComputedMemberCall(form, computedMemberCallRequest, env);
  }

  if (use === "DirectStatement" && formHead(head) === "if" && form.values.length >= 2) {
    const conditionPlan = expandDirectValuePlan(form.values[1], env);
    const branches = form.values.slice(2).map((branch) =>
      expandConditionalChild(branch, env, false, "DirectStatement")
    );
    const conditional = markKernel({
      type: "list",
      values: [head, conditionPlan.value, ...branches],
    });
    return conditionPlan.prefix.length
      ? directBlock([...conditionPlan.prefix, conditional])
      : conditional;
  }

  if (isResultOperandUse(use) && ["&&", "||", "??"].includes(formHead(head)) &&
      form.values.length >= 3) {
    const operator = formHead(head);
    return expandLogicalResultOperand(form.values.slice(1), operator, env, use, true);
  }

  // Private direct return materialization runs after resolution and user macro
  // fixed point, so its operand is expanded once under the source function's
  // return destination.
  if ((use === "DirectStatement" || isResultOperandUse(use)) &&
      formHead(head) === "return" && form.values.length === 2) {
    const value = expandAt(form.values[1], env, "ReturnOperand");
    if (directResultBlocks.has(value)) return value;
    if (Array.isArray(value) || isDirectTransfer(value) || isExpandedStatement(value)) {
      return directBlock(directResultStatements(value, "ReturnOperand"));
    }
    return { ...form, values: [head, value] };
  }
  if (isResultOperandUse(use) && (formHead(head) === "if" || formHead(head) === "do")) {
    return expandResultOperand(form, env, use);
  }

  // Dispatch table
  if (head.type === 'atom') {
    const entry = dispatchTable[head.value];
    if (entry) {
      switch (entry.walk) {
        case 'none':
          return form;

        case 'register-macro':
          throw new Error('unexpected macro definition in expansion pass (macros should be processed in Pass 1)');

        case 'desugar': {
          const args = form.values.slice(1);
          const result = entry.transform(args);
          if (Array.isArray(result)) {
            return result.map((r) => expandAt(r, env, use));
          }
          return expandAt(result, env, use);
        }

        case 'expand-binding': {
          const args = form.values.slice(1);
          // Check for (as pattern whole) in binding position
          if (args[0]?.type === 'list' && args[0].values.length >= 1 &&
              args[0].values[0]?.type === 'atom' && args[0].values[0]?.value === 'as') {
            const asArgs = args[0].values.slice(1);
            if (asArgs.length === 2 && asArgs[0].type === 'list') {
              const pattern = asArgs[0];
              const whole = asArgs[1];
              const initExpr = args[1];
              return [
                expandAt(array(sym(entry.keyword), whole, initExpr), env, 'Legacy'),
                expandAt(array(sym(entry.keyword), pattern, whole), env, 'Legacy'),
              ];
            }
          }
          // No as pattern — default recursive expansion. The declared name is
          // not in scope over its own value (the value sees `env` unchanged);
          // it hoists to following siblings via the enclosing sequence walk.
          return { type: 'list', values: form.values.map((sub) => expandAt(sub, env, 'Legacy')) };
        }

        case 'import-macros':
          throw new Error('import-macros not yet implemented (Phase 5)');

        case 'debug-expand': {
          const debugArgs = form.values.slice(1);
          if (debugArgs.length !== 1) {
            throw new Error(`${head.value} requires exactly one argument (quoted form)`);
          }
          let targetForm = debugArgs[0];
          // Strip (quote ...) wrapper if present
          if (targetForm.type === 'list' && targetForm.values.length === 2 &&
              targetForm.values[0].type === 'atom' && targetForm.values[0].value === 'quote') {
            targetForm = targetForm.values[1];
          }

          let result;
          if (entry.mode === 'once') {
            // macroexpand-1: one expansion step only
            if (targetForm.type === 'list' && targetForm.values.length > 0 &&
                targetForm.values[0].type === 'atom' && macroEnv.has(targetForm.values[0].value)) {
              const macroName = targetForm.values[0].value;
              const macroArgs = targetForm.values.slice(1);
              result = macroEnv.get(macroName)(...macroArgs);
            } else {
              result = targetForm;
            }
          } else {
            // macroexpand: full expansion
            result = expandAt(targetForm, env, 'Legacy');
          }

          // Print to stderr
          console.error(formatSExpr(result));
          // Erase from output
          return null;
        }

        default:
          throw new Error(`unknown dispatch walk strategy: '${entry.walk}'`);
      }
    }
  }

  const computedMemberParts = !isKernel(form) &&
    (use === "DirectStatement" || isResultOperandUse(use))
    ? directComputedMemberCallParts(head, env)
    : null;
  if (computedMemberParts) {
    const request = {
      outerForm: form,
      args: form.values.slice(1),
      use,
      explicitEscape: computedMemberParts.explicitEscape,
      handled: false,
      result: null,
    };
    expandAt(head, env, "Legacy", request);
    if (!request.handled) {
      throw new Error("computed member call request was not consumed");
    }
    return request.result;
  }

  const memberParts = !isKernel(form) &&
    (use === "DirectStatement" || isResultOperandUse(use))
    ? directMemberCallParts(head)
    : null;
  if (memberParts) return expandDirectMemberCall(form, env, use, memberParts);

  // Default: expand all sub-forms, region-aware. `scopePlan` places each
  // introduced binding over exactly the child positions where it is lexically
  // visible (never an initializer / iterable / scrutinee) and hoists enclosing
  // declarations across siblings — the kernel-level half of resolution.
  return { type: 'list', values: expandChildrenPlan(form, env, use) };
}

/**
 * Pass 1: Scan for macro definitions, compile and register them.
 * Uses iterative fixed-point for order-independent macro compilation.
 * @param {*[]} forms - All top-level forms
 * @returns {*[]} Forms with macro definitions removed
 */
function pass1RegisterMacros(forms) {
  const macroForms = [];
  const otherForms = [];

  for (const form of forms) {
    if (form.type === 'list' && form.values.length >= 3 &&
        form.values[0].type === 'atom' && form.values[0].value === 'macro') {
      macroForms.push(form);
    } else {
      otherForms.push(form);
    }
  }

  if (macroForms.length === 0) return otherForms;

  // Iterative fixed-point: compile macros in dependency order
  let pending = [...macroForms];
  const maxPasses = pending.length;
  let passCount = 0;

  while (pending.length > 0) {
    passCount++;
    if (passCount > maxPasses) {
      const names = pending.map((f) => f.values[1].value).join(', ');
      throw new Error(`circular macro dependency among: ${names}`);
    }

    let progress = false;
    const stillPending = [];

    for (const form of pending) {
      const name = form.values[1];
      const params = form.values[2];
      const body = form.values.slice(3);

      // Check if body references any still-pending macro names
      const pendingNames = new Set(pending.map((f) => f.values[1].value));
      pendingNames.delete(name.value); // Don't count self-reference
      const deps = findSymbolRefs(body, pendingNames);

      if (deps.size === 0) {
        registerMacroForm(name, params, body);
        progress = true;
      } else {
        stillPending.push(form);
      }
    }

    pending = stillPending;
    if (!progress && pending.length > 0) {
      const names = pending.map((f) => f.values[1].value).join(', ');
      throw new Error(`circular macro dependency among: ${names}`);
    }
  }

  return otherForms;
}

/**
 * Find references to a set of symbol names within forms.
 * @param {*[]} forms - Forms to search
 * @param {Set<string>} names - Symbol names to look for
 * @returns {Set<string>} Found references
 */
function findSymbolRefs(forms, names) {
  const found = new Set();

  function walk(node) {
    if (node === null || node === undefined) return;
    if (node.type === 'atom' && names.has(node.value)) {
      found.add(node.value);
    } else if (node.type === 'list') {
      for (const child of node.values) walk(child);
    } else if (node.type === 'cons') {
      walk(node.car);
      walk(node.cdr);
    }
  }

  for (const form of forms) walk(form);
  return found;
}

/**
 * Pass 2: Expand all forms (sugar, quasiquote, macros).
 * @param {*[]} forms - Forms after Pass 1 (macros removed)
 * @returns {*[]} Fully expanded forms
 */
function pass2ExpandAll(forms) {
  const result = [];
  const compilerPrivateAtomsAtStart = compilerPrivateAtomCount;
  // Top-level forms are a sibling SEQUENCE: a `bind`/`import` at top level is in
  // scope for the following top-level forms (mirror of Rust's outermost
  // `resolve_seq`), so a later `(array 987)` after `(bind array 0)` resolves to
  // the binding.
  let env = createExpansionEnvironment(EMPTY_ENV, createSurfaceTypeContext());
  for (const form of forms) {
    const expanded = expandAt(form, env, "Statement");
    if (expanded !== null && expanded !== undefined) {
      if (Array.isArray(expanded)) {
        result.push(...expanded.filter((e) => e !== null && e !== undefined));
      } else {
        result.push(expanded);
      }
    }
    const hoist = form?.type === "list" ? hoistedNames(form) : [];
    if (hoist.length) env = extendEnv(env, hoist);
  }
  if (compilerPrivateAtomCount !== compilerPrivateAtomsAtStart) {
    finalizeCompilerPrivateAtoms(result);
  }
  return result;
}

/**
 * DD-58 strict enforcement: reject **unsanctioned** bare kernel-only
 * declaration forms (`const`/`let`/`var`/`function`/`function*`) at the **top
 * level**. Runs **after** `pass2ExpandAll` (mirroring Rust, which classifies
 * post-expansion) over the fully-expanded top-level forms:
 *
 * - Compiler-produced kernel (surface classifier, the `kernel:` escape) is
 *   **sanctioned** (`isKernel`) and passes — e.g. `bind`→`const` and
 *   `func`→`function` are legal even though their heads are kernel-only.
 * - **Unsanctioned** kernel-only heads are rejected. This catches both
 *   user-written bare decls (e.g. `(var x 1)`) *and* user-macro-emitted ones
 *   (DD-58 A-6 — a macro whose template expands to a top-level `(const …)`),
 *   which Rust already rejects via post-expansion classification.
 *
 * Top-level-only: nested kernel forms inside surface/sanctioned bodies are not
 * inspected. `(kernel:<form> …)` in the source or a macro template is the
 * sanctioned authoring path.
 * @param {Array} forms - fully-expanded top-level forms (post pass2)
 */
function enforceStrictTopLevel(forms) {
  for (const form of forms) {
    if (form && form.type === 'list' && form.values.length > 0) {
      const head = form.values[0];
      if (
        head && head.type === 'atom' &&
        KERNEL_ONLY_FORMS.has(head.value) &&
        !isKernel(form)
      ) {
        throw new Error(kernelOnlyMessage(head.value));
      }
    }
  }
}

/**
 * Expand top-level forms through the shared passes, delegating Pass 0 to the
 * selected host adapter.
 * @param {*[]} forms - Array of reader AST nodes
 * @param {{ filePath?: string, compilationStack?: string[], strict?: boolean }} [context]
 * @param {(forms: *[] , context: { filePath: string | null, compilationStack: string[] }) => *[]}
 *   processImports - Host-specific Pass 0 implementation
 * @returns {*[]} Expanded forms ready for the compiler
 */
export function expandWithMacroImports(forms, context = {}, processImports) {
  // Ensure the surface macros are registered (idempotent). Key on a name the
  // registration actually installs: since DD-37 moved `bind` (and the rest) to
  // the classifier, `registerSurfaceMacros` only registers the `js:*` interop
  // macros — `macroEnv.has('bind')` was permanently false, so the guard never
  // skipped. Key on `js:eq` instead. (arc11/slice02)
  if (!macroEnv.has('js:eq')) {
    registerSurfaceMacros(macroEnv);
  }
  const { filePath = null, compilationStack = [], strict = true } = context;
  // DD-60 D2 (via DD-61 §A2's binding walker): a JS reserved word in any
  // binding position is a compile error — checked on the surface forms before
  // lowering, so `func`/`fn` params are still visible (the JS expander lowers
  // surface forms to kernel during expansion). Covers `export`ed names and the
  // `kernel:` name slot.
  validateReservedNames(forms);
  const afterPass0 = processImports(forms, { filePath, compilationStack });
  const afterPass1 = pass1RegisterMacros(afterPass0);
  const expanded = pass2ExpandAll(afterPass1);
  // DD-58 strict (default-on): reject unsanctioned top-level kernel-only decls
  // in the fully-expanded output — covers user-written bare decls and
  // user-macro-emitted ones (A-6). Explicit `{ strict: false }` opt-out for
  // the coherence harness and kernel-form testing paths only — no silent
  // blanket bypass.
  if (strict) {
    enforceStrictTopLevel(expanded);
  }
  materializeExpandedHostCalls(expanded, {
    toJsIdentifier,
    formHead,
    moduleBindsReflect,
    validateProtectedHost,
  });
  return lowerHostReferences(expanded);
}
