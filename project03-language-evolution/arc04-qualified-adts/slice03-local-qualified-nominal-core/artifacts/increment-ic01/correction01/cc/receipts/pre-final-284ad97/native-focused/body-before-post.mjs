const lyknIntrinsicError0 = Error;
function sample() {
  const bind = (a, b) => a === eval;
  const result__gensym0 = true;
  if (!bind(eval, 1)) {
    throw new lyknIntrinsicError0("sample: post-condition failed: (bind eval 1) — callee blame");
  }
  return result__gensym0;
}
console.log(sample());
