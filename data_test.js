// test unit of data.js
var data = require('./data.js');
var util = require('util');

data.update();

console.log(util.inspect(data, { showHidden: true, depth: 3 }));