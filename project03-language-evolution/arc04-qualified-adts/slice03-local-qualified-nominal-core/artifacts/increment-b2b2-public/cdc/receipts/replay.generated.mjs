import {lykn, read, expandExpr, compileExpr} from "file:///Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/packages/lang/mod.js";
const selected = lykn("(bind _v0 \"owner\") (console:log (template \"{role, select, owner {Owner} other {Guest}}\" :role _v0))");
await Deno.writeTextFile("/private/tmp/lykn-b2b2-public-cdc/select-public.mjs", selected);
const form = read("(template \"{n} {n}\" :n (+ _n 1))")[0];
const first = compileExpr(expandExpr(form));
try {
  lykn("(template \"{n, plural, one {missing other}}\" :n _v0)");
} catch (problem) {
  console.log(problem.message.includes("missing required"));
}
const recovered = compileExpr(expandExpr(form));
const repeated = compileExpr(expandExpr(form));
console.log(first.type, recovered.type, repeated.type);
console.log(JSON.stringify(first) === JSON.stringify(recovered), JSON.stringify(recovered) === JSON.stringify(repeated));
console.log(JSON.stringify(recovered));
