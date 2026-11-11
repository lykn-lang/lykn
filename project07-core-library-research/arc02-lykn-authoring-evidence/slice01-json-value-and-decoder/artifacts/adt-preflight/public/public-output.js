const JsonNull = {
  tag: "JsonNull"
};
function JsonBoolean(value) {
  if (typeof value !== "boolean") {
    throw new TypeError("JsonBoolean: field 'value' expected boolean, got " + typeof value);
  }
  return {
    tag: "JsonBoolean",
    value: value
  };
}
function JsonNumber(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new TypeError("JsonNumber: field 'value' expected number, got " + typeof value);
  }
  return {
    tag: "JsonNumber",
    value: value
  };
}
function JsonString(value) {
  if (typeof value !== "string") {
    throw new TypeError("JsonString: field 'value' expected string, got " + typeof value);
  }
  return {
    tag: "JsonString",
    value: value
  };
}
function JsonArray(items) {
  if (!Array.isArray(items)) {
    throw new TypeError("JsonArray: field 'items' expected array, got " + typeof items);
  }
  return {
    tag: "JsonArray",
    items: items
  };
}
function JsonObject(entries) {
  if (!Array.isArray(entries)) {
    throw new TypeError("JsonObject: field 'entries' expected array, got " + typeof entries);
  }
  return {
    tag: "JsonObject",
    entries: entries
  };
}
function JsonField(key, value) {
  if (typeof key !== "string") {
    throw new TypeError("JsonField: field 'key' expected string, got " + typeof key);
  }
  if (typeof value !== "object" || (value === null || !(("tag" in value)))) {
    throw new TypeError("JsonField: field 'value' expected JsonValue, got " + typeof value);
  }
  return {
    tag: "JsonField",
    key: key,
    value: value
  };
}
const Other = {
  tag: "Other"
};
function valueTag(value) {
  if (typeof value !== "object" || (value === null || !(("tag" in value)))) {
    throw new TypeError("valueTag: arg 'value' expected JsonValue, got " + typeof value);
  }
  const result__gensym0 = value["tag"];
  if (typeof result__gensym0 !== "string") {
    throw new TypeError("valueTag: return value expected string, got " + typeof result__gensym0);
  }
  return result__gensym0;
}
function numberPayload(value) {
  {
    const target__gensym1 = value;
    let matched__gensym2 = false;
    if (!matched__gensym2 && target__gensym1.tag === "JsonNumber") {
      const payload = target__gensym1.value;
      {
        matched__gensym2 = true;
        return payload;
      }
    }
    if (!matched__gensym2) {
      throw new Error("match: no matching pattern");
    }
  }
}
function observe(name, exercise) {
  if (typeof name !== "string") {
    throw new TypeError("observe: arg 'name' expected string, got " + typeof name);
  }
  if (typeof exercise !== "function") {
    throw new TypeError("observe: arg 'exercise' expected function, got " + typeof exercise);
  }
  try {
    console.log(JSON.stringify([name, "ok", exercise()]));
  } catch (problem) {
    console.log(JSON.stringify([name, problem["name"], problem["message"]]));
  }
}
observe("six-variants", () => [JsonNull, JsonBoolean(false), JsonNumber(0), JsonString(""), JsonArray([JsonNull]), JsonObject([JsonField("__proto__", JsonNull)])]);
observe("exact-key", () => JsonField("a.b", JsonNull));
observe("wrong-scalar", () => JsonNumber("bad"));
observe("wrong-array-shape", () => JsonArray(JsonNumber(1)));
observe("wrong-nested-array-member", () => JsonArray([JsonNumber(1), "bad"]));
observe("wrong-variant", () => JsonField("field", Other));
observe("forged-tag", () => {
  const forged = {
    tag: "JsonNumber",
    value: "bad"
  };
  return [valueTag(forged), numberPayload(forged)];
});
observe("missing-tag", () => valueTag({
  value: 0
}));
observe("missing-match-arm", () => numberPayload(JsonNull));

