const trace = [];
function originalCall(earlier, middle, later) {
  trace.push("old");
  return ["old", middle];
}
function replacementCall(earlier, middle, later) {
  trace.push("new");
  return ["new", middle];
}
function useLexicalCall(callable, stop) {
  let completionValue__gensym0;
  {
    const completionValue__gensym1 = callable;
    const completionValue__gensym2 = trace.push("earlier");
    let completionValue__gensym3;
    {
      trace.push("middle");
      callable = replacementCall;
      if (stop) {
        return 91;
      }
      completionValue__gensym3 = 8;
    }
    completionValue__gensym0 = completionValue__gensym1(completionValue__gensym2, completionValue__gensym3, trace.push("later"));
  }
  const answer = completionValue__gensym0;
  trace.push("after");
  return answer;
}
console.log(JSON.stringify([useLexicalCall(originalCall, true), useLexicalCall(originalCall, false), trace]));
