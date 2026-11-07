use std::fs;
use std::path::{Path, PathBuf};
use std::process::{Command, Output};

use serde_json::Value;
use tempfile::TempDir;

fn fixture_path() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../../test/fixtures/variadic-for-bodies.lykn")
}

fn execute(command: &mut Command) -> Output {
    command.output().expect("start lykn process")
}

fn negative_header_sources() -> [(&'static str, &'static str); 3] {
    [
        ("initializer", "(if true 0)"),
        ("test", "(if true true)"),
        ("update", "(if true 1)"),
    ]
}

#[test]
fn numeric_for_preserves_variadic_statement_body_and_value_headers() {
    let source_path = fixture_path();
    let source = fs::read_to_string(&source_path).expect("read shared fixture");
    let temp = TempDir::new().expect("create output directory");
    let output_path = temp.path().join("variadic-for-bodies.js");
    let check = execute(
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .arg("check")
            .arg(&source_path),
    );
    let compile = execute(
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .arg("compile")
            .arg(&source_path)
            .arg("-o")
            .arg(&output_path),
    );
    let generated = fs::read_to_string(&output_path).ok();
    let dts = fs::read_to_string(output_path.with_extension("d.ts")).ok();
    eprintln!(
        "VARIADIC_FOR_POSITIVE_PREASSERT check_exit={:?} check_stdout={:?} check_stderr={:?} compile_exit={:?} compile_stdout={:?} compile_stderr={:?} source={source:?} generated={generated:?} dts={dts:?}",
        check.status.code(),
        String::from_utf8_lossy(&check.stdout),
        String::from_utf8_lossy(&check.stderr),
        compile.status.code(),
        String::from_utf8_lossy(&compile.stdout),
        String::from_utf8_lossy(&compile.stderr),
    );
    assert!(check.status.success(), "check rejected positive fixture");
    assert!(compile.status.success(), "compile rejected positive fixture");
    let generated = generated.expect("generated JavaScript exists");
    assert!(generated.contains("for (let i = 0;"), "generated module: {generated}");
    assert!(generated.contains("const value"), "generated module: {generated}");
    assert!(generated.contains("const nextValue"), "generated module: {generated}");

    let deno = std::env::var_os("LYKN_TEST_DENO").unwrap_or_else(|| "deno".into());
    let runtime = execute(
        Command::new(deno)
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
            .arg(&output_path),
    );
    let stdout = String::from_utf8_lossy(&runtime.stdout);
    let stderr = String::from_utf8_lossy(&runtime.stderr);
    eprintln!(
        "VARIADIC_FOR_POSITIVE_RUNTIME exit={:?} stdout={stdout:?} stderr={stderr:?} source={source:?} generated={generated:?} dts={dts:?}",
        runtime.status.code(),
    );
    assert!(runtime.status.success(), "Deno execution failed: {stderr}");
    assert!(runtime.stderr.is_empty(), "unexpected runtime stderr: {stderr}");
    let actual: Value = serde_json::from_str(stdout.trim()).expect("runtime emits JSON");
    assert_eq!(actual, serde_json::json!({"trace": [0, 10, 11, 1, 11, 12]}));

    for (index, (name, replacement)) in negative_header_sources().into_iter().enumerate() {
        let mut forms = [
            "(let i 0)".to_string(),
            "(< i 1)".to_string(),
            "(++ i)".to_string(),
        ];
        forms[index] = replacement.to_string();
        let invalid = format!(
            "(for {} {} {} (console:log i))",
            forms[0], forms[1], forms[2]
        );
        let invalid_path = temp.path().join(format!("{name}.lykn"));
        fs::write(&invalid_path, &invalid).expect("write negative source");
        let check = execute(
            Command::new(env!("CARGO_BIN_EXE_lykn"))
                .current_dir(temp.path())
                .arg("check")
                .arg(&invalid_path),
        );
        let output = temp.path().join(format!("{name}.js"));
        let compile = execute(
            Command::new(env!("CARGO_BIN_EXE_lykn"))
                .current_dir(temp.path())
                .arg("compile")
                .arg(&invalid_path)
                .arg("-o")
                .arg(&output),
        );
        let emitted = Path::new(&output).exists();
        eprintln!(
            "VARIADIC_FOR_HEADER_NEGATIVE name={name} source={invalid:?} check_exit={:?} check_stdout={:?} check_stderr={:?} compile_exit={:?} compile_stdout={:?} compile_stderr={:?} emitted={emitted}",
            check.status.code(),
            String::from_utf8_lossy(&check.stdout),
            String::from_utf8_lossy(&check.stderr),
            compile.status.code(),
            String::from_utf8_lossy(&compile.stdout),
            String::from_utf8_lossy(&compile.stderr),
        );
        let diagnostic = "if in expression position requires an else branch";
        assert!(!check.status.success(), "check accepted {name}: {invalid}");
        assert!(String::from_utf8_lossy(&check.stderr).contains(diagnostic));
        assert!(!compile.status.success(), "compile accepted {name}: {invalid}");
        assert!(String::from_utf8_lossy(&compile.stderr).contains(diagnostic));
        assert!(!emitted, "compile emitted JS for {name}");
    }
}
