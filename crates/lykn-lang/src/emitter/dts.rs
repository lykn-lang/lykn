//! TypeScript .d.ts declaration emitter.
//!
//! M10: emits .d.ts files alongside compiled .js for lykn packages with
//! :type annotations. The .d.ts is auxiliary type information for TypeScript
//! consumers; the .js remains the canonical compiled output.

use std::collections::HashSet;

use crate::analysis::{AnalyzedUnit, type_registry::TypeRegistry};
use crate::ast::sexpr::SExpr;
use crate::ast::surface::{
    ArrayParamElement, Constructor, DestructuredField, FuncClause, ParamShape, SurfaceForm,
    TypeAnnotation,
};
use crate::binding::{BindingKind, binding_names_in_pattern};
use crate::codegen::names::to_js_identifier;
use crate::diagnostics::{Diagnostic, Severity};

pub fn lykn_type_to_ts(ann: &TypeAnnotation, _registry: &TypeRegistry) -> String {
    match ann.name.as_str() {
        "number" => "number".to_string(),
        "string" => "string".to_string(),
        "boolean" => "boolean".to_string(),
        "function" => "Function".to_string(),
        "object" => "object".to_string(),
        "array" => "unknown[]".to_string(),
        "symbol" => "symbol".to_string(),
        "bigint" => "bigint".to_string(),
        "any" => "unknown".to_string(),
        "void" => "void".to_string(),
        "promise" => "Promise<unknown>".to_string(),
        name => name.to_string(),
    }
}

pub fn param_shape_to_ts(shape: &ParamShape, registry: &TypeRegistry) -> String {
    match shape {
        ParamShape::Simple(tp) => lykn_type_to_ts(&tp.type_ann, registry),
        ParamShape::DestructuredObject { fields, .. } => {
            let parts: Vec<String> = fields
                .iter()
                .map(|f| match f {
                    DestructuredField::Simple(tp) => {
                        let name = to_js_identifier(&tp.name);
                        let ts_type = lykn_type_to_ts(&tp.type_ann, registry);
                        if tp.default_value.is_some() {
                            format!("{name}?: {ts_type} | undefined")
                        } else {
                            format!("{name}: {ts_type}")
                        }
                    }
                    DestructuredField::Nested {
                        alias_name,
                        pattern,
                        ..
                    } => {
                        let name = to_js_identifier(alias_name);
                        let inner = param_shape_to_ts(pattern, registry);
                        format!("{name}: {inner}")
                    }
                })
                .collect();
            format!("{{ {} }}", parts.join("; "))
        }
        ParamShape::DestructuredArray { elements, .. } => {
            let last_required = elements.iter().rposition(|element| match element {
                ArrayParamElement::Typed(tp) => tp.default_value.is_none(),
                ArrayParamElement::Nested { .. } | ArrayParamElement::NestedWithAlias { .. } => {
                    true
                }
                ArrayParamElement::Rest(_) | ArrayParamElement::Skip(_) => false,
            });
            let mut parts: Vec<String> = Vec::new();
            for (index, elem) in elements.iter().enumerate() {
                match elem {
                    ArrayParamElement::Typed(tp) => {
                        let ty = lykn_type_to_ts(&tp.type_ann, registry);
                        if tp.default_value.is_some() {
                            if last_required.is_none_or(|required| index > required) {
                                parts.push(format!("({ty} | undefined)?"));
                            } else {
                                parts.push(format!("{ty} | undefined"));
                            }
                        } else {
                            parts.push(ty);
                        }
                    }
                    ArrayParamElement::Rest(tp) => {
                        let inner = lykn_type_to_ts(&tp.type_ann, registry);
                        parts.push(format!("...{inner}[]"));
                    }
                    ArrayParamElement::Skip(_) => {
                        if last_required.is_none_or(|required| index > required) {
                            parts.push("(unknown | undefined)?".to_string());
                        } else {
                            parts.push("unknown".to_string());
                        }
                    }
                    ArrayParamElement::Nested { pattern, .. }
                    | ArrayParamElement::NestedWithAlias { pattern, .. } => {
                        parts.push(param_shape_to_ts(pattern, registry));
                    }
                }
            }
            format!("[{}]", parts.join(", "))
        }
    }
}

