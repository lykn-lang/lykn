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
  const { program } = parseModule(sourceText);

  for (const node of program.body) {
    const inner = node.type === "ExportNamedDeclaration" ? node.declaration : node;
    if (!inner) continue;

    if (inner.type === "FunctionDeclaration" && inner.id?.name === name) {
      const exported = node.type === "ExportNamedDeclaration";
      return {
        start: inner.start,
        end: inner.end,
        exported,
        kind: "function",
        spanWithComments: { start: node.start, end: node.end },
      };
    }
  }
  return null;
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
