export {probe};
const providerKind = "local";
const trace = [];
function originalMethod(earlier, middle, later) {
  trace.push("call");
  return [this.label, middle];
}
function wrongMethod() {
  throw new Error("unexpected method");
}
Object.defineProperty(originalMethod, "call", { value: wrongMethod });
Object.defineProperty(originalMethod, "apply", { value: wrongMethod });
function useMemberCall(stop) {
  const Reflect = { label: "receiver" };
  const receiver = Reflect;
  const lyknHostReflectApply0 = "earlier";
  Object.defineProperty(receiver, "readEntry", { configurable: true, get: () => {
    trace.push("get");
    return originalMethod;
  } });
  const result = receiver.readEntry(trace.push(lyknHostReflectApply0), (() => {
    trace.push("middle");
    Object.defineProperty(receiver, "readEntry", { value: wrongMethod });
    if (stop) {
      return 92;
    }
    return 8;
  })(), trace.push("later"));
  trace.push("after");
  return result;
}
function probe() {
  return [providerKind, useMemberCall(true), useMemberCall(false), trace];
}
console.log("provider");
