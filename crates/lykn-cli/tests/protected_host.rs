use std::fs;
use std::io;
use std::path::{Path, PathBuf};
use std::process::{Command, Output};
use std::time::{SystemTime, UNIX_EPOCH};

use lykn_cli::dist::{DistError, build_project};
use lykn_lang::diagnostics::{Diagnostic, Severity};
use lykn_lang::error::LyknError;
use lykn_lang::reader::source_loc::Span;
use tempfile::TempDir;

const INVALID: &[(&str, &str)] = &[
    ("w1", "(set! Reflect:apply 0)"),
    ("w2", "(set-symbol! Reflect \"apply\" 0)"),
    ("w3", "(++ Reflect)"),
    ("w4", "(set! globalThis:Reflect 0)"),
    ("w5", "(set! globalThis:Reflect:apply 0)"),
    ("w6", "(++ Reflect:apply)"),
    ("w7", "(kernel:delete Reflect:apply)"),
    ("w8", "(macro stomp () `(set! Reflect:apply 0)) (stomp)"),
    (
        "w9",
        "(func guarded :args () :returns :number :pre (do (set! Reflect:apply 0) true) :body 1)",
    ),
];

const LEGAL: &[(&str, &str, &str)] = &[
    (
        "v1",
        "(console:log (JSON:stringify (typeof Reflect:apply)))",
        "\"function\"\n",
    ),
    (
        "v2",
        "(func local :args (:any Reflect :any globalThis) :returns :array :body\n  (set! Reflect:apply 7)\n  (set! globalThis:Reflect:apply 8)\n  (array Reflect:apply globalThis:Reflect:apply))\n(console:log (JSON:stringify (local (obj :apply 0) (obj :Reflect (obj :apply 0)))))",
        "[7,8]\n",
    ),
    (
        "v3",
        "(func normalized :args (:any Reflect!) :returns :any :body\n  (set! Reflect!:apply 9)\n  Reflect!:apply)\n(console:log (JSON:stringify (normalized (obj :apply 0))))",
        "9\n",
    ),
    (
        "v4",
        "(bind action (fn (:number n) (+ n 1)))\n(set! action:call (fn (:number n) 99))\n(console:log (JSON:stringify (action:call 1)))",
        "99\n",
    ),
];

const DIST_SOURCE: &str =
    "(export (func answer :args () :returns :number :body 42))\n(set! Reflect:apply 0)\n";

#[derive(Debug, Clone, PartialEq, Eq)]
enum ArtifactState {
    Missing,
    Present {
        bytes: Vec<u8>,
        modified: SystemTime,
    },
    Error {
        stage: &'static str,
        kind: io::ErrorKind,
        message: String,
    },
}

#[derive(Debug, Clone)]
struct ArtifactPair {
    before: ArtifactState,
    after: ArtifactState,
    expected_bytes: Vec<u8>,
    expected_modified: SystemTime,
}

#[derive(Debug, Clone)]
enum ArtifactEffects {
    None,
    Preserve { js: ArtifactPair, dts: ArtifactPair },
    Absent { js: ArtifactPair, dts: ArtifactPair },
}

struct PredicateInput<'a> {
    code: Option<i32>,
    stdout: &'a [u8],
    stderr: &'a [u8],
    expected_stderr: &'a [u8],
    effects: &'a ArtifactEffects,
}

struct PredicateControl {
    name: &'static str,
    code: Option<i32>,
    stdout: Vec<u8>,
    stderr: Vec<u8>,
    expected_stderr: Vec<u8>,
    effects: ArtifactEffects,
    expected_match: bool,
}

fn snapshot_artifact(path: &Path) -> ArtifactState {
    let bytes = match fs::read(path) {
        Ok(bytes) => bytes,
        Err(error) if error.kind() == io::ErrorKind::NotFound => {
            return ArtifactState::Missing;
        }
        Err(error) => {
            return ArtifactState::Error {
                stage: "read",
                kind: error.kind(),
                message: error.to_string(),
            };
        }
    };
    match fs::metadata(path).and_then(|metadata| metadata.modified()) {
        Ok(modified) => ArtifactState::Present { bytes, modified },
        Err(error) => ArtifactState::Error {
            stage: "stat",
            kind: error.kind(),
            message: error.to_string(),
        },
    }
}

