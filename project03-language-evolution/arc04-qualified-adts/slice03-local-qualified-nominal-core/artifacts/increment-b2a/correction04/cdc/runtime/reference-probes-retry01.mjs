import {compile, compileExpr} from "lang/compiler.js";
import {read} from "lang/reader.js";
import {hostReference as hostReference} from "lang/surface-helpers.js";
const home = Deno.args[0];
const references = Object.fromEntries([["OWN-Symbol", "Symbol"], ["OWN-SymbolFor", "SymbolFor"], ["OWN-ObjectFreeze", "ObjectFreeze"], ["OWN-ObjectDefineProperties", "ObjectDefineProperties"], ["OWN-NumberIsNaN", "NumberIsNaN"], ["OWN-ArrayIsArray", "ArrayIsArray"], ["OWN-Promise", "Promise"], ["OWN-TypeError", "TypeError"], ["OWN-Error", "Error"]]);
function replaceNode(node) {
  if (node.type === "atom" && Object.hasOwn(references, node.value)) {
    return hostReference(references[node.value]);
  }
  if (node.type === "list") {
    return { ...node, values: node.values.map(replaceNode) };
  }
  if (node.type === "cons") {
    return { ...node, car: replaceNode(node.car), cdr: replaceNode(node.cdr) };
  }
  return node;
}
const valuesSource = "(array (OWN-Symbol \"local\") (OWN-SymbolFor \"lykn.s03.a.review\") (OWN-ObjectFreeze (object (field 7))) (OWN-ObjectDefineProperties (object) (object (field (object (value 8) (enumerable true))))) (OWN-NumberIsNaN NaN) (OWN-ArrayIsArray (array 1)) (new OWN-Promise (=> (resolve) (resolve 9))) (new OWN-TypeError \"typed\") (new OWN-Error \"error\"))";
const roots = "Symbol Object Number Array Promise TypeError Error";
const shadow = "(const Symbol 0) (const Object 0) (const Number 0) (const Array 0) (const Promise 0) (const TypeError 0) (const Error 0)";
const scenarios = [{ name: "unshadowed", source: "\"use strict\" (const observed " + valuesSource + ") (export (names observed))" }, { name: "module-shadowed", source: "\"use strict\" " + shadow + " (const observed " + valuesSource + ") (export (names observed))" }, { name: "parameter-shadowed", source: "\"use strict\" (function run (" + roots + ") (return " + valuesSource + ")) (const observed (run 0 0 0 0 0 0 0)) (export (names observed))" }];
const results = [];
for (const scenario of scenarios) {
  const parsed = read(scenario.source);
  const forms = parsed.map(replaceNode);
  const generated = compile(forms);
  const path = home + "/" + scenario.name + ".js";
  Deno.writeTextFileSync(path, generated);
  const module = await import("file://" + path);
  const values = module.observed;
  const checks = [typeof values[0] === "symbol", values[1] === Symbol.for("lykn.s03.a.review"), Object.isFrozen(values[2]) && values[2]["field"] === 7, Object.getOwnPropertyDescriptor(values[3], "field")["value"] === 8, values[4] === true, values[5] === true, values[6] instanceof Promise && await values[6] === 9, values[7] instanceof TypeError && values[7]["message"] === "typed", values[8] instanceof Error && values[8]["message"] === "error"];
  results.push({ name: scenario.name, checks: checks });
  if (!checks.every(value => value)) {
    throw new Error("reference runtime mismatch: " + scenario.name);
  }
}
const fragments = ["OWN-Symbol", "(OWN-Symbol \"x\")", "(new OWN-TypeError \"failure\")"];
for (const source of fragments) {
  const node = replaceNode(read(source)[0]);
  try {
    compileExpr(node);
    results.push({ fragment: source, rejected: false });
  } catch (problem) {
    results.push({ fragment: source, rejected: true, message: problem.message });
  }
}
const repeated = hostReference("SymbolFor");
try {
  const generated = compile([{ type: "list", values: [repeated, { type: "string", value: "a" }] }, { type: "list", values: [repeated, { type: "string", value: "b" }] }]);
  results.push({ sharedReferenceNode: "compiled", output: generated });
} catch (problem) {
  results.push({ sharedReferenceNode: "rejected", message: problem.message });
}
Deno.writeTextFileSync(home + "/reference-results.json", JSON.stringify(results, null, 2));
const fragmentResults = results.filter(row => Object.hasOwn(row, "fragment"));
if (!(fragmentResults.length === 3 && fragmentResults.every(row => row.rejected))) {
  throw new Error("private fragment rejection mismatch");
}
const sharedResult = results.find(row => Object.hasOwn(row, "sharedReferenceNode"));
if (sharedResult["sharedReferenceNode"] !== "compiled") {
  throw new Error("shared private identity failed");
}
console.log(JSON.stringify(results, null, 2));
