var marked = require('marked');
var hljs = require('highlight.js');

// Options is copyed from example code
var options = {
  gfm: true,
  highlight: function (code, lang) {
    var result;

    try {
      result = hljs.highlight(lang, code).value;
    } catch (error) {
      result = hljs.highlightAuto(code).value;
    }

    return result;
  },
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  langPrefix: 'lang-'
};

exports.compile = function (content, callback) {
  marked(content, options, function (error, compiled) {
    callback(error, compiled);
  });
};