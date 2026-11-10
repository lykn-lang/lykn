function captureStrict() {
  try {
    return ["ok", lykn.compile("(const native 19)")];
  } catch (caught) {
    return [caught.name, caught.message];
  }
}
document.getElementById("api")["textContent"] = JSON.stringify([lykn.compile("(+ 1 2)"), lykn.run("(+ 1 2)"), lykn.compile("(macro double (x) `(+ ,x ,x)) (double 2)"), lykn.run("(const native 19) native", { strict: false }), captureStrict()]);