fn artifact_pair_matches(pair: &ArtifactPair, must_be_absent: bool) -> bool {
    if must_be_absent {
        return pair.before == ArtifactState::Missing && pair.after == ArtifactState::Missing;
    }
    matches!(
        (&pair.before, &pair.after),
        (
            ArtifactState::Present {
                bytes: before_bytes,
                modified: before_modified,
            },
            ArtifactState::Present {
                bytes: after_bytes,
                modified: after_modified,
            }
        ) if before_bytes == &pair.expected_bytes
            && after_bytes == &pair.expected_bytes
            && before_modified == &pair.expected_modified
            && after_modified == &pair.expected_modified
            && before_bytes == after_bytes
            && before_modified == after_modified
    )
}

fn artifact_effects_match(effects: &ArtifactEffects) -> bool {
    match effects {
        ArtifactEffects::None => true,
        ArtifactEffects::Preserve { js, dts } => {
            artifact_pair_matches(js, false) && artifact_pair_matches(dts, false)
        }
        ArtifactEffects::Absent { js, dts } => {
            artifact_pair_matches(js, true) && artifact_pair_matches(dts, true)
        }
    }
}

fn matches_policy_rejection(observation: &PredicateInput<'_>) -> bool {
    observation.code == Some(1)
        && observation.stdout.is_empty()
        && observation.stderr == observation.expected_stderr
        && artifact_effects_match(observation.effects)
}

fn exact_diagnostic(case: &str, source: &str, path: &Path, route: &str) -> Vec<u8> {
    let forms = lykn_lang::reader::read(source).expect("parse unchanged protected-host fixture");
    let form = forms
        .first()
        .expect("protected-host fixture has a first form");
    let values = form.as_list().expect("protected-host first form is a list");
    let span = match case {
        "w8" => Span::default(),
        "w9" => values[7].as_list().expect("pre clause is a list")[1]
            .as_list()
            .expect("pre body is a list")[1]
            .span(),
        _ => values[1].span(),
    };
    let slot = if matches!(case, "w3" | "w4") {
        "Reflect"
    } else {
        "Reflect.apply"
    };
    let message = format!("host-contract v2: write to protected slot {slot}");
    let rendered = format!(
        "{}:{}: error: {message}\n",
        span.start.line, span.start.column
    );
    if route == "check" {
        format!("{}: error: {rendered}", path.display()).into_bytes()
    } else {
        rendered.into_bytes()
    }
}

fn save_artifact_snapshot(name: &str, path_name: &str, phase: &str, state: &ArtifactState) {
    save_receipt(
        name,
        &format!("{path_name}-{phase}.txt"),
        format!("{state:?}\n").as_bytes(),
    );
    if let ArtifactState::Present { bytes, .. } = state {
        save_receipt(name, &format!("{path_name}-{phase}.bin"), bytes);
    }
}

