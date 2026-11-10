use crate::analysis::type_registry::TypeRegistry;
use crate::ast::sexpr::{CompletionValueId, NameRes, SExpr};
use crate::ast::surface::{
    ArrayParamElement, BindBinding, ClassMemberForm, CondClause, Constructor, DestructuredField,
    FuncClause, GenfuncClause, MatchClause, ParamShape, Pattern, SurfaceForm, ThreadingStep,
    TypeAnnotation,
};
use crate::codegen::names::to_js_identifier;
use crate::diagnostics::{Diagnostic, Severity};
use crate::error::LyknError;
use crate::reader::source_loc::Span;
use crate::semantic_roles::{
    BodyPolicy, ChildRole, ExprUse, ObjectPropertyRole, child_use, function_body_use,
    is_statement_form, normalized_child_role, object_property_role, sequence_use,
};
use std::collections::{HashMap, HashSet};

use super::context::{EmitterContext, ExprContext};
use super::contracts::{
    emit_post_check_with_predicate, emit_pre_check_with_predicate, replace_tilde,
};
use super::type_checks::{emit_return_type_check, emit_type_check};

fn codegen_error(message: impl Into<String>, span: Span) -> LyknError {
    LyknError::Codegen(Diagnostic {
        severity: Severity::Error,
        message: message.into(),
        span,
        suggestion: None,
    })
}

// ---------------------------------------------------------------------------
// Kernel SExpr construction helpers
// ---------------------------------------------------------------------------

/// Create an `Atom` with a default span.
pub fn atom(s: &str) -> SExpr {
    SExpr::atom(s, Span::default())
}

/// Create a `String` literal with a default span.
pub fn str_lit(s: &str) -> SExpr {
    SExpr::String {
        value: s.to_string(),
        span: Span::default(),
    }
}

/// Create a `Number` literal with a default span.
pub fn num(n: f64) -> SExpr {
    SExpr::Number {
        value: n,
        span: Span::default(),
    }
}

/// Create a `List` with a default span.
pub fn list(items: Vec<SExpr>) -> SExpr {
    SExpr::List {
        values: items,
        span: Span::default(),
    }
}

/// Create a `Bool` with a default span.
fn bool_lit(b: bool) -> SExpr {
    SExpr::Bool {
        value: b,
        span: Span::default(),
    }
}

// ---------------------------------------------------------------------------
// Await detection
// ---------------------------------------------------------------------------

/// Recursively scan an `SExpr` tree for `(await ...)` forms.
fn contains_await(expr: &SExpr) -> bool {
    match expr {
        SExpr::List { values, .. } => {
            // DD-60 D1 (arc13/slice11 F-5): async detection honours resolution.
            // A lexically bound `await` (a param/binder) is a plain call to the
            // binding, not the `await` operator, so it must NOT async-wrap the
            // enclosing form — `as_form_head` (bound → `None`) gates the head,
            // where slice08's byte-identical sweep left a raw `as_atom` read.
            // Probe: `(func p (:any await) (if-let (x 1) (await 987) 0))` was
            // async-wrapped on Rust (and `await(987)` reinterpreted as the
            // operator) while JS kept it a sync call — this closes that gap.
            if values.first().and_then(|e| e.as_form_head()) == Some("await") {
                return true;
            }
            values.iter().any(contains_await)
        }
        _ => false,
    }
}

/// Check whether any expression in a slice contains an `(await ...)` form.
fn any_contains_await(exprs: &[SExpr]) -> bool {
    exprs.iter().any(contains_await)
}

/// Detect suspension that belongs to the current emitted function/IIFE.
/// Unlike the legacy scanner above, this deliberately stops at nested
/// functions: an await in a callback must not make its creator asynchronous.
fn contains_current_await(expr: &SExpr) -> bool {
    match expr {
        SExpr::List { values, .. } if !values.is_empty() => {
            let head = values[0].as_form_head();
            if matches!(head, Some("function" | "function*" | "=>" | "lambda"))
                || head == Some("async")
            {
                return false;
            }
            if matches!(head, Some("class" | "class-expr")) {
                return class_contains_current_await(head.unwrap(), &values[1..]);
            }
            if matches!(head, Some("await" | "for-await-of")) {
                return true;
            }
            values.iter().any(contains_current_await)
        }
        _ => false,
    }
}

fn class_contains_current_await(class_head: &str, args: &[SExpr]) -> bool {
    let (bases, members) = if class_head == "class" {
        (args.get(1), args.get(2..).unwrap_or_default())
    } else {
        (args.first(), args.get(1..).unwrap_or_default())
    };
    let superclass_await = bases.is_some_and(|bases| {
        bases
            .as_list()
            .and_then(|values| values.first())
            .is_some_and(contains_current_await)
    });
    superclass_await
        || members
            .iter()
            .any(|member| class_member_current_await(member, false))
}

fn class_member_current_await(member: &SExpr, is_static: bool) -> bool {
    let Some(values) = member.as_list() else {
        return false;
    };
    let Some(head) = values.first().and_then(SExpr::as_atom) else {
        return false;
    };
    match head {
        "static" => values
            .get(1)
            .is_some_and(|member| class_member_current_await(member, true)),
        "async" => values
            .get(1)
            .is_some_and(|member| class_member_current_await(member, is_static)),
        "get" | "set" => values.get(1).is_some_and(contains_current_await),
        "field" => {
            let computed_key_await = values
                .get(1)
                .is_some_and(|key| !matches!(key, SExpr::Atom(_)) && contains_current_await(key));
            let initializer_await = is_static && values.get(2).is_some_and(contains_current_await);
            computed_key_await || initializer_await
        }
        "constructor" => false,
        _ => {
            // Ordinary method: the raw first atom is a property name, while
            // parameters and body execute only when the method is invoked.
            false
        }
    }
}

/// Turn returns that belong to a synthetic async value IIFE into carrier
/// returns. Nested functions and classes own their own return scopes.
fn box_current_scope_returns(expr: &SExpr) -> SExpr {
    let SExpr::List { values, span } = expr else {
        return expr.clone();
    };
    if values.is_empty() {
        return expr.clone();
    }
    let head = values[0].as_form_head();
    if matches!(
        head,
        Some("function" | "function*" | "=>" | "lambda" | "class" | "class-expr" | "async")
    ) {
        return expr.clone();
    }
    if head == Some("return") {
        let value = values.get(1).cloned().unwrap_or_else(|| atom("undefined"));
        return SExpr::List {
            values: vec![values[0].clone(), list(vec![atom("array"), value])],
            span: *span,
        };
    }
    SExpr::List {
        values: values.iter().map(box_current_scope_returns).collect(),
        span: *span,
    }
}

fn any_current_await(exprs: &[SExpr]) -> bool {
    exprs.iter().any(contains_current_await)
}

fn emit_in_context(
    expr: &SExpr,
    context: ExprContext,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let saved = ctx.expr_context;
    ctx.expr_context = context;
    let emitted = emit_expr(expr, ctx, registry);
    ctx.expr_context = saved;
    emitted
}

/// Preserve a value across async-IIFE fulfillment without Promise
/// assimilation, using ordinary supported kernel forms for the unbox step.
fn unbox_awaited_value(awaited_box: SExpr, ctx: &mut EmitterContext) -> SExpr {
    let param = ctx.gensym.next("value_box");
    let arrow = list(vec![
        atom("=>"),
        list(vec![atom(&param)]),
        list(vec![atom("get"), atom(&param), num(0.0)]),
    ]);
    list(vec![arrow, awaited_box])
}

/// Check whether a `ThreadingStep` contains an `(await ...)` form.
fn step_contains_await(step: &ThreadingStep) -> bool {
    match step {
        ThreadingStep::Bare(expr) => {
            // Bare symbol "await" or a list containing await. Resolution-honoured
            // (F-5): a bound `await` is a value, not the operator (`as_form_head`).
            expr.as_form_head() == Some("await") || contains_await(expr)
        }
        ThreadingStep::Call(exprs) => {
            // Check if the call head is "await" or if any subexpression contains
            // await — bound `await` is a plain call, not the operator (F-5).
            if let Some(head) = exprs.first()
                && head.as_form_head() == Some("await")
            {
                return true;
            }
            any_contains_await(exprs)
        }
    }
}

// ---------------------------------------------------------------------------
// IIFE async wrapping helpers
// ---------------------------------------------------------------------------

/// Wrap an IIFE `((=> () ...))` in `(await ((async (=> () ...))))`.
///
/// Takes the inner arrow body (the `vec![atom("=>"), list(vec![]), ...]`)
/// and returns the fully wrapped expression.
fn wrap_iife_async(arrow_body: Vec<SExpr>) -> SExpr {
    let arrow_fn = list(arrow_body);
    let async_arrow = list(vec![atom("async"), arrow_fn]);
    let call = list(vec![async_arrow]);
    list(vec![atom("await"), call])
}

// ---------------------------------------------------------------------------
// Top-level form dispatch
// ---------------------------------------------------------------------------

