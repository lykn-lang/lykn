const trace = [];
{
  const target__gensym17 = {
    key: 7
  };
  let matched__gensym18 = false;
  if (!matched__gensym18) {
    const clausePush = target__gensym17;
    if (false) {
      matched__gensym18 = true;
      trace.push("wrong");
    }
  }
  if (!matched__gensym18 && typeof target__gensym17 === "object" && target__gensym17 !== null && ("key" in target__gensym17)) {
    const n = target__gensym17.key;
    if (n === 7) {
      matched__gensym18 = true;
      trace.push(n);
    }
  }
  if (!matched__gensym18) {
    {
      matched__gensym18 = true;
      trace.push("fallback");
    }
  }
}
console.log(JSON.stringify(trace));
