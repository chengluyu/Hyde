var argv = process.argv;
var fs = require('fs');
var path = require('path');
var post_opt_handler = require(path.join(__dirname, 'opts')).handler;


// add handlers for argv here
var argv_handler = {
  'serve': function () {
    require(path.join(__dirname, 'hyde', 'app.js'));
  },

  'generate': function () {
    console.log('Unimplement function.');
  },

  'post': function () {
    post_opt_handler(argv);
  },

  'help': function () {
    var help_content = fs.readFileSync(path.join(__dirname, 'data', 'Help'), 'utf8');
    console.log(help_content);
  }
};



if (typeof argv[2] === 'string' &&
    typeof argv_handler[argv[2]] === 'function') {
  argv_handler[argv[2]]();
} else {
  argv_handler['help']();
}