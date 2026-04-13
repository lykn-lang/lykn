{
  function Circle(radius) {
    if (typeof radius !== "number" || Number.isNaN(radius)) throw new TypeError("Circle: field 'radius' expected number, got " + typeof radius);

    return {tag: "Circle", radius: radius};
  }
  function Rect(width, height) {
    if (typeof width !== "number" || Number.isNaN(width)) throw new TypeError("Rect: field 'width' expected number, got " + typeof width);

    if (typeof height !== "number" || Number.isNaN(height)) throw new TypeError("Rect: field 'height' expected number, got " + typeof height);

    return {tag: "Rect", width: width, height: height};
  }
  const Point = {tag: "Point"};
}
function describe(shape) {
  const result__gensym1 = (() => {
    const target__gensym0 = shape;
    if (target__gensym0.tag === "Circle") {
      const r = target__gensym0.radius;
      return "circle with radius " + r;
    }
    if (target__gensym0.tag === "Rect") {
      const w = target__gensym0.width;
      const h = target__gensym0.height;
      return w + "×" + h + " rectangle";
    }
    if (target__gensym0.tag === "Point") {
      return "a point";
    }
    throw new Error("match: no matching pattern");
  })();
  if (typeof result__gensym1 !== "string") throw new TypeError("describe: return value expected string, got " + typeof result__gensym1);

  return result__gensym1;
}
console.log(describe(Circle(5)));
console.log(describe(Rect(3, 4)));
console.log(describe(Point()));
const counter = {value: 0};
counter.value = ((n) => n + 1)(counter.value);
counter.value = ((n) => n + 1)(counter.value);
console.log("counter:", counter.value);
const result = (5 + 3) * 2;
console.log("threaded:", result);
const user = {name: "lykn", version: "0.4.0", compiled: true};
console.log("user:", user);
