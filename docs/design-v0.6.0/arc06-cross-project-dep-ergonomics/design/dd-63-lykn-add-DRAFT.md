# DD-63 — `lykn add`: cross-project dependency ergonomics (DRAFT)

> **Status: DRAFT (CDC seed 2026-07-22; odm promotion = Duncan).**
> **Home: arc06 · cross-project-dep-ergonomics. Release: 0.6.0.**
> Scoped from arc06/slice02's F-7 requirements read (the mycelium re-audit).
> Every decision below is operator-approved (2026-07-22); this DD records the
> design, not open questions. The deep version-management work (Mix/rebar3 `~>`)
> is explicitly **out** → 0.7.0 build-tool arc (BACKLOG A1.1).

---

## 1. Background (the refresher — read this first)

**Why `lykn add` exists.** A lykn project consumes lykn (and other packages) as
dependencies; the canonical downstream is **mycelium**. DD-51 (the tool-boundary
decision) banned `deno add`/`npm install` inside lykn projects — everything is
`lykn <command>` (the "lykn-only tooling" principle). That left **no ergonomic
way to add a dependency at all**: you hand-edit `project.json`. `lykn add` fills
that hole. Think `cargo add`, for lykn.

**How dependencies resolve.** A lykn project is a Deno project underneath.
Crucially — **`project.json` *is* a Deno config file** (its `imports`,
`workspace`, `lint`, `tasks` are Deno's schema); lykn invokes
`deno run/test --config project.json`. Dependencies are **specifiers** in the
`imports` map:
- **registry** — `jsr:@lykn/lang@0.6.0` (JSR = jsr.io, Deno's registry) or
  `npm:astring@^1.9.0` (npm). Published packages, fetched from a registry.
- **local path** — `./target/lykn/build/lang/`, a directory on disk.

**The four problems the audit surfaced** (each is a design point below):

1. **registry ⇄ local switch.** You flip a dep between the *published* version
   and a *local checkout* constantly when you both use lykn and hack on it.
   Today that's hand-editing JSON (and easy to accidentally commit a `../lang`
   path). §3(a).
2. **unpinned specifiers.** `lykn new` scaffolds `"lang/": "jsr:@lykn/lang/"` —
   no `@version` → resolves to whatever's latest at fetch time (non-reproducible).
   §3(b).
3. **bare + trailing-slash exports pair.** A package is declared twice —
   `"testing"` (bare → entry file `mod.js`) and `"testing/"` (slash → directory,
   for sub-paths). A human has to know to write both. §3(c).
4. **build-dir resolution.** A *local* dep points at the **built** output
   (`target/lykn/build/<pkg>/`), never the `.lykn` **source** in `packages/` —
   the intuition (`packages/`) silently fails. §3(d).

---

## 2. Command surface

- **`lykn add <specifier>`** — add a committed dependency to the **root
  `project.json`**. `<specifier>` = `jsr:@scope/pkg[@version]` or
  `npm:pkg[@range]`. Resolves + **pins exact**, emits the bare+slash pair,
  populates the Deno cache, wires the macro axis if the package is a macro
  module.
- **`lykn link <package> <local-path>`** — *dev-only, non-destructive* override:
  point an already-declared dependency at a **local build** for development.
  Writes to a **git-ignored `project.local.json`**. Requires the local project
  to be built.
- **`lykn unlink <package>`** — remove the override (flip back to the committed
  registry version). No pin is lost — the registry specifier was never touched.

> Verb choice (CDC recommendation): a distinct **`link`/`unlink`** pair reads as
> a toggle and mirrors `npm link` / cargo `[patch]` — cleaner than overloading
> `add --local`. Operator may prefer `add --local <path>` / `add --path`; that's
> a spelling change, not a mechanism change.

`lykn remove`, `lykn update`, and Mix-style `~>` requirements are **out of scope**
(0.7.0 build-tool arc). `lykn add` is add-only for 0.6.0.

---

## 3. Design

### (a) registry ⇄ local — the non-destructive overlay (Option 2)

The committed `project.json` always holds the **real, shareable** dependency
(the pinned registry specifier). A separate, **git-ignored `project.local.json`**
holds *only* the overridden import keys for local development:

```jsonc
// project.json  (committed — the truth everyone shares)
"imports": { "lang/": "jsr:@lykn/lang@0.6.0/", "testing": "jsr:@lykn/testing@0.6.0", … }

// project.local.json  (git-ignored — your machine only)
"imports": { "lang/": "../lang/target/lykn/build/lang/",
             "testing": "../lang/target/lykn/build/testing/mod.js",
             "testing/": "../lang/target/lykn/build/testing/" }
```

**Merge mechanism (grounded in how Deno is invoked).** Because Deno reads exactly
one `--config`, lykn computes an **effective config**: it reads `project.json`,
overlays `project.local.json`'s `imports` (local wins), writes the merged config
to a git-ignored path under `target/lykn/` (e.g. `target/lykn/project.effective.json`),
and passes `deno … --config target/lykn/project.effective.json`. When no
`project.local.json` exists, lykn passes `project.json` directly (today's
behaviour — zero overhead for the common case).

**Dev-only — invisible to dist/publish (critical).** The overlay applies to
**run / test / compile / macro-expansion** (dev-time resolution) **only**.
**`lykn dist` and `lykn publish` read the committed `project.json` and ignore
`project.local.json`** — so you can never stage or publish a package that points
at a local path. This is the safety property the overlay buys over a destructive
rewrite.

`project.local.json` is added to the `lykn new` `.gitignore` template.

*Merge point in code:* the effective-imports computation belongs at/near
`config::read_project_config` (so `compile.rs`'s macro import-map and the deno
`--config` generation share one merged view); `dist.rs` deliberately continues
to read the raw `project.json`.

### (b) version pinning — exact (0.6.0)

`lykn add jsr:@lykn/lang` resolves the latest published version and writes an
**exact pin**: `jsr:@lykn/lang@0.6.0/`. `lykn add jsr:@lykn/lang@0.6.0` pins the
given version. This closes problem #2 (the scaffold's unpinned specifier).

**Engine: [`nodejs-semver`](https://crates.io/crates/nodejs-semver)** (npm-exact
semantics — matches how Deno resolves), **not** cargo's `semver` (subtly
different range/pre-release semantics → could disagree with Deno). Used for:
parsing a supplied version/range, and selecting the latest published version
that satisfies it (query JSR/npm for the version list).

