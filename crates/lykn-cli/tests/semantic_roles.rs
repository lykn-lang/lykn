use std::fs;
use std::path::{Path, PathBuf};
use std::process::{Command, Output};

use tempfile::TempDir;

struct Case {
    name: &'static str,
    expected: &'static [u8],
}

const FIXTURES: &[Case] = &[
    Case {
        name: "while",
        expected: b"[1,11,2,12]\n",
    },
    Case {
        name: "do-while",
        expected: b"[100,21,101,22]\n",
    },
    Case {
        name: "match",
        expected: b"[[7,10],[\"guard\",\"fallback\"]]\n",
    },
    Case {
        name: "boundaries",
        expected: b"[4,6,[2]]\n",
    },
];

fn fixture_path(name: &str) -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../../test/fixtures/semantic-roles")
        .join(format!("{name}.lykn"))
}

fn execute(command: &mut Command) -> Output {
    command.output().expect("start lykn semantic-role process")
}

fn evidence(
    case: &Case,
    source: &[u8],
    outputs: &[(&str, &Output)],
    generated: Option<&[u8]>,
    dts: Option<&[u8]>,
) {
    eprintln!(
        "SEMANTIC_ROLE_PREASSERT case={} source={:?} generated={:?} dts={:?}",
        case.name, source, generated, dts
    );
    for (label, output) in outputs {
        eprintln!(
            "SEMANTIC_ROLE_PREASSERT case={} step={} status={:?} stdout={:?} stderr={:?}",
            case.name,
            label,
            output.status.code(),
            output.stdout,
            output.stderr,
        );
    }
}

fn run_positive(case: &Case) {
    let source_path = fixture_path(case.name);
    let source = fs::read(&source_path).expect("read frozen semantic-role source");
    let temp = TempDir::new().expect("create semantic-role output directory");
    let output_path = temp.path().join(format!("{}.js", case.name));
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
    let generated = fs::read(&output_path).ok();
    let dts = fs::read(output_path.with_extension("d.ts")).ok();
    evidence(
        case,
        &source,
        &[("check", &check), ("compile", &compile)],
        generated.as_deref(),
        dts.as_deref(),
    );

    assert!(
        check.status.success(),
        "{} check rejected fixture: {:?}",
        case.name,
        check.stderr
    );
    assert!(
        compile.status.success(),
        "{} strict compile rejected fixture: {:?}",
        case.name,
        compile.stderr
    );
    assert!(
        dts.is_none(),
        "{} unexpectedly generated declarations: {:?}",
        case.name,
        dts
    );
    assert!(
        generated.is_some(),
        "{} successful compile omitted JavaScript",
        case.name
    );

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
    evidence(
        case,
        &source,
        &[
            ("check", &check),
            ("compile", &compile),
            ("runtime", &runtime),
        ],
        generated.as_deref(),
        dts.as_deref(),
    );
    assert!(
        runtime.status.success(),
        "{} strict runtime failed: {:?}",
        case.name,
        runtime.stderr
    );
    assert!(
        runtime.stderr.is_empty(),
        "{} runtime wrote stderr: {:?}",
        case.name,
        runtime.stderr
    );
    assert_eq!(
        runtime.stdout, case.expected,
        "{} runtime JSON differs",
        case.name
    );
}

#[test]
fn while_uses_value_test_and_statement_sequence_body() {
    run_positive(&FIXTURES[0]);
}

#[test]
fn do_while_uses_value_test_and_statement_sequence_body() {
    run_positive(&FIXTURES[1]);
}

#[test]
fn match_consumes_value_tail_after_statement_prefix() {
    run_positive(&FIXTURES[2]);
}

#[test]
fn boundaries_preserve_bound_calls_and_switch_sibling_visibility() {
    run_positive(&FIXTURES[3]);
}

#[test]
fn consumed_no_else_if_is_rejected_in_all_four_value_positions() {
    let invalid = [
        ("while", "(while (if true true) (console:log \"never\"))"),
        (
            "do-while",
            "(do-while (if true false) (console:log \"never\"))",
        ),
        (
            "bound-call",
            "(bind match (fn (:any x) x)) (match (if true 1))",
        ),
        (
            "computed-call",
            "(bind target (fn (:any x) x)) ((get (array target) 0) (if true 1))",
        ),
    ];
    let temp = TempDir::new().expect("create semantic-role negative directory");
    let mut observations = Vec::new();

    for (name, source) in invalid {
        let source_path = temp.path().join(format!("{name}.lykn"));
        let output_path = temp.path().join(format!("{name}.js"));
        fs::write(&source_path, source).expect("write frozen negative source");
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
        let generated = fs::read(&output_path).ok();
        eprintln!(
            "SEMANTIC_ROLE_NEGATIVE_PREASSERT name={name} source={source:?} check_status={:?} check_stdout={:?} check_stderr={:?} compile_status={:?} compile_stdout={:?} compile_stderr={:?} generated={generated:?}",
            check.status.code(),
            check.stdout,
            check.stderr,
            compile.status.code(),
            compile.stdout,
            compile.stderr
        );
        observations.push((name, check, compile, generated));
    }

    for (name, check, compile, generated) in observations {
        assert!(!check.status.success(), "check accepted {name}");
        assert!(!compile.status.success(), "strict compile accepted {name}");
        assert!(
            String::from_utf8_lossy(&check.stderr)
                .contains("if in expression position requires an else branch"),
            "{name} check diagnostic: {:?}",
            check.stderr
        );
        assert!(
            String::from_utf8_lossy(&compile.stderr)
                .contains("if in expression position requires an else branch"),
            "{name} compile diagnostic: {:?}",
            compile.stderr
        );
        assert!(
            generated.is_none(),
            "{name} compile wrote JavaScript: {generated:?}"
        );
    }
}
