# Authoring and reference record

CC, Codex/Sofie, 2026-09-13. Model/settings beyond the session identity are not
available in a durable experiment record. Prior Slice03/05/06 experience and
their CDC reports informed this work; it is not a blinded guide experiment.

## Failed conditions retained

1. First cases.lykn passed check/lint/compile but emitted COMPILE_ERROR throws
   for a catch-final and finally-final `if` without else. Retained source and
   emitted output are under meta/authoring-01. This repeats the known JSCF class;
   no new root-cause finding or source repair is asserted.
2. After moving those conditions into helpers, emitted review found `? throw`
   syntax and use of the `conj` macro as a first-class callback. Helpers and an
   explicit append function replace these in the final draft. Original emitted
   evidence is meta/authoring-02. Its exact source was reconstructed from the
   retained first source and the recorded edit; recompilation matches the
   original second emitted output byte-for-byte. This remains authoring error,
   with known compiler validation gaps; it was caught before runtime.
3. The first planning-audit draft used `decode-uri-component`, which emitted
   nonexistent `decodeUriComponent`. Emitted review caught this before execution;
   the correction uses the exact native identifier `decodeURIComponent`.
   meta/gates-05 retains the original output, reconstructed source and successful
   byte comparison after recompilation. This is an authoring error.

The final cases and audit drafts pass source gates and the targeted emitted
review. Cases are **not runtime-validated**. The audit's native generation,
published-file and packet modes subsequently ran through the operator-suggested
eval route. Used-binding warnings are retained.
Three failed source conditions have consumed correction headroom; do not reset
the five-condition slice budget when resuming. Review the concurrency/draft
generator carefully before expanding it. The launcher failure is a separately
identified runtime-condition gap, not an additional source repair or a package result.

The earlier audit source used to enumerate downloads was reconstructed after
later edits; its emitted bytes match the retained gates-01 output exactly.
The first later freeze was blocked; the subsequent eval route generated a
clearly labeled candidate inventory. A dependent shell sequence still
attempted package gates/copies after that failure; absent-output diagnostics and
the incomplete frozen-01 directory are retained. This was execution discipline
error, not successful freeze or a separate package/compiler failure.

## References actually read

- Installed collaboration-framework, project-management, work-verification,
  scientific-methods and rust-guidelines SKILL entry points (selected portions
  where output was truncated). The installed Rust substitute was already
  explicitly authorized by the operator; no permission question was pending.
- Project-management guides/README.md, 01-scales-of-work, 03-planning-top-down,
  04-closing-slices and 05-closing-arcs; work-verification 01-ledger-discipline
  and 03-row-closure; scientific-methods 06-evidence-capture.
- Pinned d0bb981 Lykn assets/ai/SKILL.md; 09-anti-patterns (selected sections and
  summary, not an assertion that all truncated output was read); 01-core-idioms
  IDs 01–04, 19–21, 31–35; 02-api-design IDs 01–03; 03-error-handling IDs 01–04;
  07-async-concurrency IDs 13–14, 17–19, 23–24; 10-project-structure IDs 01,
  08–10, 22–25; complete 14-no-node-boundary.
- Project/arc plans and ledgers, Slice04 open set, FM01/RP01 and Slice01 findings
  and source-register sections; JSON, YAML preflight, value and resource/file CDC
  reports; retained Slice06 supervisor and selected audit/generator source.
- Pinned CLI cmd_run and existing run_permissions tests; captured Deno v2.9.6
  flags/parser/run-argument source. Current official Deno CLI/run docs were
  consulted for diagnosis; immutable captured source is the attribution anchor.
- Discovery Register protocol and targeted searches for existing launcher,
  permission, Node and compiler findings before adding D-2609-DARG.

Source skill wording allowing npm/Node conflicts with this project's explicit
scope. No exception was inferred. Lykn supplied research-source authoring and
the executed pre-upgrade URL enumeration; shell/Git/Cargo/curl supplied build,
transport, source reads, recording and byte-copy infrastructure. No alternative
programming language was used. The later operator eval suggestion supplied an
explicit route for exact Lykn-emitted native evidence tooling, with implicit-all
permissions, forced ESM, no remote/npm resolution and null stdin. It does not
validate the wrapper or replace denial cases. Human code-shape and controlled
guide/book/ADT evaluation remain Arc02.
