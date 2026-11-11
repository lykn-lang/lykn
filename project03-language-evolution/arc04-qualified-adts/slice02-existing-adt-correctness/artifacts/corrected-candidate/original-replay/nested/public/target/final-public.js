function Some(value) {
  return {
    tag: "Some",
    value: value
  };
}
const None = {
  tag: "None"
};
function InnerNumber(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new TypeError("InnerNumber: field 'value' expected number, got " + typeof value);
  }
  return {
    tag: "InnerNumber",
    value: value
  };
}
function selectInner(input) {
  {
    const target__gensym0 = input;
    let matched__gensym1 = false;
    let patternField__gensym0;
    let patternField__gensym1;
    if (!matched__gensym1 && target__gensym0 != null && target__gensym0["tag"] === "Some" && (patternField__gensym0 = target__gensym0["value"], true) && patternField__gensym0 != null && patternField__gensym0["tag"] === "InnerNumber" && (patternField__gensym1 = patternField__gensym0["value"], true)) {
      const value = patternField__gensym1;
      {
        matched__gensym1 = true;
        return value;
      }
    }
    if (!matched__gensym1) {
      {
        matched__gensym1 = true;
        return "no match";
      }
    }
  }
}
console.log(selectInner(Some(InnerNumber(7))));

