const value = "\r";
console.log(JSON.stringify({ plain: value, interpolated: `${value}`, concat: ``, icu: `` }));
