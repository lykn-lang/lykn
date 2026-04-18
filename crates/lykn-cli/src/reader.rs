/// lykn s-expression reader
///
/// Parses lykn source text into a tree of SExpr nodes.

#[derive(Debug, Clone, PartialEq)]
pub enum SExpr {
    Atom(String),
    Str(String),
    Num(f64),
    List(Vec<SExpr>),
}

pub fn read(source: &str) -> Vec<SExpr> {
    let chars: Vec<char> = source.chars().collect();
    let mut pos = 0;
    let mut exprs = Vec::new();

    skip_ws(&chars, &mut pos);
    while pos < chars.len() {
        if let Some(expr) = read_expr(&chars, &mut pos) {
            exprs.push(expr);
        }
        skip_ws(&chars, &mut pos);
    }
    exprs
}

fn skip_ws(chars: &[char], pos: &mut usize) {
    while *pos < chars.len() {
        match chars[*pos] {
            ' ' | '\t' | '\n' | '\r' => *pos += 1,
            ';' => {
                while *pos < chars.len() && chars[*pos] != '\n' {
                    *pos += 1;
                }
            }
            _ => break,
        }
    }
}

fn read_expr(chars: &[char], pos: &mut usize) -> Option<SExpr> {
    skip_ws(chars, pos);
    if *pos >= chars.len() {
        return None;
    }

    match chars[*pos] {
        '(' => Some(read_list(chars, pos)),
        '"' => Some(read_string(chars, pos)),
        _ => Some(read_atom_or_num(chars, pos)),
    }
}

fn read_list(chars: &[char], pos: &mut usize) -> SExpr {
    *pos += 1; // skip (
    let mut values = Vec::new();
    skip_ws(chars, pos);
    while *pos < chars.len() && chars[*pos] != ')' {
        if let Some(expr) = read_expr(chars, pos) {
            values.push(expr);
        }
        skip_ws(chars, pos);
    }
    if *pos < chars.len() {
        *pos += 1; // skip )
    }
    SExpr::List(values)
}

fn read_string(chars: &[char], pos: &mut usize) -> SExpr {
    *pos += 1; // skip opening "
    let mut value = String::new();
    while *pos < chars.len() && chars[*pos] != '"' {
        if chars[*pos] == '\\' && *pos + 1 < chars.len() {
            *pos += 1;
            match chars[*pos] {
                'n' => value.push('\n'),
                't' => value.push('\t'),
                '\\' => value.push('\\'),
                '"' => value.push('"'),
                c => value.push(c),
            }
        } else {
            value.push(chars[*pos]);
        }
        *pos += 1;
    }
    if *pos < chars.len() {
        *pos += 1; // skip closing "
    }
    SExpr::Str(value)
}

