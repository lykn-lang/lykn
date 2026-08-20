//! Compilation pipeline — reads lykn source and emits kernel JSON or JavaScript.
//!
//! The pipeline is: read -> expand -> classify -> analyze -> emit -> codegen.

use std::collections::HashMap;
use std::path::Path;

use lykn_lang::analysis;
use lykn_lang::classifier;
use lykn_lang::codegen;
use lykn_lang::diagnostics::Severity;
use lykn_lang::emitter;
use lykn_lang::expander;
use lykn_lang::reader;
use lykn_lang::resolver;

/// Errors that can occur during compilation.
#[derive(Debug, thiserror::Error)]
pub enum CompileError {
    /// An I/O error occurred while reading a source file.
    #[error("error reading {}: {source}", path.display())]
    Io {
        path: std::path::PathBuf,
        source: std::io::Error,
    },

    /// A language-level error (reader or expander).
    #[error("{0}")]
    Lang(#[from] lykn_lang::error::LyknError),

    /// A classification or static-analysis error.
    #[error("{0}")]
    Analysis(String),
}

/// DD-58 classifier mode for a source file, keyed on its extension.
///
/// `.lykn` surface files (and in-memory sources with no path) compile under
/// **strict** mode: the 5 kernel-only declaration forms (`const`/`let`/`var`/
/// `function`/`function*`) without the `kernel:` prefix are rejected. `.lyk`
/// kernel files are **exempt** — strict is a surface-only rule.
fn classifier_options_for(file_path: Option<&Path>) -> classifier::ClassifierOptions {
    let is_lyk = file_path
        .and_then(Path::extension)
        .is_some_and(|e| e == "lyk");
    classifier::ClassifierOptions {
        strict: !is_lyk,
        kernel_only: false,
    }
}

/// Compile a `.lykn` source file through the full pipeline.
///
/// Returns the compiled output as a string: either kernel JSON (when
/// `kernel_json_only` is `true`) or JavaScript (by bridging through Deno).
pub fn compile_file(
    path: &Path,
    strip_assertions: bool,
    kernel_json_only: bool,
) -> Result<String, CompileError> {
    let source = std::fs::read_to_string(path).map_err(|e| CompileError::Io {
        path: path.to_path_buf(),
        source: e,
    })?;

    compile_source(&source, Some(path), strip_assertions, kernel_json_only)
}

/// Validate lykn source through read → expand → classify under the DD-58 mode
/// for `file_path` (strict for `.lykn`, exempt `.lyk`), without codegen.
///
/// Used by `lykn check` so the validation compiler enforces the same
/// closed-namespace rule as `lykn compile`/`build`.
pub fn check_strict(source: &str, file_path: &Path) -> Result<(), CompileError> {
    let forms = reader::read(source)?;
    let imports: Option<HashMap<String, String>> =
        crate::config::read_effective_project_config_optional()
            .map(|c| c.imports.into_iter().collect());
    let forms = expander::expand(forms, Some(file_path), imports.as_ref())?;
    // DD-61 §A1/§A3: resolve names (tag atoms) so dispatch sites consume the
    // tag via `as_form_head` — a lexically bound head is no longer a form.
    let forms = resolver::resolve(&forms);
    // DD-64 (arc15 slice02): check ≡ compile — reject the method-on-expression
    // trap at any nesting depth (classify alone sees only top-level forms).
    let method_errs = lykn_lang::classifier::validate_method_calls(&forms);
    if !method_errs.is_empty() {
        return Err(CompileError::Analysis(
            method_errs
                .iter()
                .map(|d| format!("{d}"))
                .collect::<Vec<_>>()
                .join("\n"),
        ));
    }
    let fn_param_errs = lykn_lang::classifier::validate_nested_fn_params(&forms);
    if !fn_param_errs.is_empty() {
        return Err(CompileError::Analysis(
            fn_param_errs
                .iter()
                .map(|d| format!("{d}"))
                .collect::<Vec<_>>()
                .join("\n"),
        ));
    }
    let no_else_if_errs = lykn_lang::classifier::validate_no_else_if_expressions(&forms);
    if !no_else_if_errs.is_empty() {
        return Err(CompileError::Analysis(
            no_else_if_errs
                .iter()
                .map(|d| format!("{d}"))
                .collect::<Vec<_>>()
                .join("\n"),
        ));
    }
    let exports_errs = lykn_lang::classifier::validate_exports_declarations(&forms);
    if !exports_errs.is_empty() {
        return Err(CompileError::Analysis(
            exports_errs
                .iter()
                .map(|d| format!("{d}"))
                .collect::<Vec<_>>()
                .join("\n"),
        ));
    }
    classifier::classify_with_options(&forms, classifier_options_for(Some(file_path))).map_err(
        |diags| {
            CompileError::Analysis(
                diags
                    .iter()
                    .map(|d| format!("{d}"))
                    .collect::<Vec<_>>()
                    .join("\n"),
            )
        },
    )?;
    Ok(())
}

/// Compile lykn source text through the full pipeline.
///
/// This is the core compilation function. `file_path` is used for macro
/// import resolution and Deno bridging; it may be `None` for in-memory
/// compilation with `kernel_json_only`. DD-58 mode is derived from the
/// file extension (strict for `.lykn`, exempt for `.lyk`).
pub fn compile_source(
    source: &str,
    file_path: Option<&Path>,
    strip_assertions: bool,
    kernel_json_only: bool,
) -> Result<String, CompileError> {
    compile_source_inner(
        source,
        file_path,
        strip_assertions,
        kernel_json_only,
        classifier_options_for(file_path),
    )
}

/// Compile lykn source with DD-58 strict enforcement **disabled** (lax mode:
/// neither strict nor kernel-only). Used by the cross-compiler coherence
/// harness (`compileBoth`) and `lykn compile --no-strict`, which must compile
/// raw kernel forms to compare Rust vs JS codegen — the JS compiler has no
/// strict concept, so the comparison runs both backends lax.
pub fn compile_source_lax(
    source: &str,
    file_path: Option<&Path>,
    strip_assertions: bool,
    kernel_json_only: bool,
) -> Result<String, CompileError> {
    compile_source_inner(
        source,
        file_path,
        strip_assertions,
        kernel_json_only,
        classifier::ClassifierOptions::default(),
    )
}

fn compile_source_inner(
    source: &str,
    file_path: Option<&Path>,
    strip_assertions: bool,
    kernel_json_only: bool,
    classify_opts: classifier::ClassifierOptions,
) -> Result<String, CompileError> {
    // 1. Parse S-expressions
    let forms = reader::read(source)?;

    // 2. Expand macros (with project-level import map if available)
    let imports: Option<HashMap<String, String>> =
        crate::config::read_effective_project_config_optional()
            .map(|c| c.imports.into_iter().collect());
    let forms = expander::expand(forms, file_path, imports.as_ref())?;

    // 2a. DD-61 §A1/§A3 — resolve once: tag every atom (BindingDef/BindingRef/
    // Unresolved). Downstream dispatch reads the tag via `as_form_head`, so a
    // lexically bound head resolves to a plain call (DD-60 D1), not a macro/form.
    let forms = resolver::resolve(&forms);

    // 2b. DD-60 D2 (via DD-61 §A2's binding walker): a JS reserved word in any
    // binding position is a compile error — before codegen can emit invalid JS
    // at rc=0 (the ID-44 genus). Runs on the expanded forms so macro-introduced
    // bindings are covered too.
    let reserved = lykn_lang::binding::validate_reserved_names(&forms);
    if !reserved.is_empty() {
        return Err(CompileError::Analysis(
            reserved
                .iter()
                .map(|d| format!("{d}"))
                .collect::<Vec<_>>()
                .join("\n"),
        ));
    }

    // 2c. DD-64 (arc15): reject method-call sugar on a parenthesized expression
    // (`((express parts):join "")` → the wrong call `parts.value("join","")`) at
    // any nesting depth. classify_form only sees top-level forms; the trap is
    // usually nested, so this recursive pass is the guarantee. The blessed form
    // is threading (`(-> (express parts) (:join ""))`).
    let method_errs = lykn_lang::classifier::validate_method_calls(&forms);
    if !method_errs.is_empty() {
        return Err(CompileError::Analysis(
            method_errs
                .iter()
                .map(|d| format!("{d}"))
                .collect::<Vec<_>>()
                .join("\n"),
        ));
    }
    let fn_param_errs = lykn_lang::classifier::validate_nested_fn_params(&forms);
    if !fn_param_errs.is_empty() {
        return Err(CompileError::Analysis(
            fn_param_errs
                .iter()
                .map(|d| format!("{d}"))
                .collect::<Vec<_>>()
                .join("\n"),
        ));
    }
    let no_else_if_errs = lykn_lang::classifier::validate_no_else_if_expressions(&forms);
    if !no_else_if_errs.is_empty() {
        return Err(CompileError::Analysis(
            no_else_if_errs
                .iter()
                .map(|d| format!("{d}"))
                .collect::<Vec<_>>()
                .join("\n"),
        ));
    }
    let exports_errs = lykn_lang::classifier::validate_exports_declarations(&forms);
    if !exports_errs.is_empty() {
        return Err(CompileError::Analysis(
            exports_errs
                .iter()
                .map(|d| format!("{d}"))
                .collect::<Vec<_>>()
                .join("\n"),
        ));
    }

    // 3. Classify into surface forms (DD-58 strict for `.lykn`, exempt `.lyk`)
    let classified = classifier::classify_with_options(&forms, classify_opts).map_err(|diags| {
        CompileError::Analysis(
            diags
                .iter()
                .map(|d| format!("{d}"))
                .collect::<Vec<_>>()
                .join("\n"),
        )
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
        return Err(CompileError::Analysis(msgs.join("\n")));
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
        Ok(codegen::emit_module_js(&kernel)?)
    }
}

/// Compile lykn source and also produce .d.ts content.
///
/// Returns `(js_output, dts_content_if_any, dts_warnings)`.
pub fn compile_source_with_dts(
    source: &str,
    file_path: Option<&Path>,
    strip_assertions: bool,
    kernel_json_only: bool,
) -> Result<
    (
        String,
        Option<String>,
        Vec<lykn_lang::diagnostics::Diagnostic>,
    ),
    CompileError,
> {
    let forms = reader::read(source)?;

    let imports: Option<HashMap<String, String>> =
        crate::config::read_effective_project_config_optional()
            .map(|c| c.imports.into_iter().collect());
    let forms = expander::expand(forms, file_path, imports.as_ref())?;
    // DD-61 §A1/§A3 — resolve names before classification (see compile path).
    let forms = resolver::resolve(&forms);
    let no_else_if_errs = lykn_lang::classifier::validate_no_else_if_expressions(&forms);
    if !no_else_if_errs.is_empty() {
        return Err(CompileError::Analysis(
            no_else_if_errs
                .iter()
                .map(|d| format!("{d}"))
                .collect::<Vec<_>>()
                .join("\n"),
        ));
    }
    let exports_errs = lykn_lang::classifier::validate_exports_declarations(&forms);
    if !exports_errs.is_empty() {
        return Err(CompileError::Analysis(
            exports_errs
                .iter()
                .map(|d| format!("{d}"))
                .collect::<Vec<_>>()
                .join("\n"),
        ));
    }

    let classified = classifier::classify_with_options(&forms, classifier_options_for(file_path))
        .map_err(|diags| {
        CompileError::Analysis(
            diags
                .iter()
                .map(|d| format!("{d}"))
                .collect::<Vec<_>>()
                .join("\n"),
        )
    })?;

    let analysis_result = analysis::analyze(&classified);

    if analysis_result.has_errors {
        let msgs: Vec<String> = analysis_result
            .diagnostics
            .iter()
            .filter(|d| d.severity == Severity::Error)
            .map(|d| format!("{d}"))
            .collect();
        return Err(CompileError::Analysis(msgs.join("\n")));
    }

    for diag in &analysis_result.diagnostics {
        if diag.severity == Severity::Warning {
            eprintln!("{diag}");
        }
    }

    let kernel = emitter::emit(
        &classified,
        &analysis_result.type_registry,
        strip_assertions,
    );

    let js = if kernel_json_only {
        emitter::json::emit_module_json(&kernel)
    } else {
        codegen::emit_module_js(&kernel)?
    };

    let file_str = file_path
        .map(|p| p.display().to_string())
        .unwrap_or_default();
    let (dts_content, dts_warnings) =
        emitter::dts::emit_dts_module(&classified, &analysis_result.type_registry, &file_str);
    let dts_opt = if dts_content.is_empty() {
        None
    } else {
        Some(dts_content)
    };

    Ok((js, dts_opt, dts_warnings))
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
        assert!(result.unwrap_err().to_string().contains("error reading"));
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

    #[test]
    fn compile_typed_bind_literal_match() {
        // (bind :number x 42) — literal matches, just const
        let source = "(bind :number x 42)";
        let result = compile_source(source, None, false, true).unwrap();
        assert!(result.contains("const"));
        // Should NOT contain a type check (literal matches)
        assert!(
            !result.contains("TypeError"),
            "no type check for matching literal"
        );
    }

    #[test]
    fn compile_typed_bind_literal_mismatch_errors() {
        // (bind :number x "hello") — mismatch → compile error
        let source = r#"(bind :number x "hello")"#;
        let result = compile_source(source, None, false, true);
        assert!(result.is_err(), "mismatch should produce error");
        let err = result.unwrap_err().to_string();
        assert!(
            err.contains("bind 'x'"),
            "error should mention binding name"
        );
    }

    #[test]
    fn compile_typed_bind_any_no_check() {
        // (bind :any x 42) — :any, no check
        let source = "(bind :any x 42)";
        let result = compile_source(source, None, false, true).unwrap();
        assert!(result.contains("const"));
        assert!(!result.contains("TypeError"));
    }

    #[test]
    fn compile_typed_bind_strip_assertions() {
        // (bind :number x (compute)) with strip_assertions — no type check
        let source = "(bind :number x (compute))";
        let with = compile_source(source, None, false, true).unwrap();
        let without = compile_source(source, None, true, true).unwrap();
        // Stripped version should be shorter (no type check)
        assert!(without.len() <= with.len());
    }

    #[test]
    fn compile_source_context_path_synthetic_parent() {
        // Verify that a synthetic path's parent() is what the expander
        // uses for relative-path resolution. This is the mechanism
        // --source-context-path relies on: the CLI builds a synthetic
        // path like context_dir/__compileBoth__.lykn and passes it as
        // file_path. The basename is irrelevant; only the parent matters.
        let context_dir = std::env::temp_dir();
        let synthetic = context_dir.join("__compileBoth__.lykn");
        assert_eq!(synthetic.parent().unwrap(), context_dir.as_path());

        // compile_source with a synthetic path compiles normally
        let source = "(bind x 42)";
        let result = compile_source(source, Some(&synthetic), false, true).unwrap();
        assert!(result.contains("const"));
        assert!(result.contains("42"));
    }

    // --- DD-58 strict-mode default-on for .lykn (arc10/slice01) ---

    #[test]
    fn compile_source_strict_rejects_bare_kernel_in_lykn() {
        // A `.lykn` surface file must reject the 5 kernel-only declaration
        // forms without the `kernel:` prefix.
        for form in ["(const x 1)", "(let x 1)", "(var x 1)", "(function f () 1)"] {
            let path = Path::new("surface.lykn");
            let result = compile_source(form, Some(path), false, false);
            assert!(
                result.is_err(),
                "bare {form} in .lykn must be rejected under strict"
            );
            let msg = format!("{}", result.unwrap_err());
            assert!(
                msg.contains("kernel-only"),
                "expected DD-58 kernel-only diagnostic for {form}, got: {msg}"
            );
        }
    }

    #[test]
    fn compile_source_strict_kernel_escape_compiles_in_lykn() {
        // The `(kernel:<form> …)` escape is the sanctioned resolution.
        let path = Path::new("surface.lykn");
        let result = compile_source("(kernel:var x 1)", Some(path), false, false);
        assert!(
            result.is_ok(),
            "(kernel:var …) must compile under strict: {:?}",
            result.err()
        );
        assert!(result.unwrap().contains("var x = 1"));
    }

    #[test]
    fn compile_source_none_path_is_strict() {
        // In-memory compilation (no path) defaults to strict surface mode.
        let result = compile_source("(var x 1)", None, false, false);
        assert!(
            result.is_err(),
            "bare (var …) with no path must be strict-rejected"
        );
    }

    #[test]
    fn compile_source_lyk_exempt_from_strict() {
        // `.lyk` kernel files are exempt — bare kernel forms compile.
        let path = Path::new("kernel.lyk");
        let result = compile_source("(var x 1)", Some(path), false, false);
        assert!(
            result.is_ok(),
            "bare (var …) in .lyk must compile (strict exemption): {:?}",
            result.err()
        );
        assert!(result.unwrap().contains("var x = 1"));
    }

    #[test]
    fn compile_source_strict_allows_operators_and_surface() {
        // DD-58 strict rejects ONLY the 5 declaration forms; operators
        // (`===`/`&&`/`==`) and surface forms stay legal.
        let path = Path::new("surface.lykn");
        for form in [
            "(bind x 1)",
            "(= 1 1)",
            "(=== 1 1)",
            "(&& 1 1)",
            "(fn (:number x) x)",
        ] {
            let result = compile_source(form, Some(path), false, false);
            assert!(
                result.is_ok(),
                "{form} must compile under strict (not kernel-only): {:?}",
                result.err()
            );
        }
    }

    #[test]
    fn compile_source_strip_assertions_preserves_fn_implicit_return() {
        let path = Path::new("surface.lykn");
        let source = "(bind f (fn (:number x) (bind y (+ x 1)) y))\n(console:log (f 1))";
        let result = compile_source(source, Some(path), true, false).unwrap();
        assert!(
            result.contains("return y;"),
            "stripped fn block must still return the final expression: {result}"
        );
        assert!(
            !result.contains("typeof x"),
            "strip_assertions should still omit runtime type checks: {result}"
        );
    }

    #[test]
    fn compile_source_rejects_nested_bare_parameter_fn() {
        let path = Path::new("surface.lykn");
        let source = "(bind f (fn (x) x))";
        let result = compile_source(source, Some(path), false, false);
        assert!(result.is_err(), "nested bare-parameter fn must reject");
        let msg = result.unwrap_err().to_string();
        assert!(
            msg.contains("expected type keyword"),
            "expected typed-param diagnostic, got: {msg}"
        );
        assert!(
            !msg.contains("fn(x(), x)"),
            "must reject before raw JS fallback: {msg}"
        );
    }

    #[test]
    fn check_strict_rejects_nested_bare_parameter_fn() {
        let path = Path::new("surface.lykn");
        let source = "(bind f (fn (x) x))";
        let result = check_strict(source, path);
        assert!(result.is_err(), "lykn check path must reject too");
        let msg = result.unwrap_err().to_string();
        assert!(
            msg.contains("expected type keyword"),
            "expected typed-param diagnostic, got: {msg}"
        );
    }

    #[test]
    fn compile_source_rejects_no_else_if_in_expression_position() {
        let path = Path::new("surface.lykn");
        let source = "(bind label (if (> 1 0) \"items\"))";
        let result = compile_source(source, Some(path), false, false);
        assert!(result.is_err(), "no-else if in bind value must reject");
        let msg = result.unwrap_err().to_string();
        assert!(
            msg.contains("if in expression position requires an else branch"),
            "expected DD-50 diagnostic, got: {msg}"
        );
        assert!(
            !msg.contains("const label = throw"),
            "must reject before emitting invalid JavaScript: {msg}"
        );
    }

    #[test]
    fn check_strict_rejects_no_else_if_in_expression_position() {
        let path = Path::new("surface.lykn");
        let source = "(bind label (if (> 1 0) \"items\"))";
        let result = check_strict(source, path);
        assert!(
            result.is_err(),
            "lykn check path must reject no-else if in bind value"
        );
        let msg = result.unwrap_err().to_string();
        assert!(
            msg.contains("if in expression position requires an else branch"),
            "expected DD-50 diagnostic, got: {msg}"
        );
    }

    #[test]
    fn compile_source_allows_no_else_if_in_statement_position() {
        let path = Path::new("surface.lykn");
        let source = "(if (> 1 0) (console:log \"items\"))";
        let result = compile_source(source, Some(path), false, false).unwrap();
        assert!(
            result.contains("if (1 > 0)"),
            "statement-position no-else if should compile as an if statement: {result}"
        );
    }

    #[test]
    fn compile_source_allows_if_expression_with_else_branch() {
        let path = Path::new("surface.lykn");
        let source = "(bind label (if (> 1 0) \"items\" \"none\"))";
        let result = compile_source(source, Some(path), false, false).unwrap();
        assert!(
            result.contains("const label = 1 > 0 ? \"items\" : \"none\";"),
            "both-branch if in expression position should compile to ternary: {result}"
        );
    }

    #[test]
    fn compile_source_exports_declaration() {
        let path = Path::new("surface.lykn");
        let source = r#"
(func valid-record? :args (:any record) :body (!= record null))
(func normalize-role :args (:string role) :body role)
(exports valid-record? normalize-role)
"#;
        let result = compile_source(source, Some(path), false, false).unwrap();
        assert!(
            result.contains("export {isValidRecord, normalizeRole};"),
            "exports declaration should emit named JS export list: {result}"
        );
    }

    #[test]
    fn compile_source_rejects_missing_exports_name() {
        let path = Path::new("surface.lykn");
        let result = compile_source("(exports missing)", Some(path), false, false);
        assert!(result.is_err(), "unknown export name must reject");
        let msg = result.unwrap_err().to_string();
        assert!(
            msg.contains("exports references unknown top-level binding 'missing'"),
            "expected missing export diagnostic, got: {msg}"
        );
    }

    #[test]
    fn compile_source_rejects_duplicate_exports_name() {
        let path = Path::new("surface.lykn");
        let result = compile_source(
            "(func normalize :args (:any record) :body record)\n(exports normalize normalize)",
            Some(path),
            false,
            false,
        );
        assert!(result.is_err(), "duplicate export name must reject");
        let msg = result.unwrap_err().to_string();
        assert!(
            msg.contains("exports lists 'normalize' more than once"),
            "expected duplicate export diagnostic, got: {msg}"
        );
    }

    #[test]
    fn compile_source_grouped_bind_keeps_sequential_visibility() {
        let path = Path::new("surface.lykn");
        let source = r#"
(func normalize :args (:any record) :body
  (bind
    email record:email
    role email)
  role)
"#;
        let result = compile_source(source, Some(path), false, false).unwrap();
        assert!(result.contains("const email = record.email;"), "{result}");
        assert!(result.contains("const role = email;"), "{result}");
        assert!(result.contains("return role;"), "{result}");
    }

    #[test]
    fn compile_source_cond_expression() {
        let path = Path::new("surface.lykn");
        let source = r#"
(func role-label :args (:string role) :body
  (cond
    ((= role "admin") "Admin")
    (:else "User")))
"#;
        let result = compile_source(source, Some(path), false, false).unwrap();
        assert!(result.contains("if (role === \"admin\")"), "{result}");
        assert!(result.contains("return \"Admin\";"), "{result}");
        assert!(result.contains("return \"User\";"), "{result}");
    }

    #[test]
    fn compile_source_rejects_cond_expression_without_else() {
        let path = Path::new("surface.lykn");
        let source = "(bind label (cond ((= role \"admin\") \"Admin\")))";
        let result = compile_source(source, Some(path), false, false);
        assert!(
            result.is_err(),
            "cond in bind value without :else must reject"
        );
        let msg = result.unwrap_err().to_string();
        assert!(
            msg.contains("cond in expression position requires an :else clause"),
            "expected cond expression diagnostic, got: {msg}"
        );
    }

    #[test]
    fn compile_source_allows_bound_fn_head_call() {
        let path = Path::new("surface.lykn");
        let source = "(bind fn (=> (x) x))\n(bind _y (fn 1))";
        let result = compile_source(source, Some(path), false, false).unwrap();
        assert!(
            result.contains("const _y = fn(1);"),
            "bound fn head should remain an ordinary value call: {result}"
        );
    }
}
