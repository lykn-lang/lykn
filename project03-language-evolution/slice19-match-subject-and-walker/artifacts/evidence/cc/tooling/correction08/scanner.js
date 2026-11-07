import {loadParser, verifyParser} from "./parser-core.js";
import {walkProgram} from "./estree-walker.js";
export {scanManifest};
function own(value, key) {
  if (typeof key !== "string") throw new TypeError("own: arg 'key' expected string, got " + typeof key);

  const result__gensym0 = !(value === null) && Object.hasOwn(value, key);
  if (typeof result__gensym0 !== "boolean") throw new TypeError("own: return value expected boolean, got " + typeof result__gensym0);

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
function emptyRow(row, status) {
  if (typeof status !== "string") throw new TypeError("emptyRow: arg 'status' expected string, got " + typeof status);

  return { source_id: row.source_id, source_sha256: row.source_sha256, emitter: row.emitter, mode: row.mode, condition_id: row.condition_id, source_path: row.path, output_path: row.output_path, segment: row.segment, required: row.required, status: status, manifest_source_sha256: row.source_sha256, observed_source_sha256: null, observed_output_sha256: null, ast_coverage: null, findings: [], reasons: [], dependency_edges: [], bare_imports: 0, error: null };
}
function errorRecord(error) {
  return { name: !(error === null) && typeof error.name === "string" ? error.name : null, message: !(error === null) && own(error, "message") ? error.message : null, pos: !(error === null) && own(error, "pos") ? error.pos : null, loc: !(error === null) && own(error, "loc") ? error.loc : null };
}
function readErrorStatus(error) {
  const result__gensym2 = error instanceof Deno.errors.NotFound ? "source_missing" : error instanceof Deno.errors.NotCapable ? "source_unreadable" : "unexpected";
  if (typeof result__gensym2 !== "string") throw new TypeError("readErrorStatus: return value expected string, got " + typeof result__gensym2);

  return result__gensym2;
}
async function scanRow(row, parser, options) {
  const result = { value: emptyRow(row, "not_processed") };
  const bytes = { value: null };
  try {
    bytes.value = await Deno.readFile(row.path);
  } catch (error) {
    const status = readErrorStatus(error);
    (() => {
      if (status === "unexpected") {
        throw error;
      } else {
        return result.value = { ...result.value, status: status, error: errorRecord(error) };
      }
    })();
  }
  if (!(bytes.value === null)) {
    const actualHash = await sha256(bytes.value);
    if (actualHash !== row.sha256) result.value = { ...result.value, status: "source_hash_mismatch", observed_source_sha256: actualHash, observed_output_sha256: actualHash, error: { expected: row.sha256, actual: actualHash } };
     else {
      result.value = { ...result.value, observed_source_sha256: actualHash, observed_output_sha256: actualHash };
      const source = { value: null };
      const decoder = new TextDecoder("utf-8", { fatal: true });
      try {
        source.value = decoder.decode(bytes.value);
      } catch (error) {
        result.value = { ...result.value, status: "source_unreadable", error: errorRecord(error) };
      }
      if (!(source.value === null)) {
        const parsed = { value: null };
        try {
          parsed.value = { program: parser.parse(source.value, options) };
        } catch (error) {
          (() => {
            if (error instanceof SyntaxError) {
              return result.value = { ...result.value, status: "parse_error", error: errorRecord(error) };
            } else {
              throw error;
            }
          })();
        }
        if (!(parsed.value === null)) {
          const program = parsed.value["program"];
          const walked = walkProgram(program);
          if (walked.coverage_status !== "complete") result.value = { ...result.value, status: "unsupported_ast", ast_coverage: "unsupported_ast", program: program, findings: walked.direct_statements, direct_count: walked.direct_count, reasons: walked.reasons, reason_count: walked.reason_count, dependency_edges: walked.dependency_edges, dependency_edge_count: walked.dependency_edge_count, bare_imports: walked.bare_imports, error: walked.unsupported_nodes };
           else result.value = { ...result.value, status: "complete_walk", ast_coverage: "complete", program: program, findings: walked.direct_statements, direct_count: walked.direct_count, reasons: walked.reasons, reason_count: walked.reason_count, dependency_edges: walked.dependency_edges, dependency_edge_count: walked.dependency_edge_count, bare_imports: walked.bare_imports };

        }
      }
    }
  }
  const finalResult = result.value;
  return finalResult.status === "complete_walk" ? finalResult : (() => {
    const {program: ___gensym3, ...rest__gensym4} = finalResult;
    return rest__gensym4;
  })();
}
function compoundKey(row) {
  const result__gensym5 = JSON.stringify([row.source_id, row.source_sha256, row.emitter, row.mode, row.condition_id]);
  if (typeof result__gensym5 !== "string") throw new TypeError("compoundKey: return value expected string, got " + typeof result__gensym5);

  return result__gensym5;
}
function validateManifest(manifest) {
  if (manifest.kind !== "file_scan") throw new Error("file manifest kind mismatch");

  if (!Array.isArray(manifest.rows)) throw new Error("file manifest rows must be an array");

  const keys = { value: [] };
  const sourceOutputs = { value: [] };
  for (const row of manifest.rows) {
    const absentRequiredKey = ["source_id", "source_sha256", "emitter", "mode", "condition_id", "path", "sha256", "output_path", "required"].some(field => {
      if (typeof field !== "string") throw new TypeError("anonymous: arg 'field' expected string, got " + typeof field);

      return !Object.hasOwn(row, field);
    });
    const expectedHashMissing = row.condition_id === "K10a";
    if ((((((((((absentRequiredKey || !(typeof row.source_id === "string")) || !(typeof row.emitter === "string")) || !(typeof row.mode === "string")) || !(typeof row.condition_id === "string")) || !(typeof row.path === "string")) || !(typeof row.output_path === "string")) || !row.path.startsWith("/")) || !row.output_path.startsWith("/")) || !(row.required === true || row.required === false)) || (expectedHashMissing ? !(row.source_sha256 === null) || !(row.sha256 === null) : !(typeof row.source_sha256 === "string") || !(typeof row.sha256 === "string"))) throw new Error("manifest row is incomplete or has invalid expected hashes");

    if (row.source_sha256 !== row.sha256) throw new Error("manifest source hash declarations disagree");

    if ((row.emitter !== "inert-js-control" || row.mode !== "module") || row.path !== row.output_path) throw new Error("bounded control row has unsupported route or unequal source/output paths");

    if (row.required === false && (!Object.hasOwn(row, "exclusion_reason") || !(typeof row.exclusion_reason === "string"))) throw new Error("non-required manifest row needs a frozen exclusion reason");

    const key = compoundKey(row);
    if (keys.value.includes(key)) throw new Error("duplicate condition key");

    keys.value = (all => {
      if (!Array.isArray(all)) throw new TypeError("anonymous: arg 'all' expected array, got " + typeof all);

      return [...all, key];
    })(keys.value);
    const sourceOutput = JSON.stringify([row.source_id, row.emitter, row.mode, row.condition_id, row.output_path]);
    if (sourceOutputs.value.includes(sourceOutput)) throw new Error("duplicate source/output mapping");

    sourceOutputs.value = (all => {
      if (!Array.isArray(all)) throw new TypeError("anonymous: arg 'all' expected array, got " + typeof all);

      return [...all, sourceOutput];
    })(sourceOutputs.value);
  }
  if ((((((manifest.parser.path !== "/Users/oubiwann/Library/Caches/deno/npm/registry.npmjs.org/acorn/8.17.0/dist/acorn.mjs" || manifest.parser.version !== "8.17.0") || manifest.parser.url !== "file:///Users/oubiwann/Library/Caches/deno/npm/registry.npmjs.org/acorn/8.17.0/dist/acorn.mjs") || manifest.parser.options.ecmaVersion !== "latest") || manifest.parser.options.sourceType !== "module") || manifest.parser.options.locations !== true) || manifest.parser.options.ranges !== true) throw new Error("parser identity or options differ from frozen contract");

}
function statusCounts(rows) {
  if (!Array.isArray(rows)) throw new TypeError("statusCounts: arg 'rows' expected array, got " + typeof rows);

  const counts = { value: { complete_walk: 0, source_missing: 0, source_unreadable: 0, source_hash_mismatch: 0, compile_failed: 0, output_missing: 0, output_hash_mismatch: 0, output_unreadable: 0, parse_error: 0, unsupported_ast: 0, not_processed: 0, excluded_named: 0 } };
  for (const row of rows) {
    const status = row.status;
    const bucket = (() => {
      const target__gensym6 = status;
      if (target__gensym6 === "complete_walk") {
        return "complete_walk";
      }
      if (target__gensym6 === "source_missing") {
        return "source_missing";
      }
      if (target__gensym6 === "source_unreadable") {
        return "source_unreadable";
      }
      if (target__gensym6 === "source_hash_mismatch") {
        return "source_hash_mismatch";
      }
      if (target__gensym6 === "compile_failed") {
        return "compile_failed";
      }
      if (target__gensym6 === "output_missing") {
        return "output_missing";
      }
      if (target__gensym6 === "output_hash_mismatch") {
        return "output_hash_mismatch";
      }
      if (target__gensym6 === "output_unreadable") {
        return "output_unreadable";
      }
      if (target__gensym6 === "parse_error") {
        return "parse_error";
      }
      if (target__gensym6 === "unsupported_ast") {
        return "unsupported_ast";
      }
      if (target__gensym6 === "not_processed") {
        return "not_processed";
      }
      if (target__gensym6 === "excluded_named") {
        return "excluded_named";
      }
      {
        return throw new Error(`unrecognized terminal row status ${status}`);
        ;
      }
    })();
    counts.value = assoc(express(counts), bucket, express(counts)[bucket] + 1);
  }
  return counts.value;
}
async function scanFileManifest(manifest) {
  validateManifest(manifest);
  const gate = { value: null };
  const gateError = { value: null };
  try {
    gate.value = await loadParser(manifest.parser.expected_sha256);
  } catch (error) {
    const readStatus = readErrorStatus(error);
    (() => {
      if (readStatus === "unexpected") {
        throw error;
      } else {
        return (() => {
          gateError.value = errorRecord(error);
          return gate.value = { status: readStatus === "source_missing" ? "parser_artifact_missing" : "parser_artifact_unreadable", actualHash: null, actualVersion: null };
        })();
      }
    })();
  }
  const rows = { value: [] };
  const loaded = gate.value;
  if (loaded.status !== "ready") for (const row of manifest.rows) {
    const status = row.required ? "not_processed" : "excluded_named";
    rows.value = (all => {
      if (!Array.isArray(all)) throw new TypeError("anonymous: arg 'all' expected array, got " + typeof all);

      return [...all, emptyRow(row, status)];
    })(rows.value);
  }
   else {
    for (const row of manifest.rows) {
      const observed = row.required ? await scanRow(row, loaded.parser, manifest.parser.options) : { ...emptyRow(row, "excluded_named"), error: row.exclusion_reason };
      rows.value = (all => {
        if (!Array.isArray(all)) throw new TypeError("anonymous: arg 'all' expected array, got " + typeof all);

        return [...all, observed];
      })(rows.value);
    }
    const after = await verifyParser(loaded.actualHash);
    if (!after.unchanged) {
      gate.value = { status: "parser_artifact_changed_after_use", actualHash: after.afterHash, actualVersion: loaded.actualVersion };
      gateError.value = { status: "after_use_hash_mismatch", actualHash: after.afterHash, expectedHash: loaded.actualHash };
    }
  }
  const values = rows.value;
  const counts = statusCounts(values);
  const filesParsed = counts.complete_walk + counts.unsupported_ast;
  const partitionTotal = counts.complete_walk + counts.source_missing + counts.source_unreadable + counts.source_hash_mismatch + counts.compile_failed + counts.output_missing + counts.output_hash_mismatch + counts.output_unreadable + counts.parse_error + counts.unsupported_ast + counts.not_processed + counts.excluded_named;
  if (partitionTotal !== values.length) throw new Error("terminal status partition does not match selected rows");

  const sourceKeys = { value: [] };
  for (const row of values) {
    const sourceKey = JSON.stringify([row.source_id, row.source_sha256]);
    if (!sourceKeys.value.includes(sourceKey)) sourceKeys.value = (all => {
      if (!Array.isArray(all)) throw new TypeError("anonymous: arg 'all' expected array, got " + typeof all);

      return [...all, sourceKey];
    })(sourceKeys.value);

  }
  const directTotal = values.map(row => own(row, "direct_count") ? row.direct_count : 0).reduce((total, next) => {
    if (typeof total !== "number" || Number.isNaN(total)) throw new TypeError("anonymous: arg 'total' expected number, got " + typeof total);

    if (typeof next !== "number" || Number.isNaN(next)) throw new TypeError("anonymous: arg 'next' expected number, got " + typeof next);

    return total + next;
  }, 0);
  const reasonTotal = values.map(row => own(row, "reason_count") ? row.reason_count : 0).reduce((total, next) => {
    if (typeof total !== "number" || Number.isNaN(total)) throw new TypeError("anonymous: arg 'total' expected number, got " + typeof total);

    if (typeof next !== "number" || Number.isNaN(next)) throw new TypeError("anonymous: arg 'next' expected number, got " + typeof next);

    return total + next;
  }, 0);
  const edgeTotal = values.map(row => own(row, "dependency_edge_count") ? row.dependency_edge_count : 0).reduce((total, next) => {
    if (typeof total !== "number" || Number.isNaN(total)) throw new TypeError("anonymous: arg 'total' expected number, got " + typeof total);

    if (typeof next !== "number" || Number.isNaN(next)) throw new TypeError("anonymous: arg 'next' expected number, got " + typeof next);

    return total + next;
  }, 0);
  const bareTotal = values.map(row => row.bare_imports).reduce((total, next) => {
    if (typeof total !== "number" || Number.isNaN(total)) throw new TypeError("anonymous: arg 'total' expected number, got " + typeof total);

    if (typeof next !== "number" || Number.isNaN(next)) throw new TypeError("anonymous: arg 'next' expected number, got " + typeof next);

    return total + next;
  }, 0);
  const requiredCount = { value: 0 };
  for (const row of manifest.rows) {
    if (row.required) requiredCount.value = (count => {
      if (typeof count !== "number" || Number.isNaN(count)) throw new TypeError("anonymous: arg 'count' expected number, got " + typeof count);

      return count + 1;
    })(requiredCount.value);

  }
  const requiredTotal = requiredCount.value;
  const loadedGate = gate.value;
  const complete = (loadedGate.status === "ready" && counts.complete_walk === requiredTotal) && counts.source_missing + counts.source_unreadable + counts.source_hash_mismatch + counts.compile_failed + counts.output_missing + counts.output_hash_mismatch + counts.output_unreadable + counts.parse_error + counts.unsupported_ast + counts.not_processed === 0;
  const parserGate = { status: (() => {
    const target__gensym7 = loadedGate.status;
    if (target__gensym7 === "ready") {
      return "passed";
    }
    if (target__gensym7 === "parser_artifact_missing") {
      return "missing";
    }
    if (target__gensym7 === "parser_artifact_unreadable") {
      return "not_processed";
    }
    if (target__gensym7 === "parser_artifact_identity_mismatch") {
      return "identity_mismatch";
    }
    if (target__gensym7 === "parser_artifact_version_mismatch") {
      return "identity_mismatch";
    }
    {
      return "not_processed";
    }
  })(), path: manifest.parser.path, version: loadedGate.actualVersion, expected_sha256: manifest.parser.expected_sha256, actual_sha256: loadedGate.actualHash, options: manifest.parser.options, error: gateError.value };
  return { schema: "lykn-estree-capability-report-v1", run_id: manifest.run_id, run_kind: "file_scan", created_at: manifest.created_at, source_commit: manifest.source_commit, source_tree: manifest.source_tree, source_clean: manifest.source_clean, compiler: manifest.compiler, deno: manifest.deno, parser_gate: parserGate, selected_sources: sourceKeys.value["length"], selected_condition_rows: values["length"], required_condition_rows: requiredTotal, complete_walk: counts.complete_walk, source_missing: counts.source_missing, source_unreadable: counts.source_unreadable, source_hash_mismatch: counts.source_hash_mismatch, compile_failed: counts.compile_failed, output_missing: counts.output_missing, output_hash_mismatch: counts.output_hash_mismatch, output_unreadable: counts.output_unreadable, parse_error: counts.parse_error, unsupported_ast: counts.unsupported_ast, not_processed: counts.not_processed, excluded_named: counts.excluded_named, files_parsed: filesParsed, files_completely_walked: counts.complete_walk, direct_statements_with_findings: directTotal, nested_reasons: reasonTotal, dependency_edges: edgeTotal, bare_imports: bareTotal, rows: values, status: complete ? directTotal + reasonTotal + edgeTotal > 0 ? "complete_with_findings" : "complete_no_findings" : "incomplete", exit: complete ? 0 : 2 };
}
function scanSynthetic(manifest) {
  if (manifest.kind !== "synthetic_unit" || manifest.control_id !== "K12") throw new Error("synthetic manifest must be frozen K12");

  const walked = walkProgram({ type: "Program", body: [manifest.injected_ast] });
  const error = walked.unsupported_nodes[0];
  return { schema: "lykn-estree-capability-report-v1", run_id: manifest.run_id, run_kind: "synthetic_unit", created_at: manifest.created_at, parser_gate: { status: "not_applicable", path: null, version: null, expected_sha256: null, actual_sha256: null, options: null, error: null }, selected_sources: null, selected_condition_rows: null, required_condition_rows: null, complete_walk: null, source_missing: null, source_unreadable: null, source_hash_mismatch: null, compile_failed: null, output_missing: null, output_hash_mismatch: null, output_unreadable: null, parse_error: null, unsupported_ast: null, not_processed: null, excluded_named: null, files_parsed: null, files_completely_walked: null, direct_statements_with_findings: null, nested_reasons: null, dependency_edges: null, bare_imports: null, status: "incomplete", exit: 2, rows: [], unit: { control_id: "K12", status: error.status, nodeType: error.nodeType, path: error.path, loc: error.loc, range: error.range } };
}
async function scanManifest(manifestPath) {
  if (typeof manifestPath !== "string") throw new TypeError("scanManifest: arg 'manifestPath' expected string, got " + typeof manifestPath);

  if (!manifestPath.startsWith("/")) throw new Error("manifest path must be absolute");

  const manifest = JSON.parse(await Deno.readTextFile(manifestPath));
  const report = await (async () => {
    const target__gensym8 = manifest.kind;
    if (target__gensym8 === "file_scan") {
      return await scanFileManifest(manifest);
    }
    if (target__gensym8 === "synthetic_unit") {
      return scanSynthetic(manifest);
    }
    {
      return throw new Error("manifest kind must be file_scan or synthetic_unit");
      ;
    }
  })();
  console.log(JSON.stringify(report));
  if (report.exit !== 0) Deno.exit(2);

}
if (Deno.args.length !== 1) {
  console.log(JSON.stringify({ status: "scanner_usage_error", expectedArgs: 1, actualArgs: Deno.args.length }));
  Deno.exit(2);
} else await scanManifest(Deno.args[0]);

