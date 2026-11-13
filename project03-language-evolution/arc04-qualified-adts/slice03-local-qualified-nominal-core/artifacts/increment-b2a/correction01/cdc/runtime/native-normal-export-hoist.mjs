const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
export function array(value) {
  if (typeof value !== "number" || lyknIntrinsicNumberIsNaN0(value)) {
    throw new lyknIntrinsicTypeError0("array: arg 'value' expected number, got " + typeof value);
  }
  return value + 40;
}
console.log([1]);
