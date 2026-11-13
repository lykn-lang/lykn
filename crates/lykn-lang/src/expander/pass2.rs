//! Pass 2: Macro expansion walk.
//!
//! This pass recursively walks the S-expression tree and:
//! 1. Leaves `(quote ...)` forms untouched.
//! 2. Desugars built-in sugar forms (`cons`, `car`, `cdr`, `list`, etc.).
//! 3. Expands user-defined macro invocations by calling the compiled JS
//!    function body via the Deno subprocess. Expansion uses a fixed-point
//!    loop so that macros returning other macro invocations are expanded
//!    transitively.
//! 4. Recursively expands sub-forms of non-macro lists.

use crate::ast::sexpr::SExpr;
use crate::error::LyknError;
use crate::reader::source_loc::Span;

use super::MacroEnv;
use super::deno::DenoSubprocess;

/// Maximum number of expansion iterations before declaring runaway expansion.
const MAX_EXPAND_ITERATIONS: usize = 1000;

/// Expand all macro invocations in a list of top-level forms.
pub fn expand_all(
    forms: Vec<SExpr>,
    deno: &mut DenoSubprocess,
    env: &MacroEnv,
) -> Result<Vec<SExpr>, LyknError> {
    // DD-61 §A3 — the light binding-scan. The expander runs *before* the
    // resolver, so it cannot read resolution tags; instead it carries a scope
    // set of lexically bound names (built from the shared binding walker, via
    // `resolver::scope_plan`/`hoisted_names`) so a bound head fires neither a
    // desugar nor a user macro — DD-60 D1, applied at expansion time.
    let mut scope: Vec<String> = Vec::new();
    let mut result = Vec::new();
    for form in forms {
        if let Some(expr) = expand_expr(form, deno, env, &mut scope)? {
            scope.extend(actual_expanded_hoists(&expr, &scope));
            result.push(expr);
        }
    }
    Ok(result)
}

/// Expand a single S-expression, returning `None` if the form should be
/// elided (currently all forms produce output). `scope` is the DD-61 §A3 set
/// of lexically bound names in effect at this point.
fn expand_expr(
    form: SExpr,
    deno: &mut DenoSubprocess,
    env: &MacroEnv,
    scope: &mut Vec<String>,
) -> Result<Option<SExpr>, LyknError> {
    match &form {
        // Leaf nodes — no expansion needed.
        SExpr::Atom { .. }
        | SExpr::Number { .. }
        | SExpr::String { .. }
        | SExpr::Keyword { .. }
        | SExpr::Bool { .. }
        | SExpr::Null { .. } => Ok(Some(form)),

        // Cons pairs — expand both halves.
        SExpr::Cons { car, cdr, span } => {
            let expanded_car = expand_expr(*car.clone(), deno, env, scope)?;
            let expanded_cdr = expand_expr(*cdr.clone(), deno, env, scope)?;
            match (expanded_car, expanded_cdr) {
                (Some(c), Some(d)) => Ok(Some(SExpr::Cons {
                    car: Box::new(c),
                    cdr: Box::new(d),
                    span: *span,
                })),
                _ => Ok(None),
            }
        }

        // Empty list — pass through.
        SExpr::List { values, .. } if values.is_empty() => Ok(Some(form)),

        // Non-empty list — the interesting case.
        SExpr::List { values, span } => {
            // Re-run the same actual entry policy after every root rewrite.
            // This keeps one macro budget/location while ensuring a returned
            // bound call or sugar form is treated like direct source entry.
            let chain_name = values[0].as_atom().unwrap_or("").to_string();
            let chain_location = span.start;
            let mut current = form;
            let mut count = 0usize;
            while let SExpr::List {
                values: current_values,
                span: current_span,
            } = &current
            {
                let Some(head) = current_values.first() else {
                    break;
                };
                let Some(head_name) = head.as_atom() else {
                    break;
                };
                if head_name == "quote" {
                    return Ok(Some(current));
                }
                let bound = scope.iter().any(|name| name == head_name)
                    || (head_name == "match" && head.as_form_head().is_none());

                if !bound
                    && head_name == "genfunc"
                    && let Some(layout) =
                        crate::lexical_regions::source_function_regions(&current, true)
                    && layout.clauses.len() > 1
                {
                    return Err(LyknError::Read {
                        message: "genfunc: multiple clauses are not supported".to_string(),
                        location: current_span.start,
                    });
                }

                let is_macro_def_shape =
                    current_values.len() >= 2 && current_values[1].as_atom().is_some();
                if !bound && head_name == "macro" && is_macro_def_shape {
                    return Err(LyknError::Read {
                        message: "unexpected macro definition in expansion pass \
                                  (macros should be processed in Pass 1)"
                            .to_string(),
                        location: current_span.start,
                    });
                }

                if !bound
                    && let Some(desugared) =
                        try_desugar(head_name, &current_values[1..], *current_span)
                {
                    current = desugared;
                    continue;
                }

                if !bound && let Some(macro_def) = env.get(head_name) {
                    let args = &current_values[1..];
                    current = if macro_def.js_body.starts_with("__surface_macro__") {
                        deno.eval_surface_macro(head_name, args)?
                    } else {
                        deno.eval_macro(&macro_def.js_body, args)?
                    };
                    count += 1;
                    if count > MAX_EXPAND_ITERATIONS {
                        return Err(LyknError::Read {
                            message: format!(
                                "expansion limit ({MAX_EXPAND_ITERATIONS}) exceeded expanding '{chain_name}'"
                            ),
                            location: chain_location,
                        });
                    }
                    continue;
                }
                break;
            }

            // Do not restart root dispatch after reaching a terminal result:
            // that would reset the chain budget. This helper expands only the
            // terminal node's children; each child gets its own root budget.
            expand_dispatched(current, deno, env, scope)
        }
    }
}

