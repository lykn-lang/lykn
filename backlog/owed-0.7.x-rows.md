# Owed rows for `release/0.7.x` → `project03-language-evolution/BACKLOG.md`

**Ready to apply — paste, don't re-derive.** Every row below is blocked on the
same thing: a `0.7.x` checkout. The worktree layout (`.worktrees/0.7.x`)
turns that from a stash-dance into a `cd`, which is why four of these have been
sitting owed.

Compiled 2026-07-24. Ordered by how long they've been waiting.

---

## 1. §A — commit the **A6** entry (SPLICED, uncommitted)

**Status: written, uncommitted.** The A6 entry (*fully-typed classification —
recursive typed AST*, origin arc15 slice03's deferred Option C) was spliced into
§A after A5 and is still awaiting a commit gate. Source also preserved in
`BACKLOG-A6-option-C-entry.md`.

*Action: verify it's still there on the 0.7.x tip, then commit.*

---

## 2. §B — mark **#6** done via arc15

**Owed since the arc15 slice02 close.** §B's routed-items table still shows #6
(the `((express x):method …)` silent miscompile) as open. It was closed in
0.6.0 by arc15 slices 01–02 — hard compile + `lykn check` error with a threading
fix-it (`9ca9c7e`, `d6c23b5`, follow-up B `90cf211`), all CDC-verified.

*Action: flip the row to done, cite the commits, note that slice03's hardening
was deferred here as A6.*

---

## 3. §A — **full runtime override of a linked literal specifier**

*(New 2026-07-24; origin arc06 slice07, disclosed at close.)*

`lykn link jsr:@scope/pkg@ver <path>` currently covers **macro modules** — the
overlay maps the exact specifier to a local `dist/` directory, which the lykn
resolver honours. A *runtime* import of that same specifier is **not** redirected:
deno resolves the entry to a directory and errors loudly. Verified on host by CC
— it never silently resolves to the published package, which was the failure mode
CDC review was worried about.

**The 0.7.0 shape:** write *two* overlay entries — the exact key mapped to the
entry *file* (for runtime) and the slash key mapped to the *directory* (for
subpath imports) — so a linked specifier works for both axes.

**SHARPENED 2026-07-24 (operator's Part B reconcile):** this is **not new
design** — `lykn link <package-name>` **already writes exactly that shape**:

```
localdep  = /tmp/.../target/lykn/build/localdep/mod.js     <- entry file
localdep/ = /tmp/.../target/lykn/build/localdep/           <- directory
```

Only `cmd_link_specifier` differs: it writes a *single* directory-valued entry
(`let entries = [(specifier.to_string(), val)]`, with a trailing slash forced
onto the value). So the 0.7.0 item is **bringing the specifier path to parity
with the package-name path**, which already does the right thing — materially
cheaper than "design a runtime override," and it should be re-estimated as such.

(Same lesson as `01-macro-entry-diagnostics`: when a thing exists twice, the two
copies drift. Here the *behaviour* drifted between two sibling code paths in the
same command.)

**Re-entry condition:** any downstream that wants to develop against a local
build of a *runtime* library, not just a macro module.

**Evidence:** `01-macro-entry-diagnostics` and arc06 slice07's cdc-verification.

---

## 4. §A or §C — the **drop-workspace scoped assumption**

*(New 2026-07-24; origin arc06 slice07 S-4.)*

`write_effective_deno_config` drops the `workspace` field from the generated
effective config, because deno requires workspace members to be nested *under* the
config's directory and the effective config sits at `target/lykn/` while members
are at `../../packages/*`.

**This is a behavioural delta between linked and unlinked dev runs** — without an
overlay, deno gets the raw `project.json` *with* `workspace`; with one, it gets a
config without it. Verified only against mycelium's shape.

CDC's call at slice close: **no separate ledger row** (it's disclosed in S-4's
Notes, which satisfies anti-silent-drop) — **but it needs a backlog row, because
disclosure without a re-entry condition is exactly how `D-2607-8HTN` happened.**

**Re-entry condition:** the **first multi-package downstream that links.** Note
arc07 already carries a related "multi-package scaffold gap" (`lykn new` writes
one self-key), so these two probably want looking at together.

---

## 5. §A — **a collection prelude?** *(held for design — do not file yet)*

Flagged here so it isn't lost, **not** as a filed row. `D-2607-K9RT`: the guides'
flagship `->>` example cannot run because `filter`/`map`/`reduce` don't exist
anywhere in the language. The doc fix is 0.6.0-cheap; whether lykn should *ship*
collection-last free functions — which is what would make `->>` earn its place
next to `->` — is a language-design call pending discussion.

*Action: file only after the language-design conversation. Until then it lives in
the discovery register as `held-for-design`.*

---

## 6. §A — commit the **A7** entry (`as->`) (WRITTEN, uncommitted)

*(New 2026-07-25; origin `project03-language-evolution/slice03-threading-macros`.)*

**Status: written, uncommitted** — same shape as row 1. The A7 entry (*`as->` —
the general threading form*) has been written into `BACKLOG.md` on the 0.7.x
worktree, along with the whole `03-threading-macros/` research unit. Neither is
committed: the worktree's gitdir pointer does not resolve from the environment
that wrote them, so the files exist on disk and not in git.

**Substance:** a census of all 489 ES2025 built-ins plus 214 host callables found
that only 48 core callables discriminate `->` from `->>`, at **37 datum-first : 2
datum-last** — so a dedicated thread-last macro serves two built-ins, while
`as->` covers datum-last, datum-middle and operator-receiver together. `as->`
also currently compiles *silently* to an undefined `asTo(…)`.

*Action: `cd .worktrees/0.7.x`, review `project03-language-evolution/slice03-threading-macros/`
and the A7 block in `BACKLOG.md`, then commit. Also append the four draft rows in
that unit's `discovery-rows.md` to `backlog/discoveries.md` on `main` and
delete the draft file — until then those rows are in exactly the position
`D-2607-8HTN` warns about.*

---

## Cross-check when you land these

`backlog/discoveries.md` (on `main`) is the register these rows are routed
*from*. Rows 3 and 4 should get their register entries updated to point at the
BACKLOG once filed — a routing row that names a home is only useful if the home
exists and the source says where it went. That's the `D-2607-8HTN` lesson applied
to this very document.
