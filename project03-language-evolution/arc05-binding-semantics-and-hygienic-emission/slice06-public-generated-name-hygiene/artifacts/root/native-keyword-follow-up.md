# Native counterpart watch for the next binding design

2026-11-14, immutable source89ab9dcd (native files unchanged from accepted82).
This is a source-assessed follow-up, not a new executed native defect claim.
No native source, test, build or runtime probe was changed/run for this note.
The current S06 delivery remains PUBLIC; its five fixes do not prove native
parity for the newly demonstrated reconstructed-keyword role.

Read complete native source_names.rs and actual threading/codegen functions:

- crates/lykn-lang/src/emitter/source_names.rs handles four threading Surface
  forms by visiting ThreadingStep::Bare/Call SExprs. Its expr branch explicitly
  ignores SExpr::Keyword, alongside literal data.
- emitter/forms.rs apply_threading_step3490–3540 converts a bare keyword or
  keyword-headed call to an executable atom member name; emit_some_thread3573+
  chooses a generated t temporary before applying those steps.
- codegen/emit.rs emit_method_call1099–1113 writes the normalized atom member
  directly after '.', then call arguments. Thus embedded computed identifiers
  in keyword member text need a role-aware occurrence/occupancy assessment here
  too; a generic keyword-is-data assumption is not sufficient evidence.
- emitter/gensym.rs1–40 confirms the native temporary spelling is also
  prefix__gensymN; next("t") initially chooses t__gensym0 when unoccupied.

Public F2 supplies the exact causal mechanism and viable function-array
consumer. Before opening native exact-binding work S07, its owner should check
the corresponding native suffix/name and actual CLI output, then either repair
a reproduced native occupancy prerequisite in a bounded increment or explicitly
dispose a verified backend difference. Native current evidence has not been
rerun or silently reclassified; accepted S05/82 history remains intact.

S07/S08 and Arc06 LI-04 also need the broader language-design input: raw member
spellings can carry executable computed references, including ones originating
as keywords. S06 conservatively occupies physical names without resolving or
renaming those bindings. Exact Source identity, diagnostics, protected-root
classification and guide/book treatment must account for that actual syntax;
no new permission to accept arbitrary JavaScript or a new grammar ban is chosen.
This watch opens neither a native implementation nor an experiment/new slice.
