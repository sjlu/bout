var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('./lib/mongoose');
var flash = require('express-flash');
var session = require('express-session');
var config = require('./lib/config');
var RedisStore = require('connect-redis')(session);
var redis = require('./lib/redis');
var middlewares = require('./middlewares');
var config = require('./lib/config');
var urljoin = require('url-join');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
  secret: config.SESSION_SECRET,
  store: new RedisStore({
    client: redis
  }),
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use(middlewares.getUserFromAuth);
app.locals.asset = function(uri) {
  // if (config.ENV === 'production') {
  //   return urljoin(config.AWS_CF_URL, config.GITREV, uri);
  // }
  return uri;
}

app.use('/', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
app.use('/logout', require('./routes/logout'));
app.use('/connect', require('./routes/connect'));
app.use('/callbacks', require('./routes/callbacks'));
app.use('/api', require('./routes/api'));
app.use('/admin', require('./routes/admin'));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (config.ENV === 'development') {
  app.use(function(err, req, res, next) {
    console.error(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
