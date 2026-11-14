try {
  throw [[]];
} catch ([[value = fn(("number")(eval), 1)] = []]) {
  console.log(value(7));
}
