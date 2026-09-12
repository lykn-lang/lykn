//! Child-boundary and actual Deno permission controls. No network or packages.
//! Each fixture owns its CWD, cache, outputs and subprocess environment.
#![cfg(unix)]

use std::fs;
use std::os::unix::fs::PermissionsExt;
use std::path::{Path, PathBuf};
use std::process::{Command, Output, Stdio};
use tempfile::TempDir;

const HELLO: &str = "(console:log \"fixture\")\n";
const READ: &str = "(console:log (Deno:read-text-file-sync (get Deno:args 0)))\n";
const WRITE: &str = "(Deno:write-text-file-sync (get Deno:args 0) \"written\")\n";
const FLAGS: [&str; 16] = [
    "allow-read",
    "allow-write",
    "allow-net",
    "allow-env",
    "allow-run",
    "allow-sys",
    "allow-ffi",
    "allow-import",
    "deny-read",
    "deny-write",
    "deny-net",
    "deny-env",
    "deny-run",
    "deny-sys",
    "deny-ffi",
    "deny-import",
];

struct Fixture {
    _temp: TempDir,
    root: PathBuf,
}

impl Fixture {
    fn new() -> Self {
        let temp = tempfile::Builder::new()
            .prefix("lykn run permissions ")
            .tempdir()
            .unwrap();
        let root = temp.path().canonicalize().unwrap();
        fs::write(root.join("project.json"), "{}").unwrap();
        Self { _temp: temp, root }
    }

    fn write(&self, path: &str, content: &str) {
        let path = self.root.join(path);
        fs::create_dir_all(path.parent().unwrap()).unwrap();
        fs::write(path, content).unwrap();
    }

    fn command(&self) -> Command {
        let mut command = Command::new(env!("CARGO_BIN_EXE_lykn"));
        command
            .current_dir(&self.root)
            .env_clear()
            .env("PATH", std::env::var_os("PATH").unwrap())
            .env("HOME", &self.root)
            .env("TMPDIR", &self.root)
            .env("DENO_DIR", self.root.join("deno-cache"))
            .env("DENO_NO_UPDATE_CHECK", "1")
            .env("NO_COLOR", "1")
            .stdin(Stdio::null());
        command
    }

    fn program(&self, route: &str, source: &str) -> (String, PathBuf) {
        match route {
            "workspace" => {
                self.write(
                    "project.json",
                    r#"{"workspace":["packages/demo"],"imports":{}}"#,
                );
                self.write(
                    "packages/demo/deno.json",
                    r#"{"name":"@fixture/demo","version":"0.0.0","exports":"./main.lykn"}"#,
                );
                self.write("packages/demo/main.lykn", source);
                (
                    "packages/demo/main.lykn".into(),
                    self.root.join("target/lykn/build/demo/main.js"),
                )
            }
            "js" => {
                self.write("source.lykn", source);
                success(
                    &self
                        .command()
                        .args(["compile", "source.lykn", "-o", "generated file.js"])
                        .output()
                        .unwrap(),
                );
                (
                    "generated file.js".into(),
                    PathBuf::from("generated file.js"),
                )
            }
            "standalone" | "no-project" => {
                self.write("standalone file.lykn", source);
                let output = if route == "no-project" {
                    fs::remove_file(self.root.join("project.json")).unwrap();
                    self.write("deno.json", "{}");
                    self.root.join("lykn_run.js")
                } else {
                    self.root.join("target/lykn/run/standalone file.js")
                };
                ("standalone file.lykn".into(), output)
            }
            _ => panic!("unknown test route"),
        }
    }

