const trace = [];
function observeCall(earlier, middle) {
  return trace.push(middle);
}
function useStatementCall(and, stop) {
  {
    const completionValue__gensym0 = and;
    const completionValue__gensym1 = trace.push("first");
    let completionValue__gensym2;
    {
      trace.push("middle");
      if (stop) {
        return 90;
      }
      completionValue__gensym2 = 4;
    }
    completionValue__gensym0(completionValue__gensym1, completionValue__gensym2);
  }
  trace.push("after");
  return 91;
}
const early = useStatementCall(observeCall, true);
const normal = useStatementCall(observeCall, false);
try {
  useStatementCall(0, false);
} catch (problem) {
  trace.push(problem instanceof TypeError);
}
console.log(JSON.stringify([early, normal, trace]));
