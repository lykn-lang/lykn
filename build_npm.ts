/**
 * Build the npm package from the Deno source.
 * Run with: deno run -A build_npm.ts
 *
 * Since lykn is plain JS (not TypeScript), we don't need dnt —
 * just copy files and generate package.json.
 */

// Read version from package config
const denoConfig = JSON.parse(
  await Deno.readTextFile("packages/lykn/deno.json"),
);

// Clean and create output directory
try {
  await Deno.remove("dist/npm", { recursive: true });
} catch {
  // ignore if doesn't exist
}
await Deno.mkdir("dist/npm", { recursive: true });

// Copy source files
const sourceFiles = [
  "mod.js",
  "reader.js",
  "compiler.js",
  "expander.js",
  "surface.js",
  "browser.js",
];

for (const file of sourceFiles) {
  await Deno.copyFile(`packages/lykn/${file}`, `dist/npm/${file}`);
}

// Fix the astring import — npm users get it from node_modules
// Replace bare "astring" import (which Deno resolves via import map)
// with the npm package name (which is already "astring")
// No change needed — the bare import works in both environments.

// Generate package.json
const packageJson = {
  name: "@lykn/lykn",
  version: denoConfig.version,
  description:
    "S-expression syntax for JavaScript. A lightweight Lisp that compiles to clean JS.",
  type: "module",
  main: "./mod.js",
  exports: {
    ".": "./mod.js",
    "./reader": "./reader.js",
    "./compiler": "./compiler.js",
    "./expander": "./expander.js",
  },
  files: ["*.js", "README.md", "LICENSE"],
  keywords: [
    "lisp",
    "s-expression",
    "compiler",
    "javascript",
    "estree",
    "sexp",
    "lykn",
  ],
  author: "Duncan McGreggor",
  license: "Apache-2.0",
  repository: {
    type: "git",
    url: "https://github.com/oxur/lykn",
  },
  dependencies: {
    astring: "^1.9.0",
  },
};

await Deno.writeTextFile(
  "dist/npm/package.json",
  JSON.stringify(packageJson, null, 2) + "\n",
);

// Copy README and LICENSE
await Deno.copyFile("README.md", "dist/npm/README.md");
await Deno.copyFile("LICENSE", "dist/npm/LICENSE");

console.log(`\nnpm package built in dist/npm/ (v${denoConfig.version})`);
console.log("To publish: cd dist/npm && npm publish --access public");
