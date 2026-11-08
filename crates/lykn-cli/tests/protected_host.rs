use std::fs;
use std::path::{Path, PathBuf};
use std::process::{Command, Output};
use std::time::UNIX_EPOCH;

use lykn_cli::dist::{DistError, build_project};
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

fn existing_sentinels(root: &Path, name: &str) -> (PathBuf, PathBuf, Vec<u8>, Vec<u8>) {
    let output = root.join(format!("{name}.js"));
    let declaration = output.with_extension("d.ts");
    let js = format!("existing {name} JavaScript sentinel\n").into_bytes();
    let dts = format!("existing {name} declarations sentinel\n").into_bytes();
    fs::write(&output, &js).expect("write existing JavaScript sentinel");
    fs::write(&declaration, &dts).expect("write existing declaration sentinel");
    (output, declaration, js, dts)
}

#[test]
fn protected_writes_are_captured_across_cli_routes_before_rejection_assertions() {
    struct Observation {
        name: String,
        route: &'static str,
        output: Output,
        js_after: Option<Vec<u8>>,
        dts_after: Option<Vec<u8>>,
        expected_js: Option<Vec<u8>>,
        expected_dts: Option<Vec<u8>>,
    }

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
            js_after: None,
            dts_after: None,
            expected_js: None,
            expected_dts: None,
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
            js_after: None,
            dts_after: None,
            expected_js: None,
            expected_dts: None,
        });

        let (output_path, dts_path, js_before, dts_before) =
            existing_sentinels(fixture.path(), case);
        let route = format!("{case}-compile-existing");
        save_receipt(&route, "js-before.bin", &js_before);
        save_receipt(&route, "dts-before.bin", &dts_before);
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
        let js_after = fs::read(&output_path).ok();
        let dts_after = fs::read(&dts_path).ok();
        eprintln!(
            "PROTECTED_HOST_FILES name={route} js_after={js_after:?} dts_after={dts_after:?}"
        );
        save_receipt(
            &route,
            "js-after.bin",
            js_after.as_deref().unwrap_or_default(),
        );
        save_receipt(
            &route,
            "dts-after.bin",
            dts_after.as_deref().unwrap_or_default(),
        );
        observations.push(Observation {
            name: (*case).to_string(),
            route: "compile-existing",
            output: file_compile,
            js_after,
            dts_after,
            expected_js: Some(js_before),
            expected_dts: Some(dts_before),
        });
    }

    let (case, source_text) = INVALID[0];
    let fixture = TempDir::new().expect("create missing-output protected-host fixture");
    let source_path = write_source(fixture.path(), source_text);
    let source = fs::read(&source_path).expect("read missing-output protected-host fixture");
    let output_path = fixture.path().join("missing.js");
    let dts_path = output_path.with_extension("d.ts");
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
    let js_after = fs::read(&output_path).ok();
    let dts_after = fs::read(&dts_path).ok();
    eprintln!(
        "PROTECTED_HOST_FILES name=w1-compile-missing js_after={js_after:?} dts_after={dts_after:?}"
    );
    save_receipt(
        "w1-compile-missing",
        "files.txt",
        format!(
            "js_exists={}\ndts_exists={}\n",
            output_path.exists(),
            dts_path.exists()
        )
        .as_bytes(),
    );
    observations.push(Observation {
        name: case.to_string(),
        route: "compile-missing",
        output: missing,
        js_after,
        dts_after,
        expected_js: None,
        expected_dts: None,
    });

    let (case, source_text) = INVALID[8];
    let fixture = TempDir::new().expect("create stripped protected-host fixture");
    let source_path = write_source(fixture.path(), source_text);
    let source = fs::read(&source_path).expect("read stripped protected-host fixture");
    let (output_path, dts_path, js_before, dts_before) =
        existing_sentinels(fixture.path(), "w9-strip");
    save_receipt("w9-strip-compile-existing", "js-before.bin", &js_before);
    save_receipt("w9-strip-compile-existing", "dts-before.bin", &dts_before);
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
    let js_after = fs::read(&output_path).ok();
    let dts_after = fs::read(&dts_path).ok();
    eprintln!(
        "PROTECTED_HOST_FILES name=w9-strip-compile-existing js_after={js_after:?} dts_after={dts_after:?}"
    );
    save_receipt(
        "w9-strip-compile-existing",
        "js-after.bin",
        js_after.as_deref().unwrap_or_default(),
    );
    save_receipt(
        "w9-strip-compile-existing",
        "dts-after.bin",
        dts_after.as_deref().unwrap_or_default(),
    );
    observations.push(Observation {
        name: case.to_string(),
        route: "compile-strip-existing",
        output: stripped,
        js_after,
        dts_after,
        expected_js: Some(js_before),
        expected_dts: Some(dts_before),
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
            let mut reasons = Vec::new();
            if observation.output.status.success() {
                reasons.push("command succeeded".to_string());
            }
            if observation.route == "compile-stdout" && !observation.output.stdout.is_empty() {
                reasons.push(format!(
                    "stdout was not empty: {:?}",
                    observation.output.stdout
                ));
            }
            if let Some(expected) = &observation.expected_js
                && observation.js_after.as_ref() != Some(expected)
            {
                reasons.push(format!(
                    "JavaScript output changed: {:?}",
                    observation.js_after
                ));
            }
            if let Some(expected) = &observation.expected_dts
                && observation.dts_after.as_ref() != Some(expected)
            {
                reasons.push(format!(
                    "declaration output changed: {:?}",
                    observation.dts_after
                ));
            }
            if observation.route == "compile-missing"
                && (observation.js_after.is_some() || observation.dts_after.is_some())
            {
                reasons.push("missing-output route created an artifact".to_string());
            }
            (!reasons.is_empty()).then(|| {
                format!(
                    "{} {}: {}",
                    observation.name,
                    observation.route,
                    reasons.join(", ")
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

        let deno =
            std::env::var_os("LYKN_TEST_DENO").unwrap_or_else(|| "/opt/homebrew/bin/deno".into());
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
    assert!(matches!(source, lykn_lang::error::LyknError::Classify(_)));
    assert_eq!(js_after.as_deref(), Some(js_before.as_slice()));
    assert_eq!(dts_after.as_deref(), Some(dts_before.as_slice()));
    assert_eq!(js_mtime_after, Some(js_mtime));
    assert_eq!(dts_mtime_after, Some(dts_mtime));
}
