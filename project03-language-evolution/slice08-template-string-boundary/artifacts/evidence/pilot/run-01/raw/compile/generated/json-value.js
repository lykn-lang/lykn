function parseValue(text) {
  if (typeof text !== "string") throw new TypeError("parseValue: arg 'text' expected string, got " + typeof text);

  const result__gensym0 = JSON.parse(text);
  if (typeof result__gensym0 !== "object" || result__gensym0 === null) throw new TypeError("parseValue: return value expected object, got " + typeof result__gensym0);

  return result__gensym0;
}
export {parseValue};
