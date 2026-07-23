# arc06 · slice02 — Mycelium re-audit findings (recon-only)

**By:** CC (Claude Code) · **Date:** 2026-07-22 · **Recon-only; no toolchain changes.**
**Audit target:** `lang` `release/0.6.x` @ **`486f2eb`** (rebuilt: `cargo build
--release && cp target/release/lykn bin/lykn`; `./bin/lykn build`).
**Corpus:** `~/lab/lykn/mycelium` on branch **`audit/0.6.0-reaudit`** (throwaway;
`main`/`smoke/0.5.2-registry-pinned` undisturbed).
**Binary discipline:** every command below ran the freshly-built
`~/lab/lykn/lang/bin/lykn` explicitly — the crate version still reports `0.5.2`,
so the version string does **not** distinguish current 0.6.0-dev from published
0.5.2. Ran the current binary, not PATH `lykn`.

## Disposition summary (all 14 accounted for)

| Verdict | Count | Issues |
|---|---|---|
| **Fixed** | 9 | #1, #2, #3, #4, #5, #7, #9, #12, #14 |
| **Partial** | 1 | #8 (`.d.ts` generated + publish no longer hard-fails; residual slow-types *warning*) |
| **Open** | 2 | #6 (`(express x):method`), #11 (unused-binding false positive) |
| **Not a lykn bug (no-op)** | 1 | #10 (npm EOTP — npm token config) |
| **Design/docs (not a bug)** | 1 | #13 (`project.json` vs `deno.json` naming) |

**fixed → arc map:** #1/#5/#7 → arc03/arc10 (surface compiler); #2 → 0.5.2
(V-08, import-macros registry resolution); #8 (`.d.ts`) → arc02; #14/#3-gitignore
→ arc01/arc11 (`target/` model); #9/#3-license/#4/#12 → CLI (`lykn new` +
`lykn dist` + `lykn publish`, arc01/M-series).

## Baseline (F-6) — mycelium against current lykn

Re-pointed `project.json` (M1, below), then from mycelium root:

```
$ ~/lab/lykn/lang/bin/lykn build
@lykn/mycl built in target/lykn/build/mycl/
@lykn/mycl-html built in target/lykn/build/mycl-html/     rc=0   ✅

$ ~/lab/lykn/lang/bin/lykn test packages/mycl-html/tests/
  … -> target/lykn/test/packages/mycl-html/tests/{escape,render,void_elements}_test.js
Compiled 3 .lykn test file(s) to target/lykn/test.
error: Module not found ".../target/lykn/test/packages/mycl-html/escape.js"
    at .../target/lykn/test/packages/mycl-html/tests/escape_test.js:2:38     rc=1   ❌
```

- **`lykn build` passes** — current lykn compiles all of mycelium's
  (worked-around) source, incl. `(export (func …))`, to `target/`.
- **`lykn test` fails** — not on the compiler and not on macro resolution (both
  work), but on **import resolution**: the test files do
  `(import "../render.js" (html))`, and under the arc11 `target/` model the
  compiled test lives at `target/lykn/test/packages/mycl-html/tests/`, so
  `../render.js` resolves to `target/lykn/test/packages/mycl-html/render.js` —
  which doesn't exist (the package `.js` is in `target/lykn/build/`). This is
  **new friction N1** (see below), the arc's central acceptance gap.

## M1 — the re-point, and how awkward it was (prime DD-63 evidence)

mycelium's `project.json` pins the toolchain to published **0.5.2**:

```json
"lang/": "jsr:@lykn/lang@0.5.2/", "testing": "jsr:@lykn/testing@0.5.2",
"testing/": "jsr:@lykn/testing@0.5.2/", "astring": "npm:astring@^1.9.0"
```

Re-pointing at current lykn required (all **manual**, no tooling):

```json
"lang/": "../lang/target/lykn/build/lang/",
"testing": "../lang/target/lykn/build/testing/mod.js",
"testing/": "../lang/target/lykn/build/testing/"
```

