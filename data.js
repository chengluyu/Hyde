var fs = require('fs'),
    markdown = require('markdown-js');

var untitledCnt = 1, folder = './post/';

Array.prototype.each = function (callback) {
  for (var i = 0; i < this.length; i ++)
    callback(this[i]);
};

var scanner = function (filename, encode) {
  this.content = fs.readFileSync(folder + filename, encode || 'utf8'),
  this.at = 0;
};

scanner.prototype = {
  eof: function () {
    return this.at >= this.content.length;
  },
  scanLine: function () {
    return this.scanUntil('\n');
  },
  scanUntil: function (str) {
    if (this.eof())
      return '';
    var pos = this.content.indexOf(str, this.at), sub;
    if (pos === -1)
      pos = this.content.length;
    sub = this.content.substring(this.at, pos);
    this.at = pos + str.length;
    return sub;
  },
  scanAll: function () {
    return this.content.substring(this.at);
  }
};

var post = function (filename, encode) {
  var scan = new scanner(filename, encode);
  var line, matchResult, info = {};

  while ((line = scan.scanLine())) {
    if (line.length === 1) console.log(line.charCodeAt(0));
    matchResult = line.match(/([\w]+)\:\s*(.+)/);
    if (matchResult) 
      info[matchResult[1].toLowerCase()] = matchResult[2];
  }

  var preview = scan.scanUntil('{{more}}');

  if (info['title'])
    this.title = info['title'];
  else {
    this.title = 'Untitled Post' + untitledCnt;
    untitledCnt ++;
  }

  if (info['path'])
    this.path = info['path'];
  else if (info['title'])
    this.path = info['title'].replace(/[^\w_-]+/g, '-');
  else 
    this.path = 'files/' + filename;

  this.dateObj = info['date'] ? new Date(info['date']) : new Date;
  this.date = this.dateObj.toLocaleDateString()
  this.time = this.dateObj.toLocaleTimeString();
  this.category = info['category'] ? info['category'].split(',') : ['Uncategorized'];
  this.tag = info['tag'].split(',');
  this.summary = info['summary'];
  this.path = this.path.toLowerCase();
  this.preview = markdown.encode(preview);
  this.content = markdown.encode(scan.scanAll());
};

var postList = function () {
  var fileList = fs.readdirSync(folder);
  var list = [], path = {}, categories = {}, tags = {};

  fileList.each(function(filename){
    if (filename.lastIndexOf('.md') !== filename.length - 3) return;
    var p = new post(filename);
    list.push(p);
    path[p.path] = p;
    p.category.each(function(c){
      if (!categories[c])
        categories[c] = [];
      categories[c].push(p);
    });
    p.tag.each(function(t){
      if (!tags[t])
        tags[t] = [];
      tags[t].push(p);
    })
  });

  this.list = list;
  this.path = path;
  this.categories = categories;
  this.tags = tags;
};

var Posts = new postList();
Posts.list.sort(function(lhs, rhs){
  lhs.dateObj < rhs.dateObj;
});

exports.index = function (req, res) {
  res.render('index', {  posts: Posts });
};

exports.archives = function (req, res) {
  res.render('archives', {  posts: Posts });
};

exports.categories = function (req, res) {
  res.render('categories', { posts: Posts });
};

exports.tags = function (req, res) {
  res.render('tags', { posts: Posts });
};

exports.about = function (req, res) {
  res.render('about');
};

exports.post = function (req, res) {
  var post = req.params['post'].toLowerCase();
  if (Posts.path[post])
    res.render('post', { article: Posts.path[post] });
  else
    res.render('404');
};

exports.category = function (req, res) {
  var name = req.params['category'];
  if (Posts.categories[name])
    res.render('category', { articles: Posts.categories[name], title: name });
  else
    res.render('404');
};

exports.tag = function (req, res) {
  var name = req.params['tag'];
  if (Posts.tags[name])
    res.render('tag', { articles: Posts.tags[name], title: name });
  else
    res.render('404');
};