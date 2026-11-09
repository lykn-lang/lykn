// <data:text/javascript,export%20function%20apply(fn%2Creceiver%2Ca...>
function apply(fn, receiver, argv) {
  return Reflect.apply(fn, receiver, argv);
}

// provider.js
var Reflect2 = "local";
console.log("provider");
var marker = "provider";
function invoke(saved, receiver, argv) {
  return [Reflect2, apply(saved, receiver, argv)];
}
export {
  invoke,
  marker
};
