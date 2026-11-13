/** Private shared grammar for func/genfunc keyword groups. */
const FUNC_CLAUSE_KEYS = new Set(["args", "returns", "yields", "pre", "post", "body"]);

function isKeyword(arg) {
  return arg != null && arg.type === "keyword";
}

function parseKeywordClauses(args) {
  const clauses = new Map();
  for (const [key, range] of keywordGroupRanges(args)) {
    clauses.set(key, args.slice(range.valueStart, range.valueEnd));
  }
  return clauses;
}

/**
 * Describe the established anonymous genfn metadata/body slots.
 * @param {object[]} args Arguments after the `genfn` head.
 * @returns {{bodyStart: number, yieldsPayloadIndex: number|null}|null}
 *   Selected argument indexes, or null when the classifier must diagnose an
 *   incomplete parameter/body or `:yields` layout.
 */
function genfnBodyLayout(args) {
  if (args.length < 2) return null;
  if (args.length >= 3 && isKeyword(args[1]) && args[1].value === "yields") {
    if (args.length < 4) return null;
    return { bodyStart: 3, yieldsPayloadIndex: 2 };
  }
  return { bodyStart: 1, yieldsPayloadIndex: null };
}

/** Preserve source indexes while retaining canonical last-group-wins semantics. */
function keywordGroupRanges(args) {
  const clauses = new Map();
  let currentKey = null;
  let keywordIndex = -1;
  let valueStart = -1;
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (isKeyword(arg) && FUNC_CLAUSE_KEYS.has(arg.value)) {
      if (currentKey !== null) clauses.set(currentKey, { key: currentKey, keywordIndex, valueStart, valueEnd: index });
      currentKey = arg.value;
      keywordIndex = index;
      valueStart = index + 1;
    }
  }
  if (currentKey !== null) clauses.set(currentKey, { key: currentKey, keywordIndex, valueStart, valueEnd: args.length });
  return clauses;
}

export { FUNC_CLAUSE_KEYS, genfnBodyLayout, parseKeywordClauses, keywordGroupRanges };
