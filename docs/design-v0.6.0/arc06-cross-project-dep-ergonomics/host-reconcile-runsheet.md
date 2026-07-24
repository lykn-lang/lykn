# arc06 — Host Reconcile Runsheet (operator)

> **Purpose.** Reproduce, on your host, the CC-attested **runtime rows** that gate
> arc06's close, so you can give the **GO**. Everything in the arc's
> `closing-report.md` marked *"(attested) → reconcile"* is here. `lang` claims
> (specifier preservation, exact-pin, the overlay safety property, the mycelium
> inventory) are already CDC-confirmed in-repo — this sheet is the **runtime**
> half only.
>
> **Bar:** the headline is **Part C (A-6)** — mycelium builds, tests, and
> publish-dry-runs green as a downstream. Parts A/B reconcile the supporting
> `lykn add` (A-5) and `lykn link`/`unlink` + publish-safety (A-4) rows.
>
> **Discipline (matters):** if a safety gate fires (dirty tree, 404, unbuilt),
> the pass is to **satisfy the gate** (commit/stash, fix the specifier, build) —
> **never** `--allow-dirty` / `--force` / `--no-verify`. A gate firing correctly
> is itself a passing observation.

---

## On versions — two surfaces, don't conflate them

- **The `lykn` toolchain** (this binary) reports **`0.6.0-dev`** — the current
  `release/0.6.x` build, all arc06/13/15 work compiled in. (Consolidated to one
  workspace-inherited version in slice06; the final `0.6.0` bump is arc09.)
  It has `add`/`link`/`unlink` — commands the *released* 0.5.x never shipped.
- **mycelium's dependency pins** `jsr:@lykn/lang@0.5.2` / `@lykn/testing@0.5.2`
  are **registry pins to the last *published* libraries** — 0.6.0 isn't on JSR
  yet (arc09), so 0.5.2 is the newest pinnable. These are *not* the toolchain.

So this reconcile drives the **current toolchain** (0.6.0-dev) against a
downstream that consumes **published-0.5.2 libraries** — which is exactly what
arc06 is about (the dependency-ergonomics *capability* is toolchain-level).
Exercising current-*source* lang/testing is **not** a `lykn link` operation and
is out of scope — see the note after Part C.

---

## 0 — Prereqs (once)

```sh
cd ~/lab/lykn/lang
make build-release            # or: cargo build --release
rm -f bin/lykn && cp target/release/lykn bin/lykn   # rm FIRST (Apple-Silicon signature)
./bin/lykn --version          # expect: lykn 0.6.0-dev  (the current 0.6.0-dev toolchain)

# Put the freshly-built lykn first on PATH for this shell:
export PATH="$HOME/lab/lykn/lang/bin:$PATH"
which lykn                    # expect: .../lab/lykn/lang/bin/lykn
lykn --help | grep -E 'add|link|unlink'   # sanity: the arc06 commands exist

# Scratch area for the throwaway projects in Parts A/B:
export RS=/tmp/arc06-reconcile && rm -rf "$RS" && mkdir -p "$RS"
```

- [ ] `lykn --version` = **0.6.0-dev**, resolved from `lang/bin`, with `add`/`link`/`unlink` present

---

## Part C — A-6: the mycelium composition demo *(the close bar — do this one)*

mycelium is the acceptance corpus. It's already on the slice05 scratch branch
with the import-by-specifier changes committed (`e60af9d`); `main` is untouched.

```sh
cd ~/lab/lykn/mycelium
git branch --show-current     # expect: smoke/0.6-slice05-import-by-specifier
git status --short            # expect: clean (nothing to commit)

# C1 — build
lykn build
#   expect: @lykn/mycl built ...  +  @lykn/mycl-html built in target/lykn/build/mycl-html/

# C2 — THE N1 BAR: downstream tests green (was "Module not found" red before slice05)
lykn test packages/mycl-html/tests/
#   expect: ok | 43 passed | 0 failed

# C3 — publish dry-run (tree is clean, so the dirty-gate won't fire)
lykn publish --jsr --dry-run
#   expect: ... Simulating publish of @lykn/mycl-html@0.1.1 ...
#           Success  Dry run complete

# C4 — spot-check the convention held: no relative *.js source imports remain
grep -rn '\.\./.*\.js' packages --include='*.lykn'   # expect: (no output)
```

- [ ] **C1** `lykn build` green (both packages → `target/lykn/build/`)
- [ ] **C2** `lykn test` → **43 passed / 0 failed** ← the N1 acceptance gate
- [ ] **C3** `lykn publish --jsr --dry-run` → "Dry run complete"
- [ ] **C4** zero `../*.js` source imports in tests

> If C3 ever reports a dirty tree: `git status`, then commit/stash on the scratch
> branch and re-run. Do **not** pass `--allow-dirty`.

### Note — exercising current-*source* lang/testing is out of scope (and not a `lykn link` op)

Part C proves the current **toolchain** builds/tests mycelium; mycelium's
*libraries* stay on their published-0.5.2 pins. You might expect `lykn link` to
re-point them at your local `packages/lang`/`packages/testing` build — it can't,
and that's a real (acceptable) limitation, not a runsheet step:

- `lykn link <pkg> <path>` overrides an **import-map alias** key (and resolves
  `<path>/target/lykn/build/<pkg>/`, so the arg is the **build-dir name** —
  `lang`/`testing`, not `@lykn/lang`).
- But mycelium consumes testing via the **literal** specifier
  `(import-macros "jsr:@lykn/testing@0.5.2" …)`, which **bypasses** the `testing`
  alias entirely — so no alias override redirects it. And mycelium imports **no
  `lang/`** at runtime (only testing macros + its self-package). So there is
  nothing here that a link could redirect.

