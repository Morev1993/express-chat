var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var HttpError = require('error').HttpError;
var config = require('config');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('libs/mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  resave: true,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));


app.use(require('middleware/sendHttpError'));
app.use(require('middleware/loadUser'));
app.use(require('middleware/setUrl'));

app.use('/', routes);

// error handlers

// development error handler
// will print stacktrace

app.use(function(req, res, next) {
  next(404);
});

app.use(function(err, req, res, next) {
  if (typeof err == 'number') {
    err = new HttpError(err);
  }

  if (err instanceof HttpError) {
    console.log('send my error');

    res.sendHttpError(err);
  } else {
    if (app.get('env') === 'development') {
      console.log('dev processing');
      errorhandler()(err, req, res, next);
    } else {
      console.log('prod processing');
      console.log(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
});



module.exports = app;
