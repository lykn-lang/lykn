function lyknHostReflectApply0(fn, receiver, argv) {
  return Reflect.apply(fn, receiver, argv);
}
function mixedSpread(callable, items) {
  {
    const completionValue__gensym0 = callable;
    const completionValue__gensym1 = void 0;
    const completionValue__gensym2 = {
      "__proto__": null,
      length: 0
    };
    let completionValue__gensym3 = 0;
    for (const completionValue__gensym4 of items) {
      completionValue__gensym2[completionValue__gensym3] = completionValue__gensym4;
      completionValue__gensym3 = completionValue__gensym3 + 1;
      completionValue__gensym2["length"] = completionValue__gensym3;
    }
    let completionValue__gensym5;
    {
      return 7;
      completionValue__gensym5 = 8;
    }
    completionValue__gensym2[completionValue__gensym3] = completionValue__gensym5;
    completionValue__gensym3 = completionValue__gensym3 + 1;
    completionValue__gensym2["length"] = completionValue__gensym3;
    return lyknHostReflectApply0(completionValue__gensym0, completionValue__gensym1, completionValue__gensym2);
  }
}
