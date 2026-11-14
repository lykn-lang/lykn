import {lykn} from "file:///Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/packages/lang/mod.js";
const source = "(func take :args ((array :number first (rest :number tail))) :body first) (console:log (take (array 1 2)))";
const output = lykn(source);
console.log(output);
await Deno.writeTextFile("/private/tmp/lykn-public-discard-design/nested-rest-output.mjs", output);
