//! Borrowed occupancy census for one analyzed source unit. This is not a
//! binding resolver: conservative data aliases may also reserve spellings.

use super::gensym::EmitterGensym;
use crate::ast::sexpr::SExpr;
use crate::ast::surface::{
    ArrayParamElement, ClassMemberForm, DestructuredField, ParamShape, Pattern, SurfaceForm,
    ThreadingStep, TypeAnnotation, TypedParam,
};

pub(super) fn reserve_form_names(form: &SurfaceForm, names: &mut EmitterGensym) {
    use SurfaceForm::*;
    match form {
        Bind {
            name,
            type_ann,
            value,
            ..
        } => {
            expr(name, names);
            annotation(type_ann.as_ref(), names);
            expr(value, names);
        }
        BindGroup { bindings, .. } => {
            for b in bindings {
                expr(&b.name, names);
                annotation(b.type_ann.as_ref(), names);
                expr(&b.value, names);
            }
        }
        Func { name, clauses, .. } => {
            text(name, names);
            for c in clauses {
                params(&c.args, names);
                annotation(c.returns.as_ref(), names);
                opt_expr(c.pre.as_ref(), names);
                opt_expr(c.post.as_ref(), names);
                exprs(&c.body, names);
            }
        }
        Match {
            target, clauses, ..
        } => {
            expr(target, names);
            for c in clauses {
                pattern(&c.pattern, names);
                opt_expr(c.guard.as_ref(), names);
                exprs(&c.body, names);
            }
        }
        Cond { clauses, .. } => {
            for c in clauses {
                opt_expr(c.test.as_ref(), names);
                expr(&c.result, names);
            }
        }
        Type {
            name, constructors, ..
        } => {
            text(name, names);
            for c in constructors {
                text(&c.name, names);
                for f in &c.fields {
                    typed(f, names);
                }
            }
        }
        Obj { pairs, .. } => {
            for (key, value) in pairs {
                text(key, names);
                expr(value, names);
            }
        }
        Assoc { obj, pairs, .. } => {
            expr(obj, names);
            for (key, value) in pairs {
                text(key, names);
                expr(value, names);
            }
        }
        Cell { value, .. } => expr(value, names),
        Express { target, .. } => expr(target, names),
        Swap {
            target,
            func,
            extra_args,
            ..
        } => {
            expr(target, names);
            expr(func, names);
            exprs(extra_args, names);
        }
        Reset { target, value, .. } | Set { target, value, .. } => {
            expr(target, names);
            expr(value, names);
        }
        SetSymbol {
            obj, key, value, ..
        } => {
            expr(obj, names);
            expr(key, names);
            expr(value, names);
        }
        ThreadFirst { initial, steps, .. }
        | ThreadLast { initial, steps, .. }
        | SomeThreadFirst { initial, steps, .. }
        | SomeThreadLast { initial, steps, .. } => {
            expr(initial, names);
            for step in steps {
                match step {
                    ThreadingStep::Bare(e) => bare_step(e, names),
                    ThreadingStep::Call(es) => thread_call(es, names),
                }
            }
        }
        IfLet {
            pattern: p,
            expr: input,
            then_body,
            else_body,
            ..
        } => {
            pattern(p, names);
            expr(input, names);
            expr(then_body, names);
            opt_expr(else_body.as_ref(), names);
        }
        WhenLet {
            pattern: p,
            expr: input,
            body,
            ..
        } => {
            pattern(p, names);
            expr(input, names);
            exprs(body, names);
        }
        Genfunc { name, clauses, .. } => {
            text(name, names);
            for c in clauses {
                params(&c.args, names);
                annotation(c.yields.as_ref(), names);
                annotation(c.returns.as_ref(), names);
                opt_expr(c.pre.as_ref(), names);
                opt_expr(c.post.as_ref(), names);
                exprs(&c.body, names);
            }
        }
        Genfn {
            params: ps,
            yields,
            body,
            ..
        } => {
            params(ps, names);
            annotation(yields.as_ref(), names);
            exprs(body, names);
        }
        Fn {
            params: ps, body, ..
        }
        | Lambda {
            params: ps, body, ..
        } => {
            params(ps, names);
            exprs(body, names);
        }
        Conj { arr, value, .. } => {
            expr(arr, names);
            expr(value, names);
        }
        Dissoc { obj, keys, .. } => {
            expr(obj, names);
            for k in keys {
                text(k, names);
            }
        }
        MacroDef { name, raw, .. } => {
            text(name, names);
            expr(raw, names);
        }
        ImportMacros { raw, .. } | KernelPassthrough { raw, .. } => expr(raw, names),
        Eq { args, .. } | And { args, .. } | Or { args, .. } => exprs(args, names),
        NotEq { left, right, .. } => {
            expr(left, names);
            expr(right, names);
        }
        Not { operand, .. } => expr(operand, names),
        Async { inner, .. } => reserve_form_names(inner, names),
        Export {
            inner, extra_args, ..
        } => {
            reserve_form_names(inner, names);
            exprs(extra_args, names);
        }
        Exports { names: exports, .. } => exprs(exports, names),
        Class {
            name,
            superclass,
            members,
            ..
        } => {
            expr(name, names);
            expr(superclass, names);
            class_members(members, names);
        }
        ClassExpr {
            superclass,
            members,
            ..
        } => {
            expr(superclass, names);
            class_members(members, names);
        }
        FunctionCall { head, args, .. } => {
            expr(head, names);
            exprs(args, names);
        }
        Do { body, .. } => exprs(body, names),
    }
}

