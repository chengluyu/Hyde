
/**
 * Module dependencies.
 */

var express = require('express')
  , data = require('./data')
  , http = require('http')
  , path = require('path')
  , config = require('./config.json');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
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
app.get('/archive', data.archive);
app.get('/category', data.category);
app.get('/tag', data.tag);
app.get('/about', data.about);
app.get('/p/:post', data.post);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
