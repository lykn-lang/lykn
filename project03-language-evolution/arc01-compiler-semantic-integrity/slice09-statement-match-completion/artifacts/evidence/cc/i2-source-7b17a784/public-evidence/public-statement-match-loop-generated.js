const trace = [];
for (let i = 0; i < 4; ++i) {
  {
    const target__gensym5 = i;
    let matched__gensym6 = false;
    if (!matched__gensym6 && target__gensym5 === 1) {
      {
        matched__gensym6 = true;
        continue;
      }
    }
    if (!matched__gensym6 && target__gensym5 === 3) {
      {
        matched__gensym6 = true;
        break;
      }
    }
    if (!matched__gensym6) {
      {
        matched__gensym6 = true;
        trace.push(i);
      }
    }
  }
  trace.push(i + 10);
}
console.log(JSON.stringify(trace));
