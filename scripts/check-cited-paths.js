// Dangling-citation gate (slice `02-artifact-homes`, ledger row L-7).
//
// Fails when a tracked document cites a repo-relative path that does not
// resolve in git **on that document's own branch**.
//
// Why this exists: `docs/backlog/discoveries.md` was cited by five committed
// documents while the file itself sat in the gitignored `workbench/` tree.
// Nobody typed a wrong path — the agreed home was simply never created. A
// cited path is a claim, and it was going unchecked.
//
// Invoked via: deno run -A scripts/check-cited-paths.js
// Wired into `make check` through the `check-cited-paths` target.
//
// Resolution is against `git ls-tree -r HEAD` — never `--all`, never the
// working tree. A file that exists only on another branch MUST fail here;
// that is the point, not a false positive (see `docs/design-v0.6.0/
// 02-artifact-homes/ledger.md`, amendment "L-7 gains a branch dimension").

// ---------------------------------------------------------------------------
// Extraction rule — and what it deliberately does NOT catch
// ---------------------------------------------------------------------------
//
// A check that silently under-matches is the failure mode this slice closes
// (`D-2607-B8SY`: a test that overclaims is worse than a missing test). So the
// non-catches are enumerated, not discovered later.
//
// SCANNED:
//   - tracked `docs/**/*.md` and `docs/**/*.html`, plus root `CLAUDE.md`
//   - markdown inline code spans      `like/this`     → repo-root-relative
//   - markdown link / image targets   [x](like/this)  → document-relative OR
//                                                       repo-root-relative
//   - markdown reference definitions  [id]: like/this → same as link targets
//   - HTML `<code>` spans, `href=`, `src=`            → same rules
//
// A candidate must be ANCHORED: its first segment must be a tracked
// top-level entry in HEAD (`docs`, `crates`, `packages`, `test`, …). This is
// the precision rule that makes the gate usable, and it is why the following
// are NOT flagged:
//
//   - branch names — `release/0.6.x`, `cdc/compiler-coherence`, `feature/…`
//   - shorthand fragments — `ast/sexpr.rs`, `emitter/forms.rs`, `05-active/…`
//   - pre-restructure paths — `src/surface.js`, `crates/design/…` is anchored
//     but `src/…` is not
//   - out-of-repo paths — `collaboration-framework/…`, `mycelium/…`
//   - generated / gitignored trees — `target/`, `dist/`, `bin/`, `node_modules/`,
//     `.worktrees/`. These are correctly cited in build documentation and can
//     never resolve in git.
//
// The one deliberate exception to the anchor rule is `workbench/`, which is a
// DENY-prefix: gitignored by rule, so it can never resolve, yet `CLAUDE.md`
// now says nothing durable and nothing cited may live there. A NEW
// `workbench/` citation is precisely what this gate exists to reject, so it is
// always checked and always fails unless the exact (file, path) pair is in the
// frozen census (see below).
//
// ALSO NOT CAUGHT, deliberately:
//   - anything without a `/` — a bare `CLAUDE.md` or `Makefile` in prose is
//     indistinguishable from a generic mention
//   - glob patterns (`docs/guides/*`, `crates/**/*.rs`) — matching semantics
//     would have to be invented, and a wrong one is worse than none
//   - contents of fenced code blocks — shell transcripts cite paths relative
//     to a cwd the checker cannot know
//   - `./`- and `../`-prefixed CODE SPANS — ambiguous between a shell cwd
//     (`./bin/lykn`), a module specifier (`./mod.js`), and a document-relative
//     path. Link targets keep their relative resolution: markdown defines it.
//   - scheme-prefixed specifiers — `https:`, `jsr:@lykn/lang`, `npm:astring`
//   - placeholder paths — `docs/design-vX.Y.Z/`, `arcNN-<slug>/`,
//     `workbench/YYYY-MM-DD-…`, anything with `<>{}$` or an ellipsis
//   - absolute (`/…`) and home-relative (`~/…`) paths — not repo-relative
//   - whether a link target would RENDER correctly. A link that resolves
//     root-relative but not document-relative passes: this gate asserts that a
//     cited path names something real, not that a renderer would follow it.

const REPO_TOP_LEVEL_DENY = ["workbench/"];

