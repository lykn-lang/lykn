//! arc13/slice06 F-4 — the §A6 static conformance check (DD-61 §A6, Rust side).
//!
//! DD-61 §A6 makes the resolution tag *unignorable*: dispatch sites must read a
//! form head through [`SExpr::as_form_head`] (which returns `None` for a
//! lexically bound head), never the raw [`SExpr::as_atom`]. Rust has no way to
//! forbid the raw accessor at a type level while the `binding` field is still
//! public (the payload-privacy restructure is a follow-up slice), so this test
//! is the standing backstop — the Rust analogue of the JS `.value ===` grep the
//! DD prescribes.
//!
//! It scans the three post-resolution consumer subsystems (classifier, emitter,
//! codegen) for **form-head** reads — `values[0].as_atom()` and
//! `values.first().and_then(|x| x.as_atom())` — and fails if any is not either
//! converted to `as_form_head()` or explicitly sanctioned with an `A6-exempt`
//! marker (a head read that parses the internal grammar of an already-identified
//! form — destructuring patterns, param defaults — where the marker atom can
//! never be a lexically bound call head).
//!
//! The expander is not scanned: it runs *before* resolution and gates dispatch
//! with the light binding-scan (DD-61 §A3), not the tag.

use std::fs;
use std::path::PathBuf;

/// The consumer subsystems whose head dispatch must honour resolution.
const SUBSYSTEMS: &[&str] = &[
    "src/classifier/forms.rs",
    "src/emitter/forms.rs",
    "src/codegen/emit.rs",
];

fn crate_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
}

/// Is `line` a **form-head** raw-`as_atom` read (the dispatch idiom this check
/// polices)? Matches `values[0].as_atom()` and the
/// `values.first().and_then(|x| x.as_atom())` shape.
fn is_form_head_as_atom(line: &str) -> bool {
    let t = line.trim();
    if !t.contains(".as_atom()") {
        return false;
    }
    t.contains("values[0].as_atom()")
        || (t.contains("values.first().and_then(") && t.contains(".as_atom()"))
}

/// A read is sanctioned if it is already `as_form_head`, or an `A6-exempt`
/// marker sits close to the read. `rustfmt` reflows the marker comment within an
/// `if let … {` head — sometimes onto the line just below the condition, before
/// the `{` — so we scan a small symmetric window rather than only upward. The
/// window is tight enough that an isolated unsanctioned read (the seeded-
/// violation demo) is still caught.
fn sanctioned(lines: &[&str], idx: usize) -> bool {
    if lines[idx].contains("as_form_head") {
        return true;
    }
    let lo = idx.saturating_sub(3);
    let hi = (idx + 3).min(lines.len() - 1);
    lines[lo..=hi].iter().any(|l| l.contains("A6-exempt"))
}

#[test]
fn no_unsanctioned_form_head_as_atom_in_consumers() {
    let root = crate_root();
    let mut violations = Vec::new();

    for rel in SUBSYSTEMS {
        let path = root.join(rel);
        let src = fs::read_to_string(&path).unwrap_or_else(|e| panic!("read {rel}: {e}"));
        let lines: Vec<&str> = src.lines().collect();

        // Test code legitimately reads heads via `as_atom` in assertions; the
        // production consumers all precede the `#[cfg(test)]` module, so stop
        // there.
        let end = lines
            .iter()
            .position(|l| l.trim_start().starts_with("#[cfg(test)]"))
            .unwrap_or(lines.len());

        for (idx, line) in lines[..end].iter().enumerate() {
            if is_form_head_as_atom(line) && !sanctioned(&lines, idx) {
                violations.push(format!("{}:{}: {}", rel, idx + 1, line.trim()));
            }
        }
    }

    assert!(
        violations.is_empty(),
        "DD-61 §A6: form-head dispatch must use `as_form_head()` (or be marked \
         `A6-exempt`). Unsanctioned raw `as_atom()` head reads:\n{}",
        violations.join("\n")
    );
}
