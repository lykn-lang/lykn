function probe(receiver) {
  return receiver.readEntry(3);
}
const receiver = { readEntry: value => value + 1 };
console.log(probe(receiver));
