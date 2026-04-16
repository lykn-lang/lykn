use clap::{Parser, Subcommand};
use std::fs;
use std::path::{Path, PathBuf};
use std::process::{self, Command};

mod compile;

#[derive(Parser)]
#[command(name = "lykn", version, about = "lykn language toolchain")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Format .lykn files
    Fmt {
        /// Files to format
        files: Vec<PathBuf>,
        /// Write formatted output back to file
        #[arg(short, long)]
        write: bool,
    },
    /// Check .lykn syntax
    Check {
        /// Files to check
        files: Vec<PathBuf>,
    },
    /// Compile .lykn to JavaScript
    Compile {
        /// Input .lykn file
        file: PathBuf,
        /// Output file (default: stdout)
        #[arg(short, long)]
        output: Option<PathBuf>,
        /// Strip type checks and contracts
        #[arg(long)]
        strip_assertions: bool,
        /// Output kernel JSON instead of JS
        #[arg(long)]
        kernel_json: bool,
    },
    /// Run a .lykn or .js file
    Run {
        /// File to run
        file: PathBuf,
        /// Arguments to pass to the script
        #[arg(trailing_var_arg = true, allow_hyphen_values = true)]
        args: Vec<String>,
    },
    /// Run tests via Deno
    Test {
        /// Test file patterns (default: test/)
        #[arg(default_value = "test/")]
        patterns: Vec<String>,
    },
    /// Lint compiled JS via Deno
    Lint {
        /// Paths to lint (default: packages/)
        #[arg(default_value = "packages/")]
        paths: Vec<String>,
    },
    /// Create a new lykn project
    New {
        /// Project name (kebab-case)
        name: String,
        /// Parent directory (default: current directory)
        #[arg(long)]
        path: Option<PathBuf>,
    },
    /// Build browser bundle or npm package
    Build {
        /// Build the browser bundle (dist/lykn-browser.js)
        #[arg(long)]
        browser: bool,
        /// Build the npm package (dist/npm/)
        #[arg(long)]
        npm: bool,
    },
    /// Publish package(s)
    Publish {
        /// Publish to JSR (JavaScript Registry)
        #[arg(long)]
        jsr: bool,
        /// Build and publish to npm
        #[arg(long)]
        npm: bool,
        /// Dry run (don't actually publish)
        #[arg(long)]
        dry_run: bool,
    },
}

fn main() {
    let cli = Cli::parse();

    match cli.command {
        Commands::Fmt { files, write } => cmd_fmt(&files, write),
        Commands::Check { files } => cmd_check(&files),
        Commands::Compile {
            file,
            output,
            strip_assertions,
            kernel_json,
        } => cmd_compile(&file, output.as_deref(), strip_assertions, kernel_json),
        Commands::Run { file, args } => cmd_run(&file, &args),
        Commands::Test { patterns } => cmd_test(&patterns),
        Commands::Lint { paths } => cmd_lint(&paths),
        Commands::New { name, path } => cmd_new(&name, path.as_deref()),
        Commands::Build { browser, npm } => cmd_build(browser, npm),
        Commands::Publish { jsr, npm, dry_run } => cmd_publish(jsr, npm, dry_run),
    }
}

fn cmd_fmt(files: &[PathBuf], write: bool) {
    if files.is_empty() {
        eprintln!("Usage: lykn fmt <file.lykn>");
        process::exit(1);
    }

    for path in files {
        let source = match std::fs::read_to_string(path) {
            Ok(s) => s,
            Err(e) => {
                eprintln!("error reading {}: {e}", path.display());
                process::exit(1);
            }
        };

        let exprs = lykn_cli::reader::read(&source);
        let formatted = lykn_cli::formatter::format_exprs(&exprs, 0);

        if write {
            if let Err(e) = std::fs::write(path, &formatted) {
                eprintln!("error writing {}: {e}", path.display());
                process::exit(1);
            }
            eprintln!("{}: formatted", path.display());
        } else {
            print!("{formatted}");
        }
    }
}

fn cmd_check(files: &[PathBuf]) {
    if files.is_empty() {
        eprintln!("Usage: lykn check <file.lykn>");
        process::exit(1);
    }

    for path in files {
        let source = match std::fs::read_to_string(path) {
            Ok(s) => s,
            Err(e) => {
                eprintln!("error reading {}: {e}", path.display());
                process::exit(1);
            }
        };

        let exprs = lykn_cli::reader::read(&source);
        if exprs.is_empty() && !source.trim().is_empty() {
            eprintln!(
                "{}: warning: source is non-empty but parsed to zero expressions",
                path.display()
            );
        } else {
            eprintln!(
                "{}: ok ({} top-level expressions)",
                path.display(),
                exprs.len()
            );
        }
    }
}

