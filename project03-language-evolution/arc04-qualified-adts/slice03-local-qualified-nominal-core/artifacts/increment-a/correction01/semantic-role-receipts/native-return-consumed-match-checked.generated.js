const trace = [];
function readValue(input) {
  {
    let completionValue__gensym0;
    {
      trace.push("subject");
      completionValue__gensym0 = input;
    }
    const target__gensym0 = completionValue__gensym0;
    let matched__gensym1 = false;
    if (!matched__gensym1) {
      let completionValue__gensym1;
      {
        trace.push("guard");
        completionValue__gensym1 = false;
      }
      if (completionValue__gensym1) {
        matched__gensym1 = true;
        return "wrong";
      }
    }
    if (!matched__gensym1 && target__gensym0 === 1) {
      {
        matched__gensym1 = true;
        return "normal";
      }
    }
    if (!matched__gensym1) {
      {
        matched__gensym1 = true;
        return "inside";
      }
    }
  }
}
console.log(JSON.stringify([readValue(0), readValue(1), trace]));
