function explode() {
  throw new Error("expected ICU boom");
}
console.log((() => { const _x = explode(); return `${_x}-${_x}`; })());
