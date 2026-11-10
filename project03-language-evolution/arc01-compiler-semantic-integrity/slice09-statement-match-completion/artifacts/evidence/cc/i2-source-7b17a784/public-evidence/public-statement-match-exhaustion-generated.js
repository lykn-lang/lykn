const trace = [];
try {
  {
    const target__gensym7 = 2;
    let matched__gensym8 = false;
    if (!matched__gensym8) {
      if ((() => {
        trace.push("guard");
        return false;
      })()) {
        matched__gensym8 = true;
        trace.push("wrong");
      }
    }
    if (!matched__gensym8) {
      throw new Error("match: no matching pattern");
    }
  }
  trace.push("after");
} catch (err) {
  trace.push(err.message);
}
console.log(JSON.stringify(trace));