fn cmd_compile(
    file: &std::path::Path,
    output: Option<&std::path::Path>,
    strip_assertions: bool,
    kernel_json: bool,
) {
    match compile::compile_file(file, strip_assertions, kernel_json) {
        Ok(result) => {
            if let Some(out_path) = output {
                if let Err(e) = std::fs::write(out_path, &result) {
                    eprintln!("error writing {}: {e}", out_path.display());
                    process::exit(1);
                }
            } else {
                print!("{result}");
            }
        }
        Err(e) => {
            eprintln!("{e}");
            process::exit(1);
        }
    }
}

// ---------------------------------------------------------------------------
// Deno wrapper subcommands
// ---------------------------------------------------------------------------

/// Find the project config path by walking up from the current directory.
fn find_config() -> String {
    let cwd = std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."));
    let mut dir = cwd.as_path();
    loop {
        if dir.join("project.json").exists() {
            return dir.join("project.json").to_string_lossy().into_owned();
        }
        if dir.join("deno.json").exists() {
            return dir.join("deno.json").to_string_lossy().into_owned();
        }
        match dir.parent() {
            Some(parent) => dir = parent,
            None => {
                // Fallback — use project.json in current dir even if it doesn't exist
                return "project.json".to_string();
            }
        }
    }
}

/// Execute a deno command, exiting with its status code.
fn exec_deno(args: &[&str]) {
    let status = Command::new("deno")
        .args(args)
        .status()
        .unwrap_or_else(|e| {
            eprintln!("failed to run deno: {e}");
            eprintln!("is deno installed? try: brew install deno");
            process::exit(1);
        });
    process::exit(status.code().unwrap_or(1));
}

fn cmd_run(file: &std::path::Path, args: &[String]) {
    let config = find_config();

    if file.extension().is_some_and(|e| e == "lykn") {
        // Compile .lykn to temp .js, then run
        let temp = std::env::temp_dir().join("lykn_run.js");
        match compile::compile_file(file, false, false) {
            Ok(js) => {
                if let Err(e) = std::fs::write(&temp, &js) {
                    eprintln!("error writing temp file: {e}");
                    process::exit(1);
                }
            }
            Err(e) => {
                eprintln!("{e}");
                process::exit(1);
            }
        }
        let temp_str = temp.to_string_lossy();
        let mut deno_args = vec!["run", "--config", &config, "-A", &temp_str];
        let arg_refs: Vec<&str> = args.iter().map(|s| s.as_str()).collect();
        deno_args.extend(arg_refs);
        exec_deno(&deno_args);
    } else {
        let file_str = file.to_string_lossy();
        let mut deno_args = vec!["run", "--config", &config, "-A", &*file_str];
        let arg_refs: Vec<&str> = args.iter().map(|s| s.as_str()).collect();
        deno_args.extend(arg_refs);
        exec_deno(&deno_args);
    }
}

fn cmd_test(patterns: &[String]) {
    let config = find_config();
    let mut deno_args = vec!["test", "--config", &config, "--no-check", "-A"];
    let refs: Vec<&str> = patterns.iter().map(|s| s.as_str()).collect();
    deno_args.extend(refs);
    exec_deno(&deno_args);
}

fn cmd_lint(paths: &[String]) {
    let config = find_config();
    let mut deno_args = vec!["lint", "--config", &config];
    let refs: Vec<&str> = paths.iter().map(|s| s.as_str()).collect();
    deno_args.extend(refs);
    exec_deno(&deno_args);
}

fn cmd_publish(jsr: bool, npm: bool, dry_run: bool) {
    // Default to JSR if no flags specified
    let do_jsr = jsr || !npm;
    let do_npm = npm;

    if do_jsr {
        let config = find_config();
        let mut args = vec!["publish", "--config", &config];
        if dry_run {
            args.push("--dry-run");
        }
        eprintln!("Publishing to JSR...");
        let status = Command::new("deno")
            .args(&args)
            .status()
            .unwrap_or_else(|e| {
                eprintln!("failed to run deno: {e}");
                process::exit(1);
            });
        if !status.success() {
            eprintln!("JSR publish failed");
            process::exit(status.code().unwrap_or(1));
        }
    }

    if do_npm {
        // Build npm package natively
        build_npm_package();

        // Publish from dist/npm/
        if dry_run {
            eprintln!("npm dry run — checking package...");
            let status = Command::new("npm")
                .args(["pack", "--dry-run"])
                .current_dir("dist/npm")
                .status()
                .unwrap_or_else(|e| {
                    eprintln!("failed to run npm: {e}");
                    process::exit(1);
                });
            if !status.success() {
                process::exit(status.code().unwrap_or(1));
            }
        } else {
            eprintln!("Publishing to npm...");
            let status = Command::new("npm")
                .args(["publish", "--access", "public"])
                .current_dir("dist/npm")
                .status()
                .unwrap_or_else(|e| {
                    eprintln!("failed to run npm: {e}");
                    process::exit(1);
                });
            if !status.success() {
                process::exit(status.code().unwrap_or(1));
            }
        }
    }

    eprintln!("Done.");
}

