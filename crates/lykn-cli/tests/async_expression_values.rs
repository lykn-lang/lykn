use std::path::PathBuf;
use std::process::{Command, Output};

use serde_json::Value;
use tempfile::TempDir;

struct Fixture {
    name: &'static str,
    expected_json: &'static str,
}

const FIXTURES: &[Fixture] = &[
    Fixture {
        name: "E1-sync-values.lykn",
        expected_json: r#"{"value":41,"falseValue":42,"typeof":"number","noElsePrefix":41,"nestedEquality":true,"prefixEffect":1}"#,
    },
    Fixture {
        name: "E2-async-branches.lykn",
        expected_json: r#"{"sync":{"trace":["sync","after-branch","after-call"],"value":42},"await":{"trace":["await","after-call","after-branch"],"value":7},"bothAwaited":[42,7]}"#,
    },
    Fixture {
        name: "E3-promise-value.lykn",
        expected_json: r#"{"same":true,"thenType":"function","resolved":9}"#,
    },
    Fixture {
        name: "E4-deferred-function.lykn",
        expected_json: r#"{"constructionCalls":0,"immediateType":"function","invocationCalls":1,"result":9}"#,
    },
    Fixture {
        name: "E5-effects-errors.lykn",
        expected_json: r#"{"trace":["selected","await-selected"],"selectedMessage":"selected boom","rejectionMessage":"await rejected","outer":"outer","scoped":"inner","asyncValueMessage":"value boom"}"#,
    },
];

fn fixture_path(name: &str) -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../../test/fixtures/async-expression-values")
        .join(name)
}

fn execute(command: &mut Command) -> Result<Output, String> {
    command
        .output()
        .map_err(|error| format!("failed to start process: {error}"))
}

#[test]
fn native_compiler_preserves_async_expression_values() {
    let mut failures = Vec::new();
    for fixture in FIXTURES {
        let expected: Value = serde_json::from_str(fixture.expected_json)
            .expect("frozen fixture expectation is valid JSON");
        let temp = match TempDir::new() {
            Ok(temp) => temp,
            Err(error) => {
                failures.push(format!("{}: create temp directory: {error}", fixture.name));
                continue;
            }
        };
        let source_path = fixture_path(fixture.name);
        let source = match std::fs::read_to_string(&source_path) {
            Ok(source) => source,
            Err(error) => {
                failures.push(format!("{}: read fixture: {error}", fixture.name));
                continue;
            }
        };
        let output_path = temp.path().join("fixture.js");
        let compile = match execute(
            Command::new(env!("CARGO_BIN_EXE_lykn"))
                .current_dir(temp.path())
                .arg("compile")
                .arg(&source_path)
                .arg("-o")
                .arg(&output_path),
        ) {
            Ok(output) => output,
            Err(error) => {
                failures.push(format!("{}: strict compile {error}; source={source:?}", fixture.name));
                continue;
            }
        };
        let generated = std::fs::read_to_string(&output_path).ok();
        let dts = std::fs::read_to_string(output_path.with_extension("d.ts")).ok();
        eprintln!(
            "ASYNC_EXPR_NATIVE_PREASSERT name={} expected={} compile_exit={:?} stdout={:?} stderr={:?} source={:?} generated={:?} dts={:?}",
            fixture.name,
            expected,
            compile.status.code(),
            String::from_utf8_lossy(&compile.stdout),
            String::from_utf8_lossy(&compile.stderr),
            source,
            generated,
            dts,
        );
        if !compile.status.success() {
            failures.push(format!(
                "{}: strict compile exit {:?}; values unestablished; stdout={:?}; stderr={:?}; source={source:?}; generated={generated:?}; dts={dts:?}",
                fixture.name,
                compile.status.code(),
                String::from_utf8_lossy(&compile.stdout),
                String::from_utf8_lossy(&compile.stderr),
            ));
            continue;
        }
        let Some(generated) = generated else {
            failures.push(format!("{}: generated JavaScript missing", fixture.name));
            continue;
        };
        let deno = std::env::var_os("LYKN_TEST_DENO").unwrap_or_else(|| "deno".into());
        let runtime = match execute(
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
        ) {
            Ok(output) => output,
            Err(error) => {
                failures.push(format!(
                    "{}: Deno runtime failed to start: {error}; source={source:?}; generated={generated:?}; values unestablished",
                    fixture.name,
                ));
                continue;
            }
        };
        let stdout = String::from_utf8_lossy(&runtime.stdout);
        let stderr = String::from_utf8_lossy(&runtime.stderr);
        eprintln!(
            "ASYNC_EXPR_NATIVE_RUNTIME name={} exit={:?} stdout={stdout:?} stderr={stderr:?} source={source:?} generated={generated:?} dts={dts:?}",
            fixture.name,
            runtime.status.code(),
        );
        if !runtime.status.success() {
            failures.push(format!(
                "{}: Deno exit {:?}; values unestablished; stdout={stdout:?}; stderr={stderr:?}; generated={generated:?}",
                fixture.name,
                runtime.status.code(),
            ));
            continue;
        }
        let actual: Value = match serde_json::from_str(stdout.trim()) {
            Ok(actual) => actual,
            Err(error) => {
                failures.push(format!(
                    "{}: invalid JSON ({error}); stdout={stdout:?}; stderr={stderr:?}; generated={generated:?}",
                    fixture.name,
                ));
                continue;
            }
        };
        if !runtime.stderr.is_empty() {
            failures.push(format!("{}: unexpected Deno stderr {stderr:?}", fixture.name));
        }
        if actual != expected {
            failures.push(format!(
                "{}: expected {}, got {}; source={source:?}; generated={generated:?}; stdout={stdout:?}; stderr={stderr:?}",
                fixture.name,
                expected,
                actual,
            ));
        }
    }
    assert!(failures.is_empty(), "{} native failures:\n{}", failures.len(), failures.join("\n\n"));
}
