use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};
use std::process::{Command, Output};

use tempfile::TempDir;

struct Case {
    name: &'static str,
    expected: &'static [u8],
}

const FIXTURES: &[Case] = &[
    Case {
        name: "while",
        expected: b"[1,11,2,12]\n",
    },
    Case {
        name: "do-while",
        expected: b"[100,21,101,22]\n",
    },
    Case {
        name: "match",
        expected: b"[[7,10],[\"guard\",\"fallback\"]]\n",
    },
    Case {
        name: "boundaries",
        expected: b"[4,6,[2]]\n",
    },
    Case {
        name: "if-arm-scope",
        expected: b"[101,14,15]\n",
    },
    Case {
        name: "if-declaration",
        expected: b"",
    },
    Case {
        name: "if-direct-transfers-literal",
        expected: b"[7,9,[0,2],4]\n",
    },
    Case {
        name: "if-direct-transfers",
        expected: b"[7,9,[0,2],4]\n",
    },
    Case {
        name: "statement-match-guards",
        expected: b"[\"subject\",\"literal-false\",2,\"chosen\",\"body\"]\n",
    },
    Case {
        name: "statement-match-return",
        expected: b"inside\n",
    },
    Case {
        name: "statement-match-loop",
        expected: b"[0,10,2,12]\n",
    },
    Case {
        name: "statement-match-exhaustion",
        expected: b"[\"guard\",\"match: no matching pattern\"]\n",
    },
    Case {
        name: "statement-match-preservation",
        expected: b"[[101,201,202,203,7,8],41,42]\n",
    },
    Case {
        name: "statement-match-protected-preservation",
        expected: b"[7,[\"fallback\",7]]\n",
    },
    Case {
        name: "match-clause-scope",
        expected: b"[11,22,14]\n",
    },
    Case {
        name: "match-structural-pattern-macros",
        expected: b"[7]\n",
    },
    Case {
        name: "original-match-reserved-role",
        expected: b"[11,22,14]\n",
    },
    Case {
        name: "original-match-kernel-object",
        expected: b"[7]\n",
    },
    Case {
        name: "bound-match-conditional-operand",
        expected: b"[7,8]\n",
    },
    Case {
        name: "nested-kernel-object-roles",
        expected: b"[11,11,7,9,6]\n",
    },
    Case {
        name: "return-consumed-match",
        expected: b"[\"inside\",\"normal\",[\"subject\",\"guard\",\"subject\",\"guard\"]]\n",
    },
    Case {
        name: "return-consumed-loop",
        expected: b"[\"done\",[1,\"skip\"]]\n",
    },
    Case {
        name: "return-consumed-guard-exhaustion",
        expected: b"[\"guard\",\"match: no matching pattern\"]\n",
    },
    Case {
        name: "return-consumed-macro-boundaries",
        expected: b"[\"inside\",[\"nested\"]]\n",
    },
    Case {
        name: "bind-consumed-early-return",
        expected: b"[\"early\",7,[\"body\",\"after\"]]\n",
    },
    Case {
        name: "bind-consumed-group-match",
        expected: b"[81,8,[\"match\",8]]\n",
    },
    Case {
        name: "bind-consumed-loop-transfer",
        expected: b"[0,2]\n",
    },
    Case {
        name: "bind-consumed-name-hygiene",
        expected: b"[[7,99,41],[\"result\"]]\n",
    },
    Case {
        name: "bind-consumed-native-typed",
        expected: b"[\"early\",9,[9]]\n",
    },
    Case {
        name: "completion-if-headers",
        expected: b"[80,81,7,8,[\"statement\",\"statement\",\"value\",\"statement\",\"value\",\"then\",\"after\",\"statement\",\"value\",\"else\",\"after\"]]\n",
    },
    Case {
        name: "completion-match-headers",
        expected: b"[80,81,82,83,84,[\"discarded\",\"discarded\",3,\"discarded\",3,\"discarded-fallback\",\"consumed\",\"discarded\",3,\"discarded-fallback\",\"consumed\",4,\"discarded\",3,\"discarded-fallback\",\"consumed\",4,\"consumed-fallback\"]]\n",
    },
    Case {
        name: "completion-logical-operands",
        expected: b"[7,[0,\"kept\"],[10,11],\"pure\",[\"first\",\"second\",0,\"kept\",\"first\",\"second\",0,\"kept\",\"last\",\"arg1\",\"arg2\"]]\n",
    },
    Case {
        name: "completion-nullish-operands",
        expected: b"[0,false,\"early\",\"early\",[\"left\",\"after\",\"left\",\"after\",\"left\",\"right\",\"left\",\"right\"]]\n",
    },
    Case {
        name: "ordered-lexical-bind-call",
        expected: b"[91,[\"old\",8],[\"earlier\",\"middle\",\"earlier\",\"middle\",\"later\",\"old\",\"after\"]]\n",
    },
    Case {
        name: "ordered-lexical-statement-call",
        expected: b"[90,91,[\"first\",\"middle\",\"first\",\"middle\",4,\"after\",\"first\",\"middle\",true]]\n",
    },
    Case {
        name: "computed-member-ordered-throws",
        expected: b"[[\"receiver\",8],[true,false,false],[false,true,false],93,[\"base\",\"key\",\"string\",\"getter\",\"first\",\"arg\",\"last\",\"call\",\"after\",\"base\",\"key\",\"string\",\"getter\",\"base\",\"key\",\"string\",\"getter\",\"first\",\"arg\",\"base\",\"key\"]]\n",
    },
    Case {
        name: "computed-member-no-prefix",
        expected: b"[[1,2,3],4]\n",
    },
    Case {
        name: "anonymous-completion-names",
        expected: b"[\"\",\"\",\"\",\"namedCallback\",\"\",\"\",\"\",\"\",\"bound \"]\n",
    },
    Case {
        name: "ordered-simple-assignment",
        expected: b"[95,[10,40],5,5,40,96,50,8,8,[\"key\",\"rhs\",\"key\",\"rhs\",\"string\",\"after\",\"statement-rhs\",\"statement-rhs\",\"statement-after\"]]\n",
    },
    Case {
        name: "ordered-literal-compound-assignment",
        expected: b"[91,[10,40],14,14,40,[\"get\",\"rhs\",\"get\",\"rhs\",[\"convert\",\"default\"],[\"set\",14],\"after\"]]\n",
    },
    Case {
        name: "ordinary-assignment-preservation",
        expected: b"[[2,5,6,5,6],[7,7]]\n",
    },
    Case {
        name: "ordered-argument-spread",
        expected: b"[[0,1,2,3],7,[true],[0,1,2,3],[0,1,2,3],7,[\"before\",\"iterator\",\"next0\",\"next1\",\"done\",\"late\",\"lexical\",\"before\",\"iterator\",\"next0\",\"next1\",\"done\",\"late\",\"before\",\"iterator\",\"next0\",\"next1\",\"getter\",\"before\",\"iterator\",\"next0\",\"next1\",\"done\",\"late\",[\"method\",\"receiver\"],\"key\",\"getter\",\"before\",\"operand\",\"iterator\",\"next0\",\"next1\",\"done\",\"late\",[\"method\",\"receiver\"]]]\n",
    },
    Case {
        name: "pure-argument-spread",
        expected: b"[1,2,3]\n",
    },
    Case {
        name: "seq-expression-contexts",
        expected: b"[false,9,[7],11,[\"once\",\"argument\",\"initializer\"]]\n",
    },
    Case {
        name: "adt-pattern-correctness",
        expected: b"[7,\"outer\",\"inner\",\"null\",\"missing\",\"literal\",\"safe\",\"false\",\"null\",\"undefined\",9,false,0,\"\",4,6,\"selected\",[\"match: no matching pattern\"],true,true,\"list\",\"safe\",\"bare\",null,false,false,null,\"number\",\"safe\",\"string\",7,\"wildcard\",\"safe\",\"safe\",[\"outer.value\",\"inner.value\",\"wrong.inner.value\"],8,\"wildcard\",[\"object.child\"],[5]]\n",
    },
    Case {
        name: "adt-pattern-macro-hygiene",
        expected: b"[[[[90,91],5,42]],[[90,91],6,42],[[90,91],7,42],[[90,91],8,42],[[90,91],9,42]]\n",
    },
    Case {
        name: "host-reference-shadowing",
        expected: b"[[\"TypeError\",\"checkNumber: arg 'value' expected number, got string\"],[\"TypeError\",\"checkArray: arg 'value' expected array, got number\"],[\"Error\",\"match: no matching pattern\"]]\n",
    },
];

