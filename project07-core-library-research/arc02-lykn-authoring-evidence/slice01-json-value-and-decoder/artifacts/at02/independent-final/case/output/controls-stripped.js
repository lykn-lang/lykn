const ControlNull = { tag: "ControlNull" };
function ControlNumber(value) {
  return { tag: "ControlNumber", value: value };
}
function ControlArray(values) {
  return { tag: "ControlArray", values: values };
}
function OtherTag(id) {
  return { tag: "OtherTag", id: id };
}
function NestedSome(value) {
  return { tag: "NestedSome", value: value };
}
const NestedNone = { tag: "NestedNone" };
function InnerNumber(value) {
  return { tag: "InnerNumber", value: value };
}
function expectControl(value) {
  return value;
}
function readControlNumber(value) {
  {
    const target__gensym0 = value;
    let matched__gensym1 = false;
    if (!matched__gensym1 && target__gensym0.tag === "ControlNumber") {
      const number = target__gensym0.value;
      {
        matched__gensym1 = true;
        return number;
      }
    }
    if (!matched__gensym1) {
      {
        matched__gensym1 = true;
        return "other";
      }
    }
  }
}
function onlyControlNumber(value) {
  {
    const target__gensym2 = value;
    let matched__gensym3 = false;
    if (!matched__gensym3 && target__gensym2.tag === "ControlNumber") {
      const number = target__gensym2.value;
      {
        matched__gensym3 = true;
        return number;
      }
    }
    if (!matched__gensym3) {
      throw new Error("match: no matching pattern");
    }
  }
}
function wildcardControl(value) {
  return (() => {
    const target__gensym4 = value;
    if (target__gensym4.tag === "ControlNumber") {
      return "number";
    }
    {
      return "wildcard";
    }
  })();
}
function nestedControl(value) {
  {
    const target__gensym5 = value;
    let matched__gensym6 = false;
    if (!matched__gensym6 && target__gensym5.tag === "NestedSome") {
      {
        matched__gensym6 = true;
        return number;
      }
    }
    if (!matched__gensym6 && target__gensym5.tag === "NestedSome") {
      {
        matched__gensym6 = true;
        return "not-number";
      }
    }
    if (!matched__gensym6 && target__gensym5.tag === "NestedNone") {
      {
        matched__gensym6 = true;
        return "none";
      }
    }
    if (!matched__gensym6) {
      throw new Error("match: no matching pattern");
    }
  }
}
function observeControl(name, action) {
  try {
    const result = action();
    console.log(name, JSON.stringify(result));
  } catch (err) {
    console.log(name, JSON.stringify({ thrown: err.name, message: err.message }));
  }
}
const wrongScalar = JSON.parse("\"wrong\"");
const wrongArray = JSON.parse("\"wrong\"");
const missingTag = JSON.parse("{\"value\":1}");
const forgedNumber = JSON.parse("{\"tag\":\"ControlNumber\",\"value\":\"wrong\"}");
observeControl("T01-valid-scalar", () => ControlNumber(3));
observeControl("T02-zero-field", () => ControlNull);
observeControl("T03-wrong-scalar", () => ControlNumber(wrongScalar));
observeControl("T04-wrong-outer-array", () => ControlArray(wrongArray));
observeControl("T05-wrong-nested-array-member", () => ControlArray(["bad"]));
observeControl("T06-unrelated-tag", () => expectControl(OtherTag(9)));
observeControl("T07-missing-tag", () => expectControl(missingTag));
observeControl("T08-forged-known-tag-match", () => readControlNumber(expectControl(forgedNumber)));
observeControl("T09-omitted-arm", () => onlyControlNumber(ControlNull));
observeControl("T10-wildcard", () => wildcardControl(ControlNull));
observeControl("T11-nested-positive", () => nestedControl(NestedSome(InnerNumber(7))));
observeControl("T12-nested-negative", () => nestedControl(NestedSome(ControlNull)));
