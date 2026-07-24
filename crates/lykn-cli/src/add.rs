//! `lykn add <specifier>` — add a committed, **exact-pinned** registry
//! dependency to the root `project.json` (DD-63 / arc06 slice03).
//!
//! Fills the gap DD-51 left (no `deno add` in lykn projects → hand-editing
//! `project.json`) and fixes the audit findings: the scaffold's **unpinned**
//! specifiers (`jsr:@lykn/lang/`, no `@version`) and the **bare + trailing-slash**
//! import pair a human otherwise has to know to hand-write.
//!
//! **Resolution shells to `deno`** — `lykn-cli` has no HTTP client and no semver
//! crate, and lykn shells to deno for all external work. A no-version add fetches
//! the registry metadata through `deno eval` and pins the latest **exact**
//! version; a real semver range engine (`nodejs-semver`) is deferred to the 0.7.0
//! `~>` work where it's actually needed. Never write a floating range in 0.6.0.
//!
//! The local overlay (`lykn link`/`unlink`, `project.local.json`) is **slice04**;
//! this module writes only the committed `project.json`.

use std::path::Path;
use std::process::Command;

use crate::config::{self, PackageKind};

/// Which registry a specifier targets.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Registry {
    Jsr,
    Npm,
}

impl Registry {
    /// The scheme prefix as written in an import specifier (`jsr` / `npm`).
    pub fn scheme(self) -> &'static str {
        match self {
            Registry::Jsr => "jsr",
            Registry::Npm => "npm",
        }
    }
}

/// A parsed `lykn add` specifier: registry + package name + optional version.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Specifier {
    pub registry: Registry,
    /// The package name **including any scope** (`@scope/pkg` or `pkg`).
    pub name: String,
    /// An explicit version, if the user supplied `@version`.
    pub version: Option<String>,
}

/// Parse `jsr:@scope/pkg[@version]` / `npm:[@scope/]pkg[@version]`.
///
/// The scope `@` (leading) is distinguished from a version `@` (after the name)
/// by position: a version separator is an `@` at index > 0 of the post-scheme
/// remainder. JSR packages must be scoped (`@scope/pkg`); npm may be scoped or
/// not.
pub fn parse_specifier(input: &str) -> Result<Specifier, String> {
    let (scheme, rest) = input.split_once(':').ok_or_else(|| {
        format!("missing registry scheme in '{input}' (expected 'jsr:…' or 'npm:…')")
    })?;
    let registry = match scheme {
        "jsr" => Registry::Jsr,
        "npm" => Registry::Npm,
        other => {
            return Err(format!(
                "unknown registry '{other}:' in '{input}' (expected 'jsr:' or 'npm:')"
            ));
        }
    };
    if rest.is_empty() {
        return Err(format!("empty package name in '{input}'"));
    }
    // A version `@` is an `@` after position 0 (position 0 would be the scope).
    let (name, version) = match rest.rfind('@') {
        Some(at) if at > 0 => (&rest[..at], Some(rest[at + 1..].to_string())),
        _ => (rest, None),
    };
    if name.is_empty() {
        return Err(format!("empty package name in '{input}'"));
    }
    if let Some(v) = &version
        && v.is_empty()
    {
        return Err(format!("empty version after '@' in '{input}'"));
    }
    if registry == Registry::Jsr && !(name.starts_with('@') && name.contains('/')) {
        return Err(format!(
            "JSR package must be scoped ('@scope/name'), got '{name}' in '{input}'"
        ));
    }
    Ok(Specifier {
        registry,
        name: name.to_string(),
        version,
    })
}

/// The bare + trailing-slash import pair for a pinned specifier: the **key** is
/// the package name (bare / `name/`), the **value** the exact-pinned specifier
/// (`scheme:name@version` / `…@version/`). Deno resolves the entry from the
/// package's `exports`, so the bare value is the specifier itself (no entry file
/// appended) — the exports fallback matters only for `link` (slice04, local
/// file paths).
pub fn import_pair(spec: &Specifier, version: &str) -> [(String, String); 2] {
    let scheme = spec.registry.scheme();
    let name = &spec.name;
    [
        (name.clone(), format!("{scheme}:{name}@{version}")),
        (format!("{name}/"), format!("{scheme}:{name}@{version}/")),
    ]
}

/// The registry metadata URL and the JS expression that reads `latest` from it.
fn latest_query(spec: &Specifier) -> (String, &'static str) {
    match spec.registry {
        // JSR meta.json: {"scope","name","latest","versions":{…}}
        Registry::Jsr => (
            format!("https://jsr.io/{}/meta.json", spec.name),
            "j.latest",
        ),
        // npm registry document: {"dist-tags":{"latest":…}, …}
        Registry::Npm => (
            format!("https://registry.npmjs.org/{}", spec.name),
            "j['dist-tags'] && j['dist-tags'].latest",
        ),
    }
}

