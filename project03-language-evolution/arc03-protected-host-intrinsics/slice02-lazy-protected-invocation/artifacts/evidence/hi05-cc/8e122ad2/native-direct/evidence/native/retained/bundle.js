// provider.js
function lyknHostReflectApply2(fn, receiver, argv) {
  return Reflect.apply(fn, receiver, argv);
}
console.log("provider");
var marker = "provider";
function invoke(saved, receiver, argv, Reflect2, globalThis, lyknHostReflectApply0) {
  const result = lyknHostReflectApply2(saved, receiver, argv);
  return [result, Reflect2.id, globalThis.id, lyknHostReflectApply0, typeof lyknHostReflectApply1, receiver.Reflect];
}
export {
  invoke,
  marker
};
