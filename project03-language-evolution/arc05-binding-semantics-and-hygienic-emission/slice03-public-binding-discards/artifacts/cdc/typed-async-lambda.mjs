const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
globalThis["_"] = 99;
const f = async discardValue__gensym0 => {
  if (typeof discardValue__gensym0 !== "number" || lyknIntrinsicNumberIsNaN0(discardValue__gensym0)) {
    throw new lyknIntrinsicTypeError0("anonymous: arg 'discardValue__private' expected number, got " + typeof discardValue__gensym0);
  }
  return _;
};
console.log(await f("bad"));
