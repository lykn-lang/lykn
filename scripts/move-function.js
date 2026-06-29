// move-function.js — byte-exact function-move tool (track B, M22.5-T1a).
//
// Invoked via:
//   deno run -A scripts/move-function.js \
//     --from packages/lang/surface.js \
//     --to   packages/lang/surface-helpers.js \
//     --name <helperName> [--dry-run] [--verify-cmd "deno test -A test/"]
//
// The one invariant: parse only to locate, copy raw bytes, never regenerate.
// A JS parser (acorn) finds the [start, end] offsets of a named top-level
// declaration; the move extracts sourceText.slice(start, end) verbatim and
// inserts it unchanged. No code generator ever touches the moved body.

import * as acorn from "npm:acorn@^8";
import { dirname, relative, resolve } from "https://deno.land/std/path/mod.ts";

/** Raised when a move cannot be performed safely; the tool writes nothing. */
export class MoveError extends Error {
  get name() {
    return "MoveError";
  }
}

/** Raised when the post-move verify command fails; the move is reverted first. */
export class VerifyError extends Error {
  get name() {
    return "VerifyError";
  }
}

/**
 * Parse module source into an ESTree Program, collecting comment nodes.
 * @param {string} text
 * @returns {{ program: object, comments: Array<{type: string, start: number, end: number}> }}
 */
export function parseModule(text) {
  const comments = [];
  const program = acorn.parse(text, {
    ecmaVersion: "latest",
    sourceType: "module",
    locations: false,
    onComment: comments,
  });
  return { program, comments };
}

/**
 * Locate a named top-level declaration and report the spans needed to move it.
 *
 * @param {string} sourceText
 * @param {string} name
 * @returns {{ start: number, end: number, exported: boolean, kind: string,
 *   spanWithComments: { start: number, end: number } } | null}
 *   `start`/`end` bound the declaration itself; when wrapped in `export`,
 *   `spanWithComments` covers the whole `export …` statement (the removal
 *   extent). `null` when no such top-level declaration exists.
 */
export function locateDeclaration(sourceText, name) {
  const { program, comments } = parseModule(sourceText);

  const build = (outer, inner, kind) => ({
    start: inner.start,
    end: inner.end,
    exported: outer.type === "ExportNamedDeclaration",
    kind,
    spanWithComments: {
      start: leadingCommentStart(sourceText, comments, outer.start),
      end: outer.end,
    },
  });

  for (const node of program.body) {
    const inner = node.type === "ExportNamedDeclaration" ? node.declaration : node;
    if (!inner) continue;

    if (inner.type === "FunctionDeclaration" && inner.id?.name === name) {
      return build(node, inner, inner.generator ? "function*" : "function");
    }
    if (inner.type === "VariableDeclaration" && inner.declarations.length === 1) {
      const decl = inner.declarations[0];
      if (decl.id?.type === "Identifier" && decl.id.name === name) {
        return build(node, inner, inner.kind);
      }
    }
  }
  return null;
}

/**
 * Walk backward from `declStart` through any comment block separated from it by
 * whitespace only, returning the offset where that contiguous comment block
 * begins (or `declStart` if there is none). This is what carries a helper's doc
 * comment along with it during a move.
 * @param {string} text
 * @param {Array<{start: number, end: number}>} comments
 * @param {number} declStart
 * @returns {number}
 */
function leadingCommentStart(text, comments, declStart) {
  let start = declStart;
  let extended = true;
  while (extended) {
    extended = false;
    for (const comment of comments) {
      if (
        comment.end <= start &&
        comment.start < start &&
        /^\s*$/.test(text.slice(comment.end, start))
      ) {
        start = comment.start;
        extended = true;
      }
    }
  }
  return start;
}

/**
 * Delete a declaration span (the `spanWithComments` extent — comments + any
 * `export` wrapper + body) plus exactly one adjoining newline, leaving no blank
 * gap. Everything outside the removed range is byte-identical.
 * @param {string} sourceText
 * @param {{ start: number, end: number }} span
 * @returns {string}
 */
export function removeDeclaration(sourceText, span) {
  let { start, end } = span;
  if (sourceText[end] === "\n") end += 1;
  else if (sourceText[start - 1] === "\n") start -= 1;
  return sourceText.slice(0, start) + sourceText.slice(end);
}

/**
 * Append a fully-formed declaration unit after the last top-level statement,
 * separated by one blank line, with a trailing newline. `unitText` is inserted
 * verbatim — the caller composes any `export` keyword and leading comments so
 * the moved bytes stay byte-identical to the source.
 * @param {string} targetText
 * @param {string} unitText
 * @returns {string}
 */
