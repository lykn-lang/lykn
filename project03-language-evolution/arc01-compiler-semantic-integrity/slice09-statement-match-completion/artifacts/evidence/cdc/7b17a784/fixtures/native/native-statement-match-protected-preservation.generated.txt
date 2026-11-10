const trace = [];
function verifyResult(n) {
  trace.push(n);
  return n === 7;
}
function checked() {
  {
    const target__gensym0 = 0;
    {
      if (false) {
        return 99;
      }
    }
  }
  const result__gensym1 = 7;
  if (!verifyResult(result__gensym1)) {
    throw new Error("checked: post-condition failed: (verify-result ~) — callee blame");
  }
  return result__gensym1;
}
console.log(JSON.stringify([checked(), trace]));
