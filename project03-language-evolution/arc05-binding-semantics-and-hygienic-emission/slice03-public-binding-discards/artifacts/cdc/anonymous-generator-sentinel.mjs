globalThis["_"] = 99;
const f = function* (_) {
  yield _;
};
const iterator = f(7);
console.log(iterator.next()["value"]);
