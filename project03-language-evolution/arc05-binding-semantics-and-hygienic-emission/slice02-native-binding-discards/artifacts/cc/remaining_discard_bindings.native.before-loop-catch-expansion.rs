use std::process::Command;

use lykn_lang::{analysis, classifier, codegen, emitter, reader, resolver};

fn compile(source: &str) -> String {
    let forms = reader::read(source).expect("fixture reads");
    let resolved = resolver::resolve(&forms);
    let classified = classifier::classify(&resolved).expect("fixture classifies");
    let unit = analysis::analyze(classified).expect("fixture analyzes");
    let kernel = emitter::emit(&unit, false).expect("fixture emits");
    codegen::emit_module_js(&kernel).expect("fixture generates JavaScript")
}

fn compile_through_json(source: &str) -> String {
    let forms = reader::read(source).expect("fixture reads");
    let resolved = resolver::resolve(&forms);
    let classified = classifier::classify(&resolved).expect("fixture classifies");
    let unit = analysis::analyze(classified).expect("fixture analyzes");
    let json = emitter::emit_json(&unit, false).expect("whole-unit JSON emission succeeds");
    let values: Vec<serde_json::Value> = serde_json::from_str(&json).expect("JSON parses");
    let kernel = values
        .iter()
        .map(lykn_lang::expander::env::protocol_json_to_sexpr)
        .collect::<Result<Vec<_>, _>>()
        .expect("emitted JSON reads back");
    codegen::emit_module_js(&kernel).expect("round-tripped JavaScript generates")
}

fn run(js: &str, prelude: &str, suffix: &str) -> std::process::Output {
    let script = format!("{prelude}\n{js}\n{suffix}");
    Command::new("deno")
        .arg("eval")
        .arg("--config")
        .arg("project.json")
        .arg("--ext=js")
        .arg(script)
        .current_dir(env!("CARGO_MANIFEST_DIR").to_string() + "/../..")
        .output()
        .expect("Deno is required for discard runtime evidence")
}

fn stdout(output: &std::process::Output) -> String {
    String::from_utf8(output.stdout.clone()).expect("Deno stdout is UTF-8")
}

