const lyknIntrinsicError0 = Error;
function Entry(right) {
  return { tag: "Entry", right: right };
}
const item = Entry("three");
console.log((() => {
  const target__gensym0 = item;
  let pattern_field__gensym1;
  if ((target__gensym0 != null && target__gensym0.tag === "Entry") && (pattern_field__gensym1 = target__gensym0.right, true)) {
    const value = pattern_field__gensym1;
    return value;
  }
  throw new lyknIntrinsicError0("match: no matching pattern");
})());
