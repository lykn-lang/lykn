globalThis["answer"] = 0;
const macro = (name, params, body) => 42;
macro(answer, 1, 41);
console.log(macro(answer, 1, 41));
