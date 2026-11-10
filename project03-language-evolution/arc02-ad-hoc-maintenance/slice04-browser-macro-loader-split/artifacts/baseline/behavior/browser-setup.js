globalThis["splitTrace"] = [];
globalThis["fetch"] = url => {
  globalThis.splitTrace.push("fetch");
  return Promise.resolve(new Response("(const value 19) (splitTrace:push value) value"));
};
