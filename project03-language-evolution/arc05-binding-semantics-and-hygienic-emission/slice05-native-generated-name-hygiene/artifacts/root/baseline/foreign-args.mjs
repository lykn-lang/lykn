const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
function pick(...args) {
  if (args.length === 1 && typeof args[0] === "number") {
    const value = args[0];
    if (typeof value !== "number" || lyknIntrinsicNumberIsNaN0(value)) {
      throw new lyknIntrinsicTypeError0("pick: arg 'value' expected number, got " + typeof value);
    }
    return args;
  }
  if (args.length === 1 && typeof args[0] === "string") {
    const value = args[0];
    if (typeof value !== "string") {
      throw new lyknIntrinsicTypeError0("pick: arg 'value' expected string, got " + typeof value);
    }
    return args;
  }
  throw new lyknIntrinsicTypeError0("pick: no matching clause for arguments");
}
console.log(pick(7));
