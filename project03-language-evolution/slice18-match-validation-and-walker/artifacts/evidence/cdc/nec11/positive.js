function Box(ready) {
  if (typeof ready !== "boolean") throw new TypeError("Box: field 'ready' expected boolean, got " + typeof ready);

  return { tag: "Box", ready: ready };
}
const Other = { tag: "Other" };
function collect(isBox, ready) {
  if (typeof isBox !== "boolean") throw new TypeError("collect: arg 'isBox' expected boolean, got " + typeof isBox);

  if (typeof ready !== "boolean") throw new TypeError("collect: arg 'ready' expected boolean, got " + typeof ready);

  const events = { value: [] };
  const answer = (() => {
    const target__gensym0 = isBox ? Box(ready) : Other;
    if (target__gensym0.tag === "Box") {
      const shouldRun = target__gensym0.ready;
      if (true) {
        if (shouldRun) events.value = (xs => {
          if (!Array.isArray(xs)) throw new TypeError("anonymous: arg 'xs' expected array, got " + typeof xs);

          return [...xs, "prefix"];
        })(events.value);

        events.value = (xs => {
          if (!Array.isArray(xs)) throw new TypeError("anonymous: arg 'xs' expected array, got " + typeof xs);

          return [...xs, "tail"];
        })(events.value);
        return 42;
      }
    }
    {
      events.value = (xs => {
        if (!Array.isArray(xs)) throw new TypeError("anonymous: arg 'xs' expected array, got " + typeof xs);

        return [...xs, "fallback"];
      })(events.value);
      return 0;
    }
  })();
  {
    const target__gensym1 = if (isBox) Box(ready);
     else Other;

    ;
    if (target__gensym1.tag === "Box") {
      const shouldRun = target__gensym1.ready;
      if (shouldRun) events.value = (xs => {
        if (!Array.isArray(xs)) throw new TypeError("anonymous: arg 'xs' expected array, got " + typeof xs);

        return [...xs, "statement"];
      })(events.value);

    } else {
      ;
    }
  }
  const result__gensym2 = [answer, events.value];
  if (!Array.isArray(result__gensym2)) throw new TypeError("collect: return value expected array, got " + typeof result__gensym2);

  return result__gensym2;
}
console.log(JSON.stringify([collect(true, true), collect(true, false), collect(false, true)]));
