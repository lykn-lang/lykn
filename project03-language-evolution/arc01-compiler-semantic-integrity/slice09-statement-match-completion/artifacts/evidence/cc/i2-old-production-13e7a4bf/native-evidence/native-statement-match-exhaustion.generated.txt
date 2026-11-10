const trace = [];
try {
  {
    const target__gensym0 = 2;
    {
      if ((() => {
        trace.push("guard");
        return false;
      })()) {
        trace.push("wrong");
      }
    }
  }
  trace.push("after");
} catch (err) {
  trace.push(err.message);
}
console.log(JSON.stringify(trace));
