const trace = [];
function exhausted() {
  return (() => {
    const target__gensym0 = 0;
    {
      if ((() => {
        trace.push("guard");
        return false;
      })()) {
        return 1;
      }
    }
    throw new Error("match: no matching pattern");
  })();
}
try {
  trace.push(exhausted());
} catch (e) {
  trace.push(e.message);
}
console.log(JSON.stringify(trace));
