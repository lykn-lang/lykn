const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
function total(...args) {
  if (args.length === 2 && typeof args[0] === "number" && typeof args[1] === "number") {
    const a = args[0];
    const b = args[1];
    if (typeof a !== "number" || lyknIntrinsicNumberIsNaN0(a)) {
      throw new lyknIntrinsicTypeError0("total: arg 'a' expected number, got " + typeof a);
    }
    if (typeof b !== "number" || lyknIntrinsicNumberIsNaN0(b)) {
      throw new lyknIntrinsicTypeError0("total: arg 'b' expected number, got " + typeof b);
    }
    const result = a + b;
    return result;
  }
  if (args.length === 1) {
    const bind = args[0];
    return bind(11);
  }
  throw new lyknIntrinsicTypeError0("total: no matching clause for arguments");
}
console.log(total(value => value));
console.log(total(20, 22));
