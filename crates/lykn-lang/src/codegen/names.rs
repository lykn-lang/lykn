//! Identifier transformation for JavaScript output.
//!
//! Implements DD-49's composite identifier-mapping rule: lykn surface names
//! (which may contain `?`, `!`, `*`, `->`, and other Lisp-tradition punctuation)
//! are transformed to valid JavaScript identifiers via predicate naming, bang
//! stripping, uppercase abbreviation escapes, and macro-name overrides.
//!
//! Also provides colon-separated member chain emission (`console:log` → `console.log`).

use super::format::JsWriter;
use crate::ast::sexpr::SExpr;
use std::borrow::Cow;
use std::collections::HashSet;

/// Fresh local names for one generated expression, reserved against source
/// identifiers that the expression will evaluate.
#[derive(Debug, Default)]
pub(crate) struct GeneratedNameAllocator {
    occupied: HashSet<String>,
    next_suffix: usize,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) struct GeneratedNameExhausted;

impl GeneratedNameAllocator {
    pub(crate) fn new() -> Self {
        Self::default()
    }

    /// Reserve conservative physical identifiers from atoms in a borrowed
    /// source expression, including computed-key reads. Literal data nodes do
    /// not introduce JS variable reads.
    pub(crate) fn reserve_expr(&mut self, expr: &SExpr) {
        match expr {
            SExpr::Atom(_) => {
                if let Some(name) = expr.as_atom() {
                    reserve_emitted_atom_names(name, &mut self.occupied);
                }
            }
            SExpr::List { values, .. } => {
                for value in values {
                    self.reserve_expr(value);
                }
            }
            SExpr::Cons { car, cdr, .. } => {
                self.reserve_expr(car);
                self.reserve_expr(cdr);
            }
            SExpr::Keyword { .. }
            | SExpr::String { .. }
            | SExpr::Number { .. }
            | SExpr::Bool { .. }
            | SExpr::Null { .. } => {}
        }
    }

    /// Allocate the preferred emitted name when available, otherwise use a
    /// deterministic suffix. Every returned identifier is reserved at once.
    pub(crate) fn allocate(&mut self, preferred: &str) -> Result<String, GeneratedNameExhausted> {
        if self.occupied.insert(emitted_text_identifier_key(preferred)) {
            return Ok(preferred.to_owned());
        }

        loop {
            let suffix = self.next_suffix;
            self.next_suffix = suffix.checked_add(1).ok_or(GeneratedNameExhausted)?;
            let candidate = format!("{preferred}__lyknGenerated{suffix}");
            if self
                .occupied
                .insert(emitted_text_identifier_key(&candidate))
            {
                return Ok(candidate);
            }
        }
    }
}

/// Reserve the physical identifier spellings emitted for one source atom.
/// This is conservative occupancy only; it does not assign binding roles.
pub(crate) fn reserve_emitted_atom_names(raw: &str, occupied: &mut HashSet<String>) {
    let mut writer = JsWriter::new();
    emit_atom(&mut writer, raw);
    let emitted = writer.finish();

    // Preserve the previous full-spelling/colon-segment keys. For a normal
    // atom, the emitted form is already exactly `to_js_identifier(raw)`.
    if raw.contains(':') {
        occupied.insert(to_js_identifier(raw));
        for segment in raw.split(':') {
            if !segment.is_empty() {
                occupied.insert(to_js_identifier(segment));
            }
        }
    } else {
        occupied.insert(emitted.clone());
    }

    let decoded = decode_static_unicode_escapes(&emitted);
    let physical = decoded.as_ref();
    let mut run_start = None;
    for (index, ch) in physical.char_indices() {
        if identifier_run_char(ch) {
            run_start.get_or_insert(index);
        } else if let Some(start) = run_start.take() {
            occupied.insert(physical[start..index].to_string());
        }
    }
    if let Some(start) = run_start {
        occupied.insert(physical[start..].to_string());
    }
}

/// Return a generated binding's physical JavaScript identifier key.
pub(crate) fn emitted_identifier_key(raw: &str) -> String {
    let mut writer = JsWriter::new();
    emit_atom(&mut writer, raw);
    emitted_text_identifier_key(&writer.finish())
}

/// Decode a candidate that the caller already holds in emitted JavaScript
/// spelling. In particular, ICU candidates must not be normalized twice.
pub(crate) fn emitted_text_identifier_key(emitted: &str) -> String {
    decode_static_unicode_escapes(emitted).into_owned()
}

