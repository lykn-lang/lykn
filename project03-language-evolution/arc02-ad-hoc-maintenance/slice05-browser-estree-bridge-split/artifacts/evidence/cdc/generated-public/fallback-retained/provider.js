"use strict";
import {apply as lyknHostReflectApply2} from "data:text/javascript,export%20function%20apply(fn%2Creceiver%2Cargv)%7Breturn%20Reflect.apply(fn%2Creceiver%2Cargv)%7D";
console.log("provider");
const Reflect = "provider";
const marker = Reflect;
function invoke(saved, receiver, argv, Reflect, globalThis, lyknHostReflectApply0) {
  const result = lyknHostReflectApply2(saved, receiver, argv);
  return [result, Reflect.id, globalThis.id, lyknHostReflectApply0, typeof lyknHostReflectApply1, receiver.Reflect];
}
export {invoke, marker};
