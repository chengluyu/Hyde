var path = require('path');
var data = require(path.join(__dirname, 'data'));

var index = function (req, res){
  res.render('index', { title: 'Express' });
};

var post = function (req, res) {

};

var archives = function (req, res) {

};

var categories = function (req, res) {

};

var tags = function (req, res) {

};

exports.deploy = function (router) {
  router.get('/', index);
  router.get('/post/[post_name]', post);
  router.get('/archives', archives);
  router.get('/categories', categories);
  router.get('/tags', tags);
};