fn identifier_run_char(ch: char) -> bool {
    ch.is_ascii_alphanumeric()
        || ch == '_'
        || ch == '$'
        || (!ch.is_ascii() && !ch.is_whitespace() && ch != '\u{feff}')
}

/// Decode static JavaScript Unicode escapes without validating surrounding JS.
/// Ordinary atoms borrow their input; only text containing `\\u` is copied.
fn decode_static_unicode_escapes(text: &str) -> Cow<'_, str> {
    let Some(first_escape) = text.find("\\u") else {
        return Cow::Borrowed(text);
    };

    let bytes = text.as_bytes();
    let mut decoded = String::with_capacity(text.len());
    decoded.push_str(&text[..first_escape]);
    let mut index = first_escape;
    while index < bytes.len() {
        if bytes[index] == b'\\'
            && bytes.get(index + 1) == Some(&b'u')
            && let Some((ch, end)) = parse_unicode_escape(text, index)
        {
            decoded.push(ch);
            index = end;
            continue;
        }
        let ch = text[index..]
            .chars()
            .next()
            .expect("index remains on a UTF-8 character boundary");
        decoded.push(ch);
        index += ch.len_utf8();
    }
    Cow::Owned(decoded)
}

fn parse_unicode_escape(text: &str, start: usize) -> Option<(char, usize)> {
    let bytes = text.as_bytes();
    let after_prefix = start.checked_add(2)?;
    if bytes.get(after_prefix) == Some(&b'{') {
        let mut index = after_prefix.checked_add(1)?;
        let mut digits = 0_u32;
        let mut count = 0_usize;
        loop {
            match bytes.get(index).copied()? {
                b'}' if count > 0 => {
                    let ch = char::from_u32(digits)?;
                    return Some((ch, index.checked_add(1)?));
                }
                byte if byte.is_ascii_hexdigit() => {
                    let digit = (byte as char).to_digit(16)?;
                    digits = digits.checked_mul(16)?.checked_add(digit)?;
                    count = count.checked_add(1)?;
                    index = index.checked_add(1)?;
                }
                _ => return None,
            }
        }
    }

    let first = parse_u4(bytes, after_prefix)?;
    let after_first = after_prefix.checked_add(4)?;
    if (0xD800..=0xDBFF).contains(&first) {
        let next_prefix_end = after_first.checked_add(2)?;
        if bytes.get(after_first..next_prefix_end) == Some(b"\\u") {
            let second_start = after_first.checked_add(2)?;
            if let Some(second) = parse_u4(bytes, second_start)
                && (0xDC00..=0xDFFF).contains(&second)
            {
                let scalar =
                    0x10000 + ((u32::from(first) - 0xD800) << 10) + (u32::from(second) - 0xDC00);
                return Some((char::from_u32(scalar)?, second_start.checked_add(4)?));
            }
        }
        return None;
    }
    if (0xDC00..=0xDFFF).contains(&first) {
        return None;
    }
    Some((char::from_u32(u32::from(first))?, after_first))
}

fn parse_u4(bytes: &[u8], start: usize) -> Option<u16> {
    let digits = bytes.get(start..start.checked_add(4)?)?;
    let mut value = 0_u16;
    for byte in digits {
        let digit = match byte {
            b'0'..=b'9' => byte - b'0',
            b'a'..=b'f' => byte - b'a' + 10,
            b'A'..=b'F' => byte - b'A' + 10,
            _ => return None,
        };
        value = value.checked_mul(16)?.checked_add(u16::from(digit))?;
    }
    Some(value)
}

// ── DD-49 data tables ──────────────────────────────────────────────────

const MACRO_OVERRIDES: &[(&str, &str)] = &[("->", "threadFirst"), ("->>", "threadLast")];

const PREDICATE_PREFIXES: &[&str] = &[
    "is-", "has-", "can-", "should-", "will-", "does-", "was-", "had-",
];

const MULTI_CHAR_ESCAPES: &[(&str, &str)] = &[("->", "To"), ("<-", "From")];

