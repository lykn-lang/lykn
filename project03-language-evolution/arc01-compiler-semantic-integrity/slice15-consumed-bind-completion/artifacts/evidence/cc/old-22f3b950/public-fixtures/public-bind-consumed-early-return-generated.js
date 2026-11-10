const trace = [];
function chooseBound(flag) {
  const answer = (() => {
    if (flag) {
      return "early";
    }
    trace.push("body");
    return 7;
  })();
  trace.push("after");
  return answer;
}
console.log(JSON.stringify([chooseBound(true), chooseBound(false), trace]));