fn emit_func_args(clauses_args: &[ParamShape], registry: &TypeRegistry) -> String {
    let last_required = clauses_args.iter().rposition(|shape| match shape {
        ParamShape::Simple(tp) => tp.default_value.is_none() && !tp.is_rest,
        ParamShape::DestructuredObject { .. } | ParamShape::DestructuredArray { .. } => true,
    });
    let mut used_names: HashSet<String> = clauses_args
        .iter()
        .filter_map(|shape| match shape {
            ParamShape::Simple(tp) if tp.name != "_" => Some(to_js_identifier(&tp.name)),
            _ => None,
        })
        .collect();

    clauses_args
        .iter()
        .enumerate()
        .map(|(index, shape)| {
            let arg_name = match shape {
                ParamShape::Simple(tp) if tp.name != "_" => to_js_identifier(&tp.name),
                _ => allocate_arg_name(index, &mut used_names),
            };
            match shape {
                ParamShape::Simple(tp) if tp.is_rest => {
                    let ty = lykn_type_to_ts(&tp.type_ann, registry);
                    format!("...{arg_name}: {ty}[]")
                }
                ParamShape::Simple(tp) if tp.default_value.is_some() => {
                    let ty = lykn_type_to_ts(&tp.type_ann, registry);
                    if last_required.is_none_or(|required| index > required) {
                        format!("{arg_name}?: {ty}")
                    } else {
                        format!("{arg_name}: {ty} | undefined")
                    }
                }
                _ => {
                    let arg_type = param_shape_to_ts(shape, registry);
                    format!("{arg_name}: {arg_type}")
                }
            }
        })
        .collect::<Vec<_>>()
        .join(", ")
}

fn allocate_arg_name(index: usize, used_names: &mut HashSet<String>) -> String {
    let base = format!("arg{index}");
    if used_names.insert(base.clone()) {
        return base;
    }
    let mut suffix = 1;
    loop {
        let candidate = format!("{base}_{suffix}");
        if used_names.insert(candidate.clone()) {
            return candidate;
        }
        suffix += 1;
    }
}

pub fn emit_func_dts(
    name: &str,
    clauses: &[FuncClause],
    exported: bool,
    registry: &TypeRegistry,
    _file_path: &str,
    warnings: &mut Vec<Diagnostic>,
) -> String {
    let modifier = if exported { "export " } else { "declare " };
    let js_name = to_js_identifier(name);
    let mut out = String::new();

    for clause in clauses {
        if let Some(ref pre) = clause.pre {
            out.push_str(&format!(
                "/** @requires {{{}}} */\n",
                format_sexpr_brief(pre)
            ));
        }
        if let Some(ref post) = clause.post {
            out.push_str(&format!(
                "/** @ensures {{{}}} */\n",
                format_sexpr_brief(post)
            ));
        }

        let args = emit_func_args(&clause.args, registry);

        let return_type = match &clause.returns {
            Some(ann) => lykn_type_to_ts(ann, registry),
            None => {
                if exported {
                    warnings.push(Diagnostic {
                        severity: Severity::Warning,
                        message: format!(
                            "exported function `{name}` has no `:returns` annotation; \
                             .d.ts will use `unknown`"
                        ),
                        span: clause.span,
                        suggestion: Some(format!("add `:returns :type` to `{name}`")),
                    });
                }
                "unknown".to_string()
            }
        };

        out.push_str(&format!(
            "{modifier}function {js_name}({args}): {return_type};\n"
        ));
    }
    out
}

pub fn emit_type_dts(
    name: &str,
    constructors: &[Constructor],
    exported: bool,
    registry: &TypeRegistry,
) -> String {
    let modifier = if exported { "export " } else { "" };
    let variants: Vec<String> = constructors
        .iter()
        .map(|c| {
            let mut parts = vec![format!("tag: \"{}\"", c.name)];
            for field in &c.fields {
                let ts_type = lykn_type_to_ts(&field.type_ann, registry);
                let field_name = to_js_identifier(&field.name);
                parts.push(format!("{field_name}: {ts_type}"));
            }
            format!("{{ {} }}", parts.join("; "))
        })
        .collect();

    if variants.len() == 1 {
        format!("{modifier}type {name} = {};\n", variants[0])
    } else {
        let joined = variants
            .iter()
            .map(|v| format!("  | {v}"))
            .collect::<Vec<_>>()
            .join("\n");
        format!("{modifier}type {name} =\n{joined};\n")
    }
}