fn expand_dispatched(
    form: SExpr,
    deno: &mut DenoSubprocess,
    env: &MacroEnv,
    scope: &mut Vec<String>,
) -> Result<Option<SExpr>, LyknError> {
    match form {
        SExpr::Cons { car, cdr, span } => {
            let expanded_car = expand_expr(*car, deno, env, scope)?;
            let expanded_cdr = expand_expr(*cdr, deno, env, scope)?;
            Ok(match (expanded_car, expanded_cdr) {
                (Some(car), Some(cdr)) => Some(SExpr::Cons {
                    car: Box::new(car),
                    cdr: Box::new(cdr),
                    span,
                }),
                _ => None,
            })
        }
        SExpr::List { values, span } if values.is_empty() => Ok(Some(SExpr::List { values, span })),
        SExpr::List { values, span } => {
            let terminal = SExpr::List { values, span };
            match &terminal {
                SExpr::List { values, .. } => {
                    let expanded_values =
                        expand_children_scoped(&terminal, values, deno, env, scope)?;
                    Ok(Some(SExpr::List {
                        values: expanded_values,
                        span,
                    }))
                }
                _ => Ok(Some(terminal)),
            }
        }
        leaf => Ok(Some(leaf)),
    }
}

/// Expand a list's children with the scope extended per the form's
/// [`crate::resolver::ScopePlan`] — mirroring the resolver so the expander's
/// light scan and the resolver's tagging agree on what is in scope where. `form`
/// is the enclosing list (for the plan); `values` are its children.
fn expand_children_scoped(
    form: &SExpr,
    values: &[SExpr],
    deno: &mut DenoSubprocess,
    env: &MacroEnv,
    scope: &mut Vec<String>,
) -> Result<Vec<SExpr>, LyknError> {
    match crate::resolver::scope_plan(form, scope) {
        crate::resolver::ScopePlan::Sequence => expand_seq(values, deno, env, scope),
        crate::resolver::ScopePlan::Body { names, body_start } => {
            let split = body_start.min(values.len());
            let mut out = Vec::with_capacity(values.len());
            // Pre-body children (initializer / iterable / scrutinee): the
            // binding is not yet in scope.
            for sub in &values[..split] {
                if let Some(e) = expand_expr(sub.clone(), deno, env, scope)? {
                    out.push(e);
                }
            }
            if split < values.len() {
                let mark = scope.len();
                scope.extend(names);
                out.extend(expand_seq(&values[split..], deno, env, scope)?);
                scope.truncate(mark);
            }
            Ok(out)
        }
        crate::resolver::ScopePlan::GroupedBind { slots } => {
            let mark = scope.len();
            let mut out = Vec::with_capacity(values.len());
            let mut next_index = 0;
            for slot in slots {
                while next_index < slot.name_index {
                    if let Some(e) = expand_expr(values[next_index].clone(), deno, env, scope)? {
                        out.push(e);
                    }
                    next_index += 1;
                }
                if let Some(e) = expand_expr(values[slot.name_index].clone(), deno, env, scope)? {
                    out.push(e);
                }
                next_index = slot.name_index + 1;

                while next_index < slot.value_index {
                    if let Some(e) = expand_expr(values[next_index].clone(), deno, env, scope)? {
                        out.push(e);
                    }
                    next_index += 1;
                }
                if let Some(e) = expand_expr(values[slot.value_index].clone(), deno, env, scope)? {
                    out.push(e);
                }
                next_index = slot.value_index + 1;

                let names = crate::binding::binding_names_in_pattern(
                    &values[slot.name_index],
                    crate::binding::BindingKind::Bind,
                );
                scope.extend(names.into_iter().map(|site| site.name));
            }
            while next_index < values.len() {
                if let Some(e) = expand_expr(values[next_index].clone(), deno, env, scope)? {
                    out.push(e);
                }
                next_index += 1;
            }
            scope.truncate(mark);
            Ok(out)
        }
        crate::resolver::ScopePlan::Conditional => {
            let mut out = Vec::with_capacity(values.len());
            for child in values {
                if let Some(expanded) = expand_expr(child.clone(), deno, env, scope)? {
                    out.push(expanded);
                }
            }
            Ok(out)
        }
        crate::resolver::ScopePlan::Call => values
            .iter()
            .map(|child| {
                expand_expr(child.clone(), deno, env, scope)
                    .map(|form| form.unwrap_or_else(|| child.clone()))
            })
            .collect(),
        crate::resolver::ScopePlan::Match { subject, clauses } => {
            let Some(subject) = subject else {
                return Ok(values.to_vec());
            };
            let mut out = Vec::with_capacity(values.len());
            out.push(values[0].clone());
            out.push(
                expand_expr(subject.clone(), deno, env, scope)?.unwrap_or_else(|| subject.clone()),
            );
            for (clause, plan) in values[2..].iter().zip(clauses) {
                match plan {
                    Some(plan) => out.push(expand_match_clause(&plan, deno, env, scope)?),
                    None => out.push(clause.clone()),
                }
            }
            Ok(out)
        }
        crate::resolver::ScopePlan::SourceFunction(layout) => {
            crate::classifier::forms::validate_typed_source_function_header(form)
                .map_err(LyknError::Classify)?;
            match layout {
                Some(layout) => expand_source_function(form, values, &layout, deno, env, scope),
                None => Ok(values.to_vec()),
            }
        }
        crate::resolver::ScopePlan::Class(None) => Ok(values.to_vec()),
        crate::resolver::ScopePlan::Class(Some(layout)) => {
            expand_class(form, values, &layout, deno, env, scope)
        }
    }
}

