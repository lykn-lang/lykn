const lyknIntrinsicError0 = Error;
const trace = [];
function exhausted() {
  {
    const target__gensym25 = 0;
    let matched__gensym26 = false;
    if (!matched__gensym26) {
      let completionValue__gensym0;
      {
        trace.push("guard");
        completionValue__gensym0 = false;
      }
      if (completionValue__gensym0) {
        matched__gensym26 = true;
        return 1;
      }
    }
    if (!matched__gensym26) {
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
