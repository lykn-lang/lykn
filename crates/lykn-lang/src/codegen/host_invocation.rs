//! Private requests for calls whose callee, receiver, and arguments have
//! already been evaluated and saved by compiler-owned code.

use std::collections::{HashMap, HashSet};

use crate::ast::sexpr::SExpr;
use crate::codegen::names::to_js_identifier;
use crate::diagnostics::{Diagnostic, Severity};
use crate::error::LyknError;
use crate::protected_host::IntrinsicId;
use crate::reader::source_loc::Span;

pub(crate) const INLINE_APPLY_MODULE: &str = "data:text/javascript,export%20function%20apply(fn%2Creceiver%2Cargv)%7Breturn%20Reflect.apply(fn%2Creceiver%2Cargv)%7D";

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub(crate) enum SupportStrategy {
    LocalFunction,
    InlineModuleImport,
}

pub(crate) struct InvocationSupport {
    pub(crate) name: String,
    pub(crate) strategy: SupportStrategy,
}

pub(crate) struct InvocationRequest<'a> {
    pub(crate) id: IntrinsicId,
    pub(crate) anchor: &'a SExpr,
}

pub(crate) struct PreparedInvocations {
    pub(crate) request_names: HashMap<usize, bool>,
    pub(crate) slot: &'static str,
    pub(crate) support: Option<InvocationSupport>,
}

pub(crate) fn prepare(
    forms: &[SExpr],
    requests: &[InvocationRequest<'_>],
) -> Result<PreparedInvocations, LyknError> {
    if requests.is_empty() {
        return Ok(PreparedInvocations {
            request_names: HashMap::new(),
            slot: IntrinsicId::ReflectApply.slot(),
            support: None,
        });
    }
    let support = if crate::protected_host::module_binds_reflect(forms) {
        SupportStrategy::InlineModuleImport
    } else {
        SupportStrategy::LocalFunction
    };

    let mut nodes = HashSet::new();
    collect_node_addresses(forms, &mut nodes);
    let mut anchors = HashSet::new();
    for request in requests {
        let address = request.anchor as *const SExpr as usize;
        if !nodes.contains(&address) {
            return Err(invalid_request("orphaned invocation request"));
        }
        if !anchors.insert(address) {
            return Err(invalid_request("duplicate invocation request"));
        }
        if request.id != IntrinsicId::ReflectApply {
            return Err(invalid_request("unsupported protected invocation ID"));
        }
        validate_anchor(request.anchor)?;
    }

    let reserved = normalized_payload_names(forms);
    let mut index = 0_u64;
    let helper_name = loop {
        let candidate = format!("lyknHostReflectApply{index}");
        if !reserved.contains(&candidate) {
            break candidate;
        }
        index = index
            .checked_add(1)
            .ok_or_else(|| invalid_request("helper name space exhausted"))?;
    };
    let request_names = requests
        .iter()
        .map(|request| (request.anchor as *const SExpr as usize, false))
        .collect();
    Ok(PreparedInvocations {
        request_names,
        slot: requests[0].id.slot(),
        support: Some(InvocationSupport {
            name: helper_name,
            strategy: support,
        }),
    })
}

fn validate_anchor(anchor: &SExpr) -> Result<(), LyknError> {
    let Some(values) = anchor.as_list() else {
        return Err(invalid_request("invocation anchor is not a call"));
    };
    if values.len() != 3 {
        return Err(invalid_request(
            "invocation requires exactly three saved references",
        ));
    }
    for (index, value) in values.iter().enumerate() {
        let Some(name) = value.as_atom() else {
            return Err(invalid_request(
                "invocation operands must be stable atom references",
            ));
        };
        if name.is_empty()
            || name.contains(':')
            || matches!(name, "this" | "super" | "true" | "false" | "null")
            || (name == "undefined" && index != 1)
        {
            return Err(invalid_request(
                "invocation operands must be stable atom references",
            ));
        }
    }
    Ok(())
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

fn normalized_payload_names(forms: &[SExpr]) -> HashSet<String> {
    fn visit(node: &SExpr, names: &mut HashSet<String>) {
        match node {
            SExpr::Atom(_) => {
                if let Some(value) = node.as_atom() {
                    for segment in value.split(':') {
                        names.insert(to_js_identifier(segment));
                    }
                }
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
