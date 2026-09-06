# arc06 · slice07 — Ledger (`lykn link` for a literal registry specifier)

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md` §A. Recon-first
(07a) → sign-off → implement (07b). CC lands + attests `make check` + the
mycelium demo; CDC verifies the resolver override, the CLI, the safety property,
and the effective-config fix against `lang`. Closer ≠ verifier.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| R-1 | **07a recon** — the resolver ordering finding + a failing→passing proof that an exact override is honored once hooked; the macro-source fork surfaced. Sign-off gate. | `recon-findings.md`; the spike proof | **serious** | slice07 split | **done** | `resolve_specifier` checks scheme (Tier 1) before the map → a literal `jsr:` bypasses overrides (proven: WITHOUT hook → JSR cache path; WITH → local). Macro modules need `mod.lykn` (dist), not the build dir's `.js`. Operator signed off (dist target) | premise HOLDS |
| S-1 | **Resolver Tier-0 exact override** — an exact import-map entry redirects a specifier (incl. literal `jsr:`/`npm:`) to a LOCAL target, ahead of the scheme branch; guarded to a non-scheme target so it can't reroute registry→registry. | read `pass0::resolve_specifier`; unit tests | **serious** | 07a | **done** | `pass0.rs` Tier 0 + `is_scheme_specifier`. **Positive** path: `test_resolve_specifier_literal_specifier_override_wins_over_scheme` (literal `jsr:`→local) + `_local_alias_override_resolves_via_tier0` (bare alias→local). **Guard** (`!is_scheme_specifier`, the "never reroute registry→registry" claim): `test_is_scheme_specifier` (direct, network-free). 12/12 resolver+guard tests green (existing unaffected) | iter1 F2: fixed a mis-named test that tested the positive path, not the guard; guard now covered directly |
| S-2 | **`lykn link <jsr:/npm: spec> <path>`** — derive pkg→`target/lykn/dist/<pkg>/` (require-dist), write an **exact-key** overlay entry. | read `cmd_link_specifier`; host link | serious | slice07 | **done** | `main.rs` `cmd_link` branches on scheme → `cmd_link_specifier` (reuses `add::parse_specifier`; unscoped last segment = dir; require-dist error). Host: `lykn link jsr:@lykn/testing@0.5.2 …` → overlay `"jsr:@lykn/testing@0.5.2": ".../dist/testing/"` | reuses slice04 overlay writer |
| S-3 | **`lykn unlink <spec>`** removes the exact key (no slash variant for a literal specifier). | read `cmd_unlink`; host unlink | correctness | slice07 | **done** | `cmd_unlink` branches on scheme → `[specifier]`; host: unlink → `project.local.json` removed, clean | |
| S-4 | **Effective-config fix (pre-existing slice04 bug)** — with an overlay, run/test on a project with a `workspace` field or relative self-package imports must work. | read `build_effective_config`; unit tests; host `lykn test` | **serious** | surfaced by the demo | **done** | absolutize **base** imports (+overlay) against root; **drop `workspace`**; overlay insertion **hoisted** so it lands even with no base `imports` (iter1 F1). Logic split into `build_effective_config` (CWD-free) + 4 table tests (`build_effective_config_*`): no-base-imports+workspace, absolutize/registry/absolute, empty-imports, malformed→None. Host: mycelium `lykn test` green + F1 repro (`{"workspace":[]}` → override present). text-splice → `Value` round-trip (strict JSON; jsonc never supported) | **Scoped assumption (drop-workspace):** verified on mycelium's shape; workspace-member resolution *under an overlay* is not otherwise exercised. It's a linked-vs-unlinked dev delta (unlinked gets raw `project.json` *with* `workspace`). Sound for the nesting constraint; disclosed, not asserted-universal. Pairs with the arc07 multi-package-scaffold reconcile item |
| S-5 | **SAFETY — dist/publish ignore the override** — a linked literal specifier is **absent** from `lykn dist` output. | grep dist call sites; host dist | **serious** | slice04 property | **done** (CC-attested) | `dist.rs` reads raw `read_project_config` (unchanged); host: `lykn dist` after linking → **0** `dist/testing`/override in staged `project.json`. Same architectural guarantee, new key type | |
| S-6 | **Demo — the real C-bis** — mycelium links current-source testing, `lykn build` + `lykn test` **43/0**; proven the override is *active*. | host demo + negative test | **serious** | runsheet C-bis | **done** (CC-attested) | scratch branch: link → build ✓ · test **43/0**. **Negative proof:** rename local dist → `import-macros: no macro entry found in …/dist/testing/` (was using local); restore → green. mycelium restored (unlinked, branch deleted) | |
| S-7 | **`make check` green; scoped diff; no new deps** — `pass0.rs` + `main.rs` + `config.rs` only. | host `make check`; `git show --stat`; `Cargo.toml` | serious | recon discipline | **done** (CC-attested) | `make check` ✓ (build+lint+test, 476 doc blocks). Diff: `pass0.rs` (Tier 0 + guard + 3 tests), `main.rs` (cmd_link branch + cmd_link_specifier + cmd_unlink + help), `config.rs` (effective-config fix + `build_effective_config` split + 4 tests). `Cargo.toml` untouched | |
| S-8 | **Runtime-import scope of a linked literal specifier** (iter1 F4) — the demonstrated capability's boundary. | host: `deno run --config <effective>` probe | **serious** | iteration 1 / CDC review | **done** (CC-attested) | **Macro modules: work** (S-6, proven). **Runtime imports of a linked specifier: error loudly, never silently mis-resolve** — host probe: deno *honors* the entry (`import.meta.resolve` → the local dir) but exact `import` → **"Is a directory"** error; a subpath → published-exports error (not a silent published fallback — CDC's worst-fear disarmed). Help text narrowed to macro modules + the runtime caveat. Full runtime override (exact→entry-file + slash→dir) **routed to 0.7.0** | the honest boundary; not a silent-wrong |

## Closure

Closed at `<CDC-fills>` (CC-attested; `make check` + the mycelium demo reconcile
on host). Rows: **9** (R-1 + S-1…S-8; S-8 added in iteration 1). Done: 9.
_(On close: CDC verifies the Tier-0 override + guard against `lang`, the
`lykn link` specifier branch + require-dist, the effective-config fix
[absolutize base imports + hoisted overlay + drop workspace] + its tests, the
dist-safety property, and the S-8 runtime boundary; runtime rows reconcile on
host. This closes the runsheet's routed C-bis limitation as a shipped 0.6.0
capability — for macro modules; runtime override is 0.7.0.)_

## Iteration 1 (2026-07-24, CDC review → CC)

Against `58e22e8`/`be72c37`. Six findings, all resolved in the three touched
files; `make check` green.

- **F1 (blocking)** — overlay silently dropped when `project.json` had no
  `imports` key: the insertion was nested inside `if let Some(imports)`. Hoisted
  out (create `imports` when absent; malformed→`None`+warn). Repro confirmed
  (`{"workspace":[]}` → override now present in the effective config). **S-4.**
- **F2** — the guard test tested the positive path, not `!is_scheme_specifier`.
  Renamed it; added a direct `test_is_scheme_specifier`. **S-1.**
- **F3** — `write_effective_deno_config` had no coverage + was materially
  rewritten. Split out CWD-free `build_effective_config` + 4 table tests. **S-4.**
- **F4** — runtime-import boundary (host-checked): deno errors loudly (never
  silently mis-resolves); capability scoped to macro modules; help narrowed;
  runtime override routed to 0.7.0. **New S-8.**
- **F5** — `is_scheme_specifier` had stolen `resolve_specifier`'s doc; moved the
  helper above, restored + extended the doc with a Tier 0 paragraph.
- **F6** — added the Tier-2-exact clarifying comment (local targets short-circuit
  at Tier 0). Kept Tier 0 unguarded for `module_path` (overlay keys are names/
  specifiers, never `./`../`/` — decision, not accident; noted here).
