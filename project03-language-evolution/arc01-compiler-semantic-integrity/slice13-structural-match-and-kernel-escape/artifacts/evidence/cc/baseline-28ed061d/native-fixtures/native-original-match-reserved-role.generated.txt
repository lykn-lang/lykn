const trace = [];
function plusTen(n) {
  return n + 10;
}
{
  const target__gensym0 = plusTen;
  let matched__gensym1 = false;
  if (!matched__gensym1) {
    const match = target__gensym0;
    if ((() => {
      trace.push(match(1));
      return false;
    })()) {
      matched__gensym1 = true;
      trace.push("wrong");
    }
  }
  if (!matched__gensym1) {
    {
      matched__gensym1 = true;
      {
        const target__gensym2 = 2;
        let matched__gensym3 = false;
        if (!matched__gensym3 && target__gensym2 === 1) {
          {
            matched__gensym3 = true;
            trace.push("wrong-inner");
          }
        }
        if (!matched__gensym3) {
          {
            matched__gensym3 = true;
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
