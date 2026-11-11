const lyknIntrinsicArrayIsArray0 = Array.isArray;
const lyknIntrinsicTypeError0 = TypeError;
function runWithShadow(Array) {
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
  function captureUnknown() {
    try {
      return chooseValue(1);
    } catch (error) {
      return [error.name, error.message];
    }
  }
  return [chooseValue([1]), chooseValue("kept"), captureUnknown()];
}
console.log(JSON.stringify(runWithShadow(0)));
