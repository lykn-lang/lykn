use std::fs;
use std::path::{Path, PathBuf};
use std::process::{Command, Output};

use tempfile::TempDir;

fn cli() -> Command {
    Command::new(env!("CARGO_BIN_EXE_lykn"))
}

fn deno() -> std::ffi::OsString {
    std::env::var_os("LYKN_TEST_DENO").unwrap_or_else(|| "deno".into())
}

fn save_receipt(stem: &str, suffix: &str, bytes: &[u8]) {
    let Some(root) = std::env::var_os("LYKN_DISCARD_DECLARATIONS_EVIDENCE_DIR") else {
        return;
    };
    let root = PathBuf::from(root);
    assert!(root.is_absolute(), "evidence directory must be absolute");
    fs::create_dir_all(&root).expect("create optional evidence directory");
    fs::write(root.join(format!("{stem}.{suffix}")), bytes).expect("save test receipt");
}

fn save_output(stem: &str, output: &Output) {
    save_receipt(stem, "stdout.bin", &output.stdout);
    save_receipt(stem, "stderr.bin", &output.stderr);
    save_receipt(
        stem,
        "status.txt",
        format!(
            "success={} code={:?}\n",
            output.status.success(),
            output.status.code()
        )
        .as_bytes(),
    );
}

fn save_command(stem: &str, command: &Command) {
    let overrides = command
        .get_envs()
        .map(|(key, value)| format!("{key:?}={value:?}"))
        .collect::<Vec<_>>()
        .join("\n");
    save_receipt(
        stem,
        "command.txt",
        format!(
            "program={:?}\nargs={:?}\ncwd={:?}\nenv_overrides=\n{}\n",
            command.get_program(),
            command.get_args().collect::<Vec<_>>(),
            command.get_current_dir(),
            overrides,
        )
        .as_bytes(),
    );
}

fn write_source(root: &Path, name: &str, source: &str) -> PathBuf {
    let path = root.join(name);
    fs::write(&path, source).expect("write Lykn fixture");
    path
}

fn compile_file(root: &Path, source: &Path, output: &Path, strip_assertions: bool) -> Output {
    let stem = output
        .file_stem()
        .and_then(|name| name.to_str())
        .unwrap_or("compile");
    compile_file_named(
        root,
        source,
        output,
        strip_assertions,
        &format!("cli-{stem}"),
    )
}

fn compile_file_named(
    root: &Path,
    source: &Path,
    output: &Path,
    strip_assertions: bool,
    evidence_stem: &str,
) -> Output {
    let mut command = cli();
    command.current_dir(root).arg("compile").arg(source);
    if strip_assertions {
        command.arg("--strip-assertions");
    }
    command.arg("-o").arg(output);
    save_command(evidence_stem, &command);
    let output_result = command.output().expect("run lykn compile");
    save_output(evidence_stem, &output_result);
    eprintln!(
        "DISCARD_DECLARATIONS_CLI output={output:?} strip_assertions={strip_assertions} status={:?} stdout={:?} stderr={:?}",
        output_result.status.code(),
        String::from_utf8_lossy(&output_result.stdout),
        String::from_utf8_lossy(&output_result.stderr),
    );
    output_result
}

fn dts_path(js: &Path) -> PathBuf {
    js.with_extension("d.ts")
}

fn write_deno_config(root: &Path) -> PathBuf {
    let path = root.join("deno.json");
    fs::write(
        &path,
        r#"{"compilerOptions":{"strict":true,"exactOptionalPropertyTypes":true,"skipLibCheck":false}}"#,
    )
    .expect("write strict TypeScript config");
    path
}

fn deno_check(root: &Path, config: &Path, consumer: &Path) -> Output {
    let stem = consumer
        .file_stem()
        .and_then(|name| name.to_str())
        .unwrap_or("consumer");
    let mut command = Command::new(deno());
    command
        .current_dir(root)
        .args([
            "check",
            "--no-remote",
            "--no-npm",
            "--cached-only",
            "--no-lock",
            "--config",
        ])
        .arg(config)
        .arg(consumer);
    save_command(&format!("deno-{stem}"), &command);
    let output = command.output().expect("run offline TypeScript check");
    save_output(&format!("deno-{stem}"), &output);
    eprintln!(
        "DISCARD_DECLARATIONS_DENO consumer={consumer:?} status={:?} stdout={:?} stderr={:?}",
        output.status.code(),
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr),
    );
    output
}

fn declaration_source() -> &'static str {
    r#"
