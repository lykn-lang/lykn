//! Kernel emitter — transforms typed surface AST to kernel S-expression forms.
//!
//! The emitter is the final compilation stage in the Rust pipeline. It takes
//! classified `SurfaceForm` nodes and produces kernel `SExpr` nodes that the
//! JS kernel compiler can then lower to JavaScript.

pub mod context;
pub mod contracts;
pub mod dts;
pub mod forms;
pub mod gensym;
pub mod json;
pub mod type_checks;

use crate::analysis::type_registry::TypeRegistry;
use crate::ast::sexpr::SExpr;
use crate::ast::surface::SurfaceForm;

use context::EmitterContext;
use forms::{emit_form_raw_checked, finalize_completion_value_markers};
use json::emit_module_json;

/// Emit a slice of surface forms to kernel `SExpr` nodes.
///
/// Each surface form may produce one or more kernel forms. The results are
/// collected in order. When `strip_assertions` is `true`, type-check
/// assertions and contract checks are omitted from the output.
pub fn emit(
    forms: &[SurfaceForm],
    registry: &TypeRegistry,
    strip_assertions: bool,
) -> Result<Vec<SExpr>, crate::error::LyknError> {
    let mut ctx = EmitterContext::new(strip_assertions);
    let mut result = Vec::new();
    for form in forms {
        result.extend(emit_form_raw_checked(form, &mut ctx, registry)?);
    }
    finalize_completion_value_markers(&mut result, &mut ctx);
    if let Some(diagnostic) = crate::protected_host::validate_program(
        &result,
        crate::protected_host::InputDialect::Kernel,
    )
    .into_iter()
    .next()
    {
        return Err(crate::error::LyknError::Codegen(diagnostic));
    }
    materialize_host_invocations(&mut result)?;
    crate::codegen::host_references::lower_forms(&result)
}

