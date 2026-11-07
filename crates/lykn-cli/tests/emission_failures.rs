use std::fs;
use std::path::{Path, PathBuf};
use std::process::{Command, Output};
use std::time::UNIX_EPOCH;

use lykn_cli::dist::build_project;
use tempfile::TempDir;

const INVALID_SOURCE: &str = "(bind obj-value (obj :secret 1))\n(bind cleaned (dissoc obj-value \"secret\"))\n(console:log cleaned)\n";
const USER_TEXT_SOURCE: &str = "(console:log \"COMPILE_ERROR: literal\")\n(throw (new TypeError \"COMPILE_ERROR: user runtime\"))\n";
const SHADOWED_DISSOC_SOURCE: &str = "(bind dissoc (fn (:any left :any right) (get (array left right) 1)))\n(console:log (JSON:stringify (dissoc (obj :secret 1) \"kept\")))\n";

#[derive(Clone, Copy, Debug)]
enum RuntimeControl {
    BoundDissoc,
    UserThrow,
}

fn cli() -> Command {
    Command::new(env!("CARGO_BIN_EXE_lykn"))
}

fn evidence_path(name: &str, suffix: &str) -> Option<PathBuf> {
    let root = std::env::var_os("LYKN_EMISSION_EVIDENCE_DIR").map(PathBuf::from)?;
    assert!(root.is_absolute(), "evidence directory must be absolute");
    Some(root.join(format!("{name}.{suffix}")))
}

fn save_receipt(name: &str, suffix: &str, bytes: &[u8]) {
    if let Some(path) = evidence_path(name, suffix) {
        fs::write(path, bytes).expect("save emission evidence receipt");
    }
}

fn record_command(name: &str, command: &Command) {
    let overrides = command
        .get_envs()
        .map(|(key, value)| format!("{key:?}={value:?}"))
        .collect::<Vec<_>>()
        .join("\n");
    let description = format!(
        "program={:?}\nargs={:?}\ncwd={:?}\nenv_overrides=\n{}\n",
        command.get_program(),
        command.get_args().collect::<Vec<_>>(),
        command.get_current_dir(),
        overrides,
    );
    save_receipt(name, "command.txt", description.as_bytes());
}

fn record_output(name: &str, output: &Output) {
    save_receipt(name, "stdout.bin", &output.stdout);
    save_receipt(name, "stderr.bin", &output.stderr);
    save_receipt(
        name,
        "status.txt",
        format!(
            "success={} code={:?}\n",
            output.status.success(),
            output.status.code()
        )
        .as_bytes(),
    );
}

fn execute_recorded(name: &str, command: &mut Command) -> Output {
    record_command(name, command);
    let output = command.output().expect("start lykn regression process");
    record_output(name, &output);
    output
}

fn write_source(root: &Path, file_name: &str, source: &str) -> PathBuf {
    let path = root.join(file_name);
    fs::write(&path, source).expect("write Lykn source fixture");
    path
}

fn dts_path(js: &Path) -> PathBuf {
    js.with_extension("d.ts")
}

fn package(root: &Path, source: &str) -> PathBuf {
    let package = root.join("packages/fixture");
    fs::create_dir_all(&package).expect("create package fixture");
    fs::write(
        root.join("project.json"),
        r#"{ "workspace": ["./packages/fixture"], "imports": {} }"#,
    )
    .expect("write workspace config");
    fs::write(
        package.join("deno.json"),
        r#"{
  "name": "@fixture/emission",
  "version": "0.0.1",
  "exports": "./mod.js",
  "lykn": { "kind": "runtime", "emitDts": true }
}"#,
    )
    .expect("write package config");
    write_source(&package, "mod.lykn", source);
    package
}

fn run_deno(name: &str, js: &Path, cwd: &Path) -> Output {
    let deno = std::env::var_os("LYKN_TEST_DENO").unwrap_or_else(|| "deno".into());
    execute_recorded(
        name,
        Command::new(deno)
            .current_dir(cwd)
            .args([
                "run",
                "--no-config",
                "--no-remote",
                "--cached-only",
                "--no-npm",
                "--deny-net",
                "--no-prompt",
            ])
            .arg(js),
    )
}

