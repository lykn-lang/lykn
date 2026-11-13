const factory = function*() {
  Array["isArray"] = 1;
  yield 41;
}
;
const stream = factory();
console.log(stream.next()["value"]);
