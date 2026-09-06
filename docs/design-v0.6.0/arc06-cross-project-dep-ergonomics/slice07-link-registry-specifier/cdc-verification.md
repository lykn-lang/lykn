# arc06 · slice07 — CDC Verification (`lykn link` for a literal registry specifier)

**By:** CDC · **Date:** 2026-07-24 · **Branch:** `release/0.6.x`
**Verifying:** `58e22e8` + `be72c37` (slice) and `72a1cfd` + `70666d0` (iteration 1)
**Verdict: CLOSE.** All nine ledger rows verified. Iteration 1 resolved every
review finding, and two of the resolutions are better than what was asked for.

## Method and evidence strength

I read the **post-fix source at HEAD**, not CC's diffs or summary — direct
inspection of the artifact. That supports every structural claim below at
*reproduced-by-inspection*. I ran nothing: this sandbox has no
deno/cargo/lykn. Every runtime row (`make check`, the deno probe, the mycelium
demo) is **CC-attested** and reconciles on the operator's host. Where a row's
evidence is runtime-only I say so rather than inheriting the claim.

Closer ≠ verifier: CC wrote the closing report, I wrote this.

## Per-row verification (9 rows in, 9 out)

| Row | Closing claim | CDC finding |
|-----|---------------|-------------|
| **R-1** | 07a recon + operator sign-off | **Verified.** `recon-findings.md` present; the resolver-ordering premise is confirmed by the code itself — Tier 1 preceded the map lookup before this slice. Premise held, unlike slice03. |
| **S-1** | Tier-0 exact override, guarded to non-scheme targets | **Verified at `pass0.rs:195+`.** Guard is `!is_scheme_specifier(target)`. Evidence cell was amended in iteration 1 and now names which test covers which property — accurate as amended. |
| **S-2** | `lykn link <jsr:/npm: spec>` → require-dist, exact-key overlay | **Verified.** `cmd_link_specifier` reuses `add::parse_specifier`, derives the unscoped last segment, requires `target/lykn/dist/<pkg>/`, writes through `config::write_overlay`. Host link output CC-attested. |
| **S-3** | `unlink <spec>` removes the exact key only | **Verified.** Scheme branch yields `[specifier]` with no slash variant — correctly asymmetric with the package-name path. |
| **S-4** | Effective-config fix | **Verified after iteration 1** — see F1/F3 below. Was `done`, correctly reopened, now genuinely done *with tests*. The drop-workspace scoped assumption is disclosed in Notes as requested. |
| **S-5** | SAFETY — dist/publish ignore the override | **Verified architecturally by inspection.** `cmd_link_specifier` only ever calls `config::write_overlay` (→ `project.local.json`); `dist.rs` reads raw `read_project_config`; `find_config()` is a distinct call site from the effective path. A linked local path cannot reach a published package by construction, not merely by test. "0 override refs in dist output" is CC-attested. |
| **S-6** | mycelium demo + negative proof | **CC-attested, not independently verified** (host-only). The negative proof — renaming the local dist produces `no macro entry found in …/dist/testing/` — is the right shape: it demonstrates the override was *active*, which a passing test alone would not. |
| **S-7** | `make check` green, scoped diff, no new deps | **Diff scope verified** (`config.rs`, `main.rs`, `pass0.rs`; `Cargo.toml` untouched). `make check` CC-attested. |
| **S-8** | Runtime-import scope boundary *(added in iteration 1)* | **Verified as scoped.** See F4. Row addition is correctly disclosed as 8→9 rather than folded in silently. |

## Iteration 1 findings — disposition

