use std::path::PathBuf;
use std::process::Command;

use lykn_lang::{analysis, classifier, codegen, emitter, reader, resolver};

fn compile(source: &str) -> (Vec<lykn_lang::ast::sexpr::SExpr>, String) {
    compile_strip(source, false)
}

fn compile_strip(source: &str, strip: bool) -> (Vec<lykn_lang::ast::sexpr::SExpr>, String) {
    let parsed = reader::read(source).expect("source parses");
    let resolved = resolver::resolve(&parsed);
    let surface = classifier::classify(&resolved).expect("source classifies");
    let unit = analysis::analyze(surface).expect("source analyzes");
    let kernel = emitter::emit(&unit, strip).expect("unit emits");
    let js = codegen::emit_module_js(&kernel).expect("kernel lowers");
    (kernel, js)
}

fn run(js: &str, setup: &str) -> String {
    let command = format!("{setup}\n{js}");
    let output = Command::new("deno")
        .args(["eval", "--config", "project.json", "--ext=js", &command])
        .current_dir(env!("CARGO_MANIFEST_DIR").to_string() + "/../..")
        .output()
        .expect("Deno available for generated-code runtime proof");
    eprintln!(
        "NATIVE_RUNTIME command=deno eval --config project.json --ext=js status={:?} stdout={:?} stderr={:?}",
        output.status.code(),
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(
        output.status.success(),
        "generated ESM failed: {}\n{js}",
        String::from_utf8_lossy(&output.stderr)
    );
    String::from_utf8(output.stdout).expect("runtime stdout is UTF-8")
}

#[test]
fn reconstructed_typed_nested_and_normalized_names_are_reserved_before_unit_emission() {
    let source = "(func collide :args (:number result__gensym0) :returns :number :body 7)\n\
        (func nested :args ((object (default :number result__gensym1! 8))) :returns :number :body 7)\n\
        (console:log (collide 99) (nested (obj)))";
    let (_, js) = compile(source);
    eprintln!("NATIVE_TYPED_NAME_SOURCE={source:?}\nNATIVE_TYPED_NAME_JS={js:?}");
    assert_eq!(run(&js, ""), "7 7\n");

    let nested_only = "(func nested :args ((object (default :number result__gensym0! 8))) :returns :number :body 7) (console:log (nested (obj)))";
    let (_, nested_js) = compile(nested_only);
    eprintln!("NATIVE_NESTED_ONLY_SOURCE={nested_only:?}\nNATIVE_NESTED_ONLY_JS={nested_js:?}");
    assert!(nested_js.contains("result__gensym0"));
    assert!(
        nested_js.contains("result__gensym1"),
        "helper skips absent nested leaf: {nested_js}"
    );
    assert_eq!(run(&nested_js, ""), "7\n");

    let adjacent = "(func adjacent :args (:number result__gensym0 :number result__gensym1) :returns :number :body 7) (console:log (adjacent 99 100))";
    let (_, adjacent_js) = compile(adjacent);
    eprintln!(
        "NATIVE_ADJACENT_NAMES_SOURCE={adjacent:?}\nNATIVE_ADJACENT_NAMES_JS={adjacent_js:?}"
    );
    assert!(
        adjacent_js.contains("result__gensym2"),
        "helper skips consecutive occupied suffixes: {adjacent_js}"
    );
    assert_eq!(run(&adjacent_js, ""), "7\n");
}

#[test]
fn fixed_overload_storage_cannot_shadow_clause_parameters_or_foreign_names() {
    let source = r#"(bind args__gensym0 15)
(func pick
  (:args (:number args) :returns :number :body args)
  (:args (:string args) :returns :string :body args))
(func foreign
  (:args (:number value) :returns :any :body args)
  (:args (:string value) :returns :any :body args))
(console:log (pick 7) (pick "ok") (foreign 1))
(try (pick true) (catch err (console:log err.name err.message)))"#;
    let (_, js) = compile(source);
    eprintln!("NATIVE_OVERLOAD_SOURCE={source:?}\nNATIVE_OVERLOAD_JS={js:?}");
    assert_eq!(
        run(&js, "globalThis.args = 99;"),
        "7 ok 99\nTypeError pick: no matching clause for arguments\n"
    );
    assert!(
        js.contains("function pick(...args__gensym1)"),
        "occupied candidate suffix is skipped: {js}"
    );
    assert!(js.contains("args__gensym1.length") && js.contains("args__gensym1[0]"));
}

#[test]
fn shared_early_producers_preserve_opposing_source_values_and_effects() {
    let fixtures = [
        (
            "(bind t__gensym0 99) (console:log (some-> 7 (+ t__gensym0)))",
            "106\n",
        ),
        (
            "(bind rest__gensym1 (obj :drop 7 :keep 9)) (bind kept (dissoc rest__gensym1 :drop)) (console:log kept:keep)",
            "9\n",
        ),
        (
            "(bind await__gensym0 (obj :child 7)) (some-> (await (Promise:resolve await__gensym0:child)) (+ 1) (console:log))",
            "8\n",
        ),
        (
            "(bind yv__gensym0 7) (genfunc numbers :args () :yields :number :body (yield yv__gensym0)) (bind iterator (numbers)) (bind item (iterator:next)) (bind end (iterator:next)) (console:log item:value item:done end:done)",
            "7 false true\n",
        ),
    ];
    for (source, expected) in fixtures {
        for strip in [false, true] {
            let (_, js) = compile_strip(source, strip);
            eprintln!("NATIVE_PRODUCER_SOURCE={source:?} strip={strip}\nNATIVE_PRODUCER_JS={js:?}");
            assert_eq!(run(&js, ""), expected, "source={source} strip={strip}");
        }
    }
    let colon_root = "(some-> (await (Promise:resolve await__gensym0:child)) (+ 1) (console:log))";
    for strip in [false, true] {
        let (_, colon_js) = compile_strip(colon_root, strip);
        eprintln!(
            "NATIVE_COLON_ROOT_SOURCE={colon_root:?} strip={strip}\nNATIVE_COLON_ROOT_JS={colon_js:?}"
        );
        assert_eq!(
            run(&colon_js, "globalThis.await__gensym0 = {child: 7};"),
            "8\n"
        );
    }
    let dotted_root = "(some-> (await (Promise:resolve await__gensym0.child)) (+ 1) (console:log))";
    for strip in [false, true] {
        let (_, dotted_js) = compile_strip(dotted_root, strip);
        eprintln!(
            "NATIVE_DOTTED_ROOT_SOURCE={dotted_root:?} strip={strip}\nNATIVE_DOTTED_ROOT_JS={dotted_js:?}"
        );
        assert_eq!(
            run(&dotted_js, "globalThis.await__gensym0 = {child: 7};"),
            "8\n"
        );
    }
    let computed_key = "(console:log (some-> 7 (+ box[t__gensym0])))";
    for strip in [false, true] {
        let (_, computed_js) = compile_strip(computed_key, strip);
        eprintln!(
            "NATIVE_COMPUTED_KEY_SOURCE={computed_key:?} strip={strip}\nNATIVE_COMPUTED_KEY_JS={computed_js:?}"
        );
        assert_eq!(
            run(
                &computed_js,
                "globalThis.t__gensym0 = 99; globalThis.box = {99: 5, 7: 100};"
            ),
            "12\n"
        );
    }
    let escaped_root =
        r"(some-> (await (Promise:resolve await\u005f\u005fgensym0.child)) (+ 1) (console:log))";
    for strip in [false, true] {
        let (_, escaped_js) = compile_strip(escaped_root, strip);
        eprintln!(
            "NATIVE_ESCAPED_ROOT_SOURCE={escaped_root:?} strip={strip}\nNATIVE_ESCAPED_ROOT_JS={escaped_js:?}"
        );
        assert_eq!(
            run(&escaped_js, "globalThis.await__gensym0 = {child: 7};"),
            "8\n"
        );
    }
    let (_, effect_js) = compile(
        "(bind calls (cell 0)) (bind value (some-> 7 (+ (do (swap! calls (fn (:number n) (+ n 1))) 3)))) (console:log value (express calls))",
    );
    assert_eq!(run(&effect_js, ""), "10 1\n");

    let match_source = "(type Maybe (Some :number value)) (bind target__gensym0 (Some 7)) (console:log (match target__gensym0 ((Some result) result)))";
    for strip in [false, true] {
        let (_, match_js) = compile_strip(match_source, strip);
        eprintln!(
            "NATIVE_MATCH_SOURCE={match_source:?} strip={strip}\nNATIVE_MATCH_JS={match_js:?}"
        );
        assert_eq!(run(&match_js, ""), "7\n");
    }

    let rest_source = "(bind _el__values 99) (func checked-rest :args ((rest :number values)) :returns :number :body 7) (console:log (checked-rest 2 3))";
    for strip in [false, true] {
        let (_, rest_js) = compile_strip(rest_source, strip);
        eprintln!("NATIVE_REST_SOURCE={rest_source:?} strip={strip}\nNATIVE_REST_JS={rest_js:?}");
        if !strip {
            assert!(
                rest_js.contains("_el__values__gensym"),
                "rest iterator storage avoids source occupancy: {rest_js}"
            );
        }
        assert_eq!(run(&rest_js, ""), "7\n");
    }

    let bad_rest = "(bind _el__values 99) (func checked-rest :args ((rest :number values)) :returns :number :body 7) (try (checked-rest 2 \"bad\") (catch err (console:log err.name err.message)))";
    let (_, bad_rest_js) = compile(bad_rest);
    assert_eq!(
        run(&bad_rest_js, ""),
        "TypeError checkedRest: rest arg '_el__values' expected number, got string\n"
    );

    let null_effect = "(bind calls (cell 0)) (bind value (some-> null (+ (do (swap! calls (fn (:number n) (+ n 1))) 3)))) (console:log value (express calls))";
    for strip in [false, true] {
        let (_, null_js) = compile_strip(null_effect, strip);
        assert_eq!(run(&null_js, ""), "null 0\n");
    }

    let throw_effect = "(bind calls (cell 0)) (func fail :args (:any value) :body (swap! calls (fn (:number n) (+ n 1))) (throw (new Error \"boom\"))) (try (some-> 7 (fail)) (catch err (console:log err.name err.message (express calls))))";
    for strip in [false, true] {
        let (_, throw_js) = compile_strip(throw_effect, strip);
        assert_eq!(run(&throw_js, ""), "Error boom 1\n");
    }

    let delayed_yield_error = "(genfunc invalid-numbers :args () :yields :number :body (yield \"bad\")) (bind iterator (invalid-numbers)) (console:log \"created\") (try (iterator:next) (catch err (console:log err.name)))";
    let (_, delayed_js) = compile(delayed_yield_error);
    assert_eq!(run(&delayed_js, ""), "created\nTypeError\n");
    let (_, delayed_stripped_js) = compile_strip(delayed_yield_error, true);
    assert_eq!(run(&delayed_stripped_js, ""), "created\n");

    let delayed_effect = "(bind calls (cell 0)) (genfunc numbers :args () :yields :number :body (swap! calls (fn (:number n) (+ n 1))) (yield (express calls))) (bind iterator (numbers)) (console:log (express calls)) (bind first (iterator:next)) (console:log first:value (express calls)) (bind end (iterator:next)) (console:log end:done (express calls))";
    for strip in [false, true] {
        assert_eq!(
            run(&compile_strip(delayed_effect, strip).1, ""),
            "0\n1 1\ntrue 1\n"
        );
    }
}

#[test]
fn standalone_form_reserves_its_typed_names_and_raw_codegen_remains_literal() {
    use lykn_lang::emitter::{context::EmitterContext, forms::emit_form};
    let parsed =
        reader::read("(func one :args (:any result__gensym0) :body result__gensym0)").unwrap();
    let resolved = resolver::resolve(&parsed);
    let surface = classifier::classify(&resolved).unwrap();
    let mut ctx = EmitterContext::new(false);
    let emitted = emit_form(&surface[0], &mut ctx, &Default::default()).unwrap();
    let js = codegen::emit_module_js(&emitted).unwrap();
    assert!(
        js.contains("function one(result__gensym0)"),
        "fragment emits its source parameter: {js}"
    );
    assert_eq!(
        ctx.gensym.next("result"),
        "result__gensym1",
        "single-form source census reserved the reconstructed parameter"
    );

    let bad = reader::read("(func broken :args () :returns :number :post true :body (while false (console:log \"never\")))").unwrap();
    let bad_resolved = resolver::resolve(&bad);
    let bad_surface = classifier::classify(&bad_resolved).unwrap();
    let mut failed_ctx = EmitterContext::new(false);
    assert_eq!(failed_ctx.gensym.next("seed"), "seed__gensym0");
    assert!(emit_form(&bad_surface[0], &mut failed_ctx, &Default::default()).is_err());
    assert_eq!(
        failed_ctx.gensym.next("probe"),
        "probe__gensym2",
        "failed form keeps its consumed namespace counter"
    );
    let failed_good = reader::read("(console:log (some-> 7 (+ t__gensym3)))").unwrap();
    let failed_good_resolved = resolver::resolve(&failed_good);
    let failed_good_surface = classifier::classify(&failed_good_resolved).unwrap();
    let fragment = emit_form(
        &failed_good_surface[0],
        &mut failed_ctx,
        &Default::default(),
    )
    .unwrap();
    let fragment_js = codegen::emit_module_js(&fragment).unwrap();
    assert_eq!(run(&fragment_js, "globalThis.t__gensym3 = 99;"), "106\n");

    let fresh = reader::read("(console:log (some-> 7 (+ t__gensym0)))").unwrap();
    let fresh_resolved = resolver::resolve(&fresh);
    let fresh_surface = classifier::classify(&fresh_resolved).unwrap();
    let mut fresh_ctx = EmitterContext::new(false);
    let fresh_fragment = emit_form(&fresh_surface[0], &mut fresh_ctx, &Default::default()).unwrap();
    let fresh_js = codegen::emit_module_js(&fresh_fragment).unwrap();
    assert_eq!(run(&fresh_js, "globalThis.t__gensym0 = 99;"), "106\n");

    let unit_a_source = "(bind t__gensym0 99) (console:log (some-> 7 (+ t__gensym0)))";
    let unit_a_forms =
        classifier::classify(&resolver::resolve(&reader::read(unit_a_source).unwrap())).unwrap();
    let unit_a = analysis::analyze(unit_a_forms).unwrap();
    let unit_b_forms = classifier::classify(&resolver::resolve(
        &reader::read("(console:log (some-> 2 (+ 3)))").unwrap(),
    ))
    .unwrap();
    let unit_b = analysis::analyze(unit_b_forms).unwrap();
    let first = emitter::emit(&unit_a, false).unwrap();
    let json_first = emitter::emit_json(&unit_a, false).unwrap();
    let _interleaved = emitter::emit(&unit_b, false).unwrap();
    assert_eq!(first, emitter::emit(&unit_a, false).unwrap());
    assert_eq!(json_first, emitter::emit_json(&unit_a, false).unwrap());

    let late_source = "(bind Number 42) (bind completionValue__gensym0 99) (bind _ (fn (:any value) value)) (bind _v0 5) (func checked :args (:number input) :returns :number :body input) (console:log (checked 7) completionValue__gensym0 (template \"{n, plural, one {one} other {# items}}\" :n _v0))";
    let (_, late_js) = compile(late_source);
    eprintln!(
        "NATIVE_LATE_COMPOSITION_SOURCE={late_source:?}\nNATIVE_LATE_COMPOSITION_JS={late_js:?}"
    );
    assert!(
        late_js.contains("data:text/javascript"),
        "host root binding uses inline support: {late_js}"
    );
    assert_eq!(run(&late_js, ""), "7 99 5 items\n");

    let completion_source = "(func read :args (:number _) :returns :number :body completionValue__gensym0.child) (console:log (read 7))";
    let (_, completion_js) = compile(completion_source);
    eprintln!(
        "NATIVE_COMPLETION_SOURCE={completion_source:?}\nNATIVE_COMPLETION_JS={completion_js:?}"
    );
    assert!(
        completion_js.contains("completionValue__gensym1"),
        "discard completion local avoids foreign dotted root: {completion_js}"
    );
    assert_eq!(
        run(
            &completion_js,
            "globalThis.completionValue__gensym0 = {child: 41};"
        ),
        "41\n"
    );

    let icu_dotted =
        "(console:log (template \"{n, plural, one {one} other {# items}}\" :n _v0.child))";
    let (_, icu_dotted_js) = compile(icu_dotted);
    eprintln!("NATIVE_ICU_DOTTED_SOURCE={icu_dotted:?}\nNATIVE_ICU_DOTTED_JS={icu_dotted_js:?}");
    assert!(
        icu_dotted_js.contains("_v0__lyknGenerated"),
        "ICU selector uses a distinct generated local: {icu_dotted_js}"
    );
    assert_eq!(
        run(&icu_dotted_js, "globalThis._v0 = {child: 5};"),
        "5 items\n"
    );

    let icu_computed =
        "(console:log (template \"{n, plural, one {one} other {# items}}\" :n box[_v0]))";
    let (_, icu_computed_js) = compile(icu_computed);
    eprintln!(
        "NATIVE_ICU_COMPUTED_SOURCE={icu_computed:?}\nNATIVE_ICU_COMPUTED_JS={icu_computed_js:?}"
    );
    assert_eq!(
        run(
            &icu_computed_js,
            "globalThis._v0 = 99; globalThis.box = {99: 5, 5: 100};"
        ),
        "5 items\n"
    );

    let reference_source = "(func read :args (:number value) :returns :number :body lyknIntrinsicNumberIsNaN0.child) (console:log (read 7))";
    let (_, reference_js) = compile(reference_source);
    eprintln!(
        "NATIVE_HOST_REFERENCE_SOURCE={reference_source:?}\nNATIVE_HOST_REFERENCE_JS={reference_js:?}"
    );
    assert!(
        reference_js.contains("lyknIntrinsicNumberIsNaN1"),
        "host alias avoids foreign dotted root: {reference_js}"
    );
    assert_eq!(
        run(
            &reference_js,
            "globalThis.lyknIntrinsicNumberIsNaN0 = {child: 41};"
        ),
        "41\n"
    );

    let fixture_path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../../test/fixtures/ordered-member-calls/pure-colon-call.lykn");
    let fixture =
        std::fs::read_to_string(fixture_path).expect("read actual pure-colon-call fixture");
    let invocation_source = fixture
        .replace(
            ":args (:any receiver) :returns :any :body\n  (receiver:read-entry 3)",
            ":args (:any receiver :any stop) :returns :any :body\n  (receiver:read-entry (do (if stop (return 92)) 3))",
        )
        .replace("(+ value 1)", "lyknHostReflectApply0.child")
        .replace(
            "(console:log (probe receiver))",
            "(console:log (probe receiver true) (probe receiver false))",
        );
    assert_ne!(
        invocation_source, fixture,
        "fixture body replacement must be observed"
    );
    let (_, invocation_js) = compile(&invocation_source);
    eprintln!(
        "NATIVE_INVOCATION_SOURCE={invocation_source:?}\nNATIVE_INVOCATION_JS={invocation_js:?}"
    );
    assert!(
        invocation_js.contains("function lyknHostReflectApply1("),
        "actual invocation support avoids foreign dotted helper root: {invocation_js}"
    );
    assert_eq!(
        run(
            &invocation_js,
            "globalThis.lyknHostReflectApply0 = {child: 41};"
        ),
        "92 41\n"
    );

    use lykn_lang::ast::sexpr::SExpr;
    let raw = vec![SExpr::List {
        values: vec![
            SExpr::atom("=>", Default::default()),
            SExpr::List {
                values: vec![SExpr::atom("_", Default::default())],
                span: Default::default(),
            },
            SExpr::atom("_", Default::default()),
        ],
        span: Default::default(),
    }];
    assert!(codegen::emit_module_js(&raw).unwrap().contains("_ => _"));
}
