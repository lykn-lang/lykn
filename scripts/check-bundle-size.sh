#!/usr/bin/env bash
# Compare the fixed DD-37 source baseline and HEAD with the same measuring tools.
set -euo pipefail

repo_root=$(git rev-parse --show-toplevel)
baseline_commit=4b9546cdba6bdcd4e5dd82d7cdf6cf58da9edde0
baseline_dir=$(mktemp -d)
trap 'rm -rf "$baseline_dir"' EXIT

# Export source only. Both builds use the current measurement script, config,
# lockfile, Deno, and esbuild. Never substitute HEAD for the historical baseline.
git -C "$repo_root" archive "$baseline_commit" packages | tar -x -C "$baseline_dir"
echo "DD-37 baseline source: $baseline_commit"
deno --version
baseline_output=$(
  cd "$baseline_dir"
  env -u BASELINE_GZIPPED deno run -A --frozen \
    --config "$repo_root/project.json" "$repo_root/scripts/bundle-size.js"
)
printf '%s\n' "$baseline_output"
baseline_bytes=$(printf '%s\n' "$baseline_output" | awk '/^Gzipped:/ {print $2}')
if [[ ! "$baseline_bytes" =~ ^[0-9]+$ ]]; then
  echo "Could not read the historical bundle's compressed size" >&2
  exit 1
fi

echo "Current source, measured with the same tools:"
cd "$repo_root"
BASELINE_GZIPPED="$baseline_bytes" make bundle-size
