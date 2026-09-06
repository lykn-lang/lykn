# Makefile for the Fermata Project

# ANSI color codes
BLUE := \033[1;34m
GREEN := \033[1;32m
YELLOW := \033[1;33m
RED := \033[1;31m
CYAN := \033[1;36m
RESET := \033[0m

# Variables
PROJECT_NAME := Lykn
CODE_NAME := lykn
BIN_DIR := ./bin
MODE := debug
TARGET := ./target/$(MODE)
GIT_COMMIT := $(shell git rev-parse --short HEAD 2>/dev/null || echo "unknown")
GIT_BRANCH := $(shell git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
BUILD_TIME := $(shell date -u '+%Y-%m-%dT%H:%M:%SZ')
RUST_VERSION := $(shell rustc --version 2>/dev/null || echo "unknown")

# List of binaries to build and install
BINARIES := $(CODE_NAME)

# Git remotes to push to
GIT_REMOTES := macpro github codeberg
REMOTE_macpro := ssh://macpro.local:23231/oxur/$(CODE_NAME).git
REMOTE_github := git@github.com:oxur/$(CODE_NAME).git
REMOTE_codeberg := ssh://git@codeberg.org/oxur/$(CODE_NAME).git


# Default target
.DEFAULT_GOAL := help

# Help target
.PHONY: help
help:
	@echo ""
	@echo "$(CYAN)╔══════════════════════════════════════════════════════════╗$(RESET)"
	@echo "$(CYAN)║$(RESET) $(BLUE)$(PROJECT_NAME) Build System$(RESET)                                        $(CYAN)║$(RESET)"
	@echo "$(CYAN)╚══════════════════════════════════════════════════════════╝$(RESET)"
	@echo ""
	@echo "$(GREEN)Building:$(RESET)"
	@echo "  $(YELLOW)make build$(RESET)            - Build all binaries ($(BINARIES))"
	@echo "  $(YELLOW)make build-release$(RESET)    - Build optimized release binaries"
	@echo "  $(YELLOW)make build-dist$(RESET)       - Stage packages into dist/ for publishing"
	@echo "  $(YELLOW)make build MODE=release$(RESET) - Build with custom mode"
	@echo ""
	@echo "$(GREEN)Testing & Quality:$(RESET)"
	@echo "  $(YELLOW)make test$(RESET)             - Run all tests (Rust + JS + lykn)"
	@echo "  $(YELLOW)make test-rust$(RESET)        - Run Rust tests only"
	@echo "  $(YELLOW)make test-suite$(RESET)       - Run the full suite (*.test.js + .lykn corpus)"
	@echo "  $(YELLOW)make test-lykn$(RESET)        - Run lykn surface subset (dev convenience)"
	@echo "  $(YELLOW)make test-docs$(RESET)        - Run all documentation tests"
	@echo "  $(YELLOW)make test-docs-guides$(RESET) - Test lykn blocks in docs/guides/"
	@echo "  $(YELLOW)make test-docs-readme$(RESET) - Test lykn blocks in README.md"
	@echo "  $(YELLOW)make test-docs-examples$(RESET) - Test lykn in HTML examples"
	@echo "  $(YELLOW)make test-publishing$(RESET)  - Run publishing pipeline tests"
	@echo "  $(YELLOW)make lint$(RESET)             - Run clippy, format check, and JS lint"
	@echo "  $(YELLOW)make check-cited-paths$(RESET) - Verify cited paths resolve in git on this branch"
	@echo "  $(YELLOW)make format$(RESET)           - Format all code with rustfmt"
	@echo "  $(YELLOW)make coverage$(RESET)         - Generate test coverage report"
	@echo "  $(YELLOW)make check$(RESET)            - Build + lint + test"
	@echo "  $(YELLOW)make check-all$(RESET)        - Build + lint + coverage + publishing"
	@echo ""
	@echo "$(GREEN)Cleaning:$(RESET)"
	@echo "  $(YELLOW)make clean$(RESET)            - Clean bin directory"
	@echo "  $(YELLOW)make clean-all$(RESET)        - Full clean (cargo clean)"
	@echo ""
	@echo "$(GREEN)Utilities:$(RESET)"
	@echo "  $(YELLOW)make push$(RESET)             - Pushes to Codeberg and Github"
	@echo "  $(YELLOW)make publish$(RESET)          - Publish to JSR, npm, and crates.io"
	@echo "  $(YELLOW)make install-local$(RESET)    - Install lykn CLI from local repo"
	@echo "  $(YELLOW)make tracked-files$(RESET)    - Save list of tracked files"
	@echo ""
	@echo "$(GREEN)Information:$(RESET)"
	@echo "  $(YELLOW)make info$(RESET)             - Show build information"
	@echo "  $(YELLOW)make check-tools$(RESET)      - Verify required tools are installed"
	@echo ""
	@echo "$(CYAN)Current status:$(RESET) Branch: $(GIT_BRANCH) | Commit: $(GIT_COMMIT)"
	@echo ""

# Info target
.PHONY: info
info:
	@echo ""
	@echo "$(CYAN)╔══════════════════════════════════════════════════════════╗$(RESET)"
	@echo "$(CYAN)║$(RESET)  $(BLUE)Build Information$(RESET)                                       $(CYAN)║$(RESET)"
	@echo "$(CYAN)╚══════════════════════════════════════════════════════════╝$(RESET)"
	@echo ""
	@echo "$(GREEN)Project:$(RESET)"
	@echo "  Name:           $(PROJECT_NAME)"
	@echo "  Build Mode:     $(MODE)"
	@echo "  Build Time:     $(BUILD_TIME)"
	@echo ""
	@echo "$(GREEN)Paths:$(RESET)"
	@echo "  Binary Dir:     $(BIN_DIR)/"
	@echo "  Target Dir:     $(TARGET)/"
	@echo "  Workspace:      $$(pwd)"
	@echo ""
	@echo "$(GREEN)Git:$(RESET)"
	@echo "  Branch:         $(GIT_BRANCH)"
	@echo "  Commit:         $(GIT_COMMIT)"
	@echo ""
	@echo "$(GREEN)Tools:$(RESET)"
	@echo "  Rust:           $(RUST_VERSION)"
	@echo "  Cargo:          $$(cargo --version 2>/dev/null || echo 'not found')"
	@echo "  Rustfmt:        $$(rustfmt --version 2>/dev/null || echo 'not found')"
	@echo "  Clippy:         $$(cargo clippy --version 2>/dev/null || echo 'not found')"
	@echo ""
	@echo "$(GREEN)Binaries:$(RESET)"
	@for bin in $(BINARIES); do \
		if [ -f $(BIN_DIR)/$$bin ]; then \
			echo "  $$bin:          $(GREEN)✓ installed$(RESET)"; \
		else \
			echo "  $$bin:          $(RED)✗ not built$(RESET)"; \
		fi; \
	done
	@echo ""

# Check tools target
.PHONY: check-tools
check-tools:
	@echo "$(BLUE)Checking for required tools...$(RESET)"
	@command -v rustc >/dev/null 2>&1 && echo "$(GREEN)✓ rustc found (version: $$(rustc --version))$(RESET)" || echo "$(RED)✗ rustc not found$(RESET)"
	@command -v cargo >/dev/null 2>&1 && echo "$(GREEN)✓ cargo found (version: $$(cargo --version))$(RESET)" || echo "$(RED)✗ cargo not found$(RESET)"
	@command -v rustfmt >/dev/null 2>&1 && echo "$(GREEN)✓ rustfmt found$(RESET)" || echo "$(RED)✗ rustfmt not found (install: rustup component add rustfmt)$(RESET)"
	@cargo clippy --version >/dev/null 2>&1 && echo "$(GREEN)✓ clippy found$(RESET)" || echo "$(RED)✗ clippy not found (install: rustup component add clippy)$(RESET)"
	@cargo llvm-cov --version >/dev/null 2>&1 && echo "$(GREEN)✓ llvm-cov found$(RESET)" || echo "$(RED)✗ llvm-cov not found (install: cargo install cargo-llvm-cov)$(RESET)"
	@command -v git >/dev/null 2>&1 && echo "$(GREEN)✓ git found$(RESET)" || echo "$(RED)✗ git not found$(RESET)"
	@test -f Cargo.toml && echo "$(GREEN)✓ Cargo.toml found$(RESET)" || echo "$(RED)✗ Cargo.toml not found$(RESET)"

# Build directory creation
$(BIN_DIR):
	@echo "$(BLUE)Creating bin directory...$(RESET)"
	@mkdir -p $(BIN_DIR)
	@echo "$(GREEN)✓ Directory created$(RESET)"

# Build targets
.PHONY: build
build: clean $(BIN_DIR)
	@echo "$(BLUE)Building $(PROJECT_NAME) in $(MODE) mode...$(RESET)"
	@echo "$(CYAN)• Compiling workspace...$(RESET)"
	@if [ "$(MODE)" = "release" ]; then \
		cargo build --release; \
	else \
		cargo build; \
	fi
	@echo "$(CYAN)• Copying binaries to $(BIN_DIR)/$(RESET)"
	@for bin in $(BINARIES); do \
		if [ -f $(TARGET)/$$bin ]; then \
			cp $(TARGET)/$$bin $(BIN_DIR)/$$bin; \
			echo "  $(GREEN)✓$(RESET) $$bin"; \
		else \
			echo "  $(YELLOW)⚠$(RESET) $$bin not found, skipping"; \
		fi; \
	done
	@echo "$(GREEN)✓ Build complete$(RESET)"
	@echo "$(CYAN)→ Binaries available in $(BIN_DIR)/$(RESET)"

.PHONY: build-release
build-release: MODE = release
build-release: TARGET = ./target/$(MODE)
build-release: clean $(BIN_DIR)
	@echo "$(BLUE)Building $(PROJECT_NAME) in release mode...$(RESET)"
	@echo "$(CYAN)• Compiling optimized workspace...$(RESET)"
	@cargo build --release
	@echo "$(CYAN)• Copying binaries to $(BIN_DIR)/$(RESET)"
	@for bin in $(BINARIES); do \
		if [ -f $(TARGET)/$$bin ]; then \
			cp $(TARGET)/$$bin $(BIN_DIR)/$$bin; \
			echo "  $(GREEN)✓$(RESET) $$bin (size: $$(du -h $(BIN_DIR)/$$bin | cut -f1))"; \
		else \
			echo "  $(YELLOW)⚠$(RESET) $$bin not found, skipping"; \
		fi; \
	done
	@echo "$(GREEN)✓ Release build complete$(RESET)"
	@echo "$(CYAN)→ Optimized binaries in $(BIN_DIR)/$(RESET)"

.PHONY: build-dist
build-dist:
	@echo "$(BLUE)Staging packages into target/lykn/dist/ for publishing...$(RESET)"
	@$(BIN_DIR)/$(CODE_NAME) dist
	@echo "$(GREEN)✓ Dist staging complete$(RESET)"

# Cleaning targets
.PHONY: clean
clean:
	@echo "$(BLUE)Cleaning bin directory...$(RESET)"
	@rm -rf $(BIN_DIR)
	@echo "$(GREEN)✓ Clean complete$(RESET)"

.PHONY: clean-all
clean-all: clean
	@echo "$(BLUE)Performing full cargo clean...$(RESET)"
	@cargo clean
	@echo "$(GREEN)✓ Full clean complete$(RESET)"

# Testing & Quality targets
.PHONY: test
test: test-rust test-suite test-docs

# F-7 (arc03/slice11): the JS/lykn/docs suites shell out to bin/lykn and import
# the built packages from target/lykn/build/. A stale binary or build dir makes
# the cross-compiler corpus report phantom divergences (16 false failures during
# the arc03 A-2 run), and `lykn test` now refuses to run against stale artifacts.
# Refresh both before any suite that uses them. (rm-then-cp gives bin/lykn a new
# inode, avoiding the macOS arm64 ad-hoc-signature invalidation that a cp-in-place
# triggers — "Killed: 9".) Make dedups this prerequisite to one run per invocation.
# Depends on $(BIN_DIR): the `cp` below targets ./bin/, which is gitignored and
# created by the $(BIN_DIR) target. `build`/`build-release` create it, but a job
# that calls fresh-artifacts directly (CI Layer 2 / a clean checkout) hasn't —
# so make it a prerequisite (mkdir -p) or the cp fails "No such file or dir".
.PHONY: fresh-artifacts
fresh-artifacts: $(BIN_DIR)
	@echo "$(CYAN)• Refreshing test artifacts (release binary + build dir)...$(RESET)"
	@cargo build --release
	@rm -f $(BIN_DIR)/$(CODE_NAME)
	@cp target/release/$(CODE_NAME) $(BIN_DIR)/$(CODE_NAME)
	@$(BIN_DIR)/$(CODE_NAME) build
	@echo "$(GREEN)✓ Test artifacts fresh$(RESET)"

# Depends on fresh-artifacts: the workspace integration tests (e.g.
# docs_pattern_gating) shell out to `lykn test`, which resolves the built
# packages from target/lykn/build/. Without this, `make test` ran cargo test
# before the build dir existed (it was only refreshed by test-suite, which runs
# later) — a clean checkout / CI failed on the missing dir. Make dedups
# fresh-artifacts to one run per invocation.
.PHONY: test-rust
test-rust: fresh-artifacts
	@echo "$(BLUE)Running Rust tests...$(RESET)"
	@cargo test --all-features --workspace
	@echo "$(GREEN)✓ Rust tests passed$(RESET)"

# `lykn test` (bare) runs the FULL suite: hand-written *.test.js AND the
# compiled .lykn cross-compiler corpus (~1365 tests). This is the whole
# non-doc suite in one Deno startup — not "JS only" (arc12/slice01 renamed
# `test-js` → `test-suite` to match behavior).
.PHONY: test-suite
test-suite: fresh-artifacts
	@echo "$(BLUE)Running the full test suite (*.test.js + .lykn corpus)...$(RESET)"
	@$(BIN_DIR)/$(CODE_NAME) test
	@echo "$(GREEN)✓ Test suite passed$(RESET)"

# Convenience alias for a surface-focused subset run during dev. NOT part of
# `test`/`check` — `test-suite` already covers these (arc12/slice01 removed the
# duplicate subset re-run from the chain).
.PHONY: test-lykn
test-lykn: fresh-artifacts
	@echo "$(BLUE)Running lykn surface tests (subset — dev convenience)...$(RESET)"
	@$(BIN_DIR)/$(CODE_NAME) test test/surface/
	@echo "$(GREEN)✓ lykn surface tests passed$(RESET)"

# All doc suites under ONE Deno startup (arc12/slice01) — bare `--docs` no
# longer runs the corpus, so this is doc-only and fast. The granular
# `test-docs-*` targets remain for focused dev runs.
.PHONY: test-docs
test-docs: fresh-artifacts
	@echo "$(BLUE)Running documentation tests (guides + README + examples)...$(RESET)"
	@$(BIN_DIR)/$(CODE_NAME) test --docs docs/guides/ --docs README.md --docs examples/surface/ --docs examples/kernel/
	@echo "$(GREEN)✓ Documentation tests passed$(RESET)"

.PHONY: test-docs-guides
test-docs-guides: fresh-artifacts
	@echo "$(BLUE)Running documentation tests (guides)...$(RESET)"
	@$(BIN_DIR)/$(CODE_NAME) test --docs docs/guides/
	@echo "$(GREEN)✓ Guide documentation tests passed$(RESET)"

.PHONY: test-docs-readme
test-docs-readme: fresh-artifacts
	@echo "$(BLUE)Running documentation tests (README)...$(RESET)"
	@$(BIN_DIR)/$(CODE_NAME) test --docs README.md
	@echo "$(GREEN)✓ README documentation tests passed$(RESET)"

.PHONY: test-docs-examples
test-docs-examples: fresh-artifacts
	@echo "$(BLUE)Running documentation tests (examples)...$(RESET)"
	@$(BIN_DIR)/$(CODE_NAME) test --docs examples/surface/
	@$(BIN_DIR)/$(CODE_NAME) test --docs examples/kernel/
	@echo "$(GREEN)✓ Example documentation tests passed$(RESET)"

.PHONY: test-publishing
# fresh-artifacts: the integration tests (`cargo test -p lykn-cli --tests`)
# include ones that shell out to `lykn test` (target/lykn/build/). Populate the
# build dir first so a clean checkout / CI doesn't fail on the missing dir.
test-publishing: fresh-artifacts
	@echo "$(BLUE)Running publishing pipeline tests (Layers 1-3)...$(RESET)"
	@cargo test -p lykn-cli --lib -- dist::tests
	@echo "$(GREEN)✓ Unit + snapshot tests passed$(RESET)"
	@echo "$(CYAN)• Running integration tests...$(RESET)"
	@cargo test -p lykn-cli --tests
	@echo "$(GREEN)✓ Publishing pipeline tests passed$(RESET)"

.PHONY: lint
lint:
	@echo "$(BLUE)Running linter checks...$(RESET)"
	@echo "$(CYAN)• Running clippy...$(RESET)"
	@cargo clippy --all-features --workspace --all-targets -- -D warnings
	@echo "$(GREEN)✓ Clippy passed$(RESET)"
	@echo "$(CYAN)• Checking code formatting...$(RESET)"
	@cargo fmt --all -- --check
	@echo "$(GREEN)✓ Format check passed$(RESET)"
	@echo "$(CYAN)• Checking lykn syntax...$(RESET)"
	@find test/surface -name '*.lykn' | xargs $(BIN_DIR)/$(CODE_NAME) check
	@find packages -name '*.lykn' | xargs $(BIN_DIR)/$(CODE_NAME) check 2>/dev/null || true
	@echo "$(GREEN)✓ lykn syntax check passed$(RESET)"
	@echo "$(CYAN)• Running lykn lint (source anti-patterns)...$(RESET)"
	@# Path-scope out the kernel-in-surface fixture: its `===` uses are
	@# intentional test material (kernel forms in surface), not defects. This is
	@# path exclusion, NOT inline suppression — comment-directive suppression is
	@# deferred to arc14 (comment-retention, DD-62). (The P-11 seeded corpus lives
	@# under crates/.../tests/fixtures/, outside this scan, so it needs no exclusion.)
	@find packages examples test -name '*.lykn' \
		! -path 'test/surface/kernel-in-surface_test.lykn' \
		| sort | xargs $(BIN_DIR)/$(CODE_NAME) lint
	@echo "$(GREEN)✓ lykn lint passed$(RESET)"

.PHONY: format
format:
	@echo "$(BLUE)Formatting code...$(RESET)"
	@echo "$(CYAN)• Running rustfmt on all files...$(RESET)"
	@cargo fmt --all
	@echo "$(GREEN)✓ Rust code formatted$(RESET)"
	@echo "$(CYAN)• Formatting lykn files...$(RESET)"
	@find test/surface -name '*.lykn' | xargs $(BIN_DIR)/$(CODE_NAME) fmt -w
	@echo "$(GREEN)✓ lykn code formatted$(RESET)"

.PHONY: coverage
coverage:
	@echo "$(BLUE)Generating test coverage report...$(RESET)"
	@echo "$(CYAN)• Running tests with coverage ...$(RESET)"
	@cargo llvm-cov --workspace --no-default-features
	@echo "$(GREEN)✓ Coverage report generated$(RESET)"
	@echo "$(YELLOW)→ For detailed HTML report, run: cargo llvm-cov --html --workspace --no-default-features$(RESET)"

.PHONY: coverage-html
coverage-html:
	@echo "$(BLUE)Generating HTML coverage report...$(RESET)"
	@echo "$(CYAN)• Running tests with coverage ...$(RESET)"
	@cargo llvm-cov --html --workspace --no-default-features
	@echo "$(GREEN)✓ HTML coverage report generated$(RESET)"
	@echo "$(CYAN)→ Report: target/llvm-cov/html/index.html$(RESET)"

# The dangling-citation gate (02-artifact-homes, L-7). Fails when a tracked
# document cites a repo-relative path that does not resolve in git ON THIS
# BRANCH — resolution is against `git ls-tree HEAD`, never `--all` and never
# the working tree, so a file that lives only on another branch fails here by
# design. Origin: `docs/backlog/discoveries.md` was cited by five committed
# documents while the file itself sat in the gitignored `workbench/` tree.
#
# Deliberately NOT part of `lint` — that target is about source quality and
# needs bin/lykn; this one needs only git and deno, so it runs first and fails
# in ~1s instead of after the release build.
.PHONY: check-cited-paths
check-cited-paths:
	@echo "$(BLUE)Checking cited paths resolve in git...$(RESET)"
	@deno run -A scripts/check-cited-paths.js

# Common checks. build-release BEFORE lint: lint runs `lykn check` (needs
# bin/lykn), and using the release profile means the workspace compiles once —
# `fresh-artifacts` (in `test`) reuses cargo's release cache instead of adding a
# separate debug build (arc12/slice01 F-5).
.PHONY: common-checks
common-checks: check-deps check-cited-paths build-release lint

# Combined check targets
.PHONY: check
check: common-checks test
	@echo ""
	@echo "$(GREEN)✓ All checks passed (build + lint + test)$(RESET)"
	@echo ""

.PHONY: check-all
check-all: common-checks coverage test-suite test-docs test-publishing
	@echo ""
	@echo "$(GREEN)✓ Full validation complete (build + lint + coverage + publishing)$(RESET)"
	@echo ""

# Ensure cargo-binstall is available for fast tool installation
.PHONY: ensure-binstall
ensure-binstall:
	@command -v cargo-binstall >/dev/null 2>&1 || { \
		echo "$(YELLOW)→ Installing cargo-binstall...$(RESET)"; \
		curl -L --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/cargo-bins/cargo-binstall/main/install-from-binstall-release.sh | bash; \
	}

.PHONY: check-deps
check-deps: ensure-binstall
	@echo "$(BLUE)Checking for outdated dependencies...$(RESET)"
	@command -v cargo-outdated >/dev/null 2>&1 || { \
		echo "$(YELLOW)→ Installing cargo-outdated...$(RESET)"; \
		cargo binstall -y cargo-outdated; \
	}
	@OUTPUT=$$(cargo outdated --root-deps-only --ignore-external-rel 2>/dev/null); \
	echo "$$OUTPUT"; \
	echo ""; \
	if echo "$$OUTPUT" | grep -E "^[a-z0-9_-]+\s+" | grep -v "^----" | awk '{print $$3}' | grep -v "^---$$" | grep -v "^Compat$$" | grep -E "^[0-9]" | grep -q .; then \
		echo "$(RED)✗ Compatible dependency updates available$(RESET)"; \
		echo "$(YELLOW)→ Run 'make deps' to update and commit the updated Cargo.lock$(RESET)"; \
		exit 1; \
	else \
		echo "$(GREEN)✓ All dependencies up to date$(RESET)"; \
	fi
.PHONY: deps
deps: ensure-binstall
	@echo "$(BLUE)Updating dependencies ...$(RESET)"
	@command -v cargo-upgrade >/dev/null 2>&1 || { \
		echo "$(YELLOW)→ Installing cargo-edit...$(RESET)"; \
		cargo binstall -y cargo-edit; \
	}
	@cargo upgrade
	@echo "$(GREEN)✓ Cargo deps upgraded$(RESET)"

docs: DOCS_PATH = target/doc/$(CODE_NAME)
docs:
	@cargo doc --all-features --no-deps --workspace
	@echo
	@echo "Docs are available here:"
	@echo " * $(DOCS_PATH)"
	@echo " * file://$(shell pwd)/$(DOCS_PATH)/index.html"
	@echo

# Utility targets
.PHONY: install-local
install-local:
	@echo "$(BLUE)Installing lykn CLI from local repo...$(RESET)"
	@cargo install --path crates/lykn-cli
	@echo "$(GREEN)✓ lykn installed to ~/.cargo/bin/$(RESET)"

.PHONY: tracked-files
tracked-files:
	@echo "$(BLUE)Saving tracked files list...$(RESET)"
	@mkdir -p $(TARGET)
	@git ls-files > $(TARGET)/git-tracked-files.txt
	@echo "$(GREEN)✓ Tracked files saved to $(TARGET)/git-tracked-files.txt$(RESET)"
	@echo "$(CYAN)• Total files: $$(wc -l < $(TARGET)/git-tracked-files.txt)$(RESET)"

.PHONY: remotes
remotes:
	@echo "$(BLUE)Configuring git remotes...$(RESET)"
	@for remote in $(GIT_REMOTES); do \
		case $$remote in \
			macpro)   url="$(REMOTE_macpro)"   ;; \
			github)   url="$(REMOTE_github)"   ;; \
			codeberg) url="$(REMOTE_codeberg)" ;; \
		esac; \
		if git remote get-url $$remote >/dev/null 2>&1; then \
			echo "  $(YELLOW)⊙$(RESET) $$remote already exists ($$url)"; \
		else \
			git remote add $$remote $$url; \
			echo "  $(GREEN)✓$(RESET) Added $$remote → $$url"; \
		fi; \
	done
	@echo "$(GREEN)✓ Remotes configured$(RESET)"

push:
	@echo "$(BLUE)Pushing changes ...$(RESET)"
	@for remote in $(GIT_REMOTES); do \
		echo "$(CYAN)• $$remote:$(RESET)"; \
		git push $$remote main && git push $$remote --tags; \
		echo "$(GREEN)✓ Pushed$(RESET)"; \
	done

publish: publish-jsr publish-npm publish-crates

publish-jsr:
	@echo "$(BLUE)Publishing to JavaScript Registry...$(RESET)"
	@$(BIN_DIR)/$(CODE_NAME) publish --jsr

publish-npm:
	@echo "$(BLUE)Publishing to npm...$(RESET)"
	@$(BIN_DIR)/$(CODE_NAME) publish --npm

# Crates in dependency order (leaf crates first, dependent crates later)
PUBLISH_ORDER := lykn-lang lykn-cli $(CODE_NAME)
# crates.io rate limit delay (seconds)
PUBLISH_DELAY := 372
.PHONY: publish-crates
publish-crates:
	@echo ""
	@echo "$(CYAN)╔══════════════════════════════════════════════════════════╗$(RESET)"
	@echo "$(CYAN)║$(RESET) $(BLUE)Publishing $(PROJECT_NAME) Crates to crates.io$(RESET)                      $(CYAN)║$(RESET)"
	@echo "$(CYAN)╚══════════════════════════════════════════════════════════╝$(RESET)"
	@echo ""
	@echo "$(YELLOW)⚠ This will publish all crates in dependency order$(RESET)"
	@echo "$(YELLOW)⚠ Ensure all tests pass and versions are updated$(RESET)"
	@echo ""
	@read -p "Continue? [y/N] " -n 1 -r; \
	echo; \
	if [[ ! $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "$(RED)✗ Aborted$(RESET)"; \
		exit 1; \
	fi
	@echo ""
	@echo "$(BLUE)Publishing crates in dependency order...$(RESET)"
	@echo "$(YELLOW)Note: Publishing ~10 new crates/hour to avoid rate limits$(RESET)"
	@echo ""
	@for crate in $(PUBLISH_ORDER); do \
		echo ""; \
		echo "$(CYAN)• Publishing $$crate...$(RESET)"; \
		output=$$(cargo publish -p $$crate 2>&1); \
		result=$$?; \
		if [ $$result -eq 0 ]; then \
			echo "  $(GREEN)✓$(RESET) $$crate published successfully"; \
			echo "  $(YELLOW)→ Waiting 6 minutes for crates.io rate limit and index update...$(RESET)"; \
			sleep $(PUBLISH_DELAY); \
		elif echo "$$output" | grep -q "already exists"; then \
			echo "  $(YELLOW)⊙$(RESET) $$crate already published, skipping"; \
		elif echo "$$output" | grep -q "429 Too Many Requests"; then \
			echo "  $(YELLOW)⚠$(RESET) Rate limit hit for $$crate"; \
			retry_after=$$(echo "$$output" | sed -n 's/.*after \([^.]*\).*/\1/p' | head -1); \
			if [ -n "$$retry_after" ]; then \
				echo "  $(YELLOW)→$(RESET) Server says: retry after $$retry_after"; \
			fi; \
			echo "  $(YELLOW)→$(RESET) Tip: Email help@crates.io to request a limit increase"; \
			echo "  $(YELLOW)→$(RESET) Or wait and run: cd crates/$$crate && cargo publish"; \
			exit 1; \
		else \
			echo "  $(RED)✗$(RESET) Failed to publish $$crate"; \
			echo "$$output"; \
			exit 1; \
		fi; \
	done
	@echo ""
	@echo "$(GREEN)✓ All crates published successfully!$(RESET)"
	@echo ""

.PHONY: publish-dry-run
publish-dry-run:
	@echo ""
	@echo "$(CYAN)╔══════════════════════════════════════════════════════════╗$(RESET)"
	@echo "$(CYAN)║$(RESET) $(BLUE)Dry Run: Publishing $(PROJECT_NAME) Crates$(RESET)                          $(CYAN)║$(RESET)"
	@echo "$(CYAN)╚══════════════════════════════════════════════════════════╝$(RESET)"
	@echo ""
	@echo "$(BLUE)Publishing order (in dependency order):$(RESET)"
	@i=1; \
	for crate in $(PUBLISH_ORDER); do \
		echo "  $(YELLOW)$$i.$(RESET) $$crate"; \
		i=$$((i+1)); \
	done
	@echo ""
	@echo "$(BLUE)Verifying each crate can be packaged...$(RESET)"
	@for crate in $(PUBLISH_ORDER); do \
		echo ""; \
		echo "$(CYAN)• Packaging $$crate...$(RESET)"; \
		if cargo package -p $$crate --allow-dirty --list > /dev/null 2>&1; then \
			echo "  $(GREEN)✓$(RESET) $$crate is ready for publishing"; \
		else \
			echo "  $(RED)✗$(RESET) $$crate failed validation"; \
			cargo package -p $$crate --allow-dirty --list; \
			exit 1; \
		fi; \
	done
	@echo ""
	@echo "$(GREEN)✓ All crates ready for publishing!$(RESET)"
	@echo "$(CYAN)→ Run 'make publish' to publish to crates.io$(RESET)"
	@echo "$(CYAN)→ Or 'make publish-one CRATE=crate-name' to publish a single crate$(RESET)"
	@echo ""

.PHONY: publish-one
publish-one:
	@if [ -z "$(CRATE)" ]; then \
		echo "$(RED)Error: CRATE variable not set$(RESET)"; \
		echo "Usage: make publish-one CRATE=$(CODE_NAME)"; \
		exit 1; \
	fi
	@echo ""
	@echo "$(CYAN)Publishing $(CRATE)...$(RESET)"
	@cargo publish -p $(CRATE)
	@echo ""
	@echo "$(GREEN)✓ Published $(CRATE)$(RESET)"
	@echo ""

# ── Bundle size measurement (DD-37 Phase 0) ──────────────────────────

.PHONY: bundle-size
bundle-size:
	@echo "$(BLUE)Measuring browser bundle size...$(RESET)"
	@deno run -A --frozen --config project.json scripts/bundle-size.js
