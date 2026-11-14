const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
function valid(value = 40) {
  if (typeof value !== "number" || lyknIntrinsicNumberIsNaN0(value)) {
    throw new lyknIntrinsicTypeError0("valid: arg 'value' expected number, got " + typeof value);
  }
  return value + 1;
}
console.log(valid());
