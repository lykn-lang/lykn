//! Compilation pipeline — reads lykn source and emits kernel JSON or JavaScript.
//!
//! The pipeline is: read -> expand -> classify -> analyze -> emit -> (bridge to JS).

use std::path::Path;

use lykn_lang::analysis;
use lykn_lang::classifier;
use lykn_lang::diagnostics::Severity;
use lykn_lang::emitter;
use lykn_lang::expander;
use lykn_lang::reader;

use super::bridge;

/// Compile a `.lykn` source file through the full pipeline.
///
/// Returns the compiled output as a string: either kernel JSON (when
/// `kernel_json_only` is `true`) or JavaScript (by bridging through Deno).
pub fn compile_file(
    path: &Path,
    strip_assertions: bool,
    kernel_json_only: bool,
) -> Result<String, String> {
    let source = std::fs::read_to_string(path)
        .map_err(|e| format!("error reading {}: {e}", path.display()))?;

    compile_source(&source, Some(path), strip_assertions, kernel_json_only)
}

/// Compile lykn source text through the full pipeline.
///
/// This is the core compilation function. `file_path` is used for macro
/// import resolution and Deno bridging; it may be `None` for in-memory
/// compilation with `kernel_json_only`.
pub fn compile_source(
    source: &str,
    file_path: Option<&Path>,
    strip_assertions: bool,
    kernel_json_only: bool,
) -> Result<String, String> {
    // 1. Parse S-expressions
    let forms = reader::read(source).map_err(|e| format!("{e}"))?;

    // 2. Expand macros
    let forms = expander::expand(forms, file_path).map_err(|e| format!("{e}"))?;

    // 3. Classify into surface forms
    let classified = classifier::classify(&forms).map_err(|diags| {
        diags
            .iter()
            .map(|d| format!("{d}"))
            .collect::<Vec<_>>()
            .join("\n")
    })?;

    // 4. Run static analysis (builds its own type registry internally)
    let analysis_result = analysis::analyze(&classified);

    if analysis_result.has_errors {
        let msgs: Vec<String> = analysis_result
            .diagnostics
            .iter()
            .filter(|d| d.severity == Severity::Error)
            .map(|d| format!("{d}"))
            .collect();
        return Err(msgs.join("\n"));
    }

    // Print warnings to stderr
    for diag in &analysis_result.diagnostics {
        if diag.severity == Severity::Warning {
            eprintln!("{diag}");
        }
    }

    // 5. Emit kernel forms using the registry from analysis
    let kernel = emitter::emit(
        &classified,
        &analysis_result.type_registry,
        strip_assertions,
    );

    // 6. Output
    if kernel_json_only {
        Ok(emitter::json::emit_module_json(&kernel))
    } else {
        let kernel_json = emitter::json::emit_module_json(&kernel);
        bridge::kernel_json_to_js(&kernel_json, file_path.unwrap_or(Path::new(".")))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn compile_source_bind_kernel_json() {
        let source = "(bind x 42)";
        let result = compile_source(source, None, false, true).unwrap();
        assert!(result.contains("const"));
        assert!(result.contains("42"));
    }

    #[test]
    fn compile_source_empty_input() {
        let result = compile_source("", None, false, true).unwrap();
        // Empty input produces empty module JSON
        assert!(result.contains('['));
    }

    #[test]
    fn compile_source_multiple_binds() {
        let source = "(bind x 1)\n(bind y 2)";
        let result = compile_source(source, None, false, true).unwrap();
        assert!(result.contains("const"));
    }

    #[test]
    fn compile_source_func_kernel_json() {
        let source = "(func greet :args (:string name) :body (+ \"hello \" name))";
        let result = compile_source(source, None, false, true).unwrap();
        assert!(result.contains("function"));
    }

    #[test]
    fn compile_source_strip_assertions() {
        let source = "(func inc :args (:number x) :returns :number :body (+ x 1))";
        let with = compile_source(source, None, false, true).unwrap();
        let without = compile_source(source, None, true, true).unwrap();
        // Stripped version should be shorter (no type checks)
        assert!(without.len() <= with.len());
    }

    #[test]
    fn compile_source_invalid_syntax_errors() {
        // Unbalanced parens at reader level — reader returns forms anyway
        // so test a classification error instead
        let source = "(bind)";
        let result = compile_source(source, None, false, true);
        assert!(result.is_err());
    }

    #[test]
    fn compile_source_obj_form() {
        let source = "(bind config (obj :name \"test\" :value 42))";
        let result = compile_source(source, None, false, true).unwrap();
        assert!(result.contains("const"));
    }

    #[test]
    fn compile_source_type_and_match() {
        let source = r#"
(type Color Red Green Blue)
(bind c Red)
(bind name (match c
    (Red "red")
    (Green "green")
    (Blue "blue")))
"#;
        let result = compile_source(source, None, false, true).unwrap();
        assert!(result.contains("const"));
    }

    #[test]
    fn compile_source_cell_express() {
        let source = "(bind counter (cell 0))\n(bind val (express counter))";
        let result = compile_source(source, None, false, true).unwrap();
        assert!(result.contains("const"));
    }

    #[test]
    fn compile_source_threading() {
        let source = "(bind result (-> 1 (+ 2)))";
        let result = compile_source(source, None, false, true).unwrap();
        assert!(result.contains("const"));
    }

    #[test]
    fn compile_file_nonexistent_errors() {
        let result = compile_file(Path::new("/nonexistent/file.lykn"), false, true);
        assert!(result.is_err());
        assert!(result.unwrap_err().contains("error reading"));
    }

    #[test]
    fn compile_file_with_temp_file() {
        let tmp = std::env::temp_dir().join("lykn_test_compile.lykn");
        std::fs::write(&tmp, "(bind x 42)").unwrap();
        let result = compile_file(&tmp, false, true);
        let _ = std::fs::remove_file(&tmp);
        assert!(result.is_ok());
        assert!(result.unwrap().contains("const"));
    }
}
