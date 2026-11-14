use std::ffi::{OsStr, OsString};
use std::fs;
use std::path::{Path, PathBuf};
use std::process::{Command, Output};
use std::time::UNIX_EPOCH;

use tempfile::TempDir;

const TWICE_SOURCE: &str =
    "(macro twice (x) `(+ ,x ,x))\n(console:log (JSON:stringify (twice 21)))\n";
const ALIAS_MODULE_SOURCE: &str = "(macro alias-twice (x) `(+ ,x ,x))\n";
const ALIAS_CONSUMER_SOURCE: &str =
    "(import-macros \"astring\" (alias-twice))\n(console:log (JSON:stringify (alias-twice 21)))\n";
const M6_EMBEDDED_TRIGGER: &str =
    "(macro delivery-twice (x) `(+ ,x ,x))\n(console:log (JSON:stringify (delivery-twice 21)))\n";
const EXPECTED_RUNTIME: &[u8] = b"42\n";
const STRICT_DENO_ARGS: &[&str] = &[
    "run",
    "--no-config",
    "--cached-only",
    "--no-npm",
    "--no-remote",
    "--deny-net",
    "--no-prompt",
];

fn cli() -> Command {
    Command::new(env!("CARGO_BIN_EXE_lykn"))
}

fn deno_cache_dir() -> OsString {
    std::env::var_os("DENO_DIR").unwrap_or_else(|| {
        let home = PathBuf::from(std::env::var_os("HOME").expect("DENO requires HOME"));
        if cfg!(target_os = "macos") {
            home.join("Library/Caches/deno").into_os_string()
        } else {
            std::env::var_os("XDG_CACHE_HOME")
                .map(PathBuf::from)
                .unwrap_or_else(|| home.join(".cache"))
                .join("deno")
                .into_os_string()
        }
    })
}

fn evidence_root() -> Option<PathBuf> {
    let root = std::env::var_os("LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR").map(PathBuf::from)?;
    assert!(root.is_absolute(), "evidence directory must be absolute");
    assert!(root.is_dir(), "evidence directory must be precreated");
    Some(root)
}

fn save_receipt(name: &str, suffix: &str, bytes: &[u8]) {
    if let Some(root) = evidence_root() {
        fs::write(root.join(format!("{name}.{suffix}")), bytes)
            .expect("write macro-dependencies evidence receipt");
    }
}

fn resolve_macro_deno(path: Option<&OsStr>) -> Option<PathBuf> {
    let path = path?;
    for directory in std::env::split_paths(path) {
        let candidate = directory.join("deno");
        if candidate.is_file() {
            return Some(fs::canonicalize(&candidate).unwrap_or(candidate));
        }
    }
    None
}

fn selected_inherited_environment() -> String {
    [
        "PATH",
        "DENO_DIR",
        "LYKN_TEST_DENO",
        "XDG_CACHE_HOME",
        "TMPDIR",
        "NPM_CONFIG_CACHE",
        "LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR",
    ]
    .map(|key| format!("{key}={:?}", std::env::var_os(key)))
    .join("\n")
}

fn record_command(name: &str, command: &Command, macro_xdg: Option<&Path>) {
    let overrides = command
        .get_envs()
        .map(|(key, value)| format!("{key:?}={value:?}"))
        .collect::<Vec<_>>()
        .join("\n");
    let path = command
        .get_envs()
        .find(|(key, _)| *key == OsStr::new("PATH"))
        .and_then(|(_, value)| value);
    let inherited_path = std::env::var_os("PATH");
    let resolved_macro_deno = resolve_macro_deno(path.or(inherited_path.as_deref()));
    let description = format!(
        "program={:?}\nargs={:?}\ncwd={:?}\nenv_overrides=\n{}\nselected_inherited_env=\n{}\nmacro_child_program=deno\nmacro_child_resolved_executable={resolved_macro_deno:?}\nmacro_child_xdg_cache={macro_xdg:?}\nmacro_child_argv=not separately traced\n",
        command.get_program(),
        command.get_args().collect::<Vec<_>>(),
        command.get_current_dir(),
        overrides,
        selected_inherited_environment(),
    );
    save_receipt(name, "command.txt", description.as_bytes());
}

fn record_output(name: &str, output: &Output) {
    let status = format!(
        "success={} code={:?}\n",
        output.status.success(),
        output.status.code()
    );
    save_receipt(name, "stdout.bin", &output.stdout);
    save_receipt(name, "stderr.bin", &output.stderr);
    save_receipt(name, "status.txt", status.as_bytes());
}

fn write_source(root: &Path, file_name: &str, source: &str) -> PathBuf {
    let path = root.join(file_name);
    fs::write(&path, source).expect("write macro-dependencies source fixture");
    path
}

fn write_xdg(root: &Path) -> PathBuf {
    let path = root.join("xdg-cache");
    fs::create_dir_all(&path).expect("create owned XDG cache root");
    path
}

fn owned_embedded_root(xdg: &Path) -> PathBuf {
    xdg.join("lykn")
        .join("embedded")
        .join(format!("{}-compiler-split", env!("CARGO_PKG_VERSION")))
}

