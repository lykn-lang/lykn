const trace = [];
function bindLoop() {
  for (let i = 0; i < 4; ++i) {
    let completionValue__gensym0;
    {
      {
        if (i === 1) {
          continue;
        }
        if (i === 3) {
          break;
        }
        completionValue__gensym0 = i;
      }
    }
    const value = completionValue__gensym0;
    trace.push(value);
  }
  return trace;
}
console.log(JSON.stringify(bindLoop()));
