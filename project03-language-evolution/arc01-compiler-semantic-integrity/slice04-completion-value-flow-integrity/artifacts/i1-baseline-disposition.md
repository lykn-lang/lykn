# I1 baseline disposition — 2026-11-09

Luna 6 High CC ran the first I1 focused baseline at immutable test-only
`7cc78d673ab229f2cde29d2a41d23a762107cf7a` over production
`d73601a57fcf9294389eb5283e173ec0eca40091`. The native runner exited 101
with five passes and three failures. The public Deno runner exited 1,
with four passing and three failing steps. The retained raw is in
`/private/tmp/lykn-d736-release-cdc.Gdv7dxje/i1-baseline/`, with separate native and public streams and
per-observation evidence directories. These runs remain the first
observations even when a narrower successor is executed.

| Observation | Native | Public |
| --- | --- | --- |
| F1 declaration | Check/compile exit 0, strict child rejects unbraced declaration | Strict child rejects unbraced declaration |
| F2 grouped arm and macro | Check/compile exit 0, strict child rejects unbraced declaration; actual module also leaves alternate and following calls as `pick(...)` | Strict child rejects malformed branch after slot flattening |
| F3 original macro-introduced function | Check/compile exit 0, strict child rejects at generated 1:33; see NE-C14 below | Emits genuine function and exits 0; actual stdout `[7,9,[0,2,901],4]\n` exposes dangling else |

## NE-C14 — native macro binding occurrence identity

The frozen F3 source deliberately emits `(kernel:function select ...)` from
a user macro. Its complete native module starts with
`kernel.function(select, flag(), if(flag, return(7)), return(9));`.
The strict Deno child's actual SyntaxError is at 1:33 on the ordinary-call
`if` spelling. This is a defect upstream of statement bracing.

At `d73601a5`, `crates/lykn-lang/src/expander/env.rs`
`protocol_json_to_sexpr` gives each returned node `Span::default()`.
`binding.rs` `kernel_decl_names` recognizes `select` as the function
definition. `resolver.rs` `resolve_form` accumulates its span as a
subtree-wide definition lookup key. Every atom sharing that span matches,
including the explicit kernel head and inner `if` and `return`. They are
then `BindingDef` and cannot dispatch through `as_form_head` in strict
classification or emission. A source location is not an occurrence key.
Discarding default spans or adding name equality would still fail to
distinguish a definition from an equal-name reference.

S04 owns a bounded resolver prerequisite before its macro-boundary proof.
Keep this exact original source fixture, actual failing native module/receipt
and original public dangling-else receipt for later replay. I1 continues
with a separate literal declaration fixture, the same function body, calls,
loop exits, nested conditionals and exact final oracle. It can prove direct
transfers and branch isolation. F2 still exercises real native macro
expansion and pass2. This is a scope distinction, not evidence of repaired
macro binder identity or satisfaction of CV-01/CV-04. Any later remedy
must identify binder occurrences privately, retain authentic/unknown
locations for diagnostics, and test macro-generated bindings and equal-name
references, real form heads and ordinary bound calls. No new architecture
choice or resolver implementation is authorized by the I1 correction.
