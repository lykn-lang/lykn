const target__gensym0 = 101;
const matched__gensym1 = 201;
const matched__gensym2 = 202;
const matched__gensym3 = 203;
const trace = [];
{
  const target__gensym1 = 0;
  let matched__gensym4 = false;
  if (!matched__gensym4) {
    {
      matched__gensym4 = true;
      trace.push(target__gensym0);
      trace.push(matched__gensym1);
      trace.push(matched__gensym2);
      trace.push(matched__gensym3);
    }
  }
}
{
  const target__gensym5 = 0;
  let matched__gensym6 = false;
  if (!matched__gensym6) {
    {
      matched__gensym6 = true;
      trace.push(7);
    }
  }
}
const keep = (() => {
  {
    const target__gensym7 = 0;
    let matched__gensym8 = false;
    if (!matched__gensym8) {
      {
        matched__gensym8 = true;
        trace.push(8);
      }
    }
  }
  return (() => {
    const target__gensym9 = 1;
    {
      return 41;
    }
  })();
})();
const match = n => n;
console.log(JSON.stringify([trace, keep, match(42)]));
