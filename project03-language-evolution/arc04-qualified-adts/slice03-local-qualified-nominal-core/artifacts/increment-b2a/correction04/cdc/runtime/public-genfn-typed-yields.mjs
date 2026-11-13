const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
const factory = function* () {
  yield (() => {
    const yv__gensym1 = 41;
    if (typeof yv__gensym1 !== "number" || lyknIntrinsicNumberIsNaN0(yv__gensym1)) {
      throw new lyknIntrinsicTypeError0("anonymous: yield 'yv__gensym1' expected number, got " + typeof yv__gensym1);
    }
    return yv__gensym1;
  })();
};
const stream = factory();
console.log(stream.next()["value"]);
