const trace = [];
const original = { stored: 10 };
const replacement = { stored: 40 };
const previous = {};
Object.defineProperty(previous, Symbol.toPrimitive, { value: hint => {
  trace.push(["convert", hint]);
  return original.stored;
} });
Object.defineProperty(original, "slot", { get: () => {
  trace.push("get");
  return previous;
}, set: next => {
  trace.push(["set", next]);
  return original.stored = next;
} });
function addSlot(target, stop) {
  let completionValue__gensym0;
  {
    {
      const completionValue__gensym1 = target;
      const completionValue__gensym2 = completionValue__gensym1["slot"];
      let completionValue__gensym3;
      {
        trace.push("rhs");
        target = replacement;
        if (stop) {
          return 91;
        }
        completionValue__gensym3 = 4;
      }
      completionValue__gensym0 = completionValue__gensym1["slot"] = completionValue__gensym2 + completionValue__gensym3;
    }
  }
  const result = completionValue__gensym0;
  trace.push("after");
  return result;
}
const early = addSlot(original, true);
const before = [original.stored, replacement.stored];
const normal = addSlot(original, false);
console.log(JSON.stringify([early, before, normal, original.stored, replacement.stored, trace]));
