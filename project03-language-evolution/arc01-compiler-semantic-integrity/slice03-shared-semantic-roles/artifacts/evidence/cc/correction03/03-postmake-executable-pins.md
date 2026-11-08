# Final post-Make executable pins

Observed after the successful full `make check`; no build follows before direct focused use.

| Role | Exact path | SHA-256 |
| --- | --- | --- |
| debug CLI | `target/debug/lykn` | `ec97c00a0910e623db67d5d9341c04bb0b643077456f1aaadef755dafcb81d7c` |
| release CLI | `target/release/lykn` | `b600a1447cc057e4a819ddb2b407ca996ab86f741854e862e2cbfb7de0315936` |
| copied release CLI | `bin/lykn` | `b600a1447cc057e4a819ddb2b407ca996ab86f741854e862e2cbfb7de0315936` |
| `semantic_roles` test executable | `target/debug/deps/semantic_roles-cb18f482652d85e9` | `04b1dd7ad54365d055aa78b5681171e3989f07c0a8a104d5147609c2efd14541` |

Deno: `/opt/homebrew/bin/deno`, version `2.9.6` (V8 `15.0.245.2-rusty`, TypeScript `6.0.3`), SHA-256 `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.
