function collectThree(a, b, c) {
  return [a, b, c];
}
function invokePlain(callee, items) {
  return callee(...items, 3);
}
console.log(JSON.stringify(invokePlain(collectThree, [1, 2])));
