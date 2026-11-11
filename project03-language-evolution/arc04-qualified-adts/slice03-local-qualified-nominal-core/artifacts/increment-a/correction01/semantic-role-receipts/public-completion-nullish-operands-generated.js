const trace = [];
function nullishResult(input) {
  let completionValue__gensym0;
  {
    {
      let completionValue__gensym1;
      {
        trace.push("left");
        completionValue__gensym1 = input;
      }
      if (completionValue__gensym1 === null || completionValue__gensym1 === void 0) {
        {
          trace.push("right");
          return "early";
          completionValue__gensym1 = "unreachable";
        }
      }
      if (completionValue__gensym1 === null || completionValue__gensym1 === void 0) {
        {
          trace.push("wrong");
          completionValue__gensym1 = 91;
        }
      }
      completionValue__gensym0 = completionValue__gensym1;
    }
  }
  const result = completionValue__gensym0;
  trace.push("after");
  return result;
}
console.log(JSON.stringify([nullishResult(0), nullishResult(false), nullishResult(null), nullishResult(undefined), trace]));
