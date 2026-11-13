//! End-to-end integration tests.
//!
//! Tests the full pipeline: read -> expand -> classify -> analyze -> emit -> JSON.
//! Compares Rust and JS pipeline output to verify cross-compiler parity.
//! Requires `deno` to be installed. Tests are skipped if deno is not available.

use std::process::Command;

use lykn_lang::analysis;
use lykn_lang::classifier;
use lykn_lang::emitter;
use lykn_lang::reader;

fn deno_available() -> bool {
    Command::new("deno").arg("--version").output().is_ok()
}

/// Run lykn source through the Rust pipeline: read -> classify -> emit -> JSON.
fn rust_pipeline(source: &str) -> String {
    let sexprs = reader::read(source).expect("Rust reader failed");
    let forms = classifier::classify(&sexprs).expect("Rust classifier failed");
    let unit = analysis::analyze(forms).expect("Rust analysis failed");
    emitter::emit_json(&unit, false).unwrap()
}

/// Run lykn source through the JS pipeline via Deno.
fn js_pipeline(source: &str) -> String {
    let script = format!(
        r#"
import {{ read }} from "./packages/lang/reader.js";
import {{ expand, resetMacros, resetGensym }} from "./packages/lang/expander.js";
resetMacros();
resetGensym();
const source = `{source}`;
const expanded = expand(read(source));
function toJson(node) {{
    if (!node) return null;
    if (node.type === 'atom') return {{ type: "atom", value: node.value }};
    if (node.type === 'keyword') return {{ type: "string", value: node.value }};
    if (node.type === 'string') return {{ type: "string", value: node.value }};
    if (node.type === 'number') return {{ type: "number", value: node.value }};
    if (node.type === 'list') return {{ type: "list", values: node.values.map(toJson) }};
    if (typeof node === 'boolean') return {{ type: "atom", value: String(node) }};
    return null;
}}
const json = expanded.filter(x => x !== null).map(toJson);
console.log(JSON.stringify(json, null, 2));
"#,
        source = source.replace('`', "\\`").replace('$', "\\$")
    );

    let output = Command::new("deno")
        .arg("eval")
        .arg("--config")
        .arg("project.json")
        .arg("--ext=js")
        .arg(&script)
        .current_dir(env!("CARGO_MANIFEST_DIR").to_string() + "/../..")
        .output()
        .expect("failed to run deno");

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        panic!("JS pipeline failed:\n{stderr}");
    }

    String::from_utf8(output.stdout)
        .expect("invalid utf8")
        .trim()
        .to_string()
}

/// Parse JSON for structural comparison, ignoring whitespace differences.
fn normalize_json(json: &str) -> serde_json::Value {
    serde_json::from_str(json).unwrap_or_else(|e| panic!("Invalid JSON: {e}\n{json}"))
}

fn assert_host_reference_bindings(forms: &[serde_json::Value], expected: &[&str]) {
    let bindings = forms
        .iter()
        .filter_map(|form| {
            let values = form["values"].as_array()?;
            (values.first()?["value"] == "const")
                .then(|| values.get(1)?["value"].as_str())
                .flatten()
        })
        .collect::<Vec<_>>();
    assert_eq!(bindings, expected, "complete-unit support bindings");
}

macro_rules! e2e_test {
    ($name:ident, $source:expr) => {
        #[test]
        fn $name() {
            if !deno_available() {
                eprintln!("skipping E2E test: deno not available");
                return;
            }
            let rust_json = rust_pipeline($source);
            let js_json = js_pipeline($source);
            let rust_val = normalize_json(&rust_json);
            let js_val = normalize_json(&js_json);
            assert_eq!(
                rust_val, js_val,
                "Rust and JS pipelines differ!\nRust:\n{rust_json}\n\nJS:\n{js_json}"
            );
        }
    };
}

// --- Simple forms ---

