use crate::ast::sexpr::SExpr;
use crate::diagnostics::serializer::serialize_sexpr;
use crate::reader::source_loc::Span;

use super::forms::{atom, list, str_lit};

/// Emit a pre-condition check.
///
/// Produces:
/// ```text
/// (if (! <pre-expr>) (throw (new Error "funcName: pre-condition failed: <sexpr> — caller blame")))
/// ```
pub fn emit_pre_check(func_name: &str, pre_expr: &SExpr, _span: Span) -> SExpr {
    let source = serialize_sexpr(pre_expr);
    let message = format!("{func_name}: pre-condition failed: {source} \u{2014} caller blame");
    list(vec![
        atom("if"),
        list(vec![atom("!"), pre_expr.clone()]),
        list(vec![
            atom("throw"),
            list(vec![atom("new"), atom("Error"), str_lit(&message)]),
        ]),
    ])
}

/// Emit a post-condition check.
///
/// Replaces `~` atoms in the post expression with the result variable name,
/// then produces:
/// ```text
/// (if (! <post-expr>) (throw (new Error "funcName: post-condition failed: <sexpr> — callee blame")))
/// ```
pub fn emit_post_check(func_name: &str, post_expr: &SExpr, result_var: &str, _span: Span) -> SExpr {
    let source = serialize_sexpr(post_expr);
    let replaced = replace_tilde(post_expr, result_var);
    let message = format!("{func_name}: post-condition failed: {source} \u{2014} callee blame");
    list(vec![
        atom("if"),
        list(vec![atom("!"), replaced]),
        list(vec![
            atom("throw"),
            list(vec![atom("new"), atom("Error"), str_lit(&message)]),
        ]),
    ])
}

/// Recursively replace `~` atoms with the given variable name.
fn replace_tilde(expr: &SExpr, var: &str) -> SExpr {
    match expr {
        SExpr::Atom { value, span } if value == "~" => SExpr::Atom {
            value: var.to_string(),
            span: *span,
        },
        SExpr::List { values, span } => SExpr::List {
            values: values.iter().map(|v| replace_tilde(v, var)).collect(),
            span: *span,
        },
        SExpr::Cons { car, cdr, span } => SExpr::Cons {
            car: Box::new(replace_tilde(car, var)),
            cdr: Box::new(replace_tilde(cdr, var)),
            span: *span,
        },
        other => other.clone(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn num(n: f64) -> SExpr {
        SExpr::Number {
            value: n,
            span: Span::default(),
        }
    }

    #[test]
    fn test_pre_check_structure() {
        let pre = list(vec![atom(">"), atom("x"), num(0.0)]);
        let result = emit_pre_check("foo", &pre, Span::default());

        if let SExpr::List { values, .. } = &result {
            assert_eq!(values[0].as_atom(), Some("if"));
            // (! <pre>)
            if let SExpr::List { values: neg, .. } = &values[1] {
                assert_eq!(neg[0].as_atom(), Some("!"));
            } else {
                panic!("expected negation");
            }
            // (throw (new Error "..."))
            if let SExpr::List { values: throw, .. } = &values[2] {
                assert_eq!(throw[0].as_atom(), Some("throw"));
            } else {
                panic!("expected throw");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_pre_check_message_contains_source() {
        let pre = list(vec![atom(">"), atom("x"), num(0.0)]);
        let result = emit_pre_check("foo", &pre, Span::default());

        // Navigate to the error message string
        if let SExpr::List { values, .. } = &result {
            if let SExpr::List { values: throw, .. } = &values[2] {
                if let SExpr::List { values: new_v, .. } = &throw[1] {
                    if let SExpr::String { value: msg, .. } = &new_v[2] {
                        assert!(msg.contains("foo"));
                        assert!(msg.contains("pre-condition failed"));
                        assert!(msg.contains("(> x 0)"));
                        assert!(msg.contains("caller blame"));
                    } else {
                        panic!("expected string message");
                    }
                } else {
                    panic!("expected new expression");
                }
            } else {
                panic!("expected throw expression");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_post_check_replaces_tilde() {
        let post = list(vec![atom(">"), atom("~"), num(0.0)]);
        let result = emit_post_check("bar", &post, "_result", Span::default());

        if let SExpr::List { values, .. } = &result {
            // (! <replaced-post>)
            if let SExpr::List { values: neg, .. } = &values[1] {
                // neg[1] should be the replaced expression
                if let SExpr::List { values: inner, .. } = &neg[1] {
                    assert_eq!(inner[1].as_atom(), Some("_result"));
                } else {
                    panic!("expected replaced inner list");
                }
            } else {
                panic!("expected negation");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_post_check_message_contains_original_source() {
        let post = list(vec![atom(">"), atom("~"), num(0.0)]);
        let result = emit_post_check("bar", &post, "_result", Span::default());

        if let SExpr::List { values, .. } = &result {
            if let SExpr::List { values: throw, .. } = &values[2] {
                if let SExpr::List { values: new_v, .. } = &throw[1] {
                    if let SExpr::String { value: msg, .. } = &new_v[2] {
                        assert!(msg.contains("bar"));
                        assert!(msg.contains("post-condition failed"));
                        // Source should show ~ not the replacement
                        assert!(msg.contains("~"));
                        assert!(msg.contains("callee blame"));
                    } else {
                        panic!("expected string message");
                    }
                } else {
                    panic!("expected new expression");
                }
            } else {
                panic!("expected throw expression");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_replace_tilde_nested() {
        let expr = list(vec![
            atom("+"),
            atom("~"),
            list(vec![atom("*"), atom("~"), num(2.0)]),
        ]);
        let replaced = replace_tilde(&expr, "r");
        if let SExpr::List { values, .. } = &replaced {
            assert_eq!(values[1].as_atom(), Some("r"));
            if let SExpr::List { values: inner, .. } = &values[2] {
                assert_eq!(inner[1].as_atom(), Some("r"));
            } else {
                panic!("expected inner list");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_replace_tilde_leaves_non_tilde_atoms() {
        let expr = list(vec![atom("x"), atom("~"), atom("y")]);
        let replaced = replace_tilde(&expr, "r");
        if let SExpr::List { values, .. } = &replaced {
            assert_eq!(values[0].as_atom(), Some("x"));
            assert_eq!(values[1].as_atom(), Some("r"));
            assert_eq!(values[2].as_atom(), Some("y"));
        } else {
            panic!("expected list");
        }
    }
}
