var argv = process.argv;
var fs = require('fs');
var path = require('path');

if (argv[2] === 'serve') {

  require(path.join(__dirname, 'app.js'));

} else if (argv[2] === 'generate') {

  console.log('Unimplement function.');

} else {

  var help_content = fs.readFileSync(path.join(__dirname, 'Help'), 'utf8');

  console.log(help_content);

}