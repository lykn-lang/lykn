const trace = [];
function readValue(input) {
  return (() => {
    const target__gensym23 = (() => {
      trace.push("subject");
      return input;
    })();
    {
      if ((() => {
        trace.push("guard");
        return false;
      })()) {
        return "wrong";
      }
    }
    if (target__gensym23 === 1) {
      return "normal";
    }
    {
      return "inside";
    }
  })();
}
console.log(JSON.stringify([readValue(0), readValue(1), trace]));
