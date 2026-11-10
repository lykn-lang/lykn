const trace = [];
function nullishResult(input) {
  const result = (() => {
    trace.push("left");
    return input;
  })() ?? (() => {
    trace.push("right");
    return "early";
    return "unreachable";
  })() ?? (() => {
    trace.push("wrong");
    return 91;
  })();
  trace.push("after");
  return result;
}
console.log(JSON.stringify([nullishResult(0), nullishResult(false), nullishResult(null), nullishResult(undefined), trace]));
