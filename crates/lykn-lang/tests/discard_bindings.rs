use std::fs;
use std::process::Command;
use std::sync::atomic::{AtomicUsize, Ordering};

use lykn_lang::{analysis, binding, classifier, codegen, emitter, reader, resolver};

fn compile(source: &str, strip_assertions: bool) -> String {
    let forms = reader::read(source).expect("fixture reads");
    let resolved = resolver::resolve(&forms);
    let classified = classifier::classify(&resolved).expect("fixture classifies");
    let unit = analysis::analyze(classified).expect("fixture analyzes");
    let kernel = emitter::emit(&unit, strip_assertions).expect("fixture emits");
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

fn run_module(js: &str, prelude: &str, suffix: &str) -> std::process::Output {
    static NEXT_MODULE: AtomicUsize = AtomicUsize::new(0);
    let path = std::env::temp_dir().join(format!(
        "lykn-discard-export-{}-{}.mjs",
        std::process::id(),
        NEXT_MODULE.fetch_add(1, Ordering::Relaxed)
    ));
    fs::write(&path, js).expect("write temporary ESM module");
    let module_url = format!("file://{}", path.display());
    let script = format!("{prelude}\nconst __module = await import({module_url:?});\n{suffix}");
    let output = Command::new("deno")
        .arg("eval")
        .arg("--config")
        .arg("project.json")
        .arg("--ext=js")
        .arg(script)
        .current_dir(env!("CARGO_MANIFEST_DIR").to_string() + "/../..")
        .output()
        .expect("Deno is required for discard export runtime evidence");
    fs::remove_file(path).expect("remove temporary ESM module");
    output
}

fn stdout(output: &std::process::Output) -> String {
    String::from_utf8(output.stdout.clone()).expect("Deno stdout is UTF-8")
}

#[test]
fn repeated_bind_discards_evaluate_once_and_leave_source_underscore_alone() {
    let js = compile(
        "(bind _ (bump \"first\") _ (bump \"second\")) (bind _value 7) (console:log _value) (console:log _)",
        false,
    );
    let output = run(
        &js,
        "globalThis._ = 99; globalThis.events = []; globalThis.bump = x => { events.push(x); return x; };",
        "console.log(events.join(','));",
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "7\n99\nfirst,second\n");
}

#[test]
fn typed_scalar_discard_checks_the_actual_value_and_reports_source_name() {
    let js = compile(
        "(func check :args (:number _) :body 41) (console:log (check inputValue))",
        false,
    );
    let good = run(
        &js,
        "globalThis._ = 99; globalThis.inputValue = 7;",
        "console.log(_);",
    );
    assert!(
        good.status.success(),
        "{}",
        String::from_utf8_lossy(&good.stderr)
    );
    assert_eq!(stdout(&good), "41\n99\n");

    let bad = run(&js, "globalThis.inputValue = 'wrong';", "");
    assert!(!bad.status.success(), "a bad :number discard must throw");
    let stderr = String::from_utf8_lossy(&bad.stderr);
    assert!(
        stderr.contains("arg '_' expected number, got string"),
        "{stderr}"
    );

    let bind = compile("(bind :number _ inputValue) (console:log _)", false);
    let good = run(&bind, "globalThis._ = 99; globalThis.inputValue = 7;", "");
    assert!(
        good.status.success(),
        "{}",
        String::from_utf8_lossy(&good.stderr)
    );
    assert_eq!(stdout(&good), "99\n");
    let bad = run(&bind, "globalThis.inputValue = 'wrong';", "");
    assert!(!bad.status.success(), "a bad typed discard bind must throw");
    assert!(
        String::from_utf8_lossy(&bad.stderr)
            .contains("bind: binding '_' expected number, got string")
    );

    let stripped = compile("(bind :number _ inputValue) (console:log _)", true);
    let output = run(
        &stripped,
        "globalThis._ = 99; globalThis.inputValue = 'wrong';",
        "",
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "99\n");
}

#[test]
fn typed_object_discard_preserves_property_key_and_optional_default() {
    let js = compile(
        "(func check :args ((object :number _)) :body 41) (console:log (check inputValue))",
        false,
    );
    let good = run(
        &js,
        "globalThis._ = 99; globalThis.inputValue = {_: 7};",
        "console.log(_);",
    );
    assert!(
        good.status.success(),
        "{}",
        String::from_utf8_lossy(&good.stderr)
    );
    assert_eq!(stdout(&good), "41\n99\n");

    let defaulted = compile(
        "(func check :args ((object (default :number _ 8))) :body 41) (console:log (check {}))",
        false,
    );
    let output = run(&defaulted, "globalThis._ = 99;", "console.log(_);");
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "41\n99\n");

    let bad = run(&js, "globalThis.inputValue = {_:'wrong'};", "");
    assert!(!bad.status.success(), "a bad object discard must throw");
    assert!(String::from_utf8_lossy(&bad.stderr).contains("arg '_' expected number, got string"));
}

