use crate::reader::source_loc::Span;

/// Name-resolution tag carried *in* an atom (DD-61 §A1, "resolve once").
///
/// Set by the resolver pass (slice06) after expansion; the reader always
/// yields [`NameRes::Unresolved`]. It travels through clones **by value** — no
/// node-identity fragility (the arc10 mark-propagation lesson, solved
/// structurally). The tag never changes emitted JS text (§A4): it only routes
/// *dispatch* decisions via [`SExpr::as_form_head`].
///
/// `#[non_exhaustive]` so an out-of-crate `match` cannot forget a future
/// variant — a resolution-unaware consumer is forced through the wildcard,
/// which is the fall-through-to-call path (§A6).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
#[non_exhaustive]
pub enum NameRes {
    /// Not yet resolved (the reader's output; a name whose meaning is a
    /// macro/form/kernel head until proven bound).
    #[default]
    Unresolved,
    /// A binding **definition** site — the introducing occurrence of a name
    /// (a `bind`/param/loop/pattern/… position). Never dispatches.
    BindingDef,
    /// A **reference** to a lexical binding in scope — a call/use of the bound
    /// name. Dispatch sites treat it as a plain call, never a macro/form.
    BindingRef,
}

/// The payload of an [`SExpr::Atom`] — its name, source span, and resolution
/// tag. **The fields are private to `ast::sexpr`** (DD-61 §A6 by-construction,
/// arc13/slice09): outside this module there is no destructure path to the raw
/// name — the accessors ([`SExpr::as_atom`], [`SExpr::as_form_head`],
/// [`SExpr::span`], [`SExpr::name_res`], [`SExpr::atom_parts`]) are the only
/// door, and `as_form_head` is the only dispatch-purpose one. Construct via
/// [`SExpr::atom`]; retag via [`SExpr::with_name_res`].
#[derive(Debug, Clone)]
pub struct AtomData {
    value: String,
    span: Span,
    /// Resolution tag (DD-61 §A1). Reader → [`NameRes::Unresolved`].
    binding: NameRes,
}

/// `SExpr` derives no `PartialEq` — the `binding` tag is dispatch metadata, not
/// structural identity, so equality is **tag-insensitive** (a manual impl
/// below). This keeps every pre-existing `SExpr` comparison stable across the
/// resolver pass (tension #2, decided at scoping; see the slice06 closing
/// report). All other fields (including `span`) compare exactly as the former
/// derive did.
#[derive(Debug, Clone)]
pub enum SExpr {
    /// A bare name; payload private (see [`AtomData`]).
    Atom(AtomData),
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

/// Tag-insensitive structural equality (tension #2, decided at scoping). The
/// `binding` tag is dispatch metadata, not identity — ignoring it keeps every
/// existing `SExpr` comparison (tests, cache keys, macro fixed-point checks)
/// stable whether or not the resolver has run. Every other field compares
/// exactly as the former `#[derive(PartialEq)]` did (`span` included).
impl PartialEq for SExpr {
    fn eq(&self, other: &Self) -> bool {
        match (self, other) {
            // Tag-insensitive: compare value + span, skip `binding`.
            (SExpr::Atom(a), SExpr::Atom(b)) => a.value == b.value && a.span == b.span,
            (SExpr::Keyword { value: a, span: sa }, SExpr::Keyword { value: b, span: sb }) => {
                a == b && sa == sb
            }
            (SExpr::String { value: a, span: sa }, SExpr::String { value: b, span: sb }) => {
                a == b && sa == sb
            }
            (SExpr::Number { value: a, span: sa }, SExpr::Number { value: b, span: sb }) => {
                a == b && sa == sb
            }
            (SExpr::Bool { value: a, span: sa }, SExpr::Bool { value: b, span: sb }) => {
                a == b && sa == sb
            }
            (SExpr::Null { span: sa }, SExpr::Null { span: sb }) => sa == sb,
            (
                SExpr::List {
                    values: a,
                    span: sa,
                },
                SExpr::List {
                    values: b,
                    span: sb,
                },
            ) => a == b && sa == sb,
            (
                SExpr::Cons {
                    car: ca,
                    cdr: da,
                    span: sa,
                },
                SExpr::Cons {
                    car: cb,
                    cdr: db,
                    span: sb,
                },
            ) => ca == cb && da == db && sa == sb,
            _ => false,
        }
    }
}

impl std::fmt::Display for SExpr {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            SExpr::Atom(a) => write!(f, "{}", a.value),
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
    /// Construct an unresolved atom — the single §A4 invariant point: an atom
    /// enters the tree [`NameRes::Unresolved`] and is tagged only by the
    /// resolver pass. This is the **only** construction door for an atom now
    /// that [`AtomData`]'s fields are private (arc13/slice09).
    pub fn atom(value: impl Into<String>, span: Span) -> Self {
        SExpr::Atom(AtomData {
            value: value.into(),
            span,
            binding: NameRes::Unresolved,
        })
    }