pub fn emit_bind_dts(
    name: &str,
    type_ann: &TypeAnnotation,
    exported: bool,
    registry: &TypeRegistry,
) -> String {
    let modifier = if exported { "export " } else { "declare " };
    let js_name = to_js_identifier(name);
    let ts_type = lykn_type_to_ts(type_ann, registry);
    format!("{modifier}const {js_name}: {ts_type};\n")
}

/// Build module declarations from the same analyzed forms used by emission.
///
/// Returns declaration text and any warnings generated while interpreting the
/// file path and exported callable contracts.
pub fn emit_dts_module(unit: &AnalyzedUnit, file_path: &str) -> (String, Vec<Diagnostic>) {
    let forms = unit.forms();
    let registry = unit.type_registry();
    let mut out = String::new();
    let mut warnings = Vec::new();
    let named_exports = named_export_set(forms);

    for form in forms {
        match form {
            SurfaceForm::Exports { .. } => {}
            SurfaceForm::Export { inner, .. } => match inner.as_ref() {
                SurfaceForm::Func { name, clauses, .. } => {
                    out.push_str(&emit_func_dts(
                        name,
                        clauses,
                        true,
                        registry,
                        file_path,
                        &mut warnings,
                    ));
                }
                SurfaceForm::Bind {
                    name,
                    type_ann,
                    value,
                    ..
                } => {
                    out.push_str(&emit_bind_pattern_dts(
                        name,
                        type_ann.as_ref(),
                        value,
                        true,
                        None,
                        registry,
                    ));
                }
                SurfaceForm::BindGroup { bindings, .. } => {
                    for binding in bindings {
                        out.push_str(&emit_bind_pattern_dts(
                            &binding.name,
                            binding.type_ann.as_ref(),
                            &binding.value,
                            true,
                            None,
                            registry,
                        ));
                    }
                }
                SurfaceForm::Type {
                    name, constructors, ..
                } => {
                    out.push_str(&emit_type_dts(name, constructors, true, registry));
                    for c in constructors {
                        out.push_str(&emit_constructor_fn_dts(name, c, true, registry));
                    }
                }
                _ => {}
            },
            SurfaceForm::Func { name, clauses, .. } if named_exports.contains(name) => {
                out.push_str(&emit_func_dts(
                    name,
                    clauses,
                    true,
                    registry,
                    file_path,
                    &mut warnings,
                ));
            }
            SurfaceForm::Bind {
                name,
                type_ann,
                value,
                ..
            } => {
                out.push_str(&emit_bind_pattern_dts(
                    name,
                    type_ann.as_ref(),
                    value,
                    true,
                    Some(&named_exports),
                    registry,
                ));
            }
            SurfaceForm::BindGroup { bindings, .. } => {
                for binding in bindings {
                    out.push_str(&emit_bind_pattern_dts(
                        &binding.name,
                        binding.type_ann.as_ref(),
                        &binding.value,
                        true,
                        Some(&named_exports),
                        registry,
                    ));
                }
            }
            SurfaceForm::Type {
                name, constructors, ..
            } => {
                out.push_str(&emit_type_dts(name, constructors, false, registry));
                for c in constructors {
                    if named_exports.contains(&c.name) {
                        out.push_str(&emit_constructor_fn_dts(name, c, true, registry));
                    }
                }
            }
            _ => {}
        }
    }

    if has_only_empty_inline_bind_exports(forms) {
        out.push_str("export {};\n");
    }

    (out, warnings)
}

fn emit_bind_pattern_dts(
    pattern: &SExpr,
    type_ann: Option<&TypeAnnotation>,
    value: &SExpr,
    exported: bool,
    selected_names: Option<&HashSet<String>>,
    registry: &TypeRegistry,
) -> String {
    let scalar_name = pattern.as_atom();
    let mut out = String::new();
    for binding in binding_names_in_pattern(pattern, BindingKind::Bind) {
        if selected_names.is_some_and(|names| !names.contains(&binding.name)) {
            continue;
        }
        if scalar_name == Some(binding.name.as_str()) {
            if let Some(ann) = type_ann {
                out.push_str(&emit_bind_dts(&binding.name, ann, exported, registry));
            } else {
                out.push_str(&emit_bind_inferred_dts(&binding.name, value, exported));
            }
        } else {
            out.push_str(&emit_bind_dts(
                &binding.name,
                &TypeAnnotation {
                    name: "any".to_string(),
                    span: binding.span,
                },
                exported,
                registry,
            ));
        }
    }
    out
}