/// Emit one `SurfaceForm` to one or more kernel `SExpr` nodes.
pub fn emit_form(
    form: &SurfaceForm,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> Result<Vec<SExpr>, LyknError> {
    let mut result = emit_form_raw_checked(form, ctx, registry)?;
    finalize_completion_value_markers(&mut result, ctx);
    Ok(result)
}

/// Emit one form through the existing checked/fatal wrapper without resolving
/// compiler-owned names, so a containing module can reserve all siblings.
pub(crate) fn emit_form_raw_checked(
    form: &SurfaceForm,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> Result<Vec<SExpr>, LyknError> {
    let saved_context = ctx.expr_context;
    let saved_class = ctx.in_class_body;
    let result = emit_form_inner(form, ctx, registry);
    let failure = ctx.first_fatal.take();
    if failure.is_some() {
        ctx.expr_context = saved_context;
        ctx.in_class_body = saved_class;
    }
    match failure {
        Some(error) => Err(error),
        None => Ok(result),
    }
}

/// Finalize private result destinations after reserving the normalized names
/// and colon roots that occur throughout the complete emitted unit.
pub(crate) fn finalize_completion_value_markers(forms: &mut [SExpr], ctx: &mut EmitterContext) {
    let mut reserved = HashSet::new();
    let mut has_markers = false;
    for form in forms.iter() {
        has_markers |= reserve_emitted_names(form, &mut reserved);
    }
    if !has_markers {
        return;
    }

    let mut names = HashMap::new();
    let mut next = ctx.completion_value_name_counter;
    for form in forms {
        finalize_completion_value_markers_in(form, &reserved, &mut names, &mut next);
    }
    ctx.completion_value_name_counter = next;
}

fn finalize_completion_value_markers_in(
    expr: &mut SExpr,
    reserved: &HashSet<String>,
    names: &mut HashMap<CompletionValueId, String>,
    next: &mut u64,
) {
    if let Some(id) = expr.completion_value_id() {
        let name = names.entry(id).or_insert_with(|| {
            loop {
                let candidate = format!("completionValue__gensym{}", *next);
                *next = (*next)
                    .checked_add(1)
                    .expect("completion value name space exhausted");
                if !reserved.contains(&to_js_identifier(&candidate)) {
                    return candidate;
                }
            }
        });
        expr.finalize_completion_value(name.clone());
        return;
    }

    match expr {
        SExpr::List { values, .. } => {
            for value in values {
                finalize_completion_value_markers_in(value, reserved, names, next);
            }
        }
        SExpr::Cons { car, cdr, .. } => {
            finalize_completion_value_markers_in(car, reserved, names, next);
            finalize_completion_value_markers_in(cdr, reserved, names, next);
        }
        SExpr::Atom(_)
        | SExpr::Keyword { .. }
        | SExpr::String { .. }
        | SExpr::Number { .. }
        | SExpr::Bool { .. }
        | SExpr::Null { .. } => {}
    }
}

fn emit_form_inner(
    form: &SurfaceForm,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> Vec<SExpr> {
    match form {
        SurfaceForm::Bind {
            name,
            type_ann,
            value,
            span,
        } => emit_bind(name, type_ann.as_ref(), value, *span, ctx, registry),
        SurfaceForm::BindGroup { bindings, .. } => emit_bind_group(bindings, ctx, registry),
        SurfaceForm::Exports { names, .. } => vec![emit_exports(names)],
        SurfaceForm::Obj { pairs, .. } => vec![emit_obj(pairs, ctx, registry)],
        SurfaceForm::Cell { value, .. } => vec![emit_cell(value, ctx, registry)],
        SurfaceForm::Express { target, .. } => vec![emit_express(target, ctx, registry)],
        SurfaceForm::Swap {
            target,
            func,
            extra_args,
            ..
        } => vec![emit_swap(target, func, extra_args, ctx, registry)],
        SurfaceForm::Reset { target, value, .. } => vec![emit_reset(target, value, ctx, registry)],
        SurfaceForm::Set { target, value, .. } => {
            // (set! target:prop value) → (= target:prop value)
            vec![list(vec![
                atom("="),
                emit_expr(target, ctx, registry),
                emit_expr(value, ctx, registry),
            ])]
        }
        SurfaceForm::SetSymbol {
            obj, key, value, ..
        } => {
            // (set-symbol! obj key value) → (= (get obj key) value)
            vec![list(vec![
                atom("="),
                list(vec![
                    atom("get"),
                    emit_expr(obj, ctx, registry),
                    emit_expr(key, ctx, registry),
                ]),
                emit_expr(value, ctx, registry),
            ])]
        }
        SurfaceForm::ThreadFirst { initial, steps, .. } => {
            vec![emit_thread_first(initial, steps, ctx, registry)]
        }
        SurfaceForm::ThreadLast { initial, steps, .. } => {
            vec![emit_thread_last(initial, steps, ctx, registry)]
        }
        SurfaceForm::SomeThreadFirst { initial, steps, .. } => {
            vec![emit_some_thread_first(initial, steps, ctx, registry)]
        }
        SurfaceForm::SomeThreadLast { initial, steps, .. } => {
            vec![emit_some_thread_last(initial, steps, ctx, registry)]
        }
        SurfaceForm::IfLet {
            pattern,
            expr,
            then_body,
            else_body,
            ..
        } => vec![emit_if_let(
            pattern,
            expr,
            then_body,
            else_body.as_ref(),
            ctx,
            registry,
        )],
        SurfaceForm::WhenLet {
            pattern,
            expr,
            body,
            ..
        } => vec![emit_when_let(pattern, expr, body, ctx, registry)],
        SurfaceForm::Type { constructors, .. } => emit_type(constructors, ctx, registry),
        SurfaceForm::Fn { params, body, .. } => {
            vec![emit_fn_expr(params, body, ctx, registry)]
        }
        SurfaceForm::Lambda { params, body, .. } => {
            vec![emit_fn_expr(params, body, ctx, registry)]
        }
        SurfaceForm::Func {
            name,
            name_span,
            clauses,
            span,
            ..
        } => emit_func(name, *name_span, clauses, *span, ctx, registry),
        SurfaceForm::Genfunc {
            name,
            name_span,
            clauses,
            span,
            ..
        } => emit_genfunc(name, *name_span, clauses, *span, ctx, registry),
        SurfaceForm::Genfn {
            params,
            yields,
            body,
            ..
        } => vec![emit_genfn_expr(
            params,
            yields.as_ref(),
            body,
            ctx,
            registry,
        )],
        SurfaceForm::Match {
            target, clauses, ..
        } => vec![emit_match(target, clauses, ctx, registry)],
        SurfaceForm::Cond { clauses, .. } => vec![emit_cond(clauses, ctx, registry)],
        SurfaceForm::Async { inner, .. } => {
            // Emit the inner surface form to kernel, then wrap in (async ...)
            let inner_kernel = emit_form_inner(inner, ctx, registry);
            inner_kernel
                .into_iter()
                .map(|k| list(vec![atom("async"), k]))
                .collect()
        }
        SurfaceForm::Export {
            inner, extra_args, ..
        } => {
            // Emit the inner surface form to kernel, then wrap in (export ...)
            let inner_kernel = emit_form_inner(inner, ctx, registry);
            inner_kernel
                .into_iter()
                .map(|k| {
                    let mut items = vec![atom("export"), k];
                    items.extend(extra_args.iter().cloned());
                    list(items)
                })
                .collect()
        }
        SurfaceForm::Class {
            name,
            superclass,
            members,
            ..
        } => vec![emit_class_form(
            Some(name),
            superclass,
            members,
            ctx,
            registry,
        )],
        SurfaceForm::ClassExpr {
            superclass,
            members,
            ..
        } => vec![emit_class_form(None, superclass, members, ctx, registry)],
        SurfaceForm::Do { body, .. } => vec![emit_do(body, ctx, registry)],
        SurfaceForm::KernelPassthrough { raw, .. } => {
            let emitted = if matches!(raw, SExpr::List { values, .. }
                if values.first().and_then(SExpr::as_form_head) == Some("object"))
            {
                emit_kernel_root(raw, ctx, registry)
            } else {
                emit_expr(raw, ctx, registry)
            };
            vec![emitted]
        }
        SurfaceForm::FunctionCall { head, args, span } => {
            // Check for js: namespace interop. DD-61 §A6: dispatch on the form
            // head — a lexically bound `assign`/`js:…` head is a plain call, not
            // the special form, so `as_form_head` (not `as_atom`) gates these.
            if let Some(name) = head.as_form_head() {
                if name.starts_with("js:") {
                    return vec![emit_js_interop(name, args, ctx, registry)];
                }
                // assign outside class body — compile-time error
                if name == "assign" {
                    ctx.record_fatal(codegen_error("assign can only be used inside class bodies — use set! for property mutation", *span));
                    return vec![atom("undefined")];
                }
            }
            vec![emit_function_call(head, args, ctx, registry)]
        }
        SurfaceForm::Conj { arr, value, .. } => vec![emit_conj(arr, value, ctx, registry)],
        SurfaceForm::Assoc { obj, pairs, .. } => vec![emit_assoc(obj, pairs, ctx, registry)],
        SurfaceForm::Dissoc { obj, keys, .. } => vec![emit_dissoc(obj, keys, ctx, registry)],
        SurfaceForm::Eq { args, .. } => vec![emit_eq(args, ctx, registry)],
        SurfaceForm::NotEq { left, right, .. } => vec![emit_not_eq(left, right, ctx, registry)],
        SurfaceForm::And { args, .. } => vec![emit_and(args, ctx, registry)],
        SurfaceForm::Or { args, .. } => vec![emit_or(args, ctx, registry)],
        SurfaceForm::Not { operand, .. } => vec![emit_not(operand, ctx, registry)],
        SurfaceForm::MacroDef { raw, .. } => vec![raw.clone()],
        SurfaceForm::ImportMacros { raw, .. } => vec![raw.clone()],
    }
}

// ---------------------------------------------------------------------------
// Expression emission (recursive into sub-expressions)
// ---------------------------------------------------------------------------

/// Recursively emit a sub-expression.
///
/// If the expression is a list whose head is a surface form name, classify and
/// emit it so that nested surface forms (e.g. `(-> 1 (+ 2))` inside a `bind`)
/// are expanded correctly. Non-surface-form lists are recursed into so that
/// deeply nested surface forms are still discovered.
fn emit_expr(expr: &SExpr, ctx: &mut EmitterContext, registry: &TypeRegistry) -> SExpr {
    let saved_direct_region = ctx.direct_return_region;
    if saved_direct_region && ctx.expr_context != ExprContext::Statement {
        ctx.direct_return_region = false;
    }
    let emitted = emit_expr_inner(expr, ctx, registry);
    ctx.direct_return_region = saved_direct_region;
    emitted
}

fn emit_expr_inner(expr: &SExpr, ctx: &mut EmitterContext, registry: &TypeRegistry) -> SExpr {
    match expr {
        SExpr::List { values, span } if !values.is_empty() => {
            if ctx.direct_return_region
                && ctx.expr_context == ExprContext::Statement
                && values
                    .first()
                    .is_some_and(is_direct_lexical_call_head)
            {
                return match emit_direct_lexical_call(expr, None, ctx, registry) {
                    DirectTailResult::Value(value) => value,
                    DirectTailResult::Statements(statements) => direct_statement_block(statements),
                };
            }
            // DD-61 §A6: dispatch on the *form head*. A lexically bound head
            // (`as_form_head` → `None`) is a call to the binding — it skips every
            // surface/kernel/inline dispatch below and is recursed as a plain
            // list, so codegen emits the readable call.
            if let Some(head_name) = values[0].as_form_head() {
                if ctx.direct_return_region
                    && matches!(ctx.expr_context, ExprContext::Statement)
                    && head_name == "return"
                {
                    return emit_direct_return(&values[1..], *span, ctx, registry);
                }
                // js: namespace interop (DD-15) — handle before surface form check
                if head_name.starts_with("js:") {
                    return emit_js_interop(head_name, &values[1..], ctx, registry);
                }
                if let Some(kernel_form) = head_name.strip_prefix("kernel:") {
                    return match crate::classifier::forms::classify_kernel_escape(
                        kernel_form,
                        values,
                        *span,
                    ) {
                        Ok(raw) => emit_kernel_root(&raw, ctx, registry),
                        Err(error) => {
                            ctx.record_fatal(LyknError::Classify(error));
                            atom("undefined")
                        }
                    };
                }
                // assign — only valid inside class bodies (DD-27)
                if head_name == "assign" {
                    if ctx.in_class_body && values.len() == 3 {
                        // Emit as kernel = (assignment)
                        let target = emit_expr(&values[1], ctx, registry);
                        let value = emit_expr(&values[2], ctx, registry);
                        return list(vec![atom("="), target, value]);
                    }
                    // Outside class body — emit error marker
                    ctx.record_fatal(codegen_error("assign can only be used inside class bodies — use set! for property mutation", *span));
                    return atom("undefined");
                }
                if head_name == "switch" {
                    // Case lists are structural switch clauses, not computed
                    // calls: the test is a value and each following item is a
                    // statement. Preserve the normal call handling for a
                    // lexically bound `switch` head (which never reaches here).
                    return emit_switch_children(values, *span, ctx, registry);
                }
                if head_name == "try"
                    && ctx.direct_return_region
                    && ctx.expr_context == ExprContext::Statement
                {
                    return emit_direct_try_children(values, *span, ctx, registry);
                }
                if head_name == "if"
                    && ctx.direct_return_region
                    && ctx.expr_context == ExprContext::Statement
                {
                    return emit_direct_if_statement(&values[1..], *span, ctx, registry);
                }
                if crate::classifier::dispatch::is_surface_form(head_name)
                    || head_name == "class"
                    || head_name == "class-expr"
                {
                    // This subexpression is a surface form — classify and emit it.
                    // Each per-form emitter sets the child context it needs (e.g.,
                    // emit_func_single sets Statement for function bodies). Forms
                    // that produce expressions (obj, assoc, arithmetic, etc.) emit
                    // expression-form AST regardless of the enclosing context.
                    match crate::classifier::classify_expr(expr) {
                        Ok(surface_form) => {
                            let emitted = emit_form_inner(&surface_form, ctx, registry);
                            if emitted.len() == 1 {
                                emitted.into_iter().next().unwrap()
                            } else if emitted.is_empty() {
                                expr.clone()
                            } else {
                                let mut items = vec![atom("block")];
                                items.extend(emitted);
                                list(items)
                            }
                        }
                        Err(error) => {
                            ctx.record_fatal(LyknError::Classify(error));
                            expr.clone()
                        }
                    }
                } else if head_name == "if"
                    && matches!(ctx.expr_context, ExprContext::Value | ExprContext::Tail)
                {
                    // DD-50: if in expression position → position-aware emission
                    emit_if_expression(&values[1..], *span, ctx, registry)
                } else {
                    // Not a surface form — recursively process subexpressions
                    // with per-form child context profile (DD-50.5).
                    let function_boundary = matches!(
                        head_name,
                        "function" | "function*" | "=>" | "lambda" | "async"
                    );
                    let saved_direct_region = ctx.direct_return_region;
                    if function_boundary {
                        ctx.direct_return_region = false;
                    }
                    let emitted = emit_kernel_children(values, *span, ctx, registry);
                    ctx.direct_return_region = saved_direct_region;
                    emitted
                }
            } else {
                // Head is not an atom (computed call) — recurse on all elements
                let saved_ctx = ctx.expr_context;
                ctx.expr_context = ExprContext::Value;
                let new_values: Vec<SExpr> =
                    values.iter().map(|v| emit_expr(v, ctx, registry)).collect();
                ctx.expr_context = saved_ctx;
                SExpr::List {
                    values: new_values,
                    span: *span,
                }
            }
        }
        _ => expr.clone(),
    }
}

/// Emit a checked kernel escape root directly, bypassing surface dispatch for
/// its stripped head while retaining the normal context-sensitive kernel roles.
fn emit_kernel_root(expr: &SExpr, ctx: &mut EmitterContext, registry: &TypeRegistry) -> SExpr {
    let SExpr::List { values, span } = expr else {
        return expr.clone();
    };
    match values.first().and_then(SExpr::as_atom) {
        Some("object") => emit_kernel_object(values, *span, ctx, registry),
        Some("switch") => emit_switch_children(values, *span, ctx, registry),
        Some("try") if ctx.direct_return_region && ctx.expr_context == ExprContext::Statement => {
            emit_direct_try_children(values, *span, ctx, registry)
        }
        Some("return")
            if ctx.direct_return_region && ctx.expr_context == ExprContext::Statement =>
        {
            emit_direct_return(&values[1..], *span, ctx, registry)
        }
        Some("if") if matches!(ctx.expr_context, ExprContext::Value | ExprContext::Tail) => {
            emit_if_expression(&values[1..], *span, ctx, registry)
        }
        Some("if") if ctx.direct_return_region && ctx.expr_context == ExprContext::Statement => {
            emit_direct_if_statement(&values[1..], *span, ctx, registry)
        }
        _ => {
            let is_function_boundary = matches!(
                values.first().and_then(SExpr::as_atom),
                Some("function" | "function*" | "=>" | "lambda" | "async")
            );
            let saved_direct_region = ctx.direct_return_region;
            if is_function_boundary {
                ctx.direct_return_region = false;
            }
            let emitted = emit_kernel_children(values, *span, ctx, registry);
            ctx.direct_return_region = saved_direct_region;
            emitted
        }
    }
}

/// Preserve the exact try writer layout while assigning statement use to its
/// body, catch statements, and finally statements. The catch binder stays a
/// value slot.
fn emit_direct_try_children(
    values: &[SExpr],
    span: Span,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let mut emitted = Vec::with_capacity(values.len());
    if let Some(head) = values.first() {
        emitted.push(head.clone());
    }
    for child in values.iter().skip(1) {
        if let Some(items) = child.as_list()
            && let Some(marker) = items.first().and_then(SExpr::as_atom)
            && matches!(marker, "catch" | "finally")
        {
            let mut clause = vec![items[0].clone()];
            let body_start = if marker == "catch" && items.len() > 1 {
                clause.push(emit_in_context(
                    &items[1],
                    ExprContext::Value,
                    ctx,
                    registry,
                ));
                2
            } else {
                1
            };
            let saved_context = ctx.expr_context;
            ctx.expr_context = ExprContext::Statement;
            clause.extend(emit_body(&items[body_start..], ctx, registry));
            ctx.expr_context = saved_context;
            emitted.push(SExpr::List {
                values: clause,
                span: child.span(),
            });
        } else {
            let saved_context = ctx.expr_context;
            ctx.expr_context = ExprContext::Statement;
            emitted.extend(emit_body(std::slice::from_ref(child), ctx, registry));
            ctx.expr_context = saved_context;
        }
    }
    SExpr::List {
        values: emitted,
        span,
    }
}

fn emit_kernel_children(
    values: &[SExpr],
    span: Span,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let Some(head) = values.first() else {
        return SExpr::List {
            values: Vec::new(),
            span,
        };
    };
    let saved_ctx = ctx.expr_context;
    let mut new_values = Vec::with_capacity(values.len());
    new_values.push(head.clone());
    for (index, child) in values[1..].iter().enumerate() {
        let role = normalized_child_role(head, index);
        let inherited_statement_sequence =
            role == ChildRole::InheritedSequence && saved_ctx == ExprContext::Statement;
        if role == ChildRole::StatementSequence || inherited_statement_sequence {
            ctx.expr_context = ExprContext::Statement;
            new_values.extend(emit_body(&values[index + 1..], ctx, registry));
            break;
        }
        ctx.expr_context = child_use(role, ExprUse::from_expr_context(saved_ctx)).to_expr_context();
        new_values.push(emit_expr(child, ctx, registry));
    }
    ctx.expr_context = saved_ctx;
    SExpr::List {
        values: new_values,
        span,
    }
}

fn emit_kernel_object(
    values: &[SExpr],
    span: Span,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let mut emitted = Vec::with_capacity(values.len());
    if let Some(head) = values.first() {
        emitted.push(head.clone());
    }
    emitted.extend(
        values
            .iter()
            .skip(1)
            .map(|property| emit_kernel_object_property(property, ctx, registry)),
    );
    SExpr::List {
        values: emitted,
        span,
    }
}

fn emit_kernel_object_property(
    property: &SExpr,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let role = object_property_role(property);
    match role {
        ObjectPropertyRole::Shorthand => property.clone(),
        ObjectPropertyRole::Value => emit_in_context(property, ExprContext::Value, ctx, registry),
        ObjectPropertyRole::Pair | ObjectPropertyRole::Dynamic | ObjectPropertyRole::Computed => {
            let SExpr::List { values, span } = property else {
                return property.clone();
            };
            let mut emitted = values.clone();
            match role {
                ObjectPropertyRole::Dynamic => {
                    if let Some(key) = emitted.first_mut() {
                        *key = emit_in_context(key, ExprContext::Value, ctx, registry);
                    }
                }
                ObjectPropertyRole::Computed => {
                    if let Some((mut marker, marker_span)) = emitted.first().and_then(|item| {
                        if let SExpr::List { values, span } = item {
                            Some((values.clone(), *span))
                        } else {
                            None
                        }
                    }) {
                        if let Some(key) = marker.get_mut(1) {
                            *key = emit_in_context(key, ExprContext::Value, ctx, registry);
                        }
                        emitted[0] = SExpr::List {
                            values: marker,
                            span: marker_span,
                        };
                    }
                }
                ObjectPropertyRole::Pair
                | ObjectPropertyRole::Shorthand
                | ObjectPropertyRole::Value => {}
            }
            if let Some(value) = emitted.get_mut(1) {
                *value = emit_in_context(value, ExprContext::Value, ctx, registry);
            }
            SExpr::List {
                values: emitted,
                span: *span,
            }
        }
    }
}

/// Emit a kernel switch using its clause roles rather than the generic call
/// recursion. The code generator consumes each clause's first item as its case
/// test and the rest as statements.
fn emit_switch_children(
    values: &[SExpr],
    span: Span,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let mut emitted = Vec::with_capacity(values.len());
    emitted.push(values[0].clone());

    if let Some(discriminant) = values.get(1) {
        emitted.push(emit_in_context(
            discriminant,
            ExprContext::Value,
            ctx,
            registry,
        ));
        for clause in &values[2..] {
            let SExpr::List {
                values: clause_values,
                span: clause_span,
            } = clause
            else {
                // The writer ignores non-list clauses; retain them unchanged.
                emitted.push(clause.clone());
                continue;
            };
            if clause_values.is_empty() {
                // Empty clauses are also ignored by the writer.
                emitted.push(clause.clone());
                continue;
            }

            let mut emitted_clause = Vec::with_capacity(clause_values.len());
            let test = &clause_values[0];
            if test.as_atom() == Some("default") {
                // This raw marker is structural and its resolution tag belongs
                // to the original atom, so copy it without re-dispatching.
                emitted_clause.push(test.clone());
            } else {
                emitted_clause.push(emit_in_context(test, ExprContext::Value, ctx, registry));
            }
            let saved_context = ctx.expr_context;
            ctx.expr_context = ExprContext::Statement;
            emitted_clause.extend(emit_body(&clause_values[1..], ctx, registry));
            ctx.expr_context = saved_context;
            emitted.push(SExpr::List {
                values: emitted_clause,
                span: *clause_span,
            });
        }
    }

    SExpr::List {
        values: emitted,
        span,
    }
}

/// Lower a surface contract predicate in value position, restoring the
/// surrounding emitter context after recursive expression emission.
fn emit_contract_predicate(
    predicate: &SExpr,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let saved_ctx = ctx.expr_context;
    ctx.expr_context = ExprContext::Value;
    let emitted = emit_expr(predicate, ctx, registry);
    ctx.expr_context = saved_ctx;
    emitted
}

/// Emit a body (list of expressions), recursively expanding any nested surface
/// forms.
fn emit_body(body: &[SExpr], ctx: &mut EmitterContext, registry: &TypeRegistry) -> Vec<SExpr> {
    let mut out = Vec::new();
    for expr in body {
        if matches!(ctx.expr_context, ExprContext::Statement)
            && let Some(surface_form) = classify_statement_surface(expr)
        {
            out.extend(emit_form_inner(&surface_form, ctx, registry));
            continue;
        }
        out.push(emit_expr(expr, ctx, registry));
    }
    out
}

enum DirectTailResult {
    Value(SExpr),
    Statements(Vec<SExpr>),
}

#[derive(Clone)]
enum DirectDestination {
    Return,
    Assign(SExpr),
}

fn consume_direct_value(destination: &DirectDestination, value: SExpr) -> SExpr {
    match destination {
        DirectDestination::Return => list(vec![atom("return"), value]),
        DirectDestination::Assign(target) => list(vec![atom("="), target.clone(), value]),
    }
}

fn consume_direct_no_value(destination: &DirectDestination) -> SExpr {
    match destination {
        DirectDestination::Return => list(vec![atom("return")]),
        DirectDestination::Assign(target) => list(vec![
            atom("="),
            target.clone(),
            list(vec![atom("void"), num(0.0)]),
        ]),
    }
}

fn direct_statement_block(statements: Vec<SExpr>) -> SExpr {
    if statements.len() == 1
        && statements[0]
            .as_list()
            .and_then(|items| items.first())
            .and_then(SExpr::as_atom)
            == Some("block")
    {
        statements.into_iter().next().unwrap()
    } else {
        list(std::iter::once(atom("block")).chain(statements).collect())
    }
}

/// Evaluate a direct-region header as an ordinary value or as a statement
/// prefix followed by a private value. The private atom is finalized across
/// the complete emitted unit by the existing completion-value pass.
fn emit_direct_header_value(
    expr: &SExpr,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> (Vec<SExpr>, SExpr) {
    let id = ctx.next_completion_value_id();
    let destination_atom = SExpr::completion_value_atom(id, expr.span());
    let destination = DirectDestination::Assign(destination_atom.clone());
    match emit_direct_tail(expr, &destination, ctx, registry) {
        DirectTailResult::Value(value) => (Vec::new(), value),
        DirectTailResult::Statements(statements) => {
            let body = direct_statement_block(statements);
            (
                vec![list(vec![atom("let"), destination_atom.clone()]), body],
                destination_atom,
            )
        }
    }
}

fn is_direct_lexical_call_head(head: &SExpr) -> bool {
    let Some(name) = head.as_atom() else {
        return false;
    };
    head.name_res() == NameRes::BindingRef
        && !name.contains(':')
        && !matches!(name, "eval" | "super" | "new" | "dynamic-import")
}

fn is_normalized_spread_argument(value: &SExpr) -> bool {
    value.as_list().is_some_and(|values| {
        values.len() == 2 && values[0].as_form_head() == Some("spread")
    })
}

/// Preserve the callee and earlier arguments when a lexical call needs direct
/// prefixes for one or more later arguments. With no prefixes, the ordinary
/// call stays in its existing expression form, including plain spreads.
fn emit_direct_lexical_call(
    expr: &SExpr,
    destination: Option<&DirectDestination>,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> DirectTailResult {
    let Some(values) = expr.as_list() else {
        return DirectTailResult::Value(atom("undefined"));
    };
    let Some(head) = values.first() else {
        return DirectTailResult::Value(atom("undefined"));
    };

    let plans = values[1..]
        .iter()
        .map(|arg| emit_direct_header_value(arg, ctx, registry))
        .collect::<Vec<_>>();
    let last_prefix = plans.iter().rposition(|(prefix, _)| !prefix.is_empty());
    let Some(last_prefix) = last_prefix else {
        return DirectTailResult::Value(list(
            std::iter::once(head.clone())
                .chain(plans.into_iter().map(|(_, value)| value))
                .collect(),
        ));
    };

    if plans
        .iter()
        .any(|(_, value)| is_normalized_spread_argument(value))
    {
        ctx.record_fatal(codegen_error(
            "ordered lexical call with spread and lifted arguments is not supported",
            expr.span(),
        ));
        return DirectTailResult::Value(atom("undefined"));
    }

    let callee = SExpr::completion_value_atom(ctx.next_completion_value_id(), head.span());
    let mut statements = vec![list(vec![atom("const"), callee.clone(), head.clone()])];
    let mut args = Vec::with_capacity(plans.len());
    for (index, (prefix, value)) in plans.into_iter().enumerate() {
        if index > last_prefix {
            args.push(value);
        } else if prefix.is_empty() {
            let saved = SExpr::completion_value_atom(ctx.next_completion_value_id(), value.span());
            statements.push(list(vec![atom("const"), saved.clone(), value]));
            args.push(saved);
        } else {
            statements.extend(prefix);
            args.push(value);
        }
    }

    let call = list(std::iter::once(callee).chain(args).collect());
    statements.push(match destination {
        Some(destination) => consume_direct_value(destination, call),
        None => call,
    });
    DirectTailResult::Statements(statements)
}

fn emit_direct_logical(
    args: &[SExpr],
    operator: &str,
    destination: &DirectDestination,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
    preserve_variadic: bool,
) -> DirectTailResult {
    if args.len() < 2 {
        return emit_direct_value_tail(
            &list(
                std::iter::once(atom(operator))
                    .chain(args.iter().cloned())
                    .collect(),
            ),
            destination,
            ctx,
            registry,
        );
    }

    let id = ctx.next_completion_value_id();
    let value_atom = SExpr::completion_value_atom(id, args[0].span());
    let value_destination = DirectDestination::Assign(value_atom.clone());
    let plans: Vec<_> = args
        .iter()
        .map(|arg| emit_direct_tail(arg, &value_destination, ctx, registry))
        .collect();

    if plans
        .iter()
        .all(|plan| matches!(plan, DirectTailResult::Value(_)))
    {
        let values = plans
            .into_iter()
            .map(|plan| match plan {
                DirectTailResult::Value(value) => value,
                DirectTailResult::Statements(_) => unreachable!(),
            })
            .collect::<Vec<_>>();
        if preserve_variadic {
            return DirectTailResult::Value(list(
                std::iter::once(atom(operator)).chain(values).collect(),
            ));
        }
        let mut logical = values[0].clone();
        for value in &values[1..] {
            logical = list(vec![atom(operator), logical, value.clone()]);
        }
        return DirectTailResult::Value(logical);
    }

    let mut statements = vec![list(vec![atom("let"), value_atom.clone()])];
    for (index, plan) in plans.into_iter().enumerate() {
        let (branch, is_statement_plan) = match plan {
            DirectTailResult::Value(value) => {
                (vec![consume_direct_value(&value_destination, value)], false)
            }
            DirectTailResult::Statements(statements) => (statements, true),
        };
        if index == 0 {
            if is_statement_plan {
                statements.push(direct_statement_block(branch));
            } else {
                statements.extend(branch);
            }
            continue;
        }
        let condition = match operator {
            "&&" => value_atom.clone(),
            "||" => list(vec![atom("!"), value_atom.clone()]),
            "??" => list(vec![
                atom("||"),
                list(vec![atom("==="), value_atom.clone(), atom("null")]),
                list(vec![
                    atom("==="),
                    value_atom.clone(),
                    list(vec![atom("void"), num(0.0)]),
                ]),
            ]),
            _ => unreachable!("only recognized logical operators reach this path"),
        };
        statements.push(list(vec![
            atom("if"),
            condition,
            list(std::iter::once(atom("block")).chain(branch).collect()),
        ]));
    }
    statements.push(consume_direct_value(destination, value_atom));
    DirectTailResult::Statements(statements)
}

fn emit_direct_if_statement(
    args: &[SExpr],
    span: Span,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let Some(condition_expr) = args.first() else {
        return list(vec![atom("if")]);
    };
    let (prefix, condition) = emit_direct_header_value(condition_expr, ctx, registry);
    let mut statement = vec![atom("if"), condition];
    for branch in args.iter().skip(1) {
        statement.push(emit_in_context(
            branch,
            ExprContext::Statement,
            ctx,
            registry,
        ));
    }
    if prefix.is_empty() {
        return SExpr::List {
            values: statement,
            span,
        };
    }
    let mut block = vec![atom("block")];
    block.extend(prefix);
    block.push(SExpr::List {
        values: statement,
        span,
    });
    list(block)
}

fn emit_direct_if_tail(
    args: &[SExpr],
    span: Span,
    destination: &DirectDestination,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> DirectTailResult {
    if args.len() < 3 {
        ctx.record_fatal(codegen_error(
            "if in expression position requires an else branch",
            span,
        ));
        return DirectTailResult::Value(atom("undefined"));
    }
    let (condition_prefix, condition) = emit_direct_header_value(&args[0], ctx, registry);
    let consequent = emit_direct_tail(&args[1], destination, ctx, registry);
    let alternate = emit_direct_tail(&args[2], destination, ctx, registry);
    match (consequent, alternate) {
        (DirectTailResult::Value(then_value), DirectTailResult::Value(else_value)) => {
            if condition_prefix.is_empty() {
                DirectTailResult::Value(list(vec![atom("?"), condition, then_value, else_value]))
            } else {
                DirectTailResult::Statements(vec![list(
                    std::iter::once(atom("block"))
                        .chain(condition_prefix)
                        .chain(std::iter::once(list(vec![
                            atom("if"),
                            condition,
                            list(vec![
                                atom("block"),
                                consume_direct_value(destination, then_value),
                            ]),
                            list(vec![
                                atom("block"),
                                consume_direct_value(destination, else_value),
                            ]),
                        ])))
                        .collect(),
                )])
            }
        }
        (then_result, else_result) => {
            let conditional = list(vec![
                atom("if"),
                condition,
                list(
                    std::iter::once(atom("block"))
                        .chain(direct_destination_arm(then_result, destination))
                        .collect(),
                ),
                list(
                    std::iter::once(atom("block"))
                        .chain(direct_destination_arm(else_result, destination))
                        .collect(),
                ),
            ]);
            if condition_prefix.is_empty() {
                DirectTailResult::Statements(vec![conditional])
            } else {
                DirectTailResult::Statements(vec![list(
                    std::iter::once(atom("block"))
                        .chain(condition_prefix)
                        .chain(std::iter::once(conditional))
                        .collect(),
                )])
            }
        }
    }
}

fn emit_direct_value_tail(
    expr: &SExpr,
    destination: &DirectDestination,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> DirectTailResult {
    let value = emit_in_context(expr, ExprContext::Value, ctx, registry);
    if is_statement_form(&value) {
        let mut statements = vec![value.clone()];
        if !is_control_transfer_last_expr(&value) {
            statements.push(consume_direct_no_value(destination));
        }
        DirectTailResult::Statements(statements)
    } else {
        DirectTailResult::Value(value)
    }
}

/// Emit an ordinary source result directly to its private Return or Assign
/// destination. Statement results stay in lexical regions, preserving loop
/// transfers and source function exits.
fn emit_direct_tail(
    expr: &SExpr,
    destination: &DirectDestination,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> DirectTailResult {
    let Some(values) = expr.as_list() else {
        return emit_direct_value_tail(expr, destination, ctx, registry);
    };
    if values.first().is_some_and(is_direct_lexical_call_head) {
        return emit_direct_lexical_call(expr, Some(destination), ctx, registry);
    }
    let Some(head) = values.first().and_then(SExpr::as_form_head) else {
        return emit_direct_value_tail(expr, destination, ctx, registry);
    };

    match head {
        "if" => emit_direct_if_tail(&values[1..], expr.span(), destination, ctx, registry),
        "and" | "or" => match crate::classifier::classify_expr(expr) {
            Ok(SurfaceForm::And { args, .. }) => {
                emit_direct_logical(&args, "&&", destination, ctx, registry, false)
            }
            Ok(SurfaceForm::Or { args, .. }) => {
                emit_direct_logical(&args, "||", destination, ctx, registry, false)
            }
            _ => emit_direct_value_tail(expr, destination, ctx, registry),
        },
        "return" => DirectTailResult::Statements(vec![emit_direct_return(
            &values[1..],
            expr.span(),
            ctx,
            registry,
        )]),
        "do" => match crate::classifier::classify_expr(expr) {
            Ok(SurfaceForm::Do { body, .. }) => {
                let body = emit_direct_consumed_body(&body, destination, ctx, registry);
                DirectTailResult::Statements(vec![list(
                    std::iter::once(atom("block")).chain(body).collect(),
                )])
            }
            _ => emit_direct_value_tail(expr, destination, ctx, registry),
        },
        "match" => match crate::classifier::classify_expr(expr) {
            Ok(SurfaceForm::Match {
                target, clauses, ..
            }) => DirectTailResult::Statements(vec![emit_match_statement_inner(
                &target,
                &clauses,
                Some(destination),
                ctx,
                registry,
            )]),
            _ => emit_direct_value_tail(expr, destination, ctx, registry),
        },
        "&&" | "||" | "??" if values.len() >= 3 => {
            emit_direct_logical(&values[1..], head, destination, ctx, registry, true)
        }
        "kernel:if" | "kernel:return" | "kernel:throw" | "kernel:break" | "kernel:continue"
        | "kernel:&&" | "kernel:||" | "kernel:??" => {
            let kernel_form = head.strip_prefix("kernel:").unwrap();
            match crate::classifier::forms::classify_kernel_escape(kernel_form, values, expr.span())
            {
                Ok(raw) if matches!(kernel_form, "&&" | "||" | "??") => {
                    let raw_values = raw.as_list().unwrap_or_default();
                    if raw_values.len() >= 3 {
                        emit_direct_logical(
                            &raw_values[1..],
                            kernel_form,
                            destination,
                            ctx,
                            registry,
                            true,
                        )
                    } else {
                        emit_direct_value_tail(expr, destination, ctx, registry)
                    }
                }
                Ok(raw) => emit_direct_tail(&raw, destination, ctx, registry),
                Err(error) => {
                    ctx.record_fatal(LyknError::Classify(error));
                    DirectTailResult::Statements(vec![list(vec![atom("return")])])
                }
            }
        }
        _ if is_statement_form(expr) => {
            let statement = emit_in_context(expr, ExprContext::Statement, ctx, registry);
            let mut statements = vec![statement.clone()];
            if !is_control_transfer_last_expr(&statement) {
                statements.push(consume_direct_no_value(destination));
            }
            DirectTailResult::Statements(statements)
        }
        _ => emit_direct_value_tail(expr, destination, ctx, registry),
    }
}

fn direct_destination_arm(result: DirectTailResult, destination: &DirectDestination) -> Vec<SExpr> {
    match result {
        DirectTailResult::Value(value) => vec![consume_direct_value(destination, value)],
        DirectTailResult::Statements(statements) => statements,
    }
}

fn emit_direct_return(
    args: &[SExpr],
    _span: Span,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let Some(value) = args.first() else {
        return list(vec![atom("return")]);
    };
    let destination = DirectDestination::Return;
    match emit_direct_tail(value, &destination, ctx, registry) {
        DirectTailResult::Value(value) => list(vec![atom("return"), value]),
        DirectTailResult::Statements(statements) => {
            if statements.len() == 1
                && statements[0]
                    .as_list()
                    .and_then(|items| items.first())
                    .and_then(SExpr::as_atom)
                    == Some("block")
            {
                statements.into_iter().next().unwrap()
            } else {
                list(std::iter::once(atom("block")).chain(statements).collect())
            }
        }
    }
}

fn emit_direct_consumed_body(
    body: &[SExpr],
    destination: &DirectDestination,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> Vec<SExpr> {
    if body.is_empty() {
        return vec![consume_direct_no_value(destination)];
    }
    let mut statements = Vec::new();
    let saved_context = ctx.expr_context;
    ctx.expr_context = ExprContext::Statement;
    statements.extend(emit_body(&body[..body.len() - 1], ctx, registry));
    ctx.expr_context = saved_context;
    match emit_direct_tail(body.last().unwrap(), destination, ctx, registry) {
        DirectTailResult::Value(value) => statements.push(consume_direct_value(destination, value)),
        DirectTailResult::Statements(tail) => statements.extend(tail),
    }
    statements
}

fn emit_direct_function_body(
    body: &[SExpr],
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> Vec<SExpr> {
    let mut statements = Vec::new();
    for (index, expr) in body.iter().enumerate() {
        if function_body_use(expr, index, body.len(), BodyPolicy::FunctionValueTail)
            == ExprUse::Statement
        {
            let saved_context = ctx.expr_context;
            ctx.expr_context = ExprContext::Statement;
            statements.extend(emit_body(std::slice::from_ref(expr), ctx, registry));
            ctx.expr_context = saved_context;
        } else {
            match emit_direct_tail(expr, &DirectDestination::Return, ctx, registry) {
                DirectTailResult::Value(value) => {
                    statements.push(list(vec![atom("return"), value]));
                }
                DirectTailResult::Statements(tail) => statements.extend(tail),
            }
        }
    }
    if body.is_empty() {
        statements.push(list(vec![atom("return"), atom("undefined")]));
    }
    statements
}

fn emit_function_body(
    body: &[SExpr],
    value_tail: bool,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> Vec<SExpr> {
    let mut out = Vec::new();
    for (index, expr) in body.iter().enumerate() {
        let policy = if value_tail {
            BodyPolicy::FunctionValueTail
        } else {
            BodyPolicy::Statements
        };
        let use_ = function_body_use(expr, index, body.len(), policy);
        if use_ != ExprUse::Statement {
            out.push(emit_in_context(expr, use_.to_expr_context(), ctx, registry));
        } else {
            let saved_context = ctx.expr_context;
            ctx.expr_context = ExprContext::Statement;
            out.extend(emit_body(std::slice::from_ref(expr), ctx, registry));
            ctx.expr_context = saved_context;
        }
    }
    out
}

fn emit_sequence_body(
    body: &[SExpr],
    parent: ExprUse,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> Vec<SExpr> {
    let mut out = Vec::new();
    for (index, expr) in body.iter().enumerate() {
        let use_ = sequence_use(index, body.len(), parent);
        if use_ == ExprUse::Statement {
            let saved = ctx.expr_context;
            ctx.expr_context = ExprContext::Statement;
            out.extend(emit_body(std::slice::from_ref(expr), ctx, registry));
            ctx.expr_context = saved;
        } else {
            out.push(emit_in_context(expr, use_.to_expr_context(), ctx, registry));
        }
    }
    out
}

fn classify_statement_surface(expr: &SExpr) -> Option<SurfaceForm> {
    let SExpr::List { values, .. } = expr else {
        return None;
    };
    let head = values.first().and_then(|v| v.as_form_head())?;
    if crate::classifier::dispatch::is_surface_form(head)
        || matches!(head, "async" | "export" | "class" | "class-expr")
    {
        crate::classifier::classify_expr(expr).ok()
    } else {
        None
    }
}

/// Convert a kernel `(if cond then else)` form to a ternary `(? cond then else)`.
///
/// In JavaScript, `if` is a statement and cannot appear in expression position
/// (e.g. `const x = if (...) ...` is invalid). When we need to assign the result
/// of a conditional to a variable, we must use a ternary expression instead.
///
/// If the expression is not an `(if ...)` form, it is returned unchanged.
/// Convert an already-emitted kernel form to expression position per DD-50.
///
/// Applied to the last expression of a function body when it needs to be
/// used as a value (e.g., assigned to a result variable for `:returns` check).
/// Uses the same classification logic as `emit_if_expression` to ensure
/// uniform Rule 1 (ternary vs IIFE) and Rule 2 (no-else compile error)
/// enforcement across all expression-position contexts.
fn is_valueless_last_expr(expr: &SExpr) -> bool {
    // DD-61 §A6: dispatch on the form head — a bound head is a call, not a
    // valueless statement form.
    if let SExpr::List { values, .. } = expr
        && let Some(head) = values.first().and_then(|e| e.as_form_head())
    {
        if head == "if" {
            return values.len() < 4;
        }
        if matches!(head, "return" | "throw" | "break" | "continue") {
            return false;
        }
        return is_statement_form(expr);
    }
    false
}

fn should_skip_return_wrap(expr: &SExpr) -> bool {
    is_valueless_last_expr(expr) || is_control_transfer_last_expr(expr)
}

fn is_control_transfer_last_expr(expr: &SExpr) -> bool {
    if let SExpr::List { values, .. } = expr
        && let Some(head) = values.first().and_then(|e| e.as_form_head())
    {
        return matches!(head, "return" | "throw" | "break" | "continue");
    }
    false
}

fn emit_returns_mismatch_error(
    func_name: &str,
    returns_type: &str,
    head_name: &str,
    span: Span,
    ctx: &mut EmitterContext,
) -> SExpr {
    ctx.record_fatal(codegen_error(
        format!(
            "COMPILE_ERROR: function `{func_name}` declared `:returns :{returns_type}` \
                     but body ends with `{head_name}` \
                     (a statement-only form which cannot produce a value). \
                     Either: (a) add a return-typed expression after the form, \
                     or (b) remove `:returns :{returns_type}` from the function declaration."
        ),
        span,
    ));
    atom("undefined")
}

fn convert_to_expression(expr: SExpr, ctx: &mut EmitterContext, origin: Span) -> SExpr {
    if let SExpr::List { values, span } = &expr
        && !values.is_empty()
        && values[0].as_atom() == Some("if")
    // A6-exempt: `if` is reserved (never bound); transforms an already-identified if-form (DD-50)
    {
        let args = &values[1..];

        // DD-50 Rule 2: no else in expression position → compile error
        if args.len() < 3 {
            ctx.record_fatal(codegen_error(
                "if in expression position requires an else branch",
                if *span == Span::default() {
                    origin
                } else {
                    *span
                },
            ));
            return atom("undefined");
        }

        let cond = args[0].clone();
        let then_branch = convert_to_expression(args[1].clone(), ctx, origin);
        let else_branch = convert_to_expression(args[2].clone(), ctx, origin);

        if !is_statement_form(&then_branch) && !is_statement_form(&else_branch) {
            // Both branches are pure expressions → ternary
            list(vec![atom("?"), cond, then_branch, else_branch])
        } else {
            // Statement-form branches → IIFE
            emit_if_iife(cond, then_branch, else_branch)
        }
    } else {
        expr
    }
}

// ---------------------------------------------------------------------------
// js: namespace interop (DD-15)
// ---------------------------------------------------------------------------

/// Emit a `js:` namespace form. These are simple syntactic rewrites:
/// - `(js:call method args...)` → `(method args...)`
/// - `(js:bind obj:method obj)` → `(obj:method:bind obj)`
/// - `(js:eval code)` → `(eval code)`
/// - `(js:eq a b)` → `(== a b)`
/// - `(js:typeof x)` → `(typeof x)`
fn emit_js_interop(
    form: &str,
    args: &[SExpr],
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    match form {
        "js:call" => {
            // (js:call method args...) → (method args...)
            let items: Vec<SExpr> = args.iter().map(|a| emit_expr(a, ctx, registry)).collect();
            list(items)
        }
        "js:bind" => {
            // (js:bind obj:method obj) → (obj:method:bind obj)
            if let Some(method) = args.first().and_then(|e| e.as_atom()) {
                let this_arg = if args.len() > 1 {
                    emit_expr(&args[1], ctx, registry)
                } else {
                    atom("undefined")
                };
                list(vec![atom(&format!("{method}:bind")), this_arg])
            } else {
                // Fallback: pass through
                let mut items = vec![atom(form)];
                items.extend(args.iter().map(|a| emit_expr(a, ctx, registry)));
                list(items)
            }
        }
        "js:eval" => {
            // (js:eval code) → (eval code)
            let code = args
                .first()
                .map(|a| emit_expr(a, ctx, registry))
                .unwrap_or_else(|| atom("undefined"));
            list(vec![atom("eval"), code])
        }
        "js:eq" => {
            // (js:eq a b) → (== a b)
            let a = args
                .first()
                .map(|x| emit_expr(x, ctx, registry))
                .unwrap_or_else(|| atom("undefined"));
            let b = args
                .get(1)
                .map(|x| emit_expr(x, ctx, registry))
                .unwrap_or_else(|| atom("undefined"));
            list(vec![atom("=="), a, b])
        }
        "js:typeof" => {
            // (js:typeof x) → (typeof x)
            let x = args
                .first()
                .map(|a| emit_expr(a, ctx, registry))
                .unwrap_or_else(|| atom("undefined"));
            list(vec![atom("typeof"), x])
        }
        _ => {
            // Unknown js: form — pass through as function call
            let mut items = vec![atom(form)];
            items.extend(args.iter().map(|a| emit_expr(a, ctx, registry)));
            list(items)
        }
    }
}

// ---------------------------------------------------------------------------
// Simple forms
// ---------------------------------------------------------------------------

fn emit_bind(
    name: &SExpr,
    type_ann: Option<&TypeAnnotation>,
    value: &SExpr,
    span: Span,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> Vec<SExpr> {
    let saved_ctx = ctx.expr_context;
    let mut prefix = Vec::new();
    let emitted_value =
        if ctx.direct_return_region && saved_ctx == ExprContext::Statement && name.is_atom() {
            let id = ctx.next_completion_value_id();
            let destination_atom = SExpr::completion_value_atom(id, name.span());
            let destination = DirectDestination::Assign(destination_atom.clone());
            match emit_direct_tail(value, &destination, ctx, registry) {
                DirectTailResult::Value(value) => value,
                DirectTailResult::Statements(statements) => {
                    prefix.push(list(vec![atom("let"), destination_atom.clone()]));
                    prefix.push(list(
                        std::iter::once(atom("block")).chain(statements).collect(),
                    ));
                    destination_atom
                }
            }
        } else {
            ctx.expr_context = ExprContext::Value;
            let emitted = emit_expr(value, ctx, registry);
            ctx.expr_context = saved_ctx;
            emitted
        };
    ctx.expr_context = saved_ctx;
    let const_form = list(vec![atom("const"), name.clone(), emitted_value]);
    prefix.push(const_form);

    let type_kw = match type_ann {
        Some(ta) => &ta.name,
        None => return prefix,
    };

    // :any → no runtime check
    if type_kw == "any" {
        return prefix;
    }

    // When strip_assertions is set, skip the runtime check
    if ctx.strip_assertions {
        return prefix;
    }

    // If the value is a literal whose type matches, no check needed.
    // If it's a literal that mismatches, the analysis pass should have
    // caught it, but we still skip the check (the code won't reach codegen
    // in a well-formed pipeline).
    if literal_type_name(value).is_some() {
        return prefix;
    }

    // Non-literal value: emit const + runtime type check
    let name_str = name.as_atom().unwrap_or("<expr>");
    if let Some(check) = emit_type_check(name_str, type_kw, "bind", "binding", span) {
        prefix.push(check);
    }
    prefix
}

fn emit_bind_group(
    bindings: &[BindBinding],
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> Vec<SExpr> {
    let mut out = Vec::new();
    for binding in bindings {
        out.extend(emit_bind(
            &binding.name,
            binding.type_ann.as_ref(),
            &binding.value,
            binding.span,
            ctx,
            registry,
        ));
    }
    out
}

fn emit_exports(names: &[SExpr]) -> SExpr {
    let mut name_list = vec![atom("names")];
    name_list.extend(names.iter().cloned());
    list(vec![atom("export"), list(name_list)])
}

/// Return the JS type name for a literal `SExpr`, or `None` if it is not a
/// literal.
fn literal_type_name(expr: &SExpr) -> Option<&'static str> {
    match expr {
        SExpr::Number { .. } => Some("number"),
        SExpr::String { .. } => Some("string"),
        SExpr::Bool { .. } => Some("boolean"),
        SExpr::Null { .. } => Some("null"),
        a @ SExpr::Atom { .. } => match a.as_atom().unwrap() {
            "true" | "false" => Some("boolean"),
            "null" => Some("null"),
            "NaN" => Some("number"), // NaN is type "number" in JS but fails :number check
            _ => None,
        },
        SExpr::List { values, .. } => {
            // DD-61 §A6: a bound `array`/`obj` head is a call — its literal type
            // is unknown, so `as_form_head` (bound → `None`) yields `None` here.
            let head = values.first().and_then(|v| v.as_form_head())?;
            match head {
                "array" => Some("array"),
                "obj" | "object" => Some("object"),
                _ => None,
            }
        }
        _ => None,
    }
}

fn emit_obj(pairs: &[(String, SExpr)], ctx: &mut EmitterContext, registry: &TypeRegistry) -> SExpr {
    let saved_ctx = ctx.expr_context;
    ctx.expr_context = ExprContext::Value;
    let mut items = vec![atom("object")];
    for (key, val) in pairs {
        items.push(list(vec![atom(key), emit_expr(val, ctx, registry)]));
    }
    ctx.expr_context = saved_ctx;
    list(items)
}

fn emit_cell(value: &SExpr, ctx: &mut EmitterContext, registry: &TypeRegistry) -> SExpr {
    let saved_ctx = ctx.expr_context;
    ctx.expr_context = ExprContext::Value;
    let result = list(vec![
        atom("object"),
        list(vec![atom("value"), emit_expr(value, ctx, registry)]),
    ]);
    ctx.expr_context = saved_ctx;
    result
}

/// Resolve a cell target to a `:value` accessor.
///
/// For atoms, returns `name:value` directly. For complex expressions,
/// emits the expression and appends `:value` via property access.
fn resolve_cell_target(target: &SExpr, ctx: &mut EmitterContext, registry: &TypeRegistry) -> SExpr {
    if let Some(value) = target.as_atom() {
        atom(&format!("{value}:value"))
    } else {
        // Complex expression: emit and access :value property
        list(vec![
            atom("get"),
            emit_expr(target, ctx, registry),
            str_lit("value"),
        ])
    }
}

fn emit_express(target: &SExpr, ctx: &mut EmitterContext, registry: &TypeRegistry) -> SExpr {
    resolve_cell_target(target, ctx, registry)
}

fn emit_swap(
    target: &SExpr,
    func: &SExpr,
    extra_args: &[SExpr],
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let target_val = resolve_cell_target(target, ctx, registry);

    let mut call_args = vec![emit_expr(func, ctx, registry), target_val.clone()];
    for arg in extra_args {
        call_args.push(emit_expr(arg, ctx, registry));
    }

    list(vec![atom("="), target_val, list(call_args)])
}

fn emit_reset(
    target: &SExpr,
    value: &SExpr,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let target_val = resolve_cell_target(target, ctx, registry);
    list(vec![atom("="), target_val, emit_expr(value, ctx, registry)])
}

// ---------------------------------------------------------------------------
// Equality and logical operators (DD-22)
// ---------------------------------------------------------------------------

/// `(= a b)` → `(=== a b)`
/// `(= a b c)` → `(&& (=== a b) (=== b c))` (variadic, pairwise, left-fold)
fn emit_eq(args: &[SExpr], ctx: &mut EmitterContext, registry: &TypeRegistry) -> SExpr {
    let emitted: Vec<SExpr> = args.iter().map(|a| emit_expr(a, ctx, registry)).collect();

    if emitted.len() == 2 {
        return list(vec![atom("==="), emitted[0].clone(), emitted[1].clone()]);
    }

    // Variadic: pairwise comparisons, left-folded with &&
    let mut checks: Vec<SExpr> = Vec::new();
    for i in 0..emitted.len() - 1 {
        checks.push(list(vec![
            atom("==="),
            emitted[i].clone(),
            emitted[i + 1].clone(),
        ]));
    }
    let mut result = checks[0].clone();
    for check in &checks[1..] {
        result = list(vec![atom("&&"), result, check.clone()]);
    }
    result
}

/// `(!= a b)` → `(!== a b)`
fn emit_not_eq(
    left: &SExpr,
    right: &SExpr,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    list(vec![
        atom("!=="),
        emit_expr(left, ctx, registry),
        emit_expr(right, ctx, registry),
    ])
}

/// `(and a b)` → `(&& a b)`
/// `(and a b c d)` → `(&& (&& (&& a b) c) d)` (variadic, left-fold)
fn emit_and(args: &[SExpr], ctx: &mut EmitterContext, registry: &TypeRegistry) -> SExpr {
    let emitted: Vec<SExpr> = args.iter().map(|a| emit_expr(a, ctx, registry)).collect();
    let mut result = emitted[0].clone();
    for arg in &emitted[1..] {
        result = list(vec![atom("&&"), result, arg.clone()]);
    }
    result
}

/// `(or a b)` → `(|| a b)`
/// `(or a b c d)` → `(|| (|| (|| a b) c) d)` (variadic, left-fold)
fn emit_or(args: &[SExpr], ctx: &mut EmitterContext, registry: &TypeRegistry) -> SExpr {
    let emitted: Vec<SExpr> = args.iter().map(|a| emit_expr(a, ctx, registry)).collect();
    let mut result = emitted[0].clone();
    for arg in &emitted[1..] {
        result = list(vec![atom("||"), result, arg.clone()]);
    }
    result
}

/// `(not x)` → `(! x)`
fn emit_not(operand: &SExpr, ctx: &mut EmitterContext, registry: &TypeRegistry) -> SExpr {
    list(vec![atom("!"), emit_expr(operand, ctx, registry)])
}

// ---------------------------------------------------------------------------
// Conj / Assoc / Dissoc
// ---------------------------------------------------------------------------

/// `(conj arr value)` -> `(array (spread arr) value)`
fn emit_conj(
    arr: &SExpr,
    value: &SExpr,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    list(vec![
        atom("array"),
        list(vec![atom("spread"), emit_expr(arr, ctx, registry)]),
        emit_expr(value, ctx, registry),
    ])
}

/// `(assoc obj :k1 v1 :k2 v2)` -> `(object (spread obj) (k1 v1) (k2 v2))`
fn emit_assoc(
    obj: &SExpr,
    pairs: &[(String, SExpr)],
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let mut items = vec![
        atom("object"),
        list(vec![atom("spread"), emit_expr(obj, ctx, registry)]),
    ];
    for (key, val) in pairs {
        items.push(list(vec![atom(key), emit_expr(val, ctx, registry)]));
    }
    list(items)
}

/// `(dissoc obj :k1 :k2)` -> IIFE that destructures away the keys and returns the rest.
///
/// Produces:
/// ```text
/// ((=> ()
///   (const (object (alias k1 _discard0) (alias k2 _discard1) (rest _rest0)) obj)
///   (return _rest0)))
/// ```
fn emit_dissoc(
    obj: &SExpr,
    keys: &[String],
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let mut pattern_items = vec![atom("object")];
    for key in keys {
        let discard = ctx.gensym.next("_");
        pattern_items.push(list(vec![atom("alias"), atom(key), atom(&discard)]));
    }
    let rest_var = ctx.gensym.next("rest");
    pattern_items.push(list(vec![atom("rest"), atom(&rest_var)]));

    let pattern = list(pattern_items);
    let binding = list(vec![atom("const"), pattern, emit_expr(obj, ctx, registry)]);
    let ret = list(vec![atom("return"), atom(&rest_var)]);
    let arrow = list(vec![atom("=>"), list(vec![]), binding, ret]);
    list(vec![arrow])
}

// ---------------------------------------------------------------------------
// Threading
// ---------------------------------------------------------------------------

fn apply_threading_step(
    acc: SExpr,
    step: &ThreadingStep,
    first: bool,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    match step {
        ThreadingStep::Bare(expr) => {
            if let SExpr::Keyword { value, .. } = expr {
                // Bare keyword: method call on acc — :method → (. acc method)
                list(vec![atom("."), acc, atom(value)])
            } else {
                list(vec![emit_expr(expr, ctx, registry), acc])
            }
        }
        ThreadingStep::Call(exprs) => {
            if exprs.is_empty() {
                return acc;
            }
            // Check for keyword-headed step: (:method args...) → (. acc method args...)
            if let SExpr::Keyword { value, .. } = &exprs[0] {
                let rest: Vec<SExpr> = exprs[1..]
                    .iter()
                    .map(|e| emit_expr(e, ctx, registry))
                    .collect();
                let mut items = vec![atom("."), acc, atom(value)];
                items.extend(rest);
                return list(items);
            }
            let func = emit_expr(&exprs[0], ctx, registry);
            let rest: Vec<SExpr> = exprs[1..]
                .iter()
                .map(|e| emit_expr(e, ctx, registry))
                .collect();
            if first {
                // Thread-first: acc goes after func, before rest
                let mut items = vec![func, acc];
                items.extend(rest);
                list(items)
            } else {
                // Thread-last: acc goes at the end
                let mut items = vec![func];
                items.extend(rest);
                items.push(acc);
                list(items)
            }
        }
    }
}

fn emit_thread_first(
    initial: &SExpr,
    steps: &[ThreadingStep],
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let mut acc = emit_expr(initial, ctx, registry);
    for step in steps {
        acc = apply_threading_step(acc, step, true, ctx, registry);
    }
    acc
}

fn emit_thread_last(
    initial: &SExpr,
    steps: &[ThreadingStep],
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let mut acc = emit_expr(initial, ctx, registry);
    for step in steps {
        acc = apply_threading_step(acc, step, false, ctx, registry);
    }
    acc
}

// ---------------------------------------------------------------------------
// Some-threading (null-safe)
// ---------------------------------------------------------------------------

fn emit_some_thread(
    initial: &SExpr,
    steps: &[ThreadingStep],
    first: bool,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    // Await detection
    let initial_has_await = contains_await(initial);
    let steps_have_await = steps.iter().any(step_contains_await);

    // Strategy 1: hoist initial if it contains await
    let (hoist_stmt, init_expr) = if initial_has_await {
        let hoisted_var = ctx.gensym.next("await");
        let hoist = list(vec![
            atom("const"),
            atom(&hoisted_var),
            emit_expr(initial, ctx, registry),
        ]);
        (Some(hoist), atom(&hoisted_var))
    } else {
        (None, emit_expr(initial, ctx, registry))
    };

    // Build as IIFE: ((=> () body...))
    let mut body = Vec::new();
    let t0 = ctx.gensym.next("t");
    body.push(list(vec![atom("const"), atom(&t0), init_expr]));

    let mut prev = t0;
    for (i, step) in steps.iter().enumerate() {
        let is_last = i == steps.len() - 1;

        if !is_last {
            // Null check: (if (== prev null) (return prev))
            body.push(list(vec![
                atom("if"),
                list(vec![atom("=="), atom(&prev), atom("null")]),
                list(vec![atom("return"), atom(&prev)]),
            ]));
        }

        let acc = atom(&prev);
        let result = apply_threading_step(acc, step, first, ctx, registry);

        if is_last {
            // Null check before final return
            body.push(list(vec![
                atom("if"),
                list(vec![atom("=="), atom(&prev), atom("null")]),
                list(vec![atom("return"), atom(&prev)]),
            ]));
            body.push(list(vec![atom("return"), result]));
        } else {
            let tn = ctx.gensym.next("t");
            body.push(list(vec![atom("const"), atom(&tn), result]));
            prev = tn;
        }
    }

    // If no steps, just return the initial value
    if steps.is_empty() {
        body.push(list(vec![atom("return"), atom(&prev)]));
    }

    // Wrap in IIFE, with async wrapping if steps contain await
    let mut arrow = vec![atom("=>"), list(vec![])];
    arrow.extend(body);

    let iife = if steps_have_await {
        wrap_iife_async(arrow)
    } else {
        list(vec![list(arrow)])
    };

    // Combine: if we hoisted, emit block with hoist + iife
    if let Some(hoist) = hoist_stmt {
        list(vec![atom("block"), hoist, iife])
    } else {
        iife
    }
}

fn emit_some_thread_first(
    initial: &SExpr,
    steps: &[ThreadingStep],
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    emit_some_thread(initial, steps, true, ctx, registry)
}

fn emit_some_thread_last(
    initial: &SExpr,
    steps: &[ThreadingStep],
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    emit_some_thread(initial, steps, false, ctx, registry)
}

// ---------------------------------------------------------------------------
// Type emission
// ---------------------------------------------------------------------------

fn emit_type(
    constructors: &[Constructor],
    ctx: &mut EmitterContext,
    _registry: &TypeRegistry,
) -> Vec<SExpr> {
    let mut forms: Vec<SExpr> = Vec::new();

    for ctor in constructors {
        if ctor.fields.is_empty() {
            // Zero-field: (const Name (object (tag "Name")))
            forms.push(list(vec![
                atom("const"),
                atom(&ctor.name),
                list(vec![
                    atom("object"),
                    list(vec![atom("tag"), str_lit(&ctor.name)]),
                ]),
            ]));
        } else {
            // With fields:
            // (function Name (params...) [type-checks] (return (object (tag "Name") (f f) ...)))
            let param_names: Vec<SExpr> = ctor.fields.iter().map(|f| atom(&f.name)).collect();

            let mut body_items = vec![atom("function"), atom(&ctor.name), list(param_names)];

            // Type checks
            if !ctx.strip_assertions {
                for field in &ctor.fields {
                    if let Some(check) = emit_type_check(
                        &field.name,
                        &field.type_ann.name,
                        &ctor.name,
                        "field",
                        field.name_span,
                    ) {
                        body_items.push(check);
                    }
                }
            }

            // Return object
            let mut obj_fields = vec![atom("object"), list(vec![atom("tag"), str_lit(&ctor.name)])];
            for field in &ctor.fields {
                obj_fields.push(list(vec![atom(&field.name), atom(&field.name)]));
            }
            body_items.push(list(vec![atom("return"), list(obj_fields)]));

            forms.push(list(body_items));
        }
    }

    forms
}

// ---------------------------------------------------------------------------
// ParamShape helpers
// ---------------------------------------------------------------------------

/// Convert a ParamShape to kernel parameter name nodes.
fn param_to_kernel_names(p: &ParamShape) -> Vec<SExpr> {
    match p {
        ParamShape::Simple(tp) => {
            if tp.is_rest {
                vec![list(vec![atom("rest"), atom(&tp.name)])]
            } else if let Some(ref val) = tp.default_value {
                vec![list(vec![atom("default"), atom(&tp.name), val.clone()])]
            } else {
                vec![atom(&tp.name)]
            }
        }
        ParamShape::DestructuredObject { fields, .. } => {
            let mut items = vec![atom("object")];
            items.extend(fields.iter().map(|f| match f {
                DestructuredField::Simple(tp) => {
                    if let Some(ref val) = tp.default_value {
                        list(vec![atom("default"), atom(&tp.name), val.clone()])
                    } else {
                        atom(&tp.name)
                    }
                }
                DestructuredField::Nested {
                    alias_name,
                    pattern,
                    ..
                } => {
                    let inner = param_to_kernel_names(pattern);
                    let inner_node = if inner.len() == 1 {
                        inner.into_iter().next().unwrap()
                    } else {
                        list(inner)
                    };
                    list(vec![atom("alias"), atom(alias_name), inner_node])
                }
            }));
            vec![list(items)]
        }
        ParamShape::DestructuredArray { elements, .. } => {
            let mut items = vec![atom("array")];
            items.extend(elements.iter().map(|e| match e {
                ArrayParamElement::Typed(tp) => {
                    if let Some(ref val) = tp.default_value {
                        list(vec![atom("default"), atom(&tp.name), val.clone()])
                    } else {
                        atom(&tp.name)
                    }
                }
                ArrayParamElement::Rest(tp) => list(vec![atom("rest"), atom(&tp.name)]),
                ArrayParamElement::Skip(_) => atom("_"),
                ArrayParamElement::Nested { pattern, .. } => {
                    let inner = param_to_kernel_names(pattern);
                    if inner.len() == 1 {
                        inner.into_iter().next().unwrap()
                    } else {
                        list(inner)
                    }
                }
                ArrayParamElement::NestedWithAlias {
                    alias_name,
                    pattern,
                    ..
                } => {
                    let inner = param_to_kernel_names(pattern);
                    let inner_node = if inner.len() == 1 {
                        inner.into_iter().next().unwrap()
                    } else {
                        list(inner)
                    };
                    list(vec![atom("alias"), atom(alias_name), inner_node])
                }
            }));
            vec![list(items)]
        }
    }
}

/// Emit type checks for all typed fields in a ParamShape.
fn param_type_checks(p: &ParamShape, func_name: &str, label: &str) -> Vec<SExpr> {
    p.typed_params()
        .iter()
        .filter_map(|tp| {
            if tp.type_ann.name == "any" {
                return None;
            }
            if tp.is_rest {
                // For rest params, emit a for-of loop that checks each element
                let el_var = format!("_el__{}", tp.name);
                let check = emit_type_check(
                    &el_var,
                    &tp.type_ann.name,
                    func_name,
                    "rest arg",
                    tp.name_span,
                )?;
                return Some(list(vec![
                    atom("for-of"),
                    atom(&el_var),
                    atom(&tp.name),
                    check,
                ]));
            }
            emit_type_check(&tp.name, &tp.type_ann.name, func_name, label, tp.name_span)
        })
        .collect()
}

// ---------------------------------------------------------------------------
// Fn / Lambda emission
// ---------------------------------------------------------------------------

fn emit_fn_expr(
    params: &[ParamShape],
    body: &[SExpr],
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let saved_direct_region = ctx.direct_return_region;
    ctx.direct_return_region = false;
    let param_names: Vec<SExpr> = params.iter().flat_map(param_to_kernel_names).collect();

    let mut items = vec![atom("=>"), list(param_names)];

    // Type checks
    let mut has_type_checks = false;
    if !ctx.strip_assertions {
        for param in params {
            let checks = param_type_checks(param, "anonymous", "arg");
            if !checks.is_empty() {
                has_type_checks = true;
                items.extend(checks);
            }
        }
    }

    // When type checks are present, the arrow gets a block body, so we must
    // wrap the last body expression in (return ...) to preserve the return value.
    // DD-50.7: fn body children are statements, not expressions
    let emitted_body = emit_function_body(body, true, ctx, registry);
    if (has_type_checks || emitted_body.len() > 1) && !emitted_body.is_empty() {
        items.extend(emitted_body[..emitted_body.len() - 1].iter().cloned());
        let last = emitted_body.last().unwrap().clone();
        // DD-50.6: skip return wrap for statement-only last expressions
        if should_skip_return_wrap(&last) {
            items.push(last);
        } else {
            let converted = convert_to_expression(last, ctx, Span::default());
            items.push(list(vec![atom("return"), converted]));
        }
    } else {
        items.extend(emitted_body);
    }
    ctx.direct_return_region = saved_direct_region;
    list(items)
}

// ---------------------------------------------------------------------------
// Func emission
// ---------------------------------------------------------------------------

fn emit_func(
    name: &str,
    _name_span: Span,
    clauses: &[FuncClause],
    span: Span,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> Vec<SExpr> {
    if clauses.len() == 1 {
        vec![emit_func_single(name, &clauses[0], span, ctx, registry)]
    } else {
        vec![emit_func_multi(name, clauses, span, ctx, registry)]
    }
}

fn emit_func_single(
    name: &str,
    clause: &FuncClause,
    _span: Span,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let param_names: Vec<SExpr> = clause.args.iter().flat_map(param_to_kernel_names).collect();

    let mut items = vec![atom("function"), atom(name), list(param_names)];

    // Type checks for parameters
    if !ctx.strip_assertions {
        for param in &clause.args {
            items.extend(param_type_checks(param, name, "arg"));
        }
    }

    // Pre-condition
    if !ctx.strip_assertions
        && let Some(ref pre) = clause.pre
    {
        let predicate = emit_contract_predicate(pre, ctx, registry);
        items.push(emit_pre_check_with_predicate(
            name,
            pre,
            predicate,
            clause.span,
        ));
    }

    // Determine return handling
    let has_post = clause.post.is_some();
    let returns_void = clause.returns.as_ref().is_some_and(|r| r.name == "void");
    let returns_any = clause.returns.as_ref().is_some_and(|r| r.name == "any");
    let has_returns = clause.returns.is_some();
    let protect_statement_match =
        !ctx.strip_assertions && (has_post || (has_returns && !returns_any && !returns_void));
    // Function prefixes are statements; a non-void implicit tail is a value.
    let saved_legacy_match = ctx.legacy_statement_match;
    let direct_return = !has_post && !returns_void && (!has_returns || returns_any);
    let saved_direct_region = ctx.direct_return_region;
    ctx.legacy_statement_match |= protect_statement_match;
    ctx.direct_return_region = direct_return;
    let body = if direct_return {
        emit_direct_function_body(&clause.body, ctx, registry)
    } else {
        emit_function_body(&clause.body, !returns_void, ctx, registry)
    };
    ctx.legacy_statement_match = saved_legacy_match;
    ctx.direct_return_region = saved_direct_region;

    if direct_return {
        items.extend(body);
    } else if has_post && !ctx.strip_assertions {
        // Capture result in gensym, check post, return
        let result_var = ctx.gensym.next("result");
        let last_expr = if body.len() == 1 {
            body[0].clone()
        } else {
            // Multiple body exprs: emit all but last as statements, last as value
            for expr in &body[..body.len() - 1] {
                items.push(expr.clone());
            }
            body[body.len() - 1].clone()
        };
        // DD-50.6: check if last expression can't produce a value
        if is_valueless_last_expr(&last_expr) {
            let head_name = last_expr
                .as_list()
                .and_then(|v| v.first())
                .and_then(|e| e.as_atom())
                .unwrap_or("<unknown>");
            let ret_name = clause
                .returns
                .as_ref()
                .map(|r| r.name.as_str())
                .unwrap_or("<unknown>");
            items.push(emit_returns_mismatch_error(
                name,
                ret_name,
                head_name,
                clause.span,
                ctx,
            ));
        } else {
            let converted = convert_to_expression(last_expr, ctx, clause.span);
            items.push(list(vec![atom("const"), atom(&result_var), converted]));
            if let Some(ref post) = clause.post {
                let replaced = replace_tilde(post, &result_var);
                let predicate = emit_contract_predicate(&replaced, ctx, registry);
                items.push(emit_post_check_with_predicate(
                    name,
                    post,
                    predicate,
                    clause.span,
                ));
            }
            items.push(list(vec![atom("return"), atom(&result_var)]));
        }
    } else if returns_void {
        // Void: just body, no return
        items.extend(body);
    } else if has_returns && !returns_any {
        // Has a typed return: type check result, return
        if body.len() > 1 {
            for expr in &body[..body.len() - 1] {
                items.push(expr.clone());
            }
        }
        let last = if body.is_empty() {
            atom("undefined")
        } else {
            body[body.len() - 1].clone()
        };

        // DD-50.6: check if last expression can't produce a value
        if is_valueless_last_expr(&last) {
            let head_name = last
                .as_list()
                .and_then(|v| v.first())
                .and_then(|e| e.as_atom())
                .unwrap_or("<unknown>");
            let ret_name = clause
                .returns
                .as_ref()
                .map(|r| r.name.as_str())
                .unwrap_or("<unknown>");
            items.push(emit_returns_mismatch_error(
                name,
                ret_name,
                head_name,
                clause.span,
                ctx,
            ));
        } else if !ctx.strip_assertions {
            if let Some(ref ret) = clause.returns {
                let result_var = ctx.gensym.next("result");
                let converted = convert_to_expression(last, ctx, clause.span);
                items.push(list(vec![atom("const"), atom(&result_var), converted]));
                if let Some(check) = emit_return_type_check(&result_var, &ret.name, name, ret.span)
                {
                    items.push(check);
                }
                items.push(list(vec![atom("return"), atom(&result_var)]));
            }
        } else {
            items.push(list(vec![atom("return"), last]));
        }
    } else {
        // Implicit return of last expression
        if body.len() > 1 {
            for expr in &body[..body.len() - 1] {
                items.push(expr.clone());
            }
        }
        let last = if body.is_empty() {
            atom("undefined")
        } else {
            body[body.len() - 1].clone()
        };
        // DD-50.6: skip return wrap for statement-only last expressions
        if should_skip_return_wrap(&last) {
            items.push(last);
        } else {
            let converted = convert_to_expression(last, ctx, clause.span);
            items.push(list(vec![atom("return"), converted]));
        }
    }

    list(items)
}

fn emit_func_multi(
    name: &str,
    clauses: &[FuncClause],
    _span: Span,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let saved_direct_region = ctx.direct_return_region;
    ctx.direct_return_region = false;
    // Sort clauses: longer arity first, more typed first
    let mut sorted_indices: Vec<usize> = (0..clauses.len()).collect();
    sorted_indices.sort_by(|&a, &b| {
        let ca = &clauses[a];
        let cb = &clauses[b];
        // Longer arity first
        let arity_cmp = cb.args.len().cmp(&ca.args.len());
        if arity_cmp != std::cmp::Ordering::Equal {
            return arity_cmp;
        }
        // More typed args first
        let typed_a = ca
            .args
            .iter()
            .filter(|p| p.dispatch_type() != "any")
            .count();
        let typed_b = cb
            .args
            .iter()
            .filter(|p| p.dispatch_type() != "any")
            .count();
        typed_b.cmp(&typed_a)
    });

    let mut items = vec![
        atom("function"),
        atom(name),
        list(vec![list(vec![atom("rest"), atom("args")])]),
    ];

    for &idx in &sorted_indices {
        let clause = &clauses[idx];
        let arity = clause.args.len();

        // Build dispatch condition: (=== args:length N) && type dispatch checks
        let mut conditions = vec![list(vec![
            atom("==="),
            atom("args:length"),
            num(arity as f64),
        ])];

        // Type dispatch checks (only for non-any types)
        for (i, param) in clause.args.iter().enumerate() {
            let dtype = param.dispatch_type();
            if dtype != "any" {
                let arg_access = list(vec![atom("get"), atom("args"), num(i as f64)]);
                let dispatch_check = build_dispatch_check(dtype, &arg_access);
                if let Some(check) = dispatch_check {
                    conditions.push(check);
                }
            }
        }

        let condition = if conditions.len() == 1 {
            conditions.into_iter().next().unwrap()
        } else {
            let mut and_expr = vec![atom("&&")];
            and_expr.extend(conditions);
            list(and_expr)
        };

        // Build clause body block
        let mut block_items = vec![atom("block")];

        // Bind parameters from args array
        for (i, param) in clause.args.iter().enumerate() {
            let arg_access = list(vec![atom("get"), atom("args"), num(i as f64)]);
            let binding = param_to_kernel_names(param);
            if binding.len() == 1 {
                block_items.push(list(vec![
                    atom("const"),
                    binding.into_iter().next().unwrap(),
                    arg_access,
                ]));
            }
        }

        // Full type checks
        if !ctx.strip_assertions {
            for param in &clause.args {
                block_items.extend(param_type_checks(param, name, "arg"));
            }
        }

        // Pre-condition
        if !ctx.strip_assertions
            && let Some(ref pre) = clause.pre
        {
            let predicate = emit_contract_predicate(pre, ctx, registry);
            block_items.push(emit_pre_check_with_predicate(
                name,
                pre,
                predicate,
                clause.span,
            ));
        }

        // DD-50.7: func body children are statements, not expressions
        let saved_body_ctx = ctx.expr_context;
        let saved_legacy_match = ctx.legacy_statement_match;
        ctx.legacy_statement_match |= !ctx.strip_assertions && clause.post.is_some();
        ctx.expr_context = ExprContext::Statement;
        let body = emit_body(&clause.body, ctx, registry);
        ctx.expr_context = saved_body_ctx;
        ctx.legacy_statement_match = saved_legacy_match;
        let has_post = clause.post.is_some();

        if has_post && !ctx.strip_assertions {
            let result_var = ctx.gensym.next("result");
            if body.len() > 1 {
                block_items.extend(body[..body.len() - 1].to_vec());
            }
            let last = if body.is_empty() {
                atom("undefined")
            } else {
                body[body.len() - 1].clone()
            };
            if is_valueless_last_expr(&last) {
                let head_name = last
                    .as_list()
                    .and_then(|v| v.first())
                    .and_then(|e| e.as_atom())
                    .unwrap_or("<unknown>");
                let ret_name = clause
                    .returns
                    .as_ref()
                    .map(|r| r.name.as_str())
                    .unwrap_or("<unknown>");
                block_items.push(emit_returns_mismatch_error(
                    name,
                    ret_name,
                    head_name,
                    clause.span,
                    ctx,
                ));
            } else {
                let converted = convert_to_expression(last, ctx, clause.span);
                block_items.push(list(vec![atom("const"), atom(&result_var), converted]));
                if let Some(ref post) = clause.post {
                    let replaced = replace_tilde(post, &result_var);
                    let predicate = emit_contract_predicate(&replaced, ctx, registry);
                    block_items.push(emit_post_check_with_predicate(
                        name,
                        post,
                        predicate,
                        clause.span,
                    ));
                }
                block_items.push(list(vec![atom("return"), atom(&result_var)]));
            }
        } else {
            if body.len() > 1 {
                block_items.extend(body[..body.len() - 1].to_vec());
            }
            let last = if body.is_empty() {
                atom("undefined")
            } else {
                body[body.len() - 1].clone()
            };
            // DD-50.6: skip return wrap for statement-only last expressions
            if should_skip_return_wrap(&last) {
                block_items.push(last);
            } else {
                let converted = convert_to_expression(last, ctx, clause.span);
                block_items.push(list(vec![atom("return"), converted]));
            }
        }

        items.push(list(vec![atom("if"), condition, list(block_items)]));
    }

    // Final throw for no matching clause
    items.push(list(vec![
        atom("throw"),
        list(vec![
            atom("new"),
            atom("TypeError"),
            str_lit(&format!("{name}: no matching clause for arguments")),
        ]),
    ]));

    ctx.direct_return_region = saved_direct_region;
    list(items)
}

/// Build a dispatch type check for multi-clause function overloading.
///
/// This is a simpler check than the full type check — it only tests the
/// typeof for dispatch purposes, without building an error message.
fn build_dispatch_check(type_keyword: &str, expr: &SExpr) -> Option<SExpr> {
    match type_keyword {
        "any" => None,
        "number" => Some(list(vec![
            atom("==="),
            list(vec![atom("typeof"), expr.clone()]),
            str_lit("number"),
        ])),
        "string" => Some(list(vec![
            atom("==="),
            list(vec![atom("typeof"), expr.clone()]),
            str_lit("string"),
        ])),
        "boolean" => Some(list(vec![
            atom("==="),
            list(vec![atom("typeof"), expr.clone()]),
            str_lit("boolean"),
        ])),
        "function" => Some(list(vec![
            atom("==="),
            list(vec![atom("typeof"), expr.clone()]),
            str_lit("function"),
        ])),
        "object" => Some(list(vec![
            atom("&&"),
            list(vec![
                atom("==="),
                list(vec![atom("typeof"), expr.clone()]),
                str_lit("object"),
            ]),
            list(vec![atom("!=="), expr.clone(), atom("null")]),
        ])),
        "array" => Some(list(vec![atom("Array:isArray"), expr.clone()])),
        // User-defined type: check it's a tagged object
        _ => Some(list(vec![
            atom("&&"),
            list(vec![
                atom("==="),
                list(vec![atom("typeof"), expr.clone()]),
                str_lit("object"),
            ]),
            list(vec![
                atom("&&"),
                list(vec![atom("!=="), expr.clone(), atom("null")]),
                list(vec![atom("in"), str_lit("tag"), expr.clone()]),
            ]),
        ])),
    }
}

// ---------------------------------------------------------------------------
// Genfunc / Genfn emission (generator functions)
// ---------------------------------------------------------------------------

fn emit_genfunc(
    name: &str,
    _name_span: Span,
    clauses: &[GenfuncClause],
    _span: Span,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> Vec<SExpr> {
    // For now, only single-clause genfunc is supported (matching JS behaviour)
    if clauses.len() == 1 {
        vec![emit_genfunc_single(name, &clauses[0], ctx, registry)]
    } else {
        // Multi-clause generators: emit each clause individually
        // For now, treat each as a single clause (future: dispatch like func_multi)
        vec![emit_genfunc_single(name, &clauses[0], ctx, registry)]
    }
}

fn emit_genfunc_single(
    name: &str,
    clause: &GenfuncClause,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let saved_direct_region = ctx.direct_return_region;
    ctx.direct_return_region = false;
    let param_names: Vec<SExpr> = clause.args.iter().flat_map(param_to_kernel_names).collect();

    let mut items = vec![atom("function*"), atom(name), list(param_names)];

    // Type checks for parameters
    if !ctx.strip_assertions {
        for param in &clause.args {
            items.extend(param_type_checks(param, name, "arg"));
        }
    }

    // Pre-condition
    if !ctx.strip_assertions
        && let Some(ref pre) = clause.pre
    {
        let predicate = emit_contract_predicate(pre, ctx, registry);
        items.push(emit_pre_check_with_predicate(
            name,
            pre,
            predicate,
            clause.span,
        ));
    }

    // DD-50.7: genfunc body children are statements, not expressions
    let raw_body = emit_function_body(&clause.body, false, ctx, registry);
    let body = if !ctx.strip_assertions {
        if let Some(ref yields_ann) = clause.yields {
            if yields_ann.name != "any" {
                raw_body
                    .into_iter()
                    .map(|expr| instrument_yields(&expr, &yields_ann.name, name, &mut ctx.gensym))
                    .collect()
            } else {
                raw_body
            }
        } else {
            raw_body
        }
    } else {
        raw_body
    };

    items.extend(body);

    ctx.direct_return_region = saved_direct_region;
    list(items)
}

fn emit_genfn_expr(
    params: &[ParamShape],
    yields: Option<&TypeAnnotation>,
    body: &[SExpr],
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let saved_direct_region = ctx.direct_return_region;
    ctx.direct_return_region = false;
    let param_names: Vec<SExpr> = params.iter().flat_map(param_to_kernel_names).collect();

    let mut items = vec![atom("function*"), list(param_names)];

    // Type checks
    if !ctx.strip_assertions {
        for param in params {
            items.extend(param_type_checks(param, "anonymous", "arg"));
        }
    }

    // DD-50.7: genfn body children are statements, not expressions
    let raw_body = emit_function_body(body, false, ctx, registry);
    let emitted_body = if !ctx.strip_assertions {
        if let Some(yields_ann) = yields {
            if yields_ann.name != "any" {
                raw_body
                    .into_iter()
                    .map(|expr| {
                        instrument_yields(&expr, &yields_ann.name, "anonymous", &mut ctx.gensym)
                    })
                    .collect()
            } else {
                raw_body
            }
        } else {
            raw_body
        }
    } else {
        raw_body
    };

    items.extend(emitted_body);

    ctx.direct_return_region = saved_direct_region;
    list(items)
}

/// Recursively walk an S-expression tree and instrument `(yield expr)` forms
/// with runtime type checks on the yielded value. Leaves `(yield* ...)` unchanged.
fn instrument_yields(
    expr: &SExpr,
    yields_type: &str,
    func_name: &str,
    gensym: &mut super::gensym::EmitterGensym,
) -> SExpr {
    match expr {
        SExpr::List { values, span } if !values.is_empty() => {
            // DD-61 §A6: a bound `yield` head is a call, not the yield form.
            let head = values[0].as_form_head();

            // (yield expr) -> instrument with type check IIFE
            if head == Some("yield") && values.len() >= 2 {
                let inner = instrument_yields(&values[1], yields_type, func_name, gensym);
                let var_name = gensym.next("yv");
                if let Some(check) =
                    emit_type_check(&var_name, yields_type, func_name, "yield", *span)
                {
                    let iife = list(vec![list(vec![
                        atom("=>"),
                        list(vec![]),
                        list(vec![atom("const"), atom(&var_name), inner]),
                        check,
                        list(vec![atom("return"), atom(&var_name)]),
                    ])]);
                    return SExpr::List {
                        values: vec![atom("yield"), iife],
                        span: *span,
                    };
                }
                return SExpr::List {
                    values: vec![atom("yield"), inner],
                    span: *span,
                };
            }

            // (yield* ...) -> leave as-is
            if head == Some("yield*") {
                return expr.clone();
            }

            // Recurse into all sub-expressions
            let new_values: Vec<SExpr> = values
                .iter()
                .map(|v| instrument_yields(v, yields_type, func_name, gensym))
                .collect();
            SExpr::List {
                values: new_values,
                span: *span,
            }
        }
        _ => expr.clone(),
    }
}

// ---------------------------------------------------------------------------
// Match emission
// ---------------------------------------------------------------------------

fn emit_match(
    target: &SExpr,
    clauses: &[MatchClause],
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    match ctx.expr_context {
        ExprContext::Statement if ctx.legacy_statement_match => {
            emit_match_statement_legacy(target, clauses, ctx, registry)
        }
        ExprContext::Statement => emit_match_statement(target, clauses, ctx, registry),
        _ => emit_match_iife(target, clauses, ctx, registry),
    }
}

/// Emit a statement match as ordered candidates in the surrounding lexical
/// region, preserving source return, break, and continue targets.
fn emit_match_statement(
    target: &SExpr,
    clauses: &[MatchClause],
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    emit_match_statement_inner(target, clauses, None, ctx, registry)
}

/// Reuse the ordered S09 candidates while directing each selected clause tail
/// to the surrounding source function's return destination.
fn emit_match_statement_inner(
    target: &SExpr,
    clauses: &[MatchClause],
    direct_destination: Option<&DirectDestination>,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let completion_enabled =
        direct_destination.is_some() || (ctx.direct_return_region && !ctx.legacy_statement_match);
    let mut reserved = HashSet::new();
    reserve_emitted_names(target, &mut reserved);
    for clause in clauses {
        reserve_pattern_names(&clause.pattern, &mut reserved);
        if let Some(guard) = &clause.guard {
            reserve_emitted_names(guard, &mut reserved);
        }
        for body_expr in &clause.body {
            reserve_emitted_names(body_expr, &mut reserved);
        }
    }

    let target_var = next_unreserved_gensym(ctx, "target", &mut reserved);
    let matched_var = next_unreserved_gensym(ctx, "matched", &mut reserved);
    let (subject_prefix, subject_value) = if completion_enabled {
        emit_direct_header_value(target, ctx, registry)
    } else {
        (
            Vec::new(),
            emit_in_context(target, ExprContext::Value, ctx, registry),
        )
    };
    let target_binding = list(vec![atom("const"), atom(&target_var), subject_value]);
    let mut statements = vec![atom("block")];
    statements.extend(subject_prefix);
    statements.push(target_binding);
    statements.push(list(vec![atom("let"), atom(&matched_var), bool_lit(false)]));
    let mut terminal = false;

    for clause in clauses {
        let (condition, bindings) = compile_pattern(&clause.pattern, &target_var, registry);
        let saved_body_ctx = ctx.expr_context;
        ctx.expr_context = ExprContext::Statement;
        let body = if let Some(destination) = direct_destination {
            emit_direct_consumed_body(&clause.body, destination, ctx, registry)
        } else {
            emit_body(&clause.body, ctx, registry)
        };
        ctx.expr_context = saved_body_ctx;

        let mut candidate_items = vec![atom("block")];
        candidate_items.extend(bindings);

        let selection = list(vec![atom("="), atom(&matched_var), bool_lit(true)]);
        let mut selected_items = vec![atom("block"), selection];
        selected_items.extend(body);
        let selected_body = list(selected_items);

        if let Some(guard) = &clause.guard {
            if completion_enabled {
                let saved_context = ctx.expr_context;
                ctx.expr_context = ExprContext::Statement;
                let (guard_prefix, guard_value) = emit_direct_header_value(guard, ctx, registry);
                ctx.expr_context = saved_context;
                candidate_items.extend(guard_prefix);
                candidate_items.push(list(vec![atom("if"), guard_value, selected_body]));
            } else {
                let guard = emit_in_context(guard, ExprContext::Value, ctx, registry);
                candidate_items.push(list(vec![atom("if"), guard, selected_body]));
            }
        } else {
            candidate_items.push(selected_body);
        }
        let candidate = list(candidate_items);

        let unmatched = list(vec![atom("!"), atom(&matched_var)]);
        let condition = if let Some(pattern_check) = condition {
            list(vec![atom("&&"), unmatched, pattern_check])
        } else {
            unmatched
        };
        statements.push(list(vec![atom("if"), condition, candidate]));

        if clause.guard.is_none() && pattern_is_irrefutable(&clause.pattern) {
            terminal = true;
            break;
        }
    }

    if !terminal {
        statements.push(list(vec![
            atom("if"),
            list(vec![atom("!"), atom(&matched_var)]),
            list(vec![
                atom("throw"),
                list(vec![
                    atom("new"),
                    atom("Error"),
                    str_lit("match: no matching pattern"),
                ]),
            ]),
        ]));
    }

    list(statements)
}

/// Emit a match using the pre-I2 statement algorithm inside protected bodies.
fn emit_match_statement_legacy(
    target: &SExpr,
    clauses: &[MatchClause],
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let target_var = ctx.gensym.next("target");
    let target_binding = list(vec![
        atom("const"),
        atom(&target_var),
        emit_in_context(target, ExprContext::Value, ctx, registry),
    ]);

    let mut clause_data: Vec<(Option<SExpr>, SExpr)> = Vec::new();
    let mut wildcard_block: Option<SExpr> = None;

    for clause in clauses {
        let (condition, bindings) = compile_pattern(&clause.pattern, &target_var, registry);
        let saved_body_ctx = ctx.expr_context;
        ctx.expr_context = ExprContext::Statement;
        let clause_body = emit_body(&clause.body, ctx, registry);
        ctx.expr_context = saved_body_ctx;

        let mut block_items = vec![atom("block")];
        block_items.extend(bindings);

        if let Some(ref guard) = clause.guard {
            let mut inner_block = vec![atom("block")];
            inner_block.extend(clause_body);
            let guard = emit_in_context(guard, ExprContext::Value, ctx, registry);
            block_items.push(list(vec![atom("if"), guard, list(inner_block)]));
        } else {
            block_items.extend(clause_body);
        }

        let block = list(block_items);

        if condition.is_some() {
            clause_data.push((condition, block));
        } else {
            wildcard_block = Some(block);
            break;
        }
    }

    // Build the else-chain fallback
    let fallback = wildcard_block.unwrap_or_else(|| {
        list(vec![
            atom("block"),
            list(vec![
                atom("throw"),
                list(vec![
                    atom("new"),
                    atom("Error"),
                    str_lit("match: no matching pattern"),
                ]),
            ]),
        ])
    });

    // Build nested if/else from the end
    let mut chain = fallback;
    for (cond, block) in clause_data.into_iter().rev() {
        chain = list(vec![atom("if"), cond.unwrap(), block, chain]);
    }

    list(vec![atom("block"), target_binding, chain])
}

fn next_unreserved_gensym(
    ctx: &mut EmitterContext,
    prefix: &str,
    reserved: &mut HashSet<String>,
) -> String {
    loop {
        let candidate = ctx.gensym.next(prefix);
        let emitted = to_js_identifier(&candidate);
        if reserved.insert(emitted) {
            return candidate;
        }
    }
}

fn reserve_emitted_names(expr: &SExpr, reserved: &mut HashSet<String>) -> bool {
    match expr {
        SExpr::Atom(_) if expr.completion_value_id().is_some() => true,
        SExpr::Atom(_) => {
            let name = expr.as_atom().unwrap_or_default();
            reserved.insert(to_js_identifier(name));
            if let Some((root, members)) = name.split_once(':') {
                if !root.is_empty() {
                    reserved.insert(to_js_identifier(root));
                }
                for member in members.split(':') {
                    if !member.is_empty() {
                        reserved.insert(to_js_identifier(member));
                    }
                }
            }
            false
        }
        SExpr::List { values, .. } => {
            let mut has_markers = false;
            for child in values {
                has_markers |= reserve_emitted_names(child, reserved);
            }
            has_markers
        }
        SExpr::Cons { car, cdr, .. } => {
            let car_has_markers = reserve_emitted_names(car, reserved);
            let cdr_has_markers = reserve_emitted_names(cdr, reserved);
            car_has_markers || cdr_has_markers
        }
        SExpr::Keyword { .. }
        | SExpr::String { .. }
        | SExpr::Number { .. }
        | SExpr::Bool { .. }
        | SExpr::Null { .. } => false,
    }
}

fn reserve_pattern_names(pattern: &Pattern, reserved: &mut HashSet<String>) {
    match pattern {
        Pattern::Wildcard(_) => {}
        Pattern::Literal(expr) => {
            reserve_emitted_names(expr, reserved);
        }
        Pattern::Binding { name, .. } => {
            reserved.insert(to_js_identifier(name));
        }
        Pattern::Constructor { name, bindings, .. } => {
            reserved.insert(to_js_identifier(name));
            for binding in bindings {
                reserve_pattern_names(binding, reserved);
            }
        }
        Pattern::Obj { pairs, .. } => {
            for (key, value) in pairs {
                reserved.insert(to_js_identifier(key));
                reserve_pattern_names(value, reserved);
            }
        }
    }
}

fn pattern_is_irrefutable(pattern: &Pattern) -> bool {
    matches!(pattern, Pattern::Wildcard(_) | Pattern::Binding { .. })
}

/// Emit a match as an IIFE (value position — result needed).
fn emit_match_iife(
    target: &SExpr,
    clauses: &[MatchClause],
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    // Await detection
    let target_has_await = contains_await(target);
    let body_has_await = clauses
        .iter()
        .any(|clause| any_contains_await(&clause.body));

    // Strategy 1: hoist target if it contains await
    let (hoist_stmt, target_init_expr) = if target_has_await {
        let hoisted_var = ctx.gensym.next("await");
        let hoist = list(vec![
            atom("const"),
            atom(&hoisted_var),
            emit_in_context(target, ExprContext::Value, ctx, registry),
        ]);
        (Some(hoist), atom(&hoisted_var))
    } else {
        (
            None,
            emit_in_context(target, ExprContext::Value, ctx, registry),
        )
    };

    let target_var = ctx.gensym.next("target");
    let mut body = vec![
        atom("=>"),
        list(vec![]),
        list(vec![atom("const"), atom(&target_var), target_init_expr]),
    ];

    let mut has_wildcard = false;

    for clause in clauses {
        let (condition, bindings) = compile_pattern(&clause.pattern, &target_var, registry);
        // DD-50.7: match clause bodies are statement sequences
        let saved_body_ctx = ctx.expr_context;
        let saved_legacy_match = ctx.legacy_statement_match;
        ctx.legacy_statement_match = true;
        ctx.expr_context = ExprContext::Statement;
        let clause_body = emit_sequence_body(&clause.body, ExprUse::Tail, ctx, registry);
        ctx.expr_context = saved_body_ctx;
        ctx.legacy_statement_match = saved_legacy_match;

        let mut block_items = vec![atom("block")];
        block_items.extend(bindings);

        if let Some(ref guard) = clause.guard {
            let mut inner_block = vec![atom("block")];
            for (i, expr) in clause_body.iter().enumerate() {
                if i == clause_body.len() - 1 {
                    inner_block.push(list(vec![atom("return"), expr.clone()]));
                } else {
                    inner_block.push(expr.clone());
                }
            }
            let guard = emit_in_context(guard, ExprContext::Value, ctx, registry);
            block_items.push(list(vec![atom("if"), guard, list(inner_block)]));
        } else {
            for (i, expr) in clause_body.iter().enumerate() {
                if i == clause_body.len() - 1 {
                    block_items.push(list(vec![atom("return"), expr.clone()]));
                } else {
                    block_items.push(expr.clone());
                }
            }
        }

        if let Some(cond) = condition {
            body.push(list(vec![atom("if"), cond, list(block_items)]));
        } else if clause.guard.is_some() {
            // A guarded wildcard is only a candidate. If it fails, continue
            // through the remaining clauses to the real wildcard/fallback.
            body.push(list(block_items));
        } else {
            has_wildcard = true;
            body.push(list(block_items));
            break;
        }
    }

    if !has_wildcard {
        body.push(list(vec![
            atom("throw"),
            list(vec![
                atom("new"),
                atom("Error"),
                str_lit("match: no matching pattern"),
            ]),
        ]));
    }

    // Strategy 2: wrap IIFE in async + await if body contains await
    let iife = if body_has_await {
        wrap_iife_async(body)
    } else {
        list(vec![list(body)])
    };

    if let Some(hoist) = hoist_stmt {
        list(vec![atom("block"), hoist, iife])
    } else {
        iife
    }
}

/// Compile a pattern to a (condition, bindings) pair.
///
/// Returns `(None, bindings)` for wildcard/binding patterns (unconditional).
fn compile_pattern(
    pattern: &Pattern,
    target_var: &str,
    registry: &TypeRegistry,
) -> (Option<SExpr>, Vec<SExpr>) {
    match pattern {
        Pattern::Wildcard(_) => (None, vec![]),
        Pattern::Literal(expr) => {
            let condition = list(vec![atom("==="), atom(target_var), expr.clone()]);
            (Some(condition), vec![])
        }
        Pattern::Binding { name, .. } => {
            let binding = list(vec![atom("const"), atom(name), atom(target_var)]);
            (None, vec![binding])
        }
        Pattern::Constructor { name, bindings, .. } => {
            // Check: (=== target:tag "Name")
            let condition = list(vec![
                atom("==="),
                atom(&format!("{target_var}:tag")),
                str_lit(name),
            ]);

            // Bind fields using registry field names
            let mut field_bindings = Vec::new();
            if let Some(ctor_def) = registry.lookup_constructor(name) {
                for (i, binding_pat) in bindings.iter().enumerate() {
                    if i < ctor_def.fields.len() {
                        let field_name = &ctor_def.fields[i].name;
                        match binding_pat {
                            Pattern::Binding {
                                name: bind_name, ..
                            } => {
                                field_bindings.push(list(vec![
                                    atom("const"),
                                    atom(bind_name),
                                    atom(&format!("{target_var}:{field_name}")),
                                ]));
                            }
                            Pattern::Wildcard(_) => {
                                // Skip binding for wildcards
                            }
                            _ => {
                                // Nested patterns would need recursive compilation
                                // For now, treat as binding
                            }
                        }
                    }
                }
            }

            (Some(condition), field_bindings)
        }
        Pattern::Obj { pairs, .. } => {
            // Check: typeof/null/in checks for each key
            let mut conditions = vec![
                list(vec![
                    atom("==="),
                    list(vec![atom("typeof"), atom(target_var)]),
                    str_lit("object"),
                ]),
                list(vec![atom("!=="), atom(target_var), atom("null")]),
            ];

            let mut bindings = Vec::new();

            for (key, pat) in pairs {
                conditions.push(list(vec![atom("in"), str_lit(key), atom(target_var)]));

                match pat {
                    Pattern::Binding { name, .. } => {
                        bindings.push(list(vec![
                            atom("const"),
                            atom(name),
                            atom(&format!("{target_var}:{key}")),
                        ]));
                    }
                    Pattern::Wildcard(_) => {}
                    _ => {}
                }
            }

            let condition = if conditions.len() == 1 {
                conditions.into_iter().next().unwrap()
            } else {
                let mut and_expr = vec![atom("&&")];
                and_expr.extend(conditions);
                list(and_expr)
            };

            (Some(condition), bindings)
        }
    }
}

// ---------------------------------------------------------------------------
// Cond emission
// ---------------------------------------------------------------------------

fn emit_cond(clauses: &[CondClause], ctx: &mut EmitterContext, registry: &TypeRegistry) -> SExpr {
    let has_await = clauses.iter().any(|clause| {
        clause.test.as_ref().is_some_and(contains_await) || contains_await(&clause.result)
    });

    let fallback = clauses
        .iter()
        .find(|clause| clause.test.is_none())
        .map(|clause| emit_cond_result_block(&clause.result, ctx, registry))
        .unwrap_or_else(|| list(vec![atom("block")]));

    let mut chain = fallback;
    for clause in clauses.iter().rev().filter(|clause| clause.test.is_some()) {
        let saved_ctx = ctx.expr_context;
        ctx.expr_context = ExprContext::Value;
        let test = emit_expr(clause.test.as_ref().unwrap(), ctx, registry);
        ctx.expr_context = saved_ctx;
        chain = list(vec![
            atom("if"),
            test,
            emit_cond_result_block(&clause.result, ctx, registry),
            chain,
        ]);
    }

    let arrow_body = vec![atom("=>"), list(vec![]), list(vec![atom("block"), chain])];
    if has_await {
        wrap_iife_async(arrow_body)
    } else {
        list(vec![list(arrow_body)])
    }
}

fn emit_cond_result_block(
    result: &SExpr,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let saved_ctx = ctx.expr_context;
    ctx.expr_context = ExprContext::Value;
    let emitted = emit_expr(result, ctx, registry);
    ctx.expr_context = saved_ctx;

    let inner = if is_statement_form(&emitted) || is_control_transfer_last_expr(&emitted) {
        emitted
    } else {
        list(vec![atom("return"), emitted])
    };
    list(vec![atom("block"), inner])
}

// ---------------------------------------------------------------------------
// IfLet / WhenLet emission
// ---------------------------------------------------------------------------

fn emit_if_let(
    pattern: &Pattern,
    expr: &SExpr,
    then_body: &SExpr,
    else_body: Option<&SExpr>,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    match ctx.expr_context {
        ExprContext::Statement => {
            emit_if_let_statement(pattern, expr, then_body, else_body, ctx, registry)
        }
        _ => emit_if_let_iife(pattern, expr, then_body, else_body, ctx, registry),
    }
}

/// Emit if-let as a bare if/else (statement position).
fn emit_if_let_statement(
    pattern: &Pattern,
    expr: &SExpr,
    then_body: &SExpr,
    else_body: Option<&SExpr>,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let t = ctx.gensym.next("t");
    let binding = list(vec![
        atom("const"),
        atom(&t),
        emit_expr(expr, ctx, registry),
    ]);

    let (condition, bindings) = compile_let_pattern(pattern, &t, registry);

    let mut then_block = vec![atom("block")];
    then_block.extend(bindings);
    then_block.push(emit_expr(then_body, ctx, registry));

    let if_form = if let Some(else_expr) = else_body {
        let else_block = list(vec![atom("block"), emit_expr(else_expr, ctx, registry)]);
        list(vec![atom("if"), condition, list(then_block), else_block])
    } else {
        list(vec![atom("if"), condition, list(then_block)])
    };

    list(vec![atom("block"), binding, if_form])
}

/// Emit if-let as an IIFE (value position).
fn emit_if_let_iife(
    pattern: &Pattern,
    expr: &SExpr,
    then_body: &SExpr,
    else_body: Option<&SExpr>,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    // Await detection
    let expr_has_await = contains_await(expr);
    let body_has_await = contains_await(then_body) || else_body.is_some_and(contains_await);

    // Strategy 1: hoist expr if it contains await
    let (hoist_stmt, init_expr) = if expr_has_await {
        let hoisted_var = ctx.gensym.next("await");
        let hoist = list(vec![
            atom("const"),
            atom(&hoisted_var),
            emit_expr(expr, ctx, registry),
        ]);
        (Some(hoist), atom(&hoisted_var))
    } else {
        (None, emit_expr(expr, ctx, registry))
    };

    let t = ctx.gensym.next("t");
    let mut body = vec![
        atom("=>"),
        list(vec![]),
        list(vec![atom("const"), atom(&t), init_expr]),
    ];

    let (condition, bindings) = compile_let_pattern(pattern, &t, registry);

    let mut then_block = vec![atom("block")];
    then_block.extend(bindings);
    then_block.push(list(vec![
        atom("return"),
        emit_expr(then_body, ctx, registry),
    ]));

    if let Some(else_expr) = else_body {
        let else_block = list(vec![
            atom("block"),
            list(vec![atom("return"), emit_expr(else_expr, ctx, registry)]),
        ]);
        body.push(list(vec![
            atom("if"),
            condition,
            list(then_block),
            else_block,
        ]));
    } else {
        body.push(list(vec![atom("if"), condition, list(then_block)]));
    }

    let iife = if body_has_await {
        wrap_iife_async(body)
    } else {
        list(vec![list(body)])
    };

    if let Some(hoist) = hoist_stmt {
        list(vec![atom("block"), hoist, iife])
    } else {
        iife
    }
}

fn emit_when_let(
    pattern: &Pattern,
    expr: &SExpr,
    body_exprs: &[SExpr],
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    match ctx.expr_context {
        ExprContext::Statement => emit_when_let_statement(pattern, expr, body_exprs, ctx, registry),
        _ => emit_when_let_iife(pattern, expr, body_exprs, ctx, registry),
    }
}

/// Emit when-let as a bare if (statement position).
fn emit_when_let_statement(
    pattern: &Pattern,
    expr: &SExpr,
    body_exprs: &[SExpr],
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let t = ctx.gensym.next("t");
    let binding = list(vec![
        atom("const"),
        atom(&t),
        emit_expr(expr, ctx, registry),
    ]);

    let (condition, bindings) = compile_let_pattern(pattern, &t, registry);

    let mut then_block = vec![atom("block")];
    then_block.extend(bindings);
    // DD-50.7: when-let body is a statement sequence
    let saved_body_ctx = ctx.expr_context;
    ctx.expr_context = ExprContext::Statement;
    then_block.extend(emit_body(body_exprs, ctx, registry));
    ctx.expr_context = saved_body_ctx;

    list(vec![
        atom("block"),
        binding,
        list(vec![atom("if"), condition, list(then_block)]),
    ])
}

/// Emit when-let as an IIFE (value position).
fn emit_when_let_iife(
    pattern: &Pattern,
    expr: &SExpr,
    body_exprs: &[SExpr],
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    // Await detection
    let expr_has_await = contains_await(expr);
    let body_has_await = any_contains_await(body_exprs);

    // Strategy 1: hoist expr if it contains await
    let (hoist_stmt, init_expr) = if expr_has_await {
        let hoisted_var = ctx.gensym.next("await");
        let hoist = list(vec![
            atom("const"),
            atom(&hoisted_var),
            emit_expr(expr, ctx, registry),
        ]);
        (Some(hoist), atom(&hoisted_var))
    } else {
        (None, emit_expr(expr, ctx, registry))
    };

    let t = ctx.gensym.next("t");
    let mut body = vec![
        atom("=>"),
        list(vec![]),
        list(vec![atom("const"), atom(&t), init_expr]),
    ];

    let (condition, bindings) = compile_let_pattern(pattern, &t, registry);

    let mut then_block = vec![atom("block")];
    then_block.extend(bindings);

    // DD-50.7: when-let body is a statement sequence
    let saved_body_ctx = ctx.expr_context;
    let saved_legacy_match = ctx.legacy_statement_match;
    ctx.legacy_statement_match = true;
    ctx.expr_context = ExprContext::Statement;
    let emitted = emit_body(body_exprs, ctx, registry);
    ctx.expr_context = saved_body_ctx;
    ctx.legacy_statement_match = saved_legacy_match;
    for (i, expr) in emitted.iter().enumerate() {
        if i == emitted.len() - 1 {
            then_block.push(list(vec![atom("return"), expr.clone()]));
        } else {
            then_block.push(expr.clone());
        }
    }

    body.push(list(vec![atom("if"), condition, list(then_block)]));

    let iife = if body_has_await {
        wrap_iife_async(body)
    } else {
        list(vec![list(body)])
    };

    if let Some(hoist) = hoist_stmt {
        list(vec![atom("block"), hoist, iife])
    } else {
        iife
    }
}

/// Compile a pattern for `if-let` / `when-let`.
///
/// Returns a (condition, bindings) pair. Unlike match patterns, these always
/// produce a condition (even for simple bindings, which check `!= null`).
fn compile_let_pattern(
    pattern: &Pattern,
    target_var: &str,
    registry: &TypeRegistry,
) -> (SExpr, Vec<SExpr>) {
    match pattern {
        Pattern::Constructor { name, bindings, .. } => {
            // ADT pattern: tag check + field bindings
            let condition = list(vec![
                atom("==="),
                atom(&format!("{target_var}:tag")),
                str_lit(name),
            ]);

            let mut field_bindings = Vec::new();
            if let Some(ctor_def) = registry.lookup_constructor(name) {
                for (i, binding_pat) in bindings.iter().enumerate() {
                    if i < ctor_def.fields.len() {
                        let field_name = &ctor_def.fields[i].name;
                        if let Pattern::Binding {
                            name: bind_name, ..
                        } = binding_pat
                        {
                            field_bindings.push(list(vec![
                                atom("const"),
                                atom(bind_name),
                                atom(&format!("{target_var}:{field_name}")),
                            ]));
                        }
                    }
                }
            }

            (condition, field_bindings)
        }
        Pattern::Obj { pairs, .. } => {
            // Object pattern: typeof/null/in checks
            let mut conditions = vec![
                list(vec![
                    atom("==="),
                    list(vec![atom("typeof"), atom(target_var)]),
                    str_lit("object"),
                ]),
                list(vec![atom("!=="), atom(target_var), atom("null")]),
            ];

            let mut bindings = Vec::new();

            for (key, pat) in pairs {
                conditions.push(list(vec![atom("in"), str_lit(key), atom(target_var)]));
                if let Pattern::Binding { name, .. } = pat {
                    bindings.push(list(vec![
                        atom("const"),
                        atom(name),
                        atom(&format!("{target_var}:{key}")),
                    ]));
                }
            }

            let condition = if conditions.len() == 1 {
                conditions.into_iter().next().unwrap()
            } else {
                let mut and_expr = vec![atom("&&")];
                and_expr.extend(conditions);
                list(and_expr)
            };

            (condition, bindings)
        }
        Pattern::Binding { name, .. } => {
            // Simple binding: (!= t null) check
            let condition = list(vec![atom("!="), atom(target_var), atom("null")]);
            let binding = list(vec![atom("const"), atom(name), atom(target_var)]);
            (condition, vec![binding])
        }
        Pattern::Wildcard(_) => {
            // Always true
            (bool_lit(true), vec![])
        }
        Pattern::Literal(expr) => {
            let condition = list(vec![atom("==="), atom(target_var), expr.clone()]);
            (condition, vec![])
        }
    }
}

// ---------------------------------------------------------------------------
// FunctionCall emission
// ---------------------------------------------------------------------------

fn emit_function_call(
    head: &SExpr,
    args: &[SExpr],
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let saved_ctx = ctx.expr_context;
    let mut items = vec![emit_expr(head, ctx, registry)];
    ctx.expr_context = ExprContext::Value;
    for arg in args {
        items.push(emit_expr(arg, ctx, registry));
    }
    ctx.expr_context = saved_ctx;
    list(items)
}

// ---------------------------------------------------------------------------
// Class emission
// ---------------------------------------------------------------------------

/// Emit a `(class ...)` or `(class-expr ...)` kernel form.
///
/// For `class`, `name` is `Some(name_expr)`.
/// For `class-expr`, `name` is `None`.
fn emit_class_form(
    name: Option<&SExpr>,
    superclass: &SExpr,
    members: &[ClassMemberForm],
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    let head_atom = if name.is_some() {
        "class"
    } else {
        "class-expr"
    };
    let mut items = vec![atom(head_atom)];

    if let Some(n) = name {
        items.push(emit_expr(n, ctx, registry));
    }

    items.push(emit_expr(superclass, ctx, registry));

    for member in members {
        items.push(emit_class_member_form(member, ctx, registry));
    }

    list(items)
}

/// Emit a single classified class member back to kernel S-expression form.
fn emit_class_member_form(
    member: &ClassMemberForm,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    match member {
        ClassMemberForm::Method {
            prefix,
            body,
            is_static,
            is_async,
        } => {
            let mut member_items: Vec<SExpr> =
                prefix.iter().map(|e| emit_expr(e, ctx, registry)).collect();

            let saved = ctx.in_class_body;
            let saved_direct_region = ctx.direct_return_region;
            ctx.in_class_body = true;
            ctx.direct_return_region = false;
            for expr in body {
                member_items.push(emit_expr(expr, ctx, registry));
            }
            ctx.in_class_body = saved;
            ctx.direct_return_region = saved_direct_region;

            let mut result = list(member_items);

            if *is_async {
                result = list(vec![atom("async"), result]);
            }
            if *is_static {
                result = list(vec![atom("static"), result]);
            }

            result
        }
        ClassMemberForm::Field {
            prefix,
            init,
            is_static,
        } => {
            let mut member_items: Vec<SExpr> =
                prefix.iter().map(|e| emit_expr(e, ctx, registry)).collect();

            if let Some(init_expr) = init {
                member_items.push(emit_expr(init_expr, ctx, registry));
            }

            let mut result = list(member_items);

            if *is_static {
                result = list(vec![atom("static"), result]);
            }

            result
        }
        ClassMemberForm::Raw(raw) => emit_expr(raw, ctx, registry),
    }
}

// ---------------------------------------------------------------------------
// DD-50: Position-aware `if` emission
// ---------------------------------------------------------------------------

fn emit_if_expression(
    args: &[SExpr],
    span: Span,
    ctx: &mut EmitterContext,
    registry: &TypeRegistry,
) -> SExpr {
    if args.is_empty() {
        return atom("undefined");
    }

    let cond = emit_expr(&args[0], ctx, registry);

    // DD-50 Rule 2: no else in expression position → compile error
    if args.len() < 3 {
        ctx.record_fatal(codegen_error(
            "if in expression position requires an else branch",
            span,
        ));
        return atom("undefined");
    }

    let then_branch = emit_in_context(&args[1], ExprContext::Value, ctx, registry);
    let else_branch = emit_in_context(&args[2], ExprContext::Value, ctx, registry);

    if !is_statement_form(&then_branch) && !is_statement_form(&else_branch) {
        // Both branches are pure expressions → ternary
        list(vec![atom("?"), cond, then_branch, else_branch])
    } else {
        // One or both branches are statement forms → IIFE
        let is_async = contains_current_await(&cond)
            || contains_current_await(&then_branch)
            || contains_current_await(&else_branch);
        emit_if_iife_with_await(cond, then_branch, else_branch, is_async, ctx)
    }
}

fn emit_if_iife(cond: SExpr, then_branch: SExpr, else_branch: SExpr) -> SExpr {
    emit_if_iife_with_await(
        cond,
        then_branch,
        else_branch,
        false,
        &mut EmitterContext::new(false),
    )
}

fn emit_if_iife_with_await(
    cond: SExpr,
    then_branch: SExpr,
    else_branch: SExpr,
    is_async: bool,
    ctx: &mut EmitterContext,
) -> SExpr {
    // DD-50.7 extension: conditional return-wrap per branch.
    // Statement branches (throw, return, etc.) stay as-is; value branches get (return ...).
    let then_branch = if is_async {
        box_current_scope_returns(&then_branch)
    } else {
        then_branch
    };
    let else_branch = if is_async {
        box_current_scope_returns(&else_branch)
    } else {
        else_branch
    };
    let then_inner = if is_statement_form(&then_branch) {
        then_branch
    } else if is_async {
        list(vec![atom("return"), list(vec![atom("array"), then_branch])])
    } else {
        list(vec![atom("return"), then_branch])
    };
    let else_inner = if is_statement_form(&else_branch) {
        else_branch
    } else if is_async {
        list(vec![atom("return"), list(vec![atom("array"), else_branch])])
    } else {
        list(vec![atom("return"), else_branch])
    };

    let then_block = list(vec![atom("block"), then_inner]);
    let else_block = list(vec![atom("block"), else_inner]);
    let if_stmt = list(vec![atom("if"), cond, then_block, else_block]);
    // Wrap in (block ...) so arrow codegen emits { if (...) {...} else {...} }
    let arrow_body = if is_async {
        list(vec![
            atom("block"),
            if_stmt,
            list(vec![
                atom("return"),
                list(vec![atom("array"), atom("undefined")]),
            ]),
        ])
    } else {
        list(vec![atom("block"), if_stmt])
    };
    let arrow = list(vec![atom("=>"), list(vec![]), arrow_body]);
    let callable = if is_async {
        list(vec![atom("async"), arrow])
    } else {
        arrow
    };
    // ((() => { ... })())
    let call = list(vec![callable]);
    if is_async {
        unbox_awaited_value(list(vec![atom("await"), call]), ctx)
    } else {
        call
    }
}

fn emit_do(body: &[SExpr], ctx: &mut EmitterContext, registry: &TypeRegistry) -> SExpr {
    if body.is_empty() {
        return atom("undefined");
    }

    match ctx.expr_context {
        ExprContext::Statement => {
            let saved_context = ctx.expr_context;
            ctx.expr_context = ExprContext::Statement;
            let emitted = emit_body(body, ctx, registry);
            ctx.expr_context = saved_context;
            let mut items = vec![atom("block")];
            items.extend(emitted);
            list(items)
        }
        _ => {
            let saved_legacy_match = ctx.legacy_statement_match;
            ctx.legacy_statement_match = true;
            let mut emitted = emit_sequence_body(
                body,
                ExprUse::from_expr_context(ctx.expr_context),
                ctx,
                registry,
            );
            ctx.legacy_statement_match = saved_legacy_match;
            let is_async = any_current_await(&emitted);
            if is_async {
                emitted = emitted.iter().map(box_current_scope_returns).collect();
            }
            // Expression position: IIFE-wrap with last expression returned
            let mut statements = Vec::new();
            if emitted.len() == 1 {
                if is_statement_form(&emitted[0]) {
                    statements.push(emitted[0].clone());
                } else {
                    let value = if is_async {
                        list(vec![atom("array"), emitted[0].clone()])
                    } else {
                        emitted[0].clone()
                    };
                    statements.push(list(vec![atom("return"), value]));
                }
            } else {
                statements.extend(emitted[..emitted.len() - 1].iter().cloned());
                let tail = emitted.last().unwrap();
                if is_statement_form(tail) {
                    statements.push(tail.clone());
                } else {
                    let last = if is_async {
                        list(vec![atom("array"), tail.clone()])
                    } else {
                        tail.clone()
                    };
                    statements.push(list(vec![atom("return"), last]));
                }
            }
            let mut arrow_body = vec![atom("=>"), list(vec![])];
            let mut block = vec![atom("block")];
            block.extend(statements);
            if is_async {
                block.push(list(vec![
                    atom("return"),
                    list(vec![atom("array"), atom("undefined")]),
                ]));
            }
            arrow_body.push(list(block));
            // ((() => { ... })())
            let arrow = list(arrow_body);
            if is_async {
                unbox_awaited_value(wrap_iife_async(arrow.as_list().unwrap().to_vec()), ctx)
            } else {
                list(vec![arrow])
            }
        }
    }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;
    use crate::analysis::type_registry::{ConstructorDef, FieldDef, TypeDef, TypeRegistry};
    use crate::ast::sexpr::NameRes;
    use crate::ast::surface::{
        BindBinding, CondClause, Constructor, DestructuredField, FuncClause, GenfuncClause,
        MatchClause, ParamShape, Pattern, SurfaceForm, ThreadingStep, TypeAnnotation, TypedParam,
    };
    use crate::emitter::context::EmitterContext;

    fn s() -> Span {
        Span::default()
    }

    fn ta(name: &str) -> TypeAnnotation {
        TypeAnnotation {
            name: name.to_string(),
            span: s(),
        }
    }

    fn tp(type_name: &str, param_name: &str) -> TypedParam {
        TypedParam {
            type_ann: ta(type_name),
            name: param_name.to_string(),
            name_span: s(),
            default_value: None,
            is_rest: false,
        }
    }

    fn sp(type_name: &str, param_name: &str) -> ParamShape {
        tp(type_name, param_name).into()
    }

    fn ctx() -> EmitterContext {
        EmitterContext::new(false)
    }

    fn ctx_value() -> EmitterContext {
        let mut c = EmitterContext::new(false);
        c.expr_context = ExprContext::Value;
        c
    }

    fn reg() -> TypeRegistry {
        TypeRegistry::default()
    }

    #[test]
    fn nested_unknown_kernel_escape_is_a_checked_classification_failure() {
        let source = "(bind result (kernel:objec (key 7)))";
        let forms = crate::reader::read(source).expect("parse source");
        let form = SurfaceForm::KernelPassthrough {
            raw: forms[0].clone(),
            span: forms[0].span(),
        };
        let error = emit_form(&form, &mut ctx(), &reg()).expect_err("unknown escape must fail");
        let LyknError::Classify(diagnostic) = error else {
            panic!("expected checked classifier error");
        };
        assert_eq!(diagnostic.severity, Severity::Error);
        assert_eq!(diagnostic.span.start.line, 1);
        assert_eq!(diagnostic.span.start.column, 14);
        assert_eq!(diagnostic.suggestion.as_deref(), Some("kernel:object"));
        assert_eq!(
            diagnostic.message,
            "unknown kernel form 'objec' in (kernel:objec ...); did you mean 'object'?"
        );
    }

    #[test]
    fn tagged_kernel_escape_lookalike_remains_an_ordinary_call() {
        let source = "(kernel:objec (key 7))";
        let mut forms = crate::reader::read(source).expect("parse source");
        let SExpr::List { values, .. } = &mut forms[0] else {
            panic!("expected parsed list");
        };
        values[0] = values[0].clone().with_name_res(NameRes::BindingRef);
        let span = forms[0].span();
        let form = SurfaceForm::KernelPassthrough {
            raw: forms[0].clone(),
            span,
        };
        let mut context = ctx_value();
        context.in_class_body = true;
        let emitted = emit_form(&form, &mut context, &reg()).expect("tagged call should emit");
        let values = emitted[0].as_list().expect("ordinary call list");
        assert_eq!(values[0].as_atom(), Some("kernel:objec"));
        assert_eq!(values[0].name_res(), NameRes::BindingRef);
        assert_eq!(context.expr_context, ExprContext::Value);
        assert!(context.in_class_body);
    }

    #[test]
    fn variadic_loop_and_switch_bodies_keep_grouped_bindings_as_siblings() {
        let grouped_bind = list(vec![
            atom("bind"),
            atom("first"),
            num(1.0),
            atom("second"),
            list(vec![atom("+"), atom("first"), num(1.0)]),
        ]);
        for form in [
            list(vec![atom("while"), bool_lit(true), grouped_bind.clone()]),
            list(vec![
                atom("switch"),
                num(1.0),
                list(vec![
                    num(1.0),
                    grouped_bind.clone(),
                    list(vec![atom("break")]),
                ]),
            ]),
        ] {
            let mut context = EmitterContext::new(false);
            let emitted = emit_expr(&form, &mut context, &reg());
            let values = emitted.as_list().expect("kernel form");
            if values[0].as_atom() == Some("while") {
                assert_eq!(values.len(), 4, "loop body declarations are siblings");
                assert_eq!(values[2].as_list().unwrap()[0].as_atom(), Some("const"));
                assert_eq!(values[3].as_list().unwrap()[0].as_atom(), Some("const"));
            } else {
                let clause = values[2].as_list().expect("switch clause");
                assert_eq!(clause.len(), 4, "clause body declarations are siblings");
                assert_eq!(clause[1].as_list().unwrap()[0].as_atom(), Some("const"));
                assert_eq!(clause[2].as_list().unwrap()[0].as_atom(), Some("const"));
                assert_eq!(clause[3].as_list().unwrap()[0].as_atom(), Some("break"));
            }
            assert_eq!(context.expr_context, ExprContext::Statement);
        }
    }

    #[test]
    fn value_lowering_restores_tail_context_and_records_checked_failure() {
        let mut context = EmitterContext::new(false);
        context.expr_context = ExprContext::Tail;
        let missing_else = list(vec![atom("if"), bool_lit(true), num(1.0)]);
        let _ = emit_in_context(&missing_else, ExprContext::Value, &mut context, &reg());
        assert_eq!(context.expr_context, ExprContext::Tail);
        assert!(context.first_fatal.is_some());
    }

    #[test]
    fn switch_preserves_clause_markers_spans_and_ignored_structural_children() {
        let source_span = Span::new(
            crate::reader::source_loc::SourceLoc { line: 2, column: 3 },
            crate::reader::source_loc::SourceLoc { line: 4, column: 5 },
        );
        let marker = atom("default").with_name_res(NameRes::BindingRef);
        let clause = SExpr::List {
            values: vec![marker, list(vec![atom("break")])],
            span: source_span,
        };
        let empty = SExpr::List {
            values: Vec::new(),
            span: source_span,
        };
        let nonlist = atom("ignored");
        let switch = SExpr::List {
            values: vec![atom("switch"), num(1.0), clause, empty, nonlist],
            span: source_span,
        };
        let emitted = emit_expr(&switch, &mut EmitterContext::new(false), &reg());
        let values = emitted.as_list().expect("switch form");
        assert_eq!(values.len(), 5, "outer clauses remain structural children");
        let emitted_clause = values[2].as_list().expect("default clause");
        assert_eq!(values[2].span(), source_span);
        assert_eq!(emitted_clause[0].as_atom(), Some("default"));
        assert_eq!(emitted_clause[0].name_res(), NameRes::BindingRef);
        assert_eq!(values[3].as_list().unwrap().len(), 0);
        assert_eq!(values[4].as_atom(), Some("ignored"));
    }

    #[test]
    fn numeric_for_emits_first_and_late_no_else_if_as_ordered_statements() {
        let form = list(vec![
            atom("for"),
            list(vec![atom("let"), atom("i"), num(0.0)]),
            list(vec![atom("<"), atom("i"), num(2.0)]),
            list(vec![atom("++"), atom("i")]),
            list(vec![
                atom("if"),
                atom("true"),
                list(vec![atom("trace"), atom("push"), atom("i")]),
            ]),
            list(vec![
                atom("bind"),
                atom("value"),
                list(vec![atom("+"), atom("i"), num(10.0)]),
            ]),
            list(vec![
                atom("if"),
                atom("true"),
                list(vec![atom("trace"), atom("push"), atom("value")]),
            ]),
            list(vec![
                atom("bind"),
                atom("next-value"),
                list(vec![atom("+"), atom("value"), num(1.0)]),
            ]),
            list(vec![
                atom("if"),
                atom("true"),
                list(vec![atom("trace"), atom("push"), atom("next-value")]),
            ]),
        ]);
        let mut context = ctx_value();
        let emitted = emit_expr(&form, &mut context, &reg());
        assert_eq!(context.expr_context, ExprContext::Value);

        let values = emitted.as_list().expect("numeric-for kernel list");
        assert_eq!(values[0].as_atom(), Some("for"));
        assert_eq!(values.len(), 9);
        for (index, expected) in [(4, "if"), (6, "if"), (8, "if")] {
            let body = values[index].as_list().expect("body statement");
            assert_eq!(body[0].as_atom(), Some(expected));
        }
        assert_eq!(values[5].as_list().unwrap()[0].as_atom(), Some("const"));
        assert_eq!(values[7].as_list().unwrap()[0].as_atom(), Some("const"));
    }

    #[test]
    fn numeric_for_header_slots_still_reject_no_else_if_values() {
        for (index, value) in [
            list(vec![atom("if"), atom("true"), num(0.0)]),
            list(vec![atom("if"), atom("true"), bool_lit(true)]),
            list(vec![atom("if"), atom("true"), num(1.0)]),
        ]
        .into_iter()
        .enumerate()
        {
            let mut values = vec![
                atom("for"),
                list(vec![atom("let"), atom("i"), num(0.0)]),
                list(vec![atom("<"), atom("i"), num(1.0)]),
                list(vec![atom("++"), atom("i")]),
                list(vec![atom("console:log"), atom("i")]),
            ];
            values[index + 1] = value;
            let form = SurfaceForm::KernelPassthrough {
                raw: list(values),
                span: Span::default(),
            };
            let mut context = ctx_value();
            context.in_class_body = true;
            let result = emit_form(&form, &mut context, &reg());
            let Err(LyknError::Codegen(diagnostic)) = result else {
                panic!("numeric-for value header must fail through the checked API");
            };
            assert!(diagnostic.message.contains("else branch"));
            assert_eq!(context.expr_context, ExprContext::Value);
            assert!(context.in_class_body);
        }
    }

    // --- convert_to_expression ---

    #[test]
    fn test_convert_to_expression_converts_if_form() {
        let expr = list(vec![atom("if"), atom("cond"), atom("a"), atom("b")]);
        let mut ctx = EmitterContext::new(false);
        let result = convert_to_expression(expr, &mut ctx, Span::default());
        if let SExpr::List { values, .. } = &result {
            assert_eq!(values[0].as_atom(), Some("?"));
            assert_eq!(values[1].as_atom(), Some("cond"));
            assert_eq!(values[2].as_atom(), Some("a"));
            assert_eq!(values[3].as_atom(), Some("b"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_convert_to_expression_passes_through_non_if() {
        let expr = list(vec![atom("foo"), atom("bar")]);
        let mut ctx = EmitterContext::new(false);
        let result = convert_to_expression(expr.clone(), &mut ctx, Span::default());
        assert_eq!(result, expr);
    }

    #[test]
    fn test_convert_to_expression_passes_through_atom() {
        let expr = atom("x");
        let mut ctx = EmitterContext::new(false);
        let result = convert_to_expression(expr.clone(), &mut ctx, Span::default());
        assert_eq!(result, expr);
    }

    #[test]
    fn test_convert_to_expression_records_missing_else_failure() {
        let expr = list(vec![atom("if"), atom("cond"), atom("then")]);
        let mut ctx = EmitterContext::new(false);
        let result = convert_to_expression(expr, &mut ctx, Span::default());
        assert_eq!(result.as_atom(), Some("undefined"));
        assert!(matches!(ctx.first_fatal, Some(LyknError::Codegen(_))));
    }

    // --- Bind ---

    #[test]
    fn test_emit_bind() {
        let form = SurfaceForm::Bind {
            name: atom("x"),
            type_ann: None,
            value: num(42.0),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("const"));
            assert_eq!(values[1].as_atom(), Some("x"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_bind_group_flattens_to_const_forms() {
        let form = SurfaceForm::BindGroup {
            bindings: vec![
                BindBinding {
                    name: atom("email"),
                    type_ann: None,
                    value: atom("raw"),
                    span: s(),
                },
                BindBinding {
                    name: atom("role"),
                    type_ann: Some(ta("string")),
                    value: str_lit("admin"),
                    span: s(),
                },
            ],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 2);
        for (expr, name) in result.iter().zip(["email", "role"]) {
            if let SExpr::List { values, .. } = expr {
                assert_eq!(values[0].as_atom(), Some("const"));
                assert_eq!(values[1].as_atom(), Some(name));
            } else {
                panic!("expected const form");
            }
        }
    }

    #[test]
    fn test_emit_bind_group_in_function_body_stays_sibling_scoped() {
        let form = SurfaceForm::Func {
            name: "normalize".into(),
            name_span: s(),
            clauses: vec![FuncClause {
                args: vec![sp("any", "raw")],
                returns: None,
                pre: None,
                post: None,
                body: vec![
                    list(vec![
                        atom("bind"),
                        atom("email"),
                        atom("raw"),
                        atom("role"),
                        atom("email"),
                    ]),
                    atom("role"),
                ],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        let SExpr::List { values, .. } = &result[0] else {
            panic!("expected function form");
        };
        assert_eq!(values[0].as_atom(), Some("function"));
        assert_eq!(values[3].as_list().unwrap()[0].as_atom(), Some("const"));
        assert_eq!(values[4].as_list().unwrap()[0].as_atom(), Some("const"));
        assert_eq!(values[5].as_list().unwrap()[0].as_atom(), Some("return"));
    }

    #[test]
    fn test_emit_bind_typed_literal_match_no_check() {
        // (bind :number x 42) — literal matches → just const, no type check
        let form = SurfaceForm::Bind {
            name: atom("x"),
            type_ann: Some(ta("number")),
            value: num(42.0),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1, "literal match should produce only const");
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("const"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_bind_typed_non_literal_emits_check() {
        // (bind :number x (compute)) — non-literal → const + type check
        let form = SurfaceForm::Bind {
            name: atom("x"),
            type_ann: Some(ta("number")),
            value: list(vec![atom("compute")]),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 2, "non-literal should produce const + check");
        // First: const
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("const"));
        } else {
            panic!("expected const form");
        }
        // Second: if (type check)
        if let SExpr::List { values, .. } = &result[1] {
            assert_eq!(values[0].as_atom(), Some("if"));
        } else {
            panic!("expected if form for type check");
        }
    }

    #[test]
    fn test_emit_bind_any_no_check() {
        // (bind :any x (compute)) — :any → no check
        let form = SurfaceForm::Bind {
            name: atom("x"),
            type_ann: Some(ta("any")),
            value: list(vec![atom("compute")]),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1, ":any should not emit type check");
    }

    #[test]
    fn test_emit_bind_strip_assertions_no_check() {
        // (bind :number x (compute)) with strip_assertions → no check
        let form = SurfaceForm::Bind {
            name: atom("x"),
            type_ann: Some(ta("number")),
            value: list(vec![atom("compute")]),
            span: s(),
        };
        let mut c = EmitterContext::new(true);
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1, "strip_assertions should omit type check");
    }

    #[test]
    fn test_emit_bind_typed_string_literal_no_check() {
        // (bind :string name "Alice") — literal matches → just const
        let form = SurfaceForm::Bind {
            name: atom("name"),
            type_ann: Some(ta("string")),
            value: str_lit("Alice"),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    #[test]
    fn test_emit_bind_typed_boolean_literal_no_check() {
        // (bind :boolean flag true) — literal matches → just const
        let form = SurfaceForm::Bind {
            name: atom("flag"),
            type_ann: Some(ta("boolean")),
            value: SExpr::Bool {
                value: true,
                span: s(),
            },
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    #[test]
    fn test_emit_bind_typed_mismatched_literal_still_just_const() {
        // (bind :number x "hello") — mismatch literal; emitter just emits const
        // (analysis pass catches the error)
        let form = SurfaceForm::Bind {
            name: atom("x"),
            type_ann: Some(ta("number")),
            value: str_lit("hello"),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(
            result.len(),
            1,
            "mismatched literal should still only emit const (analysis catches error)"
        );
    }

    #[test]
    fn test_emit_bind_typed_array_check() {
        // (bind :array xs (get-items)) — non-literal → const + array check
        let form = SurfaceForm::Bind {
            name: atom("xs"),
            type_ann: Some(ta("array")),
            value: list(vec![atom("get-items")]),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 2);
        if let SExpr::List { values, .. } = &result[1] {
            assert_eq!(values[0].as_atom(), Some("if"));
        } else {
            panic!("expected type check");
        }
    }

    // --- Obj ---

    #[test]
    fn test_emit_obj() {
        let form = SurfaceForm::Obj {
            pairs: vec![("name".into(), str_lit("Alice")), ("age".into(), num(30.0))],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("object"));
            assert_eq!(values.len(), 3); // object + 2 pairs
        } else {
            panic!("expected list");
        }
    }

    // --- Cell ---

    #[test]
    fn test_emit_cell() {
        let form = SurfaceForm::Cell {
            value: num(0.0),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("object"));
            if let SExpr::List { values: pair, .. } = &values[1] {
                assert_eq!(pair[0].as_atom(), Some("value"));
            } else {
                panic!("expected pair");
            }
        } else {
            panic!("expected list");
        }
    }

    // --- Express ---

    #[test]
    fn test_emit_express() {
        let form = SurfaceForm::Express {
            target: atom("counter"),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        assert_eq!(result[0].as_atom(), Some("counter:value"));
    }

    // --- Swap ---

    #[test]
    fn test_emit_swap() {
        let form = SurfaceForm::Swap {
            target: atom("counter"),
            func: atom("inc"),
            extra_args: vec![],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("="));
            assert_eq!(values[1].as_atom(), Some("counter:value"));
        } else {
            panic!("expected list");
        }
    }

    // --- Reset ---

    #[test]
    fn test_emit_reset() {
        let form = SurfaceForm::Reset {
            target: atom("counter"),
            value: num(0.0),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("="));
            assert_eq!(values[1].as_atom(), Some("counter:value"));
        } else {
            panic!("expected list");
        }
    }

    // --- ThreadFirst ---

    #[test]
    fn test_emit_thread_first_bare() {
        let form = SurfaceForm::ThreadFirst {
            initial: num(1.0),
            steps: vec![ThreadingStep::Bare(atom("inc"))],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be (inc 1)
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("inc"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_thread_first_call() {
        let form = SurfaceForm::ThreadFirst {
            initial: num(1.0),
            steps: vec![ThreadingStep::Call(vec![atom("add"), num(2.0)])],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        // Should be (add 1 2)
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("add"));
            // values[1] should be the initial (1.0)
            if let SExpr::Number { value, .. } = &values[1] {
                assert!((value - 1.0).abs() < f64::EPSILON);
            } else {
                panic!("expected number for threaded arg");
            }
        } else {
            panic!("expected list");
        }
    }

    // --- ThreadLast ---

    #[test]
    fn test_emit_thread_last_call() {
        let form = SurfaceForm::ThreadLast {
            initial: num(1.0),
            steps: vec![ThreadingStep::Call(vec![atom("add"), num(2.0)])],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        // Should be (add 2 1)
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("add"));
            // Last arg should be the initial
            if let SExpr::Number { value, .. } = values.last().unwrap() {
                assert!((value - 1.0).abs() < f64::EPSILON);
            } else {
                panic!("expected number at last position");
            }
        } else {
            panic!("expected list");
        }
    }

    // --- Type ---

    #[test]
    fn test_emit_type_zero_fields() {
        let form = SurfaceForm::Type {
            name: "Color".into(),
            name_span: s(),
            constructors: vec![Constructor {
                name: "Red".into(),
                name_span: s(),
                fields: vec![],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // (const Red (object (tag "Red")))
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("const"));
            assert_eq!(values[1].as_atom(), Some("Red"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_type_with_fields() {
        let form = SurfaceForm::Type {
            name: "Pair".into(),
            name_span: s(),
            constructors: vec![Constructor {
                name: "Pair".into(),
                name_span: s(),
                fields: vec![tp("number", "x"), tp("number", "y")],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // (function Pair (x y) [checks] (return (object ...)))
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("function"));
            assert_eq!(values[1].as_atom(), Some("Pair"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_type_multiple_constructors_no_block_wrapper() {
        let form = SurfaceForm::Type {
            name: "Color".into(),
            name_span: s(),
            constructors: vec![
                Constructor {
                    name: "Red".into(),
                    name_span: s(),
                    fields: vec![],
                    span: s(),
                },
                Constructor {
                    name: "Green".into(),
                    name_span: s(),
                    fields: vec![],
                    span: s(),
                },
            ],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        // Each constructor is a separate top-level form (no block wrapper)
        assert_eq!(result.len(), 2);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("const"));
            assert_eq!(values[1].as_atom(), Some("Red"));
        } else {
            panic!("expected const Red");
        }
        if let SExpr::List { values, .. } = &result[1] {
            assert_eq!(values[0].as_atom(), Some("const"));
            assert_eq!(values[1].as_atom(), Some("Green"));
        } else {
            panic!("expected const Green");
        }
    }

    // --- Fn ---

    #[test]
    fn test_emit_fn() {
        let form = SurfaceForm::Fn {
            params: vec![sp("number", "x")],
            body: vec![list(vec![atom("+"), atom("x"), num(1.0)])],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("=>"));
        } else {
            panic!("expected arrow function");
        }
    }

    // --- Func single clause ---

    #[test]
    fn test_emit_func_single_clause() {
        let form = SurfaceForm::Func {
            name: "add".into(),
            name_span: s(),
            clauses: vec![FuncClause {
                args: vec![sp("number", "a"), sp("number", "b")],
                returns: None,
                pre: None,
                post: None,
                body: vec![list(vec![atom("+"), atom("a"), atom("b")])],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("function"));
            assert_eq!(values[1].as_atom(), Some("add"));
        } else {
            panic!("expected function");
        }
    }

    // --- Func multi-clause ---

    #[test]
    fn test_emit_func_multi_clause() {
        let form = SurfaceForm::Func {
            name: "f".into(),
            name_span: s(),
            clauses: vec![
                FuncClause {
                    args: vec![sp("number", "x")],
                    returns: None,
                    pre: None,
                    post: None,
                    body: vec![atom("x")],
                    span: s(),
                },
                FuncClause {
                    args: vec![sp("string", "s")],
                    returns: None,
                    pre: None,
                    post: None,
                    body: vec![atom("s")],
                    span: s(),
                },
            ],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("function"));
            assert_eq!(values[1].as_atom(), Some("f"));
            // Third element: ((rest args))
            if let SExpr::List { values: params, .. } = &values[2] {
                if let SExpr::List { values: rest, .. } = &params[0] {
                    assert_eq!(rest[0].as_atom(), Some("rest"));
                } else {
                    panic!("expected rest param");
                }
            } else {
                panic!("expected params list");
            }
        } else {
            panic!("expected function");
        }
    }

    // --- Match ---

    #[test]
    fn test_emit_match_literal() {
        let form = SurfaceForm::Match {
            target: atom("x"),
            clauses: vec![
                MatchClause {
                    pattern: Pattern::Literal(num(1.0)),
                    guard: None,
                    body: vec![str_lit("one")],
                    span: s(),
                },
                MatchClause {
                    pattern: Pattern::Wildcard(s()),
                    guard: None,
                    body: vec![str_lit("other")],
                    span: s(),
                },
            ],
            span: s(),
        };
        // Statement context: target const, shared match bit and ordered candidates
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("block"));
            // Second element: (const target__gensymN x)
            if let SExpr::List {
                values: binding, ..
            } = &values[1]
            {
                assert_eq!(binding[0].as_atom(), Some("const"));
                assert_eq!(binding[2].as_atom(), Some("x"));
            } else {
                panic!("expected const binding");
            }
            // The shared bit begins false before the ordered candidate tests.
            let SExpr::List {
                values: matched, ..
            } = &values[2]
            else {
                panic!("expected matched-bit declaration");
            };
            assert_eq!(matched[0].as_atom(), Some("let"));
            assert!(matches!(&matched[2], SExpr::Bool { value: false, .. }));
            assert_eq!(values.len(), 5);
            // First candidate checks the literal only while no clause selected.
            if let SExpr::List {
                values: if_form, ..
            } = &values[3]
            {
                assert_eq!(if_form[0].as_atom(), Some("if"));
                let SExpr::List {
                    values: condition, ..
                } = &if_form[1]
                else {
                    panic!("expected unmatched and pattern condition");
                };
                assert_eq!(condition[0].as_atom(), Some("&&"));
                let SExpr::List {
                    values: pattern_check,
                    ..
                } = &condition[2]
                else {
                    panic!("expected literal pattern check");
                };
                assert_eq!(pattern_check[0].as_atom(), Some("==="));
                assert!(matches!(
                    &pattern_check[2],
                    SExpr::Number { value: 1.0, .. }
                ));
                let SExpr::List {
                    values: candidate, ..
                } = &if_form[2]
                else {
                    panic!("expected first candidate block");
                };
                let SExpr::List {
                    values: selected, ..
                } = &candidate[1]
                else {
                    panic!("expected selected clause body");
                };
                let selection = selected[1].as_list().unwrap();
                assert_eq!(selection[0].as_atom(), Some("="));
                assert!(matches!(&selection[2], SExpr::Bool { value: true, .. }));
                assert!(matches!(&selected[2], SExpr::String { value, .. } if value == "one"));
            } else {
                panic!("expected if form");
            }
            let SExpr::List {
                values: fallback, ..
            } = &values[4]
            else {
                panic!("expected wildcard candidate");
            };
            assert_eq!(fallback[0].as_atom(), Some("if"));
            let SExpr::List { values: guard, .. } = &fallback[1] else {
                panic!("expected unmatched check");
            };
            assert_eq!(guard[0].as_atom(), Some("!"));
            let SExpr::List {
                values: fallback_block,
                ..
            } = &fallback[2]
            else {
                panic!("expected fallback body block");
            };
            let SExpr::List {
                values: fallback_body,
                ..
            } = &fallback_block[1]
            else {
                panic!("expected selected fallback body");
            };
            assert!(matches!(&fallback_body[2], SExpr::String { value, .. } if value == "other"));
        } else {
            panic!("expected block");
        }
    }

    #[test]
    fn test_emit_statement_match_target_in_value_context() {
        let target = list(vec![atom("if"), atom("ready"), num(1.0), num(2.0)]);
        let form = SurfaceForm::Match {
            target,
            clauses: vec![MatchClause {
                pattern: Pattern::Wildcard(s()),
                guard: None,
                body: vec![num(0.0)],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        let SExpr::List { values: block, .. } = &result[0] else {
            panic!("expected statement match block");
        };
        let SExpr::List {
            values: binding, ..
        } = &block[1]
        else {
            panic!("expected target const binding");
        };
        let SExpr::List {
            values: initializer,
            ..
        } = &binding[2]
        else {
            panic!("expected value expression initializer");
        };
        assert_eq!(initializer[0].as_atom(), Some("?"));
        assert_eq!(c.expr_context, ExprContext::Statement);
    }

    #[test]
    fn test_emit_match_literal_value_context() {
        let form = SurfaceForm::Match {
            target: atom("x"),
            clauses: vec![
                MatchClause {
                    pattern: Pattern::Literal(num(1.0)),
                    guard: None,
                    body: vec![str_lit("one")],
                    span: s(),
                },
                MatchClause {
                    pattern: Pattern::Wildcard(s()),
                    guard: None,
                    body: vec![str_lit("other")],
                    span: s(),
                },
            ],
            span: s(),
        };
        // Value context: IIFE
        let mut c = ctx_value();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            if let SExpr::List { values: arrow, .. } = &values[0] {
                assert_eq!(arrow[0].as_atom(), Some("=>"));
            } else {
                panic!("expected arrow inside IIFE");
            }
        } else {
            panic!("expected IIFE list");
        }
    }

    // --- Match with constructor ---

    #[test]
    fn test_emit_match_constructor() {
        let mut r = reg();
        r.register_type(TypeDef {
            name: "Option".into(),
            module_path: None,
            constructors: vec![
                ConstructorDef {
                    name: "Some".into(),
                    fields: vec![FieldDef {
                        name: "value".into(),
                        type_keyword: "any".into(),
                    }],
                    owning_type: "Option".into(),
                    span: s(),
                },
                ConstructorDef {
                    name: "None".into(),
                    fields: vec![],
                    owning_type: "Option".into(),
                    span: s(),
                },
            ],
            is_blessed: false,
            span: s(),
        })
        .unwrap();

        let form = SurfaceForm::Match {
            target: atom("x"),
            clauses: vec![
                MatchClause {
                    pattern: Pattern::Constructor {
                        name: "Some".into(),
                        name_span: s(),
                        bindings: vec![Pattern::Binding {
                            name: "v".into(),
                            span: s(),
                        }],
                        span: s(),
                    },
                    guard: None,
                    body: vec![atom("v")],
                    span: s(),
                },
                MatchClause {
                    pattern: Pattern::Wildcard(s()),
                    guard: None,
                    body: vec![atom("null")],
                    span: s(),
                },
            ],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &r).unwrap();
        assert_eq!(result.len(), 1);
    }

    // --- Cond ---

    #[test]
    fn test_emit_cond_iife() {
        let form = SurfaceForm::Cond {
            clauses: vec![
                CondClause {
                    test: Some(list(vec![atom("="), atom("role"), str_lit("admin")])),
                    result: str_lit("Admin"),
                    span: s(),
                },
                CondClause {
                    test: None,
                    result: str_lit("User"),
                    span: s(),
                },
            ],
            span: s(),
        };
        let mut c = ctx_value();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        let SExpr::List { values, .. } = &result[0] else {
            panic!("expected IIFE");
        };
        let SExpr::List { values: arrow, .. } = &values[0] else {
            panic!("expected arrow inside IIFE");
        };
        assert_eq!(arrow[0].as_atom(), Some("=>"));
        let SExpr::List { values: block, .. } = &arrow[2] else {
            panic!("expected arrow block body");
        };
        assert_eq!(block[0].as_atom(), Some("block"));
        assert_eq!(block[1].as_list().unwrap()[0].as_atom(), Some("if"));
    }

    // --- KernelPassthrough ---

    #[test]
    fn test_emit_kernel_passthrough() {
        let raw = list(vec![atom("import"), str_lit("./foo.js")]);
        let form = SurfaceForm::KernelPassthrough {
            raw: raw.clone(),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        assert_eq!(result[0], raw);
    }

    // --- FunctionCall ---

    #[test]
    fn test_emit_function_call() {
        let form = SurfaceForm::FunctionCall {
            head: atom("add"),
            args: vec![num(1.0), num(2.0)],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("add"));
            assert_eq!(values.len(), 3);
        } else {
            panic!("expected list");
        }
    }

    // --- SomeThreadFirst ---

    #[test]
    fn test_emit_some_thread_first() {
        let form = SurfaceForm::SomeThreadFirst {
            initial: atom("x"),
            steps: vec![ThreadingStep::Bare(atom("inc"))],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be IIFE
        if let SExpr::List { values, .. } = &result[0] {
            if let SExpr::List { values: arrow, .. } = &values[0] {
                assert_eq!(arrow[0].as_atom(), Some("=>"));
            } else {
                panic!("expected arrow inside IIFE");
            }
        } else {
            panic!("expected IIFE");
        }
    }

    // --- IfLet ---

    #[test]
    fn test_emit_if_let() {
        let form = SurfaceForm::IfLet {
            pattern: Pattern::Binding {
                name: "v".into(),
                span: s(),
            },
            expr: atom("x"),
            then_body: atom("v"),
            else_body: Some(num(0.0)),
            span: s(),
        };
        // Statement context: bare if/else
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("block"));
        } else {
            panic!("expected block");
        }
    }

    #[test]
    fn test_emit_if_let_value_context() {
        let form = SurfaceForm::IfLet {
            pattern: Pattern::Binding {
                name: "v".into(),
                span: s(),
            },
            expr: atom("x"),
            then_body: atom("v"),
            else_body: Some(num(0.0)),
            span: s(),
        };
        // Value context: IIFE
        let mut c = ctx_value();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            if let SExpr::List { values: arrow, .. } = &values[0] {
                assert_eq!(arrow[0].as_atom(), Some("=>"));
            } else {
                panic!("expected arrow inside IIFE");
            }
        } else {
            panic!("expected IIFE");
        }
    }

    // --- WhenLet ---

    #[test]
    fn test_emit_when_let() {
        let form = SurfaceForm::WhenLet {
            pattern: Pattern::Binding {
                name: "v".into(),
                span: s(),
            },
            expr: atom("x"),
            body: vec![atom("v")],
            span: s(),
        };
        // Statement context: bare if
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("block"));
        } else {
            panic!("expected block");
        }
    }

    #[test]
    fn test_emit_when_let_value_context() {
        let form = SurfaceForm::WhenLet {
            pattern: Pattern::Binding {
                name: "v".into(),
                span: s(),
            },
            expr: atom("x"),
            body: vec![atom("v")],
            span: s(),
        };
        // Value context: IIFE
        let mut c = ctx_value();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            if let SExpr::List { values: arrow, .. } = &values[0] {
                assert_eq!(arrow[0].as_atom(), Some("=>"));
            } else {
                panic!("expected arrow inside IIFE");
            }
        } else {
            panic!("expected IIFE");
        }
    }

    // --- Strip assertions ---

    #[test]
    fn test_emit_func_strip_assertions_omits_type_checks() {
        let form = SurfaceForm::Func {
            name: "add".into(),
            name_span: s(),
            clauses: vec![FuncClause {
                args: vec![sp("number", "a"), sp("number", "b")],
                returns: None,
                pre: Some(list(vec![atom(">"), atom("a"), num(0.0)])),
                post: None,
                body: vec![list(vec![atom("+"), atom("a"), atom("b")])],
                span: s(),
            }],
            span: s(),
        };
        let mut c = EmitterContext::new(true);
        let result = emit_form(&form, &mut c, &reg()).unwrap();

        // With strip_assertions, no type checks or pre-checks
        if let SExpr::List { values, .. } = &result[0] {
            // function, name, params, (return ...)
            // No "if" nodes for type checks or pre
            let has_if = values.iter().any(|v| v.as_atom() == Some("if"));
            assert!(
                !has_if,
                "should not have if nodes when stripping assertions"
            );
        } else {
            panic!("expected list");
        }
    }

    // --- Lambda emits same as Fn ---

    #[test]
    fn test_emit_lambda_same_as_fn() {
        let params = vec![sp("any", "x")];
        let body = vec![atom("x")];

        let fn_form = SurfaceForm::Fn {
            params: params.clone(),
            body: body.clone(),
            span: s(),
        };
        let lambda_form = SurfaceForm::Lambda {
            params,
            body,
            span: s(),
        };

        let mut c1 = EmitterContext::new(true);
        let mut c2 = EmitterContext::new(true);
        let r = reg();

        let fn_result = emit_form(&fn_form, &mut c1, &r).unwrap();
        let lambda_result = emit_form(&lambda_form, &mut c2, &r).unwrap();

        assert_eq!(fn_result, lambda_result);
    }

    // --- contains_await detection ---

    #[test]
    fn test_contains_await_simple_atom() {
        assert!(!contains_await(&atom("x")));
        assert!(!contains_await(&num(42.0)));
        assert!(!contains_await(&str_lit("hello")));
    }

    #[test]
    fn test_contains_await_direct() {
        let expr = list(vec![atom("await"), list(vec![atom("fetch"), atom("url")])]);
        assert!(contains_await(&expr));
    }

    #[test]
    fn test_contains_await_nested() {
        let inner = list(vec![atom("await"), atom("p")]);
        let outer = list(vec![atom("then"), inner, atom("callback")]);
        assert!(contains_await(&outer));
    }

    #[test]
    fn test_contains_await_absent() {
        let expr = list(vec![atom("fetch"), atom("url")]);
        assert!(!contains_await(&expr));
    }

    #[test]
    fn test_contains_await_honours_resolution() {
        // arc13/slice11 F-5 (DD-60 D1): a lexically bound `await` head is a
        // plain call to the binding, not the operator, so it must NOT be
        // counted (else the enclosing if-let/match/threading form is wrongly
        // async-wrapped). An unresolved `await` head still counts.
        use crate::ast::sexpr::NameRes;
        let bound_await = atom("await").with_name_res(NameRes::BindingRef);
        let bound_call = list(vec![bound_await, num(987.0)]);
        assert!(
            !contains_await(&bound_call),
            "a bound `await` call head must not trigger async detection"
        );
        // The unresolved twin (the genuine operator) still counts.
        let operator = list(vec![atom("await"), num(987.0)]);
        assert!(contains_await(&operator));
    }

    #[test]
    fn test_contains_await_deeply_nested() {
        let deep = list(vec![
            atom("+"),
            num(1.0),
            list(vec![
                atom("*"),
                num(2.0),
                list(vec![atom("await"), list(vec![atom("get-value")])]),
            ]),
        ]);
        assert!(contains_await(&deep));
    }

    #[test]
    fn test_contains_current_await_respects_function_boundaries_and_for_await() {
        let await_expr = list(vec![atom("await"), atom("pending")]);
        let nested = list(vec![atom("=>"), list(vec![]), await_expr.clone()]);
        assert!(!contains_current_await(&nested));
        assert!(contains_current_await(&await_expr));
        assert!(contains_current_await(&list(vec![
            atom("for-await-of"),
            atom("item"),
            atom("items"),
            atom("item"),
        ])));
        let bound_await = atom("await").with_name_res(NameRes::BindingRef);
        assert!(!contains_current_await(&list(vec![
            bound_await,
            atom("pending")
        ])));
    }

    #[test]
    fn test_current_await_class_member_countercontrol() {
        let await_expr = list(vec![atom("await"), atom("load")]);
        let named_await = list(vec![atom("await"), list(vec![]), num(1.0)]);
        let deferred_async_method = list(vec![
            atom("async"),
            list(vec![atom("later"), list(vec![]), await_expr.clone()]),
        ]);
        let class = list(vec![
            atom("class"),
            atom("C"),
            list(vec![]),
            named_await.clone(),
            deferred_async_method.clone(),
        ]);
        let class_expr = list(vec![
            atom("class-expr"),
            list(vec![]),
            named_await,
            deferred_async_method,
        ]);
        assert!(!contains_current_await(&class));
        assert!(!contains_current_await(&class_expr));

        let eager_super = list(vec![atom("await"), list(vec![atom("load-super")])]);
        let class_with_async_super = list(vec![
            atom("class-expr"),
            list(vec![eager_super]),
            list(vec![
                atom("async"),
                list(vec![atom("ready"), list(vec![]), num(1.0)]),
            ]),
        ]);
        assert!(contains_current_await(&class_with_async_super));
    }

    #[test]
    fn test_resolved_bound_call_emits_if_argument_in_value_context() {
        let call = list(vec![
            atom("ensure").with_name_res(NameRes::BindingRef),
            list(vec![atom("if"), atom("ready"), num(1.0), num(0.0)]),
        ]);
        let mut context = ctx();
        let emitted = emit_expr(&call, &mut context, &reg());
        let values = emitted.as_list().expect("resolved call remains a list");
        let argument = values[1].as_list().expect("argument remains a list");
        assert_eq!(argument[0].as_form_head(), Some("?"));
        assert_eq!(context.expr_context, ExprContext::Statement);
    }

    #[test]
    fn test_async_value_carrier_covers_fallthrough_and_current_return() {
        fn returns_boxed(expr: &SExpr, payload: &SExpr) -> bool {
            let Some(values) = expr.as_list() else {
                return false;
            };
            let this_return = values.first().and_then(SExpr::as_form_head) == Some("return")
                && values.get(1).is_some_and(|value| {
                    value.as_list().is_some_and(|carrier| {
                        carrier.first().and_then(SExpr::as_form_head) == Some("array")
                            && carrier.get(1) == Some(payload)
                    })
                });
            this_return || values.iter().any(|value| returns_boxed(value, payload))
        }

        let await_expr = list(vec![atom("await"), atom("pending")]);
        let fallthrough_body = [
            await_expr.clone(),
            list(vec![
                atom("while"),
                bool_lit(false),
                list(vec![atom("block")]),
            ]),
        ];
        let mut context = ctx_value();
        let fallthrough = emit_do(&fallthrough_body, &mut context, &reg());
        assert!(returns_boxed(&fallthrough, &atom("undefined")));

        let return_body = [await_expr, list(vec![atom("return"), num(7.0)])];
        let mut context = ctx_value();
        let returned = emit_do(&return_body, &mut context, &reg());
        assert!(returns_boxed(&returned, &num(7.0)));
    }

    #[test]
    fn test_for_await_of_tail_stays_in_statement_position() {
        fn loop_in_return_array(expr: &SExpr) -> bool {
            let Some(values) = expr.as_list() else {
                return false;
            };
            let invalid_tail = values.first().and_then(SExpr::as_form_head) == Some("return")
                && values.get(1).is_some_and(|value| {
                    value.as_list().is_some_and(|carrier| {
                        carrier.first().and_then(SExpr::as_form_head) == Some("array")
                            && carrier
                                .get(1)
                                .and_then(SExpr::as_list)
                                .and_then(|values| values.first())
                                .and_then(SExpr::as_form_head)
                                == Some("for-await-of")
                    })
                });
            invalid_tail || values.iter().any(loop_in_return_array)
        }
        fn contains_for_await(expr: &SExpr) -> bool {
            expr.as_list().is_some_and(|values| {
                values.first().and_then(SExpr::as_form_head) == Some("for-await-of")
                    || values.iter().any(contains_for_await)
            })
        }

        let body = [
            list(vec![atom("await"), atom("pending")]),
            list(vec![
                atom("for-await-of"),
                atom("item"),
                atom("items"),
                list(vec![atom("block")]),
            ]),
        ];
        let mut context = ctx_value();
        let emitted = emit_do(&body, &mut context, &reg());
        assert!(
            contains_for_await(&emitted),
            "loop must remain in emitted Do"
        );
        assert!(
            !loop_in_return_array(&emitted),
            "for-await-of must not be emitted as a value return: {emitted:?}"
        );
    }

    // --- Match with await in target (Strategy 1) ---

    #[test]
    fn test_match_with_await_in_target() {
        let form = SurfaceForm::Match {
            target: list(vec![atom("await"), list(vec![atom("fetch"), atom("url")])]),
            clauses: vec![MatchClause {
                pattern: Pattern::Wildcard(s()),
                guard: None,
                body: vec![str_lit("done")],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx_value();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be (block (const await__gensymN ...) ((=> () ...)))
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("block"));
            // Second element: (const await__gensym0 (await (fetch url)))
            if let SExpr::List { values: hoist, .. } = &values[1] {
                assert_eq!(hoist[0].as_atom(), Some("const"));
                assert!(
                    hoist[1].as_atom().unwrap().starts_with("await__gensym"),
                    "hoisted var should start with await__gensym"
                );
            } else {
                panic!("expected hoist const");
            }
            // Third element: IIFE ((=> () ...))
            if let SExpr::List { values: iife, .. } = &values[2] {
                if let SExpr::List { values: arrow, .. } = &iife[0] {
                    assert_eq!(arrow[0].as_atom(), Some("=>"));
                } else {
                    panic!("expected arrow inside IIFE");
                }
            } else {
                panic!("expected IIFE");
            }
        } else {
            panic!("expected block wrapping hoist + IIFE");
        }
    }

    // --- Match with await in body (Strategy 2) ---

    #[test]
    fn test_match_with_await_in_body() {
        let form = SurfaceForm::Match {
            target: atom("response"),
            clauses: vec![MatchClause {
                pattern: Pattern::Wildcard(s()),
                guard: None,
                body: vec![list(vec![
                    atom("await"),
                    list(vec![atom("fetch"), atom("url")]),
                ])],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx_value();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be (await ((async (=> () ...))))
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("await"), "outer should be await");
            // values[1] should be ((async (=> () ...)))
            if let SExpr::List { values: call, .. } = &values[1] {
                if let SExpr::List {
                    values: async_arrow,
                    ..
                } = &call[0]
                {
                    assert_eq!(async_arrow[0].as_atom(), Some("async"));
                } else {
                    panic!("expected async arrow");
                }
            } else {
                panic!("expected call expression");
            }
        } else {
            panic!("expected await expression");
        }
    }

    // --- Match with await in both target and body ---

    #[test]
    fn test_match_with_await_in_both() {
        let form = SurfaceForm::Match {
            target: list(vec![atom("await"), list(vec![atom("fetch"), atom("url")])]),
            clauses: vec![MatchClause {
                pattern: Pattern::Wildcard(s()),
                guard: None,
                body: vec![list(vec![atom("await"), list(vec![atom("process")])])],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx_value();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be (block (const await__gensym ...) (await ((async (=> () ...)))))
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("block"));
            // Hoist
            if let SExpr::List { values: hoist, .. } = &values[1] {
                assert_eq!(hoist[0].as_atom(), Some("const"));
            } else {
                panic!("expected hoist");
            }
            // Async IIFE
            if let SExpr::List {
                values: await_expr, ..
            } = &values[2]
            {
                assert_eq!(await_expr[0].as_atom(), Some("await"));
            } else {
                panic!("expected await-wrapped IIFE");
            }
        } else {
            panic!("expected block");
        }
    }

    // --- some-> with await in initial (Strategy 1) ---

    #[test]
    fn test_some_thread_with_await_in_initial() {
        let form = SurfaceForm::SomeThreadFirst {
            initial: list(vec![atom("await"), list(vec![atom("fetch"), atom("url")])]),
            steps: vec![ThreadingStep::Bare(atom("inc"))],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be (block (const await__gensym ...) ((=> () ...)))
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("block"));
            if let SExpr::List { values: hoist, .. } = &values[1] {
                assert_eq!(hoist[0].as_atom(), Some("const"));
                assert!(hoist[1].as_atom().unwrap().starts_with("await__gensym"));
            } else {
                panic!("expected hoist const");
            }
        } else {
            panic!("expected block");
        }
    }

    // --- some-> with await in steps (Strategy 2) ---

    #[test]
    fn test_some_thread_with_await_in_steps() {
        let form = SurfaceForm::SomeThreadFirst {
            initial: atom("x"),
            steps: vec![ThreadingStep::Call(vec![
                atom("await"),
                list(vec![atom("fetch")]),
            ])],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be (await ((async (=> () ...))))
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("await"));
        } else {
            panic!("expected await-wrapped IIFE");
        }
    }

    // --- if-let with await in expr (Strategy 1) ---

    #[test]
    fn test_if_let_with_await_in_expr() {
        let form = SurfaceForm::IfLet {
            pattern: Pattern::Binding {
                name: "v".into(),
                span: s(),
            },
            expr: list(vec![atom("await"), list(vec![atom("fetch"), atom("url")])]),
            then_body: atom("v"),
            else_body: Some(num(0.0)),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be (block (const await__gensym ...) ((=> () ...)))
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("block"));
            if let SExpr::List { values: hoist, .. } = &values[1] {
                assert_eq!(hoist[0].as_atom(), Some("const"));
            } else {
                panic!("expected hoist");
            }
        } else {
            panic!("expected block");
        }
    }

    // --- if-let with await in body (Strategy 2) ---

    #[test]
    fn test_if_let_with_await_in_body() {
        let form = SurfaceForm::IfLet {
            pattern: Pattern::Binding {
                name: "v".into(),
                span: s(),
            },
            expr: atom("x"),
            then_body: list(vec![atom("await"), list(vec![atom("process"), atom("v")])]),
            else_body: None,
            span: s(),
        };
        let mut c = ctx_value();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be (await ((async (=> () ...))))
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("await"));
        } else {
            panic!("expected await-wrapped IIFE");
        }
    }

    // --- when-let with await in expr (Strategy 1) ---

    #[test]
    fn test_when_let_with_await_in_expr() {
        let form = SurfaceForm::WhenLet {
            pattern: Pattern::Binding {
                name: "v".into(),
                span: s(),
            },
            expr: list(vec![atom("await"), list(vec![atom("fetch"), atom("url")])]),
            body: vec![atom("v")],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("block"));
        } else {
            panic!("expected block");
        }
    }

    // --- when-let with await in body (Strategy 2) ---

    #[test]
    fn test_when_let_with_await_in_body() {
        let form = SurfaceForm::WhenLet {
            pattern: Pattern::Binding {
                name: "v".into(),
                span: s(),
            },
            expr: atom("x"),
            body: vec![list(vec![
                atom("await"),
                list(vec![atom("process"), atom("v")]),
            ])],
            span: s(),
        };
        let mut c = ctx_value();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("await"));
        } else {
            panic!("expected await-wrapped IIFE");
        }
    }

    // --- No-await cases still produce plain IIFEs ---

    #[test]
    fn test_match_without_await_unchanged() {
        let form = SurfaceForm::Match {
            target: atom("x"),
            clauses: vec![MatchClause {
                pattern: Pattern::Wildcard(s()),
                guard: None,
                body: vec![str_lit("done")],
                span: s(),
            }],
            span: s(),
        };
        // Value context: plain IIFE (no async wrapper)
        let mut c = ctx_value();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be plain IIFE: ((=> () ...))
        if let SExpr::List { values, .. } = &result[0] {
            if let SExpr::List { values: arrow, .. } = &values[0] {
                assert_eq!(arrow[0].as_atom(), Some("=>"));
            } else {
                panic!("expected arrow inside IIFE");
            }
        } else {
            panic!("expected IIFE");
        }
    }

    // =======================================================================
    // js: namespace interop forms
    // =======================================================================

    #[test]
    fn test_js_call() {
        let form = SurfaceForm::FunctionCall {
            head: atom("js:call"),
            args: vec![atom("console:log"), str_lit("hello")],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // (js:call console:log "hello") -> (console:log "hello")
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("console:log"));
            if let SExpr::String { value, .. } = &values[1] {
                assert_eq!(value, "hello");
            } else {
                panic!("expected string arg");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_js_bind_with_this() {
        let form = SurfaceForm::FunctionCall {
            head: atom("js:bind"),
            args: vec![atom("obj:method"), atom("obj")],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // (js:bind obj:method obj) -> (obj:method:bind obj)
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("obj:method:bind"));
            assert_eq!(values[1].as_atom(), Some("obj"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_js_bind_without_this() {
        // Only method, no this arg -> uses "undefined"
        let form = SurfaceForm::FunctionCall {
            head: atom("js:bind"),
            args: vec![atom("obj:method")],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("obj:method:bind"));
            assert_eq!(values[1].as_atom(), Some("undefined"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_js_bind_fallback_non_atom() {
        // First arg is not an atom -> fallback passthrough
        let form = SurfaceForm::FunctionCall {
            head: atom("js:bind"),
            args: vec![num(42.0)],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("js:bind"));
        } else {
            panic!("expected fallback list");
        }
    }

    #[test]
    fn test_js_eval() {
        let form = SurfaceForm::FunctionCall {
            head: atom("js:eval"),
            args: vec![str_lit("1 + 2")],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // (js:eval "1 + 2") -> (eval "1 + 2")
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("eval"));
            if let SExpr::String { value, .. } = &values[1] {
                assert_eq!(value, "1 + 2");
            } else {
                panic!("expected string");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_js_eval_no_args() {
        let form = SurfaceForm::FunctionCall {
            head: atom("js:eval"),
            args: vec![],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("eval"));
            assert_eq!(values[1].as_atom(), Some("undefined"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_js_eq() {
        let form = SurfaceForm::FunctionCall {
            head: atom("js:eq"),
            args: vec![atom("a"), atom("b")],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // (js:eq a b) -> (== a b)
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("=="));
            assert_eq!(values[1].as_atom(), Some("a"));
            assert_eq!(values[2].as_atom(), Some("b"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_js_eq_no_args() {
        let form = SurfaceForm::FunctionCall {
            head: atom("js:eq"),
            args: vec![],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("=="));
            assert_eq!(values[1].as_atom(), Some("undefined"));
            assert_eq!(values[2].as_atom(), Some("undefined"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_js_typeof() {
        let form = SurfaceForm::FunctionCall {
            head: atom("js:typeof"),
            args: vec![atom("x")],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // (js:typeof x) -> (typeof x)
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("typeof"));
            assert_eq!(values[1].as_atom(), Some("x"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_js_typeof_no_args() {
        let form = SurfaceForm::FunctionCall {
            head: atom("js:typeof"),
            args: vec![],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("typeof"));
            assert_eq!(values[1].as_atom(), Some("undefined"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_js_unknown_form_passthrough() {
        let form = SurfaceForm::FunctionCall {
            head: atom("js:unknown"),
            args: vec![atom("x")],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("js:unknown"));
            assert_eq!(values[1].as_atom(), Some("x"));
        } else {
            panic!("expected passthrough list");
        }
    }

    // =======================================================================
    // Conj / Assoc / Dissoc
    // =======================================================================

    #[test]
    fn test_emit_conj() {
        let form = SurfaceForm::Conj {
            arr: atom("xs"),
            value: num(42.0),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // (conj xs 42) -> (array (spread xs) 42)
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("array"));
            if let SExpr::List {
                values: spread_vals,
                ..
            } = &values[1]
            {
                assert_eq!(spread_vals[0].as_atom(), Some("spread"));
                assert_eq!(spread_vals[1].as_atom(), Some("xs"));
            } else {
                panic!("expected spread");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_assoc() {
        let form = SurfaceForm::Assoc {
            obj: atom("m"),
            pairs: vec![("name".into(), str_lit("Alice"))],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // (assoc m :name "Alice") -> (object (spread m) (name "Alice"))
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("object"));
            if let SExpr::List {
                values: spread_vals,
                ..
            } = &values[1]
            {
                assert_eq!(spread_vals[0].as_atom(), Some("spread"));
                assert_eq!(spread_vals[1].as_atom(), Some("m"));
            } else {
                panic!("expected spread");
            }
            if let SExpr::List { values: pair, .. } = &values[2] {
                assert_eq!(pair[0].as_atom(), Some("name"));
            } else {
                panic!("expected pair");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_dissoc() {
        let form = SurfaceForm::Dissoc {
            obj: atom("m"),
            keys: vec!["name".into()],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be IIFE: ((=> () (const (object ...) m) (return rest_var)))
        if let SExpr::List { values, .. } = &result[0] {
            if let SExpr::List { values: arrow, .. } = &values[0] {
                assert_eq!(arrow[0].as_atom(), Some("=>"));
                // Body should have const with destructuring pattern
                if let SExpr::List {
                    values: const_form, ..
                } = &arrow[2]
                {
                    assert_eq!(const_form[0].as_atom(), Some("const"));
                } else {
                    panic!("expected const form in arrow body");
                }
                // Last element should be (return rest_var)
                if let SExpr::List {
                    values: ret_form, ..
                } = &arrow[3]
                {
                    assert_eq!(ret_form[0].as_atom(), Some("return"));
                } else {
                    panic!("expected return form in arrow body");
                }
            } else {
                panic!("expected arrow inside IIFE");
            }
        } else {
            panic!("expected IIFE");
        }
    }

    // =======================================================================
    // SetSymbol
    // =======================================================================

    #[test]
    fn test_emit_set_symbol() {
        let form = SurfaceForm::SetSymbol {
            obj: atom("item"),
            key: atom("META"),
            value: num(42.0),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be (= (get item META) 42)
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values.len(), 3);
            assert_eq!(values[0].as_atom(), Some("="));
            if let SExpr::List {
                values: get_form, ..
            } = &values[1]
            {
                assert_eq!(get_form[0].as_atom(), Some("get"));
                assert_eq!(get_form[1].as_atom(), Some("item"));
                assert_eq!(get_form[2].as_atom(), Some("META"));
            } else {
                panic!("expected (get ...) form");
            }
            // value is a number
            assert!(matches!(&values[2], SExpr::Number { value, .. } if *value == 42.0));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_set_symbol_with_expression_key() {
        let form = SurfaceForm::SetSymbol {
            obj: atom("this"),
            key: list(vec![atom("Symbol"), str_lit("meta")]),
            value: list(vec![atom("object"), list(vec![atom("version"), num(1.0)])]),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("="));
            if let SExpr::List {
                values: get_form, ..
            } = &values[1]
            {
                assert_eq!(get_form[0].as_atom(), Some("get"));
                assert_eq!(get_form[1].as_atom(), Some("this"));
                if let SExpr::List {
                    values: sym_form, ..
                } = &get_form[2]
                {
                    assert_eq!(sym_form[0].as_atom(), Some("Symbol"));
                } else {
                    panic!("expected Symbol form");
                }
            } else {
                panic!("expected (get ...) form");
            }
        } else {
            panic!("expected list");
        }
    }

    // =======================================================================
    // resolve_cell_target with complex (non-atom) target
    // =======================================================================

    #[test]
    fn test_express_complex_target() {
        // A non-atom target should emit (get <expr> "value")
        let form = SurfaceForm::Express {
            target: list(vec![atom("get-cell")]),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("get"));
            if let SExpr::String { value, .. } = &values[2] {
                assert_eq!(value, "value");
            } else {
                panic!("expected 'value' string");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_swap_complex_target() {
        let form = SurfaceForm::Swap {
            target: list(vec![atom("get-cell")]),
            func: atom("inc"),
            extra_args: vec![num(1.0)],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("="));
            // target_val should be (get ... "value")
            if let SExpr::List {
                values: get_form, ..
            } = &values[1]
            {
                assert_eq!(get_form[0].as_atom(), Some("get"));
            } else {
                panic!("expected get form for complex target");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_reset_complex_target() {
        let form = SurfaceForm::Reset {
            target: list(vec![atom("get-cell")]),
            value: num(0.0),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("="));
            if let SExpr::List {
                values: get_form, ..
            } = &values[1]
            {
                assert_eq!(get_form[0].as_atom(), Some("get"));
            } else {
                panic!("expected get form");
            }
        } else {
            panic!("expected list");
        }
    }

    // =======================================================================
    // Threading with Call steps (thread-last bare, empty Call)
    // =======================================================================

    #[test]
    fn test_thread_last_bare() {
        let form = SurfaceForm::ThreadLast {
            initial: num(1.0),
            steps: vec![ThreadingStep::Bare(atom("inc"))],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // (inc 1)
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("inc"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_thread_first_empty_call_returns_acc() {
        // An empty Call step should return the accumulator unchanged
        let form = SurfaceForm::ThreadFirst {
            initial: num(1.0),
            steps: vec![ThreadingStep::Call(vec![])],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::Number { value, .. } = &result[0] {
            assert!((value - 1.0).abs() < f64::EPSILON);
        } else {
            panic!("expected number (acc returned unchanged)");
        }
    }

    #[test]
    fn test_thread_last_call_with_extra_args() {
        // (thread-last 1 (add 2 3)) -> (add 2 3 1)
        let form = SurfaceForm::ThreadLast {
            initial: num(1.0),
            steps: vec![ThreadingStep::Call(vec![atom("add"), num(2.0), num(3.0)])],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("add"));
            assert_eq!(values.len(), 4); // add 2 3 1
            // Last should be 1.0
            if let SExpr::Number { value, .. } = values.last().unwrap() {
                assert!((value - 1.0).abs() < f64::EPSILON);
            } else {
                panic!("expected number at end");
            }
        } else {
            panic!("expected list");
        }
    }

    // =======================================================================
    // some-> with no steps
    // =======================================================================

    #[test]
    fn test_some_thread_no_steps() {
        let form = SurfaceForm::SomeThreadFirst {
            initial: atom("x"),
            steps: vec![],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // IIFE that just returns the initial value
        if let SExpr::List { values, .. } = &result[0] {
            if let SExpr::List { values: arrow, .. } = &values[0] {
                assert_eq!(arrow[0].as_atom(), Some("=>"));
                // Should contain a return
                let has_return = arrow.iter().any(|v| {
                    if let SExpr::List { values, .. } = v {
                        values.first().and_then(|f| f.as_atom()) == Some("return")
                    } else {
                        false
                    }
                });
                assert!(has_return, "should have a return statement");
            } else {
                panic!("expected arrow");
            }
        } else {
            panic!("expected IIFE");
        }
    }

    #[test]
    fn test_some_thread_last() {
        let form = SurfaceForm::SomeThreadLast {
            initial: atom("x"),
            steps: vec![ThreadingStep::Bare(atom("inc"))],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be IIFE with null checks
        if let SExpr::List { values, .. } = &result[0] {
            if let SExpr::List { values: arrow, .. } = &values[0] {
                assert_eq!(arrow[0].as_atom(), Some("=>"));
            } else {
                panic!("expected arrow");
            }
        } else {
            panic!("expected IIFE");
        }
    }

    #[test]
    fn test_some_thread_multiple_steps() {
        let form = SurfaceForm::SomeThreadFirst {
            initial: atom("x"),
            steps: vec![
                ThreadingStep::Bare(atom("inc")),
                ThreadingStep::Bare(atom("double")),
            ],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // IIFE with intermediate null checks
        if let SExpr::List { values, .. } = &result[0] {
            if let SExpr::List { values: arrow, .. } = &values[0] {
                assert_eq!(arrow[0].as_atom(), Some("=>"));
                // Should have multiple const bindings and null checks
                let const_count = arrow
                    .iter()
                    .filter(|v| {
                        if let SExpr::List { values, .. } = v {
                            values.first().and_then(|f| f.as_atom()) == Some("const")
                        } else {
                            false
                        }
                    })
                    .count();
                // At least t0 and t1 const bindings
                assert!(const_count >= 2, "should have at least 2 const bindings");
            } else {
                panic!("expected arrow");
            }
        } else {
            panic!("expected IIFE");
        }
    }

    // =======================================================================
    // Func with return types (void, typed, any)
    // =======================================================================

    #[test]
    fn test_func_returns_void() {
        let form = SurfaceForm::Func {
            name: "log".into(),
            name_span: s(),
            clauses: vec![FuncClause {
                args: vec![sp("string", "msg")],
                returns: Some(ta("void")),
                pre: None,
                post: None,
                body: vec![list(vec![atom("console:log"), atom("msg")])],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            // void function: no return statement at the end
            let last = values.last().unwrap();
            if let SExpr::List { values: last_v, .. } = last {
                assert_ne!(
                    last_v[0].as_atom(),
                    Some("return"),
                    "void func should not have return"
                );
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_func_returns_typed() {
        let form = SurfaceForm::Func {
            name: "double".into(),
            name_span: s(),
            clauses: vec![FuncClause {
                args: vec![sp("number", "x")],
                returns: Some(ta("number")),
                pre: None,
                post: None,
                body: vec![list(vec![atom("*"), atom("x"), num(2.0)])],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            // Should have a return-type check before the return
            let has_return = values.iter().any(|v| {
                if let SExpr::List { values, .. } = v {
                    values.first().and_then(|f| f.as_atom()) == Some("return")
                } else {
                    false
                }
            });
            assert!(has_return, "typed return func should have return");
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_func_returns_any() {
        let form = SurfaceForm::Func {
            name: "identity".into(),
            name_span: s(),
            clauses: vec![FuncClause {
                args: vec![sp("any", "x")],
                returns: Some(ta("any")),
                pre: None,
                post: None,
                body: vec![atom("x")],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            // returns any: implicit return, no type check
            let last = values.last().unwrap();
            if let SExpr::List { values: last_v, .. } = last {
                assert_eq!(last_v[0].as_atom(), Some("return"));
            } else {
                panic!("expected return");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_func_returns_typed_strip_assertions() {
        let form = SurfaceForm::Func {
            name: "double".into(),
            name_span: s(),
            clauses: vec![FuncClause {
                args: vec![sp("number", "x")],
                returns: Some(ta("number")),
                pre: None,
                post: None,
                body: vec![list(vec![atom("*"), atom("x"), num(2.0)])],
                span: s(),
            }],
            span: s(),
        };
        let mut c = EmitterContext::new(true);
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            // With strip_assertions, just a plain return
            let last = values.last().unwrap();
            if let SExpr::List { values: last_v, .. } = last {
                assert_eq!(last_v[0].as_atom(), Some("return"));
            } else {
                panic!("expected return");
            }
        } else {
            panic!("expected list");
        }
    }

    // =======================================================================
    // Func with pre/post conditions
    // =======================================================================

    #[test]
    fn test_func_with_pre_condition() {
        let form = SurfaceForm::Func {
            name: "sqrt".into(),
            name_span: s(),
            clauses: vec![FuncClause {
                args: vec![sp("number", "x")],
                returns: None,
                pre: Some(list(vec![atom(">="), atom("x"), num(0.0)])),
                post: None,
                body: vec![list(vec![atom("Math:sqrt"), atom("x")])],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should have an if block for pre-condition check
        if let SExpr::List { values, .. } = &result[0] {
            let has_if = values.iter().any(|v| {
                if let SExpr::List { values, .. } = v {
                    values.first().and_then(|f| f.as_atom()) == Some("if")
                } else {
                    false
                }
            });
            assert!(has_if, "pre-condition should generate an if check");
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_func_with_post_condition() {
        let form = SurfaceForm::Func {
            name: "abs".into(),
            name_span: s(),
            clauses: vec![FuncClause {
                args: vec![sp("number", "x")],
                returns: None,
                pre: None,
                post: Some(list(vec![atom(">="), atom("%"), num(0.0)])),
                body: vec![list(vec![atom("Math:abs"), atom("x")])],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Post-condition: should capture result in gensym, check, then return
        if let SExpr::List { values, .. } = &result[0] {
            let has_return = values.iter().any(|v| {
                if let SExpr::List { values, .. } = v {
                    values.first().and_then(|f| f.as_atom()) == Some("return")
                } else {
                    false
                }
            });
            assert!(has_return, "post-condition path should return");
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_func_with_post_and_if_body_uses_ternary() {
        // When the body is an (if ...) form and the function has a :post condition,
        // the result capture must use a ternary (? ...) instead of an if statement,
        // because `const x = if (...)` is invalid JavaScript.
        let form = SurfaceForm::Func {
            name: "abs-val".into(),
            name_span: s(),
            clauses: vec![FuncClause {
                args: vec![sp("number", "x")],
                returns: None,
                pre: None,
                post: Some(list(vec![atom(">="), atom("%"), num(0.0)])),
                body: vec![list(vec![
                    atom("if"),
                    list(vec![atom("<"), atom("x"), num(0.0)]),
                    list(vec![atom("-"), num(0.0), atom("x")]),
                    atom("x"),
                ])],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            // Find the const assignment: (const result__gensymN ...)
            let const_form = values.iter().find(|v| {
                if let SExpr::List { values, .. } = v {
                    values.first().and_then(|f| f.as_atom()) == Some("const")
                } else {
                    false
                }
            });
            assert!(const_form.is_some(), "should have a const binding");
            if let SExpr::List { values: cv, .. } = const_form.unwrap() {
                // The third element (the value) should be (? ...) not (if ...)
                if let SExpr::List { values: val, .. } = &cv[2] {
                    assert_eq!(
                        val[0].as_atom(),
                        Some("?"),
                        "if-form in value position should be converted to ternary"
                    );
                } else {
                    panic!("expected list as const value");
                }
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_func_with_post_and_multi_body() {
        let form = SurfaceForm::Func {
            name: "process".into(),
            name_span: s(),
            clauses: vec![FuncClause {
                args: vec![sp("any", "x")],
                returns: None,
                pre: None,
                post: Some(list(vec![atom("!="), atom("%"), atom("null")])),
                body: vec![
                    list(vec![atom("console:log"), atom("x")]),
                    list(vec![atom("transform"), atom("x")]),
                ],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Multi-body + post: all but last as statements, last captured
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("function"));
        } else {
            panic!("expected function");
        }
    }

    #[test]
    fn test_func_returns_typed_multi_body() {
        let form = SurfaceForm::Func {
            name: "process".into(),
            name_span: s(),
            clauses: vec![FuncClause {
                args: vec![sp("any", "x")],
                returns: Some(ta("number")),
                pre: None,
                post: None,
                body: vec![
                    list(vec![atom("console:log"), atom("x")]),
                    list(vec![atom("+"), atom("x"), num(1.0)]),
                ],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    #[test]
    fn test_func_returns_typed_empty_body() {
        let form = SurfaceForm::Func {
            name: "noop".into(),
            name_span: s(),
            clauses: vec![FuncClause {
                args: vec![],
                returns: Some(ta("number")),
                pre: None,
                post: None,
                body: vec![],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    #[test]
    fn test_func_implicit_return_empty_body() {
        let form = SurfaceForm::Func {
            name: "noop".into(),
            name_span: s(),
            clauses: vec![FuncClause {
                args: vec![],
                returns: None,
                pre: None,
                post: None,
                body: vec![],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            let last = values.last().unwrap();
            if let SExpr::List { values: ret, .. } = last {
                assert_eq!(ret[0].as_atom(), Some("return"));
                assert_eq!(ret[1].as_atom(), Some("undefined"));
            } else {
                panic!("expected return undefined");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_func_implicit_return_multi_body() {
        let form = SurfaceForm::Func {
            name: "process".into(),
            name_span: s(),
            clauses: vec![FuncClause {
                args: vec![],
                returns: None,
                pre: None,
                post: None,
                body: vec![
                    list(vec![atom("console:log"), str_lit("a")]),
                    list(vec![atom("console:log"), str_lit("b")]),
                    num(42.0),
                ],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            // Last should be (return 42)
            let last = values.last().unwrap();
            if let SExpr::List { values: ret, .. } = last {
                assert_eq!(ret[0].as_atom(), Some("return"));
            } else {
                panic!("expected return");
            }
        } else {
            panic!("expected list");
        }
    }

    // =======================================================================
    // Func multi-clause with typed dispatch
    // =======================================================================

    #[test]
    fn test_func_multi_clause_different_arity() {
        let form = SurfaceForm::Func {
            name: "f".into(),
            name_span: s(),
            clauses: vec![
                FuncClause {
                    args: vec![sp("any", "x")],
                    returns: None,
                    pre: None,
                    post: None,
                    body: vec![atom("x")],
                    span: s(),
                },
                FuncClause {
                    args: vec![sp("any", "x"), sp("any", "y")],
                    returns: None,
                    pre: None,
                    post: None,
                    body: vec![list(vec![atom("+"), atom("x"), atom("y")])],
                    span: s(),
                },
            ],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("function"));
            // Should have throw at the end
            let last = values.last().unwrap();
            if let SExpr::List { values: throw, .. } = last {
                assert_eq!(throw[0].as_atom(), Some("throw"));
            } else {
                panic!("expected throw");
            }
        } else {
            panic!("expected function");
        }
    }

    #[test]
    fn test_func_multi_clause_with_post() {
        let form = SurfaceForm::Func {
            name: "f".into(),
            name_span: s(),
            clauses: vec![
                FuncClause {
                    args: vec![sp("number", "x")],
                    returns: None,
                    pre: None,
                    post: Some(list(vec![atom(">"), atom("%"), num(0.0)])),
                    body: vec![atom("x")],
                    span: s(),
                },
                FuncClause {
                    args: vec![sp("string", "s")],
                    returns: None,
                    pre: None,
                    post: None,
                    body: vec![atom("s")],
                    span: s(),
                },
            ],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    #[test]
    fn test_func_multi_clause_with_pre() {
        let form = SurfaceForm::Func {
            name: "f".into(),
            name_span: s(),
            clauses: vec![
                FuncClause {
                    args: vec![sp("number", "x")],
                    returns: None,
                    pre: Some(list(vec![atom(">"), atom("x"), num(0.0)])),
                    post: None,
                    body: vec![atom("x")],
                    span: s(),
                },
                FuncClause {
                    args: vec![sp("string", "s")],
                    returns: None,
                    pre: None,
                    post: None,
                    body: vec![atom("s")],
                    span: s(),
                },
            ],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    #[test]
    fn test_func_multi_clause_empty_body() {
        let form = SurfaceForm::Func {
            name: "f".into(),
            name_span: s(),
            clauses: vec![
                FuncClause {
                    args: vec![sp("number", "x")],
                    returns: None,
                    pre: None,
                    post: None,
                    body: vec![],
                    span: s(),
                },
                FuncClause {
                    args: vec![sp("string", "s")],
                    returns: None,
                    pre: None,
                    post: None,
                    body: vec![atom("s")],
                    span: s(),
                },
            ],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    #[test]
    fn test_func_multi_clause_multi_body() {
        let form = SurfaceForm::Func {
            name: "f".into(),
            name_span: s(),
            clauses: vec![
                FuncClause {
                    args: vec![sp("number", "x")],
                    returns: None,
                    pre: None,
                    post: None,
                    body: vec![list(vec![atom("console:log"), atom("x")]), atom("x")],
                    span: s(),
                },
                FuncClause {
                    args: vec![sp("string", "s")],
                    returns: None,
                    pre: None,
                    post: None,
                    body: vec![atom("s")],
                    span: s(),
                },
            ],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    #[test]
    fn test_func_multi_clause_post_empty_body() {
        let form = SurfaceForm::Func {
            name: "f".into(),
            name_span: s(),
            clauses: vec![
                FuncClause {
                    args: vec![sp("number", "x")],
                    returns: None,
                    pre: None,
                    post: Some(list(vec![atom(">"), atom("%"), num(0.0)])),
                    body: vec![],
                    span: s(),
                },
                FuncClause {
                    args: vec![sp("string", "s")],
                    returns: None,
                    pre: None,
                    post: None,
                    body: vec![atom("s")],
                    span: s(),
                },
            ],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    #[test]
    fn test_func_multi_clause_post_multi_body() {
        let form = SurfaceForm::Func {
            name: "f".into(),
            name_span: s(),
            clauses: vec![
                FuncClause {
                    args: vec![sp("number", "x")],
                    returns: None,
                    pre: None,
                    post: Some(list(vec![atom(">"), atom("%"), num(0.0)])),
                    body: vec![list(vec![atom("console:log"), atom("x")]), atom("x")],
                    span: s(),
                },
                FuncClause {
                    args: vec![sp("string", "s")],
                    returns: None,
                    pre: None,
                    post: None,
                    body: vec![atom("s")],
                    span: s(),
                },
            ],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    // =======================================================================
    // build_dispatch_check — various type keywords
    // =======================================================================

    #[test]
    fn test_dispatch_check_boolean() {
        let expr = atom("x");
        let result = build_dispatch_check("boolean", &expr);
        assert!(result.is_some());
        if let Some(SExpr::List { values, .. }) = result {
            assert_eq!(values[0].as_atom(), Some("==="));
        }
    }

    #[test]
    fn test_dispatch_check_function() {
        let expr = atom("x");
        let result = build_dispatch_check("function", &expr);
        assert!(result.is_some());
    }

    #[test]
    fn test_dispatch_check_object() {
        let expr = atom("x");
        let result = build_dispatch_check("object", &expr);
        assert!(result.is_some());
        // Should be (&& (=== typeof "object") (!== x null))
        if let Some(SExpr::List { values, .. }) = result {
            assert_eq!(values[0].as_atom(), Some("&&"));
        }
    }

    #[test]
    fn test_dispatch_check_array() {
        let expr = atom("x");
        let result = build_dispatch_check("array", &expr);
        assert!(result.is_some());
        if let Some(SExpr::List { values, .. }) = result {
            assert_eq!(values[0].as_atom(), Some("Array:isArray"));
        }
    }

    #[test]
    fn test_dispatch_check_any() {
        let result = build_dispatch_check("any", &atom("x"));
        assert!(result.is_none());
    }

    #[test]
    fn test_dispatch_check_user_type() {
        let expr = atom("x");
        let result = build_dispatch_check("MyType", &expr);
        assert!(result.is_some());
        // User-defined: typeof "object" && !== null && "tag" in x
        if let Some(SExpr::List { values, .. }) = result {
            assert_eq!(values[0].as_atom(), Some("&&"));
        }
    }

    // =======================================================================
    // Match with Obj pattern
    // =======================================================================

    #[test]
    fn test_match_obj_pattern_statement() {
        let form = SurfaceForm::Match {
            target: atom("x"),
            clauses: vec![
                MatchClause {
                    pattern: Pattern::Obj {
                        pairs: vec![
                            (
                                "name".into(),
                                Pattern::Binding {
                                    name: "n".into(),
                                    span: s(),
                                },
                            ),
                            ("age".into(), Pattern::Wildcard(s())),
                        ],
                        span: s(),
                    },
                    guard: None,
                    body: vec![atom("n")],
                    span: s(),
                },
                MatchClause {
                    pattern: Pattern::Wildcard(s()),
                    guard: None,
                    body: vec![str_lit("unknown")],
                    span: s(),
                },
            ],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    #[test]
    fn test_match_obj_pattern_value() {
        let form = SurfaceForm::Match {
            target: atom("x"),
            clauses: vec![MatchClause {
                pattern: Pattern::Obj {
                    pairs: vec![(
                        "name".into(),
                        Pattern::Binding {
                            name: "n".into(),
                            span: s(),
                        },
                    )],
                    span: s(),
                },
                guard: None,
                body: vec![atom("n")],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx_value();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    // =======================================================================
    // Match with guard clauses
    // =======================================================================

    #[test]
    fn test_match_with_guard_statement() {
        let form = SurfaceForm::Match {
            target: atom("x"),
            clauses: vec![
                MatchClause {
                    pattern: Pattern::Binding {
                        name: "v".into(),
                        span: s(),
                    },
                    guard: Some(list(vec![atom(">"), atom("v"), num(0.0)])),
                    body: vec![str_lit("positive")],
                    span: s(),
                },
                MatchClause {
                    pattern: Pattern::Wildcard(s()),
                    guard: None,
                    body: vec![str_lit("other")],
                    span: s(),
                },
            ],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    #[test]
    fn test_match_with_guard_value() {
        let form = SurfaceForm::Match {
            target: atom("x"),
            clauses: vec![
                MatchClause {
                    pattern: Pattern::Binding {
                        name: "v".into(),
                        span: s(),
                    },
                    guard: Some(list(vec![atom(">"), atom("v"), num(0.0)])),
                    body: vec![str_lit("positive")],
                    span: s(),
                },
                MatchClause {
                    pattern: Pattern::Wildcard(s()),
                    guard: None,
                    body: vec![str_lit("other")],
                    span: s(),
                },
            ],
            span: s(),
        };
        let mut c = ctx_value();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    #[test]
    fn test_match_with_guard_multi_body_value() {
        let form = SurfaceForm::Match {
            target: atom("x"),
            clauses: vec![MatchClause {
                pattern: Pattern::Binding {
                    name: "v".into(),
                    span: s(),
                },
                guard: Some(list(vec![atom(">"), atom("v"), num(0.0)])),
                body: vec![
                    list(vec![atom("console:log"), atom("v")]),
                    str_lit("positive"),
                ],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx_value();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    // =======================================================================
    // Match without wildcard (should have throw fallback)
    // =======================================================================

    #[test]
    fn test_match_no_wildcard_statement() {
        let form = SurfaceForm::Match {
            target: atom("x"),
            clauses: vec![MatchClause {
                pattern: Pattern::Literal(num(1.0)),
                guard: None,
                body: vec![str_lit("one")],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should have a throw fallback in the else chain
    }

    #[test]
    fn test_match_no_wildcard_value() {
        let form = SurfaceForm::Match {
            target: atom("x"),
            clauses: vec![MatchClause {
                pattern: Pattern::Literal(num(1.0)),
                guard: None,
                body: vec![str_lit("one")],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx_value();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    // =======================================================================
    // Match with binding pattern (non-wildcard, non-literal)
    // =======================================================================

    #[test]
    fn test_match_binding_pattern() {
        let form = SurfaceForm::Match {
            target: atom("x"),
            clauses: vec![MatchClause {
                pattern: Pattern::Binding {
                    name: "v".into(),
                    span: s(),
                },
                guard: None,
                body: vec![atom("v")],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    // =======================================================================
    // compile_let_pattern — additional pattern types
    // =======================================================================

    #[test]
    fn test_if_let_constructor_pattern() {
        let mut r = reg();
        r.register_type(TypeDef {
            name: "Option".into(),
            module_path: None,
            constructors: vec![ConstructorDef {
                name: "Some".into(),
                fields: vec![FieldDef {
                    name: "value".into(),
                    type_keyword: "any".into(),
                }],
                owning_type: "Option".into(),
                span: s(),
            }],
            is_blessed: false,
            span: s(),
        })
        .unwrap();

        let form = SurfaceForm::IfLet {
            pattern: Pattern::Constructor {
                name: "Some".into(),
                name_span: s(),
                bindings: vec![Pattern::Binding {
                    name: "v".into(),
                    span: s(),
                }],
                span: s(),
            },
            expr: atom("x"),
            then_body: atom("v"),
            else_body: Some(num(0.0)),
            span: s(),
        };
        let mut c = ctx_value();
        let result = emit_form(&form, &mut c, &r).unwrap();
        assert_eq!(result.len(), 1);
    }

    #[test]
    fn test_if_let_obj_pattern() {
        let form = SurfaceForm::IfLet {
            pattern: Pattern::Obj {
                pairs: vec![(
                    "name".into(),
                    Pattern::Binding {
                        name: "n".into(),
                        span: s(),
                    },
                )],
                span: s(),
            },
            expr: atom("x"),
            then_body: atom("n"),
            else_body: None,
            span: s(),
        };
        let mut c = ctx_value();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    #[test]
    fn test_if_let_wildcard_pattern() {
        let form = SurfaceForm::IfLet {
            pattern: Pattern::Wildcard(s()),
            expr: atom("x"),
            then_body: str_lit("matched"),
            else_body: None,
            span: s(),
        };
        let mut c = ctx_value();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    #[test]
    fn test_if_let_literal_pattern() {
        let form = SurfaceForm::IfLet {
            pattern: Pattern::Literal(num(42.0)),
            expr: atom("x"),
            then_body: str_lit("matched"),
            else_body: Some(str_lit("nope")),
            span: s(),
        };
        let mut c = ctx_value();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    #[test]
    fn test_if_let_statement_no_else() {
        let form = SurfaceForm::IfLet {
            pattern: Pattern::Binding {
                name: "v".into(),
                span: s(),
            },
            expr: atom("x"),
            then_body: atom("v"),
            else_body: None,
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Statement context without else: should be (block (const ...) (if cond then))
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("block"));
        } else {
            panic!("expected block");
        }
    }

    #[test]
    fn test_if_let_value_no_else() {
        let form = SurfaceForm::IfLet {
            pattern: Pattern::Binding {
                name: "v".into(),
                span: s(),
            },
            expr: atom("x"),
            then_body: atom("v"),
            else_body: None,
            span: s(),
        };
        let mut c = ctx_value();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    // =======================================================================
    // when-let with constructor/obj patterns
    // =======================================================================

    #[test]
    fn test_when_let_constructor_pattern() {
        let mut r = reg();
        r.register_type(TypeDef {
            name: "Option".into(),
            module_path: None,
            constructors: vec![ConstructorDef {
                name: "Some".into(),
                fields: vec![FieldDef {
                    name: "value".into(),
                    type_keyword: "any".into(),
                }],
                owning_type: "Option".into(),
                span: s(),
            }],
            is_blessed: false,
            span: s(),
        })
        .unwrap();

        let form = SurfaceForm::WhenLet {
            pattern: Pattern::Constructor {
                name: "Some".into(),
                name_span: s(),
                bindings: vec![Pattern::Binding {
                    name: "v".into(),
                    span: s(),
                }],
                span: s(),
            },
            expr: atom("x"),
            body: vec![atom("v")],
            span: s(),
        };
        let mut c = ctx_value();
        let result = emit_form(&form, &mut c, &r).unwrap();
        assert_eq!(result.len(), 1);
    }

    // =======================================================================
    // step_contains_await
    // =======================================================================

    #[test]
    fn test_step_contains_await_bare_atom() {
        assert!(step_contains_await(&ThreadingStep::Bare(atom("await"))));
        assert!(!step_contains_await(&ThreadingStep::Bare(atom("inc"))));
    }

    #[test]
    fn test_step_contains_await_bare_list() {
        let step = ThreadingStep::Bare(list(vec![atom("await"), atom("p")]));
        assert!(step_contains_await(&step));
    }

    #[test]
    fn test_step_contains_await_call_head() {
        let step = ThreadingStep::Call(vec![atom("await"), atom("p")]);
        assert!(step_contains_await(&step));
    }

    #[test]
    fn test_step_contains_await_call_nested() {
        let step = ThreadingStep::Call(vec![atom("process"), list(vec![atom("await"), atom("p")])]);
        assert!(step_contains_await(&step));
    }

    #[test]
    fn test_step_contains_await_call_absent() {
        let step = ThreadingStep::Call(vec![atom("process"), atom("x")]);
        assert!(!step_contains_await(&step));
    }

    // =======================================================================
    // any_contains_await
    // =======================================================================

    #[test]
    fn test_any_contains_await_true() {
        let exprs = vec![atom("x"), list(vec![atom("await"), atom("p")])];
        assert!(any_contains_await(&exprs));
    }

    #[test]
    fn test_any_contains_await_false() {
        let exprs = vec![atom("x"), num(1.0)];
        assert!(!any_contains_await(&exprs));
    }

    // =======================================================================
    // bool_lit helper
    // =======================================================================

    #[test]
    fn test_bool_lit() {
        if let SExpr::Bool { value, .. } = bool_lit(true) {
            assert!(value);
        } else {
            panic!("expected bool");
        }
        if let SExpr::Bool { value, .. } = bool_lit(false) {
            assert!(!value);
        } else {
            panic!("expected bool");
        }
    }

    // =======================================================================
    // MacroDef / ImportMacros passthrough
    // =======================================================================

    #[test]
    fn test_emit_macro_def() {
        let raw = list(vec![atom("defmacro"), atom("my-macro")]);
        let form = SurfaceForm::MacroDef {
            name: "my-macro".into(),
            raw: raw.clone(),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        assert_eq!(result[0], raw);
    }

    #[test]
    fn test_emit_import_macros() {
        let raw = list(vec![atom("import-macros"), str_lit("./macros.lykn")]);
        let form = SurfaceForm::ImportMacros {
            raw: raw.clone(),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        assert_eq!(result[0], raw);
    }

    // =======================================================================
    // emit_expr — nested surface form inside non-surface-form list
    // =======================================================================

    #[test]
    fn test_emit_expr_nested_surface_form_in_bind() {
        // A bind whose value contains a threading form
        let form = SurfaceForm::Bind {
            name: atom("x"),
            type_ann: None,
            value: list(vec![atom("->"), num(1.0), atom("inc")]),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // The nested (-> 1 inc) should be expanded to (inc 1)
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("const"));
            if let SExpr::List {
                values: call_vals, ..
            } = &values[2]
            {
                assert_eq!(call_vals[0].as_atom(), Some("inc"));
            } else {
                panic!("expected expanded threading form");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_expr_computed_call() {
        // Head is not an atom (computed call) — recurse on all elements
        let form = SurfaceForm::FunctionCall {
            head: list(vec![atom("get-fn")]),
            args: vec![num(1.0)],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            // Head should be the list (get-fn), recursed
            assert!(matches!(&values[0], SExpr::List { .. }));
        } else {
            panic!("expected list");
        }
    }

    // =======================================================================
    // some-> with Call steps (not just Bare)
    // =======================================================================

    #[test]
    fn test_some_thread_first_call_step() {
        let form = SurfaceForm::SomeThreadFirst {
            initial: atom("x"),
            steps: vec![ThreadingStep::Call(vec![atom("add"), num(2.0)])],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    // =======================================================================
    // Match with multi-body clauses in value context
    // =======================================================================

    #[test]
    fn test_match_value_multi_body() {
        let form = SurfaceForm::Match {
            target: atom("x"),
            clauses: vec![MatchClause {
                pattern: Pattern::Wildcard(s()),
                guard: None,
                body: vec![list(vec![atom("console:log"), atom("x")]), str_lit("done")],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx_value();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    // =======================================================================
    // Match constructor in value context with wildcard bindings
    // =======================================================================

    #[test]
    fn test_match_constructor_wildcard_binding() {
        let mut r = reg();
        r.register_type(TypeDef {
            name: "Pair".into(),
            module_path: None,
            constructors: vec![ConstructorDef {
                name: "Pair".into(),
                fields: vec![
                    FieldDef {
                        name: "x".into(),
                        type_keyword: "any".into(),
                    },
                    FieldDef {
                        name: "y".into(),
                        type_keyword: "any".into(),
                    },
                ],
                owning_type: "Pair".into(),
                span: s(),
            }],
            is_blessed: false,
            span: s(),
        })
        .unwrap();

        let form = SurfaceForm::Match {
            target: atom("p"),
            clauses: vec![MatchClause {
                pattern: Pattern::Constructor {
                    name: "Pair".into(),
                    name_span: s(),
                    bindings: vec![
                        Pattern::Binding {
                            name: "a".into(),
                            span: s(),
                        },
                        Pattern::Wildcard(s()),
                    ],
                    span: s(),
                },
                guard: None,
                body: vec![atom("a")],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &r).unwrap();
        assert_eq!(result.len(), 1);
    }

    // =======================================================================
    // when-let with multi-body in value context
    // =======================================================================

    #[test]
    fn test_when_let_value_multi_body() {
        let form = SurfaceForm::WhenLet {
            pattern: Pattern::Binding {
                name: "v".into(),
                span: s(),
            },
            expr: atom("x"),
            body: vec![list(vec![atom("console:log"), atom("v")]), atom("v")],
            span: s(),
        };
        let mut c = ctx_value();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    // =======================================================================
    // Type emission with strip_assertions
    // =======================================================================

    #[test]
    fn test_emit_type_with_fields_strip_assertions() {
        let form = SurfaceForm::Type {
            name: "Pair".into(),
            name_span: s(),
            constructors: vec![Constructor {
                name: "Pair".into(),
                name_span: s(),
                fields: vec![tp("number", "x"), tp("number", "y")],
                span: s(),
            }],
            span: s(),
        };
        let mut c = EmitterContext::new(true);
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // With strip_assertions, no type checks inside the function
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("function"));
            // Should not have any if nodes (type checks)
            let has_if = values.iter().any(|v| {
                if let SExpr::List { values, .. } = v {
                    values.first().and_then(|f| f.as_atom()) == Some("if")
                } else {
                    false
                }
            });
            assert!(!has_if, "should not have type checks when stripping");
        } else {
            panic!("expected list");
        }
    }

    // =======================================================================
    // Fn with strip_assertions
    // =======================================================================

    #[test]
    fn test_fn_strip_assertions() {
        let form = SurfaceForm::Fn {
            params: vec![sp("number", "x")],
            body: vec![atom("x")],
            span: s(),
        };
        let mut c = EmitterContext::new(true);
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("=>"));
            // No type check if nodes
            let has_if = values.iter().any(|v| {
                if let SExpr::List { values, .. } = v {
                    values.first().and_then(|f| f.as_atom()) == Some("if")
                } else {
                    false
                }
            });
            assert!(!has_if, "should not have type checks");
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_fn_strip_assertions_multi_body_returns_last() {
        let form = SurfaceForm::Fn {
            params: vec![sp("number", "x")],
            body: vec![
                list(vec![
                    atom("bind"),
                    atom("y"),
                    list(vec![
                        atom("+"),
                        atom("x"),
                        SExpr::Number {
                            value: 1.0,
                            span: s(),
                        },
                    ]),
                ]),
                atom("y"),
            ],
            span: s(),
        };
        let mut c = EmitterContext::new(true);
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            let last = values.last().unwrap();
            if let SExpr::List {
                values: ret_vals, ..
            } = last
            {
                assert_eq!(ret_vals[0].as_atom(), Some("return"));
                assert_eq!(ret_vals[1].as_atom(), Some("y"));
            } else {
                panic!("expected last item to be a return list");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_fn_control_transfer_last_forms_are_not_wrapped() {
        for head in ["return", "throw", "break", "continue"] {
            let form = SurfaceForm::Fn {
                params: vec![sp("number", "x")],
                body: vec![list(vec![atom(head), atom("x")])],
                span: s(),
            };
            let mut c = ctx();
            let result = emit_form(&form, &mut c, &reg()).unwrap();
            assert_eq!(result.len(), 1);
            if let SExpr::List { values, .. } = &result[0] {
                let last = values.last().unwrap();
                if let SExpr::List {
                    values: last_values,
                    ..
                } = last
                {
                    assert_eq!(last_values[0].as_atom(), Some(head));
                } else {
                    panic!("expected last item to be a list");
                }
            } else {
                panic!("expected list");
            }
        }
    }

    #[test]
    fn test_fn_typed_returns_last_expression() {
        // (fn (:number x) (* x 2)) should emit (=> (x) <type-check> (return (* x 2)))
        let form = SurfaceForm::Fn {
            params: vec![sp("number", "x")],
            body: vec![list(vec![
                atom("*"),
                atom("x"),
                SExpr::Number {
                    value: 2.0,
                    span: s(),
                },
            ])],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("=>"));
            // Last item should be (return (* x 2))
            let last = values.last().unwrap();
            if let SExpr::List {
                values: ret_vals, ..
            } = last
            {
                assert_eq!(ret_vals[0].as_atom(), Some("return"));
            } else {
                panic!("expected last item to be a return list");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_fn_typed_multi_body_returns_last() {
        // (fn (:number x) (console:log x) (+ x 1)) should return last expr
        let form = SurfaceForm::Fn {
            params: vec![sp("number", "x")],
            body: vec![
                list(vec![atom("console.log"), atom("x")]),
                list(vec![
                    atom("+"),
                    atom("x"),
                    SExpr::Number {
                        value: 1.0,
                        span: s(),
                    },
                ]),
            ],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("=>"));
            // Last item should be (return (+ x 1))
            let last = values.last().unwrap();
            if let SExpr::List {
                values: ret_vals, ..
            } = last
            {
                assert_eq!(ret_vals[0].as_atom(), Some("return"));
            } else {
                panic!("expected last item to be a return list");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_fn_any_no_return_wrapper() {
        // (fn (:any x) x) should NOT get a return wrapper (concise arrow body)
        let form = SurfaceForm::Fn {
            params: vec![sp("any", "x")],
            body: vec![atom("x")],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("=>"));
            // Should be (=> (x) x) — no return wrapper
            let last = values.last().unwrap();
            assert_eq!(
                last.as_atom(),
                Some("x"),
                "should be bare atom, not return wrapper"
            );
        } else {
            panic!("expected list");
        }
    }

    // =======================================================================
    // js: interop via emit_expr (nested in value expressions)
    // =======================================================================

    #[test]
    fn test_js_interop_nested_in_bind() {
        // Bind whose value is a js:typeof call
        let form = SurfaceForm::Bind {
            name: atom("t"),
            type_ann: None,
            value: list(vec![atom("js:typeof"), atom("x")]),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("const"));
            if let SExpr::List {
                values: typeof_form,
                ..
            } = &values[2]
            {
                assert_eq!(typeof_form[0].as_atom(), Some("typeof"));
            } else {
                panic!("expected typeof form");
            }
        } else {
            panic!("expected list");
        }
    }

    // =======================================================================
    // Multi-clause func strip_assertions
    // =======================================================================

    #[test]
    fn test_func_multi_clause_strip_assertions() {
        let form = SurfaceForm::Func {
            name: "f".into(),
            name_span: s(),
            clauses: vec![
                FuncClause {
                    args: vec![sp("number", "x")],
                    returns: None,
                    pre: Some(list(vec![atom(">"), atom("x"), num(0.0)])),
                    post: Some(list(vec![atom(">"), atom("%"), num(0.0)])),
                    body: vec![atom("x")],
                    span: s(),
                },
                FuncClause {
                    args: vec![sp("string", "s")],
                    returns: None,
                    pre: None,
                    post: None,
                    body: vec![atom("s")],
                    span: s(),
                },
            ],
            span: s(),
        };
        let mut c = EmitterContext::new(true);
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
    }

    // =======================================================================
    // Single-arity condition in multi-clause (no &&, just arity check)
    // =======================================================================

    #[test]
    fn test_func_multi_clause_any_types_single_condition() {
        let form = SurfaceForm::Func {
            name: "f".into(),
            name_span: s(),
            clauses: vec![
                FuncClause {
                    args: vec![sp("any", "x")],
                    returns: None,
                    pre: None,
                    post: None,
                    body: vec![atom("x")],
                    span: s(),
                },
                FuncClause {
                    args: vec![sp("any", "x"), sp("any", "y")],
                    returns: None,
                    pre: None,
                    post: None,
                    body: vec![list(vec![atom("+"), atom("x"), atom("y")])],
                    span: s(),
                },
            ],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // When all params are "any", dispatch condition is just arity check (no &&)
        if let SExpr::List { values, .. } = &result[0] {
            // Find the first if block
            for v in values.iter() {
                if let SExpr::List {
                    values: if_vals, ..
                } = v
                    && if_vals.first().and_then(|f| f.as_atom()) == Some("if")
                {
                    // The condition should be (=== args:length N) directly
                    if let SExpr::List {
                        values: cond_vals, ..
                    } = &if_vals[1]
                    {
                        assert_eq!(
                            cond_vals[0].as_atom(),
                            Some("==="),
                            "single condition should be ==="
                        );
                    }
                    break;
                }
            }
        }
    }

    // =======================================================================
    // Match statement with multiple literals uses ordered candidates and a shared bit.
    // =======================================================================

    #[test]
    fn test_match_statement_multiple_literals_ordered_candidates() {
        let form = SurfaceForm::Match {
            target: atom("x"),
            clauses: vec![
                MatchClause {
                    pattern: Pattern::Literal(num(1.0)),
                    guard: None,
                    body: vec![str_lit("one")],
                    span: s(),
                },
                MatchClause {
                    pattern: Pattern::Literal(num(2.0)),
                    guard: None,
                    body: vec![str_lit("two")],
                    span: s(),
                },
                MatchClause {
                    pattern: Pattern::Wildcard(s()),
                    guard: None,
                    body: vec![str_lit("other")],
                    span: s(),
                },
            ],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("block"));
            assert_eq!(values.len(), 6);
            let binding = values[1].as_list().unwrap();
            assert_eq!(binding[2].as_atom(), Some("x"));
            assert_eq!(values[2].as_list().unwrap()[0].as_atom(), Some("let"));
            for (index, literal, body_text) in [(3, 1.0, "one"), (4, 2.0, "two")] {
                let candidate = values[index].as_list().unwrap();
                assert_eq!(candidate[0].as_atom(), Some("if"));
                let condition = candidate[1].as_list().unwrap();
                assert_eq!(condition[0].as_atom(), Some("&&"));
                assert_eq!(condition[1].as_list().unwrap()[0].as_atom(), Some("!"));
                let pattern_check = condition[2].as_list().unwrap();
                assert_eq!(pattern_check[0].as_atom(), Some("==="));
                assert!(
                    matches!(&pattern_check[2], SExpr::Number { value, .. } if *value == literal)
                );
                let candidate_body = candidate[2].as_list().unwrap();
                let selected_body = candidate_body[1].as_list().unwrap();
                let selection = selected_body[1].as_list().unwrap();
                assert_eq!(selection[0].as_atom(), Some("="));
                assert!(matches!(&selection[2], SExpr::Bool { value: true, .. }));
                assert!(
                    matches!(&selected_body[2], SExpr::String { value, .. } if value == body_text)
                );
            }
            let fallback = values[5].as_list().unwrap();
            assert_eq!(fallback[0].as_atom(), Some("if"));
            assert_eq!(fallback[1].as_list().unwrap()[0].as_atom(), Some("!"));
            let fallback_body = fallback[2].as_list().unwrap()[1].as_list().unwrap();
            assert!(matches!(&fallback_body[2], SExpr::String { value, .. } if value == "other"));
        } else {
            panic!("expected block");
        }
    }

    // =======================================================================
    // Swap with extra_args
    // =======================================================================

    #[test]
    fn test_swap_with_extra_args() {
        let form = SurfaceForm::Swap {
            target: atom("counter"),
            func: atom("add"),
            extra_args: vec![num(5.0)],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // (= counter:value (add counter:value 5))
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("="));
            if let SExpr::List { values: call, .. } = &values[2] {
                assert_eq!(call[0].as_atom(), Some("add"));
                assert_eq!(call.len(), 3); // add counter:value 5
            } else {
                panic!("expected call");
            }
        } else {
            panic!("expected list");
        }
    }

    // =======================================================================
    // Dissoc with multiple keys
    // =======================================================================

    #[test]
    fn test_dissoc_multiple_keys() {
        let form = SurfaceForm::Dissoc {
            obj: atom("m"),
            keys: vec!["name".into(), "age".into()],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // IIFE with destructuring pattern that has 2 alias entries + rest
        if let SExpr::List { values, .. } = &result[0]
            && let SExpr::List { values: arrow, .. } = &values[0]
            // arrow[2] should be the const with object pattern
            && let SExpr::List {
                values: const_form, ..
            } = &arrow[2]
            && let SExpr::List {
                values: pattern, ..
            } = &const_form[1]
        {
            assert_eq!(pattern[0].as_atom(), Some("object"));
            // 2 alias + 1 rest = 3 entries + "object" head = 4
            assert_eq!(pattern.len(), 4);
        }
    }

    // --- Eq (DD-22) ---

    #[test]
    fn test_emit_eq_binary() {
        let form = SurfaceForm::Eq {
            args: vec![atom("a"), atom("b")],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be (=== a b)
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("==="));
            assert_eq!(values[1].as_atom(), Some("a"));
            assert_eq!(values[2].as_atom(), Some("b"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_eq_variadic_three() {
        let form = SurfaceForm::Eq {
            args: vec![atom("a"), atom("b"), atom("c")],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be (&& (=== a b) (=== b c))
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("&&"));
            if let SExpr::List { values: left, .. } = &values[1] {
                assert_eq!(left[0].as_atom(), Some("==="));
                assert_eq!(left[1].as_atom(), Some("a"));
                assert_eq!(left[2].as_atom(), Some("b"));
            } else {
                panic!("expected left === pair");
            }
            if let SExpr::List { values: right, .. } = &values[2] {
                assert_eq!(right[0].as_atom(), Some("==="));
                assert_eq!(right[1].as_atom(), Some("b"));
                assert_eq!(right[2].as_atom(), Some("c"));
            } else {
                panic!("expected right === pair");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_eq_variadic_four() {
        let form = SurfaceForm::Eq {
            args: vec![atom("a"), atom("b"), atom("c"), atom("d")],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be (&& (&& (=== a b) (=== b c)) (=== c d))
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("&&"));
            // Left side is (&& (=== a b) (=== b c))
            if let SExpr::List { values: inner, .. } = &values[1] {
                assert_eq!(inner[0].as_atom(), Some("&&"));
            } else {
                panic!("expected inner && for left-fold");
            }
            // Right side is (=== c d)
            if let SExpr::List { values: right, .. } = &values[2] {
                assert_eq!(right[0].as_atom(), Some("==="));
                assert_eq!(right[1].as_atom(), Some("c"));
                assert_eq!(right[2].as_atom(), Some("d"));
            } else {
                panic!("expected right === pair");
            }
        } else {
            panic!("expected list");
        }
    }

    // --- NotEq (DD-22) ---

    #[test]
    fn test_emit_not_eq() {
        let form = SurfaceForm::NotEq {
            left: atom("a"),
            right: atom("b"),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be (!== a b)
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("!=="));
            assert_eq!(values[1].as_atom(), Some("a"));
            assert_eq!(values[2].as_atom(), Some("b"));
        } else {
            panic!("expected list");
        }
    }

    // --- And (DD-22) ---

    #[test]
    fn test_emit_and_binary() {
        let form = SurfaceForm::And {
            args: vec![atom("a"), atom("b")],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be (&& a b)
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("&&"));
            assert_eq!(values[1].as_atom(), Some("a"));
            assert_eq!(values[2].as_atom(), Some("b"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_and_variadic() {
        let form = SurfaceForm::And {
            args: vec![atom("a"), atom("b"), atom("c"), atom("d")],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be (&& (&& (&& a b) c) d)
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("&&"));
            assert_eq!(values[2].as_atom(), Some("d"));
            // Inner: (&& (&& a b) c)
            if let SExpr::List { values: mid, .. } = &values[1] {
                assert_eq!(mid[0].as_atom(), Some("&&"));
                assert_eq!(mid[2].as_atom(), Some("c"));
                // Innermost: (&& a b)
                if let SExpr::List { values: inner, .. } = &mid[1] {
                    assert_eq!(inner[0].as_atom(), Some("&&"));
                    assert_eq!(inner[1].as_atom(), Some("a"));
                    assert_eq!(inner[2].as_atom(), Some("b"));
                } else {
                    panic!("expected innermost && list");
                }
            } else {
                panic!("expected middle && list");
            }
        } else {
            panic!("expected list");
        }
    }

    // --- Or (DD-22) ---

    #[test]
    fn test_emit_or_binary() {
        let form = SurfaceForm::Or {
            args: vec![atom("a"), atom("b")],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be (|| a b)
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("||"));
            assert_eq!(values[1].as_atom(), Some("a"));
            assert_eq!(values[2].as_atom(), Some("b"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_or_variadic() {
        let form = SurfaceForm::Or {
            args: vec![atom("a"), atom("b"), atom("c"), atom("d")],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be (|| (|| (|| a b) c) d)
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("||"));
            assert_eq!(values[2].as_atom(), Some("d"));
            // Inner: (|| (|| a b) c)
            if let SExpr::List { values: mid, .. } = &values[1] {
                assert_eq!(mid[0].as_atom(), Some("||"));
                assert_eq!(mid[2].as_atom(), Some("c"));
            } else {
                panic!("expected middle || list");
            }
        } else {
            panic!("expected list");
        }
    }

    // --- Not (DD-22) ---

    #[test]
    fn test_emit_not() {
        let form = SurfaceForm::Not {
            operand: atom("x"),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be (! x)
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("!"));
            assert_eq!(values[1].as_atom(), Some("x"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_not_nested() {
        // (not (not x)) → (! (! x))
        // Construct the inner (not x) form as a surface form nested in the SExpr.
        // Since emit uses emit_expr which classifies nested surface forms,
        // we test the emitter directly by constructing the kernel form.
        let inner_not = SurfaceForm::Not {
            operand: atom("x"),
            span: s(),
        };
        let mut c = ctx();
        let inner_result = emit_form(&inner_not, &mut c, &reg()).unwrap();
        // inner_result = [(! x)]

        let outer = SurfaceForm::Not {
            operand: inner_result[0].clone(),
            span: s(),
        };
        let result = emit_form(&outer, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Should be (! (! x))
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("!"));
            if let SExpr::List {
                values: inner_vals, ..
            } = &values[1]
            {
                assert_eq!(inner_vals[0].as_atom(), Some("!"));
                assert_eq!(inner_vals[1].as_atom(), Some("x"));
            } else {
                panic!("expected inner (! x)");
            }
        } else {
            panic!("expected list");
        }
    }

    // =======================================================================
    // Destructured parameters (DD-25)
    // =======================================================================

    #[test]
    fn test_emit_func_single_clause_object_destructure() {
        let form = SurfaceForm::Func {
            name: "greet".into(),
            name_span: s(),
            clauses: vec![FuncClause {
                args: vec![ParamShape::DestructuredObject {
                    fields: vec![
                        DestructuredField::Simple(tp("string", "name")),
                        DestructuredField::Simple(tp("number", "age")),
                    ],
                    span: s(),
                }],
                returns: None,
                pre: None,
                post: None,
                body: vec![atom("name")],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("function"));
            assert_eq!(values[1].as_atom(), Some("greet"));
            // Param list should contain (object name age)
            if let SExpr::List { values: params, .. } = &values[2] {
                assert_eq!(params.len(), 1);
                if let SExpr::List {
                    values: obj_param, ..
                } = &params[0]
                {
                    assert_eq!(obj_param[0].as_atom(), Some("object"));
                    assert_eq!(obj_param[1].as_atom(), Some("name"));
                    assert_eq!(obj_param[2].as_atom(), Some("age"));
                } else {
                    panic!("expected object destructuring list");
                }
            } else {
                panic!("expected params list");
            }
            // Should have type check nodes (if blocks) for each field
            let if_count = values
                .iter()
                .filter(|v| {
                    if let SExpr::List { values, .. } = v {
                        values.first().and_then(|f| f.as_atom()) == Some("if")
                    } else {
                        false
                    }
                })
                .count();
            assert_eq!(if_count, 2, "should have 2 type checks (one per field)");
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_fn_object_destructure() {
        let form = SurfaceForm::Fn {
            params: vec![ParamShape::DestructuredObject {
                fields: vec![
                    DestructuredField::Simple(tp("string", "name")),
                    DestructuredField::Simple(tp("number", "age")),
                ],
                span: s(),
            }],
            body: vec![atom("name")],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("=>"));
            // Param list should contain (object name age)
            if let SExpr::List { values: params, .. } = &values[1] {
                assert_eq!(params.len(), 1);
                if let SExpr::List {
                    values: obj_param, ..
                } = &params[0]
                {
                    assert_eq!(obj_param[0].as_atom(), Some("object"));
                    assert_eq!(obj_param[1].as_atom(), Some("name"));
                    assert_eq!(obj_param[2].as_atom(), Some("age"));
                } else {
                    panic!("expected object destructuring list");
                }
            } else {
                panic!("expected params list");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_func_multi_clause_mixed_destructure_dispatch() {
        let form = SurfaceForm::Func {
            name: "process".into(),
            name_span: s(),
            clauses: vec![
                FuncClause {
                    args: vec![ParamShape::DestructuredObject {
                        fields: vec![DestructuredField::Simple(tp("string", "name"))],
                        span: s(),
                    }],
                    returns: None,
                    pre: None,
                    post: None,
                    body: vec![atom("name")],
                    span: s(),
                },
                FuncClause {
                    args: vec![sp("string", "s")],
                    returns: None,
                    pre: None,
                    post: None,
                    body: vec![atom("s")],
                    span: s(),
                },
            ],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("function"));
            assert_eq!(values[1].as_atom(), Some("process"));
            // Should have rest params for multi-clause dispatch
            if let SExpr::List { values: params, .. } = &values[2] {
                if let SExpr::List { values: rest, .. } = &params[0] {
                    assert_eq!(rest[0].as_atom(), Some("rest"));
                } else {
                    panic!("expected rest param");
                }
            } else {
                panic!("expected params list");
            }
        } else {
            panic!("expected function");
        }
    }

    // --- DD-22 regression: kernel = in emitter output is not re-intercepted ---

    #[test]
    fn test_emit_reset_still_uses_kernel_assignment() {
        // reset! emits kernel `=` (assignment). This must not be intercepted
        // by the surface `=` (equality) form.
        let form = SurfaceForm::Reset {
            target: atom("counter"),
            value: num(0.0),
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(
                values[0].as_atom(),
                Some("="),
                "reset! should still emit kernel ="
            );
            assert_eq!(values[1].as_atom(), Some("counter:value"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_swap_still_uses_kernel_assignment() {
        // swap! emits kernel `=` (assignment). This must not be intercepted.
        let form = SurfaceForm::Swap {
            target: atom("counter"),
            func: atom("inc"),
            extra_args: vec![],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(
                values[0].as_atom(),
                Some("="),
                "swap! should still emit kernel ="
            );
        } else {
            panic!("expected list");
        }
    }

    // --- DD-22 regression: nested surface forms in equality/logical ops ---

    #[test]
    fn test_emit_eq_with_nested_surface_form() {
        // (= (cell 1) (cell 2)) — the args contain surface forms that should be
        // recursively emitted
        let form = SurfaceForm::Eq {
            args: vec![
                list(vec![atom("cell"), num(1.0)]),
                list(vec![atom("cell"), num(2.0)]),
            ],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("==="));
            // Both sides should be emitted (cell → object with value)
            assert!(matches!(values[1], SExpr::List { .. }));
            assert!(matches!(values[2], SExpr::List { .. }));
        } else {
            panic!("expected list");
        }
    }

    // ---------------------------------------------------------------
    // DD-25: default values in emitter output
    // ---------------------------------------------------------------

    #[test]
    fn test_emit_func_single_clause_object_default() {
        // Build a func with a DestructuredObject containing a field with a default value.
        let form = SurfaceForm::Func {
            name: "greet".into(),
            name_span: s(),
            clauses: vec![FuncClause {
                args: vec![ParamShape::DestructuredObject {
                    fields: vec![
                        DestructuredField::Simple(tp("string", "name")),
                        DestructuredField::Simple(TypedParam {
                            type_ann: ta("number"),
                            name: "age".into(),
                            name_span: s(),
                            default_value: Some(num(0.0)),
                            is_rest: false,
                        }),
                    ],
                    span: s(),
                }],
                returns: None,
                pre: None,
                post: None,
                body: vec![atom("name")],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("function"));
            assert_eq!(values[1].as_atom(), Some("greet"));
            // Param list should contain (object name (default age 0))
            if let SExpr::List { values: params, .. } = &values[2] {
                assert_eq!(params.len(), 1);
                if let SExpr::List {
                    values: obj_param, ..
                } = &params[0]
                {
                    assert_eq!(obj_param[0].as_atom(), Some("object"));
                    assert_eq!(obj_param[1].as_atom(), Some("name"));
                    // Third element should be (default age 0)
                    if let SExpr::List {
                        values: default_node,
                        ..
                    } = &obj_param[2]
                    {
                        assert_eq!(default_node[0].as_atom(), Some("default"));
                        assert_eq!(default_node[1].as_atom(), Some("age"));
                        assert!(
                            matches!(&default_node[2], SExpr::Number { value, .. } if *value == 0.0)
                        );
                    } else {
                        panic!("expected default list node, got: {:?}", obj_param[2]);
                    }
                } else {
                    panic!("expected object destructuring list");
                }
            } else {
                panic!("expected params list");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_fn_object_default() {
        // Arrow function with default: (fn ((object (default :string name "anon"))) x)
        let form = SurfaceForm::Fn {
            params: vec![ParamShape::DestructuredObject {
                fields: vec![DestructuredField::Simple(TypedParam {
                    type_ann: ta("string"),
                    name: "name".into(),
                    name_span: s(),
                    default_value: Some(str_lit("anon")),
                    is_rest: false,
                })],
                span: s(),
            }],
            body: vec![atom("x")],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("=>"));
            if let SExpr::List { values: params, .. } = &values[1] {
                assert_eq!(params.len(), 1);
                if let SExpr::List {
                    values: obj_param, ..
                } = &params[0]
                {
                    assert_eq!(obj_param[0].as_atom(), Some("object"));
                    // Should be (default name "anon")
                    if let SExpr::List {
                        values: default_node,
                        ..
                    } = &obj_param[1]
                    {
                        assert_eq!(default_node[0].as_atom(), Some("default"));
                        assert_eq!(default_node[1].as_atom(), Some("name"));
                        assert!(
                            matches!(&default_node[2], SExpr::String { value, .. } if value == "anon")
                        );
                    } else {
                        panic!("expected default list node, got: {:?}", obj_param[1]);
                    }
                } else {
                    panic!("expected object destructuring list");
                }
            } else {
                panic!("expected params list");
            }
        } else {
            panic!("expected list");
        }
    }

    // ---------------------------------------------------------------
    // DD-25: nested destructuring in emitter output
    // ---------------------------------------------------------------

    #[test]
    fn test_emit_func_nested_object_with_alias() {
        // Build with DestructuredField::Nested. Verify kernel output contains
        // (alias c (object name)).
        let form = SurfaceForm::Func {
            name: "f".into(),
            name_span: s(),
            clauses: vec![FuncClause {
                args: vec![ParamShape::DestructuredObject {
                    fields: vec![DestructuredField::Nested {
                        alias_name: "c".into(),
                        alias_name_span: s(),
                        type_ann: ta("any"),
                        pattern: Box::new(ParamShape::DestructuredObject {
                            fields: vec![DestructuredField::Simple(tp("string", "name"))],
                            span: s(),
                        }),
                        span: s(),
                    }],
                    span: s(),
                }],
                returns: None,
                pre: None,
                post: None,
                body: vec![atom("x")],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("function"));
            assert_eq!(values[1].as_atom(), Some("f"));
            if let SExpr::List { values: params, .. } = &values[2] {
                assert_eq!(params.len(), 1);
                if let SExpr::List {
                    values: obj_param, ..
                } = &params[0]
                {
                    assert_eq!(obj_param[0].as_atom(), Some("object"));
                    // Should be (alias c (object name))
                    if let SExpr::List {
                        values: alias_node, ..
                    } = &obj_param[1]
                    {
                        assert_eq!(alias_node[0].as_atom(), Some("alias"));
                        assert_eq!(alias_node[1].as_atom(), Some("c"));
                        // Third element should be (object name)
                        if let SExpr::List {
                            values: inner_obj, ..
                        } = &alias_node[2]
                        {
                            assert_eq!(inner_obj[0].as_atom(), Some("object"));
                            assert_eq!(inner_obj[1].as_atom(), Some("name"));
                        } else {
                            panic!("expected inner object list, got: {:?}", alias_node[2]);
                        }
                    } else {
                        panic!("expected alias list node, got: {:?}", obj_param[1]);
                    }
                } else {
                    panic!("expected object destructuring list");
                }
            } else {
                panic!("expected params list");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_func_nested_in_array() {
        // Build with ArrayParamElement::Nested. Verify kernel output contains
        // (object name) directly inside (array ...).
        let form = SurfaceForm::Func {
            name: "f".into(),
            name_span: s(),
            clauses: vec![FuncClause {
                args: vec![ParamShape::DestructuredArray {
                    elements: vec![
                        ArrayParamElement::Nested {
                            pattern: Box::new(ParamShape::DestructuredObject {
                                fields: vec![DestructuredField::Simple(tp("string", "name"))],
                                span: s(),
                            }),
                            span: s(),
                        },
                        ArrayParamElement::Typed(tp("number", "score")),
                    ],
                    span: s(),
                }],
                returns: None,
                pre: None,
                post: None,
                body: vec![atom("x")],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("function"));
            assert_eq!(values[1].as_atom(), Some("f"));
            if let SExpr::List { values: params, .. } = &values[2] {
                assert_eq!(params.len(), 1);
                if let SExpr::List {
                    values: arr_param, ..
                } = &params[0]
                {
                    assert_eq!(arr_param[0].as_atom(), Some("array"));
                    // First element should be (object name) — the nested pattern
                    if let SExpr::List {
                        values: inner_obj, ..
                    } = &arr_param[1]
                    {
                        assert_eq!(inner_obj[0].as_atom(), Some("object"));
                        assert_eq!(inner_obj[1].as_atom(), Some("name"));
                    } else {
                        panic!("expected nested object list, got: {:?}", arr_param[1]);
                    }
                    // Second element should be plain atom "score"
                    assert_eq!(arr_param[2].as_atom(), Some("score"));
                } else {
                    panic!("expected array destructuring list");
                }
            } else {
                panic!("expected params list");
            }
        } else {
            panic!("expected list");
        }
    }

    // ---------------------------------------------------------------
    // Top-level default and rest in func :args
    // ---------------------------------------------------------------

    #[test]
    fn test_emit_func_toplevel_default() {
        // Build a func with a Simple param that has a default_value.
        // Expect kernel output to contain (default greeting "Hello").
        let form = SurfaceForm::Func {
            name: "greet".into(),
            name_span: s(),
            clauses: vec![FuncClause {
                args: vec![
                    sp("string", "name"),
                    ParamShape::Simple(TypedParam {
                        type_ann: ta("string"),
                        name: "greeting".into(),
                        name_span: s(),
                        default_value: Some(str_lit("Hello")),
                        is_rest: false,
                    }),
                ],
                returns: None,
                pre: None,
                post: None,
                body: vec![atom("name")],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("function"));
            assert_eq!(values[1].as_atom(), Some("greet"));
            // Params list: (name (default greeting "Hello"))
            if let SExpr::List { values: params, .. } = &values[2] {
                assert_eq!(params.len(), 2);
                assert_eq!(params[0].as_atom(), Some("name"));
                if let SExpr::List {
                    values: default_node,
                    ..
                } = &params[1]
                {
                    assert_eq!(default_node[0].as_atom(), Some("default"));
                    assert_eq!(default_node[1].as_atom(), Some("greeting"));
                    assert!(
                        matches!(&default_node[2], SExpr::String { value, .. } if value == "Hello")
                    );
                } else {
                    panic!("expected default list node, got: {:?}", params[1]);
                }
            } else {
                panic!("expected params list");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_func_toplevel_rest() {
        // Build a func with a Simple param that has is_rest: true.
        // Expect kernel output to contain (rest messages).
        let form = SurfaceForm::Func {
            name: "log".into(),
            name_span: s(),
            clauses: vec![FuncClause {
                args: vec![
                    sp("string", "level"),
                    ParamShape::Simple(TypedParam {
                        type_ann: ta("any"),
                        name: "messages".into(),
                        name_span: s(),
                        default_value: None,
                        is_rest: true,
                    }),
                ],
                returns: None,
                pre: None,
                post: None,
                body: vec![atom("level")],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("function"));
            assert_eq!(values[1].as_atom(), Some("log"));
            // Params list: (level (rest messages))
            if let SExpr::List { values: params, .. } = &values[2] {
                assert_eq!(params.len(), 2);
                assert_eq!(params[0].as_atom(), Some("level"));
                if let SExpr::List {
                    values: rest_node, ..
                } = &params[1]
                {
                    assert_eq!(rest_node[0].as_atom(), Some("rest"));
                    assert_eq!(rest_node[1].as_atom(), Some("messages"));
                } else {
                    panic!("expected rest list node, got: {:?}", params[1]);
                }
            } else {
                panic!("expected params list");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_func_typed_rest_for_of_check() {
        // Build a func with a rest param typed :number (not :any).
        // Expect the output to contain a for-of loop for per-element type checking.
        let form = SurfaceForm::Func {
            name: "sum".into(),
            name_span: s(),
            clauses: vec![FuncClause {
                args: vec![ParamShape::Simple(TypedParam {
                    type_ann: ta("number"),
                    name: "nums".into(),
                    name_span: s(),
                    default_value: None,
                    is_rest: true,
                })],
                returns: None,
                pre: None,
                post: None,
                body: vec![atom("nums")],
                span: s(),
            }],
            span: s(),
        };
        let mut c = ctx();
        let result = emit_form(&form, &mut c, &reg()).unwrap();
        assert_eq!(result.len(), 1);
        // Search the output tree for a (for-of ...) node.
        fn find_for_of(expr: &SExpr) -> bool {
            match expr {
                SExpr::List { values, .. } => {
                    if values.first().and_then(|v| v.as_atom()) == Some("for-of") {
                        return true;
                    }
                    values.iter().any(find_for_of)
                }
                _ => false,
            }
        }
        assert!(
            find_for_of(&result[0]),
            "expected for-of type check in output, got: {:?}",
            result[0]
        );
    }

    // --- Export wrapping surface forms ---

    #[test]
    fn test_emit_exports_names() {
        let form = SurfaceForm::Exports {
            names: vec![atom("normalize"), atom("valid-record?")],
            span: s(),
        };
        let mut ctx = ctx();
        let result = emit_form(&form, &mut ctx, &TypeRegistry::default()).unwrap();
        assert_eq!(result.len(), 1);
        let SExpr::List { values, .. } = &result[0] else {
            panic!("expected export form");
        };
        assert_eq!(values[0].as_atom(), Some("export"));
        let SExpr::List { values: names, .. } = &values[1] else {
            panic!("expected names list");
        };
        assert_eq!(names[0].as_atom(), Some("names"));
        assert_eq!(names[1].as_atom(), Some("normalize"));
        assert_eq!(names[2].as_atom(), Some("valid-record?"));
    }

    #[test]
    fn test_emit_export_func() {
        let form = SurfaceForm::Export {
            inner: Box::new(SurfaceForm::Func {
                name: "add".into(),
                name_span: s(),
                clauses: vec![FuncClause {
                    args: vec![sp("number", "a"), sp("number", "b")],
                    returns: Some(ta("number")),
                    pre: None,
                    post: None,
                    body: vec![list(vec![atom("+"), atom("a"), atom("b")])],
                    span: s(),
                }],
                span: s(),
            }),
            extra_args: vec![],
            span: s(),
        };
        let mut ctx = ctx();
        let registry = TypeRegistry::default();
        let result = emit_form(&form, &mut ctx, &registry).unwrap();
        // Should produce (export (function add (a b) ...))
        assert_eq!(result.len(), 1);
        match &result[0] {
            SExpr::List { values, .. } => {
                assert_eq!(values[0].as_atom(), Some("export"));
                // Inner should be a (function add ...) form
                if let SExpr::List { values: inner, .. } = &values[1] {
                    assert_eq!(inner[0].as_atom(), Some("function"));
                    assert_eq!(inner[1].as_atom(), Some("add"));
                } else {
                    panic!("expected list inside export, got: {:?}", values[1]);
                }
            }
            _ => panic!("expected list, got: {:?}", result[0]),
        }
    }

    #[test]
    fn test_emit_export_bind() {
        let form = SurfaceForm::Export {
            inner: Box::new(SurfaceForm::Bind {
                name: SExpr::atom("VERSION", s()),
                type_ann: None,
                value: SExpr::String {
                    value: "0.4.0".into(),
                    span: s(),
                },
                span: s(),
            }),
            extra_args: vec![],
            span: s(),
        };
        let mut ctx = ctx();
        let registry = TypeRegistry::default();
        let result = emit_form(&form, &mut ctx, &registry).unwrap();
        // Should produce (export (const VERSION "0.4.0"))
        assert_eq!(result.len(), 1);
        match &result[0] {
            SExpr::List { values, .. } => {
                assert_eq!(values[0].as_atom(), Some("export"));
                if let SExpr::List { values: inner, .. } = &values[1] {
                    assert_eq!(inner[0].as_atom(), Some("const"));
                } else {
                    panic!("expected list inside export");
                }
            }
            _ => panic!("expected list"),
        }
    }

    // ---------------------------------------------------------------
    // Genfunc emission
    // ---------------------------------------------------------------

    #[test]
    fn test_emit_genfunc_simple() {
        let form = SurfaceForm::Genfunc {
            name: "gen".into(),
            name_span: s(),
            clauses: vec![GenfuncClause {
                args: vec![],
                yields: None,
                returns: None,
                pre: None,
                post: None,
                body: vec![list(vec![atom("yield"), num(1.0)])],
                span: s(),
            }],
            span: s(),
        };
        let registry = TypeRegistry::default();
        let mut ctx = EmitterContext::new(false);
        let result = emit_form(&form, &mut ctx, &registry).unwrap();
        assert_eq!(result.len(), 1);
        // Should produce (function* gen () (yield 1))
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("function*"));
            assert_eq!(values[1].as_atom(), Some("gen"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_genfunc_with_yields_instrumentation() {
        let form = SurfaceForm::Genfunc {
            name: "gen".into(),
            name_span: s(),
            clauses: vec![GenfuncClause {
                args: vec![ParamShape::Simple(tp("number", "n"))],
                yields: Some(ta("number")),
                returns: None,
                pre: None,
                post: None,
                body: vec![list(vec![atom("yield"), atom("n")])],
                span: s(),
            }],
            span: s(),
        };
        let registry = TypeRegistry::default();
        let mut ctx = EmitterContext::new(false);
        let result = emit_form(&form, &mut ctx, &registry).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("function*"));
            assert_eq!(values[1].as_atom(), Some("gen"));
            // The body should contain an instrumented yield (yield with IIFE)
            // Find the yield form — it should be wrapped
            let body_exprs = &values[3..]; // skip function*, name, params, type-check
            let has_instrumented_yield = body_exprs.iter().any(|expr| {
                // The second element should be an IIFE (a list containing an
                // arrow function `((=> () ...))`), not just a plain atom.
                if let SExpr::List { values, .. } = expr
                    && values.first().and_then(|v| v.as_atom()) == Some("yield")
                    && let Some(SExpr::List { values: iife, .. }) = values.get(1)
                    && let Some(SExpr::List { values: arrow, .. }) = iife.first()
                {
                    return arrow.first().and_then(|v| v.as_atom()) == Some("=>");
                }
                false
            });
            assert!(
                has_instrumented_yield,
                "expected instrumented yield in body, got: {values:?}"
            );
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_genfunc_yields_any_no_instrumentation() {
        let form = SurfaceForm::Genfunc {
            name: "gen".into(),
            name_span: s(),
            clauses: vec![GenfuncClause {
                args: vec![],
                yields: Some(ta("any")),
                returns: None,
                pre: None,
                post: None,
                body: vec![list(vec![atom("yield"), num(1.0)])],
                span: s(),
            }],
            span: s(),
        };
        let registry = TypeRegistry::default();
        let mut ctx = EmitterContext::new(false);
        let result = emit_form(&form, &mut ctx, &registry).unwrap();
        // With :yields :any, yield should not be instrumented
        if let SExpr::List { values, .. } = &result[0] {
            // Body starts after function*, name, params
            let body = &values[3..];
            assert_eq!(body.len(), 1);
            if let SExpr::List {
                values: yield_vals, ..
            } = &body[0]
            {
                assert_eq!(yield_vals[0].as_atom(), Some("yield"));
                // Should be plain number, not an IIFE
                assert!(matches!(yield_vals[1], SExpr::Number { .. }));
            } else {
                panic!("expected yield list");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_genfunc_strip_assertions() {
        let form = SurfaceForm::Genfunc {
            name: "gen".into(),
            name_span: s(),
            clauses: vec![GenfuncClause {
                args: vec![ParamShape::Simple(tp("number", "n"))],
                yields: Some(ta("number")),
                returns: None,
                pre: None,
                post: None,
                body: vec![list(vec![atom("yield"), atom("n")])],
                span: s(),
            }],
            span: s(),
        };
        let registry = TypeRegistry::default();
        let mut ctx = EmitterContext::new(true);
        let result = emit_form(&form, &mut ctx, &registry).unwrap();
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("function*"));
            // With strip_assertions, no type checks or yield instrumentation
            // Just: function*, name, params, body...
            assert_eq!(values[1].as_atom(), Some("gen"));
            // Body should have un-instrumented yield
            let body = &values[3..];
            assert_eq!(body.len(), 1);
        } else {
            panic!("expected list");
        }
    }

    // ---------------------------------------------------------------
    // Genfn emission
    // ---------------------------------------------------------------

    #[test]
    fn test_emit_genfn_simple() {
        let form = SurfaceForm::Genfn {
            params: vec![],
            yields: None,
            body: vec![list(vec![atom("yield"), num(42.0)])],
            span: s(),
        };
        let registry = TypeRegistry::default();
        let mut ctx = EmitterContext::new(false);
        let result = emit_form(&form, &mut ctx, &registry).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("function*"));
            // Anonymous: no name, just params
            assert!(values[1].is_list()); // params list
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_emit_genfn_with_yields() {
        let form = SurfaceForm::Genfn {
            params: vec![ParamShape::Simple(tp("any", "x"))],
            yields: Some(ta("string")),
            body: vec![list(vec![atom("yield"), atom("x")])],
            span: s(),
        };
        let registry = TypeRegistry::default();
        let mut ctx = EmitterContext::new(false);
        let result = emit_form(&form, &mut ctx, &registry).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("function*"));
            // Should contain instrumented yield
            let has_yield = values.iter().any(|v| {
                if let SExpr::List { values, .. } = v {
                    values.first().and_then(|v| v.as_atom()) == Some("yield")
                } else {
                    false
                }
            });
            assert!(has_yield, "expected yield in body");
        } else {
            panic!("expected list");
        }
    }

    // ---------------------------------------------------------------
    // Class emission tests
    // ---------------------------------------------------------------

    #[test]
    fn test_emit_class_with_bind_in_constructor() {
        // Class with bind in constructor body should emit (const y 42) in kernel
        let form = SurfaceForm::Class {
            name: atom("Foo"),
            superclass: list(vec![]),
            members: vec![ClassMemberForm::Method {
                prefix: vec![atom("constructor"), list(vec![atom("x")])],
                body: vec![list(vec![atom("bind"), atom("y"), num(42.0)])],
                is_static: false,
                is_async: false,
            }],
            span: s(),
        };

        let registry = TypeRegistry::default();
        let mut ctx = EmitterContext::new(false);
        let result = emit_form(&form, &mut ctx, &registry).unwrap();
        assert_eq!(result.len(), 1);

        // (class Foo () (constructor (x) (const y 42)))
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("class"));
            assert_eq!(values[1].as_atom(), Some("Foo"));
            // values[2] is the superclass list
            // values[3] is the constructor member
            if let SExpr::List { values: member, .. } = &values[3] {
                assert_eq!(member[0].as_atom(), Some("constructor"));
                // member[2] should be (const y 42)
                if let SExpr::List {
                    values: bind_vals, ..
                } = &member[2]
                {
                    assert_eq!(bind_vals[0].as_atom(), Some("const"));
                    assert_eq!(bind_vals[1].as_atom(), Some("y"));
                } else {
                    panic!("expected list for const binding");
                }
            } else {
                panic!("expected list for constructor");
            }
        } else {
            panic!("expected list for class");
        }
    }

    #[test]
    fn test_emit_class_static_method() {
        let form = SurfaceForm::Class {
            name: atom("Foo"),
            superclass: list(vec![]),
            members: vec![ClassMemberForm::Method {
                prefix: vec![atom("create"), list(vec![])],
                body: vec![list(vec![atom("bind"), atom("x"), num(1.0)])],
                is_static: true,
                is_async: false,
            }],
            span: s(),
        };

        let registry = TypeRegistry::default();
        let mut ctx = EmitterContext::new(false);
        let result = emit_form(&form, &mut ctx, &registry).unwrap();

        // The member should be wrapped in (static ...)
        if let SExpr::List { values, .. } = &result[0] {
            // values[3] is the member
            if let SExpr::List { values: member, .. } = &values[3] {
                assert_eq!(member[0].as_atom(), Some("static"));
                // Inner should be (create () (const x 1))
                if let SExpr::List { values: inner, .. } = &member[1] {
                    assert_eq!(inner[0].as_atom(), Some("create"));
                } else {
                    panic!("expected inner list");
                }
            } else {
                panic!("expected member list");
            }
        } else {
            panic!("expected class list");
        }
    }

    #[test]
    fn test_emit_class_field_with_init() {
        let form = SurfaceForm::Class {
            name: atom("Foo"),
            superclass: list(vec![]),
            members: vec![ClassMemberForm::Field {
                prefix: vec![atom("field"), atom("count")],
                init: Some(num(0.0)),
                is_static: false,
            }],
            span: s(),
        };

        let registry = TypeRegistry::default();
        let mut ctx = EmitterContext::new(false);
        let result = emit_form(&form, &mut ctx, &registry).unwrap();

        if let SExpr::List { values, .. } = &result[0] {
            if let SExpr::List { values: member, .. } = &values[3] {
                assert_eq!(member[0].as_atom(), Some("field"));
                assert_eq!(member[1].as_atom(), Some("count"));
                // member[2] is the init value
                assert!(matches!(&member[2], SExpr::Number { value, .. } if *value == 0.0));
            } else {
                panic!("expected member list");
            }
        } else {
            panic!("expected class list");
        }
    }

    #[test]
    fn test_emit_class_expr() {
        let form = SurfaceForm::ClassExpr {
            superclass: list(vec![]),
            members: vec![ClassMemberForm::Method {
                prefix: vec![atom("constructor"), list(vec![])],
                body: vec![list(vec![atom("bind"), atom("x"), num(1.0)])],
                is_static: false,
                is_async: false,
            }],
            span: s(),
        };

        let registry = TypeRegistry::default();
        let mut ctx = EmitterContext::new(false);
        let result = emit_form(&form, &mut ctx, &registry).unwrap();

        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("class-expr"));
            // No name for class-expr — values[1] is the superclass list
            // values[2] is the constructor member
        } else {
            panic!("expected class-expr list");
        }
    }

    #[test]
    fn test_emit_class_set_in_method() {
        // set! in method body should emit (= target value)
        let form = SurfaceForm::Class {
            name: atom("Dog"),
            superclass: list(vec![]),
            members: vec![ClassMemberForm::Method {
                prefix: vec![atom("constructor"), list(vec![atom("name")])],
                body: vec![list(vec![atom("set!"), atom("this:name"), atom("name")])],
                is_static: false,
                is_async: false,
            }],
            span: s(),
        };

        let registry = TypeRegistry::default();
        let mut ctx = EmitterContext::new(false);
        let result = emit_form(&form, &mut ctx, &registry).unwrap();

        if let SExpr::List { values, .. } = &result[0] {
            if let SExpr::List { values: member, .. } = &values[3] {
                assert_eq!(member[0].as_atom(), Some("constructor"));
                // member[2] should be (= this:name name)
                if let SExpr::List {
                    values: assign_vals,
                    ..
                } = &member[2]
                {
                    assert_eq!(assign_vals[0].as_atom(), Some("="));
                    assert_eq!(assign_vals[1].as_atom(), Some("this:name"));
                    assert_eq!(assign_vals[2].as_atom(), Some("name"));
                } else {
                    panic!("expected assignment list");
                }
            } else {
                panic!("expected member list");
            }
        } else {
            panic!("expected class list");
        }
    }
}
