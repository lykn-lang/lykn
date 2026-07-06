// JS reserved words — names that cannot be a lexical binding identifier
// (DD-60 D2). The authority for this list is empirical: a name is reserved iff
// `const <name> = 0;` fails to parse as an ES module. This copy is pinned to
// that authority AND to the Rust backend's copy
// (`crates/lykn-lang/src/binding.rs`) by the three-way parity test
// (`test/expander/reserved-words-parity.test.js`, in `make check`).
//
// ⚠ DIVERGENCE RISK: keep identical to `crates/lykn-lang/src/binding.rs`'s
// RESERVED_WORDS and to the probe's legality (`tools/conformance-matrix.js`).

/** @type {ReadonlyArray<string>} */
export const RESERVED_WORDS = Object.freeze([
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "let",
  "new",
  "null",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
]);

const RESERVED_SET = new Set(RESERVED_WORDS);

/**
 * True if `name` is a JS reserved word (invalid as a lykn binding name, D2).
 * @param {string} name
 * @returns {boolean}
 */
export function isReservedWord(name) {
  return RESERVED_SET.has(name);
}