    fn capture(&self, options: &[String], file: &str, args: &[&str], exit: i32) -> Vec<String> {
        self.write("fake/deno", "#!/bin/sh\nprintf '%s\\0' \"$@\" > \"$TRACE\"\nprintf 'child stderr\\n' >&2\nexit \"$CHILD_EXIT\"\n");
        fs::set_permissions(
            self.root.join("fake/deno"),
            fs::Permissions::from_mode(0o755),
        )
        .unwrap();
        let mut paths = vec![self.root.join("fake")];
        paths.extend(std::env::split_paths(&std::env::var_os("PATH").unwrap()));
        let out = self
            .command()
            .env("PATH", std::env::join_paths(paths).unwrap())
            .env("TRACE", self.root.join("argv"))
            .env("CHILD_EXIT", exit.to_string())
            .arg("run")
            .args(options)
            .arg(file)
            .args(args)
            .output()
            .unwrap();
        assert_eq!(
            out.status.code(),
            Some(exit),
            "{}",
            String::from_utf8_lossy(&out.stderr)
        );
        assert_eq!(String::from_utf8_lossy(&out.stderr), "child stderr\n");
        let bytes = fs::read(self.root.join("argv")).unwrap();
        bytes
            .strip_suffix(&[0])
            .unwrap()
            .split(|b| *b == 0)
            .map(|s| String::from_utf8(s.to_vec()).unwrap())
            .collect()
    }

    fn run(&self, flags: &[String], file: &str, args: &[&str]) -> Output {
        self.command()
            .args(["run", "--no-prompt"])
            .args(flags)
            .arg(file)
            .args(args)
            .output()
            .unwrap()
    }
}

fn success(out: &Output) {
    assert!(
        out.status.success(),
        "stdout={}\nstderr={}",
        String::from_utf8_lossy(&out.stdout),
        String::from_utf8_lossy(&out.stderr)
    );
}

fn denied(out: &Output, operation: &str) {
    assert_eq!(out.status.code(), Some(1));
    let stderr = String::from_utf8_lossy(&out.stderr);
    assert!(
        stderr.contains("NotCapable") && stderr.contains(&format!("Requires {operation} access")),
        "{stderr}"
    );
}

#[test]
fn all_routes_have_no_implicit_grants_and_preserve_build_paths() {
    for route in ["standalone", "workspace", "js", "no-project"] {
        let f = Fixture::new();
        let (file, program) = f.program(route, HELLO);
        let argv = f.capture(&[], &file, &[], 0);
        let config = if route == "no-project" {
            "deno.json"
        } else {
            "project.json"
        };
        assert_eq!(
            argv,
            [
                "run".into(),
                "--config".into(),
                f.root.join(config).display().to_string(),
                "--".into(),
                program.display().to_string()
            ]
        );
        assert!(f.root.join(program).is_file());
    }
}

#[test]
fn every_permission_supports_bare_scoped_repeated_and_explicit_empty_values() {
    let f = Fixture::new();
    let (file, _) = f.program("js", HELLO);
    for name in FLAGS {
        for supplied in [
            vec![format!("--{name}")],
            vec![format!("--{name}=one space,two"), format!("--{name}=three")],
            vec![format!("--{name}=")],
        ] {
            let argv = f.capture(&supplied, &file, &[], 0);
            assert_eq!(&argv[3..argv.len() - 2], supplied);
        }
        // Deno combines scopes, including when a bare occurrence is mixed in.
        for supplied in [
            vec![format!("--{name}"), format!("--{name}=one")],
            vec![format!("--{name}=one"), format!("--{name}")],
        ] {
            let argv = f.capture(&supplied, &file, &[], 0);
            assert_eq!(&argv[3..argv.len() - 2], [format!("--{name}=one")]);
        }
    }
}

