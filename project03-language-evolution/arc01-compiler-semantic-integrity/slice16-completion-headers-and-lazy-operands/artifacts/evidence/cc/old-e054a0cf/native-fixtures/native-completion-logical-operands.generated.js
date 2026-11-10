const trace = [];
function lazyResults(stop) {
  const first = ((() => {
    trace.push("first");
    return 0;
  })() && (() => {
    trace.push("wrong-and");
    return 91;
  })()) && 92;
  const second = (() => {
    trace.push("second");
    return "kept";
  })() || (() => {
    trace.push("wrong-or");
    return 93;
  })();
  return ((() => {
    trace.push(first);
    return true;
  })() && (() => {
    trace.push(second);
    if (stop) {
      return 7;
    }
    return "next";
  })()) && (() => {
    trace.push("last");
    return [first, second];
  })();
}
function boundLogical() {
  const and = (a, b) => [a, b];
  return and(trace.push("arg1"), trace.push("arg2"));
}
function pureLogical() {
  return false && "wrong" || "pure";
}
console.log(JSON.stringify([lazyResults(true), lazyResults(false), boundLogical(), pureLogical(), trace]));
