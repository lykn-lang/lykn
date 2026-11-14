const apply = function apply(array) {
  return array(7);
}
;
console.log(apply(function identity(value) {
  return value;
}
));
