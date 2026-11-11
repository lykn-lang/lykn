const lyknIntrinsicTypeError0 = TypeError;
const lyknIntrinsicError0 = Error;
const trace = [];
const patternField__gensym0 = 90;
const patternField__gensym1 = 91;
function Some(value) {
  return { tag: "Some", value: value };
}
const None = { tag: "None" };
{
  const target__gensym0 = Some(5);
  let matched__gensym1 = false;
  let pattern_field__gensym2;
  if (!matched__gensym1 && ((target__gensym0 != null && target__gensym0.tag === "Some") && (pattern_field__gensym2 = target__gensym0.value, true))) {
    const payload = pattern_field__gensym2;
    {
      matched__gensym1 = true;
      trace.push([[patternField__gensym0, patternField__gensym1], payload, 42]);
    }
  }
  if (!matched__gensym1) {
    {
      matched__gensym1 = true;
      trace.push("statement-fallback");
    }
  }
}
const valueResult = (() => {
  const target__gensym3 = Some(6);
  let pattern_field__gensym4;
  if ((target__gensym3 != null && target__gensym3.tag === "Some") && (pattern_field__gensym4 = target__gensym3.value, true)) {
    const payload = pattern_field__gensym4;
    return [[patternField__gensym0, patternField__gensym1], payload, 42];
  }
  {
    return ["value-fallback"];
  }
})();
function validResult(result) {
  const result__gensym5 = true;
  if (typeof result__gensym5 !== "boolean") {
    throw new lyknIntrinsicTypeError0("validResult: return value expected boolean, got " + typeof result__gensym5);
  }
  return result__gensym5;
}
function protectedResult() {
  const result__gensym8 = (() => {
    const target__gensym6 = Some(7);
    let pattern_field__gensym7;
    if ((target__gensym6 != null && target__gensym6.tag === "Some") && (pattern_field__gensym7 = target__gensym6.value, true)) {
      const payload = pattern_field__gensym7;
      return [[patternField__gensym0, patternField__gensym1], payload, 42];
    }
    {
      return ["protected-fallback"];
    }
  })();
  if (!validResult(result__gensym8)) {
    throw new lyknIntrinsicError0("protected-result: post-condition failed: (valid-result ~) — callee blame");
  }
  return result__gensym8;
}
const ifLetResult = (() => {
  const t__gensym9 = Some(8);
  let pattern_field__gensym10;
  if ((t__gensym9 != null && t__gensym9.tag === "Some") && (pattern_field__gensym10 = t__gensym9.value, true)) {
    const payload = pattern_field__gensym10;
    return [[patternField__gensym0, patternField__gensym1], payload, 42];
  } else {
    return ["if-fallback"];
  }
})();
const whenLetResult = (() => {
  const t__gensym11 = Some(9);
  let pattern_field__gensym12;
  if ((t__gensym11 != null && t__gensym11.tag === "Some") && (pattern_field__gensym12 = t__gensym11.value, true)) {
    const payload = pattern_field__gensym12;
    return [[patternField__gensym0, patternField__gensym1], payload, 42];
  }
})();
console.log(JSON.stringify([trace, valueResult, protectedResult(), ifLetResult, whenLetResult]));
