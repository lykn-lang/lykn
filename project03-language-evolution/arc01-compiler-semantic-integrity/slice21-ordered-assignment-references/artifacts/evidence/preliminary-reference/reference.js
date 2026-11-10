const trace = [];
const target = { x: 10, y: 20 };
const count = { value: 0 };
const key = {};
Object.defineProperty(key, Symbol.toPrimitive, { value: hint => {
  count.value = (n => n + 1)(count.value);
  trace.push([hint, count.value]);
  return count.value === 1 ? "x" : "y";
} });
function rhs() {
  trace.push("rhs");
  return 5;
}
const updated = target[key] += rhs();
console.log(JSON.stringify([updated, target.x, target.y, count.value, trace]));
