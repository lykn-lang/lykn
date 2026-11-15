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

fn assert_keyword_collision_cell(head: &str, call_step: bool, ext: &str, strip: bool) {
    let temp = TempDir::new().expect("fresh collision source project");
    let null_safe = head.starts_with("some-");
    let index = if null_safe {
        "t__gensym0"
    } else {
        "result__gensym0"
    };
    let step = if call_step {
        format!("(:child[{index}])")
    } else {
        format!(":child[{index}]")
    };
    let source = if null_safe {
        format!(
            "(set-symbol! globalThis \"t__gensym0\" 0)\n(console:log ({head} (obj :child (array (fn () 7))) {step}))\n"
        )
    } else {
        format!(
            "(set-symbol! globalThis \"result__gensym0\" 0)\n(func pick :args () :returns :number :body ({head} (obj :child (array (fn () 7))) {step}))\n(console:log (pick))\n"
        )
    };
    let file = temp.path().join(format!("main.{ext}"));
    fs::write(&file, source).expect("write keyword collision Source");
    let js_path = temp.path().join("out.mjs");
    let mut compile = cli();
    compile.current_dir(temp.path()).arg("compile").arg(&file);
    if strip {
        compile.arg("--strip-assertions");
    }
    let compiled = output(compile.arg("-o").arg(&js_path));
    let js = fs::read_to_string(&js_path).expect("compiled keyword collision module");
    eprintln!(
        "NATIVE_KEYWORD_COMPILE head={head} call_step={call_step} ext={ext} strip={strip} status={:?} stdout={:?} stderr={:?} generated={js:?}",
        compiled.status.code(),
        String::from_utf8_lossy(&compiled.stdout),
        String::from_utf8_lossy(&compiled.stderr)
    );
    assert!(
        compiled.status.success(),
        "compile {head}/{call_step}/{ext}/{strip}: {}",
        String::from_utf8_lossy(&compiled.stderr)
    );
    assert!(
        js.contains(&format!("child[{index}]")),
        "foreign computed member reference changed: {js}"
    );
    if null_safe {
        assert!(js.contains("const t__gensym1"), "{js}");
        assert!(!js.contains("const t__gensym0 ="), "{js}");
    } else if !strip {
        assert!(js.contains("const result__gensym1"), "{js}");
        assert!(!js.contains("const result__gensym0 ="), "{js}");
    }

    let runtime = output(
        Command::new("deno")
            .current_dir(root())
            .args([
                "run",
                "--no-config",
                "--no-remote",
                "--cached-only",
                "--no-npm",
                "--deny-net",
                "--no-prompt",
            ])
            .arg(&js_path),
    );
    eprintln!(
        "NATIVE_KEYWORD_RUNTIME head={head} call_step={call_step} ext={ext} strip={strip} status={:?} stdout={:?} stderr={:?}",
        runtime.status.code(),
        String::from_utf8_lossy(&runtime.stdout),
        String::from_utf8_lossy(&runtime.stderr)
    );
    assert!(
        runtime.status.success(),
        "runtime {head}/{call_step}/{ext}/{strip}: {}\n{js}",
        String::from_utf8_lossy(&runtime.stderr)
    );
    assert_eq!(runtime.stdout, b"7\n");
    assert!(runtime.stderr.is_empty());
}

fn compile_fixture(temp: &TempDir, source: &str, stem: &str) -> (PathBuf, String) {
    let file = temp.path().join(format!("{stem}.lykn"));
    fs::write(&file, source).expect("write focused Source fixture");
    let js_path = temp.path().join(format!("{stem}.mjs"));
    let compiled = output(
        cli()
            .current_dir(temp.path())
            .arg("compile")
            .arg(&file)
            .arg("-o")
            .arg(&js_path),
    );
    assert!(
        compiled.status.success(),
        "compile fixture: {}",
        String::from_utf8_lossy(&compiled.stderr)
    );
    let js = fs::read_to_string(&js_path).expect("compiled focused module");
    (js_path, js)
}

