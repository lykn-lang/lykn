const trace = [];
function plusTen(n) {
  return n + 10;
}
{
  const target__gensym17 = plusTen;
  let matched__gensym20 = false;
  if (!matched__gensym20) {
    const match = target__gensym17;
    if ((() => {
      trace.push(match(1));
      return false;
    })()) {
      matched__gensym20 = true;
      trace.push("wrong");
    }
  }
  if (!matched__gensym20) {
    {
      matched__gensym20 = true;
      {
        const target__gensym18 = 2;
        let matched__gensym19 = false;
        if (!matched__gensym19 && target__gensym18 === 1) {
          {
            matched__gensym19 = true;
            trace.push("wrong-inner");
          }
        }
        if (!matched__gensym19) {
          {
            matched__gensym19 = true;
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
