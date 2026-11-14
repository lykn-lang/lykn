globalThis._ = 99;
const record = {};
Object.defineProperty(record, "|", { get: () => 7 });
const {"|": completionValue__gensym0} = record;
const [] = [];
console.log(_);
