//! Finite compiler-owned references to host values used by generated code.

use std::collections::{HashMap, HashSet};

use crate::ast::sexpr::{HostReference, SExpr};
use crate::codegen::names::to_js_identifier;
use crate::error::LyknError;

fn all_references() -> [HostReference; 9] {
    [
        HostReference::Symbol,
        HostReference::SymbolFor,
        HostReference::ObjectFreeze,
        HostReference::ObjectDefineProperties,
        HostReference::NumberIsNaN,
        HostReference::ArrayIsArray,
        HostReference::Promise,
        HostReference::TypeError,
        HostReference::Error,
    ]
}

pub(crate) const INLINE_REFERENCES_MODULE: &str = "data:text/javascript,export%20const%20symbol%3DSymbol%3Bexport%20const%20symbolFor%3DSymbol.for%3Bexport%20const%20objectFreeze%3DObject.freeze%3Bexport%20const%20objectDefineProperties%3DObject.defineProperties%3Bexport%20const%20numberIsNaN%3DNumber.isNaN%3Bexport%20const%20arrayIsArray%3DArray.isArray%3Bexport%20const%20promise%3DPromise%3Bexport%20const%20typeError%3DTypeError%3Bexport%20const%20error%3DError%3B";

#[derive(Debug, Clone)]
pub(crate) struct ReferenceSupport {
    pub(crate) names: HashMap<usize, String>,
    pub(crate) statements: Vec<String>,
    pub(crate) forms: Vec<SExpr>,
}

pub(crate) fn prepare(forms: &[SExpr]) -> Result<ReferenceSupport, LyknError> {
    let mut refs = Vec::new();
    let mut used = HashSet::new();
    let mut reserved = HashSet::new();
    fn visit(
        node: &SExpr,
        refs: &mut Vec<(usize, HostReference)>,
        used: &mut HashSet<HostReference>,
        reserved: &mut HashSet<String>,
    ) {
        if let Some(reference) = node.host_reference() {
            refs.push((node as *const SExpr as usize, reference));
            used.insert(reference);
        }
        if let Some(name) = node.as_atom() {
            for segment in name.split(':') {
                reserved.insert(to_js_identifier(segment));
            }
        }
        match node {
            SExpr::List { values, .. } => values
                .iter()
                .for_each(|child| visit(child, refs, used, reserved)),
            SExpr::Cons { car, cdr, .. } => {
                visit(car, refs, used, reserved);
                visit(cdr, refs, used, reserved);
            }
            _ => {}
        }
    }
    for form in forms {
        visit(form, &mut refs, &mut used, &mut reserved);
    }
    if used.is_empty() {
        return Ok(ReferenceSupport {
            names: HashMap::new(),
            statements: Vec::new(),
            forms: Vec::new(),
        });
    }
    let mut aliases = HashMap::<HostReference, String>::new();
    for reference in all_references() {
        if !used.contains(&reference) {
            continue;
        }
        let base = format!("lyknIntrinsic{}", reference.alias_stem());
        let mut suffix = 0_u64;
        let name = loop {
            let candidate = format!("{base}{suffix}");
            if !reserved.contains(&candidate) {
                break candidate;
            }
            suffix = suffix
                .checked_add(1)
                .ok_or_else(|| invalid_reference("intrinsic alias namespace exhausted"))?;
        };
        reserved.insert(name.clone());
        aliases.insert(reference, name);
    }
    let names = refs
        .into_iter()
        .map(|(address, reference)| (address, aliases[&reference].clone()))
        .collect();
    let mut statements = Vec::new();
    let mut local_forms = Vec::new();
    let mut inline = Vec::new();
    let span = crate::reader::source_loc::Span::default();
    for reference in all_references()
        .into_iter()
        .filter(|reference| aliases.contains_key(reference))
    {
        let name = &aliases[&reference];
        if crate::protected_host::module_binds_root(forms, reference.root()) {
            inline.push(format!("{} as {name}", inline_export(reference)));
        } else {
            let member = reference.member();
            let value = match member {
                Some(member) => format!("{}.{member}", reference.root()),
                None => reference.root().to_string(),
            };
            let kernel_value = match member {
                Some(member) => format!("{}:{member}", reference.root()),
                None => reference.root().to_string(),
            };
            statements.push(format!("const {name} = {value};"));
            local_forms.push(SExpr::List {
                values: vec![
                    SExpr::atom("const", span),
                    SExpr::atom(name, span),
                    SExpr::atom(kernel_value, span),
                ],
                span,
            });
        }
    }
    if !inline.is_empty() {
        statements.push(format!(
            "import {{{}}} from \"{}\";",
            inline.join(", "),
            INLINE_REFERENCES_MODULE
        ));
        let imports = all_references()
            .into_iter()
            .filter_map(|reference| {
                let name = aliases.get(&reference)?;
                crate::protected_host::module_binds_root(forms, reference.root()).then(|| {
                    SExpr::List {
                        values: vec![
                            SExpr::atom("alias", span),
                            SExpr::atom(inline_export(reference), span),
                            SExpr::atom(name, span),
                        ],
                        span,
                    }
                })
            })
            .collect::<Vec<_>>();
        local_forms.push(SExpr::List {
            values: vec![
                SExpr::atom("import", span),
                SExpr::String {
                    value: INLINE_REFERENCES_MODULE.to_string(),
                    span,
                },
                SExpr::List {
                    values: imports,
                    span,
                },
            ],
            span,
        });
    }
    Ok(ReferenceSupport {
        names,
        statements,
        forms: local_forms,
    })
}

fn inline_export(reference: HostReference) -> &'static str {
    match reference {
        HostReference::Symbol => "symbol",
        HostReference::SymbolFor => "symbolFor",
        HostReference::ObjectFreeze => "objectFreeze",
        HostReference::ObjectDefineProperties => "objectDefineProperties",
        HostReference::NumberIsNaN => "numberIsNaN",
        HostReference::ArrayIsArray => "arrayIsArray",
        HostReference::Promise => "promise",
        HostReference::TypeError => "typeError",
        HostReference::Error => "error",
    }
}

pub(crate) fn lower_forms(forms: &[SExpr]) -> Result<Vec<SExpr>, LyknError> {
    let mut lowered = forms.to_vec();
    if !prepare(&lowered)?.names.is_empty() {
        fn lower(node: &mut SExpr, names: &HashMap<usize, String>) {
            if let Some(name) = names.get(&(node as *const SExpr as usize)) {
                node.finalize_host_reference(name.clone());
            }
            match node {
                SExpr::List { values, .. } => {
                    values.iter_mut().for_each(|child| lower(child, names))
                }
                SExpr::Cons { car, cdr, .. } => {
                    lower(car, names);
                    lower(cdr, names);
                }
                _ => {}
            }
        }
        // Addresses above belong to the original input. Recompute against the clone before lowering.
        let support = prepare(&lowered)?;
        for form in &mut lowered {
            lower(form, &support.names);
        }
        let mut generated = support.forms;
        let directives = lowered
            .iter()
            .take_while(|form| matches!(form, SExpr::String { .. }))
            .count();
        generated.splice(..0, lowered.drain(..directives));
        generated.extend(lowered);
        lowered = generated;
    }
    Ok(lowered)
}

pub(crate) fn invalid_reference(message: &str) -> LyknError {
    LyknError::Codegen(crate::diagnostics::Diagnostic {
        severity: crate::diagnostics::Severity::Error,
        message: format!("internal host reference error: {message}"),
        span: crate::reader::source_loc::Span::default(),
        suggestion: None,
    })
}
