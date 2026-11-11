const lyknIntrinsicError0 = Error;
const trace = [];
function verifyResult(n) {
  trace.push(n);
  return n === 7;
}
function checked() {
  {
    const target__gensym0 = 0;
    let matched__gensym1 = false;
    if (!matched__gensym1) {
      if (false) {
        matched__gensym1 = true;
        return 99;
      }
    }
    if (!matched__gensym1) {
      {
        matched__gensym1 = true;
        trace.push("fallback");
      }
    }
  }
  const result__gensym2 = 7;
  if (!verifyResult(result__gensym2)) {
    throw new lyknIntrinsicError0("checked: post-condition failed: (verify-result ~) — callee blame");
  }
  return result__gensym2;
}
console.log(JSON.stringify([checked(), trace]));
