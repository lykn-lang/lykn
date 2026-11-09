const trace = [];
if (true) const pick = n => {
  if (typeof n !== "number" || Number.isNaN(n)) throw new TypeError("anonymous: arg 'n' expected number, got " + typeof n);
  return n + 100;
}; else const saved = trace.push(pick(1));
if (false) const pick = n => {
  if (typeof n !== "number" || Number.isNaN(n)) throw new TypeError("anonymous: arg 'n' expected number, got " + typeof n);
  return n + 200;
}; else const saved = trace.push(pick(3));
trace.push(5 + 10);
console.log(JSON.stringify(trace));
