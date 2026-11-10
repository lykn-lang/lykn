const trace = [];
function iterate() {
  for (let i = 0; i < 4; ++i) {
    return (() => {
      if (i === 0) {
        continue;
      }
      if (i === 2) {
        break;
      }
      trace.push(i);
      return i === 1 ? (() => {
        trace.push("skip");
        continue;
      })() : "wrong";
    })();
  }
  return "done";
}
console.log(JSON.stringify([iterate(), trace]));
