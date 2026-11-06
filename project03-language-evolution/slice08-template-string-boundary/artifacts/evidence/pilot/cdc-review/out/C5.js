// target/lykn/dist/json/value.js
function parseValue(text) {
  if (typeof text !== "string") throw new TypeError("parseValue: arg 'text' expected string, got " + typeof text);
  const result__gensym0 = JSON.parse(text);
  if (typeof result__gensym0 !== "object" || result__gensym0 === null) throw new TypeError("parseValue: return value expected object, got " + typeof result__gensym0);
  return result__gensym0;
}

// target/lykn/dist/json/file.js
function readText(path) {
  if (typeof path !== "string") throw new TypeError("readText: arg 'path' expected string, got " + typeof path);
  const result__gensym0 = Deno.readTextFileSync(path);
  if (typeof result__gensym0 !== "string") throw new TypeError("readText: return value expected string, got " + typeof result__gensym0);
  return result__gensym0;
}

// target/lykn/dist/json/document.js
function documentLabel(text) {
  if (typeof text !== "string") throw new TypeError("documentLabel: arg 'text' expected string, got " + typeof text);
  const result__gensym0 = `document:${text}`;
  if (typeof result__gensym0 !== "string") throw new TypeError("documentLabel: return value expected string, got " + typeof result__gensym0);
  return result__gensym0;
}

// target/lykn/dist/yaml/value.js
function parseYamlFixture(text) {
  if (typeof text !== "string") throw new TypeError("parseYamlFixture: arg 'text' expected string, got " + typeof text);
  if (!(text === "answer: 42")) throw new Error('parse-yaml-fixture: pre-condition failed: (= text "answer: 42") \u2014 caller blame');
  const result__gensym0 = { answer: 42 };
  if (typeof result__gensym0 !== "object" || result__gensym0 === null) throw new TypeError("parseYamlFixture: return value expected object, got " + typeof result__gensym0);
  return result__gensym0;
}

// target/lykn/dist/effects/effect.js
console.log("init:effect");

// target/lykn/dist/effects/used.js
function used(n) {
  if (typeof n !== "number" || Number.isNaN(n)) throw new TypeError("used: arg 'n' expected number, got " + typeof n);
  const result__gensym0 = n + 1;
  if (typeof result__gensym0 !== "number" || Number.isNaN(result__gensym0)) throw new TypeError("used: return value expected number, got " + typeof result__gensym0);
  return result__gensym0;
}

// target/lykn/dist/effects/dead.js
function unusedPure(n) {
  if (typeof n !== "number" || Number.isNaN(n)) throw new TypeError("unusedPure: arg 'n' expected number, got " + typeof n);
  const result__gensym0 = n * 2;
  if (typeof result__gensym0 !== "number" || Number.isNaN(result__gensym0)) throw new TypeError("unusedPure: return value expected number, got " + typeof result__gensym0);
  return result__gensym0;
}

// target/lykn/dist/controls/c5.js
var raw = readText(Deno.args[0]);
var object = { jsonRoot: parseValue(raw), jsonValue: parseValue(raw), fileRoot: raw, fileValue: readText(Deno.args[0]), documentRoot: documentLabel(raw), documentValue: documentLabel(raw), yamlRoot: parseYamlFixture("answer: 42"), yamlValue: parseYamlFixture("answer: 42"), usedRoot: used(41), usedValue: used(41), deadRoot: unusedPure(41), deadValue: unusedPure(41) };
console.log(JSON.stringify(object));
