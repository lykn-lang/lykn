const trace = [];
try {
  {
    const target__gensym0 = 2;
    let matched__gensym1 = false;
    if (!matched__gensym1) {
      if ((() => {
        trace.push("guard");
        return false;
      })()) {
        matched__gensym1 = true;
        trace.push("wrong");
      }
    }
    if (!matched__gensym1) {
      throw new Error("match: no matching pattern");
    }
  }
  trace.push("after");
} catch (err) {
  trace.push(err.message);
}
console.log(JSON.stringify(trace));
