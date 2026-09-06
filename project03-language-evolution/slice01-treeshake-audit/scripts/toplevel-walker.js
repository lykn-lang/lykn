/**
 * @module toplevel-walker
 *
 * Corpus scanner for the 01-treeshake-audit slice (ledger F-10).
 *
 * Parses every `.js` file under a root directory and flags statements at
 * module top level that execute code at load time — the constructs that
 * block a bundler from dropping the module or binding during tree-shaking.
 *
 * Finding kinds:
 * - `effectful-statement`  — a non-declaration statement in Program body
 *   (ExpressionStatement, IfStatement, ThrowStatement, loops, try, …)
 * - `call-in-initializer`  — a VariableDeclaration whose initializer
 *   contains load-time evaluation (call/new/await/assignment/update/
 *   tagged template/dynamic import) outside any nested function body
 * - `bare-import`          — `import "mod";` (side-effect import;
 *   informational — usually user intent)
 *
 * Known limitations (deliberate, to keep signal high): member reads in
 * initializers (possible getters) and class heritage/static blocks are not
 * flagged.
 *
 * Run from the repo root:
 *
 *   deno run --allow-read --allow-write --allow-env --allow-net \
 *     docs/design-v0.7.0/01-treeshake-audit/scripts/toplevel-walker.js \
 *     <rootDir> [outJson]
 *
 * `outJson` defaults to docs/design-v0.7.0/01-treeshake-audit/evidence/corpus-scan.json
 */
import { parse } from "npm:acorn@8";

const EFFECT_NODE_TYPES = new Set([
  "CallExpression",
  "NewExpression",
  "AwaitExpression",
  "AssignmentExpression",
  "UpdateExpression",
  "TaggedTemplateExpression",
  "ImportExpression",
]);

const FUNCTION_BODY_TYPES = new Set([
  "FunctionDeclaration",
  "FunctionExpression",
  "ArrowFunctionExpression",
]);

/**
 * Collect load-time-effect nodes in an expression subtree, without
 * descending into nested function bodies (code there runs later, not at
 * module load).
 *
 * @param {object} node ESTree node.
 * @param {Array<{type: string, line: number}>} out Accumulator.
 */
function findEffects(node, out) {
  if (node == null || typeof node.type !== "string") return;
  if (EFFECT_NODE_TYPES.has(node.type)) {
    out.push({ type: node.type, line: node.loc.start.line });
    // Keep descending: an IIFE argument may itself contain further calls.
  }
  if (FUNCTION_BODY_TYPES.has(node.type)) return;
  for (const key of Object.keys(node)) {
    if (key === "loc") continue;
    const value = node[key];
    if (Array.isArray(value)) {
      for (const item of value) findEffects(item, out);
    } else if (value != null && typeof value === "object") {
      findEffects(value, out);
    }
  }
}

/**
 * Scan one top-level statement; return findings (possibly empty).
 *
 * @param {object} stmt ESTree statement from Program body.
 * @param {string} file Relative file path for reporting.
 * @returns {Array<{file: string, line: number, kind: string, detail: string}>}
 */
function scanStatement(stmt, file) {
  const line = stmt.loc.start.line;

  // Unwrap export wrappers around declarations.
  if (
    (stmt.type === "ExportNamedDeclaration" ||
      stmt.type === "ExportDefaultDeclaration") && stmt.declaration
  ) {
    return scanStatement({ ...stmt.declaration, loc: stmt.loc }, file);
  }

  switch (stmt.type) {
    case "ImportDeclaration":
      if (stmt.specifiers.length === 0) {
        return [{ file, line, kind: "bare-import", detail: stmt.source.value }];
      }
      return [];
    case "ExportNamedDeclaration":
    case "ExportAllDeclaration":
    case "FunctionDeclaration":
    case "ClassDeclaration":
      return [];
    case "VariableDeclaration": {
      const effects = [];
      for (const decl of stmt.declarations) {
        if (decl.init) findEffects(decl.init, effects);
      }
      if (effects.length === 0) return [];
      const detail = effects.map((e) => `${e.type}@${e.line}`).join(", ");
      return [{ file, line, kind: "call-in-initializer", detail }];
    }
    case "ExpressionStatement":
      if (stmt.directive === "use strict") return [];
      return [{ file, line, kind: "effectful-statement", detail: "ExpressionStatement" }];
    default:
      return [{ file, line, kind: "effectful-statement", detail: stmt.type }];
  }
}

/**
 * Recursively yield `.js` file paths under a directory.
 *
 * @param {string} dir Directory to walk.
 * @returns {AsyncGenerator<string>}
 */
async function* jsFiles(dir) {
  for await (const entry of Deno.readDir(dir)) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory) yield* jsFiles(path);
    else if (entry.isFile && entry.name.endsWith(".js")) yield path;
  }
}

const root = Deno.args[0];
if (!root) {
  throw new Error("usage: toplevel-walker.js <rootDir> [outJson]");
}
const outJson = Deno.args[1] ??
  "docs/design-v0.7.0/01-treeshake-audit/evidence/corpus-scan.json";

const findings = [];
let filesScanned = 0;
const parseFailures = [];

for await (const file of jsFiles(root)) {
  const source = await Deno.readTextFile(file);
  let ast;
  try {
    ast = parse(source, {
      ecmaVersion: "latest",
      sourceType: "module",
      locations: true,
    });
  } catch (err) {
    parseFailures.push({ file, error: String(err) });
    continue;
  }
  filesScanned += 1;
  for (const stmt of ast.body) {
    findings.push(...scanStatement(stmt, file));
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  root,
  filesScanned,
  parseFailures,
  counts: Object.fromEntries(
    ["effectful-statement", "call-in-initializer", "bare-import"].map(
      (kind) => [kind, findings.filter((f) => f.kind === kind).length],
    ),
  ),
  findings,
};

await Deno.writeTextFile(outJson, JSON.stringify(report, null, 2) + "\n");
console.log(
  `scanned ${filesScanned} files (${parseFailures.length} parse failures): ` +
    `${findings.length} findings → ${outJson}`,
);
