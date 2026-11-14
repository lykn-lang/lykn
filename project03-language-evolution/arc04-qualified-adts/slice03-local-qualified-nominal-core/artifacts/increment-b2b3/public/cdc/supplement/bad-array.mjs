const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
function take([discardValue__gensym0]) {
  if (typeof discardValue__gensym0 !== "number" || lyknIntrinsicNumberIsNaN0(discardValue__gensym0)) {
    throw new lyknIntrinsicTypeError0("take: arg '_' expected number, got " + typeof discardValue__gensym0);
  }
  return 41;
}
console.log(take(["bad"]));