fn fixture_path(name: &str) -> PathBuf {
    if name == "ordered-member-pure-colon-call" {
        return ordered_member_fixture_path("pure-colon-call");
    }
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../../test/fixtures/semantic-roles")
        .join(format!("{name}.lykn"))
}

fn evidence_root() -> Option<PathBuf> {
    let root = std::env::var_os("LYKN_SEMANTIC_ROLE_EVIDENCE_DIR").map(PathBuf::from)?;
    assert!(
        root.is_absolute(),
        "semantic-role evidence directory must be absolute"
    );
    Some(root)
}

fn save_receipt(name: &str, suffix: &str, bytes: &[u8]) {
    if let Some(root) = evidence_root() {
        let path = root.join(format!("{name}.{suffix}"));
        let mut file = fs::OpenOptions::new()
            .write(true)
            .create_new(true)
            .open(path)
            .expect("create unique semantic-role evidence receipt");
        file.write_all(bytes)
            .expect("write semantic-role evidence receipt");
    }
}

#[test]
fn native_owned_intrinsics_survive_module_shadowing() {
    run_positive(&FIXTURES[46]);
}

fn record_source(name: &str, source_path: &Path, source: &[u8]) {
    let locator = format!("source_path={source_path:?}\n");
    eprintln!("SEMANTIC_ROLE_SOURCE name={name} {locator}bytes={source:?}");
    save_receipt(name, "source.bin", source);
    save_receipt(name, "source-path.txt", locator.as_bytes());
}

fn record_command(name: &str, command: &Command) {
    let selected_env = [
        "DENO_DIR",
        "LYKN_TEST_DENO",
        "XDG_CACHE_HOME",
        "TMPDIR",
        "LYKN_SEMANTIC_ROLE_EVIDENCE_DIR",
    ]
    .map(|key| format!("{key}={:?}", std::env::var_os(key)))
    .join("\n");
    let env_overrides = command
        .get_envs()
        .map(|(key, value)| format!("{key:?}={value:?}"))
        .collect::<Vec<_>>()
        .join("\n");
    let description = format!(
        "program={:?}\nargs={:?}\ncwd={:?}\nenv_overrides=\n{}\nselected_inherited_env=\n{}\n",
        command.get_program(),
        command.get_args().collect::<Vec<_>>(),
        command.get_current_dir(),
        env_overrides,
        selected_env,
    );
    eprintln!("SEMANTIC_ROLE_COMMAND name={name}\n{description}");
    save_receipt(name, "command.txt", description.as_bytes());
}

