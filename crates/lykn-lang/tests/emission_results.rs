use lykn_lang::{analysis::type_registry::TypeRegistry, ast::surface::SurfaceForm, emitter};

fn classify(source: &str) -> Vec<SurfaceForm> {
    let forms = lykn_lang::reader::read(source).expect("source reads");
    let resolved = lykn_lang::resolver::resolve(&forms);
    lykn_lang::classifier::classify(&resolved).expect("source classifies")
}

fn nested_bad_child<'a>(
    outer: &'a lykn_lang::ast::sexpr::SExpr,
    expected_head: &str,
) -> &'a lykn_lang::ast::sexpr::SExpr {
    let outer_values = outer.as_list().expect("outer form is a list");
    assert_eq!(outer_values[0].as_form_head(), Some("bind"));
    let obj_values = outer_values[2]
        .as_list()
        .expect("bind value is an Obj list");
    assert_eq!(obj_values[0].as_form_head(), Some("obj"));
    let bad_child = &obj_values[2];
    let bad_values = bad_child.as_list().expect("selected Obj value is a list");
    assert_eq!(bad_values[0].as_form_head(), Some(expected_head));
    bad_child
}

fn codegen_diagnostic(error: lykn_lang::error::LyknError) -> lykn_lang::diagnostics::Diagnostic {
    let lykn_lang::error::LyknError::Codegen(diagnostic) = error else {
        panic!("expected Codegen diagnostic");
    };
    diagnostic
}

#[test]
fn checked_emission_boundaries_reject_value_if_without_else() {
    let forms = classify("(bind value (if true 1))");
    let registry = TypeRegistry::default();

    for strip_assertions in [false, true] {
        let emitted = emitter::emit(&forms, &registry, strip_assertions);
        assert!(matches!(
            emitted,
            Err(lykn_lang::error::LyknError::Codegen(_))
        ));

        let json = emitter::emit_json(&forms, &registry, strip_assertions);
        assert!(matches!(json, Err(lykn_lang::error::LyknError::Codegen(_))));

        let mut ctx = emitter::context::EmitterContext::new(strip_assertions);
        let emitted_form = emitter::forms::emit_form(&forms[0], &mut ctx, &registry);
        assert!(matches!(
            emitted_form,
            Err(lykn_lang::error::LyknError::Codegen(_))
        ));
    }
}

#[test]
fn nested_classification_failure_preserves_source_diagnostic() {
    let source = "(bind data (obj :secret 1)) (bind result (obj :a (dissoc data \"bad\") :b (dissoc data \"later\") :c (obj :ok 1)))";
    let parsed = lykn_lang::reader::read(source).expect("source reads");
    let resolved = lykn_lang::resolver::resolve(&parsed);
    let bad_child = nested_bad_child(&resolved[1], "dissoc");
    let expected = lykn_lang::classifier::classify_expr(bad_child).unwrap_err();
    assert_ne!(expected.span, Default::default());
    let forms = lykn_lang::classifier::classify(&resolved).expect("outer forms classify");
    let registry = TypeRegistry::default();
    for strip_assertions in [false, true] {
        let error = emitter::emit(&forms, &registry, strip_assertions).unwrap_err();
        let lykn_lang::error::LyknError::Classify(diagnostic) = error else {
            panic!("nested classification failure must remain a classifier diagnostic");
        };
        assert_eq!(diagnostic, expected);
        assert_ne!(diagnostic.span, Default::default());

        let error = emitter::emit_json(&forms, &registry, strip_assertions).unwrap_err();
        assert!(
            matches!(error, lykn_lang::error::LyknError::Classify(actual) if actual == expected)
        );

        let mut ctx = emitter::context::EmitterContext::new(strip_assertions);
        let error = emitter::forms::emit_form(&forms[1], &mut ctx, &registry).unwrap_err();
        assert!(
            matches!(error, lykn_lang::error::LyknError::Classify(actual) if actual == expected)
        );
    }
}

#[test]
fn nested_diagnostic_keeps_duplicate_binding_suggestion() {
    let source = "(bind result (obj :bad (bind x 1 x 2)))";
    let parsed = lykn_lang::reader::read(source).expect("source reads");
    let resolved = lykn_lang::resolver::resolve(&parsed);
    let bad_child = nested_bad_child(&resolved[0], "bind");
    let expected = lykn_lang::classifier::classify_expr(bad_child).unwrap_err();
    assert_ne!(expected.span, Default::default());
    assert!(expected.suggestion.is_some());
    let forms = lykn_lang::classifier::classify(&resolved).expect("outer form classifies");
    let error = emitter::emit(&forms, &TypeRegistry::default(), false).unwrap_err();
    assert!(matches!(error, lykn_lang::error::LyknError::Classify(actual) if actual == expected));
}

