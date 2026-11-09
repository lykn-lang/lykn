use std::fs;
use std::io::Write;
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
    Case {
        name: "if-arm-scope",
        expected: b"[101,14,15]\n",
    },
    Case {
        name: "if-declaration",
        expected: b"",
    },
    Case {
        name: "if-direct-transfers",
        expected: b"[7,9,[0,2],4]\n",
    },
];

fn fixture_path(name: &str) -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../../test/fixtures/semantic-roles")
        .join(format!("{name}.lykn"))
}

fn evidence_root() -> Option<PathBuf> {
    let root = std::env::var_os("LYKN_SEMANTIC_ROLE_EVIDENCE_DIR").map(PathBuf::from)?;
    assert!(
        root.is_absolute(),
        "semantic-role evidence directory must be absolute"
    );
    Some(root)
}

fn save_receipt(name: &str, suffix: &str, bytes: &[u8]) {
    if let Some(root) = evidence_root() {
        let path = root.join(format!("{name}.{suffix}"));
        let mut file = fs::OpenOptions::new()
            .write(true)
            .create_new(true)
            .open(path)
            .expect("create unique semantic-role evidence receipt");
        file.write_all(bytes)
            .expect("write semantic-role evidence receipt");
    }
}

fn record_source(name: &str, source_path: &Path, source: &[u8]) {
    let locator = format!("source_path={source_path:?}\n");
    eprintln!("SEMANTIC_ROLE_SOURCE name={name} {locator}bytes={source:?}");
    save_receipt(name, "source.bin", source);
    save_receipt(name, "source-path.txt", locator.as_bytes());
}

fn record_command(name: &str, command: &Command) {
    let selected_env = [
        "DENO_DIR",
        "LYKN_TEST_DENO",
        "XDG_CACHE_HOME",
        "TMPDIR",
        "LYKN_SEMANTIC_ROLE_EVIDENCE_DIR",
    ]
    .map(|key| format!("{key}={:?}", std::env::var_os(key)))
    .join("\n");
    let env_overrides = command
        .get_envs()
        .map(|(key, value)| format!("{key:?}={value:?}"))
        .collect::<Vec<_>>()
        .join("\n");
    let description = format!(
        "program={:?}\nargs={:?}\ncwd={:?}\nenv_overrides=\n{}\nselected_inherited_env=\n{}\n",
        command.get_program(),
        command.get_args().collect::<Vec<_>>(),
        command.get_current_dir(),
        env_overrides,
        selected_env,
    );
    eprintln!("SEMANTIC_ROLE_COMMAND name={name}\n{description}");
    save_receipt(name, "command.txt", description.as_bytes());
}

fn record_output(name: &str, output: &Output) {
    let status = format!(
        "success={} code={:?}\n",
        output.status.success(),
        output.status.code()
    );
    eprintln!(
        "SEMANTIC_ROLE_OUTPUT name={name} {status}stdout={:?} stderr={:?}",
        output.stdout, output.stderr
    );
    save_receipt(name, "stdout.bin", &output.stdout);
    save_receipt(name, "stderr.bin", &output.stderr);
    save_receipt(name, "status.txt", status.as_bytes());
}

fn execute_recorded(
    name: &str,
    source_path: &Path,
    source: &[u8],
    command: &mut Command,
) -> Output {
    record_source(name, source_path, source);
    record_command(name, command);
    let output = command.output().expect("start lykn semantic-role process");
    record_output(name, &output);
    output
}

fn record_generated(name: &str, generated: Option<&[u8]>, dts: Option<&[u8]>) {
    let generated_status = format!("present={}\n", generated.is_some());
    let dts_status = format!("present={}\n", dts.is_some());
    eprintln!(
        "SEMANTIC_ROLE_ARTIFACTS name={name} generated={generated:?} generated_utf8={:?} dts={dts:?}",
        generated.map(String::from_utf8_lossy)
    );
    save_receipt(name, "generated-status.txt", generated_status.as_bytes());
    save_receipt(name, "dts-status.txt", dts_status.as_bytes());
    if let Some(generated) = generated {
        save_receipt(name, "generated.js", generated);
        save_receipt(
            name,
            "generated.txt",
            String::from_utf8_lossy(generated).as_bytes(),
        );
    }
    if let Some(dts) = dts {
        save_receipt(name, "generated.d.ts", dts);
        save_receipt(
            name,
            "generated-dts.txt",
            String::from_utf8_lossy(dts).as_bytes(),
        );
    }
}

fn run_positive(case: &Case) {
    let source_path = fixture_path(case.name);
    let source = fs::read(&source_path).expect("read frozen semantic-role source");
    let temp = TempDir::new().expect("create semantic-role output directory");
    let output_path = temp.path().join(format!("{}.js", case.name));
    let check = execute_recorded(
        &format!("native-{}-check", case.name),
        &source_path,
        &source,
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .arg("check")
            .arg(&source_path),
    );
    let compile = execute_recorded(
        &format!("native-{}-compile", case.name),
        &source_path,
        &source,
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .arg("compile")
            .arg(&source_path)
            .arg("-o")
            .arg(&output_path),
    );
    let generated = fs::read(&output_path).ok();
    let dts = fs::read(output_path.with_extension("d.ts")).ok();
    record_generated(
        &format!("native-{}", case.name),
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
    let runtime = execute_recorded(
        &format!("native-{}-runtime", case.name),
        &source_path,
        &source,
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
fn if_arm_scope_and_macro_expansion_are_preserved() {
    run_positive(&FIXTURES[4]);
}

#[test]
fn if_declaration_is_emitted_inside_a_branch_block() {
    run_positive(&FIXTURES[5]);
}

#[test]
fn if_direct_transfers_keep_source_targets() {
    run_positive(&FIXTURES[6]);
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
        let source = fs::read(&source_path).expect("read frozen negative source");
        let check = execute_recorded(
            &format!("native-negative-{name}-check"),
            &source_path,
            &source,
            Command::new(env!("CARGO_BIN_EXE_lykn"))
                .current_dir(temp.path())
                .arg("check")
                .arg(&source_path),
        );
        let compile = execute_recorded(
            &format!("native-negative-{name}-compile"),
            &source_path,
            &source,
            Command::new(env!("CARGO_BIN_EXE_lykn"))
                .current_dir(temp.path())
                .arg("compile")
                .arg(&source_path)
                .arg("-o")
                .arg(&output_path),
        );
        let generated = fs::read(&output_path).ok();
        record_generated(
            &format!("native-negative-{name}"),
            generated.as_deref(),
            None,
        );
        eprintln!(
            "SEMANTIC_ROLE_NEGATIVE_PREASSERT name={name} check_status={:?} compile_status={:?} generated={generated:?}",
            check.status.code(),
            compile.status.code()
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