Three non-obvious things a human (or `lykn add`) has to *know*:
1. **`target/lykn/build/`, not `packages/`.** lang's own map points `lang/` at
   `./target/lykn/build/lang/` — the package must be **built** first
   (`lykn build`), and the source `packages/testing/mod.lykn` isn't importable;
   you need the built `mod.js`.
2. **`testing` (bare) → an explicit file** (`…/testing/mod.js`), while `testing/`
   (slash) → the directory. The registry form hides this; the local form doesn't.
3. **The relative path** (`../lang/…`) is checkout-layout-dependent — breaks the
   moment mycelium isn't a sibling of `lang`.

**This switch — registry-pinned ⇄ local-dev — is exactly the ergonomics arc06
owns.** There is no `lykn add`, no `lykn link`, no `--local` flag: you hand-edit
JSON and guess the build-dir path. (F-7 turns this into requirements.)

## M3 — the `(export (func …))` gate — SETTLED: compiles

```
$ echo '(export (func html :args (:string s) :returns :string :body s))' | ./bin/lykn compile -
export function html(s) { … return result; }      rc=0   ✅
```

Current lykn **accepts** `(export (func …))` and emits valid `export function`.
mycelium's `render.lykn:81` / `void-elements.lykn:7` are **not** a build blocker.
The memory note (`lykn_export_surface_syntax`) that flags this as invalid surface
syntax is **contradicted by the compiler** — the compiler accepts it and the
output is correct. → **arc07**: reconcile the memory/guide with the compiler's
actual behaviour (settle whether `(export (func …))` is blessed or merely
tolerated; the compiler currently blesses it).

## Per-issue dispositions

### Toolchain bugs — probed by compiling the *un-worked-around* form

**#1 `?`-suffix → invalid JS — FIXED (arc-era identifier mapping, DD-49).**
```
$ (func void-element? :args (:string tag) :returns :boolean :body true)
→ function isVoidElement(tag) { … }       rc=0
$ (bind x (empty? lst))  → const x = isEmpty(lst);
```
`?`-suffixed names now map to valid JS identifiers (`void-element?` →
`isVoidElement`, `empty?` → `isEmpty`). The old repro (`function voidElement?`,
`import {voidElement?}`) no longer reproduces. mycelium's `is-void-element`
rename is **no longer necessary**. (Cosmetic residue: the unused-binding warning
prints the *surface* name `'void-element?'` — new friction N4.)

**#5 nested `if` in `func` return position — FIXED (arc03/arc10).**
```
$ (func f … :body (if (js:eq node null) "" (if (= (js:typeof node) "string") "s" "o")))
→ const result = node == null ? "" : typeof node === "string" ? "s" : "o";   rc=0
```
Clean ternary chain, no stray `if` statements in expression position. Old mixed
ternary/`if` bug gone. mycelium's guard-clause workaround (`render.lykn:47-52`)
is no longer required.

**#7 `if` in binding position — FIXED (arc03/arc10).**
```
$ (bind x (if cond a b))  → const x = cond ? a : b;    rc=0
```
`if` in initializer position now compiles to a ternary. mycelium's `(?…)`
workaround (`render.lykn:69`) is no longer required.

**#6 `(express x):method` chaining — OPEN (documented ID-31).**
```
$ (bind r ((express parts):join ""))  → const r = parts.value("join", "");   rc=0
```
**Still the wrong output** — a call to `parts.value("join","")`, not a method
call on the expressed value. Silent (no error, wrong behaviour). mycelium's
intermediate-binding workaround (`render.lykn:40-41`) is **still necessary**.
This is the documented ID-31 trap; the compiler does not detect
`(express x)` in method-head position. → **compiler-follow-up**.

