const trace = [];
{
  const target__gensym21 = {
    key: 7
  };
  let matched__gensym22 = false;
  if (!matched__gensym22) {
    const clausePush = target__gensym21;
    if (false) {
      matched__gensym22 = true;
      trace.push("wrong");
    }
  }
  if (!matched__gensym22 && typeof target__gensym21 === "object" && target__gensym21 !== null && ("key" in target__gensym21)) {
    const n = target__gensym21.key;
    if (n === 7) {
      matched__gensym22 = true;
      trace.push(n);
    }
  }
  if (!matched__gensym22) {
    {
      matched__gensym22 = true;
      trace.push("fallback");
    }
  }
}
console.log(JSON.stringify(trace));
