const trace = [];
try {
  (() => {
    const target__gensym4 = 2;
    {
      if ((() => {
        trace.push("guard");
        return false;
      })()) {
        return trace.push("wrong");
      }
    }
  })();
  trace.push("after");
} catch (err) {
  trace.push(err.message);
}
console.log(JSON.stringify(trace));