export function insertDeclaration(targetText, unitText) {
  const trimmed = targetText.replace(/\s+$/, "");
  return `${trimmed}\n\n${unitText}\n`;
}

/**
 * Add `import { name } from "<specifier>";`, merging into an existing import
 * from the same specifier when present (idempotent if already imported), else
 * inserting a new import line after the last import (or at the top).
 * @param {string} text
 * @param {string} name
 * @param {string} specifier
 * @returns {string}
 */
export function addNamedImport(text, name, specifier) {
  const { program } = parseModule(text);
  const imports = program.body.filter((n) => n.type === "ImportDeclaration");
  const named = (node) => node.specifiers.filter((s) => s.type === "ImportSpecifier");

  const existing = imports.find(
    (n) => n.source.value === specifier && named(n).length > 0,
  );
  if (existing) {
    const specs = named(existing);
    if (specs.some((s) => s.imported.name === name)) return text;
    const at = specs[specs.length - 1].end;
    return `${text.slice(0, at)}, ${name}${text.slice(at)}`;
  }

  const line = `import { ${name} } from ${JSON.stringify(specifier)};`;
  if (imports.length > 0) {
    const at = imports[imports.length - 1].end;
    return `${text.slice(0, at)}\n${line}${text.slice(at)}`;
  }
  return `${line}\n${text}`;
}

/**
 * Remove `name` from any `export { … } from "<fromSpecifier>"` statement,
 * deleting the statement entirely if its list becomes empty. Aliases are
 * preserved; re-exports from other specifiers are left intact.
 * @param {string} text
 * @param {string} name
 * @param {string} fromSpecifier
 * @returns {string}
 */
export function stripReExport(text, name, fromSpecifier) {
  const { program } = parseModule(text);
  const node = program.body.find(
    (n) =>
      n.type === "ExportNamedDeclaration" &&
      n.source?.value === fromSpecifier &&
      n.specifiers.some((s) => s.exported.name === name),
  );
  if (!node) return text;

  const remaining = node.specifiers.filter((s) => s.exported.name !== name);
  if (remaining.length === 0) {
    return removeDeclaration(text, { start: node.start, end: node.end });
  }
  const names = remaining.map((s) =>
    s.local.name === s.exported.name
      ? s.exported.name
      : `${s.local.name} as ${s.exported.name}`
  );
  const rebuilt = `export { ${names.join(", ")} } from ${JSON.stringify(node.source.value)};`;
  return text.slice(0, node.start) + rebuilt + text.slice(node.end);
}

/**
 * Move `name` from the `import { … } from "<oldSpecifier>"` statement to an
 * `import { … } from "<newSpecifier>"` (merging into an existing one, else
 * creating a new import line). Deletes the origin import when its list empties.
 * No-op when `text` does not import `name` from `oldSpecifier`.
 * @param {string} text
 * @param {string} name
 * @param {string} oldSpecifier
 * @param {string} newSpecifier
 * @returns {string}
 */
export function rewriteImportSource(text, name, oldSpecifier, newSpecifier) {
  const { program } = parseModule(text);
  const node = program.body.find(
    (n) =>
      n.type === "ImportDeclaration" &&
      n.source.value === oldSpecifier &&
      n.specifiers.some((s) => s.type === "ImportSpecifier" && s.imported.name === name),
  );
  if (!node) return text;

  const keptNamed = node.specifiers
    .filter((s) => s.type === "ImportSpecifier" && s.imported.name !== name)
    .map((s) =>
      s.imported.name === s.local.name ? s.imported.name : `${s.imported.name} as ${s.local.name}`
    );

  let withoutName;
  if (keptNamed.length === 0) {
    withoutName = removeDeclaration(text, { start: node.start, end: node.end });
  } else {
    const rebuilt = `import { ${keptNamed.join(", ")} } from ${JSON.stringify(node.source.value)};`;
    withoutName = text.slice(0, node.start) + rebuilt + text.slice(node.end);
  }
  return addNamedImport(withoutName, name, newSpecifier);
}

/** Whether `importSource` (relative to `consumerPath`'s dir) resolves to `targetPath`. */
export function importResolvesTo(consumerPath, importSource, targetPath) {
  return resolve(dirname(consumerPath), importSource) === resolve(targetPath);
}

// ── Orchestration ──────────────────────────────────────────────────────

/**
 * Walk an ESTree node, invoking `visit(node, parent, key)` for every node.
 * @param {object} node
 * @param {(node: object, parent: object|null, key: string|null) => void} visit
 */
