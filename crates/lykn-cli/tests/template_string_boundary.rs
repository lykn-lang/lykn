use std::path::PathBuf;
use std::process::{Command, Output};

use serde_json::Value;
use tempfile::TempDir;

struct Fixture {
    name: &'static str,
    expected: &'static [(&'static str, &'static [u32])],
}

const BACKSLASH_N: &[u32] = &[92, 110];
const BACKSLASH_QUOTE: &[u32] = &[92, 34];
const LINE_FEED: &[u32] = &[10];
const CARRIAGE_RETURN: &[u32] = &[13];
const BACKSLASH_BACKTICK_DOLLAR: &[u32] = &[92, 96, 36];
const TAGGED_RAW_BACKSLASH_N: &[u32] = &[92, 92, 110];

const FOUR_VALUE_FIELDS: &[(&str, &[u32])] = &[
    ("plain", BACKSLASH_N),
    ("interpolated", BACKSLASH_N),
    ("concat", BACKSLASH_N),
    ("icu", BACKSLASH_N),
];

const FIXTURES: &[Fixture] = &[
    Fixture {
        name: "P1-backslash-n.lykn",
        expected: FOUR_VALUE_FIELDS,
    },
    Fixture {
        name: "P2-backslash-quote.lykn",
        expected: &[
            ("plain", BACKSLASH_QUOTE),
            ("interpolated", BACKSLASH_QUOTE),
            ("concat", BACKSLASH_QUOTE),
            ("icu", BACKSLASH_QUOTE),
        ],
    },
    Fixture {
        name: "P3-line-feed.lykn",
        expected: &[
            ("plain", LINE_FEED),
            ("interpolated", LINE_FEED),
            ("concat", LINE_FEED),
            ("icu", LINE_FEED),
        ],
    },
    Fixture {
        name: "P4-carriage-return.lykn",
        expected: &[
            ("plain", CARRIAGE_RETURN),
            ("interpolated", CARRIAGE_RETURN),
            ("concat", CARRIAGE_RETURN),
            ("icu", CARRIAGE_RETURN),
        ],
    },
    Fixture {
        name: "P5-backslash-backtick-dollar.lykn",
        expected: &[
            ("plain", BACKSLASH_BACKTICK_DOLLAR),
            ("interpolated", BACKSLASH_BACKTICK_DOLLAR),
            ("concat", BACKSLASH_BACKTICK_DOLLAR),
            ("icu", BACKSLASH_BACKTICK_DOLLAR),
        ],
    },
    Fixture {
        name: "P6-tag-raw.lykn",
        expected: &[
            ("concat", TAGGED_RAW_BACKSLASH_N),
            ("icu", TAGGED_RAW_BACKSLASH_N),
        ],
    },
];

fn repo_fixture(name: &str) -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../../test/fixtures/template-string-boundary")
        .join(name)
}

fn execute(command: &mut Command) -> Result<Output, String> {
    command
        .output()
        .map_err(|error| format!("failed to start process: {error}"))
}

fn scalar_values(value: &str) -> Vec<u32> {
    value.chars().map(u32::from).collect()
}

