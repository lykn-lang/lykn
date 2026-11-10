function sourceFrom(id) {
  if (typeof id !== "string") {
    throw new TypeError("sourceFrom: arg 'id' expected string, got " + typeof id);
  }
  const result__gensym0 = document.getElementById(id)["textContent"];
  if (typeof result__gensym0 !== "string") {
    throw new TypeError("sourceFrom: return value expected string, got " + typeof result__gensym0);
  }
  return result__gensym0;
}
function captureError(action) {
  try {
    return ["ok", action()];
  } catch (caught) {
    return [caught.name, caught.message];
  }
}
function captureOutput(source) {
  if (typeof source !== "string") {
    throw new TypeError("captureOutput: arg 'source' expected string, got " + typeof source);
  }
  const savedLog = console.log;
  const trace = [];
  try {
    console["log"] = value => trace.push(value);
    lykn.run(source);
    return trace;
  } finally {
    console["log"] = savedLog;
  }
}
const ordinary = lykn.compile("(+ 1 2)");
const liveSource = sourceFrom("live");
const liveJs = lykn.compile(liveSource);
const fallbackSource = sourceFrom("fallback");
const fallbackJs = lykn.compile(fallbackSource);
const protectedError = captureError(() => lykn.compile("(kernel:= (get (get globalThis \"Reflect\") \"apply\") 0)"));
document.getElementById("result")["textContent"] = JSON.stringify([ordinary, liveJs.includes("Reflect.apply"), captureOutput(liveSource), fallbackJs.includes("data:text/javascript,"), captureError(() => lykn.run(fallbackSource)), protectedError]);
document.getElementById("live-js")["textContent"] = liveJs;
document.getElementById("fallback-js")["textContent"] = fallbackJs;
