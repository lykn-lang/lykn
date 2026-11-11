const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
const trace = [];
function typedPick(flag) {
  let completionValue__gensym0;
  {
    {
      if (flag) {
        return "early";
      }
      completionValue__gensym0 = 9;
    }
  }
  const x = completionValue__gensym0;
  if (typeof x !== "number" || lyknIntrinsicNumberIsNaN0(x)) {
    throw new lyknIntrinsicTypeError0("bind: binding 'x' expected number, got " + typeof x);
  }
  trace.push(x);
  return x;
}
console.log(JSON.stringify([typedPick(true), typedPick(false), trace]));