const CENSUS_PATH = "scripts/cited-paths-census.tsv";

// --- git ------------------------------------------------------------------

async function git(...args) {
  const { code, stdout, stderr } = await new Deno.Command("git", {
    args,
    stdout: "piped",
    stderr: "piped",
  }).output();
  if (code !== 0) {
    throw new Error(`git ${args.join(" ")} failed:\n${new TextDecoder().decode(stderr)}`);
  }
  return new TextDecoder().decode(stdout);
}

/** Every path tracked at HEAD, plus every directory implied by one. */
export async function treeAtHead() {
  const files = (await git("ls-tree", "-r", "HEAD", "--name-only"))
    .split("\n").filter(Boolean);
  const dirs = new Set();
  for (const f of files) {
    const parts = f.split("/");
    for (let i = 1; i < parts.length; i++) dirs.add(parts.slice(0, i).join("/"));
  }
  return { files: new Set(files), dirs, topLevel: new Set(files.map((f) => f.split("/")[0])) };
}

// --- candidate extraction --------------------------------------------------

const MD_CODE_SPAN = /`([^`\n]+)`/g;
const MD_LINK = /!?\[[^\]\n]*\]\(\s*<?([^)>\s]+)>?[^)]*\)/g;
const MD_REF_DEF = /^\s{0,3}\[[^\]\n]+\]:\s*<?([^\s>]+)>?/;
const HTML_CODE = /<code[^>]*>([^<]+)<\/code>/g;
const HTML_ATTR = /(?:href|src)\s*=\s*["']([^"']+)["']/g;

// Placeholder segments. Note the absence of `\b` around the metasyntactic
// tokens: they appear glued to real text (`docs/design-vX.Y.Z/`, `arcNN-slug`,
// `workbench/YYYY-MM-DD-…`), where a word boundary never fires.
const PLACEHOLDER = /…|\.\.\.|NN|X\.Y\.Z|YYYY|<[^>]*>/;
const FORBIDDEN_CHARS = /[<>{}$"'|\\@!`]/;
const GLOB = /[*?[\]]/;
const SCHEME = /^[a-z][a-z0-9+.-]*:/i;

/**
 * Normalize a raw token into a candidate repo path, or null if the token is
 * not a checkable citation. Returns `{ path, relative }`.
 */
export function normalizeToken(raw) {
  let t = raw.trim();
  if (!t || /\s/.test(t)) return null;
  if (FORBIDDEN_CHARS.test(t)) return null;
  if (PLACEHOLDER.test(t)) return null;
  if (SCHEME.test(t)) return null;
  if (t.startsWith("#") || t.startsWith("~") || t.startsWith("/")) return null;

  t = t.replace(/#.*$/, ""); // fragment
  t = t.replace(/::.*$/, ""); // path::symbol convention
  t = t.replace(/:\d+(?:[-–—]\d+)?(?::\d+)?$/, ""); // :line, :start-end, :line:col
  t = t.replace(/[.,;)]+$/, ""); // trailing prose punctuation
  t = t.replace(/\/+$/, ""); // trailing slash (directory citation)
  if (!t.includes("/")) return null;
  if (GLOB.test(t)) return null;

  return { path: t, relative: t.startsWith("./") || t.startsWith("../") };
}

/** Resolve `p` as if written inside `doc`. Returns null if it escapes the root. */
export function resolveRelative(doc, p) {
  const out = doc.split("/").slice(0, -1);
  for (const part of p.split("/")) {
    if (part === "." || part === "") continue;
    if (part === "..") {
      if (out.length === 0) return null;
      out.pop();
    } else out.push(part);
  }
  return out.join("/");
}

/** Decode the entities that matter here — `&lt;date&gt;` is a placeholder, not a path. */
function decodeEntities(s) {
  return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}

/**
 * Pull every checkable citation out of one document.
 * Yields `{ line, raw, kind, candidates }` where `candidates` is the set of
 * repo-relative paths any one of which resolving counts as a pass.
 */