#[test]
fn typed_array_discard_reads_value_but_raw_trailing_holes_do_not() {
    let typed = compile(
        "(func check :args ((array :number _)) :body 41) (console:log (check iterable))",
        false,
    );
    let output = run(
        &typed,
        "globalThis._ = 99; globalThis.reads = 0; globalThis.iterable = { [Symbol.iterator]() { let done = false; return { next() { return done ? {done:true} : {done:false, get value() { reads++; done = true; return 7; }}; } }; } };",
        "console.log(reads); console.log(_);",
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "41\n1\n99\n");

    let holes = compile(
        "(bind (array _ second _) iterable) (console:log second)",
        false,
    );
    let output = run(
        &holes,
        "globalThis._ = 99; globalThis.steps = 0; globalThis.reads = 0; globalThis.closes = 0; globalThis.iterable = { [Symbol.iterator]() { let n = 0; return { next() { steps++; n++; return {done:false, get value() { reads++; return n; }}; }, return() { closes++; return {done:true}; } }; } };",
        "console.log(`${steps}:${reads}:${closes}`); console.log(_);",
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "2\n3:1:1\n99\n");

    let single_hole = compile("(bind (array _) iterable)", false);
    let output = run(
        &single_hole,
        "globalThis.steps = 0; globalThis.reads = 0; globalThis.closes = 0; globalThis.iterable = { [Symbol.iterator]() { return { next() { steps++; return {done:false, get value() { reads++; return 1; }}; }, return() { closes++; return {done:true}; } }; } };",
        "console.log(`${steps}:${reads}:${closes}`);",
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "1:0:1\n");

    let many_holes = compile("(bind (array _ _ _) iterable)", false);
    let output = run(
        &many_holes,
        "globalThis.steps = 0; globalThis.reads = 0; globalThis.closes = 0; globalThis.iterable = { [Symbol.iterator]() { return { next() { steps++; return {done:false, get value() { reads++; return 1; }}; }, return() { closes++; return {done:true}; } }; } };",
        "console.log(`${steps}:${reads}:${closes}`);",
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "3:0:1\n");

    let bad = run(&typed, "globalThis.iterable = ['wrong'];", "");
    assert!(
        !bad.status.success(),
        "a bad typed array discard must throw"
    );
    assert!(String::from_utf8_lossy(&bad.stderr).contains("arg '_' expected number, got string"));
}

#[test]
fn fixed_multi_clause_discards_keep_dispatch_and_checked_stripped_binding() {
    for strip_assertions in [false, true] {
        let js = compile(
            "(func choose-value (:args (:number _) :body 11) (:args (:string _) :body 22)) (console:log (choose-value inputValue))",
            strip_assertions,
        );
        let output = run(&js, "globalThis.inputValue = 'text';", "");
        assert!(
            output.status.success(),
            "{}",
            String::from_utf8_lossy(&output.stderr)
        );
        assert_eq!(stdout(&output), "22\n");
    }

    let number = compile(
        "(func choose-value (:args (:number _) :body 11) (:args (:string _) :body 22)) (console:log (choose-value NaN))",
        false,
    );
    let output = run(&number, "", "");
    assert!(
        !output.status.success(),
        "NaN must select the number clause and fail its full guard"
    );
    assert!(
        String::from_utf8_lossy(&output.stderr).contains("arg '_' expected number, got number")
    );
}