fn compile_recorded(
    name: &str,
    fixture: &Path,
    source_path: &Path,
    source: &[u8],
    output_path: &Path,
    xdg: &Path,
) -> (Output, Option<Vec<u8>>, Option<Vec<u8>>) {
    save_receipt(name, "source.bin", source);
    let mut command = cli();
    command
        .current_dir(fixture)
        .env("XDG_CACHE_HOME", xdg)
        .arg("compile")
        .arg(source_path)
        .arg("-o")
        .arg(output_path);
    record_command(name, &command, Some(xdg));
    let result = command.output().expect("start lykn macro compile process");
    record_output(name, &result);

    let generated = fs::read(output_path).ok();
    let declaration_path = output_path.with_extension("d.ts");
    let declaration = fs::read(&declaration_path).ok();
    save_receipt(
        name,
        "generated.js",
        generated.as_deref().unwrap_or_default(),
    );
    save_receipt(
        name,
        "declaration.d.ts",
        declaration.as_deref().unwrap_or_default(),
    );
    save_receipt(
        name,
        "artifacts.txt",
        format!(
            "js_path={output_path:?}\njs_exists={}\ndts_path={declaration_path:?}\ndts_exists={}\n",
            generated.is_some(),
            declaration.is_some(),
        )
        .as_bytes(),
    );
    (result, generated, declaration)
}

fn run_strict_recorded(name: &str, fixture: &Path, module: &Path) -> Output {
    let deno = std::env::var_os("LYKN_TEST_DENO").unwrap_or_else(|| OsString::from("deno"));
    let mut command = Command::new(deno);
    command
        .current_dir(fixture)
        .args(STRICT_DENO_ARGS)
        .arg(module);
    record_command(name, &command, None);
    let output = command.output().expect("start strict Deno child");
    record_output(name, &output);
    output
}

fn set_old_mtime(path: &Path) {
    fs::File::open(path)
        .and_then(|file| file.set_modified(UNIX_EPOCH))
        .expect("set caller config/lock sentinel mtime");
}

#[derive(Debug)]
struct ProjectFiles {
    config: PathBuf,
    lock: PathBuf,
    config_bytes: Vec<u8>,
    lock_bytes: Vec<u8>,
}

fn package_lock_bytes() -> Vec<u8> {
    fs::read(
        Path::new(env!("CARGO_MANIFEST_DIR")).join("../lykn-lang/embedded/packages/lang/deno.lock"),
    )
    .expect("read existing embedded package lock bytes")
}

fn package_config_bytes() -> Vec<u8> {
    fs::read(
        Path::new(env!("CARGO_MANIFEST_DIR")).join("../lykn-lang/embedded/packages/lang/deno.json"),
    )
    .expect("read existing embedded package config bytes")
}

fn write_project(root: &Path, config: &str) -> ProjectFiles {
    let config_path = root.join("project.json");
    let lock_path = root.join("deno.lock");
    let config_bytes = config.as_bytes().to_vec();
    let lock_bytes = package_lock_bytes();
    fs::write(&config_path, &config_bytes).expect("write caller project config");
    fs::write(&lock_path, &lock_bytes).expect("write caller lock from existing package lock");
    set_old_mtime(&config_path);
    set_old_mtime(&lock_path);
    ProjectFiles {
        config: config_path,
        lock: lock_path,
        config_bytes,
        lock_bytes,
    }
}

fn record_project_state(name: &str, phase: &str, project: &ProjectFiles) -> (Vec<u8>, Vec<u8>) {
    let config = fs::read(&project.config).expect("read caller config state");
    let lock = fs::read(&project.lock).expect("read caller lock state");
    let config_mtime = fs::metadata(&project.config)
        .and_then(|metadata| metadata.modified())
        .expect("read caller config mtime");
    let lock_mtime = fs::metadata(&project.lock)
        .and_then(|metadata| metadata.modified())
        .expect("read caller lock mtime");
    save_receipt(name, &format!("{phase}-caller-config.json"), &config);
    save_receipt(name, &format!("{phase}-caller-lock.json"), &lock);
    save_receipt(
        name,
        &format!("{phase}-caller-state.txt"),
        format!("config_mtime={config_mtime:?}\nlock_mtime={lock_mtime:?}\n").as_bytes(),
    );
    (config, lock)
}

fn project_mtimes(project: &ProjectFiles) -> (std::time::SystemTime, std::time::SystemTime) {
    (
        fs::metadata(&project.config)
            .and_then(|metadata| metadata.modified())
            .expect("read caller config mtime"),
        fs::metadata(&project.lock)
            .and_then(|metadata| metadata.modified())
            .expect("read caller lock mtime"),
    )
}

fn assert_successful_runtime(
    name: &str,
    fixture: &Path,
    source_path: &Path,
    source: &[u8],
    output_path: &Path,
    xdg: &Path,
) {
    let (compiled, generated, declaration) =
        compile_recorded(name, fixture, source_path, source, output_path, xdg);
    let runtime = if generated.is_some() {
        Some(run_strict_recorded(
            &format!("{name}-runtime"),
            fixture,
            output_path,
        ))
    } else {
        None
    };

    assert_eq!(
        compiled.status.code(),
        Some(0),
        "{name} compile stderr: {:?}",
        compiled.stderr
    );
    assert!(generated.is_some(), "{name} compile produced no JavaScript");
    assert!(
        declaration.is_none(),
        "{name} unexpectedly emitted declarations"
    );
    let runtime = runtime.expect("successful compile must have a runtime observation");
    assert_eq!(
        runtime.status.code(),
        Some(0),
        "{name} runtime stderr: {:?}",
        runtime.stderr
    );
    assert_eq!(runtime.stdout, EXPECTED_RUNTIME, "{name} runtime stdout");
    assert!(
        runtime.stderr.is_empty(),
        "{name} runtime stderr: {:?}",
        runtime.stderr
    );
}

