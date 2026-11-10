function callBound(get) {
  return get(1, 2)(3);
}
const bound = (first, second) => third => [first, second, third];
const receiver = {
  readEntry: n => n + 1
};
function callPure(receiver) {
  return receiver["readEntry"](3);
}
console.log(JSON.stringify([callBound(bound), callPure(receiver)]));
