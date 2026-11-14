import {lykn, read, expandExpr, compileExpr} from "file:///Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/packages/lang/mod.js";
const evidence = "/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/arc04-qualified-adts/slice03-local-qualified-nominal-core/artifacts/increment-b2b3/public/cdc/supplement/";
const positive = await Deno.readTextFile(evidence + "positive.lykn");
await Deno.writeTextFile(evidence + "positive.mjs", lykn(positive));
const exportsSource = await Deno.readTextFile(evidence + "exports.lykn");
await Deno.writeTextFile(evidence + "exports.mjs", lykn(exportsSource));
const badArray = await Deno.readTextFile(evidence + "bad-array.lykn");
await Deno.writeTextFile(evidence + "bad-array.mjs", lykn(badArray));
const badExport = await Deno.readTextFile(evidence + "bad-export.lykn");
await Deno.writeTextFile(evidence + "bad-export.mjs", lykn(badExport));
const badRest = await Deno.readTextFile(evidence + "bad-multi-rest.lykn");
await Deno.writeTextFile(evidence + "bad-multi-rest.mjs", lykn(badRest));
const firstFragment = expandExpr(read("(fn (:any _) _)")[0]);
const firstAst = compileExpr(firstFragment);
const failed = { value: false };
try {
  lykn("(func invalid :args (:number) :body 1)");
} catch (problem) {
  failed.value = true;
}
const secondFragment = expandExpr(read("(fn (:any _) _)")[0]);
const secondAst = compileExpr(secondFragment);
const firstParam = firstAst.params[0];
console.log(failed.value, JSON.stringify(firstAst) === JSON.stringify(secondAst), firstAst.type, firstParam.name !== "_", firstAst.body.name);
