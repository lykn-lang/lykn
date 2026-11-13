const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
const someName = 1;
function entry(someName) {
  if (typeof someName !== "number" || lyknIntrinsicNumberIsNaN0(someName)) {
    throw new lyknIntrinsicTypeError0("entry: arg 'someName' expected number, got " + typeof someName);
  }
  return someName;
}
console.log(entry(2));
