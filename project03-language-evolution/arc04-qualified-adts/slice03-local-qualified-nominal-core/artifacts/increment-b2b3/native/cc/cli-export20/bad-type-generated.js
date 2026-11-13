const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
function check(completionValue__gensym0) {
  if (typeof completionValue__gensym0 !== "number" || lyknIntrinsicNumberIsNaN0(completionValue__gensym0)) {
    throw new lyknIntrinsicTypeError0("check: arg '_' expected number, got " + typeof completionValue__gensym0);
  }
  return 41;
}
console.log(check(wrongValue));
