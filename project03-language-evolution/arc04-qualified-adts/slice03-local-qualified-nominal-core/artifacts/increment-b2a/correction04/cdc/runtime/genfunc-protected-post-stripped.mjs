function* factory() {
  yield 41;
}
console.log(Array.from(factory()));