function walkAst(node, visit, parent = null, key = null) {
  if (!node || typeof node.type !== "string") return;
  visit(node, parent, key);
  for (const childKey of Object.keys(node)) {
    if (childKey === "type" || childKey === "start" || childKey === "end") continue;
    const child = node[childKey];
    if (Array.isArray(child)) {
      for (const item of child) walkAst(item, visit, node, childKey);
    } else if (child && typeof child.type === "string") {
      walkAst(child, visit, node, childKey);
    }
  }
}

/** Whether `name` appears in value position (a real reference, not a key). */
function referencesName(text, name) {
  const { program } = parseModule(text);
  let found = false;
  walkAst(program, (node, parent, key) => {
    if (found || node.type !== "Identifier" || node.name !== name) return;
    if (parent?.type === "MemberExpression" && key === "property" && !parent.computed) return;
    if (parent?.type === "Property" && key === "key" && !parent.computed) return;
    found = true;
  });
  return found;
}

/** Count top-level declarations of `name` (function / variable, export-wrapped). */
function countTopLevelDeclarations(text, name) {
  const { program } = parseModule(text);
  let count = 0;
  for (const node of program.body) {
    const inner = node.type === "ExportNamedDeclaration" ? node.declaration : node;
    if (!inner) continue;
    if (inner.type === "FunctionDeclaration" && inner.id?.name === name) {
      count += 1;
    } else if (inner.type === "VariableDeclaration") {
      for (const decl of inner.declarations) {
        if (decl.id?.type === "Identifier" && decl.id.name === name) count += 1;
      }
    }
  }
  return count;
}

/** Whether `name` is locally declared or locally imported (not a re-export). */
function isDeclaredOrImported(text, name) {
  if (countTopLevelDeclarations(text, name) > 0) return true;
  const { program } = parseModule(text);
  return program.body.some(
    (n) =>
      n.type === "ImportDeclaration" &&
      n.specifiers.some((s) => s.local.name === name),
  );
}

/** ESM relative specifier from `fromFile`'s directory to `toFile` (with "./"). */
function relativeSpecifier(fromFile, toFile) {
  const rel = relative(dirname(fromFile), toFile);
  return rel.startsWith(".") ? rel : `./${rel}`;
}

/**
 * Compute (purely) the new FROM/TO contents for moving `name` from `fromPath`
 * to `toPath`. Aborts via MoveError when the move cannot be guaranteed correct.
 *
 * @param {string} fromOrig
 * @param {string} toOrig
 * @param {string} name
 * @param {string} fromPath
 * @param {string} toPath
 * @returns {{ newFrom: string, newTo: string, addedBackImport: boolean, strippedReExport: boolean }}
 * @throws {MoveError} on not-found, ambiguous, collision, or conflicting binding.
 */
export function planMove(fromOrig, toOrig, name, fromPath, toPath) {
  const loc = locateDeclaration(fromOrig, name);
  if (!loc) {
    throw new MoveError(`'${name}' not found as a top-level declaration in ${fromPath}`);
  }
  if (countTopLevelDeclarations(fromOrig, name) > 1) {
    throw new MoveError(`'${name}' is declared more than once in ${fromPath} (ambiguous)`);
  }
  if (isDeclaredOrImported(toOrig, name)) {
    throw new MoveError(`'${name}' is already declared or imported in ${toPath} (collision)`);
  }

  // Extract the verbatim unit — the declaration bytes are never regenerated.
  const declBytes = fromOrig.slice(loc.start, loc.end);
  const unit = loc.exported
    ? fromOrig.slice(loc.spanWithComments.start, loc.end)
    : `${fromOrig.slice(loc.spanWithComments.start, loc.start)}export ${declBytes}`;

  let newFrom = removeDeclaration(fromOrig, loc.spanWithComments);

  let addedBackImport = false;
  if (referencesName(newFrom, name)) {
    if (isDeclaredOrImported(newFrom, name)) {
      throw new MoveError(
        `'${name}' still has a conflicting binding in ${fromPath} after removal`,
      );
    }
    newFrom = addNamedImport(newFrom, name, relativeSpecifier(fromPath, toPath));
    addedBackImport = true;
  }

  let newTo = stripReExport(toOrig, name, relativeSpecifier(toPath, fromPath));
  const strippedReExport = newTo !== toOrig;
  newTo = insertDeclaration(newTo, unit);

  return { newFrom, newTo, addedBackImport, strippedReExport };
}

