const trace = { value: [] };
async function chooseBranch(takeSync) {
  if (typeof takeSync !== "boolean") throw new TypeError("chooseBranch: arg 'takeSync' expected boolean, got " + typeof takeSync);

  const value = takeSync ? (() => {
    trace.value = (entries => {
      if (!Array.isArray(entries)) throw new TypeError("anonymous: arg 'entries' expected array, got " + typeof entries);

      return [...entries, "sync"];
    })(trace.value);
    return 42;
  })() : (value_box__gensym0 => value_box__gensym0[0])(await (async () => {
    trace.value = (entries => {
      if (!Array.isArray(entries)) throw new TypeError("anonymous: arg 'entries' expected array, got " + typeof entries);

      return [...entries, "await"];
    })(trace.value);
    return [await Promise.resolve(7)];
    return [undefined];
  })());
  trace.value = (entries => {
    if (!Array.isArray(entries)) throw new TypeError("anonymous: arg 'entries' expected array, got " + typeof entries);

    return [...entries, "after-branch"];
  })(trace.value);
  const result__gensym1 = value;
  if (typeof result__gensym1 !== "number" || Number.isNaN(result__gensym1)) throw new TypeError("chooseBranch: return value expected number, got " + typeof result__gensym1);

  return result__gensym1;
}
async function observeBranch(takeSync) {
  if (typeof takeSync !== "boolean") throw new TypeError("observeBranch: arg 'takeSync' expected boolean, got " + typeof takeSync);

  trace.value = [];
  const pending = chooseBranch(takeSync);
  trace.value = (entries => {
    if (!Array.isArray(entries)) throw new TypeError("anonymous: arg 'entries' expected array, got " + typeof entries);

    return [...entries, "after-call"];
  })(trace.value);
  const value = await pending;
  return { trace: trace.value, value: value };
}
async function chooseBothAwaited(takeLeft) {
  if (typeof takeLeft !== "boolean") throw new TypeError("chooseBothAwaited: arg 'takeLeft' expected boolean, got " + typeof takeLeft);

  const result__gensym4 = takeLeft ? (value_box__gensym2 => value_box__gensym2[0])(await (async () => {
    return [await Promise.resolve(42)];
    return [undefined];
  })()) : (value_box__gensym3 => value_box__gensym3[0])(await (async () => {
    return [await Promise.resolve(7)];
    return [undefined];
  })());
  if (typeof result__gensym4 !== "number" || Number.isNaN(result__gensym4)) throw new TypeError("chooseBothAwaited: return value expected number, got " + typeof result__gensym4);

  return result__gensym4;
}
const syncObservation = await observeBranch(true);
const awaitObservation = await observeBranch(false);
const bothAwaited = [await chooseBothAwaited(true), await chooseBothAwaited(false)];
console.log(JSON.stringify({ sync: syncObservation, await: awaitObservation, bothAwaited: bothAwaited }));
