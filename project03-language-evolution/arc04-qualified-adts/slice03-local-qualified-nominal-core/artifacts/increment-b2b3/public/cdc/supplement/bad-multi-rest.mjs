const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicArrayIsArray0 = Array.isArray;
const lyknIntrinsicTypeError0 = TypeError;
function choose(...args__gensym1) {
  if (args__gensym1.length === 1 && lyknIntrinsicArrayIsArray0(args__gensym1[0])) {
    const [first, ...tail] = args__gensym1[0];
    if (typeof first !== "number" || lyknIntrinsicNumberIsNaN0(first)) {
      throw new lyknIntrinsicTypeError0("choose: arg 'first' expected number, got " + typeof first);
    }
    for (const discardElement__gensym0 of tail) {
      if (typeof discardElement__gensym0 !== "number" || lyknIntrinsicNumberIsNaN0(discardElement__gensym0)) {
        throw new lyknIntrinsicTypeError0("choose: rest arg 'tail' expected number, got " + typeof discardElement__gensym0);
      }
    }
    return first;
  }
  if (args__gensym1.length === 1 && typeof args__gensym1[0] === "string") {
    const discardValue__gensym1 = args__gensym1[0];
    if (typeof discardValue__gensym1 !== "string") {
      throw new lyknIntrinsicTypeError0("choose: arg '_' expected string, got " + typeof discardValue__gensym1);
    }
    return 0;
  }
  throw new lyknIntrinsicTypeError0("choose: no matching clause for arguments");
}
console.log(choose([1, 2, "bad"]));
