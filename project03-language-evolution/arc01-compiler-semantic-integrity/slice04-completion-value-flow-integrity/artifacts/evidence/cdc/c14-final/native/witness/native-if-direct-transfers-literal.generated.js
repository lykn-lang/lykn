function select(flag) {
  if (flag) {
    return 7;
  }
  return 9;
}
const match = n => {
  if (typeof n !== "number" || Number.isNaN(n)) {
    throw new TypeError("anonymous: arg 'n' expected number, got " + typeof n);
  }
  return n;
};
const trace = [];
for (let i = 0; i < 4; ++i) {
  if (i === 1) {
    continue;
  }
  if (i === 3) {
    break;
  }
  trace.push(i);
}
if (true) {
  if (false) {
    trace.push(900);
  }
} else {
  trace.push(901);
}
console.log(JSON.stringify([select(true), select(false), trace, match(true ? 4 : 5)]));
