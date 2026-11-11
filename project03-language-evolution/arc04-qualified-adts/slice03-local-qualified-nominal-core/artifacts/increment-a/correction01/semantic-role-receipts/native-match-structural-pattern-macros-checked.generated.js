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
  let pattern_field__gensym2;
  if (!matched__gensym1 && (((typeof target__gensym0 === "object" && target__gensym0 !== null) && "key" in target__gensym0) && (pattern_field__gensym2 = target__gensym0.key, true))) {
    const n = pattern_field__gensym2;
    if (n === 7) {
      matched__gensym1 = true;
      trace.push(n);
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
