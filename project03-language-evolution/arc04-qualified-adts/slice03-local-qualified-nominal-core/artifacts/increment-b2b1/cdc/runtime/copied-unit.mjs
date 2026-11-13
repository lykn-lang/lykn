const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
const lyknIntrinsicError0 = Error;
function Entry(left) {
  if (typeof left !== "number" || lyknIntrinsicNumberIsNaN0(left)) {
    throw new lyknIntrinsicTypeError0("Entry: field 'left' expected number, got " + typeof left);
  }
  return { tag: "Entry", left: left };
}
const item = Entry(3);
console.log((() => {
  const target__gensym0 = item;
  let pattern_field__gensym1;
  if ((target__gensym0 != null && target__gensym0.tag === "Entry") && (pattern_field__gensym1 = target__gensym0.left, true)) {
    const value = pattern_field__gensym1;
    return value;
  }
  throw new lyknIntrinsicError0("match: no matching pattern");
})());
export {Entry};
