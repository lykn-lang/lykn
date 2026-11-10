async function measure(path) {
  if (typeof path !== "string") {
    throw new TypeError("measure: arg 'path' expected string, got " + typeof path);
  }
  const bytes = Deno.readFileSync(path);
  const raw = new Response(bytes);
  const compressed = new Response(raw.body.pipeThrough(new CompressionStream("gzip")));
  const gzipped = await compressed.arrayBuffer();
  return { path: path, bytes: bytes.byteLength, gzip: gzipped.byteLength };
}
for (const path of Deno.args) {
  console.log(JSON.stringify(await measure(path)));
}
