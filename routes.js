var fs = require('fs');
var path = require('path');
var data = require(path.join(__dirname, 'data'));
var config = require(path.join(__dirname, 'config.js'));
var markdown = require(path.join(__dirname, 'markdown'))

// sort archives in order to make the lastest post frontier
data.archives.sort(function (lhs, rhs) {
  return lhs.last_time > rhs.last_time;
});

var index = function (req, res){
  res.render('index', { data: data.archives });
};

var post = function (req, res) {
  var post_info = data.path[req.params['abbr_path']];

  if (post_info) {
    fs.readFile(post_info.file_path, 'utf8', function () {

    });
  } else {
    res.status(404);
    res.render('404', { data: data.page_not_found })
  }
};

var archives = function (req, res) {
  res.render('archives', { data: data.archives });
};

var categories = function (req, res) {
  res.render('categories', { data: data.categories });
};

var tags = function (req, res) {
  res.render('tags', { data: data.tags });
};

var about = function (req, res) {
  res.render('about', { data: data.about });
};

exports.deploy = function (router) {
  router.locals.language = config.language;

  router.locals(config.global);

  router.get('/', index);
  router.get('/post/:abbr_path', post);
  router.get('/archives', archives);
  router.get('/categories', categories);
  router.get('/tags', tags);
  router.get('/about', about);
};
