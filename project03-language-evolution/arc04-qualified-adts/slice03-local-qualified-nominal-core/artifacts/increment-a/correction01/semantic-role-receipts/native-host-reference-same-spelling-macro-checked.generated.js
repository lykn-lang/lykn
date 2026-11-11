const lyknIntrinsicArrayIsArray0 = Array.isArray;
const lyknIntrinsicTypeError0 = TypeError;
function acceptsArray(value) {
  if (!lyknIntrinsicArrayIsArray0(value)) {
    throw new lyknIntrinsicTypeError0("acceptsArray: arg 'value' expected array, got " + typeof value);
  }
  return value;
}
console.log(JSON.stringify(["source-macro", acceptsArray([2])]));