fn assert_scope_runtime(name: &str, source: &str, expected: &[u8]) -> Vec<u8> {
    let fixture = TempDir::new().expect("create scope regression fixture");
    let xdg = write_xdg(fixture.path());
    let source_path = write_source(fixture.path(), "scope.lykn", source);
    let output_path = fixture.path().join("scope.mjs");
    let source_bytes = fs::read(&source_path).expect("read scope regression fixture");
    let (compiled, generated, declaration) = compile_recorded(
        name,
        fixture.path(),
        &source_path,
        &source_bytes,
        &output_path,
        &xdg,
    );
    assert_eq!(
        compiled.status.code(),
        Some(0),
        "{name}: {:?}",
        compiled.stderr
    );
    assert!(
        declaration.is_none(),
        "{name}: unexpected declaration output"
    );
    let generated = generated.expect("successful compile must produce ESM");
    let runtime = run_strict_recorded(&format!("{name}-runtime"), fixture.path(), &output_path);
    assert_eq!(
        runtime.status.code(),
        Some(0),
        "{name}: {:?}",
        runtime.stderr
    );
    assert_eq!(runtime.stdout, expected, "{name} runtime output");
    assert!(runtime.stderr.is_empty(), "{name}: {:?}", runtime.stderr);
    generated
}

fn assert_export_scope_runtime(name: &str, source: &str, expected: &[u8]) -> Vec<u8> {
    let fixture = TempDir::new().expect("create export scope regression fixture");
    let xdg = write_xdg(fixture.path());
    let source_path = write_source(fixture.path(), "export-scope.lykn", source);
    let output_path = fixture.path().join("export-scope.mjs");
    let source_bytes = fs::read(&source_path).expect("read export scope regression fixture");
    let (compiled, generated, _declaration) = compile_recorded(
        name,
        fixture.path(),
        &source_path,
        &source_bytes,
        &output_path,
        &xdg,
    );
    assert_eq!(
        compiled.status.code(),
        Some(0),
        "{name}: {:?}",
        compiled.stderr
    );
    let generated = generated.expect("successful compile must produce ESM");
    let runtime = run_strict_recorded(&format!("{name}-runtime"), fixture.path(), &output_path);
    assert_eq!(
        runtime.status.code(),
        Some(0),
        "{name}: {:?}",
        runtime.stderr
    );
    assert_eq!(runtime.stdout, expected, "{name} runtime output");
    assert!(runtime.stderr.is_empty(), "{name}: {:?}", runtime.stderr);
    generated
}

fn assert_kernel_import_scope_runtime() {
    let name = "b2a-native-kernel-import-local-shadows-array-form";
    let fixture = TempDir::new().expect("create local import fixture");
    let xdg = write_xdg(fixture.path());
    fs::write(
        fixture.path().join("dep.mjs"),
        "export default function importedArray(value) { return 42; }\n",
    )
    .expect("write local import module");
    let source_path = write_source(
        fixture.path(),
        "import-scope.lykn",
        "(kernel:import \"./dep.mjs\" array) (console:log (array 1))",
    );
    let output_path = fixture.path().join("import-scope.mjs");
    let source = fs::read(&source_path).expect("read local import source");
    let (compiled, generated, _) = compile_recorded(
        name,
        fixture.path(),
        &source_path,
        &source,
        &output_path,
        &xdg,
    );
    assert_eq!(
        compiled.status.code(),
        Some(0),
        "{name}: {:?}",
        compiled.stderr
    );
    let generated = generated.expect("successful import compile emits ESM");
    assert!(String::from_utf8_lossy(&generated).contains("import array"));
    let runtime = run_strict_recorded(&format!("{name}-runtime"), fixture.path(), &output_path);
    assert_eq!(
        runtime.status.code(),
        Some(0),
        "{name}: {:?}",
        runtime.stderr
    );
    assert_eq!(runtime.stdout, b"42\n");
    assert!(runtime.stderr.is_empty());
}

#[test]
fn b2a_native_macro_results_reenter_bound_and_sugar_priority() {
    let bound = assert_scope_runtime(
        "b2a-native-bound-result-head",
        "(macro redirect () `(invoke 1)) (macro invoke (x) `99) (bind invoke (fn (:number x) (+ x 40))) (console:log (redirect))",
        b"41\n",
    );
    assert!(String::from_utf8_lossy(&bound).contains("console.log(invoke(1));"));

    let sugar = assert_scope_runtime(
        "b2a-native-sugar-result-head",
        "(macro redirect () `(car (cons 41 0))) (macro car (x) `99) (console:log (redirect))",
        b"41\n",
    );
    assert!(!String::from_utf8_lossy(&sugar).contains("console.log(99);"));

    assert_scope_runtime(
        "b2a-native-multi-step-head-chain",
        "(macro first () `(second)) (macro second () `(third)) (macro third () `41) (console:log (first))",
        b"41\n",
    );
}