fn record_output(name: &str, output: &Output) {
    let status = format!(
        "success={} code={:?}\n",
        output.status.success(),
        output.status.code()
    );
    eprintln!(
        "SEMANTIC_ROLE_OUTPUT name={name} {status}stdout={:?} stderr={:?}",
        output.stdout, output.stderr
    );
    save_receipt(name, "stdout.bin", &output.stdout);
    save_receipt(name, "stderr.bin", &output.stderr);
    save_receipt(name, "status.txt", status.as_bytes());
}

fn execute_recorded(
    name: &str,
    source_path: &Path,
    source: &[u8],
    command: &mut Command,
) -> Output {
    record_source(name, source_path, source);
    record_command(name, command);
    let output = command.output().expect("start lykn semantic-role process");
    record_output(name, &output);
    output
}

fn record_generated(name: &str, generated: Option<&[u8]>, dts: Option<&[u8]>) {
    let generated_status = format!("present={}\n", generated.is_some());
    let dts_status = format!("present={}\n", dts.is_some());
    eprintln!(
        "SEMANTIC_ROLE_ARTIFACTS name={name} generated={generated:?} generated_utf8={:?} dts={dts:?}",
        generated.map(String::from_utf8_lossy)
    );
    save_receipt(name, "generated-status.txt", generated_status.as_bytes());
    save_receipt(name, "dts-status.txt", dts_status.as_bytes());
    if let Some(generated) = generated {
        save_receipt(name, "generated.js", generated);
        save_receipt(
            name,
            "generated.txt",
            String::from_utf8_lossy(generated).as_bytes(),
        );
    }
    if let Some(dts) = dts {
        save_receipt(name, "generated.d.ts", dts);
        save_receipt(
            name,
            "generated-dts.txt",
            String::from_utf8_lossy(dts).as_bytes(),
        );
    }
}

fn run_positive(case: &Case) {
    run_positive_with_declarations(case, false);
}

fn run_positive_with_declarations(case: &Case, expect_declarations: bool) {
    let source_path = fixture_path(case.name);
    let source = fs::read(&source_path).expect("read frozen semantic-role source");
    let temp = TempDir::new().expect("create semantic-role output directory");
    let xdg_cache_home = temp.path().join("xdg-cache");
    fs::create_dir(&xdg_cache_home).expect("create isolated semantic-role XDG cache");
    let output_path = temp.path().join(format!("{}.js", case.name));
    let check = execute_recorded(
        &format!("native-{}-check", case.name),
        &source_path,
        &source,
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .env("XDG_CACHE_HOME", &xdg_cache_home)
            .arg("check")
            .arg(&source_path),
    );
    let compile = execute_recorded(
        &format!("native-{}-compile", case.name),
        &source_path,
        &source,
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .env("XDG_CACHE_HOME", &xdg_cache_home)
            .arg("compile")
            .arg(&source_path)
            .arg("-o")
            .arg(&output_path),
    );
    let generated = fs::read(&output_path).ok();
    let dts = fs::read(output_path.with_extension("d.ts")).ok();
    record_generated(
        &format!("native-{}", case.name),
        generated.as_deref(),
        dts.as_deref(),
    );

    assert!(
        check.status.success(),
        "{} check rejected fixture: {:?}",
        case.name,
        check.stderr
    );
    assert!(
        compile.status.success(),
        "{} strict compile rejected fixture: {:?}",
        case.name,
        compile.stderr
    );
    assert_eq!(
        dts.is_some(),
        expect_declarations,
        "{} declaration output disposition differs: {:?}",
        case.name,
        dts
    );
    assert!(
        generated.is_some(),
        "{} successful compile omitted JavaScript",
        case.name
    );

    if matches!(
        case.name,
        "ordered-lexical-bind-call"
            | "ordered-lexical-statement-call"
            | "ordered-member-pure-colon-call"
            | "computed-member-ordered-throws"
            | "computed-member-no-prefix"
            | "anonymous-completion-names"
            | "ordered-simple-assignment"
            | "ordered-literal-compound-assignment"
            | "ordinary-assignment-preservation"
            | "ordered-argument-spread"
            | "pure-argument-spread"
    ) {
        let kernel_json = execute_recorded(
            &format!("native-{}-kernel-json", case.name),
            &source_path,
            &source,
            Command::new(env!("CARGO_BIN_EXE_lykn"))
                .current_dir(temp.path())
                .env("XDG_CACHE_HOME", &xdg_cache_home)
                .arg("compile")
                .arg(&source_path)
                .arg("--kernel-json"),
        );
        assert!(
            kernel_json.status.success(),
            "{} kernel JSON compile failed: {:?}",
            case.name,
            kernel_json.stderr
        );
        let parsed: serde_json::Value = serde_json::from_slice(&kernel_json.stdout)
            .unwrap_or_else(|error| panic!("{} kernel JSON is invalid: {error}", case.name));
        assert!(
            parsed.is_array() && !parsed.as_array().unwrap().is_empty(),
            "{} kernel JSON is not a non-empty ordinary module array: {parsed}",
            case.name
        );
    }

    let deno = std::env::var_os("LYKN_TEST_DENO").unwrap_or_else(|| "deno".into());
    let runtime = execute_recorded(
        &format!("native-{}-runtime", case.name),
        &source_path,
        &source,
        Command::new(deno)
            .current_dir(temp.path())
            .args([
                "run",
                "--no-config",
                "--cached-only",
                "--no-npm",
                "--no-remote",
                "--deny-net",
                "--no-prompt",
            ])
            .arg(&output_path),
    );
    assert!(
        runtime.status.success(),
        "{} strict runtime failed: {:?}",
        case.name,
        runtime.stderr
    );
    assert!(
        runtime.stderr.is_empty(),
        "{} runtime wrote stderr: {:?}",
        case.name,
        runtime.stderr
    );
    assert_eq!(
        runtime.stdout, case.expected,
        "{} runtime JSON differs",
        case.name
    );
    if case.name == "ordered-member-pure-colon-call" {
        let generated =
            std::str::from_utf8(generated.as_deref().expect("pure call JavaScript exists"))
                .expect("pure call JavaScript is UTF-8");
        assert!(generated.contains("receiver.readEntry(3)"));
        assert!(!generated.contains("lyknHostReflectApply"));
        assert!(!generated.contains("Reflect.apply"));
    }
    if case.name == "computed-member-no-prefix" {
        let generated = std::str::from_utf8(
            generated
                .as_deref()
                .expect("computed pure JavaScript exists"),
        )
        .expect("computed pure JavaScript is UTF-8");
        assert!(!generated.contains("lyknHostReflectApply"));
        assert!(!generated.contains("import "));
    }
    if case.name == "pure-argument-spread" {
        let generated =
            std::str::from_utf8(generated.as_deref().expect("pure spread JavaScript exists"))
                .expect("pure spread JavaScript is UTF-8");
        assert!(!generated.contains("lyknHostReflectApply"));
        assert!(!generated.contains("Reflect.apply"));
    }
}

