/**
 * @module shake-experiment
 *
 * Tree-shake experiment for the 01-treeshake-audit slice (ledger F-6).
 *
 * Bundles the compiled two-module app fixture with esbuild
 * (`bundle + treeShaking + metafile`, mirroring the pattern already used by
 * `build_browser_bundle` in crates/lykn-cli/src/main.rs) and writes the
 * evidence artifacts. Interpretation of results is CDC's job — this script
 * only produces the evidence.
 *
 * Run from the repo root (esbuild needs net+run on first resolution):
 *
 *   deno run --allow-read --allow-write --allow-env --allow-net --allow-run \
 *     docs/design-v0.7.0/01-treeshake-audit/scripts/shake-experiment.js [compiledDir]
 *
 * `compiledDir` defaults to the P1 output for the default emission path.
 */
import * as esbuild from "npm:esbuild";

const AUDIT = "docs/design-v0.7.0/01-treeshake-audit";
const compiledDir = Deno.args[0] ?? `${AUDIT}/evidence/compiled/default`;
const evidenceDir = `${AUDIT}/evidence`;
const entry = `${compiledDir}/app-main.js`;

/**
 * Run one esbuild pass and return its metafile.
 *
 * @param {string} outfile Output bundle path.
 * @param {boolean} minify Whether to minify.
 * @returns {Promise<object>} The esbuild metafile for the pass.
 */
async function bundle(outfile, minify) {
  const result = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    format: "esm",
    treeShaking: true,
    metafile: true,
    minify,
    outfile,
    logLevel: "warning",
  });
  return result.metafile;
}

try {
  await Deno.stat(entry);
} catch (err) {
  throw new Error(
    `Entry not found: ${entry} — run phase P1 (fixture compile) first`,
    { cause: err },
  );
}

const metafile = await bundle(`${evidenceDir}/bundle.js`, false);
await bundle(`${evidenceDir}/bundle.min.js`, true);

await Deno.writeTextFile(
  `${evidenceDir}/metafile.json`,
  JSON.stringify(metafile, null, 2),
);

const analysis = await esbuild.analyzeMetafile(metafile, { verbose: true });
await Deno.writeTextFile(
  `${evidenceDir}/analyze.txt`,
  `esbuild version: ${esbuild.version}\nentry: ${entry}\n\n${analysis}`,
);

console.log(`esbuild ${esbuild.version}`);
console.log(`wrote ${evidenceDir}/bundle.js, bundle.min.js, metafile.json, analyze.txt`);
esbuild.stop();