    /// The resolution tag on this node ([`NameRes::Unresolved`] for non-atoms).
    pub fn name_res(&self) -> NameRes {
        match self {
            SExpr::Atom(a) => a.binding,
            _ => NameRes::Unresolved,
        }
    }

    /// Return `self` with its atom tag set to `res` (no-op on non-atoms). Used
    /// by the resolver pass to stamp def/ref tags.
    #[must_use]
    pub fn with_name_res(mut self, res: NameRes) -> Self {
        if let SExpr::Atom(a) = &mut self {
            a.binding = res;
        }
        self
    }

    pub fn span(&self) -> Span {
        match self {
            SExpr::Atom(a) => a.span,
            SExpr::Keyword { span, .. }
            | SExpr::String { span, .. }
            | SExpr::Number { span, .. }
            | SExpr::Bool { span, .. }
            | SExpr::Null { span }
            | SExpr::List { span, .. }
            | SExpr::Cons { span, .. } => *span,
        }
    }

    pub fn is_atom(&self) -> bool {
        matches!(self, SExpr::Atom(_))
    }

    pub fn is_keyword(&self) -> bool {
        matches!(self, SExpr::Keyword { .. })
    }

    pub fn is_list(&self) -> bool {
        matches!(self, SExpr::List { .. })
    }

    /// The raw atom name, **regardless of resolution** — for non-dispatch uses
    /// only (spans, rendering, argument reads, name slots). For *dispatch*
    /// (deciding whether a head is a macro/form/kernel head) use
    /// [`SExpr::as_form_head`], which honours the resolution tag.
    pub fn as_atom(&self) -> Option<&str> {
        match self {
            SExpr::Atom(a) => Some(&a.value),
            _ => None,
        }
    }

    /// The atom's name **and** span together — the multi-field companion to
    /// [`SExpr::as_atom`], for the (common) sites that read both. Reads through
    /// accessors rather than destructuring the payload, so it survives the
    /// atom-payload-privacy restructure (arc13). `None` for non-atoms.
    pub fn atom_parts(&self) -> Option<(&str, Span)> {
        match self {
            SExpr::Atom(a) => Some((&a.value, a.span)),
            _ => None,
        }
    }

    /// The head name **for dispatch purposes** (DD-61 §A6): `Some(name)` only
    /// for an [`NameRes::Unresolved`] atom; `None` for a resolved binding (def
    /// *or* ref) and for every non-atom. A dispatch site that gets `None` falls
    /// through to the plain-call path — the correct semantics for a lexically
    /// bound name, and structurally impossible to misdispatch.
    #[must_use]
    pub fn as_form_head(&self) -> Option<&str> {
        match self {
            // In-module destructure of the private payload is allowed.
            SExpr::Atom(AtomData {
                value,
                binding: NameRes::Unresolved,
                ..
            }) => Some(value),
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

        assert_eq!(SExpr::atom("x", span).span(), span);
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
        assert!(SExpr::atom("x", s()).is_atom());
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
        assert!(!SExpr::atom("x", s()).is_keyword());
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
        assert!(!SExpr::atom("x", s()).is_list());
    }

    #[test]
    fn as_atom_some() {
        let expr = SExpr::atom("hello", s());
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
    fn atom_parts_some() {
        let span = Span::new(
            crate::reader::source_loc::SourceLoc { line: 2, column: 3 },
            crate::reader::source_loc::SourceLoc { line: 2, column: 8 },
        );
        let expr = SExpr::atom("hello", span);
        assert_eq!(expr.atom_parts(), Some(("hello", span)));
    }

    #[test]
    fn atom_parts_none() {
        assert_eq!(
            SExpr::Number {
                value: 1.0,
                span: s()
            }
            .atom_parts(),
            None
        );
        assert_eq!(
            SExpr::List {
                values: vec![],
                span: s()
            }
            .atom_parts(),
            None
        );
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
        let expr = SExpr::atom("x", s());
        assert_eq!(expr.as_keyword(), None);
    }

    #[test]
    fn as_list_some() {
        let inner = vec![SExpr::atom("a", s())];
        let expr = SExpr::List {
            values: inner,
            span: s(),
        };
        assert_eq!(expr.as_list().unwrap().len(), 1);
    }

    #[test]
    fn as_list_none() {
        let expr = SExpr::atom("x", s());
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
