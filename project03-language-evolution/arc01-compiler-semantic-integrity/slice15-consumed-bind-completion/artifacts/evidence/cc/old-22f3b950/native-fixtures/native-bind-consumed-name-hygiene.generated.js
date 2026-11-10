const completionValue__gensym1 = { value: 41 };
const trace = [];
function hygienicBind() {
  const answer = (() => {
    trace.push("result");
    return 7;
  })();
  const completionValue__gensym0 = { value: 99 };
  return [answer, completionValue__gensym0.value, completionValue__gensym1.value];
}
console.log(JSON.stringify([hygienicBind(), trace]));
