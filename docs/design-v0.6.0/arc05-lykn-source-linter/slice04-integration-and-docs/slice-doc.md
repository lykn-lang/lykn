# arc05 · slice04 — Integration + guide alignment (arc05's last slice)

> **Open set** (written 2026-07-21, CDC). The productionization + docs half of
> the old slice03 bundle, minus suppression. **The lint-suppression mechanism
> is deferred to arc14 · comment-retention** (DD-62): it depends on the reader
> retaining comments, which no backend does today — the same shape as
> arc05→arc13. slice04 closes arc05 without it; the 2 known dogfood findings are
> handled by **path-scoping**, not inline suppression.

## 1. Goal

Wire `lykn lint` into the build, align the guides with the shipped linter +
compiler, and demonstrate the whole rule set — the last steps before arc05
closes.

1. **`make lint` runs `lykn lint`** over the repo's `.lykn` source, green —
   including a decision on the 2 intentional kernel-interop fixture findings
   (path-scope, not suppress).
2. **guide-09 reclassified** (arc05 **A-6**): every anti-pattern entry's
   `**Status**` carries an accurate enforcement label —
   **compiler-enforced** / **linted-as-`<rule>`** / **documented-only** —
   replacing the blanket "ELIMINATED BY LANGUAGE DESIGN" that the CC audit
   found is true for only a minority. Doctests stay green.
3. **guide-15 + SKILL** document `lykn lint` (CLI usage, the rule set, exit
   codes, `--format=json`).
4. **The P-11 demo corpus** (arc05 **A-4**): a seeded-anti-pattern fixture set
   + a clean idiomatic set, proving every v1 rule fires exactly where seeded
   and stays silent on clean source (exit 1 dirty / 0 clean).

## 2. Scope

### In

- **`make lint` / `make check` wiring** of `./bin/lykn lint` over the source
  trees (`packages/`, `examples/`, `test/`, `src`-side `.lykn`). **Green
  requires handling the 2 dogfood findings** (both intentional `===` in
  `test/surface/kernel-in-surface_test.lykn`): path-scope them out — e.g. lint
  the source trees excluding kernel-interop test fixtures, or a small
  ignore-path list — **not** inline suppression (that's arc14). Record the
  mechanism chosen.
- **guide-09 reclassification (A-6).** Audit each `## ID-NN` entry against the
  slice01 F-1 table + the 15 live rules + the ID-12 shadowing rule + arc10's
  compiler enforcement. Rewrite each `**Status**` line to one of: **Compiler-
  enforced** (the 5 kernel-only declaration forms; D2 reserved-word rejection;
  anything the compiler hard-errors), **Linted (`<rule-id>`)** (a live
  `lykn lint` rule catches it), or **Documented-only** (neither enforces — the
  guide is the only guardrail). Keep the JS-hazard explanation; only the status
  label + fix-pointer change. `make test-docs` green.
- **guide-15 (`15-lykn-cli.md`) `lykn lint` section** + the linter note in the
  **lykn-language-guidelines SKILL** (rule set, `lykn lint <paths>`, exit
  0/1/2, `--format=json`, `.lyk` exempt).
- **The P-11 fixture corpus** (A-4): a `seeded/` fixture (one deliberate
  instance per v1 rule, in a path where path-scoped conventions rules fire) and
  a `clean/` fixture (idiomatic, zero findings); a demo/test that every rule
  fires exactly where seeded and the clean set is silent. Reproduced at arc
  scale on the host at close.

### Out (deferred / not this slice)

- **Lint-suppression mechanism → arc14 · comment-retention** (DD-62 s02). The 2
  fixture findings are path-scoped here; real inline `; lykn-lint: disable`
  directives land when arc14's reader-retention exists.
- **The arc05 close itself** — the arc-level `closing-report.md` (composition
  check A-1…A-7, bubble-up to the project, P-5) is **CDC's close-set after
  slice04 verifies**, per the arc13/slice11 lesson (the arc close is a
  close-set, not slice work). slice04 delivers the P-11 corpus; the arc close
  *reproduces* it at arc scale.

## 3. Verification approach

- **Rust**: no new lint rules this slice (the rule set is complete at slice03);
  P-11 is a fixture corpus + a runner test.
- **Docs**: `make test-docs` green after guide-09/15 edits (doctest-bearing
  fences must still compile). guide-09 label accuracy is checked against the
  live rule registry + the compiler (grep the rule IDs; spot-compile a sample).
- **`make check` green** with `lykn lint` newly in the chain (the path-scoping
  decision is load-bearing for green).
- **CDC verification**: git-ancestry + code/docs review + grep; the `make
  check`/`make lint`/P-11 runtime rows are CC-attested, reconciled on the
  operator host.

## 4. Exit criteria

1. `make lint`/`make check` runs `lykn lint` over source and is **green**; the
   2 kernel-interop findings are path-scoped (mechanism recorded), not
   suppressed.
2. guide-09 every entry carries an accurate enforcement label (compiler-
   enforced / linted-as-`<rule>` / documented-only); `make test-docs` green
   (closes arc05 **A-6**).
3. guide-15 + SKILL document `lykn lint`.
4. The P-11 seeded+clean fixture corpus exists and demonstrates every rule
   firing exactly where seeded, silent on clean (arc05 **A-4**, reproduce at
   arc scale on host).
5. `make check` green; diff is source+docs (planning edits are CDC's separate
   commit).

## 5. Consumes / feeds

Consumes slice03's resolution-aware linter + the 15+1 rules, arc10's corpus
division, the slice01 F-1 table. **Feeds the arc05 close** (A-4/A-6 done here;
A-1/A-2/A-3/A-5 already done) and **P-11** at project scale. On slice04 close,
CDC writes the arc05 `closing-report.md` (composition + bubble-up), and arc05
closes → arc06 → arc07 → arc09. Suppression re-enters via **arc14** (DD-62).
