const trace = [];
function chooseBound(flag) {
  let completionValue__gensym0;
  {
    {
      if (flag) {
        return "early";
      }
      trace.push("body");
      completionValue__gensym0 = 7;
    }
  }
  const answer = completionValue__gensym0;
  trace.push("after");
  return answer;
}
console.log(JSON.stringify([chooseBound(true), chooseBound(false), trace]));