e2e_test!(e2e_bind_number, "(bind x 42)");
e2e_test!(e2e_bind_string, r#"(bind name "Duncan")"#);
e2e_test!(e2e_obj, r#"(obj :name "Duncan" :age 42)"#);
e2e_test!(e2e_cell, "(cell 0)");
e2e_test!(e2e_thread_first, "(-> x f g)");
e2e_test!(e2e_thread_last, "(->> x (f a) (g b))");

// --- Multi-form programs (Rust-only — verify valid kernel JSON output) ---
// These produce structurally valid but not identical output to JS macros
// because the Rust emitter follows DD-20 spec directly while JS macros
// have implementation-specific patterns. Full parity is tracked as
// deferred work.

#[test]
fn e2e_contracts_produces_valid_kernel() {
    let json = rust_pipeline(
        "(func safe-divide :args (:number a :number b) :returns :number :pre (!== b 0) :body (/ a b))",
    );
    let val = normalize_json(&json);
    assert!(val.is_array());
    assert!(!val.as_array().unwrap().is_empty());
}

#[test]
fn e2e_cells_produces_valid_kernel() {
    let json = rust_pipeline("(bind counter (cell 0))\n(swap! counter (=> (n) (+ n 1)))");
    let val = normalize_json(&json);
    assert!(val.is_array());
    assert!(val.as_array().unwrap().len() >= 2);
}

#[test]
fn e2e_bind_obj_produces_valid_kernel() {
    let json = rust_pipeline(r#"(bind user (obj :name "Duncan" :age 42))"#);
    let val = normalize_json(&json);
    assert!(val.is_array());
}

#[test]
fn e2e_threading_produces_valid_kernel() {
    let json = rust_pipeline("(bind result (-> 1 (+ 2) (* 3)))");
    let val = normalize_json(&json);
    assert!(val.is_array());
}

// --- Kernel JSON output (Rust-only, no JS comparison) ---

#[test]
fn e2e_kernel_json_is_valid() {
    let json = rust_pipeline("(bind x 42)");
    let val: serde_json::Value = serde_json::from_str(&json).expect("kernel JSON should be valid");
    assert!(val.is_array(), "kernel JSON should be a top-level array");
}

#[test]
fn e2e_kernel_json_contracts() {
    let source = "(func safe-divide :args (:number a :number b) :returns :number :pre (!== b 0) :body (/ a b))";
    let json = rust_pipeline(source);
    let val: serde_json::Value = serde_json::from_str(&json).expect("kernel JSON should be valid");
    assert!(val.is_array());
    // The emitted kernel should contain at least one top-level form
    assert!(
        !val.as_array().unwrap().is_empty(),
        "kernel should not be empty for a func definition"
    );
}

#[test]
fn e2e_analysis_catches_errors() {
    // This tests that the analysis phase works when driven through the pipeline.
    // A well-formed expression should analyze without errors.
    let source = "(bind x 42)";
    let sexprs = reader::read(source).expect("read failed");
    let forms = classifier::classify(&sexprs).expect("classify failed");
    let result = analysis::analyze(forms);
    assert!(result.is_ok(), "simple bind should not produce errors");
}

// --- Export wrapping surface forms ---

// Note: export_func uses a Rust-only test because :returns generates
// gensym'd result variables that differ between JS and Rust compilers.
#[test]
fn e2e_export_func() {
    let json = rust_pipeline(
        "(export (func add :args (:number a :number b) :returns :number :body (+ a b)))",
    );
    let val = normalize_json(&json);
    // Should be [(export (function add ...))]
    let arr = val.as_array().expect("expected array");
    assert_eq!(arr.len(), 3);
    assert_host_reference_bindings(
        arr,
        &["lyknIntrinsicNumberIsNaN0", "lyknIntrinsicTypeError0"],
    );
    let export = arr
        .iter()
        .find(|form| form["values"][0]["value"] == "export")
        .expect("expected export form");
    let export_list = export["values"].as_array().expect("expected export list");
    assert_eq!(export_list[0]["value"], "export");
    let func_list = export_list[1]["values"]
        .as_array()
        .expect("expected function list");
    assert_eq!(func_list[0]["value"], "function");
    assert_eq!(func_list[1]["value"], "add");
}
#[test]
fn e2e_export_bind() {
    let source = r#"(export (bind VERSION "0.4.0"))"#;
    let json = rust_pipeline(source);
    let native_protocol = normalize_json(&json);
    let expected_protocol = serde_json::json!([
        {
            "type": "list",
            "values": [
                { "type": "atom", "value": "const" },
                { "type": "atom", "value": "VERSION" },
                { "type": "string", "value": "0.4.0" }
            ]
        },
        {
            "type": "list",
            "values": [
                { "type": "atom", "value": "export" },
                {
                    "type": "list",
                    "values": [
                        { "type": "atom", "value": "names" },
                        { "type": "atom", "value": "VERSION" }
                    ]
                }
            ]
        }
    ]);
    assert_eq!(
        native_protocol, expected_protocol,
        "native export protocol must contain only the declaration and names export"
    );

    let native_forms = native_protocol
        .as_array()
        .expect("native protocol is a form array")
        .iter()
        .map(lykn_lang::expander::env::protocol_json_to_sexpr)
        .collect::<Result<Vec<_>, _>>()
        .expect("native protocol forms read back");
    let native_js = lykn_lang::codegen::emit_module_js(&native_forms)
        .expect("native protocol generates an ESM module");

    let script = format!(
        r#"
import {{ lykn }} from "./packages/lang/mod.js";
const source = {};
const nativeSource = {};
const publicSource = lykn(source);
const native = await import(`data:text/javascript;charset=utf-8,${{encodeURIComponent(nativeSource)}}`);
const publicModule = await import(`data:text/javascript;charset=utf-8,${{encodeURIComponent(publicSource)}}`);
console.log(JSON.stringify({{
    native: {{ keys: Object.keys(native).sort(), value: native.VERSION }},
    public: {{ keys: Object.keys(publicModule).sort(), value: publicModule.VERSION }}
}}));
"#,
        serde_json::to_string(source).expect("source serializes as a JS string"),
        serde_json::to_string(&native_js).expect("native module serializes as a JS string"),
    );
    let output = Command::new("deno")
        .arg("eval")
        .arg("--config")
        .arg("project.json")
        .arg("--ext=js")
        .arg(script)
        .current_dir(env!("CARGO_MANIFEST_DIR").to_string() + "/../..")
        .output()
        .expect("Deno is required for native/public export runtime parity");
    assert!(
        output.status.success(),
        "Deno export runtime failed:\n{}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert_eq!(
        String::from_utf8(output.stdout).expect("Deno stdout is UTF-8"),
        r#"{"native":{"keys":["VERSION"],"value":"0.4.0"},"public":{"keys":["VERSION"],"value":"0.4.0"}}"#
            .to_string()
            + "\n"
    );
}
e2e_test!(
    e2e_export_func_destructured,
    "(export (func connect :args ((object :string host :number port (default :boolean ssl true))) :body (open-connection host port ssl)))"
);

// --- Async wrapping surface forms ---

#[test]
fn e2e_async_func() {
    let json = rust_pipeline(
        r#"(async (func fetch-user :args (:string id) :body (await (fetch (template "/api/users/" id)))))"#,
    );
    let val = normalize_json(&json);
    let arr = val.as_array().expect("expected array");
    assert_eq!(arr.len(), 2);
    assert_host_reference_bindings(arr, &["lyknIntrinsicTypeError0"]);
    let async_form = arr
        .iter()
        .find(|form| form["values"][0]["value"] == "async")
        .expect("expected async form");
    let async_list = async_form["values"]
        .as_array()
        .expect("expected async list");
    assert_eq!(async_list[0]["value"], "async");
    let func_list = async_list[1]["values"]
        .as_array()
        .expect("expected function list");
    assert_eq!(func_list[0]["value"], "function");
    assert_eq!(func_list[1]["value"], "fetch-user");
}

#[test]
fn e2e_export_async_func() {
    let json = rust_pipeline(
        r#"(export (async (func fetch-user :args (:string id) :body (await (fetch (template "/api/users/" id))))))"#,
    );
    let val = normalize_json(&json);
    let arr = val.as_array().expect("expected array");
    assert_eq!(arr.len(), 2);
    assert_host_reference_bindings(arr, &["lyknIntrinsicTypeError0"]);
    let export = arr
        .iter()
        .find(|form| form["values"][0]["value"] == "export")
        .expect("expected export form");
    let export_list = export["values"].as_array().expect("expected export list");
    assert_eq!(export_list[0]["value"], "export");
    let async_list = export_list[1]["values"]
        .as_array()
        .expect("expected async list");
    assert_eq!(async_list[0]["value"], "async");
    let func_list = async_list[1]["values"]
        .as_array()
        .expect("expected function list");
    assert_eq!(func_list[0]["value"], "function");
    assert_eq!(func_list[1]["value"], "fetch-user");
}
