// Tests for the dangling-citation gate (slice `02-artifact-homes`, row L-7).
//
// The gate's value is entirely in its extraction rule, so these tests pin both
// halves of that rule: what it catches, and — just as important — what it
// deliberately does not. A check that silently under-matches is the failure
// mode the slice exists to close (`D-2607-B8SY`).
//
// The checker's pure functions take the tracked-file set as data, so nothing
// here shells out to git or depends on the repository's current contents.

import { assert, assertEquals } from "https://deno.land/std/assert/mod.ts";
import { toFileUrl } from "https://deno.land/std/path/mod.ts";

// Anchored at Deno.cwd() per test/CONVENTIONS.md — the script is repo tooling,
// not a published package, so it has no import-map specifier.
const checker = await import(
  toFileUrl(`${Deno.cwd()}/scripts/check-cited-paths.js`).href
);
const { normalizeToken, resolveRelative, parseCensus, findDanglingCitations } = checker;

/** A stand-in for `git ls-tree -r HEAD`. */
function fakeTree(paths) {
  const dirs = new Set();
  for (const f of paths) {
    const parts = f.split("/");
    for (let i = 1; i < parts.length; i++) dirs.add(parts.slice(0, i).join("/"));
  }
  return {
    files: new Set(paths),
    dirs,
    topLevel: new Set(paths.map((f) => f.split("/")[0])),
  };
}

const TREE = fakeTree([
  "CLAUDE.md",
  "Makefile",
  "docs/philosophy.md",
  "docs/backlog/discoveries.md",
  "docs/guides/12-deno/12-04-publishing.md",
  "docs/design-v0.6.0/project-plan.md",
  "crates/lykn-cli/src/main.rs",
  "packages/lang/compiler.js",
  "test/CONVENTIONS.md",
]);

/** Run the gate over a single in-memory document. */
async function check(doc, text) {
  return await findDanglingCitations(TREE, [doc], () => Promise.resolve(text));
}

const paths = (findings) => findings.map((f) => f.resolved);

// --- what it catches -------------------------------------------------------

Deno.test("flags a code span naming a path absent from the tree", async () => {
  const found = await check("docs/philosophy.md", "See `docs/no-such-file.md` for details.");
  assertEquals(paths(found), ["docs/no-such-file.md"]);
  assertEquals(found[0].line, 1);
});

Deno.test("a file present on disk but untracked still fails — the original register bug", async () => {
  // `docs/backlog/owed-0.7.x-rows.md` is deliberately NOT in TREE, standing in
  // for a file that exists in the working tree but was never `git add`ed. The
  // gate resolves against the tree it is given, never the filesystem.
  const found = await check("CLAUDE.md", "Queues live in `docs/backlog/owed-0.7.x-rows.md`.");
  assertEquals(paths(found), ["docs/backlog/owed-0.7.x-rows.md"]);
});

Deno.test("a path that exists only on another branch fails on this one", async () => {
  // This is the branch dimension: `docs/design-v0.7.0/` is real on
  // `release/0.7.x` and absent here. Absent here means it fails here.
  const found = await check("CLAUDE.md", "0.7.0 planning lives in `docs/design-v0.7.0/`.");
  assertEquals(paths(found), ["docs/design-v0.7.0"]);
});

Deno.test("a new workbench citation fails even though workbench is never in git", async () => {
  const found = await check("docs/philosophy.md", "Notes in `workbench/brand-new-note.md`.");
  assertEquals(paths(found), ["workbench/brand-new-note.md"]);
});

Deno.test("a relative link whose every reading escapes the repository root is flagged", async () => {
  const found = await check("docs/philosophy.md", "[spec](../../../elsewhere/spec.md)");
  assertEquals(found.length, 1);
  assert(found[0].resolved.includes("escapes"));
});

Deno.test("a link with the wrong number of `../` hops is flagged", async () => {
  // The real defect this found: `[docs/philosophy.md](../../docs/philosophy.md)`
  // from docs/guides/12-deno/ resolves to docs/docs/philosophy.md.
  const found = await check(
    "docs/guides/12-deno/12-04-publishing.md",
    "See [`docs/philosophy.md`](../../docs/philosophy.md).",
  );
  assertEquals(paths(found), ["docs/docs/philosophy.md"]);
});

