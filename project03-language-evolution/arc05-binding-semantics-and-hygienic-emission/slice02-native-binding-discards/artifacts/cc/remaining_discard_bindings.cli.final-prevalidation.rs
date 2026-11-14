use std::fs;
use std::path::PathBuf;
use std::process::{Command, Output};

use tempfile::TempDir;

fn execute(command: &mut Command) -> Output {
    command.output().expect("start lykn process")
}

fn repository_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../..")
}

#[test]
fn source_kernel_escape_and_lyk_fixtures_check_compile_and_run_as_esm() {
    let temp = TempDir::new().expect("create fixture directory");
    let executable = env!("CARGO_BIN_EXE_lykn");
    for extension in ["lykn", "lyk"] {
        let source = "(bind pick (kernel:=> (_ _) _)) (console:log (pick 7 8))";
        let source_path = temp.path().join(format!("discard.{extension}"));
        fs::write(&source_path, source).expect("write positive fixture");
        let check = execute(
            Command::new(executable)
                .current_dir(temp.path())
                .arg("check")
                .arg(&source_path),
        );
        eprintln!(
            "DISCARD_CLI_CHECK extension={extension} source={source:?} exit={:?} stdout={:?} stderr={:?}",
            check.status.code(),
            String::from_utf8_lossy(&check.stdout),
            String::from_utf8_lossy(&check.stderr),
        );
        assert!(
            check.status.success(),
            "{extension} check stderr: {}",
            String::from_utf8_lossy(&check.stderr)
        );
        assert!(
            check.stdout.is_empty(),
            "{extension} check stdout: {}",
            String::from_utf8_lossy(&check.stdout)
        );
        assert!(
            String::from_utf8_lossy(&check.stderr).ends_with(": ok (2 top-level expressions)\n"),
            "{extension} check stderr: {}",
            String::from_utf8_lossy(&check.stderr)
        );

        for strip in [false, true] {
            let output_path = temp.path().join(format!("discard-{strip}.mjs"));
            let mut command = Command::new(executable);
            command
                .current_dir(temp.path())
                .arg("compile")
                .arg(&source_path);
            if strip {
                command.arg("--strip-assertions");
            }
            let compile = execute(command.arg("-o").arg(&output_path));
            let generated = fs::read_to_string(&output_path).unwrap_or_default();
            eprintln!(
                "DISCARD_CLI_COMPILE extension={extension} strip={strip} source={source:?} exit={:?} stdout={:?} stderr={:?} generated={generated:?}",
                compile.status.code(),
                String::from_utf8_lossy(&compile.stdout),
                String::from_utf8_lossy(&compile.stderr),
            );
            assert!(
                compile.status.success(),
                "{extension} compile strip={strip} stderr: {}",
                String::from_utf8_lossy(&compile.stderr)
            );
            assert!(
                compile.stdout.is_empty(),
                "{extension} compile stdout: {}",
                String::from_utf8_lossy(&compile.stdout)
            );
            assert!(
                compile.stderr.is_empty(),
                "{extension} compile stderr: {}",
                String::from_utf8_lossy(&compile.stderr)
            );

            let module_url = format!("file://{}", output_path.display());
            let runtime = execute(
                Command::new("deno")
                    .current_dir(repository_root())
                    .args(["eval", "--config", "project.json", "--ext=js"])
                    .arg(format!("globalThis._ = 99; await import({module_url:?});")),
            );
            eprintln!(
                "DISCARD_CLI_RUNTIME extension={extension} strip={strip} exit={:?} stdout={:?} stderr={:?}",
                runtime.status.code(),
                String::from_utf8_lossy(&runtime.stdout),
                String::from_utf8_lossy(&runtime.stderr),
            );
            assert!(
                runtime.status.success(),
                "{extension} runtime stderr: {}",
                String::from_utf8_lossy(&runtime.stderr)
            );
            assert_eq!(runtime.stdout, b"99\n", "{extension} strip={strip}");
            assert!(
                runtime.stderr.is_empty(),
                "{extension} runtime stderr: {}",
                String::from_utf8_lossy(&runtime.stderr)
            );
        }
    }
}

#[test]
fn multi_clause_simple_default_is_rejected_by_check_and_both_compile_modes() {
    const MESSAGE: &str = "multi-clause func does not support top-level default or rest parameters";
    let temp = TempDir::new().expect("create negative fixture directory");
    let source =
        "(func f (:args ((default :any value 7)) :body 1) (:args (:string other) :body 2))";
    let source_path = temp.path().join("multi-default.lykn");
    fs::write(&source_path, source).expect("write negative fixture");
    let executable = env!("CARGO_BIN_EXE_lykn");
    let check = execute(
        Command::new(executable)
            .current_dir(temp.path())
            .arg("check")
            .arg(&source_path),
    );
    assert!(!check.status.success());
    assert!(
        String::from_utf8_lossy(&check.stderr).contains(MESSAGE),
        "{}",
        String::from_utf8_lossy(&check.stderr)
    );
    assert!(check.stdout.is_empty());

    for strip in [false, true] {
        let output_path = temp.path().join(format!("rejected-{strip}.mjs"));
        let mut command = Command::new(executable);
        command
            .current_dir(temp.path())
            .arg("compile")
            .arg(&source_path);
        if strip {
            command.arg("--strip-assertions");
        }
        let compile = execute(command.arg("-o").arg(&output_path));
        assert!(!compile.status.success());
        assert!(
            String::from_utf8_lossy(&compile.stderr).contains(MESSAGE),
            "{}",
            String::from_utf8_lossy(&compile.stderr)
        );
        assert!(compile.stdout.is_empty());
        assert!(!output_path.exists());
    }
}
