// <data:text/javascript,export%20function%20apply(fn%2Creceiver%2Ca...>
function apply(fn, receiver, argv) {
  return Reflect.apply(fn, receiver, argv);
}

// generated/public/fallback-retained/provider.js
console.log("provider");
var Reflect2 = "provider";
var marker = Reflect2;
function invoke(saved, receiver, argv, Reflect3, globalThis, lyknHostReflectApply0) {
  const result = apply(saved, receiver, argv);
  return [result, Reflect3.id, globalThis.id, lyknHostReflectApply0, typeof lyknHostReflectApply1, receiver.Reflect];
}
export {
  invoke,
  marker
};
