import {numberIsNaN as lyknIntrinsicNumberIsNaN0, arrayIsArray as lyknIntrinsicArrayIsArray0, typeError as lyknIntrinsicTypeError0, error as lyknIntrinsicError0} from "data:text/javascript,export%20const%20symbol%3DSymbol%3Bexport%20const%20symbolFor%3DSymbol.for%3Bexport%20const%20objectFreeze%3DObject.freeze%3Bexport%20const%20objectDefineProperties%3DObject.defineProperties%3Bexport%20const%20numberIsNaN%3DNumber.isNaN%3Bexport%20const%20arrayIsArray%3DArray.isArray%3Bexport%20const%20promise%3DPromise%3Bexport%20const%20typeError%3DTypeError%3Bexport%20const%20error%3DError%3B";
const Number = 0;
const Array = 0;
const TypeError = 0;
const Error = 0;
function checkNumber(value) {
  if (typeof value !== "number" || lyknIntrinsicNumberIsNaN0(value)) {
    throw new lyknIntrinsicTypeError0("checkNumber: arg 'value' expected number, got " + typeof value);
  }
  const result__gensym0 = value;
  if (typeof result__gensym0 !== "number" || lyknIntrinsicNumberIsNaN0(result__gensym0)) {
    throw new lyknIntrinsicTypeError0("checkNumber: return value expected number, got " + typeof result__gensym0);
  }
  return result__gensym0;
}
function checkArray(value) {
  if (!lyknIntrinsicArrayIsArray0(value)) {
    throw new lyknIntrinsicTypeError0("checkArray: arg 'value' expected array, got " + typeof value);
  }
  return value;
}
function captureNumber() {
  try {
    return checkNumber("wrong");
  } catch (error) {
    return [error.name, error.message];
  }
}
function captureArray() {
  try {
    return checkArray(1);
  } catch (error) {
    return [error.name, error.message];
  }
}
function captureMatch() {
  try {
    {
      const target__gensym1 = 1;
      let matched__gensym2 = false;
      if (!matched__gensym2 && target__gensym1 === 2) {
        {
          matched__gensym2 = true;
          return "matched";
        }
      }
      if (!matched__gensym2) {
        throw new lyknIntrinsicError0("match: no matching pattern");
      }
    }
  } catch (error) {
    return [error.name, error.message];
  }
}
const observed = [captureNumber(), captureArray(), captureMatch()];
console.log(JSON.stringify(observed));