// ---------------------------------------------------------------------------
// lykn new — project creation
// ---------------------------------------------------------------------------

fn validate_project_name(name: &str) {
    if name.is_empty() {
        eprintln!("error: project name cannot be empty");
        process::exit(1);
    }
    if !name
        .chars()
        .all(|c| c.is_ascii_lowercase() || c.is_ascii_digit() || c == '-')
    {
        eprintln!("error: project name must be kebab-case (lowercase letters, digits, hyphens)");
        process::exit(1);
    }
    if name.starts_with('-') || name.starts_with(|c: char| c.is_ascii_digit()) {
        eprintln!("error: project name must start with a letter");
        process::exit(1);
    }
}

fn write_file(path: &Path, content: &str) {
    if let Err(e) = fs::write(path, content) {
        eprintln!("error writing {}: {e}", path.display());
        process::exit(1);
    }
}

fn project_json_template(name: &str) -> String {
    format!(
        r#"{{
    "workspace": ["./packages/{name}"],
    "imports": {{
        "{name}/": "./packages/{name}/"
    }},
    "lint": {{
        "rules": {{
            "exclude": ["no-slow-types"]
        }}
    }},
    "tasks": {{
        "test": "deno test -A test/"
    }}
}}
"#
    )
}

fn deno_json_template(name: &str) -> String {
    format!(
        r#"{{
    "name": "@{name}/{name}",
    "version": "0.1.0",
    "exports": "./mod.lykn"
}}
"#
    )
}

fn mod_lykn_template(name: &str) -> String {
    format!(
        r#";; {name} — created with lykn new

(bind greeting "Hello from {name}!")
(console:log greeting)
"#
    )
}

fn test_template(name: &str) -> String {
    format!(
        r#"import {{ assertEquals }} from "https://deno.land/std/assert/mod.ts";

Deno.test("{name}: placeholder test", () => {{
  assertEquals(1 + 1, 2);
}});
"#
    )
}

const GITIGNORE_TEMPLATE: &str = ".DS_Store
node_modules/
target/
dist/
bin/
*.js.map
";

fn cmd_new(name: &str, path: Option<&Path>) {
    validate_project_name(name);

    let base = path.unwrap_or(Path::new("."));
    let project_dir = base.join(name);

    if project_dir.exists() {
        eprintln!(
            "error: directory '{}' already exists",
            project_dir.display()
        );
        process::exit(1);
    }

    // Create directories
    if let Err(e) = fs::create_dir_all(project_dir.join("packages").join(name)) {
        eprintln!("error creating directories: {e}");
        process::exit(1);
    }
    if let Err(e) = fs::create_dir_all(project_dir.join("test")) {
        eprintln!("error creating directories: {e}");
        process::exit(1);
    }

    // Write template files
    write_file(
        &project_dir.join("project.json"),
        &project_json_template(name),
    );
    write_file(
        &project_dir.join("packages").join(name).join("deno.json"),
        &deno_json_template(name),
    );
    write_file(
        &project_dir.join("packages").join(name).join("mod.lykn"),
        &mod_lykn_template(name),
    );
    write_file(
        &project_dir.join("test").join("mod.test.js"),
        &test_template(name),
    );
    write_file(&project_dir.join(".gitignore"), GITIGNORE_TEMPLATE);

    // Git init (silent failure if git not installed)
    let _ = Command::new("git")
        .args(["init"])
        .current_dir(&project_dir)
        .stdout(process::Stdio::null())
        .stderr(process::Stdio::null())
        .status();

    eprintln!(
        "Created lykn project '{}' in {}",
        name,
        project_dir.display()
    );
    eprintln!();
    eprintln!("  cd {name}");
    eprintln!("  lykn run packages/{name}/mod.lykn");
    eprintln!();
    eprintln!("Happy hacking!");
}

// ---------------------------------------------------------------------------
// lykn build — build artifacts
// ---------------------------------------------------------------------------

fn cmd_build(browser: bool, npm: bool) {
    if !browser && !npm {
        eprintln!("Usage: lykn build --browser or lykn build --npm");
        process::exit(1);
    }
    if browser {
        build_browser_bundle();
    }
    if npm {
        build_npm_package();
    }
}

