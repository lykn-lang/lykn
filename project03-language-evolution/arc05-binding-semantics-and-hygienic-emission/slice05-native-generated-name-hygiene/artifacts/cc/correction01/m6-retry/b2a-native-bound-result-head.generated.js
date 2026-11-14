const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
const invoke = x => {
  if (typeof x !== "number" || lyknIntrinsicNumberIsNaN0(x)) {
    throw new lyknIntrinsicTypeError0("anonymous: arg 'x' expected number, got " + typeof x);
  }
  return x + 40;
};
console.log(invoke(1));