#[test]
fn raw_arrow_discards_leave_foreign_underscore_visible() {
    let source = "(bind pick (kernel:=> (_ _) _)) (console:log (pick 7 8))";
    let js = compile(source);
    let output = run(&js, "globalThis._ = 99;", "");
    eprintln!(
        "RAW_ARROW_DISCARD source={source:?} generated={js:?} exit={:?} stdout={:?} stderr={:?}",
        output.status.code(),
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "99\n");
    assert!(
        output.stderr.is_empty(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
}

#[test]
fn named_raw_function_keeps_its_name_and_discards_each_parameter() {
    let source = "(kernel:function choose (_ _) (return _)) (console:log (choose 7 8))";
    let js = compile(source);
    let output = run(&js, "globalThis._ = 99;", "");
    eprintln!(
        "RAW_NAMED_FUNCTION source={source:?} generated={js:?} exit={:?} stdout={:?} stderr={:?}",
        output.status.code(),
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "99\n");
    assert!(output.stderr.is_empty());
}

#[test]
fn single_clause_simple_default_remains_supported() {
    let source = "(func choose :args ((default :any value 7)) :body value) (console:log (choose))";
    let js = compile(source);
    let output = run(&js, "", "");
    eprintln!(
        "SINGLE_DEFAULT source={source:?} generated={js:?} exit={:?} stdout={:?} stderr={:?}",
        output.status.code(),
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "7\n");
    assert!(output.stderr.is_empty());
}

#[test]
fn raw_declarations_and_iteration_bindings_preserve_effects_and_foreign_values() {
    let source = "(kernel:const _ (bump \"const\")) (kernel:let _ (bump \"let\")) (kernel:var _ (bump \"var\")) (kernel:for (kernel:let _ (bump \"for\")) true () (break)) (kernel:for-in _ record (console:log _)) (kernel:for-of _ values (console:log _)) (async (kernel:function consume () (kernel:for-await-of _ asyncValues (console:log _)))) (await (consume)) (console:log _ ) (console:log (events:join \",\"))";
    let js = compile(source);
    let output = run(
        &js,
        "globalThis._ = 99; globalThis.events = []; globalThis.bump = value => { events.push(value); return value; }; globalThis.record = {a: 1, b: 2}; globalThis.values = [1, 2]; globalThis.asyncValues = { [Symbol.asyncIterator]() { let index = 0; return { async next() { return index < 2 ? {value: ++index, done: false} : {done: true}; } }; } };",
        "",
    );
    eprintln!(
        "RAW_DECL_LOOP source={source:?} generated={js:?} exit={:?} stdout={:?} stderr={:?}",
        output.status.code(),
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(
        stdout(&output),
        "99\n99\n99\n99\n99\n99\n99\nconst,let,var,for\n"
    );
    assert!(output.stderr.is_empty());
}

#[test]
fn class_parameter_roles_and_legacy_catch_keep_values_and_keys() {
    let source = "(class Example () (constructor (_) (bind result _)) (read (_) (return _)) (static (read-static (_) (return _))) (async (read-async (_) (return (await (Promise:resolve _))))) (field _ 7)) (bind instance (new Example 1)) (console:log (instance:read 2)) (console:log (Example:read-static 3)) (console:log (await (instance:read-async 4))) (console:log instance:_) (try (throw 7) (catch _ (console:log _))) (try (throw (array 7 8)) (catch (array _ other) (console:log _ other))) (try (throw (object (_ 1))) (catch (object _) (console:log _)))";
    let js = compile(source);
    let output = run(&js, "globalThis._ = 99;", "");
    eprintln!(
        "CLASS_CATCH source={source:?} generated={js:?} exit={:?} stdout={:?} stderr={:?}",
        output.status.code(),
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "99\n99\n99\n7\n99\n99 8\n99\n");
    assert!(output.stderr.is_empty());
}

#[test]
fn raw_default_rest_spread_and_async_parameter_roles_stay_lazy_and_private() {
    let source = "(bind defaulted (kernel:=> ((default _ (bump))) _)) (bind rested (kernel:=> ((rest _)) _)) (bind spreaded (kernel:=> ((spread _)) _)) (bind asynced (async (kernel:=> (_) (await (Promise:resolve _))))) (console:log (defaulted 7)) (console:log (defaulted)) (console:log (rested 1 2)) (console:log (spreaded 3 4)) (console:log (await (asynced 5))) (console:log defaultCalls) (console:log defaulted:length) (console:log rested:length) (console:log spreaded:length)";
    let js = compile(source);
    let output = run(
        &js,
        "globalThis._ = 99; globalThis.defaultCalls = 0; globalThis.bump = () => { defaultCalls++; return _; };",
        "",
    );
    eprintln!(
        "RAW_PARAMETER_FAMILIES source={source:?} generated={js:?} exit={:?} stdout={:?} stderr={:?}",
        output.status.code(),
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "99\n99\n99\n99\n99\n1\n0\n0\n0\n");
    assert!(output.stderr.is_empty());
}

#[test]
fn grouped_discard_patterns_are_structural_and_keep_writer_operations() {
    let source =
        "(bind (array _ _) inputs (object (alias :value _) (spread _)) record) (console:log _)";
    let js = compile(source);
    let output = run(
        &js,
        "globalThis._ = 99; globalThis.inputs = [1, 2]; globalThis.record = {value: 3, extra: 4};",
        "",
    );
    eprintln!(
        "GROUPED_DISCARD source={source:?} generated={js:?} exit={:?} stdout={:?} stderr={:?}",
        output.status.code(),
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "99\n");
    assert!(output.stderr.is_empty());

    for source in [
        "(bind (array (rest _) _) [] named 1)",
        "(bind (object (spread _) (alias :value _)) {} named 1)",
        "(bind (call) 1 named 2)",
    ] {
        let forms = reader::read(source).expect("invalid group fixture reads");
        let resolved = resolver::resolve(&forms);
        let error = classifier::classify(&resolved).expect_err("malformed zero-name group rejects");
        assert!(
            error
                .iter()
                .any(|diagnostic| diagnostic.message.contains("bind group name must be")),
            "{source}: {error:?}"
        );
    }
}

#[test]
fn grouped_numeric_alias_key_emits_a_valid_javascript_property() {
    let source = "(bind (object (alias -1 _)) record (array _ _) sequence) (console:log _ reads)";
    let js = compile(source);
    let output = run(
        &js,
        "globalThis._ = 99; globalThis.reads = 0; globalThis.record = {get [-1]() { reads++; return 7; }}; globalThis.sequence = [1, 2];",
        "",
    );
    eprintln!(
        "GROUPED_NUMERIC_ALIAS source={source:?} generated={js:?} exit={:?} stdout={:?} stderr={:?}",
        output.status.code(),
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "99 1\n");
    assert!(output.stderr.is_empty());
}

#[test]
fn whole_unit_json_round_trip_keeps_finalized_grouped_discards() {
    let source = "(bind (object (alias -1 _) (alias :value _)) record (array _ _) sequence) (console:log _ reads)";
    let js = compile_through_json(source);
    let output = run(
        &js,
        "globalThis._ = 99; globalThis.reads = 0; globalThis.record = {get [-1]() { reads++; return 7; }, get value() { reads++; return 8; }}; globalThis.sequence = [1, 2];",
        "",
    );
    eprintln!(
        "WHOLE_JSON_GROUPED_DISCARD source={source:?} generated={js:?} exit={:?} stdout={:?} stderr={:?}",
        output.status.code(),
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(output.status.success(), "{}", String::from_utf8_lossy(&output.stderr));
    assert_eq!(stdout(&output), "99 2\n");
    assert!(output.stderr.is_empty());
}

#[test]
fn grouped_negative_zero_alias_uses_existing_zero_property() {
    let source = "(bind (object (alias -0 _)) record (array _ _) sequence) (console:log _ reads)";
    let js = compile(source);
    let output = run(
        &js,
        "globalThis._ = 99; globalThis.reads = 0; globalThis.record = {get 0() { reads++; return 7; }}; globalThis.sequence = [1, 2];",
        "",
    );
    eprintln!(
        "GROUPED_NEGATIVE_ZERO source={source:?} generated={js:?} exit={:?} stdout={:?} stderr={:?}",
        output.status.code(),
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(output.status.success(), "{}", String::from_utf8_lossy(&output.stderr));
    assert_eq!(stdout(&output), "99 1\n");
    assert!(output.stderr.is_empty());
}

#[test]
fn grouped_boolean_null_and_existing_literal_alias_keys_are_valid() {
    let source = "(bind (object (alias true _) (alias false _) (alias null _) (alias :word _) (alias \"text\" _)) record (array _ _) sequence) (console:log _ reads)";
    let js = compile(source);
    let output = run(
        &js,
        "globalThis._ = 99; globalThis.reads = 0; globalThis.record = {get true() { reads++; return 1; }, get false() { reads++; return 2; }, get null() { reads++; return 3; }, get word() { reads++; return 4; }, get text() { reads++; return 5; }}; globalThis.sequence = [1, 2];",
        "",
    );
    eprintln!(
        "GROUPED_LITERAL_ALIAS_KEYS source={source:?} generated={js:?} exit={:?} stdout={:?} stderr={:?}",
        output.status.code(),
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(output.status.success(), "{}", String::from_utf8_lossy(&output.stderr));
    assert_eq!(stdout(&output), "99 5\n");
    assert!(output.stderr.is_empty());
}

#[test]
fn raw_codegen_negative_numeric_alias_patterns_keep_literal_underscore() {
    for (source, prelude) in [
        (
            "(const (object (alias -1 _)) record) (console:log _)" ,
            "globalThis.record = {get [-1]() { return 7; }};",
        ),
        (
            "(const (object (alias -0 _)) record) (console:log _)" ,
            "globalThis.record = {get 0() { return 7; }};",
        ),
    ] {
        let forms = reader::read(source).expect("raw codegen fixture reads");
        let js = codegen::emit_module_js(&forms).expect("raw codegen emits");
        assert!(js.contains("_"));
        assert!(!js.contains("completionValue__gensym"));
        let output = run(&js, prelude, "");
        eprintln!(
            "RAW_CODEGEN_NUMERIC_ALIAS source={source:?} generated={js:?} exit={:?} stdout={:?} stderr={:?}",
            output.status.code(),
            String::from_utf8_lossy(&output.stdout),
            String::from_utf8_lossy(&output.stderr)
        );
        assert!(output.status.success(), "{}", String::from_utf8_lossy(&output.stderr));
        assert_eq!(stdout(&output), "7\n");
        assert!(output.stderr.is_empty());
    }
}

#[test]
fn multi_clause_simple_defaults_are_diagnosed_by_classification_and_direct_emit() {
    use lykn_lang::ast::sexpr::SExpr;
    use lykn_lang::ast::surface::{
        FuncClause, ParamShape, SurfaceForm, TypeAnnotation, TypedParam,
    };
    use lykn_lang::reader::source_loc::Span;

    const MESSAGE: &str = "multi-clause func does not support top-level default or rest parameters";
    for source in [
        "(func f (:args ((default :any value 7)) :body 1) (:args (:string other) :body 2))",
        "(func f (:args ((rest :any values)) :body 1) (:args ((object :any other)) :body 2))",
    ] {
        let forms = reader::read(source).expect("multi-clause fixture reads");
        let resolved = resolver::resolve(&forms);
        let errors = classifier::classify(&resolved)
            .expect_err("check rejects unsupported simple default or rest");
        assert!(
            errors.iter().any(|error| error.message == MESSAGE),
            "{errors:?}"
        );
    }

    let span = Span::default();
    for (default_value, is_rest) in [
        (Some(SExpr::Number { value: 7.0, span }), false),
        (None, true),
    ] {
        let parameter = ParamShape::Simple(TypedParam {
            type_ann: TypeAnnotation {
                name: "any".to_string(),
                span,
            },
            name: "value".to_string(),
            name_span: span,
            default_value,
            is_rest,
        });
        let clause = FuncClause {
            args: vec![parameter],
            returns: None,
            pre: None,
            post: None,
            body: vec![SExpr::Number { value: 1.0, span }],
            span,
        };
        let form = SurfaceForm::Func {
            name: "f".to_string(),
            name_span: span,
            clauses: vec![clause.clone(), clause],
            span,
        };
        let mut context = emitter::context::EmitterContext::new(false);
        let registry = analysis::type_registry::TypeRegistry::default();
        let error = emitter::forms::emit_form(&form, &mut context, &registry)
            .expect_err("direct AST emission rejects unsupported simple default or rest");
        let lykn_lang::error::LyknError::Codegen(diagnostic) = error else {
            panic!("expected existing codegen diagnostic");
        };
        assert_eq!(diagnostic.message, MESSAGE);
    }
}
