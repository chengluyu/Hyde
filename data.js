var fs = require('fs');
var path = require('path');
var utility = require(path.join(__dirname, 'utility'));
var config = require(path.join(__dirname, 'config.js'));

// add a post to specified category
// if the category doesn't exist, then add one
var add_post_to_category = function (post_info) {
  for (var i = 0; i < post_info.categories.length; ++i) {
    var category_name = post_info.categories[i];

    if (typeof exports.categories[category_name] === 'undefined')
      exports.categories[category_name] = [ ];

    exports.categories[category_name].push(post_info);
  }
};

// same as 'add_post_to_category' but add to a specified tag
var add_post_to_tag = function (post_info) {
  for (var i = 0; i < post_info.tags.length; ++i) {
    var tag_name = post_info.tags[i];

    if (typeof exports.tags[tag_name] === 'undefined')
      exports.tags[tag_name] = [ ];

    exports.tags[tag_name].push(post_info);
  }
};

// add them to 'exports' so it can be accessed by 'require' function
exports.archives = [ ];
exports.categories = { };
exports.tags = { };
exports.path = { };

// use 'update' function to generate data
// attention, this is a sync function, it may take a long time
var update = function () {

  // post directory
  var posts = fs.readdirSync(path.join(__dirname, 'posts'));
  // default personal configuration
  var default_config = config.post;

  for (var i = 0; i < posts.length; ++i) {
    var file_name = posts[i];

    // find a markdown file, then read its configurations
    if (path.extname(file_name) === '.md') {
      var info_file_path = path.join(__dirname, 'posts', path.basename(file_name, '.md') + '.json');
      var file_info = JSON.parse(fs.readFileSync(info_file_path, 'utf8'));

      // set unset properties of 'file_info' to default
      utility.merge_object(default_config, file_info);

      // drafts
      if (typeof file_info['drafts'] === 'boolean' && file_info['drafts'])
        continue;

      file_info.file_path = path.join(__dirname, file_name);

      // last modified time
      if (file_info.versions.length === 0)
        file_info.last_time = new Date;
      else
        file_info.last_time = new Date(file_info.versions[0].date_time);

      file_info.last_date_str = file_info.last_time.toLocaleDateString();
      file_info.last_time_str = file_info.last_time.toLocaleTimeString();

      exports.archives.push(file_info);
      add_post_to_category(file_info);
      add_post_to_tag(file_info);
      exports.path[file_info.abbr_path] = file_info;
    }
  }
  exports.about = fs.readFileSync(path.join(__dirname, 'config',
      config.global.about.file_path));
  exports.page_not_found = fs.readFileSync(path.join(__dirname, 'config',
      config.global.page_not_found.file_path));
};





// I bet you can't see this line
update();