// Private lazy backend for compiler-owned, already-materialized host calls.
// This module is intentionally imported by its internal path only.

import { markKernel } from './kernel-mark.js';

const REFLECT_APPLY_ID = Symbol('Reflect.apply');
const INLINE_APPLY_MODULE = 'data:text/javascript,export%20function%20apply(fn%2Creceiver%2Cargv)%7Breturn%20Reflect.apply(fn%2Creceiver%2Cargv)%7D';
const REQUEST_BRAND = Symbol('lykn host invocation request');
const PROVISIONAL = new WeakMap();
const EXPANDED_REQUESTS = new WeakMap();
let active = null;

export function markExpandedHostCall(node) {
  if (!node || node.type !== 'list' || EXPANDED_REQUESTS.has(node)) {
    throw new TypeError('invalid private expanded host invocation request');
  }
  EXPANDED_REQUESTS.set(node, REFLECT_APPLY_ID);
  return node;
}

export function materializeExpandedHostCalls(forms, {
  toJsIdentifier,
  formHead,
  moduleBindsReflect,
  validateProtectedHost,
}) {
  const nodes = [];
  const seen = new Set();
  const visit = node => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach(visit);
    if (node.type === 'list' && EXPANDED_REQUESTS.has(node)) {
      if (seen.has(node)) throw new Error('duplicate expanded host invocation request');
      seen.add(node);
      nodes.push(node);
    }
    if (node.type === 'list') node.values.forEach(visit);
    else if (node.type === 'cons') { visit(node.car); visit(node.cdr); }
  };
  forms.forEach(visit);
  if (nodes.length === 0) return forms;

  const names = new Set();
  const collect = node => {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'atom') {
      for (const segment of node.value.split(':')) names.add(toJsIdentifier(segment));
    } else if (node.type === 'list') node.values.forEach(collect);
    else if (node.type === 'cons') { collect(node.car); collect(node.cdr); }
  };
  forms.forEach(collect);
  for (const node of nodes) validateAnchor(node);
  validateProtectedHost(forms, { toJsIdentifier, formHead });
  let index = 0;
  while (names.has(`lyknHostReflectApply${index}`)) index++;
  const helper = `lyknHostReflectApply${index}`;
  for (const node of nodes) {
    const id = EXPANDED_REQUESTS.get(node);
    if (id !== REFLECT_APPLY_ID) throw new Error('unsupported protected invocation ID');
    node.values = [{ type: 'atom', value: helper }, ...node.values];
    EXPANDED_REQUESTS.delete(node);
  }

  const support = moduleBindsReflect(forms, { toJsIdentifier, formHead })
    ? markKernel({
      type: 'list',
      values: [
        { type: 'atom', value: 'import' },
        { type: 'string', value: INLINE_APPLY_MODULE },
        { type: 'list', values: [{ type: 'list', values: [
          { type: 'atom', value: 'alias' },
          { type: 'atom', value: 'apply' },
          { type: 'atom', value: helper },
        ] }] },
      ],
    })
    : markKernel({
      type: 'list',
      values: [
        { type: 'atom', value: 'function' },
        { type: 'atom', value: helper },
        { type: 'list', values: ['fn', 'receiver', 'argv'].map(value => ({ type: 'atom', value })) },
        { type: 'list', values: [
          { type: 'atom', value: 'return' },
          { type: 'list', values: [
            { type: 'atom', value: 'Reflect:apply' },
            { type: 'atom', value: 'fn' },
            { type: 'atom', value: 'receiver' },
            { type: 'atom', value: 'argv' },
          ] },
        ] },
      ],
    });
  let directiveEnd = 0;
  while (directiveEnd < forms.length && forms[directiveEnd]?.type === 'string') directiveEnd++;
  forms.splice(directiveEnd, 0, support);
  return forms;
}

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
  const nodes = new Set();
  for (const request of requests) {
    if (!request || request[REQUEST_BRAND] !== true || request.id !== REFLECT_APPLY_ID) {
      throw new TypeError('invalid private host invocation request');
    }
    if (nodes.has(request.node)) {
      throw new Error('duplicate private host invocation request');
    }
    validateAnchor(request.node);
    nodes.add(request.node);
    byNode.set(request.node, request);
  }
  const inputNodes = collectInputNodes(exprs);
  for (const node of nodes) {
    if (!inputNodes.has(node)) throw new Error('orphaned host invocation request');
  }
  active = { exprs, byNode, requests: new Set(requests), consumed: new Set(), finalized: false };
  try {
    const output = compileFn(exprs);
    if (!active.finalized || active.consumed.size !== active.requests.size) {
      throw new Error('host invocation plan returned without complete finalization');
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
  if (active.finalized) throw new Error('host invocation plan finalized more than once');
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
  const needsInlineImport = hasModuleReflectBinding(program);
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
  const support = needsInlineImport
    ? {
      type: 'ImportDeclaration',
      specifiers: [{
        type: 'ImportSpecifier',
        imported: { type: 'Identifier', name: 'apply' },
        local: { type: 'Identifier', name: helperName },
      }],
      source: { type: 'Literal', value: INLINE_APPLY_MODULE },
    }
    : {
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
  program.body.splice(directiveEnd, 0, support);
  active.finalized = true;
  return program;
}

function validateAnchor(node) {
  if (node.type !== 'list' || node.values.length !== 3) {
    throw new Error('host invocation request must anchor an exact three-part call');
  }
  for (const [index, operand] of node.values.entries()) {
    if (operand.type !== 'atom') {
      throw new Error('host invocation operands must be stable atom references');
    }
    const name = operand.value;
    if (name.length === 0 || name.includes(':') ||
        ['this', 'super', 'true', 'false', 'null'].includes(name) ||
        (name === 'undefined' && index !== 1)) {
      throw new Error('host invocation operands must be stable atom references');
    }
  }
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
