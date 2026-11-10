function plainWrites(box, local) {
  const first = box["a"] = 2;
  const second = box["a"] += 3;
  const third = local = 6;
  return [first, second, third, box.a, local];
}
function localProtected(Reflect) {
  const result = Reflect["apply"] = 7;
  return [result, Reflect.apply];
}
console.log(JSON.stringify([plainWrites({
  a: 1
}, 0), localProtected({
  apply: 0
})]));
