globalThis._ = 99;
globalThis.defaultCalls = 0;
function provide() {
  globalThis.defaultCalls = globalThis.defaultCalls + 1;
  return 7;
}
function take(completionValue__gensym0 = provide()) {
  return _;
}
console.log(take());
console.log(take(8));
console.log(globalThis.defaultCalls);