fn runtime_matches(kind: RuntimeControl, code: Option<i32>, stdout: &[u8], stderr: &[u8]) -> bool {
    match kind {
        RuntimeControl::BoundDissoc => {
            code == Some(0) && stdout == b"\"kept\"\n" && stderr.is_empty()
        }
        RuntimeControl::UserThrow => {
            let diagnostic = String::from_utf8_lossy(stderr);
            code == Some(1)
                && stdout == b"COMPILE_ERROR: literal\n"
                && diagnostic.contains("TypeError")
                && diagnostic.contains("COMPILE_ERROR: user runtime")
        }
    }
}

#[test]
fn runtime_predicates_reject_independent_control_mutations() {
    let checks = [
        (
            "bound-positive",
            RuntimeControl::BoundDissoc,
            Some(0),
            b"\"kept\"\n".as_slice(),
            b"".as_slice(),
            true,
        ),
        (
            "throw-positive",
            RuntimeControl::UserThrow,
            Some(1),
            b"COMPILE_ERROR: literal\n".as_slice(),
            b"TypeError: COMPILE_ERROR: user runtime".as_slice(),
            true,
        ),
        (
            "bound-bad-code",
            RuntimeControl::BoundDissoc,
            Some(1),
            b"\"kept\"\n".as_slice(),
            b"".as_slice(),
            false,
        ),
        (
            "bound-bad-stdout",
            RuntimeControl::BoundDissoc,
            Some(0),
            b"wrong\n".as_slice(),
            b"".as_slice(),
            false,
        ),
        (
            "bound-nonempty-stderr",
            RuntimeControl::BoundDissoc,
            Some(0),
            b"\"kept\"\n".as_slice(),
            b"unexpected\n".as_slice(),
            false,
        ),
        (
            "throw-bad-code-zero",
            RuntimeControl::UserThrow,
            Some(0),
            b"COMPILE_ERROR: literal\n".as_slice(),
            b"TypeError: COMPILE_ERROR: user runtime".as_slice(),
            false,
        ),
        (
            "throw-bad-code-two",
            RuntimeControl::UserThrow,
            Some(2),
            b"COMPILE_ERROR: literal\n".as_slice(),
            b"TypeError: COMPILE_ERROR: user runtime".as_slice(),
            false,
        ),
        (
            "throw-bad-stdout",
            RuntimeControl::UserThrow,
            Some(1),
            b"wrong\n".as_slice(),
            b"TypeError: COMPILE_ERROR: user runtime".as_slice(),
            false,
        ),
        (
            "throw-missing-type-error",
            RuntimeControl::UserThrow,
            Some(1),
            b"COMPILE_ERROR: literal\n".as_slice(),
            b"COMPILE_ERROR: user runtime".as_slice(),
            false,
        ),
        (
            "throw-missing-user-message",
            RuntimeControl::UserThrow,
            Some(1),
            b"COMPILE_ERROR: literal\n".as_slice(),
            b"TypeError".as_slice(),
            false,
        ),
    ];
    let mut failures = Vec::new();
    for (name, kind, code, stdout, stderr, expected) in checks {
        let actual = runtime_matches(kind, code, stdout, stderr);
        eprintln!("RUNTIME_PREDICATE name={name} expected={expected} actual={actual}");
        if actual != expected {
            failures.push(format!("{name}: expected {expected}, got {actual}"));
        }
    }
    assert!(
        failures.is_empty(),
        "runtime predicate self-checks: {failures:#?}"
    );
}

