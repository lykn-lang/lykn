use std::fs;
use std::path::PathBuf;
use std::process::{Command, Output};

use tempfile::TempDir;

fn cli() -> Command {
    Command::new(env!("CARGO_BIN_EXE_lykn"))
}
fn root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../..")
}
fn output(command: &mut Command) -> Output {
    command.output().expect("start product command")
}

#[test]
fn actual_lykn_lyk_check_compile_strip_and_kernel_json_compiler_consumer() {
    let temp = TempDir::new().expect("temporary source project");
    for ext in ["lykn", "lyk"] {
        let source = "(func collide :args (:number result__gensym0) :returns :number :body 7)\n(func pick\n (:args (:number args) :returns :number :body args)\n (:args (:string args) :returns :string :body args))\n(console:log (collide 99) (pick 7) (pick \"ok\"))\n(some-> (await (Promise:resolve await__gensym0.child)) (+ 1) (console:log))\n(some-> 7 (+ box[t__gensym0]) (console:log))\n(some-> (await (Promise:resolve await\\u005f\\u005fgensym0.child)) (+ 1) (console:log))";
        let file = temp.path().join(format!("main.{ext}"));
        fs::write(&file, source).unwrap();
        let checked = output(cli().current_dir(temp.path()).arg("check").arg(&file));
        eprintln!(
            "HYGIENE_CHECK ext={ext} status={:?} stdout={:?} stderr={:?}",
            checked.status.code(),
            String::from_utf8_lossy(&checked.stdout),
            String::from_utf8_lossy(&checked.stderr)
        );
        assert!(
            checked.status.success(),
            "{ext} check: {}",
            String::from_utf8_lossy(&checked.stderr)
        );
        for strip in [false, true] {
            let js_path = temp.path().join(format!("out-{strip}.mjs"));
            let mut compile = cli();
            compile.current_dir(temp.path()).arg("compile").arg(&file);
            if strip {
                compile.arg("--strip-assertions");
            }
            let compiled = output(compile.arg("-o").arg(&js_path));
            let js = fs::read_to_string(&js_path).unwrap_or_default();
            eprintln!(
                "HYGIENE_COMPILE ext={ext} strip={strip} status={:?} stderr={:?} generated={js:?}",
                compiled.status.code(),
                String::from_utf8_lossy(&compiled.stderr)
            );
            assert!(
                compiled.status.success(),
                "compile: {}",
                String::from_utf8_lossy(&compiled.stderr)
            );
            // The baseline fixture can legitimately produce an unused typed
            // parameter warning; it is neither a runtime failure nor a
            // reason to weaken the value oracle.
            let module = format!(
                "globalThis.await__gensym0 = {{child: 7}}; globalThis.t__gensym0 = 99; globalThis.box = {{99: 5, 7: 100}}; await import('file://{}')",
                js_path.display()
            );
            let runtime = output(Command::new("deno").current_dir(root()).args([
                "eval",
                "--config",
                "project.json",
                "--ext=js",
                &module,
            ]));
            eprintln!(
                "HYGIENE_FILE_RUNTIME ext={ext} strip={strip} status={:?} stdout={:?} stderr={:?}",
                runtime.status.code(),
                String::from_utf8_lossy(&runtime.stdout),
                String::from_utf8_lossy(&runtime.stderr)
            );
            assert!(
                runtime.status.success(),
                "runtime: {}\n{js}",
                String::from_utf8_lossy(&runtime.stderr)
            );
            assert_eq!(runtime.stdout, b"7 7 ok\n8\n12\n8\n");
            let mut json_command = cli();
            json_command
                .current_dir(temp.path())
                .arg("compile")
                .arg(&file);
            if strip {
                json_command.arg("--strip-assertions");
            }
            let json = output(json_command.arg("--kernel-json"));
            assert!(
                json.status.success(),
                "JSON compile: {}",
                String::from_utf8_lossy(&json.stderr)
            );
            let kernel_json = String::from_utf8(json.stdout).expect("CLI JSON is UTF-8");
            let encoded = serde_json::to_string(&kernel_json).unwrap();
            let script = format!(
                "import {{ compile }} from \"./packages/lang/compiler.js\";\nconst ast = JSON.parse({encoded});\nconst js = compile(ast);\nglobalThis.await__gensym0 = {{child: 7}}; globalThis.t__gensym0 = 99; globalThis.box = {{99: 5, 7: 100}};\nawait import(`data:text/javascript;base64,${{btoa(js)}}`);"
            );
            let consumed = output(Command::new("deno").current_dir(root()).args([
                "eval",
                "--config",
                "project.json",
                "--ext=js",
                &script,
            ]));
            eprintln!(
                "HYGIENE_JSON_CONSUMER ext={ext} strip={strip} status={:?} stdout={:?} stderr={:?}",
                consumed.status.code(),
                String::from_utf8_lossy(&consumed.stdout),
                String::from_utf8_lossy(&consumed.stderr)
            );
            assert!(
                consumed.status.success(),
                "actual JS compiler JSON consumer: {}",
                String::from_utf8_lossy(&consumed.stderr)
            );
            assert_eq!(consumed.stdout, b"7 7 ok\n8\n12\n8\n");
        }
    }
}

