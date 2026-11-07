const trace = [];
for (let i = 0; i < 2; ++i) {
  if (true) trace.push(i);

  const value = i + 10;
  if (true) trace.push(value);

  const nextValue = value + 1;
  if (true) trace.push(nextValue);

  if (false) trace.push(999);

}
console.log(JSON.stringify({ trace: trace }));
