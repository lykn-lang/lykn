const trace = [];
if (true) {
  const pick = n => {
    if (typeof n !== "number" || Number.isNaN(n)) throw new TypeError("anonymous: arg 'n' expected number, got " + typeof n);

    return n + 100;
  };
  const saved = trace.push(pick(1));
} else trace.push(pick(2));

if (false) {
  const pick = n => {
    if (typeof n !== "number" || Number.isNaN(n)) throw new TypeError("anonymous: arg 'n' expected number, got " + typeof n);

    return n + 200;
  };
  const saved = trace.push(pick(3));
} else trace.push(pick(4));

trace.push(5 + 10);
console.log(JSON.stringify(trace));
