import { resolve as _resolve, dirname as _dirname } from "node:path";
import { read } from './reader.js';
import {
  append, array, first, formatSExpr,
  gensym, isArray, isKeyword, isNumber, isString, isSymbol, length,
  macroEnv, nth, registerMacroForm, rest, sym,
} from './expander-core.js';
import { parseMacroImport } from './macro-import-form.js';

const moduleCache = new Map();

export function resetModuleCache() {
  moduleCache.clear();
}

/**
 * Find the project.json import map by walking up from a starting directory.
 * @param {string | null} filePath - Path of the importing file
 * @returns {{ projectRoot: string, imports: Object } | null}
 */
function findProjectImports(filePath) {
  const startDir = filePath ? _dirname(filePath) : (typeof Deno !== 'undefined' ? Deno.cwd() : '.');
  let dir = startDir;
  const root = _resolve('/');

  while (dir !== root) {
    const configPath = _resolve(dir, 'project.json');
    let content;
    try { content = Deno.readTextFileSync(configPath); } catch { dir = _dirname(dir); continue; }
    let config;
    try { config = JSON.parse(content); } catch { dir = _dirname(dir); continue; }
    return { projectRoot: dir, imports: config.imports || {} };
  }
  return null;
}

/**
 * Diagnostic for a macro-module package DIRECTORY that does not exist.
 * MUST stay byte-identical with the Rust `macro_dir_not_found_message`
 * (pass0.rs) — a parity test fails if they drift
 * (01-macro-entry-diagnostics M-4).
 * @param {string} pkgDir
 * @param {{specifier: string, viaOverlay: boolean} | null} origin
 * @returns {string}
 */
function macroDirNotFoundMessage(pkgDir, origin) {
  let m = `import-macros: package directory not found: ${pkgDir}`;
  if (origin) {
    m += `\n  specifier: ${origin.specifier}`;
    if (origin.viaOverlay) {
      m += `\n  via: lykn link overlay (project.local.json)`;
      m += `\n  hint: run 'lykn dist' in the linked project, or 'lykn unlink ${origin.specifier}'`;
    }
  }
  return m;
}

/**
 * Diagnostic for a package directory that EXISTS but has no macro entry.
 * MUST stay byte-identical with the Rust `no_macro_entry_message` (pass0.rs).
 * @param {string} pkgDir
 * @returns {string}
 */
function noMacroEntryMessage(pkgDir) {
  return (
    `import-macros: no macro entry found in ${pkgDir}\n` +
    `  checked: lykn.macroEntry, mod.lykn, mod.lyk, macros.lykn, macros.lyk, index.lykn, index.lyk\n` +
    `  hint: add lykn.macroEntry to the package's deno.json`
  );
}

/**
 * Find the macro entry file in a package directory.
 *
 * A MISSING pkgDir yields a distinct "package directory not found" error (with
 * overlay provenance when `origin` says so) — never the `lykn.macroEntry` hint,
 * which would tell the user to edit a file inside a directory that isn't there
 * (01-macro-entry-diagnostics M-1/M-3). When the directory exists: lykn.macroEntry
 * field, then mod.lykn/…/index.lyk, then a .lykn-valued exports.
 * @param {string} pkgDir - Absolute path to the package directory
 * @param {{specifier: string, viaOverlay: boolean} | null} [origin]
 * @returns {string} Absolute path to the macro entry file
 */
function findMacroEntry(pkgDir, origin = null) {
  // Missing directory: the candidate walk below would fail every probe *for
  // that reason* and mis-hint "add lykn.macroEntry". Branch first.
  let dirStat;
  try { dirStat = Deno.statSync(pkgDir); } catch { dirStat = null; }
  if (!dirStat || !dirStat.isDirectory) {
    throw new Error(macroDirNotFoundMessage(pkgDir, origin));
  }

  const denoJsonPath = _resolve(pkgDir, 'deno.json');
  try {
    const content = Deno.readTextFileSync(denoJsonPath);
    const config = JSON.parse(content);
    if (config.lykn?.macroEntry) {
      const entryPath = _resolve(pkgDir, config.lykn.macroEntry);
      try { Deno.statSync(entryPath); return entryPath; } catch { /* file not found */ }
    }
    // Fallback chain
    for (const candidate of ['mod.lykn', 'mod.lyk', 'macros.lykn', 'macros.lyk', 'index.lykn', 'index.lyk']) {
      const p = _resolve(pkgDir, candidate);
      try { Deno.statSync(p); return p; } catch { /* file not found */ }
    }
    // Check exports
    if (typeof config.exports === 'string' && (config.exports.endsWith('.lykn') || config.exports.endsWith('.lyk'))) {
      const p = _resolve(pkgDir, config.exports);
      try { Deno.statSync(p); return p; } catch { /* file not found */ }
    }
  } catch { /* no deno.json */ }

  throw new Error(noMacroEntryMessage(pkgDir));
}

