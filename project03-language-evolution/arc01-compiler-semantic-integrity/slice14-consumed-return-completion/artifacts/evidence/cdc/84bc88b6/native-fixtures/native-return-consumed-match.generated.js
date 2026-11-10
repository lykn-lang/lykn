const trace = [];
function readValue(input) {
  {
    const target__gensym0 = (() => {
      trace.push("subject");
      return input;
    })();
    let matched__gensym1 = false;
    if (!matched__gensym1) {
      if ((() => {
        trace.push("guard");
        return false;
      })()) {
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
