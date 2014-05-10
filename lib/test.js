var fs = require('fs');

module.exports = function() {
  console.log('test.js fs.readFileSync');
  fs.readFileSync(__dirname + '/../views/home.md');
};