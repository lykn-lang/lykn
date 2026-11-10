---
project: project03-language-evolution
arc: arc02-ad-hoc-maintenance
slice: slice04-browser-macro-loader-split
status: in-progress
depends-on: [slice03-dd37-browser-bundle]
---

# S04 — Browser macro loader split

The Operator approved S04 followed by S05 in standard Autonomous
Mode. Fresh Luna 6 High CC implements, and Sol 6.1 High CDC
independently accepts. The exact base is `b0c97f4e` in the existing
`codex/completion-value-flow` source checkout. Its 80 KiB release
cap and historical-source comparison are the governing meter.
Release integration requires its own authority.

Deliver a shipped browser IIFE with no Deno external macro loader
and one shared expansion pipeline. Keep the published package's
Deno route, private module boundary, and explicit same-version
embedded cache separation. Both the CLI browser builder and meter
select the same browser adapter while the historical tree uses its
original route. S05 owns the separate ESTree bridge work.

The current [assignment](cc-prompt.md) specifies architecture,
fixtures and proof. Durable original outputs and measurements
live under `artifacts/`. Scope includes independently verified
normal Make, citations and fixed-pin budget. The task endpoint is
accepted S04 followed by the commissioned S05 composition.