fn run_predicate_controls() {
    let js_bytes = b"predicate JavaScript sentinel\n".to_vec();
    let dts_bytes = b"predicate declaration sentinel\n".to_vec();
    let js_state = ArtifactState::Present {
        bytes: js_bytes.clone(),
        modified: UNIX_EPOCH,
    };
    let dts_state = ArtifactState::Present {
        bytes: dts_bytes.clone(),
        modified: UNIX_EPOCH,
    };
    let expected_stderr =
        b"1:7: error: host-contract v2: write to protected slot Reflect.apply\n".to_vec();
    let baseline_effects = ArtifactEffects::Preserve {
        js: ArtifactPair {
            before: js_state.clone(),
            after: js_state.clone(),
            expected_bytes: js_bytes.clone(),
            expected_modified: UNIX_EPOCH,
        },
        dts: ArtifactPair {
            before: dts_state.clone(),
            after: dts_state.clone(),
            expected_bytes: dts_bytes.clone(),
            expected_modified: UNIX_EPOCH,
        },
    };
    let correct = expected_stderr.clone();
    let mut controls = vec![
        PredicateControl {
            name: "accept-exact-policy-diagnostic-and-preservation",
            code: Some(1),
            stdout: Vec::new(),
            stderr: correct.clone(),
            expected_stderr: correct.clone(),
            effects: baseline_effects.clone(),
            expected_match: true,
        },
        PredicateControl {
            name: "reject-syntax-error",
            code: Some(1),
            stdout: Vec::new(),
            stderr: b"syntax error\n".to_vec(),
            expected_stderr: correct.clone(),
            effects: baseline_effects.clone(),
            expected_match: false,
        },
        PredicateControl {
            name: "reject-io-error",
            code: Some(1),
            stdout: Vec::new(),
            stderr: b"I/O error\n".to_vec(),
            expected_stderr: correct.clone(),
            effects: baseline_effects.clone(),
            expected_match: false,
        },
        PredicateControl {
            name: "reject-unrelated-astring-macro-error",
            code: Some(1),
            stdout: Vec::new(),
            stderr: b"macro expansion error: Import \"astring\" is not a dependency\n".to_vec(),
            expected_stderr: correct.clone(),
            effects: baseline_effects.clone(),
            expected_match: false,
        },
        PredicateControl {
            name: "reject-v1-marker-inside-macro-error",
            code: Some(1),
            stdout: Vec::new(),
            stderr:
                b"macro expansion error: host-contract v2: write to protected slot Reflect.apply\n"
                    .to_vec(),
            expected_stderr: correct.clone(),
            effects: baseline_effects.clone(),
            expected_match: false,
        },
        PredicateControl {
            name: "reject-wrong-slot",
            code: Some(1),
            stdout: Vec::new(),
            stderr: b"1:7: error: host-contract v2: write to protected slot Reflect\n".to_vec(),
            expected_stderr: correct.clone(),
            effects: baseline_effects.clone(),
            expected_match: false,
        },
        PredicateControl {
            name: "reject-wrong-severity",
            code: Some(1),
            stdout: Vec::new(),
            stderr: b"1:7: warning: host-contract v2: write to protected slot Reflect.apply\n"
                .to_vec(),
            expected_stderr: correct.clone(),
            effects: baseline_effects.clone(),
            expected_match: false,
        },
        PredicateControl {
            name: "reject-wrong-span",
            code: Some(1),
            stdout: Vec::new(),
            stderr: b"1:8: error: host-contract v2: write to protected slot Reflect.apply\n"
                .to_vec(),
            expected_stderr: correct.clone(),
            effects: baseline_effects.clone(),
            expected_match: false,
        },
        PredicateControl {
            name: "reject-exit-zero",
            code: Some(0),
            stdout: Vec::new(),
            stderr: correct.clone(),
            expected_stderr: correct.clone(),
            effects: baseline_effects.clone(),
            expected_match: false,
        },
        PredicateControl {
            name: "reject-exit-101",
            code: Some(101),
            stdout: Vec::new(),
            stderr: correct.clone(),
            expected_stderr: correct.clone(),
            effects: baseline_effects.clone(),
            expected_match: false,
        },
        PredicateControl {
            name: "reject-no-exit-code",
            code: None,
            stdout: Vec::new(),
            stderr: correct.clone(),
            expected_stderr: correct.clone(),
            effects: baseline_effects.clone(),
            expected_match: false,
        },
        PredicateControl {
            name: "reject-stdout-payload",
            code: Some(1),
            stdout: b"unexpected stdout".to_vec(),
            stderr: correct.clone(),
            expected_stderr: correct.clone(),
            effects: baseline_effects.clone(),
            expected_match: false,
        },
    ];
    let mut js_mutation = baseline_effects.clone();
    if let ArtifactEffects::Preserve { js, .. } = &mut js_mutation {
        js.after = ArtifactState::Present {
            bytes: b"mutated JavaScript\n".to_vec(),
            modified: UNIX_EPOCH,
        };
    }
    controls.push(PredicateControl {
        name: "reject-javascript-mutation",
        code: Some(1),
        stdout: Vec::new(),
        stderr: correct.clone(),
        expected_stderr: correct.clone(),
        effects: js_mutation,
        expected_match: false,
    });
    let mut dts_mutation = baseline_effects.clone();
    if let ArtifactEffects::Preserve { dts, .. } = &mut dts_mutation {
        dts.after = ArtifactState::Present {
            bytes: b"mutated declarations\n".to_vec(),
            modified: UNIX_EPOCH,
        };
    }
    controls.push(PredicateControl {
        name: "reject-declaration-mutation",
        code: Some(1),
        stdout: Vec::new(),
        stderr: correct.clone(),
        expected_stderr: correct.clone(),
        effects: dts_mutation,
        expected_match: false,
    });
    let mut mtime_mutation = baseline_effects.clone();
    if let ArtifactEffects::Preserve { js, .. } = &mut mtime_mutation {
        js.after = ArtifactState::Present {
            bytes: js_bytes,
            modified: UNIX_EPOCH + std::time::Duration::from_secs(1),
        };
    }
    controls.push(PredicateControl {
        name: "reject-mtime-only-mutation",
        code: Some(1),
        stdout: Vec::new(),
        stderr: correct.clone(),
        expected_stderr: correct,
        effects: mtime_mutation,
        expected_match: false,
    });

    assert_eq!(
        controls.len(),
        15,
        "all private predicate controls retained"
    );
    for control in &controls {
        let observation = PredicateInput {
            code: control.code,
            stdout: &control.stdout,
            stderr: &control.stderr,
            expected_stderr: &control.expected_stderr,
            effects: &control.effects,
        };
        let matched = matches_policy_rejection(&observation);
        let verdict = format!(
            "case={} matched={} expected={}\n",
            control.name, matched, control.expected_match
        );
        eprintln!("PROTECTED_HOST_PREDICATE_CONTROL {verdict}");
        save_receipt(control.name, "predicate.txt", verdict.as_bytes());
        assert_eq!(
            matched, control.expected_match,
            "predicate control {}",
            control.name
        );
    }
}