#[test]
fn actual_package_build_keeps_source_exports_and_overloaded_calls() {
    let temp = TempDir::new().expect("temporary package project");
    let package = temp.path().join("packages/hygiene");
    fs::create_dir_all(&package).expect("create package source");
    fs::write(
        temp.path().join("project.json"),
        r#"{"workspace":["./packages/hygiene"],"imports":{}}"#,
    )
    .unwrap();
    fs::write(package.join("deno.json"), r#"{"name":"@fixture/hygiene","version":"0.0.1","exports":"./mod.js","lykn":{"kind":"runtime","emitDts":true}}"#).unwrap();
    fs::write(package.join("mod.lykn"), "(func pick (:args (:number args) :returns :number :body args) (:args (:string args) :returns :string :body args))\n(exports pick)\n").unwrap();
    let built = output(cli().current_dir(temp.path()).arg("build"));
    eprintln!(
        "HYGIENE_PACKAGE_BUILD status={:?} stdout={:?} stderr={:?}",
        built.status.code(),
        String::from_utf8_lossy(&built.stdout),
        String::from_utf8_lossy(&built.stderr)
    );
    assert!(
        built.status.success(),
        "build: {}",
        String::from_utf8_lossy(&built.stderr)
    );
    let js_path = temp.path().join("target/lykn/build/hygiene/mod.js");
    let dts_path = temp.path().join("target/lykn/build/hygiene/mod.d.ts");
    let js = fs::read_to_string(&js_path).expect("built JavaScript");
    let dts = fs::read_to_string(&dts_path).expect("built declarations");
    assert_eq!(
        dts.matches("args: number").count(),
        1,
        "number overload keeps its source argument: {dts}"
    );
    assert_eq!(
        dts.matches("args: string").count(),
        1,
        "string overload keeps its source argument: {dts}"
    );
    assert!(
        !dts.contains("args__gensym"),
        "private dispatch storage is not public: {dts}"
    );
    assert!(
        !js.contains("export {args__gensym"),
        "generated local is not an export: {js}"
    );
    let runner = temp.path().join("consume.mjs");
    fs::write(&runner, "const api = await import(\"./target/lykn/build/hygiene/mod.js\");\nconsole.log(Object.keys(api).sort().join(\",\"));\nconsole.log(api.pick(7), api.pick(\"ok\"));\n").unwrap();
    let runtime = output(
        Command::new("deno")
            .current_dir(temp.path())
            .args([
                "run",
                "--no-config",
                "--no-remote",
                "--cached-only",
                "--no-npm",
                "--deny-net",
                "--no-prompt",
            ])
            .arg(runner),
    );
    eprintln!(
        "HYGIENE_PACKAGE_RUNTIME status={:?} stdout={:?} stderr={:?}",
        runtime.status.code(),
        String::from_utf8_lossy(&runtime.stdout),
        String::from_utf8_lossy(&runtime.stderr)
    );
    assert!(
        runtime.status.success(),
        "package runtime: {}\n{js}",
        String::from_utf8_lossy(&runtime.stderr)
    );
    assert_eq!(runtime.stdout, b"pick\n7 ok\n");
}
