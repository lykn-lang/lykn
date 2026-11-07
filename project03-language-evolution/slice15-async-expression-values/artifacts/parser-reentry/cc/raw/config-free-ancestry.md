# Config-free source, compiled and runtime homes

Scratch root: `/private/tmp/lykn-parser-reentry-c7-5408abd-cc-20261106` with `source/`, `compiled/`, and `cwd/` children. The only pre-runtime files under the root are the three frozen `.lykn` inputs under `source/`; `compiled/` and `cwd/` were empty.

From `cwd/`, the following bounded searches produced no paths: `find <scratch-root> -type f -name project.json -o -name deno.json`; the same `find` over `/private/tmp` maxdepth 1, `/private` maxdepth 1, and `/` maxdepth 1. The accepted CLI's `find_config_in` checks `project.json` and `deno.json` upward from cwd; neither exists along cwd or source ancestry. Deno check/load invocations also use explicit `--no-config`.

Input copy hashes in `source/` match the pre-check frozen planning inputs: core `6ca1afe83d6d9a47f7eb1fea7f0aa3872ae626cc4f39d5b3ed017aab38308bf7`, probe `7d2dc80a7366556b9e753c8af75b0d0b8d66d8154ee4e343ef56b43cf090b7b9`, observer `f109f7b47d7086648596e6ca829c4e2746ce7d80605f0145e391c2f5d13c23b2`.