fn run_spread_hold(name: &str, source: &[u8]) {
    let temp = TempDir::new().expect("create spread-hold output directory");
    let xdg_cache_home = temp.path().join("xdg-cache");
    fs::create_dir(&xdg_cache_home).expect("create isolated spread-hold XDG cache");
    let source_path = temp.path().join(format!("{name}.lykn"));
    let output_path = temp.path().join(format!("{name}.js"));
    fs::write(&source_path, source).expect("write exact spread-hold source");
    let exact_source = fs::read(&source_path).expect("read exact spread-hold source");
    let compile = execute_recorded(
        &format!("native-{name}-compile"),
        &source_path,
        &exact_source,
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .env("XDG_CACHE_HOME", &xdg_cache_home)
            .arg("compile")
            .arg(&source_path)
            .arg("-o")
            .arg(&output_path),
    );
    let generated = output_path
        .try_exists()
        .expect("check spread-hold JavaScript")
        .then(|| fs::read(&output_path).expect("read spread-hold JavaScript"));
    let dts_path = output_path.with_extension("d.ts");
    let dts = dts_path
        .try_exists()
        .expect("check spread-hold DTS")
        .then(|| fs::read(&dts_path).expect("read spread-hold DTS"));
    record_generated(
        &format!("native-{name}"),
        generated.as_deref(),
        dts.as_deref(),
    );
    eprintln!(
        "SPREAD_HOLD_PREASSERT name={name} status={:?} stdout={:?} stderr={:?} generated={generated:?} dts={dts:?}",
        compile.status.code(),
        compile.stdout,
        compile.stderr
    );
    assert!(
        compile.status.success(),
        "{name} compile: {:?}",
        compile.stderr
    );
    assert!(generated.is_some(), "{name} omitted JavaScript");
    assert!(dts.is_none(), "{name} unexpectedly emitted DTS: {dts:?}");
    let generated = std::str::from_utf8(generated.as_deref().expect("JavaScript exists"))
        .expect("JavaScript is UTF-8");

    if name == "ordered-computed-call-spread-hold" {
        assert!(!generated.contains("lyknHostReflectApply"));
        assert!(!generated.contains("Reflect.apply"));
        assert!(!generated.contains("import "));
        let source_return = generated
            .find("return 7")
            .expect("source return is emitted");
        let ordinary_call = generated
            .find("])(...items)")
            .expect("ordinary computed spread call is emitted");
        assert!(source_return < ordinary_call);
    } else {
        let iteration = generated.find("for (").expect("native for-of is emitted");
        let source_return = generated
            .find("return 7")
            .expect("source return is emitted");
        assert!(iteration < source_return);
    }
}

fn ordered_member_fixture_path(name: &str) -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../../test/fixtures/ordered-member-calls")
        .join(format!("{name}.lykn"))
}

