try {
  throw [[]];
} catch ([[value = input => 1] = []]) {
  console.log(value(7));
}
