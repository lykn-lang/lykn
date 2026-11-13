class Box {
  call(bind) {
    return bind(7);
  }
  sum(left, right) {
    const total = left + right;
    return total;
  }
}
const box = new Box();
console.log(box.call(value => value));
console.log(box.sum(20, 22));
