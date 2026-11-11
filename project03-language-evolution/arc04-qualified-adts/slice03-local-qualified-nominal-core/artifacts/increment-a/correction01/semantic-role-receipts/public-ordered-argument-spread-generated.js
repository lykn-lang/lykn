function lyknHostReflectApply0(fn, receiver, argv) {
  return Reflect.apply(fn, receiver, argv);
}
const trace = [];
const iterationError = new Error("iteration");
function* produceItems(fail) {
  trace.push("next0");
  yield 1;
  trace.push("next1");
  if (fail) {
    throw iterationError;
  }
  yield 2;
  trace.push("done");
}
function makeItems(fail) {
  const iterable = {};
  Object.defineProperty(iterable, Symbol.iterator, {
    value: () => {
      trace.push("iterator");
      return produceItems(fail);
    }
  });
  return iterable;
}
function lexicalTarget(a, b, c, d) {
  trace.push("lexical");
  return [a, b, c, d];
}
function invokeLexical(target, fail, stop) {
  {
    const completionValue__gensym0 = target;
    const completionValue__gensym1 = void 0;
    const completionValue__gensym2 = {
      "__proto__": null,
      length: 0
    };
    let completionValue__gensym3 = 0;
    let completionValue__gensym4;
    {
      trace.push("before");
      completionValue__gensym4 = 0;
    }
    completionValue__gensym2[completionValue__gensym3] = completionValue__gensym4;
    completionValue__gensym3 = completionValue__gensym3 + 1;
    completionValue__gensym2["length"] = completionValue__gensym3;
    for (const completionValue__gensym5 of makeItems(fail)) {
      completionValue__gensym2[completionValue__gensym3] = completionValue__gensym5;
      completionValue__gensym3 = completionValue__gensym3 + 1;
      completionValue__gensym2["length"] = completionValue__gensym3;
    }
    let completionValue__gensym6;
    {
      trace.push("late");
      if (stop) {
        return 7;
      }
      completionValue__gensym6 = 3;
    }
    completionValue__gensym2[completionValue__gensym3] = completionValue__gensym6;
    completionValue__gensym3 = completionValue__gensym3 + 1;
    completionValue__gensym2["length"] = completionValue__gensym3;
    return lyknHostReflectApply0(completionValue__gensym0, completionValue__gensym1, completionValue__gensym2);
  }
}
function methodTarget(a, b, c, d) {
  trace.push(["method", this.marker]);
  return [a, b, c, d];
}
function makeReceiver() {
  const receiver = {
    marker: "receiver"
  };
  Object.defineProperty(receiver, "run", {
    get: () => {
      trace.push("getter");
      return methodTarget;
    }
  });
  return receiver;
}
function invokeStatic(receiver) {
  {
    const completionValue__gensym7 = receiver;
    const completionValue__gensym8 = completionValue__gensym7["run"];
    const completionValue__gensym9 = {
      "__proto__": null,
      length: 0
    };
    let completionValue__gensym10 = 0;
    let completionValue__gensym11;
    {
      trace.push("before");
      completionValue__gensym11 = 0;
    }
    completionValue__gensym9[completionValue__gensym10] = completionValue__gensym11;
    completionValue__gensym10 = completionValue__gensym10 + 1;
    completionValue__gensym9["length"] = completionValue__gensym10;
    for (const completionValue__gensym12 of makeItems(false)) {
      completionValue__gensym9[completionValue__gensym10] = completionValue__gensym12;
      completionValue__gensym10 = completionValue__gensym10 + 1;
      completionValue__gensym9["length"] = completionValue__gensym10;
    }
    let completionValue__gensym13;
    {
      trace.push("late");
      completionValue__gensym13 = 3;
    }
    completionValue__gensym9[completionValue__gensym10] = completionValue__gensym13;
    completionValue__gensym10 = completionValue__gensym10 + 1;
    completionValue__gensym9["length"] = completionValue__gensym10;
    return lyknHostReflectApply0(completionValue__gensym8, completionValue__gensym7, completionValue__gensym9);
  }
}
function invokeComputed(receiver) {
  {
    const completionValue__gensym14 = receiver;
    let completionValue__gensym15;
    {
      trace.push("key");
      completionValue__gensym15 = "run";
    }
    const completionValue__gensym16 = completionValue__gensym14[completionValue__gensym15];
    const completionValue__gensym17 = {
      "__proto__": null,
      length: 0
    };
    let completionValue__gensym18 = 0;
    let completionValue__gensym19;
    {
      trace.push("before");
      completionValue__gensym19 = 0;
    }
    completionValue__gensym17[completionValue__gensym18] = completionValue__gensym19;
    completionValue__gensym18 = completionValue__gensym18 + 1;
    completionValue__gensym17["length"] = completionValue__gensym18;
    let completionValue__gensym20;
    {
      trace.push("operand");
      completionValue__gensym20 = makeItems(false);
    }
    for (const completionValue__gensym21 of completionValue__gensym20) {
      completionValue__gensym17[completionValue__gensym18] = completionValue__gensym21;
      completionValue__gensym18 = completionValue__gensym18 + 1;
      completionValue__gensym17["length"] = completionValue__gensym18;
    }
    let completionValue__gensym22;
    {
      trace.push("late");
      completionValue__gensym22 = 3;
    }
    completionValue__gensym17[completionValue__gensym18] = completionValue__gensym22;
    completionValue__gensym18 = completionValue__gensym18 + 1;
    completionValue__gensym17["length"] = completionValue__gensym18;
    return lyknHostReflectApply0(completionValue__gensym16, completionValue__gensym14, completionValue__gensym17);
  }
}
function mixedComputedSpread(receiver, items) {
  {
    const completionValue__gensym23 = receiver;
    let completionValue__gensym24;
    {
      return 7;
      completionValue__gensym24 = "method";
    }
    return completionValue__gensym23[completionValue__gensym24](...items);
  }
}
function observeFailure() {
  try {
    return invokeLexical(lexicalTarget, true, false);
  } catch (problem) {
    return [problem === iterationError];
  }
}
const normal = invokeLexical(lexicalTarget, false, false);
const early = invokeLexical(lexicalTarget, false, true);
const failed = observeFailure();
const staticResult = invokeStatic(makeReceiver());
const computedResult = invokeComputed(makeReceiver());
const headerReturn = mixedComputedSpread(makeReceiver(), makeItems(false));
console.log(JSON.stringify([normal, early, failed, staticResult, computedResult, headerReturn, trace]));
