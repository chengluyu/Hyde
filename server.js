var express = require('express'),
    http = require('http'),
    path = require('path');

var data = require('./data'),
    config = require('./config.json');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 8000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.locals(config);

app.get('/', data.index);
app.get('/archives', data.archives);
app.get('/categories', data.categories);
app.get('/tags', data.tags);
app.get('/about', data.about);
app.get('/p/:post', data.post);
app.get('/c/:category', data.category);
app.get('/t/:tag', data.tag);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Hyde is listening on port " + app.get('port'));
});
