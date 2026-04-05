//! lykn formatter
//!
//! Pretty-prints s-expressions with consistent indentation.
//! Follows common Lisp/Scheme formatting conventions.

use crate::reader::SExpr;

pub fn format_exprs(exprs: &[SExpr], indent: usize) -> String {
    let mut out = String::new();
    for (i, expr) in exprs.iter().enumerate() {
        out.push_str(&format_expr(expr, indent));
        if i + 1 < exprs.len() {
            out.push('\n');
            // Add blank line between top-level forms
            if indent == 0 {
                out.push('\n');
            }
        }
    }
    out.push('\n');
    out
}

fn format_expr(expr: &SExpr, indent: usize) -> String {
    match expr {
        SExpr::Atom(s) => s.clone(),
        SExpr::Str(s) => format!("\"{}\"", escape_string(s)),
        SExpr::Num(n) => {
            if *n == (*n as i64) as f64 {
                format!("{}", *n as i64)
            } else {
                format!("{}", n)
            }
        }
        SExpr::List(values) => format_list(values, indent),
    }
}

fn format_list(values: &[SExpr], indent: usize) -> String {
    if values.is_empty() {
        return "()".to_string();
    }

    // Try single-line first
    let single = format_single_line(values);
    if single.len() + indent <= 80 && !single.contains('\n') {
        return format!("({})", single);
    }

    // Multi-line: head on first line, rest indented
    let head = format_expr(&values[0], 0);
    let child_indent = indent + 2;
    let child_prefix = " ".repeat(child_indent);

    let mut out = format!("({}", head);
    for val in &values[1..] {
        let formatted = format_expr(val, child_indent);
        out.push('\n');
        out.push_str(&child_prefix);
        out.push_str(&formatted);
    }
    out.push(')');
    out
}

fn format_single_line(values: &[SExpr]) -> String {
    values
        .iter()
        .map(|v| format_expr(v, 0))
        .collect::<Vec<_>>()
        .join(" ")
}

fn escape_string(s: &str) -> String {
    s.replace('\\', "\\\\")
        .replace('"', "\\\"")
        .replace('\n', "\\n")
        .replace('\t', "\\t")
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::reader::SExpr;

    #[test]
    fn format_single_atom() {
        let exprs = vec![SExpr::Atom("hello".into())];
        assert_eq!(format_exprs(&exprs, 0), "hello\n");
    }

    #[test]
    fn format_integer_number() {
        let exprs = vec![SExpr::Num(42.0)];
        assert_eq!(format_exprs(&exprs, 0), "42\n");
    }

    #[test]
    fn format_float_number() {
        let exprs = vec![SExpr::Num(3.14)];
        assert_eq!(format_exprs(&exprs, 0), "3.14\n");
    }

    #[test]
    fn format_string_simple() {
        let exprs = vec![SExpr::Str("hello".into())];
        assert_eq!(format_exprs(&exprs, 0), "\"hello\"\n");
    }

    #[test]
    fn format_string_with_escapes() {
        let exprs = vec![SExpr::Str("a\nb\t\"c\\".into())];
        assert_eq!(format_exprs(&exprs, 0), "\"a\\nb\\t\\\"c\\\\\"\n");
    }

    #[test]
    fn format_empty_list() {
        let exprs = vec![SExpr::List(vec![])];
        assert_eq!(format_exprs(&exprs, 0), "()\n");
    }

    #[test]
    fn format_short_list() {
        let exprs = vec![SExpr::List(vec![
            SExpr::Atom("+".into()),
            SExpr::Num(1.0),
            SExpr::Num(2.0),
        ])];
        assert_eq!(format_exprs(&exprs, 0), "(+ 1 2)\n");
    }

    #[test]
    fn format_long_list_wraps() {
        // Build a list that exceeds 80 chars
        let mut vals = vec![SExpr::Atom("function-with-a-very-long-name".into())];
        for _ in 0..5 {
            vals.push(SExpr::Str("some-really-long-argument-value".into()));
        }
        let exprs = vec![SExpr::List(vals)];
        let result = format_exprs(&exprs, 0);
        assert!(result.contains('\n'));
        assert!(result.starts_with("(function-with-a-very-long-name"));
    }

    #[test]
    fn format_multiple_top_level_exprs() {
        let exprs = vec![SExpr::Atom("a".into()), SExpr::Atom("b".into())];
        let result = format_exprs(&exprs, 0);
        // Top-level forms separated by blank line
        assert_eq!(result, "a\n\nb\n");
    }

    #[test]
    fn format_nested_list() {
        let inner = SExpr::List(vec![
            SExpr::Atom("+".into()),
            SExpr::Num(1.0),
            SExpr::Num(2.0),
        ]);
        let outer = SExpr::List(vec![
            SExpr::Atom("define".into()),
            SExpr::Atom("x".into()),
            inner,
        ]);
        let result = format_exprs(&vec![outer], 0);
        assert_eq!(result, "(define x (+ 1 2))\n");
    }

    #[test]
    fn format_indented_children() {
        let exprs = vec![SExpr::List(vec![
            SExpr::Atom("define".into()),
            SExpr::Atom("x".into()),
        ])];
        // With indent > 0, shouldn't add blank line separator
        let result = format_exprs(&exprs, 4);
        assert_eq!(result, "(define x)\n");
    }

    #[test]
    fn escape_string_empty() {
        assert_eq!(escape_string(""), "");
    }

    #[test]
    fn escape_string_no_special() {
        assert_eq!(escape_string("hello"), "hello");
    }

    #[test]
    fn escape_string_all_special() {
        assert_eq!(escape_string("\\\"\n\t"), "\\\\\\\"\\n\\t");
    }
}
