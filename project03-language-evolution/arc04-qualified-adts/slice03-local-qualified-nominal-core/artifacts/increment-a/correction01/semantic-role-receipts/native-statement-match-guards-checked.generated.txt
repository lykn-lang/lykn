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
  const target__gensym0 = subject();
  let matched__gensym1 = false;
  if (!matched__gensym1 && target__gensym0 === 1) {
    if (gate("wrong-pattern", true)) {
      matched__gensym1 = true;
      trace.push("wrong-body");
    }
  }
  if (!matched__gensym1 && target__gensym0 === 2) {
    if (gate("literal-false", false)) {
      matched__gensym1 = true;
      trace.push("wrong-literal");
    }
  }
  if (!matched__gensym1) {
    const captured = target__gensym0;
    if (gate(captured, false)) {
      matched__gensym1 = true;
      trace.push("wrong-binding");
    }
  }
  if (!matched__gensym1) {
    if (gate("chosen", true)) {
      matched__gensym1 = true;
      trace.push("body");
    }
  }
  if (!matched__gensym1) {
    if (gate("late", true)) {
      matched__gensym1 = true;
      trace.push("late-body");
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
