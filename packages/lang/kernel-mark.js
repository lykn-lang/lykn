// Sanctioned-kernel registry — DD-37 step 4 (replaces the transitional
// per-node kernel marker).
//
// A form is "sanctioned kernel" when the compiler itself produced it as kernel
// output and it must therefore be neither re-classified/re-expanded nor
// rejected by DD-58 strict enforcement. Four producers sanction their output:
//   1. the surface-form classifier (bind → const, func → function, …),
//   2. the `(kernel:<form> …)` escape,
//   3. Obj-literal key/value pairs (so a pair is not read as a macro call),
//   4. (formerly `kernelArray` — removed as dead in this slice).
//
// The signal is a module-level `WeakSet` keyed on the AST node, not a mutated
// marker property on the node: no node-shape change, GC-friendly, and —
// crucially for DD-58 A-6 — it lets us tell *sanctioned* kernel (marked) from
// *user-macro-emitted* kernel (unmarked, and therefore checkable). Shared
// across modules via ESM single-instance semantics.

const sanctioned = new WeakSet();

/**
 * Mark an AST node as sanctioned kernel output. Returns the node for chaining.
 * @template T
 * @param {T} node
 * @returns {T}
 */
export function markKernel(node) {
  if (node !== null && typeof node === "object") {
    sanctioned.add(node);
  }
  return node;
}

/**
 * True if the node was produced as sanctioned kernel output.
 * @param {*} node
 * @returns {boolean}
 */
export function isKernel(node) {
  return node !== null && typeof node === "object" && sanctioned.has(node);
}
