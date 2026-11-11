const JNull = { tag: "JNull" };
function JBoolean(value) {
  if (typeof value !== "boolean") {
    throw new TypeError("JBoolean: field 'value' expected boolean, got " + typeof value);
  }
  return { tag: "JBoolean", value: value };
}
function JNumber(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new TypeError("JNumber: field 'value' expected number, got " + typeof value);
  }
  return { tag: "JNumber", value: value };
}
function JString(value) {
  if (typeof value !== "string") {
    throw new TypeError("JString: field 'value' expected string, got " + typeof value);
  }
  return { tag: "JString", value: value };
}
function JArray(values) {
  if (!Array.isArray(values)) {
    throw new TypeError("JArray: field 'values' expected array, got " + typeof values);
  }
  return { tag: "JArray", values: values };
}
function JObject(entries) {
  if (!Array.isArray(entries)) {
    throw new TypeError("JObject: field 'entries' expected array, got " + typeof entries);
  }
  return { tag: "JObject", entries: entries };
}
const JUndefined = { tag: "JUndefined" };
function Entry(key, value) {
  if (typeof key !== "string") {
    throw new TypeError("Entry: field 'key' expected string, got " + typeof key);
  }
  return { tag: "Entry", key: key, value: value };
}
function Some(value) {
  return { tag: "Some", value: value };
}
const None = { tag: "None" };
function WrongValue(path, expected) {
  if (typeof path !== "string") {
    throw new TypeError("WrongValue: field 'path' expected string, got " + typeof path);
  }
  if (typeof expected !== "string") {
    throw new TypeError("WrongValue: field 'expected' expected string, got " + typeof expected);
  }
  return { tag: "WrongValue", path: path, expected: expected };
}
function MissingField(path) {
  if (typeof path !== "string") {
    throw new TypeError("MissingField: field 'path' expected string, got " + typeof path);
  }
  return { tag: "MissingField", path: path };
}
function InvalidPort(path, value) {
  if (typeof path !== "string") {
    throw new TypeError("InvalidPort: field 'path' expected string, got " + typeof path);
  }
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new TypeError("InvalidPort: field 'value' expected number, got " + typeof value);
  }
  return { tag: "InvalidPort", path: path, value: value };
}
function Decoded(value) {
  return { tag: "Decoded", value: value };
}
function Rejected(failure) {
  return { tag: "Rejected", failure: failure };
}
const LabelMissing = { tag: "LabelMissing" };
const LabelNull = { tag: "LabelNull" };
function LabelText(value) {
  if (typeof value !== "string") {
    throw new TypeError("LabelText: field 'value' expected string, got " + typeof value);
  }
  return { tag: "LabelText", value: value };
}
function ServerConfig(port, label) {
  if (typeof port !== "number" || Number.isNaN(port)) {
    throw new TypeError("ServerConfig: field 'port' expected number, got " + typeof port);
  }
  return { tag: "ServerConfig", port: port, label: label };
}
function decodeArray(raw, index, path, values) {
  if (!Array.isArray(raw)) {
    throw new TypeError("decodeArray: arg 'raw' expected array, got " + typeof raw);
  }
  if (typeof index !== "number" || Number.isNaN(index)) {
    throw new TypeError("decodeArray: arg 'index' expected number, got " + typeof index);
  }
  if (typeof path !== "string") {
    throw new TypeError("decodeArray: arg 'path' expected string, got " + typeof path);
  }
  if (!Array.isArray(values)) {
    throw new TypeError("decodeArray: arg 'values' expected array, got " + typeof values);
  }
  if (index === raw.length) {
    return Decoded(JArray(values));
  }
  {
    const target__gensym0 = decodeJson(raw[index], `${path}[${index}]`);
    let matched__gensym1 = false;
    if (!matched__gensym1 && target__gensym0.tag === "Rejected") {
      const failure = target__gensym0.failure;
      {
        matched__gensym1 = true;
        return Rejected(failure);
      }
    }
    if (!matched__gensym1 && target__gensym0.tag === "Decoded") {
      const value = target__gensym0.value;
      {
        matched__gensym1 = true;
        return decodeArray(raw, index + 1, path, [...values, value]);
      }
    }
    if (!matched__gensym1) {
      throw new Error("match: no matching pattern");
    }
  }
}
function decodeObject(pairs, index, path, entries) {
  if (!Array.isArray(pairs)) {
    throw new TypeError("decodeObject: arg 'pairs' expected array, got " + typeof pairs);
  }
  if (typeof index !== "number" || Number.isNaN(index)) {
    throw new TypeError("decodeObject: arg 'index' expected number, got " + typeof index);
  }
  if (typeof path !== "string") {
    throw new TypeError("decodeObject: arg 'path' expected string, got " + typeof path);
  }
  if (!Array.isArray(entries)) {
    throw new TypeError("decodeObject: arg 'entries' expected array, got " + typeof entries);
  }
  if (index === pairs.length) {
    return Decoded(JObject(entries));
  }
  {
    const target__gensym2 = decodeJson(pairs[index][1], `${path}[${JSON.stringify(pairs[index][0])}]`);
    let matched__gensym3 = false;
    if (!matched__gensym3 && target__gensym2.tag === "Rejected") {
      const failure = target__gensym2.failure;
      {
        matched__gensym3 = true;
        return Rejected(failure);
      }
    }
    if (!matched__gensym3 && target__gensym2.tag === "Decoded") {
      const value = target__gensym2.value;
      {
        matched__gensym3 = true;
        return decodeObject(pairs, index + 1, path, [...entries, Entry(pairs[index][0], value)]);
      }
    }
    if (!matched__gensym3) {
      throw new Error("match: no matching pattern");
    }
  }
}
function decodeJson(raw, path) {
  if (typeof path !== "string") {
    throw new TypeError("decodeJson: arg 'path' expected string, got " + typeof path);
  }
  if (raw === null) {
    return Decoded(JNull);
  }
  if (typeof raw === "boolean") {
    return Decoded(JBoolean(raw));
  }
  if (typeof raw === "number") {
    return Decoded(JNumber(raw));
  }
  if (typeof raw === "string") {
    return Decoded(JString(raw));
  }
  if (Array.isArray(raw)) {
    return decodeArray(raw, 0, path, []);
  }
  if (typeof raw === "object") {
    return decodeObject(Object.entries(raw), 0, path, []);
  }
  return Rejected(WrongValue(path, "JSON value"));
}
function lookup(entries, key) {
  if (!Array.isArray(entries)) {
    throw new TypeError("lookup: arg 'entries' expected array, got " + typeof entries);
  }
  if (typeof key !== "string") {
    throw new TypeError("lookup: arg 'key' expected string, got " + typeof key);
  }
  const found = entries.find(entry => entry.key === key);
  if (found === undefined) {
    return None;
  }
  return Some(found.value);
}
function decodePort(found, path) {
  if (typeof path !== "string") {
    throw new TypeError("decodePort: arg 'path' expected string, got " + typeof path);
  }
  {
    const target__gensym4 = found;
    let matched__gensym5 = false;
    if (!matched__gensym5 && target__gensym4.tag === "None") {
      {
        matched__gensym5 = true;
        return Rejected(MissingField(path));
      }
    }
    if (!matched__gensym5 && target__gensym4.tag === "Some") {
      const rawValue = target__gensym4.value;
      {
        matched__gensym5 = true;
        {
          const target__gensym6 = rawValue;
          let matched__gensym7 = false;
          if (!matched__gensym7 && target__gensym6.tag === "JNumber") {
            const value = target__gensym6.value;
            {
              matched__gensym7 = true;
              return (Number.isInteger(value) && value >= 0) && value <= 65535 ? Decoded(value) : Rejected(InvalidPort(path, value));
            }
          }
          if (!matched__gensym7) {
            {
              matched__gensym7 = true;
              return Rejected(WrongValue(path, "integer 0..65535"));
            }
          }
        }
      }
    }
    if (!matched__gensym5) {
      throw new Error("match: no matching pattern");
    }
  }
}
function decodeLabel(found) {
  {
    const target__gensym8 = found;
    let matched__gensym9 = false;
    if (!matched__gensym9 && target__gensym8.tag === "None") {
      {
        matched__gensym9 = true;
        return Decoded(LabelMissing);
      }
    }
    if (!matched__gensym9 && target__gensym8.tag === "Some") {
      const rawValue = target__gensym8.value;
      {
        matched__gensym9 = true;
        {
          const target__gensym10 = rawValue;
          let matched__gensym11 = false;
          if (!matched__gensym11 && target__gensym10.tag === "JNull") {
            {
              matched__gensym11 = true;
              return Decoded(LabelNull);
            }
          }
          if (!matched__gensym11 && target__gensym10.tag === "JString") {
            const value = target__gensym10.value;
            {
              matched__gensym11 = true;
              return Decoded(LabelText(value));
            }
          }
          if (!matched__gensym11) {
            {
              matched__gensym11 = true;
              return Rejected(WrongValue("label", "string or null"));
            }
          }
        }
      }
    }
    if (!matched__gensym9) {
      throw new Error("match: no matching pattern");
    }
  }
}
function decodeConfigPort(configEntries, serverEntries) {
  if (!Array.isArray(configEntries)) {
    throw new TypeError("decodeConfigPort: arg 'configEntries' expected array, got " + typeof configEntries);
  }
  if (!Array.isArray(serverEntries)) {
    throw new TypeError("decodeConfigPort: arg 'serverEntries' expected array, got " + typeof serverEntries);
  }
  {
    const target__gensym12 = decodePort(lookup(serverEntries, "port"), "server.port");
    let matched__gensym13 = false;
    if (!matched__gensym13 && target__gensym12.tag === "Rejected") {
      const failure = target__gensym12.failure;
      {
        matched__gensym13 = true;
        return Rejected(failure);
      }
    }
    if (!matched__gensym13 && target__gensym12.tag === "Decoded") {
      const port = target__gensym12.value;
      {
        matched__gensym13 = true;
        {
          const target__gensym14 = decodeLabel(lookup(configEntries, "label"));
          let matched__gensym15 = false;
          if (!matched__gensym15 && target__gensym14.tag === "Rejected") {
            const failure = target__gensym14.failure;
            {
              matched__gensym15 = true;
              return Rejected(failure);
            }
          }
          if (!matched__gensym15 && target__gensym14.tag === "Decoded") {
            const label = target__gensym14.value;
            {
              matched__gensym15 = true;
              return Decoded(ServerConfig(port, label));
            }
          }
          if (!matched__gensym15) {
            throw new Error("match: no matching pattern");
          }
        }
      }
    }
    if (!matched__gensym13) {
      throw new Error("match: no matching pattern");
    }
  }
}
function decodeConfigServer(configEntries) {
  if (!Array.isArray(configEntries)) {
    throw new TypeError("decodeConfigServer: arg 'configEntries' expected array, got " + typeof configEntries);
  }
  {
    const target__gensym16 = lookup(configEntries, "server");
    let matched__gensym17 = false;
    if (!matched__gensym17 && target__gensym16.tag === "None") {
      {
        matched__gensym17 = true;
        return Rejected(MissingField("server"));
      }
    }
    if (!matched__gensym17 && target__gensym16.tag === "Some") {
      const serverValue = target__gensym16.value;
      {
        matched__gensym17 = true;
        {
          const target__gensym18 = serverValue;
          let matched__gensym19 = false;
          if (!matched__gensym19 && target__gensym18.tag === "JObject") {
            const serverEntries = target__gensym18.entries;
            {
              matched__gensym19 = true;
              return decodeConfigPort(configEntries, serverEntries);
            }
          }
          if (!matched__gensym19) {
            {
              matched__gensym19 = true;
              return Rejected(WrongValue("server", "object"));
            }
          }
        }
      }
    }
    if (!matched__gensym17) {
      throw new Error("match: no matching pattern");
    }
  }
}
function decodeConfig(input) {
  {
    const target__gensym20 = input;
    let matched__gensym21 = false;
    if (!matched__gensym21 && target__gensym20.tag === "JObject") {
      const configEntries = target__gensym20.entries;
      {
        matched__gensym21 = true;
        return decodeConfigServer(configEntries);
      }
    }
    if (!matched__gensym21) {
      {
        matched__gensym21 = true;
        return Rejected(WrongValue("$", "object"));
      }
    }
  }
}
function runRawCase(name, raw) {
  if (typeof name !== "string") {
    throw new TypeError("runRawCase: arg 'name' expected string, got " + typeof name);
  }
  printValue(name, decodeJson(raw, "$"));
}
function printValue(name, value) {
  if (typeof name !== "string") {
    throw new TypeError("printValue: arg 'name' expected string, got " + typeof name);
  }
  console.log(name, JSON.stringify(value));
}
function runConfigCase(name, text) {
  if (typeof name !== "string") {
    throw new TypeError("runConfigCase: arg 'name' expected string, got " + typeof name);
  }
  if (typeof text !== "string") {
    throw new TypeError("runConfigCase: arg 'text' expected string, got " + typeof text);
  }
  {
    const target__gensym22 = decodeJson(JSON.parse(text), "$");
    let matched__gensym23 = false;
    if (!matched__gensym23 && target__gensym22.tag === "Rejected") {
      const failure = target__gensym22.failure;
      {
        matched__gensym23 = true;
        printValue(name, failure);
      }
    }
    if (!matched__gensym23 && target__gensym22.tag === "Decoded") {
      const value = target__gensym22.value;
      {
        matched__gensym23 = true;
        printValue(name, decodeConfig(value));
      }
    }
    if (!matched__gensym23) {
      throw new Error("match: no matching pattern");
    }
  }
}
function showKey(name, value, key) {
  if (typeof name !== "string") {
    throw new TypeError("showKey: arg 'name' expected string, got " + typeof name);
  }
  if (typeof key !== "string") {
    throw new TypeError("showKey: arg 'key' expected string, got " + typeof key);
  }
  {
    const target__gensym24 = value;
    let matched__gensym25 = false;
    if (!matched__gensym25 && target__gensym24.tag === "JObject") {
      const entries = target__gensym24.entries;
      {
        matched__gensym25 = true;
        printValue(name, lookup(entries, key));
      }
    }
    if (!matched__gensym25) {
      {
        matched__gensym25 = true;
        printValue(name, "not-object");
      }
    }
  }
}
function nestedKey(root, key) {
  if (typeof key !== "string") {
    throw new TypeError("nestedKey: arg 'key' expected string, got " + typeof key);
  }
  {
    const target__gensym26 = root;
    let matched__gensym27 = false;
    if (!matched__gensym27 && target__gensym26.tag === "JObject") {
      const outer = target__gensym26.entries;
      {
        matched__gensym27 = true;
        {
          const target__gensym28 = lookup(outer, "nested");
          let matched__gensym29 = false;
          if (!matched__gensym29 && target__gensym28.tag === "None") {
            {
              matched__gensym29 = true;
              return None;
            }
          }
          if (!matched__gensym29 && target__gensym28.tag === "Some") {
            const inner = target__gensym28.value;
            {
              matched__gensym29 = true;
              {
                const target__gensym30 = inner;
                let matched__gensym31 = false;
                if (!matched__gensym31 && target__gensym30.tag === "JObject") {
                  const entries = target__gensym30.entries;
                  {
                    matched__gensym31 = true;
                    return lookup(entries, key);
                  }
                }
                if (!matched__gensym31) {
                  {
                    matched__gensym31 = true;
                    return None;
                  }
                }
              }
            }
          }
          if (!matched__gensym29) {
            throw new Error("match: no matching pattern");
          }
        }
      }
    }
    if (!matched__gensym27) {
      {
        matched__gensym27 = true;
        return None;
      }
    }
  }
}
function replaceEntry(entry, key, replacement) {
  if (typeof key !== "string") {
    throw new TypeError("replaceEntry: arg 'key' expected string, got " + typeof key);
  }
  {
    const target__gensym32 = entry;
    let matched__gensym33 = false;
    if (!matched__gensym33 && target__gensym32.tag === "Entry") {
      const foundKey = target__gensym32.key;
      const oldValue = target__gensym32.value;
      {
        matched__gensym33 = true;
        if (foundKey === key) {
          return Entry(foundKey, replacement);
        }
        return Entry(foundKey, oldValue);
      }
    }
    if (!matched__gensym33) {
      throw new Error("match: no matching pattern");
    }
  }
}
function replaceKey(value, key, replacement) {
  if (typeof key !== "string") {
    throw new TypeError("replaceKey: arg 'key' expected string, got " + typeof key);
  }
  {
    const target__gensym34 = value;
    let matched__gensym35 = false;
    if (!matched__gensym35 && target__gensym34.tag === "JObject") {
      const entries = target__gensym34.entries;
      {
        matched__gensym35 = true;
        return JObject(entries.map(entry => replaceEntry(entry, key, replacement)));
      }
    }
    if (!matched__gensym35) {
      {
        matched__gensym35 = true;
        return value;
      }
    }
  }
}
function editNestedPrototypeKey(root, replacement) {
  {
    const target__gensym36 = root;
    let matched__gensym37 = false;
    if (!matched__gensym37 && target__gensym36.tag === "JObject") {
      const outer = target__gensym36.entries;
      {
        matched__gensym37 = true;
        {
          const target__gensym38 = lookup(outer, "nested");
          let matched__gensym39 = false;
          if (!matched__gensym39 && target__gensym38.tag === "Some") {
            const inner = target__gensym38.value;
            {
              matched__gensym39 = true;
              {
                const target__gensym40 = inner;
                let matched__gensym41 = false;
                if (!matched__gensym41 && target__gensym40.tag === "JObject") {
                  const innerEntries = target__gensym40.entries;
                  {
                    matched__gensym41 = true;
                    return replaceKey(root, "nested", replaceKey(inner, "__proto__", replacement));
                  }
                }
                if (!matched__gensym41) {
                  {
                    matched__gensym41 = true;
                    return root;
                  }
                }
              }
            }
          }
          if (!matched__gensym39 && target__gensym38.tag === "None") {
            {
              matched__gensym39 = true;
              return root;
            }
          }
          if (!matched__gensym39) {
            throw new Error("match: no matching pattern");
          }
        }
      }
    }
    if (!matched__gensym37) {
      {
        matched__gensym37 = true;
        return root;
      }
    }
  }
}
runRawCase("J02-null", JSON.parse("null"));
runRawCase("J02-bool", JSON.parse("false"));
runRawCase("J02-number", JSON.parse("0"));
runRawCase("J02-string", JSON.parse("\"\""));
runRawCase("J02-array", JSON.parse("[]"));
runRawCase("J02-object", JSON.parse("{}"));
runRawCase("J01-nested", JSON.parse("{\"name\":\"Ada\",\"n\":1,\"flags\":[true,false],\"nil\":null}"));
runRawCase("L01-injected-undefined", [JSON.parse("1"), undefined, JSON.parse("3")]);
runRawCase("J07-raw-own-undefined-label", { server: { port: 8080 }, label: undefined });
runConfigCase("port-0", "{\"server\":{\"port\":0}}");
runConfigCase("port-max", "{\"server\":{\"port\":65535}}");
runConfigCase("port-negative", "{\"server\":{\"port\":-1}}");
runConfigCase("port-too-large", "{\"server\":{\"port\":65536}}");
runConfigCase("port-fraction", "{\"server\":{\"port\":1.5}}");
runConfigCase("port-string", "{\"server\":{\"port\":\"8\"}}");
runConfigCase("port-missing", "{\"server\":{}}");
runConfigCase("port-null", "{\"server\":{\"port\":null}}");
runConfigCase("label-missing", "{\"server\":{\"port\":8080}}");
runConfigCase("label-null", "{\"server\":{\"port\":8080},\"label\":null}");
runConfigCase("label-empty", "{\"server\":{\"port\":0},\"label\":\"\"}");
runConfigCase("label-text", "{\"server\":{\"port\":8080},\"label\":\"edge\"}");
runConfigCase("label-false", "{\"server\":{\"port\":8080},\"label\":false}");
runConfigCase("label-zero", "{\"server\":{\"port\":8080},\"label\":0}");
const ownUndefinedConfig = JObject([Entry("server", JObject([Entry("port", JNumber(8080))])), Entry("label", JUndefined)]);
printValue("label-own-undefined-present", lookup(ownUndefinedConfig.entries, "label"));
printValue("label-own-undefined-result", decodeConfig(ownUndefinedConfig));
const keyObject = JSON.parse("{\"first-name\":0,\"firstName\":1,\"\":2,\"a:b\":3,\"a/b\":4,\"~\":5,\"__proto__\":6,\"constructor\":7,\"toString\":8}");
const keyValue = decodeJson(keyObject, "$");
printValue("J08-exact-key-data", keyValue);
showKey("K02-first-name", keyValue["value"], "first-name");
showKey("K03-firstName", keyValue["value"], "firstName");
showKey("K04-empty", keyValue["value"], "");
showKey("K05-colon", keyValue["value"], "a:b");
showKey("K06-slash", keyValue["value"], "a/b");
showKey("K07-tilde", keyValue["value"], "~");
showKey("K08-proto", keyValue["value"], "__proto__");
showKey("K09-constructor", keyValue["value"], "constructor");
showKey("K10-toString", keyValue["value"], "toString");
const editSource = decodeJson(JSON.parse("{\"first-name\":0,\"firstName\":1,\"\":2,\"a:b\":3,\"a/b\":4,\"~\":5,\"__proto__\":6,\"constructor\":7,\"toString\":8,\"nested\":{\"first-name\":0,\"firstName\":1,\"\":2,\"a:b\":3,\"a/b\":4,\"~\":5,\"__proto__\":6,\"constructor\":7,\"toString\":8}}"), "$");
{
  const target__gensym42 = editSource;
  let matched__gensym43 = false;
  if (!matched__gensym43 && target__gensym42.tag === "Decoded") {
    const original = target__gensym42.value;
    {
      matched__gensym43 = true;
      const updated = editNestedPrototypeKey(original, JNumber(55));
      printValue("edit-original-alias", original);
      printValue("edit-updated", updated);
      printValue("edit-alias-identity", Object.is(original, updated));
      printValue("edit-path-nested-proto", nestedKey(updated, "__proto__"));
      printValue("edit-untouched-constructor", nestedKey(updated, "constructor"));
    }
  }
  if (!matched__gensym43 && target__gensym42.tag === "Rejected") {
    const failure = target__gensym42.failure;
    {
      matched__gensym43 = true;
      printValue("edit-input-failure", failure);
    }
  }
  if (!matched__gensym43) {
    throw new Error("match: no matching pattern");
  }
}
