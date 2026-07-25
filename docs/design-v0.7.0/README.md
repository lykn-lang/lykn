# docs/design-v0.7.0 — planning tree

Planning artifacts for post-0.6.0 work, in the canonical project/arc/slice
layout per `collaboration-framework/docs/PROJECT-MANAGEMENT.md` (v2.1).

**Status (2026-07-07):** no `project-plan.md` yet — deliberately deferred
(*plan late, plan deep*). Units here are SDLC step-1 research whose reports
will inform the 0.7.0 roadmap. Write `project-plan.md` when the 0.7.0
project definition begins, using these reports.

**Consolidated candidate register: [`BACKLOG.md`](BACKLOG.md)** — the single
watched list of every 0.7.0+ candidate (the two units below, arc14, the 0.6.0
project-plan §1 routed items, CDC memory-only items, and the new build-tooling
and full-i18n efforts), each with a source and re-entry condition.

Layout confirmed with the operator on 2026-07-07, and again on 2026-07-25 for
unit 03 (canonical layout; all three units below are single slices, so the arc
wrapper is collapsed per PROJECT-MANAGEMENT.md Part II naming rules).

## Units

- `01-treeshake-audit/` — diagnostic audit of compiled-output
  tree-shakeability (both emission paths, fixtures, esbuild experiment,
  dist metadata). Feeds candidate arc: app bundling / tree-shaken output.
  Open.
- `02-packaging-strategy/` — Homebrew (custom tap) and Debian
  (self-hosted APT repo) packaging strategy, given lykn's Rust build and
  runtime dependency on Deno. Feeds candidate arc: release engineering /
  distribution. Open.
- `03-threading-macros/` — argument-position census of the ECMAScript 2025
  built-in library (489 callables) and the host surface (214 more), asking
  whether `->>` has a coherent domain in a JS-targeting Lisp. **Research
  complete 2026-07-25**; disposition owed to the language-design conversation.
  Evidence base for `D-2607-K9RT`. Feeds `BACKLOG.md` §A7 (`as->`).
