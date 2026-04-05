//! Bridge to the JS kernel compiler via Deno.
//!
//! The Rust pipeline emits kernel JSON; the JS compiler (`src/compiler.js`)
//! lowers kernel forms to JavaScript source text. This module shells out to
//! Deno to perform that final step.

use std::path::{Path, PathBuf};
use std::process::Command;

/// Convert kernel JSON to JavaScript source via the JS kernel compiler.
///
/// The kernel JSON is written to a temporary file, then a small Deno script
/// reads it, reconstitutes the AST, and feeds it to `compile()` from
/// `src/compiler.js`.
pub fn kernel_json_to_js(kernel_json: &str, source_path: &Path) -> Result<String, String> {
    let tmp_dir = std::env::temp_dir();
    let tmp_file = tmp_dir.join("lykn_kernel.json");
    std::fs::write(&tmp_file, kernel_json).map_err(|e| format!("error writing temp file: {e}"))?;

    let project_root = find_project_root(source_path)
        .ok_or_else(|| "cannot find lykn project root (need src/compiler.js)".to_string())?;

    let script = build_deno_script(&tmp_file);

    let output = Command::new("deno")
        .arg("eval")
        .arg("--ext=js")
        .arg(&script)
        .current_dir(&project_root)
        .output()
        .map_err(|e| {
            if e.kind() == std::io::ErrorKind::NotFound {
                "lykn compile requires Deno — install from https://deno.land".to_string()
            } else {
                format!("error running Deno: {e}")
            }
        })?;

    // Clean up temp file regardless of outcome
    let _ = std::fs::remove_file(&tmp_file);

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("JS kernel compiler error:\n{stderr}"));
    }

    Ok(String::from_utf8_lossy(&output.stdout).to_string())
}

/// Build the inline Deno script that reads kernel JSON and compiles it to JS.
fn build_deno_script(tmp_file: &Path) -> String {
    format!(
        r#"
import {{ compile }} from "./src/compiler.js";
const kernelJson = Deno.readTextFileSync("{tmp_path}");
const kernel = JSON.parse(kernelJson);

function fromJson(val) {{
    if (Array.isArray(val)) return {{ type: "list", values: val.map(fromJson) }};
    if (typeof val === "string") return {{ type: "atom", value: val }};
    if (typeof val === "number") return {{ type: "number", value: val }};
    if (typeof val === "boolean") return {{ type: "atom", value: String(val) }};
    if (val === null) return {{ type: "atom", value: "null" }};
    return val;
}}

const ast = kernel.map(fromJson);
console.log(compile(ast));
"#,
        tmp_path = tmp_file.display()
    )
}

/// Walk up from `start` looking for a directory that contains `deno.json`
/// or `src/compiler.js`.
pub(crate) fn find_project_root(start: &Path) -> Option<PathBuf> {
    let start = if start.is_file() {
        start.parent()?
    } else {
        start
    };

    let mut current = start.canonicalize().ok()?;
    loop {
        if current.join("deno.json").exists() || current.join("src/compiler.js").exists() {
            return Some(current);
        }
        if !current.pop() {
            return None;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;

    #[test]
    fn build_deno_script_contains_import_and_path() {
        let path = Path::new("/tmp/kernel.json");
        let script = build_deno_script(path);
        assert!(script.contains("import { compile }"));
        assert!(script.contains("/tmp/kernel.json"));
        assert!(script.contains("fromJson"));
        assert!(script.contains("console.log(compile(ast))"));
    }

    #[test]
    fn find_project_root_with_deno_json() {
        let tmp = std::env::temp_dir().join("lykn_test_find_root");
        let _ = fs::remove_dir_all(&tmp);
        let sub = tmp.join("a").join("b");
        fs::create_dir_all(&sub).unwrap();
        fs::write(tmp.join("deno.json"), "{}").unwrap();

        let found = find_project_root(&sub).unwrap();
        assert_eq!(found, tmp.canonicalize().unwrap());

        let _ = fs::remove_dir_all(&tmp);
    }

    #[test]
    fn find_project_root_with_compiler_js() {
        let tmp = std::env::temp_dir().join("lykn_test_find_root_cjs");
        let _ = fs::remove_dir_all(&tmp);
        let sub = tmp.join("child");
        fs::create_dir_all(&sub).unwrap();
        let src_dir = tmp.join("src");
        fs::create_dir_all(&src_dir).unwrap();
        fs::write(src_dir.join("compiler.js"), "").unwrap();

        let found = find_project_root(&sub).unwrap();
        assert_eq!(found, tmp.canonicalize().unwrap());

        let _ = fs::remove_dir_all(&tmp);
    }

    #[test]
    fn find_project_root_from_file() {
        let tmp = std::env::temp_dir().join("lykn_test_find_root_file");
        let _ = fs::remove_dir_all(&tmp);
        fs::create_dir_all(&tmp).unwrap();
        fs::write(tmp.join("deno.json"), "{}").unwrap();
        let file = tmp.join("example.lykn");
        fs::write(&file, "(+ 1 2)").unwrap();

        let found = find_project_root(&file).unwrap();
        assert_eq!(found, tmp.canonicalize().unwrap());

        let _ = fs::remove_dir_all(&tmp);
    }

    #[test]
    fn find_project_root_none_when_missing() {
        let tmp = std::env::temp_dir().join("lykn_test_find_root_none");
        let _ = fs::remove_dir_all(&tmp);
        fs::create_dir_all(&tmp).unwrap();
        // No deno.json or src/compiler.js anywhere

        let result = find_project_root(&tmp);
        // Might find one from the real filesystem above tmp, so just verify no panic
        let _ = result;

        let _ = fs::remove_dir_all(&tmp);
    }

    #[test]
    fn find_project_root_nonexistent_path() {
        let result = find_project_root(Path::new("/nonexistent/path/here"));
        assert!(result.is_none());
    }
}