fn run_ordered_member_provider(provider_name: &str, expected_provider_kind: &str) {
    let temp = TempDir::new().expect("create ordered-member output directory");
    let xdg_cache_home = temp.path().join("xdg-cache");
    fs::create_dir(&xdg_cache_home).expect("create isolated ordered-member XDG cache");
    let provider_path = ordered_member_fixture_path(provider_name);
    let provider_source = fs::read(&provider_path).expect("read frozen ordered-member provider");
    let provider_output = temp.path().join("provider.js");

    let check = execute_recorded(
        &format!("native-{provider_name}-check"),
        &provider_path,
        &provider_source,
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .env("XDG_CACHE_HOME", &xdg_cache_home)
            .arg("check")
            .arg(&provider_path),
    );
    let compile = execute_recorded(
        &format!("native-{provider_name}-compile"),
        &provider_path,
        &provider_source,
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .env("XDG_CACHE_HOME", &xdg_cache_home)
            .arg("compile")
            .arg(&provider_path)
            .arg("-o")
            .arg(&provider_output),
    );
    let kernel_json = execute_recorded(
        &format!("native-{provider_name}-kernel-json"),
        &provider_path,
        &provider_source,
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .env("XDG_CACHE_HOME", &xdg_cache_home)
            .arg("compile")
            .arg(&provider_path)
            .arg("--kernel-json"),
    );
    let provider_js = fs::read(&provider_output).ok();
    let provider_dts = fs::read(provider_output.with_extension("d.ts")).ok();
    record_generated(
        &format!("native-{provider_name}"),
        provider_js.as_deref(),
        provider_dts.as_deref(),
    );

    let live_path = ordered_member_fixture_path("entry-live");
    let live_source = fs::read(&live_path).expect("read frozen ordered-member live entry");
    let live_output = temp.path().join("live.js");
    let live_compile = execute_recorded(
        &format!("native-{provider_name}-live-compile"),
        &live_path,
        &live_source,
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .env("XDG_CACHE_HOME", &xdg_cache_home)
            .arg("compile")
            .arg(&live_path)
            .arg("-o")
            .arg(&live_output)
            .arg("--source-context-path")
            .arg(temp.path()),
    );
    let live_js = fs::read(&live_output).ok();
    let live_dts = fs::read(live_output.with_extension("d.ts")).ok();
    record_generated(
        &format!("native-{provider_name}-live"),
        live_js.as_deref(),
        live_dts.as_deref(),
    );

    let shaken_path = ordered_member_fixture_path("entry-shaken");
    let shaken_source = fs::read(&shaken_path).expect("read frozen ordered-member shaken entry");
    let shaken_output = temp.path().join("shaken.js");
    let shaken_compile = execute_recorded(
        &format!("native-{provider_name}-shaken-compile"),
        &shaken_path,
        &shaken_source,
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .env("XDG_CACHE_HOME", &xdg_cache_home)
            .arg("compile")
            .arg(&shaken_path)
            .arg("-o")
            .arg(&shaken_output)
            .arg("--source-context-path")
            .arg(temp.path()),
    );
    let shaken_js = fs::read(&shaken_output).ok();
    let shaken_dts = fs::read(shaken_output.with_extension("d.ts")).ok();
    record_generated(
        &format!("native-{provider_name}-shaken"),
        shaken_js.as_deref(),
        shaken_dts.as_deref(),
    );

    let deno = std::env::var_os("LYKN_TEST_DENO").unwrap_or_else(|| "deno".into());
    let provider_ready = compile.status.success() && provider_js.is_some();
    let provider_runtime = if provider_ready {
        Some(execute_recorded(
            &format!("native-{provider_name}-runtime"),
            &provider_path,
            &provider_source,
            Command::new(&deno)
                .current_dir(temp.path())
                .args([
                    "run",
                    "--no-config",
                    "--cached-only",
                    "--no-npm",
                    "--no-remote",
                    "--deny-net",
                    "--no-prompt",
                ])
                .arg(&provider_output),
        ))
    } else {
        let message =
            b"skipped: provider compile did not produce a successful JavaScript artifact\n";
        save_receipt(
            &format!("native-{provider_name}-runtime"),
            "status.txt",
            message,
        );
        None
    };
    let live_runtime = if provider_ready && live_compile.status.success() && live_js.is_some() {
        Some(execute_recorded(
            &format!("native-{provider_name}-live-runtime"),
            &live_path,
            &live_source,
            Command::new(&deno)
                .current_dir(temp.path())
                .args([
                    "run",
                    "--no-config",
                    "--cached-only",
                    "--no-npm",
                    "--no-remote",
                    "--deny-net",
                    "--no-prompt",
                ])
                .arg(&live_output),
        ))
    } else {
        let message =
            b"skipped: provider compile/artifact or live entry compile/artifact unavailable\n";
        save_receipt(
            &format!("native-{provider_name}-live-runtime"),
            "status.txt",
            message,
        );
        None
    };

    assert!(
        check.status.success(),
        "provider check failed: {:?}",
        check.stderr
    );
    assert!(
        compile.status.success(),
        "provider compile failed: {:?}",
        compile.stderr
    );
    assert!(
        kernel_json.status.success(),
        "provider kernel JSON failed: {:?}",
        kernel_json.stderr
    );
    let parsed: serde_json::Value = serde_json::from_slice(&kernel_json.stdout)
        .expect("provider kernel JSON is a valid ordinary module");
    assert!(parsed.is_array() && !parsed.as_array().unwrap().is_empty());
    assert!(provider_js.is_some(), "provider JavaScript is missing");
    assert_eq!(
        provider_dts.as_deref(),
        Some(b"export function probe(): unknown;\n".as_slice()),
        "provider export DTS differs"
    );
    assert!(
        live_compile.status.success(),
        "live entry compile failed: {:?}",
        live_compile.stderr
    );
    assert!(live_js.is_some(), "live entry JavaScript is missing");
    assert!(live_dts.is_none(), "live entry unexpectedly emitted DTS");
    assert!(
        shaken_compile.status.success(),
        "shaken entry compile failed: {:?}",
        shaken_compile.stderr
    );
    assert!(shaken_js.is_some(), "shaken entry JavaScript is missing");
    assert!(
        shaken_dts.is_none(),
        "shaken entry unexpectedly emitted DTS"
    );
    let provider_runtime = provider_runtime.expect("provider runtime was not eligible to run");
    assert!(
        provider_runtime.status.success(),
        "provider runtime failed: {:?}",
        provider_runtime.stderr
    );
    assert!(provider_runtime.stderr.is_empty());
    assert_eq!(provider_runtime.stdout, b"provider\n");
    let live_runtime = live_runtime.expect("live runtime was not eligible to run");
    assert!(
        live_runtime.status.success(),
        "live runtime failed: {:?}",
        live_runtime.stderr
    );
    assert!(live_runtime.stderr.is_empty());
    let expected = format!(
        "provider\n[\"{expected_provider_kind}\",92,[\"receiver\",8],[\"get\",\"earlier\",\"middle\",\"get\",\"earlier\",\"middle\",\"later\",\"call\",\"after\"]]\n"
    );
    assert_eq!(live_runtime.stdout, expected.as_bytes());
}

#[test]
fn native_static_member_calls_use_the_default_lazy_helper() {
    run_ordered_member_provider("provider-default", "local");
}

#[test]
fn native_static_member_calls_use_the_reflect_fallback() {
    run_ordered_member_provider("provider-fallback", "inline");
}

