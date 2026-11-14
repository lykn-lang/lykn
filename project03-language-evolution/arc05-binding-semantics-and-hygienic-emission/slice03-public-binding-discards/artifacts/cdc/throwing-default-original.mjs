function throwDefault(x = throw new Error("default boom");) {
  return x;
}
throwDefault();
