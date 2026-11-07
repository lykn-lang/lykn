const trace = { value: [] };
const outer = (() => {
  const scopeValue = "outer";
  return scopeValue;
})();
const scoped = (() => {
  const scopeValue = "inner";
  return scopeValue;
})();
const selectedMessage = { value: "" };
try {
  if (true) {
    trace.value = (entries => {
      if (!Array.isArray(entries)) throw new TypeError("anonymous: arg 'entries' expected array, got " + typeof entries);

      return [...entries, "selected"];
    })(trace.value);
    throw new Error("selected boom");
  } else {
    trace.value = (entries => {
      if (!Array.isArray(entries)) throw new TypeError("anonymous: arg 'entries' expected array, got " + typeof entries);

      return [...entries, "untaken"];
    })(trace.value);
    1;
  }
} catch (err) {
  selectedMessage.value = err.message;
}
async function rejectLater() {
  return await Promise.reject(new Error("await rejected"));
}
const failValue = async () => {
  const result = true ? (value_box__gensym0 => value_box__gensym0[0])(await (async () => {
    trace.value = (entries => {
      if (!Array.isArray(entries)) throw new TypeError("anonymous: arg 'entries' expected array, got " + typeof entries);

      return [...entries, "await-selected"];
    })(trace.value);
    await Promise.resolve(0);
    throw new Error("value boom");
    return [undefined];
  })()) : (() => {
    trace.value = (entries => {
      if (!Array.isArray(entries)) throw new TypeError("anonymous: arg 'entries' expected array, got " + typeof entries);

      return [...entries, "await-untaken"];
    })(trace.value);
    return 99;
  })();
  return result;
};
const rejectionMessage = { value: "" };
try {
  await rejectLater();
} catch (err) {
  rejectionMessage.value = err.message;
}
const asyncValueMessage = { value: "" };
try {
  await failValue();
} catch (err) {
  asyncValueMessage.value = err.message;
}
console.log(JSON.stringify({ trace: trace.value, selectedMessage: selectedMessage.value, rejectionMessage: rejectionMessage.value, outer: outer, scoped: scoped, asyncValueMessage: asyncValueMessage.value }));
