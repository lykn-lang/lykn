const trace = [];
function readValue(input) {
  {
    let completionValue__gensym0;
    {
      trace.push("subject");
      completionValue__gensym0 = input;
    }
    const target__gensym23 = completionValue__gensym0;
    let matched__gensym24 = false;
    if (!matched__gensym24) {
      let completionValue__gensym1;
      {
        trace.push("guard");
        completionValue__gensym1 = false;
      }
      if (completionValue__gensym1) {
        matched__gensym24 = true;
        return "wrong";
      }
    }
    if (!matched__gensym24 && target__gensym23 === 1) {
      {
        matched__gensym24 = true;
        return "normal";
      }
    }
    if (!matched__gensym24) {
      {
        matched__gensym24 = true;
        return "inside";
      }
    }
  }
}
console.log(JSON.stringify([readValue(0), readValue(1), trace]));
