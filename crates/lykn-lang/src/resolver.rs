//! DD-61 §A1/§A3 — the name resolver (Rust): resolve once, tag the atoms.
//!
//! One pass over the (post-expansion) `SExpr` tree that stamps every atom with a
//! [`NameRes`] tag: [`NameRes::BindingDef`] at a lexical binding's definition
//! site, [`NameRes::BindingRef`] at a reference to a binding in scope, and
//! [`NameRes::Unresolved`] otherwise. Downstream dispatch sites read the tag via
//! [`SExpr::as_form_head`] (§A6): a bound head can no longer be mistaken for a
//! macro/form/kernel head — it falls through to a plain call, which is DD-60 D1
//! ("lexical bindings shadow macro/form dispatch").
//!
//! **Where the env lives.** DD-61 §A3 nominates the classifier as the env host.
//! In this backend classification is *shallow per form* (the emitter drives the
//! recursive walk), so the env is hosted here as a dedicated pass that runs
//! immediately before classification. The tag then rides the atom by value into
//! the classifier, emitter, and codegen — the same "resolve once, consume
//! everywhere" contract, just factored as its own pass. (Surfaced in the slice06
//! closing report as a grounded deviation from §A3's letter.)
//!
//! **Binding knowledge is not re-derived.** The set of names a form introduces
//! comes from [`crate::binding::bindings_introduced`] (DD-61 §A2's single
//! walker); this module owns only the *scoping* — which sub-positions each
//! binding is visible in, and sequential visibility across siblings.

use crate::ast::sexpr::{NameRes, SExpr};
use crate::binding::{
    BindingKind, BindingOccurrence, BindingSite, binding_names_in_pattern, binding_occurrences,
    bindings_introduced,
};

/// Resolve a slice of top-level forms: return the same tree with every atom's
/// [`NameRes`] tag set. Idempotent on already-unresolved input; never changes
/// value/span/structure (so emitted JS text is unchanged unless a dispatch site
/// consumes the tag). See the module doc for the model.
pub fn resolve(forms: &[SExpr]) -> Vec<SExpr> {
    let mut scope: Vec<String> = Vec::new();
    resolve_seq(forms, &mut scope, &[])
}

/// Whether a binding declares its name into the **enclosing** (sibling) scope —
/// i.e. it is visible to forms that come *after* it in the same sequence
/// (`bind`, `func`/`genfunc`/`class` names, `import` locals, kernel decls). The
/// body-scoped kinds (params, loop/catch/pattern bindings) are visible only
/// inside their own form and never hoist to siblings.
fn declares_in_enclosing(kind: BindingKind) -> bool {
    matches!(kind, BindingKind::Bind | BindingKind::ImportLocal)
}

/// The names a form declares into the **enclosing** sibling scope — visible to
/// the forms that come after it in the same sequence. Shared by the resolver
/// and the expander's light binding-scan (DD-61 §A3) so the two never diverge.
pub(crate) fn hoisted_names(form: &SExpr) -> Vec<String> {
    bindings_introduced(form)
        .into_iter()
        .filter(|s| s.kind.shadows_values() && declares_in_enclosing(s.kind))
        .map(|s| s.name)
        .collect()
}

/// How a list form distributes its body-scoped bindings over its children —
/// the single source of scoping truth, shared by the resolver (tagging) and the
/// expander's light binding-scan (dispatch gating). Head dispatch mirrors
/// [`bindings_introduced`]'s own dispatch.
pub(crate) enum ScopePlan<'tree> {
    /// No body-scoped names: children are a plain sibling sequence (their own
    /// enclosing declarations hoist between them). Covers calls, `block`,
    /// `import`, and the declaration escapes (`bind`, `const`/`let`/…), whose
    /// names scope over *siblings*, not their own value.
    Sequence,
    /// Body-scoped `names` are in scope for children from `body_start` onward;
    /// earlier children (an initializer / iterable / match-subject / `if-let`
    /// scrutinee) are evaluated outside the binding's scope.
    Body {
        names: Vec<String>,
        body_start: usize,
    },
    /// A grouped `(bind name value name2 value2 ...)` is a single declaration
    /// form whose pairs are sequential: each initializer is resolved before
    /// that pair's names enter scope, then those names are visible to later
    /// grouped initializers.
    GroupedBind { slots: Vec<BindGroupSlot> },
    /// A conditional's test, consequent, and optional alternate each see the
    /// same incoming scope; declarations in one operand do not leak to another.
    Conditional,
    /// A genuine native match: the subject is outside every clause and each
    /// complete clause has its own structural pattern, guard and body scope.
    Match {
        subject: Option<&'tree SExpr>,
        clauses: Vec<Option<crate::classifier::forms::MatchClauseScope<'tree>>>,
    },
}

#[derive(Clone, Copy)]
pub(crate) struct BindGroupSlot {
    pub(crate) name_index: usize,
    pub(crate) value_index: usize,
}

/// Compute a form's [`ScopePlan`]. Non-list or non-binding forms → `Sequence`.
pub(crate) fn scope_plan<'tree>(form: &'tree SExpr, scope: &[String]) -> ScopePlan<'tree> {
    scope_plan_and_occurrences(form, scope).plan
}

struct ScopeWork<'tree> {
    plan: ScopePlan<'tree>,
    occurrences: Vec<BindingOccurrence<'tree>>,
}

fn scope_plan_and_occurrences<'tree>(form: &'tree SExpr, scope: &[String]) -> ScopeWork<'tree> {
    if let SExpr::List { values, .. } = form
        && let Some(head) = values.first()
        && head.as_atom() == Some("match")
    {
        let is_native_match =
            head.as_form_head() == Some("match") && !scope.iter().any(|name| name == "match");
        if is_native_match {
            let clauses = crate::classifier::forms::match_clause_scopes(form);
            return ScopeWork {
                plan: ScopePlan::Match {
                    subject: values.get(1),
                    clauses,
                },
                occurrences: Vec::new(),
            };
        }
        return ScopeWork {
            plan: ScopePlan::Sequence,
            occurrences: Vec::new(),
        };
    }

    let occurrences = binding_occurrences(form);
    let plan = scope_plan_with_occurrences(form, scope, &occurrences);
    ScopeWork { plan, occurrences }
}

