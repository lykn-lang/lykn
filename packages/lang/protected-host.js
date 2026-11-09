// Versioned, whole-unit proof for writes to protected host intrinsics.
// Unknown roots and computed keys deliberately remain unproved.
import { bindingsIntroduced } from './binding.js';

function normalizedPath(node, locals, toJsIdentifier) {
  if (node?.type === 'atom') {
    const parts = node.value.split(':').map(toJsIdentifier);
    if (locals.has(parts[0])) return null;
    return ['Reflect', 'globalThis'].includes(parts[0]) ? parts : null;
  }
  if (node?.type === 'list' && node.values[0]?.type === 'atom' && node.values[0].value === 'get' && node.values.length === 3) {
    const path = normalizedPath(node.values[1], locals, toJsIdentifier);
    const key = node.values[2]?.type === 'string' ? node.values[2].value : null;
    return path && key !== null ? [...path, key] : null;
  }
  return null;
}

/** Validate one complete expanded unit before compiler generation. */
export function validateProtectedHost(exprs, { toJsIdentifier, formHead }) {
  let invalidatesAliases = false;
  const writes = [];
  const recordTarget = (target, locals, toJsIdentifier, visit) => {
    if (target?.type === 'list' && ['array', 'object', 'rest', 'default'].includes(target.values[0]?.value)) {
      const kind = target.values[0].value;
      if (kind === 'default') {
        if (target.values[1]) recordTarget(target.values[1], locals, toJsIdentifier, visit);
        if (target.values[2]) visit(target.values[2], locals);
      } else {
        for (const child of target.values.slice(1)) {
          if (kind === 'object' && child?.type === 'list') {
            for (const value of child.values.slice(1)) recordTarget(value, locals, toJsIdentifier, visit);
          } else recordTarget(child, locals, toJsIdentifier, visit);
        }
      }
      return;
    }
    writes.push({ path: normalizedPath(target, locals, toJsIdentifier), span: target?.span });
  };
  const visit = (node, locals, dialect = 'surface') => {
    if (node?.type !== 'list') return;
    const [headNode, ...args] = node.values;
    const head = formHead(headNode);
    if (head === 'quote' || head === 'quasiquote' || head === 'syntax-quote') return;
    const childLocals = new Set(locals);
    if (head === 'block') {
      for (const form of args) {
        for (const site of bindingsIntroduced(form)) {
          if (site.kind === 'bind' || site.kind === 'import-local') childLocals.add(toJsIdentifier(site.name));
        }
      }
    }
    if (['lambda', 'fn', 'genfn', 'function'].includes(head)) {
      for (const site of bindingsIntroduced(node)) {
        if (site.kind !== 'label') childLocals.add(toJsIdentifier(site.name));
      }
      for (const arg of args) visit(arg, childLocals, dialect);
      return;
    }
    if (['for-of', 'for-in', 'for-await-of'].includes(head)) {
      if (args[1]) visit(args[1], childLocals, dialect);
      const loopLocals = new Set(childLocals);
      for (const site of bindingsIntroduced(node)) loopLocals.add(toJsIdentifier(site.name));
      for (const arg of args.slice(2)) visit(arg, loopLocals, dialect);
      return;
    }
    if (head === 'catch') {
      const catchLocals = new Set(childLocals);
      for (const site of bindingsIntroduced(node)) catchLocals.add(toJsIdentifier(site.name));
      for (const arg of args.slice(1)) visit(arg, catchLocals, dialect);
      return;
    }
    if (head === 'class') {
      const classLocals = new Set(childLocals);
      if (args[0]?.type === 'atom') classLocals.add(toJsIdentifier(args[0].value));
      for (const member of args.slice(2)) {
        if (member?.type !== 'list') continue;
        const methodLocals = new Set(classLocals);
        for (const param of member.values[1]?.values ?? []) {
          if (param.type === 'atom') methodLocals.add(toJsIdentifier(param.value));
        }
        if (member.values[1]) visit(member.values[1], methodLocals, dialect);
        for (const body of member.values.slice(2)) visit(body, methodLocals, dialect);
      }
      return;
    }
    const opDialect = head?.startsWith('kernel:') ? 'kernel' : dialect;
    const op = head?.startsWith('kernel:') ? head.slice(7) : head;
    if (op === 'set-symbol!' && args[0] && args[1]) {
      const base = normalizedPath(args[0], childLocals, toJsIdentifier);
      const key = args[1]?.type === 'string' ? args[1].value : null;
      writes.push({ path: base && key !== null ? [...base, key] : null, span: args[0].span });
    } else if (['set!', 'assign', '++', '--', '+=', '-=', '*=', '/=', '%='].includes(op)) {
      if (args[0]) recordTarget(args[0], childLocals, toJsIdentifier, (expr, scope) => visit(expr, scope, opDialect));
    } else if (op === '=' && opDialect === 'kernel' && args[0]) {
      recordTarget(args[0], childLocals, toJsIdentifier, (expr, scope) => visit(expr, scope, opDialect));
    }
    for (const arg of args) visit(arg, childLocals, opDialect);
  };
  const moduleLocals = new Set();
  for (const form of exprs) {
    for (const site of bindingsIntroduced(form)) {
      if (site.kind === 'bind' || site.kind === 'import-local') moduleLocals.add(toJsIdentifier(site.name));
    }
  }
  for (const expr of exprs) visit(expr, moduleLocals);
  // Any identifiable write to the globalThis binding invalidates every alias
  // proof in this unit, independent of source order.
  for (const write of writes) {
    if (write.path?.join('.') === 'globalThis' || write.path?.join('.') === 'globalThis.globalThis') invalidatesAliases = true;
  }
  for (const write of writes) {
    if (!write.path) continue;
    const path = write.path.join('.');
    const protectedSlot = path === 'Reflect' || path === 'Reflect.apply'
      || (!invalidatesAliases && (path === 'globalThis.Reflect' || path === 'globalThis.Reflect.apply'));
    if (protectedSlot) {
      const slot = path.endsWith('.apply') ? 'Reflect.apply' : path.endsWith('Reflect') ? 'Reflect' : path;
      const error = new Error(`host-contract v1: write to protected slot ${slot}`);
      if (write.span) error.span = write.span;
      throw error;
    }
  }
}
