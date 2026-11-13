import {lykn} from "/tmp/lykn-b2a-cdc-e80/packages/lang/mod.js";
const source = Deno.readTextFileSync(Deno.args[0]);
console.log(lykn(source));
