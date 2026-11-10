const trace = [];
function chooseMatchHeader(mode) {
  {
    let completionValue__gensym0;
    {
      trace.push("discarded");
      if (mode === 0) {
        return 80;
      }
      completionValue__gensym0 = 3;
    }
    const target__gensym29 = completionValue__gensym0;
    let matched__gensym30 = false;
    if (!matched__gensym30) {
      const seen = target__gensym29;
      let completionValue__gensym1;
      {
        trace.push(seen);
        if (mode === 1) {
          return 81;
        }
        completionValue__gensym1 = false;
      }
      if (completionValue__gensym1) {
        matched__gensym30 = true;
        trace.push("wrong");
      }
    }
    if (!matched__gensym30) {
      {
        matched__gensym30 = true;
        trace.push("discarded-fallback");
      }
    }
  }
  {
    let completionValue__gensym2;
    {
      trace.push("consumed");
      if (mode === 2) {
        return 82;
      }
      completionValue__gensym2 = 4;
    }
    const target__gensym31 = completionValue__gensym2;
    let matched__gensym32 = false;
    if (!matched__gensym32) {
      const seen = target__gensym31;
      let completionValue__gensym3;
      {
        trace.push(seen);
        if (mode === 3) {
          return 83;
        }
        completionValue__gensym3 = false;
      }
      if (completionValue__gensym3) {
        matched__gensym32 = true;
        {
          trace.push("wrong");
          return 90;
        }
      }
    }
    if (!matched__gensym32) {
      {
        matched__gensym32 = true;
        {
          trace.push("consumed-fallback");
          return 84;
        }
      }
    }
  }
}
console.log(JSON.stringify([chooseMatchHeader(0), chooseMatchHeader(1), chooseMatchHeader(2), chooseMatchHeader(3), chooseMatchHeader(4), trace]));