#[test]
fn native_pure_static_member_call_keeps_the_ordinary_route() {
    let source = fs::read(ordered_member_fixture_path("pure-colon-call"))
        .expect("read frozen pure static-member source");
    let case = Case {
        name: "ordered-member-pure-colon-call",
        expected: b"4\n",
    };
    assert!(source.ends_with(b"\n"));
    run_positive(&case);
}

#[test]
fn ordered_argument_spread_preserves_iteration_and_completion_order() {
    run_positive(&FIXTURES[41]);
}

#[test]
fn pure_argument_spread_preserves_the_ordinary_call_route() {
    run_positive(&FIXTURES[42]);
}

#[test]
fn seq_expressions_keep_single_expression_boundaries() {
    run_positive(&FIXTURES[43]);
}

#[test]
fn recursive_adt_patterns_preserve_guards_reads_and_conditional_bindings() {
    run_positive_with_declarations(&FIXTURES[44], true);
}

#[test]
fn compiler_private_pattern_fields_do_not_shadow_user_macros() {
    run_positive_with_declarations(&FIXTURES[45], true);
}

#[test]
fn native_static_member_spread_precedes_a_later_return() {
    let source = concat!(
        "(func mixed-spread :args (:any receiver :any items) :returns :any :body\n",
        "  (receiver:read-entry (spread items) (do (return 7) 8)))\n",
    )
    .as_bytes();
    run_spread_hold("ordered-static-call-spread-hold", source);
}

#[test]
fn while_uses_value_test_and_statement_sequence_body() {
    run_positive(&FIXTURES[0]);
}

#[test]
fn do_while_uses_value_test_and_statement_sequence_body() {
    run_positive(&FIXTURES[1]);
}

#[test]
fn match_consumes_value_tail_after_statement_prefix() {
    run_positive(&FIXTURES[2]);
}

#[test]
fn boundaries_preserve_bound_calls_and_switch_sibling_visibility() {
    run_positive(&FIXTURES[3]);
}

#[test]
fn if_arm_scope_and_macro_expansion_are_preserved() {
    run_positive(&FIXTURES[4]);
}

#[test]
fn if_declaration_is_emitted_inside_a_branch_block() {
    run_positive(&FIXTURES[5]);
}

#[test]
fn if_direct_transfers_keep_source_targets() {
    run_positive(&FIXTURES[6]);
}

#[test]
fn if_direct_transfers_keep_macro_introduced_function_targets() {
    run_positive(&FIXTURES[7]);
}

#[test]
fn statement_match_guards_progress_in_source_order() {
    run_positive(&FIXTURES[8]);
}

#[test]
fn statement_match_return_keeps_the_enclosing_function_target() {
    run_positive(&FIXTURES[9]);
}

#[test]
fn statement_match_loop_transfers_keep_their_source_targets() {
    run_positive(&FIXTURES[10]);
}

#[test]
fn statement_match_guarded_exhaustion_throws_into_the_enclosing_try() {
    run_positive(&FIXTURES[11]);
}

#[test]
fn statement_match_preserves_macro_hygiene_and_consumed_controls() {
    run_positive(&FIXTURES[12]);
}

#[test]
fn statement_match_preserves_protected_function_exit_checks() {
    run_positive(&FIXTURES[13]);
}

#[test]
fn match_clauses_keep_bindings_local_to_guard_and_body() {
    run_positive(&FIXTURES[14]);
}

#[test]
fn match_patterns_stay_structural_while_clause_macros_expand() {
    run_positive(&FIXTURES[15]);
}

#[test]
fn original_match_reserved_role_is_preserved() {
    run_positive(&FIXTURES[16]);
}

#[test]
fn original_match_kernel_object_is_preserved() {
    run_positive(&FIXTURES[17]);
}

#[test]
fn bound_match_conditional_operand_is_a_value() {
    run_positive(&FIXTURES[18]);
}

#[test]
fn nested_kernel_object_retains_structural_and_executable_roles() {
    run_positive(&FIXTURES[19]);
}

#[test]
fn direct_return_consumes_match_in_the_named_function_region() {
    run_positive(&FIXTURES[20]);
}

#[test]
fn direct_return_consumes_do_without_retargeting_loop_transfers() {
    run_positive(&FIXTURES[21]);
}

#[test]
fn direct_return_match_preserves_guarded_exhaustion() {
    run_positive(&FIXTURES[22]);
}

#[test]
fn direct_return_macro_keeps_nested_function_boundaries() {
    run_positive(&FIXTURES[23]);
}

#[test]
fn bind_consumed_early_return_skips_the_original_const_continuation() {
    run_positive(&FIXTURES[24]);
}

#[test]
fn bind_consumed_group_match_keeps_order_and_source_return_target() {
    run_positive(&FIXTURES[25]);
}

#[test]
fn bind_consumed_loop_transfers_keep_their_source_targets() {
    run_positive(&FIXTURES[26]);
}

#[test]
fn bind_consumed_result_temp_preserves_later_name_hygiene() {
    run_positive(&FIXTURES[27]);
}

#[test]
fn native_typed_bind_check_follows_normal_result_initialization() {
    run_positive(&FIXTURES[28]);
}

#[test]
fn selected_if_headers_preserve_completion_and_values() {
    run_positive(&FIXTURES[29]);
}

#[test]
fn match_subject_and_guard_headers_preserve_completion() {
    run_positive(&FIXTURES[30]);
}

#[test]
fn logical_operands_are_lazy_and_preserve_results() {
    run_positive(&FIXTURES[31]);
}

#[test]
fn nullish_operands_preserve_strict_selection_and_completion() {
    run_positive(&FIXTURES[32]);
}

