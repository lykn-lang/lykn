const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicArrayIsArray0 = Array.isArray;
const lyknIntrinsicTypeError0 = TypeError;
globalThis["_"] = 99;
const defaults = {
  value: 0
};
function nextDefault() {
  defaults.value = defaults.value + 1;
  return 7;
}
function scalarDefault(discardValue__gensym0 = nextDefault()) {
  if (typeof discardValue__gensym0 !== "number" || lyknIntrinsicNumberIsNaN0(discardValue__gensym0)) {
    throw new lyknIntrinsicTypeError0("scalarDefault: arg '_' expected number, got " + typeof discardValue__gensym0);
  }
  return _;
}
function objectDefault({_: discardValue__gensym1 = nextDefault()}) {
  if (typeof discardValue__gensym1 !== "number" || lyknIntrinsicNumberIsNaN0(discardValue__gensym1)) {
    throw new lyknIntrinsicTypeError0("objectDefault: arg '_' expected number, got " + typeof discardValue__gensym1);
  }
  return _;
}
function multiNested(...args__gensym0) {
  if (args__gensym0.length === 1 && lyknIntrinsicArrayIsArray0(args__gensym0[0])) {
    const [discardValue__gensym2 = nextDefault(), ...tail] = args__gensym0[0];
    if (typeof discardValue__gensym2 !== "number" || lyknIntrinsicNumberIsNaN0(discardValue__gensym2)) {
      throw new lyknIntrinsicTypeError0("multiNested: arg '_' expected number, got " + typeof discardValue__gensym2);
    }
    for (const discardElement__gensym3 of tail) {
      if (typeof discardElement__gensym3 !== "number" || lyknIntrinsicNumberIsNaN0(discardElement__gensym3)) {
        throw new lyknIntrinsicTypeError0("multiNested: rest arg 'tail' expected number, got " + typeof discardElement__gensym3);
      }
    }
    return [_, tail.length];
  }
  if (args__gensym0.length === 1 && typeof args__gensym0[0] === "string") {
    const discardValue__gensym4 = args__gensym0[0];
    if (typeof discardValue__gensym4 !== "string") {
      throw new lyknIntrinsicTypeError0("multiNested: arg '_' expected string, got " + typeof discardValue__gensym4);
    }
    return [_, "string"];
  }
  throw new lyknIntrinsicTypeError0("multi-nested: no matching clause for arguments");
}
console.log(scalarDefault(8), defaults.value, scalarDefault(), defaults.value);
console.log(objectDefault({
  _: 8
}), defaults.value, objectDefault({}), defaults.value);
console.log(JSON.stringify(multiNested([undefined, 2, 3])), defaults.value);
console.log(JSON.stringify(multiNested("text")), defaults.value);
{
  const hidden = Number(7);
  if (typeof hidden !== "number" || lyknIntrinsicNumberIsNaN0(hidden)) {
    throw new lyknIntrinsicTypeError0("bind 'hidden': expected number, got " + typeof hidden);
  }
}
console.log(typeof hidden);
