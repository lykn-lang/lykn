const trace = [];
function exhausted() {
  return (() => {
    const target__gensym24 = 0;
    {
      if ((() => {
        trace.push("guard");
        return false;
      })()) {
        return 1;
      }
    }
  })();
}
try {
  trace.push(exhausted());
} catch (e) {
  trace.push(e.message);
}
console.log(JSON.stringify(trace));
