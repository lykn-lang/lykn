const lyknIntrinsicArrayIsArray0 = Array.isArray;
const lyknIntrinsicTypeError0 = TypeError;
function runWithShadow(Array) {
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
  return [chooseValue([1]), chooseValue("kept"), captureUnknown()];
}
console.log(JSON.stringify(runWithShadow(0)));
