import { read } from 'lang/reader.js';
import { expand } from 'lang/expander.js';
import { compile } from 'lang/compiler.js';

/**
 * Compile lykn source to JavaScript string.
 *
 * DD-58 strict mode is default-on (surface). Pass `{ strict: false }` for
 * kernel-form source (`.lyk`).
 * @param {string} source - lykn source text
 * @param {{ strict?: boolean }} [options] - `strict` defaults to `true`
 * @returns {string} JavaScript source text
 */
export function compileLykn(source, { strict = true } = {}) {
  return compile(expand(read(source), { strict }));
}

/**
 * Compile and execute lykn source.
 * @param {string} source - lykn source text
 * @param {{ strict?: boolean }} [options] - `strict` defaults to `true`
 * @returns {*} result of eval
 */
export function run(source, { strict = true } = {}) {
  const js = compileLykn(source, { strict });
  return (0, eval)(js);
}

/**
 * Fetch a lykn file, compile, and execute. Extension-aware: a `.lyk`
 * (kernel) file compiles lax; `.lykn` (and anything else) stays strict —
 * mirrors the CLI's extension rule.
 * @param {string} url - URL to fetch
 * @returns {Promise<*>} result of eval
 */
export async function load(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`[lykn] Failed to load ${url}: ${response.status}`);
  }
  const source = await response.text();
  return run(source, { strict: !url.endsWith('.lyk') });
}
