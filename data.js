var fs = require('fs'),
  markdown = require('markdown-js'),
  untitled_counter = 1;

Array.prototype.each = function (callback) {
  for (var k = 0; k < this.length; ++k)
    callback(this[k]);
};

var scanner = function (file_name, encoding) {
  this.content = fs.readFileSync(file_name, encoding || 'utf8'),
  this.at = 0;
};

scanner.prototype = {
  eof: function () {
    return this.at >= this.content.length;
  },
  scan_line: function () {
    return this.scan_until('\n');
  },
  scan_until: function (str) {
    if (this.eof())
      return '';
    var pos = this.content.indexOf(str, this.at), sub;
    if (pos === -1)
      pos = this.content.length;
    sub = this.content.substring(this.at, pos);
    this.at = pos + str.length;
    return sub;
  },
  scan_all: function () {
    return this.content.substring(this.at);
  }
};

var post = function (file_name, encoding) {
  var scan = new scanner(file_name, encoding);
  var line, match_result, info = {};

  while ((line = scan.scan_line()) != false) {
    if (line.length === 1) console.log(line.charCodeAt(0));
    match_result = line.match(/([\w]+)\:\s*(.+)/);
    if (match_result === null) {
      continue;
    } else {
      info[match_result[1].toLowerCase()] = match_result[2];
    }
  }

  var preview_text = scan.scan_until('{{more}}');

  this.title = info['title'] || 'Untitled Post ' + untitled_counter.toString();
  this.category = info['category'] ? info['category'].split(',') : ['Uncategorized'];
  this.tag = info['tag'] ? info['tag'].split(',') : ['Untagged'];
  this.date_obj = info['date'] ? new Date(info['date']) : new Date;
  this.date = this.date_obj.toLocaleDateString()
  this.time = this.date_obj.toLocaleTimeString();
  this.summary = info['summary'] || preview_text.substring(0, 100) + '...';
  if (info['path']) {
    this.path = info['path'];
  } else if (info['title']) {
    this.path = info['title'].replace(/[^\w_-]+/g, '-');
  } else {
    var pos1 = file_name.lastIndexOf('\\'), pos2 = file_name.lastIndexOf('/');
    var pos = pos1 > pos2 ? pos1 : pos2;
    pos = pos === -1 ? pos : 0;
    this.path = file_name.substring(pos);
  }
  this.path = this.path.toLowerCase();

  this.preview = markdown.encode(preview_text);
  this.content = markdown.encode(scan.scan_all());
};

var postList = function (folder) {
  var file_list = fs.readdirSync(folder), p;

  var list = [], path = {}, category = {}, tag = {};

  file_list.each(function (file_name) {
    if (file_name.lastIndexOf('.md') !== file_name.length - 3)
      return;
    p = new post(folder + file_name);
    list.push(p);
    path[p.path] = p;
    p.category.each(function (c) {
      if (!category[c])
        category[c] = [];
      category[c].push(p);
    });
    p.tag.each(function (t) {
      if (!tag[t])
        tag[t] = [];
      tag[t].push(p);
    })
  });

  this.list = list;
  this.path = path;
  this.category = category;
  this.tag = tag;
};

var all_post = new postList('./post/');
all_post.list.sort(function (a, b) {
  return a.date_obj < b.date_obj;
});

exports.index = function (req, res) {
  res.render('index', {  posts: all_post });
};

exports.archive = function (req, res) {
  res.render('archive', {  posts: all_post });
};

exports.category = function (req, res) {
  res.render('category', { posts: all_post });
};

exports.tag = function (req, res) {
  res.render('tag', { posts: all_post });
};

exports.about = function (req, res) {
  res.render('about');
};

exports.post = function (req, res) {
  var post = req.params['post'].toLowerCase();
  if (all_post.path[post]) {
    res.render('post', { article: all_post.path[post] });
  } else {
    res.render('404', { 'post': post });
  }
};