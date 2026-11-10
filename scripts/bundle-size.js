// Bundle-size measurement script for DD-37 Phase 0.
// Produces raw / minified / gzipped numbers for the full @lykn/browser payload.
// Invoked via: deno run -A --config project.json scripts/bundle-size.js

import * as esbuild from "npm:esbuild@^0.27";

const astringMeta = import.meta.resolve("astring");
const astringPkg = astringMeta.replace("file://", "").replace(/\/dist\/.*$/, "");

const nodePathShimPlugin = {
  name: "node-path-shim",
  setup(build) {
    build.onResolve({ filter: /^node:path$/ }, () => ({
      path: "node:path", namespace: "node-path-shim",
    }));
    build.onLoad({ filter: /.*/, namespace: "node-path-shim" }, () => ({
      contents: `
        export function resolve() { throw new Error("import-macros not available in browser"); }
        export function dirname() { throw new Error("import-macros not available in browser"); }
      `, loader: "js",
    }));
  },
};

const lyknImportPlugin = {
  name: "lykn-import-map",
  setup(build) {
    build.onResolve({ filter: /^lang\// }, (args) => {
      if (args.path === "lang/expander.js" &&
          args.importer === Deno.cwd() + "/packages/browser/compiler.js") {
        const browserExpander = Deno.cwd() + "/packages/lang/expander-browser.js";
        try {
          Deno.statSync(browserExpander);
          return { path: browserExpander };
        } catch (error) {
          if (!(error instanceof Deno.errors.NotFound)) throw error;
          /* legacy source tree: retain the historical expander route */
        }
      }
      const rel = args.path.replace(/^lang\//, "packages/lang/");
      return { path: Deno.cwd() + "/" + rel };
    });
    build.onResolve({ filter: /^\.\/host-invocation\.js$/ }, (args) => {
      if (args.importer !== Deno.cwd() + "/packages/lang/compiler.js") return;
      const browserInvocation = Deno.cwd() + "/packages/lang/host-invocation-browser.js";
      try {
        Deno.statSync(browserInvocation);
        return { path: browserInvocation };
      } catch (error) {
        if (!(error instanceof Deno.errors.NotFound)) throw error;
        /* historical source tree: retain the private invocation bridge */
      }
    });
  },
};

const shared = {
  entryPoints: ["packages/browser/mod.js"],
  bundle: true,
  format: "iife",
  globalName: "lykn",
  alias: { "astring": astringPkg },
  plugins: [nodePathShimPlugin, lyknImportPlugin],
  write: false,
};

// Build unminified (raw)
const rawResult = await esbuild.build({ ...shared, minify: false });
const rawBytes = rawResult.outputFiles[0].contents;

// Build minified
const minResult = await esbuild.build({ ...shared, minify: true });
const minBytes = minResult.outputFiles[0].contents;

// Gzip the minified output
const gzStream = new CompressionStream("gzip");
const writer = gzStream.writable.getWriter();
writer.write(minBytes);
writer.close();
const gzChunks = [];
const reader = gzStream.readable.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  gzChunks.push(value);
}
const gzBytes = new Uint8Array(gzChunks.reduce((a, c) => a + c.length, 0));
let offset = 0;
for (const chunk of gzChunks) {
  gzBytes.set(chunk, offset);
  offset += chunk.length;
}

const rawKB = (rawBytes.length / 1024).toFixed(1);
const minKB = (minBytes.length / 1024).toFixed(1);
const gzKB = (gzBytes.length / 1024).toFixed(1);

console.log(`Raw:      ${rawBytes.length} bytes (${rawKB} KB)`);
console.log(`Minified: ${minBytes.length} bytes (${minKB} KB)`);
console.log(`Gzipped:  ${gzBytes.length} bytes (${gzKB} KB)`);

// Report the historical comparison and enforce the release budget in check mode.
const baseline = Deno.env.get("BASELINE_GZIPPED");
if (baseline) {
  const budgetBytes = 80 * 1024;
  const baselineBytes = parseInt(baseline, 10);
  const delta = gzBytes.length - baselineBytes;
  const deltaKB = (delta / 1024).toFixed(1);
  console.log(`\nBaseline: ${baselineBytes} bytes`);
  console.log(`Delta:    ${delta >= 0 ? "+" : ""}${delta} bytes (${delta >= 0 ? "+" : ""}${deltaKB} KB)`);
  if (gzBytes.length > budgetBytes) {
    console.error(`\n❌ HARD FAIL: gzipped bundle exceeds 80 KiB (${budgetBytes} bytes)`);
    esbuild.stop();
    Deno.exit(1);
  }
  console.log("\n✅ Within 80 KiB gzip budget");
}

esbuild.stop();
