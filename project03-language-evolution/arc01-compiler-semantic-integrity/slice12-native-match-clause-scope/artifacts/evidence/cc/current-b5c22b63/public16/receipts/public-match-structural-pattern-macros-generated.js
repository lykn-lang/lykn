const trace = [];
{
  const target__gensym15 = JSON.parse("{\"key\":7}");
  let matched__gensym16 = false;
  if (!matched__gensym16) {
    const clausePush = target__gensym15;
    if (false) {
      matched__gensym16 = true;
      trace.push("wrong");
    }
  }
  if (!matched__gensym16 && typeof target__gensym15 === "object" && target__gensym15 !== null && ("key" in target__gensym15)) {
    const n = target__gensym15.key;
    if (n === 7) {
      matched__gensym16 = true;
      trace.push(n);
    }
  }
  if (!matched__gensym16) {
    {
      matched__gensym16 = true;
      trace.push("fallback");
    }
  }
}
console.log(JSON.stringify(trace));
