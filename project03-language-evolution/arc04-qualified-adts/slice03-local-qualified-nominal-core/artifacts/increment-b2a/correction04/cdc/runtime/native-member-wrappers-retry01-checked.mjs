const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
class Base {}
class Members extends Base {
  constructor(initial = 40) {
    super();
    this.initial = initial;
  }
  shadow(bind) {
    return bind(7);
  }
  get answer() {
    const total = 20 + 22;
    return total;
  }
  set supplied(value) {
    this.initial = value;
  }
  async later(amount = 41) {
    return amount;
  }
  static staticValue(amount = 43) {
    return amount;
  }
  values = [1, 2];
}
const item = new Members();
console.log(item.initial);
console.log(item.shadow(value => {
  if (typeof value !== "number" || lyknIntrinsicNumberIsNaN0(value)) {
    throw new lyknIntrinsicTypeError0("anonymous: arg 'value' expected number, got " + typeof value);
  }
  return value;
}));
console.log(item.answer);
item.supplied = 42;
console.log(item.initial);
console.log(await item.later());
console.log(Members.staticValue());
console.log(JSON.stringify(item.values));
