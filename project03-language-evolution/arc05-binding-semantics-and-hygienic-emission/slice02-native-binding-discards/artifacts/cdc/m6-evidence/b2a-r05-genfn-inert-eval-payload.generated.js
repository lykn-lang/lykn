const gen = function*() {
  yield 41;
}
;
console.log(Array.from(gen()));
