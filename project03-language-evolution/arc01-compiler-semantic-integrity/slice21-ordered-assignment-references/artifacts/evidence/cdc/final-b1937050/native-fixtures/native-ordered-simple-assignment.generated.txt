const trace = [];
const original = { a: 10 };
const replacement = { a: 40, c: 50 };
const key = {};
Object.defineProperty(key, Symbol.toPrimitive, { value: hint => {
  trace.push(hint);
  return "a";
} });
function assignTarget(target, stop) {
  let completionValue__gensym0;
  {
    {
      const completionValue__gensym1 = target;
      let completionValue__gensym2;
      {
        trace.push("key");
        completionValue__gensym2 = key;
      }
      const completionValue__gensym3 = completionValue__gensym2;
      let completionValue__gensym4;
      {
        trace.push("rhs");
        target = replacement;
        if (stop) {
          return 95;
        }
        completionValue__gensym4 = 5;
      }
      completionValue__gensym0 = completionValue__gensym1[completionValue__gensym3] = completionValue__gensym4;
    }
  }
  const result = completionValue__gensym0;
  trace.push("after");
  return result;
}
function writeStatement(target, stop) {
  {
    const completionValue__gensym5 = target;
    const completionValue__gensym6 = "c";
    let completionValue__gensym7;
    {
      trace.push("statement-rhs");
      if (stop) {
        return 96;
      }
      completionValue__gensym7 = 8;
    }
    completionValue__gensym5[completionValue__gensym6] = completionValue__gensym7;
  }
  trace.push("statement-after");
  return target.c;
}
const early = assignTarget(original, true);
const before = [original.a, replacement.a];
const normal = assignTarget(original, false);
const earlyStatement = writeStatement(replacement, true);
const statementBefore = replacement.c;
const normalStatement = writeStatement(replacement, false);
console.log(JSON.stringify([early, before, normal, original.a, replacement.a, earlyStatement, statementBefore, normalStatement, replacement.c, trace]));
