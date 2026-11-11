const root = "/private/tmp/lykn-at02-cdc-final.XeqVk0cQ";
function ensure(pass, message) {
  if (typeof pass !== "boolean") {
    throw new TypeError("ensure: arg 'pass' expected boolean, got " + typeof pass);
  }
  if (typeof message !== "string") {
    throw new TypeError("ensure: arg 'message' expected string, got " + typeof message);
  }
  if (!pass) {
    throw new Error(message);
  }
}
function readText(path) {
  if (typeof path !== "string") {
    throw new TypeError("readText: arg 'path' expected string, got " + typeof path);
  }
  const result__gensym0 = Deno.readTextFileSync(`${root}/${path}`);
  if (typeof result__gensym0 !== "string") {
    throw new TypeError("readText: return value expected string, got " + typeof result__gensym0);
  }
  return result__gensym0;
}
function equalValue(actual, expected, label) {
  if (typeof label !== "string") {
    throw new TypeError("equalValue: arg 'label' expected string, got " + typeof label);
  }
  ensure(JSON.stringify(actual) === JSON.stringify(expected), `wrong value: ${label}`);
}
function observations(cell, count) {
  if (typeof cell !== "string") {
    throw new TypeError("observations: arg 'cell' expected string, got " + typeof cell);
  }
  if (typeof count !== "number" || Number.isNaN(count)) {
    throw new TypeError("observations: arg 'count' expected number, got " + typeof count);
  }
  const text = readText(`logs/${cell}/stdout.raw`);
  const trimmed = text.trimEnd();
  const lines = trimmed.split("\n");
  ensure(lines.length === count, `line count ${cell}`);
  const values = new Map();
  for (const line of lines) {
    const split = line.indexOf(" ");
    ensure(split > 0, "missing observation label");
    const label = line.slice(0, split);
    ensure(!values.has(label), `duplicate observation ${label}`);
    values.set(label, JSON.parse(line.slice(split + 1)));
  }
  return values;
}
function jNumber(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new TypeError("jNumber: arg 'value' expected number, got " + typeof value);
  }
  const result__gensym1 = { tag: "JNumber", value: value };
  if (typeof result__gensym1 !== "object" || result__gensym1 === null) {
    throw new TypeError("jNumber: return value expected object, got " + typeof result__gensym1);
  }
  return result__gensym1;
}
function decoded(value) {
  const result__gensym2 = { tag: "Decoded", value: value };
  if (typeof result__gensym2 !== "object" || result__gensym2 === null) {
    throw new TypeError("decoded: return value expected object, got " + typeof result__gensym2);
  }
  return result__gensym2;
}
function rejected(failure) {
  const result__gensym3 = { tag: "Rejected", failure: failure };
  if (typeof result__gensym3 !== "object" || result__gensym3 === null) {
    throw new TypeError("rejected: return value expected object, got " + typeof result__gensym3);
  }
  return result__gensym3;
}
function some(value) {
  const result__gensym4 = { tag: "Some", value: value };
  if (typeof result__gensym4 !== "object" || result__gensym4 === null) {
    throw new TypeError("some: return value expected object, got " + typeof result__gensym4);
  }
  return result__gensym4;
}
function wrong(path, expected) {
  if (typeof path !== "string") {
    throw new TypeError("wrong: arg 'path' expected string, got " + typeof path);
  }
  if (typeof expected !== "string") {
    throw new TypeError("wrong: arg 'expected' expected string, got " + typeof expected);
  }
  const result__gensym5 = rejected({ tag: "WrongValue", path: path, expected: expected });
  if (typeof result__gensym5 !== "object" || result__gensym5 === null) {
    throw new TypeError("wrong: return value expected object, got " + typeof result__gensym5);
  }
  return result__gensym5;
}
function config(port, label) {
  if (typeof port !== "number" || Number.isNaN(port)) {
    throw new TypeError("config: arg 'port' expected number, got " + typeof port);
  }
  const result__gensym6 = decoded({ tag: "ServerConfig", port: port, label: label });
  if (typeof result__gensym6 !== "object" || result__gensym6 === null) {
    throw new TypeError("config: return value expected object, got " + typeof result__gensym6);
  }
  return result__gensym6;
}
function checkDecoder(cell) {
  if (typeof cell !== "string") {
    throw new TypeError("checkDecoder: arg 'cell' expected string, got " + typeof cell);
  }
  const got = observations(cell, 40);
  const expected = [["J02-null", decoded({ tag: "JNull" })], ["J02-bool", decoded({ tag: "JBoolean", value: false })], ["J02-number", decoded(jNumber(0))], ["J02-string", decoded({ tag: "JString", value: "" })], ["J02-array", decoded({ tag: "JArray", values: [] })], ["J02-object", decoded({ tag: "JObject", entries: [] })], ["J01-nested", decoded(JSON.parse("{\"tag\":\"JObject\",\"entries\":[{\"tag\":\"Entry\",\"key\":\"name\",\"value\":{\"tag\":\"JString\",\"value\":\"Ada\"}},{\"tag\":\"Entry\",\"key\":\"n\",\"value\":{\"tag\":\"JNumber\",\"value\":1}},{\"tag\":\"Entry\",\"key\":\"flags\",\"value\":{\"tag\":\"JArray\",\"values\":[{\"tag\":\"JBoolean\",\"value\":true},{\"tag\":\"JBoolean\",\"value\":false}]}},{\"tag\":\"Entry\",\"key\":\"nil\",\"value\":{\"tag\":\"JNull\"}}]}"))], ["L01-injected-undefined", wrong("$[1]", "JSON value")], ["J07-raw-own-undefined-label", wrong("$[\"label\"]", "JSON value")], ["port-0", config(0, { tag: "LabelMissing" })], ["port-max", config(65535, { tag: "LabelMissing" })], ["port-negative", rejected({ tag: "InvalidPort", path: "server.port", value: -1 })], ["port-too-large", rejected({ tag: "InvalidPort", path: "server.port", value: 65536 })], ["port-fraction", rejected({ tag: "InvalidPort", path: "server.port", value: 1.5 })], ["port-string", wrong("server.port", "integer 0..65535")], ["port-missing", rejected({ tag: "MissingField", path: "server.port" })], ["port-null", wrong("server.port", "integer 0..65535")], ["label-missing", config(8080, { tag: "LabelMissing" })], ["label-null", config(8080, { tag: "LabelNull" })], ["label-empty", config(0, { tag: "LabelText", value: "" })], ["label-text", config(8080, { tag: "LabelText", value: "edge" })], ["label-false", wrong("label", "string or null")], ["label-zero", wrong("label", "string or null")], ["label-own-undefined-present", some({ tag: "JUndefined" })], ["label-own-undefined-result", wrong("label", "string or null")]];
  for (const pair of expected) {
    equalValue(got.get(pair[0]), pair[1], pair[0]);
  }
  const keys = ["first-name", "firstName", "", "a:b", "a/b", "~", "__proto__", "constructor", "toString"];
  const entries = keys.map((key, index) => {
    if (typeof key !== "string") {
      throw new TypeError("anonymous: arg 'key' expected string, got " + typeof key);
    }
    if (typeof index !== "number" || Number.isNaN(index)) {
      throw new TypeError("anonymous: arg 'index' expected number, got " + typeof index);
    }
    return { tag: "Entry", key: key, value: jNumber(index) };
  });
  const keyObject = { tag: "JObject", entries: entries };
  equalValue(got.get("J08-exact-key-data"), decoded(keyObject), "all exact key data");
  const names = ["K02-first-name", "K03-firstName", "K04-empty", "K05-colon", "K06-slash", "K07-tilde", "K08-proto", "K09-constructor", "K10-toString"];
  for (const pair of names.entries()) {
    equalValue(got.get(pair[1]), some(jNumber(pair[0])), pair[1]);
  }
  const original = { tag: "JObject", entries: [...entries, { tag: "Entry", key: "nested", value: keyObject }] };
  const updatedInner = { tag: "JObject", entries: keys.map((key, index) => {
    if (typeof key !== "string") {
      throw new TypeError("anonymous: arg 'key' expected string, got " + typeof key);
    }
    if (typeof index !== "number" || Number.isNaN(index)) {
      throw new TypeError("anonymous: arg 'index' expected number, got " + typeof index);
    }
    return { tag: "Entry", key: key, value: jNumber(key === "__proto__" ? 55 : index) };
  }) };
  const updated = { tag: "JObject", entries: [...entries, { tag: "Entry", key: "nested", value: updatedInner }] };
  equalValue(got.get("edit-original-alias"), original, "original nested alias byte-value");
  equalValue(got.get("edit-updated"), updated, "only nested exact proto key changes");
  equalValue(got.get("edit-alias-identity"), false, "distinct root identity");
  equalValue(got.get("edit-path-nested-proto"), some(jNumber(55)), "updated path");
  equalValue(got.get("edit-untouched-constructor"), some(jNumber(7)), "untouched sibling");
  console.log(cell, "40/40 exact observations");
}
for (const cell of ["decoder-run-default", "decoder-run-stripped", "decoder-public-run", "decoder-formatted-run-default", "decoder-formatted-run-stripped", "decoder-formatted-public-run"]) {
  checkDecoder(cell);
  ensure(readText(`logs/${cell}/stderr.raw`) === "", `${cell} stderr`);
}
for (const name of ["decoder", "controls", "zero-field-control"]) {
  ensure(readText(`case/${name}-formatted.lykn`) === readText(`case/${name}-formatted-again.lykn`), `${name} formatter idempotence`);
  for (const mode of ["default", "stripped"]) {
    ensure(readText(`logs/${name}-run-${mode}/stdout.raw`) === readText(`logs/${name}-formatted-run-${mode}/stdout.raw`), `${name} formatted runtime ${mode}`);
    ensure(readText(`case/target/${name}-${mode}.js`) === readText(`case/target/${name}-formatted-${mode}.js`), `${name} formatted native emitted ${mode}`);
  }
  ensure(readText(`logs/${name}-public-run/stdout.raw`) === readText(`logs/${name}-formatted-public-run/stdout.raw`), `${name} formatted public behavior`);
  ensure(readText(`public/target/${name}-public.js`) === readText(`public/target/${name}-formatted-public.js`), `${name} formatted public emitted`);
}
console.log("all 3 specimens formatter-idempotent, emitted-byte stable and runtime stable");