**#11 unused-binding false positive — OPEN.**
```
$ (bind VOID-ELEMENTS (set "br" "img"))
  (func is-void-element … :body (VOID-ELEMENTS:has tag))
  (export (names is-void-element))
→ warning: unused binding 'VOID-ELEMENTS'   (and 'is-void-element')   rc=0
```
`VOID-ELEMENTS` is used via `VOID-ELEMENTS:has` **inside a func body**, yet
flagged unused — the exact #11 false positive. The checker doesn't count a
member-access (`X:has`) reference inside a `func`/`fn` body as a use of `X`
(and doesn't count `(export (names …))` as a use either). Noisy but harmless
(rc=0). mycelium "ignored the warnings" — still the state. → **compiler-follow-up**.

### Import / macro resolution

**#2 import-macros `jsr:` — FIXED (0.5.2 / V-08).**
```
$ (import-macros "jsr:@lykn/testing@0.5.2" (test is-equal))
  (test "smoke" (is-equal 1 1))
→ Deno.test("smoke", () => assertEquals(1, 1));  (imports from jsr:@std/assert)  rc=0
```
The macro expander resolves the `jsr:` specifier and expands the macros. The old
"resolved jsr:@lykn/testing to non-file URL" error no longer reproduces.
mycelium's local-path workaround for macros is no longer needed. (Note: this was
already true at 0.5.2 — the corpus's tests use exactly this line and it works.)

**#9 `lykn test` needs `lang/`/`testing/` outside the monorepo — FIXED (scaffold).**
`lykn new` now **generates** the compiler import-map entries:
```json
"lang/": "jsr:@lykn/lang/", "testing": "jsr:@lykn/testing", "testing/":
"jsr:@lykn/testing/", "astring": "npm:astring@^1.9.0"
```
And when mapped, resolution works (the baseline `lykn build` used `lang/` to
compile mycelium). So the *import exists* out of the box now. **Caveat:** the
generated specifiers are **unpinned** (`jsr:@lykn/lang/` with no `@version`) —
resolves to whatever jsr latest is; a version-pinning requirement for `lykn add`
(F-7). The still-manual part is switching those to a **local** checkout for
dev — that's N2/DD-63, not #9.

### Publish path

**#3 `lykn new` JSR publish (license + gitignore) — FIXED.**
- *gitignore/JSR tension:* gone. The scaffold's `.gitignore` ignores
  `target/`/`dist/`/`bin/` (not `packages/*.js`); under the `target/` model the
  package dir holds only `.lykn` source, so nothing exported is gitignored.
- *license:* `lykn dist` copies `LICENSE` into the staged package
  (`target/lykn/dist/lyknnew/LICENSE`), and the JSR dry-run below emits **no**
  `missing-license` error.

**#4 `package.json`/`jsr.json` generated — CONFIRMED (was discoverability).**
`lykn dist` (the renamed `lykn build --dist`) stages each package with generated
`deno.json`, `package.json`, `LICENSE`, README, **and `mod.d.ts`**:
```
target/lykn/dist/lyknnew/{deno.json, package.json, LICENSE, mod.d.ts, mod.js, README.md}
```
Never hand-write them. (This was always a docs/SKILL gap, not a toolchain bug —
the SKILL now has a linter note but the publishing-workflow gap from #4/#12 is an
arc07 item to verify.)

**#8 `.d.ts` / `--allow-slow-types` — PARTIAL (mostly fixed).**
JSR dry-run on a committed scaffold:
```
$ lykn publish --jsr --dry-run
… Warning Publishing a library with slow types is not recommended … will not be
  shipped with a .d.ts file for Node.js users.
Simulating publish of @lyknnew/lyknnew@0.1.0 with files: … mod.d.ts (26B) … mod.js
Success  Dry run complete       rc=0   ✅
```
- **Fixed:** a `mod.d.ts` **is** generated (arc02), and publish **no longer
  hard-fails** — the original blocker (`unsupported-javascript-entrypoint`
  requiring `--allow-slow-types`) is gone; the dry-run succeeds.
- **Residual:** JSR still emits a **slow-types warning** — the generated
  `mod.d.ts` is minimal (26 B). The publish proceeds, but full JSR fast-check
  isn't satisfied. → **arc02 follow-up / post-0.6.0**: richer `.d.ts` emission.

**#12 Makefile raw `npm`/`deno publish` — FIXED (toolchain); downstream drift.**
`lykn publish --jsr` drives the whole flow (stage → dry-run) in one command and
**correctly enforces the uncommitted-changes gate** (it refused to run on a dirty
tree and did **not** auto-pass `--allow-dirty` — matches the CLAUDE.md safety
rule). mycelium's Makefile still hand-rolls `npm`/`deno publish` (downstream
drift) → route to a mycelium update / `lykn new` template + arc07 docs.