(func slots
  :args (:number _ :string _ :boolean _ :number _value :number arg0 :string arg2 :boolean arg0_1)
  :returns :array
  :body #a(_value arg0 arg2 arg0_1))
(func foreign-discard
  :args (:number _)
  :returns :number
  :body _)
(func before-required
  :args (:number fixed (default :string _ "fallback") :boolean tail)
  :returns :void
  :body (console:log fixed tail))
(func trailing-default
  :args (:number fixed (default :string _ "fallback"))
  :returns :void
  :body (console:log fixed))
(func rest-default
  :args ((default :number _ 0) (rest :string values))
  :returns :void
  :body (console:log values))
(func tuple-before-required
  :args ((array (default :number first 0) :string last))
  :returns :void
  :body (console:log first last))
(func tuple-trailing
  :args ((array :number first (default :string second "fallback") (rest :boolean tail)))
  :returns :void
  :body (console:log first second tail))
(func object-default
  :args ((object :number _ (default :string label "fallback")))
  :returns :void
  :body (console:log label))
(func nested-input
  :args ((object (alias :array items
    (array (object (default :number _ 7) :string label)
      (default :boolean _ true) :number total (rest :string tail)))))
  :returns :array
  :body #a(_ label total tail))
(func anonymous-slot
  :args ((object :number field) (default :string arg0 "fallback") (default :number arg0_1 1))
  :returns :void
  :body (console:log field arg0 arg0_1))
(func named-before-slot
  :args (:string arg1 (object :number field))
  :returns :void
  :body (console:log arg1 field))
(func discard-rest
  :args (:number head (rest :string _))
  :returns :void
  :body (console:log head))
(func tuple-skip
  :args ((array :number head _ :string tail))
  :returns :void
  :body (console:log head tail))
(func tuple-optional-skip
  :args ((array :number head _))
  :returns :void
  :body (console:log head))
(func choose
  (:args (:number _ :string arg0) :returns :number :body arg0:length)
  (:args (:string _ :number arg0) :returns :number :body 2))
(exports slots foreign-discard before-required trailing-default rest-default tuple-before-required tuple-trailing object-default nested-input anonymous-slot named-before-slot discard-rest tuple-skip tuple-optional-skip choose)
"#
}

#[test]
fn generated_declarations_typecheck_real_discard_default_rest_and_pattern_inputs() {
    let temp = TempDir::new().expect("create declaration fixture");
    let source = write_source(temp.path(), "input.lykn", declaration_source());
    let output = temp.path().join("module.js");
    let compiled = compile_file(temp.path(), &source, &output, false);
    assert!(
        compiled.status.success(),
        "Lykn compile failed: {}",
        String::from_utf8_lossy(&compiled.stderr)
    );

    let declaration = dts_path(&output);
    let generated = fs::read_to_string(&declaration)
        .expect("read actual generated declaration before assertions");
    save_receipt(
        "declaration-consumer",
        "generated.d.ts",
        generated.as_bytes(),
    );
    assert!(generated.contains("slots(arg0_2: number, arg1: string, arg2_1: boolean, _value: number, arg0: number, arg2: string, arg0_1: boolean): unknown[];"), "unexpected discard labels: {generated}");
    assert!(
        generated.contains("foreignDiscard(arg0: number): number;"),
        "foreign underscore function declaration changed: {generated}"
    );
    assert!(
        generated.contains(
            "beforeRequired(fixed: number, arg1: string | undefined, tail: boolean): void;"
        ),
        "default before required input is not explicit undefined: {generated}"
    );
    assert!(
        generated.contains("trailingDefault(fixed: number, arg1?: string): void;"),
        "trailing default is not optional: {generated}"
    );
    assert!(
        generated.contains("restDefault(arg0?: number, ...values: string[]): void;"),
        "default before rest is not optional: {generated}"
    );
    assert!(
        generated.contains("tupleBeforeRequired(arg0: [number | undefined, string]): void;"),
        "tuple default before required element is not represented: {generated}"
    );
    assert!(
        generated
            .contains("tupleTrailing(arg0: [number, (string | undefined)?, ...boolean[]]): void;"),
        "tuple default/rest tail is not represented: {generated}"
    );
    assert!(
        generated.contains("objectDefault(arg0: { _: number; label?: string | undefined }): void;"),
        "object discard key/default are not represented: {generated}"
    );
    assert!(
        generated.contains("nestedInput(arg0: { items: [{ _?: number | undefined; label: string }, boolean | undefined, number, ...string[]] }): unknown[];"),
        "recursive object/array/object input shape is not represented: {generated}"
    );
    assert!(
        generated.contains(
            "anonymousSlot(arg0_2: { field: number }, arg0?: string, arg0_1?: number): void;"
        ),
        "anonymous destructured slot did not avoid reserved optional named labels: {generated}"
    );
    assert!(
        generated.contains("namedBeforeSlot(arg1: string, arg1_1: { field: number }): void;"),
        "named arg1 did not reserve the destructured slot 1 label: {generated}"
    );
    assert!(
        generated.contains("discardRest(head: number, ...arg1: string[]): void;"),
        "discarded rest parameter lost its positional element type: {generated}"
    );
    assert!(
        generated.contains("tupleSkip(arg0: [number, unknown, string]): void;"),
        "bare tuple skip lost its required positional slot: {generated}"
    );
    assert!(
        generated.contains("tupleOptionalSkip(arg0: [number, (unknown | undefined)?]): void;"),
        "trailing bare tuple skip is not optional: {generated}"
    );
    assert_eq!(
        generated.matches("export function choose(").count(),
        2,
        "fixed multi-clause declarations should remain two overloads: {generated}"
    );

    let consumer = write_source(
        temp.path(),
        "consumer.ts",
        r#"import type * as declarations from "./module.d.ts";
type Slots = typeof declarations.slots;
declare const callSlots: Slots;
callSlots(1, "discarded", false, 7, 11, "last", true);
type ForeignDiscard = typeof declarations.foreignDiscard;
declare const callForeignDiscard: ForeignDiscard;
callForeignDiscard(7);
// @ts-expect-error first source slot remains a number
callSlots("wrong", "discarded", false, 7, 11, "last", true);
// @ts-expect-error final required argument remains required
callSlots(1, "discarded", false, 7, 11, "last");
type BeforeRequired = typeof declarations.beforeRequired;
declare const callBeforeRequired: BeforeRequired;
callBeforeRequired(1, undefined, true);
type TrailingDefault = typeof declarations.trailingDefault;
declare const callTrailingDefault: TrailingDefault;
callTrailingDefault(1);
callTrailingDefault(1, undefined);
type RestDefault = typeof declarations.restDefault;
declare const callRestDefault: RestDefault;
callRestDefault(undefined, "one", "two");
callRestDefault(4, "one");
type TupleBeforeRequired = typeof declarations.tupleBeforeRequired;
declare const callTupleBeforeRequired: TupleBeforeRequired;
callTupleBeforeRequired([undefined, "tail"]);
type TupleTrailing = typeof declarations.tupleTrailing;
declare const callTupleTrailing: TupleTrailing;
callTupleTrailing([1, undefined, true]);
type TupleOptionalSkip = typeof declarations.tupleOptionalSkip;
declare const callTupleOptionalSkip: TupleOptionalSkip;
callTupleOptionalSkip([1]);
callTupleOptionalSkip([1, undefined]);
type ObjectDefault = typeof declarations.objectDefault;
declare const callObjectDefault: ObjectDefault;
callObjectDefault({ _: 1, label: undefined });
type NestedInput = typeof declarations.nestedInput;
declare const callNestedInput: NestedInput;
callNestedInput({ items: [{ label: "ok", _: undefined }, undefined, 5, "kept"] });
callNestedInput({ items: [{ label: "second", _: 3 }, false, 6] });
// @ts-expect-error nested defaulted discard property is numeric
callNestedInput({ items: [{ label: "bad", _: "wrong" }, undefined, 5] });
// @ts-expect-error nested required label remains required
callNestedInput({ items: [{ _: 1 }, undefined, 5] });
// @ts-expect-error typed rest elements remain strings
callNestedInput({ items: [{ label: "bad" }, undefined, 5, 6] });
type AnonymousSlot = typeof declarations.anonymousSlot;
declare const callAnonymousSlot: AnonymousSlot;
callAnonymousSlot({ field: 1 });
callAnonymousSlot({ field: 1 }, undefined, undefined);
type NamedBeforeSlot = typeof declarations.namedBeforeSlot;
declare const callNamedBeforeSlot: NamedBeforeSlot;
callNamedBeforeSlot("first", { field: 2 });
// @ts-expect-error object source key '_' remains required data
callObjectDefault({ label: "x" });
type Choose = typeof declarations.choose;
declare const callChoose: Choose;
callChoose(1, "text");
callChoose("text", 1);
// @ts-expect-error fixed overloads retain their argument types
callChoose(true, 1);
"#,
    );
    let config = write_deno_config(temp.path());
    let checked = deno_check(temp.path(), &config, &consumer);
    assert!(
        checked.status.success(),
        "generated declaration consumer failed: {}",
        String::from_utf8_lossy(&checked.stderr)
    );

    let bad_consumer = write_source(
        temp.path(),
        "consumer-bad.ts",
        "import type * as declarations from \"./module.d.ts\";\ntype Slots = typeof declarations.slots;\ndeclare const callSlots: Slots;\ncallSlots(\"wrong\", \"discarded\", false, 7, 11, \"last\", true);\n",
    );
    let rejected = deno_check(temp.path(), &config, &bad_consumer);
    let diagnostics = String::from_utf8_lossy(&rejected.stderr);
    assert!(
        !rejected.status.success(),
        "unguarded bad call unexpectedly typechecked"
    );
    assert!(
        diagnostics.contains("TS2345"),
        "checker did not report a real argument-type error: {diagnostics}"
    );

    let stripped = temp.path().join("module-stripped.js");
    let stripped_result = compile_file(temp.path(), &source, &stripped, true);
    assert!(
        stripped_result.status.success(),
        "stripped compile failed: {}",
        String::from_utf8_lossy(&stripped_result.stderr)
    );
    let stripped_dts = fs::read(dts_path(&stripped)).expect("read stripped declaration");
    assert_eq!(stripped_dts, generated.as_bytes());

    let runtime_source = write_source(
        temp.path(),
        "runtime.js",
        "import { slots, foreignDiscard, nestedInput } from \"./module.js\";\nglobalThis._ = 99;\nconsole.log(JSON.stringify(slots(99, \"discarded\", false, 7, 11, \"last\", true)));\nconsole.log(JSON.stringify(foreignDiscard(7)));\nconst first = { items: [{ label: \"ok\" }, undefined, 5, \"kept\"] };\nconst firstLength = first.items.length;\nconsole.log(JSON.stringify(nestedInput(first)));\nconsole.log(JSON.stringify([firstLength, first.items.length]));\nconst second = { items: [{ label: \"second\", _: 3 }, false, 6] };\nconst secondLength = second.items.length;\nconsole.log(JSON.stringify(nestedInput(second)));\nconsole.log(JSON.stringify([secondLength, second.items.length]));\n",
    );
    let mut runtime_command = Command::new(deno());
    runtime_command
        .current_dir(temp.path())
        .args([
            "run",
            "--no-config",
            "--no-remote",
            "--cached-only",
            "--no-npm",
            "--deny-net",
            "--no-prompt",
        ])
        .arg(runtime_source);
    save_command("runtime-slots", &runtime_command);
    let runtime = runtime_command.output().expect("run generated JavaScript");
    save_output("runtime-slots", &runtime);
    assert!(
        runtime.status.success(),
        "generated JS failed: {}",
        String::from_utf8_lossy(&runtime.stderr)
    );
    assert_eq!(
        runtime.stdout,
        b"[7,11,\"last\",true]\n99\n[99,\"ok\",5,[\"kept\"]]\n[4,4]\n[99,\"second\",6,[]]\n[3,3]\n"
    );
    assert!(runtime.stderr.is_empty());

    let stripped_runtime_source = write_source(
        temp.path(),
        "runtime-stripped.js",
        "import { slots, foreignDiscard, nestedInput } from \"./module-stripped.js\";\nglobalThis._ = 99;\nconsole.log(JSON.stringify(slots(99, \"discarded\", false, 7, 11, \"last\", true)));\nconsole.log(JSON.stringify(foreignDiscard(7)));\nconst first = { items: [{ label: \"ok\" }, undefined, 5, \"kept\"] };\nconst firstLength = first.items.length;\nconsole.log(JSON.stringify(nestedInput(first)));\nconsole.log(JSON.stringify([firstLength, first.items.length]));\nconst second = { items: [{ label: \"second\", _: 3 }, false, 6] };\nconst secondLength = second.items.length;\nconsole.log(JSON.stringify(nestedInput(second)));\nconsole.log(JSON.stringify([secondLength, second.items.length]));\n",
    );
    let mut stripped_runtime_command = Command::new(deno());
    stripped_runtime_command
        .current_dir(temp.path())
        .args([
            "run",
            "--no-config",
            "--no-remote",
            "--cached-only",
            "--no-npm",
            "--deny-net",
            "--no-prompt",
        ])
        .arg(stripped_runtime_source);
    save_command("runtime-stripped", &stripped_runtime_command);
    let stripped_runtime = stripped_runtime_command
        .output()
        .expect("run stripped generated JavaScript");
    save_output("runtime-stripped", &stripped_runtime);
    assert!(
        stripped_runtime.status.success(),
        "stripped generated JS failed: {}",
        String::from_utf8_lossy(&stripped_runtime.stderr)
    );
    assert_eq!(
        stripped_runtime.stdout,
        b"[7,11,\"last\",true]\n99\n[99,\"ok\",5,[\"kept\"]]\n[4,4]\n[99,\"second\",6,[]]\n[3,3]\n"
    );
    assert!(stripped_runtime.stderr.is_empty());
}

#[test]
fn inline_and_named_binding_exports_match_runtime_and_empty_module_rules() {
    let temp = TempDir::new().expect("create export fixture");
    let source_text = r#"
(export (bind :number typed 5))
(export (bind literal "visible"))
(export (bind (object (alias _ count) _ (spread rest)) (obj :_ 99 :extra "schema")))
(export (bind _ 7 :number grouped-number 11 grouped-text "group"
  (object (alias "leaf" grouped-leaf)) (obj :leaf 17)))
(bind :number grouped-kept 13 :string grouped-hidden "hidden"
  (object (alias "leaf" grouped-selected)
    (alias "hidden" grouped-nested-hidden)) (obj :leaf 19 :hidden "hidden") _ 9)
(exports grouped-kept grouped-selected)
(bind (object (alias "public" visible) (alias "private" hidden)) (obj :public 7 :private 8))
(exports visible)
"#;
    let source = write_source(temp.path(), "exports.lykn", source_text);
    let output = temp.path().join("exports.js");
    let result = compile_file(temp.path(), &source, &output, false);
    assert!(
        result.status.success(),
        "export compile failed: {}",
        String::from_utf8_lossy(&result.stderr)
    );
    let dts =
        fs::read_to_string(dts_path(&output)).expect("read generated exports before assertions");
    save_receipt("exports", "generated.d.ts", dts.as_bytes());
    assert!(
        dts.contains("export const typed: number;"),
        "typed scalar inference changed: {dts}"
    );
    assert!(
        dts.contains("export const literal: string;"),
        "literal scalar inference changed: {dts}"
    );
    assert!(
        dts.contains("export const count: unknown;"),
        "destructured leaf must be unknown: {dts}"
    );
    assert!(
        dts.contains("export const rest: unknown;"),
        "spread binding must be projected: {dts}"
    );
    assert!(
        dts.contains("export const visible: unknown;"),
        "named destructured export missing: {dts}"
    );
    for declaration in [
        "export const groupedNumber: number;",
        "export const groupedText: string;",
        "export const groupedLeaf: unknown;",
        "export const groupedKept: number;",
        "export const groupedSelected: unknown;",
    ] {
        assert!(dts.contains(declaration), "missing `{declaration}`: {dts}");
    }
    assert!(
        !dts.contains("hidden")
            && !dts.contains("groupedHidden")
            && !dts.contains("groupedNestedHidden")
            && !dts.contains("_value"),
        "private bindings leaked: {dts}"
    );
    assert!(
        !dts.contains("const _:"),
        "discard was declared as a value: {dts}"
    );

    let namespace_consumer = write_source(
        temp.path(),
        "exports-consumer.ts",
        "import type * as api from \"./exports.d.ts\";\ntype Equal<Left, Right> = (<Value>() => Value extends Left ? 1 : 2) extends (<Value>() => Value extends Right ? 1 : 2) ? true : false;\ntype Assert<Value extends true> = Value;\ntype Expected = \"typed\" | \"literal\" | \"count\" | \"rest\" | \"groupedNumber\" | \"groupedText\" | \"groupedLeaf\" | \"groupedKept\" | \"groupedSelected\" | \"visible\";\ntype ExactNames = Assert<Equal<keyof typeof api, Expected>>;\ndeclare const values: typeof api;\nconst typed: number = values.typed;\nconst count: unknown = values.count;\nconst visible: unknown = values.visible;\nconst groupedNumber: number = values.groupedNumber;\nconst groupedText: string = values.groupedText;\nconst groupedLeaf: unknown = values.groupedLeaf;\nconst groupedKept: number = values.groupedKept;\nconst groupedSelected: unknown = values.groupedSelected;\n// @ts-expect-error discard is not a module binding\nvalues._;\n// @ts-expect-error unselected source binding is not a module export\nvalues.hidden;\n// @ts-expect-error unselected grouped binding is not a module export\nvalues.groupedHidden;\n// @ts-expect-error unselected nested binding is not a module export\nvalues.groupedNestedHidden;\nvoid typed;\nvoid count;\nvoid visible;\nvoid groupedNumber;\nvoid groupedText;\nvoid groupedLeaf;\nvoid groupedKept;\nvoid groupedSelected;\n",
    );
    let config = write_deno_config(temp.path());
    let namespace_check = deno_check(temp.path(), &config, &namespace_consumer);
    assert!(
        namespace_check.status.success(),
        "export declaration namespace check failed: {}",
        String::from_utf8_lossy(&namespace_check.stderr)
    );

    let runtime_source = write_source(
        temp.path(),
        "exports-runtime.js",
        "import * as values from \"./exports.js\";\nconsole.log(JSON.stringify(Object.keys(values).sort()));\nconsole.log(JSON.stringify([values.typed, values.literal, values.count, values.visible, values.rest, values.groupedNumber, values.groupedText, values.groupedLeaf, values.groupedKept, values.groupedSelected]));\n",
    );
    let mut runtime_command = Command::new(deno());
    runtime_command
        .current_dir(temp.path())
        .args([
            "run",
            "--no-config",
            "--no-remote",
            "--cached-only",
            "--no-npm",
            "--deny-net",
            "--no-prompt",
        ])
        .arg(runtime_source);
    save_command("runtime-exports", &runtime_command);
    let runtime = runtime_command.output().expect("run exported namespace");
    save_output("runtime-exports", &runtime);
    assert!(
        runtime.status.success(),
        "namespace runtime failed: {}",
        String::from_utf8_lossy(&runtime.stderr)
    );
    assert_eq!(
        runtime.stdout,
        b"[\"count\",\"groupedKept\",\"groupedLeaf\",\"groupedNumber\",\"groupedSelected\",\"groupedText\",\"literal\",\"rest\",\"typed\",\"visible\"]\n[5,\"visible\",99,7,{\"extra\":\"schema\"},11,\"group\",17,13,19]\n"
    );

    let discard_only = write_source(
        temp.path(),
        "discard-only.lykn",
        "(export (bind (array) #a() (object) {}))\n",
    );
    let discard_output = temp.path().join("discard-only.js");
    let discarded = compile_file(temp.path(), &discard_only, &discard_output, false);
    assert!(
        discarded.status.success(),
        "discard-only compile failed: {}",
        String::from_utf8_lossy(&discarded.stderr)
    );
    let discard_dts =
        fs::read_to_string(dts_path(&discard_output)).expect("read empty-module declaration");
    assert_eq!(discard_dts, "export {};\n");
    let empty_namespace_consumer = write_source(
        temp.path(),
        "empty-consumer.ts",
        "import type * as empty from \"./discard-only.d.ts\";\ntype Equal<Left, Right> = (<Value>() => Value extends Left ? 1 : 2) extends (<Value>() => Value extends Right ? 1 : 2) ? true : false;\ntype Assert<Value extends true> = Value;\ntype HasNoExports = Assert<Equal<keyof typeof empty, never>>;\n",
    );
    let config = write_deno_config(temp.path());
    let empty_namespace_check = deno_check(temp.path(), &config, &empty_namespace_consumer);
    assert!(
        empty_namespace_check.status.success(),
        "empty module declaration namespace check failed: {}",
        String::from_utf8_lossy(&empty_namespace_check.stderr)
    );

    let prior = write_source(
        temp.path(),
        "prior.lykn",
        "(export (bind :number old-name 1))\n",
    );
    let reused_output = temp.path().join("reused.js");
    let first = compile_file_named(
        temp.path(),
        &prior,
        &reused_output,
        false,
        "cli-reused-first",
    );
    assert!(first.status.success());
    let first_dts = fs::read_to_string(dts_path(&reused_output)).expect("read first declaration");
    save_receipt("reused-before", "d.ts", first_dts.as_bytes());
    assert!(first_dts.contains("oldName"));
    fs::write(&prior, "(export (bind _ 99))\n").expect("replace source with discard-only export");
    let second = compile_file_named(
        temp.path(),
        &prior,
        &reused_output,
        false,
        "cli-reused-discard-only",
    );
    assert!(second.status.success());
    let second_dts =
        fs::read_to_string(dts_path(&reused_output)).expect("read replaced declaration");
    save_receipt("reused-after", "d.ts", second_dts.as_bytes());
    assert_eq!(second_dts, "export {};\n");

    let empty = write_source(temp.path(), "empty.lykn", "(bind _ 1)\n");
    let empty_output = temp.path().join("empty.js");
    let empty_result = compile_file(temp.path(), &empty, &empty_output, false);
    assert!(empty_result.status.success());
    assert!(
        !dts_path(&empty_output).exists(),
        "non-module source gained a declaration marker"
    );

    write_source(temp.path(), "other.js", "export const upstream = 7;\n");
    for (name, text) in [
        ("default", "(export default 7)\n"),
        (
            "default-mixed",
            "(export (bind _ 99))\n(export default 7)\n",
        ),
        ("reexport", "(export \"./other.js\" (names upstream))\n"),
        (
            "reexport-mixed",
            "(export (bind _ 99))\n(export \"./other.js\" (names upstream))\n",
        ),
        ("kernel-export", "(kernel:export default 7)\n"),
        (
            "kernel-export-mixed",
            "(export (bind _ 99))\n(kernel:export default 7)\n",
        ),
    ] {
        let raw = write_source(temp.path(), &format!("{name}.lykn"), text);
        let raw_output = temp.path().join(format!("{name}.js"));
        let raw_result = compile_file(temp.path(), &raw, &raw_output, false);
        assert!(
            raw_result.status.success(),
            "raw export compile {name} failed: {}",
            String::from_utf8_lossy(&raw_result.stderr)
        );
        assert!(
            !dts_path(&raw_output).exists(),
            "unsupported export {name} was hidden by export {{}} marker"
        );
    }

    for (name, text) in [("empty", "(exports)\n"), ("wildcard", "(exports _)\n")] {
        let bad = write_source(temp.path(), &format!("bad-exports-{name}.lykn"), text);
        let bad_output = temp.path().join(format!("bad-exports-{name}.js"));
        let rejected = compile_file(temp.path(), &bad, &bad_output, false);
        assert!(
            !rejected.status.success(),
            "unsupported exports form was admitted: {text}"
        );
        assert!(!bad_output.exists());
        assert!(!dts_path(&bad_output).exists());
    }
}

#[test]
fn lykn_build_package_emits_the_same_discard_declarations() {
    let temp = TempDir::new().expect("create package project");
    let package = temp.path().join("packages/discarded");
    fs::create_dir_all(&package).expect("create package directory");
    fs::write(
        temp.path().join("project.json"),
        r#"{"workspace":["./packages/discarded"],"imports":{}}"#,
    )
    .expect("write workspace config");
    fs::write(
        package.join("deno.json"),
        r#"{"name":"@fixture/discarded","version":"0.0.1","exports":"./mod.js","lykn":{"kind":"runtime","emitDts":true}}"#,
    )
    .expect("write package config");
    fs::write(package.join("mod.lykn"), declaration_source()).expect("write package source");

    let cli_source = write_source(temp.path(), "cli-source.lykn", declaration_source());
    let cli_output = temp.path().join("cli-module.js");
    let cli_result = compile_file(temp.path(), &cli_source, &cli_output, false);
    assert!(
        cli_result.status.success(),
        "CLI declaration fixture failed: {}",
        String::from_utf8_lossy(&cli_result.stderr)
    );
    let cli_declaration = fs::read(dts_path(&cli_output)).expect("read CLI declaration bytes");

    let mut build_command = cli();
    build_command.current_dir(temp.path()).arg("build");
    save_command("package-build", &build_command);
    let build = build_command
        .output()
        .expect("run actual lykn build command");
    save_output("package-build", &build);
    assert!(
        build.status.success(),
        "lykn build failed: {}",
        String::from_utf8_lossy(&build.stderr)
    );
    let js = temp.path().join("target/lykn/build/discarded/mod.js");
    let dts = temp.path().join("target/lykn/build/discarded/mod.d.ts");
    let js_bytes = fs::read(js).expect("read package JavaScript before assertions");
    let dts_bytes = fs::read(dts).expect("read package declaration before assertions");
    save_receipt("package-build", "mod.d.ts", &dts_bytes);
    assert_eq!(
        dts_bytes, cli_declaration,
        "package and CLI DTS should match byte-for-byte for identical source"
    );
    assert!(!js_bytes.is_empty());
    assert!(String::from_utf8_lossy(&dts_bytes).contains("arg0_2: number"));
    assert!(String::from_utf8_lossy(&dts_bytes).contains("(string | undefined)?"));

    let consumer = write_source(
        temp.path(),
        "package-consumer.ts",
        "import type * as declarations from \"./target/lykn/build/discarded/mod.d.ts\";\ntype Slots = typeof declarations.slots;\ndeclare const callSlots: Slots;\ncallSlots(1, \"discarded\", false, 7, 11, \"last\", true);\ntype ForeignDiscard = typeof declarations.foreignDiscard;\ndeclare const callForeignDiscard: ForeignDiscard;\ncallForeignDiscard(7);\ntype ObjectDefault = typeof declarations.objectDefault;\ndeclare const callObjectDefault: ObjectDefault;\ncallObjectDefault({ _: 1, label: undefined });\ntype NestedInput = typeof declarations.nestedInput;\ndeclare const callNestedInput: NestedInput;\ncallNestedInput({ items: [{ label: \"ok\", _: undefined }, undefined, 5, \"kept\"] });\n",
    );
    let config = write_deno_config(temp.path());
    let checked = deno_check(temp.path(), &config, &consumer);
    assert!(
        checked.status.success(),
        "package declaration consumer failed: {}",
        String::from_utf8_lossy(&checked.stderr)
    );

    let runtime_source = write_source(
        temp.path(),
        "package-runtime.js",
        "import { slots, foreignDiscard } from \"./target/lykn/build/discarded/mod.js\";\nglobalThis._ = 99;\nconsole.log(JSON.stringify(slots(99, \"discarded\", false, 7, 11, \"last\", true)));\nconsole.log(JSON.stringify(foreignDiscard(7)));\n",
    );
    let mut runtime_command = Command::new(deno());
    runtime_command
        .current_dir(temp.path())
        .args([
            "run",
            "--no-config",
            "--no-remote",
            "--cached-only",
            "--no-npm",
            "--deny-net",
            "--no-prompt",
        ])
        .arg(runtime_source);
    save_command("package-runtime", &runtime_command);
    let runtime = runtime_command
        .output()
        .expect("run package-generated JavaScript");
    save_output("package-runtime", &runtime);
    assert!(
        runtime.status.success(),
        "package JavaScript failed: {}",
        String::from_utf8_lossy(&runtime.stderr)
    );
    assert_eq!(runtime.stdout, b"[7,11,\"last\",true]\n99\n");
    assert!(runtime.stderr.is_empty());
}

#[test]
fn constructor_discard_fields_remain_typed_data() {
    let temp = TempDir::new().expect("create constructor field fixture");
    let source = write_source(
        temp.path(),
        "schema.lykn",
        "(export (type Sample (Sample :number _)))\n",
    );
    let output = temp.path().join("schema.js");
    let compiled = compile_file(temp.path(), &source, &output, false);
    assert!(
        compiled.status.success(),
        "ADT source failed to compile: {}",
        String::from_utf8_lossy(&compiled.stderr)
    );
    let declaration = fs::read_to_string(dts_path(&output))
        .expect("read constructor declaration before assertions");
    save_receipt("schema", "generated.d.ts", declaration.as_bytes());
    assert!(
        declaration.contains("_: number"),
        "discard field lost its schema role: {declaration}"
    );
    assert!(
        declaration.contains("function Sample(_: number): Sample;"),
        "constructor input lost its type: {declaration}"
    );

    let consumer = write_source(
        temp.path(),
        "schema-consumer.ts",
        "import type { Sample } from \"./schema.d.ts\";\nimport type * as api from \"./schema.d.ts\";\ntype Constructor = typeof api.Sample;\ndeclare const construct: Constructor;\nconst sample: Sample = construct(7);\n// @ts-expect-error constructor input '_' stays a number\nconstruct(\"bad\");\nconst value: number = sample._;\n// @ts-expect-error constructor field '_' stays required data\nconst missing: Sample = { tag: \"Sample\" };\nvoid value;\nvoid missing;\n",
    );
    let config = write_deno_config(temp.path());
    let checked = deno_check(temp.path(), &config, &consumer);
    assert!(
        checked.status.success(),
        "constructor declaration consumer failed: {}",
        String::from_utf8_lossy(&checked.stderr)
    );

    let runtime_source = write_source(
        temp.path(),
        "schema-runtime.js",
        "import { Sample } from \"./schema.js\";\nconsole.log(JSON.stringify(Sample(7)));\ntry { Sample(\"bad\"); } catch (error) { console.log(error.constructor.name + \":\" + error.message); }\n",
    );
    let mut runtime_command = Command::new(deno());
    runtime_command
        .current_dir(temp.path())
        .args([
            "run",
            "--no-config",
            "--no-remote",
            "--cached-only",
            "--no-npm",
            "--deny-net",
            "--no-prompt",
        ])
        .arg(runtime_source);
    save_command("schema-runtime", &runtime_command);
    let runtime = runtime_command
        .output()
        .expect("run generated ADT constructor");
    save_output("schema-runtime", &runtime);
    assert!(
        runtime.status.success(),
        "ADT runtime failed: {}",
        String::from_utf8_lossy(&runtime.stderr)
    );
    assert_eq!(
        runtime.stdout,
        b"{\"tag\":\"Sample\",\"_\":7}\nTypeError:Sample: field '_' expected number, got string\n"
    );
    assert!(runtime.stderr.is_empty());
}
