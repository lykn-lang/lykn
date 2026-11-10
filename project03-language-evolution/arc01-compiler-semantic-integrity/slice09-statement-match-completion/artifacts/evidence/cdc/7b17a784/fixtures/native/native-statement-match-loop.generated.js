const trace = [];
for (let i = 0; i < 4; ++i) {
  {
    const target__gensym0 = i;
    let matched__gensym1 = false;
    if (!matched__gensym1 && target__gensym0 === 1) {
      {
        matched__gensym1 = true;
        continue;
      }
    }
    if (!matched__gensym1 && target__gensym0 === 3) {
      {
        matched__gensym1 = true;
        break;
      }
    }
    if (!matched__gensym1) {
      {
        matched__gensym1 = true;
        trace.push(i);
      }
    }
  }
  trace.push(i + 10);
}
console.log(JSON.stringify(trace));
