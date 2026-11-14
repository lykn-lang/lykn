import {lykn} from "file:///Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/packages/lang/mod.js";
const source = "(bind :number value (Number 7)) (console:log value)";
const output = lykn(source);
console.log(output);
await Deno.writeTextFile("/private/tmp/lykn-public-discard-design/public-output.mjs", output);
