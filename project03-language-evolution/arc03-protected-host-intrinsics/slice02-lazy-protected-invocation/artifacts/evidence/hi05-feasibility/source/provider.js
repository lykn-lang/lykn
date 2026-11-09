import {apply as lyknHostReflectApply0} from "data:text/javascript,export%20function%20apply(fn%2Creceiver%2Cargv)%7Breturn%20Reflect.apply(fn%2Creceiver%2Cargv)%7D";
const Reflect = "local";
console.log("provider");
const marker = "provider";
function invoke(saved, receiver, argv) {
  return [Reflect, lyknHostReflectApply0(saved, receiver, argv)];
}
export {marker, invoke};
