// Versioned, whole-unit proof for writes to protected host intrinsics.
// Unknown roots and computed keys deliberately remain unproved.
import { bindingNamesInPattern, bindingsIntroduced } from './binding.js';

const WRITES = new Set([
  'set!', 'set-symbol!', 'assign', '++', '--', 'delete', '=', '+=', '-=', '*=',
  '/=', '%=', '**=', '<<=', '>>=', '>>>=', '&=', '|=', '^=', '&&=', '||=', '??=',
]);
const COMPOUND = new Set([
  '+=', '-=', '*=', '/=', '%=', '**=', '<<=', '>>=', '>>>=', '&=', '|=', '^=',
  '&&=', '||=', '??=',
]);

function pathIs(path, wanted) {
  return path.length === wanted.length && path.every((part, i) => part === wanted[i]);
}

function normalizedPath(node, locals, toJsIdentifier, formHead) {
  if (node?.type === 'atom') {
    const parts = node.value.split(':').map(toJsIdentifier);
    if (locals.has(parts[0])) return null;
    return parts[0] === 'Reflect' || parts[0] === 'globalThis' ? parts : null;
  }
  if (node?.type === 'list' && node.values.length === 3 && formHead(node.values[0]) === 'get') {
    const base = normalizedPath(node.values[1], locals, toJsIdentifier, formHead);
    const key = node.values[2]?.type === 'string' ? node.values[2].value : null;
    return base && key !== null ? [...base, key] : null;
  }
  return null;
}

function addPatternNames(pattern, names, toJsIdentifier) {
  if (pattern?.type === 'atom') {
    if (!['_', 'true', 'false', 'null', 'undefined'].includes(pattern.value)) {
      for (const binding of bindingNamesInPattern(pattern, 'param')) names.add(toJsIdentifier(binding.name));
    }
    return;
  }
  if (pattern?.type !== 'list' || pattern.values[0]?.type !== 'atom') return;
  const [head, ...parts] = pattern.values;
  if (head.value === 'array') {
    for (const part of parts) addPatternNames(part, names, toJsIdentifier);
  } else if (head.value === 'object') {
    for (const part of parts) {
      if (part.type === 'atom') {
        addPatternNames(part, names, toJsIdentifier);
      } else if (part.type === 'list') {
        const kind = part.values[0]?.value;
        if (kind === 'rest') addPatternNames(part.values[1], names, toJsIdentifier);
        else if (kind === 'default') {
          if (part.values[1]?.type === 'atom') names.add(toJsIdentifier(part.values[1].value));
        } else if (kind === 'alias') {
          addPatternNames(part.values[2], names, toJsIdentifier);
        } else addPatternNames(part, names, toJsIdentifier);
      }
    }
  } else if (head.value === 'default') {
    addPatternNames(parts[0], names, toJsIdentifier);
  } else if (head.value === 'rest') {
    addPatternNames(parts[0], names, toJsIdentifier);
  } else {
    // Use the shared binder for any other supported pattern form.
    for (const binding of bindingNamesInPattern(pattern, 'param')) names.add(toJsIdentifier(binding.name));
  }
}

function patternNames(patterns, toJsIdentifier) {
  const names = new Set();
  for (const pattern of patterns) addPatternNames(pattern, names, toJsIdentifier);
  return names;
}

function visitPatternDefaults(pattern, visit) {
  if (pattern?.type !== 'list') return;
  const [head, ...parts] = pattern.values;
  if (head?.type !== 'atom') return;
  if (head.value === 'default') {
    visitPatternDefaults(parts[0], visit);
    if (parts[1]) visit(parts[1]);
    return;
  }
  if (head.value === 'rest') {
    visitPatternDefaults(parts[0], visit);
  } else if (head.value === 'array') {
    for (const part of parts) visitPatternDefaults(part, visit);
  } else if (head.value === 'object') {
    for (const part of parts) {
      if (part?.type !== 'list') continue;
      const kind = part.values[0]?.value;
      if (kind === 'rest') visitPatternDefaults(part.values[1], visit);
      else if (kind === 'default') {
        if (part.values[2]) visit(part.values[2]);
      } else if (kind === 'alias') {
        visitPatternDefaults(part.values[2], visit);
        if (part.values[3]) visit(part.values[3]);
      } else visitPatternDefaults(part, visit);
    }
  }
}

