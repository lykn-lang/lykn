use std::fs;
use std::process::{Command, Output};

use tempfile::TempDir;

fn evidence_dir() -> std::path::PathBuf {
    std::env::var_os("LYKN_DISCARD_DECLARATIONS_EVIDENCE_DIR")
        .map(std::path::PathBuf::from)
        .expect("set baseline evidence directory")
}

fn save_output(root: &std::path::Path, name: &str, output: &Output) {
    fs::write(root.join(format!("{name}.stdout")), &output.stdout)
        .expect("write captured stdout");
    fs::write(root.join(format!("{name}.stderr")), &output.stderr)
        .expect("write captured stderr");
    fs::write(
        root.join(format!("{name}.status")),
        format!("success={} code={:?}\n", output.status.success(), output.status.code()),
    )
    .expect("write captured status");
}

#[test]
fn c60_repeated_discard_parameter_declarations_are_a_real_typescript_red() {
    let temp = TempDir::new().expect("create declaration fixture");
    let evidence = evidence_dir();
    fs::create_dir_all(&evidence).expect("create baseline evidence directory");

    let source = temp.path().join("input.lykn");
    fs::write(
        &source,
        "(func ignore :args (:number _ :string _) :returns :void :body (console:log \"ok\"))\n(exports ignore)\n",
    )
    .expect("write Lykn source");
    let output = temp.path().join("generated.js");
    let compile = Command::new(env!("CARGO_BIN_EXE_lykn"))
        .current_dir(temp.path())
        .arg("compile")
        .arg(&source)
        .arg("-o")
        .arg(&output)
        .output()
        .expect("run actual lykn CLI compile");
    save_output(&evidence, "compile", &compile);
    assert!(
        compile.status.success(),
        "valid Lykn source did not compile: {}",
        String::from_utf8_lossy(&compile.stderr)
    );

    let declaration = output.with_extension("d.ts");
    let declaration_text = fs::read_to_string(&declaration)
        .expect("read actual generated declaration before assertions");
    fs::write(evidence.join("generated.d.ts"), &declaration_text)
        .expect("preserve actual generated declaration");
    let consumer = temp.path().join("consumer.ts");
    fs::write(
        &consumer,
        "import type { ignore } from \"./generated.d.ts\";\ntype Ignore = typeof ignore;\ndeclare const callIgnore: Ignore;\ncallIgnore(1, \"text\");\n",
    )
    .expect("write real TypeScript consumer");
    fs::copy(&consumer, evidence.join("consumer.ts"))
        .expect("preserve TypeScript consumer");
    let config = temp.path().join("deno.json");
    fs::write(
        &config,
        r#"{"compilerOptions":{"strict":true,"exactOptionalPropertyTypes":true,"skipLibCheck":false}}"#,
    )
    .expect("write strict exact-optional TypeScript config");
    fs::copy(&config, evidence.join("deno.json"))
        .expect("preserve TypeScript config");

    let deno = std::env::var_os("LYKN_TEST_DENO").unwrap_or_else(|| "deno".into());
    let mut deno_command = Command::new(deno);
    deno_command
        .current_dir(temp.path())
        .args([
            "check",
            "--no-remote",
            "--no-npm",
            "--cached-only",
            "--no-lock",
            "--config",
        ])
        .arg(&config)
        .arg(&consumer);
    fs::write(
        evidence.join("deno-check.command"),
        format!(
            "program={:?}\nargs={:?}\ncwd={:?}\n",
            deno_command.get_program(),
            deno_command.get_args().collect::<Vec<_>>(),
            deno_command.get_current_dir(),
        ),
    )
    .expect("preserve Deno checker command");
    let check = deno_command
        .output()
        .expect("run real offline Deno TypeScript check");
    save_output(&evidence, "deno-check", &check);
    eprintln!(
        "DISCARD_DTS_BASELINE declaration={declaration_text:?} check_status={:?} stdout={:?} stderr={:?}",
        check.status.code(),
        String::from_utf8_lossy(&check.stdout),
        String::from_utf8_lossy(&check.stderr),
    );
    assert!(
        !check.status.success(),
        "c60 declaration unexpectedly passed TypeScript checking"
    );
    let diagnostics = String::from_utf8_lossy(&check.stderr);
    assert!(
        diagnostics.contains("Duplicate identifier") && diagnostics.contains("TS2300"),
        "expected duplicate-parameter declaration diagnostic, got: {diagnostics}"
    );
}
