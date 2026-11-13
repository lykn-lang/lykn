import {lykn} from "/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/packages/lang/mod.js";
const source = Deno.readTextFileSync(Deno.args[0]);
console.log(lykn(source));
