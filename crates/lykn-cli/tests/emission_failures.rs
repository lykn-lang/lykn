use std::fs;
use std::path::{Path, PathBuf};
use std::process::{Command, Output};
use std::time::{SystemTime, UNIX_EPOCH};

use lykn_cli::dist::build_project;
use tempfile::TempDir;

const INVALID_SOURCE: &str = "(bind obj-value (obj :secret 1))\n(bind cleaned (dissoc obj-value \"secret\"))\n(console:log cleaned)\n";
const USER_TEXT_SOURCE: &str = "(console:log \"COMPILE_ERROR: literal\")\n(throw (new TypeError \"COMPILE_ERROR: user runtime\"))\n";
const SHADOWED_DISSOC_SOURCE: &str = "(bind dissoc (fn (:any left :any right) (get (array left right) 1)))\n(console:log (JSON:stringify (dissoc (obj :secret 1) \"kept\")))\n";

fn cli() -> Command {
    Command::new(env!("CARGO_BIN_EXE_lykn"))
}

fn execute(command: &mut Command) -> Output {
    command.output().expect("start lykn regression process")
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

fn run_deno(js: &Path, cwd: &Path) -> Output {
    let deno = std::env::var_os("LYKN_TEST_DENO").unwrap_or_else(|| "deno".into());
    execute(
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

#[test]
fn checked_emission_failure_blocks_cli_and_dist_outputs() {
    let mut failures = Vec::new();

    // CLI stdout route.
    let stdout_fixture = TempDir::new().expect("create stdout fixture");
    let source = write_source(stdout_fixture.path(), "invalid.lykn", INVALID_SOURCE);
    let stdout = execute(
        cli()
            .current_dir(stdout_fixture.path())
            .arg("compile")
            .arg(&source),
    );
    let stdout_text = String::from_utf8_lossy(&stdout.stdout);
    let stdout_err = String::from_utf8_lossy(&stdout.stderr);
    eprintln!(
        "EMISSION_FAILURE route=cli-stdout status={:?} stdout={stdout_text:?} stderr={stdout_err:?}",
        stdout.status.code(),
    );
    if stdout.status.success() || !stdout.stdout.is_empty() {
        failures.push("CLI stdout route returned success or emitted partial JS".to_string());
    }

    // CLI file route with existing byte sentinels.
    let existing_fixture = TempDir::new().expect("create existing-output fixture");
    let source = write_source(existing_fixture.path(), "invalid.lykn", INVALID_SOURCE);
    let output = existing_fixture.path().join("sentinel.js");
    let declaration = dts_path(&output);
    let js_sentinel = b"existing JavaScript sentinel\n";
    let dts_sentinel = b"existing declarations sentinel\n";
    fs::write(&output, js_sentinel).expect("write JS sentinel");
    fs::write(&declaration, dts_sentinel).expect("write DTS sentinel");
    let file = execute(
        cli()
            .current_dir(existing_fixture.path())
            .arg("compile")
            .arg(&source)
            .arg("-o")
            .arg(&output),
    );
    let file_stdout = String::from_utf8_lossy(&file.stdout);
    let file_stderr = String::from_utf8_lossy(&file.stderr);
    let actual_js = fs::read(&output).expect("read JS sentinel before assertions");
    let actual_dts = fs::read(&declaration).expect("read DTS sentinel before assertions");
    eprintln!(
        "EMISSION_FAILURE route=cli-existing status={:?} stdout={file_stdout:?} stderr={file_stderr:?} js={actual_js:?} dts={actual_dts:?}",
        file.status.code(),
    );
    if file.status.success() || actual_js != js_sentinel || actual_dts != dts_sentinel {
        failures.push("CLI file route succeeded or changed existing outputs".to_string());
    }

    // CLI file route with absent output paths.
    let missing_fixture = TempDir::new().expect("create missing-output fixture");
    let source = write_source(missing_fixture.path(), "invalid.lykn", INVALID_SOURCE);
    let output = missing_fixture.path().join("missing.js");
    let declaration = dts_path(&output);
    let missing = execute(
        cli()
            .current_dir(missing_fixture.path())
            .arg("compile")
            .arg(&source)
            .arg("-o")
            .arg(&output),
    );
    let missing_stdout = String::from_utf8_lossy(&missing.stdout);
    let missing_stderr = String::from_utf8_lossy(&missing.stderr);
    let js_exists = output.exists();
    let dts_exists = declaration.exists();
    eprintln!(
        "EMISSION_FAILURE route=cli-missing status={:?} stdout={missing_stdout:?} stderr={missing_stderr:?} js_exists={js_exists} dts_exists={dts_exists}",
        missing.status.code(),
    );
    if missing.status.success() || js_exists || dts_exists {
        failures.push("CLI file route succeeded or created outputs".to_string());
    }

    // Public package build route. Old output mtimes force source recompilation.
    let dist_fixture = TempDir::new().expect("create dist fixture");
    let package_path = package(dist_fixture.path(), INVALID_SOURCE);
    let build = dist_fixture.path().join("target/lykn/build/fixture");
    fs::create_dir_all(&build).expect("create existing build output");
    let build_js = build.join("mod.js");
    let build_dts = build.join("mod.d.ts");
    let js_sentinel = b"existing package JavaScript\n";
    let dts_sentinel = b"existing package declarations\n";
    fs::write(&build_js, js_sentinel).expect("write package JS sentinel");
    fs::write(&build_dts, dts_sentinel).expect("write package DTS sentinel");
    let epoch = UNIX_EPOCH;
    fs::File::open(&build_js)
        .and_then(|file| file.set_modified(epoch))
        .expect("make JS sentinel stale");
    fs::File::open(&build_dts)
        .and_then(|file| file.set_modified(epoch))
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
    let build_result = build_project(dist_fixture.path());
    let actual_js = fs::read(&build_js).expect("read package JS before assertions");
    let actual_dts = fs::read(&build_dts).expect("read package DTS before assertions");
    eprintln!(
        "EMISSION_FAILURE route=dist-existing source_mtime={source_mtime:?} js_mtime={js_mtime:?} dts_mtime={dts_mtime:?} result={build_result:?} js={actual_js:?} dts={actual_dts:?}"
    );
    if build_result.is_ok() || actual_js != js_sentinel || actual_dts != dts_sentinel {
        failures.push("dist route succeeded or changed existing outputs".to_string());
    }

    assert!(failures.is_empty(), "checked-emission failures: {failures:#?}");
}

#[test]
fn valid_runtime_exceptions_and_resolved_dissoc_remain_ordinary_programs() {
    let mut failures = Vec::new();
    for (name, source_text, expected_stdout, expected_stderr) in [
        (
            "user-text",
            USER_TEXT_SOURCE,
            b"COMPILE_ERROR: literal\n".as_slice(),
            "TypeError",
        ),
        (
            "shadowed-dissoc",
            SHADOWED_DISSOC_SOURCE,
            b"\"kept\"\n".as_slice(),
            "",
        ),
    ] {
        let cli_fixture = TempDir::new().expect("create valid CLI fixture");
        let source = write_source(cli_fixture.path(), "valid.lykn", source_text);
        let output = cli_fixture.path().join("valid.js");
        let compiled = execute(
            cli()
                .current_dir(cli_fixture.path())
                .arg("compile")
                .arg(&source)
                .arg("-o")
                .arg(&output),
        );
        let generated_js = fs::read(&output).ok();
        let generated_dts = fs::read(dts_path(&output)).ok();
        eprintln!(
            "EMISSION_VALID name={name} compile_status={:?} stdout={:?} stderr={:?} js={generated_js:?} dts={generated_dts:?}",
            compiled.status.code(),
            String::from_utf8_lossy(&compiled.stdout),
            String::from_utf8_lossy(&compiled.stderr),
        );
        if !compiled.status.success() || generated_js.is_none() || generated_dts.is_none() {
            failures.push(format!("CLI compilation failed for {name}"));
        }
        if let Some(js) = generated_js {
            let runtime_file = cli_fixture.path().join("runtime.js");
            fs::write(&runtime_file, js).expect("write runtime module");
            let runtime = run_deno(&runtime_file, cli_fixture.path());
            let runtime_stdout = String::from_utf8_lossy(&runtime.stdout);
            let runtime_stderr = String::from_utf8_lossy(&runtime.stderr);
            eprintln!(
                "EMISSION_VALID name={name} runtime_status={:?} stdout={runtime_stdout:?} stderr={runtime_stderr:?}",
                runtime.status.code(),
            );
            if (name == "shadowed-dissoc") != runtime.status.success()
                || runtime.stdout != expected_stdout
                || !runtime_stderr.contains(expected_stderr)
            {
                failures.push(format!("runtime behavior changed for {name}"));
            }
        }

        let dist_fixture = TempDir::new().expect("create valid package fixture");
        package(dist_fixture.path(), source_text);
        let result = build_project(dist_fixture.path());
        let package_js = dist_fixture.path().join("target/lykn/build/fixture/mod.js");
        let package_dts = dist_fixture.path().join("target/lykn/build/fixture/mod.d.ts");
        let package_js_bytes = fs::read(&package_js).ok();
        let package_dts_bytes = fs::read(&package_dts).ok();
        eprintln!(
            "EMISSION_VALID name={name} package_result={result:?} js={package_js_bytes:?} dts={package_dts_bytes:?}"
        );
        if result.is_err() || package_js_bytes.is_none() || package_dts_bytes.is_none() {
            failures.push(format!("package compilation failed for {name}"));
        }
    }

    assert!(failures.is_empty(), "valid emission controls: {failures:#?}");
}