The Mix/rebar3 `~>` requirement DSL, a lykn-owned requirements manifest, and
`lykn update` re-resolution are **0.7.0** (BACKLOG A1.1). `deno.lock` remains the
second belt for reproducibility.

### (c) bare + trailing-slash exports pair

`lykn add` reads the package's **`exports`** (from its `deno.json` — mycelium's
`mycl-html` declares `"exports": "./mod.js"`) and emits **both** import keys:
- **bare** (`"testing"`) → the package **entry** (`mod.js` per `exports`).
- **trailing slash** (`"testing/"`) → the package **directory** (sub-path imports).

For registry adds the values are the `jsr:`/`npm:` specifier (bare) and its `/`
form (slash). For a `link` override, the values are the built entry file and the
build directory (see (d)). The user never hand-derives the pair.

### (d) build-dir resolution (local)

`lykn link <package> <local-path>` resolves the override to the **built** output,
never the source:
- bare → `<local-path>/target/lykn/build/<pkg>/mod.js`
- slash → `<local-path>/target/lykn/build/<pkg>/`

It **requires the local project to be built**: if `<local-path>/target/lykn/build/<pkg>/`
is absent, `lykn link` errors with `run 'lykn build' in <local-path> first` —
lykn does **not** auto-build another project. (Problem #4: the naive
`packages/<pkg>/` is source `.lykn`, unimportable.)

### (e) macro axis — via the existing `PackageKind`