**Finding (routed, not blocking):** redirecting a *literal* registry specifier
(`jsr:@scope/pkg@ver`) — especially a macro module — to a local build is a
capability `lykn link` does not cover. Route to the **0.7.0 build-tool arc**
(alongside the `~>` DSL / `lykn update`). It does **not** gate arc06: A-6's bar
is the toolchain-level composition demo (Part C), which passes.

---

## Part A — A-5: `lykn add` resolves *(supporting)*

```sh
cd "$RS"
lykn new addtest && cd addtest

# A1 — exact pin, no-version → resolves latest and pins it exact (no ^ / ~)
lykn add npm:astring
grep -n 'astring' project.json
#   expect: "astring": "npm:astring@1.9.0"  (exact — NOT ^1.9.0)

# A2 — bare + slash pair, jsr
lykn add jsr:@std/assert
grep -n '@std/assert' project.json
#   expect two lines: "@std/assert": "jsr:@std/assert@<v>"  and  "@std/assert/": "jsr:@std/assert@<v>/"

# A3 — macro module is recognized
lykn add jsr:@lykn/testing@0.5.2
#   expect the note: "(macro module — usable via import-macros)"

# A4 — idempotent: re-adding updates in place, no duplicate key
lykn add jsr:@std/assert
grep -c '"@std/assert":' project.json    # expect: 1

# A5 — malformed specifier is rejected (gate fires correctly)
lykn add astring ; echo "rc=$?"
#   expect: error about a missing registry scheme, rc=2

# A6 — a bad package fails at add-time, writes nothing (validate-before-write)
cp project.json /tmp/pj.before
lykn add jsr:@std/does-not-exist-xyz ; echo "rc=$?"
#   expect: "registry returned 404" (or resolve failure), rc=1
diff /tmp/pj.before project.json && echo "project.json UNCHANGED"

# A7 — an added dep actually resolves/compiles
#   (lykn new scaffolds source under packages/<name>/, not src/)
printf '(import "astring" (generate))\n(def out (generate (obj)))\n' > packages/addtest/probe.lykn
lykn compile packages/addtest/probe.lykn >/dev/null && echo "probe compiles (import resolves)"
```

- [ ] **A1** `npm:astring` pinned **exact** (`@1.9.0`, no `^`/`~`)
- [ ] **A2** bare + slash pair written for a jsr dep
- [ ] **A3** macro-module note shown for `@lykn/testing`
- [ ] **A4** re-add is idempotent (single key)
- [ ] **A5** malformed specifier → rc=2, helpful error
- [ ] **A6** bad package → rc=1, `project.json` unchanged
- [ ] **A7** an added dependency imports + compiles

---

## Part B — A-4: `lykn link` / `unlink` + the publish-safety property *(supporting)*

Two throwaway projects: a **local dep** (built) and a **consumer** that links it.

```sh
cd "$RS"
lykn new localdep
( cd localdep && lykn build )          # the linked build must exist first
lykn new consumer && cd consumer

# B1 — require-built guard: linking an unbuilt path fails helpfully
lykn link nope /tmp/definitely-not-built ; echo "rc=$?"
#   expect: "run 'lykn build' in <path> first", rc=1

# B2 — link the built local dep → writes a git-ignored overlay
lykn link localdep "$RS/localdep"
cat project.local.json
#   expect: { "imports": { "localdep": ".../localdep/target/lykn/build/localdep/mod.js",
#                          "localdep/": ".../localdep/target/lykn/build/localdep/" } }
git status --short project.local.json   # expect: (ignored — no output / untracked-ignored)
git check-ignore project.local.json     # expect: project.local.json

# B3 — the committed pin is UNTOUCHED by link
grep -c 'localdep' project.json         # expect: 0  (link never writes project.json)

# B4 — SAFETY: dist/publish read the RAW project.json → the local path CANNOT publish
lykn dist
grep -c 'localdep' target/lykn/dist/project.json   # expect: 0  (linked dep absent from staged output)

# B5 — unlink is lossless: overlay gone, project.json still clean
lykn unlink localdep
ls project.local.json 2>&1               # expect: No such file (deleted when empty)
grep -c 'localdep' project.json          # expect: 0
```

- [ ] **B1** unbuilt link → rc=1, "run 'lykn build' first"
- [ ] **B2** `lykn link` writes a **git-ignored** `project.local.json` overlay
- [ ] **B3** `project.json` (the committed pin) is never touched by link
- [ ] **B4** **SAFETY** — after link, `lykn dist` output has **0** `localdep` (a linked dep cannot reach a published package)
- [ ] **B5** `lykn unlink` removes the overlay losslessly; `project.json` clean

---

## Sign-off

| Row | What | Pass? |
|-----|------|-------|
| **A-6** | mycelium build + **test 43/0** + publish-dry green (Part C) | ☐ |
| **A-5** | `lykn add` exact-pins + resolves; gates fire correctly (Part A) | ☐ |
| **A-4** | `lykn link`/`unlink` + **publish-safety** (Part B) | ☐ |

When A-6 is green and A-4/A-5 reconcile, arc06's runtime rows are confirmed —
**the GO gate is yours.** Record the GO in `project-plan.md` (flip P-6 → done)
and the arc `closing-report.md` closure line, then arc06 closes.

### Cleanup

```sh
rm -rf /tmp/arc06-reconcile /tmp/pj.before
# mycelium stays on its scratch branch; nothing to undo (main untouched).
```
