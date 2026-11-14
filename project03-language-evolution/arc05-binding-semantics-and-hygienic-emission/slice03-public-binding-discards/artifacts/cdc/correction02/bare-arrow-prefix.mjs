globalThis["_"] = 99;
const arrow = (capturedOne, capturedTwo) => _;
console.log(arrow.length, arrow(7));
