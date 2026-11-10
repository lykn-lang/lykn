/**
 * Parse the shared, structural part of an import-macros form.
 * @param {*} form
 * @returns {{ modulePath: string, bindings: *[] } | null}
 */
export function parseMacroImport(form) {
  if (form.type !== 'list' || form.values.length < 1 ||
      form.values[0].type !== 'atom' || form.values[0].value !== 'import-macros') {
    return null;
  }
  const args = form.values.slice(1);
  if (args.length < 2) {
    throw new Error('import-macros requires a path and binding list');
  }
  if (args[0].type !== 'string') {
    throw new Error('import-macros: first argument must be a module path string');
  }
  if (args[1].type !== 'list') {
    throw new Error('import-macros requires a binding list');
  }
  return { modulePath: args[0].value, bindings: args[1].values };
}
