globalThis._ = 99;
const metrics = { reads: 0 };
const record = {};
Object.defineProperty(record, "|", { get: () => {
  metrics.reads = metrics.reads + 1;
  return 7;
} });
const {"|": completionValue__gensym0} = record;
const {"|": completionValue__gensym1} = record;
const {"|": completionValue__gensym2} = record;
console.log(_, metrics.reads);
