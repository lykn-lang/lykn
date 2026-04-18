use crate::reader::source_loc::Span;

#[derive(Debug, Clone, PartialEq)]
pub enum SExpr {
    Atom {
        value: String,
        span: Span,
    },
    Keyword {
        value: String,
        span: Span,
    },
    String {
        value: String,
        span: Span,
    },
    Number {
        value: f64,
        span: Span,
    },
    Bool {
        value: bool,
        span: Span,
    },
    Null {
        span: Span,
    },
    List {
        values: Vec<SExpr>,
        span: Span,
    },
    Cons {
        car: Box<SExpr>,
        cdr: Box<SExpr>,
        span: Span,
    },
}

impl std::fmt::Display for SExpr {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            SExpr::Atom { value, .. } => write!(f, "{value}"),
            SExpr::String { value, .. } => write!(f, "\"{value}\""),
            SExpr::Number { value, .. } => write!(f, "{value}"),
            SExpr::Bool { value, .. } => write!(f, "{value}"),
            SExpr::Keyword { value, .. } => write!(f, ":{value}"),
            SExpr::Null { .. } => write!(f, "null"),
            SExpr::List { values, .. } => {
                write!(f, "(")?;
                for (i, v) in values.iter().enumerate() {
                    if i > 0 {
                        write!(f, " ")?;
                    }
                    write!(f, "{v}")?;
                }
                write!(f, ")")
            }
            SExpr::Cons { car, cdr, .. } => write!(f, "({car} . {cdr})"),
        }
    }
}

impl SExpr {
    pub fn span(&self) -> Span {
        match self {
            SExpr::Atom { span, .. }
            | SExpr::Keyword { span, .. }
            | SExpr::String { span, .. }
            | SExpr::Number { span, .. }
            | SExpr::Bool { span, .. }
            | SExpr::Null { span }
            | SExpr::List { span, .. }
            | SExpr::Cons { span, .. } => *span,
        }
    }

    pub fn is_atom(&self) -> bool {
        matches!(self, SExpr::Atom { .. })
    }

    pub fn is_keyword(&self) -> bool {
        matches!(self, SExpr::Keyword { .. })
    }

    pub fn is_list(&self) -> bool {
        matches!(self, SExpr::List { .. })
    }

    pub fn as_atom(&self) -> Option<&str> {
        match self {
            SExpr::Atom { value, .. } => Some(value),
            _ => None,
        }
    }

    pub fn as_keyword(&self) -> Option<&str> {
        match self {
            SExpr::Keyword { value, .. } => Some(value),
            _ => None,
        }
    }

    pub fn as_list(&self) -> Option<&[SExpr]> {
        match self {
            SExpr::List { values, .. } => Some(values),
            _ => None,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::reader::source_loc::Span;

    fn s() -> Span {
        Span::default()
    }

    #[test]
    fn span_returns_correct_span_for_each_variant() {
        let span = Span::new(
            crate::reader::source_loc::SourceLoc { line: 1, column: 2 },
            crate::reader::source_loc::SourceLoc { line: 1, column: 5 },
        );

        assert_eq!(
            SExpr::Atom {
                value: "x".into(),
                span
            }
            .span(),
            span
        );
        assert_eq!(
            SExpr::Keyword {
                value: "k".into(),
                span
            }
            .span(),
            span
        );
        assert_eq!(
            SExpr::String {
                value: "s".into(),
                span
            }
            .span(),
            span
        );
        assert_eq!(SExpr::Number { value: 1.0, span }.span(), span);
        assert_eq!(SExpr::Bool { value: true, span }.span(), span);
        assert_eq!(SExpr::Null { span }.span(), span);
        assert_eq!(
            SExpr::List {
                values: vec![],
                span
            }
            .span(),
            span
        );
        assert_eq!(
            SExpr::Cons {
                car: Box::new(SExpr::Null { span }),
                cdr: Box::new(SExpr::Null { span }),
                span,
            }
            .span(),
            span
        );
    }

    #[test]
    fn is_atom() {
        assert!(
            SExpr::Atom {
                value: "x".into(),
                span: s()
            }
            .is_atom()
        );
        assert!(
            !SExpr::Number {
                value: 1.0,
                span: s()
            }
            .is_atom()
        );
        assert!(
            !SExpr::List {
                values: vec![],
                span: s()
            }
            .is_atom()
        );
    }

    #[test]
    fn is_keyword() {
        assert!(
            SExpr::Keyword {
                value: "k".into(),
                span: s()
            }
            .is_keyword()
        );
        assert!(
            !SExpr::Atom {
                value: "x".into(),
                span: s()
            }
            .is_keyword()
        );
    }

    #[test]
    fn is_list() {
        assert!(
            SExpr::List {
                values: vec![],
                span: s()
            }
            .is_list()
        );
        assert!(
            !SExpr::Atom {
                value: "x".into(),
                span: s()
            }
            .is_list()
        );
    }

    #[test]
    fn as_atom_some() {
        let expr = SExpr::Atom {
            value: "hello".into(),
            span: s(),
        };
        assert_eq!(expr.as_atom(), Some("hello"));
    }

    #[test]
    fn as_atom_none() {
        let expr = SExpr::Number {
            value: 42.0,
            span: s(),
        };
        assert_eq!(expr.as_atom(), None);
    }

    #[test]
    fn as_keyword_some() {
        let expr = SExpr::Keyword {
            value: "name".into(),
            span: s(),
        };
        assert_eq!(expr.as_keyword(), Some("name"));
    }

    #[test]
    fn as_keyword_none() {
        let expr = SExpr::Atom {
            value: "x".into(),
            span: s(),
        };
        assert_eq!(expr.as_keyword(), None);
    }

    #[test]
    fn as_list_some() {
        let inner = vec![SExpr::Atom {
            value: "a".into(),
            span: s(),
        }];
        let expr = SExpr::List {
            values: inner,
            span: s(),
        };
        assert_eq!(expr.as_list().unwrap().len(), 1);
    }

    #[test]
    fn as_list_none() {
        let expr = SExpr::Atom {
            value: "x".into(),
            span: s(),
        };
        assert_eq!(expr.as_list(), None);
    }

    #[test]
    fn as_list_empty() {
        let expr = SExpr::List {
            values: vec![],
            span: s(),
        };
        assert_eq!(expr.as_list().unwrap().len(), 0);
    }
}
