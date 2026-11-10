const trace = [];
function choose() {
  const nested = () => {
    return "nested";
    return "wrong-inner";
  };
  trace.push(nested());
  {
    if (true) {
      {
        return "inside";
        return "wrong";
      }
    } else {
      {
        trace.push("wrong-else");
        return "not-chosen";
      }
    }
  }
}
console.log(JSON.stringify([choose(), trace]));
