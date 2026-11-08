const trace = [];
function choose(n) {
  if (typeof n !== "number" || Number.isNaN(n)) throw new TypeError("choose: arg 'n' expected number, got " + typeof n);

  return (() => {
    const target__gensym0 = n;
    {
      const captured = target__gensym0;
      if (captured = 1) {
        if (true) trace.push("guard");

        return if (true) 7;
         else 8;

        ;
      }
    }
  })();
}
console.log(JSON.stringify([[choose(1), choose(2)], trace]));
