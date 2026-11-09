import {apply as lyknHostReflectApply0} from "data:text/javascript,export%20function%20apply(fn%2Creceiver%2Cargv)%7Breturn%20Reflect.apply(fn%2Creceiver%2Cargv)%7D";
import {current as Reflect, advance} from "./state.js";
const code = Deno.args[0];
console.log(eval(code));
advance();
console.log(eval(code));
function saved(value) {
  return [this.id, value];
}
const receiver = {
  id: "receiver"
};
const argv = [7];
console.log(JSON.stringify(lyknHostReflectApply0(saved, receiver, argv)));
