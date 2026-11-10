/**
 * @module
 * Deno expansion façade. The browser compiler selects expander-browser.js at
 * build time and shares the same private expansion core.
 */
import { expandWithMacroImports } from './expander-core.js';
import { pass0ImportMacros } from './macro-imports-deno.js';

export {
  append, array, concat, expandExpr, first, formatSExpr, gensym, isArray,
  isKeyword, isNumber, isString, isSymbol, length, nth, resetGensym,
  resetMacros, rest, sym,
} from './expander-core.js';
export { resetModuleCache } from './macro-imports-deno.js';
export { compileMacroBody, extractParamNames } from './expander-core.js';
export {
  findMacroEntry, macroDirNotFoundMessage, noMacroEntryMessage,
} from './macro-imports-deno.js';

export function expand(forms, context = {}) {
  const resolveSpecifier = (specifier) => import.meta.resolve(specifier);
  return expandWithMacroImports(forms, context, (items, options) =>
    pass0ImportMacros(items, { ...options, resolveSpecifier }));
}
