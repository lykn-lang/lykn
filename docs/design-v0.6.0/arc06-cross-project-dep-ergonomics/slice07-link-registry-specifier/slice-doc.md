# arc06 · slice07 — `lykn link` for a literal registry specifier (recon → impl)

> **Open set** (2026-07-24, operator). Pulled into **0.6.0** from the runsheet
> C-bis finding: a downstream can't currently point a *literal* registry
> specifier (`jsr:@lykn/testing@0.5.2`) — especially a **macro module** — at a
> local build. `lykn link` (slice04) overrides import-map *alias* keys, but a
> literal `jsr:`/`npm:` specifier bypasses the map. This slice makes the override
> work, so mycelium can test against **current-source** lang/testing (the real
> C-bis demo). Operator chose **recon-first**: prove the hook point + surface the
> design forks (**07a**, this), sign off, then implement (**07b**).

## 1. Goal

`lykn link jsr:@lykn/testing@0.5.2 <path>` (dev-only overlay) redirects that
exact specifier to a local build, honored by macro **and** runtime resolution,
while `dist`/`publish` keep reading the raw `project.json` (the slice04 safety
property is preserved). Removes the runsheet's C-bis limitation.

## 2. The split

- **07a — recon (this).** Prove *where* the override must hook in the resolver
  and that it's honored once added (a failing→passing micro-proof), and surface
  the design forks that shape 07b. **No production code lands** — the spike is
  reverted; evidence lives in `recon-findings.md`. **Sign-off gate before 07b.**
- **07b — implement (next).** The resolver hook (production form + tests), the
  `lykn link` CLI extension (accept a literal specifier; resolve the right local
  dir), the safety test (dist/publish unaffected), and the mycelium C-bis demo
  made real. Scoped by 07a's findings + the operator's design calls.

## 3. Recon result (see `recon-findings.md`)

- **Root cause is a resolver ordering fact**, not a `lykn link` bug:
  `pass0::resolve_specifier` checks the **scheme** (Tier 1: `jsr:`/`npm:` → Deno)
  **before** the import map (Tier 2). So a literal specifier fetches from JSR and
  never consults an overlay override. **Proven** (failing→passing micro-test).
- **Fix is contained:** an exact import-map override at the top of
  `resolve_specifier`, ahead of the scheme branch. The plumbing (effective
  `imports` → `expand` → `pass0`) already exists.
- **Design fork surfaced (macro source):** a *macro-module* override must point
  at a dir containing **`mod.lykn`** (the macro source the expander compiles).
  `lykn link`'s build dir (`target/lykn/build/<pkg>/`) has **only compiled `.js`**
  — the `.lykn` source lives in `packages/<pkg>/` and is copied into
  `target/lykn/dist/<pkg>/`. So the macro-override target is **dist (or source)**,
  not build — a 07b decision.

## 4. Exit criteria

- **07a:** the ordering finding + hook point are proven (failing→passing
  evidence recorded); the macro-source fork + the open design questions are
  written for the operator; tree left clean. **← this deliverable.**
- **07b (after sign-off):** resolver override lands with tests; `lykn link`
  accepts a literal specifier and resolves the correct local dir; dist/publish
  safety test green; mycelium builds+tests **43/0** against current-source
  testing; `make check` green.

## 5. Consumes / feeds

Consumes slice04's overlay + safety model and slice06's `0.6.0-dev` toolchain.
Feeds the arc06 close: turns the runsheet's routed C-bis limitation into a
shipped 0.6.0 capability. The 0.7.0 build-tool arc (the `~>` DSL / `lykn update`)
is unaffected — this is the dev-overlay half, not version resolution.
