function choose(match) {
  return match(0, false ? 7 : 8);
}
const match = (target, value) => value;
console.log(JSON.stringify([match(0, true ? 7 : 8), choose(match)]));