/**
 * Move a single named top-level declaration from `opts.from` to `opts.to`,
 * byte-exactly. Aborts (writing nothing) when the move cannot be guaranteed
 * correct. With `dryRun`, computes the result and writes nothing. Otherwise
 * writes both files and, if `verify` is supplied, runs it — reverting both
 * files to their byte-exact originals and throwing if verification fails.
 *
 * @param {{ from: string, to: string, name: string, dryRun?: boolean,
 *   verify?: () => Promise<{ success: boolean, output: string }> }} opts
 * @returns {Promise<{ name: string, from: string, to: string, newFrom: string,
 *   newTo: string, addedBackImport: boolean, strippedReExport: boolean,
 *   written: boolean }>}
 * @throws {MoveError} on an unsafe move; {VerifyError} when verify fails.
 */
export async function moveFunction(opts) {
  const { from, to, name, dryRun = false, verify } = opts;
  const fromOrig = await Deno.readTextFile(from);
  const toOrig = await Deno.readTextFile(to);

  const plan = planMove(fromOrig, toOrig, name, from, to);
  const summary = { name, from, to, ...plan };

  if (dryRun) {
    return { ...summary, written: false };
  }

  await Deno.writeTextFile(from, plan.newFrom);
  await Deno.writeTextFile(to, plan.newTo);

  if (verify) {
    const result = await verify();
    if (!result.success) {
      await Deno.writeTextFile(from, fromOrig);
      await Deno.writeTextFile(to, toOrig);
      throw new VerifyError(
        `verify failed; reverted ${from} and ${to}\n${result.output}`,
      );
    }
  }

  return { ...summary, written: true };
}

// ── CLI ────────────────────────────────────────────────────────────────

/**
 * Parse argv into move options. Throws on missing required flags.
 * @param {string[]} argv
 * @returns {{ from: string, to: string, name: string, dryRun: boolean, verifyCmd: string }}
 */
export function parseArgs(argv) {
  const opts = { from: "", to: "", name: "", dryRun: false, verifyCmd: "deno test -A test/" };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case "--from": opts.from = argv[++i] ?? ""; break;
      case "--to": opts.to = argv[++i] ?? ""; break;
      case "--name": opts.name = argv[++i] ?? ""; break;
      case "--dry-run": opts.dryRun = true; break;
      case "--verify-cmd": opts.verifyCmd = argv[++i] ?? ""; break;
      default:
        throw new Error(`unknown argument: ${arg}`);
    }
  }
  for (const required of ["from", "to", "name"]) {
    if (!opts[required]) throw new Error(`missing required --${required}`);
  }
  return opts;
}

/**
 * Run a verify command verbatim and report success + combined output. The tool
 * never injects skip-gate flags (no --no-verify, --allow-dirty, etc.) — the
 * command runs exactly as given. Whitespace-split argv (the default
 * `deno test -A test/` and similar simple commands).
 * @param {string} command
 * @returns {Promise<{ success: boolean, output: string }>}
 */
export async function runVerifyCommand(command) {
  const parts = command.trim().split(/\s+/);
  const cmd = new Deno.Command(parts[0], {
    args: parts.slice(1),
    stdout: "piped",
    stderr: "piped",
  });
  const { success, stdout, stderr } = await cmd.output();
  const decoder = new TextDecoder();
  return { success, output: decoder.decode(stdout) + decoder.decode(stderr) };
}

/** Minimal before/after print for a dry run — the resulting file contents. */
function printDryRun(plan) {
  console.log(`# dry-run: move '${plan.name}' ${plan.from} → ${plan.to}`);
  console.log(`# back-import added to FROM: ${plan.addedBackImport}`);
  console.log(`# alias re-export stripped in TO: ${plan.strippedReExport}`);
  console.log(`\n--- ${plan.from} (after) ---\n${plan.newFrom}`);
  console.log(`--- ${plan.to} (after) ---\n${plan.newTo}`);
}

if (import.meta.main) {
  const opts = parseArgs(Deno.args);
  try {
    if (opts.dryRun) {
      const plan = await moveFunction({
        from: opts.from,
        to: opts.to,
        name: opts.name,
        dryRun: true,
      });
      printDryRun(plan);
    } else {
      const result = await moveFunction({
        from: opts.from,
        to: opts.to,
        name: opts.name,
        verify: () => runVerifyCommand(opts.verifyCmd),
      });
      console.log(
        `moved '${result.name}' ${result.from} → ${result.to}` +
          ` (back-import: ${result.addedBackImport}, re-export stripped: ${result.strippedReExport})` +
          `\nverified with: ${opts.verifyCmd}`,
      );
    }
  } catch (err) {
    console.error(err.message);
    Deno.exit(1);
  }
}
