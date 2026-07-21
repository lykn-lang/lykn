//! arc05 · slice04 · P-11 — the lint composition demo.
//!
//! `lykn lint` over the seeded corpus fires **every** live rule (exit 1); over
//! the clean idiomatic corpus it is silent (exit 0). This is the arc05
//! composition demo the arc close reproduces at arc scale on the host with
//! `./bin/lykn lint crates/lykn-cli/tests/fixtures/p11/{seeded_test.lykn,clean.lykn}`.
//!
//! The fixtures live under `crates/.../tests/fixtures/` (not `test/`) so the
//! `seeded_test.lykn` basename — required for the path-scoped conventions rules
//! to fire — is not also picked up by `lykn test`'s `*_test.lykn` discovery.

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

/// Every rule the seeded corpus must exercise (the full `registry()`).
const EXPECTED_RULES: &[&str] = &[
    "no-require",
    "no-eval",
    "no-new-wrappers",
    "global-isnan",
    "no-arguments",
    "no-iife",
    "no-delete-on-array",
    "no-json-deep-copy",
    "prefer-surface-operators",
    "or-for-defaults",
    "for-in-on-arrays",
    "parseint-radix",
    "sort-without-comparator",
    "shadowing",
    "no-relative-source-imports",
    "no-dirname-fixtures",
];

fn lint(fixture: &str) -> (bool, String) {
    let root = project_root();
    let output = Command::new(lykn_bin())
        .args(["lint", fixture])
        .current_dir(&root)
        .output()
        .expect("failed to run lykn lint");
    let combined = format!(
        "{}{}",
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr),
    );
    (output.status.success(), combined)
}

#[test]
fn seeded_corpus_fires_every_rule_and_exits_nonzero() {
    let (ok, out) = lint("crates/lykn-cli/tests/fixtures/p11/seeded_test.lykn");
    assert!(!ok, "seeded corpus must exit non-zero (findings):\n{out}");
    for rule in EXPECTED_RULES {
        assert!(
            out.contains(&format!("[{rule}]")),
            "seeded corpus did not fire `{rule}`:\n{out}"
        );
    }
}

#[test]
fn clean_corpus_is_silent_and_exits_zero() {
    let (ok, out) = lint("crates/lykn-cli/tests/fixtures/p11/clean.lykn");
    assert!(ok, "clean corpus must exit 0 (no findings):\n{out}");
    // No rule tags in the output.
    for rule in EXPECTED_RULES {
        assert!(
            !out.contains(&format!("[{rule}]")),
            "clean corpus unexpectedly fired `{rule}`:\n{out}"
        );
    }
}