fn run_generated(path: &PathBuf) -> Output {
    output(
        Command::new("deno")
            .current_dir(root())
            .args([
                "run",
                "--no-config",
                "--no-remote",
                "--cached-only",
                "--no-npm",
                "--deny-net",
                "--no-prompt",
            ])
            .arg(path),
    )
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

#[test]
fn native_keyword_steps_avoid_enclosing_generated_names_in_32_fresh_cells() {
    for head in ["->", "->>", "some->", "some->>"] {
        for call_step in [false, true] {
            for ext in ["lykn", "lyk"] {
                for strip in [false, true] {
                    assert_keyword_collision_cell(head, call_step, ext, strip);
                }
            }
        }
    }
}

#[test]
fn escaped_keyword_alias_and_ordinary_atom_read_remain_live() {
    let temp = TempDir::new().expect("escaped keyword source project");
    let (escaped_path, escaped_js) = compile_fixture(
        &temp,
        "(set-symbol! globalThis \"t__gensym0\" 0)\n(console:log (some-> (obj :child (array (fn () 7))) :child[t\\u005f\\u005fgensym0]))\n",
        "escaped-keyword",
    );
    assert!(
        escaped_js.contains(r"child[t\u005f\u005fgensym0]"),
        "{escaped_js}"
    );
    assert!(escaped_js.contains("const t__gensym1"), "{escaped_js}");
    assert!(!escaped_js.contains("const t__gensym0 ="), "{escaped_js}");
    let escaped_runtime = run_generated(&escaped_path);
    assert!(escaped_runtime.status.success());
    assert_eq!(escaped_runtime.stdout, b"7\n");
    assert!(escaped_runtime.stderr.is_empty());

    let atom_temp = TempDir::new().expect("ordinary atom source project");
    let (atom_path, atom_js) = compile_fixture(
        &atom_temp,
        "(set-symbol! globalThis \"t__gensym0\" 7)\n(bind observed-index t__gensym0)\n(console:log observed-index)\n",
        "ordinary-atom",
    );
    assert!(atom_js.contains("t__gensym0"), "{atom_js}");
    let atom_runtime = run_generated(&atom_path);
    assert!(atom_runtime.status.success());
    assert_eq!(atom_runtime.stdout, b"7\n");
    assert!(atom_runtime.stderr.is_empty());
}

#[test]
fn native_threading_preserves_null_order_and_once_only_effects() {
    let null_temp = TempDir::new().expect("null-safe Source project");
    let (null_path, _) = compile_fixture(
        &null_temp,
        "(bind effect-count (cell 0))\n(func effect :args () :returns :number :body (swap! effect-count (fn (:number n) (+ n 1))))\n(console:log (some-> null (:child (effect))))\n(console:log (express effect-count))\n",
        "null-short-circuit",
    );
    let null_runtime = run_generated(&null_path);
    assert!(null_runtime.status.success());
    assert_eq!(null_runtime.stdout, b"null\n0\n");
    assert!(null_runtime.stderr.is_empty());

    let order_temp = TempDir::new().expect("thread-order Source project");
    let (order_path, _) = compile_fixture(
        &order_temp,
        "(console:log (-> 7 (- 100)) (->> 7 (- 100)))\n",
        "thread-order",
    );
    let order_runtime = run_generated(&order_path);
    assert!(order_runtime.status.success());
    assert_eq!(order_runtime.stdout, b"-93 93\n");
    assert!(order_runtime.stderr.is_empty());

    let effects_temp = TempDir::new().expect("keyword effect Source project");
    let (effects_path, _) = compile_fixture(
        &effects_temp,
        "(set-symbol! globalThis \"trace\" \"\")\n(func get-receiver :args () :returns :object :body (do (set-symbol! globalThis \"trace\" (+ globalThis:trace \"receiver,\")) (obj :child (fn (:number value) value))))\n(func get-argument :args () :returns :number :body (do (set-symbol! globalThis \"trace\" (+ globalThis:trace \"argument,\")) 3))\n(console:log (-> (get-receiver) (:child (get-argument))))\n(console:log globalThis:trace)\n",
        "keyword-once-only-effects",
    );
    let effects_runtime = run_generated(&effects_path);
    assert!(
        effects_runtime.status.success(),
        "{}",
        String::from_utf8_lossy(&effects_runtime.stderr)
    );
    assert_eq!(effects_runtime.stdout, b"3\nreceiver,argument,\n");
    assert!(effects_runtime.stderr.is_empty());
}

#[test]
fn native_kernel_json_keyword_collision_reaches_actual_public_compiler() {
    let temp = TempDir::new().expect("kernel JSON Source project");
    let file = temp.path().join("kernel-json.lykn");
    fs::write(
        &file,
        "(set-symbol! globalThis \"t__gensym0\" 0)\n(console:log (some-> (obj :child (array (fn () 7))) :child[t__gensym0]))\n",
    )
    .expect("write kernel JSON Source");
    let json = output(
        cli()
            .current_dir(temp.path())
            .arg("compile")
            .arg(&file)
            .arg("--kernel-json"),
    );
    assert!(
        json.status.success(),
        "kernel JSON compile: {}",
        String::from_utf8_lossy(&json.stderr)
    );
    let kernel_json = String::from_utf8(json.stdout).expect("CLI kernel JSON is UTF-8");
    let encoded = serde_json::to_string(&kernel_json).expect("serialize JSON for static client");
    let script = format!(
        "import {{ compile }} from \"./packages/lang/compiler.js\";\nconst kernel = JSON.parse({encoded});\nconst js = compile(kernel);\nif (!js.includes(\"child[t__gensym0]\") || !js.includes(\"const t__gensym1\") || js.includes(\"const t__gensym0 =\")) throw new Error(\"kernel consumer lost native keyword-name separation\");\nawait import(`data:text/javascript;base64,${{btoa(js)}}`);"
    );
    let consumed = output(Command::new("deno").current_dir(root()).args([
        "eval",
        "--config",
        "project.json",
        "--ext=js",
        &script,
    ]));
    eprintln!(
        "NATIVE_KEYWORD_JSON_CONSUMER status={:?} stdout={:?} stderr={:?}",
        consumed.status.code(),
        String::from_utf8_lossy(&consumed.stdout),
        String::from_utf8_lossy(&consumed.stderr)
    );
    assert!(
        consumed.status.success(),
        "actual JS compiler JSON consumer: {}",
        String::from_utf8_lossy(&consumed.stderr)
    );
    assert_eq!(consumed.stdout, b"7\n");
    assert!(consumed.stderr.is_empty());
}
