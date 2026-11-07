use std::fs;
use std::path::{Path, PathBuf};
use std::process::{Command, Output};

use tempfile::TempDir;

struct InvalidCase {
    name: &'static str,
    source: &'static str,
    diagnostic: &'static str,
}

fn invalid_cases() -> [InvalidCase; 5] {
    [
        InvalidCase {
            name: "reserved binding",
            source: "(func default :args () :body 42)\n(exports default)\n",
            diagnostic: "'default' is a JavaScript reserved word",
        },
        InvalidCase {
            name: "method on expression",
            source: "(bind r ((express parts):join \"\"))",
            diagnostic: "method call on a parenthesized expression is not supported",
        },
        InvalidCase {
            name: "nested bare-parameter fn",
            source: "(bind f (fn (x) x))",
            diagnostic: "expected type keyword",
        },
        InvalidCase {
            name: "no-else if expression",
            source: "(bind label (if (> 1 0) \"items\"))",
            diagnostic: "if in expression position requires an else branch",
        },
        InvalidCase {
            name: "unknown export",
            source: "(exports missing)",
            diagnostic: "exports references unknown top-level binding 'missing'",
        },
    ]
}

fn cli() -> Command {
    let executable = PathBuf::from(env!("CARGO_BIN_EXE_lykn"));
    eprintln!("COMPILE_VALIDATION_CLI executable={:?}", executable);
    Command::new(executable)
}

fn execute(command: &mut Command) -> Output {
    command.output().expect("start lykn CLI regression process")
}

fn write_source(temp: &TempDir, source: &str) -> PathBuf {
    let source_path = temp.path().join("input.lykn");
    fs::write(&source_path, source).expect("write Lykn source fixture");
    source_path
}

fn dts_path(output: &Path) -> PathBuf {
    output.with_extension("d.ts")
}

#[test]
fn stdout_and_file_routes_reject_the_same_validation_inputs() {
    let mut failures = Vec::new();

    for case in invalid_cases() {
        let temp = TempDir::new().expect("create compile validation fixture");
        let source = write_source(&temp, case.source);

        let stdout = execute(cli().current_dir(temp.path()).arg("compile").arg(&source));
        let stdout_text = String::from_utf8_lossy(&stdout.stdout);
        let stdout_err = String::from_utf8_lossy(&stdout.stderr);
        eprintln!(
            "COMPILE_VALIDATION_CLI route=stdout case={:?} status={:?} stdout={stdout_text:?} stderr={stdout_err:?}",
            case.name,
            stdout.status.code(),
        );
        if stdout.status.success()
            || !stdout_err.contains(case.diagnostic)
            || !stdout.stdout.is_empty()
        {
            failures.push(format!("stdout route failed predicate for {:?}", case.name));
        }

        let output = temp.path().join("rejected.js");
        let declaration = dts_path(&output);
        let file = execute(
            cli()
                .current_dir(temp.path())
                .arg("compile")
                .arg(&source)
                .arg("-o")
                .arg(&output),
        );
        let file_stdout = String::from_utf8_lossy(&file.stdout);
        let file_stderr = String::from_utf8_lossy(&file.stderr);
        let emitted_js = fs::read(&output).ok();
        let emitted_dts = fs::read(&declaration).ok();
        eprintln!(
            "COMPILE_VALIDATION_CLI route=file case={:?} status={:?} stdout={file_stdout:?} stderr={file_stderr:?} js_before_assert={emitted_js:?} dts_before_assert={emitted_dts:?}",
            case.name,
            file.status.code(),
        );
        if file.status.success()
            || !file_stderr.contains(case.diagnostic)
            || emitted_js.is_some()
            || emitted_dts.is_some()
        {
            failures.push(format!(
                "file route failed predicate or wrote output for {:?}",
                case.name
            ));
        }
    }

    assert!(
        failures.is_empty(),
        "CLI validation parity failures: {failures:#?}"
    );
}

