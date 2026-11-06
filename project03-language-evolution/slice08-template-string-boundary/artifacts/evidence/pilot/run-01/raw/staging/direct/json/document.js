function documentLabel(text) {
  if (typeof text !== "string") throw new TypeError("documentLabel: arg 'text' expected string, got " + typeof text);

  const result__gensym0 = `document:${text}`;
  if (typeof result__gensym0 !== "string") throw new TypeError("documentLabel: return value expected string, got " + typeof result__gensym0);

  return result__gensym0;
}
export {documentLabel};
