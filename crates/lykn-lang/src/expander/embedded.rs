//! Embedded packages/lang/ source for the Deno subprocess.
//!
//! DD-54: the subprocess uses filesystem imports (./packages/lang/reader.js etc.)
//! relative to its CWD. To make the lykn binary self-contained, packages/lang/
//! is embedded into the binary at compile time and materialized to a known
//! XDG-cache location at runtime.

use include_dir::{Dir, include_dir};
use std::path::{Path, PathBuf};

// Keep this payload inside the crate so `cargo publish --dry-run` verifies the
// same self-contained package that crates.io receives.
static PACKAGES_LANG: Dir<'_> = include_dir!("$CARGO_MANIFEST_DIR/embedded/packages/lang");

pub const EMBEDDED_VERSION: &str = env!("CARGO_PKG_VERSION");

fn embedded_cache_dir() -> PathBuf {
    let cache_root = if let Ok(xdg) = std::env::var("XDG_CACHE_HOME") {
        PathBuf::from(xdg)
    } else if let Ok(home) = std::env::var("HOME") {
        PathBuf::from(home).join(".cache")
    } else {
        std::env::temp_dir()
    };
    cache_root
        .join("lykn")
        .join("embedded")
        .join(EMBEDDED_VERSION)
}

fn cache_is_ready(root: &Path) -> bool {
    let sentinel = root.join("_embedded").join(".lykn-version");
    let Ok(existing) = std::fs::read_to_string(sentinel) else {
        return false;
    };
    if existing.trim() != EMBEDDED_VERSION {
        return false;
    }

    let package_dir = root.join("packages").join("lang");
    package_dir.is_dir()
        && package_dir.join("deno.json").is_file()
        && package_dir.join("deno.lock").is_file()
}

pub fn materialize_packages() -> std::io::Result<PathBuf> {
    let root = embedded_cache_dir();
    if cache_is_ready(&root) {
        return Ok(root);
    }

    let sentinel = root.join("_embedded").join(".lykn-version");
    std::fs::create_dir_all(&root)?;
    let pkg_dir = root.join("packages").join("lang");
    let _ = std::fs::remove_dir_all(&pkg_dir);
    std::fs::create_dir_all(&pkg_dir)?;
    PACKAGES_LANG.extract(&pkg_dir)?;
    std::fs::create_dir_all(sentinel.parent().unwrap())?;
    std::fs::write(&sentinel, EMBEDDED_VERSION)?;

    Ok(root)
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::TempDir;

    fn owned_cache(config: bool, lock: bool) -> TempDir {
        let cache = TempDir::new().expect("create owned embedded-cache fixture");
        let root = cache.path();
        let sentinel = root.join("_embedded").join(".lykn-version");
        std::fs::create_dir_all(sentinel.parent().expect("sentinel parent"))
            .expect("create owned sentinel directory");
        std::fs::write(&sentinel, EMBEDDED_VERSION).expect("write valid version sentinel");

        let package_dir = root.join("packages").join("lang");
        std::fs::create_dir_all(&package_dir).expect("create owned package directory");
        if config {
            std::fs::write(package_dir.join("deno.json"), b"{}").expect("write config fixture");
        }
        if lock {
            std::fs::write(package_dir.join("deno.lock"), b"{}").expect("write lock fixture");
        }
        cache
    }

    #[test]
    fn cache_readiness_requires_both_owned_dependency_files() {
        for (state, config, lock, expected) in [
            ("neither", false, false, false),
            ("config-only", true, false, false),
            ("lock-only", false, true, false),
            ("both", true, true, true),
        ] {
            let cache = owned_cache(config, lock);
            assert_eq!(
                cache_is_ready(cache.path()),
                expected,
                "{state} cache state"
            );
        }
    }
}
