//! arc13/slice06 F-2 — the expander's light binding-scan (DD-61 §A3 / DD-60 D1).
//!
//! A lexically bound name shadows both a **user macro** and a **built-in
//! desugar** when used as a call head — the expander must emit a plain call, not
//! fire the macro/desugar. These cases live below the conformance matrix (which
//! probes surface/kernel forms, not desugars or user-macro invocations), so they
//! are pinned here. Requires a macro-bearing file so `pass2` actually runs.

use std::fs;
use std::process::Command;

fn lykn_bin() -> String {
    env!("CARGO_BIN_EXE_lykn").to_string()
}

/// Compile `src` (written to a temp `.lykn`) via the freshly built binary and
/// return stdout (the generated JS). Panics on a non-zero exit.
fn compile(src: &str) -> String {
    let dir = std::env::temp_dir();
    let path = dir.join(format!("lykn_f2_{}.lykn", src.len()));
    fs::write(&path, src).unwrap();
    let output = Command::new(lykn_bin())
        .args(["compile", "--no-strict", path.to_str().unwrap()])
        .output()
        .expect("run lykn compile");
    let _ = fs::remove_file(&path);
    assert!(
        output.status.success(),
        "compile failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );
    String::from_utf8_lossy(&output.stdout).into_owned()
}

// A trivial macro to force the macro-bearing path (`pass2` runs), plus the
// shadowing probes. `probe`/`probe2` names are irrelevant; the `987` call arg is
// the distinctive marker of a real call to the binding.
const MACRO_DEF: &str = "(macro when (test (rest body)) `(if ,test (block ,@body)))\n";

#[test]
fn bound_name_does_not_fire_user_macro() {
    // `when` is a user macro; as a function parameter it shadows the macro, so
    // `(when 987)` is a plain call, not an `if` expansion.
    let js = compile(&format!(
        "{MACRO_DEF}(func probe :args (:any when) :body (when 987))"
    ));
    assert!(
        js.contains("when(987)"),
        "bound `when` must be a call, got:\n{js}"
    );
    assert!(!js.contains("if ("), "the macro must not fire:\n{js}");
}

#[test]
fn bound_name_does_not_fire_desugar() {
    // `car` is a built-in desugar (`(car x)` → `x[0]`); as a parameter it
    // shadows the desugar, so `(car 987)` is a plain call.
    let js = compile(&format!(
        "{MACRO_DEF}(func probe :args (:any car) :body (car 987))"
    ));
    assert!(
        js.contains("car(987)"),
        "bound `car` must be a call, got:\n{js}"
    );
}

#[test]
fn out_of_scope_use_still_expands() {
    // Outside any binding of `when`, the macro fires as usual.
    let js = compile(&format!("{MACRO_DEF}(when (> 1 0) (console:log 1))"));
    assert!(
        js.contains("if (1 > 0)"),
        "out-of-scope macro must still expand, got:\n{js}"
    );
}

#[test]
fn sibling_binding_shadows_following_desugar() {
    // A `bind` shadows a desugar for the *following* siblings only.
    let js = compile(&format!(
        "{MACRO_DEF}(console:log (car #a(1 2 3)))\n\
         (bind car (fn (:any x) x))\n(console:log (car 987))"
    ));
    // before the bind: the desugar still fires.
    assert!(js.contains("[1, 2, 3][0]"), "pre-bind desugar:\n{js}");
    // after the bind: the name is a call.
    assert!(js.contains("car(987)"), "post-bind call:\n{js}");
}
