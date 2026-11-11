function Some(value) {
  return { tag: "Some", value: value };
}
const None = { tag: "None" };
function InnerNumber(value) {
  return { tag: "InnerNumber", value: value };
}
function selectInner(input) {
  {
    const target__gensym0 = input;
    let matched__gensym1 = false;
    let pattern_field__gensym2;
    let pattern_field__gensym3;
    if (!matched__gensym1 && (((((target__gensym0 != null && target__gensym0.tag === "Some") && (pattern_field__gensym2 = target__gensym0.value, true)) && pattern_field__gensym2 != null) && pattern_field__gensym2.tag === "InnerNumber") && (pattern_field__gensym3 = pattern_field__gensym2.value, true))) {
      const value = pattern_field__gensym3;
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
