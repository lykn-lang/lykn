const value = "\n";
console.log(JSON.stringify({ plain: value, interpolated: `${value}`, concat: `
`, icu: `
` }));
