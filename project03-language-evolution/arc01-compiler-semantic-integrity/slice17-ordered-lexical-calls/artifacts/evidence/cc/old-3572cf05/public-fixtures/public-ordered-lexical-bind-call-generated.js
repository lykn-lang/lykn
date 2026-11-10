const trace = [];
function originalCall(earlier, middle, later) {
  trace.push("old");
  return ["old", middle];
}
function replacementCall(earlier, middle, later) {
  trace.push("new");
  return ["new", middle];
}
function useLexicalCall(callable, stop) {
  const answer = callable(trace.push("earlier"), (() => {
    trace.push("middle");
    callable = replacementCall;
    if (stop) {
      return 91;
    }
    return 8;
  })(), trace.push("later"));
  trace.push("after");
  return answer;
}
console.log(JSON.stringify([useLexicalCall(originalCall, true), useLexicalCall(originalCall, false), trace]));