/// Resolve the latest published version of `spec` by fetching registry metadata
/// **through deno** (no Rust HTTP client). Returns the exact version string.
pub fn resolve_latest_version(spec: &Specifier) -> Result<String, String> {
    let (url, field) = latest_query(spec);
    let script = format!(
        "const r = await fetch({url:?}); \
         if (!r.ok) throw new Error('registry returned ' + r.status + ' for {url}'); \
         const j = await r.json(); \
         const v = {field}; \
         if (!v) throw new Error('no latest version in registry metadata'); \
         console.log(v);"
    );
    // `deno eval` runs with all permissions implicitly — it rejects `-A`/
    // `--allow-net`; `fetch` works without a flag.
    let out = run_deno(&["eval", "--ext=js", &script])?;
    let version = String::from_utf8_lossy(&out).trim().to_string();
    if version.is_empty() {
        return Err(format!("empty version resolving latest for {}", spec.name));
    }
    Ok(version)
}

/// Populate the Deno cache for `specifier`, so a bad add fails **now** rather
/// than mid-build. Uses `deno info` (resolves + caches without executing).
pub fn cache_specifier(specifier: &str) -> Result<(), String> {
    run_deno(&["info", specifier]).map(|_| ())
}

/// Run `deno` with `args`, returning stdout on success or a message on failure
/// (including the not-installed case).
fn run_deno(args: &[&str]) -> Result<Vec<u8>, String> {
    let out = Command::new("deno").args(args).output().map_err(|e| {
        if e.kind() == std::io::ErrorKind::NotFound {
            "lykn add requires Deno — install from https://deno.land".to_string()
        } else {
            format!("failed to run deno: {e}")
        }
    })?;
    if out.status.success() {
        Ok(out.stdout)
    } else {
        Err(String::from_utf8_lossy(&out.stderr).trim().to_string())
    }
}

/// Best-effort read of the added package's [`PackageKind`] (the macro axis). For
/// JSR, fetch the published `deno.json`'s `"lykn": {"kind": …}`; npm packages and
/// any fetch failure default to [`PackageKind::Runtime`]. A `MacroModule` still
/// gets the same bare+slash pair — the bare key *is* the macro specifier, so
/// `(import-macros "jsr:@scope/pkg" …)` resolves — so this is informational /
/// validating, not a different write.
pub fn detect_kind(spec: &Specifier, version: &str) -> PackageKind {
    if spec.registry != Registry::Jsr {
        return PackageKind::Runtime;
    }
    let url = format!("https://jsr.io/{}/{}/deno.json", spec.name, version);
    let script = format!(
        "const r = await fetch({url:?}); if (!r.ok) {{ console.log(''); }} \
         else {{ const j = await r.json(); console.log((j.lykn && j.lykn.kind) || ''); }}"
    );
    match run_deno(&["eval", "--ext=js", &script]) {
        Ok(out) => kind_from_str(String::from_utf8_lossy(&out).trim()),
        Err(_) => PackageKind::Runtime,
    }
}

/// Map a `"lykn.kind"` string to a [`PackageKind`] (kebab-case, matching the
/// serde rename). Unknown / empty → `Runtime`.
fn kind_from_str(s: &str) -> PackageKind {
    match s {
        "macro-module" => PackageKind::MacroModule,
        "tooling" => PackageKind::Tooling,
        _ => PackageKind::Runtime,
    }
}

/// Add/update `entries` in the root `project.json`'s `imports`, **idempotently**:
/// re-adding an existing key updates its value **in place** (order preserved),
/// a new key is appended. Only the `imports` object's text is rewritten — every
/// other key (`workspace`, `lint`, `tasks`, …) stays byte-identical, matching the
/// file's indentation.
pub fn upsert_imports(project_json: &Path, entries: &[(String, String)]) -> Result<(), String> {
    let text = std::fs::read_to_string(project_json)
        .map_err(|e| format!("cannot read {}: {e}", project_json.display()))?;
    let mut imports = config::read_project_config(project_json)
        .map_err(|e| format!("cannot parse {}: {e}", project_json.display()))?
        .imports;
    for (k, v) in entries {
        imports.insert(k.clone(), v.clone()); // IndexMap: update-in-place or append
    }
    let new_text = splice_imports(&text, &imports)?;
    std::fs::write(project_json, new_text)
        .map_err(|e| format!("cannot write {}: {e}", project_json.display()))?;
    Ok(())
}

