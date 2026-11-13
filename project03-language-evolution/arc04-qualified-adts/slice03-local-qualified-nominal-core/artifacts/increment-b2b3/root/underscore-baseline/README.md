# Underscore binding-contract baseline

Root source-readiness check2026-11-13 after independently accepted57c76c99,
treef044d795e88c3dac8e84a73a557cf071edd5327c; source/build returned clean to root.
No source edits, helper program or language-contract choice in these probes.
Existing source projectors omit _ in binding queries while emitted parameter/
catch grammar handles it differently. These three actual canonical source
programs determine current behavior before a later naming contract is issued.

Pinned executable:
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/bin/lykn
SHA2566a6318332f100623252f25f278f4a1060f7f420861e2c0aa5457350799744b9a.

Every invocation cwd=/private/tmp/lykn-b2b3-author; precreated owned dirs:
XDG_CACHE_HOME=/private/tmp/lykn-b2b3-author/xdg,
NPM_CONFIG_CACHE=/private/tmp/lykn-b2b3-author/npm,
TMPDIR=/private/tmp/lykn-b2b3-author/tmp;
DENO_DIR=/Users/oubiwann/Library/Caches/deno.

For each fixture name scalar-parameter, array-parameter and array-catch:

```text
env <four variables above> <pinned binary> compile <absolute this directory>/<name>.lykn -o /private/tmp/lykn-b2b3-author/<name>.mjs
env <four variables above> deno run --no-config --cached-only --no-npm --no-remote --deny-net --no-prompt /private/tmp/lykn-b2b3-author/<name>.mjs
```

Commands run directly with raw stdout/stderr redirects to adjacent files;
numeric statuses come from actual tool results. Generated ESM is copied beside
the source after compilation. This command record precedes execution; no
anticipated outcome is claimed. Any inconsistency is a language-contract
design input, distinct from the independently accepted ICU software gates.

## Actual results

All three compile and runtime statuses are0.

| Source binder | Generated shape | Exact runtime stdout |
| --- | --- | --- |
| scalar parameter :any _ | function take(_) returning _ | 7 newline |
| array parameter (array _) | function take([]) returning outer _ | 99 newline |
| catch (array _) | catch([_]) logging _ | 7 newline |

Scalar compilation additionally prints the preserved warning at2:24 that _
shadows an outer binding. Other compile stderr and all runtime stderr are
empty. Raw streams/statuses/generated files remain adjacent. The array
writer's actual [] spelling is retained; these probes do not establish an
iterator-consumption contract for a trailing hole.

The source binding projector omits _ more broadly than these actual emitted
bindings; semantic ScopeTracker nevertheless reports scalar shadowing. Root
asked an explicit B2-ID-DISCARD language-contract question: true discard in
binding patterns (with _value as an ordinary binding), or ordinary _ except
the existing explicit skip/wildcard positions. Operator has not answered.
B2-ID-NAME remains RESOLVED; this does not reopen distinct-spelling identity.
General dependent naming/discard lowering remains unissued until the actual
response, not inferred from a preselected UI option or elapsed time.
