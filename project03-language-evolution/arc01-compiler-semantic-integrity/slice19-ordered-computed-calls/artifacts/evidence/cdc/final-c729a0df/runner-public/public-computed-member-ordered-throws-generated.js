function lyknHostReflectApply0(fn, receiver, argv) {
  return Reflect.apply(fn, receiver, argv);
}
const trace = [];
const getterError = new Error("getter");
const argumentError = new Error("argument");
function actualMethod(earlier, middle, later) {
  trace.push("call");
  return [this.label, middle];
}
function makeTarget(mode) {
  const target = {
    label: "receiver"
  };
  Object.defineProperty(target, "method", {
    get: () => {
      trace.push("getter");
      if (mode === 1) {
        throw getterError;
      }
      return actualMethod;
    }
  });
  return target;
}
function invokeComputed(mode) {
  const key = {};
  Object.defineProperty(key, Symbol.toPrimitive, {
    value: hint => {
      trace.push(hint);
      return "method";
    }
  });
  let completionValue__gensym0;
  {
    {
      let completionValue__gensym1;
      {
        trace.push("base");
        completionValue__gensym1 = makeTarget(mode);
      }
      const completionValue__gensym2 = completionValue__gensym1;
      let completionValue__gensym3;
      {
        trace.push("key");
        if (mode === 3) {
          return 93;
        }
        completionValue__gensym3 = key;
      }
      const completionValue__gensym4 = completionValue__gensym2[completionValue__gensym3];
      const completionValue__gensym5 = trace.push("first");
      let completionValue__gensym6;
      {
        trace.push("arg");
        if (mode === 2) {
          throw argumentError;
        }
        completionValue__gensym6 = 8;
      }
      const completionValue__gensym7 = [completionValue__gensym5, completionValue__gensym6, trace.push("last")];
      completionValue__gensym0 = lyknHostReflectApply0(completionValue__gensym4, completionValue__gensym2, completionValue__gensym7);
    }
  }
  const answer = completionValue__gensym0;
  trace.push("after");
  return answer;
}
function observe(mode) {
  try {
    return invokeComputed(mode);
  } catch (problem) {
    return [problem === getterError, problem === argumentError, problem instanceof TypeError];
  }
}
console.log(JSON.stringify([observe(0), observe(1), observe(2), observe(3), trace]));
