//! Identifier transformation for JavaScript output.
//!
//! Provides lisp-case to camelCase conversion and colon-separated member chain
//! emission (e.g. `console:log` → `console.log`).

use super::format::JsWriter;

/// Convert a lisp-case identifier to camelCase.
///
/// Rules:
/// - Leading hyphens become underscores (`-private` → `_private`).
/// - Trailing hyphens become underscores (`trailing-` → `trailing_`).
/// - Interior hyphens capitalise the following character (`my-func` → `myFunc`).
/// - No hyphens → returned unchanged.
pub fn to_camel_case(s: &str) -> String {
    if !s.contains('-') {
        return s.to_string();
    }

    let chars: Vec<char> = s.chars().collect();
    let len = chars.len();
    let mut out = String::with_capacity(len);

    // Count leading hyphens.
    let mut i = 0;
    while i < len && chars[i] == '-' {
        out.push('_');
        i += 1;
    }

    // If the entire string is hyphens, we are done.
    if i == len {
        return out;
    }

    // Count trailing hyphens (from the end, not overlapping leading).
    let mut trailing = 0;
    {
        let mut j = len;
        while j > i && chars[j - 1] == '-' {
            trailing += 1;
            j -= 1;
        }
    }

    let body_end = len - trailing;
    let mut cap_next = false;

    while i < body_end {
        let ch = chars[i];
        if ch == '-' {
            cap_next = true;
        } else if cap_next {
            out.push(ch.to_ascii_uppercase());
            cap_next = false;
        } else {
            out.push(ch);
        }
        i += 1;
    }

    for _ in 0..trailing {
        out.push('_');
    }

    out
}

/// Emit a single atom value to the writer.
///
/// Handles keyword literals (`true`, `false`, `null`, `undefined`, `this`,
/// `super`), colon-separated member chains, and plain identifiers.
pub fn emit_atom(w: &mut JsWriter, value: &str) {
    match value {
        "true" | "false" | "null" | "undefined" | "this" | "super" => w.write(value),
        _ if value.contains(':') => emit_member_chain(w, value),
        _ => w.write(&to_camel_case(value)),
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
        _ => w.write(&to_camel_case(first)),
    }

    // Subsequent segments.
    for &seg in &segments[1..] {
        if let Some(rest) = seg.strip_prefix('-') {
            // Private field: `-name` → `.#_name`
            w.write(".#_");
            w.write(&to_camel_case(rest));
        } else {
            w.write(".");
            w.write(&to_camel_case(seg));
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    // ── to_camel_case ──────────────────────────────────────────────

    #[test]
    fn test_to_camel_case_no_hyphens() {
        assert_eq!(to_camel_case("hello"), "hello");
    }

    #[test]
    fn test_to_camel_case_simple() {
        assert_eq!(to_camel_case("my-function"), "myFunction");
    }

    #[test]
    fn test_to_camel_case_multiple_segments() {
        assert_eq!(to_camel_case("a-b-c"), "aBC");
    }

    #[test]
    fn test_to_camel_case_leading_hyphen() {
        assert_eq!(to_camel_case("-private"), "_private");
    }

    #[test]
    fn test_to_camel_case_trailing_hyphen() {
        assert_eq!(to_camel_case("trailing-"), "trailing_");
    }

    #[test]
    fn test_to_camel_case_double_leading() {
        assert_eq!(to_camel_case("--double"), "__double");
    }

    #[test]
    fn test_to_camel_case_all_hyphens() {
        assert_eq!(to_camel_case("---"), "___");
    }

    #[test]
    fn test_to_camel_case_single_char() {
        assert_eq!(to_camel_case("x"), "x");
    }

    #[test]
    fn test_to_camel_case_get_user() {
        assert_eq!(to_camel_case("get-user"), "getUser");
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
