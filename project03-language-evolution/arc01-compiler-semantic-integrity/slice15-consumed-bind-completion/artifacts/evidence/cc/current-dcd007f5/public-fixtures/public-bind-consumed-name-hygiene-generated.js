const completionValue__gensym1 = {
  value: 41
};
const trace = [];
function hygienicBind() {
  let completionValue__gensym2;
  {
    {
      trace.push("result");
      completionValue__gensym2 = 7;
    }
  }
  const answer = completionValue__gensym2;
  const completionValue__gensym0 = {
    value: 99
  };
  return [answer, completionValue__gensym0.value, completionValue__gensym1.value];
}
console.log(JSON.stringify([hygienicBind(), trace]));
