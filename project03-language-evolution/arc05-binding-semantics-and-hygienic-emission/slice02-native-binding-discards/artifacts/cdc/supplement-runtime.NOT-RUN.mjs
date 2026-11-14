// Ordinary runtime product specimen for the independently compiled Lykn module.
globalThis._ = 99;
globalThis.loopSteps = 0;
globalThis.loopValues = 0;
globalThis.loopCloses = 0;
globalThis.fieldReads = 0;
globalThis.rows = [{
  [Symbol.iterator]() {
    let index = 0;
    return {
      next() {
        loopSteps++;
        const current = index++;
        return {done: false, get value() {
          loopValues++;
          return current === 0 ? 8 : {get value() { fieldReads++; return 7; }};
        }};
      },
      return() { loopCloses++; return {done: true}; },
    };
  },
}];
globalThis.catchSteps = 0;
globalThis.catchValues = 0;
globalThis.catchCloses = 0;
globalThis.catchInput = {
  [Symbol.iterator]() {
    let index = 0;
    return {
      next() {
        catchSteps++;
        const current = ++index;
        return {done: false, get value() { catchValues++; return current; }};
      },
      return() { catchCloses++; return {done: true}; },
    };
  },
};
globalThis.valueReads = 0;
globalThis.extraReads = 0;
globalThis.record = {
  get value() { valueReads++; return 3; },
  get extra() { extraReads++; return 4; },
};
globalThis.emptyArray = [];
globalThis.completionValue__gensym0 = {probe: 41};
globalThis.events = [];
globalThis.bump = value => { events.push(value); return value; };
await import("./supplement.mjs");