#[test]
fn defaults_are_lazy_once_and_nested_array_rest_remains_valid_in_multi_clause() {
    let source = "(func choose (:args ((array (default :number first (bump 8)) (rest :number _))) :body first) (:args (:string _) :body 99)) (console:log (choose inputValue))";
    let js = compile(source, false);
    let output = run(
        &js,
        "globalThis.defaultCalls = 0; globalThis.bump = value => { defaultCalls++; return value; }; globalThis.inputValue = [undefined, 2, 3];",
        "console.log(defaultCalls);",
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "8\n1\n");

    let provided = run(
        &js,
        "globalThis.defaultCalls = 0; globalThis.bump = value => { defaultCalls++; return value; }; globalThis.inputValue = [4, 2, 3];",
        "console.log(defaultCalls);",
    );
    assert!(
        provided.status.success(),
        "{}",
        String::from_utf8_lossy(&provided.stderr)
    );
    assert_eq!(stdout(&provided), "4\n0\n");

    let failing = run(
        &js,
        "globalThis.bump = () => { throw new Error('default-failure'); }; globalThis.inputValue = [undefined, 2];",
        "",
    );
    assert!(
        !failing.status.success(),
        "default exceptions must propagate"
    );
    assert!(String::from_utf8_lossy(&failing.stderr).contains("default-failure"));
}

#[test]
fn typed_object_field_getter_is_read_once() {
    let js = compile(
        "(func check :args ((object :number _)) :body 41) (console:log (check inputValue))",
        false,
    );
    let output = run(
        &js,
        "globalThis.reads = 0; globalThis.inputValue = Object.defineProperty({}, '_', {get() { reads++; return 7; }});",
        "console.log(reads);",
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "41\n1\n");

    let nested = compile(
        "(func check :args ((object (alias :any child (object :number _)))) :body 41) (console:log (check inputValue))",
        false,
    );
    let output = run(&nested, "globalThis.inputValue = {child: {_ : 7}};", "");
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "41\n");
}

#[test]
fn typed_generator_discard_checks_only_when_iteration_advances() {
    let js = compile(
        "(genfunc values :args (:number _) :yields :number :body (yield 3)) (bind iterator (values inputValue)) (console:log (iterator:next):value)",
        false,
    );
    let output = run(&js, "globalThis.inputValue = 'bad';", "");
    assert!(
        !output.status.success(),
        "advancing the generator must run its argument guard"
    );
    let stderr = String::from_utf8_lossy(&output.stderr);
    assert!(
        stderr.contains("arg '_' expected number, got string"),
        "{stderr}"
    );
}

#[test]
fn rest_discard_checks_each_consumed_member_and_keeps_source_label() {
    let js = compile(
        "(func check :args ((rest :number _)) :body 41) (console:log (check 2 3))",
        false,
    );
    let good = run(&js, "", "");
    assert!(
        good.status.success(),
        "{}",
        String::from_utf8_lossy(&good.stderr)
    );
    assert_eq!(stdout(&good), "41\n");

    let bad = run(
        &js,
        "globalThis.badValue = 'wrong';",
        "console.log(check(2, badValue));",
    );
    assert!(
        !bad.status.success(),
        "a bad rest discard member must throw"
    );
    assert!(
        String::from_utf8_lossy(&bad.stderr).contains("rest arg '_' expected number, got string")
    );
}

#[test]
fn source_underscore_in_body_and_default_is_not_private_storage() {
    let body = compile(
        "(func take :args (:any _) :body _) (console:log (take 7))",
        false,
    );
    let output = run(&body, "globalThis._ = 99;", "");
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "99\n");

    let default = compile(
        "(func take :args ((default :any value _)) :body value) (console:log (take))",
        false,
    );
    let output = run(&default, "globalThis._ = 99;", "");
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "99\n");

    let contracts = compile(
        "(func take :args (:any _) :pre (= _ 99) :post (= _ 99) :body 7) (console:log (take 4))",
        false,
    );
    let output = run(&contracts, "globalThis._ = 99;", "");
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "7\n");
}

#[test]
fn fn_lambda_genfn_and_schema_property_roles_keep_underscore_meaning() {
    let functions = compile(
        "(bind f (fn (:number _) 5)) (bind g (lambda (:number _) 6)) (bind a (f 1)) (console:log a) (console:log (g 2)) (bind iterator (genfn (:number _) :yields :number (yield 7))) (bind generator-value (iterator 3)) (bind generator-step (generator-value:next)) (console:log generator-step:value)",
        false,
    );
    let output = run(&functions, "globalThis._ = 99;", "");
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "5\n6\n7\n");

    for source in [
        "(bind f (fn (:number _) 5)) (console:log (f inputValue))",
        "(bind f (lambda (:number _) 5)) (console:log (f inputValue))",
        "(bind iterator (genfn (:number _) :yields :number (yield 7))) (bind step (iterator inputValue)) (bind next-result (step:next)) (console:log next-result:value)",
    ] {
        let js = compile(source, false);
        let output = run(&js, "globalThis.inputValue = 'wrong';", "");
        assert!(
            !output.status.success(),
            "typed callable discard must reject bad values: {source}"
        );
        assert!(
            String::from_utf8_lossy(&output.stderr).contains("arg '_' expected number, got string")
        );
    }

    let schema = compile(
        "(type Box (Box :number _)) (bind box-value (Box 7)) (console:log box-value:_)",
        false,
    );
    let output = run(&schema, "globalThis._ = 99;", "console.log(_);");
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "7\n99\n");
}