**#10 npm EOTP — NOT A LYKN BUG (no-op).** npm token-type/scoping config; the
report itself concluded "no lykn toolchain change needed." Nothing to reproduce
in lykn. Route: doc note only (Makefile publish comment).

### Config / model

**#14 compiled `.js` pollutes source — FIXED (arc01/arc11 `target/` model).**
Current lykn compiles to `target/lykn/build/` (build), `target/lykn/test/`
(test), `target/lykn/dist/` (publish); nothing lands beside `.lykn` source. The
scaffold `.gitignore` ignores `target/`. The three-tier model from the report's
recommendation (`packages/`→`target/`→`dist/`) is exactly what shipped.
mycelium's Makefile still uses in-place `lykn compile -o` (downstream drift, N3).

**#13 `project.json` vs `deno.json` naming — DOCUMENTED (design, not a bug).**
Unchanged: root `project.json` + per-package `deno.json`. This was a naming
*suggestion*, not a defect. No toolchain action; the rename (`workspace.json` /
`package.json`) is a breaking design call. → **post-0.6.0** (with the guide-10
side-by-side contrast as the 0.6.0-era mitigation, arc07).

## New friction (F-4) — not in the original 14

**N1 — test files' relative `.js` imports break under the `target/` model.**
(Baseline, reproduced above.) mycelium's tests do `(import "../render.js" …)`;
under arc11 the compiled test is in `target/lykn/test/…/tests/` and the package
`.js` is in `target/lykn/build/…/`, so the relative import dangles. This is the
intersection of a toolchain change (arc11 `target/`) and a downstream pattern
(relative source-JS import). **It is the arc's central acceptance gap:** a real
downstream can `lykn build` but not `lykn test` end-to-end. Needs a resolution
answer — tests should import the package via a workspace/import-map specifier
that maps to `target/lykn/build/`, and/or `lykn test` should resolve a test's
relative `../x.js` against the built output. → **arc06 slice04** (external
resolution), with an **arc07** guide note on how downstream tests import packages.

**N2 — the registry⇄local re-point is entirely manual** (M1 above). No `lykn
add`/`lykn link`; you hand-edit `project.json` and must know the build-dir path
and the `mod.js` entry. → **arc06 slice03 (`lykn add`) / DD-63.**

**N3 — `lykn build --dist` is deprecated → `lykn dist`** (removal in 0.7.0). The
mycelium Makefile and any guide/SKILL text using `build --dist` will warn now and
break in 0.7.0. → **arc07** (docs) + mycelium update.

**N4 — unused-binding warning prints the *surface* name** (`'void-element?'`)
rather than the emitted identifier. Cosmetic; compounds #11's noise. →
**compiler-follow-up / post-0.6.0.**

## Routing table (F-5) — every open/partial/new item has a home

