---
project: project03-language-evolution
arc: arc01-compiler-semantic-integrity
slice: slice18-ordered-member-calls
status: in-progress
depends-on: [slice17-ordered-lexical-calls]
---

# S18 — ordered calls through static members

This is the next bounded I3 delivery following S17 acceptance.
Luna 6 High CC implements and separate Sol 6.1 High CDC owns
readiness and independent acceptance in standard Autonomous Mode.
The task checkout remains `codex/completion-value-flow`. Source
starts only after the accepted S17 handoff.

A genuine ordinary one-segment public colon member call in the
existing unprotected direct named-function region evaluates the
receiver and reads the callable before the first argument. Direct
argument prefixes run once in source order. The final call uses
the saved receiver and callable even if a later argument replaces
the property. A source transfer skips later effects and invocation.
Keep the ordinary no-prefix call and output. The boundary includes
statement, return and simple bind destinations, excludes private,
chained, computed and special interop references, and fails closed
for a mixed spread plus lifted arguments at admitted sites.

Reuse the accepted [Arc03 protected host invocation](../../arc03-protected-host-intrinsics/cdc-verification.md)
and its protected slot, local support and exact inline fallback.
Materialize normal helper call and support nodes at the real
whole-kernel boundaries. Native whole module, CLI kernel JSON and
public `expand` output contain ordinary finalized nodes. The
existing JS `compile` must work on original, cloned and serialized
expanded units. Standalone checked Rust `emit_form` reports an
actual request needing whole-module placement through the existing
Codegen error, with precise guidance to `emitter::emit`; existing
request-free behavior and public signatures remain. Public surface
audit owns the new single-form outcome.

Actual generated provider/entry pairs prove native and public
strict runtime and pinned native esbuild shape and effects.
Check absent, retained uncalled, removed and live support separately
for local and true normalized Reflect fallback. Distinguish actual
no-init read from a host observer outside the protected contract.
Existing loader/CSP and bundled direct eval boundaries apply.

Computed references, assignment keys and iterator transport stay
in I3. Checked/deferred completions, I4, K and release propagation
are outside this delivery. CV-04 and CI-04 remain open. S18 gets
its own source refinement count only on opening.
