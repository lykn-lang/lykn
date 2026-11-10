function mixedComputedSpread(receiver, items) {
  return (receiver[(() => {
    return 7;
    return "method";
  })()])(...items);
}
