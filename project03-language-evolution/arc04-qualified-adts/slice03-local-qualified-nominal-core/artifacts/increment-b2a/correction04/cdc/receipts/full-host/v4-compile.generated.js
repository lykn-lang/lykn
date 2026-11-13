const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
const action = n => {
  if (typeof n !== "number" || lyknIntrinsicNumberIsNaN0(n)) {
    throw new lyknIntrinsicTypeError0("anonymous: arg 'n' expected number, got " + typeof n);
  }
  return n + 1;
};
action.call = n => {
  if (typeof n !== "number" || lyknIntrinsicNumberIsNaN0(n)) {
    throw new lyknIntrinsicTypeError0("anonymous: arg 'n' expected number, got " + typeof n);
  }
  return 99;
};
console.log(JSON.stringify(action.call(1)));
