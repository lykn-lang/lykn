function parseYamlFixture(text) {
  if (typeof text !== "string") throw new TypeError("parseYamlFixture: arg 'text' expected string, got " + typeof text);

  if (!text = "answer: 42") throw new Error("parse-yaml-fixture: pre-condition failed: (= text \"answer: 42\") — caller blame");

  const result__gensym0 = { answer: 42 };
  if (typeof result__gensym0 !== "object" || result__gensym0 === null) throw new TypeError("parseYamlFixture: return value expected object, got " + typeof result__gensym0);

  return result__gensym0;
}
export {parseYamlFixture};
