const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
const trace = [];
function choose(n) {
  if (typeof n !== "number" || lyknIntrinsicNumberIsNaN0(n)) {
    throw new lyknIntrinsicTypeError0("choose: arg 'n' expected number, got " + typeof n);
  }
  {
    const target__gensym0 = n;
    let matched__gensym1 = false;
    if (!matched__gensym1) {
      const captured = target__gensym0;
      if (captured === 1) {
        matched__gensym1 = true;
        if (true) {
          trace.push("guard");
        }
        return true ? 7 : 8;
      }
    }
    if (!matched__gensym1) {
      {
        matched__gensym1 = true;
        if (true) {
          trace.push("fallback");
        }
        return false ? 9 : 10;
      }
    }
  }
}
console.log(JSON.stringify([[choose(1), choose(2)], trace]));
