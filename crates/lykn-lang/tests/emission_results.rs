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
        assert!(matches!(emitted, Err(lykn_lang::error::LyknError::Codegen(_))));

        let json = emitter::emit_json(&forms, &registry, strip_assertions);
        assert!(matches!(json, Err(lykn_lang::error::LyknError::Codegen(_))));

        let mut ctx = emitter::context::EmitterContext::new(strip_assertions);
        let emitted_form = emitter::forms::emit_form(&forms[0], &mut ctx, &registry);
        assert!(matches!(emitted_form, Err(lykn_lang::error::LyknError::Codegen(_))));
    }
}

#[test]
fn nested_classification_failure_preserves_source_diagnostic() {
    let forms = classify(
        "(bind obj-value (obj :secret 1))\n(bind cleaned (dissoc obj-value \"secret\"))",
    );
    let error = emitter::emit(&forms, &TypeRegistry::default(), false).unwrap_err();
    let lykn_lang::error::LyknError::Classify(diagnostic) = error else {
        panic!("nested classification failure must remain a classifier diagnostic");
    };
    assert_ne!(diagnostic.span, Default::default());
    assert!(diagnostic.message.contains("keyword"));
}

#[test]
fn valid_empty_and_literal_emission_remain_checked_successes() {
    let registry = TypeRegistry::default();
    assert!(emitter::emit(&[], &registry, false).unwrap().is_empty());
    let forms = classify("(bind answer 42)");
    assert!(!emitter::emit(&forms, &registry, false).unwrap().is_empty());
}