fn is_empty_inline_bind_export(form: &SurfaceForm) -> bool {
    match form {
        SurfaceForm::Bind { name, .. } => {
            binding_names_in_pattern(name, BindingKind::Bind).is_empty()
        }
        SurfaceForm::BindGroup { bindings, .. } => bindings
            .iter()
            .all(|binding| binding_names_in_pattern(&binding.name, BindingKind::Bind).is_empty()),
        _ => false,
    }
}

fn has_only_empty_inline_bind_exports(forms: &[SurfaceForm]) -> bool {
    let mut saw_explicit_export = false;
    for form in forms {
        match form {
            SurfaceForm::Export {
                inner, extra_args, ..
            } => {
                saw_explicit_export = true;
                if !extra_args.is_empty() || !is_empty_inline_bind_export(inner) {
                    return false;
                }
            }
            SurfaceForm::Exports { .. } => return false,
            SurfaceForm::KernelPassthrough {
                raw: SExpr::List { values, .. },
                ..
            } if values.first().and_then(SExpr::as_form_head) == Some("export") => {
                return false;
            }
            _ => {}
        }
    }
    saw_explicit_export
}

fn named_export_set(forms: &[SurfaceForm]) -> HashSet<String> {
    let mut out = HashSet::new();
    for form in forms {
        if let SurfaceForm::Exports { names, .. } = form {
            out.extend(
                names
                    .iter()
                    .filter_map(|name| name.as_atom().map(str::to_string)),
            );
        }
    }
    out
}

fn infer_literal_ts_type(expr: &crate::ast::sexpr::SExpr) -> &'static str {
    use crate::ast::sexpr::SExpr;
    match expr {
        SExpr::String { .. } => "string",
        SExpr::Number { .. } => "number",
        SExpr::Bool { .. } => "boolean",
        _ => "unknown",
    }
}

fn emit_bind_inferred_dts(name: &str, value: &crate::ast::sexpr::SExpr, exported: bool) -> String {
    let modifier = if exported { "export " } else { "declare " };
    let js_name = to_js_identifier(name);
    let ts_type = infer_literal_ts_type(value);
    format!("{modifier}const {js_name}: {ts_type};\n")
}

fn emit_constructor_fn_dts(
    type_name: &str,
    constructor: &Constructor,
    exported: bool,
    registry: &TypeRegistry,
) -> String {
    let modifier = if exported { "export " } else { "declare " };
    if constructor.fields.is_empty() {
        format!("{modifier}const {}: {type_name};\n", constructor.name)
    } else {
        let args: Vec<String> = constructor
            .fields
            .iter()
            .map(|f| {
                let name = to_js_identifier(&f.name);
                let ts_type = lykn_type_to_ts(&f.type_ann, registry);
                format!("{name}: {ts_type}")
            })
            .collect();
        format!(
            "{modifier}function {}({}): {type_name};\n",
            constructor.name,
            args.join(", ")
        )
    }
}