| # | Verdict |
|---|---------|
| **F1** (blocking) | **Fixed, and the fix is better than what I specified.** The insert is hoisted (`config.rs`, `build_effective_config`) and creates `imports` when absent. CC added something I didn't ask for and should have: a malformed non-object `imports` now warns to stderr and returns `None`, so the caller falls back to the **raw** config rather than fabricating an override-free one. That is the correct failure direction — the old code's sin was producing a config that looked authoritative and wasn't. Base-imports absolutization is preserved in its own block; the malformed check runs *before* `entry()`, so it can't be defeated by insertion order. |
| **F2** | **Fixed.** `test_is_scheme_specifier` added at `pass0.rs:1171` — direct, network-free, no `deno_available()` guard, so it runs everywhere. The mis-named test is renamed to `test_resolve_specifier_local_alias_override_resolves_via_tier0` (`:1193`), which is what it always actually tested. The guard now has real coverage. |
| **F3** | **Fixed, and structurally better.** `build_effective_config(root, overlay)` is split out CWD-free — the right refactor, since the untestability *was* the defect's cause. Four table tests at `config.rs:810/830/858/868` cover no-base-imports (F1 falls out of row one), absolutize + registry/absolute passthrough, empty-imports-object, and malformed→`None`. |
| **F4** (host question) | **Answered, and the answer is the good one.** My concern was a *silent* fallback to the published package. CC's host check found deno honours the entry but resolves to a directory, so a runtime import **errors loudly** rather than mis-resolving. Worst case disarmed. Capability correctly narrowed rather than left overclaimed: `main.rs` help now says MACRO MODULE and states explicitly that a runtime import errors and that full runtime override is 0.7.0. This is the right call — help text should never be broader than the demonstrated capability. |
| **F5** | **Fixed.** `is_scheme_specifier` moved above with its own doc; `resolve_specifier`'s doc restored at `pass0.rs:189`. CC went further than asked: the header now reads "tiered dispatch" instead of "three-tier" and a **Tier 0** paragraph leads the block. All four tiers documented. |
| **F6** (optional) | **Taken.** Tier-2 comment added (`pass0.rs:249-252`) naming that Tier 0 already consumed every local-target exact match. Tier 0 deliberately left unguarded for `module_path` shape — recorded as a decision rather than left as an accident, which is exactly what I asked for. |

## Bubble-up verification

**Did slice07 deliver its assigned piece?** Yes — and note it had *no* assigned
piece at open, because slice07 did not exist in `arc-plan.md`. It originated in
the operator's host-reconcile runsheet pass. Measured against the runsheet's
routed C-bis limitation, it delivers: a downstream can develop a macro
dependency against a local checkout by its published specifier and flip back
with `unlink`, with slice04's safety property intact.

**Silent-drop diff — complete and honest.** Scope-as-delivered is *narrower*
than the original help text implied, and iteration 1 corrected the text rather
than the claim. Two items routed forward, both named with homes:

1. Full runtime override of a linked literal specifier (exact→entry-file +
   slash→dir pair) → 0.7.0.
2. Whether the drop-workspace scoped assumption warrants its own row.

**On (2), my call: no separate row — but it needs a 0.7.x BACKLOG entry.** The
assumption is disclosed in S-4's Notes, which satisfies anti-silent-drop. What
it does *not* have is a re-entry condition, and arc06's whole subject is
multi-package downstream ergonomics with a multi-package scaffold gap already on
the arc07 reconcile list. A backlog row with the trigger "*first multi-package
downstream that links*" gives it a home that can be opened. Per the lesson from
`D-2607-8HTN`: name a home, not an owner.

**Arc-plan change required?** Already made, before this verification —
`arc-plan.md` v1.3 added slices 06/07 to a breakdown that had gone stale at
slice02, and added ledger rows **A-8**/**A-9**. One amendment now owed: **A-9's
scope line should carry the macro-module boundary**, so the arc ledger doesn't
inherit the pre-iteration overclaim.

## What this slice says about the process

Worth recording, because it cuts both ways.

The review caught a **blocking regression that `make check` could not have
caught**, in a function with zero test coverage that had just been rewritten
three ways at once. The causal chain is exact: no coverage → rewrite → silent
defect. F3's fix removes the cause, not just the symptom.

And the mis-named test (F2) is the more interesting failure. It was not a
missing test — it was a test that *asserted the wrong thing under a name that
claimed otherwise*, so the ledger, the commit message and the closing report all
inherited a guarantee nothing checked. **A test whose name overclaims is worse
than a missing test**, because it converts absence-of-evidence into
apparent-evidence at three levels of documentation at once. Both are logged:
`D-2607-H4TC` and `D-2607-B8SY`, now closeable.

## Verdict

**slice07 CLOSES.** Nine rows, nine verified — structural claims by inspection
at HEAD, runtime rows CC-attested and reconciling on host.

**Remaining blocker to the arc06 gate:** arc06's `closing-report.md` is marked
*superseded in part* (it predates slices 06 and 07). It must be **re-issued** —
not edited in place — covering the full seven-slice walk and a composition check
that includes the linked-specifier capability. With slice07 closed, A-9 is
satisfied and nothing else stands in the way.
