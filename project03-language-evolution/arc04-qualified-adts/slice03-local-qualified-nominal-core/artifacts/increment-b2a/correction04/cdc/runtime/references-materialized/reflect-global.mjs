function lyknHostReflectApply0(fn, receiver, argv) {
  return Reflect.apply(fn, receiver, argv);
}
function saved(value) {
  return this.base + value;
}
const receiver = {
  base: 40
};
const argv = [1];
console.log(lyknHostReflectApply0(saved, receiver, argv));
