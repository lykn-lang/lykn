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
  if (target__gensym0 === 1) {
    if (gate("wrong-pattern", true)) {
      trace.push("wrong-body");
    }
  } else {
    if (target__gensym0 === 2) {
      if (gate("literal-false", false)) {
        trace.push("wrong-literal");
      }
    } else {
      const captured = target__gensym0;
      if (gate(captured, false)) {
        trace.push("wrong-binding");
      }
    }
  }
}
console.log(JSON.stringify(trace));
