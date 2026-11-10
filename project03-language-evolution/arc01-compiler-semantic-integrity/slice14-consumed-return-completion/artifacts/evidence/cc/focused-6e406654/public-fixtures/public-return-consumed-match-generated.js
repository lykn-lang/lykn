const trace = [];
function readValue(input) {
  {
    const target__gensym23 = (() => {
      trace.push("subject");
      return input;
    })();
    let matched__gensym24 = false;
    if (!matched__gensym24) {
      if ((() => {
        trace.push("guard");
        return false;
      })()) {
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
