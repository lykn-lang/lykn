const trace = [];
function chooseBinding(flag) {
  let completionValue__gensym0;
  {
    {
      const target__gensym0 = flag;
      let matched__gensym1 = false;
      if (!matched__gensym1 && target__gensym0 === true) {
        {
          matched__gensym1 = true;
          return 81;
        }
      }
      if (!matched__gensym1) {
        {
          matched__gensym1 = true;
          {
            trace.push("match");
            completionValue__gensym0 = 7;
          }
        }
      }
    }
  }
  const first = completionValue__gensym0;
  let completionValue__gensym1;
  {
    if (false) {
      {
        trace.push("wrong");
        completionValue__gensym1 = 0;
      }
    } else {
      completionValue__gensym1 = first + 1;
    }
  }
  const second = completionValue__gensym1;
  trace.push(second);
  return second;
}
console.log(JSON.stringify([chooseBinding(true), chooseBinding(false), trace]));