#[test]
fn b2a_native_macro_head_chain_limit_remains_a_diagnostic() {
    let fixture = TempDir::new().expect("create runaway macro fixture");
    let xdg = write_xdg(fixture.path());
    let source_path = write_source(
        fixture.path(),
        "runaway.lykn",
        "(macro alpha () (object (type \"list\") (values (array (object (type \"atom\") (value \"beta\")))))) (macro beta () (object (type \"list\") (values (array (object (type \"atom\") (value \"alpha\")))))) (alpha)",
    );
    let output_path = fixture.path().join("runaway.mjs");
    let source = fs::read(&source_path).expect("read runaway macro fixture");
    let (compiled, generated, _) = compile_recorded(
        "b2a-native-head-chain-limit",
        fixture.path(),
        &source_path,
        &source,
        &output_path,
        &xdg,
    );
    assert_eq!(compiled.status.code(), Some(1), "{:?}", compiled.stderr);
    assert!(
        String::from_utf8_lossy(&compiled.stderr)
            .contains("expansion limit (1000) exceeded expanding 'alpha'"),
        "{:?}",
        compiled.stderr
    );
    assert!(
        generated.is_none(),
        "runaway expansion must not emit output"
    );
}

#[test]
fn b2a_native_kernel_named_function_executes_parameter_call() {
    let generated = assert_scope_runtime(
        "b2a-native-kernel-named-function-runtime",
        "(bind apply (kernel:function apply (array) (return (array 7)))) (console:log (apply (kernel:function identity (value) (return value))))",
        b"7\n",
    );
    assert!(String::from_utf8_lossy(&generated).contains("return array(7);"));
}

#[test]
fn b2a_native_kernel_named_function_name_is_recursive_scope() {
    let generated = assert_scope_runtime(
        "b2a-native-kernel-function-self-name",
        "(bind recurse (kernel:function array (n) (return (if (> n 0) (array (- n 1)) 7)))) (console:log (recurse 2))",
        b"7\n",
    );
    assert!(String::from_utf8_lossy(&generated).contains("function array(n)"));
}

#[test]
fn b2a_native_enclosing_declaration_sites_follow_export_dispatch() {
    assert_scope_runtime(
        "b2a-native-bound-export-call-does-not-hoist",
        "(set-symbol! globalThis :array 100) (bind bind (fn (:any left :any right) left)) (bind array 1) (console:log (array 7))",
        b"[ 7 ]\n",
    );
    assert_export_scope_runtime(
        "b2a-native-normal-export-exposes-named-function",
        "(export (func array :args (:number value) :body (+ value 40))) (console:log (array 1))",
        b"41\n",
    );
    assert_export_scope_runtime(
        "b2a-native-async-export-exposes-named-function",
        "(export (async (func array :args (:number value) :body (+ value 40)))) (console:log (await (array 1)))",
        b"41\n",
    );
    assert_export_scope_runtime(
        "b2a-native-default-export-exposes-direct-function",
        "(export default (func array :args (:number value) :body (+ value 40))) (console:log (array 1))",
        b"41\n",
    );
    assert_export_scope_runtime(
        "b2a-native-default-export-exposes-direct-class",
        "(export default (class array () (static (value () (return 41))))) (console:log (array:value))",
        b"41\n",
    );
    assert_export_scope_runtime(
        "b2a-native-default-export-expression-does-not-hoist",
        "(export default (? true (kernel:function array (value) (return (+ value 40))) undefined)) (console:log (array 1))",
        b"[ 1 ]\n",
    );
}

#[test]
fn b2a_native_kernel_import_local_participates_in_enclosing_dispatch() {
    assert_kernel_import_scope_runtime();
}

#[test]
fn b2a_native_pass1_does_not_promote_bound_call_operands_to_declarations() {
    assert_scope_runtime(
        "b2a-native-pass1-bound-bind-call-does-not-shadow-macro",
        "(set-symbol! globalThis :macro 100) (bind bind (fn (:any left :any right) left)) (bind macro 1) (macro answer () `41) (console:log (answer))",
        b"41\n",
    );
    assert_scope_runtime(
        "b2a-native-pass1-real-bound-macro-still-shadows",
        "(set-symbol! globalThis :answer 0) (bind macro (fn (:any name :any params :any body) 42)) (macro answer 1 41) (console:log (macro answer 1 41))",
        b"42\n",
    );
}

