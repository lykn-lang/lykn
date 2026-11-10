const trace = [];
function bindLoop() {
  for (let i = 0; i < 4; ++i) {
    const value = (() => {
      if (i === 1) {
        continue;
      }
      if (i === 3) {
        break;
      }
      return i;
    })();
    trace.push(value);
  }
  return trace;
}
console.log(JSON.stringify(bindLoop()));
