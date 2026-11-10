import { markKernel } from './kernel-mark.js';
import { INLINE_APPLY_MODULE, REFLECT_APPLY_ID, validateAnchor } from './host-invocation-shared.js';

const EXPANDED_REQUESTS = new WeakMap();

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
