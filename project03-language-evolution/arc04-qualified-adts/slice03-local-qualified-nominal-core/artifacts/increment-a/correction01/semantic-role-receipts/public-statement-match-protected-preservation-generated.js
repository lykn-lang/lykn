const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
const lyknIntrinsicError0 = Error;
const trace = [];
function verifyResult(n) {
  trace.push(n);
  return n === 7;
}
function checked() {
  (() => {
    const target__gensym10 = 0;
    {
      if (false) {
        return 99;
      }
    }
    {
      return trace.push("fallback");
    }
  })();
  const result__gensym9 = 7;
  if (typeof result__gensym9 !== "number" || lyknIntrinsicNumberIsNaN0(result__gensym9)) {
    throw new lyknIntrinsicTypeError0("checked: return value expected number, got " + typeof result__gensym9);
  }
  if (!verifyResult(result__gensym9)) {
    throw new lyknIntrinsicError0("checked: post-condition failed: (verify-result ~) — callee blame");
  }
  return result__gensym9;
}
console.log(JSON.stringify([checked(), trace]));