| Item | Disposition | Home | Fix-in-0.6.0 vs post |
|---|---|---|---|
| #6 `(express x):method` wrong output | open | **compiler-follow-up** | **Recommend 0.6.0** if cheap — silent wrong output is a Principle-3-adjacent hazard; else post-0.6.0 with warning |
| #11 unused-binding FP (used in func body) | open | **compiler-follow-up** | post-0.6.0 (noisy, not incorrect output); pairs with N4 |
| #8 residual slow-types (thin `.d.ts`) | partial | **arc02 follow-up** | post-0.6.0 (publish already succeeds) |
| N1 test relative `.js` imports under `target/` | new | **arc06 slice04** (+ arc07 note) | **0.6.0** — it's the arc's own acceptance criterion (A-6) |
| N2 manual registry⇄local re-point | new | **arc06 slice03 (`lykn add`)** / DD-63 | 0.6.0 (the arc's deliverable) |
| #9 generated `lang/`/`testing/` unpinned | fixed-with-caveat | **arc06 slice03** (`lykn add` version-pinning) | 0.6.0 |
| N3 `build --dist`→`dist` deprecation | new | **arc07** (docs) + mycelium | 0.6.0 docs / downstream |
| N4 warning uses surface name | new | **compiler-follow-up** | post-0.6.0 |
| M3 `(export (func …))` memory-vs-compiler | settled(compiles) | **arc07** (reconcile memory/guide) | 0.6.0 docs |
| #12 mycelium Makefile raw publish + in-place `-o` (#14 drift) | downstream drift | **`lykn new` template + arc07** / mycelium update | 0.6.0 |
| #13 config naming | design | **post-0.6.0** (arc07 guide-10 contrast now) | post-0.6.0 |
| #10 npm EOTP | not-lykn | doc note only | n/a |

No silent drops: 14 original (9 fixed / 1 partial / 2 open / 1 no-op / 1 design)
+ 4 new (N1–N4) + the M3 settlement, all routed above.

## `lykn add` requirements read (F-7) — DD-63 input (a sketch, not a design)

From what the audit shows a downstream actually needs — grounded in the M1
re-point pain and the `lykn new` scaffold gaps:

1. **Specifier forms to accept:**
   - `jsr:@scope/pkg[@version]` — the primary case (mycelium's `lang`/`testing`).
   - `npm:pkg[@range]` — e.g. `astring` (already in every scaffold).
   - **local / workspace path** — `../lang/…` or a `--local`/`--link` mode; this
     is the registry⇄local switch (N2) that has *no* tooling today and is the
     single biggest ergonomics win.
2. **What `lykn add <specifier>` should write:**
   - `project.json` `imports` entry, **version-pinned** (the scaffold currently
     writes *unpinned* `jsr:@lykn/lang/` — `lykn add` should pin to a resolved
     version, addressing #9's caveat).
   - The **bare + trailing-slash pair** where a package exposes subpaths
     (`testing` → entry file, `testing/` → dir) — the re-point showed a human has
     to know to write both; `lykn add` should emit both from the package's
     `exports`.
   - For a **local** add, resolve the correct **build-dir** path
     (`…/target/lykn/build/<pkg>/`) and entry (`mod.js`), not `packages/` — the
     exact thing M1 got wrong-by-default.
3. **Cache / resolution:** after add, populate the Deno cache (`deno cache`/
   `deno info`) so the first `lykn build`/`test` doesn't cold-fetch; verify the
   specifier resolves (a dry `lykn check`/build).
4. **Per-package `deno.json` interaction:** a workspace-member dependency vs a
   root dependency — decide whether `lykn add` edits root `project.json`,
   the member `deno.json`, or both (mycelium adds at root; members inherit).
5. **The macro axis:** `import-macros` specifiers (`jsr:@lykn/testing`) resolve
   today (#2), but `lykn add @lykn/testing` should set up *both* the value import
   (`testing`/`testing/`) and leave macro resolution working — one command, both
   axes.

DD-63 should also answer the **N1 corollary**: once a dep is added, how does a
*test* import the local package — via the added import-map specifier (mapping to
`target/lykn/build/`), which is the resolution `lykn add` + slice04 must make
coherent.

## Recon discipline (F-8)

- **No toolchain changes.** No edits to `lang`'s `crates/`, `packages/`, the
  compiler, or `lykn new`. Every tempting fix (#6, #11, N1) is **routed above**,
  not landed. The `lang` diff for this slice is **this findings doc +
  closing-report only**.
- The only mutation was the **M1 re-point of mycelium's `project.json`**, on the
  throwaway branch `audit/0.6.0-reaudit`; mycelium `main` / `smoke/…` are
  untouched. (mycelium is restored to its original branch at hand-off.)
- Runtime rows (`lykn build`/`test`/`publish --dry-run`, the compile probes) are
  **CC-attested** on the host; reconcile on an operator/fresh-CC host re-run at
  `486f2eb` or later.
