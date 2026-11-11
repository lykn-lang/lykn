import {lykn} from "lang/mod.js";
const source = Deno.readTextFileSync("probe.lykn");
console.log(lykn(source));