fn materialize_host_invocations(forms: &mut Vec<SExpr>) -> Result<(), crate::error::LyknError> {
    use crate::codegen::host_invocation::{InvocationRequest, SupportStrategy, prepare};
    use crate::protected_host::IntrinsicId;
    use crate::reader::source_loc::Span;

    fn collect<'a>(
        node: &'a SExpr,
        requests: &mut Vec<InvocationRequest<'a>>,
    ) -> Result<(), crate::error::LyknError> {
        match node {
            SExpr::List { values, .. } => {
                let marked_head = values.first().is_some_and(SExpr::is_host_invocation);
                if marked_head {
                    crate::codegen::host_invocation::validate_anchor(node)?;
                    requests.push(InvocationRequest {
                        id: IntrinsicId::ReflectApply,
                        anchor: node,
                    });
                }
                for (index, child) in values.iter().enumerate() {
                    if child.is_host_invocation() {
                        if marked_head && index == 0 {
                            continue;
                        }
                        return Err(crate::codegen::host_invocation::invalid_request(
                            "invocation marker is outside a request callee",
                        ));
                    }
                    collect(child, requests)?;
                }
            }
            SExpr::Cons { car, cdr, .. } => {
                collect(car, requests)?;
                collect(cdr, requests)?;
            }
            _ if node.is_host_invocation() => {
                return Err(crate::codegen::host_invocation::invalid_request(
                    "orphaned invocation marker",
                ));
            }
            _ => {}
        }
        Ok(())
    }

    let mut requests = Vec::new();
    for form in forms.iter() {
        collect(form, &mut requests)?;
    }
    if requests.is_empty() {
        return Ok(());
    }
    let expected = requests.len();
    let prepared = prepare(forms, &requests)?;
    let support = prepared.support.ok_or_else(|| {
        crate::codegen::host_invocation::invalid_request(
            "requests completed without invocation support",
        )
    })?;
    let helper_name = support.name;
    let protected_slot = prepared.slot.replace('.', ":");
    drop(requests);

    fn replace(node: &mut SExpr, helper_name: &str, count: &mut usize) {
        let SExpr::List { values, span } = node else {
            if let SExpr::Cons { car, cdr, .. } = node {
                replace(car, helper_name, count);
                replace(cdr, helper_name, count);
            }
            return;
        };
        for child in values.iter_mut() {
            replace(child, helper_name, count);
        }
        if values.first().is_some_and(SExpr::is_host_invocation) {
            let mut values = std::mem::take(values);
            values[0].clear_host_invocation();
            let mut call = Vec::with_capacity(values.len() + 1);
            call.push(SExpr::atom(helper_name, *span));
            call.extend(values);
            *node = SExpr::List {
                values: call,
                span: *span,
            };
            *count += 1;
        }
    }

    let mut consumed = 0;
    for form in forms.iter_mut() {
        replace(form, &helper_name, &mut consumed);
    }
    if consumed != expected {
        return Err(crate::codegen::host_invocation::invalid_request(
            "orphaned or unconsumed invocation marker",
        ));
    }

    let span = Span::default();
    let support_form = match support.strategy {
        SupportStrategy::LocalFunction => SExpr::List {
            values: vec![
                SExpr::atom("function", span),
                SExpr::atom(helper_name, span),
                SExpr::List {
                    values: ["fn", "receiver", "argv"]
                        .into_iter()
                        .map(|name| SExpr::atom(name, span))
                        .collect(),
                    span,
                },
                SExpr::List {
                    values: vec![
                        SExpr::atom("return", span),
                        SExpr::List {
                            values: [protected_slot.as_str(), "fn", "receiver", "argv"]
                                .into_iter()
                                .map(|name| SExpr::atom(name, span))
                                .collect(),
                            span,
                        },
                    ],
                    span,
                },
            ],
            span,
        },
        SupportStrategy::InlineModuleImport => SExpr::List {
            values: vec![
                SExpr::atom("import", span),
                SExpr::String {
                    value: crate::codegen::host_invocation::INLINE_APPLY_MODULE.to_string(),
                    span,
                },
                SExpr::List {
                    values: vec![SExpr::List {
                        values: vec![
                            SExpr::atom("alias", span),
                            SExpr::atom("apply", span),
                            SExpr::atom(helper_name, span),
                        ],
                        span,
                    }],
                    span,
                },
            ],
            span,
        },
    };
    let directives = forms
        .iter()
        .take_while(|form| matches!(form, SExpr::String { .. }))
        .count();
    forms.insert(directives, support_form);
    Ok(())
}

