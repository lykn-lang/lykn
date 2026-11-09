let reads = 0;
const original = Reflect.apply;
Object.defineProperty(Reflect, "apply", { get: function() {
  reads += 1;
  return original;
}, configurable: true });
await import("./retained.js");
console.log(reads);
const deliberate = Reflect.apply;
console.log(reads);
