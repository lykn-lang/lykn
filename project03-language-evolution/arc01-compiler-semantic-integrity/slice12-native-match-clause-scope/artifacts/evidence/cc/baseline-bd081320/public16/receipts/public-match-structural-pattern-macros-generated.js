const trace = [];
{
  const target__gensym11 = {
    key: 7
  };
  let matched__gensym12 = false;
  if (!matched__gensym12) {
    const clausePush = target__gensym11;
    if (false) {
      matched__gensym12 = true;
      trace.push("wrong");
    }
  }
  if (!matched__gensym12 && typeof target__gensym11 === "object" && target__gensym11 !== null && ("key" in target__gensym11)) {
    const n = target__gensym11.key;
    if (n === 7) {
      matched__gensym12 = true;
      trace.push(n);
    }
  }
  if (!matched__gensym12) {
    {
      matched__gensym12 = true;
      trace.push("fallback");
    }
  }
}
console.log(JSON.stringify(trace));
