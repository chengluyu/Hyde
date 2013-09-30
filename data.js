var fs = require('fs');
var path = require('path');
var utility = require(path.join(__dirname, 'utility'));

// add them to 'exports' so it can be accessed by 'require' function
exports.archives = [];
exports.categories = [];
exports.tags = [];

var load_default_config = function () {
  var config_filename = path.join(__dirname, 'config', 'default');

  if (fs.existsSync(config_filename)) {
    return JSON.parse(fs.readFileSync(config_filename, 'utf8'));

  } else {

    return undefined;
  }
};

var make_pair = function (name, list) {
  return {
    'name': name,
    'list': obj
  };
};

// use 'update' function to generate data
// attention, this is a sync function, it may take a long time
exports.update = function () {

  // post directory
  var posts = fs.readdirSync(path.join(__dirname, 'posts'));
  // default personal configuration
  var default_config = load_default_config();

  for (var i = 0; i < posts.length; ++i) {
    var file_name = posts[i];

    // find a markdown file, then read its configurations
    if (path.extname(file_name) == '.md') {
      var info_file_name = path.basename(file_name, '.md') + '.json';
      var file_info = JSON.parse(fs.readFileSync(info_file_name, 'utf8'));

      // set unset properties of 'file_info' to default
      utility.merge_object(default_config, file_info);

      // drafts
      if (typeof file_info['drafts'] === 'boolean' && file_info['drafts'])
        continue;

      file_info.file_path = path.join(__dirname, '');

    }
  }

}