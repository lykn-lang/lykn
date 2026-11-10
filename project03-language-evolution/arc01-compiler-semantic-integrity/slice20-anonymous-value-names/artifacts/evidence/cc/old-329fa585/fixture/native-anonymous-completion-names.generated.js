function lyknHostReflectApply0(fn, receiver, argv) {
  return Reflect.apply(fn, receiver, argv);
}
function nameOf(callback, _other) {
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
  const namedCallback = () => 1;
  let completionValue__gensym5;
  {
    const completionValue__gensym6 = callee;
    const completionValue__gensym7 = () => return 1;
    ;
    let completionValue__gensym8;
    {
      0;
      completionValue__gensym8 = 0;
    }
    completionValue__gensym5 = completionValue__gensym6(completionValue__gensym7, completionValue__gensym8);
  }
  const liftedLambda = completionValue__gensym5;
  let completionValue__gensym9;
  {
    const completionValue__gensym10 = callee;
    const completionValue__gensym11 = function*() {
      yield 1;
    }
    ;
    let completionValue__gensym12;
    {
      0;
      completionValue__gensym12 = 0;
    }
    completionValue__gensym9 = completionValue__gensym10(completionValue__gensym11, completionValue__gensym12);
  }
  const liftedGenerator = completionValue__gensym9;
  let completionValue__gensym13;
  {
    const completionValue__gensym14 = callee;
    const completionValue__gensym15 = class {};
    let completionValue__gensym16;
    {
      0;
      completionValue__gensym16 = 0;
    }
    completionValue__gensym13 = completionValue__gensym14(completionValue__gensym15, completionValue__gensym16);
  }
  const liftedClass = completionValue__gensym13;
  let completionValue__gensym17;
  {
    const completionValue__gensym18 = callee;
    const completionValue__gensym19 = async () => 1;
    let completionValue__gensym20;
    {
      0;
      completionValue__gensym20 = 0;
    }
    completionValue__gensym17 = completionValue__gensym18(completionValue__gensym19, completionValue__gensym20);
  }
  const liftedAsync = completionValue__gensym17;
  let completionValue__gensym21;
  {
    const completionValue__gensym22 = () => 1;
    const completionValue__gensym23 = completionValue__gensym22["bind"];
    let completionValue__gensym24;
    {
      0;
      completionValue__gensym24 = 0;
    }
    const completionValue__gensym25 = [completionValue__gensym24];
    completionValue__gensym21 = lyknHostReflectApply0(completionValue__gensym23, completionValue__gensym22, completionValue__gensym25);
  }
  const boundResult = completionValue__gensym21;
  return [ordinary, lifted, value.name, namedCallback.name, liftedLambda, liftedGenerator, liftedClass, liftedAsync, boundResult.name];
}
console.log(JSON.stringify(names(nameOf)));
