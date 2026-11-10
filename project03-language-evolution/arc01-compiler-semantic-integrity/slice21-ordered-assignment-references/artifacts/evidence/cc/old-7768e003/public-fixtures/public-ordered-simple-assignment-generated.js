const trace = [];
const original = {
  a: 10
};
const replacement = {
  a: 40,
  c: 50
};
const key = {};
Object.defineProperty(key, Symbol.toPrimitive, {
  value: hint => {
    trace.push(hint);
    return "a";
  }
});
function assignTarget(target, stop) {
  const result = target[(() => {
    trace.push("key");
    return key;
  })()] = (() => {
    trace.push("rhs");
    target = replacement;
    if (stop) {
      return 95;
    }
    return 5;
  })();
  trace.push("after");
  return result;
}
function writeStatement(target, stop) {
  target["c"] = (() => {
    trace.push("statement-rhs");
    if (stop) {
      return 96;
    }
    return 8;
  })();
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