#[test]
fn distinct_generated_discard_names_do_not_capture_source_lookups() {
    let js = compile(
        "(bind _ (fn (:any value) value)) (console:log completionValue__gensym0)",
        false,
    );
    let output = run(&js, "globalThis.completionValue__gensym0 = 99;", "");
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "99\n");

    let round_trip = compile_through_json(
        "(func check :args (:number _) :body 41) (console:log (check inputValue))",
    );
    let output = run(&round_trip, "globalThis.inputValue = 7;", "");
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "41\n");
}

#[test]
fn direct_return_member_calls_keep_order_and_discard_storage_private() {
    let js = compile(
        "(func invoke :args (:any receiver) :body (bind _ (receiver:take)) (receiver:read)) (console:log (invoke target))",
        false,
    );
    let output = run(
        &js,
        "globalThis.events = []; globalThis.target = {take() { events.push('take'); return 1; }, read() { events.push('read'); return 7; }};",
        "console.log(events.join(','));",
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "7\ntake,read\n");
}

#[test]
fn failed_fragment_emission_does_not_poison_reused_context() {
    let parsed = reader::read("(bind :number _ inputValue)").expect("fragment reads");
    let resolved = resolver::resolve(&parsed);
    let classified = classifier::classify(&resolved).expect("fragment classifies");
    let registry = lykn_lang::analysis::type_registry::TypeRegistry::default();
    let mut context = emitter::context::EmitterContext::new(false);
    let error = emitter::forms::emit_form(&classified[0], &mut context, &registry)
        .expect_err("fragment rejects unresolved compiler-owned host references");
    assert!(matches!(error, lykn_lang::error::LyknError::Codegen(_)));

    let next = reader::read("(bind _ 1)").expect("recovery fragment reads");
    let next = resolver::resolve(&next);
    let next = classifier::classify(&next).expect("recovery fragment classifies");
    let emitted = emitter::forms::emit_form(&next[0], &mut context, &registry)
        .expect("context recovers after fragment rejection");
    let js = codegen::emit_module_js(&emitted).expect("recovered fragment generates");
    let output = run(&js, "", "");
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
}

#[test]
fn named_duplicate_diagnostic_is_retained_while_repeated_discard_group_is_valid() {
    let repeated = reader::read("(bind _ 1 _ 2)").expect("repeated discard reads");
    let resolved = resolver::resolve(&repeated);
    let classified = classifier::classify(&resolved).expect("discard group classifies");
    analysis::analyze(classified).expect("discard group has no source binding conflict");

    let duplicate = reader::read("(bind _value 1 _value 2)").expect("named group reads");
    let resolved = resolver::resolve(&duplicate);
    let errors = classifier::classify(&resolved).expect_err("named duplicate is still rejected");
    assert!(
        errors
            .iter()
            .any(|error| error.message.contains("declares '_value' more than once"))
    );
}

#[test]
fn inline_discard_export_has_no_private_exports_and_runs_initializer_once() {
    let js = compile("(export (bind _ (bump \"discard\")))", false);
    assert!(js.contains("export {};"), "{js}");
    let output = run_module(
        &js,
        "globalThis._ = 99; globalThis.events = []; globalThis.bump = value => { events.push(value); return value; };",
        "console.log(`${Object.keys(__module).length}:${events.join(',')}:${_}`);",
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "0:discard:99\n");
}

#[test]
fn grouped_export_exposes_only_original_names_in_pair_order() {
    let js = compile(
        "(export (bind _ (bump \"discard\") publicValue (bump \"public\") _value (bump \"ordinary\")))",
        false,
    );
    let output = run_module(
        &js,
        "globalThis.events = []; globalThis.bump = value => { events.push(value); return value; };",
        "console.log(Object.keys(__module).sort().join(',')); console.log(`${__module.publicValue}:${__module._value}:${events.join(',')}`);",
    );
    assert!(
        output.status.success(),
        "{}\n{js}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(
        stdout(&output),
        "_value,publicValue\npublic:ordinary:discard,public,ordinary\n"
    );
}

