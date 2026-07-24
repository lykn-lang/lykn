# arc06 · slice07 — Ledger (`lykn link` for a literal registry specifier)

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md` §A. Recon-first
(07a) → sign-off → implement (07b). CC lands + attests `make check` + the
mycelium demo; CDC verifies the resolver override, the CLI, the safety property,
and the effective-config fix against `lang`. Closer ≠ verifier.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| R-1 | **07a recon** — the resolver ordering finding + a failing→passing proof that an exact override is honored once hooked; the macro-source fork surfaced. Sign-off gate. | `recon-findings.md`; the spike proof | **serious** | slice07 split | **done** | `resolve_specifier` checks scheme (Tier 1) before the map → a literal `jsr:` bypasses overrides (proven: WITHOUT hook → JSR cache path; WITH → local). Macro modules need `mod.lykn` (dist), not the build dir's `.js`. Operator signed off (dist target) | premise HOLDS |
| S-1 | **Resolver Tier-0 exact override** — an exact import-map entry redirects a specifier (incl. literal `jsr:`/`npm:`) to a LOCAL target, ahead of the scheme branch; guarded to a non-scheme target so it can't reroute registry→registry. | read `pass0::resolve_specifier`; unit tests | **serious** | 07a | **done** | `pass0.rs` Tier 0 + `is_scheme_specifier`; `test_resolve_specifier_literal_specifier_override_wins_over_scheme` + `_scheme_target_override_is_not_taken`; 11/11 resolver tests green (existing unaffected) | one lookup, plumbing pre-existed |
| S-2 | **`lykn link <jsr:/npm: spec> <path>`** — derive pkg→`target/lykn/dist/<pkg>/` (require-dist), write an **exact-key** overlay entry. | read `cmd_link_specifier`; host link | serious | slice07 | **done** | `main.rs` `cmd_link` branches on scheme → `cmd_link_specifier` (reuses `add::parse_specifier`; unscoped last segment = dir; require-dist error). Host: `lykn link jsr:@lykn/testing@0.5.2 …` → overlay `"jsr:@lykn/testing@0.5.2": ".../dist/testing/"` | reuses slice04 overlay writer |
| S-3 | **`lykn unlink <spec>`** removes the exact key (no slash variant for a literal specifier). | read `cmd_unlink`; host unlink | correctness | slice07 | **done** | `cmd_unlink` branches on scheme → `[specifier]`; host: unlink → `project.local.json` removed, clean | |
| S-4 | **Effective-config fix (pre-existing slice04 bug)** — with an overlay, run/test on a project with a `workspace` field or relative self-package imports must work. | read `write_effective_deno_config`; host `lykn test` | **serious** | surfaced by the demo | **done** | absolutize **base** imports (+overlay) against root; **drop `workspace`** (deno requires members nested under the config dir; publish uses raw config). Host: mycelium `lykn test` green with the overlay | text-splice → `Value` round-trip (strict JSON; jsonc never supported) |
| S-5 | **SAFETY — dist/publish ignore the override** — a linked literal specifier is **absent** from `lykn dist` output. | grep dist call sites; host dist | **serious** | slice04 property | **done** (CC-attested) | `dist.rs` reads raw `read_project_config` (unchanged); host: `lykn dist` after linking → **0** `dist/testing`/override in staged `project.json`. Same architectural guarantee, new key type | |
| S-6 | **Demo — the real C-bis** — mycelium links current-source testing, `lykn build` + `lykn test` **43/0**; proven the override is *active*. | host demo + negative test | **serious** | runsheet C-bis | **done** (CC-attested) | scratch branch: link → build ✓ · test **43/0**. **Negative proof:** rename local dist → `import-macros: no macro entry found in …/dist/testing/` (was using local); restore → green. mycelium restored (unlinked, branch deleted) | |
| S-7 | **`make check` green; scoped diff; no new deps** — `pass0.rs` + `main.rs` + `config.rs` only. | host `make check`; `git show --stat`; `Cargo.toml` | serious | recon discipline | **done** (CC-attested) | `make check` ✓ (build+lint+test, 476 doc blocks). Diff: `pass0.rs` (Tier 0 + 2 tests), `main.rs` (cmd_link branch + cmd_link_specifier + cmd_unlink + help), `config.rs` (effective-config fix). `Cargo.toml` untouched | |

## Closure

Closed at `<CDC-fills>` (CC-attested; `make check` + the mycelium demo reconcile
on host). Rows: 8 (R-1 + S-1…S-7). Done: 8. _(On close: CDC verifies the Tier-0
override + guard against `lang`, the `lykn link` specifier branch + require-dist,
the effective-config fix — absolutize base imports + drop workspace — and the
dist-safety property; runtime rows reconcile on host. This closes the runsheet's
routed C-bis limitation as a shipped 0.6.0 capability.)_
