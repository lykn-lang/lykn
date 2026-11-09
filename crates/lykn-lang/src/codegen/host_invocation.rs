//! Private request preparation for lazy protected host invocation.
//!
//! A request is keyed by the address of the exact final-tree call node. The
//! address is used only as an identity token; it is never dereferenced.

use std::collections::{HashMap, HashSet};

use crate::ast::sexpr::SExpr;
use crate::codegen::names::to_js_identifier;
use crate::diagnostics::{Diagnostic, Severity};
use crate::error::LyknError;
use crate::reader::source_loc::Span;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub(crate) struct InvocationId(u64);

impl InvocationId {
    pub(crate) const fn new(value: u64) -> Self {
        Self(value)
    }
}

pub(crate) struct InvocationRequest<'a> {
    id: InvocationId,
    anchor: &'a SExpr,
}

impl<'a> InvocationRequest<'a> {
    pub(crate) const fn new(id: InvocationId, anchor: &'a SExpr) -> Self {
        Self { id, anchor }
    }
}

pub(crate) struct PreparedInvocations {
    pub(crate) helper_name: Option<String>,
    pub(crate) request_names: HashMap<usize, String>,
}

pub(crate) fn prepare(
    forms: &[SExpr],
    requests: &[InvocationRequest<'_>],
) -> Result<PreparedInvocations, LyknError> {
    if requests.is_empty() {
        return Ok(PreparedInvocations {
            helper_name: None,
            request_names: HashMap::new(),
        });
    }
    if crate::protected_host::invocation_unavailable_for_reflect(forms) {
        return Err(invalid_request(
            "lazy protected invocation is unavailable with a module Reflect binding",
        ));
    }

    let mut nodes = HashSet::new();
    collect_node_addresses(forms, &mut nodes);
    let mut ids = HashSet::new();
    let mut anchors = HashSet::new();
    for request in requests {
        let address = request.anchor as *const SExpr as usize;
        if !nodes.contains(&address) {
            return Err(invalid_request("orphaned invocation request"));
        }
        if !ids.insert(request.id) || !anchors.insert(address) {
            return Err(invalid_request("duplicate invocation request"));
        }
        if !matches!(request.anchor.as_list(), Some(values) if values.len() == 3) {
            return Err(invalid_request(
                "invocation request must anchor an exact three-part call",
            ));
        }
    }

    let names = normalized_names(forms);
    let helper_name = (0_u64..)
        .map(|index| format!("lyknHostReflectApply{index}"))
        .find(|candidate| !names.contains(candidate))
        .expect("u64 helper-name space exhausted");
    let request_names = requests
        .iter()
        .map(|request| (request.anchor as *const SExpr as usize, helper_name.clone()))
        .collect();
    Ok(PreparedInvocations {
        helper_name: Some(helper_name),
        request_names,
    })
}

fn collect_node_addresses(forms: &[SExpr], addresses: &mut HashSet<usize>) {
    fn visit(node: &SExpr, addresses: &mut HashSet<usize>) {
        addresses.insert(node as *const SExpr as usize);
        match node {
            SExpr::List { values, .. } => values.iter().for_each(|child| visit(child, addresses)),
            SExpr::Cons { car, cdr, .. } => {
                visit(car, addresses);
                visit(cdr, addresses);
            }
            _ => {}
        }
    }
    forms.iter().for_each(|form| visit(form, addresses));
}

fn normalized_names(forms: &[SExpr]) -> HashSet<String> {
    fn visit(node: &SExpr, names: &mut HashSet<String>) {
        match node {
            SExpr::Atom { value, .. } => {
                names.insert(to_js_identifier(value));
            }
            SExpr::List { values, .. } => values.iter().for_each(|child| visit(child, names)),
            SExpr::Cons { car, cdr, .. } => {
                visit(car, names);
                visit(cdr, names);
            }
            _ => {}
        }
    }
    let mut names = HashSet::new();
    forms.iter().for_each(|form| visit(form, &mut names));
    names
}

pub(crate) fn invalid_request(message: &str) -> LyknError {
    LyknError::Codegen(Diagnostic {
        severity: Severity::Error,
        message: format!("internal protected invocation error: {message}"),
        span: Span::default(),
        suggestion: None,
    })
}
