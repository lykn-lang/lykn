# Fixture grammar clarification before source freeze

The initial prompt and fixture record remain as issued at `657e4896`.
Two source spellings in that draft used `kernel:` for names outside
the actual Rust and JS escape whitelist. The first source test freeze
uses `(lambda () (return 1))` and `(class-expr ())` in those two slots.
Guide 00 and both classifiers make the first a surface alias for `fn`,
so this column covers the actual normalized arrow. Native strict
classification and the public compiler recognize the unprefixed class
expression. The runtime oracle and all other fixture fields are unchanged.
This corrects the recipe before implementation or execution, and adds
no source refinement.
