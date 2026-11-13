import {apply as lyknHostReflectApply0} from "data:text/javascript,export%20function%20apply(fn%2Creceiver%2Cargv)%7Breturn%20Reflect.apply(fn%2Creceiver%2Cargv)%7D";
const Reflect = 0;
function saved(value) {
  return this.base + value;
}
const receiver = {
  base: 40
};
const argv = [1];
console.log(lyknHostReflectApply0(saved, receiver, argv));
