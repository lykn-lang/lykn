const trace = [];
const shortCircuited = false && (trace.push("skipped"), true);
const once = true && (trace.push("once"), 9);
const args = Array.of((trace.push("argument"), 7));
const initialized = (trace.push("initializer"), 11);
console.log(JSON.stringify([shortCircuited, once, args, initialized, trace]));
