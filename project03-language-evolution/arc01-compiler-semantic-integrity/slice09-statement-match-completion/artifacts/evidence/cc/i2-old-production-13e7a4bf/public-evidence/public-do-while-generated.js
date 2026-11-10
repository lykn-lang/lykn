const trace = [];
const count = {
  value: 0
};
do {
  if (true) {
    trace.push(count.value + 100);
  }
  const first = count.value + 20;
  const second = first + 1;
  if (true) {
    trace.push(second);
  }
  count.value = count.value + 1;
} while (count.value < 2);
console.log(JSON.stringify(trace));
