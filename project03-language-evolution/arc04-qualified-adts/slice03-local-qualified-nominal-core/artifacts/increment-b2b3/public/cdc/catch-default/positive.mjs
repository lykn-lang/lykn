try {
  throw [[]];
} catch ([[value = fn(("number")(input), 1)] = []]) {
  console.log(value(7));
}
