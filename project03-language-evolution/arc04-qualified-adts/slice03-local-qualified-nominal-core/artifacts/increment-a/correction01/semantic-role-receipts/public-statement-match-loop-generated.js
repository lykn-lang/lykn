const trace = [];
for (let i = 0; i < 4; ++i) {
  {
    const target__gensym6 = i;
    let matched__gensym7 = false;
    if (!matched__gensym7 && target__gensym6 === 1) {
      {
        matched__gensym7 = true;
        continue;
      }
    }
    if (!matched__gensym7 && target__gensym6 === 3) {
      {
        matched__gensym7 = true;
        break;
      }
    }
    if (!matched__gensym7) {
      {
        matched__gensym7 = true;
        trace.push(i);
      }
    }
  }
  trace.push(i + 10);
}
console.log(JSON.stringify(trace));
