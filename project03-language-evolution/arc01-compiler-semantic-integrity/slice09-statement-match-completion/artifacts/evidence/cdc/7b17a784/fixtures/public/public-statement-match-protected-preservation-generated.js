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
      return "bad";
    }
  })();
  const result__gensym9 = 7;
  if (typeof result__gensym9 !== "number" || Number.isNaN(result__gensym9)) {
    throw new TypeError("checked: return value expected number, got " + typeof result__gensym9);
  }
  if (!verifyResult(result__gensym9)) {
    throw new Error("checked: post-condition failed: (verify-result ~) — callee blame");
  }
  return result__gensym9;
}
console.log(JSON.stringify([checked(), trace]));