fn cli() -> Command {
    Command::new(env!("CARGO_BIN_EXE_lykn"))
}

fn evidence_root() -> Option<PathBuf> {
    let root = std::env::var_os("LYKN_PROTECTED_HOST_EVIDENCE_DIR").map(PathBuf::from)?;
    assert!(root.is_absolute(), "evidence directory must be absolute");
    Some(root)
}

fn save_receipt(name: &str, suffix: &str, bytes: &[u8]) {
    if let Some(root) = evidence_root() {
        fs::write(root.join(format!("{name}.{suffix}")), bytes)
            .expect("write protected-host evidence receipt");
    }
}

fn record_source(name: &str, path: &Path, source: &[u8]) {
    let locator = format!("source_path={path:?}\n");
    eprintln!("PROTECTED_HOST_SOURCE name={name} {locator}bytes={source:?}");
    save_receipt(name, "source.bin", source);
    save_receipt(name, "source-path.txt", locator.as_bytes());
}

fn record_command(name: &str, command: &Command) {
    let selected_env = [
        "DENO_DIR",
        "LYKN_TEST_DENO",
        "XDG_CACHE_HOME",
        "TMPDIR",
        "LYKN_PROTECTED_HOST_EVIDENCE_DIR",
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
    eprintln!("PROTECTED_HOST_COMMAND name={name}\n{description}");
    save_receipt(name, "command.txt", description.as_bytes());
}

fn record_output(name: &str, output: &Output) {
    let status = format!(
        "success={} code={:?}\n",
        output.status.success(),
        output.status.code()
    );
    eprintln!(
        "PROTECTED_HOST_OUTPUT name={name} {status}stdout={:?} stderr={:?}",
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
    let output = command.output().expect("start protected-host CLI process");
    record_output(name, &output);
    output
}

fn write_source(root: &Path, source: &str) -> PathBuf {
    let path = root.join("program.lykn");
    fs::write(&path, source).expect("write protected-host source fixture");
    path
}

fn existing_sentinels(
    root: &Path,
    name: &str,
) -> (
    PathBuf,
    PathBuf,
    ArtifactState,
    ArtifactState,
    Vec<u8>,
    Vec<u8>,
) {
    let output = root.join(format!("{name}.js"));
    let declaration = output.with_extension("d.ts");
    let js = format!("existing {name} JavaScript sentinel\n").into_bytes();
    let dts = format!("existing {name} declarations sentinel\n").into_bytes();
    fs::write(&output, &js).expect("write existing JavaScript sentinel");
    fs::write(&declaration, &dts).expect("write existing declaration sentinel");
    fs::File::open(&output)
        .and_then(|file| file.set_modified(UNIX_EPOCH))
        .expect("set JavaScript sentinel epoch mtime");
    fs::File::open(&declaration)
        .and_then(|file| file.set_modified(UNIX_EPOCH))
        .expect("set declaration sentinel epoch mtime");
    let js_before = snapshot_artifact(&output);
    let dts_before = snapshot_artifact(&declaration);
    (output, declaration, js_before, dts_before, js, dts)
}

#[test]
fn protected_writes_are_captured_across_cli_routes_before_rejection_assertions() {
    struct Observation {
        name: String,
        route: &'static str,
        output: Output,
        expected_stderr: Vec<u8>,
        effects: ArtifactEffects,
    }

    run_predicate_controls();
    let mut observations = Vec::new();
    for (case, source_text) in INVALID {
        let fixture = TempDir::new().expect("create invalid protected-host fixture");
        let source_path = write_source(fixture.path(), source_text);
        let source = fs::read(&source_path).expect("read invalid protected-host fixture");
        let check = execute_recorded(
            &format!("{case}-check"),
            &source_path,
            &source,
            cli()
                .current_dir(fixture.path())
                .arg("check")
                .arg(&source_path),
        );
        observations.push(Observation {
            name: (*case).to_string(),
            route: "check",
            output: check,
            expected_stderr: exact_diagnostic(case, source_text, &source_path, "check"),
            effects: ArtifactEffects::None,
        });

        let stdout_compile = execute_recorded(
            &format!("{case}-compile-stdout"),
            &source_path,
            &source,
            cli()
                .current_dir(fixture.path())
                .arg("compile")
                .arg(&source_path),
        );
        observations.push(Observation {
            name: (*case).to_string(),
            route: "compile-stdout",
            output: stdout_compile,
            expected_stderr: exact_diagnostic(case, source_text, &source_path, "compile"),
            effects: ArtifactEffects::None,
        });

        let (output_path, dts_path, js_before, dts_before, js_expected, dts_expected) =
            existing_sentinels(fixture.path(), case);
        let route = format!("{case}-compile-existing");
        save_artifact_snapshot(&route, "js", "before", &js_before);
        save_artifact_snapshot(&route, "dts", "before", &dts_before);
        let file_compile = execute_recorded(
            &route,
            &source_path,
            &source,
            cli()
                .current_dir(fixture.path())
                .arg("compile")
                .arg(&source_path)
                .arg("-o")
                .arg(&output_path),
        );
        let js_after = snapshot_artifact(&output_path);
        let dts_after = snapshot_artifact(&dts_path);
        eprintln!(
            "PROTECTED_HOST_FILES name={route} js_after={js_after:?} dts_after={dts_after:?}"
        );
        save_artifact_snapshot(&route, "js", "after", &js_after);
        save_artifact_snapshot(&route, "dts", "after", &dts_after);
        observations.push(Observation {
            name: (*case).to_string(),
            route: "compile-existing",
            output: file_compile,
            expected_stderr: exact_diagnostic(case, source_text, &source_path, "compile"),
            effects: ArtifactEffects::Preserve {
                js: ArtifactPair {
                    before: js_before,
                    after: js_after,
                    expected_bytes: js_expected,
                    expected_modified: UNIX_EPOCH,
                },
                dts: ArtifactPair {
                    before: dts_before,
                    after: dts_after,
                    expected_bytes: dts_expected,
                    expected_modified: UNIX_EPOCH,
                },
            },
        });
    }

    let (case, source_text) = INVALID[0];
    let fixture = TempDir::new().expect("create missing-output protected-host fixture");
    let source_path = write_source(fixture.path(), source_text);
    let source = fs::read(&source_path).expect("read missing-output protected-host fixture");
    let output_path = fixture.path().join("missing.js");
    let dts_path = output_path.with_extension("d.ts");
    let js_before = snapshot_artifact(&output_path);
    let dts_before = snapshot_artifact(&dts_path);
    save_artifact_snapshot("w1-compile-missing", "js", "before", &js_before);
    save_artifact_snapshot("w1-compile-missing", "dts", "before", &dts_before);
    let missing = execute_recorded(
        "w1-compile-missing",
        &source_path,
        &source,
        cli()
            .current_dir(fixture.path())
            .arg("compile")
            .arg(&source_path)
            .arg("-o")
            .arg(&output_path),
    );
    let js_after = snapshot_artifact(&output_path);
    let dts_after = snapshot_artifact(&dts_path);
    eprintln!(
        "PROTECTED_HOST_FILES name=w1-compile-missing js_after={js_after:?} dts_after={dts_after:?}"
    );
    save_artifact_snapshot("w1-compile-missing", "js", "after", &js_after);
    save_artifact_snapshot("w1-compile-missing", "dts", "after", &dts_after);
    save_receipt(
        "w1-compile-missing",
        "files.txt",
        format!("js_before={js_before:?}\ndts_before={dts_before:?}\njs_after={js_after:?}\ndts_after={dts_after:?}\n").as_bytes(),
    );
    observations.push(Observation {
        name: case.to_string(),
        route: "compile-missing",
        output: missing,
        expected_stderr: exact_diagnostic(case, source_text, &source_path, "compile"),
        effects: ArtifactEffects::Absent {
            js: ArtifactPair {
                before: js_before,
                after: js_after,
                expected_bytes: Vec::new(),
                expected_modified: UNIX_EPOCH,
            },
            dts: ArtifactPair {
                before: dts_before,
                after: dts_after,
                expected_bytes: Vec::new(),
                expected_modified: UNIX_EPOCH,
            },
        },
    });

    let (case, source_text) = INVALID[8];
    let fixture = TempDir::new().expect("create stripped protected-host fixture");
    let source_path = write_source(fixture.path(), source_text);
    let source = fs::read(&source_path).expect("read stripped protected-host fixture");
    let (output_path, dts_path, js_before, dts_before, js_expected, dts_expected) =
        existing_sentinels(fixture.path(), "w9-strip");
    save_artifact_snapshot("w9-strip-compile-existing", "js", "before", &js_before);
    save_artifact_snapshot("w9-strip-compile-existing", "dts", "before", &dts_before);
    let stripped = execute_recorded(
        "w9-strip-compile-existing",
        &source_path,
        &source,
        cli()
            .current_dir(fixture.path())
            .arg("compile")
            .arg("--strip-assertions")
            .arg(&source_path)
            .arg("-o")
            .arg(&output_path),
    );
    let js_after = snapshot_artifact(&output_path);
    let dts_after = snapshot_artifact(&dts_path);
    eprintln!(
        "PROTECTED_HOST_FILES name=w9-strip-compile-existing js_after={js_after:?} dts_after={dts_after:?}"
    );
    save_artifact_snapshot("w9-strip-compile-existing", "js", "after", &js_after);
    save_artifact_snapshot("w9-strip-compile-existing", "dts", "after", &dts_after);
    observations.push(Observation {
        name: case.to_string(),
        route: "compile-strip-existing",
        output: stripped,
        expected_stderr: exact_diagnostic(case, source_text, &source_path, "compile"),
        effects: ArtifactEffects::Preserve {
            js: ArtifactPair {
                before: js_before,
                after: js_after,
                expected_bytes: js_expected,
                expected_modified: UNIX_EPOCH,
            },
            dts: ArtifactPair {
                before: dts_before,
                after: dts_after,
                expected_bytes: dts_expected,
                expected_modified: UNIX_EPOCH,
            },
        },
    });

    assert_eq!(
        observations.len(),
        29,
        "all invalid route observations captured"
    );
    eprintln!(
        "PROTECTED_HOST_PREASSERT observations={}",
        observations.len()
    );
    let failures: Vec<String> = observations
        .iter()
        .filter_map(|observation| {
            let input = PredicateInput {
                code: observation.output.status.code(),
                stdout: &observation.output.stdout,
                stderr: &observation.output.stderr,
                expected_stderr: &observation.expected_stderr,
                effects: &observation.effects,
            };
            let matched = matches_policy_rejection(&input);
            let verdict = format!(
                "route={} matched={matched}\nexpected_stderr={:?}\nactual_code={:?}\nactual_stdout={:?}\nactual_stderr={:?}\neffects={:?}\n",
                observation.route,
                observation.expected_stderr,
                observation.output.status.code(),
                observation.output.stdout,
                observation.output.stderr,
                observation.effects
            );
            save_receipt(
                &format!("{}-{}", observation.name, observation.route),
                "predicate.txt",
                verdict.as_bytes(),
            );
            (!matched).then(|| {
                format!(
                    "{} {}: did not match exact host-policy rejection",
                    observation.name, observation.route
                )
            })
        })
        .collect();
    assert!(
        failures.is_empty(),
        "protected-host CLI observations: {failures:#?}"
    );
}

#[test]
fn legal_protected_host_controls_run_as_separate_programs() {
    let mut failures = Vec::new();
    for (name, source_text, expected) in LEGAL {
        let fixture = TempDir::new().expect("create legal protected-host fixture");
        let source_path = write_source(fixture.path(), source_text);
        let source = fs::read(&source_path).expect("read legal protected-host fixture");
        let output_path = fixture.path().join(format!("{name}.js"));
        let compiled = execute_recorded(
            &format!("{name}-compile"),
            &source_path,
            &source,
            cli()
                .current_dir(fixture.path())
                .arg("compile")
                .arg(&source_path)
                .arg("-o")
                .arg(&output_path),
        );
        let generated = fs::read(&output_path).ok();
        if let Some(bytes) = &generated {
            save_receipt(&format!("{name}-compile"), "generated.js", bytes);
        }
        eprintln!(
            "PROTECTED_HOST_LEGAL_PREASSERT name={name} compile_status={:?} compile_stdout={:?} compile_stderr={:?} generated={generated:?}",
            compiled.status.code(),
            compiled.stdout,
            compiled.stderr
        );
        if !compiled.status.success() || generated.is_none() {
            failures.push(format!("{name} failed compilation or omitted JavaScript"));
            continue;
        }

        let deno = std::env::var_os("LYKN_TEST_DENO").unwrap_or_else(|| "deno".into());
        let runtime = execute_recorded(
            &format!("{name}-runtime"),
            &source_path,
            &source,
            Command::new(deno)
                .current_dir(fixture.path())
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
        if !runtime.status.success()
            || runtime.stdout != expected.as_bytes()
            || !runtime.stderr.is_empty()
        {
            failures.push(format!(
                "{name} runtime differed: status={:?} stdout={:?} stderr={:?} expected={expected:?}",
                runtime.status.code(), runtime.stdout, runtime.stderr
            ));
        }
    }
    assert!(
        failures.is_empty(),
        "legal protected-host controls: {failures:#?}"
    );
}

#[test]
fn v2_protected_roots_and_slots_reject_before_assertion_stripping() {
    let fixture = TempDir::new().expect("create protected-host compile fixture");
    let invalid = [
        "(set! Symbol 0)",
        "(set! Symbol:for 0)",
        "(set! Object 0)",
        "(set! Object:freeze 0)",
        "(set! Object:defineProperties 0)",
        "(set! Number:isNaN 0)",
        "(set! Array:isArray 0)",
        "(set! Promise 0)",
        "(set! TypeError 0)",
        "(set! Error 0)",
    ];
    for (index, source) in invalid.into_iter().enumerate() {
        let path = fixture.path().join(format!("invalid-{index}.lykn"));
        fs::write(&path, source).expect("write protected-host rejection fixture");
        for strip_assertions in [false, true] {
            let mut command = cli();
            command.arg("compile").arg(&path);
            if strip_assertions {
                command.arg("--strip-assertions");
            }
            let output = command.output().expect("run protected-host compile CLI");
            assert!(
                !output.status.success(),
                "host write compiled (strip_assertions={strip_assertions}): {source}; stdout={:?} stderr={:?}",
                String::from_utf8_lossy(&output.stdout),
                String::from_utf8_lossy(&output.stderr),
            );
        }
    }
    for (index, source) in [
        "(set! Object:freeze:prototype 0)",
        "(func local :args (:any Number) :body (set! Number:isNaN 0))",
    ]
    .into_iter()
    .enumerate()
    {
        let path = fixture.path().join(format!("control-{index}.lykn"));
        fs::write(&path, source).expect("write protected-host legal control");
        let output = cli()
            .arg("compile")
            .arg(&path)
            .output()
            .expect("run protected-host control CLI");
        assert!(
            output.status.success(),
            "legal control rejected: {source}; stdout={:?} stderr={:?}",
            String::from_utf8_lossy(&output.stdout),
            String::from_utf8_lossy(&output.stderr),
        );
    }
}

#[test]
fn protected_host_dist_error_preserves_typed_path_and_stale_outputs() {
    let fixture = TempDir::new().expect("create protected-host dist fixture");
    let package = fixture.path().join("packages/fixture");
    fs::create_dir_all(&package).expect("create protected-host package");
    fs::write(
        fixture.path().join("project.json"),
        r#"{ "workspace": ["./packages/fixture"], "imports": {} }"#,
    )
    .expect("write protected-host workspace config");
    fs::write(
        package.join("deno.json"),
        r#"{
  "name": "@fixture/emission",
  "version": "0.0.1",
  "exports": "./mod.js",
  "lykn": { "kind": "runtime", "emitDts": true }
}"#,
    )
    .expect("write typed protected-host package config");
    let source_path = package.join("mod.lykn");
    fs::write(&source_path, DIST_SOURCE).expect("write typed protected-host source");

    let output_dir = fixture.path().join("target/lykn/build/emission");
    fs::create_dir_all(&output_dir).expect("create protected-host build output");
    let js_path = output_dir.join("mod.js");
    let dts_path = output_dir.join("mod.d.ts");
    let js_before = b"existing package JavaScript sentinel\n";
    let dts_before = b"existing package declaration sentinel\n";
    fs::write(&js_path, js_before).expect("write package JavaScript sentinel");
    fs::write(&dts_path, dts_before).expect("write package declaration sentinel");
    fs::File::open(&js_path)
        .and_then(|file| file.set_modified(UNIX_EPOCH))
        .expect("set JavaScript sentinel epoch mtime");
    fs::File::open(&dts_path)
        .and_then(|file| file.set_modified(UNIX_EPOCH))
        .expect("set declaration sentinel epoch mtime");

    let source_mtime = fs::metadata(&source_path)
        .and_then(|metadata| metadata.modified())
        .expect("read protected-host source mtime");
    let js_mtime = fs::metadata(&js_path)
        .and_then(|metadata| metadata.modified())
        .expect("read stale JavaScript mtime");
    let dts_mtime = fs::metadata(&dts_path)
        .and_then(|metadata| metadata.modified())
        .expect("read stale declaration mtime");
    let mtimes = format!(
        "source={source_mtime:?}\njs={js_mtime:?}\ndts={dts_mtime:?}\nsource_newer_than_both={}\n",
        source_mtime > js_mtime && source_mtime > dts_mtime
    );
    eprintln!("PROTECTED_HOST_DIST_BEFORE {mtimes}");
    save_receipt("dist", "source.bin", DIST_SOURCE.as_bytes());
    save_receipt("dist", "mtimes-before.txt", mtimes.as_bytes());
    save_receipt("dist", "js-before.bin", js_before);
    save_receipt("dist", "dts-before.bin", dts_before);

    let result = build_project(fixture.path());
    let js_after = fs::read(&js_path).ok();
    let dts_after = fs::read(&dts_path).ok();
    let js_mtime_after = fs::metadata(&js_path)
        .and_then(|metadata| metadata.modified())
        .ok();
    let dts_mtime_after = fs::metadata(&dts_path)
        .and_then(|metadata| metadata.modified())
        .ok();
    save_receipt(
        "dist",
        "build-result.txt",
        format!("{result:?}\n").as_bytes(),
    );
    save_receipt(
        "dist",
        "js-after.bin",
        js_after.as_deref().unwrap_or_default(),
    );
    save_receipt(
        "dist",
        "dts-after.bin",
        dts_after.as_deref().unwrap_or_default(),
    );
    save_receipt(
        "dist",
        "mtimes-after.txt",
        format!("js={js_mtime_after:?}\ndts={dts_mtime_after:?}\n").as_bytes(),
    );
    eprintln!(
        "PROTECTED_HOST_DIST_AFTER result={result:?} js_after={js_after:?} dts_after={dts_after:?} js_mtime_after={js_mtime_after:?} dts_mtime_after={dts_mtime_after:?}"
    );

    assert!(source_mtime > js_mtime && source_mtime > dts_mtime);
    let error = result.expect_err("protected write must reject the typed package");
    let DistError::Language { path, source } = error else {
        panic!("dist must preserve a typed source failure");
    };
    assert_eq!(path, source_path);
    let LyknError::Classify(actual) = source else {
        panic!("dist must preserve the classifier diagnostic");
    };
    let forms = lykn_lang::reader::read(DIST_SOURCE).expect("parse typed dist fixture");
    let target_span = forms[1].as_list().expect("second dist form is a list")[1].span();
    let expected = Diagnostic {
        severity: Severity::Error,
        message: "host-contract v2: write to protected slot Reflect.apply".to_string(),
        span: target_span,
        suggestion: None,
    };
    assert_eq!(actual, expected);
    assert_eq!(js_after.as_deref(), Some(js_before.as_slice()));
    assert_eq!(dts_after.as_deref(), Some(dts_before.as_slice()));
    assert_eq!(js_mtime_after, Some(js_mtime));
    assert_eq!(dts_mtime_after, Some(dts_mtime));
}
