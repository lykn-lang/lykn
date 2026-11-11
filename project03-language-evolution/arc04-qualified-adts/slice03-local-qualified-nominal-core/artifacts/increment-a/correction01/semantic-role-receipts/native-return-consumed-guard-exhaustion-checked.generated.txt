const lyknIntrinsicError0 = Error;
const trace = [];
function exhausted() {
  {
    const target__gensym0 = 0;
    let matched__gensym1 = false;
    if (!matched__gensym1) {
      let completionValue__gensym0;
      {
        trace.push("guard");
        completionValue__gensym0 = false;
      }
      if (completionValue__gensym0) {
        matched__gensym1 = true;
        return 1;
      }
    }
    if (!matched__gensym1) {
      throw new lyknIntrinsicError0("match: no matching pattern");
    }
  }
}
try {
  trace.push(exhausted());
} catch (e) {
  trace.push(e.message);
}
console.log(JSON.stringify(trace));
