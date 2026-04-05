use serde_json::Value;

use crate::ast::sexpr::SExpr;

/// Convert a kernel `SExpr` to a `serde_json::Value`.
///
/// Each variant is emitted as a typed JSON object that matches the format
/// produced by the JS reader, so the bridge can pass them straight through
/// to the JS compiler without lossy reconstruction.
///
/// Mapping rules:
/// - `Atom`    -> `{"type": "atom",   "value": "..."}`
/// - `Keyword` -> `{"type": "string", "value": "..."}` (keywords compile to string literals)
/// - `String`  -> `{"type": "string", "value": "..."}`
/// - `Number`  -> `{"type": "number", "value": N}`
/// - `Bool`    -> `{"type": "atom",   "value": "true"/"false"}`
/// - `Null`    -> `{"type": "atom",   "value": "null"}`
/// - `List`    -> `{"type": "list",   "values": [...]}`
/// - `Cons`    -> `{"type": "cons",   "car": ..., "cdr": ...}`
pub fn sexpr_to_json(expr: &SExpr) -> Value {
    match expr {
        SExpr::Atom { value, .. } => {
            serde_json::json!({"type": "atom", "value": value})
        }
        SExpr::Keyword { value, .. } => {
            serde_json::json!({"type": "string", "value": value})
        }
        SExpr::String { value, .. } => {
            serde_json::json!({"type": "string", "value": value})
        }
        SExpr::Number { value, .. } => {
            // Emit whole numbers as integers to match JS JSON output
            let num = if value.fract() == 0.0 && value.is_finite() {
                let i = *value as i64;
                Value::Number(i.into())
            } else {
                serde_json::Number::from_f64(*value).map_or(Value::Null, Value::Number)
            };
            serde_json::json!({"type": "number", "value": num})
        }
        SExpr::Bool { value, .. } => {
            let s = if *value { "true" } else { "false" };
            serde_json::json!({"type": "atom", "value": s})
        }
        SExpr::Null { .. } => {
            serde_json::json!({"type": "atom", "value": "null"})
        }
        SExpr::List { values, .. } => {
            let children: Vec<Value> = values.iter().map(sexpr_to_json).collect();
            serde_json::json!({"type": "list", "values": children})
        }
        SExpr::Cons { car, cdr, .. } => {
            serde_json::json!({"type": "cons", "car": sexpr_to_json(car), "cdr": sexpr_to_json(cdr)})
        }
    }
}

/// Serialize a slice of kernel `SExpr` forms to a pretty-printed JSON string.
pub fn emit_module_json(forms: &[SExpr]) -> String {
    let arr: Vec<Value> = forms.iter().map(sexpr_to_json).collect();
    serde_json::to_string_pretty(&arr).expect("JSON serialization should not fail for SExpr")
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::reader::source_loc::Span;

    fn s() -> Span {
        Span::default()
    }

    #[test]
    fn test_atom_to_json() {
        let expr = SExpr::Atom {
            value: "foo".into(),
            span: s(),
        };
        assert_eq!(
            sexpr_to_json(&expr),
            serde_json::json!({"type": "atom", "value": "foo"})
        );
    }

    #[test]
    fn test_keyword_to_json() {
        let expr = SExpr::Keyword {
            value: "name".into(),
            span: s(),
        };
        assert_eq!(
            sexpr_to_json(&expr),
            serde_json::json!({"type": "string", "value": "name"})
        );
    }

    #[test]
    fn test_string_to_json() {
        let expr = SExpr::String {
            value: "hello".into(),
            span: s(),
        };
        assert_eq!(
            sexpr_to_json(&expr),
            serde_json::json!({"type": "string", "value": "hello"})
        );
    }

    #[test]
    fn test_number_to_json() {
        let expr = SExpr::Number {
            value: 42.0,
            span: s(),
        };
        assert_eq!(
            sexpr_to_json(&expr),
            serde_json::json!({"type": "number", "value": 42})
        );
    }

    #[test]
    fn test_bool_to_json() {
        let t = SExpr::Bool {
            value: true,
            span: s(),
        };
        let f = SExpr::Bool {
            value: false,
            span: s(),
        };
        assert_eq!(
            sexpr_to_json(&t),
            serde_json::json!({"type": "atom", "value": "true"})
        );
        assert_eq!(
            sexpr_to_json(&f),
            serde_json::json!({"type": "atom", "value": "false"})
        );
    }

    #[test]
    fn test_null_to_json() {
        let expr = SExpr::Null { span: s() };
        assert_eq!(
            sexpr_to_json(&expr),
            serde_json::json!({"type": "atom", "value": "null"})
        );
    }

    #[test]
    fn test_list_to_json() {
        let expr = SExpr::List {
            values: vec![
                SExpr::Atom {
                    value: "+".into(),
                    span: s(),
                },
                SExpr::Number {
                    value: 1.0,
                    span: s(),
                },
                SExpr::Number {
                    value: 2.0,
                    span: s(),
                },
            ],
            span: s(),
        };
        assert_eq!(
            sexpr_to_json(&expr),
            serde_json::json!({
                "type": "list",
                "values": [
                    {"type": "atom", "value": "+"},
                    {"type": "number", "value": 1},
                    {"type": "number", "value": 2},
                ]
            })
        );
    }

    #[test]
    fn test_cons_to_json() {
        let expr = SExpr::Cons {
            car: Box::new(SExpr::Atom {
                value: "a".into(),
                span: s(),
            }),
            cdr: Box::new(SExpr::Atom {
                value: "b".into(),
                span: s(),
            }),
            span: s(),
        };
        assert_eq!(
            sexpr_to_json(&expr),
            serde_json::json!({
                "type": "cons",
                "car": {"type": "atom", "value": "a"},
                "cdr": {"type": "atom", "value": "b"},
            })
        );
    }

    #[test]
    fn test_emit_module_json() {
        let forms = vec![SExpr::List {
            values: vec![
                SExpr::Atom {
                    value: "const".into(),
                    span: s(),
                },
                SExpr::Atom {
                    value: "x".into(),
                    span: s(),
                },
                SExpr::Number {
                    value: 42.0,
                    span: s(),
                },
            ],
            span: s(),
        }];
        let json_str = emit_module_json(&forms);
        let parsed: serde_json::Value = serde_json::from_str(&json_str).unwrap();
        assert!(parsed.is_array());
        let arr = parsed.as_array().unwrap();
        assert_eq!(arr.len(), 1);
        assert_eq!(
            arr[0],
            serde_json::json!({
                "type": "list",
                "values": [
                    {"type": "atom", "value": "const"},
                    {"type": "atom", "value": "x"},
                    {"type": "number", "value": 42},
                ]
            })
        );
    }

    #[test]
    fn test_nested_list_to_json() {
        let expr = SExpr::List {
            values: vec![
                SExpr::Atom {
                    value: "if".into(),
                    span: s(),
                },
                SExpr::Bool {
                    value: true,
                    span: s(),
                },
                SExpr::List {
                    values: vec![
                        SExpr::Atom {
                            value: "+".into(),
                            span: s(),
                        },
                        SExpr::Number {
                            value: 1.0,
                            span: s(),
                        },
                    ],
                    span: s(),
                },
            ],
            span: s(),
        };
        assert_eq!(
            sexpr_to_json(&expr),
            serde_json::json!({
                "type": "list",
                "values": [
                    {"type": "atom", "value": "if"},
                    {"type": "atom", "value": "true"},
                    {
                        "type": "list",
                        "values": [
                            {"type": "atom", "value": "+"},
                            {"type": "number", "value": 1},
                        ]
                    },
                ]
            })
        );
    }
}
