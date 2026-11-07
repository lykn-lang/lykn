async function observePromiseValue() {
  const original = Promise.resolve(9);
  const result = (value_box__gensym0 => value_box__gensym0[0])(await (async () => {
    await Promise.resolve(0);
    return [original];
    return [undefined];
  })());
  return { same: result === original, thenType: typeof result.then, resolved: await result };
}
const observation = await observePromiseValue();
console.log(JSON.stringify(observation));
