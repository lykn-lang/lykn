//! Shared utility functions for the lykn CLI.

use std::fs;
use std::path::{Path, PathBuf};

/// Check whether a file extension is a lykn source extension (`.lykn` or `.lyk`).
pub fn is_lykn_ext(ext: &std::ffi::OsStr) -> bool {
    ext == "lykn" || ext == "lyk"
}

/// Check whether a path has a lykn source extension.
pub fn has_lykn_ext(path: &Path) -> bool {
    path.extension().is_some_and(is_lykn_ext)
}

/// Walk up from `start` looking for a directory where `predicate` returns true.
///
/// Returns the first ancestor directory (including `start` itself) for which
/// `predicate(&dir)` returns `true`, or `None` if the filesystem root is
/// reached without a match.
pub fn walk_up_find<F>(start: &Path, predicate: F) -> Option<PathBuf>
where
    F: Fn(&Path) -> bool,
{
    let mut dir = start;
    loop {
        if predicate(dir) {
            return Some(dir.to_path_buf());
        }
        match dir.parent() {
            Some(parent) => dir = parent,
            None => return None,
        }
    }
}

/// Recursively collect files matching `predicate` from a directory tree.
///
/// Results are sorted for deterministic ordering.
pub fn collect_files_recursive<F>(dir: &Path, predicate: F) -> Vec<PathBuf>
where
    F: Fn(&Path) -> bool,
{
    let mut results = Vec::new();
    collect_files_inner(dir, &predicate, &mut results);
    results.sort();
    results
}

fn collect_files_inner<F>(dir: &Path, predicate: &F, results: &mut Vec<PathBuf>)
where
    F: Fn(&Path) -> bool,
{
    let entries = match fs::read_dir(dir) {
        Ok(entries) => entries,
        Err(_) => return,
    };
    for entry in entries.flatten() {
        let path = entry.path();
        if path.is_dir() {
            collect_files_inner(&path, predicate, results);
        } else if predicate(&path) {
            results.push(path);
        }
    }
}

/// Read and deserialize a JSON file, mapping I/O and parse errors to
/// [`crate::config::ConfigError`].
pub fn read_json_file<T: serde::de::DeserializeOwned>(
    path: &Path,
) -> Result<T, crate::config::ConfigError> {
    let content = fs::read_to_string(path).map_err(|e| crate::config::ConfigError::Io {
        path: path.to_path_buf(),
        source: e,
    })?;
    serde_json::from_str(&content).map_err(|e| crate::config::ConfigError::Parse {
        path: path.to_path_buf(),
        source: e,
    })
}
