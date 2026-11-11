// ── DD-49 data tables ──────────────────────────────────────────────────

const MACRO_OVERRIDES = new Map([["->", "threadFirst"], ["->>", "threadLast"]]);
const PREDICATE_PREFIXES = ["is-", "has-", "can-", "should-", "will-", "does-", "was-", "had-"];
const MULTI_CHAR_ESCAPES = [["->", "To"], ["<-", "From"]];

const PUNCTUATION_TABLE = new Map([
  ["?", "QMARK"], ["!", "BANG"], ["*", "STAR"], ["+", "PLUS"],
  ["=", "EQ"], ["<", "LT"], [">", "GT"], ["&", "AMP"],
  ["%", "PCT"], ["/", "SLASH"],
]);

/** Map a lykn identifier to a valid JS identifier per DD-49. */
export function toJsIdentifier(str) {
  // Step 1: macro-override check (whole-identifier match)
  const override = MACRO_OVERRIDES.get(str);
  if (override !== undefined) return override;

  const len = str.length;
  if (len === 0) return '';

  // Step 2: trailing-rule phase
  let predicateMode = false;
  const last = str[len - 1];
  let working;
  if (last === '?' && len > 1) {
    predicateMode = true;
    working = str.slice(0, len - 1);
  } else if (last === '!' && len > 1) {
    working = str.slice(0, len - 1);
  } else {
    working = str;
  }

  // Step 3: prefix-detection (if predicate mode, may prepend "is-")
  if (predicateMode) {
    let hasPrefix = false;
    for (let p = 0; p < PREDICATE_PREFIXES.length; p++) {
      if (working.startsWith(PREDICATE_PREFIXES[p])) {
        hasPrefix = true;
        break;
      }
    }
    if (!hasPrefix) working = 'is-' + working;
  }

  // Step 4: walk phase (left-to-right with capNext flag)
  let out = '';
  let i = 0;
  let capNext = false;
  const wLen = working.length;

  // Leading hyphens → underscores
  while (i < wLen && working[i] === '-') {
    out += '_';
    i++;
  }
  if (i === wLen) return out;

  // Trailing hyphens count
  let trailingHyphens = 0;
  {
    let j = wLen;
    while (j > i && working[j - 1] === '-') {
      trailingHyphens++;
      j--;
    }
  }
  const bodyEnd = wLen - trailingHyphens;

  while (i < bodyEnd) {
    // Try multi-char escapes
    let matchedMulti = false;
    for (let m = 0; m < MULTI_CHAR_ESCAPES.length; m++) {
      const [pattern, abbrev] = MULTI_CHAR_ESCAPES[m];
      if (working.startsWith(pattern, i)) {
        for (let a = 0; a < abbrev.length; a++) {
          if (capNext) {
            out += abbrev[a].toUpperCase();
            capNext = false;
          } else {
            out += abbrev[a];
          }
        }
        capNext = true;
        i += pattern.length;
        matchedMulti = true;
        break;
      }
    }
    if (matchedMulti) continue;

    const ch = working[i];

    // Try single-char punctuation table
    const abbrev = PUNCTUATION_TABLE.get(ch);
    if (abbrev !== undefined) {
      for (let a = 0; a < abbrev.length; a++) {
        if (capNext) {
          out += abbrev[a].toUpperCase();
          capNext = false;
        } else {
          out += abbrev[a];
        }
      }
      capNext = true;
      i++;
      continue;
    }

    // Hyphen → set capNext
    if (ch === '-') {
      capNext = true;
      i++;
      continue;
    }

    // Alphanumeric
    if (capNext) {
      out += ch.toUpperCase();
      capNext = false;
    } else {
      out += ch;
    }
    i++;
  }

  for (let t = 0; t < trailingHyphens; t++) out += '_';
  return out;
}
