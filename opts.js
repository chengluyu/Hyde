var fs = require('fs');
var path = require('path');

handlers = {
  // usage:
  //    hyde post update [file_name (regular expression)]
  //    hyde post update all
  'update': function (args) {

  },
  // usage:
  //    hyde post delete [file_name (regular expression)]
  //    hyde post delete all
  'delete': function (args) {

  },
  // usage:
  //    hyde post info [file_name (regular expression)]
  //    hyde post info all
  'info': function () {

  },
  // usage: you know how to use
  'help': function () {
    var help_content = fs.readFileSync(path.join(__dirname, 'data', 'PostOptHelp'), 'utf8');
    console.log(help_content);
  }
};

exports.handler = function (argv) {
  var opt = argv[3];

  if (typeof opt === 'string' &&
      typeof handlers[opt] === 'function') {
    handlers[opt].apply(null, argv.slice(4));
  } else {
    handlers['help']();
  }
};

