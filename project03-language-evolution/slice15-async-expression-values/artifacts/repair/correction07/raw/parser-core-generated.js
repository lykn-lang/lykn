export {loadParser, verifyParser};
const parserPath = "/Users/oubiwann/Library/Caches/deno/npm/registry.npmjs.org/acorn/8.17.0/dist/acorn.mjs";
const parserUrl = "file:///Users/oubiwann/Library/Caches/deno/npm/registry.npmjs.org/acorn/8.17.0/dist/acorn.mjs";
const parserVersion = "8.17.0";
async function sha256(bytes) {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  const result__gensym0 = Array.from(digest, byte => {
    if (typeof byte !== "number" || Number.isNaN(byte)) throw new TypeError("anonymous: arg 'byte' expected number, got " + typeof byte);

    return byte.toString(16).padStart(2, "0");
  }).join("");
  if (typeof result__gensym0 !== "string") throw new TypeError("sha256: return value expected string, got " + typeof result__gensym0);

  return result__gensym0;
}
async function loadParser(expectedHash) {
  if (typeof expectedHash !== "string") throw new TypeError("loadParser: arg 'expectedHash' expected string, got " + typeof expectedHash);

  const parserBytes = await Deno.readFile(parserPath);
  const actualHash = await sha256(parserBytes);
  return actualHash !== expectedHash ? { status: "parser_artifact_identity_mismatch", actualHash: actualHash, expectedHash: expectedHash } : (value_box__gensym1 => value_box__gensym1[0])(await (async () => {
    const parser = await import(parserUrl);
    return [parser.version !== parserVersion ? { status: "parser_artifact_version_mismatch", actualHash: actualHash, actualVersion: parser.version } : { status: "ready", actualHash: actualHash, actualVersion: parser.version, parser: parser }];
    return [undefined];
  })());
}
async function verifyParser(priorHash) {
  if (typeof priorHash !== "string") throw new TypeError("verifyParser: arg 'priorHash' expected string, got " + typeof priorHash);

  const parserBytes = await Deno.readFile(parserPath);
  const afterHash = await sha256(parserBytes);
  return { afterHash: afterHash, unchanged: afterHash === priorHash };
}
