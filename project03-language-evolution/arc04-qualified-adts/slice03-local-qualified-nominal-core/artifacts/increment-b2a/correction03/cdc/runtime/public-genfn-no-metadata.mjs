const factory = function* () {
  yield 41;
};
const stream = factory();
console.log(stream.next()["value"]);
