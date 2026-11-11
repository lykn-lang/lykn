function Some(value) {
  return { tag: "Some", value: value };
}
const None = { tag: "None" };
function InnerNumber(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new TypeError("InnerNumber: field 'value' expected number, got " + typeof value);
  }
  return { tag: "InnerNumber", value: value };
}
function selectInner(input) {
  {
    const target__gensym0 = input;
    let matched__gensym1 = false;
    if (!matched__gensym1 && target__gensym0.tag === "Some") {
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
