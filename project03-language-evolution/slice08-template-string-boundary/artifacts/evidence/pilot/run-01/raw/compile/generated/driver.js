const workspace = Deno.args[0];
const output = Deno.args[1];
const esbuild = Deno.args[2];
const deno = Deno.args[3];
const data = `${workspace}/data/input.json`;
const decoder = new TextDecoder();
function requireOk(ok, message) {
  if (typeof ok !== "boolean") throw new TypeError("requireOk: arg 'ok' expected boolean, got " + typeof ok);

  if (typeof message !== "string") throw new TypeError("requireOk: arg 'message' expected string, got " + typeof message);

  if (!ok) throw new Error(message);

  return null;
}
function isRecord(value) {
  return (typeof value === "object" && !(value === null)) && !Array.isArray(value);
}
function reserveAbsent(path) {
  if (typeof path !== "string") throw new TypeError("reserveAbsent: arg 'path' expected string, got " + typeof path);

  return Deno.writeTextFileSync(path, "", { createNew: true });
}
function writeNew(path, text) {
  if (typeof path !== "string") throw new TypeError("writeNew: arg 'path' expected string, got " + typeof path);

  if (typeof text !== "string") throw new TypeError("writeNew: arg 'text' expected string, got " + typeof text);

  return Deno.writeTextFileSync(path, text, { createNew: true });
}
function environment(cache) {
  if (typeof cache !== "string") throw new TypeError("environment: arg 'cache' expected string, got " + typeof cache);

  return { PATH: "/opt/homebrew/bin:/usr/bin:/bin", DENO_DIR: cache, DENO_NO_UPDATE_CHECK: "1", NO_COLOR: "1" };
}
function command(executable, args, cwd, cache) {
  if (typeof executable !== "string") throw new TypeError("command: arg 'executable' expected string, got " + typeof executable);

  if (!Array.isArray(args)) throw new TypeError("command: arg 'args' expected array, got " + typeof args);

  if (typeof cwd !== "string") throw new TypeError("command: arg 'cwd' expected string, got " + typeof cwd);

  if (typeof cache !== "string") throw new TypeError("command: arg 'cache' expected string, got " + typeof cache);

  return new Deno.Command(executable, { args: args, cwd: cwd, clearEnv: true, env: environment(cache), stdin: "null", stdout: "piped", stderr: "piped" });
}
function saveResult(label, executable, args, cwd, result) {
  if (typeof label !== "string") throw new TypeError("saveResult: arg 'label' expected string, got " + typeof label);

  if (typeof executable !== "string") throw new TypeError("saveResult: arg 'executable' expected string, got " + typeof executable);

  if (!Array.isArray(args)) throw new TypeError("saveResult: arg 'args' expected array, got " + typeof args);

  if (typeof cwd !== "string") throw new TypeError("saveResult: arg 'cwd' expected string, got " + typeof cwd);

  const stdout = decoder.decode(result.stdout);
  const stderr = decoder.decode(result.stderr);
  writeNew(`${output}/${label}.json`, JSON.stringify({ label: label, executable: executable, args: args, cwd: cwd, code: result.code, stdout: stdout, stderr: stderr }));
  return { code: result.code, stdout: stdout, stderr: stderr };
}
function normalizePath(path) {
  if (typeof path !== "string") throw new TypeError("normalizePath: arg 'path' expected string, got " + typeof path);

  const fileUrl = new URL(path, `file://${workspace}/`);
  return fileUrl.pathname;
}
function modulePath(pkg, file) {
  if (typeof pkg !== "string") throw new TypeError("modulePath: arg 'pkg' expected string, got " + typeof pkg);

  if (typeof file !== "string") throw new TypeError("modulePath: arg 'file' expected string, got " + typeof file);

  return `${workspace}/target/lykn/dist/${pkg}/${file}`;
}
function allLibraryPaths() {
  return [modulePath("json", "mod.js"), modulePath("json", "value.js"), modulePath("json", "file.js"), modulePath("json", "document.js"), modulePath("yaml", "mod.js"), modulePath("yaml", "value.js"), modulePath("effects", "mod.js"), modulePath("effects", "used.js"), modulePath("effects", "dead.js"), modulePath("effects", "effect.js")];
}
function jsonLibraryPaths() {
  return [modulePath("json", "mod.js"), modulePath("json", "value.js"), modulePath("json", "file.js"), modulePath("json", "document.js")];
}
function effectsLibraryPaths() {
  return [modulePath("effects", "mod.js"), modulePath("effects", "used.js"), modulePath("effects", "dead.js"), modulePath("effects", "effect.js")];
}
function aliasArguments() {
  const aliases = { value: [] };
  for (const pkg of ["json", "yaml", "effects"]) {
    const configPath = `${workspace}/target/lykn/dist/${pkg}/deno.json`;
    const config = JSON.parse(Deno.readTextFileSync(configPath));
    requireOk(Object.hasOwn(config, "exports"), `missing exports map: ${configPath}`);
    requireOk(isRecord(config.exports), `exports map is not an object: ${configPath}`);
    for (const entry of Object.entries(config.exports)) {
      const key = entry[0];
      const target = entry[1];
      const specifier = key === "." ? config.name : `${config.name}/${key.slice(2)}`;
      const flag = `--alias:${specifier}=${modulePath(pkg, target)}`;
      aliases.value = (current => {
        if (!Array.isArray(current)) throw new TypeError("anonymous: arg 'current' expected array, got " + typeof current);

        return [...current, flag];
      })(aliases.value);
    }
  }
  return aliases.value;
}
function bundleArguments(name, entry) {
  if (typeof name !== "string") throw new TypeError("bundleArguments: arg 'name' expected string, got " + typeof name);

  if (typeof entry !== "string") throw new TypeError("bundleArguments: arg 'entry' expected string, got " + typeof entry);

  const args = { value: [entry, "--bundle", "--tree-shaking=true", "--format=esm", "--platform=neutral", "--target=es2022"] };
  for (const alias of aliasArguments()) {
    args.value = (current => {
      if (!Array.isArray(current)) throw new TypeError("anonymous: arg 'current' expected array, got " + typeof current);

      return [...current, alias];
    })(args.value);
  }
  args.value = (current => {
    if (!Array.isArray(current)) throw new TypeError("anonymous: arg 'current' expected array, got " + typeof current);

    return [...current, `--metafile=${output}/${name}.meta.json`];
  })(args.value);
  args.value = (current => {
    if (!Array.isArray(current)) throw new TypeError("anonymous: arg 'current' expected array, got " + typeof current);

    return [...current, `--outfile=${output}/${name}.js`];
  })(args.value);
  return args.value;
}
function inputIdentities(meta) {
  requireOk(Object.hasOwn(meta, "inputs"), "metafile has no inputs object");
  requireOk(isRecord(meta.inputs), "metafile inputs is not an object");
  const entries = Object.entries(meta.inputs);
  requireOk(entries.length > 0, "metafile inputs object is empty");
  const rows = { value: [] };
  for (const entry of entries) {
    const inputPath = entry[0];
    const inputInfo = entry[1];
    requireOk(Array.isArray(inputInfo.imports), `input imports is not an array: ${inputPath}`);
    const imports = { value: [] };
    for (const importInfo of inputInfo.imports) {
      requireOk(Object.hasOwn(importInfo, "path"), `import has no path: ${inputPath}`);
      requireOk(Object.hasOwn(importInfo, "kind"), `import has no kind: ${inputPath}`);
      imports.value = (current => {
        if (!Array.isArray(current)) throw new TypeError("anonymous: arg 'current' expected array, got " + typeof current);

        return [...current, { path: normalizePath(importInfo.path), kind: importInfo.kind, original: importInfo.original, external: importInfo.external }];
      })(imports.value);
    }
    rows.value = (current => {
      if (!Array.isArray(current)) throw new TypeError("anonymous: arg 'current' expected array, got " + typeof current);

      return [...current, { path: normalizePath(inputPath), bytes: inputInfo.bytes, imports: imports.value }];
    })(rows.value);
  }
  return rows.value;
}
function outputIdentities(meta, name, entry) {
  if (typeof name !== "string") throw new TypeError("outputIdentities: arg 'name' expected string, got " + typeof name);

  if (typeof entry !== "string") throw new TypeError("outputIdentities: arg 'entry' expected string, got " + typeof entry);

  requireOk(Object.hasOwn(meta, "outputs"), "metafile has no outputs object");
  requireOk(isRecord(meta.outputs), "metafile outputs is not an object");
  const entries = Object.entries(meta.outputs);
  requireOk(entries.length > 0, "metafile outputs object is empty");
  const outputPath = normalizePath(`${output}/${name}.js`);
  const entryPath = normalizePath(entry);
  const rows = { value: [] };
  const selected = { value: null };
  for (const row of entries) {
    const path = normalizePath(row[0]);
    const info = row[1];
    const entryPoint = info.entryPoint ? normalizePath(info.entryPoint) : null;
    const outputRow = { path: path, entryPoint: entryPoint, bytes: info.bytes, exports: info.exports, imports: info.imports };
    rows.value = (current => {
      if (!Array.isArray(current)) throw new TypeError("anonymous: arg 'current' expected array, got " + typeof current);

      return [...current, outputRow];
    })(rows.value);
    if (path === outputPath) {
      requireOk(!(entryPoint === null), `selected JavaScript output lacks entryPoint: ${path}`);
      requireOk(entryPoint === entryPath, `selected output entryPoint differs from requested source: ${entryPoint}`);
      requireOk(Object.hasOwn(info, "inputs"), `selected JavaScript output lacks inputs: ${path}`);
      requireOk(isRecord(info.inputs), `selected JavaScript output inputs is not an object: ${path}`);
      const contributions = Object.entries(info.inputs);
      requireOk(contributions.length > 0, `selected JavaScript output has empty inputs: ${path}`);
      const contributorRows = { value: [] };
      for (const contribution of contributions) {
        const contributorPath = normalizePath(contribution[0]);
        const contributionInfo = contribution[1];
        requireOk(Number.isFinite(contributionInfo.bytesInOutput), `non-numeric bytesInOutput for ${contributorPath}`);
        contributorRows.value = (current => {
          if (!Array.isArray(current)) throw new TypeError("anonymous: arg 'current' expected array, got " + typeof current);

          return [...current, { path: contributorPath, bytesInOutput: contributionInfo.bytesInOutput }];
        })(contributorRows.value);
      }
      selected.value = { path: path, entryPoint: entryPoint, contributors: contributorRows.value };
    }
  }
  const selectedOutput = selected.value;
  requireOk(!(selectedOutput === null), "no selected JavaScript output matched outfile and entryPoint");
  return { outputs: rows.value, selected: selectedOutput };
}
function metadataObservation(name, entry) {
  if (typeof name !== "string") throw new TypeError("metadataObservation: arg 'name' expected string, got " + typeof name);

  if (typeof entry !== "string") throw new TypeError("metadataObservation: arg 'entry' expected string, got " + typeof entry);

  const metaPath = `${output}/${name}.meta.json`;
  const raw = Deno.readTextFileSync(metaPath);
  const meta = JSON.parse(raw);
  const inputs = inputIdentities(meta);
  const outputData = outputIdentities(meta, name, entry);
  return { control: name, entry: normalizePath(entry), metafile: metaPath, inputs: inputs, outputs: outputData.outputs, selected: outputData.selected };
}
function graphIdentities(observation) {
  const paths = { value: [] };
  for (const input of observation.inputs) {
    paths.value = (current => {
      if (!Array.isArray(current)) throw new TypeError("anonymous: arg 'current' expected array, got " + typeof current);

      return [...current, input.path];
    })(paths.value);
    for (const importInfo of input.imports) {
      paths.value = (current => {
        if (!Array.isArray(current)) throw new TypeError("anonymous: arg 'current' expected array, got " + typeof current);

        return [...current, importInfo.path];
      })(paths.value);
    }
  }
  return paths.value;
}
function contributorBytes(path, contributors) {
  if (typeof path !== "string") throw new TypeError("contributorBytes: arg 'path' expected string, got " + typeof path);

  if (!Array.isArray(contributors)) throw new TypeError("contributorBytes: arg 'contributors' expected array, got " + typeof contributors);

  const total = { value: 0 };
  for (const contributor of contributors) {
    if (contributor.path === path) total.value = (current => {
      if (typeof current !== "number" || Number.isNaN(current)) throw new TypeError("anonymous: arg 'current' expected number, got " + typeof current);

      return current + contributor.bytesInOutput;
    })(total.value);

  }
  return total.value;
}
function allowedLibraryPaths(name) {
  if (typeof name !== "string") throw new TypeError("allowedLibraryPaths: arg 'name' expected string, got " + typeof name);

  return name === "C1" ? [] : name === "C2" || name === "C3" ? jsonLibraryPaths() : name === "C4" ? effectsLibraryPaths() : allLibraryPaths();
}
function verifyControlMetadata(name, observation) {
  if (typeof name !== "string") throw new TypeError("verifyControlMetadata: arg 'name' expected string, got " + typeof name);

  const graph = graphIdentities(observation);
  const contributors = observation.selected.contributors;
  const allLibraries = allLibraryPaths();
  const allowed = allowedLibraryPaths(name);
  const unexpected = { value: [] };
  for (const path of allLibraries) {
    if ((graph.includes(path) || contributorBytes(path, contributors) > 0) && !allowed.includes(path)) unexpected.value = (current => {
      if (!Array.isArray(current)) throw new TypeError("anonymous: arg 'current' expected array, got " + typeof current);

      return [...current, path];
    })(unexpected.value);

  }
  const unexpectedPaths = unexpected.value;
  requireOk(unexpectedPaths.length === 0, `${name} has unexpected library graph/contribution identity`);
  const jsonValue = modulePath("json", "value.js");
  const jsonFile = modulePath("json", "file.js");
  const jsonDocument = modulePath("json", "document.js");
  const yamlValue = modulePath("yaml", "value.js");
  const effectsUsed = modulePath("effects", "used.js");
  const effectsDead = modulePath("effects", "dead.js");
  const effectsEffect = modulePath("effects", "effect.js");
  if (name === "C1") for (const path of allLibraries) {
    requireOk(!graph.includes(path) && contributorBytes(path, contributors) === 0, `C1 unexpectedly observes library identity ${path}`);
  }

  if (name === "C2") {
    requireOk(contributorBytes(jsonValue, contributors) > 0, "C2 JSON value did not contribute");
    for (const path of [modulePath("yaml", "mod.js"), yamlValue]) {
      requireOk(!graph.includes(path) && contributorBytes(path, contributors) === 0, `C2 unexpectedly observes YAML identity ${path}`);
    }
  }
  if (name === "C3") {
    requireOk(contributorBytes(jsonValue, contributors) > 0, "C3 JSON value did not contribute");
    for (const path of [jsonFile, jsonDocument, modulePath("yaml", "mod.js"), yamlValue]) {
      requireOk(!graph.includes(path) && contributorBytes(path, contributors) === 0, `C3 unexpectedly observes excluded identity ${path}`);
    }
  }
  if (name === "C4") {
    requireOk(contributorBytes(effectsUsed, contributors) > 0, "C4 used implementation did not contribute");
    requireOk(contributorBytes(effectsEffect, contributors) > 0, "C4 effect implementation did not contribute");
    requireOk(contributorBytes(effectsDead, contributors) === 0, "C4 unused-pure implementation contributed bytes");
  }
  if (name === "C5") for (const path of [jsonValue, jsonFile, jsonDocument, yamlValue, effectsUsed, effectsDead, effectsEffect]) {
    requireOk(contributorBytes(path, contributors) > 0, `C5 positive implementation did not contribute: ${path}`);
  }

  return { control: name, graph: graph, unexpectedLibraryIdentities: unexpected.value, contributors: contributors, c4DeadResolved: name === "C4" ? graph.includes(effectsDead) : null, positiveBytes: name === "C4" ? { used: contributorBytes(effectsUsed, contributors), effect: contributorBytes(effectsEffect, contributors) } : null };
}
function observeBundle(name, entry) {
  if (typeof name !== "string") throw new TypeError("observeBundle: arg 'name' expected string, got " + typeof name);

  if (typeof entry !== "string") throw new TypeError("observeBundle: arg 'entry' expected string, got " + typeof entry);

  const observation = metadataObservation(name, entry);
  const oracle = verifyControlMetadata(name, observation);
  return { metadata: observation, oracle: oracle };
}
function bundle(name, entry) {
  if (typeof name !== "string") throw new TypeError("bundle: arg 'name' expected string, got " + typeof name);

  if (typeof entry !== "string") throw new TypeError("bundle: arg 'entry' expected string, got " + typeof entry);

  const jsPath = `${output}/${name}.js`;
  const metaPath = `${output}/${name}.meta.json`;
  reserveAbsent(jsPath);
  reserveAbsent(metaPath);
  const args = bundleArguments(name, entry);
  const result = command(esbuild, args, workspace, `${output}/cache`).outputSync();
  const receipt = saveResult(`${name}-bundle`, esbuild, args, workspace, result);
  requireOk(receipt.code === 0, `${name} native esbuild failed`);
  return observeBundle(name, entry);
}
function runtimeArgs(config, entry, name) {
  if (typeof config !== "string") throw new TypeError("runtimeArgs: arg 'config' expected string, got " + typeof config);

  if (typeof entry !== "string") throw new TypeError("runtimeArgs: arg 'entry' expected string, got " + typeof entry);

  if (typeof name !== "string") throw new TypeError("runtimeArgs: arg 'name' expected string, got " + typeof name);

  const args = { value: ["run", "--cached-only", "--no-npm", "--no-remote", "--deny-net", "--no-prompt", `--config=${config}`] };
  if (name === "C5") args.value = (current => {
    if (!Array.isArray(current)) throw new TypeError("anonymous: arg 'current' expected array, got " + typeof current);

    return [...current, `--allow-read=${data}`];
  })(args.value);

  args.value = (current => {
    if (!Array.isArray(current)) throw new TypeError("anonymous: arg 'current' expected array, got " + typeof current);

    return [...current, entry];
  })(args.value);
  if (name === "C5") args.value = (current => {
    if (!Array.isArray(current)) throw new TypeError("anonymous: arg 'current' expected array, got " + typeof current);

    return [...current, data];
  })(args.value);

  return args.value;
}
function expectedOutput(name) {
  if (typeof name !== "string") throw new TypeError("expectedOutput: arg 'name' expected string, got " + typeof name);

  return name === "C1" ? "BASE\n" : name === "C2" || name === "C3" ? "{\"x\":1}\n" : name === "C4" ? "init:effect\nentry:42\n" : `init:effect
{"jsonRoot":{"x":1},"jsonValue":{"x":1},"fileRoot":"{\\"x\\":1}","fileValue":"{\\"x\\":1}","documentRoot":"document:{\\"x\\":1}","documentValue":"document:{\\"x\\":1}","yamlRoot":{"answer":42},"yamlValue":{"answer":42},"usedRoot":42,"usedValue":42,"deadRoot":82,"deadValue":82}
`;
}
function runtime(name, runLabel, entry, bundled) {
  if (typeof name !== "string") throw new TypeError("runtime: arg 'name' expected string, got " + typeof name);

  if (typeof runLabel !== "string") throw new TypeError("runtime: arg 'runLabel' expected string, got " + typeof runLabel);

  if (typeof entry !== "string") throw new TypeError("runtime: arg 'entry' expected string, got " + typeof entry);

  if (typeof bundled !== "boolean") throw new TypeError("runtime: arg 'bundled' expected boolean, got " + typeof bundled);

  const config = `${workspace}/target/lykn/dist/project.json`;
  const runtimeEntry = bundled ? `${output}/${name}.js` : entry;
  const args = runtimeArgs(config, runtimeEntry, name);
  const result = command(deno, args, workspace, `${output}/cache`).outputSync();
  const receipt = saveResult(runLabel, deno, args, workspace, result);
  requireOk(receipt.code === 0, `${runLabel} Deno run failed`);
  requireOk(receipt.stderr === "", `${runLabel} wrote unexpected stderr`);
  requireOk(receipt.stdout === expectedOutput(name), `${runLabel} stdout diverged from the frozen prediction`);
  return receipt;
}
async function digest(bytes) {
  const hashBytes = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  return Array.from(hashBytes, byte => {
    if (typeof byte !== "number" || Number.isNaN(byte)) throw new TypeError("anonymous: arg 'byte' expected number, got " + typeof byte);

    return byte.toString(16).padStart(2, "0");
  }).join("");
}
async function publicSnapshot() {
  const relativeFiles = ["json/deno.json", "json/mod.js", "json/value.js", "json/file.js", "json/document.js", "yaml/deno.json", "yaml/mod.js", "yaml/value.js", "effects/deno.json", "effects/mod.js", "effects/used.js", "effects/dead.js", "effects/effect.js"];
  const files = { value: [] };
  for (const relative of relativeFiles) {
    const path = `${workspace}/target/lykn/dist/${relative}`;
    const hash = await digest(Deno.readFileSync(path));
    files.value = (current => {
      if (!Array.isArray(current)) throw new TypeError("anonymous: arg 'current' expected array, got " + typeof current);

      return [...current, { path: normalizePath(path), sha256: hash }];
    })(files.value);
  }
  const exports = { value: [] };
  for (const pkg of ["json", "yaml", "effects"]) {
    const configPath = `${workspace}/target/lykn/dist/${pkg}/deno.json`;
    const config = JSON.parse(Deno.readTextFileSync(configPath));
    requireOk(Object.hasOwn(config, "exports"), `missing public exports: ${configPath}`);
    requireOk(isRecord(config.exports), `public exports is not an object: ${configPath}`);
    for (const entry of Object.entries(config.exports)) {
      const key = entry[0];
      const target = entry[1];
      const specifier = key === "." ? config.name : `${config.name}/${key.slice(2)}`;
      const targetPath = modulePath(pkg, target);
      const hash = await digest(Deno.readFileSync(targetPath));
      exports.value = (current => {
        if (!Array.isArray(current)) throw new TypeError("anonymous: arg 'current' expected array, got " + typeof current);

        return [...current, { specifier: specifier, target: normalizePath(targetPath), sha256: hash }];
      })(exports.value);
    }
  }
  const actualExports = exports.value;
  const expectedExports = ["@probe/json", "@probe/json/value", "@probe/json/file", "@probe/json/document", "@probe/yaml", "@probe/yaml/value", "@probe/effects", "@probe/effects/used", "@probe/effects/dead"];
  const actualFiles = files.value;
  requireOk(actualFiles.length === 13, "public file snapshot must contain 13 entries");
  requireOk(actualExports.length === 9, "public export snapshot must contain nine entries");
  for (const exportRow of actualExports) {
    const targetCount = { value: 0 };
    for (const fileRow of actualFiles) {
      if (exportRow.target === fileRow.path) {
        targetCount.value = (current => {
          if (typeof current !== "number" || Number.isNaN(current)) throw new TypeError("anonymous: arg 'current' expected number, got " + typeof current);

          return current + 1;
        })(targetCount.value);
        requireOk(exportRow.sha256 === fileRow.sha256, `export target hash differs from public file snapshot: ${exportRow.target}`);
      }
    }
    requireOk(targetCount.value === 1, `export target missing/duplicated in 13-file snapshot: ${exportRow.target}`);
  }
  for (const row of actualExports) {
    requireOk(expectedExports.includes(row.specifier), `unexpected public export key ${row.specifier}`);
  }
  for (const expected of expectedExports) {
    const matches = { value: 0 };
    for (const row of actualExports) {
      if (row.specifier === expected) matches.value = (current => {
        if (typeof current !== "number" || Number.isNaN(current)) throw new TypeError("anonymous: arg 'current' expected number, got " + typeof current);

        return current + 1;
      })(matches.value);

    }
    requireOk(matches.value === 1, `public export key missing or duplicated: ${expected}`);
  }
  return { files: files.value, exports: actualExports };
}
function reconcileSnapshots(before, after) {
  const beforeFiles = before.files;
  const afterFiles = after.files;
  const beforeExports = before.exports;
  const afterExports = after.exports;
  requireOk(beforeFiles.length === 13, "before snapshot has wrong file count");
  requireOk(afterFiles.length === 13, "after snapshot has wrong file count");
  requireOk(beforeExports.length === 9, "before snapshot has wrong export count");
  requireOk(afterExports.length === 9, "after snapshot has wrong export count");
  for (const old of beforeFiles) {
    const matches = { value: [] };
    for (const current of afterFiles) {
      if (old.path === current.path) matches.value = (rows => {
        if (!Array.isArray(rows)) throw new TypeError("anonymous: arg 'rows' expected array, got " + typeof rows);

        return [...rows, current];
      })(matches.value);

    }
    const rows = matches.value;
    requireOk(rows.length === 1, `public file path missing/duplicated: ${old.path}`);
    const matched = rows[0];
    requireOk(old.sha256 === matched.sha256, `public file hash changed: ${old.path}`);
  }
  for (const old of beforeExports) {
    const matches = { value: [] };
    for (const current of afterExports) {
      if (old.specifier === current.specifier) matches.value = (rows => {
        if (!Array.isArray(rows)) throw new TypeError("anonymous: arg 'rows' expected array, got " + typeof rows);

        return [...rows, current];
      })(matches.value);

    }
    const rows = matches.value;
    requireOk(rows.length === 1, `public export key missing/duplicated: ${old.specifier}`);
    const current = rows[0];
    requireOk(old.target === current.target && old.sha256 === current.sha256, `public export target/hash changed: ${old.specifier}`);
  }
  return { unchangedFiles: beforeFiles, unchangedExports: beforeExports };
}
async function gatePhase() {
  const before = await publicSnapshot();
  writeNew(`${output}/public-before.json`, JSON.stringify(before));
  const entry = `${workspace}/target/lykn/dist/controls/c4.js`;
  const observation = bundle("C4", entry);
  writeNew(`${output}/gate-observations.json`, JSON.stringify(observation));
  return null;
}
async function controlsPhase() {
  const reviewedHash = Deno.args[5];
  const c4Path = `${output}/C4.js`;
  const actualHash = await digest(Deno.readFileSync(c4Path));
  requireOk(reviewedHash === actualHash, "C4 reviewed bundle hash mismatch");
  const gatePath = `${output}/gate-observations.json`;
  const gate = JSON.parse(Deno.readTextFileSync(gatePath));
  const controlsPath = `${output}/controls-observations.json`;
  reserveAbsent(controlsPath);
  requireOk(gate.metadata.control === "C4", "gate evidence is not the C4 observation");
  const observations = { value: [gate] };
  Deno.writeTextFileSync(controlsPath, JSON.stringify(observations.value));
  const c5Entry = `${workspace}/target/lykn/dist/controls/c5.js`;
  runtime("C5", "C5-source-before", c5Entry, false);
  runtime("C4", "C4-source", `${workspace}/target/lykn/dist/controls/c4.js`, false);
  runtime("C4", "C4-bundle-run", c4Path, true);
  for (const name of ["C1", "C2", "C3"]) {
    const entry = `${workspace}/target/lykn/dist/controls/${name.toLowerCase()}.js`;
    const observation = bundle(name, entry);
    observations.value = (current => {
      if (!Array.isArray(current)) throw new TypeError("anonymous: arg 'current' expected array, got " + typeof current);

      return [...current, observation];
    })(observations.value);
    Deno.writeTextFileSync(controlsPath, JSON.stringify(observations.value));
    runtime(name, `${name}-source`, entry, false);
    runtime(name, `${name}-bundle-run`, `${output}/${name}.js`, true);
  }
  const c5Observation = bundle("C5", c5Entry);
  observations.value = (current => {
    if (!Array.isArray(current)) throw new TypeError("anonymous: arg 'current' expected array, got " + typeof current);

    return [...current, c5Observation];
  })(observations.value);
  Deno.writeTextFileSync(controlsPath, JSON.stringify(observations.value));
  runtime("C5", "C5-bundle-run", `${output}/C5.js`, true);
  runtime("C5", "C5-source-after", c5Entry, false);
  const before = JSON.parse(Deno.readTextFileSync(`${output}/public-before.json`));
  const after = await publicSnapshot();
  writeNew(`${output}/public-after.json`, JSON.stringify(after));
  const reconciliation = reconcileSnapshots(before, after);
  writeNew(`${output}/public-reconciliation.json`, JSON.stringify(reconciliation));
  return null;
}
function main() {
  const phase = Deno.args[4];
  return phase === "gate" ? gatePhase() : (() => {
    if (phase === "controls") {
      return controlsPhase();
    } else {
      throw new Error("phase must be gate or controls");
    }
  })();
}
await main();
