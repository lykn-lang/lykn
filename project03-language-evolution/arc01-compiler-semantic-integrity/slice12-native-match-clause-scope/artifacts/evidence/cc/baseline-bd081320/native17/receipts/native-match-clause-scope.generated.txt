const trace = [];
function plusTen(n) {
  return n + 10;
}
{
  const target__gensym0 = plusTen;
  let matched__gensym1 = false;
  if (!matched__gensym1) {
    const match = target__gensym0;
    if (do(trace.push(match(1)), false)) {
      matched__gensym1 = true;
      trace.push("wrong");
    }
  }
  if (!matched__gensym1) {
    {
      matched__gensym1 = true;
      match(2, (1)(trace.push("wrong-inner")), _(trace.push(22)));
    }
  }
}
{
  const match = (a, b) => a + b;
  trace.push(match(3, plusTen(1)));
}
console.log(JSON.stringify(trace));
