const trace = [];
function readValue(input) {
  return (() => {
    const target__gensym0 = (() => {
      trace.push("subject");
      return input;
    })();
    {
      if ((() => {
        trace.push("guard");
        return false;
      })()) {
        return return "wrong";
        ;
      }
    }
    if (target__gensym0 === 1) {
      return "normal";
    }
    {
      return return "inside";
      ;
    }
  })();
}
console.log(JSON.stringify([readValue(0), readValue(1), trace]));
