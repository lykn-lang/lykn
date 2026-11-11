const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
const trace = [];
if (true) {
  const pick = n => {
    if (typeof n !== "number" || lyknIntrinsicNumberIsNaN0(n)) {
      throw new lyknIntrinsicTypeError0("anonymous: arg 'n' expected number, got " + typeof n);
    }
    return n + 100;
  };
  const saved = trace.push(pick(1));
} else {
  trace.push(2 + 10);
}
if (false) {
  const pick = n => {
    if (typeof n !== "number" || lyknIntrinsicNumberIsNaN0(n)) {
      throw new lyknIntrinsicTypeError0("anonymous: arg 'n' expected number, got " + typeof n);
    }
    return n + 200;
  };
  const saved = trace.push(pick(3));
} else {
  trace.push(4 + 10);
}
trace.push(5 + 10);
console.log(JSON.stringify(trace));
