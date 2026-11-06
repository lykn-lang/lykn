function unusedPure(n) {
  if (typeof n !== "number" || Number.isNaN(n)) throw new TypeError("unusedPure: arg 'n' expected number, got " + typeof n);

  const result__gensym0 = n * 2;
  if (typeof result__gensym0 !== "number" || Number.isNaN(result__gensym0)) throw new TypeError("unusedPure: return value expected number, got " + typeof result__gensym0);

  return result__gensym0;
}
export {unusedPure};
