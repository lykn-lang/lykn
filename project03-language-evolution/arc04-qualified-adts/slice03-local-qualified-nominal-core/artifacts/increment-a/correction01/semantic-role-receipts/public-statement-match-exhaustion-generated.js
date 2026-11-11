const lyknIntrinsicError0 = Error;
const trace = [];
try {
  {
    const target__gensym8 = 2;
    let matched__gensym9 = false;
    if (!matched__gensym9) {
      if ((() => {
        trace.push("guard");
        return false;
      })()) {
        matched__gensym9 = true;
        trace.push("wrong");
      }
    }
    if (!matched__gensym9) {
      throw new lyknIntrinsicError0("match: no matching pattern");
    }
  }
  trace.push("after");
} catch (err) {
  trace.push(err.message);
}
console.log(JSON.stringify(trace));
