const JsonNull = { tag: "JsonNull" };
function JsonBoolean(value) {
  return { tag: "JsonBoolean", value: value };
}
function JsonNumber(value) {
  return { tag: "JsonNumber", value: value };
}
function JsonString(value) {
  return { tag: "JsonString", value: value };
}
function JsonArray(items) {
  return { tag: "JsonArray", items: items };
}
function JsonObject(entries) {
  return { tag: "JsonObject", entries: entries };
}
function JsonField(key, value) {
  return { tag: "JsonField", key: key, value: value };
}
const Other = { tag: "Other" };
function valueTag(value) {
  return value["tag"];
}
function numberPayload(value) {
  {
    const target__gensym0 = value;
    let matched__gensym1 = false;
    if (!matched__gensym1 && target__gensym0.tag === "JsonNumber") {
      const payload = target__gensym0.value;
      {
        matched__gensym1 = true;
        return payload;
      }
    }
    if (!matched__gensym1) {
      throw new Error("match: no matching pattern");
    }
  }
}
function observe(name, exercise) {
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
  const forged = { tag: "JsonNumber", value: "bad" };
  return [valueTag(forged), numberPayload(forged)];
});
observe("missing-tag", () => valueTag({ value: 0 }));
observe("missing-match-arm", () => numberPayload(JsonNull));
