# Slice19 setup copy error 0001

The initial extraction used the `correction-03/baseline/` source path rather
than the accepted bd3e4c7 `artifacts/tooling/` path. No dependent command ran
against either incorrectly extracted candidate.

The walker candidate from the baseline path is retained at
`estree-walker-correction-03-baseline.lykn`, SHA256
`2c0160e41877cadbea574c433bc97d0ec70c8870994ecfb8e75ce609d8edec60`. It
differs from the accepted `artifacts/tooling/estree-walker.lykn` only by one
missing close parenthesis in `flag-unlisted`; the corrected exact source is
SHA256 `6976a853a9fea81bcf47e47d634fa5bcd568e9f3b72e6f36c4f58be2bd48d1c6`.

The scanner candidate is retained at `scanner-correction-03-baseline.lykn`.
It differs from the accepted tooling source at four parenthesis boundaries in
`scan-row` and the enclosing manifest scan. Its candidate SHA256 is
`e66bb742733cdcee1ca225660a6e695ae93124e7136f40724ac6fee3a635c5cf`; the
correct exact accepted tooling source is `fbde28cd602b1403a767fbb96dfc0c8b2701fb6f5288975d48d380991fe51f77`.

The exact parser-core and capability-observer extracted from the baseline
path are byte-identical to the accepted tooling files. The tooling README was
replaced from the accepted tooling path before any check.

The exact-source freeze commit is
`89c5ea5acc71883eb1c134b1076774014ed56930`. Its raw subject/body were:

```text
Freeze Slice19 tooling from accepted bd3 sources

Co-authored-by: Codex <noreply@openai.com>

Co-authored-by: Billo AI <ai-engineering@billo.systems
```

The missing final `>` and blank line between trailers are recorded as a
commit-message nonconformance. The commit is preserved without history rewrite.
