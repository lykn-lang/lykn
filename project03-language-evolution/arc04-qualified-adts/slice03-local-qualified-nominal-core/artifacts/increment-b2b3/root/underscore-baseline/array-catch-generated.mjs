const _ = 99;
try {
  throw [7];
} catch ([_]) {
  console.log(_);
}
