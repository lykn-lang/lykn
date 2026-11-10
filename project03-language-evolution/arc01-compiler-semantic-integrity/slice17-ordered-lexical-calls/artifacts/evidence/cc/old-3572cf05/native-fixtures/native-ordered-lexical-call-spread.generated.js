function mixedSpread(callable, items) {
  return callable(...items, (() => {
    return 7;
    return 8;
  })());
}
