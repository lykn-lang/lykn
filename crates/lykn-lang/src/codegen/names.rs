//! Identifier transformation for JavaScript output.
//!
//! Implements DD-49's composite identifier-mapping rule: lykn surface names
//! (which may contain `?`, `!`, `*`, `->`, and other Lisp-tradition punctuation)
//! are transformed to valid JavaScript identifiers via predicate naming, bang
//! stripping, uppercase abbreviation escapes, and macro-name overrides.
//!
//! Also provides colon-separated member chain emission (`console:log` → `console.log`).

use super::format::JsWriter;

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
}
