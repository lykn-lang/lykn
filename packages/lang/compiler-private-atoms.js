// Identity metadata for compiler-generated atoms. Keeping this in a tiny
// dependency-free module lets binding analysis distinguish them from source
// names without importing the expander (and creating a cycle).
const compilerPrivateAtoms = new WeakMap();

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
