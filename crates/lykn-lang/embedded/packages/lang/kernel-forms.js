// DD-58 kernel-form data + diagnostics for the JS compiler.
//
// This mirrors the Rust classifier's dispatch tables and diagnostics so the
// two compilers enforce the same closed surface namespace (DD-58). Behaviour
// parity is required; structural parity is not.
//
// ⚠ DIVERGENCE RISK: `KERNEL_FORMS` and `KERNEL_ONLY_FORMS` below are a second
// copy of the Rust source of truth in
// `crates/lykn-lang/src/classifier/dispatch.rs` (`KERNEL_FORMS` and
// `is_kernel_only_form`). Any change to the kernel-form set MUST be made in
// both places. See that file's matching comment.

/**
 * All kernel-form atoms recognised by the codegen — the whitelist the
 * `(kernel:<form> …)` escape validates against. Mirror of Rust `KERNEL_FORMS`
 * (`dispatch.rs`).
 * @type {Set<string>}
 */
export const KERNEL_FORMS = new Set([
  "const", "let", "var", "function", "function*",
  "=>", "if", "block", "return", "throw", "try",
  "while", "do-while", "for", "for-of", "for-in", "for-await-of",
  "switch", "break", "continue",
  "new", "delete", "typeof", "instanceof", "in", "void",
  "yield", "yield*", "label", "seq", "debugger",
  "import", "export", "dynamic-import", "async", "await", "get",
  "=", "array", "object", "spread", "rest", "default", "alias",
  "template", "tag", "regex", "?", "quote", "quasiquote",
  "+", "-", "*", "/", "%", "**",
  "===", "!==", "==", "!=", "<", ">", "<=", ">=",
  "&&", "||", "??", "&", "|", "^", "<<", ">>", ">>>", "!", "~",
  "++", "--", "+=", "-=", "*=", "/=", "%=", "**=",
  "<<=", ">>=", ">>>=", "&=", "|=", "^=", "&&=", "||=", "??=",
]);

/**
 * The kernel-only declaration forms — reachable in surface only via the
 * `(kernel:<form> …)` escape. Writing them bare at the top level of a surface
 * file is a compile error under strict mode. Mirror of Rust
 * `is_kernel_only_form` (`dispatch.rs`).
 * @type {Set<string>}
 */
export const KERNEL_ONLY_FORMS = new Set([
  "const", "let", "var", "function", "function*",
]);

/**
 * Levenshtein edit distance (mirror of Rust `levenshtein`, `forms.rs`).
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function levenshtein(a, b) {
  const n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array(n + 1).fill(0);
  for (let i = 0; i < a.length; i++) {
    curr[0] = i + 1;
    for (let j = 0; j < n; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      curr[j + 1] = Math.min(prev[j] + cost, prev[j + 1] + 1, curr[j] + 1);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

/**
 * Closest kernel form by edit distance, if within 2 (mirror of Rust
 * `closest_kernel_form`).
 * @param {string} name
 * @returns {string | null}
 */
export function closestKernelForm(name) {
  let best = null;
  let bestDist = Infinity;
  for (const form of KERNEL_FORMS) {
    const d = levenshtein(name, form);
    if (d < bestDist) {
      bestDist = d;
      best = form;
    }
  }
  return bestDist <= 2 ? best : null;
}

/**
 * Diagnostic for a bare kernel-only declaration form under strict mode.
 * Text matches the Rust CLI verbatim (user-visible, guide-quoted).
 * @param {string} head - one of const/let/var/function/function*
 * @returns {string}
 */
export function kernelOnlyMessage(head) {
  if (head === "const" || head === "let" || head === "var") {
    return `'${head}' is a kernel-only form; use 'bind' for surface binding, ` +
      `or '(kernel:${head} ...)' to access the kernel form explicitly`;
  }
  // function / function*
  return `'${head}' is a kernel-only form; use 'func', 'fn', or 'lambda' ` +
    `for surface functions, or '(kernel:${head} ...)' to access the ` +
    `kernel form explicitly`;
}
