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
    let matched__gensym2 = false;
    if (!matched__gensym2 && target__gensym0.tag === "Some" && t__gensym1.tag === "InnerNumber") {
      const t__gensym1 = target__gensym0.value;
      const value = t__gensym1.value;
      {
        matched__gensym2 = true;
        return value;
      }
    }
    if (!matched__gensym2) {
      {
        matched__gensym2 = true;
        return "no match";
      }
    }
  }
}
console.log(selectInner(Some(InnerNumber(7))));