#[test]
fn checked_emission_failure_blocks_cli_and_dist_outputs() {
    let mut failures = Vec::new();

    let stdout_fixture = TempDir::new().expect("create stdout fixture");
    let source = write_source(stdout_fixture.path(), "invalid.lykn", INVALID_SOURCE);
    let stdout = execute_recorded(
        "invalid-cli-stdout",
        cli()
            .current_dir(stdout_fixture.path())
            .arg("compile")
            .arg(&source),
    );
    eprintln!(
        "INVALID route=cli-stdout status={:?} stdout={:?} stderr={:?}",
        stdout.status.code(),
        stdout.stdout,
        stdout.stderr
    );
    if stdout.status.success() || !stdout.stdout.is_empty() {
        failures.push("CLI stdout route returned success or emitted partial JS".to_string());
    }

    let existing_fixture = TempDir::new().expect("create existing-output fixture");
    let source = write_source(existing_fixture.path(), "invalid.lykn", INVALID_SOURCE);
    let output = existing_fixture.path().join("sentinel.js");
    let declaration = dts_path(&output);
    let js_sentinel = b"existing JavaScript sentinel\n";
    let dts_sentinel = b"existing declarations sentinel\n";
    fs::write(&output, js_sentinel).expect("write JS sentinel");
    fs::write(&declaration, dts_sentinel).expect("write DTS sentinel");
    save_receipt("invalid-cli-existing", "js-before.bin", js_sentinel);
    save_receipt("invalid-cli-existing", "dts-before.bin", dts_sentinel);
    let file = execute_recorded(
        "invalid-cli-existing",
        cli()
            .current_dir(existing_fixture.path())
            .arg("compile")
            .arg(&source)
            .arg("-o")
            .arg(&output),
    );
    let actual_js = fs::read(&output).ok();
    let actual_dts = fs::read(&declaration).ok();
    save_receipt(
        "invalid-cli-existing",
        "js-after.bin",
        actual_js.as_deref().unwrap_or_default(),
    );
    save_receipt(
        "invalid-cli-existing",
        "dts-after.bin",
        actual_dts.as_deref().unwrap_or_default(),
    );
    eprintln!(
        "INVALID route=cli-existing status={:?} stdout={:?} stderr={:?} js={actual_js:?} dts={actual_dts:?}",
        file.status.code(),
        file.stdout,
        file.stderr
    );
    if file.status.success()
        || actual_js.as_deref() != Some(js_sentinel)
        || actual_dts.as_deref() != Some(dts_sentinel)
    {
        failures.push("CLI file route succeeded or changed existing outputs".to_string());
    }

    let missing_fixture = TempDir::new().expect("create missing-output fixture");
    let source = write_source(missing_fixture.path(), "invalid.lykn", INVALID_SOURCE);
    let output = missing_fixture.path().join("missing.js");
    let declaration = dts_path(&output);
    let missing = execute_recorded(
        "invalid-cli-missing",
        cli()
            .current_dir(missing_fixture.path())
            .arg("compile")
            .arg(&source)
            .arg("-o")
            .arg(&output),
    );
    let js_exists = output.exists();
    let dts_exists = declaration.exists();
    save_receipt(
        "invalid-cli-missing",
        "files.txt",
        format!("js_exists={js_exists}\ndts_exists={dts_exists}\n").as_bytes(),
    );
    eprintln!(
        "INVALID route=cli-missing status={:?} stdout={:?} stderr={:?} js_exists={js_exists} dts_exists={dts_exists}",
        missing.status.code(),
        missing.stdout,
        missing.stderr
    );
    if missing.status.success() || js_exists || dts_exists {
        failures.push("CLI file route succeeded or created outputs".to_string());
    }

    let dist_fixture = TempDir::new().expect("create dist fixture");
    let package_path = package(dist_fixture.path(), INVALID_SOURCE);
    let build = dist_fixture.path().join("target/lykn/build/emission");
    fs::create_dir_all(&build).expect("create existing build output");
    let build_js = build.join("mod.js");
    let build_dts = build.join("mod.d.ts");
    let js_sentinel = b"existing package JavaScript\n";
    let dts_sentinel = b"existing package declarations\n";
    fs::write(&build_js, js_sentinel).expect("write package JS sentinel");
    fs::write(&build_dts, dts_sentinel).expect("write package DTS sentinel");
    save_receipt("invalid-package-existing", "js-before.bin", js_sentinel);
    save_receipt("invalid-package-existing", "dts-before.bin", dts_sentinel);
    fs::File::open(&build_js)
        .and_then(|file| file.set_modified(UNIX_EPOCH))
        .expect("make JS sentinel stale");
    fs::File::open(&build_dts)
        .and_then(|file| file.set_modified(UNIX_EPOCH))
        .expect("make DTS sentinel stale");
    let source_mtime = fs::metadata(package_path.join("mod.lykn"))
        .and_then(|metadata| metadata.modified())
        .expect("read source mtime");
    let js_mtime = fs::metadata(&build_js)
        .and_then(|metadata| metadata.modified())
        .expect("read stale JS mtime");
    let dts_mtime = fs::metadata(&build_dts)
        .and_then(|metadata| metadata.modified())
        .expect("read stale DTS mtime");
    let mtimes_before = format!(
        "source={source_mtime:?}\njs={js_mtime:?}\ndts={dts_mtime:?}\nsource_newer_than_both={}\n",
        source_mtime > js_mtime && source_mtime > dts_mtime
    );
    save_receipt(
        "invalid-package-existing",
        "mtimes-before.txt",
        mtimes_before.as_bytes(),
    );
    let build_result = build_project(dist_fixture.path());
    let actual_js = fs::read(&build_js).ok();
    let actual_dts = fs::read(&build_dts).ok();
    let js_mtime_after = fs::metadata(&build_js)
        .and_then(|metadata| metadata.modified())
        .ok();
    let dts_mtime_after = fs::metadata(&build_dts)
        .and_then(|metadata| metadata.modified())
        .ok();
    let short_name_ok = build_result
        .as_ref()
        .is_ok_and(|built| built.iter().any(|pkg| pkg.short_name == "emission"));
    save_receipt(
        "invalid-package-existing",
        "build-result.txt",
        format!("{build_result:?}\nshort_name_emission={short_name_ok}\n").as_bytes(),
    );
    save_receipt(
        "invalid-package-existing",
        "js-after.bin",
        actual_js.as_deref().unwrap_or_default(),
    );
    save_receipt(
        "invalid-package-existing",
        "dts-after.bin",
        actual_dts.as_deref().unwrap_or_default(),
    );
    save_receipt(
        "invalid-package-existing",
        "mtimes-after.txt",
        format!("js={js_mtime_after:?}\ndts={dts_mtime_after:?}\n").as_bytes(),
    );
    eprintln!(
        "INVALID route=package-existing source_mtime={source_mtime:?} js_mtime={js_mtime:?} dts_mtime={dts_mtime:?} result={build_result:?} js={actual_js:?} dts={actual_dts:?}"
    );
    if !(source_mtime > js_mtime && source_mtime > dts_mtime) {
        failures.push("source was not newer than both package sentinels before build".to_string());
    }
    if build_result.is_ok()
        || actual_js.as_deref() != Some(js_sentinel)
        || actual_dts.as_deref() != Some(dts_sentinel)
    {
        failures.push("package build succeeded or changed existing outputs".to_string());
    }
    if build_result.is_ok() && !short_name_ok {
        failures.push("successful package build did not report short_name emission".to_string());
    }

    assert!(
        failures.is_empty(),
        "checked-emission failures: {failures:#?}"
    );
}