#[test]
fn rejected_file_compile_preserves_existing_js_and_dts_sentinels() {
    let case = &invalid_cases()[0];
    let temp = TempDir::new().expect("create sentinel output fixture");
    let source = write_source(&temp, case.source);
    let output = temp.path().join("existing.js");
    let declaration = dts_path(&output);
    let js_sentinel = b"preexisting JavaScript\n";
    let dts_sentinel = b"preexisting declarations\n";
    fs::write(&output, js_sentinel).expect("write JavaScript sentinel");
    fs::write(&declaration, dts_sentinel).expect("write declaration sentinel");

    let result = execute(
        cli()
            .current_dir(temp.path())
            .arg("compile")
            .arg(&source)
            .arg("-o")
            .arg(&output),
    );
    let stdout = String::from_utf8_lossy(&result.stdout);
    let stderr = String::from_utf8_lossy(&result.stderr);
    let actual_js = fs::read(&output).expect("read JavaScript output before assertions");
    let actual_dts = fs::read(&declaration).expect("read declaration output before assertions");
    eprintln!(
        "COMPILE_VALIDATION_SENTINEL status={:?} stdout={stdout:?} stderr={stderr:?} js_before_assert={actual_js:?} dts_before_assert={actual_dts:?}",
        result.status.code(),
    );

    assert!(
        !result.status.success(),
        "reserved binding unexpectedly compiled"
    );
    assert!(
        stderr.contains(case.diagnostic),
        "missing reserved-name diagnostic: {stderr}"
    );
    assert_eq!(actual_js, js_sentinel);
    assert_eq!(actual_dts, dts_sentinel);
}

#[test]
fn stdout_and_file_compile_keep_typed_export_output_and_runtime_behavior() {
    let temp = TempDir::new().expect("create positive compile fixture");
    let source_text = "(func inc :args (:number x) :returns :number :body (+ x 1))\n(exports inc)\n(console:log (JSON:stringify (inc 41)))\n";
    let source = write_source(&temp, source_text);

    let stdout = execute(cli().current_dir(temp.path()).arg("compile").arg(&source));
    let stdout_text = String::from_utf8_lossy(&stdout.stdout);
    let stdout_err = String::from_utf8_lossy(&stdout.stderr);
    eprintln!(
        "COMPILE_VALIDATION_POSITIVE route=stdout status={:?} stdout={stdout_text:?} stderr={stdout_err:?}",
        stdout.status.code(),
    );

    let output = temp.path().join("positive.js");
    let declaration = dts_path(&output);
    let file = execute(
        cli()
            .current_dir(temp.path())
            .arg("compile")
            .arg(&source)
            .arg("-o")
            .arg(&output),
    );
    let file_stdout = String::from_utf8_lossy(&file.stdout);
    let file_stderr = String::from_utf8_lossy(&file.stderr);
    let generated_js = fs::read(&output).expect("read generated JS before assertions");
    let generated_dts = fs::read(&declaration).expect("read generated DTS before assertions");
    eprintln!(
        "COMPILE_VALIDATION_POSITIVE route=file status={:?} stdout={file_stdout:?} stderr={file_stderr:?} js_before_assert={generated_js:?} dts_before_assert={generated_dts:?}",
        file.status.code(),
    );

    assert!(
        stdout.status.success(),
        "stdout compile failed: {stdout_err}"
    );
    assert!(file.status.success(), "file compile failed: {file_stderr}");
    assert_eq!(stdout.stdout, generated_js);
    assert_eq!(generated_dts, b"export function inc(x: number): number;\n");

    let deno = std::env::var_os("LYKN_TEST_DENO").unwrap_or_else(|| "deno".into());
    let runtime = execute(
        Command::new(&deno)
            .args([
                "run",
                "--no-config",
                "--no-remote",
                "--cached-only",
                "--no-prompt",
            ])
            .arg(&output),
    );
    let runtime_stdout = String::from_utf8_lossy(&runtime.stdout);
    let runtime_stderr = String::from_utf8_lossy(&runtime.stderr);
    eprintln!(
        "COMPILE_VALIDATION_POSITIVE runtime_executable={deno:?} status={:?} stdout={runtime_stdout:?} stderr={runtime_stderr:?}",
        runtime.status.code(),
    );
    assert!(
        runtime.status.success(),
        "generated module failed in Deno: {runtime_stderr}"
    );
    assert_eq!(runtime.stdout, b"42\n");
    assert!(runtime.stderr.is_empty());
}
