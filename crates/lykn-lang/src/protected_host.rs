//! Versioned, whole-unit checks for writes to protected host intrinsics.
//!
//! This is deliberately a proof over the source/kernel forms Lykn owns. It is
//! not a JavaScript resolver: anything that cannot be proved to be the real
//! global is left alone.

use std::collections::HashSet;

use crate::ast::sexpr::SExpr;
use crate::ast::surface::{Pattern, SurfaceForm};
use crate::binding::{BindingKind, bindings_introduced};
use crate::codegen::names::to_js_identifier;
use crate::diagnostics::{Diagnostic, Severity};
use crate::reader::source_loc::Span;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum InputDialect {
    Surface,
    Kernel,
}
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum IntrinsicId {
    ReflectApply,
}
impl IntrinsicId {
    pub(crate) fn slot(self) -> &'static str {
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
    let names = match dialect {
        InputDialect::Surface => scope_names(forms, true),
        InputDialect::Kernel => kernel_module_names(forms),
    };
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
            let direct_apply = is_path(&path, &["Reflect", "apply"]);
            let direct_reflect = is_path(&path, &["Reflect"]);
            let alias_apply = is_path(&path, &["globalThis", "Reflect", "apply"]);
            let alias_reflect = is_path(&path, &["globalThis", "Reflect"]);
            if direct_apply
                || direct_reflect
                || ((!walker.invalidates_aliases) && (alias_apply || alias_reflect))
            {
                let slot = if direct_apply || alias_apply {
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

fn is_path(path: &[String], wanted: &[&str]) -> bool {
    path.len() == wanted.len() && path.iter().zip(wanted).all(|(got, want)| got == want)
}

fn head_and_args(form: &SExpr) -> Option<(&str, &[SExpr])> {
    let values = form.as_list()?;
    let head = values.first()?.as_form_head()?;
    Some((head, &values[1..]))
}

fn scope_names(forms: &[SExpr], module: bool) -> HashSet<String> {
    let mut names = HashSet::new();
    for form in forms {
        let Some((head, _)) = head_and_args(form) else {
            continue;
        };
        let declaration = match head.strip_prefix("kernel:").unwrap_or(head) {
            "bind" | "import" | "const" | "let" | "function" | "function*" | "func" | "genfunc"
            | "class" | "type" => true,
            "var" => module,
            _ => false,
        };
        if !declaration {
            continue;
        }
        let raw_head = head.strip_prefix("kernel:").unwrap_or(head);
        if matches!(raw_head, "const" | "let" | "var") {
            if let Some(pattern) = form.as_list().and_then(|values| values.get(1)) {
                kernel_pattern_names(pattern, &mut names);
            }
        } else if matches!(raw_head, "function" | "function*") {
            if let Some(name) = form.as_list().and_then(|values| values.get(1))
                && name.as_atom().is_some()
            {
                kernel_pattern_names(name, &mut names);
            }
        } else {
            for binding in bindings_introduced(form) {
                if matches!(binding.kind, BindingKind::Bind | BindingKind::ImportLocal) {
                    names.insert(to_js_identifier(&binding.name));
                }
            }
        }
    }
    if module {
        collect_var_hoists(forms, &mut names);
    }
    names
}

pub(crate) fn module_binds_reflect(forms: &[SExpr]) -> bool {
    kernel_module_names(forms).contains("Reflect")
}

fn kernel_module_names(forms: &[SExpr]) -> HashSet<String> {
    let mut names = HashSet::new();
    for form in forms {
        add_kernel_module_declaration(form, &mut names);
    }
    collect_var_hoists_mode(forms, &mut names, true);
    names
}

fn add_kernel_module_declaration(form: &SExpr, names: &mut HashSet<String>) {
    let Some((head, args)) = head_and_args(form) else {
        return;
    };
    if head == "export" {
        let candidate = if args.first().and_then(SExpr::as_atom) == Some("default") {
            args.get(1)
        } else {
            args.first()
        };
        if let Some(candidate) = candidate {
            add_kernel_module_declaration(candidate, names);
        }
        return;
    }
    if head == "async" {
        let Some(payload) = args.first() else { return };
        let Some(values) = payload.as_list() else {
            return;
        };
        // emit_async reads this payload head as structural syntax.
        if matches!(
            values.first().and_then(SExpr::as_atom),
            Some("function" | "function*")
        ) {
            add_kernel_module_declaration(payload, names);
        }
        return;
    }
    match head {
        "const" | "let" => {
            if let Some(pattern) = args.first() {
                kernel_pattern_names(pattern, names);
            }
        }
        "function" => {
            if let Some(name) = args.first().filter(|name| name.as_atom().is_some()) {
                kernel_pattern_names(name, names);
            }
        }
        "function*" => {
            if let Some(name) = args.first().filter(|name| name.as_atom().is_some()) {
                kernel_pattern_names(name, names);
            }
        }
        "class" | "import" => {
            for binding in bindings_introduced(form) {
                if matches!(binding.kind, BindingKind::Bind | BindingKind::ImportLocal) {
                    names.insert(to_js_identifier(&binding.name));
                }
            }
        }
        _ => {}
    }
}

fn collect_var_hoists(forms: &[SExpr], names: &mut HashSet<String>) {
    collect_var_hoists_mode(forms, names, false);
}

fn collect_var_hoists_mode(forms: &[SExpr], names: &mut HashSet<String>, raw_kernel: bool) {
    for form in forms {
        let Some((head, args)) = head_and_args(form) else {
            if let Some(values) = form.as_list() {
                for value in values {
                    collect_var_hoists_mode(std::slice::from_ref(value), names, raw_kernel);
                }
            }
            continue;
        };
        if matches!(head, "quote" | "quasiquote" | "syntax-quote") {
            continue;
        }
        if matches!(
            head,
            "fn" | "lambda"
                | "genfn"
                | "func"
                | "genfunc"
                | "function"
                | "function*"
                | "=>"
                | "class"
                | "class-expr"
        ) {
            continue;
        }
        if head == "object" {
            for child in args {
                for expr in object_executable_children(child) {
                    collect_var_hoists_mode(std::slice::from_ref(expr), names, raw_kernel);
                }
            }
        } else if head == "var" || (!raw_kernel && head == "kernel:var") {
            if let Some(pattern) = args.first() {
                kernel_pattern_names(pattern, names);
            }
            for child in args.iter().skip(1) {
                collect_var_hoists_mode(std::slice::from_ref(child), names, raw_kernel);
            }
        } else {
            collect_var_hoists_mode(args, names, raw_kernel);
        }
    }
}

fn object_executable_children(arg: &SExpr) -> Vec<&SExpr> {
    let Some(values) = arg.as_list() else {
        return Vec::new();
    };
    if values.first().and_then(SExpr::as_atom) == Some("spread") {
        return values.get(1).into_iter().collect();
    }
    let mut children = Vec::new();
    if let Some(key) = values.first()
        && let Some(key_values) = key.as_list()
    {
        if key_values.first().and_then(SExpr::as_atom) == Some("computed") {
            children.extend(key_values.get(1));
        } else {
            children.push(key);
        }
    }
    children.extend(values.get(1));
    children
}

fn param_scope_names(params: &[crate::ast::surface::ParamShape]) -> HashSet<String> {
    params
        .iter()
        .flat_map(|param| param.bound_names())
        .map(to_js_identifier)
        .collect()
}

fn visit_param_defaults(
    walker: &mut Walker,
    params: &[crate::ast::surface::ParamShape],
    dialect: InputDialect,
) {
    for default in params
        .iter()
        .flat_map(|param| param.typed_params())
        .filter_map(|param| param.default_value.as_ref())
    {
        walker.visit(default, dialect);
    }
}

fn function_scope_names(body: &[SExpr], params: HashSet<String>) -> HashSet<String> {
    let mut names = scope_names(body, false);
    names.extend(params);
    collect_var_hoists(body, &mut names);
    names
}

fn kernel_param_names(params: &[SExpr]) -> HashSet<String> {
    let mut names = HashSet::new();
    for pattern in params {
        kernel_pattern_names(pattern, &mut names);
    }
    names
}

/// Collect names from the structural binding slots accepted by the kernel
/// pattern emitter. Property keys and default expressions are executable
/// values, never binders.
fn kernel_pattern_names(pattern: &SExpr, names: &mut HashSet<String>) {
    fn add_atom(atom: &str, names: &mut HashSet<String>) {
        if !atom.contains(':')
            && !matches!(
                atom,
                "true" | "false" | "null" | "undefined" | "this" | "super"
            )
        {
            names.insert(to_js_identifier(atom));
        }
    }

    let Some(values) = pattern.as_list() else {
        if let Some(atom) = pattern.as_atom() {
            add_atom(atom, names);
        }
        return;
    };
    let Some(kind) = values.first().and_then(SExpr::as_atom) else {
        return;
    };
    let args = &values[1..];
    match kind {
        "default" | "rest" => {
            if let Some(target) = args.first() {
                kernel_pattern_names(target, names);
            }
        }
        "alias" => {
            if let Some(target) = args.get(1) {
                kernel_pattern_names(target, names);
            }
        }
        "array" => {
            for child in args {
                if child.as_atom() != Some("_") {
                    kernel_pattern_names(child, names);
                }
            }
        }
        "object" => {
            for member in args {
                let Some(values) = member.as_list() else {
                    kernel_pattern_names(member, names);
                    continue;
                };
                if values.first().and_then(SExpr::as_atom) == Some("spread") {
                    if let Some(atom) = values.get(1).and_then(SExpr::as_atom) {
                        add_atom(atom, names);
                    }
                    continue;
                }
                kernel_pattern_names(member, names);
            }
        }
        _ => {}
    }
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
        if let RootProof::GlobalKnown(path) = &proof
            && (is_path(path, &["globalThis"]) || is_path(path, &["globalThis", "globalThis"]))
        {
            self.invalidates_aliases = true;
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
        if let RootProof::GlobalKnown(path) = &proof
            && (is_path(path, &["globalThis"]) || is_path(path, &["globalThis", "globalThis"]))
        {
            self.invalidates_aliases = true;
        }
        self.sites.push(WriteSite {
            proof,
            span: receiver.span(),
        });
    }

    fn record_pattern_writes(&mut self, target: &SExpr, dialect: InputDialect) {
        if let Some(values) = target.as_list() {
            match values.first().and_then(SExpr::as_form_head) {
                Some("array") => {
                    for child in values.iter().skip(1) {
                        self.record_pattern_writes(child, dialect);
                    }
                    return;
                }
                Some("object") => {
                    for child in values.iter().skip(1) {
                        if let Some(pair) = child.as_list() {
                            if pair.first().and_then(SExpr::as_form_head) == Some("alias") {
                                if let Some(pattern) = pair.get(2) {
                                    self.record_pattern_writes(pattern, dialect);
                                }
                            } else if pair.first().and_then(SExpr::as_form_head) == Some("default")
                            {
                                self.record_pattern_writes(child, dialect);
                            } else {
                                for pattern in pair.iter().skip(1) {
                                    self.record_pattern_writes(pattern, dialect);
                                }
                            }
                        } else {
                            self.record_pattern_writes(child, dialect);
                        }
                    }
                    return;
                }
                Some("rest") => {
                    if let Some(child) = values.get(1) {
                        self.record_pattern_writes(child, dialect);
                    }
                    return;
                }
                Some("default") => {
                    if let Some(child) = values.get(1) {
                        self.record_pattern_writes(child, dialect);
                    }
                    if let Some(default) = values.get(2) {
                        self.visit(default, dialect);
                    }
                    return;
                }
                _ => {}
            }
        }
        self.record_write(target);
    }

    fn visit_kernel_pattern_defaults(&mut self, pattern: &SExpr, dialect: InputDialect) {
        let Some(values) = pattern.as_list() else {
            return;
        };
        let Some(kind) = values.first().and_then(SExpr::as_atom) else {
            return;
        };
        let args = &values[1..];
        match kind {
            "default" => {
                if let Some(target) = args.first() {
                    self.visit_kernel_pattern_defaults(target, dialect);
                }
                if let Some(value) = args.get(1) {
                    self.visit(value, dialect);
                }
            }
            "rest" => {
                if let Some(target) = args.first() {
                    self.visit_kernel_pattern_defaults(target, dialect);
                }
            }
            "array" => {
                for child in args {
                    self.visit_kernel_pattern_defaults(child, dialect);
                }
            }
            "object" => {
                for child in args {
                    let Some(parts) = child.as_list() else {
                        continue;
                    };
                    let Some(kind) = parts.first().and_then(SExpr::as_atom) else {
                        continue;
                    };
                    match kind {
                        "default" => {
                            if let Some(value) = parts.get(2) {
                                self.visit(value, dialect);
                            }
                        }
                        "rest" => {
                            if let Some(target) = parts.get(1) {
                                self.visit_kernel_pattern_defaults(target, dialect);
                            }
                        }
                        "alias" => {
                            if let Some(target) = parts.get(2) {
                                self.visit_kernel_pattern_defaults(target, dialect);
                            }
                            if let Some(default) = parts.get(3) {
                                self.visit(default, dialect);
                            }
                        }
                        _ => self.visit_kernel_pattern_defaults(child, dialect),
                    }
                }
            }
            "alias" => {
                if let Some(target) = args.get(1) {
                    self.visit_kernel_pattern_defaults(target, dialect);
                }
                if let Some(default) = args.get(2) {
                    self.visit(default, dialect);
                }
            }
            _ => {}
        }
    }

    fn visit_kernel_param_defaults(
        &mut self,
        params: &[SExpr],
        names: &HashSet<String>,
        dialect: InputDialect,
    ) {
        self.scopes.push(names.clone());
        for param in params {
            self.visit_kernel_pattern_defaults(param, dialect);
        }
        self.scopes.pop();
    }

    fn visit(&mut self, expr: &SExpr, dialect: InputDialect) {
        let Some(values) = expr.as_list() else { return };
        let Some(head) = values.first().and_then(SExpr::as_form_head) else {
            for child in values {
                self.visit(child, dialect);
            }
            return;
        };
        let args = &values[1..];
        if matches!(head, "quote" | "quasiquote" | "syntax-quote") {
            return;
        }
        if head == "object" {
            for child in args {
                let Some(values) = child.as_list() else {
                    continue;
                };
                if values.first().and_then(SExpr::as_atom) == Some("spread") {
                    if let Some(value) = values.get(1) {
                        self.visit(value, dialect);
                    }
                    continue;
                }
                if let Some(key) = values.first()
                    && let Some(key_values) = key.as_list()
                {
                    if key_values.first().and_then(SExpr::as_atom) == Some("computed") {
                        if let Some(expression) = key_values.get(1) {
                            self.visit(expression, dialect);
                        }
                    } else {
                        self.visit(key, dialect);
                    }
                }
                if let Some(value) = values.get(1) {
                    self.visit(value, dialect);
                }
            }
            return;
        }
        if dialect == InputDialect::Surface && matches!(head, "func" | "genfunc") {
            match crate::classifier::classify_expr(expr) {
                Ok(SurfaceForm::Func { name, clauses, .. }) => {
                    for clause in clauses {
                        let mut params = param_scope_names(&clause.args);
                        params.insert(to_js_identifier(&name));
                        self.scopes.push(params.clone());
                        visit_param_defaults(self, &clause.args, dialect);
                        self.scopes.pop();
                        let mut emitted_body = Vec::new();
                        if let Some(pre) = &clause.pre {
                            emitted_body.push(pre.clone());
                        }
                        if let Some(post) = &clause.post {
                            emitted_body.push(post.clone());
                        }
                        emitted_body.extend(clause.body.iter().cloned());
                        let names = function_scope_names(&emitted_body, params);
                        self.scopes.push(names);
                        if let Some(pre) = &clause.pre {
                            self.visit(pre, dialect);
                        }
                        if let Some(post) = &clause.post {
                            self.visit(post, dialect);
                        }
                        for body in &clause.body {
                            self.visit(body, dialect);
                        }
                        self.scopes.pop();
                    }
                    return;
                }
                Ok(SurfaceForm::Genfunc { name, clauses, .. }) => {
                    for clause in clauses {
                        let mut params = param_scope_names(&clause.args);
                        params.insert(to_js_identifier(&name));
                        self.scopes.push(params.clone());
                        visit_param_defaults(self, &clause.args, dialect);
                        self.scopes.pop();
                        let mut emitted_body = Vec::new();
                        if let Some(pre) = &clause.pre {
                            emitted_body.push(pre.clone());
                        }
                        if let Some(post) = &clause.post {
                            emitted_body.push(post.clone());
                        }
                        emitted_body.extend(clause.body.iter().cloned());
                        let names = function_scope_names(&emitted_body, params);
                        self.scopes.push(names);
                        if let Some(pre) = &clause.pre {
                            self.visit(pre, dialect);
                        }
                        if let Some(post) = &clause.post {
                            self.visit(post, dialect);
                        }
                        for body in &clause.body {
                            self.visit(body, dialect);
                        }
                        self.scopes.pop();
                    }
                    return;
                }
                _ => {}
            }
        }
        if matches!(head, "fn" | "lambda" | "genfn") {
            let params: &[SExpr] = args.first().and_then(SExpr::as_list).unwrap_or(&[]);
            let param_names = kernel_param_names(params);
            let body = args.get(1..).unwrap_or_default();
            self.visit_kernel_param_defaults(params, &param_names, dialect);
            let names = function_scope_names(body, param_names);
            self.scopes.push(names);
            for arg in body {
                self.visit(arg, dialect);
            }
            self.scopes.pop();
            return;
        }
        if head == "function" {
            let params = args.get(1).and_then(SExpr::as_list).unwrap_or(&[]);
            let mut param_names = kernel_param_names(params);
            if let Some(name) = args.first().and_then(SExpr::as_atom) {
                param_names.insert(to_js_identifier(name));
            }
            let body = args.get(2..).unwrap_or_default();
            self.visit_kernel_param_defaults(params, &param_names, dialect);
            let names = function_scope_names(body, param_names);
            self.scopes.push(names);
            for arg in body {
                self.visit(arg, dialect);
            }
            self.scopes.pop();
            return;
        }
        if head == "function*" {
            let params_index = if args.first().is_some_and(SExpr::is_list) {
                0
            } else {
                1
            };
            let params = args
                .get(params_index)
                .and_then(SExpr::as_list)
                .unwrap_or(&[]);
            let mut param_names = kernel_param_names(params);
            if params_index == 1
                && let Some(name) = args
                    .first()
                    .and_then(SExpr::as_atom)
                    .filter(|name| !name.is_empty())
            {
                param_names.insert(to_js_identifier(name));
            }
            let body = args.get(params_index + 1..).unwrap_or_default();
            self.visit_kernel_param_defaults(params, &param_names, dialect);
            let names = function_scope_names(body, param_names);
            self.scopes.push(names);
            for arg in body {
                self.visit(arg, dialect);
            }
            self.scopes.pop();
            return;
        }
        if head == "=>" {
            let params = args.first().and_then(SExpr::as_list).unwrap_or(&[]);
            let param_names = kernel_param_names(params);
            let body = args.get(1..).unwrap_or_default();
            self.visit_kernel_param_defaults(params, &param_names, dialect);
            let names = function_scope_names(body, param_names);
            self.scopes.push(names);
            for arg in body {
                self.visit(arg, dialect);
            }
            self.scopes.pop();
            return;
        }
        if head == "class" || head == "class-expr" {
            let mut class_scope = HashSet::new();
            let (base_index, member_index) = if head == "class" {
                if let Some(name) = args.first().and_then(SExpr::as_atom) {
                    class_scope.insert(to_js_identifier(name));
                }
                (1, 2)
            } else {
                (0, 1)
            };
            self.scopes.push(class_scope);
            if let Some(bases) = args.get(base_index).and_then(SExpr::as_list) {
                for base in bases {
                    self.visit(base, dialect);
                }
            }
            for member in args.iter().skip(member_index) {
                self.visit_class_member(member, dialect);
            }
            self.scopes.pop();
            return;
        }
        if matches!(head, "for-of" | "for-in" | "for-await-of") {
            if let Some(iterable) = args.get(1) {
                self.visit(iterable, dialect);
            }
            let names: HashSet<String> = if dialect == InputDialect::Kernel {
                let mut names = HashSet::new();
                if let Some(pattern) = args.first() {
                    kernel_pattern_names(pattern, &mut names);
                }
                names
            } else {
                bindings_introduced(expr)
                    .into_iter()
                    .map(|b| to_js_identifier(&b.name))
                    .collect()
            };
            self.scopes.push(names);
            if let Some(pattern) = args.first() {
                self.visit(pattern, dialect);
            }
            self.visit_lexical_body(args.get(2..).unwrap_or_default(), dialect);
            self.scopes.pop();
            return;
        }
        if head == "for" {
            let mut names = HashSet::new();
            if let Some(init) = args.first() {
                names.extend(scope_names(std::slice::from_ref(init), false));
            }
            self.scopes.push(names);
            for arg in args.iter().take(3) {
                self.visit(arg, dialect);
            }
            self.visit_lexical_body(args.get(3..).unwrap_or_default(), dialect);
            self.scopes.pop();
            return;
        }
        if head == "while" || head == "do-while" {
            if let Some(test) = args.first() {
                self.visit(test, dialect);
            }
            self.visit_lexical_body(args.get(1..).unwrap_or_default(), dialect);
            return;
        }
        if head == "try" {
            let mut body = Vec::new();
            let mut catch_clause = None;
            let mut finally_clause = None;
            for arg in args {
                let Some(values) = arg.as_list() else {
                    body.push(arg.clone());
                    continue;
                };
                match values.first().and_then(SExpr::as_atom) {
                    Some("catch") => catch_clause = Some(arg),
                    Some("finally") => finally_clause = Some(&values[1..]),
                    _ => body.push(arg.clone()),
                }
            }
            self.visit_lexical_body(&body, dialect);
            if let Some(catch) = catch_clause {
                self.visit_catch_clause(catch, dialect);
            }
            if let Some(forms) = finally_clause {
                self.visit_lexical_body(forms, dialect);
            }
            return;
        }
        if matches!(head, "if-let" | "when-let")
            && let Ok(surface) = crate::classifier::classify_expr(expr)
        {
            match surface {
                SurfaceForm::IfLet {
                    pattern,
                    expr: value,
                    then_body,
                    else_body,
                    ..
                } => {
                    self.visit(&value, dialect);
                    self.with_pattern_scope(&pattern, |walker| {
                        walker.visit_lexical_body(std::slice::from_ref(&then_body), dialect);
                    });
                    if let Some(other) = else_body {
                        self.visit_lexical_body(std::slice::from_ref(&other), dialect);
                    }
                    return;
                }
                SurfaceForm::WhenLet {
                    pattern,
                    expr: value,
                    body,
                    ..
                } => {
                    self.visit(&value, dialect);
                    self.with_pattern_scope(&pattern, |walker| {
                        walker.visit_lexical_body(&body, dialect);
                    });
                    return;
                }
                _ => {}
            }
        }
        if head == "match"
            && let Ok(SurfaceForm::Match {
                target, clauses, ..
            }) = crate::classifier::classify_expr(expr)
        {
            self.visit(&target, dialect);
            for clause in clauses {
                self.with_pattern_scope(&clause.pattern, |walker| {
                    if let Some(guard) = &clause.guard {
                        walker.visit(guard, dialect);
                    }
                    walker.visit_lexical_body(&clause.body, dialect);
                });
            }
            return;
        }
        if head == "block" {
            self.scopes.push(scope_names(args, false));
            for arg in args {
                self.visit(arg, dialect);
            }
            self.scopes.pop();
            return;
        }
        if head == "do" {
            self.visit_lexical_body(args, dialect);
            return;
        }
        if head == "switch" {
            if let Some(discriminant) = args.first() {
                self.visit(discriminant, dialect);
            }
            let cases: Vec<&[SExpr]> = args.iter().skip(1).filter_map(SExpr::as_list).collect();
            let bodies: Vec<SExpr> = cases
                .iter()
                .flat_map(|case| case.iter().skip(1).cloned())
                .collect();
            self.scopes.push(scope_names(&bodies, false));
            for case in cases {
                if let Some(test) = case.first()
                    && test.as_atom() != Some("default")
                {
                    self.visit(test, dialect);
                }
                for body in case.iter().skip(1) {
                    self.visit(body, dialect);
                }
            }
            self.scopes.pop();
            return;
        }
        let explicit_dialect = head
            .strip_prefix("kernel:")
            .map(|_| InputDialect::Kernel)
            .unwrap_or(dialect);
        let op = head.strip_prefix("kernel:").unwrap_or(head);
        match op {
            "set!" | "assign" | "++" | "--" | "+=" | "-=" | "*=" | "/=" | "%=" | "**=" | "<<="
            | ">>=" | ">>>=" | "&=" | "|=" | "^=" | "&&=" | "||=" | "??=" => {
                if let Some(target) = args.first() {
                    self.record_pattern_writes(target, dialect);
                }
            }
            "set-symbol!" => {
                if let (Some(receiver), Some(key)) = (args.first(), args.get(1)) {
                    self.record_symbol_write(receiver, key);
                }
            }
            "delete" if explicit_dialect == InputDialect::Kernel => {
                if let Some(target) = args.first() {
                    self.record_write(target);
                }
            }
            "=" if explicit_dialect == InputDialect::Kernel => {
                if let Some(target) = args.first() {
                    self.record_pattern_writes(target, dialect);
                }
            }
            _ => {}
        }
        // Check computed keys, defaults, and RHS expressions independently.
        for arg in args {
            self.visit(arg, dialect);
        }
    }

    fn with_pattern_scope(&mut self, pattern: &Pattern, visit: impl FnOnce(&mut Self)) {
        let mut names = HashSet::new();
        collect_pattern_names(pattern, &mut names);
        self.scopes.push(names);
        visit(self);
        self.scopes.pop();
    }

    fn visit_lexical_body(&mut self, forms: &[SExpr], dialect: InputDialect) {
        self.scopes.push(scope_names(forms, false));
        for form in forms {
            self.visit(form, dialect);
        }
        self.scopes.pop();
    }

    fn visit_catch_clause(&mut self, clause: &SExpr, dialect: InputDialect) {
        let Some(values) = clause.as_list() else {
            return;
        };
        let args = &values[1..];
        let mut names: HashSet<String> = bindings_introduced(clause)
            .into_iter()
            .map(|b| to_js_identifier(&b.name))
            .collect();
        let body = args.get(1..).unwrap_or_default();
        names.extend(scope_names(body, false));
        self.scopes.push(names);
        for form in body {
            self.visit(form, dialect);
        }
        self.scopes.pop();
    }

    fn visit_class_member(&mut self, member: &SExpr, dialect: InputDialect) {
        let Some(parts) = member.as_list() else {
            self.visit(member, dialect);
            return;
        };
        let Some(member_head) = parts.first().and_then(SExpr::as_atom) else {
            return;
        };
        if matches!(member_head, "static" | "async") {
            if let Some(inner) = parts.get(1) {
                self.visit_class_member(inner, dialect);
            }
            return;
        }
        if member_head == "field" {
            if let Some(value) = parts.get(2) {
                self.visit(value, dialect);
            }
            return;
        }
        let accessor = matches!(member_head, "get" | "set");
        let params_index = if accessor { 2 } else { 1 };
        let body_index = if accessor { 3 } else { 2 };
        let mut params = HashSet::new();
        if let Some(patterns) = parts.get(params_index).and_then(SExpr::as_list) {
            for pattern in patterns {
                kernel_pattern_names(pattern, &mut params);
            }
        }
        let body = parts.get(body_index..).unwrap_or_default();
        if let Some(patterns) = parts.get(params_index).and_then(SExpr::as_list) {
            self.visit_kernel_param_defaults(patterns, &params, dialect);
        }
        let method_scope = function_scope_names(body, params);
        self.scopes.push(method_scope);
        for form in body {
            self.visit(form, dialect);
        }
        self.scopes.pop();
    }
}

fn collect_pattern_names(pattern: &Pattern, names: &mut HashSet<String>) {
    match pattern {
        Pattern::Binding { name, .. } => {
            names.insert(to_js_identifier(name));
        }
        Pattern::Constructor { bindings, .. } => {
            for binding in bindings {
                collect_pattern_names(binding, names);
            }
        }
        Pattern::Obj { pairs, .. } => {
            for (_, pattern) in pairs {
                collect_pattern_names(pattern, names);
            }
        }
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
        let forms = read("(= Reflect:apply 0)").expect("test source parses");
        let target_span = forms[0].as_list().unwrap()[1].span();
        let errors = validate_program(&forms, InputDialect::Kernel);
        assert_eq!(errors.len(), 1);
        assert_eq!(
            errors[0].message,
            "host-contract v1: write to protected slot Reflect.apply"
        );
        assert_eq!(errors[0].span, target_span);
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
        assert_eq!(
            errors[0].message,
            "host-contract v1: write to protected slot Reflect"
        );
    }

    #[test]
    fn lexical_names_follow_import_block_loop_catch_and_label_boundaries() {
        assert!(
            check(
                "(import \"m\" ((alias orig Reflect!))) (++ Reflect:apply)",
                InputDialect::Surface,
            )
            .is_empty()
        );
        assert!(
            check(
                "(bind (array Reflect) xs) (++ Reflect:apply)",
                InputDialect::Surface
            )
            .is_empty()
        );
        let block = check(
            "(block (++ Reflect) (let Reflect 0)) (++ Reflect)",
            InputDialect::Kernel,
        );
        assert_eq!(block.len(), 1);
        let loop_case = check(
            "(for-of Reflect xs (++ Reflect)) (++ Reflect)",
            InputDialect::Kernel,
        );
        assert_eq!(loop_case.len(), 1);
        let catch_case = check(
            "(try 0 (catch Reflect (++ Reflect))) (++ Reflect)",
            InputDialect::Kernel,
        );
        assert_eq!(catch_case.len(), 1);
        assert_eq!(
            check("(label Reflect (++ Reflect))", InputDialect::Kernel).len(),
            1
        );
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

    #[test]
    fn if_let_pattern_binds_then_only_and_else_global_write_invalidates_aliases() {
        let first_source =
            "(if-let (globalThis source) (++ globalThis) 0) (set! globalThis:Reflect:apply 0)";
        let first = read(first_source).expect("test source parses");
        let target_span = first[1].as_list().unwrap()[1].span();
        let errors = validate_program(&first, InputDialect::Surface);
        assert_eq!(errors.len(), 1);
        assert_eq!(
            errors[0].message,
            "host-contract v1: write to protected slot Reflect.apply"
        );
        assert_eq!(errors[0].span, target_span);

        let second = read(
            "(if-let (globalThis source) 0 (++ globalThis)) (set! globalThis:Reflect:apply 0)",
        )
        .expect("test source parses");
        assert!(validate_program(&second, InputDialect::Surface).is_empty());
    }

    #[test]
    fn kernel_escape_changes_only_its_own_operator_dialect() {
        assert!(check("(kernel:array (= Reflect:apply 0))", InputDialect::Surface).is_empty());
        let source = "(kernel:array (kernel:= Reflect:apply 0))";
        let forms = read(source).expect("test source parses");
        let target_span = forms[0].as_list().unwrap()[1].as_list().unwrap()[1].span();
        let errors = validate_program(&forms, InputDialect::Surface);
        assert_eq!(errors.len(), 1);
        assert_eq!(
            errors[0].message,
            "host-contract v1: write to protected slot Reflect.apply"
        );
        assert_eq!(errors[0].span, target_span);
    }

    #[test]
    fn kernel_parameter_defaults_exclude_body_bindings_and_keep_parameter_bindings() {
        let source = "(function f ((default x (++ Reflect))) (let Reflect 0) x)";
        let forms = read(source).expect("test source parses");
        let params = forms[0].as_list().unwrap()[2].as_list().unwrap();
        let default = params[0].as_list().unwrap();
        let target_span = default[2].as_list().unwrap()[1].span();
        let errors = validate_program(&forms, InputDialect::Kernel);
        assert_eq!(errors.len(), 1);
        assert_eq!(
            errors[0].message,
            "host-contract v1: write to protected slot Reflect"
        );
        assert_eq!(errors[0].span, target_span);

        assert!(
            check(
                "(function f (Reflect (default x (++ Reflect))) (let Reflect 0) x)",
                InputDialect::Kernel,
            )
            .is_empty()
        );

        let method_source = "(class C () (m ((default x (++ Reflect))) (let Reflect 0) x))";
        let method_forms = read(method_source).expect("test source parses");
        let method_default = method_forms[0].as_list().unwrap()[3].as_list().unwrap()[1]
            .as_list()
            .unwrap()[0]
            .as_list()
            .unwrap();
        let target_span = method_default[2].as_list().unwrap()[1].span();
        let errors = validate_program(&method_forms, InputDialect::Kernel);
        assert_eq!(errors.len(), 1);
        assert_eq!(
            errors[0].message,
            "host-contract v1: write to protected slot Reflect"
        );
        assert_eq!(errors[0].span, target_span);

        assert!(
            check(
                "(class C () (m (Reflect (default x (++ Reflect))) (let Reflect 0) x))",
                InputDialect::Kernel,
            )
            .is_empty()
        );
    }

    #[test]
    fn kernel_pattern_scope_uses_emitted_binding_slots() {
        for source in [
            "(function f ((default Reflect 0)) (++ Reflect))",
            "(function f ((rest Reflect)) (++ Reflect))",
            "(function f ((object (alias field Reflect))) (++ Reflect))",
            "(function f ((object (spread Reflect))) (++ Reflect))",
        ] {
            assert!(check(source, InputDialect::Kernel).is_empty(), "{source}");
        }

        let source = "(function f ((object (alias Reflect local))) (++ Reflect))";
        let forms = read(source).expect("test source parses");
        let target_span = forms[0].as_list().unwrap()[3].as_list().unwrap()[1].span();
        let errors = validate_program(&forms, InputDialect::Kernel);
        assert_eq!(errors.len(), 1);
        assert_eq!(
            errors[0].message,
            "host-contract v1: write to protected slot Reflect"
        );
        assert_eq!(errors[0].span, target_span);
    }

    #[test]
    fn kernel_object_literal_roles_do_not_dispatch_property_keys() {
        assert!(
            check(
                "(const obj (object (delete Reflect:apply)))",
                InputDialect::Kernel,
            )
            .is_empty()
        );

        let source = "(const obj (object (var Reflect))) (++ Reflect)";
        let forms = read(source).expect("test source parses");
        let target_span = forms[1].as_list().unwrap()[1].span();
        let errors = validate_program(&forms, InputDialect::Kernel);
        assert_eq!(errors.len(), 1);
        assert_eq!(
            errors[0].message,
            "host-contract v1: write to protected slot Reflect"
        );
        assert_eq!(errors[0].span, target_span);

        let source = "(const obj (object ((computed (++ Reflect)) 0)))";
        let forms = read(source).expect("test source parses");
        let pair = forms[0].as_list().unwrap()[2].as_list().unwrap()[1]
            .as_list()
            .unwrap();
        let computed = pair[0].as_list().unwrap();
        let target_span = computed[1].as_list().unwrap()[1].span();
        let errors = validate_program(&forms, InputDialect::Kernel);
        assert_eq!(errors.len(), 1);
        assert_eq!(
            errors[0].message,
            "host-contract v1: write to protected slot Reflect"
        );
        assert_eq!(errors[0].span, target_span);
    }

    #[test]
    fn computed_kernel_callee_does_not_hide_a_function_write() {
        let source = "((=> () (++ Reflect)))";
        let forms = read(source).expect("test source parses");
        let arrow = forms[0].as_list().unwrap()[0].as_list().unwrap();
        let target_span = arrow[2].as_list().unwrap()[1].span();
        let errors = validate_program(&forms, InputDialect::Kernel);
        assert_eq!(errors.len(), 1);
        assert_eq!(
            errors[0].message,
            "host-contract v1: write to protected slot Reflect"
        );
        assert_eq!(errors[0].span, target_span);
    }

    #[test]
    fn lexical_body_scopes_do_not_hide_or_leak_writes() {
        for source in [
            "(do (let Reflect 0) (++ Reflect)) (++ Reflect)",
            "(when-let (x 1) (let Reflect 0) (++ Reflect)) (++ Reflect)",
            "(match 1 (n (let Reflect 0) (++ Reflect))) (++ Reflect)",
            "(try (let Reflect 0) (++ Reflect) (catch err 0) (finally 0)) (++ Reflect)",
        ] {
            let forms = read(source).expect("test source parses");
            let target_span = forms.last().unwrap().as_list().unwrap()[1].span();
            let errors = validate_program(&forms, InputDialect::Surface);
            assert_eq!(errors.len(), 1, "{source}");
            assert_eq!(
                errors[0].message,
                "host-contract v1: write to protected slot Reflect"
            );
            assert_eq!(errors[0].span, target_span, "{source}");
        }
    }
}
