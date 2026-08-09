use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;

fn lykn_bin() -> String {
    env!("CARGO_BIN_EXE_lykn").to_string()
}

fn project_root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../..")
        .canonicalize()
        .expect("project root")
}

fn run_ok(command: &mut Command) -> String {
    let output = command.output().expect("failed to run command");
    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);
    assert!(
        output.status.success(),
        "command should succeed\nstdout:\n{stdout}\nstderr:\n{stderr}"
    );
    stdout.into_owned()
}

#[test]
fn fresh_scaffold_supports_local_bin_tests_nested_build_and_source_run() {
    let tmp = tempfile::tempdir().expect("failed to create temp dir");

    run_ok(
        Command::new(lykn_bin())
            .arg("new")
            .arg("runway-fixture")
            .arg("--path")
            .arg(tmp.path())
            .current_dir(project_root()),
    );

    let project = tmp.path().join("runway-fixture");
    let project_bin = project.join("bin/lykn");
    assert!(project_bin.is_file(), "bin/lykn should be scaffolded");

    let version = run_ok(
        Command::new("./bin/lykn")
            .arg("--version")
            .current_dir(&project),
    );
    assert!(version.contains("lykn"), "version output should name lykn");

    run_ok(
        Command::new("./bin/lykn")
            .arg("build")
            .current_dir(&project),
    );
    run_ok(Command::new("./bin/lykn").arg("test").current_dir(&project));
    run_ok(
        Command::new("./bin/lykn")
            .arg("lint")
            .arg("packages/runway-fixture")
            .arg("test")
            .current_dir(&project),
    );

    let package = project.join("packages/runway-fixture");
    fs::create_dir_all(package.join("nested")).unwrap();
    fs::write(
        package.join("nested/helper.lykn"),
        r#"(export (func helper-message
  :args (:string name)
  :returns :string
  :body (template "hello " name)))
"#,
    )
    .unwrap();
    fs::write(
        package.join("source-entrypoint.lykn"),
        r#"(import "./nested/helper.js" (helper-message))

(console:log (helper-message "runway"))
"#,
    )
    .unwrap();

    run_ok(
        Command::new("./bin/lykn")
            .arg("build")
            .current_dir(&project),
    );
    assert!(
        project
            .join("target/lykn/build/runway-fixture/nested/helper.js")
            .is_file(),
        "nested helper should be built with its relative path preserved"
    );

    let source_run = run_ok(
        Command::new("./bin/lykn")
            .arg("run")
            .arg("packages/runway-fixture/source-entrypoint.lykn")
            .current_dir(&project),
    );
    assert!(
        source_run.contains("hello runway"),
        "source run should execute the relative import"
    );

    let built_run = run_ok(
        Command::new("./bin/lykn")
            .arg("run")
            .arg("target/lykn/build/runway-fixture/source-entrypoint.js")
            .current_dir(&project),
    );
    assert!(
        built_run.contains("hello runway"),
        "built entrypoint should execute the same import"
    );
}