/// Replace the `imports` object in `text` with a rendering of `imports`,
/// preserving the file's indentation and everything outside the object.
fn splice_imports(
    text: &str,
    imports: &indexmap::IndexMap<String, String>,
) -> Result<String, String> {
    let key_pos = text
        .find("\"imports\"")
        .ok_or_else(|| "project.json has no \"imports\" key".to_string())?;
    let open = text[key_pos..]
        .find('{')
        .map(|o| key_pos + o)
        .ok_or_else(|| "malformed \"imports\" (no '{')".to_string())?;
    let close =
        object_end(text, open).ok_or_else(|| "malformed \"imports\" (unbalanced)".to_string())?;

    // Indentation: the whitespace before "imports" on its line is the base; one
    // more unit indents the entries.
    let line_start = text[..key_pos].rfind('\n').map(|n| n + 1).unwrap_or(0);
    let base_indent = &text[line_start..key_pos];
    let unit = indent_unit(text);
    let entry_indent = format!("{base_indent}{unit}");

    let rendered = render_imports(imports, &entry_indent, base_indent);
    Ok(format!(
        "{}{}{}",
        &text[..open],
        rendered,
        &text[close + 1..]
    ))
}

/// Render an imports object body: `{\n<entry>"k": "v",\n…\n<base>}`. An empty map
/// renders as `{}`.
fn render_imports(
    imports: &indexmap::IndexMap<String, String>,
    entry_indent: &str,
    base_indent: &str,
) -> String {
    if imports.is_empty() {
        return "{}".to_string();
    }
    let mut out = String::from("{\n");
    let n = imports.len();
    for (i, (k, v)) in imports.iter().enumerate() {
        let comma = if i + 1 < n { "," } else { "" };
        out.push_str(&format!(
            "{entry_indent}{}: {}{comma}\n",
            json_string(k),
            json_string(v)
        ));
    }
    out.push_str(base_indent);
    out.push('}');
    out
}

/// JSON-encode a string (quotes + minimal escaping) — import keys/values are
/// simple (`@scope/pkg`, `jsr:…`), but escape defensively.
fn json_string(s: &str) -> String {
    let mut out = String::with_capacity(s.len() + 2);
    out.push('"');
    for c in s.chars() {
        match c {
            '"' => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            '\n' => out.push_str("\\n"),
            '\t' => out.push_str("\\t"),
            _ => out.push(c),
        }
    }
    out.push('"');
    out
}

/// Index of the `}` matching the `{` at `open`, ignoring braces inside strings.
fn object_end(text: &str, open: usize) -> Option<usize> {
    let bytes = text.as_bytes();
    let mut depth = 0usize;
    let mut in_str = false;
    let mut esc = false;
    for (i, &c) in bytes.iter().enumerate().skip(open) {
        if in_str {
            match c {
                b'\\' if !esc => esc = true,
                b'"' if !esc => in_str = false,
                _ => esc = false,
            }
        } else {
            match c {
                b'"' => in_str = true,
                b'{' => depth += 1,
                b'}' => {
                    depth -= 1;
                    if depth == 0 {
                        return Some(i);
                    }
                }
                _ => {}
            }
        }
    }
    None
}