#[test]
fn lexical_bind_calls_preserve_callee_and_argument_evaluation_order() {
    run_positive(&FIXTURES[33]);
}

#[test]
fn lexical_statement_calls_preserve_source_exits_and_late_call_errors() {
    run_positive(&FIXTURES[34]);
}

#[test]
fn computed_member_calls_preserve_reference_and_argument_order_and_throws() {
    run_positive(&FIXTURES[35]);
}

#[test]
fn computed_member_no_prefix_calls_preserve_bound_get_and_kernel_escape() {
    run_positive(&FIXTURES[36]);
}

#[test]
fn anonymous_completion_values_preserve_source_names() {
    run_positive(&FIXTURES[37]);
}

#[test]
fn simple_assignment_preserves_reference_order_and_source_exits() {
    run_positive(&FIXTURES[38]);
}

#[test]
fn literal_compound_assignment_preserves_get_conversion_and_write_order() {
    run_positive(&FIXTURES[39]);
}

#[test]
fn ordinary_assignment_output_and_local_protected_control_are_preserved() {
    run_positive(&FIXTURES[40]);
}

#[test]
fn lifted_direct_protected_write_fails_compile_without_outputs() {
    let source = concat!(
        "(func blocked :args () :returns :any :body\n",
        "  (kernel:= (get Reflect \"apply\") (do 0 0)))\n",
    )
    .as_bytes();
    let temp = TempDir::new().expect("create protected-write negative directory");
    let xdg_cache_home = temp.path().join("xdg-cache");
    fs::create_dir(&xdg_cache_home).expect("create isolated protected-write XDG cache");
    let source_path = temp.path().join("protected-write.lykn");
    let output_path = temp.path().join("protected-write.js");
    fs::write(&source_path, source).expect("write exact protected-write source");
    let exact_source = fs::read(&source_path).expect("read exact protected-write source");

    let check = execute_recorded(
        "native-protected-write-check",
        &source_path,
        &exact_source,
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .env("XDG_CACHE_HOME", &xdg_cache_home)
            .arg("check")
            .arg(&source_path),
    );
    let compile = execute_recorded(
        "native-protected-write-compile",
        &source_path,
        &exact_source,
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .env("XDG_CACHE_HOME", &xdg_cache_home)
            .arg("compile")
            .arg(&source_path)
            .arg("-o")
            .arg(&output_path),
    );
    let generated = output_path
        .try_exists()
        .expect("check protected-write JavaScript output")
        .then(|| fs::read(&output_path).expect("read protected-write JavaScript"));
    let dts_path = output_path.with_extension("d.ts");
    let dts = dts_path
        .try_exists()
        .expect("check protected-write declaration output")
        .then(|| fs::read(&dts_path).expect("read protected-write declaration"));
    record_generated(
        "native-protected-write",
        generated.as_deref(),
        dts.as_deref(),
    );

    let check_stderr = format!(
        "{}: error: 2:13: error: host-contract v2: write to protected slot Reflect.apply\n",
        source_path.display()
    );
    let compile_stderr = "2:13: error: host-contract v2: write to protected slot Reflect.apply\n";
    assert_eq!(check.status.code(), Some(1), "protected check status");
    assert!(check.stdout.is_empty(), "protected check wrote stdout");
    assert_eq!(check.stderr, check_stderr.as_bytes());
    assert_eq!(compile.status.code(), Some(1), "protected compile status");
    assert!(compile.stdout.is_empty(), "protected compile wrote stdout");
    assert_eq!(compile.stderr, compile_stderr.as_bytes());
    assert!(
        generated.is_none(),
        "protected compile wrote JavaScript: {generated:?}"
    );
    assert!(
        dts.is_none(),
        "protected compile wrote declarations: {dts:?}"
    );
}

#[test]
fn computed_member_header_return_keeps_the_ordinary_no_helper_route() {
    let source = concat!(
        "(func mixed-computed-spread :args (:any receiver :any items) :returns :any :body\n",
        "  ((get receiver (do (return 7) \"method\")) (spread items)))\n",
    )
    .as_bytes();
    run_spread_hold("ordered-computed-call-spread-hold", source);
}

#[test]
fn lexical_call_spread_precedes_a_later_return() {
    let source = concat!(
        "(func mixed-spread :args (:any callable :any items) :returns :any :body\n",
        "  (callable (spread items) (do (return 7) 8)))\n",
    )
    .as_bytes();
    run_spread_hold("ordered-lexical-call-spread-hold", source);
}

#[test]
fn malformed_actual_spread_is_checked_at_the_argument_root() {
    let source =
        b"(func malformed-spread :args (:any target) :returns :any :body\n  (target (spread)))\n";
    let temp = TempDir::new().expect("create malformed-spread output directory");
    let xdg_cache_home = temp.path().join("xdg-cache");
    fs::create_dir(&xdg_cache_home).expect("create isolated malformed-spread XDG cache");
    let source_path = temp.path().join("malformed-spread.lykn");
    let output_path = temp.path().join("malformed-spread.js");
    fs::write(&source_path, source).expect("write exact malformed-spread source");
    let exact_source = fs::read(&source_path).expect("read exact malformed-spread source");
    let compile = execute_recorded(
        "native-malformed-argument-spread-compile",
        &source_path,
        &exact_source,
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .env("XDG_CACHE_HOME", &xdg_cache_home)
            .arg("compile")
            .arg(&source_path)
            .arg("-o")
            .arg(&output_path),
    );
    let generated = output_path
        .try_exists()
        .expect("check malformed-spread JavaScript")
        .then(|| fs::read(&output_path).expect("read malformed-spread JavaScript"));
    let dts_path = output_path.with_extension("d.ts");
    let dts = dts_path
        .try_exists()
        .expect("check malformed-spread DTS")
        .then(|| fs::read(&dts_path).expect("read malformed-spread DTS"));
    record_generated(
        "native-malformed-argument-spread",
        generated.as_deref(),
        dts.as_deref(),
    );
    let stderr = String::from_utf8_lossy(&compile.stderr);
    eprintln!(
        "MALFORMED_SPREAD_PREASSERT status={:?} stdout={:?} stderr={stderr:?} generated={generated:?} dts={dts:?}",
        compile.status.code(),
        compile.stdout
    );
    assert_eq!(compile.status.code(), Some(1));
    assert!(compile.stdout.is_empty());
    assert_eq!(
        stderr,
        "1:7: warning: unused binding 'malformed-spread'\n  suggestion: prefix with underscore: _malformed-spread\n2:11: error: spread takes exactly one argument\n"
    );
    assert!(
        generated.is_none(),
        "malformed source emitted JavaScript: {generated:?}"
    );
    assert!(dts.is_none(), "malformed source emitted DTS: {dts:?}");
}

