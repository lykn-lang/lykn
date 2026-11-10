import { expandWithMacroImports } from './expander-core.js';
import { parseMacroImport } from './macro-import-form.js';

function pass0BrowserImports(forms) {
  const remaining = [];
  for (const form of forms) {
    const parsed = parseMacroImport(form);
    if (!parsed) {
      remaining.push(form);
      continue;
    }
    const { modulePath } = parsed;
    if (modulePath.startsWith('file://')) {
      new URL(modulePath);
      throw new Error(`macro module not found: ${modulePath}`);
    }
    if (/^(jsr|npm|https?):/.test(modulePath)) {
      const cause = new TypeError('import_meta.resolve is not a function');
      throw new Error(`import-macros: could not resolve "${modulePath}": ${cause.message}`);
    }
    if (modulePath.startsWith('/')) {
      throw new Error(
        `import-macros: could not resolve "${modulePath}"\n` +
        `  tier 2 (project.json imports): no matching key\n` +
        `  tier 3 (filesystem): not a relative path\n` +
        `  hint: add an entry to project.json "imports" or use a scheme prefix (jsr:, npm:)`,
      );
    }
    throw new Error('import-macros not available in browser');
  }
  return remaining;
}

export function expand(forms, context = {}) {
  return expandWithMacroImports(forms, context, pass0BrowserImports);
}