fn scope_plan_with_occurrences<'tree>(
    form: &'tree SExpr,
    scope: &[String],
    occurrences: &[BindingOccurrence<'tree>],
) -> ScopePlan<'tree> {
    let SExpr::List { values, .. } = form else {
        return ScopePlan::Sequence;
    };
    let head = values.first().and_then(|e| e.as_atom());
    let dispatch_head = values.first().and_then(SExpr::as_form_head);
    if matches!(dispatch_head, Some("if" | "kernel:if"))
        && !scope
            .iter()
            .any(|name| Some(name.as_str()) == dispatch_head)
    {
        return ScopePlan::Conditional;
    }
    let body_names: Vec<String> = occurrences
        .iter()
        .filter(|occurrence| {
            occurrence.kind.shadows_values() && !is_enclosing_only(occurrence.kind)
        })
        .filter_map(|occurrence| occurrence.atom.as_atom().map(str::to_string))
        .collect();
    match head {
        Some(
            "function" | "function*" | "=>" | "lambda" | "kernel:function" | "kernel:function*"
            | "kernel:=>" | "kernel:lambda",
        ) => ScopePlan::Body {
            names: body_names,
            body_start: 0,
        },
        Some("bind") if let Some(slots) = grouped_bind_slots(values) => {
            ScopePlan::GroupedBind { slots }
        }
        // Iterable / scrutinee stays outside the binding's scope.
        Some("for-of" | "for-in" | "for-await-of") => ScopePlan::Body {
            names: body_names,
            body_start: 3,
        },
        Some("if-let" | "when-let") => ScopePlan::Body {
            names: body_names,
            body_start: 2,
        },
        // Declaration escapes: name scopes over siblings, not its own value.
        _ if is_decl_head(head) => ScopePlan::Sequence,
        _ if body_names.is_empty() => ScopePlan::Sequence,
        // `func`/`fn`/`lambda`/`genfn`/`genfunc`/`class`/`catch`/`type`: the
        // binding is in scope over the whole subtree (declaration positions hold
        // only binder atoms, so no dispatchable head is wrongly shadowed).
        _ => ScopePlan::Body {
            names: body_names,
            body_start: 0,
        },
    }
}