// Exported for the cross-compiler diagnostics tests (01-macro-entry-diagnostics).
export { findMacroEntry, macroDirNotFoundMessage, noMacroEntryMessage };

function _getMacroCacheDir() {
  const xdg = typeof Deno !== 'undefined' ? Deno.env.get('XDG_CACHE_HOME') : null;
  const home = typeof Deno !== 'undefined' ? Deno.env.get('HOME') : null;
  const base = xdg || (home ? `${home}/.cache` : '/tmp');
  return `${base}/lykn/macros`;
}

function _specifierCacheKey(specifier) {
  let key = specifier.replace(/[^a-zA-Z0-9._@-]/g, '_');
  if (key.length > 200) key = key.slice(0, 200);
  return key;
}

function resolveRegistryMacroSource(specifier) {
  const cacheDir = _getMacroCacheDir();
  const cacheKey = _specifierCacheKey(specifier);
  const pkgCacheDir = `${cacheDir}/${cacheKey}`;

  // Check if package directory is already cached (has a .lykn entry)
  try {
    const entry = findMacroEntry(pkgCacheDir);
    return entry;
  } catch { /* not cached yet */ }

  // Run deno info --json to get the redirect/resolution
  let infoJson;
  try {
    const proc = new Deno.Command('deno', {
      args: ['info', '--json', specifier],
      stdout: 'piped',
      stderr: 'piped',
    }).outputSync();
    if (!proc.success) {
      const stderr = new TextDecoder().decode(proc.stderr);
      throw new Error(
        `cannot resolve macro module '${specifier}': network unreachable or registry error.\n` +
        `  Try \`deno cache ${specifier}\` to prefetch, or check connectivity.\n` +
        `  Detail: ${stderr.trim()}`
      );
    }
    infoJson = JSON.parse(new TextDecoder().decode(proc.stdout));
  } catch (e) {
    if (e.message?.startsWith('cannot resolve')) throw e;
    throw new Error(
      `cannot resolve macro module '${specifier}': deno info failed.\n` +
      `  Try \`deno cache ${specifier}\` to prefetch, or check connectivity.`
    );
  }

  try { Deno.mkdirSync(pkgCacheDir, { recursive: true }); } catch { /* exists */ }

  // JSR path: use redirects to get HTTPS URL, fetch all package files
  if (specifier.startsWith('jsr:')) {
    const redirectUrl = infoJson.redirects?.[specifier];
    if (!redirectUrl) {
      throw new Error(`macro module '${specifier}' not found on JSR. Check the specifier name and try again.`);
    }
    const baseUrl = redirectUrl.replace(/\/[^/]+$/, '/');

    // Fetch package metadata to get file list
    const metaUrl = baseUrl.replace(/\/$/, '_meta.json');
    const metaText = await_fetch(metaUrl);
    let filesToFetch = ['mod.lykn', 'macros.js', 'deno.json'];
    if (metaText) {
      try {
        const meta = JSON.parse(metaText);
        if (meta.manifest) {
          filesToFetch = Object.keys(meta.manifest)
            .map(f => f.replace(/^\//, ''))
            .filter(f => f.endsWith('.lykn') || f.endsWith('.lyk') || f.endsWith('.js') || f === 'deno.json');
        }
      } catch { /* use defaults */ }
    }

    // Fetch each relevant file into the cache directory
    for (const file of filesToFetch) {
      const content = await_fetch(`${baseUrl}${file}`);
      if (content !== null) {
        Deno.writeTextFileSync(`${pkgCacheDir}/${file}`, content);
      }
    }

    try {
      return findMacroEntry(pkgCacheDir);
    } catch {
      throw new Error(
        `macro module '${specifier}' has no \`lykn.macroEntry\` field and no \`mod.lykn\` fallback.\n` +
        `  Cannot expand macros. Verify the package was published with \`lykn build --dist\`.`
      );
    }
  }

  // npm path: use deno info's local cache path (filesystem-based)
  if (specifier.startsWith('npm:')) {
    const modules = infoJson.modules || [];
    let pkgDir = null;
    for (const mod of modules) {
      if (mod.local) {
        let dir = mod.local;
        if (/\.[a-z]+$/i.test(dir)) dir = _dirname(dir);
        pkgDir = dir;
        break;
      }
    }
    if (!pkgDir) {
      throw new Error(
        `macro module '${specifier}' does not appear to be a Lykn macro module (no .lykn files found).\n` +
        `  Verify the package was published with \`lykn build --dist\`.`
      );
    }
    try {
      return findMacroEntry(pkgDir);
    } catch {
      throw new Error(
        `macro module '${specifier}' does not appear to be a Lykn macro module (no .lykn files found).\n` +
        `  Verify the package was published with \`lykn build --dist\`.`
      );
    }
  }

  // https: specifiers — fetch the file directly
  const source = await_fetch(specifier);
  if (!source) {
    throw new Error(`cannot fetch macro module '${specifier}': HTTP error.`);
  }
  const singleFile = `${pkgCacheDir}/fetched.lykn`;
  Deno.writeTextFileSync(singleFile, source);
  return singleFile;
}

function await_fetch(url) {
  try {
    const proc = new Deno.Command('deno', {
      args: ['eval', '--ext=js', `const r = await fetch("${url}"); if (!r.ok) { Deno.exit(1); } const t = await r.text(); Deno.stdout.write(new TextEncoder().encode(t));`],
      stdout: 'piped',
      stderr: 'piped',
    }).outputSync();
    if (!proc.success) return null;
    return new TextDecoder().decode(proc.stdout);
  } catch {
    return null;
  }
}

/**
 * Three-tier specifier resolution for import-macros.
 * Tier 1: scheme-prefixed (jsr:, npm:, https:, file:) → Deno's resolver
 * Tier 2: bare name → import-map lookup from project.json
 * Tier 3: filesystem path (relative/absolute)
 * @param {string} specifier
 * @param {string | null} filePath
 * @returns {string} Resolved absolute path
 */
function resolveImportMacrosSpecifier(specifier, filePath, resolveSpecifier) {
  // Tier 1: Scheme-prefixed — use Deno's resolver
  if (/^(jsr|npm|https?):/.test(specifier)) {
    try {
      const resolved = resolveSpecifier(specifier);
      if (resolved.startsWith('file://')) {
        let fsPath = new URL(resolved).pathname;
        if (/\.[a-z]+$/i.test(fsPath)) {
          fsPath = _dirname(fsPath);
        }
        // A scheme specifier that resolves to a LOCAL file:// path was redirected
        // by the import map — the `lykn link` overlay (a published package would
        // resolve to a jsr:/npm: URL, handled below). Carry that provenance so a
        // missing-dir failure names the specifier + both exits (M-3).
        return findMacroEntry(fsPath, { specifier, viaOverlay: true });
      }
      // Non-file URL (jsr:, npm:, https:) — resolve via deno info + fetch
      return resolveRegistryMacroSource(specifier);
    } catch (e) {
      if (e.message?.startsWith('import-macros:') || e.message?.startsWith('cannot ') || e.message?.startsWith('macro module')) throw e;
      throw new Error(`import-macros: could not resolve "${specifier}": ${e.message}`);
    }
  }

  // file: scheme
  if (specifier.startsWith('file://')) {
    const fsPath = new URL(specifier).pathname;
    return fsPath;
  }

  // Tier 2: Import-map lookup (bare name or prefix match)
  if (!specifier.startsWith('./') && !specifier.startsWith('../') && !specifier.startsWith('/')) {
    const project = findProjectImports(filePath);
    if (project) {
      const { projectRoot, imports } = project;

      // Exact match
      if (imports[specifier]) {
        const target = imports[specifier];
        if (/^(jsr|npm|https?):/.test(target)) {
          return resolveImportMacrosSpecifier(target, filePath, resolveSpecifier);
        }
        if (target.startsWith('./') || target.startsWith('../')) {
          const resolved = _resolve(projectRoot, target);
          try {
            const stat = Deno.statSync(resolved);
            if (stat.isDirectory) return findMacroEntry(resolved);
            return resolved;
          } catch {
            throw new Error(`import-macros: import map target "${target}" for "${specifier}" not found`);
          }
        }
      }

      // Prefix match: find longest key ending in '/' that matches
      let bestKey = null;
      for (const key of Object.keys(imports)) {
        if (key.endsWith('/') && specifier.startsWith(key)) {
          if (!bestKey || key.length > bestKey.length) bestKey = key;
        }
      }
      if (bestKey) {
        const suffix = specifier.slice(bestKey.length);
        const target = imports[bestKey];
        if (target.startsWith('./') || target.startsWith('../')) {
          return _resolve(projectRoot, target, suffix);
        }
        return resolveImportMacrosSpecifier(`${target}${suffix}`, filePath, resolveSpecifier);
      }

      // Workspace package fallback: try packages/<name>/mod.lykn or mod.lyk
      for (const entry of ['mod.lykn', 'mod.lyk']) {
        const modPath = _resolve(projectRoot, 'packages', specifier, entry);
        try { Deno.statSync(modPath); return modPath; } catch { /* not found */ }
      }
    }
  }

  // Tier 3: Filesystem path (current behavior)
  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    const baseDir = filePath ? _dirname(filePath) : (typeof Deno !== 'undefined' ? Deno.cwd() : '.');
    const resolved = _resolve(baseDir, specifier);
    try {
      const stat = Deno.statSync(resolved);
      if (stat.isDirectory) return findMacroEntry(resolved);
    } catch { /* not found as directory, fall through */ }
    if (!specifier.endsWith('.lykn') && !specifier.endsWith('.lyk')) {
      throw new Error(`import-macros path must end with .lykn or .lyk: "${specifier}"`);
    }
    return resolved;
  }

  throw new Error(
    `import-macros: could not resolve "${specifier}"\n` +
    `  tier 2 (project.json imports): no matching key\n` +
    `  tier 3 (filesystem): not a relative path\n` +
    `  hint: add an entry to project.json "imports" or use a scheme prefix (jsr:, npm:)`
  );
}

/**
 * Pass 0: Process import-macros forms. Load, compile, and register
 * macros from external .lykn modules.
 * @param {*[]} forms - All top-level forms
 * @param {string | null} filePath - Path of the importing file (for resolution)
 * @param {string[]} compilationStack - Stack for circular dep detection
 * @returns {*[]} Forms with import-macros removed
 */
export function pass0ImportMacros(forms, { filePath, compilationStack, resolveSpecifier }) {
  const remaining = [];
  const importedPaths = new Set();

  for (const form of forms) {
    const parsed = parseMacroImport(form);
    if (!parsed) {
      remaining.push(form);
      continue;
    }
    const { modulePath, bindings } = parsed;

    // Resolve path (requires node:path — not available in browser)
    if (!_resolve || !_dirname) {
      throw new Error('import-macros requires Deno/Node file system access — not available in browser');
    }

    const resolvedPath = resolveImportMacrosSpecifier(modulePath, filePath, resolveSpecifier);

    // Duplicate check
    if (importedPaths.has(resolvedPath)) {
      throw new Error(`duplicate import-macros for ${modulePath}`);
    }
    importedPaths.add(resolvedPath);

    // Load module
    const { macros: moduleMacros, runtimeImports } = loadMacroModule(resolvedPath, modulePath, compilationStack, resolveSpecifier);

    // Register requested bindings
    for (const binding of bindings) {
      let importedName;
      let localName;

      if (binding.type === 'atom') {
        importedName = binding.value;
        localName = binding.value;
      } else if (binding.type === 'list' && binding.values.length >= 2 &&
                 binding.values[0].type === 'atom' && binding.values[0].value === 'as') {
        importedName = binding.values[1].value;
        localName = binding.values[2].value;
      } else {
        throw new Error(`import-macros: invalid binding form`);
      }

      if (!moduleMacros.has(importedName)) {
        const available = [...moduleMacros.keys()].join(', ');
        throw new Error(
          `macro '${importedName}' not exported by ${modulePath}` +
          (available ? ` (available: ${available})` : '')
        );
      }

      if (macroEnv.has(localName)) {
        throw new Error(`macro '${localName}' already defined (imported from ${modulePath})`);
      }

      macroEnv.set(localName, moduleMacros.get(importedName));
    }

    // Emit runtime imports declared by the macro module
    remaining.push(...runtimeImports);
  }

  return remaining;
}

/**
 * Load and compile a macro module, returning its exported macro functions
 * and any runtime import declarations.
 * @param {string} resolvedPath - Absolute path to the .lykn file
 * @param {string} displayPath - Original relative path for error messages
 * @param {string[]} compilationStack - For circular dep detection
 * @returns {{ macros: Map<string, Function>, runtimeImports: *[] }}
 */
function loadMacroModule(resolvedPath, displayPath, compilationStack, resolveSpecifier) {
  // Circular dependency check
  if (compilationStack.includes(resolvedPath)) {
    const cycle = [...compilationStack, resolvedPath].map((p) => p.split('/').pop()).join(' → ');
    throw new Error(`circular macro module dependency: ${cycle}`);
  }

  // Cache check
  let mtime;
  try {
    mtime = Deno.statSync(resolvedPath).mtime?.getTime() ?? 0;
  } catch {
    throw new Error(`macro module not found: ${displayPath}`);
  }

  const cached = moduleCache.get(resolvedPath);
  if (cached && cached.mtime === mtime) {
    return { macros: cached.macros, runtimeImports: cached.runtimeImports };
  }

  // Read and parse
  let source;
  try {
    source = Deno.readTextFileSync(resolvedPath);
  } catch {
    throw new Error(`macro module not found: ${displayPath}`);
  }

  const forms = read(source);

  // Save and clear current macro env (module gets its own scope)
  const savedMacroEnv = new Map(macroEnv);
  macroEnv.clear();

  const newStack = [...compilationStack, resolvedPath];

  try {
    // Run three-pass pipeline on module (recursive)
    const afterPass0 = pass0ImportMacros(forms, {
      filePath: resolvedPath,
      compilationStack: newStack,
      resolveSpecifier,
    });

    // Pass 1: register macros, track which are exported
    const exportedMacroNames = new Set();
    const macroForms = [];
    const runtimeImports = [];
    const otherForms = [];

    for (const form of afterPass0) {
      // (export (macro name params body...))
      if (form.type === 'list' && form.values.length === 2 &&
          form.values[0].type === 'atom' && form.values[0].value === 'export' &&
          form.values[1].type === 'list' && form.values[1].values.length >= 3 &&
          form.values[1].values[0].type === 'atom' && form.values[1].values[0].value === 'macro') {
        const macroForm = form.values[1];
        const macroName = macroForm.values[1].value;
        exportedMacroNames.add(macroName);
        macroForms.push(macroForm);
      } else if (form.type === 'list' && form.values.length >= 3 &&
                 form.values[0].type === 'atom' && form.values[0].value === 'macro') {
        macroForms.push(form);
      } else if (form.type === 'list' && form.values.length >= 2 &&
                 form.values[0].type === 'atom' && form.values[0].value === 'runtime-import') {
        // (runtime-import "path" (bindings...)) → emitted as (import ...) in consuming file
        const riArgs = form.values.slice(1);
        if (riArgs[0]?.type !== 'string') {
          throw new Error('runtime-import: first argument must be a module path string');
        }
        runtimeImports.push(array(sym('import'), ...riArgs));
      } else if (form.type === 'list' && form.values.length === 2 &&
                 form.values[0].type === 'atom' && form.values[0].value === 'surface-macros' &&
                 form.values[1].type === 'string') {
        // (surface-macros "macros.js") → load JS companion that registers surface macros
        const jsFile = form.values[1].value;
        const jsPath = _resolve(_dirname(resolvedPath), jsFile);
        let jsSource;
        try { jsSource = Deno.readTextFileSync(jsPath); }
        catch { throw new Error(`surface-macros: file not found: ${jsFile}`); }
        const SURFACE_PARAMS = ['macroEnv', 'sym', 'array', 'gensym', 'isArray', 'isSymbol', 'isNumber', 'isString', 'isKeyword', 'first', 'rest', 'nth', 'length', 'append', 'formatSExpr'];
        const SURFACE_VALUES = [macroEnv, sym, array, gensym, isArray, isSymbol, isNumber, isString, isKeyword, first, rest, nth, length, append, formatSExpr];
        const beforeKeys = new Set(macroEnv.keys());
        try {
          const loader = new Function(...SURFACE_PARAMS, jsSource);
          loader(...SURFACE_VALUES);
        } catch (err) {
          throw new Error(`surface-macros: failed to load ${jsFile}: ${err.message}`, { cause: err });
        }
        for (const k of macroEnv.keys()) {
          if (!beforeKeys.has(k)) exportedMacroNames.add(k);
        }
      } else {
        otherForms.push(form);
      }
    }

    // Register all macros (exported and unexported)
    for (const form of macroForms) {
      const name = form.values[1];
      const params = form.values[2];
      const body = form.values.slice(3);
      registerMacroForm(name, params, body);
    }

    // Collect exported macro functions
    const macros = new Map();
    for (const name of exportedMacroNames) {
      if (macroEnv.has(name)) {
        macros.set(name, macroEnv.get(name));
      }
    }

    // Cache the result
    moduleCache.set(resolvedPath, { mtime, macros, runtimeImports });

    return { macros, runtimeImports };
  } finally {
    // Restore parent macro env
    macroEnv.clear();
    for (const [k, v] of savedMacroEnv) {
      macroEnv.set(k, v);
    }
  }
}
