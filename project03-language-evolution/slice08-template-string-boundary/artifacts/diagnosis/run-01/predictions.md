# Run 01 — frozen case identities and predictions

Frozen against task source `b841f71b30eb2c3e340a651ae1d57de04fec3d79`,
`Cargo.lock` SHA-256
`672c8bf62e441cfaa6ec22bd511d55e002812d8f18814faea0e99d4c5e2813ce`, and
baseline native compiler SHA-256
`e69f67f4cbc8cda4b9a3a82436bd3375f277d68c45387dae7ac7fc2a9ba32ae8`
(`lykn 0.6.0`). Cases are six separate Lykn source modules in this directory.

| Case | Decoded input by ID-33 | Fields / expected diagnostic comparison |
| --- | --- | --- |
| P1 | U+005C U+006E (`[92,110]`) | plain, interpolation, two-literal concat, single-literal ICU; plain/interpolation predicted to preserve slash+n, template text potentially to cook it again as LF |
| P2 | U+005C U+0022 (`[92,34]`) | same four paths; plain/interpolation predicted to preserve slash+quote, template text potentially to lose the slash |
| P3 | U+000A (`[10]`) | same four paths; exact decoded LF control, expected to remain LF in values |
| P4 | U+000D (`[13]`) | same four paths; exact decoded CR control, potential template physical-line normalization to LF |
| P5 | U+005C U+0060 U+0024 (`[92,96,36]`) | same four paths; tests backslash/delimiter/`${` introducer escaping order and whether generated JS is syntactically valid |
| P6 | U+005C U+006E (`[92,110]`) | raw result from `String:raw` for P1 forced concat and one-literal ICU; predicted post-expansion template raw strings reflect generated JS spelling, not the original Lykn token bytes |

| Source | SHA-256 |
| --- | --- |
| `P1-backslash-n.lykn` | `0eea2953da28dbedadbde3133691d0e8ed0ce7e9832d82d8c2402248482ffd68` |
| `P2-backslash-quote.lykn` | `d90dc573cf1e7dc6a4d43c4682b41639e661ab877eef25b2f2ec7eb1bc138cb2` |
| `P3-line-feed.lykn` | `c9a39c8a767edd67fead4f5fdc9afbc7eef38dc1156c60ddba487c4bf6a7d733` |
| `P4-carriage-return.lykn` | `cce56e9214a871d575417bf7b74d5b87d612d41a4c1f04dae2e97084bbbe3a03` |
| `P5-backslash-backtick-dollar.lykn` | `f2ccbbd7ba1d26a134dcfbc45bc8a0ceca7d378b7ee28b7a62bb0f86afe923ce` |
| `P6-tag-raw.lykn` | `bd2ce70e120a81aee998d7342c97f2f1056fe91775e787c5ab42d29ac034987d` |

Denominator is 22 runtime values: four each for P1–P5 and two for P6. If a
module fails to compile or parse, its dependent values remain unestablished.
No command has executed these cases yet. Raw stdout/stderr are not predicted as
observations.