/// Emit a slice of surface forms to a pretty-printed JSON string.
///
/// This is a convenience function that calls [`emit`] followed by JSON
/// serialization.
pub fn emit_json(
    forms: &[SurfaceForm],
    registry: &TypeRegistry,
    strip_assertions: bool,
) -> Result<String, crate::error::LyknError> {
    let kernel = emit(forms, registry, strip_assertions)?;
    emit_module_json(&kernel)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::ast::surface::SurfaceForm;
    use crate::reader::source_loc::Span;

    use forms::{atom, list, num, str_lit};

    fn s() -> Span {
        Span::default()
    }

    #[test]
    fn test_emit_empty_input() {
        let registry = TypeRegistry::default();
        let result = emit(&[], &registry, false).unwrap();
        assert!(result.is_empty());
    }

    #[test]
    fn test_emit_multiple_forms() {
        let registry = TypeRegistry::default();
        let forms = vec![
            SurfaceForm::Bind {
                name: atom("x"),
                type_ann: None,
                value: num(1.0),
                span: s(),
            },
            SurfaceForm::Bind {
                name: atom("y"),
                type_ann: None,
                value: num(2.0),
                span: s(),
            },
        ];
        let result = emit(&forms, &registry, false).unwrap();
        assert_eq!(result.len(), 2);
    }

    #[test]
    fn test_emit_json_produces_valid_json() {
        let registry = TypeRegistry::default();
        let forms = vec![SurfaceForm::Bind {
            name: atom("x"),
            type_ann: None,
            value: num(42.0),
            span: s(),
        }];
        let json_str = emit_json(&forms, &registry, false).unwrap();
        let parsed: serde_json::Value = serde_json::from_str(&json_str).unwrap();
        assert!(parsed.is_array());
        let arr = parsed.as_array().unwrap();
        assert_eq!(arr.len(), 1);
        // {"type": "list", "values": [{"type": "atom", "value": "const"}, ...]}
        let form = &arr[0];
        assert_eq!(form["type"], "list");
        let values = form["values"].as_array().unwrap();
        assert_eq!(values[0]["type"], "atom");
        assert_eq!(values[0]["value"], "const");
        assert_eq!(values[1]["type"], "atom");
        assert_eq!(values[1]["value"], "x");
        assert_eq!(values[2]["type"], "number");
        assert_eq!(values[2]["value"], 42.0);
    }

    #[test]
    fn test_emit_json_strip_assertions() {
        let registry = TypeRegistry::default();
        let forms = vec![SurfaceForm::KernelPassthrough {
            raw: list(vec![atom("console:log"), str_lit("hello")]),
            span: s(),
        }];

        let json_normal = emit_json(&forms, &registry, false).unwrap();
        let json_stripped = emit_json(&forms, &registry, true).unwrap();
        // For passthrough, stripping assertions makes no difference
        assert_eq!(json_normal, json_stripped);
    }

    #[test]
    fn test_emit_preserves_form_order() {
        let registry = TypeRegistry::default();
        let forms = vec![
            SurfaceForm::Bind {
                name: atom("a"),
                type_ann: None,
                value: num(1.0),
                span: s(),
            },
            SurfaceForm::Bind {
                name: atom("b"),
                type_ann: None,
                value: num(2.0),
                span: s(),
            },
            SurfaceForm::Bind {
                name: atom("c"),
                type_ann: None,
                value: num(3.0),
                span: s(),
            },
        ];
        let result = emit(&forms, &registry, false).unwrap();
        assert_eq!(result.len(), 3);

        // Check ordering
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[1].as_atom(), Some("a"));
        }
        if let SExpr::List { values, .. } = &result[1] {
            assert_eq!(values[1].as_atom(), Some("b"));
        }
        if let SExpr::List { values, .. } = &result[2] {
            assert_eq!(values[1].as_atom(), Some("c"));
        }
    }

    #[test]
    fn checked_single_form_rejects_ordered_member_invocation_request() {
        let source = "(func probe :args (:any stop) :returns :any :body (bind result (receiver:read-entry (if stop (return 92) 1) 8)) result)";
        let parsed = crate::reader::read(source).expect("parse member call source");
        let mut forms = crate::classifier::classify(&parsed).expect("classify member call source");
        let form = forms.remove(0);
        let error = forms::emit_form(
            &form,
            &mut EmitterContext::new(false),
            &TypeRegistry::default(),
        )
        .expect_err("standalone checked form cannot materialize a whole-unit request");
        assert!(
            error
                .to_string()
                .contains("ordered member call requires whole-module emission; use emitter::emit")
        );
    }

    #[test]
    fn test_emit_mixed_forms() {
        let registry = TypeRegistry::default();
        let forms = vec![
            SurfaceForm::Bind {
                name: atom("x"),
                type_ann: None,
                value: num(1.0),
                span: s(),
            },
            SurfaceForm::FunctionCall {
                head: atom("console:log"),
                args: vec![atom("x")],
                span: s(),
            },
        ];
        let result = emit(&forms, &registry, false).unwrap();
        assert_eq!(result.len(), 2);

        // First is a const binding
        if let SExpr::List { values, .. } = &result[0] {
            assert_eq!(values[0].as_atom(), Some("const"));
        }
        // Second is a function call
        if let SExpr::List { values, .. } = &result[1] {
            assert_eq!(values[0].as_atom(), Some("console:log"));
        }
    }
}