fn run_fixture(fixture: &Fixture, failures: &mut Vec<String>) {
    let temp = match TempDir::new() {
        Ok(temp) => temp,
        Err(error) => {
            failures.push(format!("{}: create temp directory: {error}", fixture.name));
            return;
        }
    };
    let source_path = repo_fixture(fixture.name);
    let output_path = temp.path().join("fixture.js");
    let source = match std::fs::read_to_string(&source_path) {
        Ok(source) => source,
        Err(error) => {
            failures.push(format!("{}: read fixture: {error}", fixture.name));
            return;
        }
    };

    let compile = execute(
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .arg("compile")
            .arg(&source_path)
            .arg("-o")
            .arg(&output_path),
    );
    let compile = match compile {
        Ok(output) => output,
        Err(error) => {
            failures.push(format!("{}: strict compile {error}", fixture.name));
            return;
        }
    };
    if !compile.status.success() {
        failures.push(format!(
            "{}: strict compile exit {:?}\nsource:\n{}\nstdout: {}\nstderr: {}\n{} values unestablished",
            fixture.name,
            compile.status.code(),
            source,
            String::from_utf8_lossy(&compile.stdout),
            String::from_utf8_lossy(&compile.stderr),
            fixture.expected.len(),
        ));
        return;
    }

    let generated = match std::fs::read_to_string(&output_path) {
        Ok(generated) => generated,
        Err(error) => {
            failures.push(format!(
                "{}: read generated JavaScript: {error}\nsource:\n{}",
                fixture.name, source
            ));
            return;
        }
    };
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
            .arg(&output_path),
    );
    let runtime = match runtime {
        Ok(output) => output,
        Err(error) => {
            failures.push(format!(
                "{}: Deno runtime failed to start: {error}\nsource:\n{}\ngenerated JavaScript:\n{}\n{} values unestablished",
                fixture.name,
                source,
                generated,
                fixture.expected.len(),
            ));
            return;
        }
    };
    let stdout = String::from_utf8_lossy(&runtime.stdout);
    let stderr = String::from_utf8_lossy(&runtime.stderr);
    eprintln!(
        "TEMPLATE_BOUNDARY_OBSERVED name={} compile_exit={:?} runtime_exit={:?} source={:?} generated={:?} stdout={:?} stderr={:?}",
        fixture.name,
        compile.status.code(),
        runtime.status.code(),
        source,
        generated,
        stdout,
        stderr,
    );
    if !runtime.status.success() {
        failures.push(format!(
            "{}: Deno exit {:?}\nsource:\n{}\ngenerated JavaScript:\n{}\nstdout: {stdout}\nstderr: {stderr}\n{} values unestablished",
            fixture.name,
            runtime.status.code(),
            source,
            generated,
            fixture.expected.len(),
        ));
        return;
    }
    if !runtime.stderr.is_empty() {
        failures.push(format!(
            "{}: expected empty Deno stderr, got {stderr:?}\nsource:\n{}\ngenerated JavaScript:\n{}",
            fixture.name, source, generated
        ));
    }

    let record: Value = match serde_json::from_str(stdout.trim()) {
        Ok(record) => record,
        Err(error) => {
            failures.push(format!(
                "{}: invalid JSON stdout ({error})\nsource:\n{}\ngenerated JavaScript:\n{}\nstdout: {stdout:?}\nstderr: {stderr:?}",
                fixture.name, source, generated
            ));
            return;
        }
    };
    let Some(fields) = record.as_object() else {
        failures.push(format!(
            "{}: expected JSON object, got {record}\nsource:\n{}\ngenerated JavaScript:\n{}",
            fixture.name, source, generated
        ));
        return;
    };
    if fields.len() != fixture.expected.len() {
        failures.push(format!(
            "{}: expected {} JSON fields, got {} ({record})",
            fixture.name,
            fixture.expected.len(),
            fields.len(),
        ));
    }
    for (field, expected) in fixture.expected {
        match fields.get(*field).and_then(Value::as_str) {
            Some(actual) => {
                let actual = scalar_values(actual);
                if actual != *expected {
                    failures.push(format!(
                        "{} / {field}: expected scalars {expected:?}, got {actual:?}; source={source:?}; generated={generated:?}; stdout={stdout:?}; stderr={stderr:?}",
                        fixture.name
                    ));
                }
            }
            None => failures.push(format!(
                "{} / {field}: missing string field in {record}; source={source:?}; generated={generated:?}; stdout={stdout:?}; stderr={stderr:?}",
                fixture.name
            )),
        }
    }
}

#[test]
fn native_template_string_boundary_preserves_decoded_values() {
    assert_eq!(FIXTURES.len(), 6, "fixed fixture denominator");
    assert_eq!(
        FIXTURES
            .iter()
            .map(|fixture| fixture.expected.len())
            .sum::<usize>(),
        22,
        "fixed scalar observation denominator"
    );

    let mut failures = Vec::new();
    for fixture in FIXTURES {
        run_fixture(fixture, &mut failures);
    }
    assert!(failures.is_empty(), "{}", failures.join("\n\n"));
}
