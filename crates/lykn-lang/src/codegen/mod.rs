//! Pure-Rust JavaScript code generation from kernel `SExpr` forms.
//!
//! This module replaces the previous JSON-serialise-then-Deno pipeline with a
//! direct `SExpr` → JavaScript-text emitter. Zero external dependencies.
//!
//! # Usage
//!
//! ```rust
//! use lykn_lang::codegen::emit_module_js;
//! use lykn_lang::ast::sexpr::SExpr;
//! use lykn_lang::reader::source_loc::Span;
//!
//! let forms = vec![
//!     SExpr::List {
//!         values: vec![
//!             SExpr::atom("const", Span::default()),
//!             SExpr::atom("x", Span::default()),
//!             SExpr::Number { value: 1.0, span: Span::default() },
//!         ],
//!         span: Span::default(),
//!     },
//! ];
//! let js = emit_module_js(&forms).unwrap();
//! assert_eq!(js, "const x = 1;\n");
//! ```

pub mod emit;
pub mod format;
mod host_invocation;
pub mod icu;
pub mod names;
pub mod precedence;

use crate::ast::sexpr::SExpr;
use crate::error::LyknError;

use emit::emit_statement;
use format::JsWriter;

/// Emit a module (list of kernel forms) as JavaScript source text.
///
/// Each top-level form is emitted as a statement. The resulting string is
/// ready to be written to a `.js` file.
pub fn emit_module_js(forms: &[SExpr]) -> Result<String, LyknError> {
    emit_module_with_invocations(forms, &[])
}

