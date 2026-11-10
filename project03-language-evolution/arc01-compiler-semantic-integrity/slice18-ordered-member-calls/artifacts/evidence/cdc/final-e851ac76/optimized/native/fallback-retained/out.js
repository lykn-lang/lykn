// <data:text/javascript,export%20function%20apply(fn%2Creceiver%2Ca...>
function apply(fn, receiver, argv) {
  return Reflect.apply(fn, receiver, argv);
}

// provider.js
var Reflect2 = "inline";
var trace = [];
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
  const Reflect3 = { label: "receiver" };
  const receiver = Reflect3;
  const lyknHostReflectApply0 = "earlier";
  Object.defineProperty(receiver, "readEntry", { configurable: true, get: () => {
    trace.push("get");
    return originalMethod;
  } });
  let completionValue__gensym0;
  {
    const completionValue__gensym1 = receiver;
    const completionValue__gensym2 = completionValue__gensym1["readEntry"];
    const completionValue__gensym3 = trace.push(lyknHostReflectApply0);
    let completionValue__gensym4;
    {
      trace.push("middle");
      Object.defineProperty(receiver, "readEntry", { value: wrongMethod });
      if (stop) {
        return 92;
      }
      completionValue__gensym4 = 8;
    }
    const completionValue__gensym5 = [completionValue__gensym3, completionValue__gensym4, trace.push("later")];
    completionValue__gensym0 = apply(completionValue__gensym2, completionValue__gensym1, completionValue__gensym5);
  }
  const result = completionValue__gensym0;
  trace.push("after");
  return result;
}
function probe() {
  return [Reflect2, useMemberCall(true), useMemberCall(false), trace];
}
console.log("provider");
export {
  probe
};