#[test]
fn checked_form_failure_restores_modes_and_clears_error_for_reuse() {
    let registry = TypeRegistry::default();
    let bad = classify("(bind value (if true 1))");
    let good = classify("(bind ok 1)");
    let mut ctx = emitter::context::EmitterContext::new(false);
    ctx.expr_context = emitter::context::ExprContext::Value;
    ctx.in_class_body = true;

    assert!(emitter::forms::emit_form(&bad[0], &mut ctx, &registry).is_err());
    assert_eq!(ctx.expr_context, emitter::context::ExprContext::Value);
    assert!(ctx.in_class_body);
    assert!(emitter::forms::emit_form(&good[0], &mut ctx, &registry).is_ok());
}

#[test]
fn checked_emission_reports_assign_and_returns_mismatch() {
    let registry = TypeRegistry::default();
    let top_source = "(assign field 1)";
    let top_parsed = lykn_lang::reader::read(top_source).expect("top assign reads");
    let top_span = top_parsed[0].span();
    assert_ne!(top_span, Default::default());
    let top_assign = classify(top_source);
    let top_error = codegen_diagnostic(emitter::emit(&top_assign, &registry, false).unwrap_err());
    assert_eq!(top_error.span, top_span);

    let nested_source = "(bind value (assign field 1))";
    let nested_parsed = lykn_lang::reader::read(nested_source).expect("nested assign reads");
    let nested_values = nested_parsed[0].as_list().expect("outer form is a list");
    assert_eq!(nested_values[0].as_form_head(), Some("bind"));
    let nested_assign = &nested_values[2];
    let nested_assign_values = nested_assign.as_list().expect("nested assign is a list");
    assert_eq!(nested_assign_values[0].as_form_head(), Some("assign"));
    let nested_span = nested_assign.span();
    assert_ne!(nested_span, Default::default());
    let nested_forms = classify(nested_source);
    let nested_error =
        codegen_diagnostic(emitter::emit(&nested_forms, &registry, false).unwrap_err());
    assert_eq!(nested_error.span, nested_span);

    let mismatch_source = "(func broken :args () :returns :number :post true :body (while false (console:log \"never\")))";
    let mismatch = classify(mismatch_source);
    let clause_span = match &mismatch[0] {
        SurfaceForm::Func { clauses, .. } => clauses[0].span,
        other => panic!("expected classified function, got {other:?}"),
    };
    assert_ne!(clause_span, Default::default());
    let mut ctx = emitter::context::EmitterContext::new(false);
    assert_eq!(ctx.gensym.next("seed"), "seed__gensym0");
    let mismatch_error = codegen_diagnostic(
        emitter::forms::emit_form(&mismatch[0], &mut ctx, &registry).unwrap_err(),
    );
    assert_eq!(mismatch_error.span, clause_span);
    assert_eq!(ctx.gensym.next("probe"), "probe__gensym2");
}

#[test]
fn valid_empty_and_literal_emission_remain_checked_successes() {
    let registry = TypeRegistry::default();
    assert!(emitter::emit(&[], &registry, false).unwrap().is_empty());
    let forms = classify("(bind answer 42)");
    assert!(!emitter::emit(&forms, &registry, false).unwrap().is_empty());
}

#[test]
fn public_form_boundary_rejects_owned_references_but_whole_emission_lowers_them() {
    let registry = TypeRegistry::default();
    let source = "(func accepts-array :args (:array value) :body value)";
    let forms = classify(source);
    let reference_span = lykn_lang::reader::source_loc::Span::new(
        lykn_lang::reader::source_loc::SourceLoc {
            line: 1,
            column: 35,
        },
        lykn_lang::reader::source_loc::SourceLoc {
            line: 1,
            column: 40,
        },
    );

    let mut ctx = emitter::context::EmitterContext::new(false);
    let error = emitter::forms::emit_form(&forms[0], &mut ctx, &registry).unwrap_err();
    let lykn_lang::error::LyknError::Codegen(diagnostic) = error else {
        panic!("unfinished owned reference must use the codegen diagnostic channel");
    };
    assert_eq!(
        diagnostic.message,
        "compiler-owned host reference requires whole-module emission; use emitter::emit"
    );
    assert_eq!(diagnostic.span, reference_span);

    let whole_unit = emitter::emit(&forms, &registry, false).unwrap();
    let json = emitter::json::emit_module_json(&whole_unit).unwrap();
    assert!(json.contains("lyknIntrinsicArrayIsArray0"));

    let plain = classify("(bind answer 42)");
    let mut plain_ctx = emitter::context::EmitterContext::new(false);
    assert!(emitter::forms::emit_form(&plain[0], &mut plain_ctx, &registry).is_ok());
}
