const calls = { value: 0 };
function makeCallback() {
  return (() => {
    return async () => {
      calls.value = (count => {
        if (typeof count !== "number" || Number.isNaN(count)) throw new TypeError("anonymous: arg 'count' expected number, got " + typeof count);

        return count + 1;
      })(calls.value);
      await Promise.resolve(0);
      return 9;
    };
  })();
}
const callback = makeCallback();
const constructionCalls = calls.value;
const immediateType = typeof callback;
const result = await callback();
const invocationCalls = calls.value;
console.log(JSON.stringify({ constructionCalls: constructionCalls, immediateType: immediateType, invocationCalls: invocationCalls, result: result }));
