const trace = [];
function lazyResults(stop) {
  let completionValue__gensym0;
  {
    {
      let completionValue__gensym1;
      {
        trace.push("first");
        completionValue__gensym1 = 0;
      }
      if (completionValue__gensym1) {
        {
          trace.push("wrong-and");
          return 91;
        }
      }
      if (completionValue__gensym1) {
        completionValue__gensym1 = 92;
      }
      completionValue__gensym0 = completionValue__gensym1;
    }
  }
  const first = completionValue__gensym0;
  let completionValue__gensym2;
  {
    {
      let completionValue__gensym3;
      {
        trace.push("second");
        completionValue__gensym3 = "kept";
      }
      if (!completionValue__gensym3) {
        {
          trace.push("wrong-or");
          return 93;
        }
      }
      completionValue__gensym2 = completionValue__gensym3;
    }
  }
  const second = completionValue__gensym2;
  {
    let completionValue__gensym4;
    {
      trace.push(first);
      completionValue__gensym4 = true;
    }
    if (completionValue__gensym4) {
      {
        trace.push(second);
        if (stop) {
          return 7;
        }
        completionValue__gensym4 = "next";
      }
    }
    if (completionValue__gensym4) {
      {
        trace.push("last");
        completionValue__gensym4 = [first, second];
      }
    }
    return completionValue__gensym4;
  }
}
function boundLogical() {
  const and = (a, b) => [a, b];
  return and(trace.push("arg1"), trace.push("arg2"));
}
function pureLogical() {
  return false && "wrong" || true && "pure";
}
console.log(JSON.stringify([lazyResults(true), lazyResults(false), boundLogical(), pureLogical(), trace]));
