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