fn read_atom_or_num(chars: &[char], pos: &mut usize) -> SExpr {
    let mut value = String::new();
    while *pos < chars.len() {
        match chars[*pos] {
            ' ' | '\t' | '\n' | '\r' | '(' | ')' | ';' => break,
            c => {
                value.push(c);
                *pos += 1;
            }
        }
    }

    // Try parsing as number
    if let Ok(n) = value.parse::<f64>() {
        SExpr::Num(n)
    } else {
        SExpr::Atom(value)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_input() {
        assert!(read("").is_empty());
    }

    #[test]
    fn whitespace_only() {
        assert!(read("   \t\n  ").is_empty());
    }

    #[test]
    fn single_atom() {
        let exprs = read("hello");
        assert_eq!(exprs.len(), 1);
        assert!(matches!(&exprs[0], SExpr::Atom(s) if s == "hello"));
    }

    #[test]
    fn integer_number() {
        let exprs = read("42");
        assert_eq!(exprs.len(), 1);
        assert!(matches!(&exprs[0], SExpr::Num(n) if *n == 42.0));
    }

    #[test]
    fn float_number() {
        let exprs = read("3.14");
        assert_eq!(exprs.len(), 1);
        assert!(matches!(&exprs[0], SExpr::Num(n) if (*n - 3.14).abs() < f64::EPSILON));
    }

    #[test]
    fn negative_number() {
        let exprs = read("-7");
        assert_eq!(exprs.len(), 1);
        assert!(matches!(&exprs[0], SExpr::Num(n) if *n == -7.0));
    }

    #[test]
    fn simple_string() {
        let exprs = read("\"hello world\"");
        assert_eq!(exprs.len(), 1);
        assert!(matches!(&exprs[0], SExpr::Str(s) if s == "hello world"));
    }

    #[test]
    fn string_escape_newline() {
        let exprs = read("\"a\\nb\"");
        assert_eq!(exprs.len(), 1);
        assert!(matches!(&exprs[0], SExpr::Str(s) if s == "a\nb"));
    }

    #[test]
    fn string_escape_tab() {
        let exprs = read("\"a\\tb\"");
        assert_eq!(exprs.len(), 1);
        assert!(matches!(&exprs[0], SExpr::Str(s) if s == "a\tb"));
    }

    #[test]
    fn string_escape_backslash() {
        let exprs = read("\"a\\\\b\"");
        assert_eq!(exprs.len(), 1);
        assert!(matches!(&exprs[0], SExpr::Str(s) if s == "a\\b"));
    }

    #[test]
    fn string_escape_quote() {
        let exprs = read("\"a\\\"b\"");
        assert_eq!(exprs.len(), 1);
        assert!(matches!(&exprs[0], SExpr::Str(s) if s == "a\"b"));
    }

    #[test]
    fn string_unknown_escape() {
        let exprs = read("\"a\\xb\"");
        assert_eq!(exprs.len(), 1);
        assert!(matches!(&exprs[0], SExpr::Str(s) if s == "axb"));
    }

    #[test]
    fn simple_list() {
        let exprs = read("(+ 1 2)");
        assert_eq!(exprs.len(), 1);
        match &exprs[0] {
            SExpr::List(vals) => {
                assert_eq!(vals.len(), 3);
                assert!(matches!(&vals[0], SExpr::Atom(s) if s == "+"));
                assert!(matches!(&vals[1], SExpr::Num(n) if *n == 1.0));
                assert!(matches!(&vals[2], SExpr::Num(n) if *n == 2.0));
            }
            _ => panic!("expected list"),
        }
    }

    #[test]
    fn empty_list() {
        let exprs = read("()");
        assert_eq!(exprs.len(), 1);
        match &exprs[0] {
            SExpr::List(vals) => assert!(vals.is_empty()),
            _ => panic!("expected list"),
        }
    }

    #[test]
    fn nested_list() {
        let exprs = read("(define x (+ 1 2))");
        assert_eq!(exprs.len(), 1);
        match &exprs[0] {
            SExpr::List(vals) => {
                assert_eq!(vals.len(), 3);
                assert!(matches!(&vals[2], SExpr::List(_)));
            }
            _ => panic!("expected list"),
        }
    }

    #[test]
    fn multiple_top_level() {
        let exprs = read("a b c");
        assert_eq!(exprs.len(), 3);
    }

    #[test]
    fn line_comment() {
        let exprs = read("; comment\nhello");
        assert_eq!(exprs.len(), 1);
        assert!(matches!(&exprs[0], SExpr::Atom(s) if s == "hello"));
    }

    #[test]
    fn inline_comment() {
        let exprs = read("a ; comment\nb");
        assert_eq!(exprs.len(), 2);
    }

    #[test]
    fn tab_whitespace() {
        let exprs = read("(a\tb)");
        assert_eq!(exprs.len(), 1);
        match &exprs[0] {
            SExpr::List(vals) => assert_eq!(vals.len(), 2),
            _ => panic!("expected list"),
        }
    }

    #[test]
    fn unterminated_string() {
        // Reader just stops at end of input
        let exprs = read("\"unterminated");
        assert_eq!(exprs.len(), 1);
        assert!(matches!(&exprs[0], SExpr::Str(s) if s == "unterminated"));
    }

    #[test]
    fn unterminated_list() {
        // Reader just stops at end of input
        let exprs = read("(a b");
        assert_eq!(exprs.len(), 1);
        match &exprs[0] {
            SExpr::List(vals) => assert_eq!(vals.len(), 2),
            _ => panic!("expected list"),
        }
    }
}