/// Resolve `forms` as a **sibling sequence**, left to right: a name a form
/// declares into the enclosing scope becomes visible to the following siblings
/// (`(bind x …)` then `(x …)`), and the whole sequence's additions are dropped
/// on exit (shadow ends at scope exit). `def_occurrences` carries borrowed
/// binder atoms inherited from enclosing forms.
fn resolve_seq(
    forms: &[SExpr],
    scope: &mut Vec<String>,
    def_occurrences: &[BindingOccurrence<'_>],
) -> Vec<SExpr> {
    let mark = scope.len();
    let mut out = Vec::with_capacity(forms.len());
    for form in forms {
        out.push(resolve_form(form, scope, def_occurrences));
        // Hoist this form's enclosing-scope declarations to the following
        // siblings (function names, `bind`s, `import` locals, …).
        scope.extend(hoisted_names(form));
    }
    scope.truncate(mark);
    out
}

/// Resolve one form. Atoms are tagged from `def_occurrences`/`scope`; lists dispatch
/// on their (raw) head to place each introduced binding in scope over exactly
/// the child positions where it is lexically visible — never over an
/// initializer / iterable / match-subject / `if-let` expression, which are
/// evaluated *outside* the binding's scope.
fn resolve_form(
    form: &SExpr,
    scope: &mut Vec<String>,
    def_occurrences: &[BindingOccurrence<'_>],
) -> SExpr {
    match form {
        SExpr::Atom { .. } => {
            let value = form.as_atom().expect("atom variant");
            let res = if def_occurrences
                .iter()
                .any(|occurrence| std::ptr::eq(occurrence.atom, form))
            {
                // A binding definition site never dispatches, even if its name
                // also happens to be in scope (def takes priority over ref).
                NameRes::BindingDef
            } else if scope.iter().any(|n| n.as_str() == value) {
                NameRes::BindingRef
            } else {
                NameRes::Unresolved
            };
            form.clone().with_name_res(res)
        }
        SExpr::List { values, span } => {
            // One plan computation owns both the scope route and this form's
            // borrowed binder occurrences, so match classification is shared.
            let ScopeWork { plan, occurrences } = scope_plan_and_occurrences(form, scope);
            let mut child_defs = def_occurrences.to_vec();
            child_defs.extend(occurrences.iter().copied());

            let tagged_match_head = values.first().is_some_and(|head| {
                head.as_atom() == Some("match") && head.name_res() != NameRes::Unresolved
            });
            let new_values = match plan {
                ScopePlan::Sequence if tagged_match_head => {
                    let mut resolved = Vec::with_capacity(values.len());
                    resolved.push(values[0].clone());
                    resolved.extend(resolve_seq(&values[1..], scope, &child_defs));
                    resolved
                }
                ScopePlan::Sequence => resolve_seq(values, scope, &child_defs),
                ScopePlan::Body { names, body_start } => {
                    resolve_split_at(values, scope, &child_defs, names, body_start)
                }
                ScopePlan::GroupedBind { slots } => {
                    resolve_grouped_bind(values, scope, &child_defs, &slots)
                }
                ScopePlan::Conditional => values
                    .iter()
                    .map(|child| resolve_form(child, scope, &child_defs))
                    .collect(),
                ScopePlan::Match { subject, clauses } => {
                    let Some(subject) = subject else {
                        return form.clone();
                    };
                    let mut resolved = Vec::with_capacity(values.len());
                    resolved.push(resolve_form(&values[0], scope, &child_defs));
                    resolved.push(resolve_form(subject, scope, &child_defs));
                    for (clause, plan) in values[2..].iter().zip(clauses) {
                        match plan {
                            Some(plan) => {
                                resolved.push(resolve_match_clause(&plan, scope, &child_defs))
                            }
                            None => resolved.push(clause.clone()),
                        }
                    }
                    resolved
                }
            };
            SExpr::List {
                values: new_values,
                span: *span,
            }
        }
        SExpr::Cons { car, cdr, span } => SExpr::Cons {
            car: Box::new(resolve_form(car, scope, def_occurrences)),
            cdr: Box::new(resolve_form(cdr, scope, def_occurrences)),
            span: *span,
        },
        // Leaves with no name to resolve.
        other => other.clone(),
    }
}

fn resolve_match_clause(
    clause: &crate::classifier::forms::MatchClauseScope<'_>,
    scope: &mut Vec<String>,
    def_occurrences: &[BindingOccurrence<'_>],
) -> SExpr {
    let mark = scope.len();
    scope.extend(
        clause
            .occurrences
            .iter()
            .filter(|occurrence| occurrence.kind.shadows_values())
            .map(|occurrence| occurrence.project().name),
    );

    let mut values = Vec::with_capacity(clause.body.len() + 3);
    values.push(resolve_pattern(clause.pattern_input, &clause.occurrences));
    if let Some((marker, guard)) = clause.guard {
        values.push(marker.clone());
        values.push(resolve_form(guard, scope, def_occurrences));
    }
    values.extend(resolve_seq(clause.body, scope, def_occurrences));
    scope.truncate(mark);
    SExpr::List {
        values,
        span: clause.span,
    }
}

/// Copy native pattern syntax without dispatching it as executable forms.
/// Only atoms captured as actual binders are tagged, by node identity.
fn resolve_pattern(pattern: &SExpr, occurrences: &[BindingOccurrence<'_>]) -> SExpr {
    match pattern {
        atom @ SExpr::Atom { .. } => {
            if occurrences
                .iter()
                .any(|occurrence| std::ptr::eq(occurrence.atom, atom))
            {
                atom.clone().with_name_res(NameRes::BindingDef)
            } else {
                atom.clone()
            }
        }
        SExpr::List { values, span } => SExpr::List {
            values: values
                .iter()
                .map(|value| resolve_pattern(value, occurrences))
                .collect(),
            span: *span,
        },
        SExpr::Cons { car, cdr, span } => SExpr::Cons {
            car: Box::new(resolve_pattern(car, occurrences)),
            cdr: Box::new(resolve_pattern(cdr, occurrences)),
            span: *span,
        },
        other => other.clone(),
    }
}

fn grouped_bind_slots(values: &[SExpr]) -> Option<Vec<BindGroupSlot>> {
    if values.first().and_then(|e| e.as_atom()) != Some("bind") || values.len() < 5 {
        return None;
    }

    let mut slots = Vec::new();
    let mut i = 1;
    while i < values.len() {
        if matches!(values.get(i), Some(SExpr::Keyword { .. })) {
            if i + 2 >= values.len() {
                return None;
            }
            slots.push(BindGroupSlot {
                name_index: i + 1,
                value_index: i + 2,
            });
            i += 3;
        } else {
            if i + 1 >= values.len() {
                return None;
            }
            slots.push(BindGroupSlot {
                name_index: i,
                value_index: i + 1,
            });
            i += 2;
        }
    }

    (slots.len() >= 2).then_some(slots)
}

fn resolve_grouped_bind(
    values: &[SExpr],
    scope: &mut Vec<String>,
    def_occurrences: &[BindingOccurrence<'_>],
    slots: &[BindGroupSlot],
) -> Vec<SExpr> {
    let mut out = Vec::with_capacity(values.len());
    let mark = scope.len();
    let mut next_index = 0;

    for slot in slots {
        while next_index < slot.name_index {
            out.push(resolve_form(&values[next_index], scope, def_occurrences));
            next_index += 1;
        }

        out.push(resolve_form(
            &values[slot.name_index],
            scope,
            def_occurrences,
        ));
        next_index = slot.name_index + 1;

        while next_index < slot.value_index {
            out.push(resolve_form(&values[next_index], scope, def_occurrences));
            next_index += 1;
        }

        out.push(resolve_form(
            &values[slot.value_index],
            scope,
            def_occurrences,
        ));
        next_index = slot.value_index + 1;

        for site in binding_names_in_pattern(&values[slot.name_index], BindingKind::Bind) {
            if site.kind.shadows_values() {
                scope.push(site.name);
            }
        }
    }

    while next_index < values.len() {
        out.push(resolve_form(&values[next_index], scope, def_occurrences));
        next_index += 1;
    }

    scope.truncate(mark);
    out
}

/// Resolve `values[..body_start]` with the current scope, then push `names` and
/// resolve `values[body_start..]` — the body region where the binding is
/// visible. Used for forms with an initializer/iterable/subject that must stay
/// outside the binding's scope.
fn resolve_split_at(
    values: &[SExpr],
    scope: &mut Vec<String>,
    def_occurrences: &[BindingOccurrence<'_>],
    names: Vec<String>,
    body_start: usize,
) -> Vec<SExpr> {
    let split = body_start.min(values.len());
    let mut out = Vec::with_capacity(values.len());
    for child in &values[..split] {
        out.push(resolve_form(child, scope, def_occurrences));
    }
    if split < values.len() {
        let mark = scope.len();
        scope.extend(names);
        out.extend(resolve_seq(&values[split..], scope, def_occurrences));
        scope.truncate(mark);
    }
    out
}

/// Kinds that scope only over the enclosing sibling sequence (never inside their
/// own form's body): the complement of the body-scoped kinds.
fn is_enclosing_only(kind: BindingKind) -> bool {
    matches!(kind, BindingKind::ImportLocal)
}

/// Whether a list head is a declaration whose name is *not* in scope in its own
/// value expression: `bind`, or a kernel declaration escape
/// (`const`/`let`/`var`/`function`/`function*`, bare or `kernel:`-prefixed).
/// Mirrors [`crate::binding`]'s declaration dispatch.
fn is_decl_head(head: Option<&str>) -> bool {
    match head {
        Some("bind") => true,
        Some(h) => matches!(
            h.strip_prefix("kernel:").unwrap_or(h),
            "const" | "let" | "var" | "function" | "function*"
        ),
        None => false,
    }
}

// ── Shadow detection (DD-59 ID-12), a second consumer of the scope model ────

/// Find every binding whose name is already bound in an **enclosing** lexical
/// scope — the ID-12 accidental-shadowing set. Returns the *inner* (shadowing)
/// binding's own site, so a caller (the `shadowing` lint rule) can point at the
/// def that hides the outer name.
///
/// This walks the tree **exactly** as [`resolve`] and the expander's
/// `expand_children_scoped` do, reusing the single scope model — [`scope_plan`],
/// [`hoisted_names`], and [`bindings_introduced`]. It is the "one decider, many
/// consumers" shape the whole arc13 resolution work exists to enforce: a lint
/// consumer must **not** re-derive scoping. The traversal below mirrors
/// `resolve_seq`/`resolve_form`/`resolve_split_at` (collecting shadows instead
/// of tagging atoms); the `resolve_shadow_parity` test pins the two walks to the
/// same scope decisions.
pub fn shadowing_sites(forms: &[SExpr]) -> Vec<BindingSite> {
    let mut scope: Vec<String> = Vec::new();
    let mut out: Vec<BindingSite> = Vec::new();
    shadow_seq(forms, &mut scope, &mut out);
    out
}

/// The sites a form declares into the **enclosing** sibling scope (the
/// site-level companion to [`hoisted_names`] — same filter, kept in lockstep).
fn hoisted_sites(form: &SExpr) -> Vec<BindingSite> {
    bindings_introduced(form)
        .into_iter()
        .filter(|s| s.kind.shadows_values() && declares_in_enclosing(s.kind))
        .collect()
}

/// The **pure body-scoped** binding sites a form introduces (params, loop,
/// pattern, catch, class-method params) — the complement of the enclosing-scope
/// declarations. These enter a *deeper* frame, so any collision with the
/// enclosing scope is a shadow. (The enclosing-scope kinds — `bind`/import
/// locals/`func`|`class` names — are checked at the hoist point instead, so each
/// binding is checked exactly once.)
fn body_shadow_sites(form: &SExpr) -> Vec<BindingSite> {
    bindings_introduced(form)
        .into_iter()
        .filter(|s| {
            s.kind.shadows_values() && !is_enclosing_only(s.kind) && !declares_in_enclosing(s.kind)
        })
        .collect()
}

/// Walk a sibling sequence, mirroring [`resolve_seq`]: resolve each form's
/// subtree, then hoist its enclosing declarations to the following siblings. A
/// hoisted name already present in an **ancestor** frame (`scope[..mark]`, never
/// a preceding sibling in this same sequence) shadows it.
fn shadow_seq(forms: &[SExpr], scope: &mut Vec<String>, out: &mut Vec<BindingSite>) {
    let mark = scope.len();
    for form in forms {
        shadow_form(form, scope, out);
        for site in hoisted_sites(form) {
            if scope[..mark].iter().any(|n| n == &site.name) {
                out.push(site.clone());
            }
            scope.push(site.name);
        }
    }
    scope.truncate(mark);
}

/// Walk one form, mirroring [`resolve_form`]/[`resolve_split_at`]: distribute the
/// form's body-scoped bindings over the child positions where they are visible
/// (via [`scope_plan`]), and flag a body binding whose name is already in the
/// enclosing scope.
fn shadow_form(form: &SExpr, scope: &mut Vec<String>, out: &mut Vec<BindingSite>) {
    match form {
        SExpr::List { values, .. } => match scope_plan(form, scope) {
            ScopePlan::Sequence => shadow_seq(values, scope, out),
            ScopePlan::Body { names, body_start } => {
                let split = body_start.min(values.len());
                // Pre-body children (initializer / iterable / scrutinee): the
                // binding is not yet in scope.
                for child in &values[..split] {
                    shadow_form(child, scope, out);
                }
                if split < values.len() {
                    // The body binding shadows if its name is already bound
                    // anywhere in the enclosing scope (a deeper frame opens).
                    for site in body_shadow_sites(form) {
                        if scope.iter().any(|n| n == &site.name) {
                            out.push(site);
                        }
                    }
                    let mark = scope.len();
                    scope.extend(names);
                    shadow_seq(&values[split..], scope, out);
                    scope.truncate(mark);
                }
            }
            ScopePlan::GroupedBind { slots } => {
                shadow_grouped_bind(values, &slots, scope, out);
            }
            ScopePlan::Conditional => {
                for child in values {
                    shadow_seq(std::slice::from_ref(child), scope, out);
                }
            }
            ScopePlan::Match { subject, clauses } => {
                let Some(subject) = subject else {
                    return;
                };
                shadow_form(subject, scope, out);
                for plan in clauses.into_iter().flatten() {
                    for occurrence in &plan.occurrences {
                        let site = occurrence.project();
                        if scope.iter().any(|name| name == &site.name) {
                            out.push(site);
                        }
                    }
                    let mark = scope.len();
                    scope.extend(
                        plan.occurrences
                            .iter()
                            .filter(|occurrence| occurrence.kind.shadows_values())
                            .map(|occurrence| occurrence.project().name),
                    );
                    if let Some((_, guard)) = plan.guard {
                        shadow_seq(std::slice::from_ref(guard), scope, out);
                    }
                    shadow_seq(plan.body, scope, out);
                    scope.truncate(mark);
                }
            }
        },
        SExpr::Cons { car, cdr, .. } => {
            shadow_form(car, scope, out);
            shadow_form(cdr, scope, out);
        }
        _ => {}
    }
}

fn shadow_grouped_bind(
    values: &[SExpr],
    slots: &[BindGroupSlot],
    scope: &mut Vec<String>,
    out: &mut Vec<BindingSite>,
) {
    let mark = scope.len();
    let mut next_index = 0;

    for slot in slots {
        while next_index < slot.name_index {
            shadow_form(&values[next_index], scope, out);
            next_index += 1;
        }
        shadow_form(&values[slot.name_index], scope, out);
        next_index = slot.name_index + 1;

        while next_index < slot.value_index {
            shadow_form(&values[next_index], scope, out);
            next_index += 1;
        }
        shadow_form(&values[slot.value_index], scope, out);
        next_index = slot.value_index + 1;

        for site in binding_names_in_pattern(&values[slot.name_index], BindingKind::Bind) {
            if site.kind.shadows_values() {
                scope.push(site.name);
            }
        }
    }

    while next_index < values.len() {
        shadow_form(&values[next_index], scope, out);
        next_index += 1;
    }

    scope.truncate(mark);
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::reader::read;
    use crate::reader::source_loc::Span;
    use serde_json::{Value, json};

    fn protocol_forms(value: Value) -> Vec<SExpr> {
        value
            .as_array()
            .expect("typed protocol form array")
            .iter()
            .map(|form| crate::expander::env::protocol_json_to_sexpr(form).expect("typed form"))
            .collect()
    }

    fn protocol_tags(forms: &[SExpr]) -> Vec<(String, NameRes)> {
        let resolved = resolve(forms);
        assert_eq!(
            resolved, forms,
            "resolution preserves protocol structure and spans"
        );
        fn spans_are_default(expr: &SExpr) -> bool {
            match expr {
                SExpr::List { values, .. } => {
                    expr.span() == Span::default() && values.iter().all(spans_are_default)
                }
                SExpr::Cons { car, cdr, .. } => {
                    expr.span() == Span::default()
                        && spans_are_default(car)
                        && spans_are_default(cdr)
                }
                _ => expr.span() == Span::default(),
            }
        }
        assert!(forms.iter().all(spans_are_default));
        let mut out = Vec::new();
        for form in &resolved {
            collect(form, &mut out);
        }
        out
    }

    /// Resolve source and return `(name, NameRes)` for every atom, in a
    /// pre-order walk — so a test can assert the tag at each occurrence.
    fn tags(src: &str) -> Vec<(String, NameRes)> {
        let forms = read(src).expect("parse");
        let resolved = resolve(&forms);
        let mut out = Vec::new();
        for f in &resolved {
            collect(f, &mut out);
        }
        out
    }

    fn collect(e: &SExpr, out: &mut Vec<(String, NameRes)>) {
        match e {
            a @ SExpr::Atom { .. } => out.push((a.as_atom().unwrap().to_string(), a.name_res())),
            SExpr::List { values, .. } => {
                for v in values {
                    collect(v, out);
                }
            }
            SExpr::Cons { car, cdr, .. } => {
                collect(car, out);
                collect(cdr, out);
            }
            _ => {}
        }
    }

    /// The tag of the first atom named `name`.
    fn first(src: &str, name: &str) -> Option<NameRes> {
        tags(src)
            .into_iter()
            .find(|(n, _)| n == name)
            .map(|(_, r)| r)
    }

    /// The tag of the head atom of the last top-level list (the reference site
    /// in the sibling matrix shapes: `… (name 987)` as a top-level form).
    fn last_head(src: &str) -> (String, NameRes) {
        let forms = read(src).expect("parse");
        let resolved = resolve(&forms);
        let last = resolved.last().expect("a form");
        match last {
            SExpr::List { values, .. } => match &values[0] {
                a @ SExpr::Atom { .. } => (a.as_atom().unwrap().to_string(), a.name_res()),
                _ => panic!("head not an atom"),
            },
            _ => panic!("last form not a list"),
        }
    }

    /// The [`NameRes`] on the head atom of the distinctive matrix reference
    /// shape `(name 987)` — the `987` disambiguates the body reference from any
    /// same-named literal (e.g. the loop iterable `#a(1)` == `(array 1)`).
    fn call_head_tag(src: &str, name: &str) -> Option<NameRes> {
        fn find(e: &SExpr, name: &str) -> Option<NameRes> {
            if let SExpr::List { values, .. } = e {
                if let (Some(a @ SExpr::Atom { .. }), Some(SExpr::Number { value: 987.0, .. })) =
                    (values.first(), values.get(1))
                    && a.as_atom() == Some(name)
                {
                    return Some(a.name_res());
                }
                for v in values {
                    if let Some(r) = find(v, name) {
                        return Some(r);
                    }
                }
            }
            None
        }
        let forms = read(src).expect("parse");
        let resolved = resolve(&forms);
        resolved.iter().find_map(|f| find(f, name))
    }

    // ── Definition-site tags, per binding kind ──────────────────────────────

    #[test]
    fn bind_name_is_def_site() {
        // (bind x 1) — x is a definition, never dispatches.
        assert_eq!(first("(bind x 1)", "x"), Some(NameRes::BindingDef));
    }

    #[test]
    fn func_param_is_def_site() {
        // atoms (keywords skipped): func, f(def), a(param decl), a(body ref).
        let t = tags("(func f :args (:any a) :body a)");
        assert_eq!(t[1], ("f".into(), NameRes::BindingDef)); // func name
        assert_eq!(t[2], ("a".into(), NameRes::BindingDef)); // param declaration
        assert_eq!(t[3], ("a".into(), NameRes::BindingRef)); // body reference
    }

    #[test]
    fn loop_binding_is_def_site() {
        assert_eq!(first("(for-of x #a(1) x)", "x"), Some(NameRes::BindingDef));
    }

    #[test]
    fn catch_binding_is_def_site() {
        assert_eq!(
            first("(try (f) (catch e e))", "e"),
            Some(NameRes::BindingDef)
        );
    }

    #[test]
    fn pattern_binding_is_def_site() {
        assert_eq!(first("(if-let (x 1) x)", "x"), Some(NameRes::BindingDef));
    }

    // ── Reference-site tags: a bound head resolves to the binding ────────────

    #[test]
    fn func_param_reference_is_bindingref() {
        // param `array` shadows the kernel `array` form in the body.
        assert_eq!(
            call_head_tag("(func probe :args (:any array) :body (array 987))", "array"),
            Some(NameRes::BindingRef)
        );
    }

    #[test]
    fn bind_reference_in_following_sibling() {
        // (bind array 0) then (array 987) — the sibling reference is a ref.
        let (name, res) = last_head("(bind array 0)\n(array 987)");
        assert_eq!(name, "array");
        assert_eq!(res, NameRes::BindingRef);
    }

    #[test]
    fn conditional_arm_declarations_do_not_shadow_other_arms_or_following_forms() {
        let source = "(if true (bind pick 1) (pick 987))\n(pick 987)";
        assert_eq!(call_head_tag(source, "pick"), Some(NameRes::Unresolved));
        let (name, following_tag) = last_head(source);
        assert_eq!(
            (name.as_str(), following_tag),
            ("pick", NameRes::Unresolved)
        );
    }

    #[test]
    fn conditional_scope_plan_accepts_kernel_escape_and_bypasses_bound_heads() {
        let ordinary = read("(if true 1 2)").expect("parse ordinary conditional");
        assert!(matches!(
            scope_plan(&ordinary[0], &[]),
            ScopePlan::Conditional
        ));

        let kernel = read("(kernel:if true 1 2)").expect("parse kernel conditional");
        assert!(matches!(
            scope_plan(&kernel[0], &[]),
            ScopePlan::Conditional
        ));
        assert!(matches!(
            scope_plan(&kernel[0], &["if".to_string()]),
            ScopePlan::Conditional
        ));
        assert!(matches!(
            scope_plan(&kernel[0], &["kernel:if".to_string()]),
            ScopePlan::Sequence
        ));

        let mut bound = read("(if true 1 2)").expect("parse bound call");
        let SExpr::List { values, .. } = &mut bound[0] else {
            panic!("conditional is a list")
        };
        values[0] = values[0].clone().with_name_res(NameRes::BindingRef);
        assert!(matches!(scope_plan(&bound[0], &[]), ScopePlan::Sequence));
        let mut bound_kernel = kernel.clone();
        let SExpr::List { values, .. } = &mut bound_kernel[0] else {
            panic!("kernel conditional is a list")
        };
        values[0] = values[0].clone().with_name_res(NameRes::BindingRef);
        assert!(matches!(
            scope_plan(&bound_kernel[0], &[]),
            ScopePlan::Sequence
        ));
        assert!(matches!(
            scope_plan(&ordinary[0], &["if".to_string()]),
            ScopePlan::Sequence
        ));
    }

    #[test]
    fn kernel_function_parameters_are_inner_and_named_function_alone_hoists() {
        let source = "(bind fn-local (function fn-local (bind) (bind 987))) (bind after 0)";
        let forms = read(source).expect("parse kernel function expression");
        let SExpr::List { values, .. } = &forms[0] else {
            panic!("outer binding is a list")
        };
        let function = values.get(2).expect("function initializer");
        let plan = scope_plan(function, &[]);
        assert!(matches!(plan, ScopePlan::Body { body_start: 0, .. }));
        assert_eq!(hoisted_names(function), vec!["fn-local"]);
        let resolved = resolve(&forms);
        let rendered = resolved
            .iter()
            .map(ToString::to_string)
            .collect::<Vec<_>>()
            .join("\n");
        assert_eq!(call_head_tag(&rendered, "bind"), Some(NameRes::BindingRef));
    }

    #[test]
    fn kernel_lambda_parameters_are_inner_scope() {
        let forms =
            read("(bind f (kernel:lambda (bind) (bind 987)))").expect("parse kernel lambda");
        let resolved = resolve(&forms);
        let rendered = resolved
            .iter()
            .map(ToString::to_string)
            .collect::<Vec<_>>()
            .join("\n");
        assert_eq!(call_head_tag(&rendered, "bind"), Some(NameRes::BindingRef));
    }

    #[test]
    fn match_scope_separates_subject_guard_body_and_siblings() {
        let source =
            "(match (match 1 (_ 2)) (match :when (match 3) (match 4)) (_ (match 5 (_ 6))))";
        let forms = read(source).expect("parse match scopes");
        let resolved = resolve(&forms);
        assert_eq!(resolved, forms, "resolution preserves syntax and spans");

        let SExpr::List { values, .. } = &resolved[0] else {
            panic!("outer match is a list")
        };
        let SExpr::List {
            values: subject, ..
        } = &values[1]
        else {
            panic!("subject match is a list")
        };
        assert_eq!(subject[0].name_res(), NameRes::Unresolved);

        let SExpr::List {
            values: first_clause,
            ..
        } = &values[2]
        else {
            panic!("first clause is a list")
        };
        assert_eq!(first_clause[0].name_res(), NameRes::BindingDef);
        let SExpr::List { values: guard, .. } = &first_clause[2] else {
            panic!("guard match is a list")
        };
        assert_eq!(guard[0].name_res(), NameRes::BindingRef);
        let SExpr::List { values: body, .. } = &first_clause[3] else {
            panic!("body match is a list")
        };
        assert_eq!(body[0].name_res(), NameRes::BindingRef);

        let SExpr::List {
            values: second_clause,
            ..
        } = &values[3]
        else {
            panic!("second clause is a list")
        };
        let SExpr::List {
            values: sibling, ..
        } = &second_clause[1]
        else {
            panic!("sibling match is a list")
        };
        assert_eq!(sibling[0].name_res(), NameRes::Unresolved);
    }

    #[test]
    fn bound_match_has_no_pattern_definition_sites() {
        let forms = read("(bind match f) (match 0 (phantom 7) (ordinary 8))")
            .expect("parse bound match call");
        let resolved = resolve(&forms);
        let SExpr::List { values, .. } = &resolved[1] else {
            panic!("bound match call is a list")
        };
        assert_eq!(values[0].name_res(), NameRes::BindingRef);
        for clause in &values[2..] {
            let SExpr::List { values, .. } = clause else {
                panic!("clause-shaped call argument is a list")
            };
            assert_eq!(values[0].name_res(), NameRes::Unresolved);
        }

        let mut tagged =
            read("(match 0 (phantom 7) (ordinary 8))").expect("parse explicitly tagged call");
        let SExpr::List { values, .. } = &mut tagged[0] else {
            panic!("tagged match call is a list")
        };
        values[0] = values[0].clone().with_name_res(NameRes::BindingRef);
        let resolved = resolve(&tagged);
        let SExpr::List { values, .. } = &resolved[0] else {
            panic!("tagged match call remains a list")
        };
        assert_eq!(values[0].name_res(), NameRes::BindingRef);
        for clause in &values[2..] {
            let SExpr::List { values, .. } = clause else {
                panic!("clause-shaped call argument is a list")
            };
            assert_eq!(values[0].name_res(), NameRes::Unresolved);
        }
    }

    #[test]
    fn match_shadowing_is_clause_local() {
        let source = "(match 0 (slot :when false (bind slot 1) slot) (_ (bind slot 2) slot))";
        let forms = read(source).expect("parse match shadowing");
        let SExpr::List {
            values: match_values,
            ..
        } = &forms[0]
        else {
            panic!("match is a list")
        };
        let SExpr::List {
            values: clause_values,
            ..
        } = &match_values[2]
        else {
            panic!("first clause is a list")
        };
        let SExpr::List {
            values: declaration_values,
            ..
        } = &clause_values[3]
        else {
            panic!("first clause declaration is a list")
        };
        let expected_span = declaration_values[1].span();
        let shadows = shadowing_sites(&forms);
        assert_eq!(shadows.len(), 1);
        assert_eq!(shadows[0].name, "slot");
        assert_eq!(shadows[0].kind, BindingKind::Bind);
        assert_eq!(shadows[0].span, expected_span);
    }

    #[test]
    fn same_span_bind_name_does_not_capture_initializer_form_head() {
        let forms = protocol_forms(json!([
            {"type":"list","values":[
                {"type":"atom","value":"bind"},
                {"type":"atom","value":"match"},
                {"type":"list","values":[
                    {"type":"atom","value":"match"},
                    {"type":"number","value":1},
                    {"type":"list","values":[
                        {"type":"atom","value":"_"},
                        {"type":"number","value":3}
                    ]}
                ]}
            ]},
            {"type":"list","values":[
                {"type":"atom","value":"match"},
                {"type":"number","value":7}
            ]}
        ]));

        assert_eq!(
            protocol_tags(&forms),
            vec![
                ("bind".into(), NameRes::Unresolved),
                ("match".into(), NameRes::BindingDef),
                ("match".into(), NameRes::Unresolved),
                ("_".into(), NameRes::Unresolved),
                ("match".into(), NameRes::BindingRef),
            ]
        );
    }

    #[test]
    fn same_span_last_typed_args_atom_is_the_param_occurrence() {
        let forms = protocol_forms(json!([
            {"type":"list","values":[
                {"type":"atom","value":"func"},
                {"type":"atom","value":"run"},
                {"type":"keyword","value":"args"},
                {"type":"list","values":[
                    {"type":"keyword","value":"any"},
                    {"type":"atom","value":"ignored"}
                ]},
                {"type":"keyword","value":"args"},
                {"type":"list","values":[
                    {"type":"keyword","value":"any"},
                    {"type":"atom","value":"match"}
                ]},
                {"type":"keyword","value":"body"},
                {"type":"list","values":[
                    {"type":"atom","value":"match"},
                    {"type":"number","value":9}
                ]}
            ]}
        ]));

        assert_eq!(
            bindings_introduced(&forms[0]),
            vec![
                BindingSite {
                    name: "run".into(),
                    kind: BindingKind::Bind,
                    span: Span::default(),
                },
                BindingSite {
                    name: "match".into(),
                    kind: BindingKind::Param,
                    span: Span::default(),
                },
            ]
        );
        assert_eq!(
            protocol_tags(&forms),
            vec![
                ("func".into(), NameRes::Unresolved),
                ("run".into(), NameRes::BindingDef),
                ("ignored".into(), NameRes::Unresolved),
                ("match".into(), NameRes::BindingDef),
                ("match".into(), NameRes::BindingRef),
            ]
        );

        let failed = protocol_forms(json!([{"type":"list","values":[
            {"type":"atom","value":"func"},
            {"type":"atom","value":"broken"},
            {"type":"keyword","value":"args"},
            {"type":"list","values":[
                {"type":"keyword","value":"any"},
                {"type":"atom","value":"rejected"}
            ]}
        ]}]));
        assert!(bindings_introduced(&failed[0]).is_empty());
    }

    #[test]
    fn loop_body_reference_is_bindingref() {
        assert_eq!(
            call_head_tag("(for-of array #a(1) (array 987))", "array"),
            Some(NameRes::BindingRef)
        );
    }

    #[test]
    fn class_method_param_reference_is_bindingref() {
        assert_eq!(
            call_head_tag("(class Probe () (m (array) (array 987)))", "array"),
            Some(NameRes::BindingRef)
        );
    }

    // ── The initializer/iterable must stay OUTSIDE the binding's scope ──────

    #[test]
    fn loop_iterable_is_not_in_scope() {
        // `#a(1)` == `(array 1)`; its head `array` must NOT be shadowed by the
        // loop binding `array` (the iterable is evaluated before the binding).
        let forms = read("(for-of array #a(1) (array 987))").expect("parse");
        let resolved = resolve(&forms);
        // Walk to the iterable list (child index 2 of the for-of).
        let SExpr::List { values, .. } = &resolved[0] else {
            panic!()
        };
        let SExpr::List {
            values: iter_vals, ..
        } = &values[2]
        else {
            panic!("iterable is a list")
        };
        // iterable head `array` stays Unresolved → still the array literal form.
        assert_eq!(iter_vals[0].name_res(), NameRes::Unresolved);
    }

    #[test]
    fn bind_value_is_not_in_scope() {
        // (bind array #a(1)) — the value `#a(1)` head must stay the array form.
        let forms = read("(bind array #a(1))").expect("parse");
        let resolved = resolve(&forms);
        let SExpr::List { values, .. } = &resolved[0] else {
            panic!()
        };
        let SExpr::List {
            values: val_vals, ..
        } = &values[2]
        else {
            panic!("value is a list")
        };
        assert_eq!(val_vals[0].name_res(), NameRes::Unresolved);
    }

    #[test]
    fn grouped_bind_values_are_sequential() {
        assert_eq!(
            call_head_tag("(bind a 1 b (a 987))", "a"),
            Some(NameRes::BindingRef)
        );
        assert_eq!(
            call_head_tag("(bind a (a 987) b 2)", "a"),
            Some(NameRes::Unresolved)
        );
        let (name, res) = last_head("(bind a 1 b a)\n(b 987)");
        assert_eq!(name, "b");
        assert_eq!(res, NameRes::BindingRef);
    }

    // ── Scope exit / nesting / labels ───────────────────────────────────────

    #[test]
    fn shadow_ends_at_scope_exit() {
        // `array` bound in the fn body; the following top-level sibling is out
        // of scope → its head stays Unresolved (the array form fires there).
        let (_n, res) = last_head("(fn (:any array) (array 1))\n(array 987)");
        assert_eq!(res, NameRes::Unresolved);
    }

    #[test]
    fn nested_scopes_reference_is_bindingref() {
        // inner fn param `a` referenced in its own body — a ref.
        assert_eq!(
            call_head_tag("(fn (:any a) (a 987))", "a"),
            Some(NameRes::BindingRef)
        );
    }

    #[test]
    fn label_does_not_shadow_values() {
        // (label a (block (a 1))) — a label does not enter the value env, so a
        // head `a` in its body is NOT a binding reference.
        let t = tags("(label a (block (a 1)))");
        // the label name `a` is a def-site (D2 namespace); the `(a 1)` head is
        // NOT a ref (labels don't shadow values).
        let refs: Vec<_> = t
            .iter()
            .filter(|(n, r)| n == "a" && *r == NameRes::BindingRef)
            .collect();
        assert!(refs.is_empty(), "label must not create a value-ref: {t:?}");
    }

    #[test]
    fn unbound_name_stays_unresolved() {
        assert_eq!(first("(array 1 2)", "array"), Some(NameRes::Unresolved));
    }

    // ── Shadow detection (ID-12) ────────────────────────────────────────────

    /// The names flagged as shadowing an enclosing binding, in source order.
    fn shadows(src: &str) -> Vec<String> {
        let forms = read(src).expect("parse");
        shadowing_sites(&forms)
            .into_iter()
            .map(|s| s.name)
            .collect()
    }

    #[test]
    fn id12_inner_bind_shadows_outer() {
        // The guide's canonical ID-12: a `bind` in an inner block shadows the
        // outer `bind` of the same name.
        let src = "(bind result 1)\n(if c (block (bind result 2) (log result)))";
        assert_eq!(shadows(src), vec!["result"]);
    }

    #[test]
    fn nested_param_shadows_outer_param() {
        // inner fn param `x` inside an outer fn param `x`.
        let src = "(func f :args (:any x) :body (func g :args (:any x) :body x))";
        assert_eq!(shadows(src), vec!["x"]);
    }

    #[test]
    fn param_shadows_enclosing_bind() {
        // a param `x` inside a function shadows the module-level `bind x`.
        let src = "(bind x 1)\n(func f :args (:any x) :body x)";
        assert_eq!(shadows(src), vec!["x"]);
    }

    #[test]
    fn form_shadowing_is_not_a_shadow() {
        // a param named after a built-in form (`array`) is DD-60 D1 legal
        // shadowing — the form is not an enclosing *binding*, so no warning.
        assert!(shadows("(func f :args (:any array) :body (array 1))").is_empty());
    }

    #[test]
    fn distinct_sibling_binds_are_not_shadows() {
        assert!(shadows("(bind x 1)\n(bind y 2)").is_empty());
    }

    #[test]
    fn sibling_rebind_is_not_enclosing_shadow() {
        // `(bind x 1)(bind x 2)` is same-scope redeclaration (a compile error in
        // its own right), not the ID-12 inner-hides-outer shape — no shadow.
        assert!(shadows("(bind x 1)\n(bind x 2)").is_empty());
    }

    #[test]
    fn loop_binding_shadows_outer() {
        let src = "(bind i 0)\n(for-of i #a(1 2) (log i))";
        assert_eq!(shadows(src), vec!["i"]);
    }

    #[test]
    fn iterable_outside_scope_is_not_shadowed_by_its_own_binding() {
        // the loop binding `x` is not in scope over the iterable, so a same-named
        // form in the iterable is not a shadow of the binding.
        assert!(shadows("(for-of x #a(1) (log x))").is_empty());
    }

    #[test]
    fn shadow_detection_ends_at_scope_exit() {
        // `x` bound in the fn body; a sibling `bind x` afterwards is a new
        // top-level binding, not a shadow (the fn's `x` is out of scope).
        assert!(shadows("(fn (:any x) x)\n(bind x 1)").is_empty());
    }

    #[test]
    fn resolve_shadow_parity() {
        // The two walks share one scope model: every span `shadowing_sites`
        // reports must be a definition site `resolve` independently tags
        // `BindingDef` (a shadow is always a real binding, never a stray span).
        for src in [
            "(bind result 1)\n(if c (block (bind result 2) (log result)))",
            "(func f :args (:any x) :body (func g :args (:any x) :body x))",
            "(bind x 1)\n(func f :args (:any x) :body x)",
            "(bind i 0)\n(for-of i #a(1 2) (log i))",
            "(func f :args (:any array) :body (array 1))", // no shadow at all
        ] {
            let forms = read(src).expect("parse");
            let resolved = resolve(&forms);
            let mut def_spans = Vec::new();
            for f in &resolved {
                collect_def_spans(f, &mut def_spans);
            }
            for site in shadowing_sites(&forms) {
                assert!(
                    def_spans.contains(&site.span),
                    "shadow site {:?} in {src:?} is not a BindingDef span per resolve()",
                    site.name
                );
            }
        }
    }

    /// Spans of every atom `resolve` tagged [`NameRes::BindingDef`].
    fn collect_def_spans(e: &SExpr, out: &mut Vec<Span>) {
        match e {
            a @ SExpr::Atom { .. } if a.name_res() == NameRes::BindingDef => out.push(a.span()),
            SExpr::List { values, .. } => {
                for v in values {
                    collect_def_spans(v, out);
                }
            }
            SExpr::Cons { car, cdr, .. } => {
                collect_def_spans(car, out);
                collect_def_spans(cdr, out);
            }
            _ => {}
        }
    }
}