const FENCE = /^\s{0,3}(`{3,}|~{3,})/;

export function extractCitations(doc, text) {
  const isHtml = doc.endsWith(".html");
  const out = [];
  let fence = null; // the opening delimiter while inside a fenced block
  text.split("\n").forEach((line, i) => {
    if (!isHtml) {
      const m = line.match(FENCE);
      if (fence) {
        // Only a delimiter at least as long as the opener closes the block.
        if (m && m[1][0] === fence[0] && m[1].length >= fence.length) fence = null;
        return;
      }
      if (m) {
        fence = m[1];
        return;
      }
    }
    const raws = [];
    if (isHtml) {
      for (const m of line.matchAll(HTML_CODE)) raws.push(["code", decodeEntities(m[1])]);
      for (const m of line.matchAll(HTML_ATTR)) raws.push(["link", decodeEntities(m[1])]);
    } else {
      for (const m of line.matchAll(MD_CODE_SPAN)) raws.push(["code", m[1]]);
      for (const m of line.matchAll(MD_LINK)) raws.push(["link", m[1]]);
      const ref = line.match(MD_REF_DEF);
      if (ref) raws.push(["link", ref[1]]);
    }
    for (const [kind, raw] of raws) {
      const norm = normalizeToken(raw);
      if (norm === null) continue;
      // `./`/`../` code spans are ambiguous (shell cwd / module specifier).
      if (kind === "code" && norm.relative) continue;
      const candidates = [];
      if (norm.relative) {
        const r = resolveRelative(doc, norm.path);
        if (r !== null) candidates.push(r);
      } else {
        candidates.push(norm.path); // repo-root-relative reading
        if (kind === "link") {
          const r = resolveRelative(doc, norm.path); // markdown's own reading
          if (r !== null && r !== norm.path) candidates.push(r);
        }
      }
      if (candidates.length === 0) {
        // Every reading escapes the repository root — a cross-checkout reach.
        out.push({ line: i + 1, raw, kind, candidates: [], escapes: true });
        continue;
      }
      out.push({ line: i + 1, raw, kind, candidates, escapes: false });
    }
  });
  return out;
}

// --- the gate --------------------------------------------------------------

function isDenied(p) {
  return REPO_TOP_LEVEL_DENY.some((d) => p === d.replace(/\/$/, "") || p.startsWith(d));
}

/** Which documents this gate scans. */
export function scannedDocs(trackedFiles) {
  return [...trackedFiles].filter((f) =>
    (f.startsWith("docs/") && (f.endsWith(".md") || f.endsWith(".html"))) || f === "CLAUDE.md"
  ).sort();
}

export async function findDanglingCitations(tree, docs, readDoc) {
  const findings = [];
  const seen = new Set();
  for (const doc of docs) {
    const text = await readDoc(doc);
    if (text === null) continue; // tracked but deleted in the working tree
    for (const c of extractCitations(doc, text)) {
      const report = (resolved) => {
        const key = `${doc}\t${c.line}\t${resolved}`;
        if (seen.has(key)) return; // same citation twice on one line
        seen.add(key);
        findings.push({ doc, line: c.line, raw: c.raw, resolved });
      };
      if (c.escapes) {
        report("(escapes the repository root)");
        continue;
      }
      // A denied prefix is checked even though it is not anchored: it can
      // never resolve, and that is exactly why a new one must fail.
      const denied = c.candidates.some(isDenied);
      const anchored = c.candidates.some((p) => tree.topLevel.has(p.split("/")[0]));
      if (!denied && !anchored) continue;
      const resolves = c.candidates.some((p) => tree.files.has(p) || tree.dirs.has(p));
      if (resolves) continue;
      // Report the reading that made this checkable, not the first one tried.
      report(c.candidates.find((p) => isDenied(p) || tree.topLevel.has(p.split("/")[0])));
    }
  }
  return findings;
}

// --- frozen census ---------------------------------------------------------
//
// The exemption is resolved by AGE, mechanically. See ledger.md amendment (2):
// generated once, matched on the exact (file, path) pair, NEVER appended to.
// It can only shrink — as historical documents are edited or retired — never
// grow. A blanket prefix exemption is the mechanism by which an exemption list
// becomes the bug; this one cannot become that.

export function parseCensus(text) {
  const pairs = new Set();
  for (const line of text.split("\n")) {
    if (!line || line.startsWith("#")) continue;
    const [file, path] = line.split("\t");
    if (file && path !== undefined) pairs.add(`${file}\t${path}`);
  }
  return pairs;
}

const CENSUS_HEADER = `# Frozen citation census — closure of D-2607-D3NL
#
# Generated ONCE on 2026-07-25 by scripts/check-cited-paths.js --census, from
# the committed content of HEAD @COMMIT@, as the buildable half of the
# operator's disposition on ledger row L-8b of slice
# \`docs/design-v0.6.0/02-artifact-homes/\`: option (a), ACCEPT AND MARK. The
# historical corpus is not salvaged, not repointed.
#
# This is a HISTORICAL RECORD, not a config. Every pair below is a citation
# that already existed when the gate was built. Reading it as a backlog of
# unfixed work would be a misreading: these were accepted, with rationale.
#
# ** NEVER APPEND TO THIS FILE. **
#
# A new dangling citation cannot be silenced by adding a line here — and if
# someone does, the diff says so in review, which is the whole point. The file
# is self-closing: it shrinks as historical documents are edited or retired,
# and it can never grow. Contrast the blanket allowlist the original L-8
# imagined, which grows every time someone finds it inconvenient.
#
# Format: <citing file>\\t<cited path>
`;

// --- CLI -------------------------------------------------------------------

const GREEN = "\x1b[1;32m", RED = "\x1b[1;31m", YELLOW = "\x1b[1;33m", RESET = "\x1b[0m";

// The gate reads the WORKING TREE, so that breakage surfaces before the commit
// that would bake it in. The census reads HEAD, because it is a reproducible
// historical record of one commit — an in-flight edit in someone else's
// checkout must not silently become an accepted exemption.
async function readWorkingTree(doc) {
  try {
    return await Deno.readTextFile(doc);
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) return null;
    throw e;
  }
}

async function readAtHead(doc) {
  return await git("show", `HEAD:${doc}`);
}

if (import.meta.main) {
  const wantCensus = Deno.args.includes("--census");
  // `--census-file=` exists so the gate can be exercised from another branch's
  // checkout (ledger L-7 requires a two-branch run) without that branch having
  // to carry the snapshot yet. `make check` never passes it.
  const censusPath = Deno.args.find((a) => a.startsWith("--census-file="))
    ?.slice("--census-file=".length) ?? CENSUS_PATH;
  const tree = await treeAtHead();
  const docs = scannedDocs(tree.files);

  if (wantCensus) {
    const atHead = await findDanglingCitations(tree, docs, readAtHead);
    const commit = (await git("rev-parse", "HEAD")).trim();
    const pairs = [...new Set(atHead.map((f) => `${f.doc}\t${f.resolved}`))].sort();
    const header = CENSUS_HEADER.replace("@COMMIT@", commit);
    await Deno.stdout.write(new TextEncoder().encode(header + pairs.join("\n") + "\n"));
    Deno.exit(0);
  }

  const findings = await findDanglingCitations(tree, docs, readWorkingTree);

  let census = new Set();
  try {
    census = parseCensus(await Deno.readTextFile(censusPath));
  } catch (e) {
    if (!(e instanceof Deno.errors.NotFound)) throw e;
  }

  const live = findings.filter((f) => !census.has(`${f.doc}\t${f.resolved}`));
  const branch = (await git("rev-parse", "--abbrev-ref", "HEAD")).trim();

  if (live.length === 0) {
    console.log(
      `${GREEN}✓ Cited-path check passed${RESET} ` +
        `(${docs.length} documents on ${branch}; ${census.size} historical citations accepted via ${censusPath})`,
    );
    Deno.exit(0);
  }

  console.error(`${RED}✗ Dangling citations — a tracked document cites a path that does not resolve in git on ${branch}${RESET}`);
  console.error("");
  for (const f of live) {
    console.error(`  ${f.doc}:${f.line}  ${YELLOW}${f.raw}${RESET}  →  ${f.resolved} (not in git at HEAD)`);
  }
  console.error("");
  console.error(`${RED}${live.length} dangling citation${live.length === 1 ? "" : "s"}.${RESET}`);
  console.error(
    "A cited path is a claim. Fix the path, give the target a tracked home, or —\n" +
      "if it lives on another branch — get it onto this one. Do NOT append to\n" +
      `${censusPath}: that file is a frozen historical record, not an allowlist.`,
  );
  Deno.exit(1);
}