#[test]
fn runtime_options_and_child_exit_are_preserved_on_all_routes() {
    for route in ["standalone", "workspace", "js"] {
        let f = Fixture::new();
        let (file, _) = f.program(route, HELLO);
        for all in ["-A", "--allow-all"] {
            for frozen in ["--frozen", "--frozen=true", "--frozen=false"] {
                let argv = f.capture(
                    &[
                        all.into(),
                        "--no-prompt".into(),
                        "--cached-only".into(),
                        frozen.into(),
                    ],
                    &file,
                    &["a b", "$(never executed)", ""],
                    37,
                );
                assert_eq!(
                    &argv[3..7],
                    [
                        "--allow-all",
                        "--no-prompt",
                        "--cached-only",
                        if frozen.ends_with("false") {
                            "--frozen=false"
                        } else {
                            "--frozen=true"
                        }
                    ]
                );
                assert_eq!(&argv[9..], ["a b", "$(never executed)", ""]);
            }
        }
    }
}

#[test]
fn flags_after_file_are_script_args_with_or_without_separator() {
    let f = Fixture::new();
    let (file, _) = f.program("js", HELLO);
    let flags = [
        "--allow-read",
        "-A",
        "--allow-all",
        "--deny-write=x",
        "--no-prompt",
        "--cached-only",
        "--frozen",
        "--help",
        "--unknown",
    ];
    for flag in flags {
        for args in [vec![flag, "a b"], vec!["--", flag, "a b"]] {
            let argv = f.capture(&[], &file, &args, 0);
            assert_eq!(&argv[5..], [flag, "a b"]);
        }
    }
    let argv = f.capture(&[], &file, &["first", "--", "last"], 0);
    assert_eq!(&argv[5..], ["first", "--", "last"]);
}

#[test]
fn invalid_options_are_rejected_before_launch_and_bare_flags_do_not_eat_file() {
    let f = Fixture::new();
    let (file, _) = f.program("js", HELLO);
    for args in [
        vec!["run", "--allow-unknown", &file],
        vec!["run", "--frozen=maybe", &file],
        vec!["run", "--no-prompt=true", &file],
        vec!["run", "--allow-read"],
    ] {
        let out = f.command().args(args).output().unwrap();
        assert_eq!(
            out.status.code(),
            Some(2),
            "{}",
            String::from_utf8_lossy(&out.stderr)
        );
        assert!(!String::from_utf8_lossy(&out.stderr).contains("failed to run deno"));
    }
    let argv = f.capture(&["--allow-read".into()], &file, &["another-file"], 0);
    assert_eq!(&argv[3..], ["--allow-read", "--", &file, "another-file"]);
}

#[test]
fn effective_config_overlay_is_used_with_runtime_controls() {
    let f = Fixture::new();
    let (file, _) = f.program("workspace", HELLO);
    f.write(
        "project.local.json",
        r#"{"imports":{"fixture":"./local.js"}}"#,
    );
    let argv = f.capture(
        &["--cached-only".into(), "--frozen=false".into()],
        &file,
        &[],
        0,
    );
    let config_path = f.root.join("target/lykn/project.effective.json");
    assert_eq!(Path::new(&argv[2]), config_path);
    let config: serde_json::Value =
        serde_json::from_str(&fs::read_to_string(config_path).unwrap()).unwrap();
    assert_eq!(
        Path::new(config["imports"]["fixture"].as_str().unwrap()),
        f.root.join("local.js")
    );
    assert_eq!(&argv[3..5], ["--cached-only", "--frozen=false"]);
}

