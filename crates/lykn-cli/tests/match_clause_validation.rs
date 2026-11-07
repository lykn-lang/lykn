use std::fs;
use std::path::PathBuf;
use std::process::{Command, Output};

use tempfile::TempDir;

const POSITIVE_SOURCE: &str = r#"(type Choice (Box :boolean ready) Other)
(func collect :args (:boolean is-box :boolean ready) :returns :array :body
  (bind events (cell #a()))
  (bind answer
    (match (if is-box (Box ready) Other)
      ((Box should-run) :when true
        (if should-run (swap! events (fn (:array xs) (conj xs "prefix"))))
        (swap! events (fn (:array xs) (conj xs "tail")))
        42)
      (_
        (swap! events (fn (:array xs) (conj xs "fallback")))
        0)))
  (match (if is-box (Box ready) Other)
    ((Box should-run)
      (if should-run (swap! events (fn (:array xs) (conj xs "statement")))))
    (_ ()))
  #a(answer (express events)))
(console:log (JSON:stringify #a((collect true true) (collect true false) (collect false true))))
"#;

const NEGATIVE_SOURCE: &str = r#"(type Choice (Box :boolean ready) Other)
(func bad :args (:boolean ready) :returns :number :body 0
  (match (Box ready)
    ((Box value) (if value 1))
    (_ 0)))
"#;

fn execute(command: &mut Command) -> Output {
    command.output().expect("start match validation CLI process")
}

fn write_source(temp: &TempDir, name: &str, source: &str) -> PathBuf {
    let path = temp.path().join(name);
    fs::write(&path, source).expect("write frozen Lykn fixture");
    path
}

fn diagnostic(output: &Output) -> String {
    String::from_utf8_lossy(&output.stderr).into_owned()
}

#[test]
fn match_clause_validation_preserves_context_and_runtime_behavior() {
    let temp = TempDir::new().expect("create positive match fixture directory");
    let source = write_source(&temp, "positive.lykn", POSITIVE_SOURCE);
    eprintln!("MATCH_VALIDATION_SOURCE bytes={} source={POSITIVE_SOURCE:?}", POSITIVE_SOURCE.len());

    let check = execute(
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .arg("check")
            .arg(&source),
    );
    eprintln!("MATCH_VALIDATION_CHECK status={:?} stdout={:?} stderr={:?}", check.status.code(), check.stdout, check.stderr);

    let stdout_compile = execute(
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .arg("compile")
            .arg(&source),
    );
    eprintln!("MATCH_VALIDATION_STDOUT status={:?} stdout={:?} stderr={:?}", stdout_compile.status.code(), stdout_compile.stdout, stdout_compile.stderr);

    let js = temp.path().join("positive.js");
    let file_compile = execute(
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .arg("compile")
            .arg(&source)
            .arg("-o")
            .arg(&js),
    );
    let generated_js = fs::read(&js).ok();
    let generated_dts = fs::read(js.with_extension("d.ts")).ok();
    eprintln!("MATCH_VALIDATION_FILE status={:?} stdout={:?} stderr={:?} js_before_assert={generated_js:?} dts_before_assert={generated_dts:?}", file_compile.status.code(), file_compile.stdout, file_compile.stderr);

    assert!(check.status.success(), "strict check rejected valid match source: {}", diagnostic(&check));
    assert!(stdout_compile.status.success(), "stdout compile rejected valid match source: {}", diagnostic(&stdout_compile));
    assert!(file_compile.status.success(), "file compile rejected valid match source: {}", diagnostic(&file_compile));
    let generated_js = generated_js.expect("successful file compile writes JavaScript");
    let generated_dts = generated_dts.expect("successful typed file compile writes declarations");
    assert_eq!(stdout_compile.stdout, generated_js, "stdout and file compile routes differ");
    assert!(generated_dts.starts_with(b"declare function collect"), "unexpected declaration bytes: {generated_dts:?}");
    assert!(generated_js.windows(b"prefix".len()).any(|window| window == b"prefix"));
    assert!(generated_js.windows(b"statement".len()).any(|window| window == b"statement"));

    let deno = "/opt/homebrew/bin/deno";
    let runtime = execute(
        Command::new(deno)
            .args(["run", "--no-config", "--no-remote", "--cached-only", "--no-npm", "--deny-net", "--no-prompt"])
            .arg(&js),
    );
    eprintln!("MATCH_VALIDATION_RUNTIME executable={deno:?} status={:?} stdout={:?} stderr={:?}", runtime.status.code(), runtime.stdout, runtime.stderr);
    assert!(runtime.status.success(), "generated module failed: {}", diagnostic(&runtime));
    assert_eq!(runtime.stdout, b"[[42,[\"prefix\",\"tail\",\"statement\"]],[42,[\"tail\"]],[0,[\"fallback\"]]]\n");
    assert!(runtime.stderr.is_empty());
}

#[test]
fn consumed_match_tail_if_is_rejected_without_writing_outputs() {
    let temp = TempDir::new().expect("create negative match fixture directory");
    let source = write_source(&temp, "negative.lykn", NEGATIVE_SOURCE);
    eprintln!("MATCH_VALIDATION_NEGATIVE_SOURCE bytes={} source={NEGATIVE_SOURCE:?}", NEGATIVE_SOURCE.len());

    let check = execute(
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .arg("check")
            .arg(&source),
    );
    eprintln!("MATCH_VALIDATION_NEGATIVE_CHECK status={:?} stdout={:?} stderr={:?}", check.status.code(), check.stdout, check.stderr);

    let stdout_compile = execute(
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .arg("compile")
            .arg(&source),
    );
    eprintln!("MATCH_VALIDATION_NEGATIVE_STDOUT status={:?} stdout={:?} stderr={:?}", stdout_compile.status.code(), stdout_compile.stdout, stdout_compile.stderr);

    let js = temp.path().join("rejected.js");
    let file_compile = execute(
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .arg("compile")
            .arg(&source)
            .arg("-o")
            .arg(&js),
    );
    let generated_js = fs::read(&js).ok();
    let generated_dts = fs::read(js.with_extension("d.ts")).ok();
    eprintln!("MATCH_VALIDATION_NEGATIVE_FILE status={:?} stdout={:?} stderr={:?} js_before_assert={generated_js:?} dts_before_assert={generated_dts:?}", file_compile.status.code(), file_compile.stdout, file_compile.stderr);

    for (route, output) in [("check", &check), ("stdout", &stdout_compile), ("file", &file_compile)] {
        assert!(!output.status.success(), "{route} accepted consumed no-else match tail");
        assert!(diagnostic(output).contains("if in expression position requires an else branch"), "{route} missed no-else diagnostic: {}", diagnostic(output));
    }
    assert!(stdout_compile.stdout.is_empty());
    assert!(generated_js.is_none(), "rejected file compile wrote JavaScript");
    assert!(generated_dts.is_none(), "rejected file compile wrote declarations");
}
