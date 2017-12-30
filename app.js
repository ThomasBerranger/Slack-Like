var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var methodOverride = require('method-override');
var expressSession = require('express-session');

var User = require('./models/user');
var Post = require('./models/post');

var index = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth/auth');
var blog = require('./routes/blog');

var app = express();

/*  @NOTE
 *  DeprecationWarning: `open()` is deprecated in mongoose >= 4.11.0, use
 *  `openUri()` instead, or set the `useMongoClient` option if using
 *  `connect()` or `createConnection()`.
 */
mongoose.Promise = global.Promise;
let database = mongoose.connect('mongodb://localhost/slack-like', {
    useMongoClient: true,
    socketTimeoutMS: 0,
    keepAlive: true,
    reconnectTries: 30
});

database.then(function (db) {
    console.log('DB : Ready to work !');
});

//- Method override
app.use(methodOverride('_method'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(expressSession({ secret : 'MyS3cr3tW0rd!:o' }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done){
  done(null, user._id);
});
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/auth', auth);
app.use('/blog', blog);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
