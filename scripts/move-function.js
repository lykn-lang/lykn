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

import * as acorn from "npm:acorn";

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

if (import.meta.main) {
  // Scaffold: parse + validate the move plan. The move orchestration and
  // verify gate are wired in F-5/F-6.
  const opts = parseArgs(Deno.args);
  console.log(
    `move-function: ${opts.name}  ${opts.from} → ${opts.to}` +
      (opts.dryRun ? "  (dry-run)" : ""),
  );
}
