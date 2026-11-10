function nameOf(callback, other) {
  return callback.name;
}
function names(callee) {
  const ordinary = callee(() => 1, 0);
  let completionValue__gensym0;
  {
    const completionValue__gensym1 = callee;
    const completionValue__gensym2 = () => 1;
    let completionValue__gensym3;
    {
      0;
      completionValue__gensym3 = 0;
    }
    completionValue__gensym0 = completionValue__gensym1(completionValue__gensym2, completionValue__gensym3);
  }
  const lifted = completionValue__gensym0;
  let completionValue__gensym4;
  {
    {
      completionValue__gensym4 = () => 1;
    }
  }
  const value = completionValue__gensym4;
  return [ordinary, lifted, value.name];
}
console.log(JSON.stringify(names(nameOf)));
