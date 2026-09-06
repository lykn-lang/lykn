# Browser Shim Research

How to support `<script type="text/lykn">` in the browser.

## Part 1: BiwaScheme's Approach

BiwaScheme registers a script-type handler in `src/platforms/browser/release_initializer.js`. The mechanism is straightforward:

### Discovery and Execution Flow

1. **Bootstrap**: `main-browser.js` is the browser entry point. It imports the core library, configures browser-specific I/O ports and console, assigns `window.BiwaScheme`, then calls `execute_user_program()`.

2. **Old-style discovery** (legacy): scans for `<script>` tags whose `src` attribute ends with `biwascheme.js` or `biwascheme-min.js` and concatenates their `innerHTML` (inline Scheme code placed inside the loader script tag itself).

3. **New-style discovery** (`text/biwascheme`): listens for `DOMContentLoaded`, then queries all `<script type="text/biwascheme">` elements and runs each one:

   ```js
   window.addEventListener('DOMContentLoaded', function() {
     for (const s of document.querySelectorAll("script[type='text/biwascheme']")) {
       run(s.innerHTML);
     }
   });
   ```

4. **Evaluation**: each script's text is handed to `new BiwaScheme.Interpreter(onError).evaluate(script, callback)`. BiwaScheme is an interpreter, so it directly evaluates the Scheme source at runtime — there is no compile-to-JS step.

5. **Error handling**: errors are caught in a try/catch around `intp.evaluate()`. The `onError` callback writes to `BiwaScheme.Port.current_error` (which renders to a `#bs-console` div if present). If a `#biwascheme-debugger` element exists, a `Dumper` instance provides graphical stack inspection. As a final fallback, errors go to `console.error` or are re-thrown.

### Bundling

BiwaScheme uses Rollup to produce an IIFE bundle (`release/biwascheme.js`). The bundle includes jQuery and all library code. Because the IIFE executes immediately on load, `execute_user_program()` runs as a side effect of including the script. The user only needs:

```html
<script src="biwascheme.js"></script>
<script type="text/biwascheme">
(display "hello")
</script>
```

### Key Design Decisions

- Uses `DOMContentLoaded` so that all `<script type="text/biwascheme">` tags are present in the DOM before scanning.
- Each script tag is evaluated independently with its own `Interpreter` instance.
- Error output is directed to a console div if one exists, otherwise to `console.error`.
- The library attaches itself to `window.BiwaScheme` for global access.

## Part 2: Wisp's Approach

Wisp (wisp-lang/wisp) is a Clojure-like Lisp that compiles to JavaScript, closer in spirit to what lykn does (compile-then-eval rather than interpret). The wisp repo is not cloned locally, but the pattern is well-documented and follows a common convention among compile-to-JS Lisps:

### Known Pattern (from wisp-lang/wisp documentation)

1. **Script type**: `<script type="application/wisp">`
2. **Browser bundle** includes the wisp compiler (reader + compiler + code generator).
3. **On load**, the shim queries `document.querySelectorAll('script[type="application/wisp"]')`.
4. **For each tag**: reads `element.textContent`, compiles it to a JS string using the wisp compiler, then evaluates the result with `eval()` or `new Function()`.
5. **`src` attribute support**: if the script tag has a `src` attribute instead of inline content, the shim fetches the `.wisp` file via XHR/fetch, compiles it, then evaluates.

The critical difference from BiwaScheme is step 4: wisp **compiles to JS first**, then uses the host engine's `eval()` to run the output. This gives better performance and produces standard JS stack traces on error.

## Part 3: Lykn Browser Shim Design

Lykn should follow the wisp model: **compile, then eval**. The shim bundles lykn's reader and compiler (which already produce clean JS via ESTree + astring) and executes the compiled output using the browser's native JS engine.

### Architecture

```
<script src="lykn-browser.js"></script>   <!-- shim + compiler bundle -->

<script type="text/lykn">
(const greet (=> (name) (+ "Hello, " name "!")))
(console.log (greet "world"))
</script>
```

The browser sees `type="text/lykn"` and ignores the content (browsers skip script tags with unrecognised types). The shim picks them up after DOM load.

### Shim Implementation Sketch

