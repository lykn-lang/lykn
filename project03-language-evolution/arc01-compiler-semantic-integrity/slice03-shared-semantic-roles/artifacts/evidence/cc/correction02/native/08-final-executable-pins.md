# Final native executable pins before direct focused gates

These exact producers were observed after all no-run targets and `make fresh-artifacts`; no Cargo/Make build follows before direct use.

| Role | Path | SHA-256 |
| --- | --- | --- |
| debug CLI | `target/debug/lykn` | `62460c92162cbebc89e1dd4e2d67fe5d6985aa6c0de871a9243a17c808ca2a16` |
| release CLI | `target/release/lykn` | `b8ae42b0b3af461e3bbee33957e17b36714815e8c4454d6126cb89df59bfae87` |
| `lykn-lang` lib tests | `target/debug/deps/lykn_lang-660f810f98f77866` | `416f5949b7402dff5c8c6508dda4dd952c9cb7df8a6bd93f09e9aab4ae3acb61` |
| `semantic_roles` | `target/debug/deps/semantic_roles-cb18f482652d85e9` | `46a8f1077f3bf1d9f6674cf6b55fae83bb10930e3d4a86e8f564b52cbf218210` |
| `match_clause_validation` | `target/debug/deps/match_clause_validation-7d8f7aa58e91c201` | `57e0c5238467c6f93040aa80d162e1eb060775ebf9e8a4f940e305368329c7d4` |
| `variadic_for_bodies` | `target/debug/deps/variadic_for_bodies-dc06f81c033262f2` | `82c9b2d71538c98dfb8a04d38fa2daf9d893a7282d2a604312657df06ab8704f` |
| `async_expression_values` | `target/debug/deps/async_expression_values-ca9664e9a5eacb46` | `0c6fbd965c0a4ca647c99f5362545ffd265a3d1bdc45a9ee0978a4eda299b12a` |
| `async_exports` | `target/debug/deps/async_exports-c55362a2e44ad97d` | `789800e65efa623f9d9959b107f09f94905131d58cb7dc380ef350d7932851f0` |
| `contract_predicate_lowering` | `target/debug/deps/contract_predicate_lowering-5224edfea80a9408` | `edf95f1abfdca10fcae7d780044244ba7a12787b930a82b9dfae5b32f4c74087` |
| `emission_failures` | `target/debug/deps/emission_failures-ee1302ddd95a417d` | `c47e8a9d03c82b1b07958432b623edd9eac386d17667ee8c0dcf7fec9bd5c0a5` |
| `compile_validation_parity` | `target/debug/deps/compile_validation_parity-ed5da4aecd278839` | `0069ea528cfec7ce2aa749e50dc54014bd8ac58d12f02de9266dcc3c7da84c35` |
| `template_string_boundary` | `target/debug/deps/template_string_boundary-7a0f5808c52261b8` | `b2208f066f9ed776c7f6fe2181d32e16f079d23102bf7ad88644ce4ce176e015` |

Deno executable: `/opt/homebrew/bin/deno`; task pin previously confirmed at version `2.9.6`, SHA-256 `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.
