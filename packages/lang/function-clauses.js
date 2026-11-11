/** Private shared grammar for func/genfunc keyword groups. */
const FUNC_CLAUSE_KEYS = new Set(["args", "returns", "yields", "pre", "post", "body"]);

function isKeyword(arg) {
  return arg != null && arg.type === "keyword";
}

function parseKeywordClauses(args) {
  const clauses = new Map();
  let currentKey = null;
  let currentValues = [];
  for (const arg of args) {
    if (isKeyword(arg) && FUNC_CLAUSE_KEYS.has(arg.value)) {
      if (currentKey !== null) clauses.set(currentKey, currentValues);
      currentKey = arg.value;
      currentValues = [];
    } else currentValues.push(arg);
  }
  if (currentKey !== null) clauses.set(currentKey, currentValues);
  return clauses;
}

export { FUNC_CLAUSE_KEYS, parseKeywordClauses };
