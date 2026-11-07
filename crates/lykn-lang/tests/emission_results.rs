use lykn_lang::{analysis::type_registry::TypeRegistry, ast::surface::SurfaceForm, emitter};

fn classify(source: &str) -> Vec<SurfaceForm> {
    let forms = lykn_lang::reader::read(source).expect("source reads");
    let resolved = lykn_lang::resolver::resolve(&forms);
    lykn_lang::classifier::classify(&resolved).expect("source classifies")
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
    let lykn_lang::ast::sexpr::SExpr::List { values, .. } = &resolved[1] else {
        panic!("second form is a bind");
    };
    let expected = lykn_lang::classifier::classify_expr(&values[2]).unwrap_err();
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
    let lykn_lang::ast::sexpr::SExpr::List { values, .. } = &resolved[0] else {
        panic!("form is a bind");
    };
    let expected = lykn_lang::classifier::classify_expr(&values[2]).unwrap_err();
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
    let assign = classify("(assign field 1)");
    assert!(matches!(
        emitter::emit(&assign, &registry, false),
        Err(lykn_lang::error::LyknError::Codegen(_))
    ));

    let mismatch = classify(
        "(func broken :args () :returns :number :post true :body (while false (console:log \"never\")))",
    );
    let mut ctx = emitter::context::EmitterContext::new(false);
    assert_eq!(ctx.gensym.next("seed"), "seed__gensym0");
    assert!(matches!(
        emitter::forms::emit_form(&mismatch[0], &mut ctx, &registry),
        Err(lykn_lang::error::LyknError::Codegen(_))
    ));
    assert_eq!(ctx.gensym.next("probe"), "probe__gensym2");
}

#[test]
fn valid_empty_and_literal_emission_remain_checked_successes() {
    let registry = TypeRegistry::default();
    assert!(emitter::emit(&[], &registry, false).unwrap().is_empty());
    let forms = classify("(bind answer 42)");
    assert!(!emitter::emit(&forms, &registry, false).unwrap().is_empty());
}
