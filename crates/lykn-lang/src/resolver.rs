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
use crate::binding::{BindingKind, BindingSite, bindings_introduced};
use crate::reader::source_loc::Span;

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
pub(crate) enum ScopePlan {
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
}

/// Compute a form's [`ScopePlan`]. Non-list or non-binding forms → `Sequence`.
pub(crate) fn scope_plan(form: &SExpr) -> ScopePlan {
    let SExpr::List { values, .. } = form else {
        return ScopePlan::Sequence;
    };
    let head = values.first().and_then(|e| e.as_atom());
    let body_names: Vec<String> = bindings_introduced(form)
        .into_iter()
        .filter(|s| s.kind.shadows_values() && !is_enclosing_only(s.kind))
        .map(|s| s.name)
        .collect();
    match head {
        // Iterable / scrutinee stays outside the binding's scope.
        Some("for-of" | "for-in" | "for-await-of") => ScopePlan::Body {
            names: body_names,
            body_start: 3,
        },
        Some("if-let" | "when-let" | "match") => ScopePlan::Body {
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
/// on exit (shadow ends at scope exit). `def_spans` carries the binder
/// definition-site spans inherited from enclosing forms.
fn resolve_seq(forms: &[SExpr], scope: &mut Vec<String>, def_spans: &[Span]) -> Vec<SExpr> {
    let mark = scope.len();
    let mut out = Vec::with_capacity(forms.len());
    for form in forms {
        out.push(resolve_form(form, scope, def_spans));
        // Hoist this form's enclosing-scope declarations to the following
        // siblings (function names, `bind`s, `import` locals, …).
        scope.extend(hoisted_names(form));
    }
    scope.truncate(mark);
    out
}

/// Resolve one form. Atoms are tagged from `def_spans`/`scope`; lists dispatch
/// on their (raw) head to place each introduced binding in scope over exactly
/// the child positions where it is lexically visible — never over an
/// initializer / iterable / match-subject / `if-let` expression, which are
/// evaluated *outside* the binding's scope.
fn resolve_form(form: &SExpr, scope: &mut Vec<String>, def_spans: &[Span]) -> SExpr {
    match form {
        SExpr::Atom { .. } => {
            let (value, span) = form.atom_parts().unwrap();
            let res = if def_spans.contains(&span) {
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
            // This form's own binder definition-site spans, accumulated so deep
            // param/pattern atoms (nested inside arg lists) are still recognised
            // as def-sites within this subtree.
            let sites = bindings_introduced(form);
            let mut child_defs: Vec<Span> = def_spans.to_vec();
            child_defs.extend(sites.iter().map(|s| s.span));

            let new_values = match scope_plan(form) {
                ScopePlan::Sequence => resolve_seq(values, scope, &child_defs),
                ScopePlan::Body { names, body_start } => {
                    resolve_split_at(values, scope, &child_defs, names, body_start)
                }
            };
            SExpr::List {
                values: new_values,
                span: *span,
            }
        }
        SExpr::Cons { car, cdr, span } => SExpr::Cons {
            car: Box::new(resolve_form(car, scope, def_spans)),
            cdr: Box::new(resolve_form(cdr, scope, def_spans)),
            span: *span,
        },
        // Leaves with no name to resolve.
        other => other.clone(),
    }
}

/// Resolve `values[..body_start]` with the current scope, then push `names` and
/// resolve `values[body_start..]` — the body region where the binding is
/// visible. Used for forms with an initializer/iterable/subject that must stay
/// outside the binding's scope.
fn resolve_split_at(
    values: &[SExpr],
    scope: &mut Vec<String>,
    def_spans: &[Span],
    names: Vec<String>,
    body_start: usize,
) -> Vec<SExpr> {
    let split = body_start.min(values.len());
    let mut out = Vec::with_capacity(values.len());
    for child in &values[..split] {
        out.push(resolve_form(child, scope, def_spans));
    }
    if split < values.len() {
        let mark = scope.len();
        scope.extend(names);
        out.extend(resolve_seq(&values[split..], scope, def_spans));
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
        SExpr::List { values, .. } => match scope_plan(form) {
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
        },
        SExpr::Cons { car, cdr, .. } => {
            shadow_form(car, scope, out);
            shadow_form(cdr, scope, out);
        }
        _ => {}
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::reader::read;

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
