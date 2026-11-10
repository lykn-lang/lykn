const trace = [];
function subject() {
  trace.push("subject");
  return 2;
}
function gate(mark, result) {
  trace.push(mark);
  return result;
}
{
  const target__gensym1 = subject();
  let matched__gensym2 = false;
  if (!matched__gensym2 && target__gensym1 === 1) {
    if (gate("wrong-pattern", true)) {
      matched__gensym2 = true;
      trace.push("wrong-body");
    }
  }
  if (!matched__gensym2 && target__gensym1 === 2) {
    if (gate("literal-false", false)) {
      matched__gensym2 = true;
      trace.push("wrong-literal");
    }
  }
  if (!matched__gensym2) {
    const captured = target__gensym1;
    if (gate(captured, false)) {
      matched__gensym2 = true;
      trace.push("wrong-binding");
    }
  }
  if (!matched__gensym2) {
    if (gate("chosen", true)) {
      matched__gensym2 = true;
      trace.push("body");
    }
  }
  if (!matched__gensym2) {
    if (gate("late", true)) {
      matched__gensym2 = true;
      trace.push("late-body");
    }
  }
  if (!matched__gensym2) {
    {
      matched__gensym2 = true;
      trace.push("fallback");
    }
  }
}
console.log(JSON.stringify(trace));
