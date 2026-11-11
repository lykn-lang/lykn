function wrongReturn() {
  const result__gensym0 = "wrong";
  if (typeof result__gensym0 !== "number" || Number.isNaN(result__gensym0)) {
    throw new TypeError("wrongReturn: return value expected number, got " + typeof result__gensym0);
  }
  return result__gensym0;
}
console.log(wrongReturn());
