function local(Reflect, globalThis) {
  Reflect.apply = 7;
  globalThis.Reflect.apply = 8;
  const result__gensym0 = [Reflect.apply, globalThis.Reflect.apply];
  if (!Array.isArray(result__gensym0)) throw new TypeError("local: return value expected array, got " + typeof result__gensym0);

  return result__gensym0;
}
console.log(JSON.stringify(local({ apply: 0 }, { Reflect: { apply: 0 } })));