#[test]
fn unknown_nested_kernel_escape_fails_compile_without_outputs() {
    let source = b"(bind result (kernel:objec (key 7)))\n";
    let temp = TempDir::new().expect("create unknown-kernel output directory");
    let xdg_cache_home = temp.path().join("xdg-cache");
    fs::create_dir(&xdg_cache_home).expect("create isolated XDG cache");
    let source_path = temp.path().join("unknown.lykn");
    fs::write(&source_path, source).expect("write exact unknown-kernel source");
    let output_path = temp.path().join("unknown.js");
    let compile = execute_recorded(
        "native-unknown-kernel-compile",
        &source_path,
        source,
        Command::new(env!("CARGO_BIN_EXE_lykn"))
            .current_dir(temp.path())
            .env("XDG_CACHE_HOME", &xdg_cache_home)
            .arg("compile")
            .arg(&source_path)
            .arg("-o")
            .arg(&output_path),
    );
    let generated_exists = output_path
        .try_exists()
        .expect("check whether unknown-kernel JavaScript exists");
    let generated = generated_exists
        .then(|| fs::read(&output_path).expect("read erroneous unknown-kernel JavaScript"));
    let dts_path = output_path.with_extension("d.ts");
    let dts_exists = dts_path
        .try_exists()
        .expect("check whether unknown-kernel declarations exist");
    let dts = dts_exists
        .then(|| fs::read(&dts_path).expect("read erroneous unknown-kernel declarations"));
    record_generated(
        "native-unknown-kernel-compile",
        generated.as_deref(),
        dts.as_deref(),
    );

    assert_eq!(compile.status.code(), Some(1));
    let stderr = String::from_utf8_lossy(&compile.stderr);
    assert!(
        stderr.contains(
            "1:14: error: unknown kernel form 'objec' in (kernel:objec ...); did you mean 'object'?\n  suggestion: kernel:object"
        ),
        "missing exact parsed diagnostic: {stderr}"
    );
    assert!(
        !generated_exists,
        "failed compile emitted JavaScript: {generated:?}"
    );
    assert!(!dts_exists, "failed compile emitted declarations: {dts:?}");
}

#[test]
fn consumed_no_else_if_is_rejected_in_all_four_value_positions() {
    let invalid = [
        ("while", "(while (if true true) (console:log \"never\"))"),
        (
            "do-while",
            "(do-while (if true false) (console:log \"never\"))",
        ),
        (
            "bound-call",
            "(bind match (fn (:any x) x)) (match (if true 1))",
        ),
        (
            "computed-call",
            "(bind target (fn (:any x) x)) ((get (array target) 0) (if true 1))",
        ),
    ];
    let temp = TempDir::new().expect("create semantic-role negative directory");
    let mut observations = Vec::new();

    for (name, source) in invalid {
        let source_path = temp.path().join(format!("{name}.lykn"));
        let output_path = temp.path().join(format!("{name}.js"));
        fs::write(&source_path, source).expect("write frozen negative source");
        let source = fs::read(&source_path).expect("read frozen negative source");
        let check = execute_recorded(
            &format!("native-negative-{name}-check"),
            &source_path,
            &source,
            Command::new(env!("CARGO_BIN_EXE_lykn"))
                .current_dir(temp.path())
                .arg("check")
                .arg(&source_path),
        );
        let compile = execute_recorded(
            &format!("native-negative-{name}-compile"),
            &source_path,
            &source,
            Command::new(env!("CARGO_BIN_EXE_lykn"))
                .current_dir(temp.path())
                .arg("compile")
                .arg(&source_path)
                .arg("-o")
                .arg(&output_path),
        );
        let generated = fs::read(&output_path).ok();
        record_generated(
            &format!("native-negative-{name}"),
            generated.as_deref(),
            None,
        );
        eprintln!(
            "SEMANTIC_ROLE_NEGATIVE_PREASSERT name={name} check_status={:?} compile_status={:?} generated={generated:?}",
            check.status.code(),
            compile.status.code()
        );
        observations.push((name, check, compile, generated));
    }

    for (name, check, compile, generated) in observations {
        assert!(!check.status.success(), "check accepted {name}");
        assert!(!compile.status.success(), "strict compile accepted {name}");
        assert!(
            String::from_utf8_lossy(&check.stderr)
                .contains("if in expression position requires an else branch"),
            "{name} check diagnostic: {:?}",
            check.stderr
        );
        assert!(
            String::from_utf8_lossy(&compile.stderr)
                .contains("if in expression position requires an else branch"),
            "{name} compile diagnostic: {:?}",
            compile.stderr
        );
        assert!(
            generated.is_none(),
            "{name} compile wrote JavaScript: {generated:?}"
        );
    }
}
