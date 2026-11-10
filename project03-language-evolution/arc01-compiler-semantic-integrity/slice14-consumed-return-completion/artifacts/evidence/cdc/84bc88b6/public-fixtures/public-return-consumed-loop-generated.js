const trace = [];
function iterate() {
  for (let i = 0; i < 4; ++i) {
    {
      if (i === 0) {
        continue;
      }
      if (i === 2) {
        break;
      }
      trace.push(i);
      {
        if (i === 1) {
          {
            trace.push("skip");
            continue;
          }
        } else {
          return "wrong";
        }
      }
    }
  }
  return "done";
}
console.log(JSON.stringify([iterate(), trace]));