const PUNCTUATION_TABLE: &[(char, &str)] = &[
    ('?', "QMARK"),
    ('!', "BANG"),
    ('*', "STAR"),
    ('+', "PLUS"),
    ('=', "EQ"),
    ('<', "LT"),
    ('>', "GT"),
    ('&', "AMP"),
    ('%', "PCT"),
    // `$` is a valid JS identifier character — not escaped (DD-49 refinement)
    ('/', "SLASH"),
];

// ── Core transformation ────────────────────────────────────────────────

/// Map a lykn identifier to a valid JavaScript identifier per DD-49.
///
/// Implements the composite rule:
/// - Rule 1: trailing `?` → `is`-prefix predicate naming
/// - Rule 2: trailing `!` → strip
/// - Rule 3: embedded/leading punctuation → uppercase abbreviations
/// - Rule 4: macro-name override registry (whole-identifier match)
/// - Rule 5: doubled trailing punctuation
///
/// Hyphen-only identifiers (the previous `to_camel_case` behaviour) are a
/// subset: interior `-` → capitalise next char, leading/trailing `-` → `_`.
pub fn to_js_identifier(s: &str) -> String {
    // Step 1: macro-override check (whole-identifier match)
    for &(form, js_name) in MACRO_OVERRIDES {
        if s == form {
            return js_name.to_string();
        }
    }

    // Step 2: trailing-rule phase
    let chars: Vec<char> = s.chars().collect();
    let len = chars.len();
    if len == 0 {
        return String::new();
    }

    let mut predicate_mode = false;
    let last = chars[len - 1];
    let working: Vec<char> = if last == '?' && len > 1 {
        predicate_mode = true;
        chars[..len - 1].to_vec()
    } else if last == '!' && len > 1 {
        chars[..len - 1].to_vec()
    } else {
        chars.clone()
    };

    // Step 3: prefix-detection (if predicate mode, may prepend "is-")
    let working_str: String = if predicate_mode {
        let remainder: String = working.iter().collect();
        let has_prefix = PREDICATE_PREFIXES.iter().any(|p| remainder.starts_with(p));
        if has_prefix {
            remainder
        } else {
            format!("is-{remainder}")
        }
    } else {
        working.iter().collect()
    };

    // Step 4: walk phase (left-to-right with cap_next flag)
    let walk_chars: Vec<char> = working_str.chars().collect();
    let walk_len = walk_chars.len();
    let mut out = String::with_capacity(walk_len + 8);
    let mut i = 0;
    let mut cap_next = false;

    // Count leading hyphens → underscores
    while i < walk_len && walk_chars[i] == '-' {
        out.push('_');
        i += 1;
    }

    if i == walk_len {
        return out;
    }

    // Count trailing hyphens
    let mut trailing_hyphens = 0;
    {
        let mut j = walk_len;
        while j > i && walk_chars[j - 1] == '-' {
            trailing_hyphens += 1;
            j -= 1;
        }
    }
    let body_end = walk_len - trailing_hyphens;

    while i < body_end {
        // Try multi-char escapes (longest first — `->` is 2 chars)
        let remaining: String = walk_chars[i..body_end].iter().collect();
        let mut matched_multi = false;
        for &(pattern, abbrev) in MULTI_CHAR_ESCAPES {
            if remaining.starts_with(pattern) {
                for ch in abbrev.chars() {
                    if cap_next {
                        out.extend(ch.to_uppercase());
                        cap_next = false;
                    } else {
                        out.push(ch);
                    }
                }
                cap_next = true;
                i += pattern.len();
                matched_multi = true;
                break;
            }
        }
        if matched_multi {
            continue;
        }

        let ch = walk_chars[i];

        // Try single-char punctuation table
        if let Some(&(_, abbrev)) = PUNCTUATION_TABLE.iter().find(|&&(c, _)| c == ch) {
            for ac in abbrev.chars() {
                if cap_next {
                    out.extend(ac.to_uppercase());
                    cap_next = false;
                } else {
                    out.push(ac);
                }
            }
            cap_next = true;
            i += 1;
            continue;
        }

        // Hyphen → set cap_next
        if ch == '-' {
            cap_next = true;
            i += 1;
            continue;
        }

        // Alphanumeric
        if cap_next {
            out.push(ch.to_ascii_uppercase());
            cap_next = false;
        } else {
            out.push(ch);
        }
        i += 1;
    }

    for _ in 0..trailing_hyphens {
        out.push('_');
    }

    out
}

