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
  if (typeof x !== "number" || Number.isNaN(x)) {
    throw new TypeError("bind: binding 'x' expected number, got " + typeof x);
  }
  trace.push(x);
  return x;
}
console.log(JSON.stringify([typedPick(true), typedPick(false), trace]));
