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
fn raw_lambda_generator_async_generator_and_callable_property_roles_work() {
    let source = r#"
        (bind lambda_value (lambda (:any _) _))
        (kernel:function* named_generator (_) (yield _))
        (bind anonymous_generator (kernel:function* (_) (yield _)))
        (bind async_generator (async (kernel:function* (_) (yield _))))
        (bind callable_object (object (invoke (kernel:=> (_) _))))
        (console:log (lambda_value 1) _value)
        (kernel:for-of _ (named_generator 2) (console:log _))
        (kernel:for-of _ (anonymous_generator 3) (console:log _))
        (async (kernel:function consume ()
          (kernel:for-await-of _ (async_generator 4) (console:log _))))
        (await (consume))
        (console:log (callable_object:invoke 5))
    "#;
    let js = compile(source);
    let output = run(&js, "globalThis._ = 99; globalThis._value = 7;", "");
    eprintln!(
        "RAW_CALLABLE_FAMILIES source={source:?} generated={js:?} exit={:?} stdout={:?} stderr={:?}",
        output.status.code(),
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "99 7\n99\n99\n99\n99\n");
    assert!(output.stderr.is_empty());
}

#[test]
fn kernel_lambda_remains_outside_the_admitted_escape_namespace() {
    for (source, form) in [
        ("(kernel:lambda (_) _)", "lambda"),
        ("(kernel:class Example () )", "class"),
        ("(kernel:class-expr () )", "class-expr"),
    ] {
        let forms = reader::read(source).expect("negative fixture reads");
        let resolved = resolver::resolve(&forms);
        let error = classifier::classify(&resolved).expect_err("kernel form stays unknown");
        assert!(
            error.iter().any(|diagnostic| diagnostic
                .message
                .contains(&format!("unknown kernel form '{form}'"))),
            "{source}: {error:?}"
        );
    }
}

