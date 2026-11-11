/**
 * @module
 * Private per-expansion metadata for legacy surface constructor patterns.
 */

/**
 * Create fresh constructor field metadata for one public expansion.
 * @returns {{ constructors: Map<string, string[]> }}
 */
export function createSurfaceTypeContext() {
  return {
    constructors: new Map([
      ["Some", ["value"]],
      ["None", []],
      ["Ok", ["value"]],
      ["Err", ["error"]],
    ]),
  };
}
