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
        .join(format!("{}-expander-split", env!("CARGO_PKG_VERSION")))
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
        .join(env!("CARGO_PKG_VERSION"));
    fs::create_dir_all(&old_root).expect("create old same-version cache sibling");
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
        "cold compilation must preserve the old same-version cache sibling",
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
        "warm compilation and config recovery must preserve the old cache sibling",
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
