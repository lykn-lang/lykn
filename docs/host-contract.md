# Protected host contract v1

Lykn's compiler protects selected JavaScript host bindings from source-level
writes. Version 1 protects the global `Reflect` binding and the exact
`Reflect.apply` slot. It does not freeze `Reflect`, validate calls, or constrain
other host objects.

The compiler rejects writes it can prove target those names. Proof follows
Lykn member paths and literal computed string keys, uses JavaScript identifier
normalization, and observes lexical bindings in their scopes. A local binding
named `Reflect` is not the host global. Dynamic keys and arbitrary aliases are
unknown and are not guessed. A write to the real `globalThis` binding or its
`globalThis` property makes alias-based proofs unknown for the whole unit;
direct writes to the real `Reflect` binding remain protected. This is a
conservative whole-unit check, not flow-sensitive JavaScript name resolution.

The source compiler checks the complete expanded input before assertion
stripping. Kernel and raw code-generation entrypoints check their complete
input units. Checking a fragment cannot account for bindings or alias changes
outside that fragment. Macro bodies are compiled as compiler-owned functions;
their implementation text is not itself treated as runtime program code. A
macro body that emits a protected write is still rejected when that emitted
program is compiled.

The diagnostic has Error severity and identifies the protected slot. The
compiler does not emit output for a rejected unit. During `lykn build --dist`,
the first classifier diagnostic is retained as a typed language error for the
source path. A failed file is not overwritten with generated output.

Dist compilation remains conditional on the existing incremental
`needs_compile` decision. An unchanged file that is not recompiled has no new
compiler observation in that invocation.

## Lazy protected invocation

The compiler's private protected-invocation plan applies only to an exact
compiler-owned call whose callable, receiver and argument list have already
been evaluated and saved. It preserves that order and delegates the final
invocation to `Reflect.apply`. Ordinary source calls, source text that merely
resembles the private plan, and compilation with no request do not select this
facility. With no request, generated output remains unchanged.

When a requested module has no real normalized module-scope `Reflect` binding,
the compiler emits the existing lazy local helper. When a requested module
does bind `Reflect`, the compiler preserves that binding and any direct
`eval` lookup of its live value. It emits one feature-local static named
import for the protected operation from a fixed inline JavaScript data module.
The generated import is placed after leading directives. Requested calls use
its collision-free local name. Multiple requests in one module share that
single import. This is an internal compiler path, not a new Lykn form or
package export.

The data module is contained in the emitted JavaScript file, so the compiler
does not add an external package, sidecar file or runtime library. Loading the
file still requires an ESM host that permits importing a `data:` module. A
host's Content Security Policy, import policy, or loader may disallow inline
data-module imports; applications using such a host must account for that
restriction. No loader registration or policy override is performed by
Lykn.

The fallback and its tree-shaking behavior were exercised with Deno 2.9.6 and
esbuild 0.25.5. The direct-eval live-binding behavior is exercised on emitted
unbundled output. The tested esbuild version does not guarantee preservation
of arbitrary top-level ESM bindings observed through direct eval after
bundling, so no such bundled-eval guarantee is made.