#[test]
fn b2a_native_preflights_typed_source_headers_before_region_macros() {
    let invalid_headers = [
        (
            "b2a-r05-invalid-func-header",
            "(func invalid :args (:number 9) :body (header-probe))",
            "parameter name must be an atom",
        ),
        (
            "b2a-r05-invalid-default-header",
            "(func invalid :args ((default :number 9 0)) :body (header-probe))",
            "(default) expected :type name value",
        ),
        (
            "b2a-r05-invalid-fn-header",
            "(bind invalid (fn (:number 9) (header-probe)))",
            "parameter name must be an atom",
        ),
        (
            "b2a-r05-invalid-genfn-header",
            "(bind invalid (genfn (:number 9) (header-probe)))",
            "parameter name must be an atom",
        ),
        (
            "b2a-r05-invalid-lambda-header",
            "(bind invalid (lambda (:number 9) (header-probe)))",
            "parameter name must be an atom",
        ),
        (
            "b2a-r05-invalid-later-clause-header",
            "(func invalid (:args (:number left) :body (header-probe)) (:args (:number 9 :number right) :body 41))",
            "parameter name must be an atom",
        ),
    ];
    for (name, declaration, diagnostic) in invalid_headers {
        let fixture = TempDir::new().expect("create typed-header fixture");
        let xdg = write_xdg(fixture.path());
        let source = format!(
            "(macro header-probe () (get null \"header-body-was-expanded\"))\n{declaration}\n"
        );
        let source_path = write_source(fixture.path(), "header.lykn", &source);
        let output_path = fixture.path().join("header.mjs");
        let (compiled, _, _) = compile_recorded(
            name,
            fixture.path(),
            &source_path,
            source.as_bytes(),
            &output_path,
            &xdg,
        );
        let stderr = String::from_utf8_lossy(&compiled.stderr);
        assert_ne!(
            compiled.status.code(),
            Some(0),
            "{name} unexpectedly compiled"
        );
        assert!(
            stderr.contains(diagnostic),
            "{name}: expected {diagnostic:?}, got {stderr}"
        );
        assert!(
            !stderr.contains("header-body-was-expanded"),
            "{name} expanded a body macro before reporting its header: {stderr}"
        );
    }
    assert_scope_runtime(
        "b2a-r05-valid-header-probe-runs",
        "(macro header-probe () `41) (func valid :args (:number value) :body (header-probe)) (console:log (valid 1))",
        b"41\n",
    );
    assert_scope_runtime(
        "b2a-r05-valid-default-and-body-probes-run",
        "(macro default-probe () `40) (macro body-probe () `1) (func valid :args ((default :number value (default-probe))) :body (+ value (body-probe))) (console:log (valid))",
        b"41\n",
    );
    assert_scope_runtime(
        "b2a-r05-genfn-metadata-probe-is-inert",
        "(macro metadata-probe () (get null \"genfn-metadata-was-expanded\")) (bind gen (genfn () :yields (metadata-probe) (yield 41))) (console:log (Array:from (gen)))",
        b"[ 41 ]\n",
    );
    assert_scope_runtime(
        "b2a-r05-genfn-inert-eval-payload",
        "(bind gen (genfn () :yields (bind eval 1) (yield 41))) (console:log (Array:from (gen)))",
        b"[ 41 ]\n",
    );
    let fixture = TempDir::new().expect("create genfn body binding fixture");
    let xdg = write_xdg(fixture.path());
    let source = "(bind gen (genfn () :yields :any (bind eval 1)))";
    let source_path = write_source(fixture.path(), "genfn-body.lykn", source);
    let output_path = fixture.path().join("genfn-body.mjs");
    let (compiled, _, _) = compile_recorded(
        "b2a-r05-genfn-body-binding-is-visible",
        fixture.path(),
        &source_path,
        source.as_bytes(),
        &output_path,
        &xdg,
    );
    let stderr = String::from_utf8_lossy(&compiled.stderr);
    assert_ne!(compiled.status.code(), Some(0));
    assert!(
        stderr.contains("'eval' is forbidden as a strict-mode binding identifier"),
        "{stderr}"
    );
}

#[test]
fn m1_no_project_cold_xdg_uses_compiler_owned_dependencies() {
    let fixture = TempDir::new().expect("create no-project macro fixture");
    let xdg = write_xdg(fixture.path());
    let source_path = write_source(fixture.path(), "twice.lykn", TWICE_SOURCE);
    let source = fs::read(&source_path).expect("read no-project source fixture");
    let output_path = fixture.path().join("m1.js");

    assert!(!fixture.path().join("project.json").exists());
    assert_successful_runtime(
        "m1-no-project-cold-xdg",
        fixture.path(),
        &source_path,
        &source,
        &output_path,
        &xdg,
    );
}

