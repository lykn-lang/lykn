// lykn - s-expression syntax for JavaScript
// https://github.com/lykn

export { read } from './reader.js';
export { expand, expandExpr } from './expander.js';
export { compile, compileExpr } from './compiler.js';

import { read } from './reader.js';
import { expand } from './expander.js';
import { compile } from './compiler.js';

/**
 * Compile lykn source code to JavaScript.
 *
 * DD-58 strict mode is default-on: bare kernel-only declaration forms
 * (`const`/`let`/`var`/`function`/`function*`) at the top level throw;
 * reach them via the `(kernel:<form> …)` escape. Pass `{ strict: false }`
 * for the coherence harness / kernel-form testing only.
 * @param {string} source - lykn source text
 * @param {{ strict?: boolean }} [options] - `strict` defaults to `true`
 * @returns {string} - JavaScript source text
 */
export function lykn(source, { strict = true } = {}) {
  return compile(expand(read(source), { strict }));
}
