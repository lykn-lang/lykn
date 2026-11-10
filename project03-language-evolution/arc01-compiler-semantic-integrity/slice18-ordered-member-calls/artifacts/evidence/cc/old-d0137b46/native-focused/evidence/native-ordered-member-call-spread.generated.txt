function mixedSpread(receiver, items) {
  return receiver.readEntry(...items, (() => {
    return 7;
    return 8;
  })());
}