#[test]
fn m2_project_without_astring_keeps_caller_files_unchanged() {
    let fixture = TempDir::new().expect("create no-astring project fixture");
    let xdg = write_xdg(fixture.path());
    let project = write_project(fixture.path(), r#"{"workspace":[],"imports":{}}"#);
    let source_path = write_source(fixture.path(), "twice.lykn", TWICE_SOURCE);
    let source = fs::read(&source_path).expect("read no-astring source fixture");
    let output_path = fixture.path().join("m2.js");
    let (config_before, lock_before) =
        record_project_state("m2-no-astring-project", "before", &project);
    let caller_mtimes_before = project_mtimes(&project);

    let (compiled, generated, declaration) = compile_recorded(
        "m2-no-astring-project",
        fixture.path(),
        &source_path,
        &source,
        &output_path,
        &xdg,
    );
    let runtime = generated.as_ref().map(|_| {
        run_strict_recorded(
            "m2-no-astring-project-runtime",
            fixture.path(),
            &output_path,
        )
    });
    let (config_after, lock_after) =
        record_project_state("m2-no-astring-project", "after", &project);
    let caller_mtimes_after = project_mtimes(&project);

    assert_eq!(
        compiled.status.code(),
        Some(0),
        "M2 compile stderr: {:?}",
        compiled.stderr
    );
    assert!(generated.is_some(), "M2 compile produced no JavaScript");
    assert!(
        declaration.is_none(),
        "M2 unexpectedly emitted declarations"
    );
    assert_eq!(config_before, project.config_bytes);
    assert_eq!(lock_before, project.lock_bytes);
    assert_eq!(config_after, config_before);
    assert_eq!(lock_after, lock_before);
    assert_eq!(caller_mtimes_after, caller_mtimes_before);
    let runtime = runtime.expect("successful M2 compile must have a runtime observation");
    assert_eq!(
        runtime.status.code(),
        Some(0),
        "M2 runtime stderr: {:?}",
        runtime.stderr
    );
    assert_eq!(runtime.stdout, EXPECTED_RUNTIME);
    assert!(runtime.stderr.is_empty());
}

#[test]
fn m3_astring_alias_still_resolves_unique_imported_macro() {
    let fixture = TempDir::new().expect("create colliding-alias project fixture");
    let xdg = write_xdg(fixture.path());
    let project = write_project(
        fixture.path(),
        r#"{"workspace":[],"imports":{"astring":"./macros/mod.lykn"}}"#,
    );
    let macro_dir = fixture.path().join("macros");
    fs::create_dir_all(&macro_dir).expect("create local macro module directory");
    let macro_module_path = write_source(&macro_dir, "mod.lykn", ALIAS_MODULE_SOURCE);
    save_receipt(
        "m3-astring-alias-unique-macro",
        "macro-module.source.bin",
        &fs::read(&macro_module_path).expect("read local macro module source"),
    );
    let source_path = write_source(fixture.path(), "consumer.lykn", ALIAS_CONSUMER_SOURCE);
    let source = fs::read(&source_path).expect("read alias consumer source");
    let output_path = fixture.path().join("m3.js");
    let (config_before, lock_before) =
        record_project_state("m3-astring-alias-unique-macro", "before", &project);
    let caller_mtimes_before = project_mtimes(&project);

    let (compiled, generated, declaration) = compile_recorded(
        "m3-astring-alias-unique-macro",
        fixture.path(),
        &source_path,
        &source,
        &output_path,
        &xdg,
    );
    let runtime = generated.as_ref().map(|_| {
        run_strict_recorded(
            "m3-astring-alias-unique-macro-runtime",
            fixture.path(),
            &output_path,
        )
    });
    let (config_after, lock_after) =
        record_project_state("m3-astring-alias-unique-macro", "after", &project);
    let caller_mtimes_after = project_mtimes(&project);

    assert_eq!(
        compiled.status.code(),
        Some(0),
        "M3 compile stderr: {:?}",
        compiled.stderr
    );
    assert!(generated.is_some(), "M3 compile produced no JavaScript");
    assert!(
        declaration.is_none(),
        "M3 unexpectedly emitted declarations"
    );
    assert_eq!(config_before, project.config_bytes);
    assert_eq!(lock_before, project.lock_bytes);
    assert_eq!(config_after, config_before);
    assert_eq!(lock_after, lock_before);
    assert_eq!(caller_mtimes_after, caller_mtimes_before);
    let runtime = runtime.expect("successful M3 compile must have a runtime observation");
    assert_eq!(
        runtime.status.code(),
        Some(0),
        "M3 runtime stderr: {:?}",
        runtime.stderr
    );
    assert_eq!(runtime.stdout, EXPECTED_RUNTIME);
    assert!(runtime.stderr.is_empty());
}

#[test]
fn m4_same_version_cache_reextracts_missing_config() {
    let fixture = TempDir::new().expect("create warm-cache fixture");
    let xdg = write_xdg(fixture.path());
    let old_root = xdg
        .join("lykn")
        .join("embedded")
        .join(format!("{}-expander-split", env!("CARGO_PKG_VERSION")));
    fs::create_dir_all(&old_root).expect("create S04 expander-split cache sibling");
    let old_marker = old_root.join("old-cache-preservation.txt");
    fs::write(&old_marker, b"old cache sibling remains intact\n")
        .expect("seed old same-version cache sibling");
    let source_path = write_source(fixture.path(), "twice.lykn", TWICE_SOURCE);
    let source = fs::read(&source_path).expect("read warm-cache source fixture");
    let warmup_output = fixture.path().join("m4-warmup.js");
    let recovered_output = fixture.path().join("m4-recovered.js");

    let (warmup, warmup_js, warmup_dts) = compile_recorded(
        "m4-warmup",
        fixture.path(),
        &source_path,
        &source,
        &warmup_output,
        &xdg,
    );
    assert_eq!(
        fs::read(&old_marker).expect("read old cache marker after cold compile"),
        b"old cache sibling remains intact\n",
        "cold compilation must preserve the S04 cache sibling",
    );
    let owned_root = owned_embedded_root(&xdg);
    let config_path = owned_root.join("packages/lang/deno.json");
    let lock_path = owned_root.join("packages/lang/deno.lock");
    let config_before =
        fs::read(&config_path).expect("capture materialized config before deletion");
    let lock_before = fs::read(&lock_path).expect("capture materialized lock before deletion");
    save_receipt(
        "m4-cache-recovery",
        "owned-config-before.bin",
        &config_before,
    );
    save_receipt("m4-cache-recovery", "owned-lock-before.bin", &lock_before);
    fs::remove_file(&config_path).expect("remove only materialized package config");
    let config_missing_before_recovery = !config_path.exists();
    let lock_present_before_recovery = lock_path.is_file();
    save_receipt(
        "m4-cache-recovery",
        "owned-config-missing.txt",
        format!(
            "config_exists={}\nlock_exists={}\n",
            !config_missing_before_recovery, lock_present_before_recovery
        )
        .as_bytes(),
    );

    let (recovered, recovered_js, recovered_dts) = compile_recorded(
        "m4-recovered",
        fixture.path(),
        &source_path,
        &source,
        &recovered_output,
        &xdg,
    );
    assert_eq!(
        fs::read(&old_marker).expect("read old cache marker after warm compile"),
        b"old cache sibling remains intact\n",
        "warm compilation and config recovery must preserve the S04 cache sibling",
    );
    let runtime = recovered_js
        .as_ref()
        .map(|_| run_strict_recorded("m4-recovered-runtime", fixture.path(), &recovered_output));
    let config_after = fs::read(&config_path).ok();
    let lock_after = fs::read(&lock_path).ok();
    save_receipt(
        "m4-cache-recovery",
        "owned-config-after.bin",
        config_after.as_deref().unwrap_or_default(),
    );
    save_receipt(
        "m4-cache-recovery",
        "owned-lock-after.bin",
        lock_after.as_deref().unwrap_or_default(),
    );

    assert_eq!(
        warmup.status.code(),
        Some(0),
        "M4 warmup stderr: {:?}",
        warmup.stderr
    );
    assert!(warmup_js.is_some(), "M4 warmup produced no JavaScript");
    assert!(
        warmup_dts.is_none(),
        "M4 warmup unexpectedly emitted declarations"
    );
    assert!(
        config_missing_before_recovery,
        "M4 config was not absent before recovery"
    );
    assert!(
        lock_present_before_recovery,
        "M4 lock was absent before recovery"
    );
    assert_eq!(
        recovered.status.code(),
        Some(0),
        "M4 recovery stderr: {:?}",
        recovered.stderr
    );
    assert!(recovered_js.is_some(), "M4 recovery produced no JavaScript");
    assert!(
        recovered_dts.is_none(),
        "M4 recovery unexpectedly emitted declarations"
    );
    assert_eq!(config_after, Some(config_before));
    assert_eq!(lock_after, Some(lock_before));
    assert_eq!(config_after, Some(package_config_bytes()));
    assert_eq!(lock_after, Some(package_lock_bytes()));
    let runtime = runtime.expect("successful M4 recovery must have a runtime observation");
    assert_eq!(
        runtime.status.code(),
        Some(0),
        "M4 runtime stderr: {:?}",
        runtime.stderr
    );
    assert_eq!(runtime.stdout, EXPECTED_RUNTIME);
    assert!(runtime.stderr.is_empty());
}

#[test]
fn m5_blocked_xdg_materialization_returns_io_error_without_output() {
    let fixture = TempDir::new().expect("create blocked-cache fixture");
    let blocked_xdg = fixture.path().join("xdg-cache-is-a-file");
    fs::write(&blocked_xdg, b"owned blocked cache path\n")
        .expect("create regular-file XDG blocker");
    let source_path = write_source(fixture.path(), "twice.lykn", TWICE_SOURCE);
    let source = fs::read(&source_path).expect("read blocked-cache source fixture");
    let output_path = fixture.path().join("m5.js");

    save_receipt("m5-blocked-xdg", "source.bin", &source);
    let mut command = cli();
    command
        .current_dir(fixture.path())
        .env("XDG_CACHE_HOME", &blocked_xdg)
        .arg("compile")
        .arg(&source_path)
        .arg("-o")
        .arg(&output_path);
    record_command("m5-blocked-xdg", &command, Some(&blocked_xdg));
    let result = command
        .output()
        .expect("start blocked-cache compile process");
    record_output("m5-blocked-xdg", &result);
    let generated = fs::read(&output_path).ok();
    let declaration_path = output_path.with_extension("d.ts");
    let declaration = fs::read(&declaration_path).ok();
    save_receipt(
        "m5-blocked-xdg",
        "artifacts.txt",
        format!(
            "js_exists={}\ndts_exists={}\njs={generated:?}\ndts={declaration:?}\n",
            generated.is_some(),
            declaration.is_some(),
        )
        .as_bytes(),
    );

    assert_eq!(
        result.status.code(),
        Some(1),
        "M5 stderr: {:?}",
        result.stderr
    );
    assert!(
        String::from_utf8_lossy(&result.stderr).contains("I/O error"),
        "M5 must render typed I/O failure, got {:?}",
        result.stderr
    );
    assert!(
        !String::from_utf8_lossy(&result.stderr).contains("panicked"),
        "M5 must not panic, got {:?}",
        result.stderr
    );
    assert!(result.stdout.is_empty(), "M5 stdout: {:?}", result.stdout);
    assert!(generated.is_none(), "M5 created JavaScript output");
    assert!(declaration.is_none(), "M5 created declaration output");
}

#[test]
fn m6_embedded_compiler_payload_matches_canonical_and_runs_from_cold_cache() {
    let fixture = TempDir::new().expect("create standalone embedded compiler fixture");
    let standalone = fixture.path().join("standalone");
    fs::create_dir_all(&standalone).expect("create standalone CLI directory");
    let copied_cli = standalone.join("lykn");
    fs::copy(env!("CARGO_BIN_EXE_lykn"), &copied_cli).expect("copy built standalone CLI");
    let xdg = write_xdg(fixture.path());
    let embedded_root = owned_embedded_root(&xdg);
    let materialized_package = embedded_root.join("packages/lang");
    assert!(
        !embedded_root.exists(),
        "M6 must start with a cold owned XDG cache"
    );
    assert!(
        !standalone.join("packages/lang").exists(),
        "M6 standalone cwd must not contain canonical package fallback"
    );

    let repository = Path::new(env!("CARGO_MANIFEST_DIR")).join("../..");
    let fixture_source =
        repository.join("test/fixtures/semantic-roles/adt-pattern-correctness.lykn");
    let mut source = M6_EMBEDDED_TRIGGER.as_bytes().to_vec();
    source.extend(fs::read(&fixture_source).expect("read nested and zero-field product fixture"));
    let source_path = standalone.join("embedded-delivery.lykn");
    fs::write(&source_path, &source).expect("write embedded delivery trigger source");
    let output_path = standalone.join("embedded-delivery.js");
    save_receipt("m6-embedded-delivery", "source.bin", &source);
    let mut compile = Command::new(&copied_cli);
    compile
        .current_dir(&standalone)
        .env("XDG_CACHE_HOME", &xdg)
        .env("DENO_DIR", deno_cache_dir())
        .arg("compile")
        .arg(&source_path)
        .arg("-o")
        .arg(&output_path);
    record_command("m6-embedded-delivery", &compile, Some(&xdg));
    let compiled = compile.output().expect("run copied standalone CLI");
    record_output("m6-embedded-delivery", &compiled);
    let generated = fs::read(&output_path).ok();
    save_receipt(
        "m6-embedded-delivery",
        "generated.js",
        generated.as_deref().unwrap_or_default(),
    );
    assert_eq!(
        compiled.status.code(),
        Some(0),
        "M6 compile stderr: {:?}",
        compiled.stderr
    );
    assert!(
        generated.is_some(),
        "M6 standalone CLI omitted generated JavaScript"
    );
    assert!(
        materialized_package
            .join("compiler-private-atoms.js")
            .is_file()
    );

    let package_names = [
        "binding.js",
        "classifier.js",
        "compiler.js",
        "compiler-private-atoms.js",
        "expander-core.js",
        "function-clauses.js",
        "host-invocation-kernel.js",
        "identifier.js",
        "lexical-regions.js",
        "protected-host.js",
        "reserved-words.js",
        "surface-helpers.js",
        "surface.js",
        "surface-type-context.js",
    ];
    for name in package_names {
        let canonical = repository.join("packages/lang").join(name);
        let embedded = repository
            .join("crates/lykn-lang/embedded/packages/lang")
            .join(name);
        let materialized = materialized_package.join(name);
        let canonical_bytes = fs::read(&canonical).expect("read canonical compiler file");
        let embedded_bytes = fs::read(&embedded).expect("read embedded compiler file");
        let materialized_bytes = fs::read(&materialized).expect("read materialized compiler file");
        assert_eq!(embedded_bytes, canonical_bytes, "embedded drift in {name}");
        assert_eq!(
            materialized_bytes, canonical_bytes,
            "materialized drift in {name}"
        );
        save_receipt(
            &format!("m6-embedded-delivery-{name}"),
            "comparison.txt",
            format!(
                "canonical_equals_embedded=true\ncanonical_equals_materialized=true\nbytes={}\n",
                canonical_bytes.len()
            )
            .as_bytes(),
        );
    }

    let deno = std::env::var_os("LYKN_TEST_DENO").unwrap_or_else(|| OsString::from("deno"));
    let deno_dir = deno_cache_dir();
    let config_path = fixture.path().join("embedded-public-deno.json");
    let materialized_url = format!(
        "file://{}/",
        materialized_package
            .canonicalize()
            .expect("canonicalize materialized package")
            .display()
    );
    let browser_url = format!(
        "file://{}/",
        repository.join("target/lykn/build/browser").display()
    );
    fs::write(
        &config_path,
        serde_json::to_vec(&serde_json::json!({
            "imports": { "lang/": materialized_url, "browser/": browser_url }
        }))
        .expect("serialize materialized-package import map"),
    )
    .expect("write strict public Deno import map");
    let public_tests = [
        repository.join("test/forms/embedded-adt-pattern.test.js"),
        repository.join("test/forms/surface-type-context.test.js"),
        repository.join("test/forms/reserved-binding-output.test.js"),
        repository.join("test/forms/icu-generated-names.test.js"),
        repository.join("test/expander/lexical-regions.test.js"),
        repository.join("test/forms/discard-bindings.test.js"),
    ];
    let mut strict_public = Command::new(deno);
    strict_public
        .current_dir(&repository)
        .env("DENO_DIR", &deno_dir)
        .args(["test", "-A", "--cached-only", "--no-prompt", "--config"])
        .arg(&config_path)
        .args(&public_tests);
    record_command("m6-embedded-public-strict", &strict_public, None);
    let public_result = strict_public
        .output()
        .expect("run materialized strict public tests");
    record_output("m6-embedded-public-strict", &public_result);
    save_receipt(
        "m6-embedded-public-strict",
        "config.json",
        &fs::read(&config_path).expect("read strict public import map"),
    );
    assert_eq!(
        public_result.status.code(),
        Some(0),
        "M6 materialized strict public tests failed: {:?}",
        public_result.stderr
    );
    let public_output = format!(
        "{}{}",
        String::from_utf8_lossy(&public_result.stdout),
        String::from_utf8_lossy(&public_result.stderr)
    );
    assert!(
        public_output.contains("ok | 62 passed | 0 failed"),
        "M6 must execute the derived 62-case retained, IC-01, B2a, B2b2, and B2-DISCARD-P materialized population (5 + 6 + 17 + 21 + 6 + 7), output: {public_output}"
    );
}