/// Build the browser bundle by invoking esbuild via Deno.
/// The build script is embedded in the binary.
fn build_browser_bundle() {
    eprintln!("Building browser bundle...");

    let script = r#"
import * as esbuild from "npm:esbuild";
const astringMeta = import.meta.resolve("astring");
const astringPkg = astringMeta.replace("file://", "").replace(/\/dist\/.*$/, "");
const nodePathShimPlugin = {
  name: "node-path-shim",
  setup(build) {
    build.onResolve({ filter: /^node:path$/ }, () => ({
      path: "node:path", namespace: "node-path-shim",
    }));
    build.onLoad({ filter: /.*/, namespace: "node-path-shim" }, () => ({
      contents: `
        export function resolve() { throw new Error("import-macros not available in browser"); }
        export function dirname() { throw new Error("import-macros not available in browser"); }
      `, loader: "js",
    }));
  },
};
const shared = {
  entryPoints: ["packages/lykn-browser/mod.js"],
  bundle: true, format: "iife", globalName: "lykn",
  alias: { "astring": astringPkg },
  plugins: [nodePathShimPlugin],
};
await Deno.mkdir("dist", { recursive: true });
await esbuild.build({ ...shared, outfile: "dist/lykn-browser.js", minify: true });
await esbuild.build({ ...shared, outfile: "dist/lykn-browser.dev.js", minify: false });
console.log("Build complete: dist/lykn-browser.js and dist/lykn-browser.dev.js");
esbuild.stop();
"#;

    let config = find_config();
    let status = Command::new("deno")
        .args(["eval", "--config", &config, "--ext=js", script])
        .status()
        .unwrap_or_else(|e| {
            eprintln!("failed to run deno: {e}");
            process::exit(1);
        });
    if !status.success() {
        eprintln!("Browser build failed");
        process::exit(status.code().unwrap_or(1));
    }
}

/// Build the npm package: copy JS source + generate package.json in dist/npm/.
fn build_npm_package() {
    eprintln!("Building npm package...");

    // Read version from package config
    let deno_json_path = Path::new("packages/lykn/deno.json");
    let deno_json_str = fs::read_to_string(deno_json_path).unwrap_or_else(|e| {
        eprintln!("error reading {}: {e}", deno_json_path.display());
        process::exit(1);
    });

    // Simple JSON version extraction (avoid adding serde dependency to CLI)
    let version = deno_json_str
        .lines()
        .find(|l| l.contains("\"version\""))
        .and_then(|l| {
            let start = l.find('"')? + 1;
            let rest = &l[start..];
            let end = rest.find('"')?;
            let after_colon = &rest[end + 1..];
            let v_start = after_colon.find('"')? + 1;
            let v_rest = &after_colon[v_start..];
            let v_end = v_rest.find('"')?;
            Some(v_rest[..v_end].to_string())
        })
        .unwrap_or_else(|| "0.0.0".to_string());

    let dist = Path::new("dist/npm");

    // Clean and create
    let _ = fs::remove_dir_all(dist);
    fs::create_dir_all(dist).unwrap_or_else(|e| {
        eprintln!("error creating dist/npm: {e}");
        process::exit(1);
    });

    // Copy source files
    let source_files = [
        "mod.js",
        "reader.js",
        "compiler.js",
        "expander.js",
        "surface.js",
    ];
    for file in &source_files {
        let src = Path::new("packages/lykn").join(file);
        let dst = dist.join(file);
        fs::copy(&src, &dst).unwrap_or_else(|e| {
            eprintln!("error copying {}: {e}", src.display());
            process::exit(1);
        });
    }

    // Generate package.json
    let package_json = format!(
        r#"{{
  "name": "@lykn/lykn",
  "version": "{version}",
  "description": "S-expression syntax for JavaScript. A lightweight Lisp that compiles to clean JS.",
  "type": "module",
  "main": "./mod.js",
  "exports": {{
    ".": "./mod.js",
    "./reader": "./reader.js",
    "./compiler": "./compiler.js",
    "./expander": "./expander.js"
  }},
  "files": ["*.js", "README.md", "LICENSE"],
  "keywords": ["lisp", "s-expression", "compiler", "javascript", "estree", "sexp", "lykn"],
  "author": "Duncan McGreggor",
  "license": "Apache-2.0",
  "repository": {{
    "type": "git",
    "url": "https://github.com/oxur/lykn"
  }},
  "dependencies": {{
    "astring": "^1.9.0"
  }}
}}
"#
    );
    write_file(&dist.join("package.json"), &package_json);

    // Copy README and LICENSE
    let _ = fs::copy("README.md", dist.join("README.md"));
    let _ = fs::copy("LICENSE", dist.join("LICENSE"));

    eprintln!("npm package built in dist/npm/ (v{version})");
}
