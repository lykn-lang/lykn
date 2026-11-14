const recurse = function array(n) {
  return n > 0 ? array(n - 1) : 7;
}
;
console.log(recurse(2));
