var marked = require('marked');
var hljs = require('highlight.js');

var alias_hightlight_name = {
  'js': 'javascript',
  'md': 'markdown'
};

// Options is copyed from marked example code
marked.setOptions({
  gfm: true,
  highlight: function (code, lang) {
    var result;

    if (alias_hightlight_name[lang])
      lang = alias_hightlight_name[lang]

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
});

exports.compile = function (content) {
  return marked(content);
};