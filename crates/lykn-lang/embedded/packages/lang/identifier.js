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

/** Return the compiler's emitted member parts for a colon identifier. */
export function toJsIdentifierParts(str) {
  return str.split(":").map((part, index) => ({
    name: toJsIdentifier(part),
    private: index > 0 && part.startsWith("-"),
  }));
}

export function decodeIdentifierEscapes(text) {
  let output = "";
  for (let index = 0; index < text.length;) {
    if (text[index] !== "\\" || text[index + 1] !== "u") {
      output += text[index++];
      continue;
    }
    if (text[index + 2] === "{") {
      let cursor = index + 3;
      let digitCount = 0;
      let codePoint = 0;
      while (digitCount < 6) {
        const digit = text[cursor];
        if (digit === undefined || !/[\da-fA-F]/.test(digit)) break;
        codePoint = codePoint * 16 + Number.parseInt(digit, 16);
        cursor++;
        digitCount++;
      }
      if (digitCount > 0 && text[cursor] === "}" && codePoint <= 0x10ffff) {
        output += String.fromCodePoint(codePoint);
        index = cursor + 1;
      } else {
        output += text[index++];
      }
      continue;
    }
    const digits = text.slice(index + 2, index + 6);
    if (/^[\da-fA-F]{4}$/.test(digits)) {
      output += String.fromCharCode(Number.parseInt(digits, 16));
      index += 6;
    } else {
      output += text[index++];
    }
  }
  return output;
}

function isPhysicalIdentifierChar(char) {
  const codePoint = char.codePointAt(0);
  return /[\p{L}\p{N}_$]/u.test(char) ||
    (codePoint > 0x7f && !/\s/u.test(char) && char !== "\uFEFF");
}

function sourceAtomText(text) {
  return toJsIdentifierParts(text).map(({ name, private: isPrivate }) =>
    `${isPrivate ? "#" : ""}${name}`
  ).join(".");
}

/** Map source or already-emitted identifier text to conservative JS name keys. */
export function physicalIdentifierKeys(text) {
  const keys = new Set(emittedIdentifierKeys(sourceAtomText(text)));
  for (const legacy of [
    toJsIdentifier(text),
    ...text.split(":").filter((part) => part !== "").map(toJsIdentifier),
  ]) {
    for (const key of emittedIdentifierKeys(legacy)) keys.add(key);
  }
  return keys;
}

function addPhysicalName(occupied, text) {
  for (const key of physicalIdentifierKeys(text)) occupied.add(key);
}

function reserveThreadStep(step, occupied) {
  const keyword = step?.type === "keyword"
    ? step
    : step?.type === "list" && step.values[0]?.type === "keyword"
    ? step.values[0]
    : null;
  if (keyword) addPhysicalName(occupied, keyword.value);
}

function rawThreadSteps(node) {
  const head = node?.type === "list" ? node.values[0]?.value : null;
  return ["->", "->>", "some->", "some->>"].includes(head)
    ? node.values.slice(2)
    : null;
}

function surfaceThreadSteps(node) {
  return ["Thread", "SomeThread"].includes(node?.type) && Array.isArray(node.steps)
    ? node.steps
    : null;
}

/** Map already-emitted identifier text without applying Source normalization. */
export function emittedIdentifierKeys(text) {
  const decoded = decodeIdentifierEscapes(text);
  const keys = new Set([decoded]);
  let run = "";
  const flush = () => {
    if (run !== "") keys.add(run);
    run = "";
  };
  for (const char of decoded) {
    if (isPhysicalIdentifierChar(char)) run += char;
    else flush();
  }
  flush();
  return keys;
}

/**
 * Create a per-entry physical-name allocator around a legacy raw-name source.
 * The returned methods close over their state and are safe to pass as callbacks.
 */
export function createGeneratedNameAllocator(nextRawName) {
  if (typeof nextRawName !== "function") {
    throw new TypeError("generated-name allocator requires a name callback");
  }
  const occupied = new Set();

  function reserveSyntax(root, { skipNode = null } = {}) {
    const visited = new WeakSet();
    function visit(node) {
      if (node === null || typeof node !== "object" || visited.has(node)) return;
      if (skipNode?.(node)) return;
      visited.add(node);
      if (Array.isArray(node)) {
        for (const child of node) visit(child);
        return;
      }
      if (node.type === "atom" && typeof node.value === "string") {
        addPhysicalName(occupied, node.value);
        return;
      }
      if (["string", "keyword", "number", "boolean", "null"].includes(node.type)) return;
      const threadSteps = rawThreadSteps(node) ?? surfaceThreadSteps(node);
      if (threadSteps) {
        for (const step of threadSteps) reserveThreadStep(step, occupied);
      }
      for (const [key, value] of Object.entries(node)) {
        if (["type", "binding", "loc", "start", "end", "sourceText"].includes(key)) continue;
        if (["keys", "names", "fieldNames"].includes(key) && Array.isArray(value)) {
          for (const item of value) {
            if (typeof item === "string") addPhysicalName(occupied, item);
            else visit(item);
          }
          continue;
        }
        if (typeof value === "string" && ["key", "name", "funcName", "typeName", "fieldName"].includes(key)) {
          addPhysicalName(occupied, value);
        } else {
          visit(value);
        }
      }
    }
    visit(root);
    return undefined;
  }

  function next(prefix) {
    const rejectedCandidates = new Set();
    while (true) {
      const candidate = nextRawName(prefix);
      if (typeof candidate !== "string" &&
          !(candidate && candidate.type === "atom" && typeof candidate.value === "string")) {
        throw new TypeError("generated-name callback must return an atom or string");
      }
      const rawText = typeof candidate === "string" ? candidate : candidate.value;
      const keys = physicalIdentifierKeys(rawText);
      const collisionKey = [...keys].find((key) => occupied.has(key));
      if (collisionKey !== undefined) {
        if (rejectedCandidates.has(rawText)) {
          throw new Error("generated-name callback repeated a rejected candidate");
        }
        rejectedCandidates.add(rawText);
        continue;
      }
      for (const key of keys) occupied.add(key);
      return candidate;
    }
  }

  return { reserveSyntax, next };
}