```js
// lykn-browser.js
// Browser shim: finds <script type="text/lykn"> tags, compiles, and evals.

import { lykn } from './index.js';  // re-exports read + compile

/**
 * Compile and execute a lykn source string.
 * @param {string} source - lykn source code
 * @param {string} [label] - label for error messages (e.g. "inline #2")
 */
function runLykn(source, label) {
  label = label || '<script type="text/lykn">';
  try {
    const js = lykn(source);
    // Use indirect eval so the compiled code runs in global scope
    (0, eval)(js);
  } catch (err) {
    console.error(`[lykn] Error in ${label}:`, err);
  }
}

/**
 * Fetch a remote .lykn file, compile, and execute.
 * @param {string} url - URL of the .lykn source file
 * @param {string} [label] - label for error messages
 * @returns {Promise<void>}
 */
async function fetchAndRun(url, label) {
  label = label || url;
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Failed to fetch ${url}: ${resp.status}`);
    }
    const source = await resp.text();
    runLykn(source, label);
  } catch (err) {
    console.error(`[lykn] Error loading ${label}:`, err);
  }
}

/**
 * Scan the DOM for <script type="text/lykn"> tags and execute them
 * in document order.
 */
async function executeLyknScripts() {
  const scripts = document.querySelectorAll('script[type="text/lykn"]');

  for (let i = 0; i < scripts.length; i++) {
    const el = scripts[i];
    const src = el.getAttribute('src');

    if (src) {
      // External .lykn file
      await fetchAndRun(src, src);
    } else {
      // Inline lykn code
      const source = el.textContent;
      if (source.trim().length > 0) {
        runLykn(source, `inline #${i + 1}`);
      }
    }
  }
}

// --- Auto-run on DOM ready ---

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', executeLyknScripts);
} else {
  // DOM already loaded (e.g. shim loaded via async/defer or dynamically)
  executeLyknScripts();
}

// --- Public API on window for programmatic use ---

window.lykn = {
  compile: lykn,       // source string -> JS string
  run: runLykn,        // source string -> compile + eval
  load: fetchAndRun,   // URL -> fetch + compile + eval
};
```

### Design Decisions and Rationale

| Decision | Rationale |
|----------|-----------|
| **Compile-then-eval**, not interpret | lykn already emits clean JS via ESTree/astring. No runtime interpreter needed. Errors produce native JS stack traces. |
| **Indirect eval `(0, eval)(js)`** | Ensures compiled code executes in global scope, not in the shim's module scope. Variables defined in one script tag are visible to later ones. |
| **Process tags in document order** | Scripts with `src` are fetched sequentially so that earlier scripts can define symbols used by later ones (matches how `<script>` normally works). |
| **Support both inline and `src`** | Inline is convenient for demos; `src` is needed for real projects with separate `.lykn` files. |
| **`DOMContentLoaded` with readyState check** | Handles both sync and async/defer loading of the shim itself. |
| **`window.lykn` API** | Allows programmatic compilation and execution from JS, useful for REPLs, editors, or dynamic code loading. |
| **Errors to `console.error`** | Simple and universal. A future version could add an optional error-display div (like BiwaScheme's `#biwascheme-debugger`) but it is not essential for v1. |

### Bundling Strategy

The shim needs to bundle:
- `src/reader.js` — the S-expression parser
- `src/compiler.js` — the ESTree transformer + astring code generator
- `src/index.js` — the `lykn()` convenience function
- The `astring` dependency (the only runtime dep)

This can be built as an IIFE using esbuild, Rollup, or similar:

```sh
# Example with esbuild
esbuild src/lykn-browser.js --bundle --format=iife --global-name=lykn \
  --outfile=dist/lykn-browser.js --minify
```

The resulting bundle should be small (reader + compiler + astring is modest) with zero additional runtime dependencies, staying true to lykn's design philosophy.

### Usage Example

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>lykn browser demo</title>
  <script src="dist/lykn-browser.js"></script>
</head>
<body>
  <div id="output"></div>

  <script type="text/lykn">
  (const el (document.getElementById "output"))
  (set! el.textContent "Hello from lykn!")
  </script>

  <!-- Or load from an external file -->
  <script type="text/lykn" src="app.lykn"></script>
</body>
</html>
```

### Future Enhancements (out of scope for v1)

- **Source maps**: map compiled JS positions back to `.lykn` source lines for better debugging.
- **`<script type="module/lykn">`**: compile to ES module syntax, inject as a blob URL module. Would enable `import`/`export` in lykn scripts.
- **Optional error overlay**: a small DOM widget that displays compilation errors inline, similar to BiwaScheme's dumper but much lighter.
- **Web Worker support**: compile and eval in a worker for compute-heavy scripts.