pub(crate) fn emit_module_with_invocations(
    forms: &[SExpr],
    requests: &[host_invocation::InvocationRequest<'_>],
) -> Result<String, LyknError> {
    if let Some(diagnostic) =
        crate::protected_host::validate_program(forms, crate::protected_host::InputDialect::Kernel)
            .into_iter()
            .next()
    {
        return Err(LyknError::Codegen(diagnostic));
    }
    let invocation = host_invocation::prepare(forms, requests)?;
    let helper_name = invocation.helper_name;
    let slot = invocation.slot;
    let mut w = JsWriter::with_invocations(
        invocation.request_names,
        helper_name.clone().unwrap_or_default(),
    );
    let directives = forms
        .iter()
        .take_while(|form| matches!(form, SExpr::String { .. }))
        .count();
    for form in &forms[..directives] {
        emit_statement(&mut w, form)?;
    }
    if let Some(name) = helper_name.as_deref() {
        w.write(&format!(
            "function {name}(fn, receiver, argv) {{ return {slot}(fn, receiver, argv); }}"
        ));
        w.newline();
    }
    for form in &forms[directives..] {
        emit_statement(&mut w, form)?;
    }
    if !w.all_invocations_consumed() {
        return Err(host_invocation::invalid_request(
            "unconsumed invocation request",
        ));
    }
    Ok(w.finish())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::reader::source_loc::Span;
    use std::fs;
    use std::path::PathBuf;

    fn s() -> Span {
        Span::default()
    }

    fn atom(v: &str) -> SExpr {
        SExpr::atom(v.to_string(), s())
    }

    fn num(v: f64) -> SExpr {
        SExpr::Number {
            value: v,
            span: s(),
        }
    }

    fn str_lit(v: &str) -> SExpr {
        SExpr::String {
            value: v.to_string(),
            span: s(),
        }
    }

    fn list(items: Vec<SExpr>) -> SExpr {
        SExpr::List {
            values: items,
            span: s(),
        }
    }

    #[test]
    fn test_emit_module_js_empty() {
        assert_eq!(emit_module_js(&[]).unwrap(), "");
    }

    #[test]
    fn test_emit_module_js_single_declaration() {
        let forms = vec![list(vec![atom("const"), atom("x"), num(1.0)])];
        assert_eq!(emit_module_js(&forms).unwrap(), "const x = 1;\n");
    }

    #[test]
    fn test_emit_module_js_multi_form_program() {
        let import = list(vec![
            atom("import"),
            str_lit("./utils.js"),
            list(vec![atom("add"), atom("sub")]),
        ]);
        let constant = list(vec![
            atom("const"),
            atom("result"),
            list(vec![atom("add"), num(1.0), num(2.0)]),
        ]);
        let export = list(vec![atom("export"), atom("default"), atom("result")]);

        let forms = vec![import, constant, export];
        let js = emit_module_js(&forms).unwrap();

        assert!(js.contains("import {add, sub} from \"./utils.js\";"));
        assert!(js.contains("const result = add(1, 2);"));
        assert!(js.contains("export default result;"));
    }

    #[test]
    fn test_emit_module_js_function_and_call() {
        let func = list(vec![
            atom("function"),
            atom("greet"),
            list(vec![atom("name")]),
            list(vec![
                atom("return"),
                list(vec![
                    atom("template"),
                    str_lit("Hello, "),
                    atom("name"),
                    str_lit("!"),
                ]),
            ]),
        ]);
        let call = list(vec![atom("greet"), str_lit("world")]);

        let forms = vec![func, call];
        let js = emit_module_js(&forms).unwrap();

        assert!(js.contains("function greet(name)"));
        assert!(js.contains("return `Hello, ${name}!`"));
        assert!(js.contains("greet(\"world\");"));
    }

    #[test]
    fn test_emit_module_js_class() {
        let ctor = list(vec![
            atom("constructor"),
            list(vec![atom("x")]),
            list(vec![atom("="), atom("this:x"), atom("x")]),
        ]);
        let method = list(vec![
            atom("get-x"),
            list(vec![]),
            list(vec![atom("return"), atom("this:x")]),
        ]);
        let cls = list(vec![
            atom("class"),
            atom("Point"),
            list(vec![]),
            ctor,
            method,
        ]);

        let forms = vec![cls];
        let js = emit_module_js(&forms).unwrap();

        assert!(js.contains("class Point {"));
        assert!(js.contains("constructor(x)"));
        assert!(js.contains("this.x = x"));
        assert!(js.contains("getX()"));
        assert!(js.contains("return this.x"));
    }

    #[test]
    fn private_host_invocation_is_lazy_backend_and_uses_exact_node() {
        let call = list(vec![atom("saved"), atom("receiver"), atom("argv")]);
        let forms = vec![str_lit("use strict"), call];
        let request = host_invocation::InvocationRequest {
            id: crate::protected_host::IntrinsicId::ReflectApply,
            anchor: &forms[1],
        };
        let js = emit_module_with_invocations(&forms, &[request]).unwrap();
        assert_eq!(
            js,
            "\"use strict\";\nfunction lyknHostReflectApply0(fn, receiver, argv) { return Reflect.apply(fn, receiver, argv); }\nlyknHostReflectApply0(saved, receiver, argv);\n"
        );
    }

    #[test]
    fn private_host_invocation_declines_module_reflect_binding() {
        let call = list(vec![atom("saved"), atom("receiver"), atom("argv")]);
        let forms = vec![
            list(vec![atom("const"), atom("Reflect"), atom("local")]),
            call,
        ];
        let request = host_invocation::InvocationRequest {
            id: crate::protected_host::IntrinsicId::ReflectApply,
            anchor: &forms[1],
        };
        let error = emit_module_with_invocations(&forms, &[request]).unwrap_err();
        assert!(error.to_string().contains("module Reflect binding"));
    }

    #[test]
    fn private_host_invocation_requires_stable_atoms_and_owned_anchor() {
        let nested = list(vec![
            atom("saved"),
            list(vec![atom("receiver")]),
            atom("argv"),
        ]);
        let nested_forms = vec![nested];
        let nested_request = host_invocation::InvocationRequest {
            id: crate::protected_host::IntrinsicId::ReflectApply,
            anchor: &nested_forms[0],
        };
        assert!(emit_module_with_invocations(&nested_forms, &[nested_request]).is_err());

        let member = list(vec![atom("saved"), atom("receiver:method"), atom("argv")]);
        let member_forms = vec![member];
        let member_request = host_invocation::InvocationRequest {
            id: crate::protected_host::IntrinsicId::ReflectApply,
            anchor: &member_forms[0],
        };
        assert!(emit_module_with_invocations(&member_forms, &[member_request]).is_err());

        for invalid in ["", "this", "true", "null", "super"] {
            let call = list(vec![atom("saved"), atom(invalid), atom("argv")]);
            let forms = vec![call];
            let request = host_invocation::InvocationRequest {
                id: crate::protected_host::IntrinsicId::ReflectApply,
                anchor: &forms[0],
            };
            assert!(emit_module_with_invocations(&forms, &[request]).is_err());
        }

        let call = list(vec![atom("saved"), atom("undefined"), atom("argv")]);
        let forms = vec![call.clone()];
        let orphan = host_invocation::InvocationRequest {
            id: crate::protected_host::IntrinsicId::ReflectApply,
            anchor: &call,
        };
        assert!(emit_module_with_invocations(&forms, &[orphan]).is_err());

        let call = list(vec![atom("saved"), atom("undefined"), atom("argv")]);
        let forms = vec![call];
        let request = host_invocation::InvocationRequest {
            id: crate::protected_host::IntrinsicId::ReflectApply,
            anchor: &forms[0],
        };
        assert!(emit_module_with_invocations(&forms, &[request]).is_ok());
    }

    #[test]
    fn private_host_invocation_uses_module_binding_roles() {
        let rejects = [
            "(const Reflect local)",
            "(import \"./remote.js\" ((alias apply Reflect)))",
            "(export (function Reflect () (return 1)))",
            "(export default (function Reflect () (return 1)))",
            "(export (async (function Reflect () (return 1))))",
            "(block (var Reflect 1))",
        ];
        for source in rejects {
            assert!(
                crate::protected_host::invocation_unavailable_for_reflect(&fixture_forms(source)),
                "expected module Reflect binding in {source}"
            );
        }
        let allowed = [
            "(export \"./remote.js\" (names Reflect))",
            "(function local (Reflect) (saved receiver argv))",
        ];
        for source in allowed {
            assert!(
                !crate::protected_host::invocation_unavailable_for_reflect(&fixture_forms(source)),
                "external or nested name must not bind module Reflect: {source}"
            );
        }
    }

    fn fixture_forms(source: &str) -> Vec<SExpr> {
        crate::reader::read(source).unwrap()
    }

    fn find_saved_call(node: &SExpr) -> Option<&SExpr> {
        if let Some(values) = node.as_list() {
            if values.len() == 3
                && values[0].as_atom() == Some("saved")
                && values[1].as_atom() == Some("receiver")
                && values[2].as_atom() == Some("argv")
            {
                return Some(node);
            }
            for child in values {
                if let Some(found) = find_saved_call(child) {
                    return Some(found);
                }
            }
        } else if let SExpr::Cons { car, cdr, .. } = node {
            return find_saved_call(car).or_else(|| find_saved_call(cdr));
        }
        None
    }

    fn native_fixture_source(name: &str) -> &'static str {
        match name {
            "absent" => {
                include_str!("../../../../test/fixtures/lazy-protected-invocation/absent.lisp")
            }
            "provider" => {
                include_str!("../../../../test/fixtures/lazy-protected-invocation/provider.lisp")
            }
            "shaken-entry" => include_str!(
                "../../../../test/fixtures/lazy-protected-invocation/shaken-entry.lisp"
            ),
            "live-entry" => {
                include_str!("../../../../test/fixtures/lazy-protected-invocation/live-entry.lisp")
            }
            "retained-observer" => include_str!(
                "../../../../test/fixtures/lazy-protected-invocation/retained-observer.lisp"
            ),
            _ => unreachable!(),
        }
    }

    fn compile_provider_fixture() -> String {
        let forms = fixture_forms(native_fixture_source("provider"));
        let anchor = forms.iter().find_map(find_saved_call).unwrap();
        let request = host_invocation::InvocationRequest {
            id: crate::protected_host::IntrinsicId::ReflectApply,
            anchor,
        };
        emit_module_with_invocations(&forms, &[request]).unwrap()
    }

    fn compile_collision_fixture() -> String {
        let forms = fixture_forms(include_str!(
            "../../../../test/fixtures/lazy-protected-invocation/collision.lisp"
        ));
        let anchor = forms.iter().find_map(find_saved_call).unwrap();
        let request = host_invocation::InvocationRequest {
            id: crate::protected_host::IntrinsicId::ReflectApply,
            anchor,
        };
        emit_module_with_invocations(&forms, &[request]).unwrap()
    }

    fn write_fixture(root: &std::path::Path, filename: &str, contents: &str) {
        fs::create_dir_all(root).unwrap();
        fs::write(root.join(filename), contents).unwrap();
    }

    #[test]
    fn private_host_invocation_materializes_four_native_proof_inputs() {
        let (evidence_root, _temporary) = match std::env::var_os("LYKN_INTRINSIC_EVIDENCE_DIR") {
            Some(path) => (PathBuf::from(path), None),
            None => {
                let temporary = tempfile::tempdir().unwrap();
                (temporary.path().to_path_buf(), Some(temporary))
            }
        };
        let root = evidence_root.join("native");

        let absent = emit_module_js(&fixture_forms(native_fixture_source("absent"))).unwrap();
        assert!(!absent.contains("function lyknHostReflectApply"));
        assert!(!absent.contains("Reflect.apply"));
        write_fixture(&root.join("absent"), "absent.js", &absent);

        let provider = compile_provider_fixture();
        assert!(provider.contains("function lyknHostReflectApply2"));
        assert!(provider.contains("lyknHostReflectApply2(saved, receiver, argv)"));
        let shaken_entry =
            emit_module_js(&fixture_forms(native_fixture_source("shaken-entry"))).unwrap();
        write_fixture(&root.join("shaken"), "provider.js", &provider);
        write_fixture(&root.join("shaken"), "entry.js", &shaken_entry);

        write_fixture(&root.join("retained"), "provider.js", &provider);
        let observer =
            emit_module_js(&fixture_forms(native_fixture_source("retained-observer"))).unwrap();
        write_fixture(&root.join("retained"), "observer.js", &observer);

        let live_entry =
            emit_module_js(&fixture_forms(native_fixture_source("live-entry"))).unwrap();
        write_fixture(&root.join("live"), "provider.js", &provider);
        write_fixture(&root.join("live"), "entry.js", &live_entry);
        assert!(live_entry.contains("invoke("));
        assert!(live_entry.contains("function*"));

        let collision = compile_collision_fixture();
        assert!(collision.contains("function lyknHostReflectApply2(fn, receiver, argv)"));
        assert!(collision.contains("lyknHostReflectApply1"));
    }
}
