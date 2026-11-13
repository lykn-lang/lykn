class Sample {
  value(amount = 41) {
    return amount + 1;
  }
}
const sample = new Sample();
console.log(sample.value());

