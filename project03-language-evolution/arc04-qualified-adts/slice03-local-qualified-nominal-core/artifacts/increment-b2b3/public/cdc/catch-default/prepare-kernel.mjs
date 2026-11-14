import {lykn} from "file:///Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/packages/lang/mod.js";
const evidence = "/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/arc04-qualified-adts/slice03-local-qualified-nominal-core/artifacts/increment-b2b3/public/cdc/catch-default/";
const positive = await Deno.readTextFile(evidence + "positive-kernel.lykn");
await Deno.writeTextFile(evidence + "positive-kernel.mjs", lykn(positive));
const negative = await Deno.readTextFile(evidence + "reserved-kernel.lykn");
const compiled = { value: false };
try {
  const output = lykn(negative);
  await Deno.writeTextFile(evidence + "reserved-kernel.mjs", output);
  compiled.value = true;
} catch (problem) {
  console.log(problem.message);
}
console.log("negativeCompiled", compiled.value);