Deno.test("reports every distinct dangling path, with its line", async () => {
  const found = await check(
    "docs/philosophy.md",
    ["ok: `docs/backlog/discoveries.md`", "bad: `docs/gone.md`", "", "bad: `crates/gone.rs`"]
      .join("\n"),
  );
  assertEquals(found.map((f) => [f.line, f.resolved]), [[2, "docs/gone.md"], [4, "crates/gone.rs"]]);
});

Deno.test("the same citation twice on one line is reported once", async () => {
  const found = await check(
    "CLAUDE.md",
    "Note that `docs/ai/rust` may be a symlink; if `docs/ai/rust` is missing, ask.",
  );
  assertEquals(found.length, 1);
});

// --- what it deliberately does NOT catch -----------------------------------

Deno.test("unanchored first segments are not treated as citations", async () => {
  // Branch names, shorthand fragments, pre-restructure paths and out-of-repo
  // trees all share one property: their first segment is not a tracked
  // top-level entry. That single rule is what makes the gate usable.
  const notCitations = [
    "release/0.6.x", // a branch
    "cdc/compiler-coherence", // a branch
    "ast/sexpr.rs", // shorthand fragment
    "emitter/forms.rs", // shorthand fragment
    "src/surface.js", // pre-restructure path
    "05-active/0059-dd-58.md", // DD shorthand
    "collaboration-framework/docs/PROJECT-MANAGEMENT.md", // out of repo
    "target/release/lykn", // generated
    "dist/lang/deno.json", // generated
    "bin/lykn", // generated
    "node_modules/astring", // generated
  ];
  const found = await check("docs/philosophy.md", notCitations.map((p) => `\`${p}\``).join(" "));
  assertEquals(found, []);
});

Deno.test("non-path tokens are not treated as citations", async () => {
  const notPaths = [
    "https://example.com/a/b", // URL
    "jsr:@lykn/lang", // package specifier
    "npm:astring@^1.9.0", // package specifier
    "@std/assert/mod.ts", // scoped package
    "/etc/hosts", // absolute
    "~/lab/cnbb/lykn", // home-relative
    "CLAUDE.md", // no slash: indistinguishable from a generic mention
    "docs/guides/*", // glob
    "crates/**/*.rs", // glob
    "docs/design-vX.Y.Z/", // placeholder
    "workbench/YYYY-MM-DD-report.md", // placeholder
    "docs/arcNN-slug/plan.md", // placeholder
    "dist/<name>/deno.json", // placeholder
  ];
  const found = await check("docs/philosophy.md", notPaths.map((p) => `\`${p}\``).join(" "));
  assertEquals(found, []);
});

Deno.test("`./` and `../` code spans are skipped as ambiguous", async () => {
  // `./bin/lykn` is a shell invocation, `./mod.js` a module specifier, and
  // neither is document-relative. Guessing wrong produced 200+ false hits.
  const found = await check(
    "docs/design-v0.6.0/project-plan.md",
    "Run `./bin/lykn build`, then import `./mod.js` and `../render.js`.",
  );
  assertEquals(found, []);
});

Deno.test("a link target passes if EITHER the root-relative or document-relative reading resolves", async () => {
  // The gate asserts that a cited path names something real, not that a
  // renderer would follow it.
  const rootRelative = await check("docs/philosophy.md", "[x](docs/backlog/discoveries.md)");
  assertEquals(rootRelative, []);
  const docRelative = await check("docs/philosophy.md", "[x](backlog/discoveries.md)");
  assertEquals(docRelative, []);
});

Deno.test("fenced code block contents are not scanned", async () => {
  // Regression: this was only ACCIDENTALLY true — fence state was never
  // tracked, so a fence containing backticks or link syntax leaked through.
  // A closing report quoting a broken link inside a fence tripped the gate.
  const found = await check(
    "docs/philosophy.md",
    [
      "```sh",
      "cd docs/no-such-dir && ls",
      "```",
      "```",
      "is:      [`docs/philosophy.md`](../../docs/gone.md)",
      "also:    `docs/also-gone.md`",
      "```",
      "~~~",
      "`docs/tilde-fenced-gone.md`",
      "~~~",
    ].join("\n"),
  );
  assertEquals(found, []);
});

Deno.test("citations resume after a fence closes", async () => {
  const found = await check(
    "docs/philosophy.md",
    ["```", "`docs/inside.md`", "```", "`docs/outside.md`"].join("\n"),
  );
  assertEquals(paths(found), ["docs/outside.md"]);
  assertEquals(found[0].line, 4);
});

