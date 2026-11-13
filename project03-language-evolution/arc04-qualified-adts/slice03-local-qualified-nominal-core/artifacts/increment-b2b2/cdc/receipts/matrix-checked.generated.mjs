const lyknIntrinsicNumberIsNaN0 = Number.isNaN;
const lyknIntrinsicTypeError0 = TypeError;
const _n = 2;
const _v0 = 2;
console.log((() => { const _n__lyknGenerated0 = _n + 1; return `${_n__lyknGenerated0} ${_n__lyknGenerated0}`; })());
console.log(`${(() => { const _v0__lyknGenerated0 = _v0; if (_v0__lyknGenerated0 === 1) return `one`; return `${_v0__lyknGenerated0}`; })()}`);
console.log((() => { const _v0 = 3 + 4; return `${(() => { const _v0__lyknGenerated0 = 2; if (_v0__lyknGenerated0 === 1) return `${_v0} ${_v0}`; return `${_v0} ${_v0}`; })()}`; })());
console.log((() => { const _x = `${(() => { const _v0__lyknGenerated0 = _v0; if (_v0__lyknGenerated0 === 1) return `one`; return `${_v0__lyknGenerated0}`; })()}`; return `${_x}-${_x}`; })());
const calls = [];
function nextId(value) {
  if (typeof value !== "number" || lyknIntrinsicNumberIsNaN0(value)) {
    throw new lyknIntrinsicTypeError0("nextId: arg 'value' expected number, got " + typeof value);
  }
  calls.push(value);
  const result__gensym0 = value + calls.length;
  if (typeof result__gensym0 !== "number" || lyknIntrinsicNumberIsNaN0(result__gensym0)) {
    throw new lyknIntrinsicTypeError0("nextId: return value expected number, got " + typeof result__gensym0);
  }
  return result__gensym0;
}
console.log((() => { const _x = nextId(_n); return `${_x}-${_x}`; })());
console.log(JSON.stringify(calls));
function branchEffect() {
  calls.push(99);
  return 9;
}
console.log(`${(() => { const _v0 = "owner"; if (_v0 === "owner") return `Owner`; return `${branchEffect()}`; })()}`);
console.log(JSON.stringify(calls));
console.log((() => { const _unused = branchEffect(); return `${(() => { const _v0 = "owner"; if (_v0 === "owner") return `Owner`; return `${_unused} ${_unused}`; })()}`; })());
console.log(JSON.stringify(calls));