#[test]
fn valid_runtime_exceptions_and_resolved_dissoc_remain_ordinary_programs() {
    let mut failures = Vec::new();
    for (name, source_text, kind) in [
        ("user-text", USER_TEXT_SOURCE, RuntimeControl::UserThrow),
        (
            "shadowed-dissoc",
            SHADOWED_DISSOC_SOURCE,
            RuntimeControl::BoundDissoc,
        ),
    ] {
        let cli_fixture = TempDir::new().expect("create valid CLI fixture");
        let source = write_source(cli_fixture.path(), "valid.lykn", source_text);
        let output = cli_fixture.path().join("valid.js");
        let compiled = execute_recorded(
            &format!("valid-{name}-cli-compile"),
            cli()
                .current_dir(cli_fixture.path())
                .arg("compile")
                .arg(&source)
                .arg("-o")
                .arg(&output),
        );
        let generated_js = fs::read(&output).ok();
        let generated_dts_path = dts_path(&output);
        let generated_dts = fs::read(&generated_dts_path).ok();
        if let Some(bytes) = &generated_js {
            save_receipt(&format!("valid-{name}-cli"), "generated.js", bytes);
        }
        save_receipt(
            &format!("valid-{name}-cli"),
            "dts-absence.txt",
            format!(
                "path={generated_dts_path:?}\npresent={}\n",
                generated_dts.is_some()
            )
            .as_bytes(),
        );
        eprintln!(
            "VALID name={name} route=cli compile_status={:?} stdout={:?} stderr={:?} js={generated_js:?} dts={generated_dts:?}",
            compiled.status.code(),
            compiled.stdout,
            compiled.stderr
        );
        if !compiled.status.success() || generated_js.is_none() || generated_dts.is_some() {
            failures.push(format!(
                "CLI compile or optional DTS outcome changed for {name}"
            ));
        }
        if generated_js.is_some() {
            let runtime = run_deno(
                &format!("valid-{name}-cli-runtime"),
                &output,
                cli_fixture.path(),
            );
            eprintln!(
                "VALID name={name} route=cli-runtime status={:?} stdout={:?} stderr={:?}",
                runtime.status.code(),
                runtime.stdout,
                runtime.stderr
            );
            if !runtime_matches(
                kind,
                runtime.status.code(),
                &runtime.stdout,
                &runtime.stderr,
            ) {
                failures.push(format!("CLI runtime behavior changed for {name}"));
            }
        }

        let dist_fixture = TempDir::new().expect("create valid package fixture");
        package(dist_fixture.path(), source_text);
        let result = build_project(dist_fixture.path());
        let package_js = dist_fixture
            .path()
            .join("target/lykn/build/emission/mod.js");
        let package_dts = dist_fixture
            .path()
            .join("target/lykn/build/emission/mod.d.ts");
        let package_js_bytes = fs::read(&package_js).ok();
        let package_dts_bytes = fs::read(&package_dts).ok();
        let short_name_ok = result
            .as_ref()
            .is_ok_and(|built| built.iter().any(|pkg| pkg.short_name == "emission"));
        if let Some(bytes) = &package_js_bytes {
            save_receipt(&format!("valid-{name}-package"), "generated.js", bytes);
        }
        save_receipt(
            &format!("valid-{name}-package"),
            "build-result.txt",
            format!("{result:?}\nshort_name_emission={short_name_ok}\n").as_bytes(),
        );
        save_receipt(
            &format!("valid-{name}-package"),
            "dts-absence.txt",
            format!(
                "path={package_dts:?}\npresent={}\n",
                package_dts_bytes.is_some()
            )
            .as_bytes(),
        );
        eprintln!(
            "VALID name={name} route=package result={result:?} short_name_emission={short_name_ok} js={package_js_bytes:?} dts={package_dts_bytes:?}"
        );
        if result.is_err()
            || !short_name_ok
            || package_js_bytes.is_none()
            || package_dts_bytes.is_some()
        {
            failures.push(format!(
                "package compile or optional DTS outcome changed for {name}"
            ));
        }
        if package_js_bytes.is_some() {
            let runtime = run_deno(
                &format!("valid-{name}-package-runtime"),
                &package_js,
                dist_fixture.path(),
            );
            eprintln!(
                "VALID name={name} route=package-runtime status={:?} stdout={:?} stderr={:?}",
                runtime.status.code(),
                runtime.stdout,
                runtime.stderr
            );
            if !runtime_matches(
                kind,
                runtime.status.code(),
                &runtime.stdout,
                &runtime.stderr,
            ) {
                failures.push(format!("package runtime behavior changed for {name}"));
            }
        }
    }
    assert!(
        failures.is_empty(),
        "valid emission controls: {failures:#?}"
    );
}
