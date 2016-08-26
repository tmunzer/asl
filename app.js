var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//===============MONGODB=================
var mongoose = require('mongoose');
global.db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // Create your schemas and models here.
});
const mongodb = "mongo";
mongoose.connect('mongodb://'+mongodb+'/asl');





var app = express();


app.use('/bower_components',  express.static('./bower_components'));


var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());


app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var login = require('./routes/login');
app.use('/login', login);
var facebook = require('./routes/facebook');
app.use('/auth/facebook', facebook);
var google = require('./routes/google');
app.use('/auth/google', google);
var twitter = require('./routes/twitter');
app.use('/auth/twitter', twitter);
var linkedin = require('./routes/linkedin');
app.use('/auth/linkedin', linkedin);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
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
