# IC-01 correction02 — explicit pattern grammar and single traversal

Root's bounded repair against b8a1fa17cf9543c22a52228d17f0dd19e3fcf0a1,
tree d3e604b206cfedac1ec97a5932ba8b1bb5fca61f. Independent corrected-candidate
review confirms R01–05 repaired but holds IC-01 on R06–08. The original role
contract and correction01's resolved ordering/B2 limits remain binding.
This attachment supersedes correction01's ambiguous source/kernel terminology,
not the language grammar or existing public API signatures.

## Binding decisions and source recipe

**R06: producer-selected grammar, mandatory at every private call.**
`binding.rs::pattern_occurrences` silently selects Source; `binding.js::patternNames`
does likewise. `bind_names`, `loop_names`, catch and public equivalents inherit
that selection even though their patterns use the JavaScript-shaped writer
grammar. Thus `(alias :value package)` loses its actual local binder: the
keyword is an external property key, not a type marker. The safe renamed
source bind and loop counterparts compile/run, so this is supported grammar.

Use a private Rust enum with semantic variants `TypedParameter` and
`BindingPattern`, and equivalent explicit private JS grammar arguments.
Names are local discretion, but the semantic distinction is binding. Remove
the private Source-default wrapper/default arguments: every projection and
default-traversal caller must supply its producer's grammar. Preserve public
`bindingNamesInPattern(pat, kind)` and the crate helper's signatures through
wrappers selecting BindingPattern for their grouped-bind consumers. No new
public API, export, dependency or mutable/global grammar state.

| Actual producer | Required pattern grammar |
| --- | --- |
| Typed func/genfunc clause args and fn/genfn/lambda source parameters | TypedParameter |
| Kernel function/function*/lambda/arrow parameter lists | BindingPattern |
| Existing class method/accessor/wrapper raw parameters | BindingPattern |
| Source bind, including grouped and typed outer bind forms | BindingPattern |
| All const/let/var declaration patterns, bare or kernel-tagged/escaped | BindingPattern |
| for-of/for-in/for-await-of binding patterns | BindingPattern |
| Existing catch binding patterns | BindingPattern |
| bindingNamesInPattern/binding_names_in_pattern grouped-bind consumers | BindingPattern |

Do not infer grammar from a keyword or merely from a form being surface source.
In TypedParameter, `(alias :type key pattern)` projects nested pattern at3;
key2 is data. In BindingPattern, `(alias key local [default])` projects local2
and visits optional default3. Default/rest offsets follow the same explicit
producer choice. Recursive calls carry that choice unchanged. Match/if-let/
when-let keep their separate match-pattern grammar. Legacy class aggregate
D1 semantics remain untouched; only the already authorized shared projection
correctness changes. Native resolved lambda handling must respect actual tags
and existing pipeline grammar rather than treating a source lambda as kernel
solely by its spelling.

In both binding modules, inventory every caller of pattern projection and
default visitors in the CC receipt, assigning it to this table. Inspect actual
classifier/writer consumers where needed, without adding syntax. Update
bind/default traversal as well as name projection; avoid a negative-only
patch that still misinterprets executable defaults.

**R07: separate function header structure from executable regions.**
Public `walk` currently visits parameter defaults, then falls through to
`bindingScopePlan` with bodyStart0 and traverses the header again. Native's
kernel path already skips the parameter slot; retain its useful behavior and
verify count parity. A global dedup Set is rejected: distinct real binding
occurrences must remain distinct, including identical spellings.

Recommended public implementation: after the existing one-time
`bindingsIntroduced(form)` projection, handle source fn/lambda/genfn and kernel
function/function*/arrow forms with an explicit function branch and return.
Determine the existing grammar's parameter slot (source anonymous/arrow first,
named kernel function second, supported anonymous generator first), extend a
local parameter scope from actual introduced sites, traverse its defaults once,
then `walkSequence` only the body arguments following that slot. Never walk
the name, parameter structure or type markers as expression children. Keep
incoming Sets unchanged and body declarations local to the function. Do not
add public kernel:lambda escape support or relax named plain-function grammar.
Named func/genfunc retain the shared keyword-group visitor and pre/body/post
ordering policy from correction01, including ignored/overridden metadata.

