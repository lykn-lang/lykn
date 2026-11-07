function ensure(condition, message) {
  if (typeof condition !== "boolean") throw new TypeError("ensure: arg 'condition' expected boolean, got " + typeof condition);

  if (typeof message !== "string") throw new TypeError("ensure: arg 'message' expected string, got " + typeof message);

  if (!condition) throw new Error(message);

}
async function sha256(bytes) {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  const result__gensym0 = Array.from(digest, byte => {
    if (typeof byte !== "number" || Number.isNaN(byte)) throw new TypeError("anonymous: arg 'byte' expected number, got " + typeof byte);

    return byte.toString(16).padStart(2, "0");
  }).join("");
  if (typeof result__gensym0 !== "string") throw new TypeError("sha256: return value expected string, got " + typeof result__gensym0);

  return result__gensym0;
}
function absolutePath(path) {
  if (typeof path !== "string") throw new TypeError("absolutePath: arg 'path' expected string, got " + typeof path);

  if (!path.startsWith("/")) throw new Error("absolute-path: pre-condition failed: (path:startsWith \"/\") — caller blame");

  const result__gensym1 = path;
  if (typeof result__gensym1 !== "string") throw new TypeError("absolutePath: return value expected string, got " + typeof result__gensym1);

  return result__gensym1;
}
function isString(value) {
  const result__gensym2 = typeof value === "string";
  if (typeof result__gensym2 !== "boolean") throw new TypeError("isString: return value expected boolean, got " + typeof result__gensym2);

  return result__gensym2;
}
async function runObservation(row, deno, parserPath, probeJs, coreJs, taskRoot, cacheRoot, cwd) {
  if (typeof deno !== "string") throw new TypeError("runObservation: arg 'deno' expected string, got " + typeof deno);

  if (typeof parserPath !== "string") throw new TypeError("runObservation: arg 'parserPath' expected string, got " + typeof parserPath);

  if (typeof probeJs !== "string") throw new TypeError("runObservation: arg 'probeJs' expected string, got " + typeof probeJs);

  if (typeof coreJs !== "string") throw new TypeError("runObservation: arg 'coreJs' expected string, got " + typeof coreJs);

  if (typeof taskRoot !== "string") throw new TypeError("runObservation: arg 'taskRoot' expected string, got " + typeof taskRoot);

  if (typeof cacheRoot !== "string") throw new TypeError("runObservation: arg 'cacheRoot' expected string, got " + typeof cacheRoot);

  if (typeof cwd !== "string") throw new TypeError("runObservation: arg 'cwd' expected string, got " + typeof cwd);

  const controlId = row.id;
  const sequence = row.sequence;
  const caseDir = `${taskRoot}/${controlId}`;
  const denoDir = `${cacheRoot}/${controlId}`;
  await Deno.mkdir(caseDir);
  await Deno.mkdir(denoDir);
  const inputPath = `${caseDir}/input.js`;
  const hasInput = !(row.input === null);
  if (hasInput) await Deno.writeFile(inputPath, new TextEncoder().encode(row.input), { createNew: true });

  const parserBytes = await Deno.readFile(parserPath);
  const probeBytes = await Deno.readFile(probeJs);
  const coreBytes = await Deno.readFile(coreJs);
  const inputBytes = hasInput ? await Deno.readFile(inputPath) : new Uint8Array();
  const argv = hasInput ? [deno, "run", "--no-config", "--no-npm", "--no-remote", "--cached-only", "--deny-net", "--no-prompt", `--allow-read=${parserPath},${probeJs},${coreJs},${inputPath}`, probeJs, controlId, row.expectedHash, inputPath] : [deno, "run", "--no-config", "--no-npm", "--no-remote", "--cached-only", "--deny-net", "--no-prompt", `--allow-read=${parserPath},${probeJs},${coreJs}`, probeJs, controlId, row.expectedHash, "<no-input>"];
  const environment = { DENO_DIR: denoDir, DENO_NO_UPDATE_CHECK: "1", NO_COLOR: "1", PATH: "/opt/homebrew/bin:/usr/bin:/bin" };
  const attemptRecord = { id: controlId, sequence: sequence, argv: argv, cwd: cwd, environment: environment, parserPath: parserPath, parserSha256: await sha256(parserBytes), probePath: probeJs, probeSha256: await sha256(probeBytes), corePath: coreJs, coreSha256: await sha256(coreBytes), inputPath: hasInput ? inputPath : null, inputSha256: hasInput ? await sha256(inputBytes) : null, expectedHash: row.expectedHash, expectedExit: row.expectedExit, expectedStatus: row.expectedStatus };
  await Deno.writeTextFile(`${caseDir}/attempt.json`, JSON.stringify(attemptRecord), { createNew: true });
  const output = await new Deno.Command(deno, { args: Array.from(argv).slice(1), cwd: cwd, clearEnv: true, env: environment, stdin: "null", stdout: "piped", stderr: "piped" }).output();
  await Deno.writeFile(`${caseDir}/stdout.bin`, output.stdout, { createNew: true });
  await Deno.writeFile(`${caseDir}/stderr.bin`, output.stderr, { createNew: true });
  const commandRecord = { id: controlId, sequence: sequence, argv: argv, cwd: cwd, environment: environment, exit: output.code, signal: output.signal, stdoutBytes: output.stdout.length, stderrBytes: output.stderr.length };
  await Deno.writeTextFile(`${caseDir}/result.json`, JSON.stringify(commandRecord), { createNew: true });
  const stdoutText = new TextDecoder("utf-8", { fatal: true });
  const witnessCell = { value: null };
  try {
    witnessCell.value = JSON.parse(stdoutText.decode(output.stdout));
  } catch (error) {
    witnessCell.value = { observerJsonError: error.message };
  }
  const witness = witnessCell.value;
  await Deno.writeTextFile(`${caseDir}/witness.json`, JSON.stringify(witness), { createNew: true });
  ensure(output.code === row.expectedExit, `${controlId} exit expected ${row.expectedExit} got ${output.code}`);
  ensure(witness.status === row.expectedStatus, `${controlId} status expected ${row.expectedStatus} got ${witness.status}`);
  if (controlId === "K11") {
    ensure(witness.actualHash === "1cbcbf252a5800e496dc505c706f309a9dd4e1789392e12963c77ae9497ff6f7", "K11 selected artifact hash changed");
    ensure(!Object.hasOwn(witness, "program"), "K11 unexpectedly produced an AST");
  }
  if (controlId === "K01" || controlId === "K08") {
    ensure(witness.actualVersion === "8.17.0", `${controlId} version mismatch`);
    ensure(witness.afterHash === "1cbcbf252a5800e496dc505c706f309a9dd4e1789392e12963c77ae9497ff6f7", `${controlId} post-use parser hash changed`);
    ensure(witness.program.type === "Program", `${controlId} Program type mismatch`);
    ensure(witness.program.sourceType === "module", `${controlId} module mode mismatch`);
    ensure(witness.program.body.length === (controlId === "K01" ? 2 : 3), `${controlId} body count mismatch`);
    ensure(witness.program.range[0] === 0, `${controlId} Program range start mismatch`);
    ensure(witness.program.range[1] === (controlId === "K01" ? 66 : 67), `${controlId} Program range end mismatch`);
    ensure(witness.program.loc.end.line === (controlId === "K01" ? 5 : 4), `${controlId} Program end line mismatch`);
    ensure(witness.program.loc.end.column === 0, `${controlId} Program end column mismatch`);
    if (controlId === "K01") {
      const firstStatement = witness.program.body[0];
      const firstCall = firstStatement.body.body[0];
      const callExpression = firstCall.expression;
      ensure(callExpression.type === "CallExpression", "K01 deferred call node type mismatch");
      ensure(callExpression.loc.start.line === 2, "K01 call line mismatch");
      ensure(callExpression.loc.start.column === 2, "K01 call column mismatch");
      ensure(callExpression.range[0] === 20, "K01 call range start mismatch");
      ensure(callExpression.range[1] === 30, "K01 call range end mismatch");
    }
    if (controlId === "K08") {
      const thirdStatement = witness.program.body[2];
      const awaited = thirdStatement.expression;
      const nestedCall = awaited.argument;
      ensure(awaited.type === "AwaitExpression", "K08 top-level await missing");
      ensure(awaited.loc.start.line === 3, "K08 await line mismatch");
      ensure(awaited.loc.start.column === 0, "K08 await column mismatch");
      ensure(awaited.range[0] === 53, "K08 await range start mismatch");
      ensure(awaited.range[1] === 65, "K08 await range end mismatch");
      ensure(nestedCall.type === "CallExpression", "K08 nested call missing");
      ensure(nestedCall.loc.start.column === 6, "K08 call column mismatch");
      ensure(nestedCall.range[0] === 59, "K08 call range start mismatch");
      ensure(nestedCall.range[1] === 65, "K08 call range end mismatch");
    }
  }
  if (controlId === "K09") {
    ensure(witness.errorName === "SyntaxError", "K09 error was not SyntaxError");
    ensure(witness.pos === 14, "K09 parser pos mismatch");
    ensure(witness.line === 1, "K09 parser line mismatch");
    ensure(witness.column === 14, "K09 parser column mismatch");
    ensure(isString(witness.message), "K09 actual parser message missing");
    ensure(!Object.hasOwn(witness, "program"), "K09 unexpectedly produced an AST");
  }
  return console.log(`${controlId} pass; raw outcomes preserved`);
}
const argv = Deno.args;
ensure(argv.length === 8, "usage: offline-observer.lykn CONTROLS DENO PARSER PROBE CORE ROOT CACHE_ROOT CONFIG_FREE_CWD");
const controlsPath = absolutePath(argv[0]);
const deno = absolutePath(argv[1]);
const parserPath = absolutePath(argv[2]);
const probeJs = absolutePath(argv[3]);
const coreJs = absolutePath(argv[4]);
const taskRoot = absolutePath(argv[5]);
const cacheRoot = absolutePath(argv[6]);
const cwd = absolutePath(argv[7]);
const controls = JSON.parse(await Deno.readTextFile(controlsPath));
ensure(controls.observations.length === 4, "Phase A requires exactly four ordered observations");
const row0 = controls.observations[0];
const row1 = controls.observations[1];
const row2 = controls.observations[2];
const row3 = controls.observations[3];
ensure(row0.id === "K11", "K11 must be first");
ensure(row1.id === "K01", "K01 must be second");
ensure(row2.id === "K08", "K08 must be third");
ensure(row3.id === "K09", "K09 must be fourth");
await Deno.mkdir(taskRoot);
await Deno.mkdir(cacheRoot);
for (const row of controls.observations) {
  await runObservation(row, deno, controls.parser.path, probeJs, coreJs, taskRoot, cacheRoot, cwd);
}
console.log("Phase A parser prerequisite passed: 4/4 fixed observations");
