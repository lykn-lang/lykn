try {
  throw [[]];
} catch ([[value = eval => 1] = []]) {
  console.log(value(7));
}
