const _ = require("lodash")

var object = { 'a': 1, 'b': '2', 'c': 3 };

var a = _.omit(object, ['a', 'c']);
console.log(a)