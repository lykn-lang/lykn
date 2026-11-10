const trace = [];
for (let i = 0; i < 4; ++i) {
  (() => {
    const target__gensym3 = i;
    if (target__gensym3 === 1) {
      continue;
    }
    if (target__gensym3 === 3) {
      break;
    }
    {
      return trace.push(i);
    }
  })();
  trace.push(i + 10);
}
console.log(JSON.stringify(trace));
