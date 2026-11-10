const trace = [];
function chooseHeader(mode) {
  {
    let completionValue__gensym0;
    {
      trace.push("statement");
      if (mode === 0) {
        return 80;
      }
      completionValue__gensym0 = false;
    }
    if (completionValue__gensym0) {
      trace.push("wrong");
    }
  }
  let completionValue__gensym1;
  {
    {
      let completionValue__gensym2;
      {
        trace.push("value");
        if (mode === 1) {
          return 81;
        }
        completionValue__gensym2 = mode === 2;
      }
      if (completionValue__gensym2) {
        {
          trace.push("then");
          completionValue__gensym1 = 7;
        }
      } else {
        {
          trace.push("else");
          completionValue__gensym1 = 8;
        }
      }
    }
  }
  const result = completionValue__gensym1;
  trace.push("after");
  return result;
}
console.log(JSON.stringify([chooseHeader(0), chooseHeader(1), chooseHeader(2), chooseHeader(3), trace]));
