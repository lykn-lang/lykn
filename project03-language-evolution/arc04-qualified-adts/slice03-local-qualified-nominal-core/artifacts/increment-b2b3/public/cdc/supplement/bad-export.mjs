const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
const input = "bad";
const discardValue__gensym0 = input;
if (typeof discardValue__gensym0 !== "number" || lyknIntrinsicNumberIsNaN0(discardValue__gensym0)) {
  throw new lyknIntrinsicTypeError0("bind '_': expected number, got " + typeof discardValue__gensym0);
}
export {};