/// The file's indentation unit — the leading whitespace of the first indented
/// line (lykn's templates use 4 spaces). Falls back to 4 spaces.
fn indent_unit(text: &str) -> String {
    for line in text.lines() {
        let ws: String = line
            .chars()
            .take_while(|c| *c == ' ' || *c == '\t')
            .collect();
        if !ws.is_empty() && ws.len() < line.len() {
            return ws;
        }
    }
    "    ".to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse_jsr_scoped_with_and_without_version() {
        assert_eq!(
            parse_specifier("jsr:@std/assert").unwrap(),
            Specifier {
                registry: Registry::Jsr,
                name: "@std/assert".into(),
                version: None
            }
        );
        assert_eq!(
            parse_specifier("jsr:@lykn/lang@0.6.0").unwrap(),
            Specifier {
                registry: Registry::Jsr,
                name: "@lykn/lang".into(),
                version: Some("0.6.0".into())
            }
        );
    }

    #[test]
    fn parse_npm_scoped_and_unscoped() {
        assert_eq!(parse_specifier("npm:astring").unwrap().name, "astring");
        assert_eq!(
            parse_specifier("npm:astring@1.9.0").unwrap().version,
            Some("1.9.0".into())
        );
        let scoped = parse_specifier("npm:@babel/core@7.0.0").unwrap();
        assert_eq!(scoped.name, "@babel/core");
        assert_eq!(scoped.version, Some("7.0.0".into()));
    }

    #[test]
    fn parse_rejects_malformed() {
        assert!(parse_specifier("astring").is_err()); // no scheme
        assert!(parse_specifier("pip:requests").is_err()); // unknown scheme
        assert!(parse_specifier("jsr:").is_err()); // empty
        assert!(parse_specifier("jsr:notscoped").is_err()); // jsr must be scoped
        assert!(parse_specifier("npm:astring@").is_err()); // empty version
    }

    #[test]
    fn import_pair_is_exact_and_paired() {
        let spec = parse_specifier("jsr:@lykn/foo").unwrap();
        let pair = import_pair(&spec, "0.6.0");
        assert_eq!(pair[0], ("@lykn/foo".into(), "jsr:@lykn/foo@0.6.0".into()));
        assert_eq!(
            pair[1],
            ("@lykn/foo/".into(), "jsr:@lykn/foo@0.6.0/".into())
        );
        // no floating range anywhere
        assert!(!pair[0].1.contains('^') && !pair[0].1.contains('~'));

        let npm = parse_specifier("npm:astring").unwrap();
        let np = import_pair(&npm, "1.9.0");
        assert_eq!(np[0], ("astring".into(), "npm:astring@1.9.0".into()));
        assert_eq!(np[1], ("astring/".into(), "npm:astring@1.9.0/".into()));
    }

    #[test]
    fn kind_from_str_maps_kebab() {
        assert_eq!(kind_from_str("macro-module"), PackageKind::MacroModule);
        assert_eq!(kind_from_str("tooling"), PackageKind::Tooling);
        assert_eq!(kind_from_str("runtime"), PackageKind::Runtime);
        assert_eq!(kind_from_str(""), PackageKind::Runtime);
    }

    const TEMPLATE: &str = r#"{
    "workspace": ["./packages/app"],
    "imports": {
        "app/": "./target/lykn/build/app/",
        "astring": "npm:astring@^1.9.0"
    },
    "lint": {
        "rules": {
            "exclude": ["no-slow-types"]
        }
    },
    "tasks": {
        "test": "deno test -A test/"
    }
}
"#;

    fn write_temp(text: &str) -> (tempfile::TempDir, std::path::PathBuf) {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("project.json");
        std::fs::write(&path, text).unwrap();
        (dir, path)
    }

    #[test]
    fn upsert_appends_new_pair_preserving_everything_else() {
        let (_d, path) = write_temp(TEMPLATE);
        upsert_imports(
            &path,
            &[
                ("@std/assert".into(), "jsr:@std/assert@1.0.0".into()),
                ("@std/assert/".into(), "jsr:@std/assert@1.0.0/".into()),
            ],
        )
        .unwrap();
        let out = std::fs::read_to_string(&path).unwrap();
        // new keys present, exact-pinned
        assert!(out.contains("\"@std/assert\": \"jsr:@std/assert@1.0.0\""));
        assert!(out.contains("\"@std/assert/\": \"jsr:@std/assert@1.0.0/\""));
        // existing content untouched (workspace, lint, tasks, the old import)
        assert!(out.contains("\"workspace\": [\"./packages/app\"]"));
        assert!(out.contains("\"astring\": \"npm:astring@^1.9.0\""));
        assert!(out.contains("\"exclude\": [\"no-slow-types\"]"));
        assert!(out.contains("\"test\": \"deno test -A test/\""));
        // order preserved: app/ before astring before the new @std/assert
        let ia = out.find("\"app/\"").unwrap();
        let ib = out.find("\"astring\"").unwrap();
        let ic = out.find("\"@std/assert\"").unwrap();
        assert!(ia < ib && ib < ic, "insertion order preserved");
        // 4-space indent preserved on entries
        assert!(out.contains("\n        \"@std/assert\":"));
    }

    #[test]
    fn upsert_is_idempotent_updates_in_place() {
        let (_d, path) = write_temp(TEMPLATE);
        let e1 = [("@lykn/foo".to_string(), "jsr:@lykn/foo@0.6.0".to_string())];
        upsert_imports(&path, &e1).unwrap();
        let after_first = std::fs::read_to_string(&path).unwrap();
        // re-add same key with a new pin → updates in place, no duplicate
        let e2 = [("@lykn/foo".to_string(), "jsr:@lykn/foo@0.7.0".to_string())];
        upsert_imports(&path, &e2).unwrap();
        let after_second = std::fs::read_to_string(&path).unwrap();
        assert_eq!(
            after_second.matches("\"@lykn/foo\":").count(),
            1,
            "no dup key"
        );
        assert!(after_second.contains("jsr:@lykn/foo@0.7.0"));
        assert!(!after_second.contains("jsr:@lykn/foo@0.6.0"));
        // the pin update is the only change vs the first write's structure
        assert_eq!(
            after_first.replace("0.6.0", "0.7.0"),
            after_second,
            "only the pin changed"
        );
    }
}