#[test]
fn raw_codegen_lambda_keeps_supplied_underscore_literal() {
    let source = "(const pick (lambda (_) (return _))) (console:log (pick 7))";
    let forms = reader::read(source).expect("raw lambda fixture reads");
    let js = codegen::emit_module_js(&forms).expect("raw lambda codegen emits");
    let output = run(&js, "globalThis._ = 7;", "");
    eprintln!(
        "RAW_CODEGEN_LAMBDA source={source:?} generated={js:?} exit={:?} stdout={:?} stderr={:?}",
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
fn raw_codegen_class_setter_keeps_supplied_underscore_parameter_literal() {
    let source =
        "(class RawExample () (set value (_) (console:log _))) (const instance (new RawExample))";
    let forms = reader::read(source).expect("raw class fixture reads");
    let js = codegen::emit_module_js(&forms).expect("raw class codegen emits");
    assert!(js.contains("set value(_)") && !js.contains("completionValue__gensym"));
    let output = run(&js, "", "instance.value = 7;");
    eprintln!(
        "RAW_CODEGEN_CLASS source={source:?} generated={js:?} exit={:?} stdout={:?} stderr={:?}",
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
fn raw_nested_iteration_patterns_keep_array_holes_and_iterator_close() {
    let source = r#"
        (kernel:for-of
          (array _ (object (alias :value nested)))
          rows
          (console:log _ nested))
        (kernel:for-of _ closable (console:log _) (break))
        (console:log holeReads nextReads returnReads)
    "#;
    let js = compile(source);
    let output = run(
        &js,
        "globalThis._ = 99; globalThis.holeReads = 0; globalThis.nextReads = 0; globalThis.returnReads = 0; globalThis.rows = [[Object.defineProperty([], 0, {get() { holeReads++; return 8; }}), {value: 1}], [Object.defineProperty([], 0, {get() { holeReads++; return 9; }}), {value: 2}]]; globalThis.closable = {[Symbol.iterator]() { return {next() { nextReads++; return {value: 1, done: false}; }, return() { returnReads++; return {done: true}; }}; }};",
        "",
    );
    eprintln!(
        "RAW_NESTED_ITERATION source={source:?} generated={js:?} exit={:?} stdout={:?} stderr={:?}",
        output.status.code(),
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "99 1\n99 2\n99\n0 1 1\n");
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
fn class_get_set_and_class_expression_prepare_only_parameter_slots() {
    let source = r#"
        (class SurfaceExample ()
          (get fixed () (return 7))
          (set value (_) (console:log _)))
        (bind surface (new SurfaceExample))
        (class KernelExample ()
          (constructor (_) (console:log _))
          (set value (_) (console:log _)))
        (bind kernel_instance (new KernelExample 1))
        (bind ExpressionExample
          (class-expr ()
            (constructor (_) (console:log _))
            (set value (_) (console:log _))))
        (bind expression_instance (new ExpressionExample 2))
        (console:log surface:fixed)
    "#;
    let js = compile(source);
    let output = run(
        &js,
        "globalThis._ = 99;",
        "surface.value = 3; kernel_instance.value = 4; expression_instance.value = 5;",
    );
    eprintln!(
        "CLASS_PARAMETER_ROUTES source={source:?} generated={js:?} exit={:?} stdout={:?} stderr={:?}",
        output.status.code(),
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "99\n99\n7\n99\n99\n99\n");
    assert!(output.stderr.is_empty());
}

#[test]
fn catch_expression_patterns_preserve_pair_computed_and_direct_return_roles() {
    let source = r#"
        (try
          (throw defaultInput)
          (catch (array
            (default (object (alias :value _)) (bumpObject))
            (rest _))
            (console:log _ defaultCalls getterReads)))
        (try
          (throw record)
          (catch (object (default _) (entry (default _ (bump))) ((computed key) _))
            (console:log _ reads defaultCalls)))
        (func catch_in_function :args () :body
          (try
            (throw 7)
            (catch _ (console:log "ignored"))
            (catch _ (console:log _))
            (finally (console:log "finally"))))
        (catch_in_function)
    "#;
    let js = compile(source);
    let output = run(
        &js,
        "globalThis._ = 99; globalThis.reads = 0; globalThis.defaultCalls = 0; globalThis.getterReads = 0; globalThis.bump = () => { defaultCalls++; return 8; }; globalThis.bumpObject = () => { defaultCalls++; return Object.defineProperty({}, 'value', {get() { getterReads++; return 7; }}); }; globalThis.defaultInput = [undefined, 2, 3]; globalThis.key = 'computed'; globalThis.record = {get default() { reads++; return 1; }, get entry() { reads++; return undefined; }, get computed() { reads++; return 3; }};",
        "",
    );
    eprintln!(
        "CATCH_PATTERN_ROLES source={source:?} generated={js:?} exit={:?} stdout={:?} stderr={:?}",
        output.status.code(),
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "99 1 1\n99 3 2\n99\nfinally\n");
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
fn raw_spread_pattern_default_and_body_names_resolve_in_their_real_roles() {
    let source = r#"
        (kernel:function invoke
          ((spread (array (default callback (fallback)))))
          (return (callback)))
        (kernel:function fallback () (return (kernel:=> () 7)))
        (console:log (invoke))
    "#;
    let js = compile(source);
    let output = run(&js, "", "");
    eprintln!(
        "RAW_SPREAD_PROJECTION source={source:?} generated={js:?} exit={:?} stdout={:?} stderr={:?}",
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
fn grouped_discard_patterns_are_structural_and_keep_writer_operations() {
    let source = r#"
        (bind
          (array _ _) inputs
          (object (alias :value _) (spread _)) record
          (array (default _ (bump))) arrayDefault
          (object (default _ (bump))) objectDefault
          (array) emptyArray
          (object) emptyObject)
        (console:log _ defaultCalls)
    "#;
    let js = compile(source);
    let output = run(
        &js,
        "globalThis._ = 99; globalThis.inputs = [1, 2]; globalThis.record = {value: 3, extra: 4}; globalThis.defaultCalls = 0; globalThis.bump = () => { defaultCalls++; return 7; }; globalThis.arrayDefault = []; globalThis.objectDefault = {}; globalThis.emptyArray = []; globalThis.emptyObject = {};",
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
    assert_eq!(stdout(&output), "99 2\n");
    assert!(output.stderr.is_empty());

    for source in [
        "(bind (array (rest _) _) [] named 1)",
        "(bind (object (spread _) (alias :value _)) {} named 1)",
        "(bind (call) 1 named 2)",
        "(bind (array (default _)) [] named 1)",
        "(bind (object (alias :value _ 1 2)) {} named 1)",
        "(bind (object (rest (array _))) {} named 1)",
        "(bind (array (rest (default _ 1))) [] named 1)",
        "(bind (object (default (array _) 7)) {} named 1)",
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
fn grouped_member_expression_alias_keys_are_rejected_before_codegen() {
    let mut accepted = Vec::new();
    for source in [
        "(bind (object (alias owner:key _)) record (array _ _) sequence)",
        "(bind (object (alias owner.key _)) record (array _ _) sequence)",
    ] {
        let forms = reader::read(source).expect("grouped member-key fixture reads");
        let resolved = resolver::resolve(&forms);
        let result = classifier::classify(&resolved);
        if result.is_ok() {
            accepted.push(format!("{source}: {result:?}"));
            continue;
        }
        let diagnostics = result.expect_err("grouped member expression is not a static key");
        assert!(
            diagnostics
                .iter()
                .any(|diagnostic| diagnostic.message.contains("bind group name must be")),
            "{source}: {diagnostics:?}"
        );
    }
    assert!(accepted.is_empty(), "unexpectedly admitted member keys: {accepted:#?}");
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
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
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
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "99 1\n");
    assert!(output.stderr.is_empty());
}

#[test]
fn grouped_boolean_null_and_existing_literal_alias_keys_are_valid() {
    let source = "(bind (object (alias true _) (alias false _) (alias null _) (alias 0 _) (alias :word _) (alias \"text\" _)) record (array _ _) sequence) (console:log _ reads)";
    let js = compile(source);
    let output = run(
        &js,
        "globalThis._ = 99; globalThis.reads = 0; globalThis.record = {get true() { reads++; return 1; }, get false() { reads++; return 2; }, get null() { reads++; return 3; }, get 0() { reads++; return 4; }, get word() { reads++; return 5; }, get text() { reads++; return 6; }}; globalThis.sequence = [1, 2];",
        "",
    );
    eprintln!(
        "GROUPED_LITERAL_ALIAS_KEYS source={source:?} generated={js:?} exit={:?} stdout={:?} stderr={:?}",
        output.status.code(),
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "99 6\n");
    assert!(output.stderr.is_empty());
}

#[test]
fn raw_codegen_negative_numeric_alias_patterns_keep_literal_underscore() {
    for (source, prelude) in [
        (
            "(const (object (alias -1 _)) record) (console:log _)",
            "globalThis.record = {get [-1]() { return 7; }};",
        ),
        (
            "(const (object (alias -0 _)) record) (console:log _)",
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
        assert!(
            output.status.success(),
            "{}",
            String::from_utf8_lossy(&output.stderr)
        );
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