fn format_sexpr_brief(expr: &crate::ast::sexpr::SExpr) -> String {
    use crate::ast::sexpr::SExpr;
    match expr {
        a @ SExpr::Atom { .. } => a.as_atom().unwrap().to_string(),
        SExpr::String { value, .. } => format!("\"{value}\""),
        SExpr::Number { value, .. } => value.to_string(),
        SExpr::Bool { value, .. } => value.to_string(),
        SExpr::Null { .. } => "null".to_string(),
        SExpr::Keyword { value, .. } => format!(":{value}"),
        SExpr::List { values, .. } => {
            let inner: Vec<String> = values.iter().map(format_sexpr_brief).collect();
            format!("({})", inner.join(" "))
        }
        SExpr::Cons { car, cdr, .. } => {
            format!(
                "({} . {})",
                format_sexpr_brief(car),
                format_sexpr_brief(cdr)
            )
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::analysis::type_registry::TypeRegistry;
    use crate::ast::surface::TypedParam;
    use crate::reader::source_loc::Span;

    fn s() -> Span {
        Span::default()
    }

    fn ann(name: &str) -> TypeAnnotation {
        TypeAnnotation {
            name: name.to_string(),
            span: s(),
        }
    }

    fn tp(type_name: &str, param_name: &str) -> TypedParam {
        TypedParam {
            type_ann: ann(type_name),
            name: param_name.to_string(),
            name_span: s(),
            default_value: None,
            is_rest: false,
        }
    }

    fn reg() -> TypeRegistry {
        TypeRegistry::default()
    }

    fn analyzed(source: &str) -> AnalyzedUnit {
        let read = crate::reader::read(source).expect("fixture reads");
        let resolved = crate::resolver::resolve(&read);
        let classified = crate::classifier::classify(&resolved).expect("fixture classifies");
        crate::analysis::analyze(classified).expect("fixture analyzes")
    }

    #[test]
    fn test_type_number() {
        assert_eq!(lykn_type_to_ts(&ann("number"), &reg()), "number");
    }
    #[test]
    fn test_type_string() {
        assert_eq!(lykn_type_to_ts(&ann("string"), &reg()), "string");
    }
    #[test]
    fn test_type_boolean() {
        assert_eq!(lykn_type_to_ts(&ann("boolean"), &reg()), "boolean");
    }
    #[test]
    fn test_type_function() {
        assert_eq!(lykn_type_to_ts(&ann("function"), &reg()), "Function");
    }
    #[test]
    fn test_type_object() {
        assert_eq!(lykn_type_to_ts(&ann("object"), &reg()), "object");
    }
    #[test]
    fn test_type_array() {
        assert_eq!(lykn_type_to_ts(&ann("array"), &reg()), "unknown[]");
    }
    #[test]
    fn test_type_symbol() {
        assert_eq!(lykn_type_to_ts(&ann("symbol"), &reg()), "symbol");
    }
    #[test]
    fn test_type_bigint() {
        assert_eq!(lykn_type_to_ts(&ann("bigint"), &reg()), "bigint");
    }
    #[test]
    fn test_type_any() {
        assert_eq!(lykn_type_to_ts(&ann("any"), &reg()), "unknown");
    }
    #[test]
    fn test_type_void() {
        assert_eq!(lykn_type_to_ts(&ann("void"), &reg()), "void");
    }
    #[test]
    fn test_type_promise() {
        assert_eq!(lykn_type_to_ts(&ann("promise"), &reg()), "Promise<unknown>");
    }
    #[test]
    fn test_type_user() {
        assert_eq!(lykn_type_to_ts(&ann("MyType"), &reg()), "MyType");
    }

    #[test]
    fn test_param_simple() {
        let shape = ParamShape::Simple(tp("number", "x"));
        assert_eq!(param_shape_to_ts(&shape, &reg()), "number");
    }

    #[test]
    fn test_param_destructured_object() {
        let shape = ParamShape::DestructuredObject {
            fields: vec![
                DestructuredField::Simple(tp("string", "host")),
                DestructuredField::Simple(TypedParam {
                    type_ann: ann("boolean"),
                    name: "ssl".to_string(),
                    name_span: s(),
                    default_value: Some(crate::ast::sexpr::SExpr::Bool {
                        value: true,
                        span: s(),
                    }),
                    is_rest: false,
                }),
            ],
            span: s(),
        };
        assert_eq!(
            param_shape_to_ts(&shape, &reg()),
            "{ host: string; ssl?: boolean | undefined }"
        );
    }

    #[test]
    fn test_param_destructured_array_with_rest() {
        let shape = ParamShape::DestructuredArray {
            elements: vec![
                ArrayParamElement::Typed(tp("string", "head")),
                ArrayParamElement::Rest(tp("number", "tail")),
            ],
            span: s(),
        };
        assert_eq!(param_shape_to_ts(&shape, &reg()), "[string, ...number[]]");
    }

    #[test]
    fn test_destructured_array_default_and_skip_optional_positions() {
        let shape = ParamShape::DestructuredArray {
            elements: vec![
                ArrayParamElement::Typed(TypedParam {
                    default_value: Some(crate::ast::sexpr::SExpr::Number {
                        value: 1.0,
                        span: s(),
                    }),
                    ..tp("number", "first")
                }),
                ArrayParamElement::Skip(s()),
                ArrayParamElement::Typed(tp("string", "last")),
                ArrayParamElement::Skip(s()),
            ],
            span: s(),
        };
        assert_eq!(
            param_shape_to_ts(&shape, &reg()),
            "[number | undefined, unknown, string, (unknown | undefined)?]"
        );
    }

    #[test]
    fn test_func_args_reserve_meaningful_names_before_allocating_discards() {
        let args = vec![
            ParamShape::Simple(tp("number", "_")),
            ParamShape::DestructuredObject {
                fields: vec![DestructuredField::Simple(tp("string", "field"))],
                span: s(),
            },
            ParamShape::Simple(tp("number", "arg0")),
            ParamShape::Simple(tp("string", "_value")),
            ParamShape::Simple(tp("boolean", "arg0_1")),
        ];
        assert_eq!(
            emit_func_args(&args, &reg()),
            "arg0_2: number, arg1: { field: string }, arg0: number, _value: string, arg0_1: boolean"
        );
    }

    #[test]
    fn test_func_args_describe_defaults_before_required_and_rest() {
        let args = vec![
            ParamShape::Simple(TypedParam {
                default_value: Some(crate::ast::sexpr::SExpr::Number {
                    value: 1.0,
                    span: s(),
                }),
                ..tp("number", "_")
            }),
            ParamShape::Simple(tp("string", "required")),
            ParamShape::Simple(TypedParam {
                name: "tail".to_string(),
                is_rest: true,
                ..tp("boolean", "tail")
            }),
        ];
        assert_eq!(
            emit_func_args(&args, &reg()),
            "arg0: number | undefined, required: string, ...tail: boolean[]"
        );
    }

    #[test]
    fn test_module_exports_from_successful_analyzed_unit_project_source_bindings() {
        let unit = analyzed(
            "(export (bind (object (alias _ count) _ (spread rest)) (obj :_ 7 :extra \"field\")))\n",
        );
        let (dts, warnings) = emit_dts_module(&unit, "fixture.lykn");
        assert_eq!(
            dts,
            "export const count: unknown;\nexport const rest: unknown;\n"
        );
        assert!(warnings.is_empty());
    }

    #[test]
    fn test_successful_fresh_analyzed_units_have_local_labels_and_keep_warnings() {
        let source = "(export (func first :args (:number _ :number arg0) :body 1))\n(export (func second :args (:number _ :number arg0) :body 2))\n";
        let first_unit = analyzed(source);
        let second_unit = analyzed(source);
        let (first, warnings) = emit_dts_module(&first_unit, "first.lykn");
        let (second, second_warnings) = emit_dts_module(&second_unit, "second.lykn");
        assert_eq!(first, second);
        assert!(first.contains("first(arg0_1: number, arg0: number): unknown;"));
        assert!(first.contains("second(arg0_1: number, arg0: number): unknown;"));
        assert_eq!(warnings.len(), 2);
        assert_eq!(second_warnings.len(), 2);
        assert!(
            warnings
                .iter()
                .all(|warning| warning.severity == Severity::Warning)
        );
        assert!(
            second_warnings
                .iter()
                .all(|warning| warning.severity == Severity::Warning)
        );
    }

    #[test]
    fn test_empty_module_marker_requires_only_handled_empty_inline_exports() {
        let empty = analyzed("(export (bind _ 99))\n");
        assert_eq!(emit_dts_module(&empty, "empty.lykn").0, "export {};\n");

        let mixed = analyzed("(export (bind _ 99))\n(export default-value)\n");
        assert!(emit_dts_module(&mixed, "mixed.lykn").0.is_empty());

        let escaped = analyzed("(export (bind _ 99))\n(kernel:export default-value)\n");
        assert!(emit_dts_module(&escaped, "escaped.lykn").0.is_empty());

        let local = analyzed("(bind _ 99)\n");
        assert!(emit_dts_module(&local, "local.lykn").0.is_empty());
    }

    #[test]
    fn test_emit_func_single_clause() {
        let clause = FuncClause {
            args: vec![ParamShape::Simple(tp("string", "name"))],
            returns: Some(ann("string")),
            pre: None,
            post: None,
            body: vec![],
            span: s(),
        };
        let mut warnings = vec![];
        let result = emit_func_dts("greet", &[clause], true, &reg(), "<test>", &mut warnings);
        assert_eq!(result, "export function greet(name: string): string;\n");
        assert!(warnings.is_empty());
    }

    #[test]
    fn test_emit_func_multi_clause_overloads() {
        let c1 = FuncClause {
            args: vec![ParamShape::Simple(tp("string", "name"))],
            returns: Some(ann("string")),
            pre: None,
            post: None,
            body: vec![],
            span: s(),
        };
        let c2 = FuncClause {
            args: vec![
                ParamShape::Simple(tp("string", "greeting")),
                ParamShape::Simple(tp("string", "name")),
            ],
            returns: Some(ann("string")),
            pre: None,
            post: None,
            body: vec![],
            span: s(),
        };
        let mut warnings = vec![];
        let result = emit_func_dts("greet", &[c1, c2], true, &reg(), "<test>", &mut warnings);
        assert!(result.contains("export function greet(name: string): string;"));
        assert!(result.contains("export function greet(greeting: string, name: string): string;"));
    }

    #[test]
    fn test_emit_func_no_returns_warning() {
        let clause = FuncClause {
            args: vec![ParamShape::Simple(tp("any", "x"))],
            returns: None,
            pre: None,
            post: None,
            body: vec![],
            span: s(),
        };
        let mut warnings = vec![];
        let result = emit_func_dts("untyped", &[clause], true, &reg(), "<test>", &mut warnings);
        assert!(result.contains(": unknown;"));
        assert_eq!(warnings.len(), 1);
        assert_eq!(warnings[0].severity, Severity::Warning);
    }

    #[test]
    fn test_emit_type_adt() {
        let constructors = vec![
            Constructor {
                name: "Some".to_string(),
                name_span: s(),
                fields: vec![tp("any", "value")],
                span: s(),
            },
            Constructor {
                name: "None".to_string(),
                name_span: s(),
                fields: vec![],
                span: s(),
            },
        ];
        let result = emit_type_dts("Option", &constructors, true, &reg());
        assert!(result.contains("tag: \"Some\"; value: unknown"));
        assert!(result.contains("tag: \"None\""));
        assert!(result.starts_with("export type Option ="));
    }

    #[test]
    fn test_emit_bind() {
        let result = emit_bind_dts("VERSION", &ann("string"), true, &reg());
        assert_eq!(result, "export const VERSION: string;\n");
    }

    #[test]
    fn test_emit_bind_lisp_case() {
        let result = emit_bind_dts("max-retries", &ann("number"), true, &reg());
        assert_eq!(result, "export const maxRetries: number;\n");
    }

    #[test]
    fn test_emit_bind_inferred_string() {
        let val = crate::ast::sexpr::SExpr::String {
            value: "hello".to_string(),
            span: s(),
        };
        assert_eq!(
            emit_bind_inferred_dts("NAME", &val, true),
            "export const NAME: string;\n"
        );
    }

    #[test]
    fn test_emit_bind_inferred_number() {
        let val = crate::ast::sexpr::SExpr::Number {
            value: 42.0,
            span: s(),
        };
        assert_eq!(
            emit_bind_inferred_dts("COUNT", &val, true),
            "export const COUNT: number;\n"
        );
    }

    #[test]
    fn test_emit_bind_inferred_boolean() {
        let val = crate::ast::sexpr::SExpr::Bool {
            value: true,
            span: s(),
        };
        assert_eq!(
            emit_bind_inferred_dts("ENABLED", &val, true),
            "export const ENABLED: boolean;\n"
        );
    }

    #[test]
    fn test_emit_bind_inferred_null_to_unknown() {
        let val = crate::ast::sexpr::SExpr::Null { span: s() };
        assert_eq!(
            emit_bind_inferred_dts("NOTHING", &val, true),
            "export const NOTHING: unknown;\n"
        );
    }

    #[test]
    fn test_emit_bind_inferred_computed_to_unknown() {
        let val = crate::ast::sexpr::SExpr::List {
            values: vec![],
            span: s(),
        };
        assert_eq!(
            emit_bind_inferred_dts("COMPUTED", &val, true),
            "export const COMPUTED: unknown;\n"
        );
    }
}
