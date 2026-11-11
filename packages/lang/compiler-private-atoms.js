// Identity metadata for compiler-generated atoms. Keeping this in a tiny
// dependency-free module lets binding analysis distinguish them from source
// names without importing the expander (and creating a cycle).
const compilerPrivateAtoms = new WeakMap();
const compilerHostReferences = new WeakMap();

const HOST_REFERENCES = new Set([
  'Symbol', 'SymbolFor', 'ObjectFreeze', 'ObjectDefineProperties',
  'NumberIsNaN', 'ArrayIsArray', 'Promise', 'TypeError', 'Error',
]);

export function markHostReference(atom, reference) {
  if (!HOST_REFERENCES.has(reference)) throw new Error(`unknown compiler-owned host reference: ${reference}`);
  compilerHostReferences.set(atom, reference);
  return atom;
}

export function hostReferenceOf(atom) {
  return compilerHostReferences.get(atom);
}

export function clearHostReference(atom) {
  compilerHostReferences.delete(atom);
}

export function markCompilerPrivateAtom(atom, identity, prefix) {
  compilerPrivateAtoms.set(atom, { identity, prefix });
  return atom;
}

export function compilerPrivateAtomInfo(atom) {
  return compilerPrivateAtoms.get(atom);
}

export function isCompilerPrivateAtom(atom) {
  return compilerPrivateAtoms.has(atom);
}

export function clearCompilerPrivateAtom(atom) {
  compilerPrivateAtoms.delete(atom);
}
