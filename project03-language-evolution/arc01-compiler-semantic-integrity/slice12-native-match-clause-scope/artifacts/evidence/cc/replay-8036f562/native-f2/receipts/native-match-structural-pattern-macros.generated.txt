const trace = [];
{
  const target__gensym0 = JSON.parse("{\"key\":7}");
  let matched__gensym1 = false;
  if (!matched__gensym1) {
    const clausePush = target__gensym0;
    if (false) {
      matched__gensym1 = true;
      trace.push("wrong");
    }
  }
  if (!matched__gensym1 && target__gensym0 === 0) {
    if (n === 7) {
      matched__gensym1 = true;
      clausePush(n);
    }
  }
  if (!matched__gensym1) {
    {
      matched__gensym1 = true;
      trace.push("fallback");
    }
  }
}
console.log(JSON.stringify(trace));
