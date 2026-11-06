function ensure(condition, message) {
  if (typeof condition !== "boolean") throw new TypeError("ensure: arg 'condition' expected boolean, got " + typeof condition);

  if (typeof message !== "string") throw new TypeError("ensure: arg 'message' expected string, got " + typeof message);

  if (!condition) throw new Error(message);

}
async function checkFile(path, label) {
  if (typeof path !== "string") throw new TypeError("checkFile: arg 'path' expected string, got " + typeof path);

  if (typeof label !== "string") throw new TypeError("checkFile: arg 'label' expected string, got " + typeof label);

  const info = await Deno.stat(path);
  return ensure(info.isFile, `not a regular file: ${label} ${path}`);
}
async function sha256(bytes) {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  return Array.from(digest, byte => {
    if (typeof byte !== "number" || Number.isNaN(byte)) throw new TypeError("anonymous: arg 'byte' expected number, got " + typeof byte);

    return byte.toString(16).padStart(2, "0");
  }).join("");
}
async function runCheck(workspace) {
  if (typeof workspace !== "string") throw new TypeError("runCheck: arg 'workspace' expected string, got " + typeof workspace);

  const jsonPairs = [[".", "./mod.js"], ["./document", "./document.js"], ["./file", "./file.js"], ["./value", "./value.js"]];
  const yamlPairs = [[".", "./mod.js"], ["./value", "./value.js"]];
  const effectsPairs = [[".", "./mod.js"], ["./dead", "./dead.js"], ["./used", "./used.js"]];
  const packages = [["json", jsonPairs], ["yaml", yamlPairs], ["effects", effectsPairs]];
  const count = { value: 0 };
  for (const packageRow of packages) {
    const pkg = packageRow[0];
    const pairs = packageRow[1];
    for (const area of ["lib", "target/lykn/dist"]) {
      const configPath = `${workspace}/${area}/${pkg}/deno.json`;
      const config = JSON.parse(await Deno.readTextFile(configPath));
      ensure(Object.hasOwn(config, "exports"), `missing exports: ${pkg} ${area}`);
      const actual = config["exports"];
      ensure(!(actual === null) && !Array.isArray(actual), `exports is not an object: ${pkg} ${area}`);
      const actualKeys = Object.keys(actual);
      ensure(actualKeys.length === pairs.length, `export map mismatch: ${pkg} ${area} key-count`);
      if (area === "lib") console.log(`export-map package=${pkg} keys=${pairs.length} matches-prior-exact-map=True`);

      for (const pair of pairs) {
        const key = pair[0];
        const target = pair[1];
        ensure(Object.hasOwn(actual, key), `export map mismatch: ${pkg} ${area} missing ${key}`);
        ensure(actual[key] === target, `export map mismatch: ${pkg} ${area} wrong target for ${key}`);
        const relative = `${pkg}/${target.slice(2)}`;
        if (area === "target/lykn/dist") await checkFile(`${workspace}/${area}/${relative}`, `${pkg} ${key} -> ${relative}`);

        if (area === "lib") console.log(`  ${key} -> ${target}`);

        if (area === "target/lykn/dist") count.value = (current => {
          if (typeof current !== "number" || Number.isNaN(current)) throw new TypeError("anonymous: arg 'current' expected number, got " + typeof current);

          return current + 1;
        })(count.value);

      }
    }
  }
  ensure(count.value === 9, `expected9 exports, got ${count.value}`);
  console.log(`total-library-public-keys=${count.value}`);
  const files = ["json/deno.json", "json/mod.js", "json/value.js", "json/file.js", "json/document.js", "yaml/deno.json", "yaml/mod.js", "yaml/value.js", "effects/deno.json", "effects/mod.js", "effects/used.js", "effects/dead.js", "effects/effect.js"];
  ensure(files.length === 13, `expected13 public files, got ${files.length}`);
  const rows = { value: [] };
  for (const relative of files) {
    const path = `${workspace}/target/lykn/dist/${relative}`;
    await checkFile(path, "public file");
    const digest = await sha256(await Deno.readFile(path));
    rows.value = (current => {
      if (!Array.isArray(current)) throw new TypeError("anonymous: arg 'current' expected array, got " + typeof current);

      return [...current, `${digest}  target/lykn/dist/${relative}`];
    })(rows.value);
  }
  console.log("public-file-sha256-begin");
  for (const row of rows.value) {
    console.log(row);
  }
  return console.log("public-file-sha256-end");
}
const workspace = Deno.args[0];
ensure(!(workspace === undefined), "usage: public-check.lykn WORKSPACE");
await runCheck(workspace);
