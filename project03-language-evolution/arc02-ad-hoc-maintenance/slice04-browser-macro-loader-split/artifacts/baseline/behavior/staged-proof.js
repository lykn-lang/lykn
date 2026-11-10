import {compile, run, load} from "@lykn/browser";
globalThis["fetch"] = url => Promise.resolve(new Response(url.endsWith(".lyk") ? "(const value 19) value" : "(bind value 23) value"));
const pending = load("controlled.lyk");
const asyncLoad = typeof pending.then === "function";
console.log(JSON.stringify([compile("(import-macros \"./staged-proof-module.lykn\" (double)) (double 21)"), run("(+ 1 2)"), asyncLoad, await pending, await load("controlled.lykn")]));
