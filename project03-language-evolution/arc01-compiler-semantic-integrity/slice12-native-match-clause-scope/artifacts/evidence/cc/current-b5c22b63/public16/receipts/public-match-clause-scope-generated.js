const trace = [];
function plusTen(n) {
  return n + 10;
}
function traceFalse(value) {
  trace.push(value);
  return false;
}
{
  const target__gensym11 = plusTen;
  let matched__gensym14 = false;
  if (!matched__gensym14) {
    const match = target__gensym11;
    if (traceFalse(match(1))) {
      matched__gensym14 = true;
      trace.push("wrong");
    }
  }
  if (!matched__gensym14) {
    {
      matched__gensym14 = true;
      {
        const target__gensym12 = 2;
        let matched__gensym13 = false;
        if (!matched__gensym13 && target__gensym12 === 1) {
          {
            matched__gensym13 = true;
            trace.push("wrong-inner");
          }
        }
        if (!matched__gensym13) {
          {
            matched__gensym13 = true;
            trace.push(22);
          }
        }
      }
    }
  }
}
{
  const match = (a, b) => a + b;
  trace.push(match(3, plusTen(1)));
}
console.log(JSON.stringify(trace));
