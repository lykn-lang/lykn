function ensure(condition, message) {
  if (typeof condition !== "boolean") throw new TypeError("ensure: arg 'condition' expected boolean, got " + typeof condition);

  if (typeof message !== "string") throw new TypeError("ensure: arg 'message' expected string, got " + typeof message);

  if (!condition) throw new Error(message);

}
function absolutePath(path) {
  if (typeof path !== "string") throw new TypeError("absolutePath: arg 'path' expected string, got " + typeof path);

  if (!path.startsWith("/")) throw new Error("absolute-path: pre-condition failed: (path:startsWith \"/\") — caller blame");

  const result__gensym0 = path;
  if (typeof result__gensym0 !== "string") throw new TypeError("absolutePath: return value expected string, got " + typeof result__gensym0);

  return result__gensym0;
}
async function sha256(bytes) {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  const result__gensym1 = Array.from(digest, byte => {
    if (typeof byte !== "number" || Number.isNaN(byte)) throw new TypeError("anonymous: arg 'byte' expected number, got " + typeof byte);

    return byte.toString(16).padStart(2, "0");
  }).join("");
  if (typeof result__gensym1 !== "string") throw new TypeError("sha256: return value expected string, got " + typeof result__gensym1);

  return result__gensym1;
}
function control(controls, id) {
  if (typeof id !== "string") throw new TypeError("control: arg 'id' expected string, got " + typeof id);

  return controls.fullAuditControls.find(row => row.id === id);
}
function expectedStatus(id) {
  if (typeof id !== "string") throw new TypeError("expectedStatus: arg 'id' expected string, got " + typeof id);

  const result__gensym3 = (() => {
    const target__gensym2 = id;
    if (target__gensym2 === "K01") {
      return "complete_walk";
    }
    if (target__gensym2 === "K02") {
      return "complete_walk";
    }
    if (target__gensym2 === "K03") {
      return "complete_walk";
    }
    if (target__gensym2 === "K04") {
      return "complete_walk";
    }
    if (target__gensym2 === "K05") {
      return "complete_walk";
    }
    if (target__gensym2 === "K06") {
      return "complete_walk";
    }
    if (target__gensym2 === "K07") {
      return "complete_walk";
    }
    if (target__gensym2 === "K08") {
      return "complete_walk";
    }
    if (target__gensym2 === "K11") {
      return "identity_mismatch";
    }
    if (target__gensym2 === "K09") {
      return "parse_error";
    }
    if (target__gensym2 === "K10a") {
      return "source_missing";
    }
    if (target__gensym2 === "K10b") {
      return "source_unreadable";
    }
    if (target__gensym2 === "K12") {
      return "unsupported_ast";
    }
    {
      return throw new Error(`unknown fixed control ${id}`);
      ;
    }
  })();
  if (typeof result__gensym3 !== "string") throw new TypeError("expectedStatus: return value expected string, got " + typeof result__gensym3);

  return result__gensym3;
}
function expectedRowStatus(id) {
  if (typeof id !== "string") throw new TypeError("expectedRowStatus: arg 'id' expected string, got " + typeof id);

  const result__gensym5 = (() => {
    const target__gensym4 = id;
    if (target__gensym4 === "K01") {
      return "complete_walk";
    }
    if (target__gensym4 === "K02") {
      return "complete_walk";
    }
    if (target__gensym4 === "K03") {
      return "complete_walk";
    }
    if (target__gensym4 === "K04") {
      return "complete_walk";
    }
    if (target__gensym4 === "K05") {
      return "complete_walk";
    }
    if (target__gensym4 === "K06") {
      return "complete_walk";
    }
    if (target__gensym4 === "K07") {
      return "complete_walk";
    }
    if (target__gensym4 === "K08") {
      return "complete_walk";
    }
    if (target__gensym4 === "K09") {
      return "parse_error";
    }
    if (target__gensym4 === "K10a") {
      return "source_missing";
    }
    if (target__gensym4 === "K10b") {
      return "source_unreadable";
    }
    if (target__gensym4 === "K11") {
      return "not_processed";
    }
    {
      return throw new Error(`unknown fixed row ${id}`);
      ;
    }
  })();
  if (typeof result__gensym5 !== "string") throw new TypeError("expectedRowStatus: return value expected string, got " + typeof result__gensym5);

  return result__gensym5;
}
function expectedParserStatus(id) {
  if (typeof id !== "string") throw new TypeError("expectedParserStatus: arg 'id' expected string, got " + typeof id);

  const result__gensym6 = id === "K11" ? "identity_mismatch" : "passed";
  if (typeof result__gensym6 !== "string") throw new TypeError("expectedParserStatus: return value expected string, got " + typeof result__gensym6);

  return result__gensym6;
}
function expectedExit(id) {
  if (typeof id !== "string") throw new TypeError("expectedExit: arg 'id' expected string, got " + typeof id);

  const negatives = ["K09", "K10a", "K10b", "K11", "K12"];
  const result__gensym7 = negatives.includes(id) ? 2 : 0;
  if (typeof result__gensym7 !== "number" || Number.isNaN(result__gensym7)) throw new TypeError("expectedExit: return value expected number, got " + typeof result__gensym7);

  return result__gensym7;
}
function ensureZero(report, direct, reasons, id) {
  if (typeof direct !== "number" || Number.isNaN(direct)) throw new TypeError("ensureZero: arg 'direct' expected number, got " + typeof direct);

  if (typeof reasons !== "number" || Number.isNaN(reasons)) throw new TypeError("ensureZero: arg 'reasons' expected number, got " + typeof reasons);

  if (typeof id !== "string") throw new TypeError("ensureZero: arg 'id' expected string, got " + typeof id);

  {
    ensure(report.direct_statements_with_findings === direct, `${id} direct count`);
    ensure(report.nested_reasons === reasons, `${id} reason count`);
  }
}
function ensureNoAst(row, id) {
  if (typeof id !== "string") throw new TypeError("ensureNoAst: arg 'id' expected string, got " + typeof id);

  {
    ensure(!Object.hasOwn(row, "program"), `${id} must omit Program AST`);
    ensure(row.findings.length === 0, `${id} must have no findings`);
    ensure(row.reasons.length === 0, `${id} must have no reasons`);
    ensure(row.dependency_edges.length === 0, `${id} must have no dependency edges`);
    ensure(row.bare_imports === 0, `${id} must have no bare imports`);
  }
}
function ensurePositiveRow(row, direct, reasons, id) {
  if (typeof direct !== "number" || Number.isNaN(direct)) throw new TypeError("ensurePositiveRow: arg 'direct' expected number, got " + typeof direct);

  if (typeof reasons !== "number" || Number.isNaN(reasons)) throw new TypeError("ensurePositiveRow: arg 'reasons' expected number, got " + typeof reasons);

  if (typeof id !== "string") throw new TypeError("ensurePositiveRow: arg 'id' expected string, got " + typeof id);

  {
    ensure(row.status === "complete_walk", `${id} row status`);
    ensure(row.status === expectedStatus(id), `${id} expected terminal status`);
    ensure(row.ast_coverage === "complete", `${id} AST coverage`);
    ensure(row.program.type === "Program", `${id} Program type`);
    ensure(row.program.sourceType === "module", `${id} source type`);
    ensure(row.direct_count === direct, `${id} direct parent count`);
    ensure(row.reason_count === reasons, `${id} reason count`);
    ensure(row.program.body.length === row.findings.length, `${id} top-level parent count`);
    const findingParents = row.findings.filter(parent => parent.finding);
    ensure(row.direct_count === findingParents.length, `${id} finding flag sum`);
    ensure(row.reason_count === row.reasons.length, `${id} reason array length`);
    ensure(row.dependency_edge_count === row.dependency_edges.length, `${id} edge array length`);
    const parentReasons = { value: [] };
    const parentEdges = { value: [] };
    for (const parent of row.findings) {
      parentReasons.value = (all => {
        if (!Array.isArray(all)) throw new TypeError("anonymous: arg 'all' expected array, got " + typeof all);

        return all.concat(parent.reasons);
      })(parentReasons.value);
      parentEdges.value = (all => {
        if (!Array.isArray(all)) throw new TypeError("anonymous: arg 'all' expected array, got " + typeof all);

        return all.concat(parent.dependency_edges);
      })(parentEdges.value);
    }
    ensure(JSON.stringify(parentReasons.value) === JSON.stringify(row.reasons), `${id} flattened reasons`);
    ensure(JSON.stringify(parentEdges.value) === JSON.stringify(row.dependency_edges), `${id} flattened dependency edges`);
    if (id === "K08") {
      ensure(row.dependency_edges.length === 2, `${id} dependency edge count`);
      ensure(row.bare_imports === 1, `${id} bare import count`);
    } else {
      ensure(row.dependency_edges.length === 0, `${id} unexpected dependency edges`);
      ensure(row.bare_imports === 0, `${id} unexpected bare imports`);
    }
    for (const reason of row.reasons) {
      ensure(reason.potential_load_evaluation === true, `${id} reason must be potential`);
      ensure(reason.observed_effect === null, `${id} reason must not claim observed effect`);
    }
  }
}
function ensureParent(row, index, parentType, parentPath, finding, id) {
  if (typeof index !== "number" || Number.isNaN(index)) throw new TypeError("ensureParent: arg 'index' expected number, got " + typeof index);

  if (typeof parentType !== "string") throw new TypeError("ensureParent: arg 'parentType' expected string, got " + typeof parentType);

  if (typeof parentPath !== "string") throw new TypeError("ensureParent: arg 'parentPath' expected string, got " + typeof parentPath);

  if (typeof finding !== "boolean") throw new TypeError("ensureParent: arg 'finding' expected boolean, got " + typeof finding);

  if (typeof id !== "string") throw new TypeError("ensureParent: arg 'id' expected string, got " + typeof id);

  const parent = row.findings[index];
  ensure(parent.parentType === parentType, `${id} parent type at ${index}`);
  ensure(parent.parentPath === parentPath, `${id} parent path at ${index}`);
  ensure(parent.finding === finding, `${id} parent finding at ${index}`);
  ensure(parent.potential_load_evaluation === finding, `${id} parent potential flag at ${index}`);
  ensure(parent.observed_effect === null, `${id} parent observed effect at ${index}`);
}
function ensureEdge(row, index, nodeType, path, source, bare, id) {
  if (typeof index !== "number" || Number.isNaN(index)) throw new TypeError("ensureEdge: arg 'index' expected number, got " + typeof index);

  if (typeof nodeType !== "string") throw new TypeError("ensureEdge: arg 'nodeType' expected string, got " + typeof nodeType);

  if (typeof path !== "string") throw new TypeError("ensureEdge: arg 'path' expected string, got " + typeof path);

  if (typeof source !== "string") throw new TypeError("ensureEdge: arg 'source' expected string, got " + typeof source);

  if (typeof bare !== "boolean") throw new TypeError("ensureEdge: arg 'bare' expected boolean, got " + typeof bare);

  if (typeof id !== "string") throw new TypeError("ensureEdge: arg 'id' expected string, got " + typeof id);

  const edge = row.dependency_edges[index];
  ensure(edge.nodeType === nodeType, `${id} dependency node at ${index}`);
  ensure(edge.path === path, `${id} dependency path at ${index}`);
  ensure(edge.source === source, `${id} dependency source at ${index}`);
  ensure(edge.bare_import === bare, `${id} bare-import flag at ${index}`);
}
function ensureFileReport(report, id) {
  if (typeof id !== "string") throw new TypeError("ensureFileReport: arg 'id' expected string, got " + typeof id);

  {
    ensure(report.selected_sources === 1, `${id} selected source denominator`);
    ensure(report.selected_condition_rows === 1, `${id} selected row denominator`);
    ensure(report.required_condition_rows === 1, `${id} required row denominator`);
    ensure(report.rows.length === 1, `${id} report row length`);
    ensure(report.parser_gate.status === expectedParserStatus(id), `${id} parser gate status`);
    const row = report.rows[0];
    ensure(row.status === expectedRowStatus(id), `${id} exclusive row status`);
    ensure(report.direct_statements_with_findings === (Object.hasOwn(row, "direct_count") ? row.direct_count : 0), `${id} direct parent report total`);
    ensure(report.nested_reasons === (Object.hasOwn(row, "reason_count") ? row.reason_count : 0), `${id} nested reason report total`);
    ensure(report.dependency_edges === (Object.hasOwn(row, "dependency_edge_count") ? row.dependency_edge_count : 0), `${id} dependency report total`);
    ensure(report.bare_imports === row.bare_imports, `${id} bare import report total`);
    const statuses = ["complete_walk", "source_missing", "source_unreadable", "source_hash_mismatch", "compile_failed", "output_missing", "output_hash_mismatch", "output_unreadable", "parse_error", "unsupported_ast", "not_processed", "excluded_named"];
    for (const status of statuses) {
      ensure(report[status] === (status === expectedRowStatus(id) ? 1 : 0), `${id} terminal bucket ${status}`);
    }
    const partitionTotal = statuses.map(status => {
      if (typeof status !== "string") throw new TypeError("anonymous: arg 'status' expected string, got " + typeof status);

      return report[status];
    }).reduce((total, count) => {
      if (typeof total !== "number" || Number.isNaN(total)) throw new TypeError("anonymous: arg 'total' expected number, got " + typeof total);

      if (typeof count !== "number" || Number.isNaN(count)) throw new TypeError("anonymous: arg 'count' expected number, got " + typeof count);

      return total + count;
    }, 0);
    ensure(partitionTotal === report.selected_condition_rows, `${id} terminal partition equation`);
    ensure(report.files_parsed === report.complete_walk + report.unsupported_ast, `${id} parsed file equation`);
    ensure(report.files_completely_walked === report.complete_walk, `${id} completely walked equation`);
  }
}
function ensureReason(row, index, nodeType, path, category, line, column, range, id) {
  if (typeof index !== "number" || Number.isNaN(index)) throw new TypeError("ensureReason: arg 'index' expected number, got " + typeof index);

  if (typeof nodeType !== "string") throw new TypeError("ensureReason: arg 'nodeType' expected string, got " + typeof nodeType);

  if (typeof path !== "string") throw new TypeError("ensureReason: arg 'path' expected string, got " + typeof path);

  if (typeof category !== "string") throw new TypeError("ensureReason: arg 'category' expected string, got " + typeof category);

  if (typeof line !== "number" || Number.isNaN(line)) throw new TypeError("ensureReason: arg 'line' expected number, got " + typeof line);

  if (typeof column !== "number" || Number.isNaN(column)) throw new TypeError("ensureReason: arg 'column' expected number, got " + typeof column);

  if (typeof range !== "string") throw new TypeError("ensureReason: arg 'range' expected string, got " + typeof range);

  if (typeof id !== "string") throw new TypeError("ensureReason: arg 'id' expected string, got " + typeof id);

  {
    const reason = row.reasons[index];
    ensure(reason.nodeType === nodeType, `${id} reason node type at ${index}`);
    ensure(reason.path === path, `${id} reason path at ${index}`);
    ensure(reason.category === category, `${id} reason category at ${index}`);
    ensure(reason.loc.line === line, `${id} reason line at ${index}`);
    ensure(reason.loc.column === column, `${id} reason column at ${index}`);
    ensure(JSON.stringify(reason.range) === range, `${id} reason range at ${index}`);
  }
}
function resultPath(caseDir, file) {
  if (typeof caseDir !== "string") throw new TypeError("resultPath: arg 'caseDir' expected string, got " + typeof caseDir);

  if (typeof file !== "string") throw new TypeError("resultPath: arg 'file' expected string, got " + typeof file);

  const result__gensym8 = `${caseDir}/${file}`;
  if (typeof result__gensym8 !== "string") throw new TypeError("resultPath: return value expected string, got " + typeof result__gensym8);

  return result__gensym8;
}
async function runCase(controls, id, sequence, deno, scannerJs, coreJs, walkerJs, parserPath, taskRoot, cacheRoot, cwd) {
  if (typeof id !== "string") throw new TypeError("runCase: arg 'id' expected string, got " + typeof id);

  if (typeof sequence !== "number" || Number.isNaN(sequence)) throw new TypeError("runCase: arg 'sequence' expected number, got " + typeof sequence);

  if (typeof deno !== "string") throw new TypeError("runCase: arg 'deno' expected string, got " + typeof deno);

  if (typeof scannerJs !== "string") throw new TypeError("runCase: arg 'scannerJs' expected string, got " + typeof scannerJs);

  if (typeof coreJs !== "string") throw new TypeError("runCase: arg 'coreJs' expected string, got " + typeof coreJs);

  if (typeof walkerJs !== "string") throw new TypeError("runCase: arg 'walkerJs' expected string, got " + typeof walkerJs);

  if (typeof parserPath !== "string") throw new TypeError("runCase: arg 'parserPath' expected string, got " + typeof parserPath);

  if (typeof taskRoot !== "string") throw new TypeError("runCase: arg 'taskRoot' expected string, got " + typeof taskRoot);

  if (typeof cacheRoot !== "string") throw new TypeError("runCase: arg 'cacheRoot' expected string, got " + typeof cacheRoot);

  if (typeof cwd !== "string") throw new TypeError("runCase: arg 'cwd' expected string, got " + typeof cwd);

  const definition = control(controls, id);
  const caseDir = resultPath(taskRoot, id);
  const denoDir = resultPath(cacheRoot, id);
  await Deno.mkdir(caseDir);
  await Deno.mkdir(denoDir);
  const inputPath = resultPath(caseDir, (() => {
    const target__gensym9 = id;
    if (target__gensym9 === "K10a") {
      return "missing-control.js";
    }
    if (target__gensym9 === "K10b") {
      return "unreadable-control.js";
    }
    {
      return "input.js";
    }
  })());
  const hasInput = Object.hasOwn(definition, "input") && !(definition.input === null);
  if (hasInput) await Deno.writeFile(inputPath, new TextEncoder().encode(definition.input), { createNew: true });

  const inputBytes = hasInput ? await Deno.readFile(inputPath) : new Uint8Array();
  const inputHash = hasInput ? await sha256(inputBytes) : null;
  const isSynthetic = id === "K12";
  const isGated = id === "K11";
  const k11ExpectedHash = isGated ? (() => {
    ensure((((!(controls === null) && !(controls === undefined)) && typeof controls === "object") && Object.hasOwn(controls, "observations")) && Array.isArray(controls.observations), "K11 observations must be an array");
    const k11Observation = controls.observations.find(observation => (((!(observation === null) && !(observation === undefined)) && typeof observation === "object") && Object.hasOwn(observation, "id")) && observation.id === "K11");
    ensure((((!(k11Observation === null) && !(k11Observation === undefined)) && typeof k11Observation === "object") && !Array.isArray(k11Observation)) && Object.hasOwn(k11Observation, "expectedHash"), "K11 observation must own expectedHash");
    ensure(typeof k11Observation.expectedHash === "string" && k11Observation.expectedHash === "0000000000000000000000000000000000000000000000000000000000000000", "K11 observation expectedHash must be the frozen zero digest");
    return k11Observation.expectedHash;
  })() : null;
  const scannerInputPath = isGated ? `${taskRoot}/seed/K01.js` : inputPath;
  bind(rowHash, if (isGated) await sha256(await Deno.readFile(scannerInputPath));
   else if (hasInput) inputHash;
   else null;


  , bind(sourceId, if (isGated) "slice19-K01";
   else `slice19-${id}`;

  ), bind(manifest, if (isSynthetic) obj("schema", "lykn-estree-capability-manifest-v1", "kind", "synthetic_unit", "run_id", id, "created_at", "2026-11-07", "control_id", id, "injected_ast", JSON.parse(definition.injectedAst));
   else obj("schema", "lykn-estree-capability-manifest-v1", "kind", "file_scan", "run_id", id, "created_at", "2026-11-07", "source_commit", "8ed869f1ed24bf688ba91f71d8c539680136794e", "source_tree", "74b980be159f8557c78d11b4546bf92498b7861e", "source_clean", true, "compiler", obj("path", "/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn", "version", "0.6.0", "sha256", "aa31947fd4bb0ae0024cf82380c8e076bc2b92ba4493fec4feade586058bfaf8"), "deno", obj("path", deno, "version", "2.9.6", "sha256", "2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74"), "parser", obj("path", parserPath, "url", "file:///Users/oubiwann/Library/Caches/deno/npm/registry.npmjs.org/acorn/8.17.0/dist/acorn.mjs", "version", "8.17.0", "expected_sha256", if (isGated) k11ExpectedHash;
   else "1cbcbf252a5800e496dc505c706f309a9dd4e1789392e12963c77ae9497ff6f7";

  , "options", obj("ecmaVersion", "latest", "sourceType", "module", "locations", true, "ranges", true)), "rows", [obj("source_id", sourceId, "source_sha256", rowHash, "emitter", "inert-js-control", "mode", "module", "condition_id", id, "path", scannerInputPath, "sha256", rowHash, "output_path", scannerInputPath, "required", true, "segment", "control", "gated", isGated, "expectedHash", if (isGated) k11ExpectedHash;
   else null;

  )]);

  ));
  const manifestPath = resultPath(caseDir, "manifest.json");
  await Deno.writeTextFile(manifestPath, JSON.stringify(manifest), { createNew: true });
  const manifestBytes = await Deno.readFile(manifestPath);
  const denoBytes = await Deno.readFile(deno);
  const parserBytes = isSynthetic ? null : await Deno.readFile(parserPath);
  const scannerBytes = await Deno.readFile(scannerJs);
  const coreBytes = await Deno.readFile(coreJs);
  const walkerBytes = await Deno.readFile(walkerJs);
  const denoHash = await sha256(denoBytes);
  const parserHash = isSynthetic ? null : await sha256(parserBytes);
  const scannerHash = await sha256(scannerBytes);
  const coreHash = await sha256(coreBytes);
  const walkerHash = await sha256(walkerBytes);
  const manifestHash = await sha256(manifestBytes);
  if (!isSynthetic) {
    ensure(denoHash === "2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74", `${id} Deno binary identity`);
    ensure(parserHash === "1cbcbf252a5800e496dc505c706f309a9dd4e1789392e12963c77ae9497ff6f7", `${id} Acorn artifact identity`);
  }
  ensure(coreHash === "068afeb7c912bab6876b8412fdadc6c6948ca41dcdb497f8b99a40061fb3f6a9", `${id} compiled parser-core module identity`);
  ensure(!(walkerHash === null), `${id} walker module identity missing`);
  ensure(!(scannerHash === null), `${id} scanner module identity missing`);
  const readPaths = isSynthetic ? [manifestPath, scannerJs, coreJs, walkerJs] : isGated ? [manifestPath, scannerJs, coreJs, walkerJs, parserPath] : id === "K10b" ? [manifestPath, scannerJs, coreJs, walkerJs, parserPath] : [manifestPath, scannerJs, coreJs, walkerJs, parserPath, scannerInputPath];
  if (id === "K10a") ensure(readPaths.includes(inputPath), "K10a missing source grant not declared");

  if (id === "K10b") {
    ensure(hasInput, "K10b existing denied input was not staged");
    ensure(!(inputHash === null), "K10b existing input hash missing");
    ensure(!readPaths.includes(inputPath), "K10b denied source path is granted");
  }
  const readGrant = readPaths.join(",");
  const argv = ["run", "--no-config", "--no-npm", "--no-remote", "--cached-only", "--deny-net", "--no-prompt", `--allow-read=${readGrant}`, scannerJs, manifestPath];
  const environment = { DENO_DIR: denoDir, DENO_NO_UPDATE_CHECK: "1", NO_COLOR: "1", PATH: "/opt/homebrew/bin:/usr/bin:/bin" };
  const attempt = { id: id, sequence: sequence, argv: [deno].concat(argv), cwd: cwd, clearEnv: true, environment: environment, read_grant_paths: readPaths, outer_run_target: deno, child_run_grant: "none", write_grant: "none", network: "denied", input_path: isSynthetic ? null : scannerInputPath, input_sha256: inputHash, declared_source_sha256: rowHash, source_path: isSynthetic ? null : scannerInputPath, manifest_path: manifestPath, manifest_sha256: manifestHash, parser_path: isSynthetic ? null : parserPath, parser_sha256: parserHash, deno_sha256: denoHash, scanner_path: scannerJs, scanner_sha256: scannerHash, core_path: coreJs, core_sha256: coreHash, walker_path: walkerJs, walker_sha256: walkerHash, expected_status: expectedStatus(id), expected_exit: expectedExit(id) };
  await Deno.writeTextFile(resultPath(caseDir, "attempt.json"), JSON.stringify(attempt), { createNew: true });
  const output = await new Deno.Command(deno, { args: argv, cwd: cwd, clearEnv: true, env: environment, stdin: "null", stdout: "piped", stderr: "piped" }).output();
  await Deno.writeFile(resultPath(caseDir, "stdout.bin"), output.stdout, { createNew: true });
  await Deno.writeFile(resultPath(caseDir, "stderr.bin"), output.stderr, { createNew: true });
  await Deno.writeTextFile(resultPath(caseDir, "command-result.json"), JSON.stringify({ id: id, sequence: sequence, argv: [deno].concat(argv), cwd: cwd, exit: output.code, signal: output.signal, stdout_bytes: output.stdout.length, stderr_bytes: output.stderr.length }), { createNew: true });
  const postDenoHash = await sha256(await Deno.readFile(deno));
  const postManifestHash = await sha256(await Deno.readFile(manifestPath));
  const postScannerHash = await sha256(await Deno.readFile(scannerJs));
  const postCoreHash = await sha256(await Deno.readFile(coreJs));
  const postWalkerHash = await sha256(await Deno.readFile(walkerJs));
  const postParserHash = isSynthetic ? null : await sha256(await Deno.readFile(parserPath));
  const postUse = { id: id, deno_before: denoHash, deno_after: postDenoHash, parser_before: parserHash, parser_after: postParserHash, scanner_before: scannerHash, scanner_after: postScannerHash, core_before: coreHash, core_after: postCoreHash, walker_before: walkerHash, walker_after: postWalkerHash, manifest_before: manifestHash, manifest_after: postManifestHash };
  await Deno.writeTextFile(resultPath(caseDir, "post-use-hashes.json"), JSON.stringify(postUse), { createNew: true });
  ensure(denoHash === postDenoHash, `${id} Deno changed during child run`);
  ensure(parserHash === postParserHash, `${id} parser changed during child run`);
  ensure(scannerHash === postScannerHash, `${id} scanner changed during child run`);
  ensure(coreHash === postCoreHash, `${id} parser-core changed during child run`);
  ensure(walkerHash === postWalkerHash, `${id} walker changed during child run`);
  ensure(manifestHash === postManifestHash, `${id} manifest changed during child run`);
  const reportText = new TextDecoder("utf-8", { fatal: true });
  const reportCell = { value: null };
  try {
    reportCell.value = JSON.parse(reportText.decode(output.stdout));
  } catch (error) {
    throw new Error(`${id} scanner stdout was not JSON`, { cause: error });
  }
  await Deno.writeFile(resultPath(caseDir, "scan-report.json"), output.stdout.subarray(0, output.stdout.length), { createNew: true });
  const report = reportCell.value;
  ensure(output.code === expectedExit(id), `${id} child exit mismatch`);
  ensure(output.stderr.length === 0, `${id} unexpected child stderr`);
  if (!isSynthetic) ensureFileReport(report, id);

  if (id === "K11") {
    const row = report.rows[0];
    ensure(report.status === "incomplete", "K11 aggregate status");
    ensure(report.parser_gate.status === expectedStatus(id), "K11 parser gate mismatch");
    ensure(report.not_processed === 1, "K11 required row not_processed mismatch");
    ensure(report.files_parsed === 0, "K11 must parse no file");
    ensure(row.status === "not_processed", "K11 row status");
    ensure(row.manifest_source_sha256 === row.source_sha256, "K11 declared source hash missing");
    ensure(row.source_sha256 === rowHash, "K11 K01 source hash declaration mismatch");
    ensure(row.observed_source_sha256 === null, "K11 source must remain unread");
    ensure(row.observed_output_sha256 === null, "K11 output hash must be unobserved");
    ensure(report.parser_gate.expected_sha256 === "0000000000000000000000000000000000000000000000000000000000000000", "K11 parser expected hash");
    ensure(report.parser_gate.actual_sha256 === "1cbcbf252a5800e496dc505c706f309a9dd4e1789392e12963c77ae9497ff6f7", "K11 parser actual hash");
    ensureNoAst(row, id);
  }
  if (id === "K01") {
    const row = report.rows[0];
    ensure(report.status === "complete_no_findings", "K01 aggregate status");
    ensure(report.files_parsed === 1, "K01 parsed-file count");
    ensure(row.program.body.length === 2, "K01 Program body count");
    ensure(JSON.stringify(row.program.range) === "[0,66]", "K01 Program range");
    ensure(row.program.loc.end.line === 5, "K01 Program end line");
    ensure(row.program.loc.end.column === 0, "K01 Program end column");
    const functionDeclaration = row.program.body[0];
    const functionExpressionStatement = functionDeclaration.body.body[0];
    const functionCall = functionExpressionStatement.expression;
    const arrowDeclaration = row.program.body[1];
    const arrowVariable = arrowDeclaration.declarations[0];
    const arrowFunction = arrowVariable.init;
    ensure(functionCall.type === "CallExpression", "K01 function body call AST");
    ensure(functionCall.loc.start.line === 2, "K01 function body call line");
    ensure(functionCall.loc.start.column === 2, "K01 function body call column");
    ensure(JSON.stringify(functionCall.range) === "[20,30]", "K01 function body call range");
    ensure(arrowFunction.body.type === "CallExpression", "K01 arrow body call AST");
    ensurePositiveRow(row, 0, 0, id);
    ensureParent(row, 0, "FunctionDeclaration", "Program.body[0]", false, id);
    ensureParent(row, 1, "VariableDeclaration", "Program.body[1]", false, id);
    ensureZero(report, 0, 0, id);
  }
  if (id === "K02") {
    const row = report.rows[0];
    ensure(report.status === "complete_with_findings", "K02 aggregate status");
    ensurePositiveRow(row, 2, 3, id);
    ensureZero(report, 2, 3, id);
    ensureParent(row, 0, "VariableDeclaration", "Program.body[0]", true, id);
    ensureParent(row, 1, "ExpressionStatement", "Program.body[1]", true, id);
    ensureReason(row, 0, "CallExpression", "Program.body[0].declarations[0].init", "call", 1, 14, "[14,25]", id);
    ensureReason(row, 1, "CallExpression", "Program.body[1].expression", "call", 2, 0, "[27,32]", id);
    ensureReason(row, 2, "Identifier", "Program.body[1].expression.callee", "identifier_read", 2, 0, "[27,30]", id);
  }
  if (id === "K03") {
    const row = report.rows[0];
    ensure(report.status === "complete_with_findings", "K03 aggregate status");
    ensurePositiveRow(row, 1, 2, id);
    ensureParent(row, 0, "VariableDeclaration", "Program.body[0]", true, id);
    ensureZero(report, 1, 2, id);
    ensureReason(row, 0, "MemberExpression", "Program.body[0].declarations[0].init", "member_read", 1, 14, "[14,26]", id);
    ensureReason(row, 1, "Identifier", "Program.body[0].declarations[0].init.object", "identifier_read", 1, 14, "[14,20]", id);
  }
  if (id === "K04") {
    const row = report.rows[0];
    ensure(report.status === "complete_with_findings", "K04 aggregate status");
    ensurePositiveRow(row, 1, 4, id);
    ensureParent(row, 0, "VariableDeclaration", "Program.body[0]", true, id);
    ensureZero(report, 1, 4, id);
    ensureReason(row, 0, "ObjectPattern", "Program.body[0].declarations[0].id", "destructuring", 1, 6, "[6,28]", id);
    ensureReason(row, 1, "CallExpression", "Program.body[0].declarations[0].id.properties[0].value.right", "call", 1, 16, "[16,26]", id);
    ensureReason(row, 2, "Identifier", "Program.body[0].declarations[0].id.properties[0].value.right.callee", "identifier_read", 1, 16, "[16,24]", id);
    ensureReason(row, 3, "Identifier", "Program.body[0].declarations[0].init", "identifier_read", 1, 31, "[31,37]", id);
  }
  if (id === "K05") {
    const row = report.rows[0];
    ensure(report.status === "complete_with_findings", "K05 aggregate status");
    ensurePositiveRow(row, 2, 4, id);
    ensureParent(row, 0, "VariableDeclaration", "Program.body[0]", true, id);
    ensureParent(row, 1, "VariableDeclaration", "Program.body[1]", true, id);
    ensureZero(report, 2, 4, id);
    ensureReason(row, 0, "SpreadElement", "Program.body[0].declarations[0].init.properties[0]", "spread", 1, 16, "[16,25]", id);
    ensureReason(row, 1, "Identifier", "Program.body[0].declarations[0].init.properties[0].argument", "identifier_read", 1, 19, "[19,25]", id);
    ensureReason(row, 2, "TemplateLiteral", "Program.body[1].declarations[0].init", "coercion", 2, 13, "[42,53]", id);
    ensureReason(row, 3, "Identifier", "Program.body[1].declarations[0].init.expressions[0]", "identifier_read", 2, 17, "[46,51]", id);
  }
  if (id === "K06") {
    const row = report.rows[0];
    ensure(report.status === "complete_with_findings", "K06 aggregate status");
    ensurePositiveRow(row, 1, 9, id);
    ensureParent(row, 0, "ClassDeclaration", "Program.body[0]", true, id);
    ensureZero(report, 1, 9, id);
    ensureReason(row, 0, "Identifier", "Program.body[0].superClass", "class_heritage_validation", 1, 18, "[18,22]", id);
    ensureReason(row, 1, "Identifier", "Program.body[0].superClass", "identifier_read", 1, 18, "[18,22]", id);
    ensureReason(row, 2, "CallExpression", "Program.body[0].body.body[0].key", "computed_key_coercion", 2, 3, "[28,33]", id);
    ensureReason(row, 3, "CallExpression", "Program.body[0].body.body[0].key", "call", 2, 3, "[28,33]", id);
    ensureReason(row, 4, "Identifier", "Program.body[0].body.body[0].key.callee", "identifier_read", 2, 3, "[28,31]", id);
    ensureReason(row, 5, "CallExpression", "Program.body[0].body.body[1].value", "call", 3, 17, "[65,71]", id);
    ensureReason(row, 6, "Identifier", "Program.body[0].body.body[1].value.callee", "identifier_read", 3, 17, "[65,69]", id);
    ensureReason(row, 7, "CallExpression", "Program.body[0].body.body[2].body[0].expression", "call", 4, 11, "[84,91]", id);
    ensureReason(row, 8, "Identifier", "Program.body[0].body.body[2].body[0].expression.callee", "identifier_read", 4, 11, "[84,89]", id);
  }
  if (id === "K07") {
    const row = report.rows[0];
    ensure(report.status === "complete_with_findings", "K07 aggregate status");
    ensurePositiveRow(row, 1, 3, id);
    ensureParent(row, 0, "IfStatement", "Program.body[0]", true, id);
    ensureZero(report, 1, 3, id);
    ensureReason(row, 0, "Identifier", "Program.body[0].test", "identifier_read", 1, 4, "[4,9]", id);
    ensureReason(row, 1, "ThrowStatement", "Program.body[0].consequent.body[0]", "throw", 2, 2, "[15,27]", id);
    ensureReason(row, 2, "Identifier", "Program.body[0].consequent.body[0].argument", "identifier_read", 2, 8, "[21,26]", id);
  }
  if (id === "K08") {
    const row = report.rows[0];
    ensure(report.status === "complete_with_findings", "K08 status");
    ensurePositiveRow(row, 1, 3, id);
    ensureZero(report, 1, 3, id);
    ensure(report.dependency_edges === 2, "K08 dependency-edge count");
    ensure(report.bare_imports === 1, "K08 bare-import count");
    ensureParent(row, 0, "ImportDeclaration", "Program.body[0]", false, id);
    ensureParent(row, 1, "ExportNamedDeclaration", "Program.body[1]", false, id);
    ensureParent(row, 2, "ExpressionStatement", "Program.body[2]", true, id);
    ensure(row.program.body.length === 3, "K08 Program body count");
    ensure(JSON.stringify(row.program.range) === "[0,67]", "K08 Program range");
    ensure(row.program.loc.end.line === 4, "K08 Program end line");
    ensure(row.program.loc.end.column === 0, "K08 Program end column");
    ensureEdge(row, 0, "ImportDeclaration", "Program.body[0]", "./dep.js", true, id);
    ensureEdge(row, 1, "ExportNamedDeclaration", "Program.body[1]", "./dep.js", false, id);
    ensureReason(row, 0, "AwaitExpression", "Program.body[2].expression", "await", 3, 0, "[53,65]", id);
    ensureReason(row, 1, "CallExpression", "Program.body[2].expression.argument", "call", 3, 6, "[59,65]", id);
    ensureReason(row, 2, "Identifier", "Program.body[2].expression.argument.callee", "identifier_read", 3, 6, "[59,63]", id);
  }
  if (id === "K09") {
    const row = report.rows[0];
    ensure(report.status === "incomplete", "K09 aggregate status");
    ensure(report.parse_error === 1, "K09 parse-error count");
    ensure(row.status === "parse_error", "K09 row status");
    ensure(row.error.pos === 14, "K09 SyntaxError position");
    ensure(row.error.name === "SyntaxError", "K09 actual SyntaxError name");
    ensure(typeof row.error.message === "string", "K09 diagnostic message type");
    ensure(row.error.message.length > 0, "K09 diagnostic message nonempty");
    ensure(row.error.loc.line === 1, "K09 SyntaxError line");
    ensure(row.error.loc.column === 14, "K09 SyntaxError column");
    ensureNoAst(row, id);
  }
  if (id === "K10a" || id === "K10b") {
    const row = report.rows[0];
    ensure(report.status === "incomplete", `${id} aggregate status`);
    ensure(row.status === (id === "K10a" ? "source_missing" : "source_unreadable"), `${id} row status`);
    ensure(row.error.name === (id === "K10a" ? "NotFound" : "NotCapable"), `${id} distinct read failure`);
    if (id === "K10a") {
      ensure(row.source_sha256 === null, "K10a source expected hash must be null");
      ensure(row.manifest_source_sha256 === null, "K10a manifest expected hash must be null");
    } else {
      ensure(row.source_sha256 === rowHash, "K10b declared hash mismatch");
      ensure(inputHash === rowHash, "K10b staged input hash mismatch");
    }
    ensure(row.observed_source_sha256 === null, `${id} observed source hash must be null`);
    ensure(row.observed_output_sha256 === null, `${id} observed output hash must be null`);
    ensureNoAst(row, id);
  }
  if (id === "K12") {
    ensure(report.parser_gate.status === "not_applicable", "K12 parser gate N/A");
    ensure(report.parser_gate.path === null, "K12 parser path N/A");
    ensure(report.parser_gate.version === null, "K12 parser version N/A");
    ensure(report.parser_gate.expected_sha256 === null, "K12 expected parser hash N/A");
    ensure(report.parser_gate.actual_sha256 === null, "K12 actual parser hash N/A");
    ensure(report.parser_gate.options === null, "K12 parser options N/A");
    ensure(report.selected_sources === null, "K12 selected sources N/A");
    ensure(report.selected_condition_rows === null, "K12 selected rows N/A");
    ensure(report.required_condition_rows === null, "K12 required rows N/A");
    ensure(report.complete_walk === null, "K12 complete walks N/A");
    ensure(report.source_missing === null, "K12 missing sources N/A");
    ensure(report.source_unreadable === null, "K12 unreadable sources N/A");
    ensure(report.source_hash_mismatch === null, "K12 hash mismatches N/A");
    ensure(report.compile_failed === null, "K12 compile failures N/A");
    ensure(report.output_missing === null, "K12 missing outputs N/A");
    ensure(report.output_hash_mismatch === null, "K12 output hash mismatches N/A");
    ensure(report.output_unreadable === null, "K12 unreadable outputs N/A");
    ensure(report.parse_error === null, "K12 parse errors N/A");
    ensure(report.unsupported_ast === null, "K12 corpus unsupported AST N/A");
    ensure(report.not_processed === null, "K12 not-processed rows N/A");
    ensure(report.excluded_named === null, "K12 exclusions N/A");
    ensure(report.unit.status === expectedStatus(id), "K12 unsupported status");
    ensure(report.unit.nodeType === "ExperimentalNode", "K12 actual offending type");
    ensure(report.unit.path === "Program.body[0]", "K12 path");
    ensure(report.unit.loc === null, "K12 unavailable location");
    ensure(report.unit.range === null, "K12 unavailable range");
    ensure(report.status === "incomplete", "K12 aggregate status");
    ensure(report.files_parsed === null, "K12 parser count must be not applicable");
    ensure(report.files_completely_walked === null, "K12 walked-file count must be not applicable");
    ensure(report.direct_statements_with_findings === null, "K12 direct findings N/A");
    ensure(report.nested_reasons === null, "K12 nested reasons N/A");
    ensure(report.dependency_edges === null, "K12 dependency edges N/A");
    ensure(report.bare_imports === null, "K12 bare imports N/A");
    ensure(report.rows.length === 0, "K12 file rows must be not applicable");
  }
  await Deno.writeTextFile(resultPath(caseDir, "case-verdict.json"), JSON.stringify({ id: id, status: "pass", childExit: output.code, report: report }), { createNew: true });
  return { id: id, status: "pass", exit: output.code, report: report };
}
async function runFixedGate(controlsPath, deno, scannerJs, coreJs, walkerJs, taskRoot, cacheRoot, cwd) {
  if (typeof controlsPath !== "string") throw new TypeError("runFixedGate: arg 'controlsPath' expected string, got " + typeof controlsPath);

  if (typeof deno !== "string") throw new TypeError("runFixedGate: arg 'deno' expected string, got " + typeof deno);

  if (typeof scannerJs !== "string") throw new TypeError("runFixedGate: arg 'scannerJs' expected string, got " + typeof scannerJs);

  if (typeof coreJs !== "string") throw new TypeError("runFixedGate: arg 'coreJs' expected string, got " + typeof coreJs);

  if (typeof walkerJs !== "string") throw new TypeError("runFixedGate: arg 'walkerJs' expected string, got " + typeof walkerJs);

  if (typeof taskRoot !== "string") throw new TypeError("runFixedGate: arg 'taskRoot' expected string, got " + typeof taskRoot);

  if (typeof cacheRoot !== "string") throw new TypeError("runFixedGate: arg 'cacheRoot' expected string, got " + typeof cacheRoot);

  if (typeof cwd !== "string") throw new TypeError("runFixedGate: arg 'cwd' expected string, got " + typeof cwd);

  const controlsBytes = await Deno.readFile(controlsPath);
  const controlsHashBefore = await sha256(controlsBytes);
  ensure(controlsHashBefore === "0f20dba4713b93671b337fa1ba0a5cde00fdbe29bed195a00e3ae1c689473a5d", "pre-run controls hash differs from frozen bytes");
  const controlsDecoder = new TextDecoder("utf-8", { fatal: true });
  const controls = JSON.parse(controlsDecoder.decode(controlsBytes));
  const ids = ["K11", "K01", "K02", "K03", "K04", "K05", "K06", "K07", "K08", "K09", "K10a", "K10b", "K12"];
  const controlIds = ["K01", "K02", "K03", "K04", "K05", "K06", "K07", "K08", "K09", "K10a", "K10b", "K11", "K12"];
  ensure(controls.fullAuditControls.length === 13, "fixed control population must be 13");
  for (let index = 0; index < controlIds.length; index += 1) {
    ensure(controls.fullAuditControls[index]["id"] === controlIds[index], `fixed control order mismatch at ${index}`);
  }
  const parserPath = controls.parser.path;
  const parserHashBefore = await sha256(await Deno.readFile(parserPath));
  const gateParserBefore = { parser_path: parserPath, parser_sha256: parserHashBefore, controls_sha256: controlsHashBefore };
  await Deno.writeTextFile(resultPath(taskRoot, "whole-gate-parser-before.json"), JSON.stringify(gateParserBefore), { createNew: true });
  const cases = { value: [] };
  const sequence = { value: 0 };
  for (const id of ids) {
    const caseResult = await runCase(controls, id, sequence.value, deno, scannerJs, coreJs, walkerJs, parserPath, taskRoot, cacheRoot, cwd);
    cases.value = (all => {
      if (!Array.isArray(all)) throw new TypeError("anonymous: arg 'all' expected array, got " + typeof all);

      return [...all, caseResult];
    })(cases.value);
    sequence.value = (n => {
      if (typeof n !== "number" || Number.isNaN(n)) throw new TypeError("anonymous: arg 'n' expected number, got " + typeof n);

      return n + 1;
    })(sequence.value);
  }
  const parserHashAfter = await sha256(await Deno.readFile(parserPath));
  const controlsHashAfter = await sha256(await Deno.readFile(controlsPath));
  const gateParserAfter = { parser_path: parserPath, parser_sha256: parserHashAfter, controls_sha256: controlsHashAfter };
  await Deno.writeTextFile(resultPath(taskRoot, "whole-gate-parser-after.json"), JSON.stringify(gateParserAfter), { createNew: true });
  ensure(parserHashBefore === parserHashAfter, "whole-gate parser identity changed");
  ensure(controlsHashBefore === controlsHashAfter, "controls changed during fixed gate");
  const caseResults = cases.value;
  const passedCases = caseResults.filter(row => row.status === "pass");
  const results = { schema: "lykn-estree-capability-results-v1", controls_sha256: controlsHashBefore, source_commit: "8ed869f1ed24bf688ba91f71d8c539680136794e", source_tree: "74b980be159f8557c78d11b4546bf92498b7861e", compiler_sha256: "aa31947fd4bb0ae0024cf82380c8e076bc2b92ba4493fec4feade586058bfaf8", deno_sha256: await sha256(await Deno.readFile(deno)), parser_sha256: parserHashAfter, selected_rows: 13, completed: caseResults.length, passed: passedCases.length, cases: cases.value };
  await Deno.writeTextFile(resultPath(taskRoot, "capability-results.json"), JSON.stringify(results), { createNew: true });
  ensure(results.completed === 13, "fixed gate denominator mismatch");
  ensure(results.passed === 13, "fixed gate has failed rows");
  return console.log("fixed K01-K12 gate passed: 13/13");
}
if (Deno.args.length !== 8) {
  console.log(JSON.stringify({ status: "observer_usage_error", expectedArgs: 8, actualArgs: Deno.args.length }));
  Deno.exit(2);
} else {
  const argv = Deno.args;
  const controlsPath = absolutePath(argv[0]);
  const deno = absolutePath(argv[1]);
  const scannerJs = absolutePath(argv[2]);
  const coreJs = absolutePath(argv[3]);
  const walkerJs = absolutePath(argv[4]);
  const taskRoot = absolutePath(argv[5]);
  const cacheRoot = absolutePath(argv[6]);
  const cwd = absolutePath(argv[7]);
  const controlsBytes = await Deno.readFile(controlsPath);
  const controlsHash = await sha256(controlsBytes);
  ensure(controlsHash === "0f20dba4713b93671b337fa1ba0a5cde00fdbe29bed195a00e3ae1c689473a5d", "fixed controls bytes differ from the frozen Slice12 copy");
  const controlsDecoder = new TextDecoder("utf-8", { fatal: true });
  const controls = JSON.parse(controlsDecoder.decode(controlsBytes));
  const controlIds = ["K01", "K02", "K03", "K04", "K05", "K06", "K07", "K08", "K09", "K10a", "K10b", "K11", "K12"];
  ensure(controls.fullAuditControls.length === 13, "fixed control population must be 13");
  for (let index = 0; index < controlIds.length; index += 1) {
    ensure(controls.fullAuditControls[index]["id"] === controlIds[index], `fixed control order mismatch at ${index}`);
  }
  await Deno.mkdir(taskRoot);
  await Deno.mkdir(cacheRoot);
  const seedDir = resultPath(taskRoot, "seed");
  await Deno.mkdir(seedDir);
  const seedPath = resultPath(seedDir, "K01.js");
  const k01 = control(controls, "K01");
  await Deno.writeFile(seedPath, new TextEncoder().encode(k01.input), { createNew: true });
  await runFixedGate(controlsPath, deno, scannerJs, coreJs, walkerJs, taskRoot, cacheRoot, cwd);
}
