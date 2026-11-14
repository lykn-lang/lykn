globalThis["_"] = 99;
const arrow = _ => _;
console.log(arrow.length, arrow(7));
