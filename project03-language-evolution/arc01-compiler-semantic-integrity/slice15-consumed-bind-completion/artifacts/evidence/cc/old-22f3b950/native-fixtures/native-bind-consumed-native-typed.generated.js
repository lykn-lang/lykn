const trace = [];
function typedPick(flag) {
  const x = (() => {
    if (flag) {
      return "early";
    }
    return 9;
  })();
  if (typeof x !== "number" || Number.isNaN(x)) {
    throw new TypeError("bind: binding 'x' expected number, got " + typeof x);
  }
  trace.push(x);
  return x;
}
console.log(JSON.stringify([typedPick(true), typedPick(false), trace]));
