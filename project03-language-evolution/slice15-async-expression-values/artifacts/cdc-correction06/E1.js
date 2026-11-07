function typedBranch(takeLeft) {
  if (typeof takeLeft !== "boolean") throw new TypeError("typedBranch: arg 'takeLeft' expected boolean, got " + typeof takeLeft);

  const result__gensym0 = takeLeft ? (() => {
    const left = 40;
    return left + 1;
  })() : (() => {
    const right = 40;
    return right + 2;
  })();
  if (!(result__gensym0 > 0)) throw new Error("typed-branch: post-condition failed: (> ~ 0) — callee blame");

  return result__gensym0;
}
const result = typedBranch(true);
const other = typedBranch(false);
const prefixEffect = { value: 0 };
const noElseResult = (() => {
  const prefix = 1;
  if (true) prefixEffect.value = 1;

  return prefix + 40;
})();
const nestedEquality = 7 === (true ? 7 : 8);
console.log(JSON.stringify({ value: result, falseValue: other, typeof: typeof result, noElsePrefix: noElseResult, nestedEquality: nestedEquality, prefixEffect: prefixEffect.value }));
