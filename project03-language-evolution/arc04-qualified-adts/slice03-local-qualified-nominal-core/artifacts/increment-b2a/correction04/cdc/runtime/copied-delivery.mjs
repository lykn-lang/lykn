const lyknIntrinsicTypeError0 = TypeError;
import {numberIsNaN as lyknIntrinsicNumberIsNaN0, arrayIsArray as lyknIntrinsicArrayIsArray0} from "data:text/javascript,export%20const%20symbol%3DSymbol%3Bexport%20const%20symbolFor%3DSymbol.for%3Bexport%20const%20objectFreeze%3DObject.freeze%3Bexport%20const%20objectDefineProperties%3DObject.defineProperties%3Bexport%20const%20numberIsNaN%3DNumber.isNaN%3Bexport%20const%20arrayIsArray%3DArray.isArray%3Bexport%20const%20promise%3DPromise%3Bexport%20const%20typeError%3DTypeError%3Bexport%20const%20error%3DError%3B";
console.log(21 + 21);
const Array = 0;
const Number = 0;
function chooseValue(...args) {
  if (args.length === 1 && lyknIntrinsicArrayIsArray0(args[0])) {
    const value = args[0];
    if (!lyknIntrinsicArrayIsArray0(value)) {
      throw new lyknIntrinsicTypeError0("chooseValue: arg 'value' expected array, got " + typeof value);
    }
    return "array";
  }
  if (args.length === 1 && typeof args[0] === "string") {
    const value = args[0];
    if (typeof value !== "string") {
      throw new lyknIntrinsicTypeError0("chooseValue: arg 'value' expected string, got " + typeof value);
    }
    return "string";
  }
  throw new lyknIntrinsicTypeError0("choose-value: no matching clause for arguments");
}
console.log(chooseValue([1]));
console.log(chooseValue("kept"));
try {
  chooseValue(1);
} catch (error) {
  console.log(error.name);
}
function needNumber(value) {
  if (typeof value !== "number" || lyknIntrinsicNumberIsNaN0(value)) {
    throw new lyknIntrinsicTypeError0("needNumber: arg 'value' expected number, got " + typeof value);
  }
  return value;
}
try {
  needNumber("wrong");
} catch (error) {
  console.log(error.name);
}
