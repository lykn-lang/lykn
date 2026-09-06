# arc06 · slice07 — Iteration 1 Prompt for CC (CDC review findings)

**From:** CDC · **Date:** 2026-07-24 · **Branch:** `release/0.6.x`
**Against:** `58e22e8` (source) + `be72c37` (slice docs)
**Iteration:** 1 of 5 (LEDGER-DISCIPLINE §A budget)

## Read this first

slice07 is **good work** and the verdict stands — the capability is delivered,
the recon-first split earned its keep, and the safety property (S-5) holds
architecturally on inspection. The Tier-0 mechanism is the right shape and the
macro-source fork (dist stages `mod.lykn`, the build dir doesn't) was a genuine
find.

This iteration is **four fixes and one question**, all in the three files you
already touched. Nothing here reopens the design. Three are mechanical; one is a
regression I'd call fix-before-close; one needs you to check a fact on the host
that I can't check from this seat.

CDC verification strength for everything below: **code review against `lang` at
`be72c37`** (reading + grep). I ran nothing. Where a runtime check is needed I
say so explicitly rather than asserting.

---

## Finding 1 — REGRESSION: the overlay is silently dropped when `project.json` has no `imports` key

**Severity: blocking for slice close.** This is the one that matters.

### What's wrong

`crates/lykn-cli/src/config.rs`, `write_effective_deno_config`, lines ~301-310:

```rust
if let Some(imports) = cfg.get_mut("imports").and_then(|v| v.as_object_mut()) {
    for v in imports.values_mut() {
        if let Some(s) = v.as_str() {
            *v = serde_json::Value::String(absolutize_import(s, &root));
        }
    }
    for (k, v) in overlay {                                  // <-- INSIDE the if-let
        imports.insert(k, serde_json::Value::String(absolutize_import(&v, &root)));
    }
}
```

The overlay-insertion loop is nested **inside** the `if let Some(imports)`. If
`project.json` has no `imports` key (or it isn't an object), no overlay entry is
written at all — yet the function still:

- writes `target/lykn/project.effective.json`,
- strips the `workspace` field from it, and
- returns `Some(eff_path)`.

So `find_config()` hands deno a config that has **lost `workspace`** and **gained
none of the overrides**, while `lykn link` already printed `✓ linked`. That is a
silent no-op with a success message — the worst shape a link failure can take,
because the user's next question ("am I testing local or published code?") gets a
confidently wrong answer.

The previous implementation did not have this hole: `ProjectConfig.imports` is
`#[serde(default)]` (`config.rs:110-111`), so a missing key deserialized to an
empty map and the overlay was inserted unconditionally before `splice_imports`.

### Why it's reachable

Any project whose `project.json` has no `imports` yet. Linking a dependency you
are *about to* import is a natural first move, so this isn't exotic.

### The fix

Hoist the overlay insertion out of the `if let`, creating the `imports` object
when absent. Sketch:

```rust
// absolutize existing base imports (no-op when the key is absent)
if let Some(imports) = cfg.get_mut("imports").and_then(|v| v.as_object_mut()) {
    for v in imports.values_mut() {
        if let Some(s) = v.as_str() {
            *v = serde_json::Value::String(absolutize_import(s, &root));
        }
    }
}
// the overlay must land whether or not the base had an `imports` object
let obj = cfg.as_object_mut()?;
let imports = obj
    .entry("imports")
    .or_insert_with(|| serde_json::Value::Object(Default::default()))
    .as_object_mut()?;
for (k, v) in overlay {
    imports.insert(k, serde_json::Value::String(absolutize_import(&v, &root)));
}
```

(Shape it however reads best — the requirement is that a non-empty overlay always
reaches the effective config, and that a malformed `imports` value fails loudly
rather than silently producing an override-free config.)

### Confirm it

```sh
mkdir -p /tmp/s07 && cd /tmp/s07
printf '{"workspace":[]}\n' > project.json          # NO imports key
lykn link jsr:@lykn/testing@0.5.2 ~/lab/lykn/lang
cat target/lykn/project.effective.json               # must contain the override
```

---

## Finding 2 — the guard the slice advertises has zero coverage; the test named for it tests the opposite

**Severity: medium.** Not a code defect — a false-assurance defect, which is
worse in a ledger.

### What's wrong

`crates/lykn-lang/src/expander/pass0.rs`,
`test_resolve_specifier_scheme_target_override_is_not_taken`:

```rust
// A LOCAL alias override still works via Tier 0 (fires, non-scheme target):
map.insert("my-macros".to_string(), "/tmp/x/mod.lykn".to_string());
let result = resolve_specifier("my-macros", None, Some(&map), &mut deno).unwrap();
assert_eq!(result, PathBuf::from("/tmp/x/mod.lykn"));
```

The target inserted is `/tmp/x/mod.lykn` — a **non-scheme** target. The test
asserts Tier 0 **fires**. That is a duplicate of the positive case, not the
negative one its name promises. The comment above it describes an alias→`jsr:`
mapping that never gets inserted into the map.

Net: `!is_scheme_specifier(target)` — the "can never reroute registry→registry"
guarantee stated in the S-1 ledger row, the commit message, *and* the closing
report — is **not exercised by any test**.

### The fix

Two cheap, network-free additions:

1. A direct unit test for `is_scheme_specifier` — true for `jsr:`, `npm:`,
   `http:`, `https:`; false for `/abs/path`, `./rel`, `file:///x`, a bare name.
   This one needs no `deno_available()` guard at all.
2. Rename the existing test to what it actually covers (e.g.
   `..._local_alias_override_resolves_via_tier0`), and write a real negative:
   with `{"alias" → "jsr:@x/y@1"}`, assert Tier 0 does **not** short-circuit to a
   local path. If asserting the full Deno-recursion outcome is awkward, assert
   the guard directly instead — but do not leave the guard uncovered.

Also fix the stale in-test comment so it describes the map the test actually
builds.

### Ledger consequence

S-1's Evidence cell currently names both tests as though they cover the guard.
Amend it to say precisely which test covers which property once (2) lands.

---

## Finding 3 — `write_effective_deno_config` has **no** test coverage, and it was materially rewritten

**Severity: medium. Proposed as a condition of closing S-4.**

### What's wrong

```sh
grep -rn "write_effective_deno_config\|project.effective" --include=*.rs .
```

returns only the definition and its single call site — **no unit test, no
integration test, anywhere**. Meanwhile this slice changed the function in three
ways at once:

- serialization strategy: text-splice → `serde_json::Value` round-trip,
- absolutize **all** base import values (not just overlay),
- **drop** the `workspace` field.

All three rest on `make check` (which never reaches this function) plus one
mycelium smoke test. Finding 1 lives in exactly this function — that is the
causal link, not a coincidence.

### The fix

A table-driven test over the axes that matter, using a temp dir:

| axis | values |
|---|---|
| `imports` in base | present / absent / present-but-empty |
| `workspace` in base | present / absent |
| import values | relative (`./packages/x/`), absolute, `jsr:`/`npm:`, trailing-slash |
| overlay | one exact key, one slash key |

Assert: every overlay key present in the output; relative base values
absolutized against root; registry/absolute values unchanged; trailing slashes
preserved (`absolutize_import` already handles this — `config.rs:342-346`);
`workspace` absent from the output. Finding 1 falls out of the first row.

### And a scoping note on drop-workspace

Dropping `workspace` is a **behavioral delta between linked and unlinked dev
runs**: without an overlay, deno gets the raw `project.json` *with* `workspace`;
with one, it gets a config without it. Your justification (members must nest
under the config dir) is sound for the nesting constraint, but it's generalized
from one project shape — and arc06's whole subject is multi-package downstream
ergonomics, with a "multi-package scaffold gap" already sitting on the arc07
reconcile list.

Don't re-litigate it. Do name it in S-4's Notes as a **scoped assumption** —
"verified on mycelium's shape; workspace-member resolution under an overlay is
not otherwise exercised" — so it's a disclosed limit rather than an asserted
no-op. If you think it deserves a 0.7.0 backlog row, say so and I'll route it.

---

## Finding 4 — QUESTION (please check on the host before answering): does the exact-key → directory-value entry survive Deno's import-map parsing?

**Severity: unknown — this is the one I need you to resolve, not fix blind.**

### The shape

`cmd_link_specifier` writes:

- key: `"jsr:@lykn/testing@0.5.2"` — **no** trailing slash
- value: `".../target/lykn/dist/testing/"` — trailing slash **forced**
  (`main.rs`, `if !val.ends_with('/') { val.push('/') }`)

For the **lykn-side macro resolver** this is correct and proven: Tier 0 returns
the directory, `find_macro_entry` picks up `mod.lykn` + siblings, and S-6's
negative test confirms it fires.

### My concern

That same entry is written into `project.effective.json`, which is **Deno's**
import map. The import-maps specification treats an entry whose *value* ends in
`/` while its *key* does not as invalid, and drops it (with a warning) during
normalization. If Deno follows that — and I believe it does, but **I have not
run it** — then a plain runtime import:

```lisp
(import "jsr:@lykn/testing@0.5.2" (some-runtime-fn))
```

under an active link would **silently resolve to the published package**, not the
local dist. Same failure shape as Finding 1: no error, wrong code, and the
question the feature exists to answer gets answered wrongly.

mycelium's 43/0 wouldn't catch this if `testing` is only used there as a macro
module — which the closing report's mechanism diagram suggests it is.

### What I'd like from you

1. Check it on the host. Fastest probe: link, then `deno check --config
   target/lykn/project.effective.json` against a file with a runtime import of
   the linked specifier, and/or look for a Deno warning about the import-map
   entry. A 60-second answer.
2. Then one of:
   - **It works** → say so in S-6's evidence, add a runtime-import leg to the
     demo, and we're done.
   - **It's dropped** → either write *two* overlay entries (the exact key with a
     file-pointing value for runtime + the slash-key/slash-value pair for the
     directory), or narrow scope: restrict the documented capability to macro
     modules and fix the `Link` help text, which currently advertises "a literal
     registry specifier" with no such qualifier (`main.rs:131-140`).

Either outcome is fine. What isn't fine is shipping help text broader than the
demonstrated capability.

---

## Finding 5 — MECHANICAL: `is_scheme_specifier` stole `resolve_specifier`'s doc comment

**Severity: low, but it's a 2-minute fix and it's rustdoc-visible.**

In `pass0.rs`, the new helper was inserted **between** the doc block and the
function it documents. The result:

- the entire `/// Resolve a module specifier using three-tier dispatch. …
  Tier 1 … Tier 2 … Tier 3 …` block now documents **`is_scheme_specifier`**;
- **`resolve_specifier` has no doc comment at all**;
- the helper's own one-line description ("A registry/remote scheme whose
  resolution is owned by Deno / the JSR fetch — never a local override target.")
  reads as a sentence fragment welded onto the end of the Tier-3 paragraph.

### The fix

Move `is_scheme_specifier` (with its own two-line doc) **above** the
`resolve_specifier` doc block, so each doc comment sits on its intended item.
While you're in there: the block still says "three-tier dispatch" and documents
Tiers 1-3 only. Add the **Tier 0** paragraph — it's the newest and least
obvious tier, and the next reader will look for it there first.

---

## Finding 6 — OPTIONAL: note the now-implicit split between Tier 0 and Tier 2's exact branch

**Severity: maintainability. Take it or leave it; not a close condition.**

Tier 0's body is byte-identical to Tier 2's exact-match branch:

```rust
return resolve_specifier(target, file_path, None, deno);
```

Since Tier 0 now consumes every exact match with a **non-scheme** target, Tier
2's exact branch is reachable **only** when the target *is* a scheme. That's
correct, but it's invisible: someone editing Tier 2's exact branch later would
silently not affect local targets. One line of comment there ("only
scheme-targeted exact matches reach here; local targets short-circuit at Tier 0")
closes the trap.

Related, and genuinely just a note: Tier 0 has no bare-name guard, while Tier 2
requires `!starts_with("./" | "../" | "/")`. So exact-key overrides now apply to
relative and absolute specifiers too. **I have no failing case** — I'm recording
the widened surface, not claiming a bug. If you think it should be guarded to
match Tier 2, say so; I'd rather that be a decision than an accident.

---

## Ledger updates for this iteration

Per LEDGER-DISCIPLINE, an iteration must leave the row accounting honest.
Proposed:

- **S-1** — amend Evidence: name which test covers the *positive* Tier-0 path and
  which covers the **guard**, once Finding 2 lands. (Status stays `done`.)
- **S-4** — currently `done`; **reopen to `in-progress`** until Finding 1 is
  fixed and Finding 3's tests land. Add the drop-workspace scoped assumption to
  Notes.
- **S-8 (NEW)** — *runtime-import scope of a linked literal specifier*: the
  demonstrated capability's boundary, resolved per Finding 4. Origin:
  `iteration 1 / CDC review`. This takes the slice from **8 rows to 9** — an
  iteration-time scope addition, disclosed here rather than folded in silently.
- Everything else (**R-1, S-2, S-3, S-5, S-6, S-7**) stands as written. S-5's
  architectural claim I independently confirmed by reading: `cmd_link_specifier`
  only ever calls `config::write_overlay` (→ `project.local.json`), `dist.rs`
  reads raw `read_project_config`, and `find_config()` is a distinct call site
  from the effective path.

Add an **Iteration 1** subsection to the closing report recording what changed
and why, rather than editing the original per-row walk in place — expansion, not
overwrite.

---

## Scope boundary for this iteration

**In:** Findings 1, 2, 3, 5 (fixes + tests); Finding 4 (investigate, report,
then fix *or* narrow the help text); Finding 6 if you agree with it; the ledger
and closing-report amendments above.

**Out:** the version-agnostic override form (already correctly routed to 0.7.0 in
your bubble-up); any change to the Tier-0 design; anything in the runsheet
(you're already on that separately); arc-level docs (CDC is taking the
project-management pass — arc-plan slice table, arc closing-report fold for
slices 06/07, project-plan, status.html).

**Verification bar:** `make check` green, plus the Finding 1 repro above showing
the override present in the effective config.

When this lands I'll write `cdc-verification.md` against it and slice07 can
close — which unblocks folding slices 06 and 07 into arc06's closing report and
the arc gate.
