const trace = [];
function exhausted() {
  {
    const target__gensym0 = 0;
    let matched__gensym1 = false;
    if (!matched__gensym1) {
      if ((() => {
        trace.push("guard");
        return false;
      })()) {
        matched__gensym1 = true;
        return 1;
      }
    }
    if (!matched__gensym1) {
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
