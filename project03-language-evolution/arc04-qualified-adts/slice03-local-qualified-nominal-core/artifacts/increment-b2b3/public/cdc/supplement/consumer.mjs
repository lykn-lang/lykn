const values = await import("./exports.mjs");
console.log(JSON.stringify(Object.keys(values)));
console.log(values.VERSION, values._value, values.nested, values.visible, JSON.stringify(values.rest));