fn expand_source_function(
    form: &SExpr,
    _values: &[SExpr],
    layout: &crate::lexical_regions::FunctionRegions,
    deno: &mut DenoSubprocess,
    env: &MacroEnv,
    scope: &mut Vec<String>,
) -> Result<Vec<SExpr>, LyknError> {
    let mark = scope.len();
    if let Some(path) = &layout.name_path
        && let Some(name) = crate::lexical_regions::at_path(form, path).and_then(SExpr::as_atom)
    {
        scope.push(name.to_string());
    }
    let mut out = form.clone();
    for clause in &layout.clauses {
        let clause_mark = scope.len();
        if let Some(path) = &clause.params_path
            && let Some(params) = crate::lexical_regions::at_path(form, path)
        {
            let occurrences = if layout.grammar == crate::lexical_regions::FunctionGrammar::Kernel {
                crate::binding::kernel_param_names(params)
            } else {
                crate::binding::typed_param_names(params)
            };
            scope.extend(
                occurrences
                    .into_iter()
                    .filter(|site| site.kind.shadows_values())
                    .filter_map(|site| site.atom.as_atom().map(str::to_string)),
            );
        }
        for path in &clause.default_paths {
            expand_selected_path(form, &mut out, path, deno, env, scope)?;
        }
        if let Some(path) = clause.pre_paths.first() {
            expand_selected_path(form, &mut out, path, deno, env, scope)?;
        }
        for path in &clause.body_paths {
            if let Some(expanded) = expand_selected_path(form, &mut out, path, deno, env, scope)? {
                scope.extend(actual_expanded_hoists(&expanded, scope));
            }
        }
        if layout.grammar != crate::lexical_regions::FunctionGrammar::SourceGenfunc
            && let Some(path) = clause.post_paths.first()
        {
            expand_selected_path(form, &mut out, path, deno, env, scope)?;
        }
        scope.truncate(clause_mark);
    }
    scope.truncate(mark);
    Ok(match out {
        SExpr::List { values, .. } => values,
        _ => Vec::new(),
    })
}

fn expand_class(
    form: &SExpr,
    _values: &[SExpr],
    layout: &crate::lexical_regions::ClassRegions,
    deno: &mut DenoSubprocess,
    env: &MacroEnv,
    scope: &mut Vec<String>,
) -> Result<Vec<SExpr>, LyknError> {
    let mark = scope.len();
    if let Some(path) = &layout.name_path
        && let Some(name) = crate::lexical_regions::at_path(form, path).and_then(SExpr::as_atom)
    {
        scope.push(name.to_string());
    }
    let mut out = form.clone();
    for path in &layout.base_paths {
        expand_selected_path(form, &mut out, path, deno, env, scope)?;
    }
    for member in &layout.members {
        expand_class_member(form, &mut out, member, deno, env, scope)?;
    }
    scope.truncate(mark);
    Ok(match out {
        SExpr::List { values, .. } => values,
        _ => Vec::new(),
    })
}

