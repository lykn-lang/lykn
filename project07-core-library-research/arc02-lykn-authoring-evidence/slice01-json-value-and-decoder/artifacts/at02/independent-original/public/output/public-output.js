function JNull() {
  return {
    tag: "JNull"
  };
}
function JUndefined() {
  return {
    tag: "JUndefined"
  };
}
function JBoolean(value) {
  if (typeof value !== "boolean") {
    throw new TypeError("JBoolean: field 'value' expected boolean, got " + typeof value);
  }
  return {
    tag: "JBoolean",
    value: value
  };
}
function JNumber(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new TypeError("JNumber: field 'value' expected number, got " + typeof value);
  }
  return {
    tag: "JNumber",
    value: value
  };
}
function JString(value) {
  if (typeof value !== "string") {
    throw new TypeError("JString: field 'value' expected string, got " + typeof value);
  }
  return {
    tag: "JString",
    value: value
  };
}
function JArray(values) {
  if (!Array.isArray(values)) {
    throw new TypeError("JArray: field 'values' expected array, got " + typeof values);
  }
  return {
    tag: "JArray",
    values: values
  };
}
function JObject(entries) {
  if (!Array.isArray(entries)) {
    throw new TypeError("JObject: field 'entries' expected array, got " + typeof entries);
  }
  return {
    tag: "JObject",
    entries: entries
  };
}
function Entry(key, value) {
  if (typeof key !== "string") {
    throw new TypeError("Entry: field 'key' expected string, got " + typeof key);
  }
  return {
    tag: "Entry",
    key: key,
    value: value
  };
}
function LabelMissing() {
  return {
    tag: "LabelMissing"
  };
}
function LabelUndefined() {
  return {
    tag: "LabelUndefined"
  };
}
function LabelNull() {
  return {
    tag: "LabelNull"
  };
}
function LabelText(value) {
  if (typeof value !== "string") {
    throw new TypeError("LabelText: field 'value' expected string, got " + typeof value);
  }
  return {
    tag: "LabelText",
    value: value
  };
}
function ServerConfig(port, label) {
  if (typeof port !== "number" || Number.isNaN(port)) {
    throw new TypeError("ServerConfig: field 'port' expected number, got " + typeof port);
  }
  return {
    tag: "ServerConfig",
    port: port,
    label: label
  };
}
function MissingField(path) {
  if (typeof path !== "string") {
    throw new TypeError("MissingField: field 'path' expected string, got " + typeof path);
  }
  return {
    tag: "MissingField",
    path: path
  };
}
function WrongValue(path, expected) {
  if (typeof path !== "string") {
    throw new TypeError("WrongValue: field 'path' expected string, got " + typeof path);
  }
  if (typeof expected !== "string") {
    throw new TypeError("WrongValue: field 'expected' expected string, got " + typeof expected);
  }
  return {
    tag: "WrongValue",
    path: path,
    expected: expected
  };
}
function InvalidPort(path, value) {
  if (typeof path !== "string") {
    throw new TypeError("InvalidPort: field 'path' expected string, got " + typeof path);
  }
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new TypeError("InvalidPort: field 'value' expected number, got " + typeof value);
  }
  return {
    tag: "InvalidPort",
    path: path,
    value: value
  };
}
function Decoded(value) {
  return {
    tag: "Decoded",
    value: value
  };
}
function Rejected(failure) {
  return {
    tag: "Rejected",
    failure: failure
  };
}
function lookup(entries, key) {
  if (!Array.isArray(entries)) {
    throw new TypeError("lookup: arg 'entries' expected array, got " + typeof entries);
  }
  if (typeof key !== "string") {
    throw new TypeError("lookup: arg 'key' expected string, got " + typeof key);
  }
  const found = entries.find(entry => entry.key === key);
  return found === undefined ? None : Some(found.value);
}
function decodePort(found, path) {
  if (typeof path !== "string") {
    throw new TypeError("decodePort: arg 'path' expected string, got " + typeof path);
  }
  {
    const target__gensym0 = found;
    let matched__gensym1 = false;
    if (!matched__gensym1 && target__gensym0.tag === "None") {
      {
        matched__gensym1 = true;
        return Rejected(MissingField(path));
      }
    }
    if (!matched__gensym1 && target__gensym0.tag === "Some") {
      if (Number.isInteger(n) && n >= 0 && n <= 65535) {
        matched__gensym1 = true;
        return Decoded(n);
      }
    }
    if (!matched__gensym1 && target__gensym0.tag === "Some") {
      {
        matched__gensym1 = true;
        return Rejected(InvalidPort(path, n));
      }
    }
    if (!matched__gensym1 && target__gensym0.tag === "Some") {
      {
        matched__gensym1 = true;
        return Rejected(WrongValue(path, "integer 0..65535"));
      }
    }
    if (!matched__gensym1) {
      throw new Error("match: no matching pattern");
    }
  }
}
function decodeLabel(found) {
  {
    const target__gensym2 = found;
    let matched__gensym3 = false;
    if (!matched__gensym3 && target__gensym2.tag === "None") {
      {
        matched__gensym3 = true;
        return Decoded(LabelMissing);
      }
    }
    if (!matched__gensym3 && target__gensym2.tag === "Some") {
      {
        matched__gensym3 = true;
        return Decoded(LabelUndefined);
      }
    }
    if (!matched__gensym3 && target__gensym2.tag === "Some") {
      {
        matched__gensym3 = true;
        return Decoded(LabelNull);
      }
    }
    if (!matched__gensym3 && target__gensym2.tag === "Some") {
      {
        matched__gensym3 = true;
        return Decoded(LabelText(text));
      }
    }
    if (!matched__gensym3 && target__gensym2.tag === "Some") {
      {
        matched__gensym3 = true;
        return Rejected(WrongValue("label", "string or null"));
      }
    }
    if (!matched__gensym3) {
      throw new Error("match: no matching pattern");
    }
  }
}
function decodeConfig(input) {
  {
    const target__gensym4 = input;
    let matched__gensym11 = false;
    if (!matched__gensym11 && target__gensym4.tag === "JObject") {
      const configEntries = target__gensym4.entries;
      {
        matched__gensym11 = true;
        {
          const target__gensym5 = lookup(configEntries, "server");
          let matched__gensym10 = false;
          if (!matched__gensym10 && target__gensym5.tag === "None") {
            {
              matched__gensym10 = true;
              Rejected(MissingField("server"));
            }
          }
          if (!matched__gensym10 && target__gensym5.tag === "Some") {
            {
              matched__gensym10 = true;
              {
                const target__gensym6 = decodePort(lookup(serverEntries, "port"), "server.port");
                let matched__gensym9 = false;
                if (!matched__gensym9 && target__gensym6.tag === "Rejected") {
                  const failure = target__gensym6.failure;
                  {
                    matched__gensym9 = true;
                    Rejected(failure);
                  }
                }
                if (!matched__gensym9 && target__gensym6.tag === "Decoded") {
                  const port = target__gensym6.value;
                  {
                    matched__gensym9 = true;
                    {
                      const target__gensym7 = decodeLabel(lookup(configEntries, "label"));
                      let matched__gensym8 = false;
                      if (!matched__gensym8 && target__gensym7.tag === "Rejected") {
                        const failure = target__gensym7.failure;
                        {
                          matched__gensym8 = true;
                          Rejected(failure);
                        }
                      }
                      if (!matched__gensym8 && target__gensym7.tag === "Decoded") {
                        const label = target__gensym7.value;
                        {
                          matched__gensym8 = true;
                          Decoded(ServerConfig(port, label));
                        }
                      }
                      if (!matched__gensym8) {
                        throw new Error("match: no matching pattern");
                      }
                    }
                  }
                }
                if (!matched__gensym9) {
                  throw new Error("match: no matching pattern");
                }
              }
            }
          }
          if (!matched__gensym10 && target__gensym5.tag === "Some") {
            {
              matched__gensym10 = true;
              Rejected(WrongValue("server", "object"));
            }
          }
          if (!matched__gensym10) {
            throw new Error("match: no matching pattern");
          }
        }
        _(Rejected(WrongValue("$", "object")));
      }
    }
    if (!matched__gensym11) {
      throw new Error("match: no matching pattern");
    }
  }
  const validEmptyLabel = JObject([Entry("server", JObject([Entry("port", JNumber(0))])), Entry("label", JString(""))]);
  console.log(decodeConfig(validEmptyLabel));
  const absentLabel = JObject([Entry("server", JObject([Entry("port", JNumber(8080))]))]);
  const nullLabel = JObject([Entry("server", JObject([Entry("port", JNumber(8080))])), Entry("label", JNull)]);
  console.log(decodeConfig(absentLabel));
  console.log(decodeConfig(nullLabel));
  const wrongNestedPort = JObject([Entry("server", JObject([Entry("port", JBoolean(false))])), Entry("label", JString("edge"))]);
  return console.log(decodeConfig(wrongNestedPort));
}

