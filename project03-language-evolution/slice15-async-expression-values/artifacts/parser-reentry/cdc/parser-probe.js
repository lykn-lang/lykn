import {loadParser, verifyParser} from "./parser-core.js";
const argv = Deno.args;
if (argv.length !== 3) {
  console.log(JSON.stringify({ status: "probe_usage_error", expectedArgs: 3, actualArgs: argv.length }));
  Deno.exit(2);
}
const controlId = argv[0];
const expectedHash = argv[1];
const inputPath = argv[2];
const parserCheck = await loadParser(expectedHash);
if (parserCheck.status !== "ready") {
  console.log(JSON.stringify(parserCheck));
  Deno.exit(2);
}
const inputText = await Deno.readTextFile(inputPath);
const parsed = { value: null };
try {
  parsed.value = { status: "parse_success", controlId: controlId, actualHash: parserCheck.actualHash, actualVersion: parserCheck.actualVersion, program: parserCheck.parser.parse(inputText, { ecmaVersion: "latest", sourceType: "module", locations: true, ranges: true }) };
} catch (error) {
  parsed.value = { status: "parse_error", controlId: controlId, actualHash: parserCheck.actualHash, actualVersion: parserCheck.actualVersion, errorName: error.name, message: error.message, pos: error.pos, line: error.loc.line, column: error.loc.column };
}
const afterCheck = await verifyParser(parserCheck.actualHash);
if (!afterCheck.unchanged) {
  console.log(JSON.stringify({ status: "parser_artifact_changed_after_use", beforeHash: parserCheck.actualHash, afterHash: afterCheck.afterHash }));
  Deno.exit(2);
}
const parsedResult = parsed.value;
console.log(JSON.stringify({ ...parsedResult, afterHash: afterCheck.afterHash }));
if (parsedResult.status === "parse_error") Deno.exit(2);