Deno.test("a shorter delimiter does not close a longer fence", async () => {
  const found = await check(
    "docs/philosophy.md",
    ["````", "```", "`docs/still-inside.md`", "````", "`docs/now-outside.md`"].join("\n"),
  );
  assertEquals(paths(found), ["docs/now-outside.md"]);
});

// --- token normalization ---------------------------------------------------

Deno.test("normalizeToken strips locators, fragments and prose punctuation", () => {
  const cases = [
    ["crates/lykn-cli/src/main.rs:563", "crates/lykn-cli/src/main.rs"],
    ["crates/lykn-cli/src/main.rs:563-612", "crates/lykn-cli/src/main.rs"],
    ["packages/lang/expander.js:1422–1437", "packages/lang/expander.js"], // en dash
    ["crates/lykn-cli/src/main.rs:12:5", "crates/lykn-cli/src/main.rs"],
    ["crates/lykn-cli/src/main.rs::cmd_compile", "crates/lykn-cli/src/main.rs"],
    ["docs/philosophy.md#principle-2", "docs/philosophy.md"],
    ["docs/backlog/", "docs/backlog"],
    ["docs/philosophy.md.", "docs/philosophy.md"],
  ];
  for (const [raw, want] of cases) {
    assertEquals(normalizeToken(raw)?.path, want, `normalizing ${raw}`);
  }
});

Deno.test("resolveRelative walks up and reports an escape as null", () => {
  assertEquals(resolveRelative("docs/a/b.md", "../c.md"), "docs/c.md");
  assertEquals(resolveRelative("docs/a/b.md", "./c.md"), "docs/a/c.md");
  assertEquals(resolveRelative("docs/a/b.md", "../../c.md"), "c.md");
  assertEquals(resolveRelative("docs/a/b.md", "../../../c.md"), null);
});

// --- HTML sources ----------------------------------------------------------

Deno.test("HTML <code> spans and href attributes are scanned", async () => {
  const found = await check(
    "docs/design-v0.6.0/status.html",
    '<p><code>docs/gone.md</code> and <a href="docs/also-gone.md">x</a></p>',
  );
  assertEquals(paths(found), ["docs/gone.md", "docs/also-gone.md"]);
});

Deno.test("HTML entities are decoded before the placeholder rule runs", async () => {
  // `workbench/&lt;date&gt;-audit-results.md` is a placeholder, not a path.
  const found = await check(
    "docs/design-v0.6.0/status.html",
    "<code>workbench/&lt;date&gt;-audit-results-&lt;slug&gt;.md</code>",
  );
  assertEquals(found, []);
});

// --- the frozen census -----------------------------------------------------

Deno.test("parseCensus ignores comments and blank lines", () => {
  const census = parseCensus(
    ["# header", "", "docs/a.md\tworkbench/x.md", "docs/b.md\tdocs/gone.md", ""].join("\n"),
  );
  assertEquals(census.size, 2);
  assert(census.has("docs/a.md\tworkbench/x.md"));
});

Deno.test("the census matches on the exact (file, path) pair, not the path alone", async () => {
  // This is what stops the snapshot from decaying into a prefix allowlist:
  // the same historical path cited by a NEW document still fails.
  const census = parseCensus("docs/philosophy.md\tworkbench/old-note.md");
  const cited = "Notes in `workbench/old-note.md`.";
  const grandfathered = await check("docs/philosophy.md", cited);
  const fresh = await check("docs/backlog/discoveries.md", cited);
  const live = (findings, doc) =>
    findings.filter((f) => !census.has(`${doc}\t${f.resolved}`));
  assertEquals(live(grandfathered, "docs/philosophy.md"), []);
  assertEquals(live(fresh, "docs/backlog/discoveries.md").length, 1);
});

Deno.test("the committed census is well-formed, sorted and free of duplicates", async () => {
  const text = await Deno.readTextFile(`${Deno.cwd()}/scripts/cited-paths-census.tsv`);
  const rows = text.split("\n").filter((l) => l && !l.startsWith("#"));
  assert(rows.length > 0, "the census should not be empty");
  for (const row of rows) {
    assertEquals(row.split("\t").length, 2, `malformed census row: ${row}`);
  }
  assertEquals(rows, [...rows].sort(), "the census must stay sorted so diffs stay readable");
  assertEquals(new Set(rows).size, rows.length, "the census must not contain duplicate pairs");
  assert(
    text.includes("NEVER APPEND TO THIS FILE"),
    "the census must keep the header that says what it is",
  );
});