fn class_members(members: &[ClassMemberForm], names: &mut EmitterGensym) {
    for m in members {
        match m {
            ClassMemberForm::Method { prefix, body, .. } => {
                exprs(prefix, names);
                exprs(body, names);
            }
            ClassMemberForm::Field { prefix, init, .. } => {
                exprs(prefix, names);
                opt_expr(init.as_ref(), names);
            }
            ClassMemberForm::Raw(raw) => expr(raw, names),
        }
    }
}
fn params(ps: &[ParamShape], names: &mut EmitterGensym) {
    for p in ps {
        param(p, names);
    }
}
fn param(p: &ParamShape, names: &mut EmitterGensym) {
    match p {
        ParamShape::Simple(tp) => typed(tp, names),
        ParamShape::DestructuredObject { fields, .. } => {
            for f in fields {
                match f {
                    DestructuredField::Simple(tp) => typed(tp, names),
                    DestructuredField::Nested {
                        alias_name,
                        type_ann,
                        pattern,
                        ..
                    } => {
                        text(alias_name, names);
                        annotation(Some(type_ann), names);
                        param(pattern, names);
                    }
                }
            }
        }
        ParamShape::DestructuredArray { elements, .. } => {
            for e in elements {
                match e {
                    ArrayParamElement::Typed(tp) | ArrayParamElement::Rest(tp) => typed(tp, names),
                    ArrayParamElement::Skip(_) => {}
                    ArrayParamElement::Nested { pattern, .. } => param(pattern, names),
                    ArrayParamElement::NestedWithAlias {
                        alias_name,
                        type_ann,
                        pattern,
                        ..
                    } => {
                        text(alias_name, names);
                        annotation(Some(type_ann), names);
                        param(pattern, names);
                    }
                }
            }
        }
    }
}
fn typed(tp: &TypedParam, names: &mut EmitterGensym) {
    text(&tp.name, names);
    annotation(Some(&tp.type_ann), names);
    opt_expr(tp.default_value.as_ref(), names);
}
fn annotation(ann: Option<&TypeAnnotation>, names: &mut EmitterGensym) {
    if let Some(ann) = ann {
        text(&ann.name, names);
    }
}
fn pattern(p: &Pattern, names: &mut EmitterGensym) {
    match p {
        Pattern::Wildcard(_) => {}
        Pattern::Literal(e) => expr(e, names),
        Pattern::Binding { name, .. } => text(name, names),
        Pattern::Constructor { name, bindings, .. } => {
            text(name, names);
            for b in bindings {
                pattern(b, names);
            }
        }
        Pattern::Obj { pairs, .. } => {
            for (key, value) in pairs {
                text(key, names);
                pattern(value, names);
            }
        }
    }
}
fn exprs(es: &[SExpr], names: &mut EmitterGensym) {
    for e in es {
        expr(e, names);
    }
}
fn opt_expr(e: Option<&SExpr>, names: &mut EmitterGensym) {
    if let Some(e) = e {
        expr(e, names);
    }
}
fn expr(e: &SExpr, names: &mut EmitterGensym) {
    match e {
        SExpr::Atom(_) => {
            if let Some(value) = e.as_atom() {
                text(value, names);
            }
        }
        SExpr::List { values, .. } => {
            if values
                .first()
                .and_then(SExpr::as_atom)
                .is_some_and(is_threading_head)
            {
                expr(&values[0], names);
                if let Some(initial) = values.get(1) {
                    expr(initial, names);
                }
                for step in values.iter().skip(2) {
                    raw_step(step, names);
                }
            } else {
                exprs(values, names);
            }
        }
        SExpr::Cons { car, cdr, .. } => {
            expr(car, names);
            expr(cdr, names);
        }
        SExpr::Keyword { .. }
        | SExpr::String { .. }
        | SExpr::Number { .. }
        | SExpr::Bool { .. }
        | SExpr::Null { .. } => {}
    }
}