fn expand_class_member(
    root: &SExpr,
    out: &mut SExpr,
    layout: &crate::lexical_regions::ClassMemberRegions,
    deno: &mut DenoSubprocess,
    env: &MacroEnv,
    class_scope: &mut Vec<String>,
) -> Result<(), LyknError> {
    let Some(member) = crate::lexical_regions::at_path(root, &layout.path) else {
        return Ok(());
    };
    let Some(values) = member.as_list() else {
        return Ok(());
    };
    let head = values.first().and_then(SExpr::as_atom).unwrap_or("");
    if matches!(head, "static" | "async") {
        if let Some(inner) = &layout.inner {
            return expand_class_member(root, out, inner, deno, env, class_scope);
        }
        return Ok(());
    }
    if layout.grammar == crate::lexical_regions::ClassMemberGrammar::Field {
        for init in &layout.init_paths {
            expand_selected_path(root, out, init, deno, env, class_scope)?;
        }
        return Ok(());
    }
    let Some(params_path) = &layout.params_path else {
        return Ok(());
    };
    let params = crate::lexical_regions::at_path(root, params_path).unwrap_or(member);
    let mark = class_scope.len();
    class_scope.extend(
        crate::binding::kernel_param_names(params)
            .into_iter()
            .filter(|site| site.kind.shadows_values())
            .filter_map(|site| site.atom.as_atom().map(str::to_string)),
    );
    for path in &layout.default_paths {
        expand_selected_path(root, out, path, deno, env, class_scope)?;
    }
    for path in &layout.body_paths {
        if let Some(expanded) = expand_selected_path(root, out, path, deno, env, class_scope)? {
            class_scope.extend(actual_expanded_hoists(&expanded, class_scope));
        }
    }
    class_scope.truncate(mark);
    Ok(())
}

fn expand_selected_path(
    root: &SExpr,
    out: &mut SExpr,
    path: &crate::lexical_regions::OccurrencePath,
    deno: &mut DenoSubprocess,
    env: &MacroEnv,
    scope: &mut Vec<String>,
) -> Result<Option<SExpr>, LyknError> {
    let Some(node) = crate::lexical_regions::at_path(root, path) else {
        return Ok(None);
    };
    let expanded = expand_expr(node.clone(), deno, env, scope)?;
    if let Some(replacement) = expanded.clone() {
        *out = replace_at_path(out, &path.0, replacement);
    }
    Ok(expanded)
}

fn replace_at_path(root: &SExpr, path: &[usize], replacement: SExpr) -> SExpr {
    if path.is_empty() {
        return replacement;
    }
    let SExpr::List { values, span } = root else {
        return root.clone();
    };
    let Some(child) = values.get(path[0]) else {
        return root.clone();
    };
    let mut rebuilt = values.clone();
    rebuilt[path[0]] = replace_at_path(child, &path[1..], replacement);
    SExpr::List {
        values: rebuilt,
        span: *span,
    }
}

fn actual_expanded_hoists(form: &SExpr, scope: &[String]) -> Vec<String> {
    crate::resolver::enclosing_declaration_sites(form, scope)
        .into_iter()
        .map(|site| site.name)
        .collect()
}

fn expand_match_clause(
    clause: &crate::classifier::forms::MatchClauseScope<'_>,
    deno: &mut DenoSubprocess,
    env: &MacroEnv,
    scope: &mut Vec<String>,
) -> Result<SExpr, LyknError> {
    let mark = scope.len();
    scope.extend(
        clause
            .occurrences
            .iter()
            .filter(|occurrence| occurrence.kind.shadows_values())
            .map(|occurrence| occurrence.project().name),
    );

    let result = (|| {
        let mut values = Vec::with_capacity(clause.body.len() + 3);
        values.push(clause.pattern_input.clone());
        if let Some((marker, guard)) = clause.guard {
            values.push(marker.clone());
            values.push(
                expand_expr(guard.clone(), deno, env, scope)?.unwrap_or_else(|| guard.clone()),
            );
        }
        values.extend(expand_seq(clause.body, deno, env, scope)?);
        Ok(SExpr::List {
            values,
            span: clause.span,
        })
    })();

    scope.truncate(mark);
    result
}

/// Expand a run of sibling forms, hoisting each one's enclosing-scope
/// declarations (`bind`, `import` locals) into scope for the forms that follow.
fn expand_seq(
    values: &[SExpr],
    deno: &mut DenoSubprocess,
    env: &MacroEnv,
    scope: &mut Vec<String>,
) -> Result<Vec<SExpr>, LyknError> {
    let mark = scope.len();
    let mut out = Vec::with_capacity(values.len());
    for sub in values {
        if let Some(e) = expand_expr(sub.clone(), deno, env, scope)? {
            scope.extend(actual_expanded_hoists(&e, scope));
            out.push(e);
        }
    }
    scope.truncate(mark);
    Ok(out)
}

