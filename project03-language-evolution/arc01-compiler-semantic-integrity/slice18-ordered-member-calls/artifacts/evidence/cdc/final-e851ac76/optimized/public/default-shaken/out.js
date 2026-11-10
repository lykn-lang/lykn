// provider.js
var trace = [];
function originalMethod(earlier, middle, later) {
  trace.push("call");
  return [this.label, middle];
}
function wrongMethod() {
  throw new Error("unexpected method");
}
Object.defineProperty(originalMethod, "call", {
  value: wrongMethod
});
Object.defineProperty(originalMethod, "apply", {
  value: wrongMethod
});
console.log("provider");

// entry.js
console.log("entry");
