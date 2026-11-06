function readText(path) {
  if (typeof path !== "string") throw new TypeError("readText: arg 'path' expected string, got " + typeof path);

  const result__gensym0 = Deno.readTextFileSync(path);
  if (typeof result__gensym0 !== "string") throw new TypeError("readText: return value expected string, got " + typeof result__gensym0);

  return result__gensym0;
}
export {readText};
