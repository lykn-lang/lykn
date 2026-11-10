const trace = [];
const getterError = new Error("getter");
const argumentError = new Error("argument");
function actualMethod(earlier, middle, later) {
  trace.push("call");
  return [this.label, middle];
}
function makeTarget(mode) {
  const target = { label: "receiver" };
  Object.defineProperty(target, "method", { get: () => {
    trace.push("getter");
    if (mode === 1) {
      throw getterError;
    }
    return actualMethod;
  } });
  return target;
}
function invokeComputed(mode) {
  const key = {};
  Object.defineProperty(key, Symbol.toPrimitive, { value: hint => {
    trace.push(hint);
    return "method";
  } });
  const answer = ((() => {
    trace.push("base");
    return makeTarget(mode);
  })()[(() => {
    trace.push("key");
    if (mode === 3) {
      return 93;
    }
    return key;
  })()])(trace.push("first"), (() => {
    trace.push("arg");
    if (mode === 2) {
      throw argumentError;
    }
    return 8;
  })(), trace.push("last"));
  trace.push("after");
  return answer;
}
function observe(mode) {
  try {
    return invokeComputed(mode);
  } catch (problem) {
    return [problem === getterError, problem === argumentError, problem instanceof TypeError];
  }
}
console.log(JSON.stringify([observe(0), observe(1), observe(2), observe(3), trace]));
