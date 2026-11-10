const trace = [];
const count = {
  value: 0
};
while (count.value < 2) {
  if (true) {
    trace.push(count.value + 1);
  }
  const first = count.value + 10;
  const second = first + 1;
  if (true) {
    trace.push(second);
  }
  count.value = count.value + 1;
}
console.log(JSON.stringify(trace));
