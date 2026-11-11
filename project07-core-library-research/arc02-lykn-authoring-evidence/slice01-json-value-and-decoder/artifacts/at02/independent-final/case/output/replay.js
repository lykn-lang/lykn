const root = "/private/tmp/lykn-at02-cdc-final.XeqVk0cQ";
const cli = `${root}/case/lykn`;
const fixtureEnv = { PATH: "/Users/oubiwann/.cargo/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin", TMPDIR: `${root}/tmp`, XDG_CACHE_HOME: `${root}/xdg`, npm_config_cache: `${root}/npm`, DENO_DIR: "/Users/oubiwann/Library/Caches/deno" };
function runCell(name, cwd, args) {
  if (typeof name !== "string") {
    throw new TypeError("runCell: arg 'name' expected string, got " + typeof name);
  }
  if (typeof cwd !== "string") {
    throw new TypeError("runCell: arg 'cwd' expected string, got " + typeof cwd);
  }
  if (!Array.isArray(args)) {
    throw new TypeError("runCell: arg 'args' expected array, got " + typeof args);
  }
  const dir = `${root}/logs/${name}`;
  Deno.mkdirSync(dir, { recursive: true });
  Deno.writeTextFileSync(`${dir}/launch.json`, JSON.stringify({ executable: cli, cwd: cwd, argv: args, clearEnv: true, env: fixtureEnv }, null, 2));
  const command = new Deno.Command(cli, { args: args, cwd: cwd, clearEnv: true, env: fixtureEnv, stdout: "piped", stderr: "piped" });
  const output = command.outputSync();
  Deno.writeFileSync(`${dir}/stdout.raw`, output.stdout);
  Deno.writeFileSync(`${dir}/stderr.raw`, output.stderr);
  Deno.writeTextFileSync(`${dir}/exit-status.txt`, `${output.code}
`);
  console.log(name, output.code);
  const result__gensym0 = output.code;
  if (typeof result__gensym0 !== "number" || Number.isNaN(result__gensym0)) {
    throw new TypeError("runCell: return value expected number, got " + typeof result__gensym0);
  }
  return result__gensym0;
}
function requireSuccess(code, cell) {
  if (typeof code !== "number" || Number.isNaN(code)) {
    throw new TypeError("requireSuccess: arg 'code' expected number, got " + typeof code);
  }
  if (typeof cell !== "string") {
    throw new TypeError("requireSuccess: arg 'cell' expected string, got " + typeof cell);
  }
  if (!(code === 0)) {
    throw new Error(`${cell} failed: ${code}`);
  }
}
const nativeCwd = `${root}/case`;
const publicCwd = `${root}/public`;
for (const name of ["decoder", "controls", "zero-field-control"]) {
  const source = `${name}.lykn`;
  runCell(`${name}-check`, nativeCwd, ["check", source]);
  runCell(`${name}-lint`, nativeCwd, ["lint", source]);
  for (const mode of ["default", "stripped"]) {
    const output = `target/${name}-${mode}.js`;
    const argv = mode === "stripped" ? ["compile", "--strip-assertions", source, "-o", output] : ["compile", source, "-o", output];
    const code = runCell(`${name}-compile-${mode}`, nativeCwd, argv);
    if (code === 0) {
      runCell(`${name}-run-${mode}`, nativeCwd, ["run", "--cached-only", "--no-prompt", output]);
    }
  }
  requireSuccess(runCell(`${name}-format1`, nativeCwd, ["fmt", source]), "format1");
  Deno.copyFileSync(`${root}/logs/${name}-format1/stdout.raw`, `${nativeCwd}/${name}-formatted.lykn`);
  requireSuccess(runCell(`${name}-format2`, nativeCwd, ["fmt", `${name}-formatted.lykn`]), "format2");
  Deno.copyFileSync(`${root}/logs/${name}-format2/stdout.raw`, `${nativeCwd}/${name}-formatted-again.lykn`);
  for (const mode of ["default", "stripped"]) {
    const output = `target/${name}-formatted-${mode}.js`;
    const argv = mode === "stripped" ? ["compile", "--strip-assertions", `${name}-formatted.lykn`, "-o", output] : ["compile", `${name}-formatted.lykn`, "-o", output];
    const code = runCell(`${name}-formatted-compile-${mode}`, nativeCwd, argv);
    if (code === 0) {
      runCell(`${name}-formatted-run-${mode}`, nativeCwd, ["run", "--cached-only", "--no-prompt", output]);
    }
  }
}
requireSuccess(runCell("public-driver-compile", publicCwd, ["compile", "compile-probe.lykn", "-o", "target/compile-probe.js"]), "driver compile");
for (const name of ["decoder", "controls", "zero-field-control"]) {
  for (const spelling of ["", "-formatted"]) {
    Deno.copyFileSync(`${nativeCwd}/${name}${spelling}.lykn`, `${publicCwd}/probe.lykn`);
    const cell = `${name}${spelling}-public-compile`;
    const code = runCell(cell, publicCwd, ["run", "--cached-only", "--frozen", "--no-prompt", "--allow-read=probe.lykn", "target/compile-probe.js"]);
    if (code === 0) {
      const generated = `target/${name}${spelling}-public.js`;
      Deno.copyFileSync(`${root}/logs/${cell}/stdout.raw`, `${publicCwd}/${generated}`);
      runCell(`${name}${spelling}-public-run`, publicCwd, ["run", "--cached-only", "--frozen", "--no-prompt", generated]);
    }
  }
}
