//! Versioned, whole-unit checks for writes to protected host intrinsics.
//!
//! This is deliberately a proof over the source/kernel forms Lykn owns. It is
//! not a JavaScript resolver: anything that cannot be proved to be the real
//! global is left alone.

use std::collections::HashSet;

use crate::ast::sexpr::SExpr;
use crate::ast::surface::{Pattern, SurfaceForm};
use crate::binding::{binding_names_in_pattern, bindings_introduced, BindingKind};
use crate::diagnostics::{Diagnostic, Severity};
use crate::codegen::names::to_js_identifier;
use crate::reader::source_loc::Span;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum InputDialect {
    Surface,
    Kernel,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum IntrinsicId {
    ReflectApply,
}

impl IntrinsicId {
    fn slot(self) -> &'static str {
        match self {
            Self::ReflectApply => "Reflect.apply",
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum RootProof {
    GlobalKnown(Vec<String>),
    Local,
    Unknown,
}

#[derive(Debug, Clone)]
struct WriteSite {
    proof: RootProof,
    span: Span,
}

/// Validate writes in the original complete unit. A later write to the real
/// `globalThis` disables alias-based proofs throughout the unit, as the
/// language does not attempt flow-sensitive alias analysis.
pub(crate) fn validate_program(forms: &[SExpr], dialect: InputDialect) -> Vec<Diagnostic> {
    let names = direct_scope_names(forms);
    let mut walker = Walker {
        scopes: vec![names],
        sites: Vec::new(),
        invalidates_aliases: false,
    };
    for form in forms {
        walker.visit(form, dialect);
    }
    walker
        .sites
        .into_iter()
        .filter_map(|site| {
            let RootProof::GlobalKnown(path) = site.proof else {
                return None;
            };
            if path == ["Reflect", "apply"]
                || (path == ["globalThis", "Reflect", "apply"]
                    && !walker.invalidates_aliases)
                || path == ["Reflect"]
                || (path == ["globalThis", "Reflect"] && !walker.invalidates_aliases)
            {
                let slot = if path.ends_with(&["apply".to_owned()]) {
                    IntrinsicId::ReflectApply.slot()
                } else {
                    "Reflect"
                };
                Some(Diagnostic {
                    severity: Severity::Error,
                    message: format!("host-contract v1: write to protected slot {slot}"),
                    span: site.span,
                    suggestion: None,
                })
            } else {
                None
            }
        })
        .collect()
}

fn direct_scope_names(forms: &[SExpr]) -> HashSet<String> {
    let mut names = HashSet::new();
    for form in forms {
        for binding in bindings_introduced(form) {
            if matches!(binding.kind, BindingKind::Bind | BindingKind::ImportLocal) {
                names.insert(to_js_identifier(&binding.name));
            }
        }
    }
    names
}

struct Walker {
    scopes: Vec<HashSet<String>>,
    sites: Vec<WriteSite>,
    invalidates_aliases: bool,
}

impl Walker {
    fn is_local(&self, name: &str) -> bool {
        let name = to_js_identifier(name);
        self.scopes.iter().rev().any(|scope| scope.contains(&name))
    }

    fn path(&self, expr: &SExpr) -> RootProof {
        if let Some((atom, _)) = expr.atom_parts() {
            let parts: Vec<String> = atom.split(':').map(to_js_identifier).collect();
            if parts.is_empty() {
                return RootProof::Unknown;
            }
            if self.is_local(&parts[0]) {
                return RootProof::Local;
            }
            return if matches!(parts[0].as_str(), "Reflect" | "globalThis") {
                RootProof::GlobalKnown(parts)
            } else {
                RootProof::Unknown
            };
        }
        let Some(values) = expr.as_list() else {
            return RootProof::Unknown;
        };
        if values.first().and_then(SExpr::as_form_head) == Some("get") && values.len() == 3 {
            let RootProof::GlobalKnown(mut path) = self.path(&values[1]) else {
                return self.path(&values[1]);
            };
            let Some(key) = (match &values[2] {
                SExpr::String { value, .. } => Some(value.clone()),
                _ => None,
            }) else {
                return RootProof::Unknown;
            };
            path.push(key);
            return RootProof::GlobalKnown(path);
        }
        RootProof::Unknown
    }

    fn record_write(&mut self, target: &SExpr) {
        let proof = self.path(target);
        if let RootProof::GlobalKnown(path) = &proof {
            if path.is_empty()
                || path == &["globalThis".to_owned()]
                || path == &["globalThis".to_owned(), "globalThis".to_owned()]
            {
                self.invalidates_aliases = true;
            }
        }
        let span = target.span();
        self.sites.push(WriteSite { proof, span });
    }

    fn record_symbol_write(&mut self, receiver: &SExpr, key: &SExpr) {
        let proof = match self.path(receiver) {
            RootProof::GlobalKnown(mut path) => match key {
                SExpr::String { value, .. } => {
                    path.push(value.clone());
                    RootProof::GlobalKnown(path)
                }
                _ => RootProof::Unknown,
            },
            other => other,
        };
        if let RootProof::GlobalKnown(path) = &proof {
            if path == &["globalThis".to_owned()]
                || path == &["globalThis".to_owned(), "globalThis".to_owned()]
            {
                self.invalidates_aliases = true;
            }
        }
        self.sites.push(WriteSite { proof, span: receiver.span() });
    }

    fn record_pattern_writes(&mut self, target: &SExpr, dialect: InputDialect) {
        if let Some(values) = target.as_list() {
            match values.first().and_then(SExpr::as_form_head) {
                Some("array") => {
                    for child in values.iter().skip(1) { self.record_pattern_writes(child, dialect); }
                    return;
                }
                Some("object") => {
                    for child in values.iter().skip(1) {
                        if let Some(pair) = child.as_list() {
                            if pair.first().and_then(SExpr::as_form_head) == Some("alias") {
                                if let Some(pattern) = pair.get(2) { self.record_pattern_writes(pattern, dialect); }
                            } else if pair.first().and_then(SExpr::as_form_head) == Some("default") {
                                self.record_pattern_writes(child, dialect);
                            } else {
                                for pattern in pair.iter().skip(1) { self.record_pattern_writes(pattern, dialect); }
                            }
                        } else {
                            self.record_pattern_writes(child, dialect);
                        }
                    }
                    return;
                }
                Some("rest") => {
                    if let Some(child) = values.get(1) { self.record_pattern_writes(child, dialect); }
                    return;
                }
                Some("default") => {
                    if let Some(child) = values.get(1) { self.record_pattern_writes(child, dialect); }
                    if let Some(default) = values.get(2) { self.visit(default, dialect); }
                    return;
                }
                _ => {}
            }
        }
        self.record_write(target);
    }

    fn visit(&mut self, expr: &SExpr, dialect: InputDialect) {
        let Some(values) = expr.as_list() else { return };
        let Some(head) = values.first().and_then(SExpr::as_form_head) else {
            for child in values { self.visit(child, dialect); }
            return;
        };
        let args = &values[1..];
        if matches!(head, "quote" | "quasiquote" | "syntax-quote") { return; }
        if matches!(head, "fn" | "lambda" | "genfn") {
            let names: HashSet<String> = args.first().map(|params| {
                params.as_list().unwrap_or(&[]).iter()
                    .flat_map(|pattern| binding_names_in_pattern(pattern, BindingKind::Param))
                    .map(|binding| to_js_identifier(&binding.name)).collect()
            }).unwrap_or_default();
            self.scopes.push(names);
            if let Some(params) = args.first() { self.visit(params, dialect); }
            for arg in args.iter().skip(1) { self.visit(arg, dialect); }
            self.scopes.pop();
            return;
        }
        if head == "function" {
            let mut names = HashSet::new();
            if let Some(name) = args.first().and_then(SExpr::as_atom) { names.insert(to_js_identifier(name)); }
            if let Some(params) = args.get(1).and_then(SExpr::as_list) {
                for pattern in params { names.extend(binding_names_in_pattern(pattern, BindingKind::Param).into_iter().map(|b| to_js_identifier(&b.name))); }
            }
            self.scopes.push(names);
            if let Some(params) = args.get(1) { self.visit(params, dialect); }
            for arg in args.iter().skip(2) { self.visit(arg, dialect); }
            self.scopes.pop();
            return;
        }
        if head == "class" {
            let mut class_scope = HashSet::new();
            if let Some(name) = args.first().and_then(SExpr::as_atom) { class_scope.insert(to_js_identifier(name)); }
            self.scopes.push(class_scope);
            for member in args.iter().skip(2) {
                let Some(parts) = member.as_list() else { self.visit(member, dialect); continue };
                let mut method_scope = HashSet::new();
                if let Some(params) = parts.get(1).and_then(SExpr::as_list) {
                    for pattern in params { method_scope.extend(binding_names_in_pattern(pattern, BindingKind::ClassMethodParam).into_iter().map(|b| to_js_identifier(&b.name))); }
                }
                self.scopes.push(method_scope);
                if let Some(params) = parts.get(1) { self.visit(params, dialect); }
                for body in parts.iter().skip(2) { self.visit(body, dialect); }
                self.scopes.pop();
            }
            self.scopes.pop();
            return;
        }
        if matches!(head, "for-of" | "for-in" | "for-await-of") {
            if let Some(iterable) = args.get(1) { self.visit(iterable, dialect); }
            let names: HashSet<String> = bindings_introduced(expr)
                .into_iter().map(|b| to_js_identifier(&b.name)).collect();
            self.scopes.push(names);
            for arg in args.iter().skip(2) { self.visit(arg, dialect); }
            self.scopes.pop();
            return;
        }
        if head == "catch" {
            let names: HashSet<String> = bindings_introduced(expr)
                .into_iter().map(|b| to_js_identifier(&b.name)).collect();
            self.scopes.push(names);
            for arg in args.iter().skip(1) { self.visit(arg, dialect); }
            self.scopes.pop();
            return;
        }
        if matches!(head, "if-let" | "when-let") {
            if let Ok(surface) = crate::classifier::classify_expr(expr) {
                match surface {
                    SurfaceForm::IfLet { pattern, expr: value, then_body, else_body, .. } => {
                        self.visit(&value, dialect);
                        self.with_pattern_scope(&pattern, dialect, |walker| {
                            walker.visit(&then_body, dialect);
                            if let Some(other) = else_body { walker.visit(&other, dialect); }
                        });
                        return;
                    }
                    SurfaceForm::WhenLet { pattern, expr: value, body, .. } => {
                        self.visit(&value, dialect);
                        self.with_pattern_scope(&pattern, dialect, |walker| {
                            for form in &body { walker.visit(form, dialect); }
                        });
                        return;
                    }
                    _ => {}
                }
            }
        }
        if head == "match" {
            if let Ok(SurfaceForm::Match { target, clauses, .. }) = crate::classifier::classify_expr(expr) {
                self.visit(&target, dialect);
                for clause in clauses {
                    self.with_pattern_scope(&clause.pattern, dialect, |walker| {
                        if let Some(guard) = &clause.guard { walker.visit(guard, dialect); }
                        for form in &clause.body { walker.visit(form, dialect); }
                    });
                }
                return;
            }
        }
        if head == "block" {
            self.scopes.push(direct_scope_names(args));
            for arg in args { self.visit(arg, dialect); }
            self.scopes.pop();
            return;
        }
        let explicit_dialect = head.strip_prefix("kernel:").map(|_| InputDialect::Kernel).unwrap_or(dialect);
        let op = head.strip_prefix("kernel:").unwrap_or(head);
        match op {
            "set!" | "assign" | "++" | "--" | "+=" | "-=" | "*=" | "/=" | "%=" => {
                if let Some(target) = args.first() {
                    self.record_pattern_writes(target, explicit_dialect);
                }
            }
            "set-symbol!" => {
                if let (Some(receiver), Some(key)) = (args.first(), args.get(1)) {
                    self.record_symbol_write(receiver, key);
                }
            }
            "=" if explicit_dialect == InputDialect::Kernel => {
                if let Some(target) = args.first() { self.record_pattern_writes(target, explicit_dialect); }
            }
            _ => {}
        }
        // Check computed keys, defaults, and RHS expressions independently.
        for arg in args { self.visit(arg, explicit_dialect); }
    }

    fn with_pattern_scope(&mut self, pattern: &Pattern, dialect: InputDialect, visit: impl FnOnce(&mut Self)) {
        let mut names = HashSet::new();
        collect_pattern_names(pattern, &mut names);
        self.scopes.push(names);
        visit(self);
        self.scopes.pop();
        let _ = dialect;
    }
}

fn collect_pattern_names(pattern: &Pattern, names: &mut HashSet<String>) {
    match pattern {
        Pattern::Binding { name, .. } => { names.insert(to_js_identifier(name)); }
        Pattern::Constructor { bindings, .. } => for binding in bindings { collect_pattern_names(binding, names); },
        Pattern::Obj { pairs, .. } => for (_, pattern) in pairs { collect_pattern_names(pattern, names); },
        Pattern::Wildcard(_) | Pattern::Literal(_) => {}
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::reader::read;

    fn check(source: &str, dialect: InputDialect) -> Vec<Diagnostic> {
        validate_program(&read(source).expect("test source parses"), dialect)
    }

    #[test]
    fn source_equality_is_not_a_write_but_kernel_assignment_is() {
        assert!(check("(= Reflect:apply 0)", InputDialect::Surface).is_empty());
        let errors = check("(= Reflect:apply 0)", InputDialect::Kernel);
        assert_eq!(errors.len(), 1);
        assert_eq!(errors[0].message, "host-contract v1: write to protected slot Reflect.apply");
    }

    #[test]
    fn bindings_in_same_scope_are_precollected() {
        assert!(check("(block (++ Reflect) (let Reflect 0))", InputDialect::Kernel).is_empty());
        assert_eq!(check("(++ Reflect)", InputDialect::Kernel).len(), 1);
    }

    #[test]
    fn alias_invalidation_is_whole_unit_but_bare_reflect_remains_protected() {
        let errors = check(
            "(= globalThis:Reflect:apply 0) (function f () (++ globalThis)) (++ Reflect)",
            InputDialect::Kernel,
        );
        assert_eq!(errors.len(), 1);
        assert_eq!(errors[0].message, "host-contract v1: write to protected slot Reflect");
    }

    #[test]
    fn lexical_names_follow_import_block_loop_catch_and_label_boundaries() {
        assert!(check(
            "(import \"m\" ((alias orig Reflect!))) (++ Reflect:apply)",
            InputDialect::Surface,
        ).is_empty());
        assert!(check("(bind (array Reflect) xs) (++ Reflect:apply)", InputDialect::Surface).is_empty());
        let block = check("(block (++ Reflect) (let Reflect 0)) (++ Reflect)", InputDialect::Kernel);
        assert_eq!(block.len(), 1);
        let loop_case = check("(for-of Reflect xs (++ Reflect)) (++ Reflect)", InputDialect::Kernel);
        assert_eq!(loop_case.len(), 1);
        let catch_case = check("(try 0 (catch Reflect (++ Reflect))) (++ Reflect)", InputDialect::Kernel);
        assert_eq!(catch_case.len(), 1);
        assert_eq!(check("(label Reflect (++ Reflect))", InputDialect::Kernel).len(), 1);
        assert!(check("(quote (++ Reflect))", InputDialect::Kernel).is_empty());
        let methods = check(
            "(class C () (one (Reflect) (++ Reflect)) (two () (++ Reflect)))",
            InputDialect::Kernel,
        );
        assert_eq!(methods.len(), 1);
    }

    #[test]
    fn alias_write_is_reported_unless_real_global_this_is_mutated() {
        let aliased = check(
            "(= globalThis:Reflect:apply 0) (function f (globalThis) (++ globalThis))",
            InputDialect::Kernel,
        );
        assert_eq!(aliased.len(), 1);
        let invalidated = check(
            "(= globalThis:Reflect:apply 0) (function f () (++ globalThis))",
            InputDialect::Kernel,
        );
        assert!(invalidated.is_empty());
    }
}

