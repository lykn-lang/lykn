const trace = [];
function chooseHeader(mode) {
  if ((() => {
    trace.push("statement");
    if (mode === 0) {
      return 80;
    }
    return false;
  })()) {
    trace.push("wrong");
  }
  let completionValue__gensym0;
  {
    if ((() => {
      trace.push("value");
      if (mode === 1) {
        return 81;
      }
      return mode === 2;
    })()) {
      {
        trace.push("then");
        completionValue__gensym0 = 7;
      }
    } else {
      {
        trace.push("else");
        completionValue__gensym0 = 8;
      }
    }
  }
  const result = completionValue__gensym0;
  trace.push("after");
  return result;
}
console.log(JSON.stringify([chooseHeader(0), chooseHeader(1), chooseHeader(2), chooseHeader(3), trace]));