lykn already classifies packages: `config::PackageKind::{Runtime, MacroModule,
Tooling}` (declared as `"lykn": {"kind": …}` in a package's `deno.json`).
`lykn add` reads the added package's kind:
- **`MacroModule`** (e.g. `@lykn/testing`) → wire the **`import-macros`** axis
  (the macro specifier), so `(import-macros "jsr:@lykn/testing" …)` resolves.
- **`Runtime`** → the value imports (the bare+slash pair).
- A package may be both if it exposes runtime exports *and* macros — emit both.

No new metadata convention is invented; `lykn add @lykn/testing` sets up both
axes in one command.

### (f) workspace targeting — root now

`lykn add` writes to the **root `project.json`** `imports` (workspace members
inherit — matches mycelium). A `--package <member>` flag for member-scoped
dependencies is **shaped, not built**: add it when a user needs per-member
declaration. 0.6.0 is root-only.

---

## 4. Worked example (mycelium)

```
$ lykn add jsr:@lykn/lang            # resolves latest → pins exact, emits pair
  added @lykn/lang@0.6.0  →  project.json:  "lang/": "jsr:@lykn/lang@0.6.0/"
$ lykn add jsr:@lykn/testing         # MacroModule → value pair + macro axis
  added @lykn/testing@0.6.0  →  "testing", "testing/", + import-macros resolves

# develop against a local lang checkout:
$ lykn link @lykn/lang ../lang       # requires ../lang built
  linked @lykn/lang → ../lang/target/lykn/build/lang/  (project.local.json, git-ignored)
  … lykn run/test now use the local build; lykn dist/publish still use @0.6.0

$ lykn unlink @lykn/lang             # flip back — the @0.6.0 pin was never lost
```

---

## 5. Cache population

After a registry `add`, run `deno cache` (or `deno info`) on the new specifier so
the first `lykn build`/`test` doesn't cold-fetch, and to surface a resolution
failure at `add` time rather than mid-build.

---

## 6. Scope & non-goals (0.6.0)

**In:** `lykn add` (jsr:/npm:, exact-pin, bare+slash, cache, macro axis, root),
`lykn link`/`unlink` (dev overlay, build-dir, require-built), the dev-only
effective-config merge, `.gitignore` += `project.local.json`.

**Out (→ 0.7.0 build-tool arc):** the Mix/rebar3 `~>` requirement DSL,
lykn-owned requirements manifest, `lykn update`, `lykn remove`, `--package`
member-scoped adds, non-exact ranges in the stored specifier.

## 7. Implementation wrinkles for slice03 (flag, don't solve here)

- **Effective-config path resolution.** Relative override paths
  (`../lang/…`) in `project.local.json` are project-root-relative; when written
  into `target/lykn/project.effective.json` they must stay correct (keep
  root-relative or absolutize). Nail in slice03 with tests.
- **`exports` discovery for registry packages.** For a local/workspace package
  the `deno.json` `exports` is on disk; for a *registry* package `lykn add` needs
  the published metadata (JSR/npm) to emit the bare entry precisely — or fall
  back to the conventional `mod.js` + `/`. Decide the fallback in slice03.
- **N1 corollary → slice04.** How a *test* imports its own built local package
  (relative `../render.js` dangles under the `target/` model) is the
  external-resolution problem — **slice04**, not `lykn add`. `lykn add`/`link`
  produce the import-map specifier that slice04's resolution must honour.

## 8. Test surface (the wide tests)

Specifier parsing (jsr:/npm:, with/without version); exact-pin resolution via
`nodejs-semver` (latest-satisfying selection; pre-release handling); bare+slash
pair emission from `exports`; **overlay precedence** (local wins over base) and
**dist/publish ignore the overlay** (the safety property — assert a linked dep
does not appear in `lykn dist` output); `link` errors when the target isn't
built; macro-axis wiring for `MacroModule`; `.gitignore` contains
`project.local.json`; effective-config path correctness.
