# Submitting lykn to GitHub Linguist

This document outlines the steps for adding lykn to
[github-linguist/linguist](https://github.com/github-linguist/linguist)
so that `.lykn` and `.lyk` files are recognised on GitHub.

## Prerequisites

- The `lykn-lang/grammar` repo must be public and contain
  `grammars/lykn.tmLanguage.json` with `scopeName: "source.lykn"`.
- At least 200 unique repositories on GitHub should contain `.lykn`
  files (Linguist's adoption threshold).

## Steps

### 1. Add the grammar as a submodule

Linguist vendors TextMate grammars as git submodules. Use their
script:

```sh
script/add-grammar https://github.com/lykn-lang/grammar
```

This adds the grammar repo under `vendor/grammars/grammar/`.

### 2. Add the language entry

Copy the contents of `linguist-languages-entry.yml` (in this
directory) into `lib/linguist/languages.yml` in alphabetical order.
Leave `language_id` blank — run `script/update-ids` to generate it.

### 3. Add sample files

Create `samples/lykn/` in the Linguist repo and add two sample files:

- **`surface.lykn`** — copy from `examples/surface/showcase.lykn`
  in the lykn repo. This demonstrates surface syntax (type, match,
  bind, func, threading, cells).
- **`kernel.lyk`** — copy from `examples/kernel/main.lyk` in the
  lykn repo. This demonstrates kernel syntax (const, function,
  arrow functions).

Sample files are used by Linguist's classifier to distinguish lykn
from other languages. Choose files that are representative and contain
distinctive syntax.

### 4. Run tests

```sh
bundle exec rake samples
bundle exec rake test
```

### 5. Submit the PR

Follow the contribution guidelines at:
https://github.com/github-linguist/linguist/blob/main/CONTRIBUTING.md

The PR should include:
- The grammar submodule addition
- The `languages.yml` entry
- The sample files
- A brief description linking to the lykn language repo
