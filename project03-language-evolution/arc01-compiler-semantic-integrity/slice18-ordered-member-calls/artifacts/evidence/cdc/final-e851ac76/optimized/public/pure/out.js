// pure.js
function probe(receiver2) {
  return receiver2.readEntry(3);
}
var receiver = {
  readEntry: (value) => value + 1
};
console.log(probe(receiver));
