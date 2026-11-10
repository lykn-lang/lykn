const trace = [];
function chooseMatchHeader(mode) {
  {
    const target__gensym29 = (() => {
      trace.push("discarded");
      if (mode === 0) {
        return 80;
      }
      return 3;
    })();
    let matched__gensym30 = false;
    if (!matched__gensym30) {
      const seen = target__gensym29;
      if ((() => {
        trace.push(seen);
        if (mode === 1) {
          return 81;
        }
        return false;
      })()) {
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
    const target__gensym31 = (() => {
      trace.push("consumed");
      if (mode === 2) {
        return 82;
      }
      return 4;
    })();
    let matched__gensym32 = false;
    if (!matched__gensym32) {
      const seen = target__gensym31;
      if ((() => {
        trace.push(seen);
        if (mode === 3) {
          return 83;
        }
        return false;
      })()) {
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
