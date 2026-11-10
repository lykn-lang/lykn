import {read} from "@lykn/lang/reader.js";
import {expand, resetMacros, resetModuleCache} from "@lykn/lang/expander.js";
import {compile} from "@lykn/lang/compiler.js";
const macroPath = "./warm-fixture/witness.lykn";
const mtime = new Date(0);
function writeModule(body) {
  if (typeof body !== "string") {
    throw new TypeError("writeModule: arg 'body' expected string, got " + typeof body);
  }
  Deno.writeTextFileSync(macroPath, body);
  return Deno.utimeSync(macroPath, mtime, mtime);
}
function witness() {
  resetMacros();
  return compile(expand(read("(import-macros \"./warm-fixture/witness.lykn\" (twice)) (twice 21)"), { filePath: Deno.cwd() + "/staged-warm.lykn" }));
}
resetModuleCache();
writeModule("(export (macro twice (x) `(+ ,x ,x)))");
const cold = witness();
writeModule("(export (macro twice (x) `(+ ,x 3)))");
const warm = witness();
resetModuleCache();
const reset = witness();
console.log(JSON.stringify([cold, warm, reset]));