/// Attempt to desugar a known sugar form.
///
/// Returns `Some(desugared)` if `head` is a recognized sugar form with the
/// correct arity; `None` otherwise.
fn try_desugar(head: &str, args: &[SExpr], span: Span) -> Option<SExpr> {
    let s = Span::default();
    match head {
        "cons" if args.len() == 2 => Some(SExpr::List {
            values: vec![SExpr::atom("array", s), args[0].clone(), args[1].clone()],
            span,
        }),

        "car" if args.len() == 1 => Some(SExpr::List {
            values: vec![
                SExpr::atom("get", s),
                args[0].clone(),
                SExpr::Number {
                    value: 0.0,
                    span: s,
                },
            ],
            span,
        }),

        "cdr" if args.len() == 1 => Some(SExpr::List {
            values: vec![
                SExpr::atom("get", s),
                args[0].clone(),
                SExpr::Number {
                    value: 1.0,
                    span: s,
                },
            ],
            span,
        }),

        "cadr" if args.len() == 1 => Some(SExpr::List {
            values: vec![
                SExpr::atom("get", s),
                SExpr::List {
                    values: vec![
                        SExpr::atom("get", s),
                        args[0].clone(),
                        SExpr::Number {
                            value: 1.0,
                            span: s,
                        },
                    ],
                    span: s,
                },
                SExpr::Number {
                    value: 0.0,
                    span: s,
                },
            ],
            span,
        }),

        "cddr" if args.len() == 1 => Some(SExpr::List {
            values: vec![
                SExpr::atom("get", s),
                SExpr::List {
                    values: vec![
                        SExpr::atom("get", s),
                        args[0].clone(),
                        SExpr::Number {
                            value: 1.0,
                            span: s,
                        },
                    ],
                    span: s,
                },
                SExpr::Number {
                    value: 1.0,
                    span: s,
                },
            ],
            span,
        }),

        "list" if args.is_empty() => Some(SExpr::atom("null", span)),

        "list" => {
            // (list a b c) desugars to (array a (array b (array c null)))
            let mut result = SExpr::atom("null", s);
            for arg in args.iter().rev() {
                result = SExpr::List {
                    values: vec![SExpr::atom("array", s), arg.clone(), result],
                    span: s,
                };
            }
            Some(result)
        }

        "as" if args.len() == 2 => {
            if args[0].is_atom() {
                Some(SExpr::List {
                    values: vec![SExpr::atom("alias", s), args[0].clone(), args[1].clone()],
                    span,
                })
            } else {
                None
            }
        }

        _ => None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::reader::source_loc::Span;

    fn s() -> Span {
        Span::default()
    }

    fn atom(name: &str) -> SExpr {
        SExpr::atom(name, s())
    }

    fn num(n: f64) -> SExpr {
        SExpr::Number {
            value: n,
            span: s(),
        }
    }

    fn list(vals: Vec<SExpr>) -> SExpr {
        SExpr::List {
            values: vals,
            span: s(),
        }
    }

    // ---------------------------------------------------------------
    // try_desugar
    // ---------------------------------------------------------------

    #[test]
    fn test_desugar_cons() {
        let result = try_desugar("cons", &[atom("a"), atom("b")], s()).unwrap();
        if let SExpr::List { values, .. } = result {
            assert_eq!(values[0].as_atom(), Some("array"));
            assert_eq!(values[1].as_atom(), Some("a"));
            assert_eq!(values[2].as_atom(), Some("b"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_desugar_cons_wrong_arity() {
        assert!(try_desugar("cons", &[atom("a")], s()).is_none());
        assert!(try_desugar("cons", &[atom("a"), atom("b"), atom("c")], s()).is_none());
    }

    #[test]
    fn test_desugar_car() {
        let result = try_desugar("car", &[atom("xs")], s()).unwrap();
        if let SExpr::List { values, .. } = result {
            assert_eq!(values[0].as_atom(), Some("get"));
            assert_eq!(values[1].as_atom(), Some("xs"));
            assert_eq!(values[2], num(0.0));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_desugar_cdr() {
        let result = try_desugar("cdr", &[atom("xs")], s()).unwrap();
        if let SExpr::List { values, .. } = result {
            assert_eq!(values[0].as_atom(), Some("get"));
            assert_eq!(values[1].as_atom(), Some("xs"));
            assert_eq!(values[2], num(1.0));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_desugar_cadr() {
        let result = try_desugar("cadr", &[atom("xs")], s()).unwrap();
        if let SExpr::List { values, .. } = result {
            assert_eq!(values[0].as_atom(), Some("get"));
            // Inner should be (get xs 1)
            if let SExpr::List { values: inner, .. } = &values[1] {
                assert_eq!(inner[0].as_atom(), Some("get"));
                assert_eq!(inner[1].as_atom(), Some("xs"));
                assert_eq!(inner[2], num(1.0));
            } else {
                panic!("expected inner list");
            }
            assert_eq!(values[2], num(0.0));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_desugar_cddr() {
        let result = try_desugar("cddr", &[atom("xs")], s()).unwrap();
        if let SExpr::List { values, .. } = result {
            assert_eq!(values[0].as_atom(), Some("get"));
            assert_eq!(values[2], num(1.0));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_desugar_list_empty() {
        let result = try_desugar("list", &[], s()).unwrap();
        assert_eq!(result.as_atom(), Some("null"));
    }

    #[test]
    fn test_desugar_list_single() {
        // (list a) -> (array a null)
        let result = try_desugar("list", &[atom("a")], s()).unwrap();
        if let SExpr::List { values, .. } = result {
            assert_eq!(values[0].as_atom(), Some("array"));
            assert_eq!(values[1].as_atom(), Some("a"));
            assert_eq!(values[2].as_atom(), Some("null"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_desugar_list_multiple() {
        // (list a b) -> (array a (array b null))
        let result = try_desugar("list", &[atom("a"), atom("b")], s()).unwrap();
        if let SExpr::List { values, .. } = result {
            assert_eq!(values[0].as_atom(), Some("array"));
            assert_eq!(values[1].as_atom(), Some("a"));
            if let SExpr::List { values: inner, .. } = &values[2] {
                assert_eq!(inner[0].as_atom(), Some("array"));
                assert_eq!(inner[1].as_atom(), Some("b"));
                assert_eq!(inner[2].as_atom(), Some("null"));
            } else {
                panic!("expected nested list");
            }
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_desugar_as() {
        let result = try_desugar("as", &[atom("foo"), atom("bar")], s()).unwrap();
        if let SExpr::List { values, .. } = result {
            assert_eq!(values[0].as_atom(), Some("alias"));
            assert_eq!(values[1].as_atom(), Some("foo"));
            assert_eq!(values[2].as_atom(), Some("bar"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_desugar_as_non_atom() {
        // (as (complex) bar) should not desugar.
        let complex = list(vec![atom("complex")]);
        assert!(try_desugar("as", &[complex, atom("bar")], s()).is_none());
    }

    #[test]
    fn test_desugar_unknown() {
        assert!(try_desugar("define", &[atom("x"), num(1.0)], s()).is_none());
    }

    // ---------------------------------------------------------------
    // expand_expr — leaf forms
    // ---------------------------------------------------------------

    #[test]
    fn test_expand_atom_passthrough() {
        // We can't construct a DenoSubprocess without deno, but for leaf
        // nodes the function never touches deno. We test indirectly via
        // the top-level `expand` which short-circuits when no macros are
        // present.
        let forms = vec![atom("x"), num(42.0)];
        let result = crate::expander::expand(forms, None, None).unwrap();
        assert_eq!(result.len(), 2);
        assert_eq!(result[0].as_atom(), Some("x"));
    }

    // ---------------------------------------------------------------
    // expand via the top-level entry point (no macros)
    // ---------------------------------------------------------------

    #[test]
    fn test_expand_no_macros_passthrough() {
        let forms = vec![
            list(vec![atom("define"), atom("x"), num(1.0)]),
            list(vec![atom("console:log"), atom("x")]),
        ];
        let result = crate::expander::expand(forms.clone(), None, None).unwrap();
        assert_eq!(result, forms);
    }

    #[test]
    fn test_expand_empty_input() {
        let result = crate::expander::expand(vec![], None, None).unwrap();
        assert!(result.is_empty());
    }

    // ---------------------------------------------------------------
    // quote suppresses expansion
    // ---------------------------------------------------------------

    #[test]
    fn test_expand_quote_suppresses() {
        // (quote (macro foo () bar)) should pass through unchanged.
        let quoted = list(vec![
            atom("quote"),
            list(vec![atom("macro"), atom("foo"), list(vec![]), atom("bar")]),
        ]);
        // No macro/import-macros at top level, so expand returns as-is.
        let forms = vec![quoted.clone()];
        let result = crate::expander::expand(forms, None, None).unwrap();
        assert_eq!(result, vec![quoted]);
    }

    // ---------------------------------------------------------------
    // try_desugar — additional edge cases
    // ---------------------------------------------------------------

    #[test]
    fn test_desugar_car_wrong_arity() {
        assert!(try_desugar("car", &[], s()).is_none());
        assert!(try_desugar("car", &[atom("a"), atom("b")], s()).is_none());
    }

    #[test]
    fn test_desugar_cdr_wrong_arity() {
        assert!(try_desugar("cdr", &[], s()).is_none());
        assert!(try_desugar("cdr", &[atom("a"), atom("b")], s()).is_none());
    }

    #[test]
    fn test_desugar_cadr_wrong_arity() {
        assert!(try_desugar("cadr", &[], s()).is_none());
    }

    #[test]
    fn test_desugar_cddr_wrong_arity() {
        assert!(try_desugar("cddr", &[], s()).is_none());
    }

    #[test]
    fn test_desugar_as_wrong_arity() {
        assert!(try_desugar("as", &[atom("a")], s()).is_none());
        assert!(try_desugar("as", &[atom("a"), atom("b"), atom("c")], s()).is_none());
    }

    #[test]
    fn test_desugar_list_three_elements() {
        // (list a b c) -> (array a (array b (array c null)))
        let result = try_desugar("list", &[atom("a"), atom("b"), atom("c")], s()).unwrap();
        if let SExpr::List { values, .. } = result {
            assert_eq!(values[0].as_atom(), Some("array"));
            assert_eq!(values[1].as_atom(), Some("a"));
            // Rest is nested
            assert!(matches!(&values[2], SExpr::List { .. }));
        } else {
            panic!("expected list");
        }
    }

    // ---------------------------------------------------------------
    // expand via top-level — no macros passthrough
    // ---------------------------------------------------------------

    #[test]
    fn test_expand_empty_list_passthrough() {
        let forms = vec![list(vec![])];
        let result = crate::expander::expand(forms.clone(), None, None).unwrap();
        assert_eq!(result, forms);
    }

    #[test]
    fn test_expand_cons_pair_passthrough() {
        let cons = SExpr::Cons {
            car: Box::new(atom("a")),
            cdr: Box::new(atom("b")),
            span: s(),
        };
        let forms = vec![cons.clone()];
        let result = crate::expander::expand(forms, None, None).unwrap();
        assert_eq!(result.len(), 1);
        assert!(matches!(&result[0], SExpr::Cons { .. }));
    }

    #[test]
    fn test_expand_leaf_types_passthrough() {
        let forms = vec![
            SExpr::String {
                value: "hello".into(),
                span: s(),
            },
            SExpr::Keyword {
                value: "key".into(),
                span: s(),
            },
            SExpr::Bool {
                value: true,
                span: s(),
            },
            SExpr::Null { span: s() },
            num(42.0),
            atom("x"),
        ];
        let result = crate::expander::expand(forms.clone(), None, None).unwrap();
        assert_eq!(result, forms);
    }

    // ---------------------------------------------------------------
    // expand_all / expand_expr via live DenoSubprocess (empty MacroEnv)
    // ---------------------------------------------------------------

    /// Returns true if `deno` is available on PATH.
    fn deno_available() -> bool {
        std::process::Command::new("deno")
            .arg("--version")
            .stdout(std::process::Stdio::null())
            .stderr(std::process::Stdio::null())
            .status()
            .is_ok()
    }

    #[test]
    fn test_expand_all_leaf_atoms_with_deno() {
        if !deno_available() {
            eprintln!("skipping: deno not found");
            return;
        }
        let mut deno = super::super::deno::DenoSubprocess::spawn().expect("deno should spawn");
        let env = super::super::MacroEnv::new();

        let forms = vec![atom("x"), num(42.0)];
        let result = expand_all(forms.clone(), &mut deno, &env).unwrap();
        assert_eq!(result, forms);
    }

    #[test]
    #[allow(clippy::approx_constant)] // 3.14 is a sample float, not π
    fn test_expand_all_all_leaf_types_with_deno() {
        if !deno_available() {
            eprintln!("skipping: deno not found");
            return;
        }
        let mut deno = super::super::deno::DenoSubprocess::spawn().expect("deno should spawn");
        let env = super::super::MacroEnv::new();

        let forms = vec![
            SExpr::String {
                value: "hello".into(),
                span: s(),
            },
            SExpr::Keyword {
                value: "key".into(),
                span: s(),
            },
            SExpr::Bool {
                value: true,
                span: s(),
            },
            SExpr::Null { span: s() },
            num(3.14),
            atom("y"),
        ];
        let result = expand_all(forms.clone(), &mut deno, &env).unwrap();
        assert_eq!(result, forms);
    }

    #[test]
    fn test_expand_all_cons_pair_with_deno() {
        if !deno_available() {
            eprintln!("skipping: deno not found");
            return;
        }
        let mut deno = super::super::deno::DenoSubprocess::spawn().expect("deno should spawn");
        let env = super::super::MacroEnv::new();

        let cons = SExpr::Cons {
            car: Box::new(atom("a")),
            cdr: Box::new(num(1.0)),
            span: s(),
        };
        let result = expand_all(vec![cons.clone()], &mut deno, &env).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::Cons { car, cdr, .. } = &result[0] {
            assert_eq!(car.as_atom(), Some("a"));
            assert_eq!(**cdr, num(1.0));
        } else {
            panic!("expected Cons");
        }
    }

    #[test]
    fn test_expand_all_empty_list_with_deno() {
        if !deno_available() {
            eprintln!("skipping: deno not found");
            return;
        }
        let mut deno = super::super::deno::DenoSubprocess::spawn().expect("deno should spawn");
        let env = super::super::MacroEnv::new();

        let empty = list(vec![]);
        let result = expand_all(vec![empty.clone()], &mut deno, &env).unwrap();
        assert_eq!(result, vec![empty]);
    }

    #[test]
    fn test_expand_all_nested_non_macro_lists_with_deno() {
        if !deno_available() {
            eprintln!("skipping: deno not found");
            return;
        }
        let mut deno = super::super::deno::DenoSubprocess::spawn().expect("deno should spawn");
        let env = super::super::MacroEnv::new();

        let form = list(vec![
            atom("define"),
            atom("x"),
            list(vec![atom("+"), num(1.0), num(2.0)]),
        ]);
        let result = expand_all(vec![form.clone()], &mut deno, &env).unwrap();
        assert_eq!(result, vec![form]);
    }

    #[test]
    fn test_expand_all_sugar_cons_with_deno() {
        if !deno_available() {
            eprintln!("skipping: deno not found");
            return;
        }
        let mut deno = super::super::deno::DenoSubprocess::spawn().expect("deno should spawn");
        let env = super::super::MacroEnv::new();

        // (cons a b) should desugar to (array a b)
        let form = list(vec![atom("cons"), atom("a"), atom("b")]);
        let result = expand_all(vec![form], &mut deno, &env).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("array"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_expand_all_sugar_car_with_deno() {
        if !deno_available() {
            eprintln!("skipping: deno not found");
            return;
        }
        let mut deno = super::super::deno::DenoSubprocess::spawn().expect("deno should spawn");
        let env = super::super::MacroEnv::new();

        // (car xs) should desugar to (get xs 0)
        let form = list(vec![atom("car"), atom("xs")]);
        let result = expand_all(vec![form], &mut deno, &env).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("get"));
            assert_eq!(values[2], num(0.0));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_expand_all_sugar_cdr_with_deno() {
        if !deno_available() {
            eprintln!("skipping: deno not found");
            return;
        }
        let mut deno = super::super::deno::DenoSubprocess::spawn().expect("deno should spawn");
        let env = super::super::MacroEnv::new();

        // (cdr xs) should desugar to (get xs 1)
        let form = list(vec![atom("cdr"), atom("xs")]);
        let result = expand_all(vec![form], &mut deno, &env).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("get"));
            assert_eq!(values[2], num(1.0));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_expand_all_sugar_list_with_deno() {
        if !deno_available() {
            eprintln!("skipping: deno not found");
            return;
        }
        let mut deno = super::super::deno::DenoSubprocess::spawn().expect("deno should spawn");
        let env = super::super::MacroEnv::new();

        // (list a b) desugars to nested (array ...) forms
        let form = list(vec![atom("list"), atom("a"), atom("b")]);
        let result = expand_all(vec![form], &mut deno, &env).unwrap();
        assert_eq!(result.len(), 1);
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("array"));
        } else {
            panic!("expected list");
        }
    }

    #[test]
    fn test_expand_all_quote_suppresses_with_deno() {
        if !deno_available() {
            eprintln!("skipping: deno not found");
            return;
        }
        let mut deno = super::super::deno::DenoSubprocess::spawn().expect("deno should spawn");
        let env = super::super::MacroEnv::new();

        let quoted = list(vec![
            atom("quote"),
            list(vec![atom("cons"), atom("a"), atom("b")]),
        ]);
        let result = expand_all(vec![quoted.clone()], &mut deno, &env).unwrap();
        // quote should suppress expansion — returned unchanged
        assert_eq!(result, vec![quoted]);
    }

    #[test]
    fn test_expand_all_macro_in_pass2_errors_with_deno() {
        if !deno_available() {
            eprintln!("skipping: deno not found");
            return;
        }
        let mut deno = super::super::deno::DenoSubprocess::spawn().expect("deno should spawn");
        let env = super::super::MacroEnv::new();

        let form = list(vec![
            atom("macro"),
            atom("my-macro"),
            list(vec![atom("x")]),
            atom("x"),
        ]);
        let err = expand_all(vec![form], &mut deno, &env).unwrap_err();
        let msg = format!("{err}");
        assert!(
            msg.contains("unexpected macro definition"),
            "expected macro error, got: {msg}"
        );
    }

    #[test]
    fn test_expand_all_empty_input_with_deno() {
        if !deno_available() {
            eprintln!("skipping: deno not found");
            return;
        }
        let mut deno = super::super::deno::DenoSubprocess::spawn().expect("deno should spawn");
        let env = super::super::MacroEnv::new();

        let result = expand_all(vec![], &mut deno, &env).unwrap();
        assert!(result.is_empty());
    }
}
