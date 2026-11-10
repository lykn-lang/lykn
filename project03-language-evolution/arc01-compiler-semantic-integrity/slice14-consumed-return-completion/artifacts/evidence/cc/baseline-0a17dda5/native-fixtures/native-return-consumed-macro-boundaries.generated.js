const trace = [];
function choose() {
  const nested = () => {
    return "nested";
    return "wrong-inner";
  };
  trace.push(nested());
  return true ? (() => {
    return inside;
    return wrong;
  })() : (() => {
    trace.push("wrong-else");
    return "not-chosen";
  })();
}
console.log(JSON.stringify([choose(), trace]));
