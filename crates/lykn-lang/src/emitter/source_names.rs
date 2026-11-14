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
                    ThreadingStep::Bare(e) => expr(e, names),
                    ThreadingStep::Call(es) => exprs(es, names),
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
        SExpr::List { values, .. } => exprs(values, names),
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
fn text(value: &str, names: &mut EmitterGensym) {
    names.reserve(value);
}
