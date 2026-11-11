function Some(value) {
  return { tag: "Some", value: value };
}
const None = { tag: "None" };
function InnerNumber(value) {
  return { tag: "InnerNumber", value: value };
}
const InnerFlag = { tag: "InnerFlag" };
const ListZero = { tag: "ListZero" };
const BareZero = { tag: "BareZero" };
const nestedSuccess = (() => {
  const target__gensym0 = Some(InnerNumber(7));
  let pattern_field__gensym1;
  let pattern_field__gensym2;
  if (((((target__gensym0 != null && target__gensym0.tag === "Some") && (pattern_field__gensym1 = target__gensym0.value, true)) && pattern_field__gensym1 != null) && pattern_field__gensym1.tag === "InnerNumber") && (pattern_field__gensym2 = pattern_field__gensym1.value, true)) {
    const value = pattern_field__gensym2;
    return value;
  }
  {
    return -1;
  }
})();
const nestedLiteralMatch = (() => {
  const target__gensym3 = Some(InnerNumber(7));
  let pattern_field__gensym4;
  let pattern_field__gensym5;
  if ((((((target__gensym3 != null && target__gensym3.tag === "Some") && (pattern_field__gensym4 = target__gensym3.value, true)) && pattern_field__gensym4 != null) && pattern_field__gensym4.tag === "InnerNumber") && (pattern_field__gensym5 = pattern_field__gensym4.value, true)) && pattern_field__gensym5 === 7) {
    return "literal";
  }
  {
    return "wrong";
  }
})();
const nestedLiteralMismatch = (() => {
  const target__gensym6 = Some(InnerNumber(8));
  let pattern_field__gensym7;
  let pattern_field__gensym8;
  if ((((((target__gensym6 != null && target__gensym6.tag === "Some") && (pattern_field__gensym7 = target__gensym6.value, true)) && pattern_field__gensym7 != null) && pattern_field__gensym7.tag === "InnerNumber") && (pattern_field__gensym8 = pattern_field__gensym7.value, true)) && pattern_field__gensym8 === 7) {
    return "wrong";
  }
  {
    return "safe";
  }
})();
const wrongOuter = (() => {
  const target__gensym9 = None;
  let pattern_field__gensym10;
  if ((((target__gensym9 != null && target__gensym9.tag === "Some") && (pattern_field__gensym10 = target__gensym9.value, true)) && pattern_field__gensym10 != null) && pattern_field__gensym10.tag === "InnerNumber") {
    return "wrong";
  }
  {
    return "outer";
  }
})();
const wrongInner = (() => {
  const target__gensym11 = Some(InnerFlag);
  let pattern_field__gensym12;
  if ((((target__gensym11 != null && target__gensym11.tag === "Some") && (pattern_field__gensym12 = target__gensym11.value, true)) && pattern_field__gensym12 != null) && pattern_field__gensym12.tag === "InnerNumber") {
    return "wrong";
  }
  {
    return "inner";
  }
})();
const nullChild = (() => {
  const target__gensym13 = Some(null);
  let pattern_field__gensym14;
  if ((((target__gensym13 != null && target__gensym13.tag === "Some") && (pattern_field__gensym14 = target__gensym13.value, true)) && pattern_field__gensym14 != null) && pattern_field__gensym14.tag === "InnerNumber") {
    return "wrong";
  }
  {
    return "null";
  }
})();
const missingChild = (() => {
  const target__gensym15 = {};
  let pattern_field__gensym16;
  if (((((typeof target__gensym15 === "object" && target__gensym15 !== null) && "child" in target__gensym15) && (pattern_field__gensym16 = target__gensym15.child, true)) && pattern_field__gensym16 != null) && pattern_field__gensym16.tag === "Some") {
    return "wrong";
  }
  {
    return "missing";
  }
})();
const literalFalse = (() => {
  const target__gensym17 = { value: false };
  let pattern_field__gensym18;
  if ((((typeof target__gensym17 === "object" && target__gensym17 !== null) && "value" in target__gensym17) && (pattern_field__gensym18 = target__gensym17.value, true)) && pattern_field__gensym18 === false) {
    return "false";
  }
  {
    return "wrong";
  }
})();
const literalNull = (() => {
  const target__gensym19 = { value: null };
  let pattern_field__gensym20;
  if ((((typeof target__gensym19 === "object" && target__gensym19 !== null) && "value" in target__gensym19) && (pattern_field__gensym20 = target__gensym19.value, true)) && pattern_field__gensym20 === null) {
    return "null";
  }
  {
    return "wrong";
  }
})();
const literalUndefined = (() => {
  const target__gensym21 = { value: undefined };
  let pattern_field__gensym22;
  if ((((typeof target__gensym21 === "object" && target__gensym21 !== null) && "value" in target__gensym21) && (pattern_field__gensym22 = target__gensym21.value, true)) && pattern_field__gensym22 === undefined) {
    return "undefined";
  }
  {
    return "wrong";
  }
})();
const nestedObjectAdt = (() => {
  const target__gensym23 = { child: Some(InnerNumber(9)) };
  let pattern_field__gensym24;
  let pattern_field__gensym25;
  let pattern_field__gensym26;
  if (((((((((typeof target__gensym23 === "object" && target__gensym23 !== null) && "child" in target__gensym23) && (pattern_field__gensym24 = target__gensym23.child, true)) && pattern_field__gensym24 != null) && pattern_field__gensym24.tag === "Some") && (pattern_field__gensym25 = pattern_field__gensym24.value, true)) && pattern_field__gensym25 != null) && pattern_field__gensym25.tag === "InnerNumber") && (pattern_field__gensym26 = pattern_field__gensym25.value, true)) {
    const value = pattern_field__gensym26;
    return value;
  }
  {
    return -1;
  }
})();
const falsyPayload = (() => {
  const target__gensym27 = Some(false);
  let pattern_field__gensym28;
  if ((target__gensym27 != null && target__gensym27.tag === "Some") && (pattern_field__gensym28 = target__gensym27.value, true)) {
    const value = pattern_field__gensym28;
    return value;
  }
  {
    return true;
  }
})();
const zeroPayload = (() => {
  const target__gensym29 = Some(0);
  let pattern_field__gensym30;
  if ((target__gensym29 != null && target__gensym29.tag === "Some") && (pattern_field__gensym30 = target__gensym29.value, true)) {
    const value = pattern_field__gensym30;
    return value;
  }
  {
    return -1;
  }
})();
const emptyPayload = (() => {
  const target__gensym31 = Some("");
  let pattern_field__gensym32;
  if ((target__gensym31 != null && target__gensym31.tag === "Some") && (pattern_field__gensym32 = target__gensym31.value, true)) {
    const value = pattern_field__gensym32;
    return value;
  }
  {
    return "wrong";
  }
})();
const guardFallthrough = (() => {
  const target__gensym33 = Some(InnerNumber(4));
  let pattern_field__gensym34;
  let pattern_field__gensym35;
  if (((((target__gensym33 != null && target__gensym33.tag === "Some") && (pattern_field__gensym34 = target__gensym33.value, true)) && pattern_field__gensym34 != null) && pattern_field__gensym34.tag === "InnerNumber") && (pattern_field__gensym35 = pattern_field__gensym34.value, true)) {
    const value = pattern_field__gensym35;
    if (false) {
      return "wrong";
    }
  }
  let pattern_field__gensym36;
  let pattern_field__gensym37;
  if (((((target__gensym33 != null && target__gensym33.tag === "Some") && (pattern_field__gensym36 = target__gensym33.value, true)) && pattern_field__gensym36 != null) && pattern_field__gensym36.tag === "InnerNumber") && (pattern_field__gensym37 = pattern_field__gensym36.value, true)) {
    const value = pattern_field__gensym37;
    return value;
  }
  {
    return -1;
  }
})();
const boundValueGuard = (() => {
  const target__gensym38 = Some(InnerNumber(6));
  let pattern_field__gensym39;
  let pattern_field__gensym40;
  if (((((target__gensym38 != null && target__gensym38.tag === "Some") && (pattern_field__gensym39 = target__gensym38.value, true)) && pattern_field__gensym39 != null) && pattern_field__gensym39.tag === "InnerNumber") && (pattern_field__gensym40 = pattern_field__gensym39.value, true)) {
    const value = pattern_field__gensym40;
    if (value === 6) {
      return value;
    }
  }
  {
    return -1;
  }
})();
const guardedFinalTrue = (() => {
  const target__gensym41 = 1;
  {
    if (true) {
      return "selected";
    }
  }
  throw new Error("match: no matching pattern");
})();
const guardedFinalResults = [];
try {
  const guardedFinalResult = (() => {
    const target__gensym42 = 1;
    {
      if (false) {
        return "wrong";
      }
    }
    throw new Error("match: no matching pattern");
  })();
  guardedFinalResults.push(guardedFinalResult);
} catch (err) {
  guardedFinalResults.push(err.message);
}
const listZeroMatch = (() => {
  const target__gensym43 = ListZero;
  if (target__gensym43 != null && target__gensym43.tag === "ListZero") {
    return true;
  }
  {
    return false;
  }
})();
const bareZeroMatch = (() => {
  const target__gensym44 = BareZero;
  if (target__gensym44 != null && target__gensym44.tag === "BareZero") {
    return true;
  }
  {
    return false;
  }
})();
const ifLetZero = (() => {
  const t__gensym45 = ListZero;
  if (t__gensym45 != null && t__gensym45.tag === "ListZero") {
    return "list";
  } else {
    return "wrong";
  }
})();
const ifLetZeroMismatch = (() => {
  const t__gensym46 = ListZero;
  if (t__gensym46 != null && t__gensym46.tag === "BareZero") {
    return "wrong";
  } else {
    return "safe";
  }
})();
const whenLetZero = (() => {
  const t__gensym47 = BareZero;
  if (t__gensym47 != null && t__gensym47.tag === "BareZero") {
    return "bare";
  }
})();
const whenLetZeroMismatch = (() => {
  const t__gensym48 = ListZero;
  if (t__gensym48 != null && t__gensym48.tag === "BareZero") {
    return "wrong";
  }
})();
const ifLetRootFalse = (() => {
  const t__gensym49 = false;
  if (t__gensym49 != null) {
    const value = t__gensym49;
    return value;
  } else {
    return "wrong";
  }
})();
const ifLetNestedFalse = (() => {
  const t__gensym50 = Some(false);
  let pattern_field__gensym51;
  if ((t__gensym50 != null && t__gensym50.tag === "Some") && (pattern_field__gensym51 = t__gensym50.value, true)) {
    const value = pattern_field__gensym51;
    return value;
  } else {
    return "wrong";
  }
})();
const whenLetNestedNull = (() => {
  const t__gensym52 = Some(null);
  let pattern_field__gensym53;
  if ((t__gensym52 != null && t__gensym52.tag === "Some") && (pattern_field__gensym53 = t__gensym52.value, true)) {
    const value = pattern_field__gensym53;
    return value;
  }
})();
const ifLetNumberLiteral = (() => {
  const t__gensym54 = 7;
  if (t__gensym54 === 7) {
    return "number";
  } else {
    return "wrong";
  }
})();
const ifLetNumberLiteralMismatch = (() => {
  const t__gensym55 = 8;
  if (t__gensym55 === 7) {
    return "wrong";
  } else {
    return "safe";
  }
})();
const whenLetStringLiteral = (() => {
  const t__gensym56 = "ready";
  if (t__gensym56 === "ready") {
    return "string";
  }
})();
const reads = [];
const nestedGetter = { tag: "InnerNumber" };
Object.defineProperty(nestedGetter, "value", { get: () => {
  reads.push("inner.value");
  return 7;
} });
const outerGetter = { tag: "Some" };
Object.defineProperty(outerGetter, "value", { get: () => {
  reads.push("outer.value");
  return nestedGetter;
} });
const getterMatch = (() => {
  const target__gensym57 = outerGetter;
  let pattern_field__gensym58;
  let pattern_field__gensym59;
  if (((((target__gensym57 != null && target__gensym57.tag === "Some") && (pattern_field__gensym58 = target__gensym57.value, true)) && pattern_field__gensym58 != null) && pattern_field__gensym58.tag === "InnerNumber") && (pattern_field__gensym59 = pattern_field__gensym58.value, true)) {
    const value = pattern_field__gensym59;
    return value;
  }
  {
    return -1;
  }
})();
const wildcardMatch = (() => {
  const target__gensym60 = outerGetter;
  if (target__gensym60 != null && target__gensym60.tag === "Some") {
    return "wildcard";
  }
  {
    return "wrong";
  }
})();
const wrongTagGetter = { tag: "Other" };
Object.defineProperty(wrongTagGetter, "value", { get: () => {
  reads.push("wrong.outer.value");
  return nestedGetter;
} });
const wrongTagMatch = (() => {
  const target__gensym61 = wrongTagGetter;
  let pattern_field__gensym62;
  if ((((target__gensym61 != null && target__gensym61.tag === "Some") && (pattern_field__gensym62 = target__gensym61.value, true)) && pattern_field__gensym62 != null) && pattern_field__gensym62.tag === "InnerNumber") {
    return "wrong";
  }
  {
    return "safe";
  }
})();
const wrongInnerGetter = { tag: "Some" };
const invalidInner = { tag: "Other" };
Object.defineProperty(invalidInner, "value", { get: () => {
  reads.push("invalid.inner.value");
  return 7;
} });
Object.defineProperty(wrongInnerGetter, "value", { get: () => {
  reads.push("wrong.inner.value");
  return invalidInner;
} });
const wrongInnerGetterMatch = (() => {
  const target__gensym63 = wrongInnerGetter;
  let pattern_field__gensym64;
  let pattern_field__gensym65;
  if ((((((target__gensym63 != null && target__gensym63.tag === "Some") && (pattern_field__gensym64 = target__gensym63.value, true)) && pattern_field__gensym64 != null) && pattern_field__gensym64.tag === "InnerNumber") && (pattern_field__gensym65 = pattern_field__gensym64.value, true)) && pattern_field__gensym65 === 7) {
    return "wrong";
  }
  {
    return "safe";
  }
})();
const objectReads = [];
const objectGetter = {};
Object.defineProperty(objectGetter, "child", { get: () => {
  objectReads.push("object.child");
  return Some(InnerNumber(8));
} });
const objectGetterMatch = (() => {
  const target__gensym66 = objectGetter;
  let pattern_field__gensym67;
  let pattern_field__gensym68;
  let pattern_field__gensym69;
  if (((((((((typeof target__gensym66 === "object" && target__gensym66 !== null) && "child" in target__gensym66) && (pattern_field__gensym67 = target__gensym66.child, true)) && pattern_field__gensym67 != null) && pattern_field__gensym67.tag === "Some") && (pattern_field__gensym68 = pattern_field__gensym67.value, true)) && pattern_field__gensym68 != null) && pattern_field__gensym68.tag === "InnerNumber") && (pattern_field__gensym69 = pattern_field__gensym68.value, true)) {
    const value = pattern_field__gensym69;
    return value;
  }
  {
    return -1;
  }
})();
const objectWildcardMatch = (() => {
  const target__gensym70 = objectGetter;
  if ((typeof target__gensym70 === "object" && target__gensym70 !== null) && "child" in target__gensym70) {
    return "wildcard";
  }
  {
    return "wrong";
  }
})();
const statementTrace = [];
{
  const target__gensym71 = Some(InnerNumber(5));
  let matched__gensym72 = false;
  let pattern_field__gensym73;
  let pattern_field__gensym74;
  if (!matched__gensym72 && (((((target__gensym71 != null && target__gensym71.tag === "Some") && (pattern_field__gensym73 = target__gensym71.value, true)) && pattern_field__gensym73 != null) && pattern_field__gensym73.tag === "InnerNumber") && (pattern_field__gensym74 = pattern_field__gensym73.value, true))) {
    const value = pattern_field__gensym74;
    if (false) {
      matched__gensym72 = true;
      statementTrace.push("wrong");
    }
  }
  let pattern_field__gensym75;
  let pattern_field__gensym76;
  if (!matched__gensym72 && (((((target__gensym71 != null && target__gensym71.tag === "Some") && (pattern_field__gensym75 = target__gensym71.value, true)) && pattern_field__gensym75 != null) && pattern_field__gensym75.tag === "InnerNumber") && (pattern_field__gensym76 = pattern_field__gensym75.value, true))) {
    const value = pattern_field__gensym76;
    {
      matched__gensym72 = true;
      statementTrace.push(value);
    }
  }
  if (!matched__gensym72) {
    {
      matched__gensym72 = true;
      statementTrace.push("fallback");
    }
  }
}
console.log(JSON.stringify([nestedSuccess, wrongOuter, wrongInner, nullChild, missingChild, nestedLiteralMatch, nestedLiteralMismatch, literalFalse, literalNull, literalUndefined, nestedObjectAdt, falsyPayload, zeroPayload, emptyPayload, guardFallthrough, boundValueGuard, guardedFinalTrue, guardedFinalResults, listZeroMatch, bareZeroMatch, ifLetZero, ifLetZeroMismatch, whenLetZero, whenLetZeroMismatch, ifLetRootFalse, ifLetNestedFalse, whenLetNestedNull, ifLetNumberLiteral, ifLetNumberLiteralMismatch, whenLetStringLiteral, getterMatch, wildcardMatch, wrongTagMatch, wrongInnerGetterMatch, reads, objectGetterMatch, objectWildcardMatch, objectReads, statementTrace]));
