const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
globalThis["_"] = 99;
const calls = {
  value: 0
};
function nextSeven() {
  calls.value = calls.value + 1;
  return 7;
}
const discardValue__gensym0 = nextSeven();
if (typeof discardValue__gensym0 !== "number" || lyknIntrinsicNumberIsNaN0(discardValue__gensym0)) {
  throw new lyknIntrinsicTypeError0("bind '_': expected number, got " + typeof discardValue__gensym0);
}
export {};
const {_: visible, _: discardValue__gensym1, ...rest} = {
  _: 3,
  extra: 4
};
export {visible, rest};
const [...{"0": nested}] = [17, 18];
export {nested};
const _value = 7;
export {_value};
const VERSION = "0.4.0";
export {VERSION};
console.log(calls.value, _);
