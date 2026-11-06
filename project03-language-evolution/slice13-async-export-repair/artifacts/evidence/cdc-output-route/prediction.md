# Same-condition output-route confirmation, before execution

Frozen negative source is exactly the bdad422 CLI test's `reserved.lykn` value:
`(func default :args () :body 42)\n(exports default)\n` (two LF-terminated lines).
This is the SAME observed test condition, not a new fixture family. Use only
baseline release compiler57a49f55/sourcef705655, `compile <source> -o <owned result.js>`,
from a fresh config-free cwd. Do not run stdout compile, other source variants,
parser, full tests or another repair. Output/errors/actual success code and JS/
DTS are retained. Guide09 ID42 says JS reserved words are rejected at every
binding position at compile time; philosophy Principle3 makes malformed output
compiler-owned. Expected contract: reject `default` binding. If accepted,
inspect actual emitted binding/export names before deciding whether legitimate
escaping explains the observation. Do not assume the lost original temp output
was invalid or reconstruct it. This fresh artifact is a new independent receipt.
