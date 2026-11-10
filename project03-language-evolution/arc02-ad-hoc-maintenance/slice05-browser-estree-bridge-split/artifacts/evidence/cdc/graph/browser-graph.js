import {build, stop} from "npm:esbuild@^0.27";
const sourceRoot = Deno.cwd();
const bridgePath = Deno.args[0];
function resolveLanguage(request) {
  return request.path === "lang/expander.js" && request.importer === sourceRoot + "/packages/browser/compiler.js" ? { path: sourceRoot + "/packages/lang/expander-browser.js" } : { path: sourceRoot + "/packages/lang/" + request.path.slice(5) };
}
function resolveBridge(request) {
  if (!(bridgePath === "") && request.importer === sourceRoot + "/packages/lang/compiler.js") {
    return { path: sourceRoot + "/packages/lang/" + bridgePath };
  }
}
function setup(builder) {
  builder.onResolve({ filter: new RegExp("^lang/") }, resolveLanguage);
  return builder.onResolve({ filter: new RegExp("^\\./host-invocation\\.js$") }, resolveBridge);
}
const result = await build({ entryPoints: ["packages/browser/mod.js"], bundle: true, format: "iife", globalName: "lykn", alias: { astring: "/Users/oubiwann/Library/Caches/deno/npm/registry.npmjs.org/astring/1.9.0" }, plugins: [{ name: "lykn-import-map", setup: setup }], minify: true, metafile: true, write: false });
const output = result.outputFiles[0];
Deno.writeFileSync(Deno.args[1], output.contents);
Deno.writeTextFileSync(Deno.args[2], JSON.stringify(result.metafile, null, 2));
stop();
