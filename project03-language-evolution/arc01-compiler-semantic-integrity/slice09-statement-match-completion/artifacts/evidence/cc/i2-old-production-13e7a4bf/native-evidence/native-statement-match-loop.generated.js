const trace = [];
for (let i = 0; i < 4; ++i) {
  {
    const target__gensym0 = i;
    if (target__gensym0 === 1) {
      continue;
    } else {
      if (target__gensym0 === 3) {
        break;
      } else {
        trace.push(i);
      }
    }
  }
  trace.push(i + 10);
}
console.log(JSON.stringify(trace));