#[test]
fn discard_exports_keep_type_checks_effects_json_and_named_bindings() {
    let checked = compile("(export (bind :number _ (bump value)))", false);
    let output = run_module(
        &checked,
        "globalThis.calls = 0; globalThis.value = 7; globalThis.bump = x => { calls++; return x; };",
        "console.log(`${Object.keys(__module).length}:${calls}`);",
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "0:1\n");

    let bad = run_module(
        &checked,
        "globalThis.value = 'wrong'; globalThis.bump = x => x;",
        "",
    );
    assert!(
        !bad.status.success(),
        "bad typed discard export must reject"
    );
    let stderr = String::from_utf8_lossy(&bad.stderr);
    assert!(
        stderr.contains("bind: binding '_' expected number, got string"),
        "{stderr}"
    );

    let stripped = compile("(export (bind :number _ (bump value)))", true);
    let output = run_module(
        &stripped,
        "globalThis.calls = 0; globalThis.value = 'wrong'; globalThis.bump = x => { calls++; return x; };",
        "console.log(`${Object.keys(__module).length}:${calls}`);",
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "0:1\n");

    let named = compile("(export (bind :number answer value))", false);
    let output = run_module(
        &named,
        "globalThis.value = 42;",
        "console.log(__module.answer);",
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "42\n");

    let through_json = compile_through_json("(export (bind _ (bump value)))");
    let output = run_module(
        &through_json,
        "globalThis.calls = 0; globalThis.value = 7; globalThis.bump = x => { calls++; return x; };",
        "console.log(`${Object.keys(__module).length}:${calls}`);",
    );
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "0:1\n");
}

#[test]
fn exports_project_nested_alias_and_spread_bindings_but_not_empty_default_slots() {
    let js = compile(
        "(export (bind (object (alias _ local) _ (spread rest)) source)) (export (bind (array first (spread remaining)) values)) (export (bind (object (default absent)) {}))",
        false,
    );
    let output = run_module(
        &js,
        "globalThis.source = {_: 3, extra: 4}; globalThis.values = [5, 6, 7];",
        "console.log(Object.keys(__module).sort().join(',')); console.log(`${__module.local}:${JSON.stringify(__module.rest)}:${__module.first}:${__module.remaining.join(',')}`);",
    );
    assert!(
        output.status.success(),
        "{}\n{js}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(
        stdout(&output),
        "first,local,remaining,rest\n3:{\"extra\":4}:5:6,7\n"
    );
}

