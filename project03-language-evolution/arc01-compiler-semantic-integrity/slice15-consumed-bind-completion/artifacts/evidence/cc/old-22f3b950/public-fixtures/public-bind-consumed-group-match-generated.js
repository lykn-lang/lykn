const trace = [];
function chooseBinding(flag) {
  const first = (() => {
    const target__gensym27 = flag;
    if (target__gensym27 === true) {
      return 81;
    }
    {
      return (() => {
        trace.push("match");
        return 7;
      })();
    }
  })();
  const second = false ? (() => {
    trace.push("wrong");
    return 0;
  })() : first + 1;
  trace.push(second);
  return second;
}
console.log(JSON.stringify([chooseBinding(true), chooseBinding(false), trace]));
