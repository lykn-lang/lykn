const payload = {
  key: 5,
  if: true ? 7 : 8,
  [true ? "dynamic" : "other"]: false ? 0 : 9,
  ...{
    extra: 6
  }
};
const assigned = payload["key"] = false ? 10 : 11;
console.log(JSON.stringify([assigned, payload["key"], payload["if"], payload["dynamic"], payload["extra"]]));
