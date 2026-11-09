// provider.js
function lyknHostReflectApply2(fn, receiver, argv) {
  return Reflect.apply(fn, receiver, argv);
}
console.log("provider");
function invoke(saved, receiver, argv, Reflect2, globalThis, lyknHostReflectApply0) {
  const result = lyknHostReflectApply2(saved, receiver, argv);
  return [result, Reflect2.id, globalThis.id, lyknHostReflectApply0, typeof lyknHostReflectApply1, receiver.Reflect];
}

// entry.js
function run(mode) {
  const events = [];
  const original = function(a, b) {
    events.push("call");
    return [this.id, a, b];
  };
  const receiver = { id: "receiver", Reflect: "property" };
  Object.defineProperty(receiver, "method", { get: function() {
    events.push("get");
    if (mode === "getter") throw new Error("getter");
    return original;
  }, configurable: true });
  const replacement = function() {
    throw new Error("replacement");
  };
  original.call = function() {
    throw new Error("call touched");
  };
  original.apply = function() {
    throw new Error("apply touched");
  };
  const iter = function* () {
    events.push("spread");
    yield 7;
  };
  function update() {
    events.push("arg");
    if (mode === "arg") throw new Error("arg");
    Object.defineProperty(receiver, "method", { value: replacement });
    return 8;
  }
  try {
    const result = invoke(receiver["method"], receiver, [...iter(), update()], { id: "localReflect" }, { id: "localGlobal" }, 3);
    return [events, ...result];
  } catch (error) {
    return [events, error.message];
  }
}
console.log(JSON.stringify(run("live")));
console.log(JSON.stringify(run("getter")));
console.log(JSON.stringify(run("arg")));
