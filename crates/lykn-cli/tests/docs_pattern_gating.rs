//! arc12/slice01: `lykn test --docs <path>` runs the `.lykn` corpus ONLY when
//! explicit test patterns are also given. Bare `--docs` tests docs only (the
//! redundancy fix). This pins both directions of that default.

use std::fs;
use std::process::Command;

fn lykn_bin() -> String {
    env!("CARGO_BIN_EXE_lykn").to_string()
}

fn project_root() -> std::path::PathBuf {
    std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../..")
        .canonicalize()
        .expect("project root")
}

/// The corpus-compile step prints this to stderr; its presence/absence is the
/// signal for whether the corpus ran. (Asserted before any Deno run, so it
/// holds regardless of the doc-test outcome / Deno availability.)
const COMPILED_MARKER: &str = ".lykn test file(s) to";

#[test]
fn docs_without_patterns_skips_corpus_but_with_patterns_runs_it() {
    let root = project_root();
    let md = root.join("target/arc12_docs_gate.md");
    fs::create_dir_all(md.parent().unwrap()).unwrap();
    fs::write(&md, "# t\n\n```lykn\n(bind x 1)\n```\n").unwrap();

    // (1) Bare `--docs` (no patterns) → corpus is NOT compiled. `--compile-only`
    // makes the corpus-compile marker deterministic (it prints only on that path).
    let bare = Command::new(lykn_bin())
        .args([
            "test",
            "--docs",
            md.to_str().unwrap(),
            "--compile-only",
            "--out-dir",
            "target/arc12-gate-a",
        ])
        .current_dir(&root)
        .output()
        .expect("run bare --docs");
    let bare_err = String::from_utf8_lossy(&bare.stderr);
    assert!(
        !bare_err.contains(COMPILED_MARKER),
        "bare `--docs` must not compile the corpus; stderr:\n{bare_err}"
    );

    // (2) `--docs` WITH an explicit test pattern → that pattern IS compiled.
    let combined = Command::new(lykn_bin())
        .args([
            "test",
            "--docs",
            md.to_str().unwrap(),
            "test/surface/bind_test.lykn",
            "--compile-only",
            "--out-dir",
            "target/arc12-gate-b",
        ])
        .current_dir(&root)
        .output()
        .expect("run --docs with patterns");
    let combined_err = String::from_utf8_lossy(&combined.stderr);
    assert!(
        combined_err.contains(COMPILED_MARKER),
        "`--docs` with explicit patterns must compile them; stderr:\n{combined_err}"
    );

    let _ = fs::remove_file(&md);
    let _ = fs::remove_dir_all(root.join("target/arc12-gate-a"));
    let _ = fs::remove_dir_all(root.join("target/arc12-gate-b"));
}