function isVarDeclaration(node, formHead) {
  const head = node?.type === 'list' ? formHead(node.values[0]) : null;
  return head === 'var' || head === 'kernel:var';
}

function isFunctionBoundary(node, formHead) {
  if (node?.type !== 'list') return false;
  return ['function', 'function*', 'fn', 'lambda', 'genfn', 'func', 'genfunc', '=>', 'class', 'class-expr']
    .includes(formHead(node.values[0]));
}

function objectExecutableChildren(property) {
  if (property?.type !== 'list' || property.values.length === 0) return [];
  const [key, value] = property.values;
  if (key?.type === 'atom' && key.value === 'spread') return value ? [value] : [];
  const children = [];
  if (key?.type === 'list') {
    if (key.values[0]?.type === 'atom' && key.values[0].value === 'computed') {
      if (key.values[1]) children.push(key.values[1]);
    } else {
      children.push(key);
    }
  }
  if (value) children.push(value);
  return children;
}

function collectVarNames(forms, names, toJsIdentifier, formHead) {
  for (const form of forms) {
    if (form?.type !== 'list') continue;
    const head = formHead(form.values[0]);
    if (head === null) {
      collectVarNames(form.values, names, toJsIdentifier, formHead);
      continue;
    }
    if (['quote', 'quasiquote', 'syntax-quote'].includes(head) || isFunctionBoundary(form, formHead)) continue;
    if (head === 'object') {
      for (const property of form.values.slice(1)) {
        collectVarNames(objectExecutableChildren(property), names, toJsIdentifier, formHead);
      }
    } else if (isVarDeclaration(form, formHead)) {
      for (const binding of bindingsIntroduced(form)) {
        if (binding.kind === 'bind') names.add(toJsIdentifier(binding.name));
      }
      for (const child of form.values.slice(2)) collectVarNames([child], names, toJsIdentifier, formHead);
    } else {
      collectVarNames(form.values.slice(1), names, toJsIdentifier, formHead);
    }
  }
}

function directScopeNames(forms, toJsIdentifier, formHead, moduleScope = false) {
  const names = new Set();
  for (const form of forms) {
    if (form?.type !== 'list') continue;
    const head = formHead(form.values[0]);
    if (head === null) continue;
    if (!moduleScope && (head === 'var' || head === 'kernel:var')) continue;
    for (const binding of bindingsIntroduced(form)) {
      if (binding.kind === 'bind' || binding.kind === 'import-local') {
        names.add(toJsIdentifier(binding.name));
      }
    }
  }
  if (moduleScope) collectVarNames(forms, names, toJsIdentifier, formHead);
  return names;
}

function functionScope(body, params, inherited, toJsIdentifier, formHead) {
  const names = directScopeNames(body, toJsIdentifier, formHead);
  for (const name of params) names.add(name);
  collectVarNames(body, names, toJsIdentifier, formHead);
  for (const name of inherited) names.add(name);
  return names;
}

function matchPatternNames(pattern, names, toJsIdentifier) {
  if (pattern?.type === 'atom') {
    const name = pattern.value;
    if (!['_', 'true', 'false', 'null', 'undefined'].includes(name) && !/^[A-Z]/.test(name)) {
      names.add(toJsIdentifier(name));
    }
    return;
  }
  if (pattern?.type !== 'list') return;
  const [head, ...parts] = pattern.values;
  if (head?.type !== 'atom') return;
  if (head.value === 'obj') {
    for (let i = 1; i < parts.length; i += 2) matchPatternNames(parts[i], names, toJsIdentifier);
  } else if (/^[A-Z]/.test(head.value)) {
    for (const part of parts) matchPatternNames(part, names, toJsIdentifier);
  }
}

