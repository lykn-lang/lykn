//! Private expression-use and child-cardinality rules shared by validation and
//! lowering. Grammar-owned slots remain explicit in their phase adapters.

use crate::ast::sexpr::SExpr;
use crate::emitter::context::ExprContext;

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub(crate) enum ExprUse {
    Statement,
    Value,
    Tail,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub(crate) enum ChildRole {
    Value,
    Statement,
    StatementSequence,
    Inherit,
    InheritedSequence,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub(crate) enum BodyPolicy {
    Statements,
    FunctionValueTail,
}

impl ExprUse {
    pub(crate) fn is_consumed(self) -> bool {
        matches!(self, Self::Value | Self::Tail)
    }

    pub(crate) fn to_expr_context(self) -> ExprContext {
        match self {
            Self::Statement => ExprContext::Statement,
            Self::Value => ExprContext::Value,
            Self::Tail => ExprContext::Tail,
        }
    }

    pub(crate) fn from_expr_context(context: ExprContext) -> Self {
        match context {
            ExprContext::Statement => Self::Statement,
            ExprContext::Value => Self::Value,
            ExprContext::Tail => Self::Tail,
        }
    }
}

/// Authoritative flat-kernel child policy. The form's resolution-aware head is
/// the dispatch key; bound heads are ordinary calls with Value children.
pub(crate) fn normalized_child_role(head: &SExpr, argument_index: usize) -> ChildRole {
    let Some(name) = head.as_form_head() else {
        return ChildRole::Value;
    };
    match name {
        "if" => match argument_index {
            0 => ChildRole::Value,
            _ => ChildRole::Inherit,
        },
        "while" | "do-while" => {
            if argument_index == 0 {
                ChildRole::Value
            } else {
                ChildRole::StatementSequence
            }
        }
        "for" => {
            if argument_index < 3 {
                ChildRole::Value
            } else {
                ChildRole::StatementSequence
            }
        }
        "for-of" | "for-in" | "for-await-of" => match argument_index {
            0 => ChildRole::Statement,
            1 => ChildRole::Value,
            _ => ChildRole::StatementSequence,
        },
        "const" | "let" | "var" => match argument_index {
            0 => ChildRole::Statement,
            1 => ChildRole::Value,
            _ => ChildRole::Value,
        },
        "block" => ChildRole::InheritedSequence,
        "label" if argument_index == 0 => ChildRole::Statement,
        "label" => ChildRole::Inherit,
        "try" | "function" | "function*" | "=>" | "break" | "continue" | "debugger" | "import"
        | "export" => ChildRole::Inherit,
        "throw" | "return" | "switch" => ChildRole::Value,
        _ => ChildRole::Value,
    }
}

/// Map a flat role to the phase's effective expression use. An inherited
/// sequence preserves the parent's use for each child; its grammar adapter
/// decides whether a body is consumed or emitted as statements.
pub(crate) fn child_use(role: ChildRole, parent: ExprUse) -> ExprUse {
    match role {
        ChildRole::Value => ExprUse::Value,
        ChildRole::Statement | ChildRole::StatementSequence => ExprUse::Statement,
        ChildRole::Inherit | ChildRole::InheritedSequence => parent,
    }
}

/// Use for a child in an evaluated sequence (for `do` and match bodies).
pub(crate) fn sequence_use(index: usize, len: usize, parent: ExprUse) -> ExprUse {
    if parent == ExprUse::Statement {
        ExprUse::Statement
    } else if index + 1 == len {
        match parent {
            ExprUse::Tail => ExprUse::Tail,
            ExprUse::Value => ExprUse::Value,
            ExprUse::Statement => ExprUse::Statement,
        }
    } else {
        ExprUse::Statement
    }
}

pub(crate) fn is_statement_form(expr: &SExpr) -> bool {
    const STATEMENT_FORMS: &[&str] = &[
        "if",
        "while",
        "for",
        "for-of",
        "for-in",
        "for-await-of",
        "do-while",
        "switch",
        "throw",
        "return",
        "break",
        "continue",
        "label",
        "debugger",
        "block",
        "try",
        "catch",
        "finally",
        "var",
        "const",
        "let",
        "func",
        "class",
        "type",
        "export",
        "import",
    ];
    expr.as_list()
        .and_then(|values| values.first())
        .and_then(SExpr::as_form_head)
        .is_some_and(|head| STATEMENT_FORMS.contains(&head))
}

pub(crate) fn function_body_use(
    expr: &SExpr,
    index: usize,
    len: usize,
    policy: BodyPolicy,
) -> ExprUse {
    if policy == BodyPolicy::FunctionValueTail
        && index + 1 == len
        && (!is_statement_form(expr) || has_value_if_else(expr))
    {
        ExprUse::Tail
    } else {
        ExprUse::Statement
    }
}

fn has_value_if_else(expr: &SExpr) -> bool {
    expr.as_list().is_some_and(|values| {
        values.first().and_then(SExpr::as_form_head) == Some("if") && values.len() >= 4
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::reader::source_loc::Span;

    fn list(items: &[&str]) -> SExpr {
        SExpr::List {
            values: items
                .iter()
                .map(|item| SExpr::atom(item, Span::default()))
                .collect(),
            span: Span::default(),
        }
    }

    #[test]
    fn loop_policies_keep_fixed_headers_and_flat_statement_sequences() {
        let while_form = list(&["while"]);
        assert_eq!(
            normalized_child_role(&while_form.as_list().unwrap()[0], 0),
            ChildRole::Value
        );
        assert_eq!(
            normalized_child_role(&while_form.as_list().unwrap()[0], 1),
            ChildRole::StatementSequence
        );
        let for_head = SExpr::atom("for", Span::default());
        assert_eq!(normalized_child_role(&for_head, 2), ChildRole::Value);
        assert_eq!(
            normalized_child_role(&for_head, 3),
            ChildRole::StatementSequence
        );
        let iter_head = SExpr::atom("for-of", Span::default());
        assert_eq!(normalized_child_role(&iter_head, 0), ChildRole::Statement);
        assert_eq!(normalized_child_role(&iter_head, 1), ChildRole::Value);
        assert_eq!(
            normalized_child_role(&iter_head, 2),
            ChildRole::StatementSequence
        );
    }

    #[test]
    fn bound_heads_remain_value_calls_and_if_branches_are_fixed_inherited_slots() {
        let bound = SExpr::atom("if", Span::default())
            .with_name_res(crate::ast::sexpr::NameRes::BindingRef);
        assert_eq!(normalized_child_role(&bound, 0), ChildRole::Value);
        let head = SExpr::atom("if", Span::default());
        assert_eq!(normalized_child_role(&head, 1), ChildRole::Inherit);
        assert_eq!(normalized_child_role(&head, 2), ChildRole::Inherit);
        let block = SExpr::atom("block", Span::default());
        assert_eq!(
            normalized_child_role(&block, 0),
            ChildRole::InheritedSequence
        );
        let label = SExpr::atom("label", Span::default());
        assert_eq!(normalized_child_role(&label, 0), ChildRole::Statement);
        assert_eq!(normalized_child_role(&label, 1), ChildRole::Inherit);
    }

    #[test]
    fn function_tail_and_sequence_roles_preserve_tail_distinction() {
        let value = SExpr::atom("answer", Span::default());
        assert_eq!(
            function_body_use(&value, 0, 1, BodyPolicy::FunctionValueTail),
            ExprUse::Tail
        );
        assert_eq!(
            function_body_use(&value, 0, 1, BodyPolicy::Statements),
            ExprUse::Statement
        );
        let value_if = SExpr::List {
            values: vec![
                SExpr::atom("if", Span::default()),
                SExpr::atom("test", Span::default()),
                SExpr::atom("yes", Span::default()),
                SExpr::atom("no", Span::default()),
            ],
            span: Span::default(),
        };
        assert_eq!(
            function_body_use(&value_if, 0, 1, BodyPolicy::FunctionValueTail),
            ExprUse::Tail
        );
        assert_eq!(sequence_use(0, 2, ExprUse::Tail), ExprUse::Statement);
        assert_eq!(sequence_use(1, 2, ExprUse::Tail), ExprUse::Tail);
        assert_eq!(sequence_use(1, 2, ExprUse::Statement), ExprUse::Statement);
    }

    #[test]
    fn conversions_preserve_every_existing_emitter_context() {
        for (use_, context) in [
            (ExprUse::Statement, ExprContext::Statement),
            (ExprUse::Value, ExprContext::Value),
            (ExprUse::Tail, ExprContext::Tail),
        ] {
            assert_eq!(use_.to_expr_context(), context);
            assert_eq!(ExprUse::from_expr_context(context), use_);
        }
    }
}