fn is_threading_head(value: &str) -> bool {
    matches!(value, "->" | "->>" | "some->" | "some->>")
}

fn bare_step(step: &SExpr, names: &mut EmitterGensym) {
    if let SExpr::Keyword { value, .. } = step {
        text(value, names);
    } else {
        expr(step, names);
    }
}

fn raw_step(step: &SExpr, names: &mut EmitterGensym) {
    if let SExpr::List { values, .. } = step {
        thread_call(values, names);
    } else {
        bare_step(step, names);
    }
}

fn thread_call(values: &[SExpr], names: &mut EmitterGensym) {
    let Some(head) = values.first() else {
        return;
    };
    if let SExpr::Keyword { value, .. } = head {
        text(value, names);
    } else {
        expr(head, names);
    }
    exprs(&values[1..], names);
}

fn text(value: &str, names: &mut EmitterGensym) {
    names.reserve(value);
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::analysis::type_registry::TypeRegistry;
    use crate::ast::surface::SurfaceForm;
    use crate::emitter::context::EmitterContext;
    use crate::emitter::forms::emit_form;
    use crate::reader::source_loc::Span;

    fn atom(value: &str) -> SExpr {
        SExpr::atom(value, Span::default())
    }

    fn keyword(value: &str) -> SExpr {
        SExpr::Keyword {
            value: value.to_string(),
            span: Span::default(),
        }
    }

    fn string(value: &str) -> SExpr {
        SExpr::String {
            value: value.to_string(),
            span: Span::default(),
        }
    }

    fn number(value: f64) -> SExpr {
        SExpr::Number {
            value,
            span: Span::default(),
        }
    }

    fn list(values: Vec<SExpr>) -> SExpr {
        SExpr::List {
            values,
            span: Span::default(),
        }
    }

    fn thread_form(head: &str, step: ThreadingStep) -> SurfaceForm {
        let span = Span::default();
        let initial = number(7.0);
        let steps = vec![step];
        match head {
            "->" => SurfaceForm::ThreadFirst {
                initial,
                steps,
                span,
            },
            "->>" => SurfaceForm::ThreadLast {
                initial,
                steps,
                span,
            },
            "some->" => SurfaceForm::SomeThreadFirst {
                initial,
                steps,
                span,
            },
            "some->>" => SurfaceForm::SomeThreadLast {
                initial,
                steps,
                span,
            },
            _ => unreachable!("test uses a native threading head"),
        }
    }

    fn next_t(form: &SurfaceForm) -> String {
        let mut names = EmitterGensym::new();
        reserve_form_names(form, &mut names);
        names.next("t")
    }

    #[test]
    fn all_surface_thread_forms_reserve_bare_and_call_keyword_heads() {
        for head in ["->", "->>", "some->", "some->>"] {
            let bare = thread_form(head, ThreadingStep::Bare(keyword("t__gensym0")));
            assert_eq!(next_t(&bare), "t__gensym1", "bare keyword in {head}");

            let call = thread_form(
                head,
                ThreadingStep::Call(vec![keyword("t__gensym0"), number(9.0)]),
            );
            assert_eq!(next_t(&call), "t__gensym1", "call head in {head}");
        }
    }

    #[test]
    fn raw_thread_steps_are_scanned_inside_ordinary_containers() {
        for head in ["->", "->>", "some->", "some->>"] {
            let raw = list(vec![atom(head), number(7.0), keyword("t__gensym0")]);
            let container = list(vec![atom("vector"), raw]);
            let form = SurfaceForm::Bind {
                name: atom("value"),
                type_ann: None,
                value: container,
                span: Span::default(),
            };
            assert_eq!(next_t(&form), "t__gensym1", "raw nested {head}");
        }
    }

    #[test]
    fn tagged_bare_list_recurses_as_expression_without_inventing_call_role() {
        let nested_thread = list(vec![atom("some->"), number(7.0), keyword("t__gensym0")]);
        let nested = thread_form("->", ThreadingStep::Bare(nested_thread));
        assert_eq!(next_t(&nested), "t__gensym1");

        let keyword_data = list(vec![keyword("t__gensym0"), number(1.0)]);
        let data = thread_form("->", ThreadingStep::Bare(keyword_data));
        assert_eq!(next_t(&data), "t__gensym0");
    }

    #[test]
    fn keyword_data_initials_arguments_and_strings_remain_unreserved() {
        let ordinary_data = SurfaceForm::Bind {
            name: atom("value"),
            type_ann: None,
            value: list(vec![keyword("t__gensym0"), string("t__gensym0")]),
            span: Span::default(),
        };
        assert_eq!(next_t(&ordinary_data), "t__gensym0");

        let initial_keyword = SurfaceForm::ThreadFirst {
            initial: keyword("t__gensym0"),
            steps: vec![],
            span: Span::default(),
        };
        assert_eq!(next_t(&initial_keyword), "t__gensym0");

        let call_argument = thread_form(
            "some->",
            ThreadingStep::Call(vec![keyword("child"), keyword("t__gensym0")]),
        );
        assert_eq!(next_t(&call_argument), "t__gensym0");
    }

    #[test]
    fn escaped_keyword_member_uses_existing_physical_name_reservation() {
        let form = thread_form(
            "some->",
            ThreadingStep::Bare(keyword(r"child[t\u005f\u005fgensym0]")),
        );
        assert_eq!(next_t(&form), "t__gensym1");
    }

    #[test]
    fn public_fragment_emission_reserves_the_supplied_surface_thread_before_lowering() {
        let form = thread_form("some->", ThreadingStep::Bare(keyword("child[t__gensym0]")));
        let mut context = EmitterContext::new(false);
        let emitted = emit_form(&form, &mut context, &TypeRegistry::default()).unwrap();
        let emitted = emitted
            .iter()
            .map(ToString::to_string)
            .collect::<Vec<_>>()
            .join("\n");
        assert!(emitted.contains("const t__gensym1"), "{emitted}");
        assert!(emitted.contains("child[t__gensym0]"), "{emitted}");
        assert!(!emitted.contains("const t__gensym0"), "{emitted}");
        assert_eq!(context.gensym.next("t"), "t__gensym2");
    }

    #[test]
    fn ordinary_cons_recursion_still_reserves_atom_occurrences() {
        let form = SurfaceForm::Bind {
            name: atom("value"),
            type_ann: None,
            value: SExpr::Cons {
                car: Box::new(atom("left")),
                cdr: Box::new(atom("t__gensym0")),
                span: Span::default(),
            },
            span: Span::default(),
        };
        assert_eq!(next_t(&form), "t__gensym1");
    }
}
