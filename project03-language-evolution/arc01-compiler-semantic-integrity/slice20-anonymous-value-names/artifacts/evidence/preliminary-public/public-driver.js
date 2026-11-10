import {lykn} from "./source/packages/lang/mod.js";
const inputPath = Deno.args[0];
const outputPath = Deno.args[1];
Deno.writeTextFileSync(outputPath, lykn(Deno.readTextFileSync(inputPath)));
