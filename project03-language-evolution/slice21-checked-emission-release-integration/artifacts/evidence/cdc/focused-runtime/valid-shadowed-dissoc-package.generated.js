const dissoc = (left, right) => [left, right][1];
console.log(JSON.stringify(dissoc({ secret: 1 }, "kept")));