#[test]
fn nested_spread_patterns_use_pattern_grammar_and_old_tuple_patterns_diagnose() {
    let source = "(bind (array (spread (object (alias \"0\" named)))) input) (console:log named)";
    let js = compile(source, false);
    let output = run(&js, "globalThis.input = [17, 18];", "");
    assert!(
        output.status.success(),
        "{}\n{js}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "17\n", "{js}");

    let nested_array = compile(
        "(bind (array (spread (array named))) input) (console:log named)",
        false,
    );
    let output = run(&nested_array, "globalThis.input = [17, 18];", "");
    assert!(
        output.status.success(),
        "{}\n{nested_array}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "17\n");

    let exported = compile(
        "(export (bind (array (spread (object (alias \"0\" named)))) input))",
        false,
    );
    let output = run_module(
        &exported,
        "globalThis.input = [17, 18];",
        "console.log(Object.keys(__module).join(',')); console.log(__module.named);",
    );
    assert!(
        output.status.success(),
        "{}\n{exported}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "named\n17\n");

    let source = "(bind (array (spread (object (source named)))) input)";
    let forms = reader::read(source).expect("legacy pattern reads");
    let member_span = forms[0].as_list().unwrap()[1].as_list().unwrap()[1]
        .as_list()
        .unwrap()[1]
        .as_list()
        .unwrap()[1]
        .span();
    let resolved = resolver::resolve(&forms);
    let classified = classifier::classify(&resolved).expect("legacy pattern classifies");
    let unit = analysis::analyze(classified).expect("legacy pattern analyzes");
    let kernel = emitter::emit(&unit, false).expect("legacy pattern emits to kernel");
    let error = codegen::emit_module_js(&kernel)
        .expect_err("legacy object tuple gets migration diagnostic");
    let lykn_lang::error::LyknError::Codegen(diagnostic) = error else {
        panic!("expected typed codegen diagnostic");
    };
    assert_eq!(
        diagnostic.message,
        "object pattern member must use alias, default, rest, spread, or a shorthand field"
    );
    assert_eq!(diagnostic.span, member_span);
    assert!(
        diagnostic
            .suggestion
            .as_deref()
            .is_some_and(|suggestion| suggestion.contains("(alias property local)"))
    );

    let value_spread = compile(
        "(bind result (object (spread (object (source 23)))))",
        false,
    );
    let output = run(&value_spread, "", "console.log(result.source);");
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "23\n");
}

#[test]
fn assignment_spread_patterns_keep_alias_bindings() {
    let forms = reader::read("(= (array first (spread remaining)) target)")
        .expect("assignment kernel reads");
    let js = codegen::emit_module_js(&forms).expect("assignment pattern emits");
    let output = run(
        &js,
        "let first; let remaining; const target = [31, 32];",
        "console.log(`${first}:${remaining.join(',')}`);",
    );
    assert!(
        output.status.success(),
        "{}\n{js}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "31:32\n", "{js}");

    let forms = reader::read(
        "(ignore (= (object (alias nested (array first (spread remaining)))) target))",
    )
    .expect("nested assignment kernel reads");
    let js = codegen::emit_module_js(&forms).expect("nested assignment pattern emits");
    let output = run(
        &js,
        "globalThis.ignore = () => {}; let first; let remaining; const target = {nested: [41, 42]};",
        "console.log(`${first}:${remaining.join(',')}`);",
    );
    assert!(
        output.status.success(),
        "{}\n{js}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "41:42\n");

    let forms = reader::read("(ignore (= (object (alias field target:value)) source))")
        .expect("member assignment kernel reads");
    let js = codegen::emit_module_js(&forms).expect("member assignment pattern emits");
    let output = run(
        &js,
        "globalThis.ignore = () => {}; const target = {}; const source = {field: 51};",
        "console.log(target.value);",
    );
    assert!(
        output.status.success(),
        "{}\n{js}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "51\n");
}

#[test]
fn catch_default_callable_lookup_keeps_legacy_expression_pattern() {
    let source =
        "(try (throw errorValue) (catch (object (default array)) (console:log (array 7))))";
    let js = compile(source, false);
    let output = run(
        &js,
        "globalThis.errorValue = {default: value => value + 1};",
        "",
    );
    assert!(
        output.status.success(),
        "{}\n{js}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "8\n");

    let source =
        "(try (throw errorValue) (catch (object (entry caught)) (console:log (caught 7))))";
    let js = compile(source, false);
    let output = run(
        &js,
        "globalThis.errorValue = {entry: value => value + 1};",
        "",
    );
    assert!(
        output.status.success(),
        "{}\n{js}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "8\n");
}

#[test]
fn spread_sites_feed_reserved_duplicate_and_lexical_binding_clients() {
    let reserved =
        reader::read("(bind (array (spread eval)) values)").expect("reserved spread binder reads");
    let resolved = resolver::resolve(&reserved);
    let diagnostic = binding::validate_reserved_names(&resolved)
        .into_iter()
        .next()
        .expect("spread local is rejected by the real reserved-name validator");
    assert!(
        diagnostic.message.contains("eval")
            && diagnostic
                .message
                .contains("strict-mode binding identifier"),
        "{}",
        diagnostic.message
    );

    let duplicate = reader::read("(bind (array (spread local)) values local 1)")
        .expect("duplicate spread binder reads");
    let resolved = resolver::resolve(&duplicate);
    let diagnostics = classifier::classify(&resolved)
        .expect_err("a spread-site duplicate remains a duplicate binding");
    assert!(
        diagnostics.iter().any(|diagnostic| diagnostic
            .message
            .contains("declares 'local' more than once")),
        "{diagnostics:?}"
    );

    let js = compile(
        "(bind (array (spread (object (alias \"0\" array)))) values) (console:log (array 7))",
        false,
    );
    let output = run(&js, "globalThis.values = [value => value + 1];", "");
    assert!(
        output.status.success(),
        "{}\n{js}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(stdout(&output), "8\n");
}
