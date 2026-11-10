const trace = [];
function chooseBinding(flag) {
  let completionValue__gensym0;
  {
    {
      const target__gensym27 = flag;
      let matched__gensym28 = false;
      if (!matched__gensym28 && target__gensym27 === true) {
        {
          matched__gensym28 = true;
          return 81;
        }
      }
      if (!matched__gensym28) {
        {
          matched__gensym28 = true;
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
  }
  const second = completionValue__gensym1;
  trace.push(second);
  return second;
}
console.log(JSON.stringify([chooseBinding(true), chooseBinding(false), trace]));
