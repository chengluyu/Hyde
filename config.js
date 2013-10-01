var fs = require('fs');
var path = require('path');

exports.post = (function () {
  var config_filename = path.join(__dirname, 'config', 'post.json');

  if (fs.existsSync(config_filename)) {
    return JSON.parse(fs.readFileSync(config_filename, 'utf8'));

  } else {

    return undefined;
  }
})();

exports.language = JSON.parse(fs.readFileSync(path.join(__dirname,
    'config', 'language.json'), 'utf8'));

exports.global = JSON.parse(fs.readFileSync(path.join(__dirname, 'config',
    'global.json'), 'utf8'));