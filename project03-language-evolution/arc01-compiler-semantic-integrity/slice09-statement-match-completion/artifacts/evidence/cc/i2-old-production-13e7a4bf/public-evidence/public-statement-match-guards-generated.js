const trace = [];
function subject() {
  trace.push("subject");
  return 2;
}
function gate(mark, result) {
  trace.push(mark);
  return result;
}
(() => {
  const target__gensym1 = subject();
  if (target__gensym1 === 1) {
    if (gate("wrong-pattern", true)) {
      return trace.push("wrong-body");
    }
  }
  if (target__gensym1 === 2) {
    if (gate("literal-false", false)) {
      return trace.push("wrong-literal");
    }
  }
  {
    const captured = target__gensym1;
    if (gate(captured, false)) {
      return trace.push("wrong-binding");
    }
  }
  {
    if (gate("chosen", true)) {
      return trace.push("body");
    }
  }
  {
    if (gate("late", true)) {
      return trace.push("late-body");
    }
  }
})();
console.log(JSON.stringify(trace));
