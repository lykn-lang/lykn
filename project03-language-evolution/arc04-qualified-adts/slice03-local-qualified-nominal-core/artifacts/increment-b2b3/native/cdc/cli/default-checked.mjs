const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
globalThis._ = 99;
globalThis.defaultCalls = 0;
function provide() {
  globalThis.defaultCalls = globalThis.defaultCalls + 1;
  const result__gensym0 = 7;
  if (typeof result__gensym0 !== "number" || lyknIntrinsicNumberIsNaN0(result__gensym0)) {
    throw new lyknIntrinsicTypeError0("provide: return value expected number, got " + typeof result__gensym0);
  }
  return result__gensym0;
}
function take(completionValue__gensym0 = provide()) {
  if (typeof completionValue__gensym0 !== "number" || lyknIntrinsicNumberIsNaN0(completionValue__gensym0)) {
    throw new lyknIntrinsicTypeError0("take: arg '_' expected number, got " + typeof completionValue__gensym0);
  }
  return _;
}
console.log(take());
console.log(take(8));
console.log(globalThis.defaultCalls);