/** Validate one complete expanded/kernel unit before compiler generation. */
export function validateProtectedHost(exprs, { toJsIdentifier, formHead }) {
  const writes = [];
  const visitBody = (forms, scopes, dialect) => {
    const names = directScopeNames(forms, toJsIdentifier, formHead);
    visitMany(forms, [...scopes.slice(0, -1), new Set([...scopes.at(-1), ...names])], dialect, visit);
  };
  const visit = (node, scopes, dialect = 'kernel') => {
    if (node?.type !== 'list') return;
    const [headNode, ...args] = node.values;
    const head = formHead(headNode);
    if (['quote', 'quasiquote', 'syntax-quote'].includes(head)) return;
    const locals = scopes[scopes.length - 1];

    if (head === 'block') {
      visitBody(args, scopes, dialect);
      return;
    }
    if (head === 'object') {
      for (const property of args) {
        for (const child of objectExecutableChildren(property)) visit(child, scopes, dialect);
      }
      return;
    }
    if (head === null) {
      visit(headNode, scopes, dialect);
      for (const arg of args) visit(arg, scopes, dialect);
      return;
    }
    if (head === 'function' || head === 'function*') {
      let paramsIndex;
      let bodyIndex;
      if (head === 'function') {
        paramsIndex = 1;
        bodyIndex = 2;
      } else if (args[0]?.type === 'list') {
        paramsIndex = 0;
        bodyIndex = 1;
      } else {
        paramsIndex = 1;
        bodyIndex = 2;
      }
      const params = args[paramsIndex]?.type === 'list' ? args[paramsIndex].values : [];
      const paramNames = patternNames(params, toJsIdentifier);
      const body = args.slice(bodyIndex);
      const functionName = args[0]?.type === 'atom' && args[0].value !== '' ? toJsIdentifier(args[0].value) : null;
      const defaultLocals = new Set([...locals, ...paramNames]);
      if (functionName) defaultLocals.add(functionName);
      const defaults = [...scopes.slice(0, -1), defaultLocals];
      for (const param of params) visitPatternDefaults(param, (value) => visit(value, defaults, dialect));
      if (functionName) paramNames.add(functionName);
      const nextScope = functionScope(body, paramNames, locals, toJsIdentifier, formHead);
      const next = [...scopes.slice(0, -1), nextScope];
      for (const form of body) visit(form, next, dialect);
      return;
    }
    if (head === 'lambda' || head === 'fn' || head === 'genfn' || head === '=>') {
      const params = args[0]?.type === 'list' ? args[0].values : [];
      const paramNames = patternNames(params, toJsIdentifier);
      const body = args.slice(1);
      const defaults = [...scopes.slice(0, -1), new Set([...locals, ...paramNames])];
      for (const param of params) visitPatternDefaults(param, (value) => visit(value, defaults, dialect));
      const nextScope = functionScope(body, paramNames, locals, toJsIdentifier, formHead);
      const next = [...scopes.slice(0, -1), nextScope];
      for (const form of body) visit(form, next, dialect);
      return;
    }
    if (head === 'func' || head === 'genfunc') {
      // Public source has already been expanded to function/function* forms.
      // If one remains, traverse executable children without inventing a scope.
      for (const arg of args) visit(arg, scopes, dialect);
      return;
    }
    if (head === 'class' || head === 'class-expr') {
      const classNames = new Set(locals);
      const namedClass = head === 'class';
      if (namedClass && args[0]?.type === 'atom') classNames.add(toJsIdentifier(args[0].value));
      const baseIndex = namedClass ? 1 : 0;
      const memberIndex = namedClass ? 2 : 1;
      const next = [...scopes.slice(0, -1), classNames];
      for (const base of args[baseIndex]?.values ?? []) visit(base, next, dialect);
      for (const member of args.slice(memberIndex)) {
        const visitMember = (entry) => {
          if (entry?.type !== 'list' || entry.values.length === 0) return;
          const memberHead = entry.values[0]?.value;
          if (memberHead === 'static' || memberHead === 'async') {
            if (entry.values[1]) visitMember(entry.values[1]);
            return;
          }
          if (memberHead === 'field') {
            if (entry.values[2]) visit(entry.values[2], next, dialect);
            return;
          }
          const accessor = memberHead === 'get' || memberHead === 'set';
          const paramsIndex = accessor ? 2 : 1;
          const bodyIndex = accessor ? 3 : 2;
          const params = entry.values[paramsIndex]?.type === 'list' ? entry.values[paramsIndex].values : [];
          const methodLocals = patternNames(params, toJsIdentifier);
          for (const name of classNames) methodLocals.add(name);
          const body = entry.values.slice(bodyIndex);
          const defaults = [...next.slice(0, -1), new Set([...classNames, ...methodLocals])];
          for (const param of params) visitPatternDefaults(param, (value) => visit(value, defaults, dialect));
          const methodScope = functionScope(body, methodLocals, classNames, toJsIdentifier, formHead);
          const methodScopes = [...next.slice(0, -1), methodScope];
          for (const form of body) visit(form, methodScopes, dialect);
        };
        visitMember(member);
      }
      return;
    }
    if (head === 'switch') {
      if (args[0]) visit(args[0], scopes, dialect);
      const cases = args.slice(1).filter((clause) => clause?.type === 'list');
      const forms = cases.flatMap((clause) => clause.values.slice(1));
      const caseLocals = directScopeNames(forms, toJsIdentifier, formHead);
      const next = [...scopes.slice(0, -1), new Set([...locals, ...caseLocals])];
      for (const clause of cases) {
        const test = clause.values[0];
        if (test?.value !== 'default') visit(test, next, dialect);
        for (const form of clause.values.slice(1)) visit(form, next, dialect);
      }
      return;
    }
    if (head === 'for-of' || head === 'for-in' || head === 'for-await-of') {
      if (args[1]) visit(args[1], scopes, dialect);
      const loopLocals = patternNames(args[0]?.type === 'list' ? [args[0]] : [args[0]], toJsIdentifier);
      const next = [...scopes.slice(0, -1), new Set([...locals, ...loopLocals])];
      if (args[0]) visit(args[0], next, dialect);
      visitBody(args.slice(2), next, dialect);
      return;
    }
    if (head === 'for') {
      const init = args[0];
      const loopLocals = directScopeNames(init ? [init] : [], toJsIdentifier, formHead);
      const next = [...scopes.slice(0, -1), new Set([...locals, ...loopLocals])];
      for (const arg of args.slice(0, 3)) visit(arg, next, dialect);
      visitBody(args.slice(3), next, dialect);
      return;
    }
    if (head === 'while' || head === 'do-while') {
      if (args[0]) visit(args[0], scopes, dialect);
      visitBody(args.slice(1), scopes, dialect);
      return;
    }
    if (head === 'do') {
      visitBody(args, scopes, dialect);
      return;
    }
    if (head === 'try') {
      let bodyEnd = args.length;
      let finalizer = null;
      let handler = null;
      const finalCandidate = args[bodyEnd - 1];
      if (finalCandidate?.type === 'list' && finalCandidate.values[0]?.type === 'atom' &&
          finalCandidate.values[0].value === 'finally') {
        finalizer = finalCandidate.values.slice(1);
        bodyEnd--;
      }
      const catchCandidate = args[bodyEnd - 1];
      if (catchCandidate?.type === 'list' && catchCandidate.values[0]?.type === 'atom' &&
          catchCandidate.values[0].value === 'catch') {
        handler = catchCandidate.values.slice(1);
        bodyEnd--;
      }
      visitBody(args.slice(0, bodyEnd), scopes, dialect);
      if (handler) {
        const catchNames = patternNames(handler[0]?.type === 'list' ? [handler[0]] : [handler[0]], toJsIdentifier);
        const catchScopes = [...scopes.slice(0, -1), new Set([...locals, ...catchNames])];
        visitBody(handler.slice(1), catchScopes, dialect);
      }
      if (finalizer) visitBody(finalizer, scopes, dialect);
      return;
    }
    if (head === 'if-let' || head === 'when-let') {
      const pair = args[0];
      if (pair?.type === 'list') {
        const pattern = pair.values[0];
        const scrutinee = pair.values[1];
        const names = new Set();
        matchPatternNames(pattern, names, toJsIdentifier);
        if (scrutinee) visit(scrutinee, scopes, dialect);
        const thenScope = [...scopes.slice(0, -1), new Set([...locals, ...names])];
        if (head === 'if-let') {
          if (args[1]) visitBody([args[1]], thenScope, dialect);
          if (args[2]) visitBody([args[2]], scopes, dialect);
        } else {
          visitBody(args.slice(1), thenScope, dialect);
        }
      }
      return;
    }
    if (head === 'match') {
      if (args[0]) visit(args[0], scopes, dialect);
      for (const clause of args.slice(1)) {
        if (clause?.type !== 'list') continue;
        const names = new Set();
        matchPatternNames(clause.values[0], names, toJsIdentifier);
        const next = [...scopes.slice(0, -1), new Set([...locals, ...names])];
        visitBody(clause.values.slice(1), next, dialect);
      }
      return;
    }

    const operationDialect = head?.startsWith('kernel:') ? 'kernel' : dialect;
    const operation = head?.startsWith('kernel:') ? head.slice(7) : head;
    const addWrite = (target, span = target?.span) => {
      writes.push({ path: normalizedPath(target, locals, toJsIdentifier, formHead), span });
    };
    const addPatternWrites = (target) => {
      if (target?.type === 'list') {
        const [patternHead, ...parts] = target.values;
        if (['array', 'object'].includes(patternHead?.value)) {
          for (const part of parts) {
            if (patternHead.value === 'object' && part?.type === 'list') {
              const kind = part.values[0]?.value;
              if (kind === 'alias') addPatternWrites(part.values[2]);
              else if (kind === 'default') addWrite(part.values[1]);
              else if (kind === 'rest') addPatternWrites(part.values[1]);
              else for (const child of part.values.slice(1)) addPatternWrites(child);
            } else addPatternWrites(part);
          }
          return;
        }
        if (patternHead?.value === 'rest') { addPatternWrites(parts[0]); return; }
        if (patternHead?.value === 'default') {
          addPatternWrites(parts[0]);
          if (parts[1]) visit(parts[1], scopes, dialect);
          return;
        }
      }
      addWrite(target);
    };

    if (operation === 'set-symbol!' && args[0] && args[1]) {
      const base = normalizedPath(args[0], locals, toJsIdentifier, formHead);
      const key = args[1].type === 'string' ? args[1].value : null;
      writes.push({ path: base && key !== null ? [...base, key] : null, span: args[0].span });
    } else if (WRITES.has(operation) && operation !== 'delete' && operation !== '=' && !COMPOUND.has(operation)) {
      if (args[0]) addPatternWrites(args[0]);
    } else if (COMPOUND.has(operation) && args[0]) {
      addPatternWrites(args[0]);
    } else if (operation === '=' && operationDialect === 'kernel' && args[0]) {
      addPatternWrites(args[0]);
    } else if (operation === 'delete' && operationDialect === 'kernel' && args[0]) {
      addWrite(args[0]);
    }
    // For explicit kernel: forms, only the selected operator changes dialect;
    // all unprefixed children keep their surrounding interpretation.
    for (const arg of args) visit(arg, scopes, dialect);
  };

  const moduleNames = directScopeNames(exprs, toJsIdentifier, formHead, true);
  visitMany(exprs, [moduleNames], 'kernel', visit);

  let invalidatesAliases = false;
  for (const write of writes) {
    if (pathIs(write.path ?? [], ['globalThis']) || pathIs(write.path ?? [], ['globalThis', 'globalThis'])) {
      invalidatesAliases = true;
    }
  }
  for (const write of writes) {
    const path = write.path;
    if (!path) continue;
    const directReflect = pathIs(path, ['Reflect']);
    const directApply = pathIs(path, ['Reflect', 'apply']);
    const aliasReflect = pathIs(path, ['globalThis', 'Reflect']);
    const aliasApply = pathIs(path, ['globalThis', 'Reflect', 'apply']);
    if (directReflect || directApply || (!invalidatesAliases && (aliasReflect || aliasApply))) {
      const slot = directApply || aliasApply ? 'Reflect.apply' : 'Reflect';
      const error = new Error(`host-contract v1: write to protected slot ${slot}`);
      if (write.span) error.span = write.span;
      throw error;
    }
  }
}

function visitMany(forms, scopes, dialect, visit) {
  for (const form of forms) visit(form, scopes, dialect);
}