**R08: empty malformed source headers use normal compiler diagnostics.**
Native `walk_source_function` slices `args[1..]` when args is empty. Replace
that assumption with `split_first` or checked access before projecting the name
and obtaining the remaining clause/header forms. An absent name produces no
invented binder; return control to ordinary classification, whose existing
missing-name diagnostic must survive. No panic-catching workaround, new error
policy or broad malformed-grammar rewrite. Inspect the other new header indexes
for this same empty-input assumption only.

## Discriminating proof and sequencing

First retain/replay all R01–05 witnesses. Then repair and run these pairs before
full gates:

- R06 loop: `(for-of (object (alias :value package)) (array (obj :value 1))
  (console:log 1))` must reject the actual package binder before JS execution.
  Renaming package to local must compile/run1 with empty stderr. Repeat source
  bind using the review's retained valid counterpart. Test keyword external key
  with legal local, and reserved external key with legal local, preserving the
  typed nested-alias positive from correction01. Exercise native checked/strip
  compile/check, public complete/expandExpr/direct gate where applicable.
- Follow the explicit call-site table for other supported loop/catch/declaration
  paths with focused pattern projection/default tests. Catch emission has an
  older safe-counterpart failure: a direct-gate role test is valid evidence;
  it is not runtime proof or permission to repair the old emitter.
- R07 count actual `walkBindings` occurrences: named function with one default
  expression introducing local and an inner lambda parameter returns
  `[example,value,local,inner]`, each once; source fn and arrow return the
  corresponding parameter/local/inner list once. Include generator/anonymous
  variants supported by the existing grammar, plus named func/genfunc and
  class/declaration once-only witnesses already green. Assert distinct same-name
  real occurrences remain present; no output deduplication. Execute supported
  positive outputs and prove malformed/restricted defaults still reject.
- R08 `(func)` and `(genfunc)` reject through normal native checked/stripped
  compile and check with existing missing-name errors and no exit101/panic;
  public ordinary error behavior is retained. Also assert the walker itself
  safely returns no fabricated bindings. Valid zero-argument shorthand bodies
  and named definitions must still work.

Retain all old negative/positive tests. Then mirror changed modules into the
embedded package and run fresh actual cold M6 (current twelve-file union and
all existing/new public cases, derive denominators), full make check with docs
once, committed-HEAD citations and browser80KiB. Stop full gates on known-bad
software; correct bounded implementation issues before fresh final gates.

## Guidance application and readiness

| Applied guidance | Decision and proof |
| --- | --- |
| rust-guidelines guides/05-type-design.md TD-01/02 SHOULD | Required private semantic enum replaces ambiguous default grammar; every call explicitly selects an actual producer. No public Rust signature change. |
| rust-guidelines guides/03-error-handling.md EH-01 MUST | Malformed user source uses existing fallible classification, never a slice panic; verify normal compile/check failures. |
| javascript-deno-guidelines guides/02-api-design.md ID-03 SHOULD | Required grammar is an explicit private argument, while public optional bindings/options and helper signatures remain compatible. |
| javascript-deno-guidelines guides/03-error-handling.md ID-01/03 MUST | Any private impossible grammar assertion uses an Error with context, not a string; user-source diagnostics stay existing compiler errors. Runtime assertion is local discretion, not a new user API. |
| testing validation-gate discipline | Paired valid grammar/runtime cases distinguish a real binder defect from unsupported input; occurrence counts distinguish repeated visits from output-set coincidence. |

Root inspected both binding modules, their projection/default callers, public
scope plans and native function header logic at the exact pin. Consequential
grammar, ordering, signature and failure choices above are binding; private
helper names/factoring are local discretion. This changes the causal method
from a Source fallback to mandatory producer selection and from generic header
rewalking to one structural traversal. No unresolved public design decision is
delegated to CC. All LC-02–08, B2 scope/native ordering, S06 API and evidence
limits remain open. Release stays0829e892; no integration or external action.