/// Convert a lisp-case identifier to camelCase.
#[deprecated(note = "use to_js_identifier — DD-49 supersedes this function")]
pub fn to_camel_case(s: &str) -> String {
    to_js_identifier(s)
}

/// Emit a single atom value to the writer.
///
/// Handles keyword literals (`true`, `false`, `null`, `undefined`, `this`,
/// `super`), colon-separated member chains, and plain identifiers.
pub fn emit_atom(w: &mut JsWriter, value: &str) {
    match value {
        "true" | "false" | "null" | "undefined" | "this" | "super" => w.write(value),
        _ if value.contains(':') => emit_member_chain(w, value),
        #[allow(deprecated)]
        _ => w.write(&to_js_identifier(value)),
    }
}

/// Emit a colon-separated member chain.
///
/// `console:log` → `console.log`
/// `this:-name` → `this.#_name`
/// `Math:PI` → `Math.PI`
fn emit_member_chain(w: &mut JsWriter, value: &str) {
    let segments: Vec<&str> = value.split(':').collect();

    // First segment.
    let first = segments[0];
    match first {
        "this" => w.write("this"),
        "super" => w.write("super"),
        _ => w.write(&to_js_identifier(first)),
    }

    // Subsequent segments.
    for &seg in &segments[1..] {
        if let Some(rest) = seg.strip_prefix('-') {
            // Private field: `-name` → `.#_name`
            w.write(".#_");
            w.write(&to_js_identifier(rest));
        } else {
            w.write(".");
            w.write(&to_js_identifier(seg));
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    // ── to_camel_case ──────────────────────────────────────────────

    // ── Regression: existing camelCase behaviour preserved ──────

    #[test]
    fn camel_no_hyphens() {
        assert_eq!(to_js_identifier("hello"), "hello");
    }

    #[test]
    fn camel_simple() {
        assert_eq!(to_js_identifier("my-function"), "myFunction");
    }

    #[test]
    fn camel_multiple_segments() {
        assert_eq!(to_js_identifier("a-b-c"), "aBC");
    }

    #[test]
    fn camel_leading_hyphen() {
        assert_eq!(to_js_identifier("-private"), "_private");
    }

    #[test]
    fn camel_trailing_hyphen() {
        assert_eq!(to_js_identifier("trailing-"), "trailing_");
    }

    #[test]
    fn camel_double_leading() {
        assert_eq!(to_js_identifier("--double"), "__double");
    }

    #[test]
    fn camel_all_hyphens() {
        assert_eq!(to_js_identifier("---"), "___");
    }

    #[test]
    fn camel_single_char() {
        assert_eq!(to_js_identifier("x"), "x");
    }

    #[test]
    fn camel_get_user() {
        assert_eq!(to_js_identifier("get-user"), "getUser");
    }

    // ── Rule 1: trailing ? → predicate naming ────────────────

    #[test]
    fn rule1_valid_question() {
        assert_eq!(to_js_identifier("valid?"), "isValid");
    }

    #[test]
    fn rule1_empty_question() {
        assert_eq!(to_js_identifier("empty?"), "isEmpty");
    }

    #[test]
    fn rule1_even_question() {
        assert_eq!(to_js_identifier("even?"), "isEven");
    }

    #[test]
    fn rule1_has_items_question() {
        assert_eq!(to_js_identifier("has-items?"), "hasItems");
    }

    #[test]
    fn rule1_is_void_question() {
        assert_eq!(to_js_identifier("is-void?"), "isVoid");
    }

    #[test]
    fn rule1_can_edit_question() {
        assert_eq!(to_js_identifier("can-edit?"), "canEdit");
    }

    #[test]
    fn rule1_should_retry_question() {
        assert_eq!(to_js_identifier("should-retry?"), "shouldRetry");
    }

    #[test]
    fn rule1_will_succeed_question() {
        assert_eq!(to_js_identifier("will-succeed?"), "willSucceed");
    }

    #[test]
    fn rule1_does_match_question() {
        assert_eq!(to_js_identifier("does-match?"), "doesMatch");
    }

    #[test]
    fn rule1_was_modified_question() {
        assert_eq!(to_js_identifier("was-modified?"), "wasModified");
    }

    #[test]
    fn rule1_had_error_question() {
        assert_eq!(to_js_identifier("had-error?"), "hadError");
    }

    // ── Rule 2: trailing ! → strip ───────────────────────────

    #[test]
    fn rule2_swap_bang() {
        assert_eq!(to_js_identifier("swap!"), "swap");
    }

    #[test]
    fn rule2_reset_bang() {
        assert_eq!(to_js_identifier("reset!"), "reset");
    }

    #[test]
    fn rule2_set_bang() {
        assert_eq!(to_js_identifier("set!"), "set");
    }

    // ── Rule 3: embedded punctuation → abbreviation ──────────

    #[test]
    fn rule3_star_globals_star() {
        assert_eq!(to_js_identifier("*globals*"), "STARGlobalsSTAR");
    }

    #[test]
    fn rule3_string_arrow_json() {
        assert_eq!(to_js_identifier("string->json"), "stringToJson");
    }

    #[test]
    fn rule3_json_from_string() {
        assert_eq!(to_js_identifier("json<-string"), "jsonFromString");
    }

    #[test]
    fn rule3_embedded_qmark() {
        assert_eq!(to_js_identifier("func?-thing"), "funcQMARKThing");
    }

    #[test]
    fn rule3_plus_constant_plus() {
        assert_eq!(to_js_identifier("+constant+"), "PLUSConstantPLUS");
    }

    #[test]
    fn rule3_eq_prefix() {
        assert_eq!(to_js_identifier("=val"), "EQVal");
    }

    #[test]
    fn rule3_amp_rest() {
        assert_eq!(to_js_identifier("&rest"), "AMPRest");
    }

    #[test]
    fn rule3_pct_scratch() {
        assert_eq!(to_js_identifier("%scratch"), "PCTScratch");
    }

    #[test]
    fn rule3_dollar_ref_passthrough() {
        // `$` is a valid JS identifier char — passes through unchanged
        assert_eq!(to_js_identifier("$ref"), "$ref");
    }

    #[test]
    fn rule3_slash_embedded() {
        assert_eq!(to_js_identifier("path/to"), "pathSLASHTo");
    }

    // ── Rule 4: macro-name overrides ─────────────────────────

    #[test]
    fn rule4_thread_first() {
        assert_eq!(to_js_identifier("->"), "threadFirst");
    }

    #[test]
    fn rule4_thread_last() {
        assert_eq!(to_js_identifier("->>"), "threadLast");
    }

    // ── Rule 5: doubled trailing punctuation ─────────────────

    #[test]
    fn rule5_valid_double_qmark() {
        assert_eq!(to_js_identifier("valid??"), "isValidQMARK");
    }

    #[test]
    fn rule5_swap_double_bang() {
        assert_eq!(to_js_identifier("swap!!"), "swapBANG");
    }

    // ── Edge cases: degenerate identifiers ───────────────────

    #[test]
    fn edge_lone_qmark() {
        assert_eq!(to_js_identifier("?"), "QMARK");
    }

    #[test]
    fn edge_lone_bang() {
        assert_eq!(to_js_identifier("!"), "BANG");
    }

    #[test]
    fn edge_lone_star() {
        assert_eq!(to_js_identifier("*"), "STAR");
    }

    #[test]
    fn edge_single_hyphen() {
        assert_eq!(to_js_identifier("-"), "_");
    }

    #[test]
    fn edge_double_hyphen() {
        assert_eq!(to_js_identifier("--"), "__");
    }

    #[test]
    fn edge_empty_string() {
        assert_eq!(to_js_identifier(""), "");
    }

    // ── emit_atom ──────────────────────────────────────────────────

    fn atom_output(value: &str) -> String {
        let mut w = JsWriter::new();
        emit_atom(&mut w, value);
        w.finish()
    }

    #[test]
    fn test_emit_atom_true() {
        assert_eq!(atom_output("true"), "true");
    }

    #[test]
    fn test_emit_atom_false() {
        assert_eq!(atom_output("false"), "false");
    }

    #[test]
    fn test_emit_atom_null() {
        assert_eq!(atom_output("null"), "null");
    }

    #[test]
    fn test_emit_atom_undefined() {
        assert_eq!(atom_output("undefined"), "undefined");
    }

    #[test]
    fn test_emit_atom_this() {
        assert_eq!(atom_output("this"), "this");
    }

    #[test]
    fn test_emit_atom_super() {
        assert_eq!(atom_output("super"), "super");
    }

    #[test]
    fn test_emit_atom_plain_ident() {
        assert_eq!(atom_output("my-var"), "myVar");
    }

    // ── colon syntax ───────────────────────────────────────────────

    #[test]
    fn test_colon_console_log() {
        assert_eq!(atom_output("console:log"), "console.log");
    }

    #[test]
    fn test_colon_this_private() {
        assert_eq!(atom_output("this:-name"), "this.#_name");
    }

    #[test]
    fn test_colon_math_pi() {
        assert_eq!(atom_output("Math:PI"), "Math.PI");
    }

    #[test]
    fn test_colon_deep_chain() {
        assert_eq!(atom_output("a:b:c"), "a.b.c");
    }

    #[test]
    fn test_colon_with_camel_case_segments() {
        assert_eq!(atom_output("my-obj:get-name"), "myObj.getName");
    }

    #[test]
    fn physical_atom_census_keeps_normalized_runs_and_computed_reads() {
        let mut occupied = HashSet::new();
        reserve_emitted_atom_names("foo?bar", &mut occupied);
        reserve_emitted_atom_names("this:-private-name", &mut occupied);
        reserve_emitted_atom_names("box[t__gensym0]", &mut occupied);

        assert!(occupied.contains("fooQMARKBar"));
        assert!(occupied.contains("this"));
        assert!(occupied.contains("_privateName"));
        assert!(occupied.contains("box"));
        assert!(occupied.contains("t__gensym0"));
        assert!(occupied.contains("box[t__gensym0]"));
    }

    #[test]
    fn physical_atom_census_decodes_static_unicode_escapes_before_scanning() {
        let mut occupied = HashSet::new();
        reserve_emitted_atom_names(r"await\u005f\u005fgensym0.child", &mut occupied);
        reserve_emitted_atom_names(r"await\u{5f}\u{5f}gensym1.child", &mut occupied);
        reserve_emitted_atom_names(r"math\uD835\uDC9C.child", &mut occupied);
        reserve_emitted_atom_names(r"pair\uD835\uDC9C", &mut occupied);

        assert!(occupied.contains("await__gensym0"));
        assert!(occupied.contains("await__gensym1"));
        assert!(occupied.contains("math𝒜"));
        assert!(occupied.contains("pair𝒜"));
        assert_eq!(
            emitted_identifier_key(r"await\u005f\u005fgensym0"),
            "await__gensym0"
        );
        assert_eq!(emitted_text_identifier_key(r"foo\u002dbar"), "foo-bar");
    }

    #[test]
    fn malformed_unicode_escapes_remain_safe_and_non_ascii_runs_are_conservative() {
        let mut occupied = HashSet::new();
        reserve_emitted_atom_names("left\u{feff}界right", &mut occupied);
        reserve_emitted_atom_names("before\u{2003}after", &mut occupied);
        reserve_emitted_atom_names(r"prefix\u{12xz", &mut occupied);
        reserve_emitted_atom_names(r"incomplete\u12", &mut occupied);
        reserve_emitted_atom_names(r"lone\uD835X", &mut occupied);
        reserve_emitted_atom_names(r"limit\u{110000}end", &mut occupied);

        assert!(occupied.contains("left"));
        assert!(occupied.contains("界right"));
        assert!(occupied.contains("before"));
        assert!(occupied.contains("after"));
        assert!(occupied.contains("prefix"));
        assert!(occupied.contains("12xz"));
        assert!(occupied.contains("incomplete"));
        assert!(occupied.contains("u12"));
        assert!(occupied.contains("lone"));
        assert!(occupied.contains("uD835X"));
        assert_eq!(emitted_text_identifier_key(r"\u{110000}"), r"\u{110000}");
    }

    #[test]
    fn generated_name_allocator_uses_decoded_physical_candidate_keys() {
        let mut first = GeneratedNameAllocator::new();
        first.reserve_expr(&SExpr::atom("await__gensym0", Default::default()));
        assert_eq!(
            first.allocate(r"await\u005f_gensym0").unwrap(),
            r"await\u005f_gensym0__lyknGenerated0"
        );

        let mut second = GeneratedNameAllocator::new();
        let escaped = r"await\u005f_gensym0";
        assert_eq!(second.allocate(escaped).unwrap(), escaped);
        assert_eq!(
            second.allocate("await__gensym0").unwrap(),
            "await__gensym0__lyknGenerated0"
        );
    }
}
