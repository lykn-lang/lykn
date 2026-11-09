function normalized(Reflect) {
  Reflect.apply = 9;
  return Reflect.apply;
}
console.log(JSON.stringify(normalized({ apply: 0 })));
