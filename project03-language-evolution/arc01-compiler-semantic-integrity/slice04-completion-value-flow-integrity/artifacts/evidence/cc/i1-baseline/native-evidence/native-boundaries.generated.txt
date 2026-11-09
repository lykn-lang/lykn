const match = n => {
  if (typeof n !== "number" || Number.isNaN(n)) throw new TypeError("anonymous: arg 'n' expected number, got " + typeof n);

  return n;
};
const picked = match(true ? 4 : 5);
const target = n => {
  if (typeof n !== "number" || Number.isNaN(n)) throw new TypeError("anonymous: arg 'n' expected number, got " + typeof n);

  return n;
};
const computed = ([target][0])(true ? 6 : 7);
const trace = [];
switch (1) {
  case 1:
    const first = 1;
    const second = first + 1;
    if (true) trace.push(second);

    break;
  default:
    trace.push("bad");
}
console.log(JSON.stringify([picked, computed, trace]));
