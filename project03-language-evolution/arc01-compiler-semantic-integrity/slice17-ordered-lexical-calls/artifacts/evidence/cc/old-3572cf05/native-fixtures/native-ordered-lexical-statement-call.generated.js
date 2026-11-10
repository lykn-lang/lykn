const trace = [];
function observeCall(earlier, middle) {
  return trace.push(middle);
}
function useStatementCall(and, stop) {
  and(trace.push("first"), (() => {
    trace.push("middle");
    if (stop) {
      return 90;
    }
    return 4;
  })());
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
