const lyknIntrinsicTypeError0 = TypeError;
import {arrayIsArray as lyknIntrinsicArrayIsArray0} from "data:text/javascript,export%20const%20symbol%3DSymbol%3Bexport%20const%20symbolFor%3DSymbol.for%3Bexport%20const%20objectFreeze%3DObject.freeze%3Bexport%20const%20objectDefineProperties%3DObject.defineProperties%3Bexport%20const%20numberIsNaN%3DNumber.isNaN%3Bexport%20const%20arrayIsArray%3DArray.isArray%3Bexport%20const%20promise%3DPromise%3Bexport%20const%20typeError%3DTypeError%3Bexport%20const%20error%3DError%3B";
const Array = 0;
function chooseValue(...args) {
  if (args.length === 1 && lyknIntrinsicArrayIsArray0(args[0])) {
    const value = args[0];
    return "array";
  }
  if (args.length === 1 && typeof args[0] === "string") {
    const value = args[0];
    return "string";
  }
  throw new lyknIntrinsicTypeError0("choose-value: no matching clause for arguments");
}
function captureUnknown() {
  try {
    return chooseValue(1);
  } catch (error) {
    return [error.name, error.message];
  }
}
console.log(JSON.stringify([chooseValue([1]), chooseValue("kept"), captureUnknown()]));
