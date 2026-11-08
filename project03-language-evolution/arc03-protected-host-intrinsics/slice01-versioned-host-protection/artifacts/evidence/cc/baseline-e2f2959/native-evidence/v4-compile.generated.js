const action = n => {
  if (typeof n !== "number" || Number.isNaN(n)) throw new TypeError("anonymous: arg 'n' expected number, got " + typeof n);

  return n + 1;
};
action.call = n => {
  if (typeof n !== "number" || Number.isNaN(n)) throw new TypeError("anonymous: arg 'n' expected number, got " + typeof n);

  return 99;
};
console.log(JSON.stringify(action.call(1)));
