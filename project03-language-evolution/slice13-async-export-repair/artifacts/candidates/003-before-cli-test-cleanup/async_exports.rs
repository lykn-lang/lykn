use std::path::{Path, PathBuf};
use std::process::{Command, Output};

use tempfile::TempDir;

fn fixture(name: &str) -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../../test/fixtures/async-exports")
        .join(name)
}

fn execute(command: &mut Command) -> Output {
    command.output().expect("start CLI regression process")
}

fn assert_cli_rejects(source_name: &str, source: &str, predicate: &str) {
    let temp = TempDir::new().expect("create rejection fixture directory");
    let source_path = temp.path().join(source_name);
    std::fs::write(&source_path, source).expect("write rejection fixture");

    let check = execute(
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .arg("check")
            .arg(&source_path),
    );
    let check_stderr = String::from_utf8_lossy(&check.stderr);
    assert!(!check.status.success(), "check unexpectedly accepted {source_name}: {check_stderr}");
    assert!(check_stderr.contains(predicate), "check missed {predicate:?}: {check_stderr}");

    let compile = execute(
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .arg("compile")
            .arg(&source_path)
            .arg("-o")
            .arg(temp.path().join("rejected.js")),
    );
    let compile_stderr = String::from_utf8_lossy(&compile.stderr);
    assert!(!compile.status.success(), "compile unexpectedly accepted {source_name}: {compile_stderr}");
    assert!(compile_stderr.contains(predicate), "compile missed {predicate:?}: {compile_stderr}");

    eprintln!(
        "ASYNC_EXPORT_REJECTED name={source_name} predicate={predicate:?} check_exit={:?} check_stderr={check_stderr:?} compile_exit={:?} compile_stderr={compile_stderr:?}",
        check.status.code(),
        compile.status.code(),
    );
}

#[test]
fn async_named_export_checks_compiles_and_imports_with_await() {
    let temp = TempDir::new().expect("create async export runtime directory");
    let module_source = fixture("module.lykn");
    let consumer_source = fixture("consumer.lykn");

    for source in [&module_source, &consumer_source] {
        let check = execute(
            Command::new(env!("CARGO_BIN_EXE_lykn"))
                .current_dir(temp.path())
                .arg("check")
                .arg(source),
        );
        assert!(
            check.status.success(),
            "lykn check failed for {}: stdout={} stderr={}",
            source.display(),
            String::from_utf8_lossy(&check.stdout),
            String::from_utf8_lossy(&check.stderr)
        );
    }

    let module_js = temp.path().join("module.js");
    let module_compile = execute(
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .arg("compile")
            .arg(&module_source)
            .arg("-o")
            .arg(&module_js),
    );
    assert!(
        module_compile.status.success(),
        "module strict compile failed: stdout={} stderr={}",
        String::from_utf8_lossy(&module_compile.stdout),
        String::from_utf8_lossy(&module_compile.stderr)
    );
    let module_generated = std::fs::read_to_string(&module_js).expect("read generated module");
    assert!(
        module_generated.contains("export"),
        "generated module has no export:\n{module_generated}"
    );
    assert!(
        module_generated.contains("async function fetchValue"),
        "generated module lost async named function shape:\n{module_generated}"
    );

    let consumer_js = temp.path().join("consumer.js");
    let consumer_compile = execute(
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .arg("compile")
            .arg(&consumer_source)
            .arg("-o")
            .arg(&consumer_js),
    );
    assert!(
        consumer_compile.status.success(),
        "consumer strict compile failed: stdout={} stderr={}",
        String::from_utf8_lossy(&consumer_compile.stdout),
        String::from_utf8_lossy(&consumer_compile.stderr)
    );
    let consumer_generated = std::fs::read_to_string(&consumer_js).expect("read generated consumer");
    let runtime = execute(
        Command::new("deno")
            .current_dir(temp.path())
            .args([
                "run",
                "--no-config",
                "--cached-only",
                "--no-npm",
                "--no-remote",
                "--deny-net",
                "--no-prompt",
            ])
            .arg(&consumer_js),
    );
    let stdout = String::from_utf8_lossy(&runtime.stdout);
    let stderr = String::from_utf8_lossy(&runtime.stderr);
    eprintln!(
        "ASYNC_EXPORT_RUNTIME module_source={:?} consumer_source={:?} module_js={module_generated:?} consumer_js={consumer_generated:?} runtime_exit={:?} stdout={stdout:?} stderr={stderr:?}",
        std::fs::read_to_string(&module_source).expect("read module source"),
        std::fs::read_to_string(&consumer_source).expect("read consumer source"),
        runtime.status.code(),
    );
    assert!(runtime.status.success(), "Deno failed: stdout={stdout:?} stderr={stderr:?}");
    assert!(runtime.stderr.is_empty(), "expected empty Deno stderr, got {stderr:?}");
    assert_eq!(runtime.stdout, b"42\n");
}

#[test]
fn async_exports_keep_unknown_nested_and_reserved_names_rejected() {
    assert_cli_rejects(
        "unknown.lykn",
        "(exports missing)\n",
        "unknown top-level binding 'missing'",
    );
    assert_cli_rejects(
        "nested.lykn",
        "(func outer :args () :body (exports outer))\n",
        "only allowed at module top level",
    );
    assert_cli_rejects(
        "reserved.lykn",
        "(func default :args () :body 42)\n(exports default)\n",
        "reserved word",
    );
}

#[allow(dead_code)]
fn _assert_source_path_is_absolute(path: &Path) {
    assert!(path.is_absolute());
}
