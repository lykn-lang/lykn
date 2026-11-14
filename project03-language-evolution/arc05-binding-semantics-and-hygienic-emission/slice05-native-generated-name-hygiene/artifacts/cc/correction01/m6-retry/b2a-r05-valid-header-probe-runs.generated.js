const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
function valid(value) {
  if (typeof value !== "number" || lyknIntrinsicNumberIsNaN0(value)) {
    throw new lyknIntrinsicTypeError0("valid: arg 'value' expected number, got " + typeof value);
  }
  return 41;
}
console.log(valid(1));
