// Private lazy backend for compiler-owned, already-materialized host calls.
// This module is intentionally imported by its internal path only.

const REFLECT_APPLY_ID = Symbol('Reflect.apply');
const REQUEST_BRAND = Symbol('lykn host invocation request');
const PROVISIONAL = new WeakMap();
let active = null;

export function newHostInvocationId() {
  return REFLECT_APPLY_ID;
}

export function hostInvocationRequest(id, node) {
  if (id !== REFLECT_APPLY_ID || !node || typeof node !== 'object') {
    throw new TypeError('invalid private host invocation request');
  }
  return Object.freeze({ [REQUEST_BRAND]: true, id, node });
}

export function compileWithHostInvocations(exprs, compileFn, requests) {
  if (requests.length === 0) return compileFn(exprs);
  if (active !== null) throw new Error('nested host invocation compilation');
  const byNode = new WeakMap();
  const ids = new Set();
  const nodes = new Set();
  for (const request of requests) {
    if (!request || request[REQUEST_BRAND] !== true || request.id !== REFLECT_APPLY_ID) {
      throw new TypeError('invalid private host invocation request');
    }
    if (ids.has(request.id) || nodes.has(request.node)) {
      throw new Error('duplicate private host invocation request');
    }
    if (request.node.type !== 'list' || request.node.values.length !== 3) {
      throw new Error('host invocation request must anchor an exact three-part call');
    }
    ids.add(request.id);
    nodes.add(request.node);
    byNode.set(request.node, request);
  }
  const inputNodes = collectInputNodes(exprs);
  for (const node of nodes) {
    if (!inputNodes.has(node)) throw new Error('orphaned host invocation request');
  }
  active = { exprs, byNode, requests: new Set(requests), consumed: new Set() };
  try {
    const output = compileFn(exprs);
    if (active.consumed.size !== active.requests.size) {
      throw new Error('orphaned or unconsumed host invocation request');
    }
    return output;
  } finally {
    active = null;
  }
}

export function requestedHostCall(node, compileExpr) {
  const request = active?.byNode.get(node);
  if (!request) return null;
  if (active.consumed.has(request)) throw new Error('host invocation request consumed twice');
  active.consumed.add(request);
  const call = {
    type: 'CallExpression',
    callee: { type: 'Identifier', name: '__lyknHostInvocationPending__' },
    arguments: node.values.map(value => compileExpr(value, 'expression')),
    optional: false,
  };
  PROVISIONAL.set(call, request);
  return call;
}

export function finalizeHostInvocations(program, exprs) {
  if (active === null) return program;
  if (active.exprs !== exprs) throw new Error('host invocation plan belongs to a different unit');
  if (active.consumed.size !== active.requests.size) {
    throw new Error('orphaned or unconsumed host invocation request');
  }
  const names = new Set();
  const calls = [];
  visitAst(program, node => {
    if (node.type === 'Identifier') names.add(node.name);
    if (node.type === 'CallExpression' && PROVISIONAL.has(node)) calls.push(node);
  });
  if (hasModuleReflectBinding(program)) {
    throw new Error('lazy protected invocation is unavailable with a module Reflect binding');
  }
  if (calls.length !== active.requests.size) {
    throw new Error('orphaned or duplicate provisional host invocation call');
  }
  let index = 0;
  while (names.has(`lyknHostReflectApply${index}`)) index++;
  const helperName = `lyknHostReflectApply${index}`;
  for (const call of calls) {
    const request = PROVISIONAL.get(call);
    if (!active.requests.has(request)) throw new Error('unknown provisional host invocation');
    call.callee = { type: 'Identifier', name: helperName };
    PROVISIONAL.delete(call);
  }
  const helper = {
    type: 'FunctionDeclaration',
    id: { type: 'Identifier', name: helperName },
    params: [
      { type: 'Identifier', name: 'fn' },
      { type: 'Identifier', name: 'receiver' },
      { type: 'Identifier', name: 'argv' },
    ],
    body: {
      type: 'BlockStatement',
      body: [{
        type: 'ReturnStatement',
        argument: {
          type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            object: { type: 'Identifier', name: 'Reflect' },
            property: { type: 'Identifier', name: 'apply' },
            computed: false,
            optional: false,
          },
          arguments: [
            { type: 'Identifier', name: 'fn' },
            { type: 'Identifier', name: 'receiver' },
            { type: 'Identifier', name: 'argv' },
          ],
          optional: false,
        },
      }],
    },
    generator: false,
    async: false,
  };
  let directiveEnd = 0;
  while (directiveEnd < program.body.length &&
         program.body[directiveEnd].type === 'ExpressionStatement' &&
         program.body[directiveEnd].expression.type === 'Literal' &&
         typeof program.body[directiveEnd].expression.value === 'string') {
    directiveEnd++;
  }
  program.body.splice(directiveEnd, 0, helper);
  return program;
}

function visitAst(root, visit) {
  const seen = new Set();
  function walk(value) {
    if (!value || typeof value !== 'object' || seen.has(value)) return;
    seen.add(value);
    if (Array.isArray(value)) {
      for (const item of value) walk(item);
      return;
    }
    if (typeof value.type === 'string') visit(value);
    for (const [key, child] of Object.entries(value)) {
      if (key !== 'loc' && key !== 'start' && key !== 'end') walk(child);
    }
  }
  walk(root);
}

function patternNames(pattern, names) {
  if (!pattern) return;
  if (pattern.type === 'Identifier') names.add(pattern.name);
  else if (pattern.type === 'RestElement') patternNames(pattern.argument, names);
  else if (pattern.type === 'AssignmentPattern') patternNames(pattern.left, names);
  else if (pattern.type === 'ArrayPattern') pattern.elements.forEach(item => patternNames(item, names));
  else if (pattern.type === 'ObjectPattern') {
    for (const property of pattern.properties) {
      if (property.type === 'RestElement') patternNames(property.argument, names);
      else patternNames(property.value, names);
    }
  }
}

function hasModuleReflectBinding(program) {
  const names = new Set();
  function collectVar(node) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach(collectVar);
    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' ||
        node.type === 'ArrowFunctionExpression' || node.type === 'ClassDeclaration' ||
        node.type === 'ClassExpression') return;
    if (node.type === 'VariableDeclaration' && node.kind === 'var') {
      node.declarations.forEach(decl => patternNames(decl.id, names));
    }
    for (const [key, child] of Object.entries(node)) {
      if (key !== 'loc' && key !== 'start' && key !== 'end') collectVar(child);
    }
  }
  for (const statement of program.body) {
    let declaration = statement;
    if (declaration.type === 'ExportNamedDeclaration' ||
        declaration.type === 'ExportDefaultDeclaration') declaration = declaration.declaration;
    if (!declaration) continue;
    if (declaration.type === 'ImportDeclaration') {
      declaration.specifiers.forEach(specifier => patternNames(specifier.local, names));
    } else if (declaration.type === 'FunctionDeclaration' ||
               declaration.type === 'ClassDeclaration') {
      patternNames(declaration.id, names);
    } else if (declaration.type === 'VariableDeclaration' && declaration.kind !== 'var') {
      declaration.declarations.forEach(decl => patternNames(decl.id, names));
    }
    collectVar(declaration);
  }
  return names.has('Reflect');
}

function collectInputNodes(root) {
  const nodes = new Set();
  const seen = new Set();
  function walk(value) {
    if (!value || typeof value !== 'object' || seen.has(value)) return;
    seen.add(value);
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (typeof value.type === 'string') nodes.add(value);
    for (const child of Object.values(value)) walk(child);
  }
  walk(root);
  return nodes;
}
