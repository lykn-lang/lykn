const trace = [];
function exhausted() {
  {
    const target__gensym25 = 0;
    let matched__gensym26 = false;
    if (!matched__gensym26) {
      if ((() => {
        trace.push("guard");
        return false;
      })()) {
        matched__gensym26 = true;
        return 1;
      }
    }
    if (!matched__gensym26) {
      throw new Error("match: no matching pattern");
    }
  }
}
try {
  trace.push(exhausted());
} catch (e) {
  trace.push(e.message);
}
console.log(JSON.stringify(trace));