#[test]
fn real_deno_enforces_read_and_write_scopes_on_all_routes() {
    for route in ["standalone", "workspace", "js"] {
        for (operation, source) in [("read", READ), ("write", WRITE)] {
            let f = Fixture::new();
            let (file, _) = f.program(route, source);
            f.write("allowed/input.txt", "allowed content");
            f.write("outside/input.txt", "outside content");
            let inside = if operation == "read" {
                "allowed/input.txt"
            } else {
                "allowed/output.txt"
            };
            let outside = if operation == "read" {
                "outside/input.txt"
            } else {
                "outside/output.txt"
            };
            denied(&f.run(&[], &file, &[inside]), operation);
            assert!(!f.root.join("allowed/output.txt").exists());
            let scope = format!("--allow-{operation}=./allowed");
            let out = f.run(std::slice::from_ref(&scope), &file, &[inside]);
            success(&out);
            if operation == "read" {
                assert_eq!(out.stdout, b"allowed content\n");
            } else {
                assert_eq!(fs::read_to_string(f.root.join(inside)).unwrap(), "written");
            }
            denied(
                &f.run(std::slice::from_ref(&scope), &file, &[outside]),
                operation,
            );
            denied(
                &f.run(
                    &[scope.clone(), format!("--deny-{operation}=./allowed")],
                    &file,
                    &[inside],
                ),
                operation,
            );
            denied(
                &f.run(
                    &[format!("--deny-{operation}=./allowed"), scope],
                    &file,
                    &[inside],
                ),
                operation,
            );
            denied(
                &f.run(
                    &[],
                    &file,
                    &[
                        outside,
                        "--allow-all",
                        "-A",
                        &format!("--allow-{operation}"),
                    ],
                ),
                operation,
            );
            denied(
                &f.run(&[], &file, &["--", outside, "--allow-all"]),
                operation,
            );
            assert!(!f.root.join("outside/output.txt").exists());
        }
    }
}

#[test]
fn real_deno_repeated_scopes_and_bare_mixture_match_native_semantics() {
    let f = Fixture::new();
    let (file, _) = f.program("js", READ);
    f.write("one/input", "one");
    f.write("two/input", "two");
    f.write("three/input", "three");
    let scopes = ["--allow-read=./one".into(), "--allow-read=./two".into()];
    for path in ["one/input", "two/input"] {
        success(&f.run(&scopes, &file, &[path]));
    }
    denied(&f.run(&scopes, &file, &["three/input"]), "read");
    for scopes in [
        vec!["--allow-read".into(), "--allow-read=./one".into()],
        vec!["--allow-read=./one".into(), "--allow-read".into()],
    ] {
        success(&f.run(&scopes, &file, &["one/input"]));
        denied(&f.run(&scopes, &file, &["two/input"]), "read");
    }
    success(&f.run(&["--allow-read".into()], &file, &["three/input"]));
    let empty = f.run(&["--allow-read=".into()], &file, &["one/input"]);
    assert_eq!(empty.status.code(), Some(1));
    assert!(String::from_utf8_lossy(&empty.stderr).contains("Empty values are not allowed"));
}

#[test]
fn real_deno_receives_script_flags_and_nonzero_exit() {
    let f = Fixture::new();
    let (file, _) = f.program(
        "js",
        "(console:log (JSON:stringify Deno:args))\n(Deno:exit 23)\n",
    );
    let out = f.run(
        &["--cached-only".into(), "--frozen=false".into()],
        &file,
        &["--allow-read", "--", "a b", ""],
    );
    assert_eq!(out.status.code(), Some(23));
    assert_eq!(
        String::from_utf8(out.stdout).unwrap(),
        "[\"--allow-read\",\"--\",\"a b\",\"\"]\n"
    );
}

#[test]
fn filename_starting_with_hyphen_is_not_a_runtime_option() {
    let f = Fixture::new();
    let (file, _) = f.program("js", HELLO);
    fs::rename(f.root.join(file), f.root.join("--allow-all.js")).unwrap();
    let out = f
        .command()
        .args(["run", "--no-prompt", "--", "--allow-all.js"])
        .output()
        .unwrap();
    success(&out);
    assert_eq!(out.stdout, b"fixture\n");
}

#[test]
fn help_lists_the_explicit_contract() {
    let f = Fixture::new();
    let out = f.command().args(["run", "--help"]).output().unwrap();
    success(&out);
    let help = String::from_utf8(out.stdout).unwrap();
    assert!(help.contains("lykn run [OPTIONS] <FILE> [ARGS]..."));
    for name in FLAGS {
        assert!(help.contains(&format!("--{name}")), "{help}");
    }
    for flag in ["--allow-all", "--no-prompt", "--cached-only", "--frozen"] {
        assert!(help.contains(flag));
    }
}
