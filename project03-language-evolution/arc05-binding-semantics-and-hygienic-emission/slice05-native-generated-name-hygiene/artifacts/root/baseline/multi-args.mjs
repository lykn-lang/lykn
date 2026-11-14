const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
function pick(...args) {
  if (args.length === 1 && typeof args[0] === "number") {
    const args = args[0];
    if (typeof args !== "number" || lyknIntrinsicNumberIsNaN0(args)) {
      throw new lyknIntrinsicTypeError0("pick: arg 'args' expected number, got " + typeof args);
    }
    return args;
  }
  if (args.length === 1 && typeof args[0] === "string") {
    const args = args[0];
    if (typeof args !== "string") {
      throw new lyknIntrinsicTypeError0("pick: arg 'args' expected string, got " + typeof args);
    }
    return args;
  }
  throw new lyknIntrinsicTypeError0("pick: no matching clause for arguments");
}
console.log(pick(7));
